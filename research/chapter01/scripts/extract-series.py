#!/usr/bin/env python3
"""
Japan Clarity — Chapter 01 master series extraction.

Extracts every published series used by the chapter's charts directly from the
raw evidence archived under research/chapter01/raw/ and writes
research/chapter01/notes/extracted-series.json together with a validation
report printed to stdout.

Data flow: raw official documents (archived by the verification agents) →
this script (pure parsing + anchor validation) → src/chapters/chapter-01/data.ts
(values used by the site) → scripts/validate-research.ts (cross-checks site
data against this JSON; the two must agree exactly).

Anchor values asserted below were each verified by reading the raw documents
(see research/chapter01/notes/*.md for verbatim quotes).

Documented table quirks handled here:
- MHLW vital tables omit 1944–1946 (records lost to war damage; disclosed in
  the source's own note 1). Years are assigned by explicit decade anchors
  with consecutive continuation rows.
- Census/handbook rows carry footnote markers like " 1)" that must be
  stripped before tokenizing.
- The handbook household table has no 1965 row (household definition change).

Usage: python3 research/chapter01/scripts/extract-series.py
"""

import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
RAW = ROOT / "research/chapter01/raw"
NOTES = ROOT / "research/chapter01/notes"

failures = []


def check(name, condition, detail=""):
    status = "OK " if condition else "FAIL"
    print(f"  [{status}] {name}{(' — ' + detail) if detail else ''}")
    if not condition:
        failures.append(f"{name}: {detail}")


# Year prefix: "*1947 年 *昭和22 年", "1899 明治32", "  25        7", "19 令和元"…
YEAR_PREFIX = re.compile(
    r"^\s*\*?(?:\d{4}|\d{1,2})\s*年?\s+\*?"
    r"(?:明治(?:\s*\d+)?|大正(?:\s*元|\s*\d+)?|昭和(?:\s*元|\s*\d+)?"
    r"|平成(?:\s*元|\s*\d+)?|令和(?:\s*元|\s*\d+)?|\d{1,3})\s*年?\s*"
)


def tokenize(body: str):
    """Tokenize a table row body: columns are separated by 2+ spaces (or a
    tab), while single spaces act as thousand separators inside numbers."""
    body = re.sub(r"△\s+", "△", body)
    return [t for t in re.split(r"\s{2,}|\t", body.strip()) if t.strip()]


def parse_num(token: str):
    if token is None:
        return None
    token = token.strip()
    if token in {"…", "...", "-", "－"}:
        return None
    negative = token.startswith("△") or token.startswith("-") or token.startswith("−")
    token = re.sub(r"[△\-−\s,]", "", token)
    if not token or not re.fullmatch(r"[\d.]+", token):
        return None
    value = float(token)
    if value == int(value):
        value = int(value)
    return -value if negative else value


def strip_footnotes(line: str) -> str:
    """Footnote markers (digit+paren) are replaced by a column separator (two
    spaces) so that attached footnotes like `71,932,987 1)` split correctly,
    while free-standing footnotes simply vanish into the separator. Asterisk
    marks (preliminary-figure markers) are removed; leading year asterisks are
    tolerated by the row-head regex."""
    line = re.sub(r"\s*\d\)", "  ", line)
    return line.replace("*", "")


# Era bases: western year = base + era year number (元 = 1).
ERA_BASE = {"明治": 1867, "大正": 1911, "昭和": 1925, "平成": 1988, "令和": 2018}

ROW_HEAD = re.compile(
    r"^\s*\*?(\d{4}|\d{1,2})\s*年?\s+\*?([^\s]+)\s*年?\s*"
)


def collect_rows(block_lines, initial_era):
    """Parse rows of the form `<west-suffix> <era-token> <values…>`.

    The west cell is either a 4-digit year (printed every decade) or the last
    two digits of the western year. The era cell is a bare era-year number
    (e.g. `22` = 昭和22 → 1947), a name+number (`昭和22`), or a name+元
    (`令和元`). Computing the year from the era year handles the 1944–46
    omission in the MHLW vital tables natively, because the first post-gap
    row is `47 22` (S22 = 1947), not 1944.
    Returns {year: values} and raises on era/explicit inconsistencies.
    """
    out = {}
    era = initial_era
    for line in block_lines:
        line = strip_footnotes(line)
        m = ROW_HEAD.match(line)
        if not m:
            continue
        west, era_token = m.group(1), m.group(2)
        named = None
        for name in ERA_BASE:
            if era_token.startswith(name):
                named = name
                break
        if named:
            era = named
            rest = era_token[len(named):]
            era_year = 1 if rest in {"元", "元年"} else int(rest)
        else:
            if not era_token.isdigit():
                continue  # header or separator line
            era_year = int(era_token)
        year = ERA_BASE[era] + era_year
        if len(west) == 4 and int(west) != year:
            raise ValueError(f"era/explicit mismatch: {west} vs {era}{era_year} in {line[:40]!r}")
        values = [parse_num(t) for t in tokenize(line[m.end():])]
        if values and values[0] is not None:
            out[year] = values
    return out


# ---------------------------------------------------------------------------
# 1. MHLW Vital Statistics — Table 2 (counts) and Table 3 (rates incl. TFR).
#    Source: kakutei25_05_gaikyou.txt — 令和7(2025)年 人口動態統計（確定数）
#    の概況, published 2026-09-30. Rows: 1899–2025 except 1944–1946 (omitted:
#    war damage; source note 1). 1947–1972 figures exclude Okinawa (note 1).
# ---------------------------------------------------------------------------

def extract_vital():
    text = (RAW / "mhlw/kakutei25_05_gaikyou.txt").read_text(encoding="utf-8")
    lines = text.splitlines()

    def block(start_marker, end_marker):
        s = next(i for i, l in enumerate(lines) if l.startswith(start_marker))
        e = next(i for i, l in enumerate(lines) if i > s and l.startswith(end_marker))
        return lines[s:e]

    t2 = collect_rows(block("第２表", "注："), initial_era="明治")
    t3 = collect_rows(block("第３表", "第４表"), initial_era="明治")

    counts = {}
    for year, v in t2.items():
        if len(v) >= 12:
            counts[year] = {
                "births": v[0],
                "deaths": v[1],
                "natural": v[4],
                "marriages": v[9],
                "divorces": v[10],
            }
    rates = {}
    for year, v in t3.items():
        if len(v) >= 12:
            rates[year] = {
                "birthRate": v[0],
                "deathRate": v[1],
                "marriageRate": v[9],
                "divorceRate": v[10],
                "tfr": v[11],
            }

    c25 = counts.get(2025)
    check("vital 2025 births = 671,270", c25 and c25["births"] == 671270, str(c25 and c25["births"]))
    check("vital 2025 deaths = 1,589,533", c25 and c25["deaths"] == 1589533)
    check("vital 2025 natural = -918,263", c25 and c25["natural"] == -918263)
    check("vital 2025 marriages = 489,158", c25 and c25["marriages"] == 489158)
    check("vital 2025 divorces = 179,073", c25 and c25["divorces"] == 179073)
    c24 = counts.get(2024)
    check("vital 2024 births = 686,173", c24 and c24["births"] == 686173)
    check("vital 2024 deaths = 1,605,378", c24 and c24["deaths"] == 1605378)
    c48 = counts.get(1948)
    check("vital 1948 marriages = 953,999 (footnote/star regression)", c48 and c48["marriages"] == 953999, str(c48 and c48["marriages"]))
    check("vital 1948 divorces = 79,032", c48 and c48["divorces"] == 79032, str(c48 and c48["divorces"]))
    check("vital 1948 births = 2,681,624", c48 and c48["births"] == 2681624)
    check("vital 1970 births = 1,934,239", counts.get(1970, {}).get("births") == 1934239, str(counts.get(1970, {}).get("births")))
    check("vital rows = 124 (1944–46 omitted by the source)", len(counts) == 124, f"got {len(counts)}")
    check("vital 1947 births = 2,678,792 (post-war baby boom)", counts.get(1947, {}).get("births") == 2678792, str(counts.get(1947, {}).get("births")))
    check("vital 1949 births = 2,696,638 (all-time peak)", counts.get(1949, {}).get("births") == 2696638)
    check("vital 1943 present, 1944–1946 absent", 1943 in counts and 1944 not in counts and 1946 not in counts and 1947 in counts)
    r25 = rates.get(2025)
    check("tfr 2025 = 1.14", r25 and r25["tfr"] == 1.14, str(r25 and r25["tfr"]))
    check("tfr 2024 = 1.15", rates.get(2024, {}).get("tfr") == 1.15)
    check("tfr 2020 = 1.33", rates.get(2020, {}).get("tfr") == 1.33)
    check("tfr 2005 = 1.26", rates.get(2005, {}).get("tfr") == 1.26)
    check("tfr 1980 = 1.75", rates.get(1980, {}).get("tfr") == 1.75)
    check("tfr 1947 = 4.54", rates.get(1947, {}).get("tfr") == 4.54, str(rates.get(1947, {}).get("tfr")))
    check("tfr prewar null (1935)", rates.get(1935, {}).get("tfr") is None, str(rates.get(1935, {}).get("tfr")))
    check("birthRate 2025 = 5.6", r25 and r25["birthRate"] == 5.6)
    check("deathRate 2025 = 13.3", r25 and r25["deathRate"] == 13.3)
    check("marriageRate 2025 = 4.1", r25 and r25["marriageRate"] == 4.1, str(r25 and r25["marriageRate"]))
    check("divorceRate 2025 = 1.50", r25 and r25["divorceRate"] == 1.50, str(r25 and r25["divorceRate"]))
    check("rates rows = 124", len(rates) == 124, f"got {len(rates)}")
    return {"counts": counts, "rates": rates}


# ---------------------------------------------------------------------------
# 2. MHLW Abridged Life Tables — life expectancy at birth (0歳), M/F.
#    Source: life25_09_suii.txt — 令和7年簡易生命表 (published 2026-07-24).
#    Columns: 男 0/20/40/65/75/90歳, then 女 likewise. Rows: 1947–2025
#    (five-year average rows like "*1950-1952" are skipped; individual years
#    are present). Okinawa excluded before 1972 (source note 2).
# ---------------------------------------------------------------------------

def extract_life_expectancy():
    text = (RAW / "mhlw/life25_09_suii.txt").read_text(encoding="utf-8")
    lines = [
        line for line in text.splitlines()
        if not re.match(r"^\s*\*?\d{4}\s*-\s*\d{4}", line)  # skip average rows
    ]
    assigned = collect_rows(lines, initial_era="昭和")
    le = {
        y: {"male": v[0], "female": v[6]}
        for y, v in assigned.items()
        if len(v) >= 12 and v[0] is not None and v[6] is not None
    }
    check("LE 2025 M=81.35 F=87.33", le.get(2025) == {"male": 81.35, "female": 87.33}, str(le.get(2025)))
    check("LE 2024 M=81.09 F=87.13", le.get(2024) == {"male": 81.09, "female": 87.13}, str(le.get(2024)))
    check("LE 1947 M=50.06 F=53.96", le.get(1947) == {"male": 50.06, "female": 53.96}, str(le.get(1947)))
    check("LE 1980 M=73.35 F=78.76", le.get(1980) == {"male": 73.35, "female": 78.76}, str(le.get(1980)))
    check("LE 1950 M=58.0 F=61.5 (complete life table)", le.get(1950) == {"male": 58.0, "female": 61.5}, str(le.get(1950)))
    check("LE rows 1947–2025 = 79", len(le) == 79, f"got {len(le)}")
    return le


# ---------------------------------------------------------------------------
# 3. Population Census 1920–2025 — total/male/female (表1 of the 2025 Census
#    basic complete tabulation summary, released 2026-09-29).
# ---------------------------------------------------------------------------

def extract_census():
    text = (RAW / "statb/kokusei2025_kihon_summary.txt").read_text(encoding="utf-8")
    census = {}
    for line in text.splitlines():
        m = re.match(r"^\s*(\d{4})\s*年", line)
        if not m:
            continue
        year = int(m.group(1))
        if year % 5 != 0 or not (1920 <= year <= 2025):
            continue
        line = strip_footnotes(line)
        body = re.sub(r"^\s*\d{4}\s*年（\s*[^\n]*?）\s*", "", line, count=1)
        values = [parse_num(t) for t in tokenize(body)]
        if len(values) >= 3 and values[0] is not None:
            census[year] = {"total": values[0], "male": values[1], "female": values[2]}
    check("census 2020 total = 126,146,099", census.get(2020, {}).get("total") == 126146099, str(census.get(2020)))
    check("census 2025 total = 122,972,528", census.get(2025, {}).get("total") == 122972528, str(census.get(2025)))
    check("census 1920 total = 55,963,053", census.get(1920, {}).get("total") == 55963053)
    check("census 1940 total = 71,932,987 (footnote regression)", census.get(1940, {}).get("total") == 71932987, str(census.get(1940)))
    check("census 1945 total = 72,147,291", census.get(1945, {}).get("total") == 72147291, str(census.get(1945)))
    check("census 2010 total = 128,057,352", census.get(2010, {}).get("total") == 128057352)
    check("census rows = 22", len(census) == 22, f"got {len(census)}")
    return census


# ---------------------------------------------------------------------------
# 4. Aging series 1950–2050 — 統計トピックス No.149 (2026-09-20 release;
#    estimates as of 2026-09-15; rows 2030–2050 are IPSS-based projections
#    republished by the Statistics Bureau).
# ---------------------------------------------------------------------------

def extract_aging():
    text = (RAW / "statb/topics149_elderly_2026.txt").read_text(encoding="utf-8")
    lines = text.splitlines()
    start = next(i for i, l in enumerate(lines) if "表２" in l and "65歳" in l)
    aging = {}
    for line in lines[start + 1:]:
        m = re.match(r"^\s*(\d{4})\s*年?", line)
        if not m:
            if aging:
                break
            continue
        year = int(m.group(1))
        body = re.sub(r"^\s*\d{4}\s*年?\s*", "", line, count=1)
        values = [parse_num(t) for t in tokenize(body)]
        # Columns: 総人口(万人) 65+ 70+ 75+ 80+ | shares: 65+ 70+ 75+ 80+
        if len(values) >= 9:
            aging[year] = {
                "totalMan": values[0],
                "elderlyMan": values[1],
                "share65": values[5],
                "share75": values[7],
            }
    check("aging 2026 share65 = 29.6", aging.get(2026, {}).get("share65") == 29.6, str(aging.get(2026)))
    check("aging 2026 total = 12262", aging.get(2026, {}).get("totalMan") == 12262)
    check("aging 2026 share75 = 17.7", aging.get(2026, {}).get("share75") == 17.7)
    check("aging 1950 share65 = 4.9", aging.get(1950, {}).get("share65") == 4.9)
    check("aging 2005 share65 = 20.2", aging.get(2005, {}).get("share65") == 20.2, str(aging.get(2005)))
    check("aging 2040 share65 = 34.8 (projection)", aging.get(2040, {}).get("share65") == 34.8)
    check("aging rows = 22 (observed to 2026 + projections to 2050)", len(aging) == 22, f"got {len(aging)}")
    return aging


# ---------------------------------------------------------------------------
# 5. Households — Statistical Handbook of Japan 2026 (Table 2.3 household
#    size 1960–2020, no 1965 row due to a household-definition change;
#    Figure 2.3 one-person share 2005–2020) + 2025 Census basic complete
#    tabulation (2.10 persons, 41.4% one-person, 2026-09-29).
# ---------------------------------------------------------------------------

def extract_households():
    handbook = (RAW / "statb/handbook2026_all.txt").read_text(encoding="utf-8")

    # Parse ONLY the Table 2.3 block. A 2026-10-25 independent audit found that
    # scanning the whole handbook let a Table 14.6 row (traffic accidents:
    # 1980 → 2.3 fatalities per 10,000 motor vehicles owned) overwrite the
    # 1980 household-size value (3.22) through the year-keyed dict, because it
    # was the only other table whose 1980 row placed a float in (2, 5) at the
    # same column offset. Restricting the scan to Table 2.3 removes this
    # cross-table contamination class; every row is now anchor-checked.
    all_lines = handbook.splitlines()
    t23_start = next(i for i, l in enumerate(all_lines) if l.strip() == "Table 2.3")
    t23_end = next(
        i for i in range(t23_start + 1, len(all_lines))
        if all_lines[i].strip().startswith("Source:")
    )
    size = {}
    for line in all_lines[t23_start:t23_end]:
        line = strip_footnotes(line)
        m = re.match(r"^\s*(\d{4})\s+(\d[\d,]*)\s{2,}", line)
        if not m:
            continue
        year = int(m.group(1))
        if not (1960 <= year <= 2020) or year % 5 != 0:
            continue
        body = re.sub(r"^\s*\d{4}\s+\d[\d,]*\s+", "", line, count=1)
        values = [parse_num(t) for t in tokenize(body)]
        # [change, members(1k), size, population(1k), pop-change]
        if len(values) >= 4 and isinstance(values[2], float) and 2 < values[2] < 5:
            size[year] = values[2]
    check("household size 1960 = 4.14", size.get(1960) == 4.14, str(size.get(1960)))
    check("household size 1970 = 3.41", size.get(1970) == 3.41, str(size.get(1970)))
    check("household size 1975 = 3.28", size.get(1975) == 3.28, str(size.get(1975)))
    check("household size 1980 = 3.22 (audit regression: traffic-table pollution)", size.get(1980) == 3.22, str(size.get(1980)))
    check("household size 1985 = 3.14", size.get(1985) == 3.14, str(size.get(1985)))
    check("household size 1990 = 2.99", size.get(1990) == 2.99, str(size.get(1990)))
    check("household size 1995 = 2.82", size.get(1995) == 2.82, str(size.get(1995)))
    check("household size 2000 = 2.67", size.get(2000) == 2.67, str(size.get(2000)))
    check("household size 2005 = 2.55", size.get(2005) == 2.55, str(size.get(2005)))
    check("household size 2010 = 2.42", size.get(2010) == 2.42, str(size.get(2010)))
    check("household size 2015 = 2.33", size.get(2015) == 2.33, str(size.get(2015)))
    check("household size 2020 = 2.21", size.get(2020) == 2.21, str(size.get(2020)))
    check("handbook size rows = 12 (no 1965: definition change)", len(size) == 12, f"got {len(size)}")
    size_years = sorted(size)
    monotonic = all(size[y0] >= size[y1] for y0, y1 in zip(size_years, size_years[1:]))
    check("household size monotonically non-increasing 1960→2020", monotonic,
          "; ".join(f"{y}:{size[y]}" for y in size_years))

    one_person = {}
    fig_start = handbook.find("Figure 2.3")
    fig_block = handbook[fig_start:fig_start + 900]
    for year in (2005, 2010, 2015, 2020):
        m = re.search(rf"{year}\s+([\d.]+)", fig_block)
        if m:
            one_person[year] = float(m.group(1))
    check("one-person 2020 = 38.1", one_person.get(2020) == 38.1, str(one_person.get(2020)))
    check("one-person 2005 = 29.5", one_person.get(2005) == 29.5, str(one_person.get(2005)))

    outline = (RAW / "statb/kokusei2025_kihon_outline.txt").read_text(encoding="utf-8")
    m = re.search(r"2025 年（\s*７年 ）\s+57,181,619\s+23,689,024", outline)
    check("2025 census households row (57,181,619 / 23,689,024) present", bool(m))
    m2 = re.search(r"100\.0\s+41\.4\s+28\.4", outline)
    check("2025 one-person share 41.4 present", bool(m2))
    one_person[2025] = 41.4
    size[2025] = 2.10
    return {"avgSize": size, "onePersonShare": one_person}


# ---------------------------------------------------------------------------
# 6. IPSS 2023 Population Projections — medium variant, annual 2020–2070
#    (thousands; published 2023-04-26). Source xlsx: Table 1-1.
# ---------------------------------------------------------------------------

def extract_ipss():
    path = RAW / "ipss/ip2023_table1-1_medium.xlsx"
    z = zipfile.ZipFile(path)
    xml = z.read("xl/worksheets/sheet1.xml").decode("utf-8")
    series = {}
    for rowxml in re.findall(r"<row[^>]*>(.*?)</row>", xml, re.S):
        cells = re.findall(r"<c[^>]*>(?:<v>([^<]*)</v>)?</c>", rowxml)
        values = [c for c in cells if c]
        if len(values) >= 9 and values[1].isdigit() and 2020 <= int(values[1]) <= 2070:
            year = int(values[1])
            series[year] = {
                "totalThousand": round(float(values[2]), 3),
                "under15Thousand": round(float(values[3]), 3),
                "workingThousand": round(float(values[4]), 3),
                "elderlyThousand": round(float(values[5]), 3),
                "share65": round(float(values[8]), 1),
            }
    check("ipss 2070 total = 86,996.009k", series.get(2070, {}).get("totalThousand") == 86996.009, str(series.get(2070, {}).get("totalThousand")))
    check("ipss 2050 total = 104,686.383k", series.get(2050, {}).get("totalThousand") == 104686.383)
    check("ipss 2020 baseline = 126,146.099k", series.get(2020, {}).get("totalThousand") == 126146.099)
    check("ipss 2025 medium = 123,262.448k", series.get(2025, {}).get("totalThousand") == 123262.448)
    check("ipss 2040 share65 = 34.8", series.get(2040, {}).get("share65") == 34.8)
    check("ipss rows 2020–2070 = 51", len(series) == 51, f"got {len(series)}")
    return series


# ---------------------------------------------------------------------------
# 7. World Bank — Japan series + international comparisons (extracted by the
#    verification agent from the API on 2026-10-22; re-validate anchors).
# ---------------------------------------------------------------------------

def extract_worldbank():
    data = json.loads((NOTES / "worldbank-extracted.json").read_text(encoding="utf-8"))
    tfr = data["compare"]["SP.DYN.TFRT.IN"]["values"]
    check("WB JPN TFR 2024 = 1.15", tfr.get("JPN") == 1.15, str(tfr.get("JPN")))
    check("WB KOR TFR 2024 = 0.748", tfr.get("KOR") == 0.748, str(tfr.get("KOR")))
    age = data["compare"]["SP.POP.65UP.TO.ZS"]["values"]
    check("WB JPN 65+ 2025 = 29.9940966737423", abs(age.get("JPN", 0) - 29.9940966737423) < 1e-9, str(age.get("JPN")))
    japan = data["japan"]["SP.POP.TOTL"]
    pairs = {y: v for y, v in zip(japan["years"], japan["values"])}
    check("WB JPN pop 2024 = 123,975,371", pairs.get(2024) == 123975371, str(pairs.get(2024)))
    check("WB JPN pop 2025 = 123,366,734", pairs.get(2025) == 123366734, str(pairs.get(2025)))
    return data


def main():
    print("Japan Clarity — Chapter 01 series extraction")
    print("=" * 64)
    print("\n[1] MHLW vital statistics (2025 final, published 2026-09-30)")
    vital = extract_vital()
    print("\n[2] MHLW abridged life tables 2025 (published 2026-07-24)")
    le = extract_life_expectancy()
    print("\n[3] Population census 1920–2025 (2025 basic tabulation, 2026-09-29)")
    census = extract_census()
    print("\n[4] Statistics Bureau aging release (2026-09-20, topic No.149)")
    aging = extract_aging()
    print("\n[5] Households (handbook 2026 + census 2025)")
    households = extract_households()
    print("\n[6] IPSS 2023 projections, medium variant (2023-04-26)")
    ipss = extract_ipss()
    print("\n[7] World Bank Open Data (accessed 2026-10-22)")
    wb = extract_worldbank()

    out = {
        "accessDate": "2026-10-22",
        "vital": {
            "counts": {str(k): v for k, v in sorted(vital["counts"].items())},
            "rates": {str(k): v for k, v in sorted(vital["rates"].items())},
        },
        "lifeExpectancy": {str(k): v for k, v in sorted(le.items())},
        "census": {str(k): v for k, v in sorted(census.items())},
        "aging": {str(k): v for k, v in sorted(aging.items())},
        "households": {
            "avgSize": {str(k): v for k, v in sorted(households["avgSize"].items())},
            "onePersonShare": {str(k): v for k, v in sorted(households["onePersonShare"].items())},
        },
        "ipssMedium": {str(k): v for k, v in sorted(ipss.items())},
        "worldbank": wb,
    }
    target = NOTES / "extracted-series.json"
    target.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    print("\n" + "=" * 64)
    print(f"Wrote {target.relative_to(ROOT)}")
    if failures:
        print(f"VALIDATION FAILURES ({len(failures)}):")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    print("All validation anchors passed.")
    print(f"Series: vital {len(vital['counts'])} yrs | rates {len(vital['rates'])} yrs | "
          f"LE {len(le)} yrs | census {len(census)} pts | aging {len(aging)} pts | "
          f"households {len(households['avgSize'])} pts | IPSS {len(ipss)} yrs")


if __name__ == "__main__":
    main()
