# japan-clarity.github.io

An independent, non-commercial, nonpartisan research platform examining Japan's society through evidence, international comparisons, interactive data, and constructive individual action.

**Japan Clarity / ジャパン・クラリティ** — 「データと根拠から、日本を理解する。」 / *Understanding Japan through Data and Evidence.*

- Live site (after deployment): https://japan-clarity.github.io/
- Japanese (`ja-JP`) is the default language; English (`en`) is the secondary language. The switch shows 日本語 on the left and English on the right.
- Currently published: **Chapter 01 — Population & Family / 人口・家族** (published with disclosed limitations). Chapters 02–14 are registered with research scope and are clearly marked as planned until their evidence is verified.

## What this repository contains

| Path | Purpose |
|---|---|
| `src/app/[locale]/` | Bilingual static site (Next.js App Router, `/ja/…` and `/en/…` routes) |
| `src/chapters/` | Chapter modules — content, chart specs, and source registers owned per chapter |
| `src/config/` | Central site config (`site.ts`) and the 14-dimension chapter registry (`chapters.ts`) |
| `src/lib/` | i18n, research provenance types, chart theme, locale-aware formatting |
| `src/components/` | Shared UI (header/footer/language switch/reading blocks) and the chart framework |
| `research/chapter01/` | Verification notes, extraction scripts, and World Bank API responses (CC BY 4.0) |
| `research/DATA-LICENSES.md` | What is redistributed and under which terms (per content category) |
| `scripts/` | Research integrity gate, data generation, export post-processing & verification |
| `.github/workflows/` | `ci.yml` (PR validation) and `deploy.yml` (GitHub Pages deployment) |
| `docs/` | Architecture, design system, deployment, verification log, remediation report, recovery checkpoint |

## Development

```bash
bun install          # install dependencies
bun run dev          # development preview at http://localhost:3000 (ja default)
```

Quality gates (all must pass before release):

```bash
bunx tsc --noEmit          # TypeScript
bun run lint               # ESLint
bun run validate:research  # research integrity gate (259 checks)
```

## Production (GitHub Pages static export)

```bash
bun run export:static      # DEPLOY_TARGET=github-pages next build + post-export
bun run verify:export      # verifies the static artifact (57 checks)
```

The export writes to `.build-export/` (isolated from the dev server's
`.next/`), plus `index.html` (root redirect to `/ja/`) and `404.html`.

Deployment happens automatically through GitHub Actions when reviewed work
lands on `main`. One-time repository setting: **Settings → Pages → Build and
deployment → Source: GitHub Actions**. See `docs/DEPLOYMENT.md`.

## Research integrity rules

- Every figure on the site traces to an archived, officially published source
  (see `docs/VERIFICATION.md` for the audit trail and known corrections).
- The pipeline is reproducible: raw official documents →
  `research/chapter01/scripts/extract-series.py` (anchor-validated) →
  `scripts/generate-chapter-data.ts` (generated, hash-stamped) →
  `scripts/validate-research.ts` (chart/data agreement gate).
- Projections are labeled as projections; provisional figures are labeled as
  provisional; nothing is published as verified that was not read inside the
  source document.
- No fabricated statistics, no invented citations, no custom domain (the
  prospective `japan-clarity.com` is not purchased; no CNAME exists).

## License / data terms

- Application code: see the repository license when added by the project owner.
- Data: Japanese government statistics are reproduced with source attribution
  under each publisher's terms; World Bank series are CC BY 4.0. CSV exports
  from the site carry full attribution headers. The full statement of what is
  redistributed and under which terms is in `research/DATA-LICENSES.md`; the
  pre-publication security and minimization remediation is documented in
  `docs/REMEDIATION.md`.

This project is not affiliated with, sponsored by, or endorsed by any
political party, government agency, advocacy organization, or other
institution referenced on the website.
