# Chapter 04 — Independent Adversarial Audit Report (pre-remediation)

Audit date: 2026-10-28 (AEST) · Auditor: independent audit pass on feature/chapter-04-labor-working-conditions working tree (base 5b3a847).
Method: live re-fetch of primary sources from official domains into a fresh directory (`/home/z/ch04-audit-refetch/`), fresh parser code (`compare.py`), value-by-value comparison against the DELIVERED `data.ts` series (exported via `export-ch04-data.ts`). No reuse of extract-series.py or extracted-series.json for verification.

## Phase 1 — Live re-fetch manifest (HTTP 200 unless noted)

| Source | URL basis | sha256-16 |
|---|---|---|
| OECD hours (750r) | sdmx.oecd.org DSD_HW@DF_AVG_ANN_HRS_WKD | 367e08b85e5e1824 (byte-identical to dev fetch) |
| OECD temp (440r) | DSD_TEMP@DF_TEMP_I | 03bfd7fdd6d97e2c (identical) |
| OECD gwg (805r) | DSD_EARNINGS@GENDER_WAGE_GAP | 35d4115f8e7a9b79 (identical) |
| OECD emprate (723r) | DSD_LFS@DF_LFS_INDIC | 4ecc1f0806fac0ad (identical) |
| LFS 長期表2 | e-Stat est-000001082681 | 7ee865692c8882a8 |
| LFS 長期表4(1) | est-000001082690 | 72397f8da2147e1d |
| LFS 長期表3(3) | est-000001082684 | e226bccbaca1e647 |
| LFS 詳細集計 表10-1 | est-000021915917 | fcc9afc78d652c88 |
| MLS 実数累積 (20.9MB) | e-Stat 000032189776 fileKind=1 | cfe67374e69d630b |
| 就労条件 時系列11/12/13 | e-Stat 000040425819/20/21 fileKind=4 | bccef1d3…/67ea2fd2…/05e204c2… |
| 賃金構造 R7 概況/図表 | mhlw.go.jp z2025 dl/14.pdf, xls/zuhyo.xlsx | 133f4746…/30addec9… |
| 労働災害 2025 参考 | mhlw.go.jp content/11302000/001704887.pdf | a5248319… |
| 過労死 R7 別添資料2 | mhlw.go.jp content/11402000/001723467.pdf | 59e8c979… |
| LFS 基本集計 2025 概要 | stat.go.jp nen/ft pdf/gaiyou.pdf | (live) |
| LFS 詳細集計 概要表 1-1/1-2/4-1/4-3 | e-Stat 000040411463/64/74/76 | (live) |
| 過労死 press portal | mhlw.go.jp stf/newpage_74476.html | (live, 200) |

## Phase 2 — Numerical comparison (42 checks)

- MLS hours (6 series incl. part-ratio recompute): **PASS**
- Paid leave 時系列11/12/13 (1984–2025 + rate recompute): **PASS**
- Gender wage ratio 1976–2025 (50 values vs ck-r7-14.pdf 付表1): **PASS**
- Form gap 2005–2025 (付表2, main-row 2019 basis consistent): **PASS**
- Wage curve (第2表 male/female, 11 ages × 2): **PASS** (delivered curve byte-exact vs fresh)
- Form-gap-by-age (第6-1表, incl. 55-59 = 54.8): **PASS**
- Accident 2025 anchors (death 700, injury 135,333; series 2016–2025 in 参考 PDF): **PASS**
- Mental comp FY2018–2020 (archived R4 original) + FY2021–2025 (fresh R7): **PASS** (10 anchors)
- OECD hours/temp/gwg JPN full series + latest-per-economy (13 economies): **PASS** (gwg 6-dp rounding convention verified)
- LFS 表2/表4(1)/表3(3)/表10-1: **6 failures — all the single 1973 defect (D1)**

## Phase 3 — Narrative claims audit

Verified against fresh sources (PASS): headline 6,828/7,004/176/2.5/10,973/62.2 就業率; 1953
3,913/1,660/42%/991/1,262 and 2025 6,185/499/115 (表4(1)); unemployment narrative (1%前後→1975 1.9→
1997 3.4→2002 5.4→2020 2.8→2025 2.5); 60-64 74.9 and 65+ 26.0 (2025); nonregular 29.4→38.3→36.5
+ breakdown 1,053/1,512/43/156; age U-shape 52.7/20.7/42.6/76.1; reasons 36.6/757, 17.7/366,
10.9/226, 5.3/110, 8.0/166, 8.4/173, female 15.4/218, male/female 13.0/6.2; hours 186.6→141.1,
172.0→135.1, 45.5h/36.9h reductions, part-ratio 12.3→31.3, general 160.5 / part 79.1; leave 48%前後
→47.1→62.1→66.9 (record since 1984 55.6), 18.1/12.1, 75.2/50.7, 40.8; wage 58.8→76.6 (+17.8pt/49y,
+4.4pt 2015-25), form gap 60.1→67.4 (+7.3pt 2005-25), curve 245.7→445.6 (1.8×), 239.6→305.7
(1.3×); accidents 4,330(1975)→700 (−84%), 347,407→105,718→135,333, 2020 131,156 incl/125,115
excl COVID; mental 1,820→4,958 (≈2.7×), 1,082/28.2%, 1,254/217, 複数業務 17/4; OECD hours
1,597.5/1,736.1/1,833.0/1,800.2/1,332.2, 1970 2,243 (−645h), gwg 20.1 vs 10.1 (≈2×), KOR 27.8;
OECD temp 14.2 vs OECD avg 11.1 vs max KOR 27.5, concept-difference disclosure; 転職者 330万/4.8%
(−1万/−0.1pt); 潜在労働力 35万 and 追加就労希望 198万 (fresh 4-1 table); 度数率 1.62(2011)→2.14(2021)
→2.01(2025) (archived 動向調査, verbatim dev notes); WLB 39h24m/92.6/65.5/0.9/40.8 and OFF-JT
54.4/21.5/28.5/4.4/25.9, 自己啓発 30.2/17.6 (archived R7 originals, verbatim dev notes).

## DEFECTS FOUND (5)

### D1 — LFS 1973 double-row convention violated (data layer, HIGH)
extract-series.py docstring AND the dev worklog state "the continuous series uses the SECOND
row" (Okinawa-included, forward-continuous with 1974+), but put_year() keeps the FIRST
encountered row and stashes the second. Delivered 1973 values are therefore the
Okinawa-EXCLUDED row, creating a scope jump into 1974. Handbook (hndbk-main.txt L928-934)
confirms both values are published with an explicit continuity warning. Evidence: fresh 表2
1973 rows (8172/5289/5223/1.2 excl vs 8238/5326/5259/1.3 incl); delivered = excl row.
Affected: EMPLOYED_TOTAL 5223→**5259**, UNEMPLOYMENT_RATE 1.2→**1.3**,
STATUS_SELFEMPLOYED 961→**970**, STATUS_FAMILY 662→**665**, STATUS_EMPLOYEE 3591→**3615**,
OLDER_EMPRATE_6064 56.8→**56.9** (OLDER_EMPRATE_65 29.7 identical in both rows).

### D2 — 契約社員・嘱託 2002 value miscomposed (narrative, MEDIUM)
Prose: 「契約社員・嘱託の合計は2002年の355万人から2025年の378万人へ」. 355 = 契約社員230 +
**その他125** — 嘱託 was not a survey category until 2013 (2002–2012 col M empty in 表10-1).
Correct same-basis facts: 契約社員 2002 = 230万 → 2025 = 273万; 契約社員・嘱託 combined
publishable only 2013+ (2013: 390万 → 2025: 378万). JA+EN both carry the defect.

### D3 — 65+ employment-rate trough claim wrong (narrative, MEDIUM)
Prose: 「1968年の33.3%から2000年頃の約20%まで下がりましたが、その後反転して2025年には26.0%」.
Actual series: 2000 = 22.1%; decline continued to the trough **19.2% in 2011** (19.4% around
2003–2006); reversal after 2011. "2000年頃の約20%" is wrong in both level and timing. JA+EN.

### D4 — Unverifiable 在学中除き share (research integrity, MEDIUM)
Prose: 「（同範囲の在学中を除くと24.3%）」 for the 15–24 nonregular share, presented as 2025.
No 2025 value is published in the current official chain (the series with うち在学中を除く
stops at 2022 = 24.4% in the archived 900100 file; the 2025 annual 概要 表Ⅰ-6 carries no such
column). No archived provenance for 24.3 exists in research/. INCONCLUSIVE → the claim must
be removed or re-anchored per the site's evidence standard. JA+EN.

### D5 — EN missing the 1975 anchor for the 1.9% unemployment value (bilingual, LOW)
JA: 「第一次石油危議後の1975年に1.9%へ一時上昇」 (data: 1975 = 1.9 ✓).
EN: "it spiked to 1.9% after the 1973 oil shock" — omits "in 1975", inviting readers to
attach 1.9% to 1973 (actual 1973 value: 1.2). EN only.

## Non-defect observations (no action)

- 表10-1 (52.7%) vs annual 概要 表Ⅰ-6-1 (52.3%) differ slightly for the 2025 15–24 share —
  both official, different vintages; site consistently uses 表10-1 (documented source).
- Dev-notes transcription error "20-24歳=181.4" (181.4 is the 55-59 index in 第2表) — internal
  notes only; delivered data and prose are correct.
- 表Ⅰ-7 (5,837) vs 表10-1/詳細集計 (5,828) 役員を除く雇用者 2025 — 概要 preliminary vs final
  basis; site uses the final 詳細集計 basis consistently.
- OECD CSVs byte-identical to dev-time fetches (same sha256) — SDMX data unchanged.

## Recommendation

REMEDIATE (D1–D5), then re-run gates + negative tests + browser spot-verification, then
package. Data layer otherwise 100% verified on live re-fetch; all other narrative claims and
bilingual parity verified.
