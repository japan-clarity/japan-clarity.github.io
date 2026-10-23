# Japan Clarity — Post-Launch Independent QA & Evidence Audit

**Date:** 2026-10-23
**Scope:** evidence-based verification of the *deployed* production site
(https://japan-clarity.github.io/) and the corresponding repository, plus
minimal remediation of three confirmed minor defects.
**Release verified:** `v1.0.0-rc1` — deployed commit `be76c6a`
(remote HEAD at test start; confirmed via `git fetch`, not assumed).
**Method:** live-site browser automation (agent-browser / Chromium),
HTTP inspection, source review, and full local gate re-runs.
**Boundary honored:** no Chapter 02 work, no content rewrites, no push
or remote modification (all fixes are local, reviewable commits).

---

## 1. Baseline (Phase 1)

| Item | Result | Evidence |
|---|---|---|
| Remote HEAD | `be76c6a20d043de56506814eede7ab5d1284ead3` | `git fetch origin`; local HEAD identical; zero divergence both directions |
| Working tree | clean | `git status` (after setting local `core.filemode=false` — the checkout's 100644→100755 mode bits were filesystem artifacts with **zero content changes**, diff-stat 0 on every file) |
| Deploy workflow | **1 run, success** | Actions run `39837722570` on `be76c6a` ("docs: sanitize environment-specific values…"), conclusion *completed successfully*, dated 2026-10-22T19:10:08Z (github.com/…/actions/runs/39837722570) |
| CI workflow | 0 runs — **expected** | `ci.yml` triggers only on PRs and non-main pushes; all published work landed on `main` via the deploy-gated path |
| Live publication | live | Root serves a `lang="ja"` redirect page → `/ja/` (HTTP 200, 84 KB); `/en/` 200; `/ja/chapters/population-family/` 200 (301 KB) |

**Limitation:** the GitHub REST API was rate-limited from this environment's
shared IP; workflow evidence was instead read from the public HTML run pages
(HTTPS GET, unauthenticated). Commit-level conclusions above were
cross-checked with `git fetch`.

## 2. Production browser acceptance (Phase 2) — all on the LIVE site

Viewports tested: **1440×900**, **768×1024**, **390×844**, **375×812**,
**320×700**. Screenshots: `research/qa-screenshots/live-*.png`.

| Check | Result | Evidence |
|---|---|---|
| Root lands on Japanese experience | **PASS** | `/` meta-refresh → `/ja/`; `html lang="ja-JP"`; JA title/description; noscript fallback present |
| Language switch order | **PASS** | 日本語 left with `aria-current="true"` (default), English right — desktop and mobile |
| JA→EN→JA round trip (home) | **PASS** | `/ja/` ↔ `/en/`; `lang` and title switch correctly |
| Round trip preserves deep-link context | **PASS** | `/ja/chapters/population-family/` ↔ `/en/chapters/population-family/`; titles `01 人口・家族…` ↔ `01 Population & Family…` |
| Hard refresh keeps locale | **PASS** | static `/ja/…` `/en/…` routes; full navigations re-landed correctly throughout the session |
| Homepage / overview / methodology / sources | **PASS** | All 200 with correct JA titles, sections, footer |
| 14-chapter dropdown | **PASS** | 14 items: 01 公開（限界事項あり）, 02–14 計画中 |
| Planned-chapter placeholder | **PASS** | Ch.02 states 「この章はまだ公開されていません…虚構の数値や引用で見た目を整えることはしません」 — unmistakably unpublished |
| 404 (locale path) | **PASS** | `/ja/…` unknown → bilingual 404 with JA-first copy |
| 404 (non-locale path) | **PASS** | Serves root `404.html` (HTTP 404) |
| Chapter 01 charts render | **PASS** | 11 canvases at 1440, 768, 390, 375, 320 |
| Chart ⇄ table ⇄ chart ×3 (desktop) | **PASS** | Table 23 rows (census) → canvas restored with pixel content each round (dataURL 42,126 → ~41.5 KB; a blank canvas would be ~2 KB) |
| Chart ⇄ table ⇄ chart ×3 (mobile 390) | **PASS** | Table 22 rows → 11 canvases restored each round |
| Table data integrity | **PASS** | 1920: 55,963,053; **2020: 126,146,099** (census total, not the 126,226,568 estimate); 2025: 122,972,528 |
| Hover tooltip (desktop) | **PASS** | `2005 | 出生数 1,062,530 | 死亡数 1,083,796` — matches MHLW final vital statistics |
| Touch tooltip (mobile) | **PASS** | Tap on population chart: `1995 | 総人口（国勢調査） | 125,570,246` — correct census value; `touch-action: pan-y` on the chart holder |
| Range filters | **PASS** | 全期間 / 1990年以降 / 2010年以降 flip `aria-pressed` and re-render the canvas |
| Series legend toggle | **PASS** | Legend click hides/restores 出生数 (canvas 49,210 → 41,466 → 48,888 bytes) |
| Keyboard tabs | **PASS** | Focus 表 tab (roving tabindex) → Enter activates table (124 rows = 1899–2025 minus 3 war-gap years); ArrowLeft returns to chart |
| CSV download | **PASS** | Blob `text/csv;charset=utf-8`, 3,163 B, filename `ch01-births-deaths.csv`; header block carries title, unit, source, official URL, license, access date, generator; 2024/2025 rows match verified values |
| Back-to-top | **PASS** | `aria-label="上へ戻る"` fixed button appears on scroll; click returns scrollY 3,000 → 0 |
| Sticky footer (short page) | **PASS** | Planned-chapter page at 1440×1500: footer bottom == 1,500 == viewport (pinned, no gap) |
| Footer on long page | **PASS** | Chapter page 22,446 px: footer pushed to document end, no overlap |
| Horizontal overflow | **PASS** | None at 1440 / 768 / 390 / 375 / 320 (home + chapter) |
| Mobile Sheet menu | **PASS** | Opens with 14 chapter links + primary nav; closes correctly |
| Console errors (production) | **PASS** | Zero page errors / console errors on all visited live pages |

**Test-tooling note (not a site defect):** text/element locators occasionally
matched the DOM-hidden (`lg:hidden`, `display:none`, not focusable) mobile
duplicate of the language switch; direct interaction with the visible desktop
control always worked. Synthetic DOM-level click events are not recognized by
ECharts' click synthesis; real browser input (CDP mouse events) works
correctly for legend clicks and tooltips on the live site.

## 3. Research & bilingual evidence (Phase 3)

| Check | Result | Evidence |
|---|---|---|
| 1947 TFR = 4.54 in both languages | **PASS** | EN "TFR fell from 4.54 in 1947…" / JA「1947年の4.54から…」 (live pages) |
| Natural decrease 2024 vs 2025 | **PASS** | Both languages: 2025 births 671,270 / deaths 1,589,533, "19th consecutive year" (19年連続); chart text identical in JA/EN |
| Census vs estimate distinction | **PASS** | Table shows census 126,146,099 for 2020; the 126,226,568 estimate distinction remains disclosed |
| War-gap / Okinawa disclosure | **PASS** | Footnote text on live chapter: 1944–46 omission and Okinawa 1947–1972 exclusion; 124-row table = 127 − 3 war-gap years |
| Vital-stats basis disclosure | **PASS** | 「出生・死亡は『発生基準』…」 visible on live page |
| Placeholder honesty | **PASS** | Ch. 02–14 unmistakably planned; no implication of 14 completed studies |
| Research integrity gate | **PASS** | Re-run 2026-10-23: **259 checks, 0 failures** (includes chart/data agreement, dictionary parity, provenance validity) |

Per the QA brief, the exhaustive figure-by-figure audit was NOT repeated —
it was completed 2026-10-22 (`docs/VERIFICATION.md` §3–5, independent audit
R-2) and the integrity gate re-verified the data pipeline end-to-end today.
Highest-impact numbers (census totals, 2025 vital statistics, TFR values)
were re-sampled against the live rendered output above.

## 4. SEO, accessibility, security (Phase 4)

| Check | Result | Evidence |
|---|---|---|
| robots.txt | **PASS** | `Allow: /` + sitemap on production origin |
| sitemap.xml | **PASS** | Production origin only; `xhtml:link` hreflang `ja-JP`/`en` alternates |
| Canonical + hreflang on pages | **PASS** | e.g. `/en/chapters/population-family/` canonical + ja-JP/en alternates, all on `https://japan-clarity.github.io` |
| OG metadata | **PASS** (after fix) | Page-specific `og:title`/`og:description`; `twitter:card=summary` |
| No custom domain | **PASS** | No CNAME anywhere; all origins are the GitHub Pages URL |
| Headings / landmarks | **PASS** | skip link (visible on focus), header/nav/main/section/footer, `role=tab/tabpanel`, `role=img` + descriptions on chart holders, table captions |
| Keyboard focus | **PASS** | 2px solid outline on focus; tabs operable via keyboard (Enter + arrows) |
| Contrast | **PASS** | body 11.94:1, h1 15.82:1, links 11.94:1 / 6.59:1, CTA dark-on-teal 6.59:1 (WCAG AA ≥ 4.5:1) |
| Touch targets | **PASS** (after fix) | 32/32 interactive elements ≥ 24px (3 footer links were 16px → fixed to 32px) |
| Reduced motion | **PASS** (static) | `@media (prefers-reduced-motion: reduce)` neutralizes animations; ECharts animation disabled in code when active. Live emulation could not be applied by the tool — code + CSS verified |
| Japanese typography | **PASS** | Font stack includes Hiragino Kaku Gothic + Noto Sans JP fallback chain |
| Repo secrets | **PASS** | `git log --all -- .env` → 0; full-history grep for secret patterns → only benign doc mentions ("no secrets are required", "color tokens", `js-tokens` package); `.env` exists only as untracked ignored local file |
| Workflow least-privilege | **PASS** | deploy.yml: `contents: read, pages: write, id-token: write` (the minimum for official Pages actions); ci.yml: `contents: read`; frozen lockfile; no secrets |
| Build reproducibility | **PASS** | All gates re-ran green today from the lockfile (below) |
| Branch protection | **NOT TESTED** (recommendation) | Direct pushes to `main` currently deploy automatically. Recommendation (owner decision, not imposed): require PR review + `ci.yml` before merge |

## 5. Local verification suite re-run (2026-10-23, post-fix)

| Check | Command | Result |
|---|---|---|
| TypeScript | `bunx tsc --noEmit` | **0 errors** |
| ESLint | `bun run lint` | **0 errors, 0 warnings** |
| Research integrity | `bun run validate:research` | **259 checks, 0 failures** |
| Static export | `bun run export:static` | **42 HTML files**, compiled successfully |
| Export verification | `bun run verify:export` | **57 checks, 0 failures** (8.4 MB) |
| Dev-preview smoke | `bun run dev` + browser | Chapter 01 renders 11 canvases, no overflow, correct titles |
| Dual-mode coexistence | dev server + export | Export built while dev server live; dev answered 200 throughout |

## 6. Defects found and fixed (see docs/POST-LAUNCH-REMEDIATION.md)

All three are minor, confirmed on the live production site, and fixed with
scoped local commits awaiting owner review:

| ID | Severity | Defect | Fix commit |
|---|---|---|---|
| QA-F1 | Low (a11y/i18n) | Mobile sheet close button exposed English "Close" on Japanese pages | `b8a68bb` |
| QA-F2 | Low (SEO) | Site-level `twitter:title/description` overrode page-specific OG values in X cards | `9aa6578` |
| QA-F3 | Low (WCAG 2.5.8) | Footer nav link targets 16px tall (< 24px minimum) | `1334791` |

## 7. Known limitations of this QA session

- GitHub REST API rate-limited (shared IP) — Actions evidence taken from
  public HTML run pages instead.
- `prefers-reduced-motion` live emulation was not applied by the browser
  tool; handling verified in CSS/source.
- Clipboard copy-link success remains inferred (headless read-back blocked,
  unchanged from previous sessions).
- The Radix "Missing Description for DialogContent" console advisory appears
  in dev mode only (Sheet has a title; production builds strip it) — benign,
  not fixed (scope discipline).

## 8. Conclusion

The deployed release is **healthy**: production routing, bilingual behavior,
all 11 interactive figures, chart⇄table restoration, tooltips, filters,
legend toggles, keyboard access, CSV attribution, mobile layouts, footer
behavior, SEO plumbing, and repo hygiene all passed on the live site.
Three low-severity defects were confirmed and minimally remediated locally.
With those reviewed and deployed, the release is a sound basis for freezing
v1.0.0 before opening Chapter 02 research.
