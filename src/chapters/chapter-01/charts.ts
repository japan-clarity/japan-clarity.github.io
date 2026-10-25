import type { ChartSpec } from "@/lib/research/types";
import {
  CENSUS_TOTAL,
  VITAL_BIRTHS,
  VITAL_DEATHS,
  TFR,
  LIFE_EXPECTANCY_MALE,
  LIFE_EXPECTANCY_FEMALE,
  AGING_SHARE_65_OBSERVED,
  AGING_SHARE_75_OBSERVED,
  AGING_SHARE_65_PROJECTED,
  AGING_SHARE_75_PROJECTED,
  HOUSEHOLD_SIZE,
  ONE_PERSON_SHARE,
  IPSS_MEDIUM_TOTAL,
  WB_JAPAN_SHARE_65,
  WB_JAPAN_SHARE_0_14,
  WB_JAPAN_SHARE_15_64,
  WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM,
  WB_COMPARE_SP_DYN_TFRT_IN,
  WB_COMPARE_YEAR_SP_POP_65UP_TO_ZS_NUM,
  WB_COMPARE_SP_POP_65UP_TO_ZS,
  WB_COUNTRIES,
} from "./data";

/**
 * Chapter 01 chart specifications.
 *
 * Every series references the generated verified data module; nothing is
 * hand-entered. Projections render as dashed series and carry
 * `projectionFromYear` so the UI can label them.
 */

const years = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([y]) => y);
const values = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([, v]) => v);

export const chapter01Charts: ChartSpec[] = [
  {
    id: "ch01-census-population",
    title: {
      ja: "総人口の長期的な推移（国勢調査 1920–2025）",
      en: "Long-term total population change (Census 1920–2025)",
    },
    description: {
      ja: "国勢調査（5年ごと）による日本の総人口の推移。1940年と1945年は戦時の補正人口。2010年の1億2806万人をピークに、2015年以降は減少に転じ、2025年は1億2297万人となった。",
      en: "Japan's total population at each five-yearly census. 1940 and 1945 are wartime corrected figures. After peaking at 128.06 million in 2010, the population turned downward from 2015, reaching 122.97 million in 2025.",
    },
    years: years(CENSUS_TOTAL),
    series: [
      {
        key: "census-total",
        name: { ja: "総人口（国勢調査）", en: "Total population (census)" },
        values: values(CENSUS_TOTAL),
        kind: "line",
      },
    ],
    unit: { ja: "人", en: "persons" },
    valueKind: "int",
    yLabel: { ja: "総人口（人）", en: "Total population (persons)" },
    sourceIds: ["statb-census-2025"],
    note: {
      ja: "総人口には外国人住民を含む。1945年は沖縄県を含まない補正人口。推計とセンサスは異なる統計製品である：2025年9月15日現在の人口推計（統計局の高齢者統計に再掲）は1億2,321万人だが、16日後の10月1日基準の国勢調査（基本集計確定値）は1億2,297万2,528人であった。",
      en: "Total population includes foreign residents; 1945 excludes Okinawa. Estimates and censuses are different statistical products: the Statistics Bureau's population estimate as of September 15, 2025 (republished in its elderly-release series) was 123.21 million, while the census count on the October 1 reference date (basic complete tabulation) was 122,972,528.",
    },
  },
  {
    id: "ch01-births-deaths",
    title: {
      ja: "出生数と死亡数の推移（1899–2025）",
      en: "Births and deaths, 1899–2025",
    },
    description: {
      ja: "人口動態統計（確定数）による年間の出生数と死亡数。1949年の出生数269万6638人が観測史上最大。2007年以降は死亡数が出生数を上回り、2025年は出生67万1270人・死亡158万9533人と、自然減少は19年連続となった。",
      en: "Annual live births and deaths from final vital statistics. Births peaked at 2,696,638 in 1949. Deaths have exceeded births since 2007; in 2025 there were 671,270 births and 1,589,533 deaths — the 19th consecutive year of natural decrease.",
    },
    years: years(VITAL_BIRTHS),
    series: [
      {
        key: "births",
        name: { ja: "出生数", en: "Live births" },
        values: values(VITAL_BIRTHS),
        kind: "line",
      },
      {
        key: "deaths",
        name: { ja: "死亡数", en: "Deaths" },
        values: values(VITAL_DEATHS),
        kind: "line",
      },
    ],
    unit: { ja: "人", en: "persons" },
    valueKind: "int",
    yLabel: { ja: "年間件数（人）", en: "Annual count (persons)" },
    sourceIds: ["mhlw-vital-2025"],
    note: {
      ja: "1944–1946年は戦災による資料喪失のため、統計上公表されていない（欠損として表示）。1947–1972年は沖縄県を含まない数値。出生・死亡は発生基準。",
      en: "1944–1946 are not published (records lost to war damage) and appear as gaps. 1947–1972 exclude Okinawa. Figures use the occurrence basis.",
    },
    rangeFilter: true,
  },
  {
    id: "ch01-tfr",
    title: {
      ja: "合計特殊出生率（TFR）の推移（1947–2025）",
      en: "Total fertility rate (TFR), 1947–2025",
    },
    description: {
      ja: "15〜49歳の女性の年齢別出生率を合計した、1人的女性が一生に産む子どもの数に相当する指標。1947年の4.54から低下し、2005年1.26、2015年1.45、2025年1.14と推移。2025年は過去最低を更新した。",
      en: "The sum of age-specific fertility rates for women aged 15–49, corresponding to the number of children per woman. It fell from 4.54 in 1947 through 1.26 in 2005 and 1.45 in 2015 to 1.14 in 2025 — a record low.",
    },
    years: years(TFR),
    series: [
      {
        key: "tfr",
        name: { ja: "合計特殊出生率", en: "Total fertility rate" },
        values: values(TFR),
        kind: "line",
      },
    ],
    unit: { ja: "人（女性1人当たり）", en: "births per woman" },
    valueKind: "float2",
    yLabel: { ja: "合計特殊出生率", en: "TFR" },
    sourceIds: ["mhlw-vital-2025"],
    note: {
      ja: "人口維持に必要とされる置換水準は約2.1。2025年の1.14は暫定性格を持ち、2025年国勢調査人口を分母とする再計算が2026年11月に実施予定。",
      en: "Replacement level is roughly 2.1. The 2025 figure (1.14) will be recalculated with the 2025 Census population in November 2026.",
    },
    rangeFilter: true,
  },
  {
    id: "ch01-tfr-compare",
    title: {
      ja: `国際比較：合計特殊出生率（${WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM}年、13の国・地域）`,
      en: `International comparison: total fertility rate (${WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM}, 13 economies)`,
    },
    description: {
      ja: `世界銀行WDIによる同一年（${WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM}年）の合計特殊出生率の比較。韓国0.75が最も低く、日本1.15も低位。フランス1.61、アメリカ1.63などが相対的に高い。`,
      en: `Same-year (${WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM}) fertility rates from World Bank WDI. South Korea is lowest at 0.75, with Japan at 1.15 also low; France (1.61) and the United States (1.63) are relatively higher.`,
    },
    years: WB_COMPARE_SP_DYN_TFRT_IN.map(([code]) => code),
    categories: WB_COMPARE_SP_DYN_TFRT_IN.map(([code]) => WB_COUNTRIES[code] ?? { ja: code, en: code }),
    series: [
      {
        key: "tfr",
        name: { ja: "合計特殊出生率", en: "Total fertility rate" },
        values: WB_COMPARE_SP_DYN_TFRT_IN.map(([, v]) => v),
        kind: "bar",
      },
    ],
    unit: { ja: "人（女性1人当たり）", en: "births per woman" },
    valueKind: "float2",
    horizontal: true,
    sourceIds: ["wb-wdi"],
    note: {
      ja: `世界銀行WDI（国連WPP等を編集した二次資料、CC BY 4.0）による${WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM}年値。日本の国内統計（厚生労働省）でも${WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM}年は1.15で一致。台湾はWDIに含まれないため比較対象としていない。縦軸の国名はWDIの経済コード。`,
      en: `World Bank WDI (a secondary compilation of UN WPP and national sources, CC BY 4.0), same year for all economies. Japan's national statistic (MHLW) also gives 1.15 for ${WB_COMPARE_YEAR_SP_DYN_TFRT_IN_NUM}. Taiwan is not included in WDI. Country labels are ISO codes.`,
    },
    csv: false,
  },
  {
    id: "ch01-aging",
    title: {
      ja: "高齢化の進展：65歳以上・75歳以上人口の割合（1950–2050）",
      en: "Progress of aging: population share aged 65+ and 75+ (1950–2050)",
    },
    description: {
      ja: "総人口に占める65歳以上人口の割合は、1950年4.9%から1985年10%、2005年20%を経て、2026年には29.6%に達した（75歳以上は17.7%）。統計局が再掲する将来推計（中位）では2040年34.8%まで上昇が続く。",
      en: "The share of population aged 65+ rose from 4.9% in 1950 through 10% in 1985 and 20% in 2005 to 29.6% in 2026 (75+: 17.7%). Under the republished medium projection it continues to 34.8% by 2040.",
    },
    years: [
      ...years(AGING_SHARE_65_OBSERVED),
      ...years(AGING_SHARE_65_PROJECTED),
    ],
    series: [
      {
        key: "share65-obs",
        name: { ja: "65歳以上（実測）", en: "65+ (observed)" },
        values: [
          ...values(AGING_SHARE_65_OBSERVED),
          ...years(AGING_SHARE_65_PROJECTED).map(() => null),
        ],
        kind: "line",
      },
      {
        key: "share65-proj",
        name: { ja: "65歳以上（推計）", en: "65+ (projected)" },
        values: [
          ...years(AGING_SHARE_65_OBSERVED).map(() => null),
          ...values(AGING_SHARE_65_PROJECTED),
        ],
        kind: "line",
        dashed: true,
      },
      {
        key: "share75-obs",
        name: { ja: "75歳以上（実測）", en: "75+ (observed)" },
        values: [
          ...values(AGING_SHARE_75_OBSERVED),
          ...years(AGING_SHARE_75_PROJECTED).map(() => null),
        ],
        kind: "line",
      },
      {
        key: "share75-proj",
        name: { ja: "75歳以上（推計）", en: "75+ (projected)" },
        values: [
          ...years(AGING_SHARE_75_OBSERVED).map(() => null),
          ...values(AGING_SHARE_75_PROJECTED),
        ],
        kind: "line",
        dashed: true,
      },
    ],
    unit: { ja: "％（総人口比）", en: "% of total population" },
    valueKind: "percent1",
    yLabel: { ja: "総人口に占める割合（%）", en: "Share of total (%)" },
    sourceIds: ["statb-aging-2026", "ipss-projection-2023"],
    projectionFromYear: 2030,
    note: {
      ja: "実測は2026年9月15日現在の人口推計に基づく（国勢調査の10月1日基準とは基準日が異なる）。2030年以降の破線は国立社会保障・人口問題研究所の2023年推計（中位）を統計局が再掲したもので、シナリオであり確定した未来ではない。",
      en: "Observed values are based on estimates as of Sept 15, 2026 (the reference date differs from the census's Oct 1 basis). Dashed values from 2030 republish the IPSS 2023 medium projection — a scenario, not a certain future.",
    },
  },
  {
    id: "ch01-age-structure",
    title: {
      ja: "年齢構造の変化（1960–2025、世界銀行推計）",
      en: "Changing age structure (1960–2025, World Bank estimates)",
    },
    description: {
      ja: "0–14歳・15–64歳・65歳以上の3区分でみた年齢構造の割合の変化。生産年齢人口（15–64歳）の割合は1990年代の約70%から58%台へ低下し、高齢者割合は約3割に達した。",
      en: "Population shares by three age groups. The working-age (15–64) share has fallen from about 70% in the 1990s to around 58%, while the 65+ share has reached roughly 30%.",
    },
    years: years(WB_JAPAN_SHARE_65),
    series: [
      {
        key: "age65",
        name: { ja: "65歳以上", en: "65 and over" },
        values: values(WB_JAPAN_SHARE_65),
        kind: "area",
        stack: "total",
      },
      {
        key: "age1564",
        name: { ja: "15–64歳", en: "15–64" },
        values: values(WB_JAPAN_SHARE_15_64),
        kind: "area",
        stack: "total",
      },
      {
        key: "age014",
        name: { ja: "0–14歳", en: "0–14" },
        values: values(WB_JAPAN_SHARE_0_14),
        kind: "area",
        stack: "total",
      },
    ],
    unit: { ja: "％（総人口比）", en: "% of total population" },
    valueKind: "percent1",
    yLabel: { ja: "構成比（%）", en: "Share (%)" },
    sourceIds: ["wb-wdi"],
    note: {
      ja: "世界銀行WDI（国連WPP基準の推計系列）。国内統計（2025年国勢調査：65歳以上29.4%）と推計方法の違いにより0.1〜0.6ポイント程度の差がある。比較可能な長期系列として使用。",
      en: "World Bank WDI series (UN WPP-based estimates). Due to methodology differences they differ by roughly 0.1–0.6pp from national statistics (2025 census: 65+ = 29.4%). Used as a comparable long series.",
    },
  },
  {
    id: "ch01-household-size",
    title: {
      ja: "平均世帯人員の減少（国勢調査 1960–2025）",
      en: "Shrinking households: average persons per household (Census 1960–2025)",
    },
    description: {
      ja: "1世帯当たりの平均人員は、1960年4.14人から2020年2.21人、2025年2.10人へと半世紀で半分近くに減少した。1965年は世帯定義の変更により比較可能な数値が公表されていない。",
      en: "Average household size fell from 4.14 persons in 1960 to 2.21 in 2020 and 2.10 in 2025 — nearly halving over half a century. No comparable 1965 value exists due to a household-definition change.",
    },
    years: years(HOUSEHOLD_SIZE),
    series: [
      {
        key: "size",
        name: { ja: "平均世帯人員（一般世帯）", en: "Average persons per household" },
        values: values(HOUSEHOLD_SIZE),
        kind: "line",
      },
    ],
    unit: { ja: "人／世帯", en: "persons per household" },
    valueKind: "float2",
    yLabel: { ja: "人／世帯", en: "persons" },
    sourceIds: ["statb-handbook-2026", "statb-census-2025"],
    note: {
      ja: "一般世帯（施設などの入院者を除く）ベース。1965年は欠損として表示。世帯数自体は増加が続いており、人口減少と世帯小型化が同時に進んでいる。",
      en: "Ordinary households (excluding institutional residents). 1965 appears as a gap. Household counts continue to grow even as the population shrinks.",
    },
  },
  {
    id: "ch01-one-person",
    title: {
      ja: "一人暮らし世帯の割合（国勢調査 2005–2025）",
      en: "One-person households (Census 2005–2025)",
    },
    description: {
      ja: "一般世帯に占める単独（一人暮らし）世帯の割合は、2005年29.5%から2020年38.1%、2025年41.4%へと上昇し、世帯類型の最大勢力となった（2,368万9千世帯）。",
      en: "One-person households rose from 29.5% of ordinary households in 2005 to 38.1% in 2020 and 41.4% in 2025 (23.69 million households), becoming the largest household type.",
    },
    years: years(ONE_PERSON_SHARE),
    series: [
      {
        key: "one-person",
        name: { ja: "単独世帯の割合", en: "One-person household share" },
        values: values(ONE_PERSON_SHARE),
        kind: "bar",
      },
    ],
    unit: { ja: "％（一般世帯比）", en: "% of ordinary households" },
    valueKind: "percent1",
    yLabel: { ja: "割合（%）", en: "Share (%)" },
    sourceIds: ["statb-handbook-2026", "statb-census-2025", "ipss-household-2024"],
    note: {
      ja: "将来推計（IPSS 2024年推計・中位）では、単独世帯の割合は2050年に44.3%へさらに上昇すると見込まれる（推計値）。2005〜2020年は統計局ハンドブック（Figure 2.3）の公表値、2025年は国勢調査による。なお2025年国勢調査の再集計表では2020年は38.0%と、ハンドブック（38.1%）から0.1ポイント異なる（公表時期の違いによるもので、両方とも統計局の公表値）。",
      en: "The IPSS 2024 household projection (medium) puts the one-person share at 44.3% by 2050 (a projection). Values for 2005–2020 are as published in the Statistics Bureau handbook (Figure 2.3); 2025 is from the census. Note: the 2025 census re-tabulation lists 2020 at 38.0%, 0.1pp different from the handbook's 38.1% (a publication-vintage difference; both are official Statistics Bureau values).",
    },
  },
  {
    id: "ch01-projection",
    title: {
      ja: "総人口の実測と将来推計（IPSS 2023年推計・中位）",
      en: "Observed population and the medium projection (IPSS 2023)",
    },
    description: {
      ja: "国勢調査による実測（2015・2020・2025年）と、国立社会保障・人口問題研究所の2023年推計（出生中位・死亡中位）。中位推計では総人口は2056年に1億人を下回り、2070年に8,699万6千人となる。2025年の実測（1億2297万人）は推計（1億2326万人）を29万人ほど下回った。",
      en: "Census observations (2015/2020/2025) against the IPSS 2023 medium variant. Under the medium scenario the population falls below 100 million in 2056 and reaches 86.99 million in 2070. The actual 2025 census count (122.97M) came in about 290k below the projection (123.26M).",
    },
    years: [2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070],
    series: [
      {
        key: "observed",
        name: { ja: "実測（国勢調査）", en: "Observed (census)" },
        values: [127094745, 126146099, 122972528, null, null, null, null, null, null, null, null, null].map(
          (v) => (v === null ? null : v / 1000),
        ),
        kind: "line",
      },
      {
        key: "medium",
        name: { ja: "将来推計（中位）", en: "Projection (medium)" },
        values: [null, ...values(IPSS_MEDIUM_TOTAL)],
        kind: "line",
        dashed: true,
      },
    ],
    unit: { ja: "千人", en: "thousand persons" },
    valueKind: "float1",
    yLabel: { ja: "総人口（千人）", en: "Total population (thousands)" },
    sourceIds: ["statb-census-2025", "ipss-projection-2023"],
    projectionFromYear: 2025,
    note: {
      ja: "推計はシナリオであり確定した未来ではない。前提は、合計特殊出生率が2070年に1.36（1.3573）まで緩やかに回復、平均寿命は2070年男85.89歳・女91.94歳、国際人口移動は2022–2040年 年16万3791人。上位・下位推計では2070年人口は9,549万人／8,024万人となる。",
      en: "Projections are scenarios, not certainties. Medium assumptions: TFR recovers gradually to 1.36 (1.3573) by 2070; 2070 life expectancy male 85.89 / female 91.94; net migration 163,791/year (2022–2040). High/low variants put the 2070 population at 95.49M / 80.24M.",
    },
  },
  {
    id: "ch01-life-expectancy",
    title: {
      ja: "平均寿命の推移（1947–2025）",
      en: "Life expectancy at birth (1947–2025)",
    },
    description: {
      ja: "0歳平均余命（平均寿命）の男女別推移。1947年男50.06歳・女53.96歳から、2025年には男81.35歳・女87.33歳に達した。女性の平均寿命は世界で最も高い水準と公表されている。",
      en: "Life expectancy at birth by sex. From 50.06 (male) / 53.96 (female) in 1947 it reached 81.35 / 87.33 in 2025. Female life expectancy is published as the world's highest.",
    },
    years: years(LIFE_EXPECTANCY_MALE),
    series: [
      {
        key: "male",
        name: { ja: "男性", en: "Male" },
        values: values(LIFE_EXPECTANCY_MALE),
        kind: "line",
      },
      {
        key: "female",
        name: { ja: "女性", en: "Female" },
        values: values(LIFE_EXPECTANCY_FEMALE),
        kind: "line",
      },
    ],
    unit: { ja: "歳", en: "years" },
    valueKind: "float1",
    yLabel: { ja: "平均寿命（歳）", en: "Life expectancy (years)" },
    sourceIds: ["mhlw-life-2025"],
    note: {
      ja: "簡易生命表（国勢調査年は完全生命表）。1971年以前は沖縄県を含まない。男女差は2025年で5.98年。",
      en: "Abridged life tables (complete tables in census years). Okinawa excluded before 1972. The male–female gap in 2025 is 5.98 years.",
    },
    rangeFilter: true,
  },
  {
    id: "ch01-aging-compare",
    title: {
      ja: `国際比較：65歳以上人口の割合（${WB_COMPARE_YEAR_SP_POP_65UP_TO_ZS_NUM}年、13の国・地域）`,
      en: `International comparison: share aged 65+ (${WB_COMPARE_YEAR_SP_POP_65UP_TO_ZS_NUM}, 13 economies)`,
    },
    description: {
      ja: `世界銀行WDIによる同一年（${WB_COMPARE_YEAR_SP_POP_65UP_TO_ZS_NUM}年）の65歳以上人口割合。日本は約30%で比較対象の中で最も高く、イタリア25.1%、ドイツ23.7%が続く。`,
      en: `Same-year (${WB_COMPARE_YEAR_SP_POP_65UP_TO_ZS_NUM}) shares of population aged 65+ from World Bank WDI. Japan is highest at about 30%, followed by Italy (25.1%) and Germany (23.7%).`,
    },
    years: WB_COMPARE_SP_POP_65UP_TO_ZS.map(([code]) => code),
    categories: WB_COMPARE_SP_POP_65UP_TO_ZS.map(([code]) => WB_COUNTRIES[code] ?? { ja: code, en: code }),
    series: [
      {
        key: "share65",
        name: { ja: "65歳以上人口の割合", en: "Share aged 65+" },
        values: WB_COMPARE_SP_POP_65UP_TO_ZS.map(([, v]) => v),
        kind: "bar",
      },
    ],
    unit: { ja: "％（総人口比）", en: "% of total population" },
    valueKind: "percent1",
    horizontal: true,
    sourceIds: ["wb-wdi"],
    note: {
      ja: `WDIの推計系列による${WB_COMPARE_YEAR_SP_POP_65UP_TO_ZS_NUM}年値。日本の国内推計（統計局・2026年9月公表）では29.6% — 推計手法の違いによる差として両者を併記する。統計局の集計では、人口4千万以上の39か国の中で日本が最高（国連推計に基づく国際比較）。`,
      en: `WDI estimates for ${WB_COMPARE_YEAR_SP_POP_65UP_TO_ZS_NUM}. Japan's national estimate (Statistics Bureau, Sept 2026) is 29.6% — both are shown as a methodological difference. In the bureau's comparison of 39 countries with population ≥40M (UN estimates), Japan ranks highest.`,
    },
    csv: false,
  },
];

/** Bilingual country labels for the horizontal comparison charts. */
export function wbCountryLabel(code: string): { ja: string; en: string } {
  return WB_COUNTRIES[code] ?? { ja: code, en: code };
}

export function getChapter01Chart(id: string): ChartSpec | undefined {
  return chapter01Charts.find((c) => c.id === id);
}
