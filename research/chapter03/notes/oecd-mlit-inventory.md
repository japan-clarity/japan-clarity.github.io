# OECD AHPI & MLIT — Acquisition Inventory (Chapter 03: Housing & Cost of Living)

- **Task ID**: 4-c (research/download/inventory subagent)
- **Access date**: 2026-10-26 (UTC, sandbox clock)
- **Scope**: OECD Analytical House Price Statistics (SDMX
  `DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES` v1.0) + MLIT (国土交通省) housing starts
  (建築着工統計調査 令和7年計 + 時系列表) and 地価公示 2026 (令和8年地価公示).
  This file records WHAT was downloaded and verified. It deliberately contains
  **no interpretation of statistical values** (values live in
  `notes/oecd-mlit-summary.md`).
- **Raw file roots**: `research/chapter03/raw/oecd/`, `research/chapter03/raw/mlit/`
- **Fetch script (Part 3)**: `research/chapter03/scripts/fetch-oecd-mlit.sh`
  (modeled on `research/chapter02/scripts/fetch-worldbank.sh`; 196 lines,
  sha256 `752254b146bda65d148c666c31852478ec88d37505913cfd029bc8f585b8e25f`).
- **Requested OECD country set (12 + ESP)**: JPN KOR USA GBR DEU FRA AUS CAN NZL
  SWE NLD ITA + ESP (SDMX key OR-syntax:
  `JPN+KOR+USA+GBR+DEU+FRA+AUS+CAN+NZL+SWE+NLD+ITA+ESP`). ESP was trivially
  available in the same call and was kept (13 areas total).

---

## PART 1 — OECD SDMX: Analytical House Price Statistics (DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES, v1.0)

### 1.1 Dataflow discovery

`https://sdmx.oecd.org/public/rest/dataflow/all?references=none` (Accept:
`application/vnd.sdmx.structure+json;version=2.0.0`) → HTTP 200, 10,447,974
bytes, 1,552 dataflows (fetched to a temp file and filtered; not archived).
The only match for "Analytical house price" is:

- **`OECD.ECO.MPD , DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES , v1.0 ,
  "Analytical house prices indicators"`**

(Neither candidate guess `DSD_HPI@DF_HPI` nor `DSD_AHPI@DF_AHPI` exists as an
id; the live dataflow is `DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES` under agency
OECD.ECO.MPD. Related but different dataflows exist — `DSD_RHPI@DF_RHPI_ALL`
"National and regional house price indices" (OECD.SDD.TPS) — not used.)

### 1.2 Access log (exact URLs)

OECD data calls: `curl -sS --max-time 180 "<URL>" -o <file>` (no UA needed;
`format=csvfilewithlabels` governs). Dataflow-def call used the SDMX-JSON
structure Accept header. 403 diagnostic used `--max-time 30 -L` + browser UA.

| # | File (raw/oecd/) | HTTP | Bytes | Exact URL |
|---|------------------|------|-------|-----------|
| 1 | `oecd-hpi-ydh-ptoincome-idx2015.csv` | 200 | 176,764 | `https://sdmx.oecd.org/public/rest/data/OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0/JPN+KOR+USA+GBR+DEU+FRA+AUS+CAN+NZL+SWE+NLD+ITA+ESP.A.HPI_YDH.IX?format=csvfilewithlabels` |
| 2 | `oecd-rhp-realhouseprice-idx2015.csv` | 200 | 192,813 | `https://sdmx.oecd.org/public/rest/data/OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0/JPN+KOR+USA+GBR+DEU+FRA+AUS+CAN+NZL+SWE+NLD+ITA+ESP.A.RHP.IX?format=csvfilewithlabels` |
| 3 | `oecd-jpn-all-measures-annual.csv` | 200 | 118,999 | `https://sdmx.oecd.org/public/rest/data/OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0/JPN.A..?format=csvfilewithlabels` (wildcard probe: all MEASURE + all UNIT_MEASURE) |
| 4 | `oecd-jpn-hpiydh-probe.csv` | 200 | 17,785 | `https://sdmx.oecd.org/public/rest/data/OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0/JPN.A.HPI_YDH.?format=csvfilewithlabels` (unit wildcard — proves IX is the only unit for HPI_YDH annual) |
| 5 | `oecd-jpn-hpiydh-quarterly-probe.csv` | 200 | 71,832 | `https://sdmx.oecd.org/public/rest/data/OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0/JPN.Q.HPI_YDH.IX?format=csvfilewithlabels` (quarterly availability probe) |
| 6 | `oecd-dataflow-def.json` | 200 | 1,625,528 | `https://sdmx.oecd.org/public/rest/dataflow/OECD.ECO.MPD/DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES/1.0?references=all` (Accept: `application/vnd.sdmx.structure+json;version=2.0.0`) |
| 7 | `oecd-data-reuse-terms.html` | **403** | 5,728 | `https://www.oecd.org/en/about/legal/oecd-data-reuse-terms.html` (browser UA, `-L`) — Cloudflare "Just a moment…" challenge page; see §Licensing |

### 1.3 sha256 checksums (raw/oecd/)

```
36c215dd6ef9f4b1391045858f8febb25538f3bdda56c807699b5174be321f22  oecd-data-reuse-terms.html
943f4b83b2dd2787a9c5f5609476bf452f17aa2c9dbe363934907d78ef1c6b5f  oecd-dataflow-def.json
a535168bb9e182c41839f9437697b1412bac2f71245183731c136789c029ba7f  oecd-hpi-ydh-ptoincome-idx2015.csv
001ebdfc2c3fe0e8e0425633be5cc78e93bf154d906690709712bcaa6aa478be  oecd-jpn-all-measures-annual.csv
70709c913d9eedeb616cdb9e48feef34817bee738a3141ec282e3633259fbe5d  oecd-jpn-hpiydh-probe.csv
a34c17c57c4e84a5d98ac41a761ed43534611912397b89560cdb54e02cda8900  oecd-jpn-hpiydh-quarterly-probe.csv
62b1a249abeba8cb00d3528aec91854a34b566fda5e57f65c097a403af14497a  oecd-rhp-realhouseprice-idx2015.csv
```

### 1.4 Dataflow definition evidence (`oecd-dataflow-def.json`)

- Dataflow: **`DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES`**, version **1.0**, agency
  **OECD.ECO.MPD**. Name: "Analytical house prices indicators" (en).
- Structure message `meta.prepared` = **`2026-10-26T04:28:36Z`**, SDMX-JSON
  structure schema 2.0.0.
- DSD: `OECD.ECO.MPD:DSD_AN_HOUSE_PRICES(1.0)` "DSD for analytical house
  prices indicators". **Dimension order (dimensionList positions 1–4)**:
  1. `REF_AREA` → codelist `OECD:CL_AREA(1.0)` (447 codes)
  2. `FREQ` → `SDMX:CL_FREQ(2.1)` (34 codes)
  3. `MEASURE` → `OECD.ECO.MPD:CL_MEASURE_HOU(1.0)` (7 codes)
  4. `UNIT_MEASURE` → `OECD:CL_UNIT_MEASURE(1.11)` (841 codes)
- **There is NO TRANSFORMATION dimension and no PRICE_BASE dimension in this
  DSD** (unlike Ch02's DSD_PDB). The index-ness is carried by
  `UNIT_MEASURE=IX` and the base period by the `BASE_PER` attribute:
  - Attributes: `OBS_STATUS` (SDMX:CL_OBS_STATUS 2.2), `UNIT_MULT`
    (CL_UNIT_MULT 1.1), `ADJUSTMENT` (OECD:CL_ADJUSTMENT 1.0), `DECIMALS`
    (CL_DECIMALS 1.0), **`BASE_PER` (free text — no codelist)**.
- Codelists delivered in the file (8 total): CL_AREA (447),
  CL_UNIT_MEASURE (841), CL_MEASURE_HOU (7), CL_ADJUSTMENT (17), CL_FREQ (34),
  CL_OBS_STATUS (20), CL_DECIMALS (16), CL_UNIT_MULT (31).
- Key codelist entries (evidence for the codes used in our queries):
  - `CL_MEASURE_HOU(1.0)` — all 7 codes:
    `RHP` = Real house price indices; `HPI` = Nominal house price indices;
    `RPI` = Rent prices; `HPI_RPI` = Price to rent ratio;
    `HPI_RPI_AVG` = Standardised price-rent ratio;
    **`HPI_YDH` = Price to income ratio**;
    `HPI_YDH_AVG` = Standardised price-income ratio.
  - `CL_UNIT_MEASURE(1.11)`: **`IX` = "Index"**; `PT_AVG_L_TERM` =
    "Percentage of long term average". (No percentage-change unit appears
    in the JPN wildcard probe — see 1.6.)
  - `CL_FREQ`: `A` = Annual; `Q` = Quarterly.
  - `CL_ADJUSTMENT(1.0)`: **`S` = "Seasonally adjusted, not calendar
    adjusted"**; `N` = "Neither seasonally adjusted nor calendar adjusted";
    `_Z` = Not applicable.
  - `CL_AREA(1.0)`: JPN Japan, KOR Korea, USA United States, GBR United
    Kingdom, DEU Germany, FRA France, AUS Australia, CAN Canada, NZL New
    Zealand, SWE Sweden, NLD Netherlands, ITA Italy, ESP Spain — all 13
    present in the codelist AND all 13 return data (see 1.5).
  - `CL_OBS_STATUS`: `A` = Normal value. `CL_UNIT_MULT`: `0` = Units.
    `CL_DECIMALS`: `1` = One.
- Dataflow description (first sentence, HTML stripped): "Residential Property
  Prices Indices (RPPIs) – also named House price indices (HPIs), are index
  numbers that measure the prices of residential properties over time."

### 1.5 Per-CSV inventory (all: valid `STRUCTURE,` header, SDMX-CSV with labels)

Common structure (25 columns): `STRUCTURE, STRUCTURE_ID, STRUCTURE_NAME,
ACTION, REF_AREA, Reference area, FREQ, Frequency of observation, MEASURE,
Measure, UNIT_MEASURE, Unit of measure, TIME_PERIOD, Time period, OBS_VALUE,
Observation value, OBS_STATUS, Observation status, UNIT_MULT, Unit multiplier,
ADJUSTMENT, Adjustment, DECIMALS, Decimals, BASE_PER, Base period`.
`STRUCTURE_ID` on every row: `OECD.ECO.MPD:DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES(1.0)`;
`STRUCTURE_NAME`: "Analytical house prices indicators". Every row:
`STRUCTURE` = `DATAFLOW`, `ACTION` = `I`.

**1. `oecd-hpi-ydh-ptoincome-idx2015.csv`** — MEASURE=**HPI_YDH** ("Price to
income ratio"), UNIT_MEASURE=**IX** ("Index"), FREQ=A, ADJUSTMENT=S,
DECIMALS=1, OBS_STATUS=A, UNIT_MULT=0, **BASE_PER=`2015` on every row**.
660 data rows, 13 areas, **no empty OBS_VALUE**:

| Area | Years | Obs | | Area | Years | Obs |
|------|-------|-----|-|------|-------|-----|
| AUS | 1970–2025 | 56 | | KOR | 1986–2025 | 40 |
| CAN | 1970–2025 | 56 | | NLD | 1980–2025 | 46 |
| DEU | 1980–2025 | 46 | | NZL | 1986–2025 | 40 |
| ESP | 1971–2025 | 55 | | SWE | 1970–2025 | 56 |
| FRA | 1978–2025 | 48 | | USA | 1970–2025 | 56 |
| GBR | 1987–2025 | 39 | | **JPN** | **1960–2025** | **66** |
| ITA | 1970–2025 | 56 | | | | |

**2015 = `100` for all 13 areas (verified programmatically — base-year
confirmation).**

**2. `oecd-rhp-realhouseprice-idx2015.csv`** — MEASURE=**RHP** ("Real house
price indices"), UNIT_MEASURE=IX, FREQ=A, ADJUSTMENT=S, DECIMALS=1,
BASE_PER=`2015` on every row. 722 data rows, 13 areas, no empty OBS_VALUE:

| Area | Years | Obs | | Area | Years | Obs |
|------|-------|-----|-|------|-------|-----|
| AUS | 1970–2025 | 56 | | KOR | 1986–2025 | 40 |
| CAN | 1970–2025 | 56 | | NLD | 1970–2025 | 56 |
| DEU | 1970–2025 | 56 | | NZL | 1970–2025 | 56 |
| ESP | 1971–2025 | 55 | | SWE | 1970–2025 | 56 |
| FRA | 1970–2025 | 56 | | USA | 1970–2025 | 56 |
| GBR | 1969–2025 | 57 | | **JPN** | **1960–2025** | **66** |
| ITA | 1970–2025 | 56 | | | | |

**2015 = `100` for all 13 areas (verified programmatically).**

**3. `oecd-jpn-all-measures-annual.csv`** (wildcard probe `JPN.A..`) — 432
rows, 7 measure/unit combos for JPN annual (this file is the dimension-value
distinction evidence):

| MEASURE | Measure | UNIT_MEASURE | Unit of measure | ADJ | DEC | BASE_PER | Years | Obs |
|---|---|---|---|---|---|---|---|---|
| HPI | Nominal house price indices | IX | Index | S | 1 | `2015` | 1960–2025 | 66 |
| HPI_RPI | Price to rent ratio | IX | Index | S | 1 | `2015` | 1970–2025 | 56 |
| HPI_RPI_AVG | Standardised price-rent ratio | PT_AVG_L_TERM | Percentage of long term average | S | 1 | *(empty)* | 1970–2025 | 56 |
| HPI_YDH | Price to income ratio | IX | Index | S | 1 | `2015` | 1960–2025 | 66 |
| HPI_YDH_AVG | Standardised price-income ratio | PT_AVG_L_TERM | Percentage of long term average | S | 1 | *(empty)* | 1960–2025 | 66 |
| RHP | Real house price indices | IX | Index | S | 1 | `2015` | 1960–2025 | 66 |
| RPI | Rent prices | IX | Index | S | 1 | `2015` | 1970–2025 | 56 |

**4. `oecd-jpn-hpiydh-probe.csv`** (`JPN.A.HPI_YDH.`) — 66 rows, only
UNIT_MEASURE=`IX` present (HPI_YDH annual has exactly one unit).

**5. `oecd-jpn-hpiydh-quarterly-probe.csv`** (`JPN.Q.HPI_YDH.IX`) — 264 rows,
FREQ=Q, TIME_PERIOD format `YYYY-Qn`, BASE_PER=`2015`; JPN quarterly
HPI_YDH exists (first/last row `2025-Q2`/`2025-Q1`). Deliverable files use
annual (FREQ=A) only — quarterly is never mixed in.

### 1.6 Failed query patterns and diagnostics

| Attempt | Result | Resolution |
|---|---|---|
| Task-spec candidate dataflow `OECD.ECO,DSD_HPI@DF_HPI` | Not present in the 1,552-dataflow list | Replaced by verified `OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES` |
| Task-spec candidate `DSD_AHPI@DF_AHPI` / legacy "PRSC" | Not present | Same as above |
| `https://www.oecd.org/en/about/legal/oecd-data-reuse-terms.html` (reuse-terms page, browser UA) | **HTTP 403**, 5,728 B Cloudflare challenge ("Just a moment…") | Terms recorded via the established project convention instead (§Licensing); 403 body archived as `oecd-data-reuse-terms.html` |
| `https://www.oecd.org/terms-and-conditions/` | **HTTP 403**, 5,647 B (same Cloudflare block) | Not archived; recorded here |
| `https://www.oecd.org/en/data/datasets/analytical-house-price-indices.html` (dataset portal page) | **HTTP 403**, 5,783 B | Dataset identity established via SDMX dataflow list instead (§1.1) |

No 404/NoResultsFound patterns occurred on the SDMX data endpoint: all five
data queries returned HTTP 200 on the first attempt with the
`REF_AREA.FREQ.MEASURE.UNIT_MEASURE` key order above.

---

## PART 2 — MLIT (国土交通省): housing starts + 地価公示 2026

All MLIT calls: `curl -sS --max-time 30 -L "<URL>" -H "User-Agent: <Chrome
130 desktop UA>" -o <file>`. The two entry URLs given in the task spec are
dead (HTTP 404, site reorganisation); the working entry chain is
`/statistics/` → `/statistics/details/index.html` → category page
`t-other-2_tk_000346.html` (住宅・建築) / `t-other-2_tk_000345.html` (土地・不動産).

### 2.1 Access log (exact URLs — all status re-verified per URL at fetch time)

| # | File (raw/mlit/) | HTTP | Bytes | Exact URL |
|---|------------------|------|-------|-----------|
| 1 | `mlit-tocjyutaku.html` | **404** | 234 | `https://www.mlit.go.jp/statistics/tocjyutaku.html` (task-spec entry, dead) |
| 2 | `mlit-jutaku2-4-404.html` | **404** | 234 | `https://www.mlit.go.jp/jutaku/jutaku2-4.html` (task-spec entry, dead) |
| 3 | `mlit-statistics-root.html` | 200 | 5,926 | `https://www.mlit.go.jp/statistics/` |
| 4 | `mlit-statistics-details-index.html` | 200 | 15,912 | `https://www.mlit.go.jp/statistics/details/index.html` |
| 5 | `mlit-statistics-housing-category.html` | 200 | 10,212 | `https://www.mlit.go.jp/statistics/details/t-other-2_tk_000346.html` (住宅・建築 category) |
| 6 | `mlit-kenchaku-chuko-main.html` | 200 | 14,251 | `https://www.mlit.go.jp/statistics/details/t-other-2_tk_000214.html` (建築動態統計調査 main page, incl. publication schedule) |
| 7 | `mlit-press-nenkei.html` | 200 | 13,409 | `https://www.mlit.go.jp/report/press/joho04_hh_001350.html` (報道発表資料 建築着工統計調査報告（令和7年計分）, dated 令和8年1月30日) |
| 8 | `mlit-press-kencha25-2025annual.pdf` | 200 | 3,738,174 | `https://www.mlit.go.jp/report/press/content/kencha25.pdf` (記者発表資料 令和7年計分, PDF) |
| 9 | `mlit-press-publication25-2025annual.xls` | 200 | 374,272 | `https://www.mlit.go.jp/report/press/content/publication25.xls` (記者発表資料 令和7年計分, Excel; sheets 資料7-1…8-1 + 総括表) |
| 10 | `mlit-timeseries-page.html` | 200 | 13,847 | `https://www.mlit.go.jp/sogoseisaku/jouhouka/sosei_jouhouka_tk4_000002.html` (時系列一覧; 年計 令和7年分, 令和8年1月30日 更新) |
| 11 | `mlit-timeseries-annual-byusage.xls` | 200 | 38,400 | `https://www.mlit.go.jp/sogoseisaku/jouhouka/content/001979030.xls` (【住宅】利用関係別 時系列 — annual 戸数 1948–2025) |
| 12 | `mlit-timeseries-monthly-housing-bldg.xls` | 200 | 588,288 | `https://www.mlit.go.jp/sogoseisaku/jouhouka/content/jyuu_ken.xls` (【住宅・建築物】時系列 — monthly, sheets jyuu/ken) |
| 13 | `mlit-statistics-land-category.html` | 200 | 7,919 | `https://www.mlit.go.jp/statistics/details/t-other-2_tk_000345.html` (土地・不動産 category) |
| 14 | `mlit-chika-koji-page.html` | 200 | 25,008 | `https://www.mlit.go.jp/totikensangyo/totikensangyo_fr4_000043.html` (地価公示 main page) |
| 15 | `mlit-kojichika2026-gaiyo.html` | 200 | 110,578 | `https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/tochi_fudousan_kensetsugyo_fr4_000001_00324.html` (令和８年地価公示 overview) |
| 16 | `mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls` | 200 | 27,941,376 | `https://www.mlit.go.jp/totikensangyo/content/001989457.xls` (変動率及び平均価格の時系列推移表（令和8年地価公示）; sheets 価格・変動率推移表 / 変動率推移表 / 価格推移表 / 留意事項) |
| 17 | `mlit-link-copyright.html` | 200 | 10,457 | `https://www.mlit.go.jp/link.html` (リンク・著作権・免責事項 — PDL1.0 terms) |

### 2.2 sha256 checksums (raw/mlit/)

```
5687da99432bf863ffb9d2b9edac60861dfc8b6e5d9e3f5dc1c916af12c8942a  mlit-chika-koji-page.html
81f021fb8ba2f00e93cd02dcd712e93e2f941d39fb6af23ca49d2eaed6898896  mlit-jutaku2-4-404.html
61e994865797dc496e3026e345ab63a499a59a621da0ed664178f6ed3f27b648  mlit-kenchaku-chuko-main.html
24783c739dddcf0d8c9a87a2ae81cecc580ed8a844e67aae66eeef674723af2f  mlit-kojichika2026-gaiyo.html
9b6b38399e9e5361545baf3f3dd3307e044dc10f643cefe9a7ea6b2d19a222b9  mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls
8d73d659e9fa5f64a24499428e8a8599b160a954cb5ffb2aacac898ab19f200b  mlit-link-copyright.html
dcef11d5fe780ee2a48c09e9d4e9f7faa4544fdeac9ed78733caef17dbfc186d  mlit-press-kencha25-2025annual.pdf
fd29ae95b057eed3ae022aa472c3100852b957860f37e69e5a58b804f8a06548  mlit-press-nenkei.html
7f94632f7932df5046bd9700b2ec8f5453e51fd9e98874e6b255d53dae67a68b  mlit-press-publication25-2025annual.xls
739f48a880f3645b332012e60df087115f79842af8e2a492a121dd0f542fd571  mlit-statistics-details-index.html
9de102ac261e41588cf5656542c3cbff652526fac95841b7edd38db347b37e61  mlit-statistics-housing-category.html
cc0764e9d7007c6633da4c6feba2ca49618638025a2a18d6ec349770ea98a238  mlit-statistics-land-category.html
1968fbaf1b6155a21412fdfa6612261a852bc3f945a2289944c06043b4f04880  mlit-statistics-root.html
d741fb817e9347bc70858db6b8a3fd1d06ab6bfe4a307bae018fe2461650df3b  mlit-timeseries-annual-byusage.xls
a608c1c3ea63407666af9bb817ea3a88f1a9074fd29615626062f21ed952313a  mlit-timeseries-monthly-housing-bldg.xls
a135a49f43edf565e9ea0863235d1e522e2c00c6635d7659212f6f5598964406  mlit-timeseries-page.html
81f021fb8ba2f00e93cd02dcd712e93e2f941d39fb6af23ca49d2eaed6898896  mlit-tocjyutaku.html
```

### 2.3 Per-file verification (structure, sheets, coverage)

- **`mlit-timeseries-annual-byusage.xls`** (long history): 1 sheet 「年計」,
  92 rows × 15 cols. Title rows: 「利用関係別－新設住宅の戸数、床面積の合計」
  「（時系列・新設住宅）」; columns 年 | 総計(戸数,床面積) | 持家 | 貸家 |
  給与住宅 | 分譲住宅(戸数,床面積; うちマンション/うち一戸建). Data rows:
  **昭和23年 (1948) through 令和7年 (2025), 78 annual observations**, all
  totals non-empty. Footnotes (rows 86–91, verbatim): ※１ 昭和25年以前の戸数は
  工事戸数…26年以降については新設戸数; ※２ 昭和48年から沖縄県分を含む;
  ※３ 分譲マンションについては昭和60年以降から集計; 分譲一戸建は昭和63年以降.
- **`mlit-press-publication25-2025annual.xls`**: 8 sheets (資料7-1 … 資料8-1,
  総括表). 資料7-1 「新設住宅着工・利用関係別戸数，床面積」（単位：戸，千㎡，％）
  holds the annual series 昭和58年計 (1983) – 令和7年 (2025) incl. 前年比 columns.
- **`mlit-timeseries-monthly-housing-bldg.xls`**: sheets 「jyuu」「ken」; jyuu =
  monthly 新設住宅着工：利用関係別戸数，床面積 (年代計 rows from 平成6年度;
  row 787 note: ※１３ヵ月以前のデータを非表示; 季節調整値は毎年12月分までの
  データで過去に遡って再計算). Monthly data NOT used for the annual figures
  (annual taken from the 年計 files only).
- **`mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls`** (令和8年
  地価公示): sheet 「価格推移表」 18,979 rows × 55 cols = 平均価格 (円/㎡,
  総地点) by area-code/area-name/用途 (住宅/宅見/商業/準工/工業/調区/全用途)
  for 昭和50年 (1975) – 令和8年 (2026); sheet 「留意事項」 defines 平均価格
  (per-sqm prices summed over points ÷ number of points, rounded to ¥100) and
  変動率 (継続地点 year-on-year, %).
- HTML pages: all parse as MLIT CMS pages (title fragments recorded in §2.1);
  both 404 bodies are the generic MLIT 234-byte 404 page.

---

## PART 3 — Fetch script

`research/chapter03/scripts/fetch-oecd-mlit.sh` (bash, `set -euo pipefail`):
OECD section uses `--max-time 180` (SDMX) and includes the dataflow-discovery
call (output `/tmp/oecd-all-dataflows.json`), the dataflow-definition call
(Accept header), the two deliverable CSVs, three diagnostic probes, and the
403 reuse-terms attempt. MLIT section uses `--max-time 30 -L` + desktop-Chrome
UA on every call, in discovery order (§2.1 numbering). `bash -n` clean;
196 lines; sha256 `752254b146bda65d148c666c31852478ec88d37505913cfd029bc8f585b8e25f`.

---

## Licensing

- **OECD SDMX (Analytical house prices indicators)**: The reuse-terms page
  `https://www.oecd.org/en/about/legal/oecd-data-reuse-terms.html` could NOT be
  fetched from this sandbox — **HTTP 403 (Cloudflare "Just a moment…"
  challenge, 5,728 bytes, archived as `raw/oecd/oecd-data-reuse-terms.html`;
  `…/terms-and-conditions/` equally 403)**. Therefore no verbatim quote of the
  current terms page is available from this session. Per the project's
  established convention (`research/DATA-LICENSES.md`, Chapter 02 inventory §
  Licensing: "OECD data is licensed CC BY 4.0 (per OECD Terms & Conditions)"),
  the Chapter 03 raw OECD files follow the same treatment: reuse with
  attribution — "Source: OECD Analytical House Price Statistics (dataflow
  OECD.ECO.MPD:DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES v1.0), retrieved via SDMX
  API on 2026-10-26". The dataflow-definition file is committed as
  structure-definition proof.
- **MLIT (国土交通省)**: `https://www.mlit.go.jp/link.html` (archived:
  `raw/mlit/mlit-link-copyright.html`) — verbatim: 「国土交通省ウェブサイトで
  掲載・発信している情報（以下「コンテンツ」といいます。）の著作権は、特記
  されていない限り国土交通省に帰属し、権利表記の記載がない限り「公共データ
  利用規約（第1.0版）」（PDL1.0）に準拠した利用条件の下で、利用することが
  できます。」 Attribution example given on the same page: （出典記載例）
  「出典：国土交通省ウェブサイト（当該ページのURL）」／「『○○調査』
  （国土交通省）（当該ページのURL）」; edited/processed content must state
  that it was 加工して作成. None of the files used here carries a 権利表記
  override, so PDL1.0 + source attribution applies.

## Inventory totals

- `raw/oecd/`: 7 files, 2,213,851 bytes (3 CSV data/probe files + 2 probe CSVs
  + dataflow JSON + 403 evidence HTML).
- `raw/mlit/`: 17 files, 32,904,095 bytes (2 × 404 diagnostics, 9 HTML pages,
  4 Excel, 1 PDF — the 27.9 MB 地価公示 timeseries dominates).
- `scripts/fetch-oecd-mlit.sh`: 1 file, 196 lines.
- All checksums recorded above (§1.3, §2.2, script sha256 in header).
