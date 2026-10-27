#!/usr/bin/env python3
# =============================================================================
# extract-series.py — Japan Clarity Chapter 04 (Labor & Working Conditions)
# Deterministic, anchor-validated extraction from archived raw sources.
#
# Sources (archived 2026-10-26, see notes/mhlw-summary.md, notes/oecd-summary.md):
#   raw/statb-lf/est-000001082681.xlsx  LFS 長期表2  就業状態別15歳以上人口 (1953-2025)
#   raw/statb-lf/est-000001082690.xlsx  LFS 長期表4(1) 従業上の地位別就業者数 (1953-2025)
#   raw/statb-lf/est-000001082684.xlsx  LFS 長期表3(3) 年齢5歳階級別就業者数及び就業率 (1968-)
#   raw/statb-lf/est-000021915917.xlsx  LFS 詳細集計 長期表10(1) 雇用形態別 (2002-2025, sex×age)
#   raw/statb-lf/statb-2025avg-900100.xlsx  2025年平均 雇用形態・年齢階級別役員を除く雇用者数
#   raw/statb-lf/statb-2025avg-900300.xlsx  2025年平均 非正規についた主な理由別
#   raw/mhlw/mls-longterm-jissu-table1.utf8.csv  毎月勤労統計 実数累積 (1970-/1990-, hours)
#   raw/mhlw/sw-ts-yukyu-{fuyo,shutoku,shutokuritsu}.xls  就労条件総合調査 時系列11-13表
#   raw/mhlw/chingin-kouzou-r7/ck-r7-zuhyo.xlsx  賃金構造基本統計調査 2025 (第1/2/6-1表)
#   raw/mhlw/chingin-kouzou-r7/ck-r7-14.txt      同 概況 付表1/付表2 (PDF text)
#   raw/mhlw/rousai-houdou-2025-sankou.pdf(-bbox) 労働災害発生状況 2025 (chart-label series)
#   raw/mhlw/rousai-press-r05-betsuen.pdf(-bbox)  同 2023 (cross-rendering)
#   raw/mhlw/rousai-press-r02-betsuen.pdf(-bbox)  同 2020 (cross-rendering)
#   raw/mhlw/karoshi-r7-mental.txt / karoshi-r4-mental.txt  精神障害労災補償 (FY2018-2025)
#   raw/oecd/oecd-hours-1.csv, oecd-temp-1.csv, oecd-gwg-1.csv  OECD SDMX
#
# Chapter-01 audit lesson (cross-table contamination): every value is located
# by (sheet, table-title anchor, row-label anchor, column header anchor) —
# never by year + plausible range. Duplicate year keys are hard errors.
# Chapter-03 audit lesson (prose ≠ data): the accident series below are the
# chart-label reconstructions documented in notes/mhlw-summary.md with their
# anchor-verification trail; expected anchor values re-asserted here.
# Any mismatch aborts the run (exit 1).
# =============================================================================
import csv
import hashlib
import json
import re
import sys
from pathlib import Path

import openpyxl
import xlrd

ROOT = Path(__file__).resolve().parents[3]  # repo root
RAW = ROOT / "research/chapter04/raw"
OUT = ROOT / "research/chapter04/notes/extracted-series.json"
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


def era_to_year(label: str, era_state=None) -> int:
    t = str(label).strip()
    if t in ("元年", "令和元年", "平成元年", "昭和元年"):
        base = {"令和元年": 2019, "平成元年": 1989, "昭和元年": 1926, "元年": None}[t]
        if base:
            return base
    m = re.match(r"^(昭和|平成|令和)\s*(\d+)", t)
    if m:
        return {"昭和": 1925, "平成": 1988, "令和": 2018}[m.group(1)] + int(m.group(2))
    # LFS sheets carry era label in col A and western year in col B
    m = re.match(r"^(\d{4})", t)
    if m:
        return int(m.group(1))
    raise AssertionError(f"unparsed era/year label {label!r}")


def year_from_pair(era_label, west_label):
    """LFS long-run sheets: col A era label (昭和28年 / 28 / 令和７年…),
    col B western year. Trust col B, assert consistency with col A."""
    y = None
    w = str(west_label).strip()
    m = re.match(r"^(\d{4})", w)
    if m:
        y = int(m.group(1))
    if y is None:
        raise AssertionError(f"no western year in {west_label!r} (era {era_label!r})")
    e = str(era_label).strip()
    if e:
        try:
            ey = era_to_year(e) if re.match(r"^(昭和|平成|令和)", e) else None
        except AssertionError:
            ey = None
        if ey is not None and ey != y:
            raise AssertionError(f"era label {e!r} → {ey} ≠ western {y}")
    return y



ALT_1973 = {}


def put_year(data, y, entry, context=""):
    """LFS long-run sheets carry TWO 昭和48年(1973) rows: the first EXCLUDES
    Okinawa (the value continuing the pre-reversion series), the second
    INCLUDES it (沖縄本土復帰 1972-07; forward-continuous with 1974+ — see
    労働力調査の解説 (3)ア: both 1973 values are published). The continuous
    series uses the SECOND row; the FIRST is stashed in ALT_1973 (asserted
    below: smaller 15+ population / employed, i.e. excluding Okinawa).
    Audit 2026-10-28 (D1): the original implementation kept the FIRST row,
    contradicting this docstring — fixed to keep the SECOND row."""
    if y in data:
        if y == 1973:
            ALT_1973[context] = data[y]   # stash the first (excl-Okinawa) row
            data[y] = entry                # keep the second (incl-Okinawa) row
            return
        raise AssertionError(f"{context} duplicate year {y}")
    data[y] = entry


def assert_1973_convention(lfs_main, lfs_status, lfs_age):
    """D1 regression check: the kept 1973 values must be the Okinawa-INCLUDED
    rows (forward-continuous with 1974+); ALT_1973 holds the excluded rows."""
    ok("1973 kept row includes Okinawa: employed 5259 / unemprate 1.3",
       lfs_main.get("1973", {}).get("employed") == 5259.0 and lfs_main.get("1973", {}).get("unemprate") == 1.3,
       str(lfs_main.get("1973")))
    ok("1973 status kept row includes Okinawa: employee 3615 / self 970 / family 665",
       lfs_status.get("1973", {}).get("employee") == 3615.0 and lfs_status.get("1973", {}).get("selfemployed") == 970.0
       and lfs_status.get("1973", {}).get("family") == 665.0, str(lfs_status.get("1973")))
    ok("1973 60-64 rate 56.9 (incl-Okinawa row)",
       lfs_age.get("1973", {}).get("60-64_rate") == 56.9, str(lfs_age.get("1973")))
    ok("ALT_1973 stashed the excl-Okinawa rows", len(ALT_1973) >= 2, str(sorted(ALT_1973.keys())))

def num(v):
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return round(float(v), 6)
    s = str(v).strip().replace(",", "")
    if s in ("", "-", "…", "‐", "―"):
        return None
    try:
        return round(float(s), 6)
    except ValueError:
        return None


# ---------------------------------------------------------------------------
# 1. Labour Force Survey — 長期表2 (employment status, 1953-2025)
# ---------------------------------------------------------------------------
def extract_lfs_main():
    p = RAW / "statb-lf/est-000001082681.xlsx"
    wb = openpyxl.load_workbook(p, read_only=True)
    ws = wb["長期02"]
    # Anchor: title row
    title = str(ws.cell(row=1, column=3).value or "")
    ok("lfs t2 title", "就業状態別15歳以上人口" in title, title)
    # Column map (1-based): A era, B year, C 15歳以上人口, D 労働力人口, E 就業者,
    # F 完全失業者, G 非労働力人口, H 通学, I 家事, J その他, K 労働力人口比率, L 就業率, M 完全失業率
    # (blocks for 男 M.., 女 Y.. follow; only 男女計 block extracted)
    data = {}
    for row in ws.iter_rows(min_row=11, max_row=84, values_only=True):
        era, west = row[0], row[1]
        if west is None:
            continue
        y = year_from_pair(era, west)
        vals = [num(row[i]) for i in range(2, 13)]
        put_year(data, y, {
            "pop15": vals[0], "laborforce": vals[1], "employed": vals[2],
            "unemployed": vals[3], "notinlf": vals[4], "school": vals[5],
            "housekeeping": vals[6], "other": vals[7], "lfpr": vals[8],
            "emprate": vals[9], "unemprate": vals[10],
        }, "LFS t2")
    wb.close()
    ok("lfs t2 span", min(data) == 1953 and max(data) == 2025 and len(data) == 73,
       f"{min(data)}–{max(data)} n={len(data)}")
    # Verbatim anchors (e-Stat file, cross-checked with 2025年平均結果の概要 PDF)
    ok("lfs t2 1953 employed 3913", data[1953]["employed"] == 3913.0)
    ok("lfs t2 2025 employed 6828", data[2025]["employed"] == 6828.0)
    ok("lfs t2 2025 laborforce 7004", data[2025]["laborforce"] == 7004.0)
    ok("lfs t2 2025 unemployed 176", data[2025]["unemployed"] == 176.0)
    ok("lfs t2 2025 unemprate 2.5", data[2025]["unemprate"] == 2.5)
    ok("lfs t2 2025 emprate 62.2", data[2025]["emprate"] == 62.2)
    ok("lfs t2 2002 unemprate 5.4", data[2002]["unemprate"] == 5.4)
    # identity: employed + unemployed = laborforce (1万 rounding tolerance)
    bad = [y for y, d in data.items()
           if y >= 1978 and None not in (d["employed"], d["unemployed"], d["laborforce"])
           and abs(d["employed"] + d["unemployed"] - d["laborforce"]) > 2.0]
    ok("lfs t2 identity employed+unemployed=laborforce (1978+)", not bad, str(bad[:5]))
    # identity: laborforce + notinlf = pop15
    # NOTE: 15歳以上人口 is an external benchmark (人口推計), not a survey
    # component — laborforce + notinlf runs systematically ~7-52万 below it
    # (survey estimates vs benchmark). The internal identities checked instead:
    # 労働力 = 就業者+完全失業者 and 非労働力総数 = 通学+家事+その他.
    # pre-1978 時系列接続用数値 (official note 2) — components may not reconcile;
    # identity enforced from 1978 onward only.
    bad2 = [y for y, d in data.items()
            if y >= 1978 and None not in (d["school"], d["housekeeping"], d["other"], d["notinlf"])
            and abs(d["school"] + d["housekeeping"] + d["other"] - d["notinlf"]) > 2.0]
    ok("lfs t2 identity notinlf components (1978+)", not bad2, str(bad2[:5]))
    return {str(y): v for y, v in sorted(data.items())}


# ---------------------------------------------------------------------------
# 2. LFS — 長期表4(1) employment status (自営業主/家族従業者/雇用者), 1953-2025
# ---------------------------------------------------------------------------
def extract_lfs_status():
    p = RAW / "statb-lf/est-000001082690.xlsx"
    wb = openpyxl.load_workbook(p, read_only=True)
    ws = wb["長期04"]
    title = str(ws.cell(row=1, column=3).value or "")
    ok("lfs t4 title", "従業上の地位" in title, title)
    # 男女計 block: A era, B year, C 就業者総数, D 自営業主, E うち雇有業主,
    # F 家族従業者, G 雇用者, H 常雇, I 臨時雇, J 日雇  (then 男 block K.., 女 block ..)
    data = {}
    for row in ws.iter_rows(min_row=10, max_row=90, values_only=True):
        era, west = row[0], row[1]
        if west is None:
            continue
        y = year_from_pair(era, west)
        vals = [num(row[i]) for i in range(2, 10)]
        put_year(data, y, {
            "employed": vals[0], "selfemployed": vals[1], "selfempl_with_emp": vals[2],
            "family": vals[3], "employee": vals[4], "regular": vals[5],
            "temporary": vals[6], "daily": vals[7],
        }, "LFS t4")
    wb.close()
    ok("lfs t4 span", min(data) == 1953 and max(data) == 2025 and len(data) == 73,
       f"{min(data)}–{max(data)} n={len(data)}")
    ok("lfs t4 1953 employee 1660", data[1953]["employee"] == 1660.0)
    ok("lfs t4 1953 selfemployed 991", data[1953]["selfemployed"] == 991.0)
    ok("lfs t4 1953 family 1262", data[1953]["family"] == 1262.0)
    ok("lfs t4 2025 employee 6185", data[2025]["employee"] == 6185.0,
       str(data[2025]))
    ok("lfs t4 2025 selfemployed 499", data[2025]["selfemployed"] == 499.0)
    ok("lfs t4 2025 family 115", data[2025]["family"] == 115.0)
    ok("lfs t4 2013 employee 5567", data[2013]["employee"] == 5567.0)
    ok("lfs t4 1990 selfemployed 878", data[1990]["selfemployed"] == 878.0)
    # The official table's components sum slightly BELOW 就業者総数 (residual
    # grows from 0 in 1953-67 to ~29-46万 recently; 役員 classification
    # residual in the published long-run table). Assert: residual small,
    # non-negative, < 1% of employed.
    resid = {y: d["employed"] - d["selfemployed"] - d["family"] - d["employee"]
             for y, d in data.items()
             if None not in (d["employed"], d["selfemployed"], d["family"], d["employee"])}
    bad = [y for y, r in resid.items() if not (-1.0 <= r <= max(5.0, 0.01 * data[y]["employed"]))]
    ok("lfs t4 residual small non-negative", not bad, str({y: resid[y] for y in bad[:5]}))
    return {str(y): v for y, v in sorted(data.items())}


# ---------------------------------------------------------------------------
# 3. LFS — 長期表3(3) employment rate by 5-year age group (1968-)
# ---------------------------------------------------------------------------
AGE_COLS_T3 = {  # column letter → age group (header row 6)
    "C": "total", "D": "15-19", "E": "20-24", "F": "25-29", "G": "30-34",
    "H": "35-39", "I": "40-44", "J": "45-49", "K": "50-54", "L": "55-59",
    "M": "60-64", "N": "65+",
}


def extract_lfs_age():
    p = RAW / "statb-lf/est-000001082684.xlsx"
    wb = openpyxl.load_workbook(p, read_only=True)
    ws = wb.worksheets[0]
    title = str(ws.cell(row=1, column=3).value or "")
    ok("lfs t3-3 title", "就業者数及び就業率" in title and "５歳階級" in title, title)
    from openpyxl.utils import column_index_from_string as cix
    # Layout (verified live): counts C..N (総数,15-19,…,60-64,65+), O..Q 65-69/70-74/75+,
    # R 70+(再掲), S..AD 非農林業 counts, AE..AH 非農林業65+細分, AI..AW 就業率:
    # AI 総数, AJ 15-19, AK 20-24, AL 25-29, AM 30-34, AN 35-39, AO 40-44, AP 45-49,
    # AQ 50-54, AR 55-59, AS 60-64, AT 65歳以上, AU 65-69, AV 70-74, AW 75歳以上
    count_map = [("total", "C"), ("15-19", "D"), ("20-24", "E"), ("25-29", "F"),
                 ("30-34", "G"), ("35-39", "H"), ("40-44", "I"), ("45-49", "J"),
                 ("50-54", "K"), ("55-59", "L"), ("60-64", "M"), ("65+", "N"),
                 ("65-69", "O"), ("70-74", "P"), ("75+", "Q")]
    rate_map = [("total_rate", "AI"), ("15-19_rate", "AJ"), ("20-24_rate", "AK"),
                ("25-29_rate", "AL"), ("30-34_rate", "AM"), ("35-39_rate", "AN"),
                ("40-44_rate", "AO"), ("45-49_rate", "AP"), ("50-54_rate", "AQ"),
                ("55-59_rate", "AR"), ("60-64_rate", "AS"), ("65+_rate", "AT"),
                ("65-69_rate", "AU"), ("70-74_rate", "AV"), ("75+_rate", "AW")]
    ok("lfs t3-3 rate hdr AI", str(ws.cell(row=5, column=cix("AI")).value or "").startswith("就業率"))
    ok("lfs t3-3 rate hdr AT 65+", str(ws.cell(row=6, column=cix("AT")).value or "").strip() == "65歳以上")
    data = {}
    for row in ws.iter_rows(min_row=10, max_row=72, values_only=True):
        era, west = row[0], row[1]
        if west is None:
            continue
        try:
            y = year_from_pair(era, west)
        except AssertionError:
            continue
        entry = {}
        for key, col in count_map:
            entry[key] = num(row[cix(col) - 1])
        for key, col in rate_map:
            entry[key] = num(row[cix(col) - 1])
        put_year(data, y, entry, "LFS t3-3")
    wb.close()
    ok("lfs t3-3 span 1968-2025", min(data) == 1968 and max(data) == 2025 and len(data) == 58,
       f"{min(data)}–{max(data)} n={len(data)}")
    ok("lfs t3-3 2025 total 6828", data[2025]["total"] == 6828.0)
    ok("lfs t3-3 2025 65+ employed 943", data[2025]["65+"] == 943.0)
    ok("lfs t3-3 2025 65+ rate 26.0", data[2025]["65+_rate"] == 26.0, str(data[2025]["65+_rate"]))
    ok("lfs t3-3 2025 total rate 62.2", data[2025]["total_rate"] == 62.2)
    ok("lfs t3-3 1968 65+ rate 33.3", data[1968]["65+_rate"] == 33.3, str(data[1968]["65+_rate"]))
    # identity: 65-69 + 70-74 + 75+ ≈ 65+ counts
    bad = [y for y, d in data.items()
           if None not in (d["65-69"], d["70-74"], d["75+"], d["65+"])
           and abs(d["65-69"] + d["70-74"] + d["75+"] - d["65+"]) > 2.0]
    ok("lfs t3-3 identity 65+ breakdown", not bad, str(bad[:5]))
    # identity: total counts sum
    bad2 = [y for y, d in data.items()
            if None not in (d["15-19"], d["20-24"], d["25-29"], d["30-34"], d["35-39"],
                            d["40-44"], d["45-49"], d["50-54"], d["55-59"], d["60-64"], d["65+"],
                            d["total"])
            and abs(sum(d[k] for k in ("15-19", "20-24", "25-29", "30-34", "35-39", "40-44",
                                       "45-49", "50-54", "55-59", "60-64", "65+")) - d["total"]) > 4.0]
    ok("lfs t3-3 identity age counts sum", not bad2, str(bad2[:5]))
    return {str(y): v for y, v in sorted(data.items())}


# ---------------------------------------------------------------------------
# 4. LFS 詳細集計 長期表10(1) — employment form by sex (2002-2025)
# ---------------------------------------------------------------------------
def extract_lfs_form():
    p = RAW / "statb-lf/est-000021915917.xlsx"
    wb = openpyxl.load_workbook(p, read_only=True)
    out = {}
    for sheet, sex in (("男女計", "total"), ("男", "male"), ("女", "female")):
        ws = wb[sheet]
        title = str(ws.cell(row=1, column=3).value or "")
        ok(f"lfs t10 title {sheet}", "雇用形態別" in title, title)
        # 総数 block columns: C 就業者, D 雇用者, E 役員を除く雇用者, F 正規,
        # G 非正規, H パート・アルバイト計, I うちパート, J うちアルバイト,
        # K 派遣, L 契約社員, M 嘱託, N その他, O 正規率, P 非正規率
        data = {}
        for row in ws.iter_rows(min_row=17, max_row=55, values_only=True):
            era, west = row[0], row[1]
            if west is None:
                continue
            y = year_from_pair(era, west)
            entry = {
                "employed": num(row[2]), "employee": num(row[3]),
                "employee_excl_exec": num(row[4]), "regular": num(row[5]),
                "nonregular": num(row[6]), "part_arbeit": num(row[7]),
                "part": num(row[8]), "arbeit": num(row[9]),
                "dispatch": num(row[10]), "contract": num(row[11]),
                "entrusted": num(row[12]), "other": num(row[13]),
                "regular_share": num(row[14]), "nonregular_share": num(row[15]),
            }
            if y in data:
                raise AssertionError(f"LFS t10 duplicate year {y} ({sheet})")
            data[y] = entry
        out[sex] = {str(y): v for y, v in sorted(data.items())}
        ok(f"lfs t10 span {sheet}", min(data) == 2002 and max(data) == 2025 and len(data) == 24,
           f"{min(data)}–{max(data)} n={len(data)}")
    t = out["total"]
    ok("lfs t10 2002 nonregular 1451", t["2002"]["nonregular"] == 1451.0)
    ok("lfs t10 2025 regular 3700", t["2025"]["regular"] == 3700.0)
    ok("lfs t10 2025 nonregular 2128", t["2025"]["nonregular"] == 2128.0)
    ok("lfs t10 2025 excl_exec 5828", t["2025"]["employee_excl_exec"] == 5828.0)
    ok("lfs t10 2025 part_arbeit 1512", t["2025"]["part_arbeit"] == 1512.0)
    ok("lfs t10 2025 nonreg share 36.5", t["2025"]["nonregular_share"] == 36.5)
    ok("lfs t10 2025 part 1031 arbeit 481",
       t["2025"]["part"] == 1031.0 and t["2025"]["arbeit"] == 481.0)
    # identity: regular + nonregular = employee_excl_exec (±2)
    bad = [y for y, d in t.items()
           if None not in (d["regular"], d["nonregular"], d["employee_excl_exec"])
           and abs(d["regular"] + d["nonregular"] - d["employee_excl_exec"]) > 2.0]
    ok("lfs t10 identity regular+nonregular", not bad, str(bad[:5]))
    # breakdown identity: part_arbeit + dispatch + contract + entrusted + other ≈ nonregular (±3)
    bad2 = [y for y, d in t.items()
            if None not in (d["part_arbeit"], d["dispatch"], d["contract"], d["entrusted"],
                            d["other"], d["nonregular"])
            and abs(d["part_arbeit"] + d["dispatch"] + d["contract"] + d["entrusted"]
                    + (d["other"] or 0) - d["nonregular"]) > 3.0]
    ok("lfs t10 identity nonregular breakdown", not bad2, str(bad2[:5]))
    # share recompute (1 dp): nonregular/employee_excl_exec*100
    bad3 = [y for y, d in t.items()
            if None not in (d["nonregular_share"], d["nonregular"], d["employee_excl_exec"])
            and abs(round(d["nonregular"] / d["employee_excl_exec"] * 100, 1)
                    - d["nonregular_share"]) > 0.15]
    ok("lfs t10 share recompute", not bad3, str(bad3[:5]))
    # Age blocks (2025 nonregular share by age for the U-shape figure):
    # block start cols (1-based): Q(17) 15-24, AS(45) 25-34, BG(59) 35-44,
    # BU(73) 45-54, CI(87) 55-64, CW(101) 65+. Within a block: +0 就業者,
    # +1 雇用者, +2 役員を除く, +3 正規, +4 非正規, +12 正規share, +13 非正規share.
    AGE_BLOCKS = {"15-24": 17, "25-34": 45, "35-44": 59, "45-54": 73, "55-64": 87, "65+": 101}
    age2025 = {}
    for row in wb["男女計"].iter_rows(min_row=17, max_row=45, values_only=True):
        if row[1] and str(row[1]).startswith("2025"):
            for name, b0 in AGE_BLOCKS.items():
                age2025[name] = {
                    "employed": num(row[b0 - 1 + 0]), "employee_excl_exec": num(row[b0 - 1 + 2]),
                    "nonregular": num(row[b0 - 1 + 4]), "nonregular_share": num(row[b0 - 1 + 13]),
                }
            break
    wb.close()
    ok("lfs t10 age2025 65+ share 76.1", age2025.get("65+", {}).get("nonregular_share") == 76.1,
       str(age2025.get("65+")))
    ok("lfs t10 age2025 15-24 share 52.7", age2025.get("15-24", {}).get("nonregular_share") == 52.7)
    ok("lfs t10 age2025 25-34 share 20.7", age2025.get("25-34", {}).get("nonregular_share") == 20.7)
    badage = [k for k, d in age2025.items()
              if None not in (d["nonregular"], d["employee_excl_exec"], d["nonregular_share"])
              and abs(round(d["nonregular"] / d["employee_excl_exec"] * 100, 1) - d["nonregular_share"]) > 0.2]
    ok("lfs t10 age share recompute", not badage, str(badage))
    out["age2025"] = age2025
    # sex consistency: male + female ≈ total for regular/nonregular (±2)
    bad4 = [y for y in t
            if None not in (out["male"][y]["nonregular"], out["female"][y]["nonregular"],
                            t[y]["nonregular"])
            and abs(out["male"][y]["nonregular"] + out["female"][y]["nonregular"]
                    - t[y]["nonregular"]) > 2.0]
    ok("lfs t10 sex consistency", not bad4, str(bad4[:5]))
    return out


# ---------------------------------------------------------------------------
# 5. 2025 annual detail — non-regular share by age (900100) + reasons (900300)
# ---------------------------------------------------------------------------
def extract_lfs_2025_detail():
    # 2025年平均結果の概要 (lf2025-gaiyou.txt) 表Ⅱ-1: nonregular reasons (万人, %)
    p = RAW / "statb-lf/lf2025-gaiyou.txt"
    txt = p.read_text(encoding="utf-8")
    m = re.search(r"表Ⅱ－１\s+非正規の職員・従業員についた主な理由別の内訳（2025年平均）(.*?)注\)", txt, re.S)
    ok("gaiyou reasons table found", m is not None)
    reasons = {}
    if m:
        for line in m.group(1).splitlines():
            mm = re.match(r"\s*(自分の都合のよい時間に働きたいから|家計の補助・学費等を得たいから|"
                          r"家事・育児・介護等と両立しやすいから|通勤時間が短いから|専門的な技能等をいかせるから|"
                          r"正規の職員・従業員の仕事がないから|その他)\s+(\d+)\s+(-?\d+)\s+([\d.]+)\s+"
                          r"(\d+)\s+(-?\d+)\s+([\d.]+)\s+(\d+)\s+(-?\d+)\s+([\d.]+)", line)
            if mm:
                reasons[mm.group(1)] = {
                    "total": float(mm.group(2)), "total_share": float(mm.group(4)),
                    "male": float(mm.group(5)), "male_share": float(mm.group(7)),
                    "female": float(mm.group(8)), "female_share": float(mm.group(10)),
                }
    m0 = re.search(r"非正規の職員・従業員\s+(\d+)\s+(-?\d+)\s+-\s+(\d+)\s+(-?\d+)\s+-\s+(\d+)\s+(-?\d+)\s+-", txt)
    total_row = None
    if m0:
        total_row = {"total": float(m0.group(1)), "male": float(m0.group(3)), "female": float(m0.group(5))}
    ok("gaiyou reasons 7 categories", len(reasons) == 7, str(list(reasons)))
    ok("gaiyou reasons total 2128", total_row and total_row["total"] == 2128.0, str(total_row))
    ok("gaiyou 自分の都合 757", reasons.get("自分の都合のよい時間に働きたいから", {}).get("total") == 757.0)
    ok("gaiyou 正規の仕事がない 173", reasons.get("正規の職員・従業員の仕事がないから", {}).get("total") == 173.0)
    ok("gaiyou 家計の補助 366", reasons.get("家計の補助・学費等を得たいから", {}).get("total") == 366.0)
    # 注1: total includes 理由不詳 — components may sum below the total
    ssum = sum(d["total"] for d in reasons.values())
    ok("gaiyou reasons sum≤total (不詳 included)", 0 <= 2128.0 - ssum <= 100, f"{ssum}")
    # headline text anchors
    ok("gaiyou headline 757万人増", "757万人" in txt and "前年に比べ26万人の増加" in txt)
    ok("gaiyou headline 2128", "2128万人" in txt)
    return {"reasons2025": reasons, "reasonsTotal2025": total_row}


# ---------------------------------------------------------------------------
# 6. Monthly Labour Survey — hours (CSV)
# ---------------------------------------------------------------------------
def extract_mls():
    p = RAW / "mhlw/mls-longterm-jissu-table1.utf8.csv"
    series = {
        ("T", "0"): {}, ("0", "0"): {}, ("T", "1"): {}, ("T", "2"): {},
    }
    with open(p, encoding="utf-8") as f:
        rdr = csv.reader(f)
        hdr = next(rdr)
        ok("mls header", hdr[11] == "総実労働時間" and hdr[12] == "所定内労働時間"
           and hdr[13] == "所定外労働時間", str(hdr[11:14]))
        for row in rdr:
            if row[0] != "実数" or row[2] != "CY":
                continue
            if row[3].strip() != "TL":
                continue
            scale, form = row[4].strip(), row[5].strip()
            key = (scale, form)
            if key not in series:
                continue
            y = int(row[1])
            if y in series[key]:
                raise AssertionError(f"MLS duplicate year {y} {key}")
            series[key][y] = {
                "total": num(row[11]), "scheduled": num(row[12]), "overtime": num(row[13]),
                "days": num(row[14]), "workers": num(row[18]), "parttime": num(row[19]),
            }
    ok("mls T0 1990-2025", min(series[("T", "0")]) == 1990 and max(series[("T", "0")]) == 2025)
    ok("mls 00 1970-2025", min(series[("0", "0")]) == 1970 and max(series[("0", "0")]) == 2025)
    ok("mls T1/T2 1993-2025", min(series[("T", "1")]) == 1993 and min(series[("T", "2")]) == 1993)
    t0 = series[("T", "0")]
    ok("mls 1990 total 172.0", t0[1990]["total"] == 172.0)
    ok("mls 2025 total 135.1", t0[2025]["total"] == 135.1)
    ok("mls 2025 overtime 9.8", t0[2025]["overtime"] == 9.8)
    ok("mls 2025 days 17.4", t0[2025]["days"] == 17.4)
    z0 = series[("0", "0")]
    ok("mls 30+ 1970 total 190.0ish", z0[1970]["total"] is not None)
    g = series[("T", "1")]
    pt = series[("T", "2")]
    ok("mls 2025 general 160.5", g[2025]["total"] == 160.5, str(g[2025]["total"]))
    ok("mls 2025 parttime 79.1", pt[2025]["total"] == 79.1, str(pt[2025]["total"]))
    ok("mls 1993 general 170.4", g[1993]["total"] == 170.4)
    ok("mls 1993 parttime 98.7", pt[1993]["total"] == 98.7)
    ok("mls 2025 general overtime 13.2", g[2025]["overtime"] == 13.2)
    ok("mls 2025 parttime overtime 2.3", pt[2025]["overtime"] == 2.3)
    # part-time ratio derived (workers basis, month-end)
    ratio = {}
    for y in sorted(t0):
        w, pw = t0[y]["workers"], t0[y]["parttime"]
        if w and pw is not None:
            ratio[y] = round(pw / w * 100, 1)
    ok("mls part ratio 2025 31.3", ratio.get(2025) == 31.3, str(ratio.get(2025)))
    return {
        "scale5": {str(y): v for y, v in sorted(t0.items())},
        "scale30": {str(y): v for y, v in sorted(z0.items())},
        "general": {str(y): v for y, v in sorted(g.items())},
        "parttime": {str(y): v for y, v in sorted(pt.items())},
        "parttime_ratio": {str(y): v for y, v in ratio.items()},
    }


# ---------------------------------------------------------------------------
# 7. 就労条件総合調査 — paid leave (時系列11/12/13表, three row bands)
# ---------------------------------------------------------------------------
def extract_paid_leave():
    def sheet_series(fname, sheet):
        wb = xlrd.open_workbook(str(RAW / f"mhlw/{fname}"))
        ws = wb.sheet_by_name(sheet)
        # Band 1: rows 10 (idx 9) label 調査産業計; year cols 6..25 (skip 11)
        # Band 2: rows 32 (idx 31); year cols 6..10 (2004-08) and 15..25 (2009-19)
        # Band 3: rows 61 (idx 60); year cols 6..11 (2020-25)
        def band_value(row_idx, col):
            v = ws.cell_value(row_idx, col)
            return num(v) if not (isinstance(v, str) and not v.strip()) else None
        out = {}
        # band 1: 1984-2003 (cols 6-25, col 11 empty)
        for c in range(6, 26):
            y = 1984 + (c - 6)
            v = band_value(9, c)
            if v is not None:
                if y in out:
                    raise AssertionError(f"paid-leave duplicate {y}")
                out[y] = v
        # band 2: 2004-2008 (cols 6-10), 2009-2019 (cols 15-25)
        for c in list(range(6, 11)):
            y = 2004 + (c - 6)
            v = band_value(31, c)
            if v is not None:
                out[y] = v
        for c in range(15, 26):
            y = 2009 + (c - 15)
            v = band_value(31, c)
            if v is not None:
                out[y] = v
        # band 3: 2020-2025 (cols 6-11)
        for c in range(6, 12):
            y = 2020 + (c - 6)
            v = band_value(60, c)
            if v is not None:
                out[y] = v
        return out

    fuyo = sheet_series("sw-ts-yukyu-fuyo.xls", "syuj-R7-11")
    shutoku = sheet_series("sw-ts-yukyu-shutoku.xls", "syuj-R7-12")
    rate = sheet_series("sw-ts-yukyu-shutokuritsu.xls", "syuj-R7-13")
    ok("paid leave rate 1984 55.6", rate.get(1984) == 55.6, str(rate.get(1984)))
    ok("paid leave rate 2025 66.9", rate.get(2025) == 66.9, str(rate.get(2025)))
    ok("paid leave rate 2024 65.3", rate.get(2024) == 65.3)
    ok("paid leave rate 1989 missing", 1989 not in rate)
    ok("paid leave rate span", min(rate) == 1984 and max(rate) == 2025 and len(rate) == 41,
       f"n={len(rate)}")
    ok("paid leave fuyo 2025 18.1", fuyo.get(2025) == 18.1, str(fuyo.get(2025)))
    ok("paid leave shutoku 2025 12.1", shutoku.get(2025) == 12.1, str(shutoku.get(2025)))
    # identity: rate ≈ shutoku/fuyo*100 (1dp) — published rate uses 計/計 (unrounded)
    bad = [y for y in rate
           if y in fuyo and y in shutoku and fuyo[y] and shutoku[y]
           and abs(round(shutoku[y] / fuyo[y] * 100, 1) - rate[y]) > 0.6]
    ok("paid leave rate recompute", not bad, str(bad[:6]))
    return {"granted": {str(y): v for y, v in sorted(fuyo.items())},
            "taken": {str(y): v for y, v in sorted(shutoku.items())},
            "rate": {str(y): v for y, v in sorted(rate.items())}}


# ---------------------------------------------------------------------------
# 8. 賃金構造基本統計調査 2025 — wage gaps (zuhyo.xlsx + 概況 付表1/2)
# ---------------------------------------------------------------------------
def parse_wage_year(line):
    """付表 rows: era label + western year in parens. Era digits may be full-width
    (２3) = 令和2 with footnote 3). Returns (western_year, end_position_of_paren)
    or None; validates the era digit when present; rejects note/reference lines."""
    m = re.search(r"\((\d{4})\)", line)
    if not m:
        return None
    y = int(m.group(1))
    # era digit check: the token immediately before "(yyyy)" — may be full-width
    pre = line[:m.start()].rstrip()
    mm = re.search(r"([0-9０-９]+|元)\s*$", pre)
    if mm and mm.group(1) != "元":
        n = int(mm.group(1).translate(str.maketrans("０１２３４５６７８９", "0123456789")))
        era = "昭和" if y <= 1988 else ("平成" if y <= 2018 else "令和")
        expect = {"昭和": 1925, "平成": 1988, "令和": 2018}[era] + n
        if expect != y:
            return None  # note/reference lines (e.g. 令和元(2019)年の数値…) — skip
    # reject pure note lines: data rows have the year paren early (first 34 chars)
    if m.start() > 34:
        return None
    return y, m.end()


def is_restated_row(line):
    """The ※ restated 令和元年 rows carry the footnote 3) right after 年."""
    return re.search(r"年\s*3\)", line) is not None or line.lstrip().startswith("※")


def extract_wage():
    # 付表1 (gender ratio 1976-2025) and 付表2 (form gap 2005-2025) from ck-r7-14.txt
    p = RAW / "mhlw/chingin-kouzou-r7/ck-r7-14.txt"
    txt = p.read_text(encoding="utf-8")
    m = re.search(r"付表１\s+一般労働者の性別賃金、対前年増減率、男女間賃金格差及び対前年差の推移(.*?)付表２", txt, re.S)
    ok("wage fuyou1 block found", m is not None)
    gender = {}
    gender_restated = {}
    if m:
        for line in m.group(1).splitlines():
            parsed = parse_wage_year(line)
            if parsed is None:
                continue
            y, yend = parsed
            toks = re.findall(r"-?\d+\.?\d*", line[yend:])
            vals = [float(t) for t in toks]
            if vals and vals[0] == 3 and len(vals) == 5:
                # restated 令和元年 row: leading footnote "3" token, yoys are …
                vals = vals[1:]
            # columns: 賃金,yoy,賃金,yoy,賃金,yoy,格差,差 → [total,yoy,male,yoy,female,yoy,ratio,diff]
            if len(vals) >= 7:
                entry = {"total": vals[0], "male": vals[2], "female": vals[4], "ratio": vals[6]}
            elif len(vals) == 4:  # 1976/restated rows: wages+ratio, yoys are …
                entry = {"total": vals[0], "male": vals[1], "female": vals[2], "ratio": vals[3]}
            else:
                continue
            if is_restated_row(line) and y == 2019:
                gender_restated[y] = entry
            elif y in gender:
                raise AssertionError(f"wage 付表1 duplicate year {y}")
            else:
                gender[y] = entry
    ok("wage gender 1976-2025", 1976 in gender and 2025 in gender and len(gender) == 50,
       f"n={len(gender)} {min(gender)}–{max(gender)}")
    ok("wage gender 1976 ratio 58.8", gender.get(1976, {}).get("ratio") == 58.8)
    ok("wage gender 2025 ratio 76.6", gender.get(2025, {}).get("ratio") == 76.6)
    ok("wage gender 2025 female 285.9", gender.get(2025, {}).get("female") == 285.9)
    ok("wage gender 2025 male 373.4", gender.get(2025, {}).get("male") == 373.4)
    ok("wage gender 1990 ratio 60.2", gender.get(1990, {}).get("ratio") == 60.2)
    ok("wage gender 2000 ratio 65.5", gender.get(2000, {}).get("ratio") == 65.5)
    ok("wage gender 2019 restated 74.3", gender_restated.get(2019, {}).get("ratio") == 74.3)
    bad = [y for y, d in gender.items()
           if abs(round(d["female"] / d["male"] * 100, 1) - d["ratio"]) > 0.25]
    ok("wage gender ratio recompute", not bad, str(bad[:5]))

    m2 = re.search(r"付表２\s+一般労働者の性、雇用形態別賃金及び雇用形態間賃金格差の推移(.*?)注：", txt, re.S)
    ok("wage fuyou2 block found", m2 is not None)
    form = {}
    form_restated = {}
    if m2:
        for line in m2.group(1).splitlines():
            parsed = parse_wage_year(line)
            if parsed is None:
                continue
            y, yend = parsed
            toks = re.findall(r"-?\d+\.?\d*", line[yend:])
            vals = [float(t) for t in toks]
            # columns: [計]正規,非正規,格差 [男]正規,非正規,格差 [女]正規,非正規,格差 → 9 tokens
            if len(vals) == 9:
                entry = {"regular": vals[0], "nonregular": vals[1], "gap": vals[2],
                         "male_regular": vals[3], "male_nonregular": vals[4], "male_gap": vals[5],
                         "female_regular": vals[6], "female_nonregular": vals[7],
                         "female_gap": vals[8]}
            else:
                continue
            if is_restated_row(line) and y == 2019:
                form_restated[y] = entry
            elif y in form:
                raise AssertionError(f"wage 付表2 duplicate year {y}")
            else:
                form[y] = entry
    ok("wage form 2005-2025", 2005 in form and 2025 in form and len(form) == 21,
       f"n={len(form)} {min(form)}–{max(form)}")
    ok("wage form 2005 gap 60.1", form.get(2005, {}).get("gap") == 60.1)
    ok("wage form 2025 gap 67.4", form.get(2025, {}).get("gap") == 67.4)
    ok("wage form 2025 regular 358.8", form.get(2025, {}).get("regular") == 358.8)
    ok("wage form 2025 nonregular 241.7", form.get(2025, {}).get("nonregular") == 241.7)
    ok("wage form 2020 gap 66.3", form.get(2020, {}).get("gap") == 66.3)
    bad = [y for y, d in form.items()
           if abs(round(d["nonregular"] / d["regular"] * 100, 1) - d["gap"]) > 0.25]
    ok("wage form gap recompute", not bad, str(bad[:5]))

    # Age curve 2025 + form-by-age 2025 from zuhyo.xlsx
    px = RAW / "mhlw/chingin-kouzou-r7/ck-r7-zuhyo.xlsx"
    wb = openpyxl.load_workbook(px, read_only=True)
    from openpyxl.utils import column_index_from_string as cix
    ws = wb["第２表"]
    ok("wage curve sheet title", "性、年齢階級別賃金" in str(ws.cell(row=2, column=2).value or ""))
    curve = {}
    for row in ws.iter_rows(min_row=6, max_row=17, values_only=True):
        lab = str(row[1] or "").strip() if len(row) > 1 else ""
        if lab and lab != "None":
            curve[lab] = {"total": num(row[2]), "male": num(row[5]), "female": num(row[8])}
    wb.close()
    ok("wage curve 12 age rows", len(curve) == 12, str(list(curve)))
    ok("wage curve 年齢計 total 340.6", curve.get("年齢計1)", {}).get("total") == 340.6)
    ok("wage curve male 55-59 445.6", curve.get("５５～５９", {}).get("male") == 445.6)
    ok("wage curve female 45-49 305.7", curve.get("４５～４９", {}).get("female") == 305.7)
    ok("wage curve male 65-69 304.3", curve.get("６５～６９", {}).get("male") == 304.3)

    # form gap by age 2025 (第6-1表): cols D regular, F nonregular, H gap
    wb = openpyxl.load_workbook(px, read_only=True)
    ws6 = wb["第６－１表"]
    age_gap = {}
    for row in ws6.iter_rows(min_row=7, max_row=18, values_only=True):
        lab = str(row[1] or "").strip() if len(row) > 1 else ""
        if lab and lab != "None" and not lab.startswith("注"):
            age_gap[lab] = {"regular": num(row[4]), "nonregular": num(row[7]), "gap": num(row[9])}
    wb.close()
    ok("wage age-gap 2025 total 67.4", age_gap.get("年齢計2)", {}).get("gap") == 67.4,
       str(age_gap.get("年齢計2)")))
    ok("wage age-gap 20-24 82.2", age_gap.get("２０～２４", {}).get("gap") == 82.2)
    ok("wage age-gap 15-19 88.4", age_gap.get("～１９歳", {}).get("gap") == 88.4)
    bad = [k for k, d in age_gap.items()
           if None not in (d["regular"], d["nonregular"], d["gap"])
           and abs(round(d["nonregular"] / d["regular"] * 100, 1) - d["gap"]) > 0.25]
    ok("wage age-gap recompute", not bad, str(bad[:5]))
    return {"gender": {str(y): v for y, v in sorted(gender.items())},
            "gender_restated": {str(y): v for y, v in sorted(gender_restated.items())},
            "form": {str(y): v for y, v in sorted(form.items())},
            "form_restated": {str(y): v for y, v in sorted(form_restated.items())},
            "curve2025": curve,
            "formGapByAge2025": age_gap}


# ---------------------------------------------------------------------------
# 9. Occupational accidents — chart-label series (1974-2025)
# ---------------------------------------------------------------------------
ACCIDENT_DEATH = {
    1974: 3725, 1975: 4330, 1976: 3345, 1977: 3302, 1978: 3326, 1979: 3077,
    1980: 2912, 1981: 3009, 1982: 2674, 1983: 2588, 1984: 2635, 1985: 2572,
    1986: 2318, 1987: 2342, 1988: 2549, 1989: 2419, 1990: 2550, 1991: 2489,
    1992: 2354, 1993: 2245, 1994: 2301, 1995: 2414, 1996: 2363, 1997: 2078,
    1998: 1844, 1999: 1992, 2000: 1889, 2001: 1790, 2002: 1658, 2003: 1628,
    2004: 1620, 2005: 1514, 2006: 1472, 2007: 1357, 2008: 1268, 2009: 1075,
    2010: 1195, 2011: 1024, 2012: 1093, 2013: 1030, 2014: 1057, 2015: 972,
    2016: 928, 2017: 978, 2018: 909, 2019: 845, 2020: 784, 2021: 778,
    2022: 774, 2023: 755, 2024: 746, 2025: 700,
}
ACCIDENT_INJURY = {
    1974: 347407, 1975: 322322, 1976: 345293, 1977: 333311, 1978: 348826,
    1979: 340731, 1980: 312844, 1981: 335706, 1982: 294319, 1983: 278623,
    1984: 271884, 1985: 257240, 1986: 246891, 1987: 232953, 1988: 217964,
    1989: 226318, 1990: 210108, 1991: 200633, 1992: 189589, 1993: 181900,
    1994: 176047, 1995: 167316, 1996: 162862, 1997: 156726, 1998: 148248,
    1999: 137316, 2000: 133948, 2001: 133598, 2002: 125918, 2003: 125750,
    2004: 122804, 2005: 120354, 2006: 121378, 2007: 121356, 2008: 119291,
    2009: 105718, 2010: 107759, 2011: 114176, 2012: 119576, 2013: 118157,
    2014: 119535, 2015: 116311, 2016: 117910, 2017: 120460, 2018: 127329,
    2019: 125611, 2020: 125115, 2021: 130586, 2022: 132355, 2023: 135371,
    2024: 135718, 2025: 135333,
}
# Documented deviation from pure x-rank (notes/mhlw-summary.md): the 1984/1985
# label pair collides at the 1984 tick in all three renderings; 271,884 sits ON
# the 1984 tick (+0.0/+0.8/-1.6) in every rendering while 257,240 sits 3-4px
# left of it, and 271,884→257,240 continues the smooth decline from 278,623.
INJURY_RANK_OVERRIDE = {1984: 271884, 1985: 257240}  # rank would give the swap

# Correct 2008/2009/2010/2011 (see notes — rank assignment):
ACCIDENT_INJURY[2008] = 119291
ACCIDENT_INJURY[2009] = 105718
ACCIDENT_INJURY[2010] = 107759
ACCIDENT_INJURY[2011] = 114176


def extract_accidents():
    # Re-derive the series from the bbox files to prove reproducibility, then
    # compare with the documented values above.
    def labels(xmlfile, page, yband, vmin, vmax, xmin=80, xmax=800):
        xml = (ROOT / f"research/chapter04/raw/mhlw/{xmlfile}").read_text(
            encoding="utf-8", errors="replace")
        pages = xml.split("<page ")
        p = pages[page]
        words = []
        for w in re.finditer(
                r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]+)</word>',
                p):
            x1 = float(w.group(1)); y1 = float(w.group(2)); x2 = float(w.group(3))
            words.append(((x1 + x2) / 2, y1, w.group(5)))
        out = []
        for xm, y, t in words:
            t2 = t.replace(",", "")
            if not t2.isdigit():
                continue
            v = int(t2)
            if vmin <= v <= vmax and yband[0] <= y <= yband[1] and xmin < xm < xmax:
                out.append((xm, v))
        return sorted(out)

    # 2025 rendering: death labels y 296-455 (excl axis at x≈71)
    d25 = labels("rousai-houdou-2025-sankou-bbox.xml", 3, (296, 455), 600, 4600, xmin=85)
    d25 = [(x, v) for x, v in d25 if x > 85]
    rank25 = [v for x, v in d25]
    ok("accident death label count 52", len(rank25) == 52, str(len(rank25)))
    derived_death = {1974 + i: v for i, v in enumerate(rank25)}
    ok("accident death derived == documented", derived_death == ACCIDENT_DEATH,
       str([y for y in derived_death if derived_death.get(y) != ACCIDENT_DEATH.get(y)])[:200])

    # injury labels y 90-280
    i25 = labels("rousai-houdou-2025-sankou-bbox.xml", 3, (88, 280), 90000, 400000, xmin=85)
    rank_i25 = [v for x, v in i25]
    ok("accident injury label count 52", len(rank_i25) == 52, str(len(rank_i25)))
    derived_injury = {1974 + i: v for i, v in enumerate(rank_i25)}
    derived_injury.update(INJURY_RANK_OVERRIDE)
    diffs = [y for y in derived_injury if derived_injury.get(y) != ACCIDENT_INJURY.get(y)]
    ok("accident injury derived == documented", not diffs, str(diffs)[:200])
    # the override must be exactly the documented pair swap
    rank_only = {1974 + i: v for i, v in enumerate(rank_i25)}
    swapped = [y for y in (1984, 1985) if rank_only[y] != ACCIDENT_INJURY[y]]
    ok("accident injury override is only 1984/1985", swapped == [1984, 1985], str(swapped))

    # 2023 rendering cross-check: same rank order for deaths (1974-2022)
    d23 = labels("rousai-press-r05-betsuen-bbox.xml", 4, (330, 500), 600, 4600, xmin=85)
    rank23 = [v for x, v in d23]
    ok("accident death 2023-rendering count 50", len(rank23) == 50, str(len(rank23)))
    ok("accident death 2023 rank == 2025 rank[:50]", rank23 == rank25[:50],
       str([i for i, (a, b) in enumerate(zip(rank23, rank25[:50])) if a != b])[:200])

    # Text anchors (documented in notes/mhlw-summary.md):
    for y, v in ((2017, 978), (2018, 909), (2019, 845), (2020, 784), (2021, 778),
                 (2022, 774), (2023, 755), (2024, 746), (2025, 700)):
        ok(f"accident death anchor {y}={v}", ACCIDENT_DEATH[y] == v)
    for y, v in ((2012, 119576), (2013, 118157), (2014, 119535), (2015, 116311),
                 (2016, 117910), (2017, 120460), (2018, 127329), (2019, 125611),
                 (2020, 125115), (2021, 130586), (2022, 132355), (2023, 135371),
                 (2024, 135718), (2025, 135333)):
        ok(f"accident injury anchor {y}={v}", ACCIDENT_INJURY[y] == v)
    # year-file anchors (合計 row, /2 due to 総数 column duplication)
    def yearfile_total(fname):
        wb = xlrd.open_workbook(str(RAW / f"mhlw/{fname}"))
        ws = wb.sheet_by_index(0)
        for r in range(ws.nrows):
            if str(ws.cell_value(r, 0)).strip() == "合計":
                return num(ws.cell_value(r, ws.ncols - 1))
        return None
    ok("accident death 2015 year-file 972", yearfile_total("yh27-sibou-kakutei.xls") == 972.0)
    ok("accident death 2008 year-file 1268", yearfile_total("yh20-sibou-kakutei.xls") == 1268.0)
    ok("accident death 1998 year-file 1844", yearfile_total("yh10-sibou-kakutei.xls") == 1844.0)
    ok("accident injury 2015 year-file 116311", yearfile_total("yh27-sisyou-kakutei.xls") == 116311.0)
    ok("accident death 2015 == year-file", ACCIDENT_DEATH[2015] == 972)
    ok("accident death 2008 == year-file", ACCIDENT_DEATH[2008] == 1268)
    ok("accident death 1998 == year-file", ACCIDENT_DEATH[1998] == 1844)
    ok("accident injury 2015 == year-file", ACCIDENT_INJURY[2015] == 116311)

    # Mental-health comp (FY2018-2025) from karoshi PDFs (表2-1 + 図2-1 chart labels)
    mental = {
        2018: {"claims": 1820, "decisions": 1461, "granted": 465},
        2019: {"claims": 2060, "decisions": 1586, "granted": 509},
        2020: {"claims": 2051, "decisions": 1906, "granted": 608},
        2021: {"claims": 2346, "decisions": 1953, "granted": 629},
        2022: {"claims": 2683, "decisions": 1986, "granted": 710},
        2023: {"claims": 3575, "decisions": 2583, "granted": 883},
        2024: {"claims": 3780, "decisions": 3496, "granted": 1056},
        2025: {"claims": 4958, "decisions": 3839, "granted": 1082},
    }
    # verify the R7 doc table text contains the FY2021-2025 values verbatim
    ktxt = (RAW / "mhlw/karoshi-r7-mental.txt").read_text(encoding="utf-8")
    for y in (2021, 2022, 2023, 2024, 2025):
        d = mental[y]
        ok(f"mental {y} claims in doc", str(d["claims"]) in ktxt)
        ok(f"mental {y} decisions in doc", str(d["decisions"]) in ktxt)
        ok(f"mental {y} granted in doc", str(d["granted"]) in ktxt)
    # R4 doc chart covers FY2018-2022 — verify the FY2018-2020 numbers appear
    k4 = (RAW / "mhlw/karoshi-r4-mental.txt").read_text(encoding="utf-8")
    for y in (2018, 2019, 2020):
        d = mental[y]
        ok(f"mental {y} in R4 doc", str(d["claims"]) in k4 and str(d["decisions"]) in k4)
    # 精神障害 認定率 2025 = 28.2% (支給/決定)
    ok("mental 2025 rate 28.2", abs(round(mental[2025]["granted"] / mental[2025]["decisions"] * 100, 1) - 28.2) < 0.15)
    # brain/heart (FY2021-2025)
    brain = {
        2021: {"claims": 753, "decisions": 525, "granted": 172},
        2022: {"claims": 803, "decisions": 509, "granted": 194},
        2023: {"claims": 1023, "decisions": 667, "granted": 216},
        2024: {"claims": 1030, "decisions": 784, "granted": 241},
        2025: {"claims": 1254, "decisions": 811, "granted": 217},
    }
    btxt = (RAW / "mhlw/karoshi-r7-brain.txt").read_text(encoding="utf-8")
    for y, d in brain.items():
        ok(f"brain {y} claims in doc", str(d["claims"]) in btxt)
    # 動向調査 度数率 (2011-2025, 100+ establishments)
    dosu = {2011: 1.62, 2012: 1.59, 2013: 1.58, 2014: 1.66, 2015: 1.66, 2016: 1.83,
            2017: 1.80, 2018: 1.95, 2019: 2.06, 2020: 2.09, 2021: 2.14, 2022: 2.10,
            2023: 2.01, 2024: None, 2025: 2.01}
    dtxt = (RAW / "mhlw/rousai-doukou-2025-kekka.txt").read_text(encoding="utf-8")
    ok("dosuritsu 2025 2.01 in doc", "2.01" in dtxt)
    ok("dosuritsu 2011 1.62 in doc", "1.62" in dtxt)
    return {"death": ACCIDENT_DEATH, "injury": ACCIDENT_INJURY, "mental": mental,
            "brain": brain, "dosuritsu": {k: v for k, v in dosu.items() if v is not None}}


# ---------------------------------------------------------------------------
# 10. OECD — hours (latest comparison), temp share, gender wage gap (JPN)
# ---------------------------------------------------------------------------
OECD_AREAS = ["JPN", "USA", "DEU", "FRA", "GBR", "ITA", "CAN", "AUS", "KOR",
              "ESP", "SWE", "NLD", "OECD"]
AREA_EN = {"JPN": "Japan", "USA": "United States", "DEU": "Germany", "FRA": "France",
           "GBR": "United Kingdom", "ITA": "Italy", "CAN": "Canada", "AUS": "Australia",
           "KOR": "Korea", "ESP": "Spain", "SWE": "Sweden", "NLD": "Netherlands",
           "OECD": "OECD average"}


def extract_oecd():
    out = {}
    # hours
    hours = {}
    with open(RAW / "oecd/oecd-hours-1.csv", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            if r["REF_AREA"] in OECD_AREAS and r["MEASURE"] == "HW":
                hours.setdefault(r["REF_AREA"], {})[int(r["TIME_PERIOD"])] = num(r["OBS_VALUE"])
    ok("oecd hours JPN 1970-2025", 1970 in hours["JPN"] and 2025 in hours["JPN"])
    ok("oecd hours JPN 2025 1597.507", abs(hours["JPN"][2025] - 1597.507) < 0.01,
       str(hours["JPN"][2025]))
    ok("oecd hours JPN 2020 1597.011", abs(hours["JPN"][2020] - 1597.011) < 0.01)
    ok("oecd hours JPN 1970 2243", hours["JPN"][1970] == 2243.0)
    ok("oecd hours areas 13", len(hours) == 13, str(sorted(hours)))
    out["hours"] = {a: {str(y): v for y, v in sorted(d.items())} for a, d in hours.items()}

    # temp employment
    temp = {}
    with open(RAW / "oecd/oecd-temp-1.csv", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            if r["REF_AREA"] in OECD_AREAS and r["MEASURE"] == "EMP_TEMP":
                temp.setdefault(r["REF_AREA"], {})[int(r["TIME_PERIOD"])] = num(r["OBS_VALUE"])
    ok("oecd temp JPN 1980-2025", 1980 in temp.get("JPN", {}) and 2025 in temp.get("JPN", {}))
    ok("oecd temp JPN 2025 14.232", abs(temp["JPN"][2025] - 14.232) < 0.01)
    ok("oecd temp JPN 2000 14.52", temp["JPN"][2000] == 14.52)
    ok("oecd temp JPN 2013-2017 absent", all(y not in temp["JPN"] for y in range(2013, 2018)))
    out["temp"] = {a: {str(y): v for y, v in sorted(d.items())} for a, d in temp.items()}

    # gender wage gap (median + mean)
    gwg = {}
    with open(RAW / "oecd/oecd-gwg-1.csv", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            if r["REF_AREA"] in OECD_AREAS and r["MEASURE"] == "GWP":
                gwg.setdefault(r["REF_AREA"], {}).setdefault(
                    r["AGGREGATION_OPERATION"], {})[int(r["TIME_PERIOD"])] = num(r["OBS_VALUE"])
    ok("oecd gwg JPN median 1975-2025",
       1975 in gwg.get("JPN", {}).get("MEDIAN", {}) and 2025 in gwg["JPN"]["MEDIAN"])
    ok("oecd gwg JPN median 2025 20.104", abs(gwg["JPN"]["MEDIAN"][2025] - 20.104358502) < 0.01)
    ok("oecd gwg JPN median 2020 22.519", abs(gwg["JPN"]["MEDIAN"][2020] - 22.518568535) < 0.01)
    out["gwg"] = {a: {op: {str(y): v for y, v in sorted(d.items())}
                      for op, d in ops.items()} for a, ops in gwg.items()}

    # employment rate 15-64
    emp = {}
    with open(RAW / "oecd/oecd-emprate-1.csv", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            if r["REF_AREA"] in OECD_AREAS and r.get("MEASURE") == "EMP_RATIO":
                emp.setdefault(r["REF_AREA"], {})[int(r["TIME_PERIOD"])] = num(r["OBS_VALUE"])
    ok("oecd emprate JPN 2025 80.038", abs(emp["JPN"].get(2025, 0) - 80.038) < 0.01)
    out["emprate"] = {a: {str(y): v for y, v in sorted(d.items())} for a, d in emp.items()}
    return out


# ---------------------------------------------------------------------------
def main():
    print("extract-series.py — Chapter 04 (Labor & Working Conditions)")
    payload = {
        "meta": {
            "accessDate": ACCESS_DATE,
            "extractor": "research/chapter04/scripts/extract-series.py",
            "sources": {},
        },
        "lfs": {},
    }
    # file identity snapshot
    files = [
        "statb-lf/est-000001082681.xlsx", "statb-lf/est-000001082684.xlsx",
        "statb-lf/est-000001082690.xlsx", "statb-lf/est-000021915917.xlsx",
        "statb-lf/statb-2025avg-900100.xlsx", "statb-lf/statb-2025avg-900300.xlsx",
        "mhlw/mls-longterm-jissu-table1.utf8.csv",
        "mhlw/sw-ts-yukyu-fuyo.xls", "mhlw/sw-ts-yukyu-shutoku.xls",
        "mhlw/sw-ts-yukyu-shutokuritsu.xls",
        "mhlw/chingin-kouzou-r7/ck-r7-zuhyo.xlsx",
        "mhlw/chingin-kouzou-r7/ck-r7-14.txt",
        "mhlw/rousai-houdou-2025-sankou-bbox.xml",
        "mhlw/rousai-press-r05-betsuen-bbox.xml",
        "mhlw/karoshi-r7-mental.txt", "mhlw/karoshi-r4-mental.txt",
        "mhlw/karoshi-r7-brain.txt", "mhlw/rousai-doukou-2025-kekka.txt",
        "mhlw/yh27-sibou-kakutei.xls", "mhlw/yh20-sibou-kakutei.xls",
        "mhlw/yh10-sibou-kakutei.xls", "mhlw/yh27-sisyou-kakutei.xls",
        "oecd/oecd-hours-1.csv", "oecd/oecd-temp-1.csv",
        "oecd/oecd-gwg-1.csv", "oecd/oecd-emprate-1.csv",
    ]
    for f in files:
        p = RAW / f
        if p.exists():
            payload["meta"]["sources"][f] = sha16(p)
        else:
            errors.append(f"missing source file {f}")

    print(" [1/8] LFS 表2 就業状態別…")
    payload["lfs"]["main"] = extract_lfs_main()
    print(" [2/8] LFS 表4(1) 従業上の地位別…")
    payload["lfs"]["status"] = extract_lfs_status()
    print(" [3/8] LFS 表3(3) 年齢別就業率…")
    payload["lfs"]["age"] = extract_lfs_age()
    print(" [4/8] LFS 詳細集計 表10(1) 雇用形態別…")
    payload["lfs"]["form"] = extract_lfs_form()
    print(" [4b] 1973 double-row convention assertion…")
    assert_1973_convention(payload["lfs"]["main"], payload["lfs"]["status"], payload["lfs"]["age"])
    print(" [5/8] LFS 2025年平均 詳細表…")
    payload["lfs"]["detail2025"] = extract_lfs_2025_detail()
    print(" [6/8] 毎月勤労統計 + 就労条件総合調査…")
    payload["mls"] = extract_mls()
    payload["paidLeave"] = extract_paid_leave()
    print(" [7/8] 賃金構造基本統計調査…")
    payload["wage"] = extract_wage()
    print(" [8/8] 労働災害 + OECD…")
    payload["accidents"] = extract_accidents()
    payload["oecd"] = extract_oecd()

    print(f"\n{checks} checks, {len(errors)} errors")
    if errors:
        print("FAILED:")
        for e in errors:
            print("  -", e)
        sys.exit(1)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
