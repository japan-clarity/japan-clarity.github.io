# Japan Clarity — Architecture

## Dual-mode Next.js (one codebase, two targets)

| Mode | Trigger | Output |
|---|---|---|
| A — development preview | `bun run dev` (no env var) | standard `next dev` on port 3000, dev-only redirect `/` → `/ja/`, hot reload |
| B — GitHub Pages | `DEPLOY_TARGET=github-pages next build` | `output: "export"` static site in `.build-export/` |

`next.config.ts` switches on `DEPLOY_TARGET`. In Mode B the build directory
is isolated as `.build-export` so an export can never clobber the dev
server's `.next` — both modes were verified running simultaneously.
Static export emits no redirect pages, so `scripts/post-export.ts` writes
`.build-export/index.html` (meta-refresh to `/ja/`) and a standalone
bilingual `404.html`.

Static-export compatibility constraints respected throughout: no runtime API
routes, no server actions, no middleware, no ISR, no default image
optimization (`images.unoptimized`), `trailingSlash: true` (directory-style
URLs: `/ja/chapters/population-family/` → `…/index.html`).

The repository is an Organization Pages repository (`japan-clarity.github.io`),
so the site is served from the repository root and no `basePath` is needed.
`NEXT_PUBLIC_BASE_PATH` is honored for the hypothetical project-Pages case,
and `NEXT_PUBLIC_SITE_URL` overrides the canonical/sitemap origin.

## Bilingual routing — decision and tradeoffs

**Chosen:** statically generated locale routes `/ja/…` and `/en/…`, with the
root layout living in `app/[locale]/layout.tsx` so every exported page
carries the correct `<html lang>` without middleware.

Why not the alternatives:
- *Default locale at root (`/` = Japanese, `/en/…` = English)* — shorter URLs,
  but asymmetric, error-prone to maintain, and the language is invisible in
  shared links.
- *Hash routing (`/#/ja/`, as one reference project uses)* — works from a
  single `index.html`, but non-standard for Next.js, worse for SEO and
  accessibility, and complicates deep links.
- *Client-side locale state only* — breaks direct links and refresh
  persistence.

The switcher swaps the first path segment, preserving the current page
(verified for home → home and chapter → chapter), stores the preference in
`localStorage`, and always renders 日本語 on the left and English on the
right. Unknown paths inside a locale tree hit a catch-all that renders the
bilingual not-found page with the full layout; paths outside the locale trees
are served the standalone `404.html` on GitHub Pages.

## Chapter isolation (non-negotiable)

Each chapter owns its content (`content-*.ts`), chart specs (`charts.ts`),
source register (`sources.ts`), and generated data (`data.ts`) inside
`src/chapters/chapter-XX/`. The registry (`src/chapters/registry.ts`) maps
published modules to the config-level metadata. Chapters never import
another chapter's private modules; shared infrastructure lives in
`src/components`, `src/lib`, and `src/config`.

Enforced by `scripts/validate-research.ts`:
- registry integrity (14 unique chapters, sequential numbering, statuses)
- every chart's `sourceIds` resolve in the owning chapter's register; sources
  carry complete provenance (17 fields); published chapters never cite
  `unverified` sources
- chart specs: aligned arrays, finite values, bilingual text, no orphans
- generated data equals the anchor-validated extraction, and the extraction's
  content hash is unchanged (unexpected-dataset-change detection)
- ja/en dictionary and content parity

Adding Chapter 02 = create `src/chapters/chapter-02/` (module contract in
`src/chapters/types.ts`), register it, add its research artifacts, run the
gate. Chapter 01 remains byte-stable unless its own files change.

## Research data pipeline

```
raw official documents (archived under research/chapter01/raw/,
  fetched 2026-10-22 from official domains)
  └─ research/chapter01/scripts/extract-series.py     (era-aware table parser,
       40+ anchor assertions, handles the 1944–46 war gap & footnote tokens)
       └─ research/chapter01/notes/extracted-series.json   (sha256-stamped)
           └─ scripts/generate-chapter-data.ts          (codegen, zero manual
               transcription) → src/chapters/chapter-01/data.ts
               └─ src/chapters/chapter-01/charts.ts     (chart specs reference
                   the generated arrays)
                   └─ scripts/validate-research.ts      (gate: data agreement)
```

## Chart framework

`src/components/charts/chart-panel.tsx` renders every figure:
- **Chart ⇄ table switching** via Radix Tabs. Inactive tab content is
  unmounted, so returning to the chart re-mounts `ChartView`, which
  re-initializes ECharts from scratch — this is the architectural guarantee
  behind the chart → table → chart restoration requirement (verified 3× on
  desktop and 3× on mobile).
- ECharts is imported lazily from `echarts/core` with tree-shaken modules
  (line/bar + grid/legend/tooltip). Canvas uses `touch-action: pan-y`, so
  mobile tooltips work without hijacking page scroll; tooltips are confined
  to the canvas.
- Legends toggle series; long series get compact range filters
  (全期間 / 1990年以降 / 2010年以降); projections render dashed and carry an
  explicit "projection, not observation" notice.
- Every figure offers an accessible description (`role="img"` + summary), a
  semantic data table with scoped headers, and CSV download with a full
  attribution header (license-aware).
- Colors come from the muted seven-color palette; series are also
  distinguishable by table, markers, and dashed styles — never color alone.

## UI system

Tailwind CSS v4 with a dark-only token set defined in `src/app/globals.css`
(see `docs/DESIGN.md`). Typography uses system font stacks only (Japanese
gothic/mincho families with graceful fallbacks) — no external font
downloads. The UI dictionary (`src/lib/i18n/dictionary.ts`) is fully typed;
ja/en parity is compile-time and runtime checked.

Layout: root wrapper `min-h-screen flex flex-col` with the footer at
`mt-auto` — pinned to the viewport bottom on short pages, pushed naturally
on long pages (both verified in the browser).

## What this app deliberately does NOT use

No database (all research data is build-time static content — required for
static export), no runtime API routes, no server actions, no authentication,
no analytics, no external fonts, no CDN assets.
