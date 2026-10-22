import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 01 — Population & Family. Research narrative, sections 9–16.
 * Same verification rules as content-a.ts.
 */
export const chapter01SectionsB: ChapterSection[] = [
  {
    id: "households",
    heading: {
      ja: "9. 世帯と家族の変化",
      en: "9. Households and family change",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "人口の縮小と並んで重要なのが、世帯の小型化です。一般世帯の1世帯当たり平均人員は、1960年の4.14人から2020年2.21人、2025年2.10人へと半分近くまで減少しました。世帯数は2025年に5,718万1,619世帯とまだ増加しています（2020年比147万7千増）。人口が減っても世帯が増える期間が続くのは、小型化の速度が人口減少より速いためです。",
          en: "As important as population decline itself is the shrinking of households. Average household size fell from 4.14 persons in 1960 to 2.21 in 2020 and 2.10 in 2025, while the number of ordinary households is still growing — 57,181,619 in 2025 (+1.477 million versus 2020). Households keep increasing because they are shrinking faster than the population is falling.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-household-size",
      },
      {
        type: "chart",
        chartId: "ch01-one-person",
      },
      {
        type: "p",
        text: {
          ja: "世帯類型では、単独（一人暮らし）世帯が2025年に2,368万9,024世帯と一般世帯の41.4%を占め、最大のグループとなりました（2020年38.1%、2005年29.5%）。核家族世帯は2020年に54.2%でした。高齢者を含む世帯の増加も著しく、高齢者世帯（65歳以上の者がいる一般世帯）は2020年に2,266万世帯、一般世帯の40.7%に達しています。",
          en: "By household type, one-person households reached 23,689,024 — 41.4% of all ordinary households — in 2025, the largest group (38.1% in 2020; 29.5% in 2005). Nuclear-family households were 54.2% in 2020. Elderly households (ordinary households with at least one member aged 65+) numbered 22.66 million — 40.7% of households — in 2020.",
        },
      },
      {
        type: "p",
        text: {
          ja: "家族形成の側面では、婚姻件数が1899年以来の長期低下の中にあり、2025年は48万9,158組です（1972年の109万9,984組、2000年の79万8,138組と比較すると半分以下）。50歳時の未婚率（生涯未婚率の指標）は2020年国勢調査で男性28.3%・女性17.8%に達しています。初婚年齢は2025年概数で夫31.0歳・妻29.7歳と上昇傾向です（暫定値）。",
          en: "On family formation, marriages have declined over the long run — 489,158 in 2025, less than half of 1,099,984 (1972) and well below 798,138 (2000). The never-married share at age 50 reached 28.3% for men and 17.8% for women in the 2020 census. Mean age at first marriage is rising — 31.0 (groom) and 29.7 (bride) in preliminary 2025 figures.",
        },
      },
      {
        type: "callout",
        kind: "note",
        text: {
          ja: "国立社会保障・人口問題研究所の世帯数将来推計（2024年推計・中位）では、一般世帯数は2030年に5,773万世帯でピークに達し、その後減少へ転じる見込みです。平均世帯人員は2033年に2人未満、単独世帯の割合は2050年に44.3%へ上昇すると推計されています（いずれも推計値）。",
          en: "The IPSS 2024 household projection (medium) puts the number of ordinary households at a 2030 peak of 57.73 million, after which it turns downward; average size falls below 2 persons in 2033, and one-person households rise to 44.3% by 2050 (projections).",
        },
      },
    ],
  },
  {
    id: "migration",
    heading: {
      ja: "10. 国内人口移動と地域差",
      en: "10. Internal migration and regional differences",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "人口減少は地域によって大きく異なります。2025年の住民基本台帳人口移動報告によれば、転入超過（社会増）は東京都が6万5,219人で最多。東京圏（東京都・神奈川・埼玉・千葉）全体の転入超過は12万3,534人で、日本人移動者に限る東京圏転入超過は30年連続で続いています。全国の市町村間移動者数は519万548人です。",
          en: "Decline is geographically uneven. According to the 2025 internal migration report, Tokyo had the largest net in-migration (65,219). The Tokyo metropolitan area (Tokyo, Kanagawa, Saitama, Chiba) gained a net 123,534 — and net in-migration of Japanese movers alone has now continued for 30 consecutive years. Total inter-municipal moves were 5,190,548.",
        },
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "6万5,219人", en: "65,219" },
            label: { ja: "2025年の東京都転入超過数", en: "Tokyo net in-migration, 2025" },
            sourceId: "statb-migration-2025",
          },
          {
            value: { ja: "12万3,534人", en: "123,534" },
            label: { ja: "東京圏の転入超過数（2025年）", en: "Tokyo metro area net in-migration, 2025" },
            sourceId: "statb-migration-2025",
          },
          {
            value: { ja: "30年連続", en: "30 years" },
            label: {
              ja: "日本人移動者による東京圏転入超過の連続年数",
              en: "Consecutive years of Tokyo-area net in-migration (Japanese movers)",
            },
            sourceId: "statb-migration-2025",
          },
        ],
      },
      {
        type: "p",
        text: {
          ja: "2025年国勢調査でも、人口が増えたのは東京都（＋1.3%）だけで、他の46道府県はすべて減少しました。東京圏への集中は、東京都の人口1,423万7千人（全国の11.6%）、東京圏3,697万5千人（同30.1%）という集積として現れています。都道府県別の詳細な年代構成や、圏域間移動の更なる分析は今後の調査課題です（調査中）。",
          en: "The 2025 census confirms the pattern: only Tokyo grew (+1.3%); the other 46 prefectures all declined. Concentration appears as Tokyo's 14.237 million residents (11.6% of the national total) and the metro area's 36.975 million (30.1%). More granular regional analysis — age structures by prefecture, and flows between regions — remains future work (research in progress).",
        },
      },
    ],
  },
  {
    id: "projections",
    heading: {
      ja: "11. 将来推計：人口はどう見込まれているか",
      en: "11. Projections: what is projected, and how",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "ここまでの数字は「実測」でした。将来については、国立社会保障・人口問題研究所が2023年12月に公表した「日本の将来推計人口」（2023年推計）が、公的な議論の基準になっています。これは確定した未来の予言ではなく、出生・死亡・移動に関する仮定の下でのシナリオ計算です。2026年10月時点で、これより新しい全国推計は公表されていません。",
          en: "Everything so far has been observation. For the future, the reference used in public discussion is the IPSS \"Population Projections for Japan\" (2023 round, published December 2023). These are scenario calculations under explicit birth, death, and migration assumptions — not prophecies. As of October 2026 no newer national round has been published.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-projection",
      },
      {
        type: "p",
        text: {
          ja: "中位推計（出生中位・死亡中位）では、総人口は2030年1億2,012万人、2050年1億469万人と減少し、2056年に1億人を下回り、2070年には8,699万6千人（2020年の69.0%）となります。仮定は、合計特殊出生率が2025年1.2713から2070年1.3573へ緩やかに回復すること、平均寿命が2070年に男性85.89歳・女性91.94歳へ伸びること、国際人口移動（出入国差引き）が2022〜2040年は年16万3,791人であることなどです。",
          en: "Under the medium variant (medium fertility and mortality), the population falls to 120.12 million in 2030 and 104.69 million in 2050, drops below 100 million in 2056, and reaches 86.99 million in 2070 — 69.0% of the 2020 level. Key assumptions: TFR recovers gradually from 1.2713 (2025) to 1.3573 (2070); life expectancy rises to 85.89 (male) / 91.94 (female) by 2070; net international migration of 163,791 per year for 2022–2040.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: { ja: "推計と実測の差", en: "Projection vs. observation" },
        text: {
          ja: "推計の前提が現実とどう異なるかは、すでに検証可能です。2023年推計の中位値は2025年を1億2,326万2千人と見込んでいましたが、2025年国勢調査の実測は1億2,297万3千人と、約29万人下回りました。また出生位相を変えた上位・下位推計では、2070年総人口は9,549万人／8,024万人と大きく開きます。将来推計は「仮定に依存した幅」を持つ数値として扱う必要があります。",
          en: "The assumptions are already testable against reality. The 2023 medium projection put 2025 at 123.26 million, but the actual 2025 census count came in about 290k lower at 122.97 million. High- and low-fertility variants put the 2070 population at 95.49 and 80.24 million — a wide band. Projections must be read as assumption-dependent ranges, not single destinies.",
        },
      },
    ],
  },
  {
    id: "life-expectancy",
    heading: {
      ja: "12. 平均寿命：最大の到達点の一つ",
      en: "12. Life expectancy: one of Japan's greatest achievements",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "人口の課題を語るとき、日本社会の最大の到達点の一つを忘れてはなりません。平均寿命（0歳平均余命）は、1947年に男性50.06歳・女性53.96歳だったものが、1980年には73.35歳／78.76歳、2025年には男性81.35歳・女性87.33歳に達しました。女性の平均寿命は、厚生労働省の公表によれば世界で最も高い水準です。",
          en: "When discussing demographic challenges, one of Japan's greatest achievements must not be forgotten. Life expectancy at birth rose from 50.06 (male) / 53.96 (female) in 1947, through 73.35 / 78.76 in 1980, to 81.35 / 87.33 in 2025. Per the MHLW's own publication, female life expectancy is the world's highest.",
        },
      },
      {
        type: "chart",
        chartId: "ch01-life-expectancy",
      },
      {
        type: "p",
        text: {
          ja: "男女差は2025年で5.98年です。世界銀行WDIの同年比較（2024年）では、日本の平均寿命84.04歳は、スウェーデン84.06歳とほぼ並び、イタリア83.95歳・韓国83.63歳と続く世界最高水準のグループに属します（男女計・推計値）。長寿は高齢化の原因の一方であり、日本社会が守ってきた価値ある成果です。",
          en: "The male–female gap in 2025 is 5.98 years. In the WDI same-year comparison (2024), Japan's overall life expectancy of 84.04 sits alongside Sweden's 84.06, ahead of Italy (83.95) and South Korea (83.63) — the world's leading group (both-sexes estimates). Longevity is one driver of aging, and it is an achievement Japanese society has built and defended.",
        },
      },
    ],
  },
  {
    id: "explanations",
    heading: {
      ja: "13. 考えられる説明：何が出生力を下げているのか",
      en: "13. Competing explanations: what lowers fertility?",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "出生力の低下「なぜ」は、単一の原因で説明できるほど単純ではありません。本章で確認したのは、出生数の減少が（1）婚姻の減少・晩婚化という経路と密接に結びついていること（2025年婚姻48.9万組・初婚年齢の上昇・50歳未婚率の高止まり）、（2）韓国・シンガポール・イタリアなど多くの経済で同時に起きていること、の2点です。これらは観測される事実です。",
          en: "The \"why\" of falling fertility is too complex for any single cause. What this chapter has established as observation is twofold: (1) the fall in births is closely tied to declining and delayed marriage (489,158 marriages in 2025, rising first-marriage ages, elevated never-married shares at 50); and (2) it is occurring simultaneously across many economies — South Korea, Singapore, Italy, and others.",
        },
      },
      {
        type: "p",
        text: {
          ja: "そこから先の説明は、複数の仮説が並立する領域です。日本で議論されてきた要因には、雇用と所得の不確実性、子育てと仕事の両立の難しさ、教育を含む子育て費用、住居の制約、ジェンダー役割分担と家事・育児負担の偏り、地域社会の変化などがあります。これらは相互に作用し、人によって重みが異なる可能性があります。",
          en: "Beyond that, explanations compete. Factors discussed in Japan include employment and income uncertainty, the difficulty of combining work and child-rearing, the costs of education, housing constraints, gendered divisions of housework and care, and changing community ties. These interact, and their weights differ across people.",
        },
      },
      {
        type: "callout",
        kind: "interpretation",
        text: {
          ja: "重要なのは、相関を因果として扱わないことです。例えば「平均世帯人員の減少」と「出生数の減少」は同時に起きていますが、前者は高齢化・単身世帯の増大でも説明できます。本章は、検証された観測事実と、まだ因果の確定していない説明仮説とを、明確に区別して提示します。",
          en: "The discipline is to never treat correlation as causation. Shrinking households and falling births co-occur, but the former is also explained by aging and the growth of one-person households. This chapter keeps verified observations and not-yet-established explanations clearly separated.",
        },
      },
    ],
  },
  {
    id: "evaluation",
    heading: {
      ja: "14. 評価：何が論じられ、何が分かっていないか",
      en: "14. Evaluation: what is discussed, what is unsettled",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "日本では、人口動態への対応として、子育て世代への経済支援、保育・教育環境の整備、働き方の柔軟化、地域への移住・定住促進、外国人材の受入れ拡大など、複数の方向が公に議論されてきました。ここでは、それぞれの効果の確実性について、過度な主張をせずに整理します。",
          en: "Japan publicly discusses several directions in response: economic support for families with children, childcare and education infrastructure, flexible working arrangements, regional migration and revitalization, and expanded intake of foreign workers. Here we weigh them without overclaiming.",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "子育て支援（保育・給付・休業制度）：先進国で広く実施されており、家族への負担軽減という目的自体には幅広い合意がある。出生力への量的効果は研究によって見解が分かれ、単独で置換水準を回復させた例は確認されていない。",
            en: "Family support (childcare, benefits, leave): widely implemented across developed economies; broad consensus exists on reducing family burden as a goal, but studies diverge on the magnitude of fertility effects, and no case is known where such measures alone restored replacement-level fertility.",
          },
          {
            ja: "働き方の柔軟化：残業時間の抑制や勤務地の選択は、両立のしやすさに影響し得る。効果の大きさは職種・雇用形態によって異なり、正規・非正規の格差との相互作用が残る。",
            en: "Flexible work: limits on overtime and choice of work location plausibly ease work–family balance, but effects vary by occupation and employment type and interact with the regular/non-regular divide.",
          },
          {
            ja: "移住・定住促進：東京圏への転入超過が30年続く中で、地方からの流出を緩和する方向。2025年も東京圏転入超過は12万人超であり、近年はやや縮小傾向にある（前年比▲1万2,309人）。",
            en: "Regional revitalization: with net in-migration to the Tokyo area running for 30 years, policy aims to slow the drain — though the 2025 metro-area surplus remained above 120,000, it narrowed by 12,309 year-on-year.",
          },
          {
            ja: "外国人材の受入れ：2026年5月時点で外国人住民は397万人（総人口の3.1%）と増加している。制度的・社会的な調整（教育・医療・住居・地域受入）を伴う中長期の論点である。",
            en: "Foreign workers and residents: foreign residents reached 3.97 million (3.1% of the population) by May 2026 and continue to grow — a medium-to-long-term question involving institutional and social adjustment (education, health care, housing, community reception).",
          },
        ],
      },
      {
        type: "callout",
        kind: "uncertainty",
        text: {
          ja: "将来推計の前提が示すように、仮定のわずかな違いが数十年後の人口を数百万人単位で動かします（中位8,699万人に対し上位9,549万人・下位8,024万人）。どの政策組み合わせがどの程度寄与するかについて、本プラットフォームは「確定した結論」を提示しません。むしろ、効果の検証可能な指標と、正直な不確実性の開示を重視します。",
          en: "As the projection assumptions show, small differences in assumptions move the population decades ahead by millions (medium 86.99M versus high 95.49M / low 80.24M in 2070). This platform does not present a \"settled conclusion\" about which policy mix contributes how much; it prioritizes verifiable indicators and honest disclosure of uncertainty.",
        },
      },
    ],
  },
  {
    id: "action",
    heading: {
      ja: "15. 証拠から行動へ",
      en: "15. From evidence to action",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "構造的な人口動態は、個人の努力だけで解決できるものではありません。同時に、一人ひとりの理解と参加が出発点になる取り組みもあります。以下は、この章の証拠に対応づけた、強制ではない行動の案内です。",
          en: "Structural demographics cannot be solved by individual effort alone. At the same time, some constructive steps begin with personal understanding and participation. What follows is a non-obligatory guide, each item tied to the evidence in this chapter.",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "個人：統計リテラシーを育てる。e-Statや統計局の公表資料に直接あたり、「推計とセンサス」「暫定値と確定値」の違いを確認する習慣は、誤情報への最も確実な防衛です（所要時間：小。出発点：e-Statの「統計GIS・統計表」検索）。",
            en: "Individual: build statistical literacy. Going directly to e-Stat and Statistics Bureau releases — checking whether a figure is an estimate or a census count, provisional or final — is the surest defense against misinformation (small effort; start at the e-Stat portal).",
          },
          {
            ja: "個人・家族：ライフプランの情報として人口統計を使う。平均寿命の伸び（女性87.33歳など）は、年金・介護・健康への備えが「従来より長い期間」を対象にすべきことを示します。",
            en: "Individual/family: use demographic statistics as life-planning information. Longer lifespans (female life expectancy 87.33) mean retirement, care, and health planning should target a longer horizon than past generations assumed.",
          },
          {
            ja: "地域：単身世帯と高齢者世帯が4割を超える地域社会で、隣近所・自治会・見守り活動といった日常のつながりは、統計上の「孤立」への現実的な緩和策として機能します。参加は任意で、まず身近な地域活動から。",
            en: "Community: in societies where one-person and elderly households exceed four in ten, everyday ties — neighborhood associations, check-in routines, mutual help — are practical mitigations for statistical isolation. Participation is voluntary and can start small.",
          },
          {
            ja: "専門職：教育・医療・福祉・都市計画・マーケティングなど、人口構造の変化はほぼ全ての専門分野の前提条件です。自らの分野の公表統計を定期的に確認し、計画の前提に「推計の幅」を組み込むことが専門性になります。",
            en: "Professional: shifting age structure is a premise of nearly every profession — education, health care, welfare, urban planning, marketing. Regularly checking your field's official statistics and building projection ranges into plans is part of professional rigor.",
          },
          {
            ja: "制度参加：公共の意思決定は、公聴会・パブリックコメント・統計調査への協力など、登録不要で参加できる経路を持っています。行政が公表する人口推計や将来推計は、そうした議論の共通基盤です。",
            en: "Institutional participation: public decisions include no-registration pathways — public comments, hearings, and cooperation with official statistics. The estimates and projections published by government are the shared baseline for those debates.",
          },
        ],
      },
      {
        type: "callout",
        kind: "action",
        text: {
          ja: "どの行動も義務ではありません。また、個人の選択が統計的な趨勢を直接「解決」すると主張するつもりはありません。それでも、証拠を理解した上での小さな行動の積み重ねは、地域と制度のレジリエンスの一部となり得ます。",
          en: "None of these are obligations, and we do not claim individual choices \"solve\" statistical trends. Still, small actions grounded in evidence can become part of the resilience of communities and institutions.",
        },
      },
    ],
  },
  {
    id: "limitations",
    heading: {
      ja: "16. 限界と留意点",
      en: "16. Limitations and caveats",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "この章の結論は、以下の限界の範囲内で読んでください。限界は弱点ではなく、解釈の信頼性を守るための情報です。",
          en: "Read this chapter's conclusions within the following limits. Limitations are not weaknesses; they are information that protects the reliability of interpretation.",
        },
      },
    ],
  },
];
