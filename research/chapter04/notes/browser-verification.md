# Chapter 04 — Browser Verification Record

Run: 2026-10-28 (AEST) · static export rebuilt from working tree (`.build-export/`, verify:export 80/0, 20.4 MB)
served via `python3 -m http.server 4173`; agent-browser (Playwright) desktop + mobile emulation.
Screenshots: `research/ch04-screenshots/` (7 files: 5 audit verification + 2 development captures).

## 1. Page structure (JA default route)

- `/ja/chapters/labor-working-conditions/` → 200; title `04 労働・就業環境 — ジャパン・クラリティ`; h1 `労働・就業環境`.
- **15 figures / 15 canvases** (ids figure-ch04-employment-status … figure-ch04-oecd-hours, all unique); 12 `<section>` elements.
- Content anchors present: 6,828万 · 2.5% · 2,128万 · 36.5% · 135.1 · 66.9% · 76.6 · 1,597.5 · 4,958 · 頂点.
- **過去最多/record-high phrasing absent** (non-regular share is NOT at a record high — narrative guard G-B mirrored in rendered text).

## 2. Chart ⇄ table round-trips (5 figures, exact cells)

| Figure | Verified cells |
|---|---|
| unemployment-rate (74 rows) | 1975=**1.9** · 2002=**5.4** · 2025=**2.5** |
| employment-status (74 rows) | 1953=1,660 / 991 / 1,262 · 2025=6,185 / 499 / 115 (雇用者/自営業主/家族従業者, 万人) |
| nonregular-share (25 rows) | 2002=29.4 / 15.0 / 49.3 · 2019=**38.3** / 22.8 / 56.0 · 2025=**36.5** / 22.3 / 52.0 (男女計/男/女, %) |
| accident-injury (53 rows) | 1974=**347,407** · 2009=**105,718** (minimum) · 2025=**135,333** |
| oecd-hours (13 economies) | ドイツ 1,332.2 … OECD平均 **1,736.1** · アメリカ 1,800.2 · 日本 **1,597.5** · 韓国 1,833.0 (時間/年) |

Round-trip integrity: toggling back to グラフ restores canvas (1 canvas / 0 tables).

## 3. Interactions

- **Tooltip (desktop hover)**: 失業率 chart → `1973 | 完全失業率 | 1.2`.
- **Tooltip (mobile tap, 375×667)**: → `1989 | 完全失業率 | 2.3`.
- **CSV download** (blob-captured): 1,402 B; header rows = title, `Unit: %`, source with e-Stat statInfId URL, license line, reference period 1953–2025 + access date, generator line; data rows 1953–2025 (…2009=5.1, 2024=2.5, 2025=2.5).
- **Keyboard**: tablist focus → `ArrowRight` activates 表 tab (selection follows focus, table renders); `ArrowLeft` restores chart. Tabs expose proper `role=tab` / `aria-selected`.
- **Range filters**: radio group 全期間/1990年以降/2010年以降 — clicking 2010年以降 sets its `aria-pressed=true`, siblings false.
- **Deep link**: `/ja/…/#figure-ch04-mental-comp` scrolls the figure into viewport.
- **Language switch**: JA→EN link preserves the route (`/en/chapters/labor-working-conditions/`); EN anchors 68.28 million · 36.5% · 66.9% · 20.1% · 1,597.5 · 4,958 · peak; "record high" absent.

## 4. Responsive + layout

- Viewports 320 / 375 / 390 / 430 / 768 / 1024 / 1440 — **no horizontal scroll** at any width.
- **Sticky footer**: with viewport taller than content (1440×3200) footer sits at viewport bottom, gap 0 (`min-h-screen flex flex-col` + `mt-auto` pattern confirmed); on long pages footer is pushed naturally.

## 5. Regressions (Ch01–Ch03) & hygiene

- Ch01 population-family: 11 figures render; household-size table **1980 = 3.22** (the Ch01 audit remediation value) · 2025 = 2.10.
- Ch02 economy-industry: 10 figures; PPP anchors present.
- Ch03 housing-cost-of-living: 13 figures; 13.8 vacancy anchor present.
- App 404 route (`/404`) renders the Next.js 404 page.
- Console: no messages; page errors: none.

## 6. Screenshots archived

ch04-ja-hero-1440.png · ch04-ja-nonregular-chart-1440.png · ch04-ja-nonregular-table-1440.png ·
ch04-en-oecd-hours-1440.png · ch04-ja-mobile-375-unemployment.png ·
desktop-ja-top.png · desktop-ja-section3.png (development captures)

## 7. Post-remediation re-verification (2026-10-28)

After the adversarial-audit remediation (D1–D5), the export was rebuilt and re-verified in the
browser: 1973 unemployment-rate table row now reads **1.3** (Okinawa-included row; was 1.2);
JA page shows the corrected 65+ trough (19.2% / 2011), the corrected 契約社員 basis (230万 →
273万 with the 2013 category-break note), and no 355万/24.3% claims; EN page shows
"1.9% in 1975", "2.30 million … 2013", "19.2% trough"; 15 figures render; headline anchors
intact; all gates re-run green (tsc 0, eslint 0, validate 1358/0, contrast 58/0, export 80/0).
