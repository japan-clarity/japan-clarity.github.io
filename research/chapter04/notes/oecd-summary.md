# OECD SDMX — Labor Data Summary (Chapter 04: Labor & Working Conditions)

- **Task ID**: ch04-2-b. **Access date**: 2026-10-26 (all fetches, UTC timestamps below).
- Every value below is quoted from a downloaded raw file in
  `research/chapter04/raw/oecd/` (file path + row context given). Nothing is
  recomputed, estimated, or drawn from memory.
- API base: `https://sdmx.oecd.org/public/rest` (CSV-with-labels format via
  `?format=csvfilewithlabels`; structure metadata as SDMX-JSON 2.0 via
  `Accept: application/vnd.sdmx.structure+json;version=2.0.0`) — same pattern
  as the Ch03 fetch script (`research/chapter03/scripts/fetch-oecd-mlit.sh`).
- Dataflow discovery: `GET /dataflow/all?references=none` → HTTP 200,
  10,447,974 bytes, 1,552 dataflows (2026-10-26T19:11:50Z, /tmp, filtered
  locally, not archived).
- Key-syntax lesson (HTTP 403 diagnostic, applies to all OECD data queries):
  the data key must carry **every** dimension position of the DSD —
  `…/data/<flow>/JPN` → `403 "Not enough key values in query, expecting 13
  got 1"`; trailing wildcards may not be dropped. Working form:
  `<flow>/JPN............` (13 positions for DSD_HW) etc.
- `meta.prepared` in every structure message equals fetch-time + exactly
  1 hour (e.g. hours def fetched 19:12:13Z → `prepared=2026-10-26T20:12:12Z`):
  the API generates the structure message **on request**; these stamps are
  request-generation evidence, not dataset vintages. The `meta.id` (IREF…)
  values are recorded per dataset below.

## Inventory (all saved files; sha256 full, fetch UTC, HTTP, bytes)

| File (under `raw/oecd/`) | sha256 | Fetched (UTC) | HTTP | Bytes | Data rows |
|---|---|---|---|---|---|
| `oecd-dataflow-def-hours.json` | `eade62d0b371203415cb9bb1001d0160c6629b419e27687e91ea1d66c4a25148` | 19:12:13Z | 200 | 2,076,094 | — |
| `oecd-dataflow-def-temp.json` | `c36cfe940e3db781c3e1c45ebdddd2e8aa48a6cc39b7999aefa31167733bbde1` | 19:12:15Z | 200 | 2,120,706 | — |
| `oecd-dataflow-def-genderwg.json` | `540c4b840d4649781890b3dc92fcc4e307289270dbdb403d97cd02540f133ecb` | 19:12:17Z | 200 | 1,398,672 | — |
| `oecd-dataflow-def-emprate.json` | `c9bb5989894453314b100ee0825ea88c4ca44e098b8a2053c22d9e56a31a6f8f` | 19:20:26Z | 200 | 1,732,320 | — |
| `oecd-hours-1.csv` | `367e08b85e5e182463bf4dc4936c85e7d94db8be355694eb0cf883668644376a` | 19:16:21Z | 200 | 257,044 | 750 |
| `oecd-hours-2.csv` | `5aa34244597f2215afddd7e243681c47b225fa852de1da9c284416eb67d38596` | 19:16:36Z | 200 | 30,281 | 87 |
| `oecd-temp-1.csv` | `03bfd7fdd6d97e2c70afd3e96bebf3a08d70b723bf91c8977f87ec8191dd4319` | 19:16:28Z | 200 | 125,365 | 440 |
| `oecd-temp-2.csv` | `0d84bfbb15374d1a7e054d4b76978b24bb184c6499f1ea0a6659800400fe2597` | 19:16:48Z | 200 | 60,949 | 205 |
| `oecd-temp-3.csv` | `d56449f2a512919c797587c642a11a33ea047ace7465067df0e828dff80c869e` | 19:17:08Z | 200 | 363,374 | 1,230 |
| `oecd-gwg-1.csv` | `35d4115f8e7a9b796885c628e565322ac125be8b85f267eb9767f13515935328` | 19:16:30Z | 200 | 222,613 | 805 |
| `oecd-gwg-2.csv` | `919d0d4f05a2d875b66b3e810809a1b111023cb1acd52ab344a8d4d41b19f1aa` | 19:16:38Z | 200 | 56,029 | 204 |
| `oecd-emprate-1.csv` | `4ecc1f0806fac0ad5943e9a1b04903c711d682db67bbe25f3e90944c6de36d8b` | 19:20:49Z | 200 | 235,742 | 723 |
| `oecd-lfsnotes-sources.pdf` | `9b8261095ad3aaf36dd0ed2cb768e43b7c82d44fd90e1fdc3d20d48f419ac77f` | 19:18:29Z | 200 | 691,411 | 55 pp |

All times 2026-10-26 UTC. All CSVs carry the SDMX header row (first line
begins `STRUCTURE,STRUCTURE_ID,STRUCTURE_NAME,ACTION,…`). Row counts =
data rows excluding header (verified by parsing; e.g. `oecd-hours-1.csv`
751 lines = 1 header + 750 data rows).

---

## 1. Dataset 1 — Average annual hours actually worked per worker

- **Dataflow (verified via dataflow list + dataflow definition):**
  `OECD.ELS.SAE:DSD_HW@DF_AVG_ANN_HRS_WKD(1.0)` — "Average annual hours
  actually worked per worker". Structure message `meta.id=IREF419342`,
  `meta.prepared=2026-10-26T20:12:12Z` (file `oecd-dataflow-def-hours.json`).
  Note: the domain is **OECD.ELS.SAE** (not OECD.ELS.HWF as guessed in the
  task brief).
- **Metadata URL:** `GET /dataflow/OECD.ELS.SAE/DSD_HW@DF_AVG_ANN_HRS_WKD/1.0?references=all`
  (HTTP 200; includes DSD, codelists, concepts).
- **Dataflow description (VERBATIM, the comparability warning):**
  > "The concept used is the total number of hours worked over the year
  > divided by the average number of people in employment. The data are
  > intended for comparisons of trends over time; they are unsuitable for
  > comparisons of the level of average annual hours of work for a given
  > year, because of differences in their sources.  Part-time workers are
  > covered as well as full-time workers. Detailed notes and sources can be
  > found in LFS_NOTES_SOURCES."
- **DSD dimension order (13 dims):** `REF_AREA.MEASURE.UNIT_MEASURE.SEX.AGE.
  LABOUR_FORCE_STATUS.WORK_PERIOD.HOURS_TYPE.WORKER_STATUS.WORK_TIME_ARNGMNT.
  AGGREGATION_OPERATION.HOUR_BANDS.JOB_COVERAGE`
  (there is no FREQ dimension; WORK_PERIOD uses SDMX:CL_FREQ).
- **Data key used (13 positions):**
  `<13 areas>.HW.H_Y_PS._Z._Z.EMP.A.ACTUAL._T._Z.MEAN._Z._T`
  → MEASURE `HW`="Hours worked", UNIT `H_Y_PS`="Hours per year per person"
  (CL_UNIT_MEASURE 1.2), SEX `_Z`="Not applicable", AGE `_Z`,
  LABOUR_FORCE_STATUS `EMP`="Employment", WORK_PERIOD `A`="Annual",
  HOURS_TYPE `ACTUAL`="Actual", **WORKER_STATUS `_T`="Total"** (= the
  Data-Explorer default and the "per worker" headline series),
  WORK_TIME_ARNGMNT `_Z`, AGGREGATION_OPERATION `MEAN`="Mean",
  HOUR_BANDS `_Z`, JOB_COVERAGE `_T`="Total".
- **Final REST URL (deliverable `oecd-hours-1.csv`):**
  `https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_HW@DF_AVG_ANN_HRS_WKD,1.0/JPN+USA+DEU+FRA+GBR+ITA+CAN+AUS+KOR+ESP+SWE+NLD+OECD.HW.H_Y_PS._Z._Z.EMP.A.ACTUAL._T._Z.MEAN._Z._T?format=csvfilewithlabels`
  → HTTP 200, 257,044 bytes, 750 data rows, sha256 `367e08b8…4376a`.
- **Columns (40):** code+label pairs for all 13 dimensions, then
  `TIME_PERIOD/Time period`, `OBS_VALUE/Observation value`,
  `OBS_STATUS/Observation status` (all `A`="Normal value"), `UNIT_MULT`
  (all empty), `DECIMALS` (all `0`), `ACTION` (all `I`). **No BASE_PER
  column in this dataflow** (not an index). UNIT label on every row:
  "Hours per year per person".
- **Diagnostic file `oecd-hours-2.csv`** (JPN all-series wildcard probe,
  `…/data/OECD.ELS.SAE,DSD_HW@DF_AVG_ANN_HRS_WKD,1.0/JPN............?format=csvfilewithlabels`,
  87 rows): JPN has exactly two series — WORKER_STATUS `_T` (56 obs,
  1970–2025) and WORKER_STATUS `ICSE93_1`="Employees" (31 obs, 1995–2025;
  e.g. 2015=1730.398, 2020=1616.876, 2025=1613.898). Deliverable uses `_T`.

### 1.1 Japan — full annual series 1970–2025 (56 obs; year: OBS_VALUE verbatim)

```
1970:2243   1971:2239   1972:2228   1973:2201   1974:2137   1975:2112
1976:2128   1977:2129   1978:2123   1979:2126   1980:2121   1981:2106
1982:2104   1983:2095   1984:2108   1985:2093   1986:2097   1987:2096
1988:2092   1989:2070   1990:2031   1991:1998   1992:1965   1993:1905
1994:1898   1995:1884   1996:1892   1997:1865   1998:1842   1999:1810
2000:1821   2001:1809   2002:1798   2003:1799   2004:1785   2005:1777
2006:1786   2007:1785   2008:1771   2009:1714   2010:1733   2011:1728
2012:1745   2013:1734   2014:1729   2015:1719   2016:1714   2017:1709
2018:1680   2019:1644   2020:1597.011  2021:1607.483  2022:1606.995
2023:1610.745  2024:1617.381  2025:1597.507
```

Requested spot checks (verbatim from `oecd-hours-1.csv`): **2015=1719,
2020=1597.011, 2024=1617.381**; also 1970=2243, 2000=1821, 2010=1733,
2023=1610.745, 2025=1597.507. (Fact, visible in the raw file: values are
integers through 2019 and carry decimals from 2020 onward; DECIMALS=0 on
all rows either way.)

### 1.2 Comparators — latest rows (2025) verbatim

| REF_AREA | 2025 OBS_VALUE |
|---|---|
| DEU | `1332.2` |
| KOR | `1833` |
| USA | `1800.232` |
| OECD | `1736.12891474911` |

Other 2025 values: AUS 1633, CAN 1687, ESP 1632.7, FRA 1498.293,
GBR 1532.915, ITA 1715.7, NLD 1436.037, SWE 1421.206.

### 1.3 Country coverage

JPN 1970–2025 (56) · DEU/ESP/GBR/ITA/NLD/OECD 1970–2025 (56) ·
FRA/SWE/USA 1950–2025 (76) · CAN 1961–2025 (65) · AUS 1979–2025 (47) ·
**KOR only 2008–2025 (18)**. All 13 requested areas present, no internal
gaps; OECD average available 1970–2025. **CHN NOT available** — probe
`…/data/…/CHN............?format=csvfilewithlabels` → HTTP 404
"NoRecordsFound" (2026-10-26T19:15:34Z).

---

## 2. Dataset 2 — Share of temporary employment (incidence of temporary work)

- **Dataflow (verified):** `OECD.ELS.SAE:DSD_TEMP@DF_TEMP_I(1.0)` —
  "Employment by permanency of the job - Incidence". `meta.id=IREF419343`,
  `meta.prepared=2026-10-26T20:12:14Z` (file `oecd-dataflow-def-temp.json`).
  (A levels twin `DSD_TEMP@DF_TEMP_D` exists; the share is in DF_TEMP_I.)
- **Metadata URL:** `GET /dataflow/OECD.ELS.SAE/DSD_TEMP@DF_TEMP_I/1.0?references=all` (HTTP 200).
- **DSD dimension order (7 dims):** `REF_AREA.MEASURE.UNIT_MEASURE.SEX.AGE.WORKER_STATUS.FREQ`.
- **Data key used:** `<13 areas>.EMP_TEMP.PT_POP_SUB._T._T.ICSE93_1.A`
  → MEASURE `EMP_TEMP`="Temporary employment", UNIT `PT_POP_SUB`=
  "Percentage of population in the same subgroup" (CL_UNIT_MEASURE 1.15),
  SEX `_T`="Total", AGE `_T`="Total", **WORKER_STATUS `ICSE93_1`=
  "Employees"** (denominator = employees, not total employment), FREQ `A`.
  Only measures EMP_PERM and EMP_TEMP exist in this dataflow (no bare EMP).
- **Final REST URL (deliverable `oecd-temp-1.csv`):**
  `https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_TEMP@DF_TEMP_I,1.0/JPN+USA+DEU+FRA+GBR+ITA+CAN+AUS+KOR+ESP+SWE+NLD+OECD.EMP_TEMP.PT_POP_SUB._T._T.ICSE93_1.A?format=csvfilewithlabels`
  → HTTP 200, 125,365 bytes, 440 data rows, sha256 `03bfd7fd…d4319`.
- **Columns (28):** code+label pairs for the 7 dimensions + TIME_PERIOD,
  OBS_VALUE, OBS_STATUS (all `A`), UNIT_MULT (empty), DECIMALS.
- **Denominator evidence:** in the JPN wildcard probe (`oecd-temp-3.csv`),
  EMP_TEMP + EMP_PERM = 100.00 exactly in every overlapping year (e.g.
  2010: 13.75 + 86.25; 2023: 14.918 + 85.082; 2024: 14.622 + 85.378;
  2025: 14.232 + 85.768) → the incidence is **% of employees**.

### 2.1 Generic definition (dataflow description, VERBATIM)

> "This dataset contains incidences and gender composition of temporary
> employment with standardised age groups (15-24, 25-54, 55-64, 65+,
> total). Data are further broken down by professional status - employees,
> total employment. Data are reported for employees. Temporary employees
> are wage and salary workers whose job has a pre-determined termination
> date as opposed to permanent employees whose job is of unlimited
> duration. They include: i) persons with a seasonal job; ii) persons
> engaged by an employment agency or business and hired out to a third
> party for carrying out a “work mission”; iii) persons with specific
> training contracts (including apprentices, trainees, research assistants,
> probationary period of a contract, etc.). Country-specific exceptions to
> this generic definition may be found in LFS_NOTES_SOURCES."

### 2.2 Japan-specific definition & break notes (LFS_NOTES_SOURCES, VERBATIM)

From `oecd-lfsnotes-sources.pdf` (55 pp; header line: "LAST UPDATE: 28
AUGUST 2026"), Table 3 "Unemployment duration, labour contracts and working
hours: sources and definitions", Japan row — labour contracts column:

> "Permanent worker: Persons whose main job is a work contract of unlimited
> duration or regular workers whose contract last for 12 months and over.
> Temporary worker: Workers whose main job is a fixed-term contract lasting
> not more than one year, occasional, casual or seasonal work, daily
> workers, or work lasting less than 12 months (Note: Covers only employees
> in non-agricultural industries.) In the January 2018 survey revision,
> four items in Status in employment – 1. Ordinary employee (Indefinite
> duration contract), 2. Ordinary employee (Limited duration contract)
> (duration of employment contract is more than 1 year), 3.Temporary
> employee (1 month or more up to 1 year) and 4. Daily employee (less than
> 1 month), were discontinued and a new survey item “duration of employment
> contract” was introduced. Source: The Labour Force Survey “Basic
> Tabulation”."

Same PDF, Table 6 "Labour Force Statistics in OECD countries: breaks in
series", Japan row (2017/2018):

> "Temporary workers: In the January 2018 survey revision, four items in
> Status in employment – … – were discontinued and a new survey item
> “duration of employment contract” was introduced. Large break in series
> caused by this revision, hence, items of “Duration of employment
> contract” cannot be compared with formerly released items of “Status in
> employment” directly based on the correspondence (e.g. duration of
> employment contract “1 month or more up to 1 year” and “Temporary
> employee”)."

Table 1 (sources/coverage), Japan row: "The Labour Force Survey / Labour
Force … Statistics Bureau … The annual data are averages of monthly
estimates." and "Note: Data for 2011 do not include Iwate, Miyagi, and
Fukushima."

### 2.3 Japan — full annual series (year: OBS_VALUE verbatim, % of employees)

```
1980: 9.61    1981: 9.51    1982: 9.73    1983:10.22    1984:10.15
1985:10.2     1986:10.04    1987:10.34    1988:10.52    1989:10.61
1990:10.61    1991:10.43    1992:10.26    1993:10.26    1994:10.28
1995:10.46    1996:10.54    1997:11       1998:11.74    1999:11.91
2000:14.52    2001:12.76    2002:13.51    2003:13.76    2004:13.92
2005:14.01    2006:13.97    2007:13.86    2008:13.62    2009:13.708
2010:13.75    2011:13.719   2012:13.699   [2013-2017 ABSENT]  2018:15.668
2019:15.726   2020:15.408   2021:15.043   2022:14.967   2023:14.918
2024:14.622   2025:14.232
```

Requested spot checks: **2000=14.52, 2010=13.75, 2023=14.918**; also
1980=9.61, 1990=10.61, 2020=15.408, 2024=14.622, 2025=14.232.
**Coverage facts (verbatim from the file): observations for 2013, 2014,
2015, 2016 and 2017 do NOT exist** (2012 → 2018 jump; 41 obs over
1980–2025). The 2000→2001 step (14.52→12.76) and the 2018 level shift
(13.699→15.668) are exactly where the survey-revision breaks documented in
§2.2 sit — do not present as a continuous trend without the break note.
JPN youth (AGE=Y15T24, from probe `oecd-temp-2.csv`): 2000=24.85,
2010=26.639, 2020=16.291, 2025=14.508 (post-2018 break is largest here).

### 2.4 Comparators — latest rows verbatim

| REF_AREA | Latest | OBS_VALUE |
|---|---|---|
| DEU | 2025 | `11.48` |
| KOR | 2025 | `27.484` |
| USA | **2023** | `4.261` |
| OECD | 2025 | `11.121` |

Other latest: CAN 2025=11.844, ESP 2025=15.307, FRA 2025=15.356,
GBR 2025=5.052, ITA 2025=13.473, NLD 2025=25.811, SWE 2025=13.342.

### 2.5 Country coverage (important caveats)

JPN 1980–2025 (41, missing 2013–17) · OECD 1980–2025 (46) · FRA/GBR/ITA
1983–2025 · DEU 1984–2025 · NLD 1983–2025 (missing 1984, 1986) · ESP
1987–2025 · KOR 2004–2025 · CAN/SWE 1997–2025 · **USA only 7 obs:
1995, 1997, 1999, 2001, 2005, 2017, 2023 — no 2024/2025** · **AUS
1998–2017 only (15 obs, gaps 1999/2000/2002/2003/2005), no data after
2017**. CHN not present (HTTP 404 probe). OECD average present 1980–2025.
Japan-non-regular vs OECD-temporary: these are **different concepts**
(Japan's 非正規 includes part-timers without fixed end date; OECD
"temporary" = pre-determined termination date; see §2.1/§2.2 verbatim
texts) — never interchange them in charts.

---

## 3. Dataset 3 — Gender wage gap

- **Dataflow (verified):** `OECD.ELS.SAE:DSD_EARNINGS@GENDER_WAGE_GAP(1.1)`
  — "Gender wage gap". `meta.id=IREF419329`, `meta.prepared=
  2026-10-26T20:12:16Z` (file `oecd-dataflow-def-genderwg.json`). The task
  brief's guess "GENDER_WG" is the indicator slug; the SDMX dataflow id is
  `DSD_EARNINGS@GENDER_WAGE_GAP`.
- **Metadata URL:** `GET /dataflow/OECD.ELS.SAE/DSD_EARNINGS@GENDER_WAGE_GAP/1.1?references=all` (HTTP 200).
- **DSD dimension order (7 dims):** `REF_AREA.MEASURE.UNIT_MEASURE.PAY_PERIOD.PRICE_BASE.AGGREGATION_OPERATION.SEX`.
- **Data key used:** `<13 areas>.GWP.PT_WG_SAL_M_D._Z._Z.MEDIAN+MEAN._T`
  → MEASURE `GWP`="Gender wage gap", UNIT `PT_WG_SAL_M_D`="Percentage of
  wages of men in the same decile" (CL_UNIT_MEASURE 1.0 — OECD's unit
  naming; read as % of men's wages), PAY_PERIOD `_Z`="Not applicable",
  PRICE_BASE `_Z`="Not applicable", AGGREGATION_OPERATION `MEDIAN`=
  "Median" and `MEAN`="Mean" (both fetched in one call), SEX `_T`="Total".
- **Final REST URL (deliverable `oecd-gwg-1.csv`):**
  `https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_EARNINGS@GENDER_WAGE_GAP,1.1/JPN+USA+DEU+FRA+GBR+ITA+CAN+AUS+KOR+ESP+SWE+NLD+OECD.GWP.PT_WG_SAL_M_D._Z._Z.MEDIAN+MEAN._T?format=csvfilewithlabels`
  → HTTP 200, 222,613 bytes, 805 data rows (398 MEDIAN + 407 MEAN),
  sha256 `35d4115f…593528`.
- **Columns (30):** code+label pairs for the 7 dimensions + TIME_PERIOD,
  OBS_VALUE, **BASE_PER** (present but EMPTY on all 805 rows), OBS_STATUS
  (all `A`), UNIT_MULT, DECIMALS, ACTION (`I`).
- **Diagnostic file `oecd-gwg-2.csv`** (JPN all-aggregations probe,
  `…/JPN.GWP.PT_WG_SAL_M_D._Z._Z..?format=csvfilewithlabels`, 204 rows):
  JPN also has D1 and D9 variants (51 obs each) — quoted in the notes'
  working data only; deliverable carries MEDIAN+MEAN.

### 3.1 Definition (dataflow description, VERBATIM)

> "This dataset contains gender wage gaps defined as: 1) the unadjusted
> difference between median wages of men and women relative to the median
> wages of men, 2) the unadjusted difference between mean wages of men and
> women relative to the mean wages of men, 3) at the 1st decile and 4) at
> the 9th decile."

The task brief's fuller wording ("difference between median earnings of
men and women relative to median earnings of men, **full-time employees**")
matches the OECD Data-Explorer indicator description, but **no SDMX
metadata field obtainable from this sandbox states the "full-time"
qualifier verbatim** — the /metadata SDMX endpoint returns `403 Invalid
structure` and oecd.org HTML pages return 403 Cloudflare (see §6/§7). The
"full-time employees" basis must be cited to the OECD web page (not
fetchable here) or dropped; do NOT attribute it to the SDMX metadata.

### 3.2 Japan — MEDIAN series 1975–2025 (51 obs; year: OBS_VALUE verbatim)

```
1975:42.389758179  1976:39.741750359  1977:40.326797386  1978:40.565457898
1979:41.313190006  1980:41.68030551   1981:41.956967213  1982:42.15925745
1983:41.903409091  1984:41.9340055    1985:41.659272405  1986:41.605524385
1987:41.226215645  1988:41.018211921  1989:40.963375796  1990:40.59893859
1991:39.898989899  1992:38.884992987  1993:38.450946644  1994:37.815975733
1995:37.090301003  1996:36.847323199  1997:36.521454307  1998:35.307666996
1999:34.550839092  2000:33.85930309   2001:33.864671438  2002:32.529722589
2003:31.997350116  2004:31.087391594  2005:32.825438887  2006:32.980832783
2007:31.742323097  2008:30.694397853  2009:28.284923928  2010:28.684300928
2011:27.395364926  2012:26.523545706  2013:26.587578507  2014:25.870989997
2015:25.731790334  2016:24.601289447  2017:24.518092661  2018:23.537368955
2019:23.480013436  2020:22.518568535  2021:22.113766409  2022:21.347941567
2023:22.042139384  2024:20.650457847  2025:20.104358502
```

### 3.3 Japan — MEAN series 1975–2025 (51 obs; year: OBS_VALUE verbatim)

```
1975:41.078561917  1976:41.188118812  1977:41.024096386  1978:41.029994341
1979:41.009125067  1980:41.13796576   1981:41.059602649  1982:41.396396396
1983:41.255996511  1984:41.389473684  1985:40.392477514  1986:40.29318542
1987:39.503298409  1988:39.485627837  1989:39.768199928  1990:39.759036145
1991:39.302172482  1992:38.500797448  1993:38.418255705  1994:37.996334759
1995:37.515151515  1996:37.245508982  1997:36.884272997  1998:36.117717004
1999:35.402435402  2000:34.501187648  2001:34.72262988   2002:33.491969066
2003:33.174366617  2004:32.434860737  2005:34.132622854  2006:34.132622854
2007:33.115533116  2008:32.244531016  2009:30.23255814   2010:30.673164788
2011:29.363387146  2012:29.14893617   2013:28.650306748  2014:27.791262136
2015:27.782751417  2016:27.028639618  2017:26.646795827  2018:26.688388626
2019:25.73964497   2020:25.678866588  2021:24.792408066  2022:23.220640569
2023:25.163864349  2024:24.180666483  2025:23.433315479
```

Requested spot checks (MEDIAN): **2010=28.684300928, 2020=22.518568535,
2023=22.042139384**; also 1975=42.389758179, 1990=40.59893859,
2000=33.85930309, 2015=25.731790334, 2024=20.650457847,
2025=20.104358502. MEAN: 2010=30.673164788, 2020=25.678866588,
2025=23.433315479. JPN D1 (from `oecd-gwg-2.csv`): 2015=18.504366812,
2025=13.680781759; D9: 2015=33.133769878, 2025=30.432543769.

### 3.4 Comparators — latest rows verbatim (MEDIAN)

| REF_AREA | Latest | OBS_VALUE |
|---|---|---|
| DEU | 2024 | `13.467176917` |
| KOR | 2025 | `27.790041697` |
| USA | 2025 | `17.873303167` |
| OECD | 2024 | `10.0746930271895` |

MEDIAN latest others: AUS 2025=11.397284085, CAN 2025=14.52991453,
ESP 2024=4.3700203082, FRA 2024=7.0038511831, GBR 2025=12.865209919,
ITA 2024=6.9618465912, NLD 2022=10.030864198, SWE 2025=7.7694235589.
MEAN latest: DEU 2024=17.203841237, KOR 2025=27.673686873,
USA 2025=19.135135135, OECD 2024=12.6532348431553.

### 3.5 Country coverage

MEDIAN: JPN 1975–2025 (51, no gaps) · AUS 1975–2025 (50) · USA 1973–2025
(53) · GBR 1970–2025 (56) · KOR 1985–2025 (35) · SWE 1995–2025 (31) ·
CAN 1997–2025 (29) · DEU 1992–2024 (33) · **NLD 2002–2022 (6) — ends
2022** · ESP/FRA/ITA 2002–2024 (8/8/7, biennial-ish) · OECD average
1995–2024 (30). MEAN similar (KOR from 1984, SWE from 1992, FRA/ITA 7 obs).
**DEU/ESP/FRA/ITA have no 2025; NLD no post-2022** — do not chart a
"2025" cross-section as if complete. CHN not present (HTTP 404 probe).

---

## 4. Dataset 4 (optional, completed) — Employment rate (15–64)

- **Dataflow (verified):** `OECD.ELS.SAE:DSD_LFS@DF_LFS_INDIC(1.1)` —
  "Employment and unemployment by five-year age group and sex - indicators".
  `meta.id=IREF424250`, `meta.prepared=2026-10-26T20:20:25Z`
  (file `oecd-dataflow-def-emprate.json`). Description (verbatim, abridged
  first sentence): "This dataset contains employment population ratios,
  unemployment rates and labour force participation rates by sex and by
  5-year age groups and aggregated age groups."
- **DSD dimension order (6 dims):** `REF_AREA.MEASURE.UNIT_MEASURE.SEX.AGE.LABOUR_FORCE_STATUS`.
- **Data key used:** `<13 areas>.EMP_RATIO.PT_POP_SUB._T.Y15T64.EMP`
  → MEASURE `EMP_RATIO`="Employment to population ratio", UNIT
  `PT_POP_SUB`="Percentage of population in the same subgroup", SEX `_T`,
  AGE `Y15T64`="From 15 to 64 years", LFS `EMP`="Employment".
- **Final REST URL (deliverable `oecd-emprate-1.csv`):**
  `https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_LFS@DF_LFS_INDIC,1.1/JPN+USA+DEU+FRA+GBR+ITA+CAN+AUS+KOR+ESP+SWE+NLD+OECD.EMP_RATIO.PT_POP_SUB._T.Y15T64.EMP?format=csvfilewithlabels`
  → HTTP 200, 235,742 bytes, 723 data rows (715 OBS_STATUS=A; 2 AUS rows
  OBS_STATUS=B "Time series break" 1985/2000; 6 CAN/AUS 2023–2025 rows
  with empty OBS_STATUS), sha256 `4ecc1f08…36d8b`.
- **Japan (employment-to-population ratio 15–64, %; year: OBS_VALUE
  verbatim):** 1970=67.9379715004191, 1980=66.8148336296672,
  1990=68.5873605947955, 2000=68.869, 2010=70.106, 2015=73.275,
  2020=77.266, 2023=78.885, 2024=79.381, **2025=80.038** (series
  1968–2025, 58 obs).
- **Latest comparators:** DEU 2025=77.173, KOR 2025=69.847, USA
  2025=71.761, OECD 2025=70.388 (also NLD 82.304, AUS 77.206,
  SWE 76.423, GBR 75.499, CAN 74.221, FRA 69.43, ESP 68.134,
  ITA 62.526).
- **Coverage:** OECD 1960–2025 · USA 1960–2025 · SWE 1963–2025 ·
  AUS 1966–2025 · JPN 1968–2025 · DEU/ITA 1970–2025 · NLD 1971–2025 ·
  ESP 1972–2025 · FRA 1975–2025 · CAN 1976–2025 · KOR 1980–2025 ·
  GBR 1984–2025.

---

## 5. LFS_NOTES_SOURCES PDF (comparability reference document)

- URL: `https://www.oecd.org/content/dam/oecd/en/data/datasets/employability-data/LFSNOTES_SOURCES.pdf`
  (linked verbatim from the dataflow descriptions of Datasets 1, 2 and 4).
- Saved as `oecd-lfsnotes-sources.pdf` (HTTP 200, 691,411 bytes, PDF 1.7,
  55 pages; pdftotext extraction succeeded). Title: "LABOUR FORCE
  STATISTICS IN OECD COUNTRIES: SOURCES, COVERAGE AND DEFINITIONS";
  header line: **"LAST UPDATE: 28 AUGUST 2026"**.
- Relevant to Ch04: Table 1 (Japan source/coverage, 2011 disaster note),
  Table 3 (Japan temporary/permanent definitions + hours: "Jobs covered are
  all jobs and the hours worked are actual hours. Source: The Labour Force
  Survey 'Basic Tabulation'."), Table 6 (Japan 2001/2002 and 2017/2018
  breaks — quoted in §2.2 above).

## 6. Licensing

Same situation as Ch03 (worklog + `notes/oecd-mlit-summary.md` §6):
www.oecd.org **HTML pages** return HTTP 403 (Cloudflare challenge) from
this sandbox — probed again 2026-10-26 for `/en/data/datasets/gender-wage-gap.html`,
`average-annual-hours-actually-worked.html`, `temporary-employment.html`,
`incidence-of-temporary-employment.html` (all 403) and the reuse-terms page
(403 per Ch03 evidence). The OECD **content/dam CDN** (PDF binary path)
does work — the LFSNOTES_SOURCES.pdf fetch above proves it. Chapter 04
should follow the established project convention (research/DATA-LICENSES.md):
OECD data reuse with attribution — "Source: OECD <dataset name> (dataflow
<agency:dataflow(version)>), retrieved via SDMX API on 2026-10-26".

## 7. Unavailable / limitations (documented attempts)

1. **CHN**: not available in ANY of the four dataflows — full-key probes
   `…/CHN……?format=csvfilewithlabels` → HTTP 404 "NoRecordsFound" (14
   bytes) for hours/temp/gwg (2026-10-26T19:15:34Z). Task's "CHN if
   present" → NOT present; omit China from OECD-sourced Ch04 charts.
2. **SDMX reference metadata** (data-quality/definitional notes attached
   via MSD_REF_METADATA): `GET /metadata/dataflow/{agency}/{id}/{version}`
   → HTTP 403 "Invalid structure" for every Accept variant tried
   (`application/vnd.sdmx.metadata+json;version=2.0.0` and `1.0.0`, bare,
   `application/json`; also `/metadataflow/all` → 404, `/v2/…` → 400
   UnsupportedApiVersion). Endpoint not offered by the public API.
3. **OECD.org HTML pages** (dataset/indicator/reuse-terms): HTTP 403
   Cloudflare (see §6) — the Data-Explorer wording of the gender wage gap
   definition (incl. any "full-time employees" qualifier) could NOT be
   captured verbatim; only the SDMX dataflow description (§3.1) is quoted.
   Four guessed earnings-notes PDF URLs on content/dam → 404.
4. **USA temporary-employment series is sparse** (7 obs 1995–2023) and
   **AUS ends 2017**; **JPN temp 2013–2017 absent**; these are properties
   of the OECD dataset itself, preserved verbatim in §2.3/§2.5.
5. Nothing else failed: all four datasets were obtained, verified, and
   checksummed; every requested JPN spot-value was read from the saved
   CSVs (≥5 per dataset).
