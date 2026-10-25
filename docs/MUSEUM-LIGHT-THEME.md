# Japan Clarity — Japanese Museum Editorial Light Theme

**Scheme A: Washi White × Celadon × Kuchiba Gold**
**Branch:** `design/japanese-museum-light-theme` (from `origin/main` = `266eb23`)
**Scope:** visual-only redesign; research data, citations, chapter structure,
localization behavior and dual-mode Next.js untouched (zero-diff proof below).

---

## 1. Editorial rationale

The theme shifts Japan Clarity from the previous dark charcoal look to a
restrained, Japanese-museum-inspired light identity: a well-edited exhibition
catalogue and calm public research publication rather than a travel brochure
or commercial landing page. Structure comes from **fine rules and subtle
paper-tone steps** (page → wash → muted → paper) instead of gradients, heavy
shadows, or decorative textures.

**Design references actually inspected** (2026-10-25, general editorial
principles only — no brand designs or protected assets copied):

- `https://www.tnm.jp/` (Tokyo National Museum) — homepage HTML plus main
  stylesheet (`themes/tnm2022/assets/css/style.css`, 193 KB). Observed:
  white/light surfaces, dominant ink text `#2B2B2B` (180 uses — the same ink
  value the scheme prescribes), restrained single accent, grey structural
  tones (`#D2D2D2`/`#4D4D4D`), "Noto Sans JP" + Helvetica/Arial/Hiragino
  fallback stack for UI text.
- `https://www.kanazawa21.jp/` (21st Century Museum of Contemporary Art,
  Kanazawa) — homepage HTML plus `assets/css/common.css`, `home.css`,
  `font/font-ja.css`. Observed: near-white surfaces (`#F9F9F9`/`#F6F6F6`),
  near-black ink (`#323232`), generous mid-grey hierarchy
  (`#969696`/`#A9A9A9`), one strong accent used sparingly, Japanese system
  gothic stack (游ゴシック体/YuGothic/Hiragino).

Both references corroborate Scheme A's core structure: light paper-toned
surfaces, dark ink text, restrained accent, grey tones for structure, and a
Japanese sans for UI. Nothing was copied — Japan Clarity's palette, mark and
layout are its own, and the identity remains politically neutral.

## 2. Token system

All values live as central semantic tokens in `src/app/globals.css`
(`:root` block). Components never hard-code palette colors; the handful of
legacy hex literals that survived in components was replaced (see §5).

### 2.1 Surfaces, text, rules

| Role | Spec token | Deployed value | Tailwind slot |
|---|---|---|---|
| Main page background (Washi White) | `--surface-page` | `#F6F2EA` | `--background` |
| Secondary background (Natural White) | `--surface-muted` | `#EEE7DC` | `--block`, `--muted` |
| Stronger section surface | `--surface-section` | `#E7DED1` | `--secondary`, `--accent` |
| Reading/chart paper | `--surface-paper` | `#FFFCF7` | `--surface`, `--card`, `--popover` |
| Primary ink text | `--text-primary` | `#2B2B2B` | `--foreground`, `--heading` |
| Secondary text | `--text-secondary` | `#5C5A57` | `--muted-foreground` |
| Subtle rules (decorative) | `--border-subtle` | `#CFC6B8` | `--border` |
| Stronger rule (logo frame / callout accent) | — | `#A99B87` | `--input` |
| Decorative celadon | `--accent-celadon` | `#7B948C` | (chart series 5, branding) |
| Interactive celadon | `--accent-interactive` | **`#4E685E`** | `--teal`, `--primary`, `--ring` |
| Kuchiba gold (decorative) | `--accent-gold` | `#B89A6A` | (logo mark only) |
| Text-safe kuchiba gold | — | **`#735C38`** | `--sand` |
| Text-safe blue-grey | — | **`#54626F`** | `--bluegrey` |
| Destructive | — | `#9E4A44` | `--destructive` |

### 2.2 Chart series (on paper `#FFFCF7`)

| # | Name | Hex | Contrast vs paper |
|---|---|---|---|
| 1 | Interactive celadon | `#4E685E` | 5.92:1 |
| 2 | Kuchiba gold (chart strength) | `#96784A` | 4.04:1 |
| 3 | Muted blue-grey | `#6C7B8B` | 4.24:1 |
| 4 | Muted russet | `#9C5F50` | 4.93:1 |
| 5 | Light celadon | `#7B948C` | 3.18:1 |
| 6 | Olive grey | `#7A7265` | 4.64:1 |
| 7 | Stone grey | `#8C8274` | 3.69:1 |

Axis/legend text `#5C5A57` (6.72:1 on paper), split lines `#E7DED1`, axis
lines `#CFC6B8`, tooltips as ink "museum labels": `#2B2B2B` ground with
`#F6F2EA` text (12.68:1).

### 2.3 Documented deviations from the spec's starting palette

The spec allows adjustments required for WCAG contrast, provided they are
documented. Three were made:

1. **Interactive celadon `#526F64` → `#4E685E`.** The starting value measures
   4.48:1 against the Natural White surface (`#EEE7DC`) — just below the
   4.5:1 AA threshold for small text (eyebrows, links, active-state labels
   that render on wash/muted surfaces). One step darker clears **every**
   deployed surface with margin (4.93:1 worst case). `--accent-celadon`
   keeps the spec's decorative value `#7B948C` for non-text use.
2. **Kuchiba gold split into three strengths.** The spec's `#B89A6A` measures
   ~2.4:1 on page — unusable for the small gold text the UI needs
   (disclaimer heading, "N / 14" counter, provisional badges, projection
   notes). Deployed: `#735C38` for all **text** (≥5.2:1 everywhere it
   renders), `#96784A` for **chart series** (4.04:1 ≥ 3:1 non-text), and
   `#B89A6A` retained for **decorative branding only** (the logo's middle
   bar). Kuchiba (朽葉, "decayed leaf") is a brown-gold family, so the
   darker text values stay on-palette.
3. **Chart blue-grey `#6C7B8B` kept for series, `#54626F` for text.** The
   spec's chart value measures 3.85:1 on page — below 4.5:1 for the
   comparison-callout and "derived" badge labels; the darker text variant
   passes everywhere (4.67:1 worst case).

## 3. Typography

- **Noto Serif JP** (weights 400/600, SIL Open Font License 1.1) —
  self-hosted at build time through `next/font/google` for high-level
  editorial headings only. `display: swap`, per-glyph unicode-range
  subsetting: browsers download only the slices a page's headings actually
  use (~0.2–0.5 MB first visit, cached afterwards; no render blocking).
  Fallbacks: Hiragino Mincho ProN / Yu Mincho / Georgia.
- **Body, UI, charts, buttons, tables**: verified-license Japanese system
  sans stack (Hiragino Kaku Gothic ProN / Hiragino Sans / Yu Gothic UI /
  Yu Gothic / Noto Sans JP / Meiryo) — zero body-font downloads, per the
  spec's "suitable Japanese system sans" option. An initial experiment
  self-hosting full Noto Sans JP (4 weights) was **rejected**: it added
  ~13 MB of font subsets to the export and megabytes per first page view —
  not performance-aware.
- Licensing: both Noto families are SIL OFL 1.1 — redistribution and
  self-hosting permitted; files are emitted by the build, not committed.
- A CSS-variable scoping subtlety is documented in `globals.css`: the font
  stacks must be declared on `body` (not `:root`) because the `next/font`
  variables attach to `<body>` via className.

## 4. Representative UI usage

| Element | Treatment |
|---|---|
| Sticky header | washi at 90% (75% with backdrop-filter) + fine rule |
| Hero / page headers | flat `bg-block/60` wash — **all gradients removed** |
| Chapter cards, chart figures, TOC | paper `#FFFCF7` panels with `#CFC6B8` rules |
| Reading sections | alternating transparent / `bg-block/40` |
| Callouts | `bg-block/50` with left accents: celadon, blue-grey, gold, `#A99B87` (uncertainty) |
| Language switch / range filters | active = celadon fill + paper text; inactive = secondary ink |
| Mobile Sheet menu | paper panel, standard overlay |
| 404 + root redirect (export) | washi ground, ink text, celadon links |
| Logo/favicon | `#A99B87` frame, bars blue-grey / decorative gold / celadon |
| Tooltips | ink ground, washi text — a dark museum label on light charts |

## 5. Files changed (complete list, vs `origin/main` `266eb23`)

```
public/favicon.svg                       logo colors (light)
scripts/post-export.ts                   redirect/404 template colors (dark→light)
scripts/contrast-audit.ts                NEW — reproducible WCAG audit (58 checks)
src/app/[locale]/layout.tsx              Noto Serif JP via next/font
src/app/[locale]/page.tsx                hero flat wash; CTA token text
src/app/[locale]/chapters/[slug]/page.tsx   header flat wash
src/app/[locale]/overview/page.tsx       header flat wash
src/app/[locale]/methodology/page.tsx    header flat wash
src/app/[locale]/sources/page.tsx        header flat wash
src/app/globals.css                      token system (Scheme A), light color-scheme
src/components/charts/chart-panel.tsx    range-filter active text token
src/components/shared/callout.tsx        uncertainty accent (light)
src/components/shared/language-switch.tsx   active pill text token
src/components/shared/logo.tsx           light strokes
src/components/shared/population-sparkline.tsx   light SVG colors
src/components/shared/site-header.tsx    header/sheet backgrounds (tokens)
src/lib/visualization/chartTheme.ts      light chart palette/axes/tooltip/legend
research/theme-screenshots/              NEW — before/after evidence (16 PNG)
docs/DESIGN.md                           design-system refresh
docs/RECOVERY.md                         recovery checkpoint update
docs/MUSEUM-LIGHT-THEME.md               NEW — this document
```

**Research zero-diff proof** (`git diff origin/main -- research/ src/chapters/
src/lib/research/ src/config/chapters.ts scripts/validate-research.ts
scripts/generate-chapter-data.ts scripts/extract-series.py`): **empty** —
all 14 chapter registrations, Chapter 01 data/narratives/citations, raw
extraction records and research tooling are byte-identical to `main`.
`scripts/post-export.ts` is deployment tooling (it renders the redirect/404
pages' inline styles), not research content — its color constants are the
fix, and the research-integrity gate does not cover it.

## 6. Verification evidence (all on the feature branch)

### 6.1 Gates (commands and results)

| Gate | Command | Result |
|---|---|---|
| Typecheck | `bunx tsc --noEmit` | 0 errors |
| Lint | `bun run lint` | clean |
| Research integrity | `bun run validate:research` | **259 checks, 0 failures** (matches v1.0.0-rc1 baseline) |
| Static export | `bun run export:static` | success; 41 locale index pages + root redirect + 404 |
| Export verification | `bun run verify:export` | **57 checks, 0 failures** (matches baseline) |
| Contrast audit | `bun run scripts/contrast-audit.ts` | **58 checks, 0 failures** (WCAG 2.2 AA) |

### 6.2 Browser acceptance (agent-browser/Chromium, dev preview of the branch)

- **No horizontal overflow** at 320/375/390/430/768/1024/1440 px — home and
  Chapter 01 (`scrollWidth == innerWidth` at every width).
- **11 chart canvases** render at every viewport; **zero console/page errors**.
- **Chart ⇄ Table ⇄ Chart ×3 consecutive cycles**: desktop (22-row census
  table; canvas restored at 41,938-byte dataURL every cycle) and mobile 390
  (22 rows; 27,286 bytes) — no blank canvas, no clipped labels, filters kept.
- **Range filter** (`1990年以降`): `aria-pressed` flips, chart re-renders.
- **Legend toggle**: births-deaths canvas 48,926 → 40,598 (series hidden) →
  48,010 bytes (restored).
- **Tooltips**: desktop hover (`1990 総人口（国勢調査）123,611,167`) and
  mobile tap (`1950 総人口（国勢調査）84,114,574`) — verified census values,
  readable ink-on-paper styling.
- **CSV export**: 3,163-byte `text/csv` blob — byte-identical size to the
  pre-redesign baseline (attribution header intact).
- **JA ↔ EN round trips**: home and Chapter 01 deep link, both directions,
  plus a full page refresh mid-way (route, `lang`, title, 11 canvases all
  preserved). 日本語 remains the left/default switch, English right.
- **Keyboard**: skip link surfaces on first Tab (`本文へスキップ`) with a
  2px solid `#4E685E` focus ring; rings remain solid 2px through navigation.
- **Footer**: pinned to the viewport bottom on short content (404 at
  1440×1200, `scrollHeight == footerBottom == 1200`); pushed naturally on the
  22,446-px chapter page (matches pre-redesign measurement exactly).
- **Static export artifacts**: root `index.html` meta-refresh → `/ja/` with
  light styling; bilingual `404.html`; sitemap entries, robots.txt verified
  by `verify:export` (57/0).

### 6.3 Before/after screenshots

`research/theme-screenshots/` (16 files, ~1.9 MB, all first-party):

| Before (dark, `main`) | After (light, branch) |
|---|---|
| `before-desktop-home-ja.png` | `after-desktop-home-ja.png` |
| `before-desktop-ch01-ja.png` | `after-desktop-ch01-ja.png` |
| `before-desktop-home-en.png` | `after-desktop-home-en.png` |
| `before-desktop-overview-ja.png` | `after-desktop-overview-ja.png` |
| `before-tablet-home-ja.png` (768) | `after-tablet-home-ja.png` |
| `before-mobile-home-ja.png` (390) | `after-mobile-home-ja.png` |
| `before-mobile-ch01-ja.png` (375) | `after-mobile-ch01-ja.png` |
| — | `after-mobile-menu-390.png`, `after-desktop-404-ja.png` |

## 7. Accessibility limitations (known, deliberate)

- **Decorative rules** `#CFC6B8` measure 1.51:1 against the page — below
  the 3:1 non-text threshold. They are *decorative separators only*; no
  interactive component relies on the rule alone for identification (state
  is carried by fills, text, and the 4.93–5.43:1 focus ring). The stronger
  `#A99B87` rule (2.43:1) is used for the logo frame and callout accents —
  also decorative. There are no text inputs on the site.
- **Decorative gold** `#B89A6A` (logo bar) measures 2.39:1 — branding only,
  never informational text.
- **Chart series 5** (light celadon) at 3.18:1 passes 3:1 with a narrow
  margin; series are never differentiated by color alone (legend, markers,
  dashed projections, and full data tables).
- `prefers-reduced-motion` handling is inherited unchanged from `main`
  (animations/smooth-scroll disabled; chart animation suppressed at init)
  — source-verified; the headless toolchain used here cannot emulate the
  preference live.
- The Radix dev-mode DialogContent description advisory (production-stripped)
  and the absent `og:image` remain owner decisions, unchanged from the
  post-launch QA report.

## 8. Export footprint

| Metric | v1.0.0-rc1 (dark) | This branch |
|---|---|---|
| Export total | 8.4 MB | 15.9 MB |
| Font files | 0 | 124 (Noto Serif JP 400/600 subsets, 7.4 MB on disk) |
| Per-visit font transfer | 0 | ~0.2–0.5 MB (heading glyphs only, cached) |

The on-disk growth is the self-hosted serif; runtime cost is bounded by
unicode-range subsetting and `display: swap`. A full Noto Sans JP body
webfont was evaluated and rejected (§3).

## 9. Integration policy

This branch is **local only** — nothing has been pushed, no PR exists, no
deployment has been made. `main` on GitHub remains the deployed v1.0.0-rc1
(QA chain `266eb23`). The redesign goes live only after the owner reviews,
pushes the branch, opens the PR, CI passes, the PR is merged, and the Pages
deployment is verified. See `docs/RECOVERY.md` for exact resume commands.
