# OECD AHPI & MLIT — Data Summary (Chapter 03: Housing & Cost of Living)

- **Task ID**: 4-c. **Access date**: 2026-10-26 (all fetches).
- Every value below is quoted from a downloaded raw file (file path + row
  context given). Nothing is recomputed, estimated, or drawn from memory.
- Companion inventory (URLs / HTTP / bytes / sha256): `notes/oecd-mlit-inventory.md`.

---

## 1. OECD Analytical House Price Statistics — identity & metadata

- **Dataflow (verified via SDMX dataflow list + dataflow definition):**
  `OECD.ECO.MPD:DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES(1.0)` —
  "Analytical house prices indicators". Structure message `meta.prepared` =
  `2026-10-26T04:28:36Z` (file `raw/oecd/oecd-dataflow-def.json`).
- **Data key dimension order (4 dimensions):** `REF_AREA.FREQ.MEASURE.UNIT_MEASURE`.
- **Measures used (CL_MEASURE_HOU 1.0, verbatim names):**
  - `HPI_YDH` = "Price to income ratio"
  - `RHP` = "Real house price indices"
- **UNIT_MEASURE (CL_UNIT_MEASURE 1.11):** `IX` = "Index" — the ONLY unit that
  exists for annual HPI_YDH (proven by the wildcard probe
  `raw/oecd/oecd-jpn-hpiydh-probe.csv`: 66 rows, all `IX`).
- **BASE_PER attribute (free text):** `2015` **on every row of both deliverable
  CSVs** — i.e. **these are indices on base 2015 = 100. They are NOT price
  levels, NOT percentages, NOT 2020-based, and NOT national-currency values.**
  Verified: the `TIME_PERIOD=2015` row of every one of the 13 areas in both
  files carries `OBS_VALUE` = `100` exactly (programmatic check).
- **No TRANSFORMATION dimension exists in this DSD** (unlike Ch02's DSD_PDB,
  which had CL_TRANSFORMATION). The "index" character is expressed by
  `UNIT_MEASURE=IX`; the base year solely by `BASE_PER`.
- **Other fixed attributes on every row of both CSVs:** `FREQ=A` ("Annual"),
  `ADJUSTMENT=S` ("Seasonally adjusted, not calendar adjusted"), `OBS_STATUS=A`
  ("Normal value"), `UNIT_MULT=0` ("Units"), `DECIMALS=1` ("One"),
  `ACTION=I`, `STRUCTURE=DATAFLOW`.
- **Variant distinction (anti-mislabeling evidence):** the dataflow also
  publishes "standardised" variants. In `raw/oecd/oecd-jpn-all-measures-annual.csv`
  (wildcard probe `JPN.A..`, all 7 measures):
  - `HPI_YDH, IX, BASE_PER=2015` — index, 2015=100 (used in this chapter);
  - `HPI_YDH_AVG, PT_AVG_L_TERM` ("Percentage of long term average"),
    `BASE_PER` **empty** — e.g. verbatim rows:
    `JPN,A,HPI_YDH_AVG,PT_AVG_L_TERM,2015,76.7875586850613,S,` and
    `JPN,A,HPI_YDH_AVG,PT_AVG_L_TERM,2025,88.0033581155433,S,`.
  The two are distinguished by MEASURE (`HPI_YDH` vs `HPI_YDH_AVG`) **and**
  UNIT_MEASURE (`IX` vs `PT_AVG_L_TERM`) **and** BASE_PER (`2015` vs empty).
  **No percentage-change (period-on-period growth) unit appears anywhere in
  the JPN wildcard probe** — only `IX` and `PT_AVG_L_TERM`.
- **Quarterly vs annual:** quarterly data exists (`raw/oecd/
  oecd-jpn-hpiydh-quarterly-probe.csv`: FREQ=Q, TIME_PERIOD like `2025-Q2`,
  BASE_PER=2015, 264 rows). All values reported here are **annual (FREQ=A)
  only**; quarterly observations are never mixed in.

## 2. Price-to-income ratio (HPI_YDH, IX, 2015=100) — deliverable file

File: `raw/oecd/oecd-hpi-ydh-ptoincome-idx2015.csv`
(660 rows; URL in inventory §1.2 #1).

Verbatim example row (JPN 2025, all 25 SDMX-CSV columns in file order):

```
DATAFLOW,OECD.ECO.MPD:DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES(1.0),Analytical house prices indicators,I,JPN,Japan,A,Annual,HPI_YDH,Price to income ratio,IX,Index,2025,,114.606271670236,,A,Normal value,0,Units,S,Seasonally adjusted, not calendar adjusted,1,One,2015,
```

(Note: the empty fields are the label columns for TIME_PERIOD and OBS_VALUE.)

### 2.1 Japan — full annual series, 1960–2025 (66 obs; year: OBS_VALUE verbatim)

```
1960:140.885276958717  1961:164.336237255012  1962:174.861798929189
1963:173.610311427048  1964:172.944693606973  1965:171.505330801128
1966:162.409553873695  1967:163.148543293287  1968:164.757550768914
1969:174.935556633159  1970:183.140370569698  1971:190.246096076249
1972:196.822827862131  1973:213.122637784972  1974:196.636407680417
1975:165.658369741443  1976:150.82605431401   1977:145.173959194489
1978:142.212216698439  1979:147.585731409649  1980:155.655938463186
1981:161.360360072902  1982:165.538053199479  1983:166.731820787477
1984:164.932903002129  1985:161.641421325492  1986:161.507256539046
1987:170.105632755673  1988:170.393893057776  1989:172.448922979863
1990:181.946464556367  1991:178.199335411477  1992:167.078868821298
1993:158.417461138141  1994:152.317541556898  1995:148.917224588776
1996:146.361719896688  1997:141.316168588054  1998:138.455050502035
1999:135.9871471959    2000:132.481246197064  2001:131.63459791223
2002:126.201663336258  2003:120.235266656069  2004:111.741988910076
2005:105.709445669886  2006:101.093754231795  2007:99.3063976880127
2008:100.321751858806  2009:95.9585535002909  2010:97.4427354532136
2011:98.0503116490911  2012:96.6779250162819  2013:98.0836391146001
2014:99.2331272918831  2015:100               2016:101.709530569296
2017:103.496958280572  2018:104.278926923213  2019:104.503191827572
2020:99.383330118448   2021:107.247186625037  2022:112.800534233675
2023:115.16931926518   2024:113.872942373024  2025:114.606271670236
```

**Base-year verification: JPN 2015 = `100` exactly** (row
`…,JPN,Japan,A,Annual,HPI_YDH,…,IX,Index,2015,,100,,…,2015,`).
No missing years in 1960–2025 (66/66).

### 2.2 Latest available year per country (HPI_YDH) — all latest = 2025

Verbatim latest-row quotes (fields: REF_AREA,FREQ,MEASURE,UNIT_MEASURE,
TIME_PERIOD,OBS_VALUE,ADJUSTMENT,BASE_PER) from
`raw/oecd/oecd-hpi-ydh-ptoincome-idx2015.csv`:

| REF_AREA | Latest row (verbatim) |
|---|---|
| AUS | `AUS,A,HPI_YDH,IX,2025,119.858273558166,S,2015` |
| CAN | `CAN,A,HPI_YDH,IX,2025,130.695979994481,S,2015` |
| DEU | `DEU,A,HPI_YDH,IX,2025,105.35988690813,S,2015` |
| ESP | `ESP,A,HPI_YDH,IX,2025,125.894388275802,S,2015` |
| FRA | `FRA,A,HPI_YDH,IX,2025,94.071717910878,S,2015` |
| GBR | `GBR,A,HPI_YDH,IX,2025,103.859772499505,S,2015` |
| ITA | `ITA,A,HPI_YDH,IX,2025,88.0863524765774,S,2015` |
| JPN | `JPN,A,HPI_YDH,IX,2025,114.606271670236,S,2015` |
| KOR | `KOR,A,HPI_YDH,IX,2025,74.3977374922312,S,2015` |
| NLD | `NLD,A,HPI_YDH,IX,2025,135.300038701783,S,2015` |
| NZL | `NZL,A,HPI_YDH,IX,2025,102.762534165064,S,2015` |
| SWE | `SWE,A,HPI_YDH,IX,2025,92.0574294323268,S,2015` |
| USA | `USA,A,HPI_YDH,IX,2025,126.279181299206,S,2015` |

Country coverage / missing years (per-area year ranges in the file; all
series are contiguous with no internal gaps):
JPN 1960–2025 (66) · AUS/CAN/ITA/SWE/USA 1970–2025 (56) · ESP 1971–2025 (55) ·
DEU/NLD 1980–2025 (46) · FRA 1978–2025 (48) · GBR 1987–2025 (39) ·
KOR/NZL 1986–2025 (40). **No requested country is missing; ESP included.**
Note the shorter pre-histories for GBR (from 1987) and KOR/NZL (from 1986).

## 3. Real house price index (RHP, IX, 2015=100) — deliverable file

File: `raw/oecd/oecd-rhp-realhouseprice-idx2015.csv` (722 rows; inventory
§1.2 #2). Same metadata as §1 (FREQ=A, ADJUSTMENT=S, BASE_PER=`2015`).

### 3.1 Japan — full annual series, 1960–2025 (66 obs; year: OBS_VALUE verbatim)

```
1960:30.1310730676352  1961:39.0331028352063  1962:44.1178002709212
1963:46.7775618468891  1964:51.3499057807659  1965:53.4168570561038
1966:54.6460629037813  1967:59.5145026791405  1968:66.6170981945987
1969:77.4738197549404  1970:87.2262612300673  1971:94.8744078913692
1972:105.093813018091  1973:125.724382825851  1974:118.410456985951
1975:101.875739970213  1976:95.007807258139   1977:92.1880087049271
1978:93.0520548084143  1979:98.2961112504324  1980:103.429202874669
1981:109.771760284246  1982:115.339801382021  1983:118.614194502845
1984:119.848262461282  1985:120.914651577434  1986:123.563912012565
1987:132.425701168006  1988:139.584382233323  1989:147.454141332024
1990:163.342518597803  1991:165.777060719763  1992:156.729496578413
1993:148.466647723856  1994:144.255154909335  1995:142.439374557429
1996:139.559558441337  1997:135.940821629292  1998:133.57854395869
1999:130.213007296727  2000:126.504665589796  2001:122.594346570579
2002:117.755172726491  2003:111.594448365228  2004:105.397767263118
2005:101.112900942166  2006:98.1525888763929  2007:97.4950539779827
2008:97.3477997386698  2009:93.7816055390469  2010:96.5803708006222
2011:97.1615132587516  2012:96.8998367217758  2013:98.6580411677644
2014:98.209591361355   2015:100               2016:102.514845444784
2017:104.645164992779  2018:105.917327872933  2019:106.676313996533
2020:105.850094403957  2021:111.061135955566  2022:116.512976910839
2023:116.07135913398   2024:116.369930510376  2025:118.046299958487
```

**JPN 2015 = `100` exactly (base-year verification).**

### 3.2 RHP latest (2025) for the same 13 areas — verbatim row quotes

| REF_AREA | Latest row (verbatim) |
|---|---|
| AUS | `AUS,A,RHP,IX,2025,125.893304706461,S,2015` |
| CAN | `CAN,A,RHP,IX,2025,139.514094222274,S,2015` |
| DEU | `DEU,A,RHP,IX,2025,116.454548196687,S,2015` |
| ESP | `ESP,A,RHP,IX,2025,143.034112206385,S,2015` |
| FRA | `FRA,A,RHP,IX,2025,103.500148722927,S,2015` |
| GBR | `GBR,A,RHP,IX,2025,108.184888568769,S,2015` |
| ITA | `ITA,A,RHP,IX,2025,94.6354350702481,S,2015` |
| JPN | `JPN,A,RHP,IX,2025,118.046299958487,S,2015` |
| KOR | `KOR,A,RHP,IX,2025,90.935935098801,S,2015` |
| NLD | `NLD,A,RHP,IX,2025,155.253206616901,S,2015` |
| NZL | `NZL,A,RHP,IX,2025,129.935868163231,S,2015` |
| SWE | `SWE,A,RHP,IX,2025,100.209526843356,S,2015` |
| USA | `USA,A,RHP,IX,2025,154.132987951504,S,2015` |

RHP year ranges: JPN 1960–2025 (66) · GBR 1969–2025 (57) ·
AUS/CAN/DEU/FRA/ITA/NLD/NZL/SWE/USA 1970–2025 (56) · ESP 1971–2025 (55) ·
KOR 1986–2025 (40). All 2015 values = `100` (13/13 verified).

## 4. MLIT — 住宅着工統計 (housing starts, 建築着工統計調査)

**Survey identity:** 建築動態統計調査 page (`raw/mlit/mlit-kenchaku-chuko-main.html`)
lists 「[2]住宅着工統計調査」 with 「年計 毎年１月末」 publication; publication
schedule shows 令和8年12月分及び令和8年計 due 令和9年1月29日, i.e. the CY2025
annual (令和7年計) was released end of January 2026. Release page
`raw/mlit/mlit-press-nenkei.html`: 「建築着工統計調査報告（令和7年計分）
令和8年1月30日」.

### 4.1 CY2025 annual total (新設住宅着工戸数)

Verbatim from the press-release PDF (`raw/mlit/mlit-press-kencha25-2025annual.pdf`,
p.2, pdftotext):

> １．総戸数 ○令和7年の新設住宅着工戸数は **740,667戸**。 ○前年比では6.5％減
> となり、3年連続の減少。 ○新設住宅着工床面積は **56,885千㎡，前年比6.6％減**，
> 4年連続の減少。

Cross-confirmed in `raw/mlit/mlit-press-publication25-2025annual.xls`,
sheet 資料7-1 「新設住宅着工・利用関係別戸数，床面積（単位：戸，千㎡，％）」
row 「令和 7 年」: 総計 `740667.0`, 前年比 `-6.504459129381024`;
持家 `201285.0` (▲7.7%), 貸家 `324991.0` (▲5.0%), 給与住宅 `6222.0`,
分譲住宅 `208169.0`. PDF quotes for the breakdown: 「①持家 ○令和7年の
持家は 201,285戸（前年比 7.7％減…）」「②貸家 ○令和7年の貸家は
324,991戸（前年比 5.0％減…）」.

### 4.2 Long historical series — 利用関係別 annual 戸数 1948–2025

File: `raw/mlit/mlit-timeseries-annual-byusage.xls`, sheet 「年計」, title rows
「利用関係別－新設住宅の戸数、床面積の合計」「（時系列・新設住宅）」.
78 annual rows, 昭和23年 (1948) – 令和7年 (2025), columns 総計/持家/貸家/
給与住宅/分譲住宅 (戸数). Selected rows (cell values verbatim; CE year added
by era arithmetic):

| 年 (CE) | Row label | 総計戸数 | 持家 | 貸家 | 給与住宅 | 分譲住宅 |
|---|---|---|---|---|---|---|
| 1948 | 昭和23年 | 537783 | － | － | － | － |
| 1960 | 昭和35年 | 424170 | 233259 | 145874 | 30098 | 14939 |
| 1972 | 昭和47年 | 1807581 | 688141 | 799724 | 67406 | 252310 |
| **1973** | **昭和48年** | **1905112** | 764996 | 702928 | 70487 | 366701 |
| 1980 | 昭和55年 | 1268626 | 601896 | 319404 | 23924 | 323402 |
| 1990 | 平成2年 | 1707109 | 486527 | 806097 | 34885 | 379600 |
| 2000 | 平成12年 | 1229843 | 451522 | 421332 | 11698 | 345291 |
| 2010 | 平成22年 | 813126 | 305221 | 298014 | 8003 | 201888 |
| 2020 | 令和2年 | 815340 | 261088 | 306753 | 7231 | 240268 |
| 2023 | 令和5年 | 819623 | 224352 | 343894 | 5078 | 246299 |
| 2024 | 令和6年 | 792195 | 218175 | 342092 | 6613 | 225315 |
| 2025 | 令和7年 | 740667 | 201285 | 324991 | 6222 | 208169 |

- The highest 総計 value in the file is **1973 (昭和48年): 1,905,112 戸**
  (1972 = 1,807,581 戸 is the second 1970s peak in this selection).
- Caveats verbatim from the sheet's footnote rows: 「※１　昭和25年以前の戸数は
  工事戸数であり…26年以降については新設戸数であるが、26年から30年までの年計には
  補正が算入してある。」「※２　昭和48年から沖縄県分を含む。」「※３　分譲
  マンションについては、昭和60年以降から集計している。また分譲一戸建について
  は、昭和63年以降に一戸建と長屋建が区分されている。」
- The 2024/2025 values in this time-series file match the press-release Excel
  (資料7-1) exactly (792195 / 740667).
- A monthly time-series file (`raw/mlit/mlit-timeseries-monthly-housing-bldg.xls`,
  sheets jyuu/ken, monthly + 年度計 from 平成6年度) was also archived; monthly
  figures are NOT quoted here (annual 年計 only).

## 5. MLIT — 地価公示 2026 (令和8年地価公示, published March 2026)

Survey identity (verbatim from `raw/mlit/mlit-chika-koji-page.html`):
「地価公示法に基づいて、国土交通省土地鑑定委員会が、適正な地価の形成に寄与する
ために、**毎年1月1日時点における標準地の正常な価格を3月に公示する**ものである」.
The 令和8年地価公示 = prices as of 2026-01-01. Data file:
`raw/mlit/mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls`
「変動率及び平均価格の時系列推移表（令和8年地価公示）」, sheet 「価格推移表」
(平均価格, 総地点; 昭和50年 (1975) – 令和8年 (2026)).

**住宅地 average price (平均価格), 円/㎡ — verbatim cell values:**

| 地域 (area code) | 用途 | 令和7年 (2025) | 令和8年 (2026) |
|---|---|---|---|
| 全国 (`019900012`) | 住宅 | 137100.0 | **144700.0** |
| 東京都 (`041300012`) | 住宅 | 515300.0 | **565100.0** |

Row identity in the sheet: `019900012 | 全国 | 住宅 | … | 137100.0 (令和7年)
| 144700.0 (令和8年)`; `041300012 | 東京都 | 住宅 | … | 515300.0 |
565100.0`. Also quoted for context (same sheet, 全国): 令和5年 (2023) 125000.0,
令和6年 (2024) 130000.0; 東京都: 452100.0, 476100.0.

**Unit/definition (verbatim, sheet 「留意事項」):** 「１．「平均価格」とは、
地点ごとの１平方メートル当たりの価格の合計を総地点数で除して求めたもの
（十の位で四捨五入し百円単位まで求めたもの。）をいう。」 — i.e. **yen per
square metre, rounded to ¥100**; it is a simple average over 標準地 points,
not a transaction median. 「変動率」とは前年から継続している地点（継続地点）
ごとの価格の対前年変動率の合計を当該地点数で除して求めたもの (…)」.

## 6. Licensing (as accessible on 2026-10-26)

- **OECD**: reuse-terms page returned **HTTP 403 (Cloudflare challenge)** from
  this sandbox — no verbatim quote obtainable this session (evidence:
  `raw/oecd/oecd-data-reuse-terms.html`; also 403 for `/terms-and-conditions/`
  and the dataset portal page). Chapter 03 follows the project's established
  convention (Ch02 inventory / `research/DATA-LICENSES.md`): OECD data reuse
  with attribution — "Source: OECD Analytical House Price Statistics
  (dataflow OECD.ECO.MPD:DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES v1.0), retrieved
  via SDMX API on 2026-10-26".
- **MLIT**: `raw/mlit/mlit-link-copyright.html` (www.mlit.go.jp/link.html),
  verbatim: 「国土交通省ウェブサイトで掲載・発信している情報（以下
  「コンテンツ」といいます。）の著作権は、特記されていない限り国土交通省に
  帰属し、権利表記の記載がない限り「公共データ利用規約（第1.0版）」（PDL1.0）
  に準拠した利用条件の下で、利用することができます。」 — attribution per the
  page's example: 「出典：国土交通省ウェブサイト（当該ページのURL）」;
  processed data must state 「…を加工して作成」.

## 7. UNAVAILABLE

1. **OECD data-reuse-terms page quote** — HTTP 403 Cloudflare from sandbox
   (all three oecd.org page URLs tried). Licensing recorded via the
   established project convention instead; no current-terms verbatim quote
   exists in the archive.
2. **MLIT task-spec entry pages** — `statistics/tocjyutaku.html` and
   `jutaku/jutaku2-4.html` are HTTP 404 (site reorganisation); replaced by
   the live entry chain documented in the inventory §2.1.
3. Nothing else: all requested OECD series (HPI_YDH + RHP × 13 areas),
   the MLIT long housing-starts history (1948–2025) and the 地価公示 2026
   residential average prices (全国 + 東京都) were obtained and are quoted above.
