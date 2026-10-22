# Reference Inspection — Taiwan Forward · Global Food Crisis · Remember to Prevent (+ Japan Clarity target)

Task ID: 1 · Agent: general-purpose (reference inspection) · Access date for all fetches: **2026-10-22**

Anti-fabrication rule applied throughout: every observation below was actually fetched and is stored under
`research/reference-inspection/raw/`. Anything not observable is explicitly labelled. No JavaScript was executed;
JS bundles were only downloaded and grepped as static text (bundle fingerprinting).

---

## 1. Access log

### Live sites (curl -s -L, browser UA "Mozilla/5.0 … Chrome/126.0 Safari/537.36", --max-time 20)

| Site | URL fetched | HTTP | Bytes received | Saved as |
|---|---|---|---|---|
| Taiwan Forward | https://taiwan-forward.github.io/ | 200 | 46,607 | `raw/taiwan-forward.html` |
| Global Food Crisis | https://global-food-crisis.com/ | 200 | 67,496 | `raw/global-food-crisis.html` |
| Remember to Prevent | https://remember-to-prevent.com/ | 200 | 577,777 (full copy kept as `raw/remember-to-prevent-full-577KB.html.bak`; instruction-compliant first-150KB kept as `raw/remember-to-prevent.html`) | `raw/remember-to-prevent.html` |
| Japan Clarity Pages | https://japan-clarity.github.io/ | 200 | 2,770 | `raw/japan-clarity-pages.html` |

Note: the task URL for Taiwan Forward included the fragment `#/zh-TW/`; fragments are never sent to the server,
so the fetch retrieved the root document (which is served with `lang="zh-TW"` — see below).

### Linked CSS fetched (static design-token extraction)

| File | HTTP | Bytes | Saved as |
|---|---|---|---|
| taiwan-forward.github.io/_next/static/chunks/7af0e173cf372ed8.css | 200 | 3,656 | `raw/taiwan-forward-css-1.css` (Geist + Geist Mono @font-face) |
| taiwan-forward.github.io/_next/static/chunks/768e2c45d975f1bd.css | 200 | 307,357 | `raw/taiwan-forward-css-2.css` (Noto Sans TC + Tailwind utilities) |
| taiwan-forward.github.io/_next/static/chunks/078e6af376a23ab3.css | 200 | 107,324 | `raw/taiwan-forward-css-3.css` (**contains the TF custom palette `:root` vars + `.tf-*` classes**) |
| global-food-crisis.com/_next/static/chunks/d46683202974f052.css | 200 | 98,705 | `raw/global-food-crisis.css` (**contains the GFC `:root` token block**) |
| remember-to-prevent.com/_next/static/chunks/{5d6ea490bb740d17, 7247d4b3fbbf610e, 8c4827738c6c462d, d7c4bbe1d56ab72d}.css | 200 ×4 | 205,029 / 124,388 / 6,495 / 205,262 | `raw/rtp-css-*.css` (the `7247…` file holds the Tailwind-v4 `@theme` token block) |

### JS bundle fingerprints (downloaded, grepped, then deleted; findings recorded here)

| Site | Chunk inspected | Chart-library evidence found (static grep, no execution) |
|---|---|---|
| Taiwan Forward | `/_next/static/chunks/97b23827918be3c3.js` (955,607 B) | ECharts runtime present: strings `"[ECharts] "` (logger), `"_echarts_instance_"`, `"echarts"===n[0]` (built-in map registration) |
| Global Food Crisis | `/_next/static/chunks/61fa11cf02b5ecc9.js` (748,563 B) | ECharts runtime present: `"_echarts_instance_"`, `"echarts"===n[0]`, `echartsStyle` (GeoJSON choropleth styling) |
| Remember to Prevent | `/_next/static/chunks/b0e9d8d1067298f2.js` (438,458 B) | `a.use([r.BarChart,r.CustomChart,r.MapChart,d.GridComponent,d.TooltipComponent…])` — the `echarts/core` tree-shaken registration API. No literal "echarts" string in any RTP chunk (all 12 chunks scanned). |

### GitHub API (no auth) — partially rate-limited

`GET https://api.github.com/repos/<owner>/<repo>`, `/languages`, `/contents/`, `/contents/.github/workflows`
were attempted for all four repos on 2026-10-22. The unauthenticated API quota for this network was exhausted
during the session: most calls returned **403 "API rate limit exceeded"** (error bodies saved as
`raw/gh-repo-*.json`, `raw/gh-languages-*.json`, `raw/gh-workflows-*.json`).

Calls that **did** succeed (saved):

| Call | HTTP | Result |
|---|---|---|
| `/repos/global-food-crisis/global-food-crisis.github.io/contents/` | 200 | 26 root entries — `raw/gh-contents-global-food-crisis.github.io.json` |
| `/repos/japan-clarity/japan-clarity.github.io/contents/` | 200 | **1 root entry: README.md only** — `raw/gh-contents-japan-clarity.github.io.json` (definitive: no `.github/` dir, therefore **no workflows** in the target repo) |

Fallbacks used instead of the rate-limited API (all 200, all saved):

- READMEs via `https://raw.githubusercontent.com/<owner>/<repo>/main/README.md` →
  `raw/gh-readme-{taiwan-forward,global-food-crisis,remember-to-prevent,japan-clarity}.github.io.md`
- Full repo content via shallow git clones (`git clone --depth 1`) → `raw/repos/<name>/` (default branch `main`
  confirmed via `origin/HEAD -> origin/main` in every clone; `.git` kept for provenance)
- Repo descriptions + default branch via github.com HTML pages → `raw/gh-page-*.html`

**Not obtained (honest gaps):** stars/forks/watchers/topics/size via the REST API for any repo (rate-limited);
`/languages` endpoint for all repos (rate-limited). Language composition below comes from the clones'
`git ls-files` inventory, not the API.

---

## 2. Per-reference verified observations

### A. Taiwan Forward — https://taiwan-forward.github.io/ (live) + repo `taiwan-forward/taiwan-forward.github.io`

**Verified from static HTML (`raw/taiwan-forward.html`, fully server-rendered — NOT an empty SPA):**

- Title: `Taiwan Forward 台灣向前 — Understand Today. Improve Tomorrow.`; `<html lang="zh-TW">`;
  `theme-color #0F141A`; bilingual meta description (EN + 繁中); keywords list; authors meta.
- Framework: Next.js App Router (turbopack chunk names, `data-precedence="next"` CSS, RSC payload),
  Tailwind CSS v4 (arbitrary values like `text-[0.92rem]`, `size-9`), shadcn/ui (`data-slot="sheet-trigger"`
  mobile Sheet), Radix (`aria-controls="radix-_R_b9brb_"`), lucide-react icons (`lucide-languages`,
  `lucide-menu`, `lucide-arrow-right`, `lucide-scale`, `lucide-earth`, `lucide-file-text`, `lucide-link-2`).
- **Routing/language mechanism visible in HTML:** all navigation items (研究總覽 / 第一章 · 人口 / 研究方法 /
  資料與來源 / 研究進度 / 從證據到行動 / 關於本計畫) are `<button>`s, not `<a>`s — consistent with in-page
  hash routing. `<link rel="alternate" hrefLang="en|zh-TW" href="…/">` both point at the same root URL
  (language lives client-side). Language switcher: segmented 繁中/EN `<button>` pair with `aria-pressed`.
- **Design tokens (from `raw/taiwan-forward-css-3.css` + inline styles):** dark palette —
  `--background:#0f141a`, `--surface:#151c24`, `--surface-2:#1b2530`, `--border:#2a3642`,
  `--heading:#e8eef3`, `--body-text:#c7d1da`, `--dim-text:#93a1ae`, `--teal:#6fa3a8` (primary accent),
  `--sand:#c8b38e` (secondary accent), `--bluegrey:#7f93a6`. Header `bg-[#0f141af2] backdrop-blur-md`,
  radial-gradient hero washes (teal/sand at low alpha), `tf-hairline` gradient divider.
- Typography: Geist + Geist Mono + Noto Sans TC via next/font (body CSS-module classes); mono `tf-kicker`
  eyebrow style (`letter-spacing:.22em`, uppercase, teal); body prose `line-height:1.85`.
- Content structure (homepage): 14 research dimensions as a card grid with status dots (teal = published,
  bluegrey = not yet) and honest progress label 「已出版 1 / 14 個層面（如實標示進度）」; six-step method
  (觀察/核驗/比較/探究/評估/行動); four action levels (個人/社區/專業/制度); footer links to sister sites
  Global Food Crisis + Remember to Prevent; CC BY 4.0 notice; 「最後更新：2026-10-22」; floating
  copy-link + back-to-top buttons; skip-to-content link; 44px touch targets.
- Logo: inline 3-bar mini bar-chart SVG using #7F93A6 / #C8B38E / #6FA3A8.

**Verified from the repo clone (`raw/repos/taiwan-forward.github.io`, default branch `main`,
last commit `cef1b1b 2026-10-22 "Fix CI typecheck by removing unused Prisma module"`, 109 tracked files, no LICENSE file):**

- `package.json`: name `nextjs_tailwind_shadcn_ts` v0.2.1; **next ^16.1.1, react ^19, tailwindcss ^4,
  TypeScript 5, echarts ^6.1.0** (+ recharts ^2.15.4, next-intl ^4.3.4, framer-motion, full Radix/shadcn set,
  bun.lock). Scripts: `build:static` = `DEPLOY_TARGET=github-pages next build`; `typecheck`; `lint`.
- Architecture (README + source): **single `/` route, custom hash router** — `src/lib/router.tsx` parses
  `#/zh-TW/`, `#/en/overview`, `#/zh-TW/chapter-01` …; views switched in `src/app/page.tsx`
  (home / overview / chapter-01 / methodology / sources / status / action / about); language state via
  `useSyncExternalStore` (`app-store.ts` + `lang-context.tsx`), `LText = {en, zh}` objects in
  `src/lib/i18n.ts` with `t()`, locale-aware `Intl.NumberFormat` helpers.
- Content/data separation: `src/content/*.ts` (bilingual chapter/methodology/action/about/status/ui),
  `src/data/types.ts` (SourceRef / Dimension / ChartSeries contracts), `src/data/sources.ts`
  (source registry with `ACCESS_DATE = "2026-10-22"`, full provenance incl. honest `verification` notes),
  `src/data/dimensions.ts` (14 dims), `src/data/charts/population.ts`.
- Charts: `src/components/charts/echarts-core.tsx`, `interactive-chart.tsx`, `data-table.tsx`
  (README: ECharts wrapper + data-table alternative + chart/table toggle + CSV export + expand dialog).
- `next.config.ts`: dual-mode — `DEPLOY_TARGET=github-pages` → `output:"export"`, `basePath:""`,
  `trailingSlash:true`, `images.unoptimized`; default → `output:"standalone"`.
- `.github/workflows/deploy.yml`: push to `main` + `workflow_dispatch`; `oven-sh/setup-bun@v2`;
  `bun install --frozen-lockfile`; typecheck; lint; `DEPLOY_TARGET=github-pages` build; verification step
  (`test -f out/index.html`, `test -d out/_next`); `actions/configure-pages@v5` →
  `actions/upload-pages-artifact@v3` (path: `out`) → `actions/deploy-pages@v4`; least-privilege
  `permissions` (contents:read, pages:write, id-token:write); `concurrency: group "pages"`.
- **No CNAME file** in the repo; README explicitly: custom domain `taiwan-forward.com` is **not** configured
  and "must not be added until it is actually purchased and connected".
- public/: favicon.svg, logo.svg, og.png, robots.txt, sitemap.xml (static).
- GitHub description (from HTML page): "An independent, non-commercial, evidence-based project exploring
  Taiwan's challenges, strengths, and opportunities through data, international comparisons, and practical actions."

**Not observable / honest limits:** chapter-01 content is not fetchable via curl (hash-routed client views —
only the homepage is server-rendered); ECharts is not referenced by any `<script>` name in the HTML (bundle
names are content-hashed) — its presence was established by grepping the downloaded JS chunk; stars/topics/
API metadata not obtainable (rate limit).

---

### B. Global Food Crisis — https://global-food-crisis.com/ (live) + repo `global-food-crisis/global-food-crisis.github.io`

**Verified from static HTML (`raw/global-food-crisis.html`, fully pre-rendered long-form page):**

- Title: `Global Food Crisis — Chapter 01: The World Has Food. Why Does Hunger Persist?`;
  `<html lang="en" class="no-js">` (no-js removed by early script per layout.tsx); meta description
  cites data sources FAO, WFP, IPC, UNEP.
- Framework: Next.js App Router (turbopack). Body font CSS-module classes: **Fraunces + Newsreader + Inter**
  (display serif / editorial serif body / UI sans). Language switch: `EN | 繁中` buttons in a
  `role="group" aria-label="Language"` `.lang-switch` (client `LanguageProvider`, RSC payload shows
  `LanguageProvider` component import).
- **Navigation/routing:** in-page anchors `#ch1…#ch6` — The Question / The Scale / The Geography /
  The Causes / The Trend / The Action — with `.chapter-nav` and `.nav-arrow` scroll buttons; single-page
  scrollytelling ("Scroll to explore ↓").
- **Design tokens (from `raw/global-food-crisis.css` `:root`):** dark botanical palette — `--ink:#101a18`,
  `--ink-2:#192721`, `--ink-3:#21302a`, `--cream:#f2f1e8`, `--cream-dim:#b4c9be`, `--gold:#c7a36c`,
  `--gold-bright:#e0c48f`, `--line:#f2f1e81f`, `--line-strong:#c7a36c61`, choropleth scale
  `--map-1…6: #3f5449 #5c7b60 #8fa074 #c7a36c #ce8b54 #c05b3b`, `--map-none:#26352f`;
  `--font-display: Fraunces…`, `--font-body: Newsreader… (serif)`, `--font-ui: Inter…` with
  Songti TC / Noto Serif TC CJK fallbacks.
- **Chart system markup:** semantic classes `chart-frame > chart-frame__head > chart-title +
  chart-subtitle/chart-hint`, `chart-controls`, `chart-explainer`, `chart-status`, `data-table`;
  chart bodies render as `"Loading map…"` / `"Loading data…"` placeholders in static HTML (client-rendered);
  map legend bins (<2.5% / 2.5–5% / 5–10% / 10–20% / 20–35% / 35%+ / No recent assessment); explicit
  data-table alternative ("All countries with data — the accessible alternative to the map").
- **Content epistemics visible in HTML:** every statistic carries a Source line with **statistical reference
  year** (e.g. "SOFI 2026 — reference year: 2025"); expandable "Show methodology and limitations"
  (Definition / How it is measured / Limitations / Source); a dedicated "Why these numbers must never be
  added together" section; caveat markers ※; external links ↗; "Download the data (CSV)" with sources;
  vintage discipline ("different vintages are labeled, never mixed").
- Footer (verified text): independence disclaimer; primary-source list; "License — Code: MIT. Data:
  attributed per dataset (CC BY 4.0 / public domain)"; "Data retrieved: 2026-10-15"; "Built as a static
  site — no tracking, no analytics, no cookies."; cross-link to remember-to-prevent.com; back-to-top.

**Verified from the repo clone (`raw/repos/global-food-crisis.github.io`, default branch `main`,
last commit `99bdf68 2026-10-18 "Fix GitHub Pages deployment and website issues"`, 141 tracked files,
MIT LICENSE "Copyright (c) 2026 Global Food Crisis — Chapter 01 contributors"):**

- Root contains: `.env` (committed), `.github/`, `.gitignore`, `.zscripts/` (sandbox runtime scripts),
  `Caddyfile` (sandbox reverse proxy on :81 — environment leftover, not part of the static site), `LICENSE`,
  `README.md`, `bun.lock`, `components.json` (shadcn), `data/{manual,raw}`, `db/`, `docs/`, `download/`,
  `eslint.config.mjs`, `examples/`, `next.config.ts`, `package.json`, `postcss.config.mjs`, `prisma/`,
  `public/`, `scripts/`, `src/`, `tailwind.config.ts`, `tests/`, `tsconfig.json`, `worklog.md`.
- `package.json`: name `global-food-crisis` v1.0.0; next ^16.1.1 / react 19 / tailwind 4 / **echarts ^6.1.0 /
  d3-geo ^3.1.1** (+ recharts, next-intl present); scripts include `validate:i18n` (`bun tests/i18n-parity.mjs`),
  `test:logic`, `validate:data` (`python3 scripts/validate_data.py`), composite `validate`, `build:export`.
- i18n: `src/i18n/en.ts` (495 lines) + `src/i18n/zh-TW.ts` (478 lines) typed dictionaries ("The shape of this
  object defines the Dictionary type; zh-TW must match it") + `src/i18n/index.tsx` LanguageProvider:
  localStorage key `gfc.language`, deferred restore after hydration, MutationObserver guard that re-asserts
  the localized `<title>` against Next.js metadata clobbering, `countryName()` helper, keeps
  `document.documentElement.lang` in sync.
- Charts: `src/components/charts/` = `BaseChart.tsx` (echarts/core tree-shaken `echarts.use([BarChart,
  LineChart, MapChart, ScatterChart, Grid/Legend/MarkLine/MarkPoint/Title/Tooltip/VisualMap(piecewise)/
  DataZoom(inside,slider), CanvasRenderer])`; ResizeObserver lifecycle; THEME object kept in sync with
  globals.css; `baseTooltip()` with `confine` for mobile), `WorldMap.tsx`, `TrendChart.tsx`, `AcuteChart.tsx`,
  `DriversChart.tsx`, `PriceIndexChart.tsx`. Sections: `src/components/sections/` = Hero, Scale, Geography,
  Causes, Trend, Action.
- Data pipeline (Python, stdlib only): `scripts/download_data.py` → `data/raw/` + `data/manual/`
  (ne_50m_admin_0_countries.geojson, FAO/OWID CSVs, WB JSON) → `process_data.py` → `public/data/*.json`
  (pou-country, trend, acute-food-insecurity, food-price-index, world-map) + `trend.csv` →
  `validate_data.py` (README: 19,705 checks) → `export_csv.py`.
- `src/app/sitemap.ts`: `export const dynamic = "force-static"` — single-entry sitemap for the one-page site;
  `robots.txt` points at it.
- `src/app/layout.tsx`: next/font self-hosted Fraunces/Newsreader/Inter; full Metadata (metadataBase,
  canonical, OG, robots); **early inline script before first paint** restoring stored language to
  `<html lang>` (avoids English flash) and removing `no-js`.
- `.github/workflows/deploy.yml`: 3 jobs — `validate` (lint + `validate:i18n` + `test:logic` +
  python `validate_data.py`) → `build` (computes base path: repo `*.github.io` → `""` else `/REPO_NAME`;
  `NEXT_OUTPUT=export` + `NEXT_PUBLIC_BASE_PATH`) → `deploy` (`actions/deploy-pages@v4`).
  **Observed defect (verbatim):** the trigger reads `on: push: branches: ain]` — an apparent corruption of
  `[main]` (TF's workflow has the correct `branches: ["main"]`). Do not replicate.
- `docs/`: sources.md, methodology.md, data-dictionary.md, limitations.md. `tests/`: i18n-parity.mjs
  (README: 191 structural paths must match), trend-logic.test.mjs.
- **No CNAME file**; the custom domain global-food-crisis.com resolves live (200) — configured outside the
  repo (DNS + Pages settings).
- GitHub description (HTML page): "An interactive, data-driven exploration of the global food crisis, its
  causes, and what individuals can do, grounded in credible sources."

**Not observable / honest limits:** actual chart rendering (ECharts canvases) not visible in static HTML —
only placeholders + the echarts fingerprint in the downloaded bundle; the live zh-TW rendering cannot be
curl-fetched (language is client-side, not URL-based); API stars/topics not obtained.

---

### C. Remember to Prevent — https://remember-to-prevent.com/ (live) + repo `remember-to-prevent/remember-to-prevent.github.io`

**Verified from static HTML (first 150 KB saved as `raw/remember-to-prevent.html`; full 577,777-byte copy
kept as `raw/remember-to-prevent-full-577KB.html.bak` — page is fully pre-rendered, ~102 KB of body text):**

- Title: `Remember to Prevent — Chapter 01: Two World Wars. Lessons for Humanity. Actions for Tomorrow.`;
  `<html lang="en">`; meta: "An independent, bilingual historical education project … Remember → Reflect → Act."
- Framework: Next.js App Router (turbopack, 12 chunks, 4 CSS files). Tailwind v4 with custom theme colors
  used directly as utilities (`text-bronze-light`, `bg-ink-raised`, `border-bronze/40`, `font-serif`).
- **Navigation/routing:** in-page anchors `#ch1…#ch6` — 01 The Question / 02 First War / 03 Second War /
  04 Human Cost / 05 Reflect / 06 Act; sticky header with scrollable chapter nav (left/right scroll
  buttons); hero states "6 chapters · 1914–1945" (six numbered sections within this single page).
- **Language switcher:** pill `EN` / `繁中` buttons (`rounded-full`, `aria-pressed`, `lang` attributes,
  `title` + `sr-only` labels "English" / "Traditional Chinese").
- **Design tokens (from `raw/rtp-css-7247d4b3fbbf610e.css` `:root` — Tailwind v4 `--color-*`):**
  archival palette — `--color-paper:#f4efe5` (+raised #fbf8f1, deep #e9e1cf), `--color-ink:#211e1a`
  (+deep #1b1815, warm #26211c, raised #2c2823, soft #3a352e), `--color-stone:#6b6357/#a69c8c`,
  `--color-bronze:#96774c` (+deep #6f5735, light #c2a878), `--color-poppy:#a93f2b` (+deep #7e2d26);
  site-level `--background:#211e1a`, `--foreground:#f4efe5`, `--border:#4a4335`; custom keyframes
  `poppy-bloom`, `cue-float`; fonts Inter+Noto Sans TC (sans) and Fraunces+Noto Serif TC (display).
- **Charts:** three containers `class="mt-2 h-[var(--chart-h)] w-full"` each with
  `role="img"` + long descriptive `aria-label` (e.g. "The Human Cost in Ranges — … bars show ranges, not
  counts.", "Victims of Nazi Persecution and Genocide — … no single figure can summarize them.", "War and
  Hunger: Selected Cases — … cases chosen for documentation, not exhaustiveness."); empty in static HTML
  (client-rendered); each offers a table alternative.
- **Content epistemics visible in HTML:** casualty figures presented as documented ranges ("The ranges are
  not carelessness — they are part of the finding"); callouts labelled 「Historical fact」 distinct from
  reflection; superscript citation markers [1][2]; "On the numbers" caveat boxes; footer source registry
  with per-source access notes ("Accessed: 2026-10-17 — Verified HTTP 200 on 2026-10-17") and source kinds
  (institutional / primary); editorial note ("Nothing on this page should be read as moral equivalence
  between aggressors and victims"); license "Code: license choice pending confirmation by the project owner";
  "This page displays no third-party historical imagery — all graphics are original works created for this
  project"; privacy ("single-page application without analytics, tracking, or cookies. Language preference
  is stored locally on your device"); cross-link to global-food-crisis.com; back-to-top.

**Verified from the repo clone (`raw/repos/remember-to-prevent.github.io`, default branch `main`,
last commit `9bd3363 2026-10-18 "Fix GitHub Pages deployment and website issues"`, 130 tracked files,
no LICENSE file — README: "License: pending … Do not add one on the project's behalf."):**

- Root mirrors GFC plus `UPDATE-INSTRUCTIONS.md` and `upload/`; no LICENSE.
- `package.json`: scaffold name `nextjs_tailwind_shadcn_ts` 0.2.1; same stack (next ^16.1.1, tailwind 4,
  echarts; + **topojson-client ^3.1.0, world-atlas ^2.0.2, @types/echarts, @types/topojson-client**;
  no d3-geo). No validation scripts (unlike GFC).
- Structure: `src/content/chapters/ch1…ch6.ts` (bilingual chapters), `src/content/data/`
  (timeline-wwi.ts + timeline-wwii.ts 17 events each, casualties.ts 3 datasets, theaters.ts 2 map snapshots,
  patterns.ts 6 cards, actions.ts 6 pathways + 20 verified links, one-minute.ts), `src/content/types.ts`
  (contracts: `Localized {en, zh}`, `Citation` with kind/accessDate/note, `CalloutKind = fact|reflection|
  testimony|methodology`, ChapterSection…), `src/components/rtp/` (site-header, hero, chapter, timeline,
  range-chart, theaters-map, one-minute, pattern-cards, action-selector, citation, reveal, poppy,
  site-footer, **use-echart.ts** — lazy SSR-safe ECharts hook), `src/lib/antimeridian.ts` (map projection),
  `src/lib/i18n.tsx`.
- `scripts/make-og-image.ts` regenerates `public/og-image.png` from an original SVG.
- `.github/workflows/deploy.yml`: lint → static export (`NEXT_OUTPUT=export`, computed base path) →
  **explicit export verification** (out/index.html exists, non-zero `out/_next` asset count, favicon.svg
  present) → upload-pages-artifact → deploy-pages. Same observed `branches: ain]` typo as GFC.
- `src/app/layout.tsx`: metadataBase `https://remember-to-prevent.github.io/`, canonical/OG/Twitter/robots,
  **JSON-LD WebSite block** (name + alternateName 銘記歷史，防止重演 — 第一章), LanguageProvider + Toaster.
- README: custom domain listed as "future step, not yet active" with metadataBase still on github.io —
  while the live site **is** now served at remember-to-prevent.com (200, fetched today): the README predates
  the domain's activation; both facts recorded as observed.
- `docs/`: sources.md, methodology.md, data-dictionary.md, limitations.md, image-rights.md.
- **No CNAME file** in the repo.
- GitHub description (HTML page): "An independent, evidence-based interactive history project exploring the
  two World Wars, reflecting on their human cost, and inspiring meaningful actions to prevent future tragedies."

**Not observable / honest limits:** timeline / pattern-card / One-minute interactives' runtime behavior
(client-side) — only their markup and content were inspected; ECharts discoverable only via bundle grep
(no literal library name in HTML or chunk text — found through the `use([BarChart, CustomChart, MapChart, …])`
registration fingerprint); API stars/topics not obtained.

---

## 3. Japan Clarity target repo — current state (as fetched 2026-10-22)

- Repo: `japan-clarity/japan-clarity.github.io` — public, default branch **main** (confirmed via
  github.com HTML page; API rate-limited this session but Task 0 had already recorded the same from the API).
- Root contents (API `GET /contents/` — **200**, saved `raw/gh-contents-japan-clarity.github.io.json`):
  exactly **one file: `README.md` (213 bytes)**. Therefore: no `.github/` → **no workflows**, no LICENSE,
  no CNAME, no package.json, nothing else.
- GitHub description (HTML page): "An independent, non-commercial, nonpartisan research platform examining
  Japan's society through evidence, international comparisons, interactive data, and constructive individual action."
- **README.md verbatim (must be preserved; fetched via raw.githubusercontent.com, saved
  `raw/gh-readme-japan-clarity.github.io.md`):**

  ```markdown
  # japan-clarity.github.io
  An independent, non-commercial, nonpartisan research platform examining Japan's society through evidence, international comparisons, interactive data, and constructive individual action.
  ```

- Live Pages (https://japan-clarity.github.io/, 200, saved `raw/japan-clarity-pages.html`): currently the
  **automatic Jekyll-rendered README page** (`<title>japan-clarity.github.io | japan-clarity</title>`,
  `generator Jekyll v3.10.0`). This means Pages is still in "deploy from branch" mode; switching
  **Settings → Pages → Source → GitHub Actions** is a required one-time step before the Actions workflow
  can publish the real site (all three reference READMEs document the same step).
- **No CNAME file exists, and none must ever be created** for this project (no custom domain; the site is
  served at the org root `https://japan-clarity.github.io/`).

---

## 4. Reusable patterns for Japan Clarity (grounded ONLY in what was actually observed above)

1. **Stack identity.** All three references run Next.js 16 App Router + TypeScript 5 + Tailwind CSS 4 +
   shadcn/ui + Bun + ECharts — the same family as our existing scaffold (`next ^16.1.1` in every package.json).
2. **Single-page static architecture.** Each site exposes only `/` (plus static assets): TF switches views
   client-side via a custom hash router (`#/zh-TW/`, `#/en/…`); GFC/RTP are one long scrollytelling page with
   `#ch1…#ch6` anchors. Both patterns are proven static-export-compatible for an org-root `*.github.io` repo.
3. **Dual-mode next.config.** `output:"standalone"` for dev vs `output:"export"` for Pages, selected by an
   env var (`DEPLOY_TARGET=github-pages` in TF; `NEXT_OUTPUT=export` in GFC/RTP), with `trailingSlash:true`,
   `images:{unoptimized:true}`, and `basePath:""` for org-root sites. This matches the plan already recorded
   in worklog Task 0.
4. **Official GitHub Pages Actions pipeline.** Bun setup → `bun install --frozen-lockfile` → lint/typecheck
   (GFC adds i18n-parity + data-validation gates) → static export → **explicit verification of
   `out/index.html` and `out/_next` assets** → `upload-pages-artifact` → `deploy-pages`, with least-privilege
   permissions and a `pages` concurrency group. No tokens/secrets needed. (Avoid the `branches: ain]`
   typo observed in GFC/RTP; TF's `branches: ["main"]` is correct.)
5. **ECharts with tree-shaken `echarts/core`** (`echarts.use([BarChart, LineChart, MapChart, …,
   CanvasRenderer])`) behind a shared lifecycle wrapper (GFC `BaseChart` / RTP `use-echart.ts`:
   ResizeObserver, dispose, option updates, font-ready re-render), with a theme object kept in sync with
   globals.css and a mobile-safe tooltip (`confine:true`).
6. **Every chart has an accessible alternative.** GFC: semantic `chart-frame`/`chart-title`/`chart-explainer`
   markup + full data-table alternative + "Loading…" placeholders; RTP: `role="img"` with descriptive
   aria-labels + table toggle. Strong pattern for our WCAG posture.
7. **Bilingual content as typed data.** TF: `LText {en, zh}` + `t()` + `Intl` formatters, content modules in
   `src/content/`, provenance contracts in `src/data/types.ts`; RTP: `Localized` + chapter/data modules with
   per-row `citationIds`; GFC: full `en.ts`/`zh-TW.ts` dictionaries with a structural-parity test
   (`validate:i18n`, 191 paths). Language switch = `aria-pressed` button pair, localStorage persistence,
   no cookies, plus GFC's pre-paint inline script to avoid an English flash on return visits.
8. **Provenance-first data model.** TF's `SourceRef` (org, url, kind, period, definition, unit, coverage,
   methodology, limitations, license, **accessDate**, honest **verification** note) and GFC's reproducible
   Python pipeline (download → process → validate → export; 19,705 checks; raw inputs retained in
   `data/raw/`) both demonstrate the "every figure traces to a registered source" discipline our spec demands.
9. **Honest-progress UX.** TF shows 「已出版 1 / 14」 with per-dimension status dots and refuses to fill
   the grid with unverified content; GFC labels data vintages and bans indicator mixing; RTP shows casualty
   **ranges** and separates 「Historical fact」 from reflection. All three use explicit methodology/limitations
   disclosures next to statistics.
10. **Dark, muted, single-accent palettes with CSS custom properties.** TF `#0f141a` + teal `#6fa3a8` +
    sand `#c8b38e`; GFC `#101a18` + gold `#c7a36c` + 6-step map scale; RTP `#211e1a` + bronze `#96774c` +
    poppy `#a93f2b`. Hairline borders with alpha, mono-font kickers, serif editorial options (GFC/RTP),
    self-hosted fonts via next/font with CJK fallbacks (Noto Sans/Serif TC, PingFang TC, Microsoft JhengHei).
11. **Transparency footer.** Independence/non-affiliation disclaimer, license line, source list with access
    dates, privacy statement ("no tracking, no analytics, no cookies"), last-updated / data-retrieved date,
    cross-links between the three sister projects (Japan Clarity is the natural fourth sibling).
12. **Metadata/SEO baseline.** metadataBase + canonical + OG + robots + JSON-LD WebSite (RTP), static
    `sitemap.xml` (TF) or force-static `sitemap.ts` (GFC), robots.txt, favicon.svg, OG image generated from
    an original SVG (RTP `scripts/make-og-image.ts`).
13. **Repo hygiene details worth copying:** `bun.lock` committed; README documents the one-time
    "Pages → Source: GitHub Actions" switch; TF README's explicit warning that a custom domain must not be
    added until purchased — directly supporting our rule: **never create a CNAME for the Japan project**.
14. **Sandbox leftovers to prune:** GFC/RTP still carry scaffold files (`.env`, `.zscripts/`, `Caddyfile`,
    `prisma/`, `examples/`, inert `db:*` scripts) — TF's leaner repo (none of those except prisma scripts
    in package.json) is the better hygiene model to follow.

---

## 5. Raw evidence inventory (research/reference-inspection/raw/)

- `taiwan-forward.html`, `taiwan-forward-css-1/2/3.css`
- `global-food-crisis.html`, `global-food-crisis.css`
- `remember-to-prevent.html` (first 150 KB), `remember-to-prevent-full-577KB.html.bak` (full download),
  `rtp-css-{5d6ea490bb740d17,7247d4b3fbbf610e,8c4827738c6c462d,d7c4bbe1d56ab72d}.css`
- `japan-clarity-pages.html`
- `gh-readme-{taiwan-forward,global-food-crisis,remember-to-prevent,japan-clarity}.github.io.md`
- `gh-contents-{global-food-crisis,japan-clarity}.github.io.json` (200s) and the rate-limited
  `gh-repo-*`, `gh-languages-*`, `gh-workflows-*`, `gh-contents-{taiwan-forward,remember-to-prevent}*.json`
  403 bodies (kept as honest records)
- `gh-page-{…}.html` (github.com repo pages used as API fallback)
- `repos/taiwan-forward.github.io/`, `repos/global-food-crisis.github.io/`,
  `repos/remember-to-prevent.github.io/` — shallow clones (default branch main, .git kept)
