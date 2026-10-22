import type { SourceRecord } from "@/lib/research/types";

/**
 * Chapter 01 source register — structured provenance for every dataset used
 * by this chapter. Verification happened on 2026-10-22 by fetching each
 * document directly from its official domain and reading the cited figures
 * inside the archived copies under `research/chapter01/raw/`.
 */
export const chapter01Sources: SourceRecord[] = [
  {
    id: "statb-census-2025",
    organization: {
      ja: "総務省統計局（国勢調査）",
      en: "Statistics Bureau, MIC (Population Census)",
    },
    originalTitle: "令和7年国勢調査 人口等基本集計 結果の要約",
    displayTitle: {
      ja: "2025年国勢調査 人口等基本集計 結果の要約（2026年9月29日公表）",
      en: "2025 Population Census — Basic Complete Tabulation, Summary of Results (published 2026-09-29)",
    },
    url: "https://www.stat.go.jp/data/kokusei/2025/kekka.html",
    sourceLanguage: "ja",
    publicationDate: "2026-09-29",
    referencePeriod: "As of 2025-10-01 (census day)",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: { ja: "人（総人口・日本人人口・外国人人口）", en: "Persons (total / Japanese / foreign residents)" },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典を明示した上での転載・再利用は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; reuse with attribution permitted under the bureau's terms of use.",
    },
    methodologyNotes: {
      ja: "2025年10月1日時点の全数調査（センサス）。総人口には外国人住民を含む。1940年・1945年は戦時の補正人口。",
      en: "Full enumeration census as of 2025-10-01. Total population includes foreign residents; 1940/1945 rows are wartime corrected figures.",
    },
    limitations: {
      ja: "「概算・速報」ではなく基本集計確定値。年齢別等の詳細集計は以降の集計結果で更新される場合がある。",
      en: "Basic complete tabulation (not preliminary counts); detailed tabulations may follow.",
    },
    evidenceFile: "research/chapter01/raw/statb/kokusei2025_kihon_summary.pdf",
  },
  {
    id: "statb-estimates-2026",
    organization: {
      ja: "総務省統計局（人口推計）",
      en: "Statistics Bureau, MIC (Population Estimates)",
    },
    originalTitle: "人口推計（2026年10月分／2026年5月確定値）",
    displayTitle: {
      ja: "人口推計 — 2026年10月公表（2026年10月1日概算・2026年5月1日確定値）",
      en: "Population Estimates — October 2026 release (provisional Oct 1, 2026; final May 1, 2026)",
    },
    url: "https://www.stat.go.jp/data/jinsui/new.html",
    sourceLanguage: "ja",
    publicationDate: "2026-10-20",
    referencePeriod: "As of 2026-10-01 (provisional) and 2026-05-01 (final)",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: { ja: "人（日本人・外国人別）", en: "Persons (Japanese / foreign residents)" },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典を明示した上での転載・再利用は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; reuse with attribution permitted under the bureau's terms of use.",
    },
    methodologyNotes: {
      ja: "推計値。2026年11月報から基準人口を2025年国勢調査確定人口に切り替え予定（出典明記）。日本人数は2026年5月1日確定値で11,883万8千人、外国人は397万4千人。",
      en: "Estimates. Benchmark population switches to the 2025 census from the November 2026 report (stated in the source). Japanese residents 118.84M / foreign residents 3.97M (final, May 1, 2026).",
    },
    limitations: {
      ja: "概算値は暫定。月次推計は2020年国勢調査基準（2026年10月時点）。",
      en: "Latest monthly figures are provisional; monthly estimates were still benchmarked to the 2020 census at access time.",
    },
    evidenceFile: "research/chapter01/raw/statb/jinsui_202610_monthly.pdf",
  },
  {
    id: "statb-aging-2026",
    organization: {
      ja: "総務省統計局（統計トピックス）",
      en: "Statistics Bureau, MIC (Statistics Topics)",
    },
    originalTitle: "統計トピックスNo.149 統計からみた我が国の高齢者−「敬老の日」にちなんで−",
    displayTitle: {
      ja: "統計トピックスNo.149 我が国の高齢者（2026年9月20日公表）",
      en: "Statistics Topics No.149 — Japan's Elderly Population (published 2026-09-20)",
    },
    url: "https://www.stat.go.jp/data/topics/topi1490.html",
    sourceLanguage: "ja",
    publicationDate: "2026-09-20",
    referencePeriod: "Estimates as of 2026-09-15; series 1950–2050",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: { ja: "％（総人口に占める65歳以上・75歳以上人口の割合）", en: "% share of total population aged 65+ / 75+" },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典を明示した上での転載・再利用は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; reuse with attribution permitted under the bureau's terms of use.",
    },
    methodologyNotes: {
      ja: "1950–2026年は人口推計に基づく実測系列。2030–2050年は国立社会保障・人口問題研究所「日本の将来推計人口（令和5年推計）」中位推計の再掲（推計値）。国際比較（39か国・人口4千万以上）は国連の推計に基づく。",
      en: "1950–2026 observed series based on Population Estimates; 2030–2050 rows republish the IPSS 2023 medium-variant projection (scenarios). International ranking (39 countries ≥40M population) uses UN estimates as cited by the source.",
    },
    limitations: {
      ja: "推計基準日（9月15日現在）が国勢調査・年次推計（10月1日現在）と異なるため、他の統計と0.1～0.3ポイント程度の差が出る。英語版は公表されていない（日本語版が原文）。",
      en: "Reference date (Sept 15) differs from census/annual estimates (Oct 1), producing small (0.1–0.3pp) differences; no English version published (Japanese original used).",
    },
    evidenceFile: "research/chapter01/raw/statb/topics149_elderly_2026.pdf",
  },
  {
    id: "statb-handbook-2026",
    organization: {
      ja: "総務省統計局",
      en: "Statistics Bureau, MIC",
    },
    originalTitle: "Statistical Handbook of Japan 2026",
    displayTitle: {
      ja: "日本の統計 2026（統計局ハンドブック・英語版、2026年9月公表）",
      en: "Statistical Handbook of Japan 2026 (English edition, published Sept 2026)",
    },
    url: "https://www.stat.go.jp/english/data/handbook/index.html",
    sourceLanguage: "en",
    publicationDate: "2026-09",
    referencePeriod: "Data through 2024/2025 depending on table",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: { ja: "表ごとに異なる（人口・世帯・率）", en: "Varies by table (population, households, rates)" },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典を明示した上での転載・再利用は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; reuse with attribution permitted under the bureau's terms of use.",
    },
    methodologyNotes: {
      ja: "各表の出典（国勢調査・人口動態統計・人口推計ほか）をハンドブック自身が明記している。世帯関連は Table 2.3（1960–2020、1965年は世帯定義変更のため掲載なし）と Figure 2.3。",
      en: "The handbook itself cites the underlying source per table. Household series: Table 2.3 (1960–2020; no 1965 row due to a household-definition change) and Figure 2.3.",
    },
    limitations: {
      ja: "編集された概況資料であり、数値の詳細確認は各原典で行う必要がある。",
      en: "An edited overview publication; figures should be confirmed in underlying primary sources for detailed use.",
    },
    evidenceFile: "research/chapter01/raw/statb/handbook2026_all.pdf",
  },
  {
    id: "mhlw-vital-2025",
    organization: {
      ja: "厚生労働省（人口動態統計）",
      en: "Ministry of Health, Labour and Welfare (Vital Statistics)",
    },
    originalTitle: "令和7(2025)年 人口動態統計（確定数）の概況",
    displayTitle: {
      ja: "2025年人口動態統計（確定数）の概況（2026年9月30日公表）",
      en: "Vital Statistics 2025 — Final Counts, Overview (published 2026-09-30)",
    },
    url: "https://www.mhlw.go.jp/toukei/saikin/hw/jinkou/kakutei25/index.html",
    sourceLanguage: "ja",
    publicationDate: "2026-09-30",
    referencePeriod: "January–December 2025 (final)",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: { ja: "人・組（出生数・死亡数・婚姻件数など）、率（人口千対）", en: "Counts (births, deaths, marriages) and rates per 1,000 population" },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典を明示した上での転載は同省の利用条件に従います。",
      en: "MHLW publication; redistribution with attribution under the ministry's terms of use.",
    },
    methodologyNotes: {
      ja: "出生・死亡は発生基準（届出日ではない）。1944–1946年は戦災による資料喪失のため公表なし。1947–1972年は沖縄県を含まない。合計特殊出生率は15–49歳の女性の年齢別出生率の合計。2025年確定数の率・合計特殊出生率は2025年国勢調査人口を分母とする再計算を2026年11月に実施予定。",
      en: "Births/deaths use occurrence (not registration) basis. 1944–1946 omitted (war records lost). 1947–1972 exclude Okinawa. TFR sums age-specific fertility rates for women aged 15–49. National rates and the 2025 TFR will be recalculated with the 2025 Census population in November 2026.",
    },
    limitations: {
      ja: "上記のとおり、年度により対象範囲（沖縄）と公表有無（1944–46）が異なる。外国人を含む出生・死亡も対象。",
      en: "Coverage differs by period (Okinawa) and years 1944–46 are absent, as documented by the source itself.",
    },
    evidenceFile: "research/chapter01/raw/mhlw/kakutei25_05_gaikyou.pdf",
  },
  {
    id: "mhlw-life-2025",
    organization: {
      ja: "厚生労働省（簡易生命表）",
      en: "MHLW (Abridged Life Tables)",
    },
    originalTitle: "令和7年簡易生命表の概況",
    displayTitle: {
      ja: "2025年簡易生命表（2026年7月24日公表）",
      en: "Abridged Life Tables 2025 (published 2026-07-24)",
    },
    url: "https://www.mhlw.go.jp/toukei/saikin/hw/life/life25/index.html",
    sourceLanguage: "ja",
    publicationDate: "2026-07-24",
    referencePeriod: "2025",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: { ja: "年（平均寿命＝0歳平均余命）", en: "Years (life expectancy at birth)" },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典を明示した上での転載は同省の利用条件に従います。",
      en: "MHLW publication; redistribution with attribution under the ministry's terms of use.",
    },
    methodologyNotes: {
      ja: "簡易生命表（センサス年は完全生命表、*印の年）。1971年以前は沖縄県を除く値。2025年：男81.35年・女87.33年（女性は世界第1位と公表）。",
      en: "Abridged tables (complete life tables in census years, marked *). Okinawa excluded before 1972. 2025: male 81.35 / female 87.33 (female ranked world #1 per the release).",
    },
    limitations: {
      ja: "簡易生命表は暦年経過に基づく算出。国際比較の「順位」は出典の公表による。",
      en: "Abridged tables are calendar-period calculations; international 'rankings' are as published by the source.",
    },
    evidenceFile: "research/chapter01/raw/mhlw/life25_09_suii.pdf",
  },
  {
    id: "ipss-projection-2023",
    organization: {
      ja: "国立社会保障・人口問題研究所",
      en: "National Institute of Population and Social Security Research (IPSS)",
    },
    originalTitle: "日本の将来推計人口（令和5年推計）人口推計表 1-1（出生中位・死亡中位）",
    displayTitle: {
      ja: "日本の将来推計人口（2023年推計）出生中位（死亡中位）推計 — 2023年4月26日公表",
      en: "Population Projections for Japan (2023 round, published 2023-04-26) — Medium-fertility / medium-mortality variant",
    },
    url: "https://www.ipss.go.jp/pp-zenkoku/j/zenkoku2023/pp_zenkoku2023.asp",
    sourceLanguage: "ja+en",
    publicationDate: "2023-04-26",
    referencePeriod: "2021–2070 (baseline 2020 census)",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国・日本人人口）", en: "Japan (national, Japanese population)" },
    statisticalUnit: { ja: "千人（総人口・年齢3区分）", en: "Thousands (total and three age groups)" },
    verification: "verified-primary",
    license: {
      ja: "国立社会保障・人口問題研究所の公表資料。出典を明示した上での利用は同研究所の利用条件に従います。",
      en: "IPSS publication; use with attribution under the institute's terms.",
    },
    methodologyNotes: {
      ja: "将来推計（シナリオ）であり実測ではない。出生中位・死亡中位の前提：合計特殊出生率は2025年1.2713→2070年1.3573、2070年平均寿命は男85.89年・女91.94年、国際人口移動（出入国差引き）は2022–2040年 年16万3791人。2025年時点で新しい推計roundは公表されていない（2026-10-22確認）。",
      en: "Projections (scenarios), not observations. Medium assumptions: TFR 1.2713 (2025) → 1.3573 (2070); 2070 life expectancy male 85.89 / female 91.94; net international migration 163,791/year for 2022–2040. Confirmed on 2026-10-22 that no newer round exists.",
    },
    limitations: {
      ja: "前提が変われば結果は変わる。上位・下位推計では2070年総人口は9,549万人／8,024万人。2056年に1億人を下回る（中位）。",
      en: "Results are assumption-dependent: high/low variants put 2070 population at 95.49M / 80.24M. Medium variant falls below 100M in 2056.",
    },
    evidenceFile: "research/chapter01/raw/ipss/ip2023_table1-1_medium.xlsx",
  },
  {
    id: "ipss-household-2024",
    organization: {
      ja: "国立社会保障・人口問題研究所",
      en: "IPSS",
    },
    originalTitle: "日本の世帯数の将来推計（全国推計）－令和6（2024）年推計－",
    displayTitle: {
      ja: "日本の世帯数の将来推計 2024年推計（2024年4月12日公表）",
      en: "Japan Household Projections, 2024 round (published 2024-04-12)",
    },
    url: "https://www.ipss.go.jp/pp-ajsetai/j/HPRJ2024/t-page.asp",
    sourceLanguage: "ja",
    publicationDate: "2024-04-12",
    referencePeriod: "Projections 2025–2050 (baseline 2020 census)",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（全国・世帯）", en: "Japan (national, households)" },
    statisticalUnit: { ja: "万世帯・％", en: "Households (10k) and %" },
    verification: "verified-primary",
    license: {
      ja: "国立社会保障・人口問題研究所の公表資料。",
      en: "IPSS publication.",
    },
    methodologyNotes: {
      ja: "将来推計。一般世帯数は2030年に5,773万世帯でピーク、平均世帯人員は2033年に2人未満、単独世帯の割合は2050年に44.3%へ（いずれも中位推計）。",
      en: "Projections: ordinary households peak at 57.73M in 2030; average household size falls below 2 in 2033; one-person households reach 44.3% by 2050 (medium variant).",
    },
    limitations: {
      ja: "推計値。前提（家族形成・世帯形成率）に依存する。",
      en: "Scenario-dependent projections.",
    },
    evidenceFile: "research/chapter01/raw/ipss/hprj2024_PR.pdf",
  },
  {
    id: "statb-migration-2025",
    organization: {
      ja: "総務省統計局（住民基本台帳人口移動報告）",
      en: "Statistics Bureau, MIC (Internal Migration Report)",
    },
    originalTitle: "住民基本台帳人口移動報告 2025年結果（2026年2月3日公表）",
    displayTitle: {
      ja: "住民基本台帳人口移動報告 — 2025年（2026年2月3日公表）",
      en: "Report on Internal Migration 2025 (published 2026-02-03)",
    },
    url: "https://www.stat.go.jp/data/idou/2025np/jissu/youyaku/index.html",
    sourceLanguage: "ja",
    publicationDate: "2026-02-03",
    referencePeriod: "2025 (Jan–Dec)",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本（都道府県・市町村間）", en: "Japan (inter-prefecture / inter-municipality)" },
    statisticalUnit: { ja: "人（転入超過数・移動者数）", en: "Persons (net in-migration / migrants)" },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。",
      en: "Statistics Bureau publication.",
    },
    methodologyNotes: {
      ja: "住民基本台帳に基づく移動（日本人移動者）。2025年：東京都転入超過6万5219人、東京圏転入超過12万3534人、日本人移動者による東京圏転入超過は30年連続。",
      en: "Moves based on the resident registration system (Japanese movers). 2025: Tokyo net in-migration 65,219; Tokyo metropolitan area net in-migration 123,534; Japanese-only Tokyo-area net in-migration positive for 30 consecutive years.",
    },
    limitations: {
      ja: "外国人の移動は含まない。住民票の移動届ベースであり、実居住の移動と完全一致しない。",
      en: "Excludes foreign residents' moves; based on registration filings, not observed residence changes.",
    },
    evidenceFile: "research/chapter01/raw/statb/idou_2025_youyaku_jp.html",
  },
  {
    id: "wb-wdi",
    organization: {
      ja: "世界銀行（World Development Indicators）",
      en: "World Bank (World Development Indicators)",
    },
    originalTitle: "World Development Indicators — SP.DYN.TFRT.IN, SP.POP.65UP.TO.ZS, SP.POP.0014.TO.ZS, SP.POP.1564.TO.ZS, SP.DYN.LE00.IN, SP.POP.TOTL",
    displayTitle: {
      ja: "世界銀行 WDI（出生率・高齢化・平均寿命・総人口）— API取得・CC BY 4.0",
      en: "World Bank WDI (fertility, aging, life expectancy, population) — API, CC BY 4.0",
    },
    url: "https://api.worldbank.org/v2/country/JPN/indicator/SP.DYN.TFRT.IN?format=json",
    sourceLanguage: "en",
    publicationDate: "2026-10-08",
    referencePeriod: "1960–2025 depending on indicator (latest common comparison year: TFR/LE 2024, 65+ share 2025)",
    accessDate: "2026-10-22",
    geographicCoverage: { ja: "日本＋比較12か国（韓国・シンガポール・豪・NZ・独・仏・スウェーデン・蘭・加・英・米・伊）", en: "Japan + 12 comparators (KOR, SGP, AUS, NZL, DEU, FRA, SWE, NLD, CAN, GBR, USA, ITA)" },
    statisticalUnit: { ja: "出生率（女性1人当たり）・％・年・人", en: "Births per woman; %; years; persons" },
    verification: "verified-secondary",
    license: {
      ja: "CC BY 4.0（クレジット表示で再利用・再配布可）。本サイトのCSVにも帰属情報を付記。",
      en: "CC BY 4.0 (reuse and redistribution with attribution). Attribution included in site CSV exports.",
    },
    methodologyNotes: {
      ja: "世界銀行が国連「世界人口推計（WPP）」・各国統計局・Eurostat等を編集した二次資料。日本の数値は国内統計と若干異なる場合がある（推計手法の違い）。台湾はWDIに含まれないため比較対象外。API lastupdated: 2026-10-08。",
      en: "Secondary compilation by the World Bank from UN WPP, NSOs and Eurostat. Japan values may differ slightly from national statistics due to estimation methodology. Taiwan is not in WDI and is excluded. API lastupdated: 2026-10-08.",
    },
    limitations: {
      ja: "原典（各国統計）と定義・基準年が異なる可能性があるため、日本国内の叙述には国内原典を使用し、国際比較には本データを使用して混用を避けた。",
      en: "Definitions/vintages may differ from national sources; this project uses national sources for Japan's own narrative and WDI only for same-year international comparisons.",
    },
    evidenceFile: "research/chapter01/raw/worldbank/JPN-SP.DYN.TFRT.IN.json",
  },
];

export function getChapter01Source(id: string): SourceRecord | undefined {
  return chapter01Sources.find((s) => s.id === id);
}
