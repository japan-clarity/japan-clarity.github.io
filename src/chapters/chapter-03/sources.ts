import type { SourceRecord } from "@/lib/research/types";

/**
 * Chapter 03 source register — structured provenance for every dataset used
 * by this chapter. Verification happened on 2026-10-26 by fetching each
 * document directly from its official domain and reading the cited figures
 * inside the archived copies under `research/chapter03/raw/` (see
 * research/chapter03/notes/*.md for verbatim quotes, table anchors and
 * checksums; research/chapter03/scripts/extract-series.py re-asserts 1,640
 * anchor checks before any data reaches the site).
 */
export const chapter03Sources: SourceRecord[] = [
  {
    id: "statb-jyutaku-2023-kihon",
    organization: {
      ja: "総務省統計局（住宅・土地統計調査）",
      en: "Statistics Bureau, MIC (Housing and Land Survey)",
    },
    originalTitle: "令和5年住宅・土地統計調査 住宅及び世帯に関する基本集計（確報集計）結果の概要",
    displayTitle: {
      ja: "住宅・土地統計調査2023 基本集計（確報）結果の概要（2024年9月25日公表）",
      en: "2023 Housing and Land Survey — Basic tabulation (final) summary (published 2024-09-25)",
    },
    url: "https://www.stat.go.jp/data/jyutaku/2023/pdf/kihon_gaiyou.pdf",
    sourceLanguage: "ja",
    publicationDate: "2024-09-25",
    referencePeriod: "As of 2023-10-01 (5-yearly survey round; prefecture appendix and headline figures)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国・都道府県）", en: "Japan (national + prefectures)" },
    statisticalUnit: {
      ja: "千戸・％（総住宅数、空き家数・空き家率、持ち家住宅率、都道府県別指標）",
      en: "Thousand dwellings and % (housing stock, vacancy counts/rates, homeownership rate, prefecture indicators)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。統計数値の出典を明示した上での引用・転載は総務省の利用規約に従います。原資料は本リポジトリで再配布していません。",
      en: "Statistics Bureau publication; citation and reuse with attribution under the bureau's terms. Raw source files are not redistributed in this repository.",
    },
    methodologyNotes: {
      ja: "5年ごとの住宅・土地統計調査（調査期日2023年10月1日）の確報値。速報（2024年4月30日公表）と比べ総住宅数が2万6千戸・空き家数が6千戸増加し、19都道府県の空き家率が±0.1〜0.2ポイント変動したため、本章はすべて確報値を使用。空き家率の分母は総住宅数、持ち家住宅率の分母は居住世帯のある住宅（1978年以降は所有関係「不詳」を含む）。2023年は空き家の種類の名称が整理された（2013・2018年の「その他の住宅」＝2023年の「賃貸・売却用及び二次的住宅を除く空き家」）。",
      en: "Final (確報) figures of the 5-yearly survey as of 2023-10-01. The provisional release (2024-04-30) understated the stock by 26 thousand dwellings and vacancies by 6 thousand, and shifted 19 prefectures' vacancy rates by ±0.1–0.2 pt — this chapter uses final figures throughout. Vacancy-rate denominator: total dwellings; homeownership denominator: occupied dwellings (including tenure 'unknown' since 1978). The 2023 round renamed vacancy categories (2013/2018 'その他の住宅' = 2023 '賃貸・売却用及び二次的住宅を除く空き家').",
    },
    limitations: {
      ja: "2018年・2023年回の英語版概要は公表されていない（最新の英語版は2013年回）。1968年以前は沖縄県を含まない。1953年は市部のみ。",
      en: "No English summary exists for the 2018/2023 rounds (newest English outline: 2013). Pre-1969 rounds exclude Okinawa; 1953 covers city areas only.",
    },
    evidenceFile: "research/chapter03/notes/statb-housing-summary.md",
  },
  {
    id: "estat-jyutaku-timeseries",
    organization: {
      ja: "総務省統計局（e-Stat 政府統計の総合窓口）",
      en: "Statistics Bureau, MIC via e-Stat",
    },
    originalTitle: "令和5年住宅・土地統計調査 時系列統計表（第1-1表・第4表・第9-1表・第14-1表）",
    displayTitle: {
      ja: "住宅・土地統計調査 時系列統計表（2025年9月30日更新）",
      en: "Housing and Land Survey time-series tables (updated 2025-09-30)",
    },
    url: "https://www.e-stat.go.jp/stat-search/files?tstat=000001207800&tclass1=000001207807",
    sourceLanguage: "ja",
    publicationDate: "2025-09-30",
    referencePeriod: "1948–2023 (stock), 1963–2023 (tenure), 1958–2023 (vacancy types), 1968–2023 (floor area), every 5 years",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "戸・％・㎡（住宅数、所有関係別構成比、空き家の種類別戸数、1住宅当たり延べ面積）",
      en: "Dwellings, %, m² (counts, tenure shares, vacancy types, average floor area)",
    },
    verification: "verified-primary",
    license: {
      ja: "e-Stat（総務省統計局）の公表統計表。出典明示の上で引用。",
      en: "e-Stat (Statistics Bureau) statistical tables; cited with attribution.",
    },
    methodologyNotes: {
      ja: "第9-1表の持ち家率の分母は居住世帯のある住宅（1978年以降は「不詳」含む）。第14-1表の延べ面積は居住世帯のある住宅全体を対象（専用住宅のみを対象とする概要表６の90.86㎡とは分母が異なる）。第4表は1978〜1998年の「賃貸用」に「売却用」を含む。1973年の二重行（沖縄を含まない/含む）は含む行を採用。",
      en: "Table 9-1 homeownership denominator: occupied dwellings (incl. 'unknown' from 1978). Table 14-1 floor area covers ALL occupied dwellings — a different denominator from the summary's 専用住宅 figure (90.86 m² in 2023). Table 4's pre-1999 'for rent' includes 'for sale'. The double 1973 rows (Okinawa excluded/included) resolve to the included row.",
    },
    limitations: {
      ja: "持ち家率・床面積の1963年以前の値は公表時系列に存在しない。e-Statの表はExcel形式のみ。",
      en: "No pre-1963 homeownership or floor-area values exist in the online time series; e-Stat serves these tables as Excel only.",
    },
    evidenceFile: "research/chapter03/notes/statb-housing-summary.md",
  },
  {
    id: "statb-fies-2025",
    organization: {
      ja: "総務省統計局（家計調査 家計収支編）",
      en: "Statistics Bureau, MIC (Family Income and Expenditure Survey)",
    },
    originalTitle: "家計調査年報（家計収支編）2025年（令和7年）平均・家計の概要・詳細結果表",
    displayTitle: {
      ja: "家計調査（家計収支編）2025年平均（2026年2月6日公表）",
      en: "FIES 2025 annual results (published 2026-02-06)",
    },
    url: "https://www.stat.go.jp/data/kakei/2025np/index.html",
    sourceLanguage: "ja",
    publicationDate: "2026-02-06",
    referencePeriod: "Calendar 2025 (annual averages; monthly amounts)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国・都市階級・地方）", en: "Japan (national, city class, region)" },
    statisticalUnit: {
      ja: "円/月（1世帯当たり支出・収入）、％（構成比）。二人以上の世帯・単身世帯・勤労者世帯・住居の所有関係別",
      en: "JPY/month per household (expenditure, income), % (shares); by household size, worker households, housing tenure",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上で引用。",
      en: "Statistics Bureau publication; cited with attribution.",
    },
    methodologyNotes: {
      ja: "消費支出・品目別支出は用途分類（構成比の公表値はこちらに属する）と品目分類（贈答品・サービス込み）の2種類が公表される — 本章は用途分類を使用し分類名を明記。住居の所有関係別表（第3-7表）は持家・民営借家など金額のみを公表し、負担率は公表しないため、本章の「住居費割合」は当サイトが金額から派生計算した値（四捨五入0.1%単位）。勤労者世帯の実収入・可処分所得は二人以上の世帯のうち勤労者世帯のみ対象。",
      en: "The FIES publishes two parallel classifications of category amounts (用途分類, to which the official shares belong, and 品目分類 including gifts/services) — this chapter uses 用途分類 with the classification named. The tenure table (3-7) publishes amounts only; the 'housing-cost share' shown here is DERIVED on this site from those amounts (rounded to 0.1 pt). Income and disposable income cover worker households only within 2+ households.",
    },
    limitations: {
      ja: "2018年1月の家計簿改正により増減率の連続性が一部断絶。CPI基準改定（2025年基準）に伴い実質増減率が2026年9月4日に遡及改訂。二人以上の世帯全体の可処分所得は公表されない（勤労者世帯のみ）。",
      en: "The January-2018 diary revision breaks some year-on-year continuity; real growth rates were retroactively revised on 2026-09-04 with the CPI base change. Disposable income for ALL 2+ households is not published (worker households only).",
    },
    evidenceFile: "research/chapter03/notes/statb-fies-cpi-summary.md",
  },
  {
    id: "estat-fies-longtime",
    organization: {
      ja: "総務省統計局（e-Stat 家計調査 長期時系列表）",
      en: "Statistics Bureau, MIC via e-Stat (FIES long time series)",
    },
    originalTitle: "家計調査 長期時系列表（家計収支編）表2 二人以上の世帯・勤労者世帯（2000年～）",
    displayTitle: {
      ja: "家計調査 長期時系列表（2026年10月9日更新）",
      en: "FIES long time-series tables (updated 2026-10-09)",
    },
    url: "https://www.e-stat.go.jp/stat-search/files?toukei=00200561&tstat=000001088195",
    sourceLanguage: "ja",
    publicationDate: "2026-10-09",
    referencePeriod: "Calendar years 2000–2025",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "円/月（消費支出・住居費）、円/月（勤労者世帯の実収入・可処分所得）",
      en: "JPY/month (expenditure, housing costs, worker-household income/disposable income)",
    },
    verification: "verified-primary",
    license: {
      ja: "e-Stat（総務省統計局）の公表統計表。出典明示の上で引用。",
      en: "e-Stat statistical tables; cited with attribution.",
    },
    methodologyNotes: {
      ja: "2000年以降の年次系列。2025年の値は年報・概要と一致することを検証済み（314,001円）。",
      en: "Annual series from 2000; the 2025 value cross-checks against the annual report and summary (¥314,001).",
    },
    limitations: {
      ja: "2000年以前は別系列（基準・分類の変更あり）。",
      en: "Pre-2000 history exists under different classifications and is not linked.",
    },
    evidenceFile: "research/chapter03/notes/statb-fies-cpi-summary.md",
  },
  {
    id: "statb-cpi-2025avg",
    organization: {
      ja: "総務省統計局（消費者物価指数）",
      en: "Statistics Bureau, MIC (Consumer Price Index)",
    },
    originalTitle: "2020年基準消費者物価指数 全国 2025年（令和7年）12月分及び2025年平均",
    displayTitle: {
      ja: "消費者物価指数 2025年平均・12月分（2020年基準、2026年1月23日公表）",
      en: "CPI 2025 annual average & December (2020 base, published 2026-01-23)",
    },
    url: "https://www.stat.go.jp/data/cpi/sokuhou/nen/pdf/zen-n.pdf",
    sourceLanguage: "ja",
    publicationDate: "2026-01-23",
    referencePeriod: "Calendar 2025 annual average (+ December 2025 monthly)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "指数（2020年=100）、前年比％（総合・10大費目）",
      en: "Index (2020=100) and YoY % (all items, ten expenditure groups)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上で引用。",
      en: "Statistics Bureau publication; cited with attribution.",
    },
    methodologyNotes: {
      ja: "2025年暦年平均を2020年基準で公表した最終版。総合111.9・前年比+3.2%。2026年8月に2025年基準へ移行したため、本章の長期系列（2025年基準）とは基準が異なる — 前年比は両基準で一致することを検証済み。",
      en: "The final 2020-base release of the 2025 annual average (all items 111.9, +3.2% YoY). The CPI moved to the 2025 base in Aug-2026, so this headline uses a different base from the chapter's long-run series — YoY rates were verified to agree across both bases.",
    },
    limitations: {
      ja: "2020年基準の指数水準と2025年基準の指数水準は直接比較できない。",
      en: "2020-base index levels are not directly comparable with 2025-base levels.",
    },
    evidenceFile: "research/chapter03/notes/statb-fies-cpi-summary.md",
  },
  {
    id: "estat-cpi-2025base-lt",
    organization: {
      ja: "総務省統計局（e-Stat 2025年基準CPI長期時系列データ）",
      en: "Statistics Bureau, MIC via e-Stat (2025-base CPI long time series)",
    },
    originalTitle: "2025年基準消費者物価指数 長期時系列データ 品目別価格指数 全国 年平均（表1 中分類指数）",
    displayTitle: {
      ja: "2025年基準CPI長期時系列データ（2026年8月7日公開）",
      en: "2025-base CPI long time-series data (published 2026-08-07)",
    },
    url: "https://www.e-stat.go.jp/stat-search/files?toukei=00200552&tstat=000001182795",
    sourceLanguage: "ja",
    publicationDate: "2026-08-07",
    referencePeriod: "1970–2025 annual (中分類 indices); group YoY 1971–2025",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "指数（2025年=100）、前年比％（総合・食料・住居・家賃・光熱水道・エネルギー）",
      en: "Index (2025=100) and YoY % (all items, food, housing, rent, utilities, energy)",
    },
    verification: "verified-primary",
    license: {
      ja: "e-Stat（総務省統計局）の公表統計表。出典明示の上で引用。",
      en: "e-Stat statistical tables; cited with attribution.",
    },
    methodologyNotes: {
      ja: "2025年基準へ移行した際の接続指数。旧基準（2020=100）の2025年平均111.9とは水準が異なるが増減率は一致。家賃は持家の帰属家賃を含む総合家賃。エネルギーは別掲分類。",
      en: "Chain-linked series produced for the 2025-base revision. Levels differ from the old 2020 base (111.9 in 2025) but YoY rates agree. Rent covers the all-tenant rent aggregate including imputed rent for owner-occupiers; energy is a supplementary aggregate.",
    },
    limitations: {
      ja: "1970年より前の中分類指数はこのファイルに含まれない（1947年〜は「持家の帰属家賃を除く総合」のみ別ファイル）。",
      en: "Pre-1970 group indices are not in this file (only the all-items-less-imputed-rent series extends back to 1947, in a separate file).",
    },
    evidenceFile: "research/chapter03/notes/statb-fies-cpi-summary.md",
  },
  {
    id: "statb-cpi-2026sep",
    organization: {
      ja: "総務省統計局（消費者物価指数）",
      en: "Statistics Bureau, MIC (Consumer Price Index)",
    },
    originalTitle: "2025年基準消費者物価指数 全国 2026年（令和8年）9月分",
    displayTitle: {
      ja: "消費者物価指数 2026年9月分（2025年基準、2026年10月23日公表）",
      en: "CPI September 2026 (2025 base, published 2026-10-23)",
    },
    url: "https://www.stat.go.jp/data/cpi/sokuhou/tsuki/pdf/zenkoku.pdf",
    sourceLanguage: "ja",
    publicationDate: "2026-10-23",
    referencePeriod: "September 2026 (monthly)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "指数（2025年=100）、前年同月比％",
      en: "Index (2025=100), YoY %",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上で引用。",
      en: "Statistics Bureau publication; cited with attribution.",
    },
    methodologyNotes: {
      ja: "本章執筆時点の最新月次公表。総合102.2・前年同月比+2.1%。2026年10月に一部訂正（テーマパーク入場料のモデル品目入替）があったが本章の引用値への影響なし。",
      en: "Latest monthly release at the time of writing: all items 102.2, +2.1% YoY. An October-2026 erratum (model replacement for theme-park admission) does not affect the values cited here.",
    },
    limitations: {
      ja: "月次値は暦年平均とは季節性の意味が異なる。",
      en: "Monthly values carry seasonality and are not annual averages.",
    },
    evidenceFile: "research/chapter03/notes/statb-fies-cpi-summary.md",
  },
  {
    id: "oecd-ahpi",
    organization: {
      ja: "OECD（経済協力開発機構）",
      en: "OECD",
    },
    originalTitle: "Analytical House Price Statistics — DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES v1.0 (SDMX)",
    displayTitle: {
      ja: "OECD 分析的住宅価格統計（SDMX API、2026年10月26日取得）",
      en: "OECD Analytical House Price Statistics (SDMX API, retrieved 2026-10-26)",
    },
    url: "https://sdmx.oecd.org/public/rest/data/OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0/JPN+AUS+CAN+DEU+ESP+FRA+GBR+ITA+KOR+NLD+NZL+SWE+USA.A.HPI_YDH+RHP.IX?format=csvfilewithlabels",
    sourceLanguage: "en",
    publicationDate: "2026-10-26",
    referencePeriod: "Annual indices to 2025 (Japan: 1960–2025; country coverage varies)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "OECD加盟13カ国（日本含む）", en: "13 OECD member countries incl. Japan" },
    statisticalUnit: {
      ja: "指数（2015年=100、季節調整済み、年次）。住宅価格所得比（HPI_YDH）・実質住宅価格指数（RHP）",
      en: "Index (2015=100, seasonally adjusted, annual). Price-to-income ratio (HPI_YDH) and real house price index (RHP)",
    },
    verification: "verified-secondary",
    license: {
      ja: "OECDデータの再利用条件に基づき出典を明示して使用（再利用規約ページは本環境から403応答のため、本文書内に出典表示を記録）。OECD編集値であり国内公表値とは改訂方針が異なる。",
      en: "Used with attribution under OECD data-reuse terms (the terms page returned HTTP 403 from this environment; the attribution string is recorded in the research notes). OECD-compiled figures whose revision policy differs from national publications.",
    },
    methodologyNotes: {
      ja: "住宅価格所得比は「所得に対する住宅価格」の指数（2015年=100）であり、価格水準でも倍率でもない。実質住宅価格指数も同じく2015年=100の指数。UNIT_MEASURE=IX、BASE_PER=2015を全行で確認済み（2015年の値が全13カ国でちょうど100）。*_AVG（長期平均比%）という別系列と混同しないこと。",
      en: "The price-to-income ratio is an INDEX of house prices relative to income (2015=100) — neither a price level nor a multiple. The real house price index is likewise 2015=100. UNIT_MEASURE=IX and BASE_PER=2015 verified on every row (2015 reads exactly 100 for all 13 areas). Do not confuse with the separate *_AVG percentage-of-long-term-average series.",
    },
    limitations: {
      ja: "OECD編集の指数であり、日本の国内公表値（地価公示等）とは基準・定義が異なる。国により系列の開始年が異なる（英1987年〜、韓・NZ1986年〜等）。為替・PPP換算の影響を受ける比較には注意。",
      en: "OECD-compiled indices whose bases and definitions differ from Japan's national publications (published land prices etc.). Series start years vary by country (GBR from 1987, KOR/NZL from 1986). Cross-country level comparisons embed conversion assumptions.",
    },
    evidenceFile: "research/chapter03/notes/oecd-mlit-summary.md",
  },
  {
    id: "mlit-kenchaku",
    organization: {
      ja: "国土交通省（建設着工統計調査）",
      en: "Ministry of Land, Infrastructure, Transport and Tourism (Building Starts Survey)",
    },
    originalTitle: "建築着工統計調査報告（令和7年計分）・利用関係別新設住宅の戸数の合計（時系列）",
    displayTitle: {
      ja: "住宅着工統計 令和7年計・時系列（2026年1月30日公表）",
      en: "Housing starts 2025 + long time series (published 2026-01-30)",
    },
    url: "https://www.mlit.go.jp/statistics/details/t-other-2_tk_000214.html",
    sourceLanguage: "ja",
    publicationDate: "2026-01-30",
    referencePeriod: "CY2025 annual + annual series 1948–2025",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "戸（新設住宅着工戸数・年計）",
      en: "Dwelling units (annual housing starts)",
    },
    verification: "verified-primary",
    license: {
      ja: "国土交通省ウェブサイト掲載情報。「公共データ利用規約（第1.0版）」（PDL1.0）に準拠し出典を明示して利用。",
      en: "MLIT website content under the Public Data Utilisation Terms v1.0 (PDL1.0); used with source attribution.",
    },
    methodologyNotes: {
      ja: "新設住宅着工戸数（着工ベースのフロー統計）。昭和25年以前は工事戸数、48年から沖縄県を含む。1973年の190.5万戸が統計開始以来の最高。2025年は74.1万戸で3年連続減少。",
      en: "Flow statistics of newly started dwellings. Pre-1951 figures count construction works; Okinawa included from 1973. The 1973 peak of 1.905 million starts is the series maximum; 2025 marks the third consecutive decline at 0.741 million.",
    },
    limitations: {
      ja: "着工戸数は着工ベースであり完成・入居とは時点が異なる。",
      en: "Starts are measured at ground-breaking, not completion or occupancy.",
    },
    evidenceFile: "research/chapter03/notes/oecd-mlit-summary.md",
  },
  {
    id: "mlit-kojichika-2026",
    organization: {
      ja: "国土交通省 土地鑑定委員会（地価公示）",
      en: "MLIT Land Appraisal Committee (Published Land Prices)",
    },
    originalTitle: "令和8年地価公示（2026年1月1日時点）変動率及び平均価格の時系列推移表",
    displayTitle: {
      ja: "地価公示2026 住宅地平均価格の時系列（2026年3月公表）",
      en: "Published land prices 2026 — residential average price time series (published March 2026)",
    },
    url: "https://www.mlit.go.jp/totikensangyo/content/001989457.xls",
    sourceLanguage: "ja",
    publicationDate: "2026-03",
    referencePeriod: "As of 2026-01-01 (annual, price series 1975–2026; published March per the survey's own schedule)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国・東京都）", en: "Japan (national, Tokyo)" },
    statisticalUnit: {
      ja: "円/㎡（住宅地の平均価格 — 標準地の単純平均、百円単位）",
      en: "JPY/m² (residential average price — simple mean over standard parcels, ¥100 rounding)",
    },
    verification: "verified-primary",
    license: {
      ja: "国土交通省ウェブサイト掲載情報。PDL1.0に準拠し出典を明示して利用。",
      en: "MLIT website content under PDL1.0; used with source attribution.",
    },
    methodologyNotes: {
      ja: "「平均価格」は標準地ごとの1㎡当たり価格の合計を総地点数で除した単純平均（十の位で四捨五入し百円単位）。取引事例の中央値ではない。全国の住宅地平均は2025年の13.71万円/㎡から2026年は14.47万円/㎡へ、東京都は51.53万円から56.51万円へ上昇。",
      en: "The 'average price' is a simple mean of per-square-metre prices over standard appraisal parcels (rounded to ¥100) — not a transaction median. The national residential average rose from ¥137,100/m² (2025) to ¥144,700/m² (2026); Tokyo from ¥515,300 to ¥565,100.",
    },
    limitations: {
      ja: "標準地ベースの評価であり実勢取引価格とは分布が異なる。地域内でも地点差が大きい。",
      en: "Parcel-based appraisal values differ in distribution from actual transaction prices; within-region dispersion is large.",
    },
    evidenceFile: "research/chapter03/notes/oecd-mlit-summary.md",
  },
];
