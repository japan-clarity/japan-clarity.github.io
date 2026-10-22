# Japan Clarity — Design System

## Identity

- Brand: **Japan Clarity** / ジャパン・クラリティ
- Taglines: 「データと根拠から、日本を理解する。」 / *Understanding Japan through Data and Evidence*
- Mark: restrained abstract geometry — three ascending rounded bars inside a
  rounded square outline (muted teal, sand, dusty blue grey). It reads as
  "data" and is deliberately free of national, political, or religious
  symbolism (no flag-like red circles, crests, rising-sun motifs, or party
  marks). The mark is inline SVG (`src/components/shared/logo.tsx`,
  `public/favicon.svg`) — no external assets.

A visual-similarity review was performed against common Japanese political
and governmental iconography during design; no similarity was intended or
found. (This is a design review, not a legal trademark clearance.)

## Color tokens (dark-only)

Defined as Tailwind v4 theme variables in `src/app/globals.css`:

| Purpose | Name | Hex |
|---|---|---|
| Main background | background | `#0F141A` Deep Charcoal |
| Secondary surface | surface / card | `#151C24` Slate Dark |
| Reading-section surface | block | `#1B2530` Muted Slate |
| Headings | heading | `#E8EEF3` Soft Off-White |
| Body text | foreground | `#C7D1DA` Cool Light Grey |
| Secondary text | muted-foreground | `#93A1AE` Muted Grey Blue |
| Dividers / input | border | `#2A3642` Dark Border Grey |
| Primary accent (teal) | teal / primary | `#6FA3A8` Muted Teal |
| Secondary accent | sand | `#C8B38E` Soft Sand |
| Supporting accent | bluegrey | `#7F93A6` Dusty Blue Grey |
| Destructive (sparingly) | destructive | `#C08A8A` muted rose |

Chart series palette (muted, non-partisan, never the sole differentiator):
`#6FA3A8`, `#C8B38E`, `#7F93A6`, `#A39283`, `#8FA6B5`, `#93A1AE`, `#C7D1DA`.

Contrast (approximate ratios on `#0F141A`): body text ≈ 10.9:1, secondary
text ≈ 7:1, accents ≥ 6:1 for text usage — WCAG 2.2 AA is met with margin.
The site is intentionally dark-only; there is no light mode.

Semantic color rules: red never means "bad" and green never means "good" by
default; publication-status chips use border/tint treatments of the neutral
accents; verification badges use teal (verified), blue-grey (derived),
sand (provisional).

## Typography

- UI/body: system sans stack with Japanese-first fallbacks
  (`Hiragino Sans`, `Yu Gothic`, `Noto Sans JP`, `Meiryo` …). No webfont
  downloads — zero external requests, no FOUT/CLS.
- Headings & editorial titles: system serif stack (`Hiragino Mincho`,
  `Yu Mincho`, `Noto Serif JP`, Georgia) — a research-publication tone that
  works in both languages.
- Japanese reading rhythm: `html[lang="ja-JP"] .reading-prose p` uses
  line-height ≈ 2.05 (vs 1.75 for Latin); no artificial letter-spacing on
  Japanese; `overflow-wrap: break-word` on headings so long Japanese titles
  never overflow; punctuation is never forced to line boundaries manually.
- Prose measure: max ~44rem for reading blocks.

## Layout conventions

- Sticky header with backdrop blur; mobile navigation through a slide-over
  Sheet (primary nav + 14 chapters + status badges), 44px+ touch targets.
- Long-form reading blocks: `ReadingSection` renders alternating surfaces
  (transparent / `bg-block/40`) with numbered headings, eyebrow labels, and
  copy-link anchors; generous but balanced spacing (`py-10`/`sm:py-14`).
- Callouts differentiate 観測/比較/解釈/不確実性/行動/定義 via a text label plus a
  left accent color (never color alone).
- Footer pinned to the viewport bottom on short pages (`min-h-screen flex
  flex-col` + `mt-auto`), pushed naturally on long pages; safe-area friendly.
- Focus: global `:focus-visible` ring in muted teal; skip-link; reduced-motion
  media query disables animations and smooth scrolling.

## Component rules

- All interactive controls are existing shadcn/ui primitives (Button, Tabs,
  Sheet, DropdownMenu, Skeleton, Separator) styled with the token system.
- Charts: straight lines only (no smoothing — data honesty), dashed = projection,
  symbols on sparse series, axis tooltips with units, `pan-y` touch behavior.
- Data tables: sticky header inside a scroll region, tabular numerals,
  scoped headers, explicit "公表値なし" for missing values.
