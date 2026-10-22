# Japan Clarity — Data Redistribution & Licensing Notes

This document states, per content category, what is redistributed in this
public repository and under what terms. It exists so that the public repo
contains only material we are permitted to redistribute. Verification/access
date for all sources below: **2026-10-22**.

## What IS committed in this repository

| Content | Terms | How attribution is carried |
|---|---|---|
| **World Bank WDI API responses** (`research/chapter01/raw/worldbank/*.json`) | **CC BY 4.0** — the World Bank explicitly permits reuse and redistribution with attribution | `research/chapter01/notes/worldbank-summary.md` records the attribution string, source organization text, and API `lastupdated: 2026-10-08`; every CSV export on the site embeds attribution; the source register (`src/chapters/chapter-01/sources.ts`) links the CC BY 4.0 terms |
| **Extracted statistics** (facts and figures from official Japanese statistics) | Statistical facts as such are not subject to copyright; the publishers' own terms require source attribution for reproduction | Every figure on the site carries its source (organization, title, publication date, URL) via the source register; chart notes cite the specific release |
| **Research notes with short verbatim quotes** (`research/chapter01/notes/*.md`) | Short quotations for verification/documentation purposes, each with the exact source document named and the archived file path | Quotes are fragment-length (single table cells, bullet sentences) and always accompanied by the source citation |
| **Extraction/generation/validation scripts** (`research/chapter01/scripts/`, `scripts/`) | Our own code | n/a |
| **Screenshots** (`research/verification-screenshots/`) | Renders of our own site | n/a |

## What is NOT committed (kept in the development workspace only)

- **Raw government PDFs/HTML/Excel under `research/chapter01/raw/{statb,mhlw,ipss}/`** —
  the publishers' pages state terms for reuse of their materials; we
  redistribute only the extracted facts and short quotes with attribution
  (above), not the documents themselves.
- **Archived copies of third-party websites** (`research/reference-inspection/raw/`)
  — full HTML/CSS snapshots and README copies of the three reference projects
  (Taiwan Forward, Global Food Crisis, Remember to Prevent) that informed the
  design. No redistribution permission exists for these; only our own
  factual inspection summary (`research/reference-inspection/summary.md`) is
  committed.
- **Environment files** (`.env*`), local databases, build outputs, and
  sandbox tooling — see `.gitignore`.

## Repository code license

Application code currently carries no license file; adding one (MIT, etc.) is
deliberately left to the project owner. Until then, default copyright applies
to code, while the data terms above govern the research content.

## Per-source publication details (Chapter 01)

| Source | Release used | Published |
|---|---|---|
| Statistics Bureau, MIC | 2025 Population Census — Basic Complete Tabulation, Summary of Results | 2026-09-29 |
| Statistics Bureau, MIC | Population Estimates (Oct 2026 monthly; May 2026 final) | 2026-10-20 |
| Statistics Bureau, MIC | Statistics Topics No.149 (elderly population) | 2026-09-20 |
| Statistics Bureau, MIC | Statistical Handbook of Japan 2026 (English) | 2026-09 |
| MHLW | Vital Statistics 2025 — Final Counts (確定数) Overview | 2026-09-30 |
| MHLW | Abridged Life Tables 2025 | 2026-07-24 |
| IPSS | Population Projections for Japan, 2023 round (medium variant) | 2023-04-26 |
| IPSS | Household Projections, 2024 round | 2024-04-12 |
| Statistics Bureau, MIC | Report on Internal Migration 2025 | 2026-02-03 |
| World Bank | WDI API (TFR, 65+ share, life expectancy, population) | lastupdated 2026-10-08 |

Official revision caveats that are intentionally retained on the site:
2025 TFR/rates to be recalculated with the 2025 Census denominator in
November 2026 (value may change); monthly population estimates switch to the
2025-census benchmark from the November 2026 report; the Sept-15 (elderly
release) vs Oct-1 (census/annual estimates) reference-date difference
(0.1–0.3 pp); IPSS figures are assumption-dependent scenarios.
