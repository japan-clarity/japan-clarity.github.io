# Chapter 01 — Independent Research & Methodology Audit

**Audit date:** 2026-10-25 · **Auditor:** independent audit session (GLM-5)
**Baseline (authoritative `origin/main`):** `d2fb85d` (Merge pull request #2 — Chapter 02)
**Audit branch:** `audit/chapter-01-research-methodology` (isolated worktree `/home/z/jc-ch01-audit`)
**Chapter under audit:** Chapter 01 — Population & Family (人口・家族), published at
`/ja/chapters/population-family/` and `/en/chapters/population-family/`

---

## 1. Executive summary

A comprehensive, evidence-based audit of every published quantitative figure group,
chart, historical comparison, and substantive conclusion in Chapter 01 was performed
against **freshly re-fetched primary sources** (Statistics Bureau of Japan, MHLW, IPSS,
World Bank API — all retrieved directly from their official domains during this audit;
the raw evidence is archived under `research/chapter01/raw/audit-2026-10-25/`, workspace-only).

**Outcome: 62 figure groups audited — 59 PASS, 1 FAIL (corrected), 1 INCONCLUSIVE
(remediated), 1 editorial disclosure gap (closed).** All other quantitative claims,
calculations, bilingual content, and interpretations were independently confirmed.

The audit deliberately applied the lesson from the Chapter 02 OECD unit-labeling
review: *automated checks validate consistency, not correctness*. That suspicion was
vindicated — all 523 pre-existing integrity checks passed while a real data error was
live on the site:

- **Finding 1 (FAIL, corrected).** The average-household-size series showed
  **1980 = 2.30 persons/household**. The true value in Statistical Handbook of Japan
  2026, Table 2.3 is **3.22**. Root cause: the extraction script scanned the *entire*
  handbook text and a Table 14.6 row (traffic casualties, 1980: *2.3 fatalities per
  10,000 motor vehicles*) silently overwrote the household value through a year-keyed
  dictionary. 1980 was the only year whose contaminating row placed a float in the
  accepted range (2, 5) at the same column offset — a one-in-twelve accident that
  survived 523 automated checks because the point had no anchor. The error was
  reproduced experimentally, the fix is anchored at every one of the 13 points, and
  monotonicity + provenance regression guards were added and negative-tested.
- **Finding 2 (INCONCLUSIVE, remediated).** The census chart note and an introductory
  callout stated the "October 1, 2020 population *estimate* was 126,226,568". This
  figure appears in **no archived raw file and no currently accessible official
  publication** (2020 annual estimates URLs return 404; the 2021–2024 annual reports
  backcast 2020 at the census-benchmark value; the number is absent from the handbook,
  census summaries, and news bulletins). The project's own research notes had marked
  it "NOT VERIFIED" at build time, yet it was published as fact. Both surfaces (JA/EN)
  now use a fully verified statistical-product example: the Sep 15, 2025 population
  estimate (123.21 million, elderly-release series) vs the Oct 1, 2025 census count
  (122,972,528).
- **Finding 3 (editorial, closed).** The one-person-household share for 2020 (38.1%)
  comes from the handbook's Figure 2.3, while the 2025 census re-tabulation lists the
  same year at 38.0%. Both are official Statistics Bureau values; the chart cites both
  documents but did not previously disclose the vintage difference. A disclosure
  sentence was added to the chart note (both languages).

**Post-remediation verification:** extraction reproduced from re-fetched sources with
exactly one changed point (1980: 2.3 → 3.22); research integrity gate 528/0 (5 new
audit guards, each negative-tested); tsc 0 errors; ESLint clean; static export
65/0 artifact checks (17.3 MB); full browser regression (chart ⇄ table ×3 desktop and
mobile, hover and touch tooltips, range filter, legend toggle, keyboard tab
activation, JA ⇄ EN round trips, CSV content) all green with zero console errors;
Chapter 02 and every shared surface (theme, i18n, app shell, chart framework) proven
byte-identical to the baseline.

**Recommendation: GO** — Chapter 01's research content is verified to its primary
sources after the corrective commit in this branch is reviewed and merged. The
*currently deployed* page still carries Finding 1/2 until merge.

---

## 2. Scope and methodology

### 2.1 Baseline establishment

1. `git fetch origin` — `origin/main` advanced `9a9aad1 → d2fb85d` (PR #2, Chapter 02
   audit remediation). Chapter 02 and the museum light theme (PR #1) confirmed merged.
2. Baseline SHA recorded: **`d2fb85d`**; working tree clean; no uncommitted changes.
3. Isolated audit branch `audit/chapter-01-research-methodology` created from
   `d2fb85d` in a dedicated worktree (`git worktree add /home/z/jc-ch01-audit …`),
   leaving `/home/z/my-project` untouched (the sandbox watchdog reverts that checkout).
4. Prior audit evidence recovered from committed artifacts:
   `research/chapter01/notes/{statb-ipss-summary,mhlw-summary,worldbank-summary}.md`
   (verbatim source quotes), `research/chapter01/scripts/extract-series.py`,
   `research/chapter01/notes/extracted-series.json`, `docs/{VERIFICATION,REMEDIATION,
   POST-LAUNCH-QA,POST-LAUNCH-REMEDIATION,RECOVERY}.md`, and the worklog. Completed
   work was not repeated without an identified gap.

### 2.2 Independent verification method

The pre-audit sandbox reprovisioning had wiped the uncommitted raw archives
(`research/chapter01/raw/{statb,mhlw,ipss}`), which created a genuine verification
opportunity: **every raw document was re-downloaded from its official domain** during
this audit (stat.go.jp, mhlw.go.jp, ipss.go.jp, api.worldbank.org; browser-like
User-Agent; PDFs text-extracted with `pdftotext -layout`), then:

1. **Pipeline reproduction** — the *unmodified* original extractor was run against the
   re-fetched sources: output byte-identical to the committed
   `extracted-series.json`. This proves both determinism and faithful derivation.
2. **Direct document reading** — key rows were read from the re-fetched documents
   independently of the extractor (census Table 1, vital 第2表/第3表, life-table
   参考資料2, aging 表2, handbook Tables 2.3/2.4/2.9 + Figure 2.3, migration summary,
   monthly-estimates PDF, IPSS press release, census outline).
3. **Live API comparison** — all 39 World Bank comparison values (13 economies ×
   3 indicators) plus Japan long-series spot checks re-fetched from
   `api.worldbank.org` (API `lastupdated 2026-10-08`, matching the site's source
   register) and compared at exact float equality.
4. **Recalculation** — derived claims (percentage changes, multi-year comparisons,
  "record" superlatives, consecutive-year counts, male–female gap, projection-vs-
  census gaps) recomputed from the series.
5. **Bilingual parity review** — JA/EN text compared claim-by-claim for numerical
   equivalence, terminology, and hedging strength.
6. **Chart/table/tooltip/CSV verification** — every value surface inspected in the
   browser at desktop (1440×900) and mobile (390×844, iPhone device emulation).

### 2.3 Classification rules

PASS (independently confirmed) · FAIL (demonstrated error) · INCONCLUSIVE
(insufficient accessible evidence) · NOT COMPARABLE (definitions/coverage
incompatible). Unavailable evidence is never classified PASS.

---

## 3. Source inventory (as re-verified 2026-10-25)

| # | Source | Document | Publication | Re-fetch status |
|---|--------|----------|-------------|-----------------|
| S1 | Statistics Bureau, MIC | 2025 Population Census — Basic Complete Tabulation, Summary of Results (`kekka/pdf/summary_01.pdf`) | 2026-09-29 | ✓ re-fetched, Table 1 read |
| S2 | Statistics Bureau, MIC | 2025 Census outline (`kekka/pdf/outline_01.pdf`) | 2026-09-29 | ✓ re-fetched (household anchors) |
| S3 | Statistics Bureau, MIC | 統計トピックス No.149 elderly release (`topics/pdf/topics149.pdf`) | 2026-09-20 | ✓ re-fetched, 表2 read |
| S4 | Statistics Bureau, MIC | Statistical Handbook of Japan 2026 (`english/data/handbook/pdf/2026all.pdf`) | 2026-09 | ✓ re-fetched, Tables 2.3/2.4/2.9, Fig 2.3 read |
| S5 | Statistics Bureau, MIC | Population Estimates, Oct 2026 report (`data/jinsui/pdf/202610.pdf`) | 2026-10-20 | ✓ re-fetched |
| S6 | MHLW | 2025 Vital Statistics final, overview (`kakutei25/dl/05_gaikyouR07.pdf`) | 2026-09-30 | ✓ re-fetched, 第2/3表 read |
| S7 | MHLW | 2025 abridged life tables, 参考資料2 (`life/life25/dl/life25-09.pdf`) | 2026-07-24 | ✓ re-fetched |
| S8 | MHLW | 2025 vital statistics annual provisional (`geppo/nengai25/dl/kekka.pdf`) | 2026-06-03 | ✓ re-fetched (first-marriage ages) |
| S9 | IPSS | Population Projections 2023, Table 1-1 medium (`db_zenkoku2023/s_tables/1-1.xlsx`) + press release | 2023-04-26 | ✓ both re-fetched |
| S10 | Statistics Bureau, MIC | Report on Internal Migration 2025 (`idou/2025np/jissu/youyaku/`) | 2026-02-03 | ✓ re-fetched (Shift_JIS) |
| S11 | World Bank | WDI API — 6 indicators × 13 economies | lastupdated 2026-10-08 | ✓ live API queried |
| S12 | Statistics Bureau, MIC | 2021 annual Population Estimates (`data/jinsui/2021np/`) | 2022-04 | ✓ fetched (2020 shown at census-benchmark value; see Finding 2) |

The committed World Bank JSON responses (`research/chapter01/raw/worldbank/`) and
source register (`src/chapters/chapter-01/sources.ts`) were cross-checked against the
live API. The chapter's ten-entry source register is complete and accurate; no
unregistered sources are used, and no registered figure failed re-verification except
the two findings below.

---

## 4. Figure-by-figure findings

Full per-group evidence (original value, website value, URL, dates, outcome) is in
**`docs/CH01-AUDIT-EVIDENCE-REGISTER.md`**. Summary matrix:

### A. Population and demographic trends

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| Census totals 1920–2025 (22 pts) | 55,963,053 → 122,972,528 | Table 1 of re-fetched 2025 census summary; all 22 rows match incl. wartime-corrected 1940 (71,932,987) / 1945 (72,147,291) | **PASS** |
| Intercensal change 2020→25 | −3,173,571 (−2.5%, −0.51%/yr) | Table 1 row + arithmetic | **PASS** |
| "Largest five-year census decline on record" | claim | previous max −962,607 (2010–15); claim holds | **PASS** |
| Census peak 2010 | 128,057,352 | Table 1; series max | **PASS** |
| 2015 first intercensal decline | 127,094,745 | Table 1 | **PASS** |
| Japanese / foreign split 2025 | 119.13M (96.9%) / 3,840,039 (3.1%) | census summary; internal arithmetic | **PASS** |
| Oct 1, 2026 provisional estimate | 122.69M (−530k, −0.43%) | jinsui 202610 PDF | **PASS** |
| May 1, 2026 final JP / foreign | 118.838M (−855k) / 3.974M (+325k) | jinsui 202610 PDF | **PASS** |
| Oct 1, 2020 estimate "126,226,568" | chart note + callout (JA/EN) | **no accessible official source** (all avenues exhausted; see §6.2) | **INCONCLUSIVE → remediated** |
| Tokyo +1.3%; 46 prefectures declined; Tokyo 14.237M (11.6%); metro 36.975M (30.1%) | §2, §10 | census summary/outline | **PASS** |

### B. Births, deaths, natural change

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| Births 2025 | 671,270 (lowest since 1899) | 第2表 row 令和7 + press; series min confirmed | **PASS** |
| Deaths 2025 | 1,589,533 ("first decline in five years") | 第2表 + press 「５年ぶりの減少」; previous decline year 2020 confirmed in series | **PASS** |
| Natural decrease 2025 | −918,263; 19 consecutive years | 第2表 + press; 2007–2025 run confirmed | **PASS** |
| **Largest natural decrease = 2024** (−919,205), 2025 narrowed (−918,263) | §3 (previously corrected claim) | 2024 press 「過去最大の減少」; series max confirmed; 2025 「マイナス幅が縮小」 | **PASS** |
| Births peak 1949 | 2,696,638 | 第2表; series max | **PASS** |
| Full vital series 1899–2025 (births/deaths/natural/marriages; 124 rows each) | data.ts | unmodified extractor reproduced byte-identically from re-fetched 第2表; 124-row anchors | **PASS** |
| 1944–46 omitted; 1947–72 excl. Okinawa; occurrence basis | chart note + limitations | source note 1 verbatim | **PASS** |
| Marriages 1972 peak / 2000 / 2025 | 1,099,984 / 798,138 / 489,158 | 第2表 rows | **PASS** |
| First-marriage ages 2025 (provisional) | groom 31.0, bride 29.7 | nengai25 kekka PDF 「夫が31.0歳、妻が29.7歳」 | **PASS** |

### C. Fertility

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| TFR 2025 | 1.14, record low; Nov-2026 recalculation disclosed | 第3表 + official caveat note | **PASS** |
| TFR 1947 (previously corrected) | 4.54 | 第3表 row 「47 22 … 4.54」 | **PASS** |
| TFR series 1947–2025 (79 pts) | data.ts | 第3表 column; pipeline + anchors | **PASS** |
| Milestones 2005/2015/2020–25 | 1.26 / 1.45 / 1.33→1.14 | 第3表 | **PASS** |
| Replacement level ≈ 2.1 | §4 | standard demographic constant, correctly characterized | **PASS** |

### D. Aging, age structure, households

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| 65+ share observed 1950–2026 (17 pts) | 4.9 → 29.6 | topics149 表2 — all 17 rows match | **PASS** |
| 75+ share observed (17 pts) | 1.3 → 17.7 | 表2 | **PASS** |
| 2030–2050 projections (5+5 pts) | 30.8→37.1 / 18.8→23.2 | 表2 (IPSS republished) + IPSS xlsx | **PASS** |
| 2026 composition 65+/75+/80+/85+ | 36.24M / 21.68M / 12.88M / 7.20M | topics149 text + 表2 | **PASS** |
| 65+ population peaks 39.53M in 2043 | §6 | IPSS press release | **PASS** |
| Japan highest among 39 countries ≥40M (29.6%) | §8 | topics149 (UN-WPP-based, quoted as the bureau's comparison) | **PASS** (see limitations) |
| Census 2025 age structure | 0–14 10.9% (13.349M); 15–64 73.481M; 65+ 29.4% | census summary | **PASS** |
| WB age-structure series 1960–2025 (3 × 66 pts) | data.ts | live API spot checks (5 pts each, exact match) + committed JSON + anchors | **PASS** |
| **Average household size 1960–2025 (13 pts)** | incl. **1980 = 2.30** | handbook Table 2.3: **1980 = 3.22** — cross-table contamination demonstrated | **FAIL → corrected** |
| Ordinary households 2025 | 57,181,619 (+1.477M) | census outline anchors | **PASS** |
| One-person households 2025 | 23,689,024 = 41.4% | census outline/summary | **PASS** |
| One-person 2005–2020 | 29.5 / 32.4 / 34.6 / 38.1 | handbook Figure 2.3 ✓; census-2025 table prints 2020 at 38.0 — vintage difference | **PASS + disclosure added** |
| Nuclear-family 54.2% (2020); elderly households 22.66M = 40.7% (2020) | §9 | handbook Tables 2.4 | **PASS** |
| Never-married at 50 (2020) | M 28.3% / F 17.8% | handbook Table 2.9 | **PASS** |
| IPSS household projections | peak 57.73M (2030); <2 persons (2033); 44.3% (2050) | IPSS 2024 PR | **PASS** |

### E. Internal migration

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| Tokyo net in-migration 2025 | 65,219 | idou summary 「６万5219人と最も多く」 | **PASS** |
| Tokyo metro net in-migration | 123,534 (−12,309 YoY) | 「12万3534人の転入超過、前年に比べ１万2309人の縮小」 | **PASS** |
| 30 consecutive years (Japanese movers; 112,738) | §10 + stats card | 「11万2738人…30年連続の転入超過」 | **PASS** |
| Inter-municipal moves | 5,190,548 | 「519万548人…0.3%の減少」 | **PASS** |

### F. Projections

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| IPSS medium totals, 5-yr steps (11 pts) | 126,146.099k → 86,996.009k | xlsx (anchors) + press | **PASS** |
| 65+ share to 2070 | 38.7% | xlsx + press | **PASS** |
| Below 100M in 2056; 2070 = 69.0% of 2020 | §11 | press + arithmetic (86,996.009/126,146.099 = 68.96% ≈ 69.0%) | **PASS** |
| Assumptions: TFR 1.2713→1.3573; LE 85.89/91.94; migration 163,791/yr | §11 + note | press release (re-fetched) | **PASS** |
| High/low variants 95.49M / 80.24M | §11 + callout | press | **PASS** |
| 2025 projection (123,262,448) vs census (122,972,528) ≈ −290k | §11 callout | arithmetic 289,920 | **PASS** |

### G. Life expectancy

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| LE 2025 | M 81.35 / F 87.33 | life tables (re-fetched) | **PASS** |
| LE series 1947–2025 (79 × 2 pts) | data.ts | 参考資料2; pipeline + anchors | **PASS** |
| Male–female gap 2025 | 5.98 years | press + arithmetic | **PASS** |
| Female world #1 (as published) | §12, hedged 「公表されている」 | press ranking table (female 1st; male 7th, not cited) | **PASS** |

### H. International comparisons (World Bank WDI)

| Group | Website value(s) | Independent check | Outcome |
|---|---|---|---|
| TFR 2024, 13 economies | JPN 1.15 … USA 1.6265 | live API, exact float equality, 13/13 | **PASS** |
| 65+ share 2025, 13 economies | JPN 29.9940966737423 … | live API, 13/13 | **PASS** |
| Life expectancy 2024, 13 economies | JPN 84.0363414634146 … | live API, 13/13 | **PASS** |
| Japan long WB series spot checks | 1960/1980/2000/2020/2025 × 3 indicators | live API, exact | **PASS** |
| WB vs national dual citation (29.6% vs 30.0%) | aging-compare note | both values verified in their sources | **PASS** |
| Same-year comparison discipline; Taiwan exclusion; secondary-source disclosure | notes | verified against WDI coverage facts | **PASS** |

**Matrix totals:** 62 groups — **59 PASS · 1 FAIL (corrected) · 1 INCONCLUSIVE
(remediated) · 1 PASS-with-disclosure-added.**

---

## 5. Statistical methodology review

- **Denominators and rates.** TFR is correctly defined as the sum of age-specific
  fertility rates for women 15–49 (matching the MHLW definition); vital rates are
  quoted per 1,000 population as published, never recomputed with mismatched
  denominators. The birth-*rate* vs TFR distinction is explicit in §4.
- **Percentage changes.** Census change −2.5% (−0.51%/yr), Tokyo +1.3%, foreign
  +39.8%, household growth +1.477M — all recomputed and confirmed.
- **Derived vs published.** The natural-increase series is *published by the source*
  (and independently equals births − deaths in every row); household size is the
  published average, not a derived ratio. No silently derived series exists in
  Chapter 01.
- **Rounding.** Site values are the source's own rounded publications; chart
  formatting (`percent1`, `float2`, `int`) is consistent with source precision.
  No premature-precision artifacts found.
- **Series discontinuities.** 1944–46 omission, 1947–72 Okinawa exclusion, the 1965
  household-definition gap, the Sep-15 vs Oct-1 reference-date difference, the
  2020-census benchmark switch (Nov 2026), and the WDI-vs-national methodology gap
  are all disclosed at the point of use — plus the newly disclosed 38.1/38.0 vintage
  difference.
- **Projection assumptions and uncertainty.** Every projection surface is dashed,
  labeled `projectionFromYear`, carries scenario language ("シナリオであり確定した未来
  ではない"), and the high/low spread is stated. The 2025 projection-vs-observation
  gap is quantified. Model discipline is exemplary.
- **Correlation vs causation.** §13 explicitly refuses causal translation ("相関を因果
  として扱わないこと"); household-shrink/birth-decline co-occurrence is offered with
  an alternative explanation. No causal overreach found anywhere.
- **Superlative and consecutive-year claims.** "Births lowest since 1899" (series
  min ✓), "1949 all-time peak" (max ✓), "natural decrease 19 consecutive years"
  (run ✓), "largest natural decrease 2024" (max ✓ — the previously corrected claim
  is correctly stated in both languages), "deaths first decline in five years"
  (previous decline year 2020 ✓), "census largest five-year decline" (✓),
  "65+ record high" (29.6% ✓).
- **Selective comparison check.** The 13-economy panel is fixed across all three
  comparison charts with the same reference year per chart; no chart switches
  country sets or years to flatter a ranking.

## 6. Detailed findings

### 6.1 Finding 1 — household-size 1980 (FAIL, corrected)

**Claim as published:** average persons per household, census series 1960–2025, with
1980 = 2.30 (chart, table, CSV).

**Independent evidence:** Statistical Handbook of Japan 2026, Table 2.3
(`https://www.stat.go.jp/english/data/handbook/pdf/2026all.pdf`, re-fetched
2026-10-25) prints the 1980 row as `35,824 / 6.6 / 115,451 / 3.22 / 117,060 / 4.6` —
average size **3.22**. The project's own research note A-6 had recorded 3.22.

**Root cause (demonstrated):** `extract_households()` in `extract-series.py` scanned
all 9,813 handbook lines for `^year number  …` rows and assigned into a year-keyed
dict, so any later table overwrote earlier ones. Line 8068 — Table 14.6 (traffic
accidents), 1980 row `476,677 / 598,719 / 8,760 / 2.3 / 7.5` — placed *2.3*
(fatalities per 10,000 motor vehicles owned) at the exact column offset the household
parser reads, and 2.3 ∈ (2, 5) passed the plausibility filter. Reproduced
experimentally against the re-fetched handbook. No other year was contaminated
(verified: all other candidate rows place ints or out-of-range floats at that offset).

**Impact:** a spurious V-shaped dip (3.28 → 2.30 → 3.14) in Figure 7's line, table,
and CSV; no narrative sentence quoted the 1980 value, so no text changes were needed.

**Remediation:** parser restricted to the Table 2.3 block; all 13 points anchored;
monotonicity check added; extraction re-run (single-point diff 2.3 → 3.22); data.ts
regenerated; [4d] regression guards added to `validate-research.ts` and
negative-tested (corrupting 1980 back to 2.3 fails 3 checks).

### 6.2 Finding 2 — the 126,226,568 estimate (INCONCLUSIVE, remediated)

**Claim as published:** "the October 1, 2020 population *estimate* was 126,226,568"
(census chart note + §1 callout, both languages).

**Verification attempts (all documented):** the figure is absent from every archived
raw file; absent from the re-fetched handbook, 2025-census summary/outline, and
2020-census English summary; the 2020 annual-estimates URLs return 404; the
2021–2024 annual-estimates reports (re-fetched) all carry 2020 at the
census-benchmark value 126,146; census-evaluation URLs 404. The project's own
research notes explicitly marked it "NOT found … treat as unverified/superseded" at
build time — a provenance gap that should have blocked publication.

**Classification:** INCONCLUSIVE — not provably false, but unverifiable from any
accessible primary source; publishing it as fact violated the chapter's own sourcing
standard.

**Remediation:** both surfaces (4 language faces) now illustrate the same lesson
("estimates and censuses are different statistical products") with the fully verified
2025 pair — the Sep 15, 2025 estimate (123.21 million; topics149 表2) vs the Oct 1,
2025 census count (122,972,528; census summary). A [4d] guard forbids the number's
reappearance (negative-tested).

### 6.3 Finding 3 — one-person 2020 vintage (editorial, closed)

38.1% (handbook Figure 2.3, the value used) vs 38.0% (2025 census re-tabulation of
the same year). Both official; the chart cites both documents. The vintage difference
is now disclosed in the chart note (both languages) rather than silently mixed.

## 7. International comparability review

- All cross-country charts compare the **same indicator, same vintage, same year**
  within each chart; the panel (13 economies) is fixed and justified (major
  developed economies; Taiwan excluded with the WDI-coverage reason stated).
- WDI is correctly labeled a secondary UN-WPP-based compilation; Japan's *own*
  narrative uses national statistics, avoiding in-chart source mixing. The one place
  both appear (aging comparison: WDI 30.0% vs national 29.6%) presents them as an
  explicit methodological contrast.
- Age-standardization is not applicable to the chosen indicators (shares and
  both-sexes LE); the LE comparison correctly labels values as estimates and Japan's
  "world's highest" female-LE claim is attributed to the MHLW ranking publication
  rather than asserted independently.
- No unsupported rankings were found; the strongest ranking claim (39-country
  comparison) is attributed to the Statistics Bureau's own UN-based table.

## 8. Bilingual consistency review

- All 11 charts carry complete JA/EN titles, descriptions, units, axis labels, notes,
  and series names (enforced by the integrity gate; re-verified after remediation).
- Numerical claims were checked pairwise: every figure quoted in JA text matches its
  EN counterpart and the data module (including the remediated surfaces).
- Terminology is precise and equivalent: 確定数/概数 ↔ final/provisional;
  発生基準 ↔ occurrence basis; 推計・センサス statistical-product language is
  parallel; 置換水準 ↔ replacement level.
- Hedging strength is matched: the TFR provisional caveat, projection scenario
  language, "as published" attributions, and the §13 anti-causal discipline appear in
  both languages at equal force. Neither language makes stronger claims than the
  evidence.
- The previously corrected claims (1947 TFR 4.54; largest natural decrease = 2024)
  are correct in **both** languages.
- Japanese remains the default language with English secondary; no additional
  translation was introduced.

## 9. Research interpretation review

- Observations, comparisons, and hypotheses are structurally separated (observe →
  verify → compare → investigate → evaluate → act), and §13 restates the
  correlation/causation discipline.
- The policy-response list (§14) is descriptive, non-prescriptive, and explicitly
  notes that no known case of family-support measures alone restoring replacement
  fertility exists — a defensible reading of the comparative literature.
- The actions section (§15) is non-obligatory, ties each item to chapter evidence,
  and separates individual-level action from structural responsibility
  ("個人の努力だけで解決できるものではありません" / "cannot be solved by individual
  effort alone").
- No political or ideological framing was found; the "rankings never measure a
  society's worth" note actively guards against misreading.
- The 2025 TFR/complete-life-table pending revisions are disclosed as limitations —
  correct as of the audit date.

## 10. Remaining limitations (honest)

1. **UN WPP values** cited inside the Statistics Bureau elderly release (Italy 25.6%,
   Germany 24.2%, France 22.9%) were verified only as quoted by the bureau; the UN
   source itself was not queried. The site presents them as the bureau's comparison,
   which is accurate attribution.
2. The **39-country comparison universe** (population ≥ 40M) is the bureau's choice;
   the site reproduces it with attribution rather than re-deriving it.
3. The **2020 estimate 126,226,568** remains unverifiable; it was removed rather
   than confirmed. If the Bureau re-publishes the archived 2020 annual report, the
   claim could be re-evaluated.
4. **Touch tooltips** were verified under iPhone device emulation (standard headless
   practice); physical-device behavior was covered by the original post-launch QA.
5. **Pending official revisions** (Nov 2026 TFR recalculation; 2025 complete life
   table) are future changes, disclosed on-site.
6. Elderly-household figures remain 2020-census values (the 2025 detailed tabulation
   is not yet extracted) — correctly labeled on the site.

## 11. Test evidence summary

| Gate | Before remediation | After remediation |
|---|---|---|
| `bun run validate:research` | 523/0 (bug undetected) | **528/0** (5 new [4d] guards) |
| Negative test: 1980 → 2.3 | n/a | 3 checks FAIL, gate exits 1 ✓ |
| Negative test: reintroduce 126,226,568 | n/a | provenance guard FAIL, gate exits 1 ✓ |
| `bun run typecheck` | 0 errors | 0 errors |
| `bun run lint` | clean | clean |
| `bun run export:static` | OK | OK |
| `bun run verify:export` | 65/0 (17.3 MB) | 65/0 (17.3 MB) |
| Extraction reproduction | byte-identical to committed JSON | single-point diff (1980 only) |
| Browser: household table | `1980 | 2.30` (screenshotted) | `1980 | 3.22` (screenshotted, JA+EN) |
| Browser: chart ⇄ table ×3 | — | desktop ✓, mobile (390) ✓ (13 rows / 1 canvas each cycle) |
| Browser: hover + touch tooltips | — | `1985 平均世帯人員（一般世帯） 3.14` ✓ |
| Browser: range filter, legend, keyboard tabs | — | ✓ (screenshots) |
| Browser: JA → EN → JA round trip | — | ✓ values consistent both languages |
| Browser: CSV content | `1980,2.3` | `1980,3.22` + full attribution ✓ |
| Browser: console errors | 0 | 0 |
| Chapter 02 / theme / i18n / app shell | — | **zero diff vs `d2fb85d`** |

Screenshots: `research/ch01-audit-screenshots/` (before/after, desktop/mobile, JA/EN).
Raw re-fetch evidence: `research/chapter01/raw/audit-2026-10-25/` (workspace-only, gitignored).
Live WB verification transcript: `research/chapter01/raw/audit-2026-10-25/wb_live_values.txt`.

## 12. Release recommendation

**GO.** After the corrective commit on `audit/chapter-01-research-methodology` is
reviewed and merged (and the Pages deploy goes green), Chapter 01's statistical
content is verified to its primary sources to the extent those sources are publicly
accessible, its methodology disclosures are complete, and its interpretations stay
within the evidence. Until merge, the live site retains the two remediated defects.

— End of audit report —
