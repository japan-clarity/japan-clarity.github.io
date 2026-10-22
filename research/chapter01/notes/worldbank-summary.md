# World Bank API — Summary Notes (Chapter 01: Population & Family)

- **Access date:** 2026-10-22 (all curl fetches performed this date)
- **API:** `https://api.worldbank.org/v2` — all responses HTTP 200
- **API `lastupdated` value (in every data response):** `2026-10-08`
- **License:** CC BY 4.0 — <https://creativecommons.org/licenses/by/4.0/>
- **Dataset/source (all indicators used):** "World Development Indicators" (source id `2`)

## Source / organization attribution strings (verbatim from META-*.json)

| Indicator | `source` | `sourceOrganization` (verbatim) |
|---|---|---|
| SP.DYN.TFRT.IN | World Development Indicators | `World Population Prospects, United Nations (UN), publisher: UN Population Division;`<br>`Statistical databases and publications from national statistical offices, National Statistical Offices (NSOs);`<br>`Demographic Statistics, Eurostat (ESTAT)` |
| SP.POP.65UP.TO.ZS | World Development Indicators | `World Population Prospects, United Nations (UN), publisher: UN Population Division` |
| SP.DYN.LE00.IN | World Development Indicators | `World Population Prospects, United Nations (UN), uri: UN Population Division;`<br>`Statistical databases and publications from national statistical offices, National Statistical Offices (NSOs), note: Derived from male and female life expectancy at birth from sources such as statistical databases and publications from national statistical offices.;`<br>`Demographic Statistics, Eurostat (ESTAT), note: Derived from male and female life expectancy at birth from sources such as Eurostat: Demographic Statistics.` |
| SP.POP.TOTL | World Development Indicators | `World Population Prospects, United Nations (UN), uri: https://population.un.org/wpp/, publisher: UN Population Division;`<br>`Statistical databases and publications from national statistical offices, National Statistical Offices (NSOs), uri: https://unstats.un.org/home/nso_sites/, publisher: National Statistical Offices;`<br>`Eurostat: Demographic Statistics, Eurostat (ESTAT), uri: https://ec.europa.eu/eurostat/data/database?node_code=earn_ses_monthly, publisher: Eurostat;`<br>`Population and Vital Statistics Report (various years), United Nations (UN), uri: https://unstats.un.org, publisher: UN Statistics Division` |

Attribution line for the site: *Source: World Bank, World Development Indicators (API lastupdated 2026-10-08), accessed 2026-10-22, CC BY 4.0. Underlying series compiled by the World Bank from UN World Population Prospects, National Statistical Offices, Eurostat, and the UN Statistics Division (per-indicator attribution above).*

## Japan (JPN) — key values (exact, no rounding; from JPN-*.json, 1960–2025, 66 records each)

| Indicator | Latest year with data | Exact value | Null years |
|---|---|---|---|
| SP.POP.TOTL (Population, total) | 2025 | `123366734` | none (1960–2025 complete) |
| SP.DYN.CBRT.IN (Crude birth rate, per 1,000) | 2024 | `5.7` | 2025 |
| SP.DYN.CDRT.IN (Crude death rate, per 1,000) | 2024 | `13.3` | 2025 |
| SP.DYN.TFRT.IN (Fertility rate, total) | 2024 | `1.15` | 2025 |
| SP.POP.65UP.TO.ZS (65+ % of pop.) | 2025 | `29.9940966737423` | none |
| SP.POP.0014.TO.ZS (0–14 % of pop.) | 2025 | `11.2383980634698` | none |
| SP.POP.1564.TO.ZS (15–64 % of pop.) | 2025 | `58.7675052627879` | none |
| SP.DYN.LE00.IN (Life expectancy at birth, total) | 2024 | `84.0363414634146` | 2025 |
| SP.DYN.LE00.MA.IN (Life expectancy, male) | 2024 | `81.09` | 2025 |
| SP.DYN.LE00.FE.IN (Life expectancy, female) | 2024 | `87.13` | 2025 |
| SP.POP.GROW (Population growth, annual %) | 2025 | `-0.492142838725375` | 1960 |

### Derived facts (computed only from values literally present in saved files)

- **Total population peak:** `128070000` in **2010** (SP.POP.TOTL; neighbors: 2008 `128063000`, 2009 `128047000`, 2011 `127833000`, 2012 `127629000`).
- **First year crude death rate exceeded crude birth rate (CDRT > CBRT):** **2005** (CBRT `8.4`, CDRT `8.6`). Verified full sequence 2004–2024: 2004 CBRT `8.8`/CDRT `8.2` (no); 2005 yes; 2006 CBRT `8.7`/CDRT `8.6` (brief reversal, no); from 2007 (CBRT `8.6`/CDRT `8.8`) onward CDRT > CBRT **every year** through 2024.
- Japan population fell below the 2010 peak permanently after 2011 (all values 2011–2025 are below `128070000`).

## International comparison (13 economies; from COMPARE-*.json, pages 1–3)

Countries: JPN, KOR, SGP, AUS, NZL, DEU, FRA, SWE, NLD, CAN, GBR, USA, ITA.

**Latest year in which ALL 13 countries have data:**

- SP.DYN.TFRT.IN → **2024** (2025 is null for all 13 countries)
- SP.DYN.LE00.IN → **2024** (2025 is null for all 13 countries)
- SP.POP.65UP.TO.ZS → **2025** (no nulls anywhere in the 858 records)
- SP.POP.TOTL → **2025** (no nulls anywhere in the 858 records)

No country's own latest data year differs from these common years (all 13 reach exactly 2024 for TFRT/LE00 and exactly 2025 for 65UP/TOTL).

### Comparison table — exact values (no rounding)

| Country | TFR 2024<br>(births/woman) | 65+ share 2025<br>(% of pop.) | Life expectancy 2024<br>(years, total) | Population 2025<br>(total) |
|---|---|---|---|---|
| JPN Japan | `1.15` | `29.9940966737423` | `84.0363414634146` | `123366734` |
| KOR Korea, Rep. | `0.748` | `20.3304188408974` | `83.6292682926829` | `51684564` |
| SGP Singapore | `0.97` | `14.2110377720053` | `83.3463414634146` | `6111175` |
| AUS Australia | `1.481` | `18.0930147394386` | `83.0512195121951` | `27614411` |
| NZL New Zealand | `1.57` | `17.6093066526984` | `82.009756097561` | `5324700` |
| DEU Germany | `1.36` | `23.7031981458429` | `80.7926829268293` | `83491249` |
| FRA France | `1.61` | `22.5418906984086` | `82.9804878048781` | `68720337` |
| SWE Sweden | `1.43` | `20.9127967529707` | `84.0634146341463` | `10596620` |
| NLD Netherlands | `1.43` | `20.8687702211484` | `81.9658536585366` | `18087633` |
| CAN Canada | `1.25` | `20.2603673865917` | `82.1080487804878` | `41651653` |
| GBR United Kingdom | `1.551` | `19.7026932546935` | `81.3868536585366` | `69487000` |
| USA United States | `1.6265` | `18.387224828496` | `78.890243902439` | `341784857` |
| ITA Italy | `1.18` | `25.0981380733118` | `83.9512195121951` | `58915656` |

Notable (verifiable from the table above): Japan has the highest 65+ share (2025) and the lowest fertility except KOR and SGP (2024).

## All nulls (missing values) — complete list

**Japan files (JPN-*.json):**

- `JPN-SP.DYN.CBRT.IN.json`: 2025 = null
- `JPN-SP.DYN.CDRT.IN.json`: 2025 = null
- `JPN-SP.DYN.TFRT.IN.json`: 2025 = null
- `JPN-SP.DYN.LE00.IN.json`: 2025 = null
- `JPN-SP.DYN.LE00.MA.IN.json`: 2025 = null
- `JPN-SP.DYN.LE00.FE.IN.json`: 2025 = null
- `JPN-SP.POP.GROW.json`: 1960 = null (growth needs a base year)
- `JPN-SP.POP.TOTL.json`, `JPN-SP.POP.65UP.TO.ZS.json`, `JPN-SP.POP.0014.TO.ZS.json`, `JPN-SP.POP.1564.TO.ZS.json`: no nulls (66/66 years)

**Comparison files (COMPARE-*.json + pages 2–3, 858 records each indicator):**

- `COMPARE-SP.DYN.TFRT.IN*.json`: 2025 = null for ALL 13 countries (13 nulls; every other year 1960–2024 non-null)
- `COMPARE-SP.DYN.LE00.IN*.json`: 2025 = null for ALL 13 countries (13 nulls)
- `COMPARE-SP.POP.65UP.TO.ZS*.json`: 0 nulls
- `COMPARE-SP.POP.TOTL*.json`: 0 nulls

## Limitations (recorded honestly)

- **Taiwan is NOT in the World Bank dataset.** Verified on 2026-10-22: `GET /v2/country/TWN?format=json` → `{"message":[{"id":"120","key":"Invalid value","value":"The provided parameter value is not valid"}]}`; the full country list (296 economies, saved as `COUNTRY-LIST.json`) contains no TWN entry. Taiwan is therefore excluded from all comparison tables and is **never estimated**.
- Batched 13-country calls return `total: 858` over **3 pages** at `per_page=300`; page 1 alone contains only AUS→GBR (5 economies). All 3 pages were fetched and saved (`COMPARE-<CODE>.json`, `-p2`, `-p3`).
- Vital-statistics-derived indicators (CBRT, CDRT, TFRT, LE00 family) lag one year behind population-stock indicators: latest = 2024 vs 2025. This is an API data-availability fact, not an error.
- Values are reported exactly as returned by the API (no rounding). Percentage-share indicators carry many decimal places (e.g. `29.9940966737423`); round only at display time, never in stored data.

## Raw file inventory (all under `research/chapter01/raw/worldbank/`)

- `JPN-<CODE>.json` × 11 (single-country full history, `per_page=200`, 1 page)
- `COMPARE-<CODE>.json` + `COMPARE-<CODE>-p2.json` + `COMPARE-<CODE>-p3.json` × 4 codes (13-country, `per_page=300`, 3 pages each)
- `META-<CODE>.json` × 4 (indicator metadata incl. `source` and `sourceOrganization`)
- `COUNTRY-TWN-check.json` (Taiwan absence evidence), `COUNTRY-LIST.json` (296 economies)

Reproduction script: `research/chapter01/scripts/fetch-worldbank.sh` (exact curl commands, `--max-time 30`).
Machine-readable extraction: `research/chapter01/notes/worldbank-extracted.json` (aligned year/value arrays; nulls preserved).
