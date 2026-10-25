import type { SourceRecord } from "@/lib/research/types";

/**
 * Chapter 02 source register — structured provenance for every dataset used
 * by this chapter. Verification happened on 2026-10-25 by fetching each
 * document directly from its official domain and reading the cited figures
 * inside the archived copies under `research/chapter02/raw/` (see
 * research/chapter02/notes/*.md for verbatim quotes and chain methods).
 */
export const chapter02Sources: SourceRecord[] = [
  {
    id: "esri-na-2024",
    organization: {
      ja: "内閣府 経済社会総合研究所（国民経済計算）",
      en: "Cabinet Office / ESRI (National Accounts)",
    },
    originalTitle: "2024年度（令和6年度）国民経済計算年次推計（2020年基準・2008SNA）",
    displayTitle: {
      ja: "国民経済計算年次推計 2024年度分（2025年12月23日公表）",
      en: "Annual Report on National Accounts 2024 (published 2025-12-23)",
    },
    url: "https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/2024_kaku_top.html",
    sourceLanguage: "ja",
    publicationDate: "2025-12-23",
    referencePeriod: "Calendar years 1994–2024 (main series, industry, employment); household account 1994–2024",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "十億円（名目・実質GDP、家計可処分所得）、％（成長率・構成比）、万人（就業者数）",
      en: "Billions of yen (nominal/real GDP, household disposable income), % (growth/shares), 10k persons (employment)",
    },
    verification: "verified-primary",
    license: {
      ja: "内閣府の公表資料。統計数値の出典を明示した上での引用・転載は内閣府の利用規約に従います。原資料（Excel/PDF）は本リポジトリで再配布していません。",
      en: "Cabinet Office publication; citation and reuse with attribution under the bureau's terms. Raw source files (Excel/PDF) are not redistributed in this repository.",
    },
    methodologyNotes: {
      ja: "2020年基準・2008SNAの年次推計確定値。暦年系列（1994–2024）。実質GDPは連鎖方式。産業別付加価値・就業者数は16経済活動分類を集計した第一次・第二次・第三次産業区分（内閣府の経済活動別分類に基づき当サイトで集計、公表値の「経済活動計」との一致を検証済み）。GDPデフレーターは2020暦年=100。",
      en: "Final annual estimates, 2020 base, 2008SNA. Calendar-year series (1994–2024); real GDP chain-linked. Industry value added and employment aggregate the 16-activity classification into primary/secondary/tertiary sectors (standard ESRI grouping, aggregated on this site and verified against the printed activity totals). GDP deflator: 2020=100.",
    },
    limitations: {
      ja: "年次推計は改訂される。2025暦年の年次確定値は未公表（2026年12月予定）。1994年より前の長期系列は旧基準・旧体系であり接続していません。生産側と支出側のGDPには統計上の不整合（不一致項目）があります。",
      en: "Annual estimates are revised. Calendar-2025 final estimates are not yet published (expected Dec 2026). Pre-1994 history exists only under older SNA bases and is not linked here. Production-side and expenditure-side GDP differ by the statistical discrepancy.",
    },
    evidenceFile: "research/chapter02/notes/esri-summary.md",
  },
  {
    id: "esri-na-2024-ref",
    organization: {
      ja: "内閣府 経済社会総合研究所（国民経済計算）",
      en: "Cabinet Office / ESRI (National Accounts)",
    },
    originalTitle: "2024年度国民経済計算年次推計 参考表「ＧＤＰの国際比較」「一人当たり名目目ＧＤＰ等」",
    displayTitle: {
      ja: "国民経済計算 参考表：GDPの国際比較・一人当たり名目GDP（2025年12月23日公表）",
      en: "National Accounts reference tables: GDP international comparison & per-capita nominal GDP (published 2025-12-23)",
    },
    url: "https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/sankou/pdf/kokusaihikaku_20251223.pdf",
    sourceLanguage: "ja",
    publicationDate: "2025-12-23",
    referencePeriod: "Calendar years 2005–2024 (USD conversions, world shares, OECD ranks)",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "主要国（日・米・独・中・英・仏・印ほか）", en: "Major economies (Japan, US, Germany, China, UK, France, India, …)" },
    statisticalUnit: {
      ja: "10億米ドル（名目GDP）、ドル（一人当たり名目GDP）、％（世界シェア）、位（OECD順位）",
      en: "Billions of USD (nominal GDP), USD (per-capita nominal GDP), % (world share), rank among OECD members",
    },
    verification: "verified-primary",
    license: {
      ja: "内閣府の公表資料。出典明示の上で引用。",
      en: "Cabinet Office publication; citation with attribution.",
    },
    methodologyNotes: {
      ja: "ESRIがIMF IFS・世界銀行WDI・中国統計年鑑2025を基に作成した参考表。暦年の名目GDPを市場為替で米ドル換算した値（PPPではない）。一人当たり名目GDP 2024年暦年＝33,785ドル、OECD加盟国中第24位。名目GDPの世界シェアは2005年10.2%→2024年3.8%。",
      en: "ESRI reference table compiled from IMF IFS, World Bank WDI and the China Statistical Yearbook 2025. Calendar-year nominal GDP converted at market exchange rates (not PPP). Per-capita nominal GDP CY2024 = USD 33,785, 24th among OECD members; world share of nominal GDP fell from 10.2% (2005) to 3.8% (2024).",
    },
    limitations: {
      ja: "市場為替レート換算のため円安・円高の影響を強く受ける（PPPベースの比較とは意味が異なる）。世界シェアの低下には名目成長の低迷と円安の両方が含まれる。",
      en: "Market-exchange-rate conversion is sensitive to yen depreciation/appreciation (different meaning from PPP comparisons). The fall in world share combines low nominal growth and yen weakness.",
    },
    evidenceFile: "research/chapter02/notes/esri-summary.md",
  },
  {
    id: "mhlw-mls-2025-final",
    organization: {
      ja: "厚生労働省（毎月勤労統計調査）",
      en: "Ministry of Health, Labour and Welfare (Monthly Labour Survey)",
    },
    originalTitle: "毎月勤労統計調査 全国調査 2025年分結果確報（賃金指数）",
    displayTitle: {
      ja: "毎月勤労統計調査 2025年分結果確報（2026年2月25日公表）",
      en: "Monthly Labour Survey 2025 annual final results (published 2026-02-25)",
    },
    url: "https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r07/25cr/25cr.html",
    sourceLanguage: "ja",
    publicationDate: "2026-02-25",
    referencePeriod: "Annual averages 2018–2025 (index, YoY, real YoY); vintage chain back to 1995",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "日本（全国・事業所規模5人以上）", en: "Japan (national, establishments with 5+ employees)" },
    statisticalUnit: {
      ja: "指数（2020年平均=100）・前年比％・実質前年比％（現金給与総額、調査産業計）",
      en: "Index (2020 average = 100), YoY %, real YoY % (total cash earnings, all survey industries)",
    },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典を明示した上での引用・転載は厚生労働省の利用規約に従います。",
      en: "MHLW publication; reuse with attribution under MHLW terms of use.",
    },
    methodologyNotes: {
      ja: "賃金指数・実質賃金指数（現金給与総額・調査産業計）。実質賃金は消費者物価指数（持家の帰属家賃を除く総合）で実質化。1995–2025年の連続指数は、公表された前年比を用いた成長連鎖（2020年=100に固定）であり、年次確報の複数のヴィンテージ（平成19年分・平成29年分・2025年分）にまたがって構成。2018–2023年は公表水準と一致。2024年1月分確報から2021年経済センサス基準の労働者数ベンチマーク更新が行われ、公表指数水準は約+2.6%上方に跳ぶ一方、公表前年比はベンチマーク更新の影響を除いて算出されるため指数水準から計算した増減率と一致しない（MHLW利用上の注意9）。当サイトの連結指数は公表前年比に基づくため、2024–25年の水準は公表指数（109.2/111.7）より約2.6%低い。",
      en: "Wage and real-wage indices (total cash earnings, all industries). Real wages are deflated by the CPI excluding imputed rent for owner-occupied housing. The 1995–2025 continuous index on this site is a growth-chain (anchored at 2020=100) built from PUBLISHED YoY values across annual-final vintages (2007, 2017 and 2025 finals); it matches published index levels for 2018–2023. From the Jan-2024 final, MHLW benchmark-updated worker weights to the 2021 Economic Census: raw published levels jump ≈ +2.6% while published YoY removes the benchmark effect by design (MHLW usage note 9) — hence our chained index sits ≈ 2.6% below the raw published levels for 2024–25 (109.2/111.7).",
    },
    limitations: {
      ja: "指数水準は基準改定・標本入替え・ベンチマーク更新をまたぐため直接比較できない。2018年の調査枠変更（個人業主等の除外）以前と以後は連結の前提が異なる。実質賃金指数の水準表は2018年以降公表されず（前年比のみ）、2018年以降の水準は前年比からの復元（派生値）。事業所規模5人以上の常用労働者が対象で、事業主・公務員等は含まない。",
      en: "Index levels are not directly comparable across rebasings, sample rotations and benchmark updates. The 2018 survey-frame change (exclusion of individual proprietors) alters the linking assumption. Real-wage index LEVELS are no longer published after 2018 (YoY only); post-2018 levels on this site are compounded from published YoY (derived). Covers regular employees at establishments with 5+ employees; proprietors and most civil servants are out of scope.",
    },
    evidenceFile: "research/chapter02/notes/mhlw-summary.md",
  },
  {
    id: "mhlw-mls-2026-08",
    organization: {
      ja: "厚生労働省（毎月勤労統計調査）",
      en: "Ministry of Health, Labour and Welfare (Monthly Labour Survey)",
    },
    originalTitle: "毎月勤労統計調査 全国調査 2026年8月分結果確報（賃金指数・国際比較）",
    displayTitle: {
      ja: "毎月勤労統計調査 2026年8月分結果確報（2026年10月23日公表）",
      en: "Monthly Labour Survey August 2026 final results (published 2026-10-23)",
    },
    url: "https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r08/2608r/2608r.html",
    sourceLanguage: "ja",
    publicationDate: "2026-10-23",
    referencePeriod: "Monthly January–August 2026; annual 2022–2025 (confirmed unrevised); international comparison 2022–2025",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "日本（全国）＋参考：米・英・独", en: "Japan (national); reference: US, UK, Germany" },
    statisticalUnit: {
      ja: "前年同月比％（名目・実質賃金）",
      en: "Year-on-year % (nominal and real earnings)",
    },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典明示の上で引用。",
      en: "MHLW publication; citation with attribution.",
    },
    methodologyNotes: {
      ja: "2026年1–8月の月次確報値（名目・実質賃金の前年同月比）。2026年1月の標本部分入替えに伴う断層は現金給与総額で−0.5%（MHLW公表の入替え検証）。国際比較表（時系列第6表）は、日本＝毎勤の名目賃金指数を総合CPIで実質化、米国＝BLS/CESの実質時給、英国＝ONS/MWSSの実質週給、独国＝デスタティスの実質月給を引用。",
      en: "Monthly final figures, Jan–Aug 2026 (nominal/real earnings YoY). The Jan-2026 sample rotation created a −0.5% level break in total cash earnings (MHLW's own rotation check). The international comparison table quotes: Japan = MLS nominal index deflated by headline CPI; US = BLS CES real average hourly earnings; UK = ONS MWSS real weekly pay; Germany = Destatis real monthly earnings.",
    },
    limitations: {
      ja: "速報値は確報で改訂される場合がある。8月分確報時点で2022–2025年の年次指数は未改訂であることを確認済み。国際比較は各国の公表ヘッドラインの引用であり、調査設計・物価指数の定義が異なるため厳密な横断比較ではない。",
      en: "Preliminary figures may be revised in finals. At the Aug-2026 final, the 2022–2025 annual indices were confirmed unrevised. The international comparison quotes each country's published headline; survey designs and CPI definitions differ, so it is not a strictly harmonized comparison.",
    },
    evidenceFile: "research/chapter02/notes/mhlw-summary.md",
  },
  {
    id: "statb-lfs-2026",
    organization: {
      ja: "総務省統計局（労働力調査）",
      en: "Statistics Bureau, MIC (Labour Force Survey)",
    },
    originalTitle: "労働力調査 長期時系列データ 表2 就業状態別15歳以上人口（年平均）",
    displayTitle: {
      ja: "労働力調査 長期時系列データ（2026年10月取得・2025年平均まで収録）",
      en: "Labour Force Survey long time-series data (fetched 2026-10; includes 2025 annual averages)",
    },
    url: "https://www.stat.go.jp/data/roudou/long/index.html",
    sourceLanguage: "ja",
    publicationDate: "2026-10-02",
    referencePeriod: "Annual averages 1953–2025 (total employed); latest monthly 2026-08",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "万人（就業者数・男女計）",
      en: "10k persons (employed, both sexes)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典を明示した上での転載・再利用は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; reuse with attribution under the bureau's terms of use.",
    },
    methodologyNotes: {
      ja: "ILO互換の就業者定義に基づく長期時系列（e-Stat経由で取得）。本章では雇用の長期文脈（1953年3,913万人→2025年6,828万人）の叙述に使用。産業別の図表はSNAと同じ定義連続性を持たせるため内閣府の経済活動別就業者数を使用。",
      en: "Long series on the ILO-compatible 'employed persons' definition (fetched via e-Stat). Used in this chapter for long-run employment context (39.13M in 1953 → 68.28M in 2025). Industry-level charts use the Cabinet Office's SNA activity-side employment for definitional consistency with the value-added series.",
    },
    limitations: {
      ja: "産業別長期系列は日本標準産業分類の3回の改定をまたぎ、公式の3部門合計行は存在しない。本章では産業別にはLFSを使用していない。",
      en: "The industry-level long series chains three JSIC revisions and has no official three-sector aggregate rows; this chapter therefore does not use LFS for industry breakdowns.",
    },
    evidenceFile: "research/chapter02/notes/statb-summary.md",
  },
  {
    id: "statb-rd-2025",
    organization: {
      ja: "総務省統計局（科学技術研究調査）",
      en: "Statistics Bureau, MIC (R&D Survey)",
    },
    originalTitle: "2025年（令和7年）科学技術研究調査 結果の概要 表1-2 研究費、ＧＤＰの推移",
    displayTitle: {
      ja: "科学技術研究調査 2025年調査 結果の概要（2025年12月12日e-Stat公開）",
      en: "R&D Survey 2025 round, Summary of Results (e-Stat release 2025-12-12)",
    },
    url: "https://www.stat.go.jp/data/kagaku/kekka/kekkagai/pdf/2025ke_gai.pdf",
    sourceLanguage: "ja",
    publicationDate: "2025-12-12",
    referencePeriod: "Fiscal years 2015–2024 (this release); 2005–2014 from the 2015-round summary",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "億円（研究費・GDP）、％（対GDP比）",
      en: "100M yen (R&D expenditure, GDP), % (ratio to GDP)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典の表記（例：「科学技術研究調査結果」（総務省統計局））をお願いします。",
      en: "Statistics Bureau publication; attribution requested (e.g. 'R&D Survey Results', Statistics Bureau, MIC).",
    },
    methodologyNotes: {
      ja: "対GDP比は2005–2024年度の2つの公表ウィンドウをつないで掲載：2015–2024年度は2025年調査の表1-2（GDP＝内閣府2024年度年次推計、2025年12月8日公表）、2005–2014年度は2015年調査結果の概要の表2（GDP＝平成26年度国民経済計算確報）。研究費・GDP・比率はすべて公表値どおり（A/B×100と比率の一致を各年で検証済み）。",
      en: "The ratio-to-GDP series joins two published windows: FY2015–2024 from the 2025-round table 1-2 (GDP = Cabinet Office 2024 annual estimates, released 2025-12-08) and FY2005–2014 from the 2015-round summary table 2 (GDP = the FY2014-final national accounts vintage). All values are as published (A/B×100 verified against the printed ratio for every year).",
    },
    limitations: {
      ja: "2014年度→2015年度の境界はGDPヴィンテージが異なる（旧確報ベース→年次推計ベース）ため、比率の水準の連続性は保証されない（研究費自体はほぼ横ばいでも比率が3.87%→3.43%に下がる）。機械可読な研究費系列のオンライン提供は1995年度まで遡るのみ。",
      en: "The FY2014→FY2015 boundary crosses GDP vintages (old final accounts → annual estimates), so ratio-level continuity is not guaranteed (R&D itself is nearly flat while the ratio steps from 3.87% to 3.43%). Machine-readable R&D series online reach back only to FY1995.",
    },
    evidenceFile: "research/chapter02/notes/statb-summary.md",
  },
  {
    id: "oecd-pdb-2026",
    organization: {
      ja: "OECD（生産性データベース）",
      en: "OECD (Productivity Statistics)",
    },
    originalTitle: "OECD Productivity Statistics: GDP per hour worked (DSD_PDB@DF_PDB v2.0)",
    displayTitle: {
      ja: "OECD生産性統計：時間当たりGDP（2026年10月25日取得）",
      en: "OECD Productivity Statistics: GDP per hour worked (fetched 2026-10-25)",
    },
    url: "https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_PDB@DF_PDB,2.0/JPN.A.GDPHRS._T.USD_PPP_H.V.N._Z.PPP?format=csvfilewithlabels",
    sourceLanguage: "en",
    publicationDate: "2026-10-25",
    referencePeriod: "Current-price levels 1970–2025 by economy; Japan chain-linked volume levels 1970–2025 (USD PPP/hour, 2020 reference year)",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "OECD加盟12か国＋パートナー（日本・韓国ほか）", en: "12 OECD members and partners (Japan, South Korea, …)" },
    statisticalUnit: {
      ja: "米ドル/時間（PPP換算）。現在価格は国際比較用の水準、連鎖実質（2020年基準）は時間軸比較用の水準系列 — いずれも指数ではない",
      en: "USD per hour (PPP-converted). Current prices are levels for cross-country comparison; the chain-linked volume series (2020 reference year) is a level series for comparison over time — neither is an index",
    },
    verification: "verified-secondary",
    license: {
      ja: "OECDデータは出典を明示した上での再利用・引用が認められています（Source: OECD Productivity Statistics）。取得時点のCSV応答を研究フォルダに保管。",
      en: "OECD data may be reused and quoted with attribution (Source: OECD Productivity Statistics). CSV responses at fetch time archived under research/chapter02/raw/oecd/.",
    },
    methodologyNotes: {
      ja: "時間当たりGDP（全経済活動）。現在価格・PPP換算の水準は国際比較用、2020年基準の連鎖実質系列は趨勢用に使用。SDMX APIからCSVで取得（クエリURLは出典欄のとおり、12経済を一括取得）。シンガポールは本データベースに含まれない。",
      en: "GDP per hour worked, total economy. Current-price PPP levels are used for comparisons and the chain-linked volume series (2020 base) for trends; data fetched as CSV from the SDMX API (query URL above; 12 economies in one call). Singapore is not covered by this database.",
    },
    limitations: {
      ja: "OECDによる編集値であり、各国の国内統計とは基準・改訂方針が異なる。PPPは価格構造の違いを反映する推計であり、為替レート換算と意味が異なる。現在価格の水準は年々の価格変動を含むため時間軸比較には実質系列を用いる。年次更新で遡及改訂される。",
      en: "OECD-compiled figures differ from each country's own statistics in benchmarks and revision policy. PPP reflects estimated price-level differences, not market exchange rates. Current-price levels embed price changes over time — use the volume series for trends. Annual updates revise history.",
    },
    evidenceFile: "research/chapter02/notes/oecd-worldbank-summary.md",
  },
  {
    id: "wb-wdi-2026-10",
    organization: {
      ja: "世界銀行（世界開発指標 WDI）",
      en: "World Bank (World Development Indicators)",
    },
    originalTitle: "World Development Indicators (API, lastupdated 2026-10-08)",
    displayTitle: {
      ja: "世界銀行 WDI API（2026年10月8日更新版、2026年10月25日取得）",
      en: "World Bank WDI API (vintage 2026-10-08, fetched 2026-10-25)",
    },
    url: "https://api.worldbank.org/v2/country/JPN/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=200",
    sourceLanguage: "en",
    publicationDate: "2026-10-08",
    referencePeriod: "Per-capita GDP PPP 1990–2025 (Japan) and 2025 (13 economies); real GDP growth 1961–2025; other indicators as labeled",
    accessDate: "2026-10-25",
    geographicCoverage: { ja: "日本＋比較13経済（韓国・シンガポール・豪・NZ・独・仏・スウェーデン・蘭・加・英・米・伊）", en: "Japan plus 13 comparison economies (KOR, SGP, AUS, NZL, DEU, FRA, SWE, NLD, CAN, GBR, USA, ITA)" },
    statisticalUnit: {
      ja: "現在国際ドル（一人当たりGDP・PPP）、％（実質GDP成長率）、10億米ドル（GDP）",
      en: "Current international $ (per-capita GDP, PPP), % (real GDP growth), billions of USD (GDP)",
    },
    verification: "verified-secondary",
    license: {
      ja: "CC BY 4.0（出典表記で再利用・再配布が可能）。API応答の原本を research/chapter02/raw/worldbank/ に保管。サイトのCSV出力にも帰属文字列を埋め込み。",
      en: "CC BY 4.0 (reuse and redistribution with attribution). Raw API responses archived under research/chapter02/raw/worldbank/; CSV exports on the site embed the attribution string.",
    },
    methodologyNotes: {
      ja: "WDIは各国統計・国際機関の二次編集。一人当たりGDP（PPP・現在国際ドル）は2021年ICPサイクルのPPP換算。日本の2024年実質GDP成長率（−0.24%）は内閣府公表値（−0.2%）と整合し、名目GDP（4.19兆ドル）も内閣府国際比較表（4.187兆ドル）と整合することを検証済み。",
      en: "WDI is a secondary compilation of national and international sources. Per-capita GDP (PPP, current int$) uses the 2021 ICP cycle. Verified here: Japan's 2024 real GDP growth (−0.24%) is consistent with the Cabinet Office's −0.2%, and nominal GDP (USD 4.19T) matches the ESRI comparison table (USD 4.187T).",
    },
    limitations: {
      ja: "PPPは推計であり確定値ではない。台湾はWDIの対象外。シンガポールの一人当たりPPP（2025年163,354国際ドル）は都市国家としての特殊構造を反映した外れ値であり、比較では注記付きでそのまま掲載。日本自身の叙述には一次資料（内閣府・厚労省）を使用し混用を避けた。",
      en: "PPP is an estimate, not a measured value. Taiwan is outside WDI coverage. Singapore's per-capita PPP (163,354 int$ in 2025) is an outlier reflecting a city-state structure; it is shown as-is with a note. Japan's own narrative uses primary sources (Cabinet Office, MHLW) to avoid mixing.",
    },
    evidenceFile: "research/chapter02/notes/oecd-worldbank-summary.md",
  },
];
