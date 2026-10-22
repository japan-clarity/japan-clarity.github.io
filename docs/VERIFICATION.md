# Japan Clarity — Verification Log

All checks below were actually executed in the development environment on
**2026-10-22**. Logs of the commands and their outputs are preserved in the
session worklog; screenshots are under `research/verification-screenshots/`.

## 1. Build & integrity gates (commands + results)

| Check | Command | Result |
|---|---|---|
| TypeScript | `bunx tsc --noEmit` | 0 errors |
| ESLint | `bun run lint` | 0 errors, 0 warnings |
| Research integrity gate | `bun run validate:research` | 259 checks, 0 failures |
| Series extraction (raw → JSON) | `python3 research/chapter01/scripts/extract-series.py` | 40+ anchor checks pass, incl. war-gap handling and footnote regression anchors |
| Static export build (Mode B) | `DEPLOY_TARGET=github-pages next build` | 35 routes prerendered (incl. bilingual not-found pages), no errors |
| Export post-processing | `bun run scripts/post-export.ts` | root redirect + 404 written |
| Static export verification | `bun run scripts/verify-export.ts` | 57 checks, 0 failures (8.5 MB) |

Notable integrity validations inside `validate:research`:
- chart/data agreement: every published series in the app's generated
  `data.ts` matches `extracted-series.json` point-for-point
- dataset snapshot hash unchanged (unexpected-dataset-change detection)
- every chart cites only sources with valid, non-`unverified` provenance
- ja/en dictionary key parity; bilingual completeness of all content blocks
- no orphan charts; all chart references in content resolve

## 2. Browser verification (agent-browser, Chromium)

Verified on desktop (1440×900) and mobile (375×812, 320×700) viewports:

- **Routing & language**: `/` redirects to `/ja/` (dev 307); ja is default;
  switch order is 日本語 LEFT / English RIGHT on desktop and mobile; switching
  preserves the current page (tested home → home and chapter → chapter);
  `<html lang>` and page titles update correctly; browser refresh keeps the
  locale (static routes).
- **Navigation**: desktop nav, chapters dropdown (14 items), mobile Sheet
  menu (primary nav + 14 chapters + status badges), open/close working.
- **Chapter 01**: all 11 figures render canvases; 16 sections present; TOC
  anchors; prev/next chapter navigation; sources and limitations sections.
- **Chart ⇄ table restoration (critical regression)**: chart → table → chart
  executed **3 consecutive times on desktop** (births/deaths chart; table
  showed 124 rows, chart re-rendered with pixels each time) and **3 times on
  mobile** (TFR chart; 80 rows from 1947; canvas restored with pixels each
  time). No blank-chart regression observed.
- **Tooltips**: desktop hover shows localized values with units — verified
  content `2007 | Live births | 1,089,818 | Deaths | 1,108,334` (matches the
  verified source data). Mobile tap shows `2006 | 合計特殊出生率 | 1.32`
  (matches MHLW series).
- **Series toggling**: legend clicks hide/show series (verified via tooltip
  content reflecting a single series and restoring both).
- **Range filter**: 全期間 / 1990年以降 / 2010年以降 buttons flip
  `aria-pressed` and update the chart.
- **Keyboard**: tab list is operable with arrow keys (Chart → Table focus and
  activation confirmed).
- **Accessibility landmarks**: skip link, header/footer/nav/main/section,
  `role=tab/tabpanel`, `role=img` with descriptions on chart canvases,
  semantic tables with caption and scoped headers.
- **Overflow**: no horizontal overflow at 1440, 375, and 320 px on home and
  chapter pages.
- **Footer**: pinned exactly to the viewport bottom when content is short
  (verified at 1440×1400: footer bottom == viewport), and pushed down
  naturally on long pages — no overlap or floating gap.
- **Back-to-top**: appears after scrolling; returns scrollY to 0.
- **Copy-link**: section copy button present and executes (headless
  clipboard read-back is blocked by permissions, which is expected outside
  user gesture context).
- **404**: unmatched locale paths render the bilingual not-found with full
  layout; standalone `out/404.html` covers non-locale paths in static export.
- **Console**: zero errors and zero warnings on all visited pages.
- **Mode A / Mode B coexistence**: the production static export
  (`DEPLOY_TARGET=github-pages`, isolated `.build-export` dist dir) was run
  while the dev server was live on port 3000; the dev server answered 200
  before, during, and after the export build.

## 3. Research verification (Chapter 01)

Every figure was verified against archived copies of the original documents
(accessed 2026-10-22); see `research/chapter01/notes/` for verbatim quotes:

- MHLW 2025 final vital statistics (published 2026-09-30): births 671,270;
  deaths 1,589,533; natural decrease −918,263 (19th consecutive year); TFR
  1.14; marriages 489,158.
- MHLW 2025 abridged life tables (2026-07-24): male 81.35 / female 87.33.
- 2025 Census basic complete tabulation (2026-09-29): total 122,972,528;
  65+ 29.4%; households 57,181,619; average size 2.10; one-person 41.4%.
- Statistics Bureau elderly release No.149 (2026-09-20): 65+ 29.6% (2026).
- IPSS 2023 medium variant: 2070 total 86,996,009 thousand; below 100M in
  2056; high/low 95.49M/80.24M.
- World Bank WDI (API lastupdated 2026-10-08, CC BY 4.0): same-year
  comparison tables for TFR (2024), 65+ share (2025), life expectancy (2024)
  across 13 economies; Japan TFR 2024 = 1.15 cross-validated against MHLW.

Honest corrections made during verification (kept for transparency):
- The 2020 census total is **126,146,099**; a widely quoted 126,226,568 is
  the October 1, 2020 *estimate* — the site discloses the distinction.
- The MHLW vital table omits 1944–1946 (war records lost) and excludes
  Okinawa for 1947–1972 — displayed as gaps and disclosed in limitations.
- World Bank series (UN WPP-based) differ from national statistics by
  0.1–0.6pp; used only for international comparison, with the difference
  disclosed.

## 4. Known limitations of this verification

- Clipboard write success is inferred (headless read-back is blocked);
  manual confirmation on a real browser is recommended.
- CSV download was exercised via the button handler; the saved file was not
  byte-compared in the browser (the same `buildCsv` output is covered by the
  integrity gate's data-agreement checks).
- GitHub Pages deployment itself has NOT been executed (no repository write
  credentials in this environment); Mode B is verified up to and including
  the deployable `out/`-equivalent artifact and the workflow files.

---

## 5. Remediation re-verification (2026-10-22, second session)

After the pre-publication remediation (history purge, scaffold/dependency
minimization, copy corrections — see `docs/REMEDIATION.md`), **every gate was
re-run from scratch**:

| Check | Command | Result |
|---|---|---|
| Install | `bun install` | 54 packages removed, lockfile −966 lines |
| TypeScript | `bunx tsc --noEmit` | 0 errors |
| ESLint | `bun run lint` | 0 errors, 0 warnings |
| Research integrity | `bun run validate:research` | 259 checks, 0 failures |
| Static export | `bun run export:static` | 42 HTML files, no errors |
| Export verification | `bun run verify:export` | 57 checks, 0 failures (8.4 MB) |
| History purge | `git log --all -- .env` / `git grep` over all commits | 0 matches (`.env` value and path gone from all reachable history) |
| Dev server | HTTP status before/during/after export | 200 throughout |

Browser regression re-run (Chromium via agent-browser):

- `/` → `/ja/` redirect; ja-JP default; 日本語 left / English right.
- ja → en → ja round trips preserve both the home page and the Chapter 01
  deep link; `html lang` + titles switch correctly
  (`ja-JP | 01 人口・家族…` ↔ `en | 01 Population & Family…`).
- 11 chart canvases on Chapter 01 (desktop 1440×900 and mobile 375×667).
- Chart → Table → Chart **×3 desktop** (22-row and 124-row tables) and
  **×3 mobile**; canvas count restored to 11 every time; first canvas
  `toDataURL()` length identical before/after (42,126 = 42,126) — pixel-level
  restoration confirmed.
- Touch-type pointer events on mobile produce the localized tooltip with a
  verified value (`1960 | 総人口（国勢調査） | 94,301,623`); mobile Sheet menu
  opens/closes.
- Range filter `1990年以降` flips `aria-pressed` and updates the chart.
- Footer pinned exactly to viewport bottom on a short page at 1440×1400
  (footer bottom == 1400 == viewport); pushed naturally on the 22,077 px
  chapter page; no horizontal overflow at 1440 / 375 / 320 px.
- Console: zero errors (only pre-existing benign dev warnings).
- Screenshots: `research/verification-screenshots/remediation-desktop-ch01-ja.png`,
  `remediation-mobile-ch01-ja.png`, `remediation-desktop-footer-sticky.png`.

Independent read-only attribution audit (task R-2) of every 2025-vintage
figure: 16 figure groups — data values and source register fully correct
(14 PASS); 2 copy-level factual errors found and fixed (natural-decrease
record year; TFR 1949→1947), plus 5 attribution nits corrected (IPSS
publication date, foreign-resident share basis, census-consistent
approximations, one-person chart source list, sign notation).
