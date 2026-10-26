#!/usr/bin/env python3
# =============================================================================
# extract-series.py — Japan Clarity Chapter 03 (Housing & Cost of Living)
# Deterministic, anchor-validated extraction from archived raw sources.
#
# Sources (archived 2026-10-26, see notes/statb-housing-summary.md,
# notes/statb-fies-cpi-summary.md, notes/oecd-mlit-summary.md):
#   raw/statb-housing/estat_2023_timeseries_table{1-1,4,9-1,13,14-1}.xlsx
#   raw/statb-housing/jyutaku2023_kihon_gaiyou.txt (付表 prefectures)
#   raw/statb-fies/estat_2025np_{t1-1,t1-2,t3-7,solo_t1,solo_t8}_fk4.xlsx
#   raw/statb-fies/estat_longtime_t2-{two,kinrou}_fk4.xlsx
#   raw/statb-fies/kakei_2025np_summary.txt (headline cross-checks)
#   raw/statb-cpi/estat_2025base_lt_chubun_{index,yoy}.utf8.csv
#   raw/statb-cpi/estat_2025base_lt_hinmoku_yoy.utf8.csv
#   raw/statb-cpi/cpi_2025-nen-avg_zen-n.txt, cpi_2026-09_zenkoku.txt
#   raw/oecd/oecd-hpi-ydh-ptoincome-idx2015.csv, oecd-rhp-realhouseprice-idx2015.csv
#   raw/mlit/mlit-timeseries-annual-byusage.xls, mlit-kojichika2026-*.xls
#
# Chapter-01 audit lesson (cross-table contamination): every value is located
# by (sheet, table-title anchor, row-label anchor, column header anchor) —
# never by year + plausible range. Duplicate year keys are hard errors.
# Expected anchor values below were read verbatim in the research notes and
# are re-asserted here; any mismatch aborts the run (exit 1).
# =============================================================================
import csv
import hashlib
import json
import re
import sys
from datetime import date
from pathlib import Path

import openpyxl
import xlrd

ROOT = Path(__file__).resolve().parents[3]  # repo root
RAW = ROOT / "research/chapter03/raw"
OUT = ROOT / "research/chapter03/notes/extracted-series.json"
ACCESS_DATE = "2026-10-26"

errors = []
checks = 0


def ok(name, cond, detail=""):
    global checks
    checks += 1
    if not cond:
        errors.append(f"{name}{' — ' + detail if detail else ''}")


def sha16(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def find_label_row(ws, label, row_range, label_cols):
    """Return the first row in row_range whose label_cols contain exactly
    the label (whitespace-normalised). Exactly one match is required."""
    hits = []
    for r in row_range:
        for c in label_cols:
            v = ws.cell(row=r, column=c).value
            if isinstance(v, str) and v.strip() == label:
                hits.append((r, c))
                break
    if len(hits) != 1:
        raise AssertionError(f"label '{label}' matched {len(hits)} rows in {row_range}: {hits}")
    return hits[0][0]


def era_to_year(label: str) -> int:
    t = label.strip()
    m = re.match(r"^(昭和|平成|令和)\s*(\d+)年", t)
    if m:
        era, n = m.group(1), int(m.group(2))
        return {"昭和": 1925, "平成": 1988, "令和": 2018}[era] + n
    m = re.match(r"^(昭和|平成|令和)元年", t)
    if m:
        return {"昭和": 1925, "平成": 1988, "令和": 2018}[m.group(1)] + 1
    raise AssertionError(f"unparsed era label {label!r}")


def parse_stateful_year(label: str, era_state: list) -> int:
    """MLIT 時系列 labels mix '昭和23年', bare '41', full-width '８',
    '18.0' floats and '平成元年'. Track the current era across rows."""
    t = str(label).strip()
    m = re.match(r"^(昭和|平成|令和)\s*([\d０-９]+)年", t)
    if m:
        era_state[0] = m.group(1)
        n = int(m.group(2).translate(str.maketrans("０１２３４５６７８９", "0123456789")))
        return {"昭和": 1925, "平成": 1988, "令和": 2018}[era_state[0]] + n
    if re.match(r"^(昭和|平成|令和)元年", t):
        era_state[0] = re.match(r"^(昭和|平成|令和)", t).group(1)
        return {"昭和": 1925, "平成": 1988, "令和": 2018}[era_state[0]] + 1
    m = re.match(r"^([\d０-９]+)(?:\.0)?$", t)
    if m and era_state[0]:
        n = int(m.group(1).translate(str.maketrans("０１２３４５６７８９", "0123456789")))
        return {"昭和": 1925, "平成": 1988, "令和": 2018}[era_state[0]] + n
    raise AssertionError(f"unparseable stateful label {label!r}")


# ---------------------------------------------------------------------------
# A. Housing and Land Survey (住宅・土地統計調査) — e-Stat time-series tables
# ---------------------------------------------------------------------------

def extract_housing():
    housing = {}

    # ---- A-1 第1-1表: stock + vacancy rate (1948–2023) --------------------
    p = RAW / "statb-housing/estat_2023_timeseries_table1-1.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ok("1-1 sheet", "001_1" in wb.sheetnames, str(wb.sheetnames))
    ws = wb["001_1"]
    title = str(ws.cell(row=2, column=4).value or "") + str(ws.cell(row=2, column=5).value or "")
    ok("1-1 title anchor", "第１－１表" in title and "居住世帯の有無" in title, title)
    # Data layout (probed): 実数 rows 18-34, 割合 rows 36-52.
    # cols: 3=year label, 5=総数, 6=居住世帯あり総数, 11=空き家総数 (実数);
    # same columns in 割合 rows carry the % of 総数.
    stock, vac_rate = {}, {}
    seen_num, seen_rate = set(), set()
    for r in list(range(18, 35)) + list(range(36, 53)):
        year_raw = ws.cell(row=r, column=3).value
        m = re.search(r"(19|20)\d{2}", str(year_raw))
        if not m:
            continue
        year = int(m.group(0))
        is_rate_row = r >= 36
        seen = seen_rate if is_rate_row else seen_num
        # The 1973 double row: first = 沖縄を含まない, second = 沖縄を含む.
        # Footnote 3) marks pre-reversion rows; we keep the 沖縄を含む 1973 row.
        if year in seen and year != 1973:
            errors.append(f"1-1 duplicate year {year} (row {r})")
        if year == 1973:
            # keep only the SECOND 1973 row (沖縄を含む); the explicit
            # handling below overwrites with the correct row anyway.
            continue
        seen.add(year)
        total = ws.cell(row=r, column=5).value
        occupied = ws.cell(row=r, column=6).value
        vacant = ws.cell(row=r, column=11).value
        if is_rate_row:
            # 1948 prints "*" (vacancy not tabulated that round) — keep null.
            vac_rate[year] = vacant if isinstance(vacant, (int, float)) else None
        else:
            stock[year] = {
                "total": total if isinstance(total, (int, float)) else None,
                "occupied": occupied if isinstance(occupied, (int, float)) else None,
                "vacant": vacant if isinstance(vacant, (int, float)) else None,
            }
    # 1973 handling: collect both 実数 rows explicitly
    rows_1973 = [r for r in range(18, 35)
                 if re.search(r"1973", str(ws.cell(row=r, column=3).value or ""))]
    ok("1-1 1973 double row", len(rows_1973) == 2, str(rows_1973))
    r_oki = rows_1973[1]
    stock[1973] = {
        "total": ws.cell(row=r_oki, column=5).value,
        "occupied": ws.cell(row=r_oki, column=6).value,
        "vacant": ws.cell(row=r_oki, column=11).value,
    }
    rate_1973_rows = [r for r in range(36, 53)
                      if re.search(r"1973", str(ws.cell(row=r, column=3).value or ""))]
    ok("1-1 1973 rate double row", len(rate_1973_rows) == 2, str(rate_1973_rows))
    vac_rate[1973] = ws.cell(row=rate_1973_rows[1], column=11).value

    # anchor checks (verbatim from notes §C-1 / 概要 表2-1)
    ok("1-1 2023 total", stock[2023]["total"] == 65046700, str(stock[2023]))
    ok("1-1 2023 occupied", stock[2023]["occupied"] == 55665000)
    ok("1-1 2023 vacant", stock[2023]["vacant"] == 9001600)
    ok("1-1 2018 total", stock[2018]["total"] == 62407400)
    ok("1-1 1963 total (Okinawa excl.)", stock[1963]["total"] == 21090000)
    ok("1-1 1973 total (Okinawa incl.)", stock[1973]["total"] == 31058900)
    for yr, expected in [(1963, 2.5), (1978, 7.6), (1993, 9.8), (2008, 13.1),
                         (2013, 13.5), (2018, 13.6), (2023, 13.8)]:
        ok(f"1-1 vacancy rate {yr}", vac_rate[yr] == expected, str(vac_rate.get(yr)))
    # monotonicity: total stock never decreases on the kept series
    kept = sorted(y for y in stock if y >= 1973)
    vals = [stock[y]["total"] for y in kept]
    ok("1-1 stock monotonic 1973+", all(a <= b for a, b in zip(vals, vals[1:])))
    housing["stock"] = {str(y): stock[y] for y in sorted(stock)}
    housing["vacancyRate"] = {str(y): vac_rate[y] for y in sorted(vac_rate)}

    # ---- A-2 第9-1表: tenure shares (1963–2023) ----------------------------
    p = RAW / "statb-housing/estat_2023_timeseries_table9-1.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ok("9-1 sheet", "009_1" in wb.sheetnames, str(wb.sheetnames))
    ws = wb["009_1"]
    title = str(ws.cell(row=2, column=2).value or "")
    ok("9-1 title anchor", "第９－１表" in title and "住宅の所有の関係" in title, title)
    # 実数 rows 18-31, 割合 rows 33-46; cols 5=総数 6=持ち家 8=公営 9=UR公社
    # 10=民営借家 11=給与住宅; col 3 = CE year; 1973 double row (2nd = 沖縄込).
    tenure, tenure_count = {}, {}
    rows_rate = [r for r in range(33, 47)]
    for r in rows_rate:
        yv = ws.cell(row=r, column=3).value
        m = re.search(r"(19|20)\d{2}", str(yv))
        if not m:
            continue
        year = int(m.group(0))
        tenure[year] = {
            "owned": ws.cell(row=r, column=6).value,
            "public": ws.cell(row=r, column=8).value,
            "ur": ws.cell(row=r, column=9).value if isinstance(ws.cell(row=r, column=9).value, (int, float)) else None,
            "private": ws.cell(row=r, column=10).value,
            "company": ws.cell(row=r, column=11).value,
        }
    # 1973: two rows; the second (沖縄を含む) is authoritative → keep 59.2.
    ok("9-1 1973 owned (Okinawa incl.)", abs(tenure[1973]["owned"] - 59.2) < 1e-9, str(tenure[1973]))
    for r in range(18, 32):
        yv = ws.cell(row=r, column=3).value
        m = re.search(r"(19|20)\d{2}", str(yv))
        if not m:
            continue
        year = int(m.group(0))
        tenure_count[year] = {
            "total": ws.cell(row=r, column=5).value,
            "owned": ws.cell(row=r, column=6).value,
            "public": ws.cell(row=r, column=8).value,
            "ur": ws.cell(row=r, column=9).value if isinstance(ws.cell(row=r, column=9).value, (int, float)) else None,
            "private": ws.cell(row=r, column=10).value,
            "company": ws.cell(row=r, column=11).value,
        }
    # 1973 double rows in both blocks: second occurrence overwrote the first —
    # verify both existed and that we kept the 沖縄を含む one.
    ok("9-1 2023 owned", tenure[2023]["owned"] == 60.9, str(tenure[2023]))
    ok("9-1 2023 count owned", tenure_count[2023]["owned"] == 33875500, str(tenure_count[2023]))
    ok("9-1 2023 count private", tenure_count[2023]["private"] == 15683500)
    ok("9-1 2013 owned", tenure[2013]["owned"] == 61.7)
    ok("9-1 1963 owned", tenure[1963]["owned"] == 64.3)
    ok("9-1 1963 ur missing", tenure[1963]["ur"] is None)
    ok("9-1 2023 count total == 1-1 occupied",
       tenure_count[2023]["total"] == housing["stock"]["2023"]["occupied"])
    # Share sums: pre-1978 the 5 categories exhaust the total (±0.3 rounding).
    # From 1978 the 総数 includes 住宅の所有の関係「不詳」(footnote 1), so the
    # five published categories legitimately sum to < 100 (2023: 95.9).
    for y, t in tenure.items():
        s = sum(v for v in t.values() if v is not None)
        if y < 1978:
            ok(f"9-1 share sum {y}", abs(s - 100.0) < 0.3, f"sum={s}")
        else:
            ok(f"9-1 share sum {y}", 90.0 <= s <= 100.0, f"sum={s} (不詳 excluded)")
    housing["tenureShare"] = {str(y): tenure[y] for y in sorted(tenure)}
    housing["tenureCount"] = {str(y): tenure_count[y] for y in sorted(tenure_count)}

    # ---- A-3 第4表: vacancy types (block-anchored) ------------------------
    p = RAW / "statb-housing/estat_2023_timeseries_table4.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ok("t4 sheet", "総数" in wb.sheetnames, str(wb.sheetnames))
    ws = wb["総数"]
    title = str(ws.cell(row=2, column=5).value or "") + str(ws.cell(row=2, column=6).value or "")
    ok("t4 title anchor", "第４表" in title and "空き家の種類" in title, title)
    # Header layout (probed 2026-10-26, sheet 総数):
    #   r9 carries the five block labels at their FIRST column:
    #     col 6  総数 block        (years r10 cols 6-19  = 1958-2023)
    #     col 20 除く空き家 block   (years r10 cols 20-28 = 1983-2023)
    #     col 29 賃貸用の空き家      (years r10 cols 29-37 = 1983-2023)
    #     col 38 売却用の空き家      (years r10 cols 38-42 = 2003-2023)
    #     col 43 二次的住宅         (years r10 cols 43-52 = 1978-2023)
    # 全国 row = 16 (post-reversion 1973-2023); row 17 = 沖縄を含まない
    # pre-reversion totals (1958-1973). Blocks are parsed from the r9 label
    # anchors, NEVER by scanning for years across the whole sheet.
    block_label_col = {}
    for c in range(1, 70):
        v = ws.cell(row=9, column=c).value
        if isinstance(v, str):
            t = v.strip()
            if t == "総数":
                block_label_col["total"] = c
            elif t.startswith("賃貸・売却用及び二次的住宅を除く空き家"):
                block_label_col["other"] = c
            elif t.startswith("賃貸用の空き家"):
                block_label_col["rental"] = c
            elif t.startswith("売却用の空き家"):
                block_label_col["sale"] = c
            elif t.startswith("二次的住宅"):
                block_label_col["secondary"] = c
    ok("t4 blocks located",
       set(block_label_col) == {"total", "other", "rental", "sale", "secondary"},
       str(block_label_col))
    ok("t4 block order", sorted(block_label_col.values()) == list(block_label_col.values()) or
       [block_label_col[k] for k in ("total", "other", "rental", "sale", "secondary")] ==
       sorted(block_label_col.values()), str(block_label_col))

    def block_year_cols(first_col, expect_last_col):
        """Map year -> column for one block: consecutive r10 era labels
        starting at first_col until the next block's first column."""
        cols = {}
        c = first_col
        while c < expect_last_col:
            v = ws.cell(row=10, column=c).value
            if isinstance(v, str) and re.match(r"^(昭和|平成|令和)", v.strip()):
                try:
                    cols[era_to_year(v)] = c
                except AssertionError:
                    break
            c += 1
        return cols

    nxt = {"total": block_label_col["other"], "other": block_label_col["rental"],
           "rental": block_label_col["sale"], "sale": block_label_col["secondary"],
           "secondary": block_label_col["secondary"] + 10}
    total_cols = block_year_cols(block_label_col["total"], nxt["total"])
    other_cols = block_year_cols(block_label_col["other"], nxt["other"])
    rental_cols = block_year_cols(block_label_col["rental"], nxt["rental"])
    sale_cols = block_year_cols(block_label_col["sale"], nxt["sale"])
    secondary_cols = block_year_cols(block_label_col["secondary"], nxt["secondary"])
    ok("t4 total cols", set(total_cols) == set(range(1958, 2024, 5)), str(sorted(total_cols)))
    ok("t4 other cols", set(other_cols) == set(range(1983, 2024, 5)), str(sorted(other_cols)))
    ok("t4 rental cols", set(rental_cols) == set(range(1983, 2024, 5)), str(sorted(rental_cols)))
    ok("t4 sale cols", set(sale_cols) == set(range(2003, 2024, 5)), str(sorted(sale_cols)))
    ok("t4 secondary cols", set(secondary_cols) == set(range(1978, 2024, 5)), str(sorted(secondary_cols)))

    vac_total = {}
    for y, c in total_cols.items():
        if y >= 1973:
            vac_total[y] = ws.cell(row=16, column=c).value
        else:
            v = ws.cell(row=17, column=c).value  # 沖縄を含まない
            vac_total[y] = v if isinstance(v, (int, float)) else None
    ok("t4 2023 total", vac_total[2023] == 9001600, str(vac_total.get(2023)))
    ok("t4 2013 total", vac_total[2013] == 8195600)
    ok("t4 1973 total", vac_total[1973] == 1720300)
    ok("t4 1963 total (Okinawa excl.)", vac_total[1963] == 522000, str(vac_total.get(1963)))
    for y in (1978, 1983, 1988, 1993, 1998, 2003, 2008, 2013, 2018, 2023):
        ok(f"t4 vs 1-1 vacant {y}", vac_total[y] == housing["stock"][str(y)]["vacant"])

    types = {}
    for y in (2013, 2018, 2023):
        types[y] = {
            "rental": ws.cell(row=16, column=rental_cols[y]).value,
            "sale": ws.cell(row=16, column=sale_cols[y]).value,
            "secondary": ws.cell(row=16, column=secondary_cols[y]).value,
            "other": ws.cell(row=16, column=other_cols[y]).value,
        }
    ok("t4 2023 rental", types[2023]["rental"] == 4435800, str(types[2023]))
    ok("t4 2023 sale", types[2023]["sale"] == 326200)
    ok("t4 2023 secondary", types[2023]["secondary"] == 383500)
    ok("t4 2023 other", types[2023]["other"] == 3856000)
    ok("t4 2018 rental", types[2018]["rental"] == 4327200, str(types[2018]))
    ok("t4 2013 rental", types[2013]["rental"] == 4291800, str(types[2013]))
    for y in (2013, 2018, 2023):
        s = sum(types[y].values())
        # e-Stat publishes each category rounded to 100戸; the independently
        # rounded total can differ by ≤ 100戸 (2023: 9,001,500 vs 9,001,600).
        ok(f"t4 sum==total {y}", abs(s - vac_total[y]) <= 100, f"{s} vs {vac_total[y]}")
    housing["vacancyTypes"] = {str(y): types[y] for y in sorted(types)}
    housing["vacancyTotal"] = {str(y): vac_total[y] for y in sorted(vac_total)}

    # ---- A-4 第14-1表: floor area (1968–2023, ALL occupied dwellings) ------
    p = RAW / "statb-housing/estat_2023_timeseries_table14-1.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ok("14-1 sheet", "014_1" in wb.sheetnames, str(wb.sheetnames))
    ws = wb["014_1"]
    title = str(ws.cell(row=2, column=8).value or "") + str(ws.cell(row=2, column=9).value or "")
    ok("14-1 title anchor", "第14－１表" in title and "延べ面積" in title, title)
    # 延べ面積 rows 46-58: col3=year, col5=総数, 6=持ち家, 7=借家総数.
    # Two 1973 rows (沖縄を含まない 77.33 / 同 含む 77.14): keep the second.
    area = {}
    for r in range(46, 59):
        yv = ws.cell(row=r, column=3).value
        if not isinstance(yv, (int, float)):
            continue
        year = int(yv)
        if year == 1973 and year in area:
            # overwrite with the 沖縄を含む row (the second occurrence)
            pass
        elif year in area:
            errors.append(f"14-1 duplicate year {year}")
        area[year] = {
            "total": ws.cell(row=r, column=5).value,
            "owned": ws.cell(row=r, column=6).value,
            "rented": ws.cell(row=r, column=7).value,
        }
    ok("14-1 2023 total", area[2023]["total"] == 91.66, str(area.get(2023)))
    ok("14-1 2023 owned", area[2023]["owned"] == 118.25)
    ok("14-1 2023 rented", area[2023]["rented"] == 45.39)
    ok("14-1 1968 total", area[1968]["total"] == 73.86, str(area.get(1968)))
    ok("14-1 1973 total (Okinawa incl.)", area[1973]["total"] == 77.14, str(area.get(1973)))
    ok("14-1 2018 owned", area[2018]["owned"] == 119.91)
    ok("14-1 year count", len(area) == 12, str(sorted(area)))
    housing["floorArea"] = {str(y): area[y] for y in sorted(area)}

    # ---- A-4b 主要統計表 第4表: construction period bands (2023) -----------
    p = RAW / "statb-housing/estat_2023_shuyo_b4-4_chikunensu.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ok("b4-4 sheet", "C004" in wb.sheetnames, str(wb.sheetnames))
    ws = wb["C004"]
    title = str(ws.cell(row=4, column=17).value or "") + str(ws.cell(row=4, column=18).value or "")
    ok("b4-4 title anchor", "第４表" in title and "建築の時期" in title, title)
    # English band labels at row 14 (cols 12-25) are the official row-14 keys;
    # the 全国 row is 17 with 総数 at col 11 (probed above).
    bands = {}
    for c in range(12, 26):
        label = str(ws.cell(row=14, column=c).value or "").strip()
        if not label:
            continue
        v = ws.cell(row=17, column=c).value
        bands[label] = v if isinstance(v, (int, float)) else None
    ok("b4-4 band count", len(bands) == 14, str(len(bands)))
    ok("b4-4 total (row17 col11)", ws.cell(row=17, column=11).value == 55665000,
       str(ws.cell(row=17, column=11).value))
    # Footnote 1): the TOTAL includes 建築の時期「不詳」— the 14 published
    # bands sum to 52,047,700; the residual 3,617,300 is the "unknown" band.
    band_sum = sum(v for v in bands.values() if v is not None)
    ok("b4-4 band sum (known periods)", band_sum == 52047700, f"{band_sum}")
    ok("b4-4 unknown residual", 55665000 - band_sum == 3617300,
       f"不詳={55665000 - band_sum}")
    ok("b4-4 ≤1950", bands.get("1950 or earlier") == 1127200, str(bands.get("1950 or earlier")))
    ok("b4-4 1951-70", bands.get("1951 to 1970") == 2729100)
    ok("b4-4 1971-80", bands.get("1971 to 1980") == 7185600)
    ok("b4-4 1991-2000", bands.get("1991 to 2000") == 10470700)
    ok("b4-4 2016-18", bands.get("2016 to 2018") == 2837200)
    housing["builtPeriod2023"] = bands

    # ---- A-5 prefecture table (付表 in 概要 txt) ---------------------------    # ---- A-5 prefecture table (付表 in 概要 txt) ---------------------------
    p = RAW / "statb-housing/jyutaku2023_kihon_gaiyou.txt"
    # NB: split("\n") not splitlines() — pdftotext output contains \f page
    # breaks that splitlines() would treat as extra line boundaries.
    lines = p.read_text(encoding="utf-8").split("\n")
    start = end = None
    starts = []
    for i, ln in enumerate(lines):
        if "付表" in ln and "都道府県別の主な指標" in ln and "…" not in ln:
            starts.append(i)
    ok("付表 header unique", len(starts) == 1, str(starts))
    start = starts[0] if starts else None
    if start is not None:
        for i in range(start + 1, len(lines)):
            if lines[i].strip().startswith("1)"):
                end = i
                break
    ok("付表 located", start is not None and end is not None, f"{start}..{end}")
    pref = {}
    # Prefecture names carry internal spaces in the PDF layout ("北 海 道",
    # "和 歌 山県"); match a space-permissive name and normalise it.
    pat = re.compile(
        r"^\s*(全[\s　]*国|[一-龥][一-龥\s　]{0,5}?(?:道|都|府|県))[\s　]+"
        r"([\d,.-]+)[\s　]+([\d,.-]+)[\s　]+([\d.-]+)[\s　]+([\d,.-]+)[\s　]+([\d.]+)[\s　]+"
        r"([\d,.-]+)[\s　]+([\d.]+)"
    )
    for ln in lines[start + 1:end]:
        m = pat.match(ln)
        if not m:
            continue
        name = re.sub(r"[\s　]+", "", m.group(1))
        pref[name] = {
            "total2023": float(m.group(2).replace(",", "")),
            "total2018": float(m.group(3).replace(",", "")),
            "vacant": float(m.group(5).replace(",", "")),
            "vacancyRate": float(m.group(6)),
            "otherVacant": float(m.group(7).replace(",", "")),
            "otherRate": float(m.group(8)),
        }
    ok("付表 47 prefectures + 全国", len(pref) == 48, str(len(pref)))
    ok("付表 全国 rate", pref["全国"]["vacancyRate"] == 13.8, str(pref.get("全国")))
    ok("付表 徳島 rate", pref.get("徳島県", {}).get("vacancyRate") == 21.3)
    ok("付表 埼玉 rate", pref.get("埼玉県", {}).get("vacancyRate") == 9.3)
    ok("付表 東京都 rate", pref.get("東京都", {}).get("vacancyRate") == 10.9)
    ok("付表 沖縄県 rate", pref.get("沖縄県", {}).get("vacancyRate") == 9.4)
    ok("付表 全国 vacant", pref["全国"]["vacant"] == 9002)
    # every prefecture rate within plausible band & consistent with counts
    for name, row in pref.items():
        if name == "全国":
            continue
        # 付表 publishes 戸 counts in 千戸 (rounded); the printed rate derives
        # from unrounded counts, so implied-vs-printed can differ by up to ~0.3.
        implied = round(row["vacant"] / row["total2023"] * 100, 1)
        ok(f"付表 {name} rate consistency", abs(implied - row["vacancyRate"]) <= 0.35,
           f"implied {implied} vs {row['vacancyRate']}")
    housing["prefecture2023"] = pref

    return housing


# ---------------------------------------------------------------------------
# B. FIES 2025 annual (published 2026-02-06)
# ---------------------------------------------------------------------------

def extract_fies():
    fies = {}
    p = RAW / "statb-fies/estat_longtime_t2-two_fk4.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ws = wb["支出金額（年）"]
    # years header row 10, cols 16..41 = 2000..2025 (二人以上 sheet)
    years = {}
    for c in range(16, 42):
        v = str(ws.cell(row=10, column=c).value or "")
        m = re.match(r"^(\d{4})年$", v.strip())
        if m:
            years[int(m.group(1))] = c
    ok("FIES long years", sorted(years) == list(range(2000, 2026)), str(sorted(years)))
    r_cons = find_label_row(ws, "消費支出", range(25, 35), range(8, 15))
    r_hous = find_label_row(ws, "住居", range(65, 80), range(8, 15))
    exp2, housing2 = {}, {}
    for y, c in years.items():
        exp2[y] = ws.cell(row=r_cons, column=c).value
        housing2[y] = ws.cell(row=r_hous, column=c).value
    ok("FIES 2025 expenditure", exp2[2025] == 314001, str(exp2.get(2025)))
    ok("FIES 2000 expenditure", exp2[2000] == 317328, str(exp2.get(2000)))
    ok("FIES 2020 expenditure", exp2[2020] == 277926)
    ok("FIES 2025 housing", housing2[2025] == 18665, str(housing2.get(2025)))
    ok("FIES 2000 housing", housing2[2000] == 20522)
    fies["expenditureTwoPlus"] = {str(y): exp2[y] for y in sorted(exp2)}
    fies["housingTwoPlus"] = {str(y): housing2[y] for y in sorted(housing2)}

    # 勤労者世帯 income (same file family, kinrou sheet)
    p = RAW / "statb-fies/estat_longtime_t2-kinrou_fk4.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ws = wb["支出金額（年）"]
    years = {}
    for c in range(17, 43):
        v = str(ws.cell(row=10, column=c).value or "")
        m = re.match(r"^(\d{4})年$", v.strip())
        if m:
            years[int(m.group(1))] = c
    ok("FIES kinrou years", sorted(years) == list(range(2000, 2026)), str(sorted(years)))
    r_inc = find_label_row(ws, "実収入", range(25, 35), range(8, 13))
    r_disp = find_label_row(ws, "可処分所得", range(215, 225), range(8, 13))
    inc, disp = {}, {}
    for y, c in years.items():
        inc[y] = ws.cell(row=r_inc, column=c).value
        disp[y] = ws.cell(row=r_disp, column=c).value
    ok("FIES kinrou 2025 income", inc[2025] == 653901, str(inc.get(2025)))
    ok("FIES kinrou 2025 disposable", disp[2025] == 532408)
    ok("FIES kinrou 2000 income", inc[2000] == 562754)
    fies["incomeKinrou"] = {str(y): inc[y] for y in sorted(inc)}
    fies["disposableKinrou"] = {str(y): disp[y] for y in sorted(disp)}

    # ---- 2025 structure (t1-1 amounts + t1-2 shares), 二人以上 ------------
    p1 = RAW / "statb-fies/estat_2025np_t1-1_fk4.xlsx"
    p2 = RAW / "statb-fies/estat_2025np_t1-2_fk4.xlsx"
    wb1 = openpyxl.load_workbook(p1, data_only=True)
    wb2 = openpyxl.load_workbook(p2, data_only=True)
    ws1, ws2 = wb1["二人"], wb2["二人"]
    ok("t1-1 header col16", str(ws1.cell(row=11, column=16).value or "").replace(" ", "") == "全国")
    cats = [("食料", (28, 34)), ("住居", (68, 75)), ("光熱・水道", (74, 80)),
            ("家具・家事用品", (79, 85)), ("被服及び履物", (89, 95)),
            ("保健医療", (107, 113)), ("交通・通信", (112, 118)),
            ("教育", (119, 125)), ("教養娯楽", (123, 129)),
            ("その他の消費支出", (132, 138))]
    structure = {}
    for label, rr in cats:
        r = find_label_row(ws1, label, range(rr[0], rr[1]), range(8, 15))
        r2 = find_label_row(ws2, label, range(rr[0], rr[1]), range(8, 15))
        structure[label] = {
            "amount": ws1.cell(row=r, column=16).value,
            "share": ws2.cell(row=r2, column=16).value,
        }
    ok("structure 食料", structure["食料"]["amount"] == 89754 and structure["食料"]["share"] == 28.6,
       str(structure["食料"]))
    ok("structure 住居", structure["住居"]["amount"] == 18665 and structure["住居"]["share"] == 5.9,
       str(structure["住居"]))
    ok("structure 交通・通信", structure["交通・通信"]["share"] == 14.5)
    ok("structure shares sum", abs(sum(v["share"] for v in structure.values()) - 100.0) < 0.15,
       str(sum(v["share"] for v in structure.values())))
    ok("structure amounts sum",
       abs(sum(v["amount"] for v in structure.values()) - 314001) <= 2,
       str(sum(v["amount"] for v in structure.values())))
    fies["structure2025"] = structure

    # regional (t1-1: consumption by 都市階級+地方; t1-2: housing share).
    # NOTE the two tables have DIFFERENT column layouts: t1-1 has a 世帯数
    # column at col17 (大都市 col18 … 沖縄 col31); t1-2 has no 世帯数 column
    # (大都市 col17 … 沖縄 col30). Headers are read from each sheet itself.
    regions = {}
    hdr1, hdr2 = {}, {}
    for c in range(18, 32):
        v = str(ws1.cell(row=11, column=c).value or "").replace(" ", "").replace("　", "")
        if v:
            hdr1[c] = v
    for c in range(17, 31):
        v = str(ws2.cell(row=11, column=c).value or "").replace(" ", "").replace("　", "")
        if v:
            hdr2[c] = v
    ok("regional hdr1/hdr2 same names",
       sorted(hdr1.values()) == sorted(hdr2.values()),
       f"{sorted(hdr1.values())} vs {sorted(hdr2.values())}")
    r_cons = find_label_row(ws1, "消費支出", range(25, 35), range(8, 15))
    r_hous = find_label_row(ws2, "住居", range(68, 75), range(8, 15))
    r_util = find_label_row(ws1, "光熱・水道", range(74, 82), range(8, 15))
    for c, name in hdr1.items():
        c2 = [k for k, v in hdr2.items() if v == name][0]
        regions[name] = {
            "expenditure": ws1.cell(row=r_cons, column=c).value,
            "housingShare": ws2.cell(row=r_hous, column=c2).value,
            "utilities": ws1.cell(row=r_util, column=c).value,
        }
    ok("regional 北海道 utilities", regions["北海道"]["utilities"] == 31558,
       str(regions.get("北海道")))
    ok("regional 沖縄 utilities", regions["沖縄"]["utilities"] == 22549)
    ok("regional 大都市", regions["大都市"]["expenditure"] == 327106, str(regions.get("大都市")))
    ok("regional 沖縄", regions["沖縄"]["expenditure"] == 235742, str(regions.get("沖縄")))
    ok("regional 大都市 housing share", regions["大都市"]["housingShare"] == 7.0)
    ok("regional 沖縄 housing share", regions["沖縄"]["housingShare"] == 9.3)
    fies["regional2025"] = regions

    # ---- tenure 2025 (t3-7): 二人・全国 + 勤労・全国 ----------------------
    p = RAW / "statb-fies/estat_2025np_t3-7_fk4.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ws = wb["二人・全国"]
    ok("t3-7 header", str(ws.cell(row=12, column=17).value or "").replace(" ", "") == "持家"
       and str(ws.cell(row=12, column=19).value or "").replace(" ", "") == "民営借家")
    items = [("消費支出", (28, 35)), ("食料", (30, 36)), ("住居", (70, 78)),
             ("家賃地代", (72, 78)), ("設備修繕・維持", (73, 79)), ("光熱・水道", (76, 82))]
    tenure = {}
    for label, rr in items:
        r = find_label_row(ws, label, range(rr[0], rr[1]), range(8, 15))
        tenure[label] = {
            "avg": ws.cell(row=r, column=16).value,
            "owned": ws.cell(row=r, column=17).value,
            "privateRent": ws.cell(row=r, column=19).value,
        }
    # meta rows: 世帯主の年齢 (r24 area) and 持家率(%) — label-anchored
    r_age = find_label_row(ws, "世帯主の年齢(歳)", range(20, 28), range(8, 15))
    r_ownrate = find_label_row(ws, "持家率(％)", range(22, 30), range(8, 15))
    tenure["_meta"] = {
        "headAgeAvg": ws.cell(row=r_age, column=16).value,
        "headAgeOwned": ws.cell(row=r_age, column=17).value,
        "headAgePrivateRent": ws.cell(row=r_age, column=19).value,
        "ownedRate": ws.cell(row=r_ownrate, column=16).value,
    }
    ok("t3-7 head age", tenure["_meta"]["headAgeAvg"] == 60.7
       and tenure["_meta"]["headAgePrivateRent"] == 49.6, str(tenure["_meta"]))
    ok("t3-7 FIES owned rate", tenure["_meta"]["ownedRate"] == 87.3)
    ok("t3-7 消費支出", tenure["消費支出"]["avg"] == 314001
       and tenure["消費支出"]["owned"] == 312688
       and tenure["消費支出"]["privateRent"] == 324825, str(tenure["消費支出"]))
    ok("t3-7 住居", tenure["住居"]["owned"] == 12419 and tenure["住居"]["privateRent"] == 67997,
       str(tenure["住居"]))
    ok("t3-7 家賃地代", tenure["家賃地代"]["owned"] == 441 and tenure["家賃地代"]["privateRent"] == 67107)
    ok("t3-7 光熱", tenure["光熱・水道"]["owned"] == 24877 and tenure["光熱・水道"]["privateRent"] == 22432)
    fies["tenure2025twoPlus"] = tenure

    ws = wb["勤労・全国"]
    ok("t3-7 kinrou header", str(ws.cell(row=12, column=18).value or "").replace(" ", "") == "持家"
       and str(ws.cell(row=12, column=20).value or "").replace(" ", "") == "民営借家")
    # income rows carry 平均 in col17; 住居/家賃地代 rows have 持家 col18 /
    # 民営借家 col20 on the same row.
    kin = {}
    r_inc = find_label_row(ws, "実収入", range(28, 36), range(8, 15))
    r_disp = find_label_row(ws, "可処分所得", range(215, 228), range(8, 15))
    r_cons = find_label_row(ws, "消費支出", range(66, 74), range(8, 15))
    r_hous = find_label_row(ws, "住居", range(108, 118), range(8, 15))
    r_rent = find_label_row(ws, "家賃地代", range(110, 120), range(8, 15))
    kin = {
        "income": ws.cell(row=r_inc, column=17).value,
        "disposable": ws.cell(row=r_disp, column=17).value,
        "expenditure": ws.cell(row=r_cons, column=17).value,
        "housingOwned": ws.cell(row=r_hous, column=18).value,
        "housingPrivateRent": ws.cell(row=r_hous, column=20).value,
        "rentOwned": ws.cell(row=r_rent, column=18).value,
        "rentPrivateRent": ws.cell(row=r_rent, column=20).value,
    }
    ok("t3-7 kinrou income", kin["income"] == 653901, str(kin))
    ok("t3-7 kinrou disposable", kin["disposable"] == 532408)
    ok("t3-7 kinrou housingOwned", kin["housingOwned"] == 10790)
    ok("t3-7 kinrou housingPrivateRent", kin["housingPrivateRent"] == 70183)
    fies["tenure2025kinrou"] = kin

    # ---- solo 2025 (solo_t1 + solo_t8) ------------------------------------
    p = RAW / "statb-fies/estat_2025np_solo_t1_fk4.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ws = wb[wb.sheetnames[0]]
    # 単身 block: 実数 col17, 構成比 col18 (notes A-4)
    r_cons = find_label_row(ws, "消費支出", range(50, 62), range(8, 15))
    r_hous = find_label_row(ws, "住居", range(95, 104), range(8, 15))
    solo = {
        "expenditure": ws.cell(row=r_cons, column=17).value,
        "housing": ws.cell(row=r_hous, column=17).value,
        "housingShare": ws.cell(row=r_hous, column=18).value,
    }
    ok("solo expenditure", solo["expenditure"] == 173042, str(solo))
    ok("solo housing", solo["housing"] == 21667)
    ok("solo housing share", solo["housingShare"] == 12.5)

    p = RAW / "statb-fies/estat_2025np_solo_t8_fk4.xlsx"
    wb = openpyxl.load_workbook(p, data_only=True)
    ws = wb["単身"]
    ok("solo_t8 header", str(ws.cell(row=10, column=18).value or "").replace(" ", "") == "持家"
       and str(ws.cell(row=10, column=19).value or "").replace(" ", "") == "民営借家")
    r_cons = find_label_row(ws, "消費支出", range(18, 26), range(8, 12))
    r_hous = find_label_row(ws, "住居", range(33, 42), range(8, 12))
    r_rent = find_label_row(ws, "家賃地代", range(34, 43), range(8, 12))
    solo_tenure = {
        "expenditureOwned": ws.cell(row=r_cons, column=18).value,
        "expenditurePrivateRent": ws.cell(row=r_cons, column=19).value,
        "housingOwned": ws.cell(row=r_hous, column=18).value,
        "housingPrivateRent": ws.cell(row=r_hous, column=19).value,
        "rentOwned": ws.cell(row=r_rent, column=18).value,
        "rentPrivateRent": ws.cell(row=r_rent, column=19).value,
    }
    ok("solo tenure expenditure", solo_tenure["expenditureOwned"] == 163436
       and solo_tenure["expenditurePrivateRent"] == 191453, str(solo_tenure))
    ok("solo tenure housing", solo_tenure["housingOwned"] == 6846
       and solo_tenure["housingPrivateRent"] == 50467)
    ok("solo tenure rent", solo_tenure["rentOwned"] == 319
       and solo_tenure["rentPrivateRent"] == 49831)
    fies["solo2025"] = solo
    fies["soloTenure2025"] = solo_tenure

    # ---- headline cross-checks from 家計の概要 PDF text --------------------
    p = RAW / "statb-fies/kakei_2025np_summary.txt"
    text = p.read_text(encoding="utf-8")
    m = re.search(r"総世帯注（平均世帯人員2\.15人[^）]*）の消費支出は、１世帯\s*当たり１か月平均([\d,]+)円", text)
    ok("概要 総世帯 regex", m is not None)
    if m:
        fies["headline"] = {"totalHouseholds2025": float(m.group(1).replace(",", ""))}
        ok("概要 総世帯 value", fies["headline"]["totalHouseholds2025"] == 259880)
    else:
        fies["headline"] = {}
    m2 = re.search(r"単身世帯（平均年齢58\.6歳）の消費支出は、１世帯当たり１か月平均([\d,]+)円", text)
    ok("概要 単身 regex", m2 is not None)
    if m2:
        ok("概要 単身 value", float(m2.group(1).replace(",", "")) == 173042)

    return fies


# ---------------------------------------------------------------------------
# C. CPI (2025 base long-run + group indices + headlines)
# ---------------------------------------------------------------------------

def extract_cpi():
    cpi = {}
    p = RAW / "statb-cpi/estat_2025base_lt_chubun_index.utf8.csv"
    with p.open(encoding="utf-8") as f:
        rows = list(csv.reader(f))
    header = rows[0]
    col = {name: i for i, name in enumerate(header)}
    for name in ("総合", "食料", "生鮮食品を除く食料", "住居", "家賃", "光熱・水道", "エネルギー"):
        ok(f"CPI header {name}", name in col)
    long_run, groups = {}, {}
    for row in rows:
        m = re.match(r"^(\d{4})\s*$", row[0]) if row else None
        if not m:
            continue
        year = int(m.group(1))
        def num(name):
            v = row[col[name]].strip()
            return float(v) if v else None
        if year >= 1970:
            long_run[year] = num("総合")
        if year >= 2020:
            groups[year] = {k: num(k) for k in
                            ("総合", "食料", "生鮮食品を除く食料", "住居", "家賃", "光熱・水道", "エネルギー")}
    ok("CPI long 1970", long_run[1970] == 27.6, str(long_run.get(1970)))
    ok("CPI long 2025", long_run[2025] == 100.0)
    ok("CPI long 2010", long_run[2010] == 84.7)
    ok("CPI long years", set(long_run) == set(range(1970, 2026)), str(len(long_run)))
    ok("CPI groups rent 2020", groups[2020]["家賃"] == 99.2, str(groups.get(2020)))
    ok("CPI groups rent 2025", groups[2025]["家賃"] == 100.0)
    ok("CPI groups energy 2022", groups[2022]["エネルギー"] == 98.9)
    cpi["longRunAll"] = {str(y): long_run[y] for y in sorted(long_run)}
    cpi["groups"] = {str(y): groups[y] for y in sorted(groups)}

    # YoY (中分類 + 品目 民営家賃)
    p = RAW / "statb-cpi/estat_2025base_lt_chubun_yoy.utf8.csv"
    with p.open(encoding="utf-8") as f:
        rows = list(csv.reader(f))
    header = rows[0]
    col = {name: i for i, name in enumerate(header)}
    yoy = {}
    for row in rows:
        m = re.match(r"^(\d{4})\s*$", row[0]) if row else None
        if not m or int(m.group(1)) < 2020:
            continue
        year = int(m.group(1))
        def num(name):
            v = row[col[name]].strip()
            return float(v) if v else None
        yoy[year] = {k: num(k) for k in ("総合", "食料", "住居", "家賃", "光熱・水道", "エネルギー")}
    ok("CPI yoy 2025 all", yoy[2025]["総合"] == 3.2, str(yoy.get(2025)))
    ok("CPI yoy 2025 rent", yoy[2025]["家賃"] == 0.3)
    ok("CPI yoy 2023 rent", yoy[2023]["家賃"] == 0.1)
    ok("CPI yoy 2022 energy", yoy[2022]["エネルギー"] == 17.1)
    cpi["yoyGroups"] = {str(y): yoy[y] for y in sorted(yoy)}

    p = RAW / "statb-cpi/estat_2025base_lt_hinmoku_yoy.utf8.csv"
    with p.open(encoding="utf-8") as f:
        rows = list(csv.reader(f))
    header = rows[0]
    ok("CPI 民営家賃 header", "民営家賃" in header)
    col_i = header.index("民営家賃")
    rent_private = {}
    for row in rows:
        m = re.match(r"^(\d{4})\s*$", row[0]) if row else None
        if not m or int(m.group(1)) < 2020:
            continue
        v = row[col_i].strip()
        if v:
            rent_private[int(m.group(1))] = float(v)
    ok("CPI 民営家賃 2025", rent_private.get(2025) == 0.5, str(rent_private))
    ok("CPI 民営家賃 2023", rent_private.get(2023) == 0.1)
    cpi["yoyRentPrivate"] = {str(y): rent_private[y] for y in sorted(rent_private)}

    # headlines from the two PDF text extractions
    p = RAW / "statb-cpi/cpi_2025-nen-avg_zen-n.txt"
    t = p.read_text(encoding="utf-8")
    # the annual PDF also carries the December monthly section with the same
    # phrase — anchor to the numbered overview line "(1) 総合指数は…" (annual).
    # The PDF bundles 2025年12月分 AND the annual average; the same numbered
    # phrase appears twice (line 7 = December 113.0, line 224 = annual 111.9).
    # The ANNUAL figure is the LAST match — assert exactly two and take the last.
    matches = re.findall(r"\(1\)\s*総合指数は2020年を100として([\d.]+)", t)
    ok("CPI annual headline matches", len(matches) == 2, str(matches))
    cpi["headline"] = {}
    if matches:
        cpi["headline"]["avg2025Index2020base"] = float(matches[-1])
        ok("CPI 2025 avg = 111.9", cpi["headline"]["avg2025Index2020base"] == 111.9)
        m2 = re.search(r"\(1\)\s*総合指数は2020年を100として[\d.]+\s*前年比は([\d.]+)％の上昇", t)
        if m2:
            cpi["headline"]["avg2025Yoy"] = float(m2.group(1))
            ok("CPI 2025 avg YoY = 3.2", cpi["headline"]["avg2025Yoy"] == 3.2)
    p = RAW / "statb-cpi/cpi_2026-09_zenkoku.txt"
    t = p.read_text(encoding="utf-8")
    m = re.search(r"総合指数は2025年を100として([\d.]+)", t)
    ok("CPI monthly headline regex", m is not None)
    if m:
        cpi["headline"]["sep2026Index"] = float(m.group(1))
        ok("CPI Sep 2026 = 102.2", cpi["headline"]["sep2026Index"] == 102.2)
    m = re.search(r"前年同月比は\s*([\d.]+)％の\s*上昇", t)
    if m:
        cpi["headline"]["sep2026Yoy"] = float(m.group(1))
        ok("CPI Sep 2026 YoY = 2.1", cpi["headline"]["sep2026Yoy"] == 2.1)
    return cpi


# ---------------------------------------------------------------------------
# D. OECD Analytical House Price Statistics (SDMX CSVs)
# ---------------------------------------------------------------------------

def extract_oecd():
    oecd = {}
    p = RAW / "oecd/oecd-hpi-ydh-ptoincome-idx2015.csv"
    with p.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    ok("OECD pti rows", len(rows) == 660, str(len(rows)))
    pti = {}
    for r in rows:
        if r["MEASURE"] == "HPI_YDH" and r["UNIT_MEASURE"] == "IX" and r["FREQ"] == "A":
            ok("OECD base_per", r["BASE_PER"] == "2015", r["BASE_PER"])
            area = r["REF_AREA"]
            year = int(r["TIME_PERIOD"])
            pti.setdefault(area, {})[year] = float(r["OBS_VALUE"])
    ok("OECD pti areas", len(pti) == 13, str(sorted(pti)))
    ok("OECD JPN 2015 = 100", pti["JPN"].get(2015) == 100.0, str(pti["JPN"].get(2015)))
    ok("OECD JPN 2025", abs(pti["JPN"][2025] - 114.606271670236) < 1e-6, str(pti["JPN"].get(2025)))
    ok("OECD JPN 1973 peak", abs(pti["JPN"][1973] - 213.122637784972) < 1e-6)
    ok("OECD JPN years", set(pti["JPN"]) == set(range(1960, 2026)))
    oecd["ptiJpn"] = {str(y): pti["JPN"][y] for y in sorted(pti["JPN"])}
    latest = {}
    for area, series in pti.items():
        y_max = max(series)
        ok(f"OECD {area} latest year 2025", y_max == 2025, f"{y_max}")
        ok(f"OECD {area} 2015=100", series.get(2015) == 100.0)
        latest[area] = series[y_max]
    ok("OECD KOR 2025", abs(latest["KOR"] - 74.3977374922312) < 1e-6, str(latest.get("KOR")))
    ok("OECD NLD 2025", abs(latest["NLD"] - 135.300038701783) < 1e-6)
    oecd["ptiLatest"] = {"year": 2025, **{a: latest[a] for a in sorted(latest)}}

    p = RAW / "oecd/oecd-rhp-realhouseprice-idx2015.csv"
    with p.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    rhp = {}
    for r in rows:
        if r["MEASURE"] == "RHP" and r["UNIT_MEASURE"] == "IX" and r["FREQ"] == "A":
            ok("OECD rhp base_per", r["BASE_PER"] == "2015")
            rhp.setdefault(r["REF_AREA"], {})[int(r["TIME_PERIOD"])] = float(r["OBS_VALUE"])
    ok("OECD rhp areas", len(rhp) == 13, str(len(rhp)))
    ok("OECD rhp JPN 2015 = 100", rhp["JPN"].get(2015) == 100.0)
    ok("OECD rhp JPN 2025", abs(rhp["JPN"][2025] - 118.046299958487) < 1e-6, str(rhp["JPN"].get(2025)))
    ok("OECD rhp JPN 1990", abs(rhp["JPN"][1990] - 163.342518597803) < 1e-6)
    oecd["rhpJpn"] = {str(y): rhp["JPN"][y] for y in sorted(rhp["JPN"])}
    return oecd


# ---------------------------------------------------------------------------
# E. MLIT housing starts + published land prices
# ---------------------------------------------------------------------------

def extract_mlit():
    mlit = {}
    p = RAW / "mlit/mlit-timeseries-annual-byusage.xls"
    wb = xlrd.open_workbook(str(p))
    ws = wb.sheet_by_name("年計")
    ok("MLIT starts title", "利用関係別" in str(ws.cell_value(0, 0)))
    starts = {}
    era_state = [None]
    prev_year = None
    for r in range(7, ws.nrows):
        label = str(ws.cell_value(r, 0)).strip()
        if not label:
            continue
        try:
            year = parse_stateful_year(label, era_state)
        except AssertionError:
            continue  # footnote rows
        if prev_year is not None and year != prev_year + 1:
            errors.append(f"MLIT starts year jump {prev_year}->{year} at row {r}")
        prev_year = year
        v = ws.cell_value(r, 1)
        if isinstance(v, float) and v > 0:
            if year in starts:
                errors.append(f"MLIT starts duplicate year {year}")
            starts[year] = int(round(v))
    ok("MLIT starts 1973", starts.get(1973) == 1905112, str(starts.get(1973)))
    ok("MLIT starts 2025", starts.get(2025) == 740667, str(starts.get(2025)))
    ok("MLIT starts 2024", starts.get(2024) == 792195)
    ok("MLIT starts 1960", starts.get(1960) == 424170)
    ok("MLIT starts span", min(starts) == 1948 and max(starts) == 2025, f"{min(starts)}..{max(starts)}")
    peak_year = max(starts, key=lambda y: starts[y])
    ok("MLIT peak is 1973", peak_year == 1973)
    mlit["starts"] = {str(y): starts[y] for y in sorted(starts)}

    # land prices (地価公示 2026, 価格推移表)
    p = RAW / "mlit/mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls"
    wb = xlrd.open_workbook(str(p))
    ws = wb.sheet_by_name("価格推移表")
    # years header row 0, cols 3..; 地域 code col 0, 用途 col 2
    year_cols = {}
    for c in range(3, ws.ncols):
        label = str(ws.cell_value(0, c)).strip()
        try:
            year_cols[era_to_year(label)] = c
        except AssertionError:
            pass
    ok("landprice years span", min(year_cols) == 1975 and max(year_cols) == 2026,
       f"{min(year_cols)}..{max(year_cols)}")
    land = {}
    for r in range(2, ws.nrows):
        code = str(ws.cell_value(r, 0)).strip()
        use = str(ws.cell_value(r, 2)).strip()
        if use != "住宅":
            continue
        if code == "019900012":
            land["全国"] = {str(y): ws.cell_value(r, c) for y, c in year_cols.items()}
        elif code == "041300012":
            land["東京都"] = {str(y): ws.cell_value(r, c) for y, c in year_cols.items()}
    ok("landprice 全国 2026", land.get("全国", {}).get("2026") == 144700.0, str(land.get("全国", {}).get("2026")))
    ok("landprice 全国 2025", land.get("全国", {}).get("2025") == 137100.0)
    ok("landprice 東京都 2026", land.get("東京都", {}).get("2026") == 565100.0)
    ok("landprice 東京都 2025", land.get("東京都", {}).get("2025") == 515300.0)
    ok("landprice 全国 1975", land.get("全国", {}).get("1975") == 41500.0)
    mlit["landPriceResidential"] = land
    return mlit


# ---------------------------------------------------------------------------

def main():
    print("Chapter 03 extraction — anchored, deterministic")
    print(f"access date: {ACCESS_DATE}")
    housing = extract_housing()
    fies = extract_fies()
    cpi = extract_cpi()
    oecd = extract_oecd()
    mlit = extract_mlit()

    if errors:
        print(f"\nFAILED: {len(errors)} anchor/validation error(s):")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)

    payload = {
        "_meta": {
            "chapter": "03 — Housing & Cost of Living",
            "accessDate": ACCESS_DATE,
            "generated": date.today().isoformat(),
            "anchorChecks": checks,
            "sources": {
                "statb-housing/estat_2023_timeseries_table1-1.xlsx": sha16(RAW / "statb-housing/estat_2023_timeseries_table1-1.xlsx"),
                "statb-housing/estat_2023_timeseries_table4.xlsx": sha16(RAW / "statb-housing/estat_2023_timeseries_table4.xlsx"),
                "statb-housing/estat_2023_timeseries_table9-1.xlsx": sha16(RAW / "statb-housing/estat_2023_timeseries_table9-1.xlsx"),
                "statb-housing/estat_2023_timeseries_table14-1.xlsx": sha16(RAW / "statb-housing/estat_2023_timeseries_table14-1.xlsx"),
                "statb-housing/jyutaku2023_kihon_gaiyou.pdf": sha16(RAW / "statb-housing/jyutaku2023_kihon_gaiyou.pdf"),
                "statb-fies/estat_longtime_t2-two_fk4.xlsx": sha16(RAW / "statb-fies/estat_longtime_t2-two_fk4.xlsx"),
                "statb-fies/estat_longtime_t2-kinrou_fk4.xlsx": sha16(RAW / "statb-fies/estat_longtime_t2-kinrou_fk4.xlsx"),
                "statb-fies/estat_2025np_t1-1_fk4.xlsx": sha16(RAW / "statb-fies/estat_2025np_t1-1_fk4.xlsx"),
                "statb-fies/estat_2025np_t1-2_fk4.xlsx": sha16(RAW / "statb-fies/estat_2025np_t1-2_fk4.xlsx"),
                "statb-fies/estat_2025np_t3-7_fk4.xlsx": sha16(RAW / "statb-fies/estat_2025np_t3-7_fk4.xlsx"),
                "statb-fies/estat_2025np_solo_t1_fk4.xlsx": sha16(RAW / "statb-fies/estat_2025np_solo_t1_fk4.xlsx"),
                "statb-fies/estat_2025np_solo_t8_fk4.xlsx": sha16(RAW / "statb-fies/estat_2025np_solo_t8_fk4.xlsx"),
                "statb-fies/kakei_2025np_summary.pdf": sha16(RAW / "statb-fies/kakei_2025np_summary.pdf"),
                "statb-cpi/estat_2025base_lt_chubun_index.csv": sha16(RAW / "statb-cpi/estat_2025base_lt_chubun_index.csv"),
                "statb-cpi/estat_2025base_lt_chubun_yoy.csv": sha16(RAW / "statb-cpi/estat_2025base_lt_chubun_yoy.csv"),
                "statb-cpi/estat_2025base_lt_hinmoku_yoy.csv": sha16(RAW / "statb-cpi/estat_2025base_lt_hinmoku_yoy.csv"),
                "statb-cpi/cpi_2025-nen-avg_zen-n.pdf": sha16(RAW / "statb-cpi/cpi_2025-nen-avg_zen-n.pdf"),
                "statb-cpi/cpi_2026-09_zenkoku.pdf": sha16(RAW / "statb-cpi/cpi_2026-09_zenkoku.pdf"),
                "oecd/oecd-hpi-ydh-ptoincome-idx2015.csv": sha16(RAW / "oecd/oecd-hpi-ydh-ptoincome-idx2015.csv"),
                "oecd/oecd-rhp-realhouseprice-idx2015.csv": sha16(RAW / "oecd/oecd-rhp-realhouseprice-idx2015.csv"),
                "mlit/mlit-timeseries-annual-byusage.xls": sha16(RAW / "mlit/mlit-timeseries-annual-byusage.xls"),
                "mlit/mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls": sha16(RAW / "mlit/mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls"),
            },
            "conventions": {
                "units": "source units preserved (戸/千戸→戸, 円/month, %, index 2015=100 OECD, 2025=100 CPI, ㎡)",
                "1973": "Housing tables carry two 1973 rows (Okinawa excluded/included); the Okinawa-included row is authoritative.",
                "pre1968": "1963/1968 values exclude Okinawa (survey coverage); 1953 is 市部のみ; 1948 excludes 建築中.",
                "vacancyTypes": "2013/2018 「その他の住宅」 was renamed 「賃貸・売却用及び二次的住宅を除く空き家」 in 2023 (same concept); 1978–1998 賃貸用 includes 売却用.",
                "floorArea": "第14-1表 covers ALL occupied dwellings (専用住宅ではありません); 2023 専用住宅 average is 90.86㎡ — different denominator, not used here.",
                "cpi": "2025-base (2025=100) long-run series (e-Stat 2026-08-07); 2025 calendar-year average was also published in the 2020 base (111.9) on 2026-01-23.",
                "oecd": "HPI_YDH = price-to-income ratio index, RHP = real house price index; both 2015=100, annual, seasonally adjusted, unit=IX (never mix with the *_AVG percentage-of-long-term-average variants).",
            },
        },
        "housing": housing,
        "fies": fies,
        "cpi": cpi,
        "oecd": oecd,
        "mlit": mlit,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"\nOK: {checks} anchor checks passed")
    print(f"wrote {OUT.relative_to(ROOT)}")
    # summary for eyeball review
    print("\nHeadline values extracted:")
    print(f"  空き家率: 1963 {housing['vacancyRate']['1963']}% → 2023 {housing['vacancyRate']['2023']}%")
    print(f"  持ち家率: 1963 {housing['tenureShare']['1963']['owned']}% → 2023 {housing['tenureShare']['2023']['owned']}%")
    print(f"  総住宅数 2023: {housing['stock']['2023']['total']:,} 戸 / 空き家 {housing['stock']['2023']['vacant']:,} 戸")
    print(f"  FIES 消費支出 2025: {fies['expenditureTwoPlus']['2025']:,} 円/月 (二人以上)")
    print(f"  住居構成比 2025: {fies['structure2025']['住居']['share']}% / 民営借家住居費 {fies['tenure2025twoPlus']['住居']['privateRent']:,} 円")
    print(f"  CPI 2025: {cpi['longRunAll']['2025']} (2025=100) / 家賃YoY {cpi['yoyGroups']['2025']['家賃']}%")
    print(f"  OECD PTI JPN 2025: {oecd['ptiJpn']['2025']:.3f} (2015=100)")


if __name__ == "__main__":
    main()
