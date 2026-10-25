#!/usr/bin/env python3
"""
Japan Clarity — Chapter 02 master series extraction.

Extracts every published series used by Chapter 02 (Economy & Industry) directly
from the raw evidence archived under research/chapter02/raw/ and writes
research/chapter02/notes/extracted-series.json, printing an anchor-validation
report to stdout.

Stages (each guarded by ANCHORS — values read verbatim from the raw documents;
every anchor was verified by reading the raw files before it was written here):
  [esri]  Cabinet Office ESRI 2024 annual national accounts (年次推計,
          2020 base, 2008SNA, published 2025-12-23):
          - main series 暦年 nominal/real GDP + deflator + real growth
            (2024fcm1n/rn/dn_jp.xlsx)
          - household net disposable income (2024i5_jp.xlsx 暦年（２）)
          - economic-activity value added + employment (2024s2n/s3_jp.xlsx;
          16-activity rows aggregated to 第一次/第二次/第三次産業 per the
          standard ESRI activity grouping — derivation documented in
          notes/esri-inventory.md; group sums verified against the printed
          経済活動計 totals row).
  [mhlw]  MHLW Monthly Labour Survey wage/hours index chain (see
          notes/mhlw-statb-inventory.md for the vintage chain).
  [lfs]   Statistics Bureau Labour Force Survey long series.
  [rd]    Statistics Bureau R&D survey 結果の概要 PDF chain.
  [oecd]  OECD Productivity database (GDP per hour worked, PPP).
  [wb]    World Bank WDI API JSON responses (CC BY 4.0).

Usage: python3 research/chapter02/scripts/extract-series.py [--only esri,mhlw,...]
"""

import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[3]
RAW = ROOT / "research" / "chapter02" / "raw"
NOTES = ROOT / "research" / "chapter02" / "notes"
OUT = NOTES / "extracted-series.json"

failures = 0
checks = 0


def ok(name, condition, detail=""):
    global failures, checks
    checks += 1
    if condition:
        print(f"  [OK ] {name}")
    else:
        failures += 1
        print(f"  [FAIL] {name} — {detail}")


def anchor(name, actual, expected, tol=1e-6):
    ok(name, actual is not None and abs(actual - expected) <= tol,
       f"got {actual!r}, expected {expected!r}")


# ---------------------------------------------------------------------------
# Sheet helpers
# ---------------------------------------------------------------------------

def sheet_rows(path, sheet):
    wb = openpyxl.load_workbook(path, data_only=True, read_only=True)
    ws = wb[sheet]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    return rows


def year_axis(rows):
    """Row 7 (index 6) carries AD years; return [(col_index, year)]."""
    out = []
    row = rows[6]
    for idx, cell in enumerate(row):
        if isinstance(cell, (int, float)) and 1950 < cell < 2100:
            out.append((idx, int(cell)))
    return out


def row_by_label(rows, needle, col=0):
    for i, r in enumerate(rows):
        v = r[col]
        if v is None:
            continue
        s = str(v).replace("　", "").replace(" ", "")
        if needle.replace("　", "").replace(" ", "") in s:
            return i, r
    return None, None


def series_from_row(rows, needle, axis, col=0):
    """Extract {year: value} for the row whose label contains needle."""
    i, r = row_by_label(rows, needle, col)
    if r is None:
        return None, f"row not found: {needle}"
    out = {}
    for idx, year in axis:
        v = r[idx]
        if isinstance(v, (int, float)):
            out[year] = float(v)
        elif v is not None and str(v).strip() not in ("-", "…", "‐"):
            return None, f"non-numeric cell {year}={v!r} in row {needle}"
    return out, None


# ---------------------------------------------------------------------------
# ESRI stage
# ---------------------------------------------------------------------------

# Standard ESRI 16-activity -> sector grouping (経済活動別分類の慣行):
#   第一次産業 = 農林水産業
#   第二次産業 = 鉱業 + 製造業 + 電気・ガス・水道・廃棄物処理業 + 建設業
#   第三次産業 = 残りの全サービス活動 (卸売・小売 … その他のサービス)
ESRI_ACTIVITIES = {
    "１．農林水産業": "primary",
    "２．鉱　　　業": "secondary",
    "３．製　造　業": "secondary",
    "４．電気・ガス・水道・廃棄物処理業": "secondary",
    "５．建　設　業": "secondary",
    "６．卸売・小売業": "tertiary",
    "７．運輸・郵便業": "tertiary",
    "８．宿泊・飲食サービス業": "tertiary",
    "９．情報通信業": "tertiary",
    "１０．金融・保険業": "tertiary",
    "１１．不動産業": "tertiary",
    "１２．専門・科学技術、業務支援サービス業": "tertiary",
    "１３．公　　　務": "tertiary",
    "１４．教　　　育": "tertiary",
    "１５．保健衛生・社会事業": "tertiary",
    "１６．その他のサービス": "tertiary",
}


def stage_esri():
    print("\n[esri] Cabinet Office ESRI 2024 annual national accounts")
    esri = {}

    # ---- 1. Main series: nominal / real / deflator / growth ----------------
    for fname, sheet, rowkey, field in [
        ("esri-2024fcm1n_jp.xlsx", "実数", "５．　国内総生産（支出側）", "nominal"),
        ("esri-2024fcm1rn_jp.xlsx", "実数", "５．　国内総生産（支出側）", "real"),
        ("esri-2024fcm1dn_jp.xlsx", "実数", "５．　国内総生産（支出側）", "deflator"),
    ]:
        rows = sheet_rows(RAW / "esri" / fname, sheet)
        axis = year_axis(rows)
        vals, err = series_from_row(rows, rowkey, axis)
        ok(f"esri gdp {field}: series extracted", vals is not None and len(vals) >= 31, err or str(len(vals or {})))
        esri.setdefault("gdp", {})[field] = vals
        ok(f"esri gdp {field}: years 1994–2024", vals is not None and min(vals) == 1994 and max(vals) == 2024)

    g = esri["gdp"]
    anchor("esri gdp nominal 1994 = 521,675.1 十億円", g["nominal"][1994], 521675.1)
    anchor("esri gdp nominal 2024 = 634,226.0 十億円", g["nominal"][2024], 634226.0)
    anchor("esri gdp real 1994 = 464,267.4 十億円", g["real"][1994], 464267.4)
    anchor("esri gdp real 2024 = 584,471.1 十億円", g["real"][2024], 584471.1)
    anchor("esri deflator 1994 = 112.4", g["deflator"][1994], 112.4)
    anchor("esri deflator 2024 = 108.5", g["deflator"][2024], 108.5)
    # internal consistency: nominal ≈ real × deflator / 100 (chain-linked,
    # so allow 0.3% rounding/chain effect)
    for y in (1994, 2024):
        approx = g["real"][y] * g["deflator"][y] / 100.0
        ok(f"esri gdp internal consistency {y} (nominal ≈ real×deflator/100)",
           abs(approx - g["nominal"][y]) / g["nominal"][y] < 0.003,
           f"{approx:.1f} vs {g['nominal'][y]:.1f}")

    # Real growth — published 対前年増加率 sheet (1995–2024)
    rows = sheet_rows(RAW / "esri" / "esri-2024fcm1rn_jp.xlsx", "増加率")
    axis = year_axis(rows)
    vals, err = series_from_row(rows, "５．　国内総生産（支出側）", axis)
    ok("esri gdp realGrowth: series extracted", vals is not None and len(vals) == 30, err or str(len(vals or {})))
    g["realGrowth"] = vals
    anchor("esri realGrowth 1995 = 2.3%", g["realGrowth"][1995], 2.3)
    anchor("esri realGrowth 2024 = −0.2%", g["realGrowth"][2024], -0.2)
    # cross-check a mid-year growth against real levels (recompute)
    y = 2020
    computed = (g["real"][y] / g["real"][y - 1] - 1) * 100
    ok("esri realGrowth 2020 matches real levels",
       abs(computed - g["realGrowth"][y]) < 0.05, f"computed {computed:.2f} vs published {g['realGrowth'][y]}")

    # ---- 2. Household net disposable income (暦年) --------------------------
    rows = sheet_rows(RAW / "esri" / "esri-2024i5_jp.xlsx", "暦年（２）")
    axis = year_axis(rows)
    vals, err = series_from_row(rows, "2.4 　可処分所得（純）", axis)
    ok("esri household netDisposableIncome extracted", vals is not None and len(vals) == 31, err or str(len(vals or {})))
    anchor("esri household disposable 1994 = 297,177.1 十億円", vals[1994], 297177.1)
    anchor("esri household disposable 2024 = 329,715.5 十億円", vals[2024], 329715.5)
    esri["household"] = {"netDisposableIncome": vals}

    # ---- 3. Industry value added (経済活動別, nominal, 暦年 1994–2024) ------
    wb = openpyxl.load_workbook(RAW / "esri" / "esri-2024s2n_jp.xlsx", data_only=True, read_only=True)
    sheet_year = {}
    for name in wb.sheetnames:
        rows = list(wb[name].iter_rows(values_only=True))
        # header row 4 (index 3): "平成6暦年 (1994)" or "令和6暦年 (2024)"
        m = re.search(r"(19|20)\d{2}", str(rows[3][1] or ""))
        if m:
            sheet_year[int(m.group(0))] = name
    ok("esri industry: 31 yearly sheets 1994–2024",
       len(sheet_year) == 31 and min(sheet_year) == 1994 and max(sheet_year) == 2024,
       str((len(sheet_year), min(sheet_year), max(sheet_year))))

    va = {s: {} for s in ("primary", "secondary", "tertiary", "manufacturing", "totalActivities", "gdpTotal")}
    for year, name in sorted(sheet_year.items()):
        rows = list(wb[name].iter_rows(values_only=True))
        col_va = 3  # column D = 国内総生産(=付加価値) per header (3)=(1)-(2)
        sums = {s: 0.0 for s in ("primary", "secondary", "tertiary")}
        for r in rows[7:38]:
            label = str(r[0] or "")
            compact = label.replace("　", "").replace(" ", "")
            sector = None
            for activity_key, sec in ESRI_ACTIVITIES.items():
                if compact.startswith(activity_key.replace("　", "").replace(" ", "")[:6]):
                    sector = sec
                    break
            if sector is None:
                continue
            v = r[col_va]
            if isinstance(v, (int, float)):
                sums[sector] += float(v)
                if sector == "secondary" and compact.startswith("３．製造業".replace("　", "")):
                    va["manufacturing"][year] = float(v)
        va["primary"][year] = sums["primary"]
        va["secondary"][year] = sums["secondary"]
        va["tertiary"][year] = sums["tertiary"]
        i_total, r_total = row_by_label(rows, "経済活動　計")
        if r_total is not None and isinstance(r_total[col_va], (int, float)):
            va["totalActivities"][year] = float(r_total[col_va])
        i_gdp, r_gdp = row_by_label(rows, "合　　　　　計")
        if r_gdp is not None and isinstance(r_gdp[col_va], (int, float)):
            va["gdpTotal"][year] = float(r_gdp[col_va])
    wb.close()

    # sector sums must reproduce the printed 経済活動計 within rounding
    worst = max(
        abs(va["primary"][y] + va["secondary"][y] + va["tertiary"][y] - va["totalActivities"][y])
        for y in va["totalActivities"]
    )
    ok("esri industry: 16-activity sector sums ≈ printed 経済活動計 (≤0.5 十億円)", worst <= 0.5, f"worst {worst:.3f}")
    anchor("esri industry manufacturing VA 1994 = 122,042.1 十億円", va["manufacturing"][1994], 122042.1)
    anchor("esri industry manufacturing VA 2024 = 119,345.1 十億円", va["manufacturing"][2024], 119345.1)
    anchor("esri industry totalActivities VA 2024 = 628,936.0 十億円", va["totalActivities"][2024], 628936.0)
    shares = {
        s: {y: va[s][y] / va["totalActivities"][y] * 100.0 for y in sorted(va["totalActivities"])}
        for s in ("primary", "secondary", "tertiary", "manufacturing")
    }
    ok("esri industry shares sum to ~100% each year",
       all(abs(shares["primary"][y] + shares["secondary"][y] + shares["tertiary"][y] - 100) < 0.01
           for y in shares["primary"]))
    esri["industry"] = {"valueAdded": va, "shares": shares}

    # ---- 4. Employment by activity (暦年, 万人) -----------------------------
    rows = sheet_rows(RAW / "esri" / "esri-2024s3_jp.xlsx", "暦年（１）就業者")
    axis = year_axis(rows)
    emp = {}
    for sector, needles in {
        "primary": ["１．農林水産業"],
        "secondary": ["２．鉱", "３．製造業", "４．電気・ガス", "５．建設業"],
        "manufacturing": ["３．製造業"],
    }.items():
        total = None
        for needle in needles:
            vals, err = series_from_row(rows, needle, axis)
            ok(f"esri employment row {needle} extracted", vals is not None, err or "")
            if vals is None:
                continue
            if total is None:
                total = dict(vals)
            else:
                for y, v in vals.items():
                    total[y] = total.get(y, 0) + v
        emp[sector] = total
    tertiary = None
    i_tot, r_tot = row_by_label(rows, "合　　　計")
    total = {}
    for idx, year in axis:
        v = r_tot[idx]
        if isinstance(v, (int, float)):
            total[year] = float(v)
    ok("esri employment total extracted 1994–2024", len(total) == 31 and min(total) == 1994)
    tertiary = {y: total[y] - emp["primary"][y] - emp["secondary"][y] for y in total}
    emp["tertiary"] = tertiary
    emp["total"] = total
    anchor("esri employment total 1994 = 6,698.3 万人", total[1994], 6698.3)
    anchor("esri employment total 2024 = 6,928.4 万人", total[2024], 6928.4)
    anchor("esri employment primary 1994 = 485.7 万人", emp["primary"][1994], 485.7)
    anchor("esri employment manufacturing 2024 = 1,010.1 万人", emp["manufacturing"][2024], 1010.1)
    worst = max(abs(emp["primary"][y] + emp["secondary"][y] + emp["tertiary"][y] - total[y]) for y in total)
    ok("esri employment sector sums = printed total", worst < 0.05, f"worst {worst:.3f}")
    emp_shares = {s: {y: emp[s][y] / total[y] * 100.0 for y in sorted(total)}
                  for s in ("primary", "secondary", "tertiary", "manufacturing")}
    esri["employment"] = {"persons": emp, "shares": emp_shares}

    return esri


# ---------------------------------------------------------------------------
# MHLW Monthly Labour Survey stage (wage index chain across vintages)
# ---------------------------------------------------------------------------

import xlrd


def _fw_digits(s):
    """Normalize full-width digits to ASCII."""
    return s.translate(str.maketrans("０１２３４５６７８９", "0123456789"))


def _era_years(rows, col, start_pattern):
    """Decode era-labelled year rows (平成17年 / continuation '　　18').

    Returns {year: row_values} for annual rows only (quarter/month rows
    containing 期/月 are skipped). Column `col` holds the label.
    """
    out = {}
    era = None
    year = None
    for r in rows:
        label = _fw_digits(str(r[col] or "")).strip()
        if not label:
            continue
        m = re.match(r"^(昭和|平成|令和)\s*(\d+)年", label)
        if m:
            era = m.group(1)
            n = int(m.group(2))
            year = {"昭和": 1925, "平成": 1988, "令和": 2018}[era] + n
            out[year] = r
            continue
        m2 = re.match(r"^(\d+)\s*年?$", label)
        if m2 and year is not None and era == "平成":
            # continuation numeral: Heisei n (compact form, e.g. '18' after 平成17年)
            n = int(m2.group(1))
            if 8 <= n <= 31:  # plausible Heisei continuation
                y = 1988 + n
                if y == year + 1 or (year % 100) + 1 == n:
                    out[y] = r
                    year = y
    return out


def _xlsx_year_rows(path, sheet):
    """{'2018年'} → {year: (index, yoy, real_yoy)} — FIRST block only.

    The sheet repeats year-labelled rows for later series blocks
    (きまって支給する給与 etc.); collection stops at the first
    non-annual row after the annual sequence begins.
    """
    rows = sheet_rows(path, sheet)
    out = {}
    started = False
    for r in rows:
        label = _fw_digits(str(r[0] or "")).strip()
        m = re.match(r"^(20\d\d)年$", label)
        if m:
            started = True
            out[int(m.group(1))] = (r[2], r[3], r[4])
        elif started:
            break
    return out


def stage_mhlw():
    print("\n[mhlw] Monthly Labour Survey — wage index chain (調査産業計, 現金給与総額)")
    mhlw = {}
    raw = RAW / "mhlw"

    def xls_annual(fname, sheet, idx_col, yoy_col):
        wb = xlrd.open_workbook(raw / fname)
        ws = wb.sheet_by_name(sheet)
        rows = [ws.row_values(i) for i in range(ws.nrows)]
        start = re.search(r"平成\s*(\d+)年", _fw_digits(str(rows[0][0] or "")) + "平成1年")
        labeled = _era_years(rows, 0, None)
        out = {}
        for y, r in labeled.items():
            try:
                idx_v = float(r[idx_col]) if str(r[idx_col]).strip() not in ("", "-") else None
                yoy_v = float(r[yoy_col]) if str(r[yoy_col]).strip() not in ("", "-") else None
            except (ValueError, TypeError):
                continue
            out[y] = (idx_v, yoy_v)
        return out

    # --- vintage tables -------------------------------------------------------
    # nominal 現金給与総額 (調査産業計): (file, sheet, idx_col, yoy_col, base_year)
    vintages_n = {
        "19t (H17=100, 1995–2007)": ("19t01r.xls", "賃金指数", 1, 2, 2005),
        "27t (H22=100, 2003–2015)": ("27t01r.xls", "賃金指数", 1, 2, 2010),
        "29ct (H27=100, 2005–2017)": ("29ct01r.xls", "賃金指数", 2, 3, 2015),
    }
    # real 現金給与総額 (調査産業計)
    vintages_r = {
        "19t06 (H17=100, 1997–2007)": ("19t06r.xls", "労働異動率・実質賃金", 1, 2, 2005),
        "27t06 (H22=100, 2005–2015)": ("27t06r.xls", "実質賃金", 1, 2, 2010),
        "29ct06 (H27=100, 2005–2017)": ("29ct06r.xls", "実質賃金", 2, 3, 2015),
    }
    nom = {}
    for label, (f, s, ic, yc, base) in vintages_n.items():
        nom[label] = xls_annual(f, s, ic, yc)
        ok(f"mhlw nominal {label}: base-year {base} = 100.0",
           abs(nom[label][base][0] - 100.0) < 0.05, str(nom[label][base][0]))
    rea = {}
    for label, (f, s, ic, yc, base) in vintages_r.items():
        rea[label] = xls_annual(f, s, ic, yc)
        ok(f"mhlw real {label}: base-year {base} = 100.0",
           abs(rea[label][base][0] - 100.0) < 0.05, str(rea[label][base][0]))

    A = nom["19t (H17=100, 1995–2007)"]
    A27 = nom["27t (H22=100, 2003–2015)"]
    B = nom["29ct (H27=100, 2005–2017)"]
    A6 = rea["19t06 (H17=100, 1997–2007)"]
    A276 = rea["27t06 (H22=100, 2005–2015)"]
    B6 = rea["29ct06 (H27=100, 2005–2017)"]

    # latest vintage (annual 2018–2025 from the 2025 final + unchanged in 2608)
    C = _xlsx_year_rows(raw / "25ct01r.xlsx", "賃金指数")
    C2608 = _xlsx_year_rows(raw / "2608t01r.xlsx", "賃金指数")
    ok("mhlw 25ct: 2020 = 100.0", abs(float(C[2020][0]) - 100.0) < 0.05, str(C[2020][0]))
    anchor("mhlw 25ct 2018 nominal index = 101.6", float(C[2018][0]), 101.6)
    anchor("mhlw 25ct 2025 nominal index = 111.7", float(C[2025][0]), 111.7)
    anchor("mhlw 25ct 2024 nominal YoY = +2.8%", float(C[2024][1]), 2.8)
    anchor("mhlw 25ct 2025 real YoY = −1.3%", float(str(C[2025][2]).replace("－", "-").strip()), -1.3)
    same = all(float(C[y][0]) == float(C2608[y][0]) for y in (2022, 2023, 2024, 2025))
    ok("mhlw 2608 vintage (2026-08 final) did not revise 2022–2025 annual levels", same)

    # --- cross-vintage YoY consistency (base-independent) ---------------------
    worst_n = max(abs(A[y][1] - B[y][1]) for y in (2006, 2007))
    ok("mhlw nominal YoY 19t vs 29ct overlap (2006–2007) ≤ 0.35pp", worst_n <= 0.35, f"worst {worst_n}")
    worst_n27 = max(abs(A27[y][1] - B[y][1]) for y in range(2006, 2016))
    ok("mhlw nominal YoY 27t vs 29ct overlap (2006–2015) ≤ 0.35pp", worst_n27 <= 0.35, f"worst {worst_n27}")
    worst_r = max(abs(A6[y][1] - B6[y][1]) for y in (2006, 2007))
    ok("mhlw real YoY 19t06 vs 29ct06 overlap (2006–2007) ≤ 0.35pp", worst_r <= 0.35, f"worst {worst_r}")
    worst_r27 = max(abs(A276[y][1] - B6[y][1]) for y in range(2006, 2016))
    ok("mhlw real YoY 27t06 vs 29ct06 overlap (2006–2015) ≤ 0.35pp", worst_r27 <= 0.35, f"worst {worst_r27}")

    # --- chain construction (growth-chain, 2020年平均=100 anchor) ------------
    # Method (documented against MHLW 利用上の注意 6, 8, 9):
    #  - The published 前年比 / 実質前年比 are the authoritative growth rates
    #    (note 9: since the Jan-2024 benchmark update to the 2021 Economic
    #    Census, official YoY is computed against a benchmark-updated 2023
    #    reference, so it intentionally does NOT equal the raw index-level
    #    change — raw levels jump ~+2.6% at 2024).
    #  - We therefore chain PUBLISHED YoY values, anchored at 2020=100 (the
    #    index base year). The resulting index reproduces official growth
    #    exactly and equals the published levels for 2018–2023 (pre-break);
    #    for 2024–2025 it sits ~2.6% below the raw published levels because
    #    the benchmark-update effect is excluded by construction.
    nom_yoy_pub = {}
    for y in range(1996, 2005):
        nom_yoy_pub[y] = A[y][1]
    for y in range(2005, 2018):
        nom_yoy_pub[y] = B[y][1]
    for y in range(2018, 2026):
        nom_yoy_pub[y] = float(C[y][1])
    real_yoy_pub = {}
    for y in range(1998, 2005):
        real_yoy_pub[y] = A6[y][1]
    for y in range(2005, 2018):
        real_yoy_pub[y] = B6[y][1]
    for y in range(2018, 2026):
        real_yoy_pub[y] = float(str(C[y][2]).replace("－", "-").strip())

    nominal = {2020: 100.0}
    for y in range(2019, 1994, -1):
        nominal[y] = round(nominal[y + 1] / (1 + nom_yoy_pub[y + 1] / 100.0), 2)
    for y in range(2021, 2026):
        nominal[y] = round(nominal[y - 1] * (1 + nom_yoy_pub[y] / 100.0), 2)
    real = {2020: 100.0}
    for y in range(2019, 1996, -1):
        real[y] = round(real[y + 1] / (1 + real_yoy_pub[y + 1] / 100.0), 2)
    for y in range(2021, 2026):
        real[y] = round(real[y - 1] * (1 + real_yoy_pub[y] / 100.0), 2)

    # chained index must reproduce published levels where no break exists
    # (2018–2023, 2020=100 vintage; 1dp rounding tolerance)
    worst_lv = max(abs(nominal[y] - float(C[y][0])) for y in range(2018, 2024))
    ok("mhlw chained nominal = published levels 2018–2023 (±0.06)", worst_lv <= 0.06, f"worst {worst_lv}")
    # and must differ from raw levels 2024–2025 by the benchmark jump (~2.6-2.7%)
    jump24 = float(C[2024][0]) / nominal[2024] - 1
    jump25 = float(C[2025][0]) / nominal[2025] - 1
    ok("mhlw 2024–2025 raw levels sit 2.3–3.1% above growth-chain (benchmark update)",
       0.023 <= jump24 <= 0.031 and 0.023 <= jump25 <= 0.031,
       f"jump24={jump24:.3f} jump25={jump25:.3f}")
    print(f"  [info] benchmark-update level jumps: 2024 {jump24*100:.2f}% / 2025 {jump25*100:.2f}%")

    # chain integrity: chained levels reproduce published YoY exactly (≤0.05pp)
    worst_chain = max(abs((nominal[y] / nominal[y - 1] - 1) * 100 - nom_yoy_pub[y]) for y in range(1996, 2026))
    ok("mhlw chained nominal levels reproduce published YoY (≤0.05pp)", worst_chain <= 0.05, f"worst {worst_chain}")
    worst_chain_r = max(abs((real[y] / real[y - 1] - 1) * 100 - real_yoy_pub[y]) for y in range(1998, 2026))
    ok("mhlw chained real levels reproduce published YoY (≤0.05pp)", worst_chain_r <= 0.05, f"worst {worst_chain_r}")

    # independent cross-checks: cumulative chained change within a vintage's
    # own window must match that vintage's published level change (no internal
    # break), within rounding
    d_nom_29 = abs((nominal[2017] / nominal[2005]) - (B[2017][0] / B[2005][0]))
    ok("mhlw nominal cumulative 2005–2017 matches 29ct levels (±0.002)", d_nom_29 <= 0.002, f"{d_nom_29:.4f}")
    d_real_29 = abs((real[2017] / real[2005]) - (B6[2017][0] / B6[2005][0]))
    ok("mhlw real cumulative 2005–2017 matches 29ct06 levels (±0.002)", d_real_29 <= 0.002, f"{d_real_29:.4f}")
    d_real_19 = abs((real[2005] / real[1997]) - (A6[2005][0] / A6[1997][0]))
    ok("mhlw real cumulative 1997–2005 matches 19t06 levels (±0.002)", d_real_19 <= 0.002, f"{d_real_19:.4f}")
    d_nom_19 = abs((nominal[2005] / nominal[1995]) - (A[2005][0] / A[1995][0]))
    ok("mhlw nominal cumulative 1995–2005 matches 19t levels (±0.002)", d_nom_19 <= 0.002, f"{d_nom_19:.4f}")

    print(f"  [info] nominal 1995={nominal[1995]} 2024={nominal[2024]} 2025={nominal[2025]} (2020=100, growth-chain)")
    print(f"  [info] real    1997={real[1997]} 2017={real[2017]} 2024={real[2024]} 2025={real[2025]} (2020=100, growth-chain)")
    print(f"  [info] raw published levels for comparison: 2024={C[2024][0]} 2025={C[2025][0]}")

    nominal_yoy = nom_yoy_pub
    real_yoy = real_yoy_pub

    # --- latest monthly (2026-08 final, published 2026-10-23) -----------------
    monthly_2026 = {}
    rows = sheet_rows(raw / "2608t01r.xlsx", "賃金指数")
    ym = None
    for r in rows:
        label = _fw_digits(str(r[0] or "")).strip()
        if label.startswith("きまって"):  # end of the first (現金給与総額) block
            break
        m = re.match(r"^2026年\s*(\d+)月", label)
        if m:
            ym = int(m.group(1))
            monthly_2026[ym] = {"nominalIndex": float(r[2]), "nominalYoY": float(r[3]), "realYoY": float(r[4])}
            continue
        m2 = re.match(r"^(\d+)月$", label)
        if m2 and ym is not None and int(m2.group(1)) == ym + 1 and ym < 12:
            ym = int(m2.group(1))
            monthly_2026[ym] = {"nominalIndex": float(r[2]), "nominalYoY": float(r[3]), "realYoY": float(r[4])}
    ok("mhlw monthly 2026: Jan–Aug real YoY captured", sorted(monthly_2026) == list(range(1, 9)), str(sorted(monthly_2026)))
    anchor("mhlw 2026-08 real YoY = +1.6%", monthly_2026[8]["realYoY"], 1.6)
    anchor("mhlw 2026-08 nominal YoY = +3.9%", monthly_2026[8]["nominalYoY"], 3.9)

    mhlw["wages"] = {
        "nominalIndex": {str(k): v for k, v in nominal.items()},
        "realIndex": {str(k): v for k, v in real.items()},
        "nominalYoY": {str(k): v for k, v in nominal_yoy.items()},
        "realYoY": {str(k): v for k, v in real_yoy.items()},
        "monthly2026": {str(k): v for k, v in monthly_2026.items()},
        "chain": {
            "vintagesUsed": [
                "19t01r.xls / 19t06r.xls (平成19年分確報, H17=100) — YoY 1996–2004",
                "27t01r.xls / 27t06r.xls (平成27年分確報, H22=100) [cross-check only]",
                "29ct01r.xls / 29ct06r.xls (平成29年分確報, H27=100) — YoY 2005–2017",
                "25ct01r.xlsx (2025年分確報, 2020=100) — levels 2018–2023 + YoY/実質前年比 2018–2025",
                "2608t01r.xlsx (2026年8月分確報) — monthly 2026-01–08; verified unrevised vs 25ct",
            ],
            "method": "growth-chain anchored at 2020=100 (index base year): published YoY compounded; equals published index levels for 2018–2023; excludes the Jan-2024 benchmark-update level jump (raw levels +2.6%)",
            "methodBreak2018": "2018 survey-frame change (個人業主等の算入除外) is crossed using each vintage's own published YoY (MHLW 時系列比較のための推計値 practice)",
            "benchmarkUpdate2024": "MHLW 利用上の注意 9: Jan-2024 final estimates benchmark-updated to the 2021 Economic Census; official YoY computed against a benchmark-updated 2023 reference, so raw index levels intentionally do not reproduce it",
        },
    }
    return mhlw


# ---------------------------------------------------------------------------
# OECD Productivity Database stage
# ---------------------------------------------------------------------------

OECD_AREAS = {
    "JPN": "日本", "USA": "アメリカ", "DEU": "ドイツ", "FRA": "フランス",
    "GBR": "イギリス", "ITA": "イタリア", "NLD": "オランダ", "SWE": "スウェーデン",
    "CAN": "カナダ", "AUS": "オーストラリア", "NZL": "ニュージーランド", "KOR": "韓国",
}


def stage_oecd():
    print("\n[oecd] Productivity database — GDP per hour worked (current prices, PPP)")
    import csv
    from collections import defaultdict

    def read_csv(path, price_base):
        series = defaultdict(dict)
        n = 0
        for row in csv.DictReader(open(path, encoding="utf-8")):
            if row["STRUCTURE"] != "DATAFLOW" or row["FREQ"] != "A":
                continue
            if row["MEASURE"] != "GDPHRS" or row["ACTIVITY"] != "_T":
                continue
            if row["PRICE_BASE"] != price_base or row["CONVERSION_TYPE"] != "PPP":
                continue
            series[row["REF_AREA"]][row["TIME_PERIOD"]] = float(row["OBS_VALUE"])
            n += 1
        return series, n

    current, n1 = read_csv(RAW / "oecd" / "oecd-gdphrs-ppp-current.csv", "V")
    volume, n2 = read_csv(RAW / "oecd" / "oecd-gdphrs-ppp-volume.csv", "LR")
    ok("oecd: current-price rows parsed", n1 == 528, str(n1))
    ok("oecd: volume rows parsed", n2 == 528, str(n2))
    ok("oecd: 12 economies in current set", set(current) == set(OECD_AREAS), str(sorted(current)))
    latest = "2025"
    ok("oecd: all 12 economies have 2025 current-price values",
       all(latest in current[a] for a in OECD_AREAS))

    oecd = {
        "gdpPerHourCurrent": {a: {y: v for y, v in years.items()} for a, years in current.items()},
        "gdpPerHourVolumeJpn": dict(volume.get("JPN", {})),
        "latestYear": 2025,
        "vintageNote": "OECD.SDD.TPS:DSD_PDB@DF_PDB(2.0) 'Productivity database', fetched 2026-10-25; GDPHRS, total activities, USD per hour PPP-converted; current prices (V) for levels, chain-linked volume rebased to 2020 (LR, BASE_PER=2020) for trends",
    }
    # anchors read directly from the archived CSV
    anchor("oecd JPN 2025 GDP/hour = 61.773697…", current["JPN"]["2025"], 61.773697278626145, tol=1e-6)
    anchor("oecd USA 2025 GDP/hour = 104.744443…", current["USA"]["2025"], 104.74444383172305, tol=1e-6)
    anchor("oecd JPN 1970 GDP/hour (volume, 2020 base) = 16.776558…", volume["JPN"]["1972"], 16.776558274430478, tol=1e-6)
    j25 = current["JPN"]["2025"]
    k25 = current["KOR"]["2025"]
    print(f"  [info] 2025 GDP/hour PPP: JPN={j25:.1f} KOR={k25:.1f} USA={current['USA']['2025']:.1f} DEU={current['DEU']['2025']:.1f}")
    print(f"  [info] JPN volume series: {min(volume['JPN'])}–{max(volume['JPN'])}, 2020={volume['JPN'].get('2020'):.1f}, 1972={volume['JPN']['1972']:.1f}")
    return oecd


# ---------------------------------------------------------------------------
# World Bank WDI stage
# ---------------------------------------------------------------------------

WB_COUNTRIES = ["JPN", "KOR", "SGP", "AUS", "NZL", "DEU", "FRA", "SWE", "NLD", "CAN", "GBR", "USA", "ITA"]


def stage_wb():
    print("\n[wb] World Bank WDI API responses")
    import json as _json

    wbdir = RAW / "worldbank"

    def load(fname):
        d = _json.loads((wbdir / fname).read_text(encoding="utf-8"))
        meta, rows = d[0], d[1]
        vals = {int(r["date"]): r["value"] for r in rows if r["value"] is not None}
        return meta, vals

    def load_compare(code):
        """Merge the 3 pages of the batched 13-economy call."""
        merged = {}
        vintage = None
        for p in ["", "-p2", "-p3"]:
            d = _json.loads((wbdir / f"COMPARE-{code}{p}.json").read_text(encoding="utf-8"))
            vintage = d[0]["lastupdated"]
            for r in d[1]:
                if r["value"] is not None:
                    merged.setdefault(r["countryiso3code"], {})[int(r["date"])] = r["value"]
        return vintage, merged

    # JPN series
    out = {}
    for code, field in [
        ("NY.GDP.PCAP.PP.CD", "gdpPerCapitaPpp"),
        ("NY.GDP.MKTP.CD", "gdpUsd"),
        ("NY.GDP.MKTP.KD.ZG", "realGdpGrowth"),
        ("NV.IND.MANF.ZS", "manufacturingShare"),
        ("NE.GDI.TOTL.ZS", "capitalFormationShare"),
        ("NE.EXP.GNFS.ZS", "exportsShare"),
        ("NE.IMP.GNFS.ZS", "importsShare"),
    ]:
        meta, vals = load(f"JPN-{code}.json")
        out[field] = {str(y): v for y, v in vals.items()}
        ok(f"wb JPN {code}: parsed ({len(vals)} obs, vintage {meta['lastupdated']})",
           len(vals) > 10)
    wb = {"japan": out}

    # comparison batches
    comps = {}
    for code, field in [
        ("NY.GDP.PCAP.PP.CD", "gdpPerCapitaPpp"),
        ("NY.GDP.MKTP.KD.ZG", "realGdpGrowth"),
        ("NV.IND.MANF.ZS", "manufacturingShare"),
    ]:
        vintage, merged = load_compare(code)
        comps[field] = {a: {str(y): v for y, v in years.items()} for a, years in merged.items()}
        ok(f"wb COMPARE {code}: 13 economies, vintage {vintage}",
           set(merged) == set(WB_COUNTRIES), str(sorted(merged)))
    wb["compare"] = comps
    wb["vintage"] = "2026-10-08 (meta.lastupdated on every data file)"

    # anchors
    jpc = out["gdpPerCapitaPpp"]
    anchor("wb JPN GDP/capita PPP 1990 = 20,331.12", jpc["1990"], 20331.1220070593, tol=1e-6)
    anchor("wb JPN GDP/capita PPP 2025 = 55,421.88", jpc["2025"], 55421.8797530311, tol=1e-6)
    ok("wb JPN GDP/capita PPP covers 1990–2025", "1990" in jpc and "2025" in jpc)
    # latest common comparison year for per-capita PPP
    ppp = comps["gdpPerCapitaPpp"]
    common_years = set.intersection(*(set(y) for y in ppp.values()))
    latest_common = max(common_years)
    wb["compareLatestYear"] = latest_common
    print(f"  [info] per-capita PPP comparison common year: {latest_common}; "
          f"JPN={ppp['JPN'].get(str(latest_common)):.0f} vs USA={ppp['USA'].get(str(latest_common)):.0f}")
    return wb


# ---------------------------------------------------------------------------
# R&D survey stage (科学技術研究調査 — 結果の概要 PDF chain)
# ---------------------------------------------------------------------------

def stage_rd():
    print("\n[rd] Statistics Bureau R&D survey — 研究費の推移 / 対GDP比")
    import pdfplumber

    rd = {}

    def num(s):
        return float(s.replace(" ", "").replace(",", "").replace("，", ""))

    def parse_row(tokens, year):
        """tokens = numeric groups between the year and the ratio; GDP (7 digits)
        is the last 7 digits of the de-spaced string, R&D the remainder."""
        joined = "".join(tokens)
        if len(joined) < 8 or not joined.isdigit():
            return None
        gdp = joined[-7:]
        rd = joined[:-7]
        if not (100000 <= int(rd) <= 999999):
            return None
        return {"rdOkuYen": float(rd), "gdpOkuYen": float(gdp)}

    def extract_2025(path):
        """表1-2 研究費、ＧＤＰの推移 — AD-year rows: '2015 年度 189 391 5 519 449 3.43'."""
        rows = {}
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ""
                if "ＧＤＰの推移" not in text:
                    continue
                for line in text.split("\n"):
                    m = re.match(r"^(\d{4})(?:\s*年度)?\s+(.+)$", line.strip())
                    if not m:
                        continue
                    year = int(m.group(1))
                    if not (2015 <= year <= 2024):
                        continue
                    parts = m.group(2).split()
                    if len(parts) < 3 or "." not in parts[-1]:
                        continue
                    ratio = float(parts[-1])
                    vals = parse_row(parts[:-1], year)
                    if vals:
                        vals["ratioPct"] = ratio
                        rows[year] = vals
                if rows:
                    break
        return rows

    def extract_2015(path):
        """表2 研究費，国内総生産の推移 — era rows: '平成 17 年度 …' / continuation '18 …'."""
        rows = {}
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ""
                if "国内総生産の推移" not in text:
                    continue
                for line in text.split("\n"):
                    m = re.match(r"^(?:平成\s*)?(\d{1,2})(?:\s*年度)?\s+(.+)$", line.strip())
                    if not m:
                        continue
                    n = int(m.group(1))
                    if not (17 <= n <= 26):
                        continue
                    year = 1988 + n
                    parts = m.group(2).split()
                    if len(parts) < 3 or "." not in parts[-1]:
                        continue
                    ratio = float(parts[-1])
                    vals = parse_row(parts[:-1], year)
                    if vals:
                        vals["ratioPct"] = ratio
                        rows[year] = vals
                if rows:
                    break
        return rows

    r2025 = extract_2025(RAW / "statb" / "kagaku-2025-kekkagai.pdf")
    ok("rd 2025 PDF: 2015–2024 rows with 対GDP比", len(r2025) == 10 and set(r2025) == set(range(2015, 2025)),
       str(sorted(r2025)))
    anchor("rd 2024 研究費 = 237,925 億円", r2025[2024]["rdOkuYen"], 237925.0)
    anchor("rd 2024 対GDP比 = 3.70%", r2025[2024]["ratioPct"], 3.70)
    anchor("rd 2015 研究費 = 189,391 億円", r2025[2015]["rdOkuYen"], 189391.0)
    print(f"  [info] rd 2024: 研究費 {r2025[2024]['rdOkuYen']:.0f} 億円, GDP {r2025[2024]['gdpOkuYen']:.0f} 億円, 対GDP比 {r2025[2024]['ratioPct']}%")
    for y in sorted(r2025):
        calc = r2025[y]["rdOkuYen"] / r2025[y]["gdpOkuYen"] * 100
        ok(f"rd {y} ratio A/B ≈ published (±0.02pp)", abs(calc - r2025[y]["ratioPct"]) < 0.02,
           f"calc {calc:.3f} vs {r2025[y]['ratioPct']}")

    r2015 = extract_2015(RAW / "statb" / "kagaku-2015-kekkagai.pdf")
    ok("rd 2015 PDF: 2005–2014 rows with 対GDP比", len(r2015) == 10 and set(r2015) == set(range(2005, 2015)),
       str(sorted(r2015)))
    anchor("rd 2014 (H26) 研究費 = 189,713 億円", r2015[2014]["rdOkuYen"], 189713.0)
    anchor("rd 2014 対GDP比 = 3.87%", r2015[2014]["ratioPct"], 3.87)
    anchor("rd 2005 (H17) 対GDP比 = 3.53%", r2015[2005]["ratioPct"], 3.53)
    # note: GDP vintages differ (H26 確報 vs 2024年次推計) — document, no overlap years
    rd["recent"] = {str(y): v for y, v in sorted(r2025.items())}
    rd["older"] = {str(y): v for y, v in sorted(r2015.items())}
    rd["note"] = "chain: 2005–2014 from 2015年調査 概要 表2 (GDP: 平成26年度国民経済計算確報); 2015–2024 from 2025年調査 概要 表1-2 (GDP: 2024年度国民経済計算年次推計, 2025-12-08公表). GDP vintages differ across the two windows; ratios are as published."
    return rd


# ---------------------------------------------------------------------------
# LFS stage (Labour Force Survey long series — narrative anchors)
# ---------------------------------------------------------------------------

def stage_lfs():
    print("\n[lfs] Labour Force Survey long series (anchors)")
    rows = sheet_rows(RAW / "statb" / "lfs-2-1-shuyo.xlsx", "長期02")
    # layout: col0 = era label, col1 = AD year, col2 = 15歳以上人口,
    # col3 = 労働力人口総数, col4 = 就業者, col5 = 完全失業者 (男女計 block)
    total_employed = {}
    for r in rows:
        label = str(r[0] or "").strip()
        y = r[1]
        employed = r[4]
        if not isinstance(y, (int, float)) or not isinstance(employed, (int, float)):
            continue
        if not label or label.startswith("Year") or label.startswith("年次"):
            continue
        total_employed[int(y)] = float(employed)
    ok("lfs total employment 1953–2025", 1953 in total_employed and 2025 in total_employed,
       f"{min(total_employed)}–{max(total_employed)} n={len(total_employed)}")
    anchor("lfs employment 1953 = 3,913 万人", total_employed[1953], 3913.0)
    anchor("lfs employment 2025 = 6,828 万人", total_employed[2025], 6828.0)
    print(f"  [info] lfs employment: 1953={total_employed[1953]}, 1997={total_employed.get(1997)}, 2025={total_employed[2025]} (万人)")
    return {"totalEmployed": {str(y): v for y, v in sorted(total_employed.items())}}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    only = None
    if len(sys.argv) > 2 and sys.argv[1] == "--only":
        only = set(sys.argv[2].split(","))
    result = {}
    if only is None or "esri" in only:
        result["esri"] = stage_esri()
    if only is None or "mhlw" in only:
        result["mhlw"] = stage_mhlw()
    if only is None or "oecd" in only:
        result["oecd"] = stage_oecd()
    if only is None or "wb" in only:
        result["wb"] = stage_wb()
    if only is None or "rd" in only:
        result["rd"] = stage_rd()
    if only is None or "lfs" in only:
        result["lfs"] = stage_lfs()

    if OUT.exists():
        existing = json.loads(OUT.read_text(encoding="utf-8"))
    else:
        existing = {}
    existing.update(result)
    OUT.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\n[done] wrote stages {sorted(result)} to {OUT}")
    print(f"{checks} checks, {failures} failures")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
