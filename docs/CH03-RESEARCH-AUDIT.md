# Chapter 03 Independent Research Audit — Housing & Cost of Living

- **Chapter**: 03 — 住宅・生活費 / Housing & Cost of Living
- **Branch**: `feature/chapter-03-housing-cost-of-living` (from `origin/main` = `f7e1fee`, PR #3 merge)
- **Development period**: 2026-10-26 – 2026-10-27
- **Independent review**: Task 8 falsification review, live re-fetches dated 2026-10-27
- **Recommendation**: **GO** (the reviewer's CONDITIONAL GO conditions — two one-word editorial fixes — were applied and re-verified before commit; see §8)

---

## 1. Executive summary

Chapter 03 was developed evidence-first: three parallel research agents archived
raw primary sources on 2026-10-26; an anchored extraction script
(`research/chapter03/scripts/extract-series.py`, 1,656+ validation checks) produced
`notes/extracted-series.json`; a generation script emitted the typed data module;
13 interactive charts and ten bilingual narrative sections were built exclusively
from that module. A separate adversarial reviewer then **re-fetched the original
sources live and re-verified all 20 headline claims: 20/20 PASS**, with the two
prior audit-failure classes (cross-table contamination, OECD unit mislabeling)
explicitly fenced off by regression guards that were negative-tested (5/5
demonstrated failures on injected corruptions, then restored to 940/0).

## 2. Scope and method

Scope (per the chapter registry): housing affordability, rental burden, housing
quality, vacant homes, regional differences, household living expenses —
realised as: housing stock & tenure structure (2 charts), price-to-income
trend (1), rent burden (1), prefectural vacancy (1), vacancy rate & types (2),
household expenditure & structure (2), CPI long-run & groups (2), floor area (1),
OECD international comparison (1).

Evidence classes follow the project convention:
- **PASS** — independently confirmed against authoritative source evidence.
- **FAIL** — demonstrated mismatch.
- **INCONCLUSIVE** — evidence insufficient.
- **NOT COMPARABLE** — definitions differ materially.

No INCONCLUSIVE value was upgraded to PASS. Items unavailable online
(家計の住宅・土地に関する調査; pre-1981 seismic-code dwelling counts, whose
published bands straddle the code boundary) are disclosed as unverified and
excluded from the chapter's claims.

## 3. Baseline

- Base SHA: `f7e1fee` (Merge PR #3 — Chapter 01 audit remediation; Chapter 02
  remediation already included via PR #2).
- Isolated worktree `/home/z/jc-ch03`; branch created from `origin/main`, no
  history rewritten, no pushes.
- Ch01/Ch02 zero-diff verified (§6).

## 4. Primary sources (all accessed & verified 2026-10-26; re-fetched live by the reviewer 2026-10-27)

| Source | Release | Published | Verification |
|---|---|---|---|
| Statistics Bureau — 住宅・土地統計調査 2023 基本集計（確報）結果の概要 | survey 2023-10-01 | 2024-09-25 | verified-primary |
| e-Stat — 時系列統計表 第1-1/4/9-1/14-1表 (2023 round) | 1948–2023 | 2025-09-30 | verified-primary |
| Statistics Bureau — 家計調査 家計収支編 2025 (概要 + e-Stat 詳細結果表) | CY2025 | 2026-02-06 | verified-primary |
| e-Stat — 家計調査 長期時系列表 表2 | 2000–2025 | 2026-10-09 | verified-primary |
| Statistics Bureau — CPI 2025年平均 (2020 base) | CY2025 | 2026-01-23 | verified-primary |
| e-Stat — 2025年基準CPI 長期時系列データ (中分類/品目) | 1970–2025 | 2026-08-07 | verified-primary |
| Statistics Bureau — CPI 2026年9月分 (2025 base) | Sep-2026 | 2026-10-23 | verified-primary |
| OECD — Analytical House Price Statistics (DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES v1.0, SDMX) | 1960–2025 | retrieved 2026-10-26 | verified-secondary |
| MLIT — 住宅着工統計 令和7年計 + 時系列 1948–2025 | CY2025 | 2026-01-30 | verified-primary |
| MLIT — 令和8年地価公示 価格推移表 | as of 2026-01-01 | 2026-03 | verified-primary |

OECD reuse terms page returned HTTP 403 (Cloudflare) from the sandbox — the
failure is documented and attribution follows the project's established
convention. MLIT licensing is PDL1.0 (quoted verbatim in the research notes).

## 5. Figure-group verification matrix

The independent reviewer's 20 headline figure groups (details with verbatim
live quotes: `research/chapter03/raw/review/REVIEW-EVIDENCE.md`):

| # | Figure group | Classification |
|---|---|---|
| 1 | 2023 stock 65,046,700 (+4.2%) | PASS |
| 2 | Vacancies 9,001,600; rate 13.8% (record) | PASS |
| 3 | Vacancy-rate series 1963–2023 (13 points) | PASS |
| 4 | Homeownership 64.3→60.9; private rental 28.2 | PASS |
| 5 | Vacancy types 4,435,800 / 326,200 / 383,500 / 3,856,000 | PASS |
| 6 | Prefectures (47 parsed; extremes + national) | PASS |
| 7 | Floor area 91.66 / 118.25 / 45.39 (73.86 in 1968) | PASS |
| 8 | Construction-period bands + 不詳 residual 3,617,300 | PASS |
| 9 | FIES 314,001円 (+4.6 / +0.9 / +3.7) | PASS |
| 10 | Housing 5.9% & food 28.6% (用途分類, published) | PASS |
| 11 | Tenure costs 12,419 vs 67,997 (rent 441 vs 67,107) | PASS |
| 12 | Solo 173,042 / 21,667 (12.5% published) / 50,467 | PASS |
| 13 | Worker income 653,901 / disposable 532,408 | PASS |
| 14 | Regional: Kanto 337,946 vs Okinawa 235,742; shares 7.0/4.4/9.3 | PASS |
| 15 | CPI 111.9 (+3.2%, 2020 base) / Sep-26 102.2 (+2.1%) | PASS |
| 16 | Long-run CPI 27.6 (1970) / 84.7 (2010) / 100.0 (2025) | PASS |
| 17 | Rent YoY +0.1/+0.2/+0.3; private +0.5; food +6.8; energy +17.1 | PASS |
| 18 | OECD PTI 140.885→213.123→97.443→100→114.606; RHP 163.343/118.046 | PASS |
| 19 | OECD 2025 comparison (13 areas, order verified) | PASS |
| 20 | OECD metadata: BASE_PER=2015 ×660 rows; 2015=100 ×13; *_AVG distinct | PASS |

Supplementary live-verified items: MLIT starts peak/2025 values and YoY;
地価公示 national/Tokyo levels and changes; FIES 2000–2025 series (26 values);
Engel coefficient at its 2000–2025 maximum; regional utilities.

## 6. Statistical-methodology review

- **Denominators**: 空き家率 (total dwellings) vs 持ち家住宅率 (occupied
  dwellings, incl. 不詳 since 1978) vs FIES 持家率 87.3% (household frame) —
  all three pinned separately in guards; the UI text itself explains the
  distinction (§1 callout + chart 8 note).
- **Derived series**: the only derived family (housing-cost burden shares) is
  recomputed in the validation gate from published amounts (4.0 / 20.9 / 4.2 /
  26.4 / 12.5) and disclosed as DERIVED in the chart title, note, source
  register and limitations.
- **Index vs level (Ch02 lesson)**: OECD PTI/RHP are 2015=100 indices; guards
  pin the 2015 anchor at exactly 100, require every OECD chart title/unit to
  state 2015=100, forbid level-style unit labels, and the narrative never
  affirmatively calls the ratios levels (negation-aware regex).
- **Provisional vs final (new lesson)**: the 2023 速報→確報 revision
  (+26 thousand stock; 19 prefectures ±0.1–0.2 pt) is documented; guards pin
  the final values and forbid the provisional ones.
- **Base-year coexistence**: CPI 2020-base (111.9) and 2025-base (100.0)
  figures both appear, each labelled with its base; guards verify YoY agreement.
- **Rounding**: e-Stat vacancy categories round to 100 戸 independently
  (sum can differ from total by ≤100); documented in the chart note and the
  extraction tolerance.
- **Historical breaks**: 1948 (excl. 建築中), 1953 (市部のみ), pre-1969
  (Okinawa), 1978–1998 賃貸用 incl. 売却用, 2023 category renaming — all
  disclosed; charts start 1963 (stock/vacancy) or 1968 (floor area).

## 7. International comparability

The OECD comparison is presented as index growth since 2015 — explicitly NOT a
comparison of levels — with institutional caveats (fixed-rate prevalence,
rental-market depth, series start years GBR 1987 / KOR·NZL 1986). Japan's own
narrative uses national sources; the OECD ratio is never mixed with Japanese
price levels in a single claim.

## 8. Remediation performed during this audit cycle

The reviewer's two MINOR findings (its CONDITIONAL GO conditions), both applied
and re-verified (gate re-run 940/0, tsc clean) before commit:

1. `content-b.ts` §7 Japanese typo: 「前節のとらず」→「前節のとおり」.
2. `content-a.ts` §4 bilingual multiplier drift: EN "five-fold" → "roughly
   5.5×" to match the JA 「約5.5倍」 (12,419→67,997 = 5.47×).

No data, chart, or source-register change was required by the review.

## 9. Regression guards & negative tests

`scripts/validate-research.ts` §[4e] adds data-agreement checks for every Ch03
series plus 8 guard families (vacancy pinned+monotonic; 2023 final anchors;
definitional pin 87.3-vs-60.9; prefecture anchors; OECD 2015=100 exact;
FIES 用途分類; CPI base coexistence; negation-aware text guards). Gate total:
**940 checks, 0 failures** (baseline 528 → +412).

Negative tests (corrupt → observed failures → restore → 940/0):

| Injected corruption | Guard failures observed |
|---|---|
| Vacancy 2023: 13.8 → 13.6 | 2 (data agreement + pinned series) |
| OECD PTI 2015: 100 → 50.5 | 2 (data agreement + base anchor) |
| FIES food: 89,754円 → 94,895円 (品目分類 contamination) | 3 (agreement + classification guard + share sum) |
| Derived burden 20.9 → 5.9 | 1 (recompute guard) |
| 2023 stock: 6,504.7 → 6,502.1万 (速報 value) | 2 (agreement + final-figure guard) |

## 10. Known limitations & remaining uncertainty

See the six chapter limitations rendered on the page (derived burden shares;
OECD index nature + missing housing-finance survey; vacancy statistics do not
measure condition; denominator zoo; CPI base switch; unverified topics
including pre-1981 seismic counts — not estimated because published bands
straddle the boundary). Additionally: the OECD terms page is inaccessible from
this environment (403, documented); the 2026-03 地価公示 publication date is
recorded at month precision because the site states only "毎年3月公示".

## 11. Release recommendation

**GO.** All 20 headline figure groups independently verified from live primary
sources; the reviewer's only conditions (two editorial one-worders) were
applied and re-verified; all technical gates green (§ VERIFICATION-CH03.md);
Chapters 01/02 byte-identical to the audited baseline.
