# Chapter 01 — Audit Evidence Register

Structured register of the independent research audit (2026-10-25). One row per
verified figure group. **OV** = value in the original source; **WV** = value on the
website; **Outcome** per the classification rules (PASS / FAIL / INCONCLUSIVE /
NOT COMPARABLE). Re-fetch evidence lives in `research/chapter01/raw/audit-2026-10-25/`
(workspace-only). All source URLs were live-checked on 2026-10-25.

Legend for sources: **S1** 2025 Census basic tabulation summary (stat.go.jp, pub
2026-09-29) · **S2** 2025 Census outline · **S3** 統計トピックス No.149 (2026-09-20) ·
**S4** Statistical Handbook of Japan 2026 (2026-09) · **S5** Population Estimates
Oct-2026 report (2026-10-20) · **S6** 2025 Vital Statistics final overview
(2026-09-30) · **S7** 2025 abridged life tables (2026-07-24) · **S8** 2025 vital
provisional annual (2026-06-03) · **S9** IPSS 2023 projections (2023-04-26) ·
**S10** Internal Migration 2025 (2026-02-03) · **S11** World Bank WDI API
(lastupdated 2026-10-08) · **S12** 2021 annual estimates (2022-04).

---

## A. Population (S1 https://www.stat.go.jp/data/kokusei/2025/kekka/pdf/summary_01.pdf · S5 https://www.stat.go.jp/data/jinsui/pdf/202610.pdf)

| # | Indicator | Ref | OV (source) | WV (site) | Outcome |
|---|---|---|---|---|---|
| A1 | Census total 1920 | 1920-10-01 | 55,963,053 | 55,963,053 | PASS |
| A2 | Census total 1930 / 1935 | 1930 / 1935 | 64,450,005 / 69,254,148 | same | PASS |
| A3 | Census total 1940 (wartime corr.) | 1940-10-01 | 71,932,987 (footnote 1) | same | PASS |
| A4 | Census total 1945 (wartime corr.) | 1945-11-01 | 72,147,291 (footnote 2) | same | PASS |
| A5 | Census totals 1925/1950/1955/1960/1965/1970/1975/1980/1985/1990/1995/2000/2005/2010/2015/2020 | census yrs | 59,736,822 / 84,114,574 / 90,076,594 / 94,301,623 / 99,209,137 / 104,665,171 / 111,939,643 / 117,060,396 / 121,048,923 / 123,611,167 / 125,570,246 / 126,925,843 / 127,767,994 / 128,057,352 / 127,094,745 / 126,146,099 | same | PASS |
| A6 | Census total 2025 + change | 2025-10-01 | 122,972,528; −3,173,571 (−2.5%, −0.51%/yr) | same | PASS |
| A7 | Largest 5-yr census decline claim | 2020–25 | prev max −962,607 (2010–15) | claim holds | PASS |
| A8 | Japanese population 2025 | 2025-10-01 | 119,132 thousand (96.9%; −3.5% vs 2020) | 1億1913万2千人 (96.9%) | PASS |
| A9 | Foreign population 2025 | 2025-10-01 | 3,840,039 (3.1%; +39.8% vs 2020) | 384万039人 (3.1%) | PASS |
| A10 | Estimate, Oct 1 2026 (provisional) | 2026-10-01 | 1億2269万人; ▲53万 (▲0.43%) | same | PASS |
| A11 | Japanese est., May 1 2026 (final) | 2026-05-01 | 1億1883万8千人; ▲85万5千 (▲0.71%) | 11,883万8千人 (▲85万5千) | PASS |
| A12 | Foreign est., May 1 2026 (final) | 2026-05-01 | 397万4千人; +32万5千 (+8.90%) | 397万4千人 (+32万5千) | PASS |
| A13 | "Oct 1 2020 estimate = 126,226,568" | 2020-10-01 | **not found in any accessible official source** (S12 shows 2020 = 126,146 thousand, census benchmark; 2020 annual URLs 404) | chart note + callout (JA/EN) | **INCONCLUSIVE → remediated** (replaced with A14) |
| A14 | Estimate vs census, 2025 pair (remediation) | 2025-09-15 / 2025-10-01 | 12,321万人 (S3 表2) / 122,972,528 (S1) | 1億2,321万人 / 1億2,297万2,528人 | PASS (new surface) |
| A15 | Tokyo +1.3%, 46 prefectures decline | 2025 census | 「東京都を除く46道府県で人口減少」 | same | PASS |
| A16 | Tokyo 14.237M (11.6%); metro 36.975M (30.1%) | 2025 census | outline values | same | PASS |

## B. Vital statistics (S6 https://www.mhlw.go.jp/toukei/saikin/hw/jinkou/kakutei25/dl/05_gaikyouR07.pdf · S8)

| # | Indicator | Ref | OV | WV | Outcome |
|---|---|---|---|---|---|
| B1 | Births 2025 | CY2025 | 671,270 (明治32年以来最少) | 67万1,270人 | PASS |
| B2 | Births 2024 | CY2024 | 686,173 | 68万6,173人 | PASS |
| B3 | Births peak 1949 | CY1949 | 2,696,638 (max of 124-yr series) | 269万6,638人 | PASS |
| B4 | Full births series 1899–2025 (124 yrs) | series | 第2表 (re-parsed; extractor byte-identical) | data.ts VITAL_BIRTHS | PASS |
| B5 | Deaths 2025 | CY2025 | 1,589,533 (５年ぶりの減少) | 158万9,533人 | PASS |
| B6 | Deaths 2024 / peak | CY2024 | 1,605,378 (過去最多) | 160万5,378人 | PASS |
| B7 | Full deaths series | series | 第2表 | data.ts VITAL_DEATHS | PASS |
| B8 | Natural decrease 2025 | CY2025 | △918,263 (19年連続マイナス) | ▲91万8,263人 | PASS |
| B9 | **Largest natural decrease = 2024** | CY2024 | △919,205 「過去最大の減少」; 2025 「マイナス幅が縮小」 | 2024年▲91万9,205人 | PASS (previously corrected claim, correctly stated) |
| B10 | Natural decrease first year 2005 | CY2005 | △21,266; 2006 +8,223 | ▲2万1,266人 / 2006 +8,223 | PASS |
| B11 | Marriages 1972 / 2000 / 2023 / 2024 / 2025 | CY | 1,099,984 / 798,138 / 474,741 / 485,092 / 489,158 | same | PASS |
| B12 | Mean age at first marriage 2025 (概数) | CY2025 | 夫31.0歳 / 妻29.7歳 | 31.0 / 29.7 (暫定値) | PASS |
| B13 | 1944–46 omission; Okinawa 1947–72; occurrence basis | coverage | source note 1 | chart note + limitations | PASS |
| B14 | Vital rates 2025 (per 1,000) | CY2025 | birth 5.6; death 13.3; natural △7.7; marriage 4.1; divorce 1.50 | quoted in notes/sources only | PASS |

## C. Fertility (S6 第3表)

| # | Indicator | Ref | OV | WV | Outcome |
|---|---|---|---|---|---|
| C1 | TFR 2025 | CY2025 | 1.14 (過去最低; Nov-2026 recalculation caveat official) | 1.14 + caveat | PASS |
| C2 | TFR 1947 | CY1947 | 4.54 | 4.54 | PASS (previously corrected claim) |
| C3 | TFR milestones | 2005/2015/2020/2021/2022/2023/2024 | 1.26 / 1.45 / 1.33 / 1.30 / 1.26 / 1.20 / 1.15 | same | PASS |
| C4 | TFR full series 1947–2025 (79 pts) | series | 第3表 column | data.ts TFR | PASS |
| C5 | TFR definition (15–49 ASFR sum) | definition | MHLW methodology | §4 text | PASS |

## D. Aging / age structure / households (S3, S4, S9, S1)

| # | Indicator | Ref | OV | WV | Outcome |
|---|---|---|---|---|---|
| D1 | 65+ share, observed 1950–2026 (17 pts) | Sep-15 estimates | 4.9 → 29.6 (表2) | AGING_SHARE_65_OBSERVED | PASS |
| D2 | 75+ share, observed (17 pts) | Sep-15 estimates | 1.3 → 17.7 | AGING_SHARE_75_OBSERVED | PASS |
| D3 | 65+/75+ projected 2030–2050 (5+5 pts) | IPSS medium | 30.8→37.1 / 18.8→23.2 (表2 + xlsx) | AGING_SHARE_*_PROJECTED | PASS |
| D4 | 2026 elderly composition | 2026-09-15 | 65+ 3624万; 75+ 2168万; 80+ 1288万; 85+ 720万 | same | PASS |
| D5 | 65+ population peak 39.53M (2043) | IPSS | press release | §6 | PASS |
| D6 | Japan highest, 39 countries ≥40M | 2026 | 29.6% (Italy 25.6, Germany 24.2, France 22.9 — UN WPP via bureau) | §8 | PASS (as attributed) |
| D7 | Census 2025 age structure | 2025-10-01 | 0–14 1334万9千 (10.9%); 15–64 7348万1千; 65+ 3614万2千 (29.4%) | §7 | PASS |
| D8 | **Average household size 1960–2025** | census yrs | Table 2.3: 4.14, 3.41, 3.28, **3.22**, 3.14, 2.99, 2.82, 2.67, 2.55, 2.42, 2.33, 2.21; 2025 census: 2.10 | 1980 was 2.30 → corrected to 3.22 | **FAIL → corrected** |
| D9 | Ordinary households 2025 | 2025-10-01 | 57,181,619 (+1,476,670) | 5718万1,619世帯 (+147万7千) | PASS |
| D10 | One-person households 2025 | 2025-10-01 | 23,689,024 = 41.4% (38.0% in 2020, +12.0%) | 2368万9,024世帯 = 41.4% | PASS |
| D11 | One-person series 2005–2020 | handbook Fig 2.3 | 29.5 / 32.4 / 34.6 / 38.1 | same (2020: 38.1 handbook vs 38.0 census vintage — now disclosed) | PASS + disclosure |
| D12 | Nuclear-family share 2020 | 2020 census | 54.2% | §9 | PASS |
| D13 | Elderly households 2020 | 2020 census | 22.66M = 40.7%; one-person elderly 6.72M | §9 | PASS |
| D14 | Never-married at 50, 2020 | 2020 census | M 28.3% / F 17.8% | §9 | PASS |
| D15 | IPSS household projections | 2030/2033/2050 | 57.73M peak; <2.0 avg; 44.3% | §9 callout | PASS |
| D16 | WB age structure, Japan (3 × 66 pts) | 1960–2025 | live API spot checks exact (5 pts × 3 series) | data.ts WB_* | PASS |

## E. Migration (S10 https://www.stat.go.jp/data/idou/2025np/jissu/youyaku/index.html)

| # | Indicator | Ref | OV | WV | Outcome |
|---|---|---|---|---|---|
| E1 | Tokyo net in-migration | 2025 | ６万5219人 (most) | 6万5,219人 | PASS |
| E2 | Tokyo metro net in-migration | 2025 | 12万3534人 (−1万2309 YoY) | 12万3,534人 (▲1万2,309) | PASS |
| E3 | Japanese-movers metro surplus | 2025 | 11万2738人, 30年連続 | 30年連続 | PASS |
| E4 | Inter-municipal moves | 2025 | 519万548人 (−0.3%) | 519万548人 | PASS |

## F. Projections (S9 https://www.ipss.go.jp/pp-zenkoku/j/zenkoku2023/db_zenkoku2023/s_tables/1-1.xlsx + press release)

| # | Indicator | Ref | OV | WV | Outcome |
|---|---|---|---|---|---|
| F1 | Medium totals, 5-yr steps (11 pts) | 2020–2070 | 126,146.099k → 86,996.009k | IPSS_MEDIUM_TOTAL | PASS |
| F2 | 65+ share to 2070 | 2070 | 38.7% | 38.7% | PASS |
| F3 | Below 100M | 2056 | press (2056 = 99,654.279k) | 2056年 | PASS |
| F4 | 2070 share of 2020 | 2070 | 69.0% (press) | 69.0% (calc 68.96%) | PASS |
| F5 | TFR assumption | 2025→2070 | 1.2713 → 1.3573 | same | PASS |
| F6 | LE assumption | 2070 | M 85.89 / F 91.94 | same | PASS |
| F7 | Net migration assumption | 2022–2040 | 163,791/yr (81,570+82,221) | 16万3,791人/年 | PASS |
| F8 | High/low variants | 2070 | 95.49M / 80.24M | same | PASS |
| F9 | 2025 projection vs census | 2025 | 123,262,448 vs 122,972,528 (−289,920) | 約29万人下回る | PASS |

## G. Life expectancy (S7 https://www.mhlw.go.jp/toukei/saikin/hw/life/life25/dl/life25-09.pdf)

| # | Indicator | Ref | OV | WV | Outcome |
|---|---|---|---|---|---|
| G1 | LE 2025 | CY2025 | M 81.35 / F 87.33 | same | PASS |
| G2 | LE 2024 / 2023 / 2020 / 1980 / 1947 | CY | 81.09/87.13; 81.09/87.14; 81.56/87.71; 73.35/78.76; 50.06/53.96 | same | PASS |
| G3 | LE full series 1947–2025 (79 × 2) | series | 参考資料2 | data.ts LIFE_EXPECTANCY_* | PASS |
| G4 | Male–female gap 2025 | CY2025 | 5.98年 | 5.98年 | PASS |
| G5 | Female world #1 (as published) | 2025 | ranking table: female 1st, male 7th | 公表されている (hedged) | PASS |

## H. International comparisons (S11 https://api.worldbank.org/v2, lastupdated 2026-10-08)

All 39 comparison values re-fetched live on 2026-10-25 and matched at exact float
equality (transcript: `raw/audit-2026-10-25/wb_live_values.txt`).

| # | Indicator (year) | Economies verified | OV range | WV | Outcome |
|---|---|---|---|---|---|
| H1 | SP.DYN.TFRT.IN (2024) | 13/13 | KOR 0.748 … USA 1.6265 | identical | PASS |
| H2 | SP.POP.65UP.TO.ZS (2025) | 13/13 | JPN 29.9940966737423 … SGP 14.2110377720053 | identical | PASS |
| H3 | SP.DYN.LE00.IN (2024) | 13/13 | SWE 84.0634146341463 … USA 78.890243902439 | identical | PASS |
| H4 | Japan series spot checks | 5 pts × 4 indicators | 1960/1980/2000/2020/2025 | identical | PASS |
| H5 | National-vs-WDI dual citation | 2025/2026 | 29.6% (bureau) vs 30.0% (WDI) | both shown with attribution | PASS |
| H6 | Taiwan exclusion | coverage | WDI does not cover Taiwan | stated | PASS |

---

## Register totals

**62 figure groups: 59 PASS · 1 FAIL (corrected) · 1 INCONCLUSIVE (remediated) ·
1 PASS with disclosure added. 0 NOT COMPARABLE** (no incompatible-definition
comparison was found in the chapter).
