# Chapter 03 Pre-Merge Independent Research, Security & Release-Readiness Audit

- **Audit**: v2.0 pre-merge audit of `feature/chapter-03-housing-cost-of-living`
- **Audited branch tip (delivered)**: `b4f6c06` (feature branch, PR open)
- **Authoritative baseline**: `origin/main = f7e1fee` (PR #3 merge)
- **Remediation commit (this audit)**: `37072e5`
- **Audit date**: 2026-10-26 (fresh live re-fetches; see §2)
- **Recommendation**: **GO** — after the five corrections in `37072e5` (all
  narrative-layer; the data layer passed 100% and is byte-identical), no
  material release criterion fails. Conditions for the owner are listed in §9.

---

## 1. Executive summary

This audit re-verified Chapter 03's statistical claims **from freshly
re-fetched primary sources** (not from the development-time archives), audited
the extraction pipeline for reproducibility, ran the full technical gate suite
in a clean worktree, performed public-release security sanitization, and
executed browser-level functional/regression verification.

- **Data layer: 100% PASS.** Every value in the generated data module was
  confirmed against independently downloaded official files (housing survey
  PDF + five e-Stat time-series tables + construction-period table; FIES
  summary PDF + seven e-Stat tables; two CPI PDFs + four e-Stat CSVs; two OECD
  SDMX extracts + unit probe; two MLIT workbooks). All 20 headline figure
  groups and every supplementary series match exactly.
- **Extraction pipeline: byte-reproducible.** Re-running
  `research/chapter03/scripts/extract-series.py` against the auditor's own
  re-downloads (1655 anchor checks, exit 0) regenerated
  `notes/extracted-series.json` **byte-identical** to the committed file
  (sha256-16 `66c6f5355fe7fcab`); regenerating `data.ts` is byte-identical too.
- **Narrative layer: five demonstrated defects found and corrected** (`37072e5`):
  prose claims that contradicted the site's own verified data (§4). This is the
  same failure class as the Chapter 01 year-swap — checkable claims, wrong in
  the gloss — and the automated gate could not catch them because its text
  guards did not pin peak/trough claims. Nine new G9 guards now fence this
  class (940 → 949 checks), negative-tested.
- **Security/sanitization: PASS** (no secrets, no `.env`, no PII, no
  databases, no dev artifacts tracked; low-risk sandbox path references are
  documented and consistent with the merged Ch01/Ch02 precedent).
- **Clean-environment validation: PASS** (tsc 0 errors, eslint 0/0, research
  gate 949/0, contrast 58/0, static export 74/0, 18.6 MB).
- **Browser verification: PASS** (13 figures JA/EN, five chart⇄table
  round-trips with exact cell verification, desktop+mobile tooltips matching
  the verified series, CSV attribution, range filters, keyboard tabs,
  JA↔EN + deep links, seven viewports 320–1440 with no horizontal scroll,
  sticky footer, 404, Ch01/Ch02 spot regressions, clean console).
- **Chapters 01/02 protection: PASS** — byte-identical to `origin/main`
  (empty diff over their source trees); browser spot-checks show the corrected
  Ch01 household figure (3.22) and Ch02 USD-PPP labelling.
- **GitHub Actions: PASS, unchanged** — PR validation (`ci.yml`) runs
  validation only with `contents: read`; production deployment (`deploy.yml`)
  triggers only on `main` with least-privilege Pages permissions. The branch
  does not modify workflows.

## 2. Independent re-verification method

All sources were re-downloaded from their official domains on 2026-10-26 by
the auditor (archive: workspace-only, `research/chapter03/raw/` is gitignored;
URLs identical to `research/chapter03/scripts/fetch-*.sh`):

| Source family | Files re-fetched | Result |
|---|---|---|
| 住宅・土地統計調査 2023 確報 | `kihon_gaiyou.pdf` (747,841 B) | headline + 表2-1 + 付表 verified |
| e-Stat housing time series | tables 1-1 / 4 / 9-1 / 13 / 14-1 + 主要統計表 第4表 | all series verified |
| FIES 2025 | `summary.pdf` + t1-1 / t1-2 / t3-7 / solo t1 / solo t8 / longtime ×2 | all values verified |
| CPI | `zen-n.pdf` + `zenkoku.pdf` + 4 long-run CSVs | all values verified |
| OECD SDMX | PTI + RHP CSVs (13 economies) + all-measures probe | 660 + 722 rows, metadata verified |
| MLIT | housing-starts xls + 地価公示 xls | 78 + 8 values verified |

## 3. Statistical evidence matrix (data layer)

Every data-module series was compared value-by-value against the re-fetched
sources. **0 mismatches** across: stock/occupied/vacant counts (13 points
each), vacancy-rate series (13), tenure shares + counts (6 series × 13),
vacancy types (4 × 3), prefecture rates (11 of 11), floor areas (3 × 12),
construction bands (14 + residual), FIES expenditure (26), ten-category
structure (amounts + shares), tenure table (5 rows × 3), solo (7), worker (5),
regional (15 × 3), CPI long-run (56), groups (30), group YoY (30), private-rent
YoY (6), headlines (4), OECD PTI Japan (66), RHP Japan (66), 2015 anchors
(13 × exactly 100), 2025 comparison (13), MLIT starts (78), land prices (8).

Classification per the project convention:
- **PASS** — every data-module value above, independently confirmed.
- **NOT COMPARABLE (handled correctly in the chapter)** — 品目分類 vs
  用途分類 dual publication (the chapter uses 用途分類 and says so; the
  品目分類 food amount 94,895 never appears as a 用途分類 value);
  FIES-household-frame 87.3% vs dwelling-based 60.9% (both pinned, distinction
  drawn in four places); CPI 2020-base headline vs 2025-base long-run series
  (YoY agreement verified); OECD index growth vs national price levels (never
  mixed); 専用住宅 90.86 m² vs all-occupied 91.66 m² (denominators labelled).
- **INCONCLUSIVE (disclosed, not estimated)** — pre-1981 seismic-code dwelling
  counts (published bands straddle the boundary; chapter explicitly refuses to
  estimate); vacancy condition distribution; mortgage-burden distributions.

Derived-ratio recomputation (auditor's own arithmetic from published amounts):
4.0 / 20.9 / 4.2 / 26.4 / 12.5 % — all recompute to 0.1 pt; the chapter
discloses them as DERIVED in title, note, source register and limitations.

## 4. Findings and remediation (issue ledger)

Five demonstrated defects — all in narrative/chart-description prose, none in
the data layer, all corrected by `37072e5` with regression guards added:

| ID | Severity | Defect | Evidence | Fix |
|---|---|---|---|---|
| CH03-PM-01 | MINOR/blocking-for-merge | RHP peak stated as 1990/163.3 (4 strings: §3 JA/EN + chart #12 JA/EN) | series max is **1991/165.8** (own data + live OECD) | corrected + G9 guard |
| CH03-PM-02 | MINOR | PTI trough stated as 2010/97.4 (EN) and 「2015年を底に」 (JA) | post-1973 minimum is **2009/96.0** | corrected + G9 guard |
| CH03-PM-03 | MINOR | Floor-area peak stated as 2013/94.42 m² (4 strings) | series max is **2003/94.85** (own data + e-Stat) | corrected + G9 guard |
| CH03-PM-04 | MINOR | Chart #7 claimed 2025 expenditure "back **above** the 2000 level" | 314,001 < 317,328 (contradicts own data and §7 prose) | corrected + G9 guard |
| CH03-PM-05 | MINOR | Chart #3 attributed the ≈4× rise to the post-1990s period | 4×/30 yr holds only for 1963→1993 (2.5→9.8); post-1993 ≈ ×1.4 | corrected + G9 guard |

Observations (no change required): the Engel「過去30年で最高」claim is verified
only over the 2000–2025 window (no counter-evidence found for 1995–1999 —
residual risk documented); documentation counts differ trivially from observed
runs (extraction anchor checks printed 1655 vs the documented 1,656; negative
test #3 fired 2 guards vs the documented 3) — recorded as documentation nits,
no impact on correctness.

Full machine-readable ledger: `docs/remediation-ledger-ch03.csv`.

## 5. Negative regression testing

Development-time fixtures were re-executed on the delivered tip and all fired
as documented (observed failures): vacancy 13.8→13.6 (2), OECD 2015 100→50.5
(4, both series' anchors), FIES food 89,754→94,895 (2), derived 20.9→5.9 (1),
stock 6504.7→6502.1速報 (2). After `37072e5`, three additional negative tests
re-injected the old wrong prose (RHP peak, above-2000 claim, 2013 peak) and
each failed exactly the new G9 guards before restoration to 949/0.

## 6. Security & public-release sanitization

- Git-tracked files: no API keys/tokens/passwords; no `.env`; no Prisma/
  SQLite/database files; no PII or private contact details; no dev caches or
  build artifacts; no unnecessary dependencies added (package.json unchanged
  vs `origin/main`).
- Machine-specific sandbox paths (`/home/z/jc-ch03`, `/home/z/...`) appear in
  6 files added by this branch (fetch scripts + verification docs) — same
  convention as the seven already-merged Ch01/Ch02 files on `origin/main`;
  they reference a disposable build sandbox, contain no secrets, and are
  classified LOW risk (documentation references, not leaked credentials).
  Optional future cleanup: parameterise the script output roots.
- Workflows: PASS (see §7). Static export scanned: no secrets, no `/home/z`,
  only expected routes; 14 chapters × 2 locales; Ch04+ placeholders intact.

## 7. GitHub Actions safety

`ci.yml`: `pull_request` (main) + non-main pushes; **validation only**
(typecheck, lint, research gate, export, export-verify; inspection-only
artifact upload); `permissions: contents: read`. `deploy.yml`: `push` to
`main` only; runs the same validation chain before the official Pages deploy;
`pages: write`, `id-token: write` least-privilege. No `continue-on-error`.
The Chapter 03 branch does not modify `.github/workflows/` — policy satisfied
unchanged.

## 8. Verification results (remediated tip `37072e5`, clean worktree)

- Research integrity gate: **949 checks / 0 failures** (baseline 940 + 9 G9).
- Extraction: 1655 anchor checks, exit 0; JSON + data.ts byte-identical.
- `tsc --noEmit`: 0 errors. `eslint .`: 0 errors / 0 warnings.
- Contrast audit: 58/0 (WCAG 2.2 AA).
- `DEPLOY_TARGET=github-pages` export: success; `verify:export` **74/0**.
- Ch01/Ch02 zero-diff vs `origin/main`: empty diff (byte-identical).
- Browser (agent-browser, Chromium): 13 canvases both locales; round-trips
  (chart→table→chart ×5) with exact cells — stock 13 rows (1963: 2,109.0/
  2,037.2/52.2), vacancy 13 rows (2023: 13.8), OECD 66 rows (2015: 100.0/
  100.0; 2025: 114.6/118.0), burden (4.0/20.9/4.2/26.4/12.5) JA+EN, tenure
  toggle; hover tooltip 1978 = 267.9/3,218.9/3,545.1; touch tooltip 1973 =
  172.0/2,873.1/3,105.9; CSV blob `text/csv;charset=utf-8` 1,773 B with
  title/unit/source/URL/license/period header; range filters radio-state on
  OECD+CPI charts, absent on ≤40-point charts; keyboard Tab→Arrow→Enter
  activates table; JA↔EN preserves route; `#vacancy` deep link lands in
  viewport; viewports 320/375/390/430/768/1024/1440 — no horizontal scroll
  (320 px: 254 px canvas); footer `mt-auto` sticky on short pages, pushed
  naturally on long pages; 404 renders; console clean apart from the
  pre-existing Next.js smooth-scroll advisory. Washi White `#F6F2EA` body +
  Celadon accents intact. Six audit screenshots archived with the audit
  package (desktop JA top/stock-hover/vacancy-table, EN top, mobile 390 top,
  320 px prefecture chart); the branch's own 16 acceptance screenshots remain
  at `research/ch03-screenshots/`.

## 9. Release recommendation and owner conditions

**GO**, conditional on the standard release sequence (no new conditions
invented; every gate above is green on `37072e5`):

1. Owner imports `37072e5` (git bundle provided) onto the existing feature
   branch and pushes — the **existing PR updates automatically** (do not open
   a new PR).
2. GitHub CI must re-run green on the new commit before merge approval
   (a previous green run does not cover `37072e5`).
3. Owner reviews the exact diff `f7e1fee...37072e5` (2 dev commits + 1 audit
   commit; shared-file changes limited to the three documented integration
   points + this audit's four-file remediation).
4. Post-merge checklist: confirm merge commit; confirm Pages deployment;
   open `/ja/chapters/housing-cost-of-living/` and the EN equivalent;
   spot-check 13.8% / 314,001円 / OECD 2015=100 anchor / RHP 1991=165.8 peak;
   one chart⇄table round-trip; mobile render + language switch; Ch01/Ch02
   accessible; record issues if any.
