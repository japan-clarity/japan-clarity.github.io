#!/usr/bin/env python3
# =============================================================================
# extract-series.py — Japan Clarity Chapter 05 (Education & Talent)
# anchored extraction pipeline.
#
# Reads the raw sources under research/chapter05/raw/ and produces
# research/chapter05/notes/extracted-series.json with fully anchored,
# verified series. Every number that reaches data.ts must pass through here.
#
# Ch01 lesson (cross-table contamination): every value is located by
# (file, sheet/page, header anchor, row anchor, column anchor) and asserted.
# Ch02 lesson (units): unit labels are captured and asserted alongside values.
# Ch03 lesson (narrative peaks): the guards for prose live in
# scripts/validate-research.ts; here we extract the ground-truth series only.
# Ch04 lesson (era/basis breaks): era→CE conversion and definition-break notes
# are asserted (不登校 30日基準 since H3; series start years documented).
#
# Run: python3 research/chapter05/scripts/extract-series.py
# =============================================================================
import json
import os
import re
import sys
import csv
import unicodedata

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # research/chapter05
RAW = os.path.join(BASE, "raw")
OUT = os.path.join(BASE, "notes", "extracted-series.json")

CHECKS = {"pass": 0, "fail": 0}
FAILURES = []


def ok(cond, label, detail=""):
    if cond:
        CHECKS["pass"] += 1
    else:
        CHECKS["fail"] += 1
        FAILURES.append(f"{label} :: {detail}")
    return bool(cond)


def nfw(s):
    """Normalize fullwidth ASCII variants to halfwidth (NFKC) for digits etc."""
    return unicodedata.normalize("NFKC", s) if isinstance(s, str) else s


def txt_path(rel):
    p = os.path.join(RAW, rel)
    with open(p, encoding="utf-8", errors="replace") as f:
        return f.read().split("\n")


def num(s):
    s = nfw(str(s)).replace(",", "").replace("，", "").strip()
    if s in ("…", "-", "", "None", "＊", "***"):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def anchor_assert(lines, needle, label, start=0):
    idx = -1
    for i in range(start, len(lines)):
        if needle in lines[i]:
            idx = i
            break
    ok(idx >= 0, f"anchor:{label}", f"'{needle}' not found")
    return idx


RESULT = {}


# =============================================================================
# Shared table helpers (生徒指導調査 概要 trend tables)
# =============================================================================
def _numtokens(line):
    """Numeric tokens with positions; repairs merged comma/decimal tokens."""
    out = []
    for m in re.finditer(r"[0-9][0-9,.]*[0-9]|[0-9]", nfw(line)):
        t = m.group(0)
        pos = m.start()
        v = None
        # merged comma numbers: e.g. "1,3061,404" = 1,306 | 1,404
        mm = re.fullmatch(r"(\d{1,3},\d{3})(\d{1,3},\d{3})", t)
        if mm:
            out.append((pos, num(mm.group(1))))
            out.append((pos + len(mm.group(1)), num(mm.group(2))))
            continue
        mm = re.fullmatch(r"(\d{1,3},\d{3})(\d{1,3},\d{3})(\d{1,3},\d{3})", t)
        if mm:
            for k in range(1, 4):
                out.append((pos, num(mm.group(k))))
                pos += len(mm.group(k))
            continue
        v = num(t)
        if v is not None:
            out.append((pos, v))
    return out


def _map_by_year(tokens, year_cols, ymap):
    """Map (pos,value) tokens to years. Trailing commentary tokens are dropped
    by a position bound (last year column + 30). If the count matches the year
    count, tokens map IN ORDER (left→right = first→last year); otherwise the
    nearest-column assignment is used."""
    order = sorted(year_cols.items(), key=lambda kv: kv[1])
    if not order:
        return {}
    bound = order[-1][1] + 30
    toks = [(p, v) for (p, v) in tokens if v is not None and p <= bound]
    years = [yl for yl, _ in order]
    d = {}
    if len(toks) == len(years):
        for (p, v), yl in zip(toks, years):
            d[ymap[yl]] = v
    else:
        for (p, v) in toks:
            best = min(order, key=lambda kv: abs(kv[1] - p))[0]
            d.setdefault(ymap[best], v)
    return d


def _find_table_header(lines, pattern, label):
    for i, l in enumerate(lines):
        if re.search(pattern, l):
            return i
    ok(False, f"B.hdr:{label}", pattern)
    return -1


def year_columns(header_line, year_labels):
    cols = {}
    for yl in year_labels:
        p = header_line.find(yl)
        if p >= 0:
            cols[yl] = p
    return cols


# =============================================================================
# A. 学校基本調査 時系列 — 進学率 (e-Stat XLSX, sheet 進学率)
# =============================================================================
def extract_shingakuritsu():
    import openpyxl
    wb = openpyxl.load_workbook(os.path.join(RAW, "estat", "nenji_01_shingakuritsu_1948.xlsx"),
                                read_only=True, data_only=True)
    ws = wb["進学率"]
    ok(ws is not None, "A.sheet", "進学率 sheet")
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    hdr = " ".join(str(c) for c in rows[2] if c is not None)
    ok("幼稚園就園率" in hdr and "高等学校等への進学率" in hdr, "A.header", hdr[:80])
    hdr2 = " ".join(str(c) for c in rows[3] if c is not None)
    ok("通信制課程" in hdr2, "A.header2", hdr2[:80])
    hdr3 = " ".join(str(c) for c in rows[4] if c is not None)
    ok(hdr3.count("計") >= 3 and "男" in hdr3 and "女" in hdr3, "A.header3", hdr3[:80])
    hdr_all = " ".join(str(c) for c in rows[2] if c is not None)
    ok("幼稚園就園率" in hdr_all and "現役進学率" in hdr_all, "A.header1b", hdr_all[:80])
    # column layout (0-based): 0 era, 1 CE year, 2 幼稚園就園率, 3 幼保連携,
    # 4 高等学校等_計, 5 男, 6 女, 7 通信制除く_計, 8 男, 9 女,
    # 10 現役進学率_計, 11 男, 12 女, 13 通信教育部除く_計
    series = {"hs_progression": {}, "hs_progression_excl_comm": {},
              "univ_freshman_progression": {}, "univ_freshman_progression_m": {},
              "univ_freshman_progression_f": {}, "kindergarten_rate": {}}
    for r in rows[5:]:
        if r is None or len(r) < 14:
            continue
        year = num(r[1])
        if year is None or year < 1948 or year > 2025:
            continue
        y = int(year)

        def put(store, v):
            if v is not None:
                ok(y not in store, "A.dupkey", f"year {y} duplicated")
                store[y] = round(v, 2)
        put(series["hs_progression"], num(r[4]))
        put(series["hs_progression_excl_comm"], num(r[7]))
        put(series["univ_freshman_progression"], num(r[10]))
        put(series["univ_freshman_progression_m"], num(r[11]))
        put(series["univ_freshman_progression_f"], num(r[12]))
        put(series["kindergarten_rate"], num(r[2]))
    # real coverage (verified from the file): 通信制除く from 1950, 高校等計/現役 from 1984,
    # 幼稚園就園率 from 1948 — the 再算定 series (確報 R7) is the authoritative vintage
    for name, minlen in [("hs_progression", 40), ("hs_progression_excl_comm", 70),
                         ("univ_freshman_progression", 40),
                         ("univ_freshman_progression_m", 40),
                         ("univ_freshman_progression_f", 40), ("kindergarten_rate", 70)]:
        ok(len(series[name]) >= minlen, f"A.len:{name}", f"only {len(series[name])} years")
    # spot-anchored values (independently verified against the R7 確報概要 PDF text)
    ok(abs(series["hs_progression"].get(2025, 0) - 98.6) < 0.051, "A.2025hs",
       str(series["hs_progression"].get(2025)))
    ok(abs(series["univ_freshman_progression"].get(2025, 0) - 61.4) < 0.051, "A.2025univ",
       str(series["univ_freshman_progression"].get(2025)))
    ok(series["hs_progression_excl_comm"].get(1955, 0) > 40, "A.1955sanity",
       str(series["hs_progression_excl_comm"].get(1955)))
    ok(abs(series["hs_progression_excl_comm"].get(2025, 0) - 92.7) < 0.05, "A.2025exclcomm",
       str(series["hs_progression_excl_comm"].get(2025)))
    RESULT["shingakuritsu"] = {
        "source": "e-Stat 学校基本調査 時系列 nenji_01_shingakuritsu_1948.xlsx sheet 進学率 "
                  "(statInfId=000031852304, fetched 2026-10-27T07:18Z; re-fetched after env reset)",
        "basis": "学校年度 (April–March); 現役進学率 = 高校等卒業者のうち同年に大学等へ進学した者の割合",
        "note": "R7確報 (2025) values; series 1948–2025; 高等学校等への進学率 is 計 incl. 通信制課程本科",
        "series": {k: {str(y): v for y, v in sorted(store.items())} for k, store in series.items()},
    }
    return series


# =============================================================================
# B. 生徒指導調査 R6 概要 tables (いじめ / 不登校 / 暴力 / 重大事態)
# Layout verified from the pdftotext -layout dump: the trend tables use the
# pattern [values-row] [label-row] [rates-row] per category, in fixed category
# order; 重大事態 uses label-prefixed rows with occasional merged number tokens
# ("1,3061,404"). The row ORDER + anchor-value assertions are the safeguards
# (Ch01 lesson: never free-search a workbook for similar-looking numbers).
# =============================================================================
def extract_shidou():
    L = txt_path(os.path.join("mext", "shidou_r6_gaiyou.txt"))
    ymap = {f"H{y}": 1988 + y for y in range(25, 32)}  # Heisei 25 = 2013
    ymap.update({f"R{y}": 2018 + y for y in range(1, 7)})  # Reiwa 1 = 2019

    # ---------------- 不登校 (H26–R6, 11 years) ----------------
    hi = _find_table_header(L, r"年度\s+H26\s+H27", "futoukou")
    years_fk = [f"H{y}" for y in range(26, 32)] + [f"R{y}" for y in range(1, 7)]
    cols = year_columns(L[hi], years_fk)
    ok(len(cols) == 11, "B.fk.cols", str(sorted(cols)))
    cats_fk = ["小学校", "中学校", "合計"]
    vrows, rrows = [], []
    i = hi + 1
    while i < len(L) and (len(vrows) < 3 or len(rrows) < 3):
        s = L[i].strip()
        if s.startswith("※") or s.startswith("▍"):
            break
        toks = _numtokens(L[i])
        big = [(p, v) for (p, v) in toks if v >= 1000]
        dec = [(m.start(), num(m.group(0))) for m in re.finditer(r"\d+\.\d+", nfw(L[i]))]
        if len(big) >= 9:
            vrows.append(_map_by_year(big, cols, ymap))
        elif len(dec) >= 9:
            rrows.append(_map_by_year(dec, cols, ymap))
        i += 1
    ok(len(vrows) == 3 and len(rrows) == 3, "B.fk.rows", f"v={len(vrows)} r={len(rrows)}")
    futoukou = {c: vrows[k] for k, c in enumerate(cats_fk)}
    rates = {c: rrows[k] for k, c in enumerate(cats_fk)}
    for c in cats_fk:
        ok(len(futoukou[c]) == 11, f"B.fk.len:{c}", str(sorted(futoukou.get(c, {}))))
        ok(len(rates[c]) == 11, f"B.fk.rate.len:{c}", str(sorted(rates.get(c, {}))))
    ok(futoukou["小学校"].get(2014) == 25864 and futoukou["小学校"].get(2024) == 137704,
       "B.fk.elem", str(futoukou.get("小学校")))
    ok(futoukou["中学校"].get(2014) == 97033 and futoukou["中学校"].get(2024) == 216266,
       "B.fk.jhs", str(futoukou.get("中学校")))
    ok(futoukou["合計"].get(2014) == 122897 and futoukou["合計"].get(2024) == 353970,
       "B.fk.total", str(futoukou.get("合計")))
    ok(rates["合計"].get(2024) == 38.6 and rates["小学校"].get(2024) == 23.0
       and rates["中学校"].get(2024) == 67.9, "B.fk.rates24", str({c: rates[c].get(2024) for c in cats_fk}))
    ok(rates["合計"].get(2014) == 12.1 and rates["合計"].get(2023) == 37.2, "B.fk.rates14",
       str(rates["合計"]))
    for y in range(2014, 2025):
        if y in futoukou["合計"]:
            ok(abs(futoukou["合計"][y] - futoukou["小学校"][y] - futoukou["中学校"][y]) <= 1,
               f"B.fk.identity:{y}", "")

    # 新規不登校 (小中計 = the 児童生徒数 row)
    shinki = {}
    cnt = 0
    for i, l in enumerate(L):
        # the 小中計 row is labelled 児童生徒数 (小=児童数, 中=生徒数 — Ch04 category-integrity lesson)
        if l.strip().startswith("うち、新規不登校児童生徒数") and "高校" not in l:
            toks = _numtokens(l)
            big = [(p, v) for (p, v) in toks if v >= 5000]
            if len(big) >= 9:
                cnt += 1
                # the 新規 table has its own 年度 header above this row
                shinki_cols = cols
                for j in range(i - 10, i):
                    if 0 <= j < len(L) and re.search(r"年度\s+H26\s+H27", L[j]):
                        shinki_cols = year_columns(L[j], years_fk)
                        break
                ok(len(shinki_cols) == 11, "B.shinki.cols", str(sorted(shinki_cols)))
                shinki = _map_by_year(big, shinki_cols, ymap)
    ok(cnt == 1, "B.shinki.count", str(cnt))
    ok(len(shinki) == 11, "B.shinki.len", str(sorted(shinki)))
    ok(shinki.get(2014) == 65796 and shinki.get(2023) == 165300 and shinki.get(2024) == 153828,
       "B.shinki.vals", str(shinki))

    # ---------------- いじめ (H25–R6, 12 years) ----------------
    hi = _find_table_header(L, r"年度\s+H25\s+H26\s+H27", "ijime")
    years_ij = [f"H{y}" for y in range(25, 32)] + [f"R{y}" for y in range(1, 7)]
    cols_ij = year_columns(L[hi], years_ij)
    ok(len(cols_ij) == 12, "B.ij.cols", str(sorted(cols_ij)))
    cats_ij = ["小学校", "中学校", "高等学校", "特別支援", "計"]
    vrows, rrows = [], []
    i = hi + 1
    while i < len(L) and (len(vrows) < 5 or len(rrows) < 5):
        s = L[i].strip()
        if s.startswith("※") or s.startswith("▍"):
            break
        toks = _numtokens(L[i])
        big = [(p, v) for (p, v) in toks if v >= 100 and p < 118]
        dec = [(m.start(), num(m.group(0))) for m in re.finditer(r"\d+\.\d+", nfw(L[i]))]
        if len(big) >= 10:
            vrows.append(_map_by_year(big, cols_ij, ymap))
        elif len(dec) >= 10:
            rrows.append(_map_by_year(dec, cols_ij, ymap))
        i += 1
    ok(len(vrows) == 5 and len(rrows) == 5, "B.ij.rows", f"v={len(vrows)} r={len(rrows)}")
    ijime = {c: vrows[k] for k, c in enumerate(cats_ij)}
    ijime_rate = {c: rrows[k] for k, c in enumerate(cats_ij)}
    for c in cats_ij:
        ok(len(ijime[c]) == 12, f"B.ij.len:{c}", str(sorted(ijime.get(c, {}))))
        ok(len(ijime_rate[c]) == 12, f"B.ij.rate.len:{c}", str(sorted(ijime_rate.get(c, {}))))
    ok(ijime["小学校"].get(2013) == 118748 and ijime["小学校"].get(2024) == 610612, "B.ij.elem",
       str(ijime.get("小学校")))
    ok(ijime["中学校"].get(2013) == 55248 and ijime["中学校"].get(2024) == 135865, "B.ij.jhs",
       str(ijime.get("中学校")))
    ok(ijime["高等学校"].get(2013) == 11039 and ijime["高等学校"].get(2024) == 18891, "B.ij.hs",
       str(ijime.get("高等学校")))
    ok(ijime["特別支援"].get(2013) == 768 and ijime["特別支援"].get(2024) == 3654, "B.ij.sp",
       str(ijime.get("特別支援")))
    ok(ijime["計"].get(2013) == 185803 and ijime["計"].get(2024) == 769022, "B.ij.total",
       str(ijime.get("計")))
    ok(ijime_rate["計"].get(2013) == 13.4 and ijime_rate["計"].get(2024) == 61.3, "B.ij.rate",
       str(ijime_rate.get("計")))
    for y in range(2013, 2025):
        if y in ijime["計"]:
            s = sum(ijime[c].get(y, 0) for c in cats_ij[:4])
            ok(abs(ijime["計"][y] - s) <= 3, f"B.ij.identity:{y}", f"{ijime['計'][y]} vs {s}")

    # ---------------- 重大事態 (H25–R6, label-prefixed rows) ----------------
    jd = {}
    jd_cols = None
    use_cols = None
    jd_idx = None
    for i, l in enumerate(L):
        if l.strip().startswith("発生件数"):
            toks = [(p, v) for (p, v) in _numtokens(l) if v >= 70]
            if len(toks) >= 12:
                # the 重大事態 table has its own year header within 6 lines above
                for j in range(i - 6, i):
                    if 0 <= j < len(L) and re.search(r"H25\s+H26\s+H27", L[j]):
                        jd_cols = year_columns(L[j], years_ij)
                        break
                use_cols = jd_cols if jd_cols and len(jd_cols) == 12 else cols_ij
                jd["total"] = [v for (y, v) in sorted(_map_by_year(toks, use_cols, ymap).items())]
                jd_idx = i
                break
    for key, store in [("1号重大事態", "no1"), ("2号重大事態", "no2")]:
        for i in range(jd_idx, min(jd_idx + 8, len(L))):
            if L[i].strip().startswith(key):
                toks = [(p, v) for (p, v) in _numtokens(L[i]) if v >= 70]
                if len(toks) >= 12:
                    jd[store] = [v for (y, v) in sorted(_map_by_year(toks, use_cols, ymap).items())]
                    break
    ok(len(jd.get("total", [])) == 12, "B.jd.len", str(jd.get("total")))
    ok(jd["total"][0] == 179 and jd["total"][-1] == 1404 and jd["total"][-2] == 1306,
       "B.jd.total", str(jd.get("total")))
    ok(jd["no1"][-1] == 768 and jd["no2"][-1] == 896, "B.jd.no12", str(jd.get("no1")) + str(jd.get("no2")))

    # ---------------- ネットいじめ (commentary-embedded series) ----------------
    idx_net = anchor_assert(L, "H25：8,788件", "B.net.hdr")
    net = []
    joined = nfw(" ".join(L[idx_net: idx_net + 12]))
    for m in re.finditer(r"([RH])(\d+)[：:]?([\d,]+)件", joined):
        yl, y, v = m.group(1), int(m.group(2)), num(m.group(3))
        yy = 1988 + y if yl == "H" else 2018 + y
        net.append((yy, v))
    ok(len(net) == 11, "B.net.len", str(net))
    ok(net[0] == (2013, 8788) and net[-1] == (2023, 24678), "B.net.ends", str(net))
    idx_net6 = anchor_assert(L, "件数は全体で", "B.net.r6")
    m = re.search(r"全体で([\d,]+)件", nfw(L[idx_net6]))
    net_r6 = num(m.group(1)) if m else None
    ok(net_r6 == 27365, "B.net.r6val", str(net_r6))

    # ---------------- 暴力行為 (H27–R6, 10 years) ----------------
    hi = _find_table_header(L, r"年度\s+H27\s+H28\s+H29", "violence")
    years_v = [2015 + k for k in range(10)]
    vlabels = [f"H{y - 1988}" if y < 2019 else f"R{y - 2018}" for y in years_v]
    cols_v = {}
    for yl, y in zip(vlabels, years_v):
        p = L[hi].find(yl)
        if p >= 0:
            cols_v[yl] = p
    ok(len(cols_v) == 10, "B.v.cols", str(sorted(cols_v)))
    cats_v = ["小学校", "中学校", "高等学校", "合計"]
    vrows, rrows = [], []
    i = hi + 1
    while i < len(L) and (len(vrows) < 4 or len(rrows) < 4):
        s = L[i].strip()
        if s.startswith("※") or s.startswith("▍"):
            break
        toks = _numtokens(L[i])
        big = [(p, v) for (p, v) in toks if v >= 3000 and p < 95]
        dec = [(m.start(), num(m.group(0))) for m in re.finditer(r"\d+\.\d+", nfw(L[i]))]
        if len(big) >= 8:
            vrows.append(_map_by_year(big, cols_v, ymap))
        elif len(dec) >= 8:
            rrows.append(_map_by_year(dec, cols_v, ymap))
        i += 1
    ok(len(vrows) == 4 and len(rrows) == 4, "B.v.rows", f"v={len(vrows)} r={len(rrows)}")
    violence = {c: vrows[k] for k, c in enumerate(cats_v)}
    ok(violence.get("小学校", {}).get(2015) == 17078 and violence.get("小学校", {}).get(2024) == 82997,
       "B.v.elem", str(violence.get("小学校")))
    ok(violence.get("合計", {}).get(2015) == 56806 and violence.get("合計", {}).get(2024) == 128859,
       "B.v.total", str(violence.get("合計")))
    ok(violence.get("中学校", {}).get(2024) == 40039 and violence.get("高等学校", {}).get(2024) == 5823,
       "B.v.others", str({c: violence.get(c, {}).get(2024) for c in cats_v}))

    # ---------------- 自殺 (R6/R5 headline) ----------------
    idx_s = anchor_assert(L, "自殺した児童生徒数は４１３人", "B.suicide.hdr")
    m = re.search(r"自殺した児童生徒数は([0-9]+)人\(前年度([0-9]+)人\)", nfw(L[idx_s]))
    suicide = {"2024": num(m.group(1)), "2023": num(m.group(2))} if m else {}
    ok(suicide.get("2024") == 413 and suicide.get("2023") == 397, "B.suicide", str(suicide))

    # ---------------- 高校中途退学 (R6/R5) ----------------
    idx_d = anchor_assert(L, "高等学校における中途退学者数は", "B.dropout.hdr")
    m = re.search(r"中途退学者数は([0-9,]+)人\(前年度([0-9,]+)人\)", nfw(L[idx_d]))
    dropout = {"2024": num(m.group(1)), "2023": num(m.group(2))} if m else {}
    ok(dropout.get("2024") == 44571 and dropout.get("2023") == 46238, "B.dropout", str(dropout))
    m2 = None
    for j in range(idx_d, min(idx_d + 6, len(L))):
        m2 = re.search(r"進路変更によるものが最も多く、([0-9,]+)人\(前年度([0-9,]+)人\)", nfw(L[j]))
        if m2:
            break
    dropout_reason = {"2024": num(m2.group(1)), "2023": num(m2.group(2))} if m2 else {}
    ok(dropout_reason.get("2024") == 18505 and dropout_reason.get("2023") == 19087,
       "B.dropout.reason", str(dropout_reason))

    RESULT["shidou_r6"] = {
        "source": "MEXT 令和6年度 児童生徒の問題行動・不登校等生徒指導上の諸課題に関する調査 結果概要 "
                  "(20260305-mxt_jidou02-100002753_3.pdf), pdftotext -layout tables",
        "basis": "学校年度; latest published round R6 (2024 school year; R7 not yet published as of 2026-10-27)",
        "definitions": {
            "不登校": "年間30日以上欠席(平成3年度調査から)のうち病気・経済的理由を除く; H27調査から学校基本調査と一本化",
            "いじめ認知件数": "いじめ防止対策推進法の定義に基づき学校が認知した件数; 増加は積極的認知等の影響(MEXT自身の注記)",
            "重大事態": "同法28条1項(生命・心身・財産への重大被害/相当期間の欠席)",
        },
        "ijime": {c: {str(y): v for y, v in sorted(store.items())} for c, store in ijime.items()},
        "ijime_rate_per_1000": {c: {str(y): v for y, v in sorted(store.items())} for c, store in ijime_rate.items()},
        "judaitai": {"years": [str(y) for y in range(2013, 2025)], **jd},
        "net_ijime": {str(y): v for y, v in net + [(2024, net_r6)]},
        "futoukou": {c: {str(y): v for y, v in sorted(store.items())} for c, store in futoukou.items()},
        "futoukou_rate_per_1000": {c: {str(y): v for y, v in sorted(store.items())} for c, store in rates.items()},
        "shinki_futoukou": {str(y): v for y, v in sorted(shinki.items())},
        "violence": {c: {str(y): v for y, v in sorted(store.items())} for c, store in violence.items()},
        "suicide": suicide,
        "dropout": dropout,
        "dropout_reason_changeroute": dropout_reason,
    }
    return RESULT["shidou_r6"]


# =============================================================================
# C. 学校基本調査 R7 確報 headline (cross-check for A) + 進路構成
# =============================================================================
def extract_kihon_r7():
    L = txt_path(os.path.join("mext", "kihon_r7_kakuhou_gaiyou.txt"))
    idx = anchor_assert(L, "卒業者に占める大学・短期大学への進学者の割合は６１．４", "C.hs_dest")
    line = nfw(L[idx])
    m = re.search(r"大学・短期大学への進学者の割合は([\d.]+)%\(うち、大学\(学部\)([\d.]+)%\)", line)
    univ = num(m.group(1)) if m else None
    univ_only = num(m.group(2)) if m else None
    ok(univ == 61.4 and univ_only == 58.3, "C.univ_share", f"{univ}/{univ_only}")

    def forward_search(pat, label, expect):
        for j in range(idx, min(idx + 8, len(L))):
            m = re.search(pat, nfw(L[j]))
            if m:
                v = num(m.group(1))
                ok(v == expect, label, str(v))
                return v
        ok(False, label, "pattern not found in region")
        return None
    senmon = forward_search(r"専門学校への進学者の割合は([\d.]+)%", "C.senmon_share", 14.4)
    job = forward_search(r"就職者の割合は([\d.]+)%", "C.job_share", 13.8)
    koto_dai = forward_search(r"高等教育機関への進学率\(過年度卒を含む\)は([\d.]+)%", "C.koto_share", 85.4)
    RESULT["kihon_r7_headline"] = {
        "source": "MEXT 令和7年度学校基本調査 確報 概要 (kihon_r7_kakuhou_gaiyou.pdf; re-fetched from "
                  "https://www.mext.go.jp/content/20251226-mxt_chousa01-000044291_01.pdf)",
        "univ_junior_progression_share": univ,
        "univ_only_share": univ_only,
        "senmon_progression_share": senmon,
        "employment_share": job,
        "higher_ed_progression_incl_past": koto_dai,
    }
    return RESULT["kihon_r7_headline"]


# =============================================================================
# D. PISA per-cycle tables — pdfplumber column parsing (2012 report) +
#    text-anchored extraction for 2015/2018/2022/2025 reports
# =============================================================================
def parse_pisa2012_page(pdf, page_index, subject):
    """Parse the 5-cycle comparison table: assign each country word to the
    NEAREST 'YYYY年' header column, then take the 3-digit score within that
    column band [yearx-10, yearx+90] on the same text row."""
    page = pdf.pages[page_index]
    words = page.extract_words()
    year_x = {}
    for w in words:
        m = re.fullmatch(r"(20\d\d)年", w["text"])
        if m:
            year_x.setdefault(m.group(1), w["x0"])
    ok(len(year_x) == 5, f"D.cols:{subject}", str(sorted(year_x)))
    out = {}

    def assign(word, who):
        cyc = min(year_x, key=lambda c: abs(year_x[c] - word["x0"]))
        row = [w for w in words if abs(w["top"] - word["top"]) < 3]
        lo, hi = year_x[cyc] - 10, year_x[cyc] + 90
        scores = [w for w in row if lo <= w["x0"] <= hi and word["x0"] < w["x0"]
                  and nfw(w["text"]).replace(",", "").isdigit() and len(nfw(w["text"])) == 3]
        if scores:
            out[(who, cyc)] = num(min(scores, key=lambda w: w["x0"])["text"])

    for w in words:
        if w["text"] == "日本":
            assign(w, "JPN")
        elif "ＯＥＣＤ平均" in w["text"]:
            assign(w, "OECD")
    return out


def extract_pisa():
    import pdfplumber
    pisa = {"JPN": {"math": {}, "reading": {}, "science": {}},
            "OECD": {"math": {}, "reading": {}, "science": {}}}
    # --- 2012 report (5-cycle tables): pages[9]=math (printed 10), [10]=reading (11), [11]=science (12)
    pdf = pdfplumber.open(os.path.join(RAW, "nier", "pisa2012_point.pdf"))
    for pidx, subj in [(9, "math"), (10, "reading"), (11, "science")]:
        cap = pdf.pages[pidx].extract_text() or ""
        key = {"math": "数学的リテラシー国際比較", "reading": "読解力国際比較",
               "science": "科学的リテラシー国際比較"}[subj]
        ok(key in cap, f"D.p2012.page:{subj}", key)
        parsed = parse_pisa2012_page(pdf, pidx, subj)
        for (who, cyc), v in parsed.items():
            if subj == "math" and cyc == "2000":
                continue  # math not trend-comparable in 2000 (report's own note 注1)
            if subj == "science" and cyc in ("2000", "2003"):
                pisa[who][subj]["_orig" + cyc] = v  # original-scale context values
                continue
            pisa[who][subj][cyc] = v
    pdf.close()
    for subj in ("math", "reading", "science"):
        for who in ("JPN", "OECD"):
            expected = {"math": 4, "reading": 5, "science": 3}[subj]
            core = {k: v for k, v in pisa[who][subj].items() if not k.startswith("_orig")}
            ok(len(core) == expected, f"D.p2012.len:{who}:{subj}", str(sorted(core)))
    ok(pisa["JPN"]["math"].get("2003") == 534 and pisa["JPN"]["math"].get("2006") == 523
       and pisa["JPN"]["math"].get("2009") == 529 and pisa["JPN"]["math"].get("2012") == 536,
       "D.p2012.JPN.math", str(pisa["JPN"]["math"]))
    ok(pisa["JPN"]["reading"].get("2000") == 522 and pisa["JPN"]["reading"].get("2003") == 498
       and pisa["JPN"]["reading"].get("2006") == 498 and pisa["JPN"]["reading"].get("2009") == 520
       and pisa["JPN"]["reading"].get("2012") == 538, "D.p2012.JPN.reading", str(pisa["JPN"]["reading"]))
    ok(pisa["JPN"]["science"].get("2006") == 531 and pisa["JPN"]["science"].get("2009") == 539
       and pisa["JPN"]["science"].get("2012") == 547, "D.p2012.JPN.science", str(pisa["JPN"]["science"]))
    ok(pisa["OECD"]["math"].get("2003") == 500 and pisa["OECD"]["math"].get("2006") == 498
       and pisa["OECD"]["math"].get("2009") == 496 and pisa["OECD"]["math"].get("2012") == 494,
       "D.p2012.OECD.math", str(pisa["OECD"]["math"]))
    ok(pisa["OECD"]["reading"].get("2000") == 500 and pisa["OECD"]["reading"].get("2003") == 494
       and pisa["OECD"]["reading"].get("2006") == 492 and pisa["OECD"]["reading"].get("2009") == 493
       and pisa["OECD"]["reading"].get("2012") == 496, "D.p2012.OECD.reading", str(pisa["OECD"]["reading"]))
    ok(pisa["OECD"]["science"].get("2006") == 500 and pisa["OECD"]["science"].get("2009") == 501
       and pisa["OECD"]["science"].get("2012") == 501, "D.p2012.OECD.science", str(pisa["OECD"]["science"]))

    # --- 2015 report (science 538 / reading 516 / math 532; OECD 493/493/490) ---
    L15 = txt_path(os.path.join("nier", "pisa2015_point.txt"))
    idx = _find_table_header(L15, r"ＯＥＣＤ平均\s+\d{3}\s+ＯＥＣＤ平均\s+\d{3}\s+ＯＥＣＤ平均\s+\d{3}", "D.p2015.oecd")
    m = re.findall(r"ＯＥＣＤ平均\s+(\d{3})", L15[idx])
    ok(len(m) == 3, "D.p2015.oecd3", str(m))
    # column order: science, reading, math (verified from header lines above)
    pisa["OECD"]["science"]["2015"], pisa["OECD"]["reading"]["2015"], pisa["OECD"]["math"]["2015"] = \
        (num(m[0]), num(m[1]), num(m[2]))
    ok(pisa["OECD"]["science"]["2015"] == 493 and pisa["OECD"]["reading"]["2015"] == 493
       and pisa["OECD"]["math"]["2015"] == 490, "D.p2015.OECD.vals", str(m))
    jv = {}
    for i in range(idx - 20, idx):
        if 0 <= i < len(L15):
            for mm in re.finditer(r"日本\s+(\d{3})", L15[i]):
                jv[len(jv)] = num(mm.group(1))
    ok(538 in jv.values() and 516 in jv.values() and 532 in jv.values(),
       "D.p2015.JPN.vals", str(jv))
    pisa["JPN"]["science"]["2015"] = 538
    pisa["JPN"]["reading"]["2015"] = 516
    pisa["JPN"]["math"]["2015"] = 532
    anchor_assert(L15, "信頼区間※（日本）：533-544", "D.p2015.CI")

    # --- 2018 report (reading 504 / math 527 / science 529; OECD 487/489/489) ---
    L18 = txt_path(os.path.join("nier", "pisa2018_point.txt"))
    idx = _find_table_header(L18, r"ＯＥＣＤ平均\s+\d{3}\s+ＯＥＣＤ平均\s+\d{3}\s+ＯＥＣＤ平均\s+\d{3}", "D.p2018.oecd")
    m = re.findall(r"ＯＥＣＤ平均\s+(\d{3})", L18[idx])
    ok(len(m) == 3, "D.p2018.oecd3", str(m))
    # column order: reading, math, science (verified from header)
    pisa["OECD"]["reading"]["2018"], pisa["OECD"]["math"]["2018"], pisa["OECD"]["science"]["2018"] = \
        (num(m[0]), num(m[1]), num(m[2]))
    ok(pisa["OECD"]["reading"]["2018"] == 487 and pisa["OECD"]["math"]["2018"] == 489
       and pisa["OECD"]["science"]["2018"] == 489, "D.p2018.OECD.vals", str(m))
    m504 = re.search(r"読解力の平均得点\(504点\)", L18[anchor_assert(L18, "読解力の平均得点(504点)", "D.p2018.read504")])
    ok(m504 is not None, "D.p2018.JPN.reading", "504")
    pisa["JPN"]["reading"]["2018"] = 504
    found = {}
    for i in range(idx - 25, idx + 5):
        if 0 <= i < len(L18):
            for mm in re.finditer(r"日本\s+(52[0-9])", L18[i]):
                found[num(mm.group(1))] = True
    ok(527 in found and 529 in found, "D.p2018.JPN.mathsci", str(sorted(found)))
    pisa["JPN"]["math"]["2018"] = 527
    pisa["JPN"]["science"]["2018"] = 529

    # --- 2022 (MEXT report): math 536 / reading 516 / science 547; OECD 472/476/485 ---
    L22 = txt_path(os.path.join("mext", "pisa-20240312-mxt_kokusai-000020406_3.txt"))
    idx = anchor_assert(L22, "OECD平均    472", "D.p2022.oecd")
    m = re.findall(r"OECD平均\s+(\d{3})", L22[idx])
    ok(len(m) == 3, "D.p2022.oecd3", str(m))
    # column order: math, reading, science (verified header)
    pisa["OECD"]["math"]["2022"], pisa["OECD"]["reading"]["2022"], pisa["OECD"]["science"]["2022"] = \
        (num(m[0]), num(m[1]), num(m[2]))
    ok(pisa["OECD"]["math"]["2022"] == 472 and pisa["OECD"]["reading"]["2022"] == 476
       and pisa["OECD"]["science"]["2022"] == 485, "D.p2022.OECD.vals", str(m))
    region22 = "\n".join(L22[idx - 30: idx + 4])
    ok(re.search(r"1\s+日本\s+536", region22) is not None, "D.p2022.JPN.math", "536 row")
    pisa["JPN"]["math"]["2022"] = 536
    pisa["JPN"]["reading"]["2022"] = 516
    pisa["JPN"]["science"]["2022"] = 547
    ok(re.search(r"日本\s+516", region22) is not None, "D.p2022.JPN.reading", "516 row")
    ok(re.search(r"日本\s+547", region22) is not None, "D.p2022.JPN.science", "547 row")

    # --- 2025 report (science 538 / reading 503 / math 525; OECD 482/461/463) ---
    L25 = txt_path(os.path.join("nier", "pisa2025_point.txt"))
    idx = anchor_assert(L25, "OECD平均                 482 OECD平均                 461 OECD平均                 463", "D.p2025.oecd")
    pisa["OECD"]["science"]["2025"] = 482
    pisa["OECD"]["reading"]["2025"] = 461
    pisa["OECD"]["math"]["2025"] = 463
    region25 = "\n".join(L25[idx - 30: idx + 4])
    ok(re.search(r"1\s+日本\s+538", region25) is not None, "D.p2025.JPN.science", "538 row")
    ok(re.search(r"日本\s+503", region25) is not None, "D.p2025.JPN.reading", "503 row")
    ok(re.search(r"日本\s+525", region25) is not None, "D.p2025.JPN.math", "525 row")
    pisa["JPN"]["science"]["2025"] = 538
    pisa["JPN"]["reading"]["2025"] = 503
    pisa["JPN"]["math"]["2025"] = 525

    # --- PISA 2025 OECD-country comparison table (3 subjects × 10 countries + OECD) ---
    intl = {}
    pdf25 = pdfplumber.open(os.path.join(RAW, "nier", "pisa2025_point.pdf"))
    page25 = None
    for p in pdf25.pages:
        t = p.extract_text() or ""
        if "OECD加盟国（38か国）における比較" in t and "科学コンピテンシー" in t:
            page25 = p
            break
    ok(page25 is not None, "D.p2025.intlpage", "OECD38 table page")
    words = page25.extract_words()
    subj_words = [w for w in words if w["text"] in ("科学コンピテンシー", "読解力", "数学的リテラシー")]
    ok(len(subj_words) >= 3, "D.p2025.intlcols", str([w["text"] for w in subj_words]))
    # column x centers: science ~x<250, reading 250-450, math >450 (from layout)
    bands = {"science": (0, 245), "reading": (245, 450), "math": (450, 700)}
    country_map = {"日本": "JPN", "エストニア": "EST", "韓国": "KOR", "イギリス": "GBR",
                   "カナダ": "CAN", "ニュージーランド": "NZL", "オーストラリア": "AUS",
                   "フィンランド": "FIN", "アメリカ": "USA", "スイス": "CHE",
                   "アイルランド": "IRL", "ポーランド": "POL", "オランダ": "NLD",
                   "ベルギー": "BEL", "OECD平均": "OECD"}
    for subj, (lo, hi) in bands.items():
        for w in words:
            base = w["text"].rstrip("*＊")
            if base in country_map and lo <= w["x0"] < hi:
                row = [x for x in words if abs(x["top"] - w["top"]) < 3 and lo <= x["x0"] < hi + 60]
                scores = [x for x in row if x["x0"] > w["x0"] and nfw(x["text"]).isdigit()
                          and len(nfw(x["text"])) == 3]
                if scores:
                    intl.setdefault(subj, {})[country_map[base]] = num(scores[0]["text"])
    pdf25.close()
    for subj in ("science", "reading", "math"):
        ok(len(intl.get(subj, {})) >= 10, f"D.p2025.intl.len:{subj}", str(sorted(intl.get(subj, {}))))
    ok(intl["science"]["JPN"] == 538 and intl["reading"]["JPN"] == 503 and intl["math"]["JPN"] == 525,
       "D.p2025.intl.JPN", str({s: intl[s].get("JPN") for s in intl}))
    ok(intl["science"]["OECD"] == 482 and intl["reading"]["OECD"] == 461 and intl["math"]["OECD"] == 463,
       "D.p2025.intl.OECD", str({s: intl[s].get("OECD") for s in intl}))
    ok(intl["science"]["KOR"] == 526 and intl["science"]["EST"] == 527, "D.p2025.intl.spots", str(intl.get("science")))

    # cross-cycle consistency: 2012-report's 2012 values must equal MEXT-2022 report's 2022 col
    ok(pisa["JPN"]["math"].get("2012") == 536 == pisa["JPN"]["math"]["2022"], "D.xcons.math12_22", "")
    ok(pisa["JPN"]["science"].get("2012") == 547 == pisa["JPN"]["science"]["2022"], "D.xcons.sci12_22", "")
    ok(pisa["JPN"]["reading"].get("2012") == 538 and pisa["JPN"]["reading"]["2022"] == 516, "D.xcons.read12_22",
       "expected 538 (2012) vs 516 (2022)")

    # --- PISA 2025 CI + ranks + 2022→2025 change (from 概要) ---
    ci25 = {}
    i = anchor_assert(L25, "信頼区間（日本）：530 - 545", "D.p2025.ci")
    region = "\n".join(L25[i:i + 12])
    for name, pat in [("science", r"530 - 545"), ("reading", r"495 - 510"), ("math", r"517 - 534")]:
        mm = re.search(pat, region)
        ci25[name] = bool(mm)
        ok(mm is not None, f"D.p2025.ci:{name}", pat)
    reading_drop = None
    m = re.search(r"読解力が有意に低下※（－([\d]+)点）", "\n".join(L25[55:70]))
    if m:
        reading_drop = num(m.group(1))
    ok(reading_drop == 13, "D.p2025.reading_drop", str(reading_drop))

    RESULT["pisa"] = {
        "source": "NIER/MEXT PISA national reports per cycle (see notes/oecd-summary.md §A for URLs+sha)",
        "note": "trend-comparable design: math from 2003, reading from 2000, science from 2006; "
                "science renamed 科学コンピテンシー in 2025 (same measurement domain); "
                "PISA2025 published 2026-09-08; values are mean scores (not percentages)",
        "japan": {s: {y: v for y, v in sorted(pisa["JPN"][s].items()) if not y.startswith("_orig")}
                  for s in ("math", "reading", "science")},
        "oecd_average": {s: {y: v for y, v in sorted(pisa["OECD"][s].items())} for s in ("math", "reading", "science")},
        "japan_science_orig_scale_2000_2003": {k.replace("_orig", ""): v for k, v in pisa["JPN"]["science"].items() if k.startswith("_orig")},
        "intl_2025_oecd38": intl,
        "japan_2025_ci": {"science": [530, 545], "reading": [495, 510], "math": [517, 534]},
        "reading_drop_2022_2025_significant": reading_drop,
    }
    return RESULT["pisa"]


# =============================================================================
# E. PISA 2025 習熟度 (science) + well-being questionnaire values
# =============================================================================
def extract_pisa2025_extra():
    import pdfplumber
    pdf = pdfplumber.open(os.path.join(RAW, "nier", "pisa2025_point.pdf"))
    # locate the proficiency-level table page
    page = None
    for p in pdf.pages:
        t = p.extract_text() or ""
        if "習熟度レベル別の生徒の割合（経年変化）" in t:
            page = p
            break
    ok(page is not None, "E.profpage", "習熟度 page")
    words = page.extract_words()
    # Japan half: x < 400; OECD half: x >= 410 (verified from layout).
    # For each half, find 'YYYY年' label words; the value row is the nearest row
    # BELOW the label that contains >= 6 decimal words summing to ~100.
    levels = {}
    halves = {"JPN": lambda x0: x0 < 400, "OECD": lambda x0: x0 >= 410}
    for who, keep in halves.items():
        for w in words:
            m = re.fullmatch(r"(20\d\d)年", w["text"])
            if not m:
                continue
            cyc = m.group(1)
            below = []
            for x in words:
                if not (keep(x["x0"]) and 0 < x["top"] - w["top"] < 42):
                    continue
                if re.fullmatch(r"\d+\.\d+", x["text"]):
                    below.append((x["top"], x["x0"], x["text"]))
                else:
                    mm = re.fullmatch(r"(\d+\.\d)(\d+\.\d+)", x["text"])
                    if mm:  # merged tokens like '6.11.1' or '5.90.8'
                        below.append((x["top"], x["x0"], mm.group(1)))
                        below.append((x["top"], x["x0"] + 18, mm.group(2)))
            # cluster by top with 8pt chaining (visual line)
            below.sort(key=lambda x: (x[0], x[1]))
            rows = []
            for t, xx, s in below:
                if rows and t - rows[-1][0][0] < 8:
                    rows[-1].append((t, xx, s))
                else:
                    rows.append([(t, xx, s)])
            for grp in rows:
                xs = sorted((xx, s) for (t, xx, s) in grp)  # left→right within the visual row
                if len(xs) >= 6:
                    vals = [num(s) for (xx, s) in xs[:6]]
                    if abs(sum(vals) - 100) <= 1.5:
                        levels.setdefault(who, {})[cyc] = vals
                        break
    for who in ("JPN", "OECD"):
        ok(len(levels.get(who, {})) == 7, f"E.prof.len:{who}", str(sorted(levels.get(who, {}))))
        for y, vals in levels.get(who, {}).items():
            ok(abs(sum(vals) - 100) <= 1.5, f"E.prof.sum:{who}:{y}", f"{sum(vals)} {vals}")
    ok(levels.get("JPN", {}).get("2025") == [11.3, 17.4, 27.2, 26.9, 13.9, 3.2], "E.prof.JPN.2025",
       str(levels.get("JPN", {}).get("2025")))
    ok(levels.get("JPN", {}).get("2022") == [8.0, 17.0, 27.7, 29.3, 15.0, 3.0], "E.prof.JPN.2022",
       str(levels.get("JPN", {}).get("2022")))
    ok(levels.get("JPN", {}).get("2006") == [12.0, 18.5, 27.5, 27.0, 12.4, 2.6], "E.prof.JPN.2006",
       str(levels.get("JPN", {}).get("2006")))
    ok(levels.get("OECD", {}).get("2025") == [25.7, 24.9, 25.3, 16.9, 6.1, 1.1], "E.prof.OECD.2025",
       str(levels.get("OECD", {}).get("2025")))
    pdf.close()

    # ---- life satisfaction trend (2015/2018/2022/2025, Japan + OECD) ----
    L = txt_path(os.path.join("nier", "pisa2025_point.txt"))
    idx = anchor_assert(L, "ⅱ生徒の生活満足度の経年変化", "E.lifesat_hdr")
    sat = {}
    region = "\n".join(L[idx: idx + 20])
    for y, mean in (("2015", 6.8), ("2018", 6.2), ("2022", 6.8), ("2025", 7.2)):
        m = re.search(rf"{y}年 \({re.escape(str(mean))}\)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)", region)
        if ok(m is not None, f"E.lifesat.JPN:{y}", "regex"):
            sat.setdefault("JPN", {})[y] = [num(m.group(k)) for k in range(1, 5)]
    ok(sat.get("JPN", {}).get("2025") == [33.0, 35.9, 16.1, 15.0], "E.lifesat.JPN.2025",
       str(sat.get("JPN", {}).get("2025")))
    ok(sat.get("JPN", {}).get("2018") == [19.8, 30.4, 25.0, 24.7], "E.lifesat.JPN.2018",
       str(sat.get("JPN", {}).get("2018")))
    # OECD column (same rows, second half)
    m25 = re.search(r"2025年 \(7\.2\)\s+33\.5\s+37\.1\s+15\.6\s+13\.8", region)
    ok(m25 is not None, "E.lifesat.OECD.2025", "regex")
    if m25:
        sat.setdefault("OECD", {})["2025"] = [33.5, 37.1, 15.6, 13.8]
    m18 = re.search(r"2018年 \(7\.0\)\s+33\.2\s+33\.7\s+17\.0\s+16\.2", region)
    ok(m18 is not None, "E.lifesat.OECD.2018", "regex")
    if m18:
        sat.setdefault("OECD", {})["2018"] = [33.2, 33.7, 17.0, 16.2]

    # ---- school belonging (2025) ----
    idx_b = anchor_assert(L, "学校の一員だと感じている", "E.belonging")
    line = nfw(L[idx_b])
    m = re.search(r"感じている\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)", line)
    belonging = None
    if m:
        jp_aff = num(m.group(1)) + num(m.group(2))
        oecd_aff = num(m.group(5)) + num(m.group(6))
        belonging = {"japan_affirmative": round(jp_aff, 1), "oecd_affirmative": round(oecd_aff, 1)}
    ok(belonging is not None and abs(belonging["japan_affirmative"] - 88.9) < 0.15
       and abs(belonging["oecd_affirmative"] - 76.2) < 0.15, "E.belonging.vals", str(belonging))

    # ---- family supportive involvement index ----
    idx_f = anchor_assert(L, "日本 -0.64", "E.family")
    region_f = "\n".join(L[idx_f - 4: idx_f + 3])
    m1 = re.search(r"OECD平均\s*(-[\d.]+)", region_f)
    m2 = re.search(r"(\d+)位\s*日本\s*(-[\d.]+)", region_f)
    m = m1 and m2
    family = None
    if m:
        family = {"oecd_avg": num(m1.group(1)), "japan_rank": num(m2.group(1)), "japan": num(m2.group(2))}
    ok(family is not None and family["japan"] == -0.64 and family["oecd_avg"] == -0.19,
       "E.family.vals", str(family))

    # ---- ICT/digital resources use ranks (school in/out) ----
    idx_ict = anchor_assert(L, "学校内でのデジタル・リソースの利用頻度」指標は、OECD加盟国24か国中５位", "E.ict")
    m = re.search(r"学校内でのデジタル・リソースの利用頻度」指標は、OECD加盟国24か国中５位", L[idx_ict])
    ok(m is not None, "E.ict.in", "")
    m2 = re.search(r"学校外でのデジタル・リソースの利用頻度」指標は、OECD加盟国24か国中２位", L[idx_ict + 1] if idx_ict + 1 < len(L) else "")
    ok(m2 is not None, "E.ict.out", "")

    RESULT["pisa2025_extra"] = {
        "source": "NIER/MEXT PISA2025報告書 質問調査 (pisa2025_point.pdf §3)",
        "proficiency_science": {
            "levels": ["L1以下", "L2", "L3", "L4", "L5", "L6以上"],
            "japan": levels.get("JPN", {}),
            "oecd": levels.get("OECD", {}),
            "note": "科学コンピテンシー(中心分野); Japan L≤1 rose significantly 8.0→11.3 (2022→2025); top share unchanged",
        },
        "life_satisfaction": {
            "categories": ["十分に満足(9-10)", "満足(7-8)", "まあ満足(5-6)", "満足していない(0-4)"],
            "japan": sat.get("JPN", {}),
            "oecd": sat.get("OECD", {}),
            "note": "日本は2018年に50.2%まで低下後、2025年は68.9%と2015年(61.1%)より高い(MEXT報告書本文)",
        },
        "belonging_2025": belonging,
        "family_support_index_2025": family,
        "ict_use_ranks_2025": {"school_in": "5位/24か国(OECD平均より高い)", "school_out": "2位/24か国(OECD平均より高い)"},
    }
    return RESULT["pisa2025_extra"]


# =============================================================================
# F. EAG SDMX CSVs
# =============================================================================
def read_csv_rows(rel):
    with open(os.path.join(RAW, rel), encoding="utf-8-sig") as f:
        return [r for r in csv.DictReader(f) if r.get("OBS_VALUE", "").strip()]


def extract_eag():
    # --- F1 attainment ---
    rows = read_csv_rows("oecd/eag-attainment.csv")
    ok(len(rows) > 2000, "F1.rows", str(len(rows)))

    def series_of(area, lev, age, op="OBS"):
        d = {}
        for r in rows:
            if (r["REF_AREA"] == area and r["ATTAINMENT_LEV"] == lev and r["AGE"] == age
                    and r["STATISTICAL_OPERATION"] == op and r["SEX"] == "_T"):
                y = int(r["TIME_PERIOD"])
                v = num(r["OBS_VALUE"])
                if v is not None:
                    ok(y not in d, "F1.dupkey", f"{area} {lev} {y}")
                    d[y] = round(v, 2)
        return d

    ter = {a: series_of(a, "ISCED11A_5T8", "Y25T64") for a in
           ["JPN", "OECD", "KOR", "USA", "DEU", "GBR", "AUS", "CAN", "FRA"]}
    ok(abs(ter["JPN"].get(1997, 0) - 30.5) < 0.06 and abs(ter["JPN"].get(2025, 0) - 57.9) < 0.06, "F1.JPN.ends",
       f"{ter['JPN'].get(1997)}/{ter['JPN'].get(2025)}")
    ok(abs(ter["OECD"].get(1998, 0) - 20.1) < 0.06 and abs(ter["OECD"].get(2025, 0) - 42.7) < 0.06, "F1.OECD.ends",
       f"{ter['OECD'].get(1998)}/{ter['OECD'].get(2025)}")
    ok(abs(ter["KOR"].get(2025, 0) - 58.2) < 0.06 and abs(ter["CAN"].get(2025, 0) - 63.9) < 0.06
       and abs(ter["DEU"].get(2025, 0) - 35.5) < 0.06, "F1.comps.2025", "")
    ter34 = {a: series_of(a, "ISCED11A_5T8", "Y25T34") for a in ["JPN", "OECD", "KOR"]}
    ok(len(ter34["JPN"]) >= 15, "F1.JPN.2534.len", str(len(ter34["JPN"])))
    below = series_of("OECD", "ISCED11A_0T2", "Y25T64")
    ok(len(below) > 10, "F1.OECD.below.len", str(len(below)))
    below_jpn = series_of("JPN", "ISCED11A_0T2", "Y25T64")
    # SE availability for Japan
    se_jpn = series_of("JPN", "ISCED11A_5T8", "Y25T64", op="SE")
    RESULT["eag_attainment"] = {
        "source": "OECD SDMX OECD.EDU.IMEP,DSD_EAG_LSO_EA@DF_LSO_NEAC_DISTR_EA,1.0 (EAG 2025 vintage)",
        "unit": "percentage of population in the same sex and age (PT_POP_SEX_AGE)",
        "tertiary_25_64": {a: {str(y): v for y, v in sorted(d.items())} for a, d in ter.items()},
        "tertiary_25_34": {a: {str(y): v for y, v in sorted(d.items())} for a, d in ter34.items()},
        "below_upper_secondary_25_64_oecd": {str(y): v for y, v in sorted(below.items())},
        "below_upper_secondary_25_64_japan": {str(y): v for y, v in sorted(below_jpn.items())},
        "japan_se_available_years": sorted(se_jpn),
        "note": "JPN 0T2 share present? -> %s (disclose absence if empty)" % ("yes" if below_jpn else "no rows in query"),
    }

    # --- F2 expenditure per student ---
    rows = read_csv_rows("oecd/eag-perstudent.csv")
    ok(len(rows) > 1000, "F2.rows", str(len(rows)))

    def ps(area, lev, et="CORE", pb="V"):
        d = {}
        for r in rows:
            if (r["REF_AREA"] == area and r["EDUCATION_LEV"] == lev and
                    r["EXPENDITURE_TYPE"] == et and r["PRICE_BASE"] == pb and
                    r["UNIT_MEASURE"] == "USD_PPP_ST" and r["EXP_SOURCE"] == "_T"):
                y = int(r["TIME_PERIOD"])
                v = num(r["OBS_VALUE"])
                if v is not None:
                    d[y] = round(v, 1)
        return d

    ps_all = {a: ps(a, "ISCED11_1T8") for a in ["JPN", "OECD", "KOR", "USA", "DEU", "GBR", "AUS", "CAN", "FRA"]}
    ok(ps_all["JPN"].get(2023) == 14212.0, "F2.JPN.2023", str(ps_all["JPN"].get(2023)))
    ok(abs(ps_all["OECD"].get(2023, 0) - 14065) < 1.0, "F2.OECD.2023", str(ps_all["OECD"].get(2023)))
    ps_lev = {lev: {a: ps(a, lev).get(2023) for a in ["JPN", "OECD"]} for lev in
              ["ISCED11_1", "ISCED11_2_3", "ISCED11_5T8"]}
    ok(all(v["OECD"] is not None for v in ps_lev.values()), "F2.levels.OECD", str(ps_lev))
    RESULT["eag_perstudent"] = {
        "source": "OECD SDMX OECD.EDU.IMEP,DSD_EAG_UOE_FIN@DF_UOE_INDIC_FIN_PERSTUD,3.2; Q_SHEET=SOURCE",
        "unit": "USD PPP, current prices (USD_PPP_ST); total expenditure on core educational services per FTE student",
        "all_levels_1T8": {a: {str(y): v for y, v in sorted(d.items())} for a, d in ps_all.items()},
        "by_level_2023": ps_lev,
        "note": "EXP_SOURCE=_T (public+private); DEST=INST_EDU; Japan latest=2023; comparators latest varies 2022-2023",
    }

    # --- F3 employment by attainment ---
    rows = read_csv_rows("oecd/eag-employment.csv")
    ok(len(rows) > 200, "F3.rows", str(len(rows)))
    emp = {}
    for r in rows:
        if r["AGE"] == "Y25T64" and r["SEX"] == "_T" and r["STATISTICAL_OPERATION"] == "OBS":
            a, lev, y = r["REF_AREA"], r["ATTAINMENT_LEV"], int(r["TIME_PERIOD"])
            v = num(r["OBS_VALUE"])
            if v is not None:
                emp.setdefault((a, lev), {})[y] = round(v, 1)
    ok(emp[("JPN", "ISCED11A_5T8")].get(2025) == 88.3, "F3.JPN.ter", str(emp[("JPN", "ISCED11A_5T8")].get(2025)))
    ok(emp[("JPN", "ISCED11A_3_4")].get(2025) == 83.1, "F3.JPN.upsec", str(emp[("JPN", "ISCED11A_3_4")].get(2025)))
    ok(("JPN", "ISCED11A_0T2") not in emp, "F3.JPN.below.absent", "expected absent — disclosed")
    latest = {}
    for (a, lev), d in emp.items():
        y = max(d)
        if y >= 2024:
            latest.setdefault(a, {})[lev] = d[y]
    RESULT["eag_employment"] = {
        "source": "OECD SDMX OECD.EDU.IMEP,DSD_EAG_LSO_EA@DF_LSO_NEAC_EMP,1.0",
        "unit": "percentage of population in the same sex and age (PT_POP_SUB), 25-64, 2025 (or latest)",
        "latest_by_area": latest,
        "japan_tertiary_series": {str(y): v for y, v in sorted(emp[("JPN", "ISCED11A_5T8")].items())},
        "note": "JPN below-upper-secondary rows absent in this dataflow (disclosed in chapter)",
    }

    # --- F4 ECEC enrollment 3-5 ---
    rows = read_csv_rows("oecd/eag-ecec.csv")
    ok(len(rows) > 800, "F4.rows", str(len(rows)))
    ecec = {}
    for r in rows:
        if (r["EDUCATION_LEV"] == "ISCED11_0" and r["AGE"] == "Y3T5" and r["SEX"] == "_T"):
            a, y = r["REF_AREA"], int(r["TIME_PERIOD"])
            v = num(r["OBS_VALUE"])
            if v is not None:
                ecec.setdefault(a, {})[y] = round(v, 1)
    ok(ecec["JPN"].get(2024) == 95.2, "F4.JPN.2024", str(ecec["JPN"].get(2024)))
    ok(ecec["OECD"].get(2024) == 86.0, "F4.OECD.2024", str(ecec["OECD"].get(2024)))
    ok(ecec["JPN"].get(2023) == 95.9 and ecec["JPN"].get(2022) == 95.2, "F4.JPN.series", str(ecec.get("JPN")))
    # primary enrollment at ages 3-5 (Japan ≈ 0)
    prim = {}
    for r in rows:
        if (r["EDUCATION_LEV"] == "ISCED11_1" and r["AGE"] == "Y3T5" and r["SEX"] == "_T"):
            a, y = r["REF_AREA"], int(r["TIME_PERIOD"])
            v = num(r["OBS_VALUE"])
            if v is not None:
                prim.setdefault(a, {})[y] = round(v, 1)
    ok(prim.get("JPN", {}).get(2024) == 0.0, "F4.JPN.primary0", str(prim.get("JPN")))
    RESULT["eag_ecec"] = {
        "source": "OECD SDMX OECD.EDU.IMEP,DSD_EAG_UOE_NON_FIN_STUD@DF_UOE_NF_ENRL_RATE,1.1",
        "unit": "percentage of population of the same age (PT_POP_SUB); ages 3-5 in ISCED 0 (ECEC)",
        "ecec_3_5": {a: {str(y): v for y, v in sorted(d.items())} for a, d in ecec.items() if a in
                     ["JPN", "OECD", "KOR", "DEU", "FRA", "GBR", "AUS", "CAN", "USA"]},
        "primary_3_5": {a: {str(y): v for y, v in sorted(d.items())} for a, d in prim.items() if a in
                        ["JPN", "OECD", "GBR", "AUS", "USA"]},
        "note": "Japan compulsory schooling starts at age 6 → primary share 0.0 at ages 3-5; "
                "USA ISCED-0 rows absent in extract (US ECEC not in this dataflow vintage) — disclose",
    }
    return {k: RESULT[k] for k in ["eag_attainment", "eag_perstudent", "eag_employment", "eag_ecec"]}


# =============================================================================
# G. PIAAC 2012 (Round 1)
# =============================================================================
def extract_piaac():
    L = txt_path(os.path.join("mext", "piaac2012_gaiyou.txt"))
    idx = anchor_assert(L, "表 １. ＰＩＡＡＣの分野別結果の各国比較", "G.table1")
    region = "\n".join(L[idx: idx + 30])
    m = re.search(r"[ＯOE][ＥE][ＣC][ＤD]平均\s+(\d{3})\s+(\d{3})\s+(\d+)%\s+(\d{3})", region)
    oecd = None
    if m:
        oecd = {"literacy": num(m.group(1)), "numeracy": num(m.group(2)),
                "ps_share": num(m.group(3)), "problem_solving": num(m.group(4))}
    ok(oecd is not None and oecd["literacy"] == 273 and oecd["numeracy"] == 269
       and oecd["problem_solving"] == 283, "G.oecd", str(oecd))
    mj = re.search(r"日本\s+(\d{3})（\s*1）\s+(\d{3})（\s*1）\s+(\d+)%（\s*10）\s+(\d{3})（\s*1）", region)
    japan = None
    if mj:
        japan = {"literacy": num(mj.group(1)), "numeracy": num(mj.group(2)),
                 "ps_share": num(mj.group(3)), "problem_solving": num(mj.group(4))}
    ok(japan is not None and japan["literacy"] == 296 and japan["numeracy"] == 288
       and japan["problem_solving"] == 294, "G.japan", str(japan))
    idx_e = anchor_assert(L, "得点差が参加国中最も小さい", "G.equity")
    me = re.search(r"上位５％の者と下位５％の者の得点差が(\d+)点であり、ＯＥＣＤ平均(\d+)点", "\n".join(L[idx_e - 3: idx_e + 2]))
    equity = None
    if me:
        equity = {"japan_gap": num(me.group(1)), "oecd_gap": num(me.group(2))}
    ok(equity is not None and equity["japan_gap"] == 129 and equity["oecd_gap"] == 152,
       "G.equity.vals", str(equity))
    RESULT["piaac_2012"] = {
        "source": "MEXT 国際成人力調査（PIAAC）調査結果の概要 (Round 1, 2011-12 survey; 20220712-mxt_kouhou02-1.pdf)",
        "age_coverage": "16-65歳",
        "scale": "0-500 (各分野)",
        "japan": japan,
        "oecd_average": oecd,
        "equity_top5_bottom5_gap": equity,
        "limitation": "PIAAC 2023 (Round 2) 結果 (OECD公表 2024-12-10) は一次資料から検証取得不可 "
                      "(NIER該当ページ破損/OECD.org Cloudflare/SDMX未収載) → 本サイトでは2012年調査のみ掲載し "
                      "Round 2 を明示的な制限として開示 (INCONCLUSIVE)",
    }
    return RESULT["piaac_2012"]


# =============================================================================
# H. 学習費調査 R5 (2023)
# =============================================================================
def extract_gakushuuhi():
    L = txt_path(os.path.join("mext", "gakushuuhi_r5_1.txt"))
    idx = anchor_assert(L, "表1    学校種別の学習費総額", "H.table1")
    region = "\n".join(L[idx: idx + 14])
    # row: 学習費総額 184,646 347,338 366,599 1,741,516 542,450 1,560,359 596,954 1,179,261
    m = re.search(r"学習費総額\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)",
                  nfw(region))
    vals = None
    if m:
        vals = [num(m.group(k)) for k in range(1, 9)]
    ok(vals is not None and vals[0] == 184646 and vals[1] == 347338, "H.youchien",
       str(vals[:2]))
    ok(vals[2] == 366599 and vals[3] == 1741516, "H.shougaku", str(vals[2:4]))
    ok(vals[4] == 542450 and vals[5] == 1560359, "H.chuugaku", str(vals[4:6]))
    ok(vals[6] == 596954 and vals[7] == 1179261, "H.koutou", str(vals[6:8]))
    idx2 = anchor_assert(L, "公立・私立学校総数に占める私立学校の割合", "H.private_share")
    m2 = re.search(r"幼稚園 （ 学校数：６８．８％ 園児数：８８．３％ ） 小学校 （ 学校数： １．３％ 児童数： １．３％ ）", L[idx2 + 1] if idx2 + 1 < len(L) else "")
    ok(m2 is not None, "H.private_share.vals", "")
    # 幼稚園 6-round trend (表2)
    idx3 = anchor_assert(L, "表2     学校種別・公立私立別学習費総額合計の推移", "H.table2")
    m3 = None
    for j in range(idx3, min(idx3 + 8, len(L))):
        m3 = re.search(r"公立幼稚園\(11\.7%\)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)", nfw(L[j]))
        if m3:
            break
    ok(m3 is not None and num(m3.group(6)) == 532177, "H.table2.pub", "")
    m4 = None
    for j in range(idx3, min(idx3 + 8, len(L))):
        m4 = re.search(r"私立幼稚園\(88\.3%\)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)", nfw(L[j]))
        if m4:
            break
    ok(m4 is not None and num(m4.group(6)) == 1038087, "H.table2.priv", "")
    RESULT["gakushuuhi_r5"] = {
        "source": "MEXT 令和5年度子供の学習費調査 結果のポイント (gakushuuhi_r5_1.pdf; re-fetched from "
                  "https://www.mext.go.jp/content/20260116-mxt_chousa01-000039333_1.pdf)",
        "basis": "学校年度; 保護者が支出した1年間・子供1人当たり学習費総額 (円)",
        "total_by_stage_2023": {
            "幼稚園_公立": vals[0], "幼稚園_私立": vals[1],
            "小学校_公立": vals[2], "小学校_私立": vals[3],
            "中学校_公立": vals[4], "中学校_私立": vals[5],
            "高等学校全日制_公立": vals[6], "高等学校全日制_私立": vals[7],
        },
        "private_share_note": "私立学校に通う者の割合: 幼稚園88.3% / 小学校1.3% (本文より)",
        "kindergarten_6round_pub": [num(m3.group(k)) for k in range(1, 7)] if m3 else None,
        "kindergarten_6round_priv": [num(m4.group(k)) for k in range(1, 7)] if m4 else None,
    }
    return RESULT["gakushuuhi_r5"]


# =============================================================================
# I. R7/R8 e-Stat XLSX spot values (外国人学生, 大学在籍 R3-R7)
# =============================================================================
def extract_r7r8():
    import openpyxl
    # 外国人学生 by nationality (university total)
    wb = openpyxl.load_workbook(os.path.join(RAW, "estat", "r7_univ_gaikokujin_kokuseki.xlsx"),
                                read_only=True, data_only=True)
    ws = wb["22(3-1)"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    ok(rows[0][0] and "国籍・地域別" in str(rows[0][0]), "I.foreign.header", str(rows[0][0])[:30])
    ga = {}
    for r in rows:
        if r and len(r) > 3 and r[0] and "令和" in str(r[0]) and r[1] == "計":
            y = num(r[0].replace("令和", "").replace("年度", ""))
            y = 2018 + y if y is not None else None
            if y:
                ga[y] = num(r[2])
    ok(ga.get(2024) == 101357 and ga.get(2025) == 107206, "I.foreign.vals", str(ga))

    # 高等教育総括 (大学在籍 R3-R7)
    wb = openpyxl.load_workbook(os.path.join(RAW, "estat", "r7_kotou_soukatsu.xlsx"),
                                 read_only=True, data_only=True)
    ws = wb["01(2-1)"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    ok(any(r and any(c and ("総括" in str(c) or "学校調査" in str(c)) for c in r[:2]) for r in rows[:4]),
       "I.kotou.header", str(rows[0][0])[:20])
    univ = {}
    for r in rows:
        if r and len(r) > 4 and r[0] == "大学" and r[1] and "令和" in str(r[1]):
            y = num(str(r[1]).replace("令和", "").replace("年度", ""))
            y = 2018 + y if y is not None else None
            if y:
                univ[y] = num(r[3])
    ok(univ.get(2021) == 2917998 and univ.get(2024) == 2949795, "I.kotou.vals", str(univ))
    ok(2025 in univ and univ[2025] > 2900000, "I.kotou.r7", str(univ.get(2025)))

    # R8速報 学校数 (小学校)
    wb = openpyxl.load_workbook(os.path.join(RAW, "estat", "r8_sokuhou_soukatsu.xlsx"),
                                read_only=True, data_only=True)
    ws = wb["1(6-1)"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    schools = {}
    for r in rows:
        if r and len(r) > 3 and r[1] in ("幼稚園", "小学校", "中学校", "高等学校") and r[3] is not None:
            schools[r[1]] = num(r[3])
    ok(schools.get("小学校") == 18383 and schools.get("幼稚園") == 7922, "I.r8.schools", str(schools))

    RESULT["schoolbasic_r7r8"] = {
        "source": "e-Stat 学校基本調査 R7確報/R8速報 tables (r7_univ_gaikokujin_kokuseki / r7_kotou_soukatsu / r8_sokuhou_soukatsu)",
        "foreign_students_univ": {str(y): v for y, v in sorted(ga.items())},
        "foreign_students_note": "国籍・地域ベース (JASSO留学生調査の在留資格ベースとは定義が異なる)",
        "univ_enrollment_r3_r7": {str(y): v for y, v in sorted(univ.items())},
        "r8_sokuhou_schools_2026": schools,
        "r8_note": "令和8年度(2026)は速報値 — 確定値は2026年12月公表予定",
    }
    return RESULT["schoolbasic_r7r8"]


# =============================================================================
# J. Long-run e-Stat XLSX (大学/専修/特別支援/長期欠席旧系列)
# =============================================================================
def extract_longrun():
    import openpyxl

    def load_series(fname, sheet, label, valcol, era_col=0, ce_col=1, min_year=None, max_year=None):
        wb = openpyxl.load_workbook(os.path.join(RAW, "estat", fname), read_only=True, data_only=True)
        ws = wb[sheet]
        rows = list(ws.iter_rows(values_only=True))
        wb.close()
        d = {}
        hdr_ok = False
        for r in rows[:5]:
            if r and any(c and "在籍者数" in str(c) for c in r[:12]):
                hdr_ok = True
        for r in rows:
            if r is None or len(r) <= max(era_col, ce_col, valcol):
                continue
            y = num(r[ce_col])
            if y is None:
                continue
            y = int(y)
            if (min_year and y < min_year) or (max_year and y > max_year):
                continue
            v = num(r[valcol])
            if v is not None and v > 0:
                d[y] = v
        ok(hdr_ok, f"J.hdr:{label}", "在籍者数 header")
        ok(len(d) >= 10, f"J.len:{label}", str(len(d)))
        return d

    # 大学在籍 K010: col 6 = 在籍者数 計
    univ = load_series("nenji_12_daigaku.xlsx", "K010", "univ", 6)
    ok(univ.get(1948) == 11978 and univ.get(1950) == 224923, "J.univ.early", str(list(univ.items())[:3]))
    ok(2025 in univ, "J.univ.latest", str(max(univ)))
    # 専修学校 K008: col 6
    senshu = load_series("nenji_11_senshu.xlsx", "K008", "senshu", 6, min_year=1976)
    ok(senshu.get(1976) == 131492, "J.senshu.1976", str(senshu.get(1976)))
    # 特別支援学校 K007-1: col 6
    tokubetsu = load_series("nenji_10_tokubetsushien.xlsx", "K007-1", "tokubetsu", 6, min_year=2007)
    ok(tokubetsu.get(2007) == 108173, "J.tokubetsu.2007", str(tokubetsu.get(2007)))
    # 長期欠席(旧系列) K014-1: col0=era label, col1=計(30日以上 小+中),
    # col2=病気, col3=経済的理由, col4=不登校, col5=その他 (verified empirically;
    # identity 計=病気+経済+不登校+その他 asserted below).
    wb = openpyxl.load_workbook(os.path.join(RAW, "estat", "nenji_16_chouki_kesseki_1959-2014.xlsx"),
                                read_only=True, data_only=True)
    ws = wb["K014-1"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    era = None  # 'S' or 'H'
    chouki, chouki_futoukou = {}, {}
    for r in rows:
        if r is None or len(r) < 6 or r[0] is None:
            continue
        lab = nfw(str(r[0])).strip()
        if lab.startswith("（注"):
            break
        if "昭" in lab:
            era = "S"
        elif "平" in lab:
            era = "H"
        m = re.search(r"(\d+)", lab)
        if not m:
            continue
        n = int(m.group(1))
        y = (1925 + n) if era == "S" else (1988 + n)
        tot, sick, econ, futouko, other = (num(r[k]) for k in range(1, 6))
        if tot is not None and tot > 0:
            ok(y not in chouki, "J.chouki.dup", str(y))
            chouki[y] = tot
            chouki_futoukou[y] = futouko
            if None not in (sick, econ, other):
                ok(abs(tot - sick - econ - futouko - other) <= 1, f"J.chouki.identity:{y}",
                   f"{tot} vs {sick}+{econ}+{futouko}+{other}")
    ok(len(chouki) == 24, "J.chouki.len", str(len(chouki)))
    ok(min(chouki) == 1991 and max(chouki) == 2014, "J.chouki.range", f"{min(chouki)}-{max(chouki)}")
    ok(chouki.get(1991) == 168303, "J.chouki.1991", str(chouki.get(1991)))
    ok(chouki_futoukou.get(2004) == 123358, "J.chouki.futouko2004", str(chouki_futoukou.get(2004)))
    ok(chouki_futoukou.get(2013) == 119356, "J.chouki.futouko2013", str(chouki_futoukou.get(2013)))

    RESULT["longrun_enrollment"] = {
        "source": "e-Stat 学校基本調査 時系列 nenji_10/11/12/16 XLSX",
        "univ_enrollment": {str(y): v for y, v in sorted(univ.items())},
        "senshu_enrollment": {str(y): v for y, v in sorted(senshu.items())},
        "tokubetsu_enrollment": {str(y): v for y, v in sorted(tokubetsu.items())},
        "chouki_kesseki_30plus_elem_jhs_total": {str(y): v for y, v in sorted(chouki.items())},
        "chouki_futoukou_old_series": {str(y): v for y, v in sorted(chouki_futoukou.items())},
        "chouki_note": "理由別長期欠席(30日以上 小+中) 旧系列 1991-2014 (30日基準は平成3年調査から); "
                       "不登校旧系列(病気・経済的理由を除く) 1991-2014 と 生徒指導調査新系列 H26(2014)- は定義が近いが"
                       "2014年で旧122,650 vs 新122,897 と基準断あり(H27一本化) — チャートでは断を明示",
    }
    return RESULT["longrun_enrollment"]


def main():
    print("== Chapter 05 anchored extraction ==")
    extract_shingakuritsu()
    extract_shidou()
    extract_kihon_r7()
    extract_pisa()
    extract_pisa2025_extra()
    extract_eag()
    extract_piaac()
    extract_gakushuuhi()
    extract_r7r8()
    extract_longrun()

    meta = {
        "generated": "2026-10-27",
        "pipeline": "research/chapter05/scripts/extract-series.py",
        "note": "re-executed after sandbox environment reset; raw sources re-fetched byte-identical from official domains",
        "checks": dict(CHECKS),
        "failures": FAILURES[:60],
    }
    RESULT["_meta"] = meta
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(RESULT, f, ensure_ascii=False, indent=1, sort_keys=True)
    print(f"checks: {CHECKS['pass']} passed, {CHECKS['fail']} failed")
    if FAILURES:
        print("FAILURES:")
        for x in FAILURES[:40]:
            print("  -", x)
        sys.exit(1)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
