# OECD Productivity Database + World Bank WDI — Chapter 02 research summary

## OECD Productivity Database (GDP per hour worked)

- **Agency:** OECD Statistics and Data Directorate (SDD), Trade, Production and Entrepreneurship Division
- **Dataflow:** OECD.SDD.TPS:DSD_PDB@DF_PDB(2.0) 「Productivity database」 (queried via
  https://sdmx.oecd.org/public/rest/data/ on 2026-10-25; dataflow definition archived as
  raw/oecd/oecd-dataflow-def.json, sha256 df70a255df77…)
- **Query keys used (both HTTP 200):**
  - current levels: `OECD.SDD.TPS,DSD_PDB@DF_PDB,2.0/{12 areas}.A.GDPHRS._T.USD_PPP_H.V.N._Z.PPP?format=csvfilewithlabels`
  - volume trend: same with PRICE_BASE=LR (chain-linked volume, rebased; BASE_PER=2020 on every row)
- **Coverage:** 12 economies (JPN, KOR, AUS, NZL, DEU, FRA, GBR, ITA, NLD, SWE, CAN, USA);
  JPN/FRA 1970–2025; KOR/NLD 1995–; AUS 1994–; USA 1987–. **SGP is NOT in OECD PDB**
  (probed: 404 NoRecordsFound) — Singapore therefore appears only in World Bank comparisons.
- **License/terms:** OECD data are published under open terms permitting reproduction with
  attribution ("Source: OECD Productivity Statistics"); CSV responses archived under raw/oecd/.
- **Anchors (2025, current prices, USD per hour PPP):** JPN 61.77 (lowest of the 12),
  KOR 62.46, NZL 63.66, CAN 76.81, ITA 80.36, GBR 85.56, AUS 86.85, FRA 96.05,
  SWE 100.76, DEU 102.69, USA 104.74, NLD 105.51. JPN volume series (2020=100):
  1970 = 14.86 → 1990 = 33.51 → 2010 = 46.25 → 2025 = 53.02.
- **Comparability caveats (documented on the site):** GDP per hour worked uses OECD-complied
  national accounts + labour input consistent with SNA 2008; PPP conversion reflects
  price-level differences (not market exchange rates); current-price levels are not
  comparable across time (use the volume series for trends); figures are OECD
  compilations that can differ from each country's own national statistics; annual
  updates revise history (the 2025 vintage is what was fetched).

## World Bank WDI (CC BY 4.0)

- **API:** https://api.worldbank.org/v2 (source id 2, 「World Development Indicators」);
  **vintage: meta.lastupdated = 2026-10-08 on every archived response.**
- **Fetch script:** research/chapter02/scripts/fetch-worldbank.sh (modeled on chapter 01's
  script; same 13 economies: JPN;KOR;SGP;AUS;NZL;DEU;FRA;SWE;NLD;CAN;GBR;USA;ITA).
- **License:** CC BY 4.0 — attribution string carried in CSV exports and the source register;
  raw JSON responses are committed under research/chapter02/raw/worldbank/ (redistribution
  permitted with attribution).
- **Indicators used:**
  - JPN full history: NY.GDP.MKTP.CD (current US$), NY.GDP.MKTP.KD.ZG (real growth %),
    NY.GDP.PCAP.PP.CD (per-capita GDP, current PPP int$), NV.IND.MANF.ZS (manufacturing
    value added % of GDP), NE.GDI.TOTL.ZS, NE.EXP.GNFS.ZS, NE.IMP.GNFS.ZS.
  - 13-economy comparison: NY.GDP.PCAP.PP.CD, NY.GDP.MKTP.KD.ZG, NV.IND.MANF.ZS.
- **Anchors:** JPN GDP/capita PPP 1990 = 20,331.1; 2025 = 55,421.9 int$ (2021-equivalent
  PPP base per WDI methodology). JPN GDP 2024 = 4,190.0 bn US$ (cross-validates ESRI
  国際比較表 4,186.9 bn ✓ within exchange-rate rounding), 2025 = 4,435.2 bn US$.
  JPN real GDP growth 2024 = −0.24% (cross-validates ESRI 増加率 −0.2% ✓), 2025 = +1.19%.
  JPN manufacturing share 1994 = 23.39% → 2024 = 18.82% (mirrors the ESRI activity-side
  23.4% → 19.0% ✓ same vintage family).
- **Comparability caveats (documented on the site):** WDI is a secondary compilation —
  national-accounts aggregates are re-based to international series with gaps filled;
  PPP figures use the 2021 ICP cycle; Taiwan is not covered by WDI (not included);
  SGP per-capita PPP (163,354 int$ in 2025) is an outlier among the 13 and is shown
  as-is with a note (city-state, no rural interior).

## Cross-source consistency checks performed

1. ESRI nominal GDP 2024 (USD, 国際比較表) 4,186.9 bn ≈ WB NY.GDP.MKTP.CD 2024 4,190.0 bn (Δ0.07%).
2. ESRI real GDP growth 2024 −0.2% ≈ WB 2024 −0.24% (rounding).
3. ESRI manufacturing VA share 2024 19.0% ≈ WB NV.IND.MANF.ZS 2024 18.82% (national vs
   re-based definitions; both disclosed).
4. OECD GDPHRS JPN current-PPP level ≈ 61.8 USD/h — consistent order of magnitude with
   GDP per capita ÷ annual hours worked; treated as a separate OECD-compiled product.
