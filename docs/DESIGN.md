# Japan Clarity — Design System

## Identity

- Brand: **Japan Clarity** / ジャパン・クラリティ
- Taglines: 「データと根拠から、日本を理解する。」 / *Understanding Japan through Data and Evidence*
- Mark: restrained abstract geometry — three ascending rounded bars inside a
  rounded square outline (blue-grey, kuchiba gold, interactive celadon). It
  reads as "data" and is deliberately free of national, political, or
  religious symbolism (no flag-like red circles, crests, rising-sun motifs,
  or party marks). The mark is inline SVG (`src/components/shared/logo.tsx`,
  `public/favicon.svg`) — no external assets.

A visual-similarity review was performed against common Japanese political
and governmental iconography during design; no similarity was intended or
found. (This is a design review, not a legal trademark clearance.)

## Color tokens (light-only — Scheme A: Washi White × Celadon × Kuchiba Gold)

Defined as Tailwind v4 theme variables in `src/app/globals.css` (full
rationale, contrast table and deviation log in `docs/MUSEUM-LIGHT-THEME.md`):

| Purpose | Name | Hex |
|---|---|---|
| Main background (Washi White) | background / surface-page | `#F6F2EA` |
| Secondary surface (Natural White) | block / muted / surface-muted | `#EEE7DC` |
| Section surface / hover wash | secondary / accent / surface-section | `#E7DED1` |
| Reading & chart paper | surface / card / popover / surface-paper | `#FFFCF7` |
| Headings & body ink | heading / foreground / text-primary | `#2B2B2B` |
| Secondary text | muted-foreground / text-secondary | `#5C5A57` |
| Subtle rules (decorative) | border / border-subtle | `#CFC6B8` |
| Stronger rule (logo frame, callout accent) | input | `#A99B87` |
| Interactive celadon (links, active states, primary) | teal / primary / accent-interactive | `#4E685E` |
| Text-safe kuchiba gold | sand | `#735C38` |
| Text-safe blue-grey | bluegrey | `#54626F` |
| Decorative celadon (branding, chart series 5) | accent-celadon | `#7B948C` |
| Decorative kuchiba gold (logo mark) | accent-gold | `#B89A6A` |
| Destructive (sparingly) | destructive | `#9E4A44` |
| Focus ring | ring | `#4E685E` |

Chart series palette (muted, non-partisan, never the sole differentiator):
`#4E685E` celadon, `#96784A` kuchiba gold, `#6C7B8B` blue-grey, `#9C5F50`
russet, `#7B948C` light celadon, `#7A7265` olive grey, `#8C8274` stone grey.

Contrast: 58 automated WCAG 2.2 AA checks (`scripts/contrast-audit.ts`) pass
with margin — body ink ≈ 12.7:1 on page, secondary ≈ 6.2:1, interactive
celadon ≥ 4.5:1 on every deployed surface, chart series ≥ 3:1 on paper.
The site is intentionally light-only; there is no dark mode.

Semantic color rules: red never means "bad" and green never means "good" by
default; publication-status chips use border/tint treatments of the neutral
accents; verification badges use celadon (verified), blue-grey (derived),
kuchiba gold (provisional).

## Typography

- UI/body: verified-license Japanese system sans stack (`Hiragino Sans`,
  `Yu Gothic`, `Noto Sans JP`, `Meiryo` …) — zero body-font downloads, no
  FOUT/CLS, per the museum-theme spec's "suitable Japanese system sans"
  option.
- Headings & editorial titles: **Noto Serif JP** (SIL OFL 1.1), self-hosted
  at build time via `next/font/google` with per-glyph unicode-range
  subsetting — browsers fetch only the small slices a page's headings use
  (~0.2–0.5 MB first visit, cached after). System Mincho stack
  (`Hiragino Mincho`, `Yu Mincho`, Georgia) remains as fallback.
- Japanese reading rhythm: `html[lang="ja-JP"] .reading-prose p` uses
  line-height ≈ 2.05 (vs 1.75 for Latin); no artificial letter-spacing on
  Japanese; `overflow-wrap: break-word` on headings so long Japanese titles
  never overflow; punctuation is never forced to line boundaries manually.
- Prose measure: max ~44rem for reading blocks.

## Layout conventions

- Sticky header with backdrop blur (washi at 90%/75%); mobile navigation
  through a slide-over Sheet (paper panel; primary nav + 14 chapters +
  status badges), 44px+ touch targets.
- Long-form reading blocks: `ReadingSection` renders alternating surfaces
  (transparent / `bg-block/40`) with numbered headings, eyebrow labels, and
  copy-link anchors; generous but balanced spacing (`py-10`/`sm:py-14`).
- Callouts differentiate 観測/比較/解釈/不確実性/行動/定義 via a text label plus a
  left accent color (never color alone).
- Footer pinned to the viewport bottom on short pages (`min-h-screen flex
  flex-col` + `mt-auto`), pushed naturally on long pages; safe-area friendly.
- Focus: global `:focus-visible` ring in interactive celadon; skip-link;
  reduced-motion media query disables animations and smooth scrolling.
- Surfaces are flat: no gradients, no heavy shadows; structure comes from
  fine `#CFC6B8` rules and subtle paper-tone steps (page → wash → muted →
  paper). Tooltips render as ink-on-paper "museum labels" (`#2B2B2B` ground,
  washi text).

## Component rules

- All interactive controls are existing shadcn/ui primitives (Button, Tabs,
  Sheet, DropdownMenu, Skeleton, Separator) styled with the token system.
- Charts: straight lines only (no smoothing — data honesty), dashed = projection,
  symbols on sparse series, axis tooltips with units, `pan-y` touch behavior.
- Data tables: sticky header inside a scroll region, tabular numerals,
  scoped headers, explicit "公表値なし" for missing values.
