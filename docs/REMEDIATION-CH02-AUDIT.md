# Chapter 02 — Independent Research Audit Remediation Record

**Date:** 2026-10-25 · **Branch:** `feature/chapter-02-economy-industry` (corrective
commits on top of `637688e`, the published PR tip) · **Scope:** narrowly limited to
the two confirmed findings. No dataset reconstruction, no rewrite of published
commits, no push.

An independent pre-merge review identified (1) a statistical unit-labeling error on
the OECD labour-productivity series and (2) a Japanese/English growth-rate
inconsistency. This record documents the verification, the chosen remedy, the exact
changes, and the re-run evidence.

## Finding 1 — OECD GDP-per-hour volume series was mislabeled as an index (2020 = 100)

### Verification of the official OECD metadata (step 1 of the audit)

Re-read directly from the archived evidence (no re-fetch, dataset untouched):

- `research/chapter02/raw/oecd/oecd-gdphrs-ppp-volume.csv` — every JPN row carries
  `MEASURE=GDPHRS` ("GDP per hour worked"), `UNIT_MEASURE=USD_PPP_H` ("US dollars
  per hour, PPP converted"), `PRICE_BASE=LR` ("Chain linked volume (rebased)"),
  `BASE_PER=2020`, `TRANSFORMATION=N` ("Non transformed data"), `UNIT_MULT=0` (Units).
- `research/chapter02/raw/oecd/oecd-dataflow-def.json` — the dataflow definition
  confirms the same codelist names (CL_MEASURE_PROD.GDPHRS = "GDP per hour worked";
  CL_UNIT_MEASURE.USD_PPP_H = "US dollars per hour, PPP converted").

**Conclusion:** the series is chain-linked volume GDP per hour worked expressed as
**levels in PPP-converted US dollars per hour**, with a 2020 **reference year**
(price/PPP base). It is **not** an index rebased to 2020 = 100 — the 2020 observation
is **50.5451** (2025 = 53.0228; 1970 = 14.8617). The extraction pipeline's own
`vintageNote` had documented this correctly; the presentation labels did not.

### Chosen remedy — Approach A (preserve original OECD values, correct all labels)

Approach A was selected over converting to a derived 2020 = 100 index because:

- it keeps every displayed number identical to the archived OECD observations
  (zero-difference principle; no new derived series to disclose or maintain);
- growth rates are invariant to the choice (ratios of levels), so no narrative
  claim changes numerically;
- the audit asked for the narrowest corrective patch, explicitly not a reconstruction.

### Before → after (every corrected surface)

| Surface (file) | Before | After |
|---|---|---|
| Chart title (`charts.ts`) | 日本の時間当たりGDPの推移（実質・2020年=100） / "volume series (2020 = 100)" | 日本の時間当たりGDPの推移（実質・PPP換算） / "volume series (USD PPP/hour)" |
| Chart unit → tooltip context, table header, CSV `# Unit:` | 指数（2020年=100） / "index (2020 = 100)" | 米ドル/時間（PPP・連鎖実質・2020年基準） / "USD per hour (PPP, chain-linked volume, 2020 reference year)" |
| Chart y-axis label | 指数（2020年=100） / "index (2020=100)" | 米ドル/時間（連鎖実質） / "USD per hour (volume)" |
| Series name (tooltip/legend/CSV column) | 時間当たりGDP（実質） / "GDP per hour worked (volume)" | 時間当たりGDP（実質・連鎖） / "GDP per hour worked (chain-linked volume)" |
| Chart note | "連鎖実質系列（2020年基準）…" (ambiguous, read as index) | explicitly: level series in USD/hour, **not an index**; 2020 reference year = price/PPP base; 2020 observation is 50.5, not 100; levels not directly comparable with the current-price chart (61.8 in 2025) |
| Narrative paragraph (`content-a.ts`) | OECDの実質系列（連鎖・2020年=100） / "volume series (chain-linked, 2020=100)" | 連鎖実質・PPP換算の米ドル/時間による水準・2020年基準 / "chain-linked levels in US dollars per hour (PPP-converted, 2020 reference year)" |
| Source register (`sources.ts`) `referencePeriod` | "Japan volume series 1970–2025 (2020=100)" | "Japan chain-linked volume levels 1970–2025 (USD PPP/hour, 2020 reference year)" |
| Source register `statisticalUnit` | "…、指数（2020年=100・実質）" / "; index (2020=100, volume)" | "…現在価格は国際比較用の水準、連鎖実質（2020年基準）は時間軸比較用の水準系列 — いずれも指数ではない" / "…a level series for comparison over time — neither is an index" |
| Generated data module (`data.ts`) + codegen template | `chain-linked volume (2020=100)` | `chain-linked volume LEVELS in USD per hour (PPP-converted, 2020 reference year; 2020 = 50.5, not an index)` — regenerated; numeric arrays byte-identical |
| Research note (`notes/oecd-worldbank-summary.md`) | "JPN volume series (2020=100):" | "JPN chain-linked volume series (USD PPP/hour, 2020 reference year — LEVELS, not an index; the 2020 observation is 50.55)" + documented CAGRs |

The historical real-wage growth-chain (MHLW) keeps its clearly disclosed derived-series
status (limitation #1, chart note, source register) — that series **is** a genuine
index and was not touched.

## Finding 2 — Growth-rate statements

Recomputed from the archived series (exact values, CAGR):

- 1970 → 1990: (33.509336/14.861674)^(1/20) − 1 = **4.149%** → displayed "4.1%"
- 1990 → 2025: (53.022776/33.509336)^(1/35) − 1 = **1.320%** → displayed "1.3%"
- 2010 → 2025: (53.022776/46.252650)^(1/15) − 1 = **0.915%** → displayed "0.9%"

| Statement (before) | Corrected (after) |
|---|---|
| JA chart note: "年平均伸びは約1.0%" (1990–2025) | "約1.3%" |
| EN chart note: "roughly 1.0% a year" (1990–2025) | "roughly 1.3% a year" |
| JA/EN chart note + narrative + competitive-interpretation callout: "年平均3.8% / +3.8% (1970–90)" | "年平均4.1% / +4.1%" |

The audit's example formula matches: (53.0227757543 / 33.5093364156)^(1/35) − 1
≈ 1.32%. The existing 1990–2025 "+1.3%" in the narrative paragraph and the 2010–25
"+0.9%" were already correct and are unchanged. Related OECD-series growth statements
were audited; the 1970–90 "3.8%" was additionally found inconsistent with the
archived series (4.1%) and corrected in all four places it appeared (chart note JA/EN,
narrative JA/EN, competitive-interpretation callout JA/EN — 6 strings in 3 files).
The "半減以下 / halving-and-more" characterization remains true (4.1 → 1.3).

## Exact changed files (8 code/data + 1 screenshot set)

```
src/chapters/chapter-02/charts.ts                  (ch02-productivity-japan spec)
src/chapters/chapter-02/content-a.ts               (productivity trend paragraph)
src/chapters/chapter-02/content-b.ts               (interpretation callout rate)
src/chapters/chapter-02/sources.ts                 (oecd-pdb-2026 register entry)
src/chapters/chapter-02/data.ts                    (regenerated comments only)
scripts/generate-chapter-02-data.ts                (codegen template + vol2020)
scripts/validate-research.ts                       (new [4c] regression section)
research/chapter02/notes/oecd-worldbank-summary.md (label + CAGR documentation)
research/ch02-audit-screenshots/                   (7 after-state screenshots)
```

Numeric data arrays are byte-identical to the verified dataset
(`extracted-series.json` md5 unchanged: `6f391171b4052e65491351f24ac121fb`;
snapshot hash `e1380c76c24f1e1b` re-confirmed).

## Regression prevention (audit requirement 5)

New `[4c] OECD unit metadata` section in `scripts/validate-research.ts` (10 checks):

1. archived JPN rows must carry `GDPHRS/USD_PPP_H/LR/N/BASE_PER=2020/UNIT_MULT=0`;
2. the archived 2020 observation must be the level 50.545 (not index 100);
3. the generated module must carry levels (2020 = 50.5, 2025 = 53.0);
4. productivity-chart surfaces (title/unit/yLabel/description/note/series names)
   must never match an index mislabel pattern (`2020年=100` / `2020 = 100` — regex
   engineered to never match the legitimate wage `2020年平均=100` / `2020 avg = 100`
   or deflator `2020暦年=100` / `CY2020 = 100`);
5. the chart unit must state USD-per-hour and must not say 指数/index;
6. the source register must describe USD/hour units with no index mislabel;
7. CAGRs recomputed from the module series must equal 4.149% / 1.320% / 0.915%;
8. the chart text must state 4.1% and 1.3% and not the stale 3.8%/1.0%;
9. no chapter narrative mentioning OECD may describe the series as an index;
10. no OECD narrative may carry the stale 1970–90 rate (+3.8%).

**Negative test performed:** temporarily re-injecting the mislabeled unit and the
stale 1.0% rate made exactly checks 4, 5 and 8 fail; after reverting, the gate passed
again. The guard is demonstrated effective, not just present.

## Re-run evidence (audit requirements 6–9)

| Gate | Result |
|---|---|
| Extraction re-run (`extract-series.py`) | 107 checks, 0 failures; output byte-identical |
| Research integrity (`validate:research`) | **523 checks, 0 failures** (was 513; +10 new [4c]) |
| TypeScript (`tsc --noEmit`) | 0 errors |
| ESLint (`eslint .`) | clean |
| Static export (`export:static` + `post-export`) | OK |
| Export verification (`verify:export`) | 65 checks, 0 failures |
| Exported HTML label scan | corrected title/unit/levels present in `ja/` + `en/`; remaining `2020=100` occurrences audited one-by-one — all are the legitimate MHLW wage index or ESRI GDP deflator (genuine indices, disclosed as such) |
| Browser (agent-browser, port 3000) | tooltip 2020 → "時間当たりGDP（実質・連鎖） 50.5" (level, not 100); chart↔table toggle shows corrected column header + unit, 56 rows 14.9→53.0; CSV export captured via blob hook: corrected title/unit/reference-period with original values; range filter 全期間↔1990年以降↔全期間 with aria-pressed states and data endpoints verified (1973 vs 1992 at left edge); mobile 375px zero horizontal overflow + tap tooltip (2022 → 52.4); EN page semantic parity with JA; sources register page shows corrected reference period; zero console/page errors |
| Chapter 01 regression | `git diff origin/main -- src/chapters/chapter-01/ research/chapter01/ src/lib/research/` = **empty**; live chart↔table on 出生数・死亡数 renders 2025 row = 671,270 / 1,589,533 (exact verified values) |

## Remaining limitations (honest statement of scope)

- Only the OECD GDPHRS presentation was unit-audited end-to-end in this pass. Other
  Chapter 02 series keep their existing verified statuses (ESRI/MHLW/STATB/WB as
  documented in `docs/VERIFICATION-CH02.md`); no claim is made here that all economic
  statistics were independently re-verified against original sources.
- The current-price OECD comparison chart (61.8 USD/h in 2025) and the volume trend
  chart necessarily show different 2025 levels (61.8 vs 53.0) because current-price
  and 2020-reference-price valuations differ; the chart note now states this
  explicitly. A future enhancement could add a dedicated explainer.
- ECharts tooltips show series name + value (site-wide design); units appear on the
  axis, in the table header, in the CSV `# Unit:` line, and in the chart note.
- 2025 observations are the 2026-10 OECD vintage (latest available at fetch time);
  annual OECD updates revise history retrospectively.
