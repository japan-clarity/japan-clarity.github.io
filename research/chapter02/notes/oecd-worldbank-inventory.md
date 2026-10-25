# OECD PDB & World Bank WDI — Acquisition Inventory (Chapter 02: Economy & Industry)

- **Task ID**: 2-c (research/download/inventory subagent)
- **Access date**: 2026-10-25 (UTC, sandbox clock)
- **Scope**: OECD Productivity Database (SDMX DSD_PDB@DF_PDB v2.0) + World Bank WDI API v2.
  This file records WHAT was downloaded and verified. It deliberately contains **no
  interpretation of statistical values** (no cross-country rankings, no judgments).
- **Raw file roots**: `research/chapter02/raw/oecd/`, `research/chapter02/raw/worldbank/`
- **Fetch script (Part 2)**: `research/chapter02/scripts/fetch-worldbank.sh` (modeled on
  `research/chapter01/scripts/fetch-worldbank.sh`; sha256
  `3c19e81274a214a85ad7371a0bea49ad3097e1b5f63f4c50d96d83d6365f0271`, 88 lines).
- **Requested OECD country set (13)**: JPN KOR SGP AUS NZL DEU FRA SWE NLD CAN GBR USA ITA
  (SDMX key OR-syntax: `JPN+KOR+SGP+AUS+NZL+DEU+FRA+SWE+NLD+CAN+GBR+USA+ITA`).
- **WB country set (13, ch01-identical)**: `JPN;KOR;SGP;AUS;NZL;DEU;FRA;SWE;NLD;CAN;GBR;USA;ITA`.

---

## PART 1 — OECD SDMX: Productivity Database (DSD_PDB@DF_PDB, v2.0)

### 1.1 Access log (exact URLs)

All data calls: `curl -sS --max-time 180 "<URL>" -o <file>` (no Accept header needed;
`format=csvfilewithlabels` governs). Dataflow call used `--max-time 60` + Accept header.

| # | File (raw/oecd/) | HTTP | Bytes | Exact URL |
|---|------------------|------|-------|-----------|
| 1 | `oecd-gdphrs-ppp-current.csv` | 200 | 170,076 | `https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_PDB@DF_PDB,2.0/JPN+KOR+SGP+AUS+NZL+DEU+FRA+SWE+NLD+CAN+GBR+USA+ITA.A.GDPHRS._T.USD_PPP_H.V.N._Z.PPP?format=csvfilewithlabels` |
| 2 | `oecd-gdphrs-ppp-volume.csv` | 200 | 180,549 | `https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_PDB@DF_PDB,2.0/JPN+KOR+SGP+AUS+NZL+DEU+FRA+SWE+NLD+CAN+GBR+USA+ITA.A.GDPHRS._T.USD_PPP_H.LR.N._Z.PPP?format=csvfilewithlabels` |
| 3 | `oecd-gdppop-ppp-current.csv` | 200 | 201,032 | `https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_PDB@DF_PDB,2.0/JPN+KOR+SGP+AUS+NZL+DEU+FRA+SWE+NLD+CAN+GBR+USA+ITA.A.GDPPOP._T.USD_PPP_PS.V.N._Z.PPP?format=csvfilewithlabels` |
| 4 | `oecd-gdpemp-ppp-current.csv` | 200 | 185,341 | `https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_PDB@DF_PDB,2.0/JPN+KOR+SGP+AUS+NZL+DEU+FRA+SWE+NLD+CAN+GBR+USA+ITA.A.GDPEMP._T.USD_PPP_PS.V.N._Z.PPP?format=csvfilewithlabels` |
| 5 | `oecd-dataflow-def.json` | 200 | 3,211,419 | `https://sdmx.oecd.org/public/rest/dataflow/OECD.SDD.TPS/DSD_PDB@DF_PDB/2.0?references=all` (Accept: `application/vnd.sdmx.structure+json;version=2.0.0`) |

### 1.2 sha256 checksums (raw/oecd/)

```
f507da78227f6859f6e6dd1240ad81c550bfad1cca7ddbe944dff09e7160a360  oecd-gdpemp-ppp-current.csv
8670888ac016cbd34e63509d6e765803fa338ca8d391b9250f49d59ae6ccf956  oecd-gdphrs-ppp-current.csv
4ab157b5b3a96721d0c100ad85ac404910630d093f9d18b0ec4c88917f2472d4  oecd-gdphrs-ppp-volume.csv
1d83ba5345ecc630c1aa5056378dd4a1a91af75102b82dd72abf69e8865174ac  oecd-gdppop-ppp-current.csv
df70a255df77a1a1a628a5be6795eef42f0eaba9eccae7f3e97e27d5d3839c6e  oecd-dataflow-def.json
```

### 1.3 Dataflow definition evidence (`oecd-dataflow-def.json`)

- Dataflow: **`DSD_PDB@DF_PDB`**, version **2.0**, agency **OECD.SDD.TPS**.
  Name: "Productivity database" (en) / "Base de données de productivité" (fr).
  Structure message `meta.prepared` = `2026-10-25T16:02:30Z`, SDMX-JSON structure schema 2.0.0.
- Dimension order (DSD `DSD_PDB` v2.0, `dimensionList` positions 1–9):
  1. `REF_AREA` → codelist `OECD:CL_AREA(1.7)`
  2. `FREQ` → `SDMX:CL_FREQ(2.1)`
  3. `MEASURE` → `OECD.SDD.TPS:CL_MEASURE_PROD(1.1)`
  4. `ACTIVITY` → `OECD:CL_ACTIVITY_ISIC4(1.0)`
  5. `UNIT_MEASURE` → `OECD:CL_UNIT_MEASURE(1.25)`
  6. `PRICE_BASE` → `OECD:CL_PRICES(1.0)`
  7. `TRANSFORMATION` → `OECD:CL_TRANSFORMATION(1.0)`
  8. `ASSET_CODE` → `OECD.SDD.TPS:CL_ASSET_CODE(1.0)`
  9. `CONVERSION_TYPE` → `OECD:CL_CONVERSION_TYPE(1.1)`
- Attributes: `OBS_STATUS` (SDMX:CL_OBS_STATUS 2.2), `UNIT_MULT` (CL_UNIT_MULT 1.1),
  `BASE_PER` (free text), `DECIMALS` (CL_DECIMALS 1.0).
- Codelists delivered in the file (12 total): CL_ACTIVITY_ISIC4 (958 codes),
  CL_AREA (560), CL_CONVERSION_TYPE (4), CL_PRICES (14), CL_TRANSFORMATION (58),
  CL_UNIT_MEASURE (1,106), CL_ASSET_CODE (20), CL_MEASURE_PROD (46), CL_DECIMALS (16),
  CL_FREQ (34), CL_OBS_STATUS (20), CL_UNIT_MULT (31).
- Key codelist entries (evidence for the codes used in our queries):
  - `CL_MEASURE_PROD`: `GDPHRS` = GDP per hour worked; `GDPPOP` = GDP per capita;
    `GDPEMP` = GDP per person employed; also `GVAHRS` = GVA per hour worked, `EMP` = Employment.
  - `CL_UNIT_MEASURE`: `USD_PPP_H` = "US dollars per hour, PPP converted";
    `USD_PPP_PS` = "US dollars per person, PPP converted"; `USD_PPP` = "US dollars, PPP converted";
    `USD_PPP_WR` = "US dollars per worker, PPP converted" (**exists in the codelist but has
    no data in this dataflow — see 1.6**); `XDC_H` = national currency per hour.
  - `CL_PRICES`: `V` = Current prices; `LR` = Chain linked volume (rebased).
  - `CL_CONVERSION_TYPE`: `PPP` = PPP converted (`EXC` = exchange rate, `NC` = not converted).
  - `CL_TRANSFORMATION`: `N` = Non transformed data. `CL_ASSET_CODE`: `_Z` = Not applicable.
  - `CL_ACTIVITY_ISIC4`: `_T` = "Total - all activities".
  - `CL_AREA` v1.7: contains **both** `JPN` (Japan) and `SGP` (Singapore) — SGP is listed as a
    (partner) area, but **returns zero data** in this dataflow (see 1.6).

### 1.4 Per-CSV inventory (all four: valid `STRUCTURE,` header line, SDMX-CSV with labels)

Common structure (34 columns): `STRUCTURE, STRUCTURE_ID, STRUCTURE_NAME, ACTION, REF_AREA,
Reference area, FREQ, Frequency of observation, MEASURE, Measure, ACTIVITY, Economic activity,
UNIT_MEASURE, Unit of measure, PRICE_BASE, Price base, TRANSFORMATION, Transformation,
ASSET_CODE, Asset type, CONVERSION_TYPE, Conversion type, TIME_PERIOD, Time period, OBS_VALUE,
Observation value, OBS_STATUS, Observation status, UNIT_MULT, Unit multiplier, BASE_PER,
Base period, DECIMALS, Decimals`.
`STRUCTURE_ID` on every row: `OECD.SDD.TPS:DSD_PDB@DF_PDB(2.0)`; `STRUCTURE_NAME`:
"Productivity database". Every row: `STRUCTURE` = `DATAFLOW`, `ACTION` = `I`;
FREQ=A, ACTIVITY=_T, TRANSFORMATION=N, ASSET_CODE=_Z, CONVERSION_TYPE=PPP. Year coverage below is min–max (n observations; in every case the span
length equals n, i.e. contiguous annual series with no internal gaps).

**1. `oecd-gdphrs-ppp-current.csv`** — MEASURE=GDPHRS, UNIT_MEASURE=USD_PPP_H (as expected),
PRICE_BASE=V (current prices, as expected). BASE_PER empty. 528 data rows, 12 areas:

| Area | Years | Obs | | Area | Years | Obs |
|------|-------|-----|-|------|-------|-----|
| AUS | 1994–2025 | 32 | | KOR | 1995–2025 | 31 |
| CAN | 1971–2025 | 55 | | NLD | 1995–2025 | 31 |
| DEU | 1991–2025 | 35 | | NZL | 1971–2025 | 55 |
| FRA | 1970–2025 | 56 | | SWE | 1980–2025 | 46 |
| GBR | 1980–2025 | 46 | | USA | 1987–2025 | 39 |
| ITA | 1980–2025 | 46 | | **JPN** | **1970–2025** | **56** |

**2. `oecd-gdphrs-ppp-volume.csv`** — MEASURE=GDPHRS, UNIT_MEASURE=USD_PPP_H,
PRICE_BASE=LR (chain-linked volume, rebased, as expected). **BASE_PER = `2020`** on every row
(rebasing/base year evidence). 528 data rows, 12 areas, identical area/year coverage to file 1
(AUS 1994–2025/32, CAN 1971–2025/55, DEU 1991–2025/35, FRA 1970–2025/56, GBR 1980–2025/46,
ITA 1980–2025/46, JPN 1970–2025/56, KOR 1995–2025/31, NLD 1995–2025/31, NZL 1971–2025/55,
SWE 1980–2025/46, USA 1987–2025/39).

**3. `oecd-gdppop-ppp-current.csv`** — MEASURE=GDPPOP, **UNIT_MEASURE=USD_PPP_PS worked on the
first attempt** ("US dollars per person, PPP converted"; no fallback needed), PRICE_BASE=V.
BASE_PER empty. 628 data rows, 12 areas:

| Area | Years | Obs | | Area | Years | Obs |
|------|-------|-----|-|------|-------|-----|
| AUS | 1982–2025 | 44 | | KOR | 1970–2025 | 56 |
| CAN | 1981–2025 | 45 | | NLD | 1970–2025 | 56 |
| DEU | 1970–2025 | 56 | | NZL | 1991–2025 | 35 |
| FRA | 1970–2025 | 56 | | SWE | 1970–2025 | 56 |
| GBR | 1970–2025 | 56 | | USA | 1970–2025 | 56 |
| ITA | 1970–2025 | 56 | | **JPN** | **1970–2025** | **56** |

**4. `oecd-gdpemp-ppp-current.csv`** — MEASURE=GDPEMP, **UNIT_MEASURE=USD_PPP_PS** (valid code
found via wildcard — see 1.6), PRICE_BASE=V. BASE_PER empty. 563 data rows, 12 areas:

| Area | Years | Obs | | Area | Years | Obs |
|------|-------|-----|-|------|-------|-----|
| AUS | 1994–2025 | 32 | | KOR | 1995–2025 | 31 |
| CAN | 1970–2025 | 56 | | NLD | 1970–2025 | 56 |
| DEU | 1991–2025 | 35 | | NZL | 1989–2025 | 37 |
| FRA | 1970–2025 | 56 | | SWE | 1980–2025 | 46 |
| GBR | 1980–2025 | 46 | | USA | 1970–2025 | 56 |
| ITA | 1970–2025 | 56 | | **JPN** | **1970–2025** | **56** |

### 1.5 Country presence summary

- Countries returning data in **all four CSVs**: AUS, CAN, DEU, FRA, GBR, ITA, JPN, KOR,
  NLD, NZL, SWE, USA (12).
- **SGP (Singapore) returned NO data in any of the four queries.** It *is* present in the
  CL_AREA(1.7) codelist (name "Singapore"), i.e. a recognised partner area, but the dataflow
  holds no SGP observations for these measures.
- JPN coverage: 1970–2025 (56 contiguous annual observations) in all four files — the longest
  available coverage; NZL *does* have GDPHRS (contrary to the flagged risk), only SGP is absent.

### 1.6 Failed query patterns and fallbacks that worked

| Attempt | Key (dims 2–9) | Result | Resolution |
|---------|----------------|--------|------------|
| GDPEMP with `USD_PPP_WR` (suggested code) | `.A.GDPEMP._T.USD_PPP_WR.V.N._Z.PPP` | **HTTP 404** — body `NoResultsFound` (14 bytes) | — |
| GDPEMP with `USD_PPP` | `.A.GDPEMP._T.USD_PPP.V.N._Z.PPP` | **HTTP 404** — body `NoRecordsFound` (14 bytes) | — |
| GDPEMP with wildcarded UNIT_MEASURE | `.A.GDPEMP._T..V.N._Z.PPP` | HTTP 200, 563 rows; only `USD_PPP_PS` present | Re-issued explicit key `.A.GDPEMP._T.USD_PPP_PS.V.N._Z.PPP` → HTTP 200 (185,341 bytes, byte-identical size/row count to wildcard; wildcard temp file deleted). **Valid unit code for GDPEMP = `USD_PPP_PS`.** |
| SGP wildcard probe (evidence, not a deliverable) | `SGP.A....V.N._Z.PPP` | **HTTP 404** — `NoRecordsFound` | Confirms SGP has no PDB data for current-price PPP measures; SGP excluded from all four inventories. |
| GDPPOP with `USD_PPP_PS` | `.A.GDPPOP._T.USD_PPP_PS.V.N._Z.PPP` | HTTP 200 first try | No fallback needed (USD_PPP_PS is valid). |

Note: `USD_PPP_WR` **is** a defined code in CL_UNIT_MEASURE(1.25) ("US dollars per worker, PPP
converted") — it is codelist-valid but data-empty for GDPEMP in DSD_PDB@DF_PDB; the populated
unit for GDPEMP is `USD_PPP_PS` (same code as GDPPOP).

---

## PART 2 — World Bank WDI API v2 (CC BY 4.0)

### 2.1 Fetch script

`research/chapter02/scripts/fetch-worldbank.sh` (bash, `set -euo pipefail`, `--max-time 30` on
every curl) — structure/comments modeled on the chapter 01 script; `OUT` changed to
`research/chapter02/raw/worldbank`; comparison pagination is meta-driven (`meta.pages` read
from page 1, loop emits `-pN` suffixed files exactly like ch01's fixed 2..3 loop; all three
indicators reported `pages=3, total=858` as in ch01). Executed 2026-10-25; all saves echoed.

### 2.2 Access log (exact URLs — all HTTP 200; status re-verified per URL)

`BASE = https://api.worldbank.org/v2`; `C13 = JPN;KOR;SGP;AUS;NZL;DEU;FRA;SWE;NLD;CAN;GBR;USA;ITA`

| File (raw/worldbank/) | Bytes | Exact URL |
|-----------------------|-------|-----------|
| `JPN-NY.GDP.MKTP.CD.json` | 13,613 | `${BASE}/country/JPN/indicator/NY.GDP.MKTP.CD?format=json&per_page=200` |
| `JPN-NY.GDP.MKTP.KD.ZG.json` | 14,090 | `${BASE}/country/JPN/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=200` |
| `JPN-NY.GDP.PCAP.PP.CD.json` | 15,300 | `${BASE}/country/JPN/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=200` |
| `JPN-NY.GDP.PCAP.PP.KD.json` | 15,700 | `${BASE}/country/JPN/indicator/NY.GDP.PCAP.PP.KD?format=json&per_page=200` |
| `JPN-NV.IND.MANF.ZS.json` | 14,515 | `${BASE}/country/JPN/indicator/NV.IND.MANF.ZS?format=json&per_page=200` |
| `JPN-NE.GDI.TOTL.ZS.json` | 14,607 | `${BASE}/country/JPN/indicator/NE.GDI.TOTL.ZS?format=json&per_page=200` |
| `JPN-NE.EXP.GNFS.ZS.json` | 15,004 | `${BASE}/country/JPN/indicator/NE.EXP.GNFS.ZS?format=json&per_page=200` |
| `JPN-NE.IMP.GNFS.ZS.json` | 15,002 | `${BASE}/country/JPN/indicator/NE.IMP.GNFS.ZS?format=json&per_page=200` |
| `COMPARE-NY.GDP.MKTP.KD.ZG.json` | 64,529 | `${BASE}/country/${C13}/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=300` |
| `COMPARE-NY.GDP.MKTP.KD.ZG-p2.json` | 64,778 | `…&page=2` (same base) |
| `COMPARE-NY.GDP.MKTP.KD.ZG-p3.json` | 55,988 | `…&page=3` (same base) |
| `COMPARE-NY.GDP.PCAP.PP.CD.json` | 70,286 | `${BASE}/country/${C13}/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=300` |
| `COMPARE-NY.GDP.PCAP.PP.CD-p2.json` | 70,169 | `…&page=2` (same base) |
| `COMPARE-NY.GDP.PCAP.PP.CD-p3.json` | 60,749 | `…&page=3` (same base) |
| `COMPARE-NV.IND.MANF.ZS.json` | 67,204 | `${BASE}/country/${C13}/indicator/NV.IND.MANF.ZS?format=json&per_page=300` |
| `COMPARE-NV.IND.MANF.ZS-p2.json` | 67,393 | `…&page=2` (same base) |
| `COMPARE-NV.IND.MANF.ZS-p3.json` | 58,484 | `…&page=3` (same base) |
| `META-NY.GDP.MKTP.KD.ZG.json` | 909 | `${BASE}/indicator/NY.GDP.MKTP.KD.ZG?format=json` |
| `META-NY.GDP.PCAP.PP.CD.json` | 2,659 | `${BASE}/indicator/NY.GDP.PCAP.PP.CD?format=json` |
| `META-NV.IND.MANF.ZS.json` | 1,092 | `${BASE}/indicator/NV.IND.MANF.ZS?format=json` |

Total: 20 files, 702,071 bytes. Every file parsed as a valid JSON `[ meta, data ]` array
(verification command from the task spec run per file).

### 2.3 sha256 checksums (raw/worldbank/)

```
7e1a9b59345626c685b536970a06908b5515110ee919dfc1b205c5923c9d226a  COMPARE-NV.IND.MANF.ZS-p2.json
77972e5c755658d4d8141326a9b5e1c08740473196062f8fa3b66313615759cd  COMPARE-NV.IND.MANF.ZS-p3.json
82f939217d4eb9181389978fe107ca779f342b2ab8ddd89d5685dc8d2da79cb3  COMPARE-NV.IND.MANF.ZS.json
8aeaa9c4f444f1aba9f27b467164e436e13d03f9f1b4ce954fb66c4eddc2c14f  COMPARE-NY.GDP.MKTP.KD.ZG-p2.json
eb588d90f8f3e79cd873d67e8c42445dccf94aaa1e1553f3bf68a487740f0e4a  COMPARE-NY.GDP.MKTP.KD.ZG-p3.json
9b9ba55f524186622cd90d121e4cc24b296bacc6e619d573048101711219db91  COMPARE-NY.GDP.MKTP.KD.ZG.json
e5806bb626fffe2fc247d113defb491d577ec34684b840cfc07e4cb699072448  COMPARE-NY.GDP.PCAP.PP.CD-p2.json
f03c3a3302f4bcb2f8d5b0a5315244582f57f020da69e6f921d4a4e3a1a20b45  COMPARE-NY.GDP.PCAP.PP.CD-p3.json
a76b8b8f041ba3acd9ef90f5c4754e562c2dd175991aff9092e11d3005889de1  COMPARE-NY.GDP.PCAP.PP.CD.json
1fda6bc12d1fc90dc11cf03b677b7623dcfea61d13e9a099df9aa68f465c5998  JPN-NE.EXP.GNFS.ZS.json
81673b12680ba7e0be1afef2add7fd0d92cf5a00e93cd36ec63c203c8621da82  JPN-NE.GDI.TOTL.ZS.json
a0fab1fd6d7785fa511829f0408a6788386000dc415a985f8259aa0f154a2497  JPN-NE.IMP.GNFS.ZS.json
ea13267e3b72a6a3bc90d01f2b4cd43f8411b993e52b875bbabc19931334422f  JPN-NV.IND.MANF.ZS.json
667691a8aa85d2f7cfe6ebe359a20127ce4490b6f0d9557a7300ba9c2d02e72e  JPN-NY.GDP.MKTP.CD.json
5dfca06556b3d09797f38eeea9c374442c9be36732118438c0d6c2110247a7fb  JPN-NY.GDP.MKTP.KD.ZG.json
985ca8c164b45d6135cea8d185cb18d5d3ac3e15214ca8f07220c885ea868bbc  JPN-NY.GDP.PCAP.PP.CD.json
707c0f3373943afc1ed9081b39b073a0d70da49d94d14a1d2a8033177099260a  JPN-NY.GDP.PCAP.PP.KD.json
54b1274c98563e9ffc9c80f402b8986a1433d3ca1bc9ce54b6922ce7749bb0a8  META-NV.IND.MANF.ZS.json
ed7703d841d4dde2d1cb858f0dd53229fe3e841f72abb17dbc8c950ad20c88ce  META-NY.GDP.MKTP.KD.ZG.json
a95c4834552a80e2c6b755c22e887d401d7930c2b97453f76fc063108a4a1a8d  META-NY.GDP.PCAP.PP.CD.json
```

### 2.4 Per-file verification (WDI vintage, record counts, JPN coverage)

**WDI vintage (`meta.lastupdated`) = `2026-10-08` on every data file** (JPN + all 9 COMPARE
pages × 3 indicators) — identical to the chapter 01 vintage, so both chapters draw from the
same WDI release. META endpoint responses carry no `lastupdated` field (only
page/pages/per_page/total), as in ch01.

Part 1 — Japan full history (`per_page=200`, single page, `total=66` rows = 1960–2025):

| Indicator (file) | lastupdated | Records | Non-null years | Latest non-null year | Non-null count |
|---|---|---|---|---|---|
| NY.GDP.MKTP.CD (GDP, current US$) | 2026-10-08 | 66 | 1960–2025 | **2025** | 66 |
| NY.GDP.MKTP.KD.ZG (GDP growth, ann. %) | 2026-10-08 | 66 | 1961–2025 | **2025** | 65 |
| NY.GDP.PCAP.PP.CD (GDP p.c., PPP curr. int$) | 2026-10-08 | 66 | 1990–2025 | **2025** | 36 |
| NY.GDP.PCAP.PP.KD (GDP p.c., PPP const. int$) | 2026-10-08 | 66 | 1990–2025 | **2025** | 36 |
| NV.IND.MANF.ZS (Manufacturing VA, % GDP) | 2026-10-08 | 66 | 1994–2024 | **2024** | 31 |
| NE.GDI.TOTL.ZS (Gross capital formation, % GDP) | 2026-10-08 | 66 | 1970–2024 | **2024** | 55 |
| NE.EXP.GNFS.ZS (Exports g&s, % GDP) | 2026-10-08 | 66 | 1970–2024 | **2024** | 55 |
| NE.IMP.GNFS.ZS (Imports g&s, % GDP) | 2026-10-08 | 66 | 1970–2024 | **2024** | 55 |

(Coverage facts only — sparsity of the PPP per-capita series before 1990 and of the
manufacturing-share series before 1994 is recorded for extraction planning, not interpreted.)

Part 2 — International comparison (`per_page=300`; each indicator: `total=858`, `pages=3`;
page 1 = 300 rows (AU,CA,DE,FR,GB), page 2 = 300 rows (GB,IT,JP,KR,NL,NZ), page 3 = 258 rows
(NZ,SE,SG,US); combined = all 13 economies):

| Indicator | lastupdated (all 3 pages) | Combined non-null years | Economies |
|---|---|---|---|
| NY.GDP.MKTP.KD.ZG | 2026-10-08 | 1961–2025 | 13/13 |
| NY.GDP.PCAP.PP.CD | 2026-10-08 | 1990–2025 | 13/13 |
| NV.IND.MANF.ZS | 2026-10-08 | 1960–2025 | 13/13 |

Page-1 incompleteness matches the ch01 note (page 1 alone covers only AUS..GBR) — all pages
were fetched; the -p2/-p3 files are present and parsed.

Part 3 — Indicator metadata (`META-<CODE>.json`; `total=1` each; no lastupdated field):

| File | Indicator name | Source |
|---|---|---|
| `META-NY.GDP.MKTP.KD.ZG.json` | "GDP growth (annual %)" | World Development Indicators (source id 2) |
| `META-NY.GDP.PCAP.PP.CD.json` | "GDP per capita, PPP (current international $)" | World Development Indicators (source id 2) |
| `META-NV.IND.MANF.ZS.json` | "Manufacturing, value added (% of GDP)" | World Development Indicators (source id 2) |

Each META record also carries `unit`, `sourceNote`, `sourceOrganization`, `topics`
(attribution strings for the provenance/licensing layer).

### 2.5 Failed patterns / problems (Part 2)

- None. All 20 requests returned HTTP 200 and valid `[ meta, data ]` JSON; page counts (3)
  and totals (858 / 66) matched expectations from chapter 01 exactly.
- Structural note (not a failure): the indicator-metadata endpoint (`/indicator/<CODE>`)
  never includes `meta.lastupdated`; the 2026-10-08 vintage is documented from the data files.

---

## Licensing

- **OECD SDMX PDB**: OECD data is licensed CC BY 4.0 (per OECD Terms & Conditions);
  attribution "OECD Productivity Statistics (Productivity database), retrieved via
  SDMX API on 2026-10-25". Dataflow evidence file committed as structure-definition proof.
- **World Bank WDI**: CC BY 4.0, source "World Development Indicators" (source id 2),
  vintage 2026-10-08 — same convention as `research/DATA-LICENSES.md` (ch01 WB JSONs
  committed under CC BY 4.0; ch02 files follow the same rule).

## Inventory totals

- `raw/oecd/`: 5 files, 3,948,417 bytes (4 CSV + 1 dataflow JSON).
- `raw/worldbank/`: 20 files, 702,071 bytes.
- `scripts/fetch-worldbank.sh`: 1 file, 88 lines.
- All checksums recorded above (§1.2, §2.3, script sha256 in header).
