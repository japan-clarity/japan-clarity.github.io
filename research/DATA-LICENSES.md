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

## Per-source publication details (Chapter 03)

| Source | Release used | Published |
|---|---|---|
| Statistics Bureau, MIC | 住宅・土地統計調査 2023 — 基本集計（確報）結果の概要 + e-Stat 時系列統計表 | 2024-09-25 / 2025-09-30 |
| Statistics Bureau, MIC | 家計調査 家計収支編 2025 (概要 + e-Stat 詳細結果表 + 長期時系列表) | 2026-02-06 / 2026-10-09 |
| Statistics Bureau, MIC | CPI 2025年平均 (2020 base); 2025年基準長期時系列データ; 2026年9月分 | 2026-01-23 / 2026-08-07 / 2026-10-23 |
| OECD | Analytical House Price Statistics (SDMX DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES v1.0) | retrieved 2026-10-26 |
| MLIT | 住宅着工統計 令和7年計 + 利用関係別時系列 1948–2025; 令和8年地価公示 | 2026-01-30 / 2026-03 |

Chapter 03 redistribution follows the table at the top of this file: raw
government files stay workspace-only (gitignored `research/chapter03/raw/`);
extracted facts, short verbatim quotes with citations, and the extraction/
fetch scripts are committed. MLIT content is licensed PDL1.0 (terms quoted in
`research/chapter03/notes/oecd-mlit-summary.md` §6) with the required
attribution 「出典：国土交通省ウェブサイト（URL）」 carried in the source
register. The OECD reuse-terms page returned HTTP 403 (Cloudflare) from this
environment — attribution follows the Chapter 02 convention and the failure
is documented in the source register and audit report.

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

## What IS committed for Chapter 02 (added 2026-10-25)

| Content | Terms | How attribution is carried |
|---|---|---|
| **World Bank WDI API responses** (`research/chapter02/raw/worldbank/*.json`) | **CC BY 4.0** — reuse and redistribution permitted with attribution | `research/chapter02/notes/oecd-worldbank-summary.md` records the attribution string, API `lastupdated: 2026-10-08`, and fetch script; CSV exports embed attribution; the source register (`src/chapters/chapter-02/sources.ts`, id `wb-wdi-2026-10`) links the CC BY 4.0 terms |
| **OECD Productivity database CSV responses** (`research/chapter02/raw/oecd/*.csv`) | OECD Terms and Conditions permit reproduction of data with attribution ("Source: OECD Productivity Statistics") | Source register id `oecd-pdb-2026` carries the attribution string, exact SDMX query URL, dataflow version `OECD.SDD.TPS:DSD_PDB@DF_PDB(2.0)` and fetch date; chart notes cite OECD |
| **Extracted statistics** (facts/figures from ESRI, MHLW, 総務省, R&D survey) | Statistical facts as such are not subject to copyright; publishers' terms require source attribution for reproduction | Every figure on the site carries organization/title/publication-date/URL via the source register; chart notes cite the specific release; notes/*.md quote fragment-length verbatim table cells with full citation |
| **Research notes with short verbatim quotes** (`research/chapter02/notes/*.md`) | Short quotations for verification/documentation, each with the exact source document named and the archived file path | Quotes are single table cells or single sentences, always with citations |
| **Extraction/generation/validation scripts** (`research/chapter02/scripts/`, `scripts/`) | Our own code | n/a |

## What is NOT committed for Chapter 02 (kept in the development workspace only)

- **Raw government files under `research/chapter02/raw/{esri,mhlw,statb}/`** — ESRI Excel/PDF,
  MHLW Excel/PDF/HTML, 総務省 Excel/PDF/e-Stat downloads. Publishers' terms govern reuse of
  their materials; we redistribute only the extracted facts and short quotes with attribution.
  (The MHLW `利用上の注意` note 9 text is quoted fragment-length in notes/mhlw-summary.md for
  methodology documentation.)
- **OECD dataflow definition JSON** (`research/chapter02/raw/oecd/oecd-dataflow-def.json`,
  3.2MB) — structural metadata kept locally; the query URL and dataflow version are recorded
  in the inventory and source register instead.
- e-Stat download URLs embed session-independent `statInfId`s; the files they returned are
  kept locally with sha256s recorded in `notes/mhlw-statb-inventory.md`.

## Per-source publication details (Chapter 02)

| Source | Release used | Published |
|---|---|---|
| Cabinet Office / ESRI | 2024年度国民経済計算年次推計 (main series, industry, employment, household) | 2025-12-23 |
| Cabinet Office / ESRI | 参考表 GDP国際比較・一人当たり名目GDP | 2025-12-23 |
| MHLW | 毎月勤労統計調査 2025年分結果確報 | 2026-02-25 |
| MHLW | 毎月勤労統計調査 2026年8月分結果確報 | 2026-10-23 |
| Statistics Bureau, MIC | 労働力調査 長期時系列データ (incl. 2025 annual) | fetched 2026-10-25 (latest monthly pub 2026-10-02) |
| Statistics Bureau, MIC | 科学技術研究調査 2025年調査 結果の概要 (FY2015–2024); 2015年調査 結果の概要 (FY2005–2014) | e-Stat 2025-12-12; 2015-round (see notes) |
| OECD | Productivity database DSD_PDB@DF_PDB v2.0 (GDPHRS, PPP) | fetched 2026-10-25 |
| World Bank | WDI API (per-capita PPP, GDP, growth, manufacturing share) | lastupdated 2026-10-08 |

Official caveats intentionally retained on the Chapter 02 site: the MHLW Jan-2024
benchmark update (published levels +2.6% vs benchmark-adjusted YoY — usage note 9);
the 2018 survey-frame change; the R&D ratio's GDP-vintage splice at FY2014→15;
PPP-vs-exchange-rate conversion differences; OECD retrospective revisions.
