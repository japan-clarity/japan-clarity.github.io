import type { ChartSpec } from "@/lib/research/types";
import {
  STOCK_TOTAL,
  STOCK_OCCUPIED,
  STOCK_VACANT,
  VACANCY_RATE,
  TENURE_OWNED,
  TENURE_PUBLIC,
  TENURE_UR,
  TENURE_PRIVATE,
  TENURE_COMPANY,
  VAC_TYPE_RENTAL,
  VAC_TYPE_SALE,
  VAC_TYPE_SECONDARY,
  VAC_TYPE_OTHER,
  AREA_TOTAL,
  AREA_OWNED,
  AREA_RENTED,
  PREF_VACANCY,
  PREF_LABELS,
  FIES_EXPENDITURE,
  FIES_STRUCTURE,
  FIES_STRUCTURE_EN,
  FIES_BURDEN,
  CPI_LONG,
  CPI_G_ALL,
  CPI_G_FOOD,
  CPI_G_HOUSING,
  CPI_G_RENT,
  CPI_G_ENERGY,
  OECD_PTI_JPN,
  OECD_RHP_JPN,
  OECD_PTI_COMPARE,
  OECD_PTI_YEAR,
  OECD_COUNTRIES,
} from "./data";

/**
 * Chapter 03 chart specifications.
 *
 * Every series references the generated verified data module; nothing is
 * hand-entered. The one derived series family (the housing-cost burden
 * shares in ch03-rent-burden) is computed in the generation script from
 * published FIES amounts and is disclosed as DERIVED in the chart note and
 * the chapter limitations. OECD series are 2015=100 indices — never price
 * levels (the Chapter-02 audit lesson, enforced by validate-research.ts).
 */

const years = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([y]) => y);
const values = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([, v]) => v);

export const chapter03Charts: ChartSpec[] = [
  // ----- 1. Housing stock -------------------------------------------------
  {
    id: "ch03-stock",
    title: {
      ja: "住宅ストックの推移：総住宅数・居住世帯のある住宅・空き家（1963–2023年・5年ごと）",
      en: "Housing stock: total, occupied and vacant dwellings (1963–2023, every 5 years)",
    },
    description: {
      ja: "住宅・土地統計調査（5年ごと）による全国の住宅数。総住宅数は1963年の2,109万戸から2023年の6,504.7万戸へ約3.1倍になり、総世帯数の増加と人口減少期に入っても住宅建設が続いたことを示す。空き家は1963年の52.2万戸から900.2万戸へ。1963・1968年は沖縄県を含まない（復帰前）。1948年（1,390.7万戸）と1953年（市部のみ712.7万戸）は本文で解説。",
      en: "National dwelling counts from the 5-yearly Housing and Land Survey. Total stock grew about 3.1× from 21.09 million (1963) to 65.05 million (2023) — construction continued even as household growth slowed into the era of population decline. Vacant dwellings rose from 0.52 million (1963) to 9.00 million. The 1963/1968 rounds exclude pre-reversion Okinawa; the 1948 (13.91 million) and 1953 (city areas only, 7.13 million) figures are discussed in the text.",
    },
    years: years(STOCK_TOTAL),
    series: [
      { key: "total", name: { ja: "総住宅数", en: "Total dwellings" }, values: values(STOCK_TOTAL), kind: "line" },
      { key: "occupied", name: { ja: "居住世帯のある住宅", en: "Occupied dwellings" }, values: values(STOCK_OCCUPIED), kind: "line" },
      { key: "vacant", name: { ja: "空き家", en: "Vacant dwellings" }, values: values(STOCK_VACANT), kind: "line", colorIndex: 3 },
    ],
    unit: { ja: "万戸", en: "10k dwellings" },
    valueKind: "float1",
    yLabel: { ja: "万戸", en: "10,000 dwellings" },
    sourceIds: ["estat-jyutaku-timeseries", "statb-jyutaku-2023-kihon"],
    note: {
      ja: "5年ごとの調査時点（10月1日現在）。1963・1968年は沖縄県を含まない。空き家は「居住世帯のない住宅」のうち一時現在者のみの住宅・建築中を除く本体。",
      en: "Survey reference date 1 October, every five years. The 1963/1968 rounds exclude Okinawa. 'Vacant' excludes dwellings with only temporary occupants and dwellings under construction.",
    },
    rangeFilter: true,
  },
  // ----- 2. Tenure composition --------------------------------------------
  {
    id: "ch03-tenure-share",
    title: {
      ja: "住宅の所有関係の構成比：持ち家・公営・UR公社・民間借家・給与住宅（1963–2023年）",
      en: "Tenure composition: owned, public, UR/agency, private rental, company housing (1963–2023)",
    },
    description: {
      ja: "居住世帯のある住宅を所有関係別にみた構成比。持ち家率は1963年の64.3%をピークに長期緩やかに低下し2023年は60.9%。民間借家は24.1%から28.2%へ増加。給与住宅（会社寮等）は7.0%から2.3%へ大幅減少。公営借家は4.6%から3.2%へ。UR・公社借家の1963・1968年は当該分類が未集計のため欠損（グラフの空白）。",
      en: "Shares of occupied dwellings by tenure. The homeownership rate peaked at 64.3% in 1963 and has drifted down to 60.9% by 2023. Private rentals rose from 24.1% to 28.2%, while company housing collapsed from 7.0% to 2.3% and public rentals edged down from 4.6% to 3.2%. UR/agency rentals are missing for 1963/1968 (not yet tabulated) — shown as gaps, never interpolated.",
    },
    years: years(TENURE_OWNED),
    series: [
      { key: "owned", name: { ja: "持ち家", en: "Owned" }, values: values(TENURE_OWNED), kind: "line" },
      { key: "private", name: { ja: "民間借家", en: "Private rental" }, values: values(TENURE_PRIVATE), kind: "line" },
      { key: "public", name: { ja: "公営の借家", en: "Public rental" }, values: values(TENURE_PUBLIC), kind: "line" },
      { key: "ur", name: { ja: "UR・公社の借家", en: "UR/agency rental" }, values: values(TENURE_UR), kind: "line" },
      { key: "company", name: { ja: "給与住宅", en: "Company housing" }, values: values(TENURE_COMPANY), kind: "line" },
    ],
    unit: { ja: "%（居住世帯のある住宅=100）", en: "% (occupied dwellings = 100)" },
    valueKind: "float1",
    yLabel: { ja: "構成比（%）", en: "Share (%)" },
    sourceIds: ["estat-jyutaku-timeseries"],
    note: {
      ja: "分母は居住世帯のある住宅。1978年以降は所有関係「不詳」を分母に含むため5分類の合計は100%未満（2023年は95.9%）。持ち家はローン返済中・親名義の住宅も含む。1963・1968年は沖縄県を含まない。",
      en: "Denominator: occupied dwellings, which from 1978 include tenure 'unknown' — so the five categories sum to under 100% (95.9% in 2023). 'Owned' includes mortgaged and parent-titled dwellings. 1963/1968 exclude Okinawa.",
    },
    rangeFilter: true,
  },
  // ----- 3. Vacancy rate ---------------------------------------------------
  {
    id: "ch03-vacancy-rate",
    title: {
      ja: "空き家率の推移（1963–2023年・5年ごと）",
      en: "Vacancy rate, 1963–2023 (every 5 years)",
    },
    description: {
      ja: "総住宅数に占める空き家の割合。1963年の2.5%から30年後の1993年には約4倍（9.8%）となり、その後も2013年の13.5%、2018年の13.6%を経て2023年は13.8%と統計開始以来最高を更新。総住宅数が増え続ける一方で世帯数の増加が緩やかになったことの裏返し。",
      en: "Vacant dwellings as a share of total stock. The rate roughly quadrupled over the three decades to 1993 (2.5% → 9.8%) and has kept climbing since — 13.5% (2013), 13.6% (2018) and a record 13.8% in 2023. The mirror image of a stock that kept growing while household formation slowed.",
    },
    years: years(VACANCY_RATE),
    series: [
      { key: "rate", name: { ja: "空き家率", en: "Vacancy rate" }, values: values(VACANCY_RATE), kind: "line" },
    ],
    unit: { ja: "%（総住宅数に占める空き家の割合）", en: "% of total dwellings" },
    valueKind: "float1",
    yLabel: { ja: "空き家率（%）", en: "Vacancy rate (%)" },
    sourceIds: ["estat-jyutaku-timeseries", "statb-jyutaku-2023-kihon"],
    note: {
      ja: "確報値（2024年9月25日公表の基本集計）。分母は総住宅数（居住世帯あり＋なし）。1963・1968年は沖縄県を含まない。空き家には賃貸・売却用や別荘など二次的住宅も含まれる — 類型の内訳は次の図。",
      en: "Final figures (basic tabulation published 2024-09-25). Denominator: total dwellings. 1963/1968 exclude Okinawa. 'Vacant' includes units for rent, for sale and second dwellings — the type breakdown follows in the next chart.",
    },
    rangeFilter: true,
  },
  // ----- 4. Vacancy types --------------------------------------------------
  {
    id: "ch03-vacancy-types",
    title: {
      ja: "空き家の類型別戸数（2013・2018・2023年）",
      en: "Vacant dwellings by type (2013, 2018, 2023)",
    },
    description: {
      ja: "空き家の内訳。2023年では賃貸用の空き家が443.6万戸と最多（空き家の49.3%）。賃貸・売却用及び二次的住宅を除く空き家（いわゆる「その他」）は385.6万戸で42.8%を占め、2018年から36.9万戸増加している。二次的住宅（別荘等）は38.4万戸、売却用は32.6万戸。「賃貸用」には入居者募集中・即刻入居可の住宅も含まれ、直ちに使えないわけではない。",
      en: "Composition of vacancies. In 2023, dwellings vacant for rent dominate at 4.44 million (49.3% of all vacancies); 'other' vacancies — excluding those for rent, sale or as second homes — reached 3.86 million (42.8%), up 369 thousand from 2018. Second dwellings (holiday homes etc.) number 0.38 million and for-sale units 0.33 million. 'For rent' includes units on the market and immediately available — not unusable stock.",
    },
    years: [2013, 2018, 2023],
    series: [
      { key: "rental", name: { ja: "賃貸用の空き家", en: "For rent" }, values: values(VAC_TYPE_RENTAL), kind: "bar" },
      { key: "other", name: { ja: "賃貸・売却用及び二次的住宅を除く空き家", en: "Other vacancies" }, values: values(VAC_TYPE_OTHER), kind: "bar" },
      { key: "secondary", name: { ja: "二次的住宅", en: "Second dwellings" }, values: values(VAC_TYPE_SECONDARY), kind: "bar" },
      { key: "sale", name: { ja: "売却用の空き家", en: "For sale" }, values: values(VAC_TYPE_SALE), kind: "bar" },
    ],
    unit: { ja: "万戸", en: "10k dwellings" },
    valueKind: "float1",
    yLabel: { ja: "万戸", en: "10,000 dwellings" },
    sourceIds: ["estat-jyutaku-timeseries", "statb-jyutaku-2023-kihon"],
    note: {
      ja: "2023年に類型名称が整理された（2013・2018年の「その他の住宅」＝2023年の「賃貸・売却用及び二次的住宅を除く空き家」、概念は同一）。各類型とも100戸単位に丸められるため合計は総数（900.2万戸）と最大100戸ずれる。",
      en: "Categories were renamed in 2023 (the 2013/2018 'other' = the 2023 'excluding rent/sale/second' concept — identical definition). Each category is rounded to 100 dwellings, so the four bars can differ from the total (9.00 million) by up to 100.",
    },
  },
  // ----- 5. Prefecture vacancy rates ---------------------------------------
  {
    id: "ch03-pref-vacancy",
    title: {
      ja: "都道府県別の空き家率（2023年）",
      en: "Vacancy rate by prefecture (2023)",
    },
    description: {
      ja: "2023年の確報値。最も高いのは徳島県21.3%、和歌山県21.2%、鹿児島県20.5%、山梨県20.4%、高知県20.3%、長野県20.1%と、四国・紀伊半島・南九州の地方県が上位を占める。全国平均は13.8%。最も低いのは埼玉県9.3%、沖縄県9.4%、神奈川県9.8%で、人口流入の続く首都圏・那覇圏は戸数が伸び空き家率が低い。東京都は10.9%。",
      en: "Final 2023 figures. The highest rates are Tokushima 21.3%, Wakayama 21.2%, Kagoshima 20.5%, Yamanashi 20.4%, Kochi 20.3% and Nagano 20.1% — regional prefectures across Shikoku, the Kii Peninsula and southern Kyushu. The national average is 13.8%. The lowest are Saitama 9.3%, Okinawa 9.4% and Kanagawa 9.8%, where in-migration keeps stock utilisation high; Tokyo is 10.9%.",
    },
    years: PREF_VACANCY.map(([code]) => code),
    categories: PREF_VACANCY.map(([code]) => PREF_LABELS[code] ?? { ja: code, en: code }),
    series: [
      {
        key: "rate",
        name: { ja: "空き家率（2023年・確報）", en: "Vacancy rate (2023, final)" },
        values: PREF_VACANCY.map(([, v]) => v),
        kind: "bar",
      },
    ],
    unit: { ja: "%", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "空き家率（%）", en: "Vacancy rate (%)" },
    sourceIds: ["statb-jyutaku-2023-kihon"],
    horizontal: true,
    note: {
      ja: "図は空き家率の高い上位6県と全国平均、低い下位4都県の選択表示（47都道府県の全体分布ではなく、両端と平均を示す）。全国の分布は資料を参照。",
      en: "The chart selects the six highest prefectures, the national average and the four lowest — showing the extremes and the mean, not the full 47-prefecture distribution (see the archived source for all values).",
    },
  },
  // ----- 6. Floor area -----------------------------------------------------
  {
    id: "ch03-floor-area",
    title: {
      ja: "1住宅当たり延べ面積の推移：全体・持ち家・借家（1968–2023年）",
      en: "Average floor area per dwelling: all, owned, rented (1968–2023)",
    },
    description: {
      ja: "居住世帯のある住宅の1住宅当たり延べ面積。全体では1968年の73.86㎡から拡大し、2003年の94.85㎡をピークに、以降は緩やかに縮小して2023年は91.66㎡。持ち家は2023年で118.25㎡、借家は45.39㎡と約2.6倍の差。借家の面積は1998年の44.49㎡からほぼ横ばいで、賃貸住宅の狭さが構造的に続いている。",
      en: "Average total floor area of occupied dwellings rose from 73.86 m² (1968) to a 2003 peak of 94.85 m² before easing to 91.66 m² in 2023. Owned dwellings average 118.25 m² against 45.39 m² for rentals — a 2.6× gap that has barely moved since the late 1990s, reflecting the structural compactness of Japanese rental stock.",
    },
    years: years(AREA_TOTAL),
    series: [
      { key: "total", name: { ja: "全体", en: "All dwellings" }, values: values(AREA_TOTAL), kind: "line" },
      { key: "owned", name: { ja: "持ち家", en: "Owned" }, values: values(AREA_OWNED), kind: "line" },
      { key: "rented", name: { ja: "借家", en: "Rented" }, values: values(AREA_RENTED), kind: "line" },
    ],
    unit: { ja: "㎡（1住宅当たり延べ面積）", en: "m² per dwelling" },
    valueKind: "float2",
    yLabel: { ja: "延べ面積（㎡）", en: "Floor area (m²)" },
    sourceIds: ["estat-jyutaku-timeseries"],
    note: {
      ja: "時系列統計表第14-1表（居住世帯のある住宅全体が対象）。居住専用の「専用住宅」に限れば2023年は90.86㎡とやや小さくなる（分母が異なるため直接比較しない）。1968・1973年は沖縄県を含まない。",
      en: "Time-series table 14-1, covering ALL occupied dwellings. Restricting to dwellings built exclusively for residence gives 90.86 m² in 2023 — a different denominator, never mixed here. 1968/1973 exclude Okinawa.",
    },
    rangeFilter: true,
  },
  // ----- 7. FIES expenditure trend ----------------------------------------
  {
    id: "ch03-fies-expenditure",
    title: {
      ja: "二人以上の世帯の消費支出の推移（2000–2025年・名目・月平均）",
      en: "Monthly consumption expenditure, 2+ person households (2000–2025, nominal)",
    },
    description: {
      ja: "家計調査（家計収支編）による1世帯当たり月平均の消費支出（名目）。2000年の31.7万円から2010年代は28〜29万円台で推移し、2020年に27.8万円へ落ち込んだ後、2025年には31.4万円と2000年の水準（31.7万円）にほぼ戻った。ただし2025年の名目増加率+4.6%のうち物価上昇（+3.7%）を除いた実質増加は+0.9%にとどまる。",
      en: "Average monthly consumption expenditure per household (nominal) from the FIES. After drifting from ¥317 thousand (2000) to the ¥280–290 thousand range through the 2010s and dipping to ¥278 thousand in 2020, spending reached ¥314 thousand in 2025 — back to roughly the 2000 level. Of the +4.6% nominal rise in 2025, only +0.9% survives in real terms once +3.7% inflation is stripped out.",
    },
    years: years(FIES_EXPENDITURE),
    series: [
      { key: "exp", name: { ja: "消費支出（二人以上の世帯・名目）", en: "Consumption expenditure (2+ households, nominal)" }, values: values(FIES_EXPENDITURE), kind: "line" },
    ],
    unit: { ja: "円/月", en: "JPY/month" },
    valueKind: "int",
    yLabel: { ja: "円（月平均）", en: "JPY (monthly average)" },
    sourceIds: ["estat-fies-longtime", "statb-fies-2025"],
    note: {
      ja: "名目値。2018年1月の家計簿改正により増減率の連続性が一部断絶。実質（物価調整後）の推移は本文で解説。単身世帯は2025年で月17.3万円、総世帯（単身込み）は26.0万円。",
      en: "Nominal values; the January-2018 diary revision partially breaks YoY continuity. Real (inflation-adjusted) developments are discussed in the text. Solo households averaged ¥173 thousand and all households (incl. solo) ¥260 thousand per month in 2025.",
    },
    rangeFilter: true,
  },
  // ----- 8. FIES structure 2025 --------------------------------------------
  {
    id: "ch03-fies-structure",
    title: {
      ja: "消費支出の品目別構成比（2025年・二人以上の世帯・用途分類）",
      en: "Consumption expenditure by category (2025, 2+ households, use-based classification)",
    },
    description: {
      ja: "2025年の月平均消費支出314,001円の内訳。食料が28.6%と最大で、エンゲル係数は過去30年で最も高い水準に上昇。交通・通信14.5%、教養娯楽9.8%が続く。住居は5.9%と一見小さいが、これは持ち家世帯の家賃支出がほぼゼロであることを反映した統計上の性質で、賃貸世帯の実際の負担とは異なる（次の図を参照）。",
      en: "The 2025 monthly average of ¥314,001 by category. Food leads at 28.6% — an Engel coefficient near its three-decade high — followed by transport & communication at 14.5% and culture & recreation at 9.8%. Housing appears small at 5.9%, but that reflects owner-occupier households paying essentially no rent, not a light burden for renters (see the next chart).",
    },
    years: FIES_STRUCTURE.map(([k]) => k),
    categories: FIES_STRUCTURE.map(([k]) => ({ ja: k, en: FIES_STRUCTURE_EN[k] ?? k })),
    series: [
      {
        key: "share",
        name: { ja: "構成比（2025年・用途分類）", en: "Share (2025, use-based)" },
        values: FIES_STRUCTURE.map(([, amount, share]) => share),
        kind: "bar",
      },
    ],
    unit: { ja: "%（消費支出=100）", en: "% of consumption expenditure" },
    valueKind: "float1",
    yLabel: { ja: "構成比（%）", en: "Share (%)" },
    sourceIds: ["statb-fies-2025"],
    horizontal: true,
    note: {
      ja: "構成比は用途分類の公表値（品目分類の金額とは分類体系が異なるため混同しない）。住居には家賃地代のほか設備修繕・維持費等を含む。帰属家賃（持ち家の住居サービスの評価額）は含まない。家計調査の「持家率」87.3%（二人以上）は調査世帯構成に基づく値であり、住宅・土地統計調査の持ち家住宅率60.9%（住宅単位・全居住世帯）とは定義が異なる。",
      en: "Shares are the published use-classification values (not to be mixed with item-classification amounts). Housing includes rent, repairs and maintenance, but not imputed rent. The FIES 'owned-house' rate of 87.3% (2+ households) reflects the survey's household frame — a different definition from the Housing and Land Survey's dwelling-based homeownership rate of 60.9%.",
    },
  },
  // ----- 9. Rent burden (DERIVED) ------------------------------------------
  {
    id: "ch03-rent-burden",
    title: {
      ja: "住居費の負担割合：持ち家世帯と民営賃貸世帯（2025年・派生計算）",
      en: "Housing-cost burden: owner-occupiers vs private renters (2025, derived)",
    },
    description: {
      ja: "家計調査の住居の所有関係別表から当サイトが計算した「消費支出に占める住居費の割合」。二人以上の世帯では持ち家4.0%に対し民営借家20.9%と約5倍。単身世帯では持ち家4.2%に対し民営借家26.4%、単身全体では12.5%。民営借家の家賃地代は二人以上で67,107円/月・単身で49,831円/月。賃貸世帯の世帯主は平均より若く（二人以上・民営借家49.6歳 vs 全体60.7歳）、収入段階が異なる点に注意。",
      en: "Housing costs as a share of consumption expenditure, computed by this site from the FIES tenure table (the survey publishes amounts only). Among 2+ households the share is 4.0% for owner-occupiers versus 20.9% for private renters — a five-fold gap. For solo households: 4.2% owned vs 26.4% private rental (12.5% for all solo households). Rent alone averages ¥67,107/month (2+ private renters) and ¥49,831 (solo). Renters' household heads are younger on average (49.6 vs 60.7 years), so income stages differ.",
    },
    years: [
      "二人以上・持ち家",
      "二人以上・民営借家",
      "単身・持ち家",
      "単身・民営借家",
      "単身・全体",
    ],
    categories: [
      { ja: "二人以上・持ち家", en: "2+ · owned" },
      { ja: "二人以上・民営借家", en: "2+ · private rental" },
      { ja: "単身・持ち家", en: "Solo · owned" },
      { ja: "単身・民営借家", en: "Solo · private rental" },
      { ja: "単身・全体", en: "Solo · all" },
    ],
    series: [
      {
        key: "burden",
        name: { ja: "住居費 ÷ 消費支出（2025年）", en: "Housing ÷ consumption (2025)" },
        values: [
          FIES_BURDEN.twoPlusOwned,
          FIES_BURDEN.twoPlusPrivateRent,
          FIES_BURDEN.soloOwned,
          FIES_BURDEN.soloPrivateRent,
          FIES_BURDEN.soloAll,
        ],
        kind: "bar",
      },
    ],
    unit: { ja: "%（消費支出に占める住居費）", en: "% of consumption expenditure" },
    valueKind: "float1",
    yLabel: { ja: "住居費割合（%）", en: "Housing share (%)" },
    sourceIds: ["statb-fies-2025"],
    horizontal: true,
    note: {
      ja: "家計調査はこの割合を公表しないため、公表金額（住居費・消費支出）から当サイトが派生計算（四捨五入0.1ポイント）。単身・全体のみ公表構成比（12.5%）と一致。持ち家の住居費には固定資産税相当・修繕費等が含まれるがローン元本返済は含まない。",
      en: "DERIVED on this site from published FIES amounts (the survey itself publishes no such share), rounded to 0.1 pt; only the solo-all figure (12.5%) matches a published share. Owners' housing costs include property-tax equivalents and upkeep, but not mortgage principal repayments.",
    },
  },
  // ----- 10. CPI long run ---------------------------------------------------
  {
    id: "ch03-cpi-long",
    title: {
      ja: "消費者物価指数の長期推移（総合・2025年=100・1970–2025年）",
      en: "Consumer price index, all items (2025=100, 1970–2025)",
    },
    description: {
      ja: "2025年基準の長期接続系列による総合指数。1970年代のインフレ（1970年27.6→1980年65.4）とその後の安定、1990年代後半から2010年代のデフレ期（2010年84.7と1990年代半ばを下回る水準）、そして2022年以降の再インフレ（2025年=100）という約55年間の3つの局面が読める。",
      en: "The chain-linked all-items index on the 2025 base. Three regimes over 55 years: the 1970s inflation (27.6 in 1970 → 65.4 in 1980), the long deflationary drift from the late 1990s (84.7 in 2010, below the mid-1990s level), and the renewed inflation from 2022 (2025 = 100).",
    },
    years: years(CPI_LONG),
    series: [
      { key: "cpi", name: { ja: "総合指数（2025年=100）", en: "All items (2025=100)" }, values: values(CPI_LONG), kind: "line" },
    ],
    unit: { ja: "指数（2025年=100）", en: "Index (2025=100)" },
    valueKind: "float1",
    yLabel: { ja: "指数", en: "Index" },
    sourceIds: ["estat-cpi-2025base-lt", "statb-cpi-2025avg"],
    note: {
      ja: "2025年基準への移行に伴う接続指数（e-Stat・2026年8月7日公開）。2025年平均は旧2020年基準では111.9として公表された — 水準は基準により異なるが増減率は一致（+3.2%）。",
      en: "Chain-linked series from the 2025-base revision (e-Stat, published 2026-08-07). The 2025 annual average was also published on the old 2020 base as 111.9 — levels differ by base, YoY rates agree (+3.2%).",
    },
    rangeFilter: true,
  },
  // ----- 11. CPI groups -----------------------------------------------------
  {
    id: "ch03-cpi-groups",
    title: {
      ja: "品目群別の物価動向：総合・食料・住居・家賃・エネルギー（2020–2025年・2025年=100）",
      en: "Prices by group: all items, food, housing, rent, energy (2020–2025, 2025=100)",
    },
    description: {
      ja: "直近6年の品目群別指数。エネルギーは2022年に+17.1%と急騰した後も水準が最も高い上昇を維持。食料は2023年+8.1%・2025年+6.8%と総合を大きく上回る上昇。一方、家賃は2022年0.0%・2023年+0.1%・2024年+0.2%・2025年+0.3%と極めて緩やかで、日本のインフレ期における家賃の上昇の遅れが際立つ（民営家賃でも2025年+0.5%）。",
      en: "Group indices over the last six years. Energy spiked (+17.1% in 2022) and holds the highest level; food outpaced headline inflation at +8.1% (2023) and +6.8% (2025). Rent, by contrast, barely moved: 0.0% (2022), +0.1% (2023), +0.2% (2024), +0.3% (2025) — even private rents rose only +0.5% in 2025. Japan's rents lag its inflation by a wide margin.",
    },
    years: years(CPI_G_ALL),
    series: [
      { key: "energy", name: { ja: "エネルギー", en: "Energy" }, values: values(CPI_G_ENERGY), kind: "line", colorIndex: 3 },
      { key: "food", name: { ja: "食料", en: "Food" }, values: values(CPI_G_FOOD), kind: "line" },
      { key: "all", name: { ja: "総合", en: "All items" }, values: values(CPI_G_ALL), kind: "line" },
      { key: "housing", name: { ja: "住居", en: "Housing" }, values: values(CPI_G_HOUSING), kind: "line" },
      { key: "rent", name: { ja: "家賃", en: "Rent" }, values: values(CPI_G_RENT), kind: "line" },
    ],
    unit: { ja: "指数（2025年=100）", en: "Index (2025=100)" },
    valueKind: "float1",
    yLabel: { ja: "指数", en: "Index" },
    sourceIds: ["estat-cpi-2025base-lt"],
    note: {
      ja: "2025年基準の年平均指数。家賃は持家の帰属家賃を含む総合家賃（公営+民営+帰属）。エネルギーは別掲分類。2026年9月の総合は前年同月比+2.1%。",
      en: "Annual averages on the 2025 base. 'Rent' is the all-tenant aggregate including imputed rent for owner-occupiers; energy is a supplementary aggregate. As of September 2026 the headline CPI was running +2.1% YoY.",
    },
  },
  // ----- 12. OECD Japan trend ----------------------------------------------
  {
    id: "ch03-oecd-pti-japan",
    title: {
      ja: "日本の住宅価格所得比と実質住宅価格（1960–2025年・いずれも2015年=100の指数）",
      en: "Japan's price-to-income ratio and real house prices (1960–2025, both 2015=100 indices)",
    },
    description: {
      ja: "OECD分析的住宅価格統計による2つの指数。住宅価格所得比は1970年代初頭に213.1（1973年）まで急上昇した後、1990年代から2000年代にかけて長期低下し、2005年頃には約106、リーマン後の2009年には96.0まで下落。その後緩やかに回復し2025年は114.6。実質住宅価格は1991年の165.8を頂点に、2010年代には100前後まで調整した後、2025年は118.0へ上昇。バブル期の水準にはまだ遠い。",
      en: "Two indices from the OECD Analytical House Price Statistics. The price-to-income ratio surged to 213.1 in 1973, then ground lower for two decades to about 106 by 2005 and 96.0 in 2009, before recovering to 114.6 in 2025. Real house prices peaked at 165.8 in 1991, reset to around 100 through the 2010s, and reached 118.0 in 2025 — still far below bubble-era levels.",
    },
    years: years(OECD_PTI_JPN),
    series: [
      { key: "pti", name: { ja: "住宅価格所得比（2015年=100）", en: "Price-to-income ratio (2015=100)" }, values: values(OECD_PTI_JPN), kind: "line" },
      { key: "rhp", name: { ja: "実質住宅価格指数（2015年=100）", en: "Real house price index (2015=100)" }, values: values(OECD_RHP_JPN), kind: "line" },
    ],
    unit: { ja: "指数（2015年=100）", en: "Index (2015=100)" },
    valueKind: "float1",
    yLabel: { ja: "指数", en: "Index" },
    sourceIds: ["oecd-ahpi"],
    note: {
      ja: "いずれも2015年=100の指数であって価格水準や倍率ではない（UNIT_MEASURE=IX・BASE_PER=2015を全行で確認）。価格所得比は住宅価格を所得で割った相対指標の指数化。OECD編集値。",
      en: "Both are 2015=100 indices — neither price levels nor multiples (UNIT_MEASURE=IX, BASE_PER=2015 verified on every row). The ratio indexes house prices relative to income. OECD-compiled series.",
    },
    rangeFilter: true,
  },
  // ----- 13. OECD comparison ------------------------------------------------
  {
    id: "ch03-oecd-pti-compare",
    title: {
      ja: `国際比較：住宅価格所得比（${OECD_PTI_YEAR}年・2015年=100の指数・13カ国）`,
      en: `International comparison: price-to-income ratio (${OECD_PTI_YEAR}, 2015=100 index, 13 countries)`,
    },
    description: {
      ja: "同一年の住宅価格所得比。オランダ135.3、カナダ130.7、アメリカ126.3、スペイン125.9、オーストラリア119.9が2015年比で大きく上昇。日本は114.6と中位。韓国74.4・イタリア88.1・フランス94.1は2015年を下回る。2015年以降の上昇幅であって、国間の水準差ではない点に注意。",
      en: "Same-year price-to-income ratios. The Netherlands (135.3), Canada (130.7), the United States (126.3), Spain (125.9) and Australia (119.9) have risen most since 2015; Japan sits mid-table at 114.6, while Korea (74.4), Italy (88.1) and France (94.1) remain below their 2015 level. These are changes since 2015, NOT differences in levels between countries.",
    },
    years: OECD_PTI_COMPARE.map(([code]) => code),
    categories: OECD_PTI_COMPARE.map(([code]) => OECD_COUNTRIES[code] ?? { ja: code, en: code }),
    series: [
      {
        key: "pti",
        name: { ja: `住宅価格所得比（${OECD_PTI_YEAR}年・指数）`, en: `Price-to-income ratio (${OECD_PTI_YEAR}, index)` },
        values: OECD_PTI_COMPARE.map(([, v]) => v),
        kind: "bar",
      },
    ],
    unit: { ja: "指数（2015年=100）", en: "Index (2015=100)" },
    valueKind: "float1",
    yLabel: { ja: "指数", en: "Index" },
    sourceIds: ["oecd-ahpi"],
    horizontal: true,
    note: {
      ja: "2015年=100の指数値なので、値が100を超えていても「住宅が買えない」ことを直接意味しない。国ごとの指数の伸び率の比較であり、初期水準や制度差（固定金利の普及、賃貸市場の役割）は考慮していない。",
      en: "Because these are 2015=100 indices, exceeding 100 does not by itself mean housing is unaffordable. The chart compares index growth across countries and ignores starting levels and institutional differences (fixed-rate mortgage prevalence, the role of renting).",
    },
  },
];
