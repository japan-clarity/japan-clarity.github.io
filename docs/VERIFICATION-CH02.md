# Chapter 02 — Economy & Industry: Verification Report

**Branch:** `feature/chapter-02-economy-industry` (local; base `origin/main` = 9a9aad1)
**Date:** 2026-10-25 · **Status:** complete, PR-ready, NOT pushed (owner review required)

This report records the actual commands, outcomes and evidence for Chapter 02,
mirroring the verification discipline of Chapter 01 (see `docs/VERIFICATION.md`).

## 1. Research sources (all fetched 2026-10-25 from original domains)

| Source | Release | Published | Raw archived |
|---|---|---|---|
| ESRI (Cabinet Office) | 2024年度国民経済計算年次推計 (2020 base, 2008SNA) — main series, industry VA, employment, household account | 2025-12-23 | local (xlsx ×6 + PDFs) |
| ESRI reference tables | GDP国際比較 / 一人当たり名目GDP (USD, OECD ranks) | 2025-12-23 | local (PDF) |
| MHLW Monthly Labour Survey | 2025年分確報 + vintages 19t/27t/29ct (1995–2017) | 2026-02-25 | local (xls/xlsx) |
| MHLW Monthly Labour Survey | 2026年8月分確報 (monthly + international comparison) | 2026-10-23 | local (xlsx + 概況PDF) |
| Statistics Bureau, MIC | 労働力調査 長期時系列 (1953–2025) | fetched 2026-10-25 | local (xlsx, e-Stat) |
| Statistics Bureau, MIC | 科学技術研究調査 2025 + 2015 rounds | e-Stat 2025-12-12 | local (PDF) |
| OECD | Productivity database DSD_PDB@DF_PDB(2.0), GDPHRS PPP | fetched 2026-10-25 | **committed** (CSV ×4) |
| World Bank | WDI API, vintage 2026-10-08 | fetched 2026-10-25 | **committed** (JSON ×20, CC BY 4.0) |

Provenance, licenses and redistribution decisions: `research/DATA-LICENSES.md`.
Acquisition inventories with URLs/HTTP statuses/sha256s: `research/chapter02/notes/*-inventory.md`.

## 2. Extraction pipeline — actual run evidence

```
$ python3 research/chapter02/scripts/extract-series.py
[esri]  39 checks   (GDP levels/growth/deflator anchors 521675.1/634226.0/464267.4/
                     584471.1/112.4/108.5; industry sector sums ≈ printed totals;
                     employment 6698.3→6928.4万人)
[mhlw]  27 checks   (vintage YoY overlaps ≤0.35pp; chained levels = published levels
                     2018–2023; benchmark jump 2024/2025 = +2.59%/+2.58% documented)
[oecd]  10 checks   (12 economies, 2025 values, JPN 61.77/KOR 62.46/USA 104.74)
[wb]    18 checks   (vintage 2026-10-08 on every file; JPN PPP 1990=20331.1/2025=55421.9)
[rd]    36 checks   (表1-2/表2 anchors; A/B×100 = published ratio ±0.02pp every year)
[lfs]    3 checks   (1953=3913万; 2025=6828万)
TOTAL: 107 checks, 0 failures
```

## 3. Technical gates — actual runs on the branch

| Gate | Command | Result |
|---|---|---|
| Typecheck | `bun run typecheck` | 0 errors |
| Lint | `bun run lint` | clean |
| Research integrity | `bun run validate:research` | **513 checks, 0 failures** (baseline 259/0; +254 from ch02: source/chart/content checks + [4b] data agreement incl. snapshot hash `e1380c76c24f1e1b`) |
| Static export | `bun run export:static` | OK (41 index pages + redirect + 404) |
| Export verifier | `bun run verify:export` | **65 checks, 0 failures** (baseline 57/0; +8 ch02 published assertions) |

Note: dev server was stopped during `next build` (4 GB sandbox OOM hazard) and
restarted afterwards — the known procedure from the light-theme work.

## 4. Chapter 01 regression — zero diff

```
$ git diff origin/main --stat -- src/chapters/chapter-01/ research/chapter01/ src/lib/research/
(empty)
```

Chapter 01 interactions re-tested in-browser on this branch: chart↔table cycle ×3
on `ch01-births-deaths` (table 125 rows; 2025 row = "671,270 / 1,589,533" exact)
and toggle on `ch01-census-population` (23-row table); canvas re-rendered non-blank
after every cycle. 11 canvases present on ch01 pages. Chapter 01 page titles render
identically (the per-chapter long-title map reproduces the previous hardcoded string).

## 5. Browser acceptance (agent-browser, real interactions)

| Check | Result |
|---|---|
| ch02 JA page | 10 canvases, h1 日本経済と産業の構造を読み解く, no console/page errors |
| ch02 EN page | 10 canvases, h1 Understanding Japan's Economy and Industrial Structure |
| Viewports | 320/375/390/430/768/1024/1440 — zero horizontal overflow, 10 canvases each |
| Chart↔Table ×3 | ch02-wages: 30-row table each cycle, canvas restored (654×410) ×3 |
| Table values | GDP table 1994=521.7/464.3, 2024=634.2/584.5 (exactly the verified series) |
| Range filter | ch02-productivity-japan: 全期間→1990年以降→全期間 with aria-pressed states |
| Tooltip (desktop hover) | "2010 名目賃金指数（連結）101.5 実質賃金指数（連結）107.2" (= 101.54/107.21) |
| Tooltip (mobile tap, 390px) | same values |
| CSV export | 1400 B; attribution header (source, URL, license) + exact chained values |
| Language switch | JA→EN deep link preserved (`/en/chapters/economy-industry/`) |
| Sources page | all 8 ch02 source records listed |
| Overview | ch02 shows published-limited; ch03+ still planned (14 dimensions intact) |
| 404 | bilingual, light theme, no placeholder leakage |
| Footer | pinned exactly (1440×1200: body=footer=1200px, zero gap) on short pages; pushed naturally on 22,839px chapter page |
| VLM design review | museum light theme confirmed, no dark fragments, chart contrast OK |

Screenshots (16): `research/ch02-screenshots/` — JA/EN desktop + mobile, table view,
range filter, tooltips, ch01 regression, home/overview/404, full-page.

## 6. Known limitations (rendered on the site)

See the chapter's limitations section and `src/chapters/chapter-02/index.ts`:
chained wage index (derived), 2024 benchmark-update level gap, industry aggregation
(derived, verified), R&D GDP-vintage splice, PPP/OECD compilation caveats, MLS
coverage & response rate (67.3%), and the not-yet-verified topics explicitly recorded
as future work (dualism decomposition, industry-level productivity, trade structure,
innovation outcome indicators, SME statistics, regional indicators).

## 7. What is NOT claimed

- GitHub CI has not run (no PR exists yet — owner creates it after pushing the branch).
- No merge, no deployment, no push of any branch has been performed.
- Calendar-2025 national-accounts finals are unpublished; the 2025 real-growth figure
  (+1.2%) is World Bank WDI and is labeled as such on the site.

## 8. Audit remediation addendum (2026-10-25, independent pre-merge review)

An independent audit found the OECD GDP-per-hour volume series mislabeled as an
index (2020 = 100) and a stale 1.0% growth rate in the productivity chart note.
Remediation (Approach A: original OECD level values preserved, all labels corrected;
growth rates restated as 4.1% / 1.3% / 0.9% from the archived series) is fully
documented in **`docs/REMEDIATION-CH02-AUDIT.md`** — before/after table, changed-file
list, negative-tested regression guards (validate:research now 523 checks), and
re-run evidence for every gate above. Post-remediation state:

- extraction re-run: 107/0, `extracted-series.json` byte-identical (md5 unchanged)
- validate:research **523/0** (added `[4c]` OECD unit-metadata regression checks)
- tsc 0 · eslint clean · export:static OK · verify:export 65/0
- browser re-acceptance: tooltips/table/CSV/mobile/range-filter/EN parity re-verified
  (screenshots: `research/ch02-audit-screenshots/`); tooltip on 2020 shows **50.5**
- Chapter 01: zero diff vs origin/main; live toggle verified (671,270 / 1,589,533)
