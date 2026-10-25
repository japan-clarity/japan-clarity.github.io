# Chapter 01 — Audit Remediation Record

**Date:** 2026-10-25 · **Branch:** `audit/chapter-01-research-methodology`
**Base:** `origin/main` = `d2fb85d` · **Trigger:** independent research audit
(`docs/CH01-INDEPENDENT-RESEARCH-AUDIT.md`)

Two material findings and one editorial gap were remediated. Every change is
scoped to the demonstrated defect; all other datasets, texts, and chapters are
untouched (Chapter 02 and all shared surfaces: zero diff vs baseline).

---

## 1. Finding 1 — household-size 1980 (FAIL → corrected)

**Defect:** `HOUSEHOLD_SIZE[1980] = 2.30` (chart, table, CSV). True value
**3.22** (Statistical Handbook of Japan 2026, Table 2.3 — re-fetched from
stat.go.jp and read directly during the audit).

**Root cause:** `extract_households()` scanned the whole handbook and a
Table 14.6 row (traffic accidents: 1980 → *2.3* fatalities per 10,000 motor
vehicles) overwrote the value via the year-keyed dict. Reproduced
experimentally. The point had no anchor, so 523 automated checks passed.

**Files changed:**

| File | Change |
|---|---|
| `research/chapter01/scripts/extract-series.py` | household scan restricted to the Table 2.3 block (`Table 2.3` → next `Source:` line); all 13 census-year values anchored (1960–2025); monotonic non-increasing check added; root-cause comment |
| `research/chapter01/notes/extracted-series.json` | regenerated from re-fetched sources; deep-diff vs previous = **exactly one point**: `households.avgSize.1980: 2.3 → 3.22` |
| `scripts/generate-chapter-data.ts` | generated-file header now records the 2026-10-25 audit re-verification (and points to this report) |
| `src/chapters/chapter-01/data.ts` | regenerated: `1980, 2.3` → `1980, 3.22`; snapshot hash `0c5a597018c92d81` → `6fbecdf93dd73ea2`; audit header note. No other value changed. |

**Narrative impact:** none — no sentence quoted the 1980 value; the chart
description (4.14 → 2.21 → 2.10) remains correct as published.

## 2. Finding 2 — unverified 2020 estimate figure (INCONCLUSIVE → remediated)

**Defect:** census chart note + §1 callout (JA/EN, 4 surfaces) stated the
"Oct 1, 2020 population *estimate* was 126,226,568" — a figure absent from every
archived raw file and every accessible official publication (2020 annual-estimate
URLs 404; 2021–2024 annual reports carry 2020 at the census-benchmark value). The
project's own research notes had marked it NOT VERIFIED at build time.

**Remediation:** the pedagogical point ("estimates and censuses are different
statistical products") is now illustrated with the fully verified 2025 pair —
Sep 15, 2025 estimate **123.21 million** (統計トピックスNo.149 表2) vs Oct 1, 2025
census count **122,972,528** (2025 census basic tabulation) — both sources already
in the chapter's source register.

**Files changed:**

| File | Change |
|---|---|
| `src/chapters/chapter-01/charts.ts` | `ch01-census-population` note (ja/en) rewritten with the verified 2025 pair |
| `src/chapters/chapter-01/content-a.ts` | §1 "Mind the statistical product" callout (ja/en) rewritten likewise |

## 3. Finding 3 — one-person 2020 vintage (editorial → disclosure added)

Both the handbook (Figure 2.3: 38.1%) and the 2025 census re-tabulation (38.0%)
are official values for the same year. The chart used the handbook value without
disclosing the vintage difference while citing both documents.

**File changed:** `src/chapters/chapter-01/charts.ts` — `ch01-one-person` note
(ja/en) now states which source supplies which years and discloses the 0.1pp
vintage difference.

## 4. Regression guards (`scripts/validate-research.ts`, new section [4d])

1. `ch01 household size: all 13 census-year values match handbook Table 2.3 + 2025 census` — exact-value pin.
2. `ch01 household size: monotonically non-increasing 1960→2025` — catches any future V-dip.
3. `ch01 one-person share: handbook Figure 2.3 (2005–2020) + 2025 census values pinned`.
4. `ch01 provenance: unverified 2020 estimate (126,226,568) absent from all chapter text`.
5. `ch01 provenance: statistical-product example cites the verified 2025 pair (123.21M estimate vs 122,972,528 census)`.

**Negative tests (guards demonstrably fire):**

- Corrupting `data.ts` 1980 back to `2.3` → **3 failures** (data agreement + pinned
  value + monotonicity), gate exits 1. Restored → 528/0.
- Reinserting `126,226,568` into the census chart note → provenance guard fails,
  gate exits 1. Restored → 528/0.

## 5. Verification matrix (post-remediation)

| Gate | Result |
|---|---|
| `python3 research/chapter01/scripts/extract-series.py` | all anchors pass (now incl. 1980 = 3.22, 13 pinned values, monotonic) |
| `bun run validate:research` | **528 checks / 0 failures** (523 + 5 new) |
| `bun run typecheck` | 0 errors |
| `bun run lint` | clean |
| `bun run export:static` + `bun run verify:export` | 65/0 artifact checks, 17.3 MB |
| Browser (desktop 1440 / mobile 390 / iPhone emulation) | household table `1980 = 3.22` (JA+EN); chart ⇄ table ×3 both viewports; hover + touch tooltips; range filter; legend; keyboard tabs; JA ⇄ EN round trips; CSV `1980,3.22` with attribution; 0 console errors |
| Chapter 02 / theme / i18n / app shell / other chapters | `git diff d2fb85d -- src/chapters/chapter-02/ research/chapter02/ src/app/ src/components/ src/config/ src/lib/ public/` = **empty** |

Screenshots: `research/ch01-audit-screenshots/` — `before-*` (2.30 live on site,
census note with the unverified figure) and `after-*` (3.22, corrected note,
table/mobile/tap/EN evidence).

## 6. Diff summary (branch vs baseline)

```
 research/chapter01/notes/extracted-series.json |  2 +-   (1980 only)
 research/chapter01/scripts/extract-series.py  |  ~ rewritten household parser + anchors
 scripts/generate-chapter-data.ts              |  + audit header note
 scripts/validate-research.ts                   |  + section [4d] (5 guards)
 src/chapters/chapter-01/charts.ts             |  census note, one-person note
 src/chapters/chapter-01/content-a.ts           |  §1 callout
 src/chapters/chapter-01/data.ts                |  regenerated (1980 + hash + header)
 + docs/CH01-INDEPENDENT-RESEARCH-AUDIT.md, docs/CH01-AUDIT-EVIDENCE-REGISTER.md,
   docs/REMEDIATION-CH01-AUDIT.md, docs/RECOVERY.md, research/ch01-audit-screenshots/
```

No other file differs. No dataset other than the single corrected point was
altered. No published history was rewritten.
