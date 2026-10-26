# Chapter 03 Technical Verification — Housing & Cost of Living

Verification environment: worktree `/home/z/jc-ch03`, branch
`feature/chapter-03-housing-cost-of-living`, dev server on port 3000,
`agent-browser` (Chromium) for browser checks. Dates: 2026-10-26 – 2026-10-27.
Exact counts are recorded as run; nothing skipped unless stated.

## 1. Research-integrity gate

- `bun run validate:research` — **940 checks, 0 failures** (baseline 528;
  +412 for Chapter 03: §[4e] data agreement for every series + 8 guard
  families; Ch01/Ch02 checks unchanged and passing).
- Anchored extraction: `python3 research/chapter03/scripts/extract-series.py`
  — 1,656 anchor checks, exit 0.
- Negative tests: 5 injected corruptions, each failing the expected guards
  (2/2/3/1/2 failures), restored to 940/0 after each (§9 of the audit report).

## 2. Static analysis

- TypeScript: `tsc --noEmit` — 0 errors.
- ESLint: `bun run lint` (eslint .) — 0 errors, 0 warnings.
- Contrast audit: `bun run scripts/contrast-audit.ts` — 58 checks, 0 failures
  (WCAG 2.2 AA; informational decorative-token notes unchanged from baseline).

## 3. Static export

- `DEPLOY_TARGET=github-pages next build` — success; 14 chapters × 2 locales
  prerendered as SSG.
- `post-export.ts` — wrote `.build-export/index.html` redirect + 404 page.
- `bun run verify:export` — **74 checks, 0 failures** (18.6 MB). Updated for
  the newly published chapter 03 (chart-panel ids, verified figures
  13.8 / 314,001, source organisations, limitations, 2015=100 disclosure in
  EN) and the chapter-04 placeholder check.

## 4. Existing-chapter protection (zero-diff)

`git diff f7e1fee --stat -- src/chapters/chapter-01 src/chapters/chapter-02
research/chapter01 research/chapter02 scripts/generate-chapter-data.ts
scripts/generate-chapter-02-data.ts` — **empty** (byte-identical). Modified
files limited to the three shared integration points:
`src/chapters/registry.ts` (+2 lines), `src/config/chapters.ts` (status flip),
`scripts/validate-research.ts` (append-only §[4e]), plus `scripts/verify-export.ts`
(chapter-03 publication checks, replacing the obsolete placeholder assertion).

Browser spot-checks on the running site: Ch01 renders 11 figures with the
audit-corrected household value (3.22) and verified births figure; Ch02
renders 10 figures with the remediated USD/hour labelling.

## 5. Browser verification (agent-browser, desktop 1440×900 + mobile)

| Check | Result |
|---|---|
| Chapter page JA/EN render | 200; 13 figures each; h1/h2 correct |
| Chart → Table → Chart round-trips | **5 total**: ch03-stock (table 14 rows; 1963: 2,109.0/2,037.2/52.2), ch03-vacancy-rate (2023: 13.8), ch03-oecd-pti-japan (67 rows; 2015: 100.0/100.0; 2025: 114.6/118.0), EN ch03-rent-burden (4.0/20.9/4.2/26.4/12.5), mobile ch03-stock (14 rows). Canvas restored after every switch (0 tables / 1 canvas). |
| Tooltips | Desktop hover (1993: 空き家 447.6 / 居住 4,077.3 / 総数 4,587.9) and mobile touch-tap (1988: 394.0 / 3,741.3 / 4,200.7) — values match the verified series |
| CSV export | Blob 1,773 bytes, `text/csv;charset=utf-8`, attribution header (title, unit, source, URL, license, reference period) |
| Range filter | ch03-cpi-long: 全期間 / 1990年以降 / 2010年以降 — canvas re-renders; filter buttons only on >40-point series (correct) |
| Keyboard accessibility | Tab focus → ArrowRight moves to 表 tab (aria-selected=true) → Enter renders the table |
| Language switch | JA ↔ EN preserves the chapter route; deep links `#vacancy` (JA) and `#actions` (EN) land on the section |
| Viewports | 320 / 375 / 390 / 430 / 768 / 1024 / 1440 — nav + charts fit (320px: canvas 254×460) |
| Console | No errors; one pre-existing Next.js smooth-scroll advisory (framework-level, not chapter-specific) |
| Overview / sources / home | Chapter 03 listed with scope text; sources page lists StatB/e-Stat/MLIT registers |

Screenshots (16): `research/ch03-screenshots/` — desktop JA top/stock-table/
stock-hover/vacancy-table/oecd-table/cpi-range2010/fullpage, desktop EN
top/burden-table/fullpage, overview, sources, mobile JA stock/stock-table/
stock-tooltip, 320px prefecture chart.

## 6. Accessibility

- Semantic structure: `main`/`nav`/`section` with `region` roles and
  `aria-labelledby` headings; 10 sections + TOC navigation.
- Tabs: proper `tablist`/`tab`/`tabpanel` roles; roving focus verified by
  keyboard test.
- Charts: `role="img"` + bilingual `aria-label` descriptions; colour is never
  the sole carrier (tables + line styles + markers).
- Touch: `touch-action: pan-y` keeps vertical scroll while taps open tooltips
  (verified).
- 44px+ touch targets on tabs/buttons/filter chips (component library default).

## 7. Reproducibility

```
bun run scripts/generate-chapter-03-data.ts   # extract → data.ts (hash-pinned)
python3 research/chapter03/scripts/extract-series.py   # 1,656 anchor checks
bun run validate:research                    # 940 checks
bun run lint && tsc --noEmit                 # clean
DEPLOY_TARGET=github-pages next build && bun run scripts/post-export.ts
bun run verify:export                        # 74 checks
```

Source snapshot hash (extracted-series.json, sha256 first 16):
`66c6f5355fe7fcab` — pinned in the generated module and asserted by the gate.

## 8. Limitations of this verification

- The independent reviewer re-fetched sources on 2026-10-27; later official
  revisions (e.g. a future FIES retabulation or OECD annual update) would
  require re-verification — the gate's hash pins will surface any drift.
- OECD data-reuse terms could not be re-quoted live (HTTP 403 Cloudflare);
  documented in the source register.
- 2026-03 地価公示 publication date recorded at month precision only.
- Performance was not benchmarked beyond export size (18.6 MB total) and
  dev-server compile times; no Lighthouse run (static export verified
  structurally instead).
