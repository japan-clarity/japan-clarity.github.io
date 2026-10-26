import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 01 — Population & Family. Research narrative, sections 1–8.
 *
 * Every figure in this text is drawn from the verified data module
 * (src/chapters/chapter-01/data.ts, generated from archived official
 * documents — see research/chapter01/notes/). Nothing is estimated by the
 * authors; projections are always labeled as projections.
 */
export const chapter01SectionsA: ChapterSection[] = [
  {
    id: "intro",
    heading: {
      ja: "1. この章の読み方",
      en: "1. How to read this chapter",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "この章は、日本の人口と家族の変化を「健診」のように調べます。まず測定可能な状態を観測し（観測）、原典で数値を検証し（検証）、手法が整合する国々と比較し（比較）、考えられる説明を検討し（調査）、対応の方向と不確実性を評価し（評価）、現実的な行動を整理します（行動）。",
          en: "This chapter examines Japan's population and family change the way a careful medical examination works: observe measurable conditions, verify the figures against original sources, compare with methodologically compatible countries, weigh possible explanations, evaluate directions and their uncertainty, and outline realistic actions.",
        },
      },
      {
        type: "p",
        text: {
          ja: "取り上げるのは、人口の長期推移、出生と死亡、出生力（合計特殊出生率）、高齢化、年齢構造、世帯と家族の変化、国内人口移動、将来推計、平均寿命です。使用する統計は、総務省統計局（国勢調査・人口推計）、厚生労働省（人口動態統計・生命表）、国立社会保障・人口問題研究所（将来推計）、そして国際比較には世界銀行WDIです。いずれも2026年10月22日に原典から取得し、数値を文書内で直接確認しています。",
          en: "We cover long-run population change, births and deaths, fertility (total fertility rate), aging, age structure, household and family change, internal migration, official projections, and life expectancy. Sources: the Statistics Bureau of Japan (census, population estimates), MHLW (vital statistics, life tables), IPSS (projections), and — for international comparison — World Bank WDI. All were fetched from the original domains on 2026-10-22, and every cited figure was read inside the archived documents.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "統計の「種類」の違いに注意",
          en: "Mind the statistical product",
        },
        text: {
          ja: "同じ「人口」でも、国勢調査（全数調査・5年ごと・10月1日基準）、人口推計（月次・推計値）、人口動態統計（その年に発生した出生・死亡の登録）では、対象も基準日も異なります。例えば2025年9月15日現在の人口推計では1億2,321万人、その16日後の10月1日の国勢調査（基本集計確定値）では1億2,297万2,528人と、製品ごとに値が異なります。本chapter（章）では各図表に出典と種類を明記し、混同しないようにします。",
          en: "Even the word \"population\" refers to different products: the census (full enumeration, every five years, as of October 1), population estimates (monthly), and vital statistics (registered births and deaths during the year). For example, the population estimate as of September 15, 2025 was 123.21 million, while the census count sixteen days later (October 1, 2025, basic complete tabulation) was 122,972,528. Every figure here carries its source and product type.",
        },
      },
    ],
  },
  {
    id: "population-longterm",
    heading: {
      ja: "2. 人口の長期的な推移",
      en: "2. The long run: population growth and decline",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "国勢調査の歴史は、日本の人口が約1世紀かけて倍増し、そして縮み始めた過程を記録しています。1920年（大正9年）の第1回国勢調査で5,596万人だった総人口は、戦前・戦中の補正を経て1950年に8,411万人、1970年に1億466万5,171人、そして2010年に史上最大の1億2,805万7,352人に達しました。",
          en: "The census record traces a century in which Japan's population roughly doubled and then began to contract. From 55.96 million in the first census of 1920, the total passed 84.11 million in 1950, reached 104.67 million in 1970, and peaked at 128,057,352 in 2010 — the highest count ever recorded.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-census-population",
      },
      {
        type: "p",
        text: {
          ja: "2015年の国勢調査（1億2,709万4,745人）で初めて前回比の減少が記録され、2020年は1億2,614万6,099人、2025年は1億2,297万2,528人と減少が続いています。2025年対2020年の減少幅は317万3,571人（▲2.5%）で、国勢調査開始以来最大の5年間減少となりました。人口増加は東京都（▲ではなく＋1.3%）を除く46道府県で減少という偏りを伴っています。",
          en: "The 2015 census (127,094,745) recorded the first intercensal decline, followed by 126,146,099 in 2020 and 122,972,528 in 2025. The 2020→2025 change of −3,173,571 (−2.5%) is the largest five-year census decline on record — and it is uneven: all prefectures lost population except Tokyo (+1.3%).",
        },
      },
      {
        type: "callout",
        kind: "observation",
        text: {
          ja: "2025年10月1日現在の総人口1億2,297万2,528人のうち、日本人人口は1億1,913万2千人（96.9%）、外国人人口は384万0,039人（3.1%）です。直近の月次推計では、2026年10月1日の概算人口は1億2,269万人（前年比▲53万人）、2026年5月1日確定値では日本人11,883万8千人（▲85万5千人）・外国人397万4千人（＋32万5千人）と、減少の内訳が日本人人口の減少と外国人人口の増加の併存であることが分かります。",
          en: "Of the 122,972,528 residents on October 1, 2025, 119.13 million (96.9%) were Japanese and 3.84 million (3.1%) were foreign residents. The latest monthly estimates add detail: as of October 1, 2026 (provisional) the total is about 122.69 million (−530k year-on-year), while final May 1, 2026 figures show Japanese residents down 855k to 118.84 million and foreign residents up 325k to 3.97 million.",
        },
      },
    ],
  },
  {
    id: "births-deaths",
    heading: {
      ja: "3. 出生と死亡：人口の入口と出口",
      en: "3. Births and deaths: the inflow and outflow",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "人口の自然増減は、年間の出生数と死亡数の差で決まります。日本の出生数は、1949年の269万6,638人（第一次ベビーブームの頂点）から長期的に減少しています。2025年の出生数は67万1,270人で、1899年の統計開始以来最少を更新しました。婚姻件数も2025年は48万9,158組と低位です。",
          en: "Natural change is the balance of births and deaths. Births have declined over the long run from their all-time peak of 2,696,638 in 1949 (the first baby boom). In 2025, 671,270 babies were born — the lowest count since statistics began in 1899. Marriages were also low, at 489,158.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-births-deaths",
      },
      {
        type: "p",
        text: {
          ja: "一方、死亡数は高齢人口の増大を反映して増えてきました。2025年の死亡数は158万9,533人（前年160万5,378人からは5年ぶりに減少）。出生数が死亡数を下回る「自然減少」は、2005年に初めて発生し（▲2万1,266人）、2006年に一旦解消された後、2007年から2025年まで19年連続で続いています。減少幅が過去最大なのは2024年の▲91万9,205人で、2025年は▲91万8,263人とわずかに縮小しました。",
          en: "Deaths, meanwhile, have risen with the growing elderly population — 1,589,533 in 2025 (down from 1,605,378 in 2024, the first decline in five years). Natural decrease first appeared in 2005 (−21,266), briefly reversed in 2006, and has continued for 19 consecutive years since 2007. The largest gap on record remains 2024's −919,205; in 2025 it narrowed slightly to −918,263.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: { ja: "欠損年の意味", en: "About the missing years" },
        text: {
          ja: "グラフの1944〜1946年に値がないのは、データの欠如ではなく、厚生労働省が「戦災による資料喪失等資料不備のため省略した」と公表しているためです。また1947〜1972年の数値は沖縄県を含みません。出生・死亡は「発生基準」（届出日ではなく出来事の発生に基づく集計）です。",
          en: "The empty 1944–1946 cells are not lost data — the MHLW states those years were omitted because records were lost to war damage. Figures for 1947–1972 exclude Okinawa. Births and deaths are compiled on the occurrence basis (the event, not the registration date).",
        },
      },
    ],
  },
  {
    id: "fertility",
    heading: {
      ja: "4. 出生力の水準：合計特殊出生率",
      en: "4. Fertility level: the total fertility rate",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "出生数は人口規模の影響を受けるため、出生力そのものを比べるには合計特殊出生率（TFR：15〜49歳の女性の年齢別出生率の合計）を使います。日本のTFRは、1947年の4.54から第二次ベビーブーム期（1971〜1974年、出生数200万人超）を経て低下し続けました。",
          en: "Because raw birth counts depend on population size, fertility itself is compared through the total fertility rate (TFR: the sum of age-specific fertility rates for women aged 15–49). Japan's TFR fell from 4.54 in 1947, through the second baby boom (1971–1974, with births above two million), and kept declining.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-tfr",
      },
      {
        type: "p",
        text: {
          ja: "2005年に1.26を付けた後、2015年には1.45まで戻したものの、以降は再び低下しています。2020年1.33、2021年1.30、2022年1.26、2023年1.20、2024年1.15、そして2025年は1.14と、過去最低を更新しました。人口規模を長期にわたって維持するとされる置換水準（約2.1）の半分強の水準です。",
          en: "After bottoming at 1.26 in 2005, the rate recovered to 1.45 by 2015 — and has fallen since: 1.33 (2020), 1.30 (2021), 1.26 (2022), 1.20 (2023), 1.15 (2024), and a record-low 1.14 in 2025 — roughly half the replacement level of about 2.1 needed for long-run population stability.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        text: {
          ja: "2025年の1.14は暫定的な性格を持つ数値です。厚生労働省は、率の計算に用いる分母人口を2025年国勢調査確定人口に切り替える再計算を2026年11月に実施する予定を公表しており、その際に値が改訂される可能性があります。",
          en: "The 2025 figure of 1.14 is provisional in character: the MHLW has announced that rates will be recalculated in November 2026 using the 2025 Census population as the denominator, and the value may be revised.",
        },
      },
    ],
  },
  {
    id: "fertility-compare",
    heading: {
      ja: "5. 出生力の国際比較",
      en: "5. Fertility in comparison",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "出生力の低さは日本特有の現象ではなく、比較した13の国・地域に共通する構造です。世界銀行WDIによる同一年（2024年）の比較では、韓国0.75、シンガポール0.97、イタリア1.18、日本1.15（国内統計でも同じく1.15）が最も低いグループで、フランス1.61、アメリカ1.63、ニュージーランド1.57が相対的に高いグループです。",
          en: "Low fertility is not unique to Japan — it is a shared structure across the 13 economies compared. In the same-year (2024) World Bank comparison, South Korea (0.75), Singapore (0.97), Italy (1.18), and Japan (1.15 — identical in the national statistic) form the lowest group, while France (1.61), the United States (1.63), and New Zealand (1.57) are comparatively higher.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-tfr-compare",
      },
      {
        type: "callout",
        kind: "comparison",
        text: {
          ja: "同じ年の値を並べていますが、国際比較には常に留意点があります。各国の出生登録の仕組みや、TFR計算に使う女性人口の推計方法は完全には一致しません。ここでは世界銀行が国連「世界人口推計」や各国統計を編集した系列を、同一基準の比較として使用しています（日本国内の叙述には国内統計を使用）。台湾はWDIの対象に含まれないため、この比較には含めていません。",
          en: "The values are same-year, but comparisons always carry caveats: birth registration systems and the female-population estimates behind each TFR differ across countries. We use the World Bank's compilation of UN World Population Prospects and national sources as a consistent yardstick (national statistics are used for Japan's own narrative). Taiwan is not covered by WDI and is therefore not included.",
        },
      },
    ],
  },
  {
    id: "aging",
    heading: {
      ja: "6. 高齢化の進展",
      en: "6. The progress of aging",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "総人口に占める65歳以上人口の割合は、1950年4.9%から一貫して上昇しています。1985年に10%、2005年に20%を超え、2026年には29.6%と過去最高を更新しました（2026年9月15日推計ベース。65歳以上3,624万人）。75歳以上も17.7%（2,168万人）に達し、80歳以上は1,288万人、85歳以上は720万人です。",
          en: "The share of the population aged 65+ has risen consistently from 4.9% in 1950: past 10% in 1985, 20% in 2005, and a record 29.6% in 2026 (estimates as of September 15, 2026; 36.24 million people). The 75+ share has reached 17.7% (21.68 million), with 12.88 million aged 80+ and 7.20 million aged 85+.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-aging",
      },
      {
        type: "p",
        text: {
          ja: "高齢化の背景には、寿命の伸び（後述）と出生数の減少という2つの力があります。統計局が再掲する将来推計（IPSS 2023年推計・中位）では、65歳以上人口は2043年に3,953万人でピークを迎えた後も人口全体の縮小の中で割合は上昇を続け、2070年には38.7%に達すると見込まれています（推計値）。",
          en: "Aging is driven by two forces: longer lifespans (below) and fewer births. Under the medium IPSS 2023 projection republished by the Statistics Bureau, the 65+ population peaks at 39.53 million in 2043, while its *share* keeps rising to 38.7% by 2070 as the total shrinks (a projection).",
        },
      },
    ],
  },
  {
    id: "age-structure",
    heading: {
      ja: "7. 年齢構造の変化",
      en: "7. The changing age structure",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "3つの年齢区分で構造の変化を見ると、生産年齢人口（15〜64歳）の割合が1990年代前半の約70%から6割弱へ低下し、子ども（0〜14歳）の割合は約11%、高齢者（65歳以上）は約30%となっています。2025年国勢調査では、0〜14歳10.9%（1,334万9千人）、15〜64歳は7,348万1千人、65歳以上は29.4%です。",
          en: "Viewed by three age groups, the working-age (15–64) share has fallen from about 70% in the early 1990s to just under 60%, children (0–14) are around 11%, and the 65+ share is about 30%. In the 2025 census: 0–14 at 10.9% (13.35 million), 15–64 at 73.48 million, and 65+ at 29.4%.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-age-structure",
      },
      {
        type: "callout",
        kind: "note",
        text: {
          ja: "このグラフは世界銀行WDIの推計系列（1960〜2025年）を使用しています。推計方法の違いから国内統計（国勢調査・人口推計）とは0.1〜0.6ポイント程度の差がありますが、60年超の連続した比較可能系列として利用しています。国内確定値は本文と各表の数値をご覧ください。",
          en: "This chart uses the World Bank WDI estimate series (1960–2025). Because of methodology differences it deviates from national statistics by roughly 0.1–0.6 percentage points, but it provides a comparable 60+ year series; see the narrative and tables for national final values.",
        },
      },
    ],
  },
  {
    id: "aging-compare",
    heading: {
      ja: "8. 高齢化の国際比較",
      en: "8. Aging in comparison",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "高齢化の水準も国際比較で捉える必要があります。世界銀行WDIの同年（2025年）比較では、日本の65歳以上人口割合は約30.0%で、比較した13の国・地域の中で最も高く、イタリア25.1%、ドイツ23.7%が続きます。統計局の集計（人口4千万以上39か国、国連推計基準）でも、日本の29.6%は世界最高です。",
          en: "The level of aging also needs comparison. In the same-year (2025) WDI comparison, Japan's 65+ share of about 30.0% is the highest among the 13 economies, followed by Italy (25.1%) and Germany (23.7%). The Statistics Bureau's own comparison (39 countries with populations above 40 million, UN-based) also ranks Japan's 29.6% highest in the world.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-aging-compare",
      },
      {
        type: "callout",
        kind: "comparison",
        text: {
          ja: "「世界一の高齢化」は事実として重要ですが、それは優劣ではなく、到達段階の違いでもあります。韓国（20.3%）は日本より約10ポイント低いものの、出生率が日本より低いため、将来の高齢化速度が速いと予測されています。順位は国の社会的価値を測るものではありません。",
          en: "\"The world's highest aging share\" is an important fact — but it reflects a stage of transition rather than virtue or failure. South Korea (20.3%) is about ten points below Japan today, yet with lower fertility it is projected to age faster in the coming decades. Rankings never measure a society's worth.",
        },
      },
    ],
  },
];
