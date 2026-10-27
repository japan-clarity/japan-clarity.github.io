import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 05 — Education & Talent. Research narrative, sections 1–5.
 *
 * Every figure in this text is drawn from the verified data module
 * (src/chapters/chapter-05/data.ts, generated from archived official
 * documents — see research/chapter05/notes/). Nothing is estimated by the
 * authors; derived quantities (residual destination shares, 満足+ shares,
 * 万円 conversions) are computed from published components and identified
 * as derived. Interpretive statements are confined to callouts labeled
 * interpretation, and uncertainty to callouts labeled uncertainty.
 */
export const chapter05SectionsA: ChapterSection[] = [
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
          ja: "この章は、日本の教育を「健診」のように調べます。まず測定可能な状態を観測し（観測）、原典で数値を検証し（検証）、手法の整合する国々と比較し（比較）、考えられる説明を検討し（調査）、対応の方向と不確実性を評価し（評価）、現実的な行動を整理します（行動）。「日本の教育はすごい」とか「崩壊している」といった総括を最初に置くことはしません。",
          en: "This chapter examines education in Japan the way a careful medical examination works: observe measurable conditions, verify the figures against original sources, compare with methodologically compatible systems, weigh possible explanations, evaluate directions and their uncertainty, and outline realistic actions. It does not begin with a verdict such as \"Japanese education is superb\" or \"collapsing\".",
        },
      },
      {
        type: "p",
        text: {
          ja: "取り上げるのは、学力の推移と国際比較（PISA）、教育システムと進路の構造（学校基本調査）、教育機会の拡大と格差（OECD Education at a Glance・子供の学習費調査）、生徒のウェルビーイング（生徒指導調査・PISA質問調査）、高等教育と職業教育の規模、そして成人のスキル（PIAAC）です。統計は文部科学省・国立教育政策研究所・e-Stat・OECDの公式資料から2026年10月27日に取得し、アーカイブした資料内で数値を直接確認しています。特筆すべきは、PISAの2025年調査（2026年9月8日公表）まで反映している点です。",
          en: "We cover learning outcomes and their international comparison (PISA), the structure of pathways (School Basic Survey), the expansion and gaps of opportunity (OECD Education at a Glance; the household learning-cost survey), student well-being (the student-guidance survey and PISA questionnaires), the scale of higher and vocational education, and adult skills (PIAAC). All statistics were fetched on 2026-10-27 from MEXT, NIER, e-Stat and OECD official domains, and every cited figure was read inside the archived documents. Notably, the coverage runs through the PISA 2025 cycle (published 8 September 2026).",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "「得点」と「％」と「序列」の違いに注意",
          en: "Mind scores, percentages and rankings",
        },
        text: {
          ja: "PISAの平均得点は0〜700程度の尺度得点であり、％でも順位でもありません。3分野（数学・読解・科学）は尺度が異なり、点数を相互比較できません。順位は標本調査の不確実性（信頼区間）で入れ替わり得るため、本サイトは順位の羅列ではなく水準と推移を示します。教育統計には他にも「学校年度」と「暦年」、「国籍ベース」と「在留資格ベース」、「全数調査」と「抽出調査」のような基準の違いがあります。各図表に出典・基準・単位を明記します。",
          en: "PISA mean scores are scale points — not percentages, not ranks. The three domains use different scales and cannot be compared with each other. Rankings interchange within sampling uncertainty, so this site shows levels and trends rather than league tables. Education statistics also differ in basis: school year vs calendar year, nationality vs residence status, census vs sample survey. Every figure carries its source, frame and unit.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "この章で扱わないこと",
          en: "What this chapter does not cover",
        },
        text: {
          ja: "教員の勤務時間や採用・離職の詳細、大学入学共通テストの結果、学校の安全施設、教育委員会制度の運用は本章では検証していません。心身の健康全般（相談件数の推移等）は第6章「健康・福祉」で扱い、本章は学校生活に直結するウェルビーイング指標（所属感・生活満足度・いじめ・不登校）に絞ります。科学技術・情報社会全般は第11章に譲ります。また、成人スキルの第2回国際成人力調査（PIAAC 2023年実施分）の数値は原典確認ができなかったため図示していません（制限事項参照）。",
          en: "Teacher working hours, hiring and attrition detail, common-test results, school facilities and board-of-education administration are not verified here. Health in general belongs to Chapter 6; this chapter confines well-being to school-linked indicators (belonging, life satisfaction, bullying, nonattendance). Broader technology society belongs to Chapter 11. Round 2 of the adult-skills survey (fielded 2023) could not be verified from primary sources and is not charted (see limitations).",
        },
      },
    ],
  },
  {
    id: "system",
    heading: {
      ja: "2. 教育システムと進路 — 誰がどこへ進むか",
      en: "2. The system and its pathways — who goes where",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "まず構造から観測します。日本の学校体系は、小学校6年・中学校3年の義務教育、高等学校等3年（主に15〜18歳）、そして高等教育（大学・短期大学・高等専門学校・専修学校専門課程）からなります。学校基本調査（2025年5月1日・R7確報）では、高校等への進学率は通信制を含めて98.6%、通信制課程（本科）を除いても92.7%です。高校進学は事実上の「第2の義務教育」になっています。",
          en: "Structure first. Japan's system: six years of elementary and three of junior-high compulsory schooling, three years of upper secondary (mainly ages 15–18), then higher education (universities, junior colleges, colleges of technology, specialized training colleges). In the School Basic Survey (1 May 2025, R7 final), upper-secondary progression is 98.6% including correspondence courses, and 92.7% excluding them — upper secondary is, in effect, a second compulsory stage.",
        },
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "98.6%", en: "98.6%" },
            label: { ja: "高校等への進学率（2025年度・通信制含む）", en: "Upper-secondary progression (2025, incl. correspondence)" },
            sourceId: "estat-kihon-nenji",
          },
          {
            value: { ja: "61.4%", en: "61.4%" },
            label: { ja: "大学・短大等への現役進学率（2025年度）", en: "Fresh-graduate university progression (2025)" },
            sourceId: "estat-kihon-nenji",
          },
          {
            value: { ja: "85.4%", en: "85.4%" },
            label: { ja: "高等教育機関進学率（過年度卒含む）", en: "Higher-education progression incl. past graduates" },
            sourceId: "mext-kihon-r7",
          },
          {
            value: { ja: "107,206人", en: "107,206" },
            label: { ja: "大学の外国人学生（2025年・国籍ベース）", en: "Foreign nationals enrolled in universities (2025, nationality basis)" },
            sourceId: "estat-kihon-nenji",
          },
        ],
      },
      {
        type: "p",
        text: {
          ja: "この「ほぼ全員が高校へ進む」構造は戦後ゆっくりと作られました。高校等への進学率（通信制除く）は1950年代半ばの51%前後から、高度成長期を通じて上昇し、1970年代前半に90%台へ到達しました。一方、大学等への現役進学率の系列（1984年以降・確報再算定）は、1984年の30%台から2000年代前半の高等教育政策の拡大で50%前後まで上がった後、2010年代前半に一旦横ばいとなり、2020年代に入って再び上昇して2025年に61.4%（男59.7%・女63.2%）と過去最高を記録しました。女子の現役進学率が男子を上回るのは2014年以降一貫しています。",
          en: "The near-universal structure emerged gradually. Upper-secondary progression (excluding correspondence) climbed from around 51% in the mid-1950s through the high-growth era, passing 90% in the early 1970s. The fresh-graduate university series (1984 onward, recalculated) rose from the 30%s to around 50% in the early-2000s expansion, plateaued in the early 2010s, then resumed climbing to a record 61.4% in 2025 (men 59.7%, women 63.2%). Women's rate has exceeded men's consistently since 2014.",
        },
      },
      { type: "chart", chartId: "ch05-progression-longrun" },
      {
        type: "p",
        text: {
          ja: "高校を卒業した人はどこへ向かうでしょうか。R7確報（2025年3月卒業分）では、大学（学部）へ58.3%、短大等へ約3.1%（大学・短大等計61.4%との差分）、専門学校（専修学校専門課程）へ14.4%、就職へ13.8%でした。就職率は過去最低を更新しています。残る約10.4%は進学・就職のいずれにも分類されない「その他等」（家事・一時休職・進路未定を含む）です。高等教育機関全体（過年度卒業者を含む）への進学率は85.4%に達しますが、約7人に1人は卒業直後には進学も就職もしていない計算になります。",
          en: "Where do graduates go? In the R7 final report (March 2025 graduates): 58.3% to bachelor programmes, about 3.1% to junior colleges (the residual within the 61.4% combined figure), 14.4% to specialized training colleges, and 13.8% into employment — a record low. The remaining ~10.4% fall into neither category (home duties, temporary leave, undecided). Progression to higher education including past-year graduates reaches 85.4%; yet roughly one in seven neither progresses nor starts work immediately.",
        },
      },
      { type: "chart", chartId: "ch05-hs-destinations" },
      {
        type: "p",
        text: {
          ja: "高等教育側の規模も長期で観測しておきます。大学の在籍者数は1948年の1.2万人から、1970年代の第一次大衆化（18歳人口の増加と私学拡大）、2000年代前半の第二次拡大を経て、現在は295万人規模で頭打ちになりました。一方、1976年に制度として始まった専修学校（専門課程中心）は13.1万人から増え続け、60〜70万人台で大学と補完的な進路を形成しています。専門学校は「大学以外」の主要な高等教育経路であり、2025年の高校卒業者の14.4%が進学しています。",
          en: "Scale on the receiving side, long-run: university enrollment grew from 12 thousand in 1948 through the first massification of the 1970s and the second expansion of the early 2000s, plateauing at around 2.95 million. Specialized training colleges, institutionalized in 1976, grew from 131 thousand into the 600–700 thousand range — the main non-university higher pathway, receiving 14.4% of 2025 upper-secondary graduates.",
        },
      },
      { type: "chart", chartId: "ch05-university-longrun" },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "「留学生」の数は定義で変わる",
          en: "\"International students\" depends on definition",
        },
        text: {
          ja: "本章で引用する外国人学生数（2025年に大学計107,206人、前年比+5,777人）は学校基本調査の国籍・地域ベースです。JASSO（日本学生支援機構）の「留学生受入れ状況調査」は在留資格ベースで数えるため、値も推移も異なります（同調査は本章では未検証）。定義の違いを明示した上で、国籍ベースの系列のみを扱います。",
          en: "The foreign-student count used here (107,206 in universities, 2025, +5,777 year on year) is the School Basic Survey's nationality basis. JASSO's survey counts by residence status and yields different levels and trends (not verified in this chapter). We use only the nationality series, with the definitional difference stated.",
        },
      },
    ],
  },
  {
    id: "outcomes",
    heading: {
      ja: "3. 学力と教育の質 — PISAが示すものと示さないもの",
      en: "3. Learning outcomes — what PISA does and does not show",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "学力の国際比較で最も体系的なデータはOECDのPISA（生徒の学習到達度調査）です。義務教育修了段階の15歳を3年（現在は4年）ごとに調査し、数学的リテラシー・読解力・科学を測ります。日本は2000年の第1回から全回参加し、2025年調査（2026年9月公表・91か国・地域・約76万人参加）では、科学（科学コンピテンシー）538点・読解力503点・数学的リテラシー525点で、3分野すべてOECD加盟38か国中1位となりました。調査開始以来初めてのことです。全参加国・地域中では科学5位・読解4位・数学5位です。",
          en: "The most systematic international dataset on learning is the OECD's PISA, testing 15-year-olds roughly every three-to-four years in mathematics, reading and science. Japan has joined every cycle. In the 2025 cycle (published September 2026; 91 participants, ~760,000 students) Japan scored 538 in science, 503 in reading and 525 in mathematics — first among the 38 OECD countries in all three domains, for the first time ever. Among all participants it ranks fifth in science, fourth in reading and fifth in mathematics.",
        },
      },
      { type: "chart", chartId: "ch05-pisa-2025-intl" },
      {
        type: "p",
        text: {
          ja: "ただし、この「3分野全部1位」を「日本の教育の質が世界一」と読むのは誤りです。第一に、PISAは15歳の標本調査であり、信頼区間（2025年日本: 数学517–534・読解495–510・科学530–545）があり、点数の近い国との順位は統計的に入れ替わり得ます。第二に、全参加国・地域にはOECD非加盟の上位（北京・上海・江蘇・浙江の科学597点・数学612点、シンガポールの読解535点）がいます。第三に、2025年の日本は読解力が2022年比で13点の有意な低下に対して、数学的リテラシーと科学は低下したものの統計的に有意な変化ではなく（OECD平均は3分野すべて有意に低下）、3分野とも低得点層（レベル1以下）の割合が有意に上昇しました。水準の高さと裾の広がりは両立します。",
          en: "Reading \"first in all three domains\" as \"the world's best education\" would be a mistake. First, PISA is a sample survey with confidence intervals (Japan 2025: math 517–534, reading 495–510, science 530–545); rankings between close-scoring countries can interchange. Second, the full field includes non-OECD leaders (Beijing-Shanghai-Jiangsu-Zhejiang: science 597, math 612; Singapore reading 535). Third, while Japan's 2025 reading fell a significant 13 points from 2022, mathematics and science declined without statistical significance (the OECD average fell significantly in all three domains) — and the share of low achievers (level 1 or below) rose significantly in all three domains. High levels and widening tails coexist.",
        },
      },
      { type: "chart", chartId: "ch05-pisa-trend" },
      {
        type: "p",
        text: {
          ja: "25年間の推移で見えるのは、日本の安定とOECD平均の低下です。OECD平均は2015年以降、3分野すべてで低下し続け（数学500→463、読解500→461、科学500→482）、2025年の日本との差は数学+62点・読解+42点・科学+56点に開きました。日本自身の水準は大きく変わりませんが、コロナ禍を挟んだ2022→2025年で読解力が有意に低下した点、そして習熟度の下位層が広がった点は、詳細な推移と分布で確認する必要があります。",
          en: "Across a quarter century, the story is Japanese stability and OECD-average decline. Since 2015 the OECD average has fallen in every domain (math 500→463, reading 500→461, science 500→482), opening gaps to Japan of +62 (math), +42 (reading) and +56 (science) points in 2025. Japan's own level has moved little, though reading fell significantly across the pandemic-spanning 2022→2025 interval, and the lower tail of proficiency has widened.",
        },
      },
      { type: "chart", chartId: "ch05-pisa-levels" },
      {
        type: "callout",
        kind: "interpretation",
        title: {
          ja: "OECD平均低下の解釈には複数の仮説がある",
          en: "Competing explanations for the OECD decline",
        },
        text: {
          ja: "OECD平均の低下についてOECD自身は、参加国構成の変化・感染症流行による学習中断・家庭背景の影響など複数の要因を挙げ、単一の原因では説明していません。日本が低下を免れた（読解以外）理由についても、学校閉鎖の期間が比較的短かったこと・授業時間の構造・学習習慣などが候補として語られますが、PISAの集計データから因果を確定することはできません。本章は「何が起きたか」の記述に留め、「なぜ」は検証可能な範囲の仮説として提示します。",
          en: "The OECD itself lists several candidate factors for the average decline — changing participation, pandemic-era learning loss, family background — without settling on one. Why Japan was spared (except in reading) invites hypotheses (shorter school closures, timetabling, study habits) that the aggregate data cannot confirm causally. This chapter records what happened and presents the \"why\" only as verifiable hypotheses.",
        },
      },
      {
        type: "p",
        text: {
          ja: "機会の公平性では、日本は一貫して良好な側にいます。2025年報告書は、日本を「ESCS（社会経済文化的背景）水準別に見た科学の得点差が小さい国の一つで、かつ生徒の得点のばらつきにESCSが影響する度合いが小さい」国として記載しており、これは2022年調査（数学）と同じ評価です。出身家庭の経済・文化的状況と成績の結びつきが国際的に見て弱い構造は、日本の教育システムの重要な特徴です。ただし公平性は「差がない」ことの証明ではなく、測定された範囲の相対的な狭さです。",
          en: "On equity, Japan consistently sits on the good side. The 2025 report lists Japan among the countries with the smallest ESCS (socio-economic) gaps in science and among those where socio-economic status least explains score variance — the same assessment as 2022 (mathematics). A comparatively weak link between family background and achievement is a defining feature of the system. Fairness here is relative narrowness of measured gaps, not proof of equality.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "PISAが測らないもの",
          en: "What PISA does not measure",
        },
        text: {
          ja: "PISAは15歳時点の応用的な読解・数学・科学の力に絞られた標本調査です。身体・芸術・道徳・社会性、学習意欲の全体像、教員の質、学校の組織力、あるいは「教育システムの総合力」を測るものではありません。得点の国際差が将来の個人の所得や国の成長率をどう予測するかも、相関の研究はあれ因果の確定はありません。本章はPISAを「一つの診断指標」としてのみ使用します。",
          en: "PISA is a sample survey of applied reading, mathematics and science at age 15. It does not measure physical, artistic, moral or social development, the full picture of motivation, teacher quality, organizational capacity, or \"overall system strength\". Correlational research links scores to later earnings and growth; causation is not established. We use PISA as one diagnostic indicator, nothing more.",
        },
      },
    ],
  },
  {
    id: "access",
    heading: {
      ja: "4. 教育機会の格差 — 就学前から大学修得率まで",
      en: "4. Disparities in access — from preschool to attainment",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "機会の入口は就学前です。OECD Education at a Glanceの就学前教育（ISCED 0）在籍率では、日本の3〜5歳は2024年に95.2%で、OECD平均86.0%を約9ポイント上回ります。日本では義務教育の開始が6歳のため、この年齢の小学校在籍は0%であり、95.2%がそのまま就学前教育の到達率です。2015年の91.0%から9年間で4.2ポイント上昇しており、幼保連携型認定こども園制度の拡大期と重なります。",
          en: "Opportunity begins before school. In OECD Education at a Glance, Japan's enrolment of 3–5-year-olds in early childhood education (ISCED 0) reached 95.2% in 2024, about 9 points above the 86.0% OECD average. Because compulsory schooling starts at 6 in Japan, primary enrolment at these ages is 0% — 95.2% is the ECEC rate itself, up 4.2 points from 91.0% in 2015, overlapping the expansion of certified kindergarten-daycare centres.",
        },
      },
      { type: "chart", chartId: "ch05-ecec-intl" },
      {
        type: "p",
        text: {
          ja: "教育の「蓄積」を見る修得率では、日本は国際的に高い水準にあります。25〜64歳の高等教育（ISCED 5–8・短大・高専・専門学校専門課程を含む）修得率は1997年の30.5%から2025年の57.9%へほぼ倍増し、OECD平均42.7%を15ポイント上回ります。カナダ（63.9%）・韓国（58.2%）に次ぐ水準です。より若い25〜34歳では日本の修得率はさらに高く、世代交代とともに修得率は今後も上昇します。ただし修得率は過去の教育の蓄積であり、現在の学校の質を示すものではない点は既に述べたとおりです。",
          en: "Attainment — the accumulated stock — places Japan high. The share of 25–64-year-olds with tertiary education (ISCED 5–8, including junior colleges, colleges of technology and specialized training colleges) nearly doubled from 30.5% (1997) to 57.9% (2025), 15 points above the OECD average of 42.7%, behind Canada (63.9%) and Korea (58.2%). Among 25–34-year-olds Japan's rate is higher still, so attainment will keep rising with cohort replacement. As noted, attainment measures past accumulation, not current school quality.",
        },
      },
      { type: "chart", chartId: "ch05-tertiary-attainment" },
      {
        type: "p",
        text: {
          ja: "機会の格差で最も可視的なのは家計負担の差です。文科省「子供の学習費調査」（2023年度）では、1人当たり年間学習費総額は公立小学校36.7万円・公立中学校54.2万円・公立高校（全日制）59.7万円であるのに対し、私立小学校174.2万円・私立中学校156.0万円・私立高校117.9万円です。小学校では公立の4.7倍です。幼稚園から高校までの15年間、全て私立に通った場合の総額は約2,100万円、全て公立なら約600万円（同調査の参考試算）です。",
          en: "The most visible disparity is the household bill. In MEXT's 2023 learning-cost survey, annual spending per child at public schools runs 367 thousand yen (elementary), 542 thousand (junior high) and 597 thousand (high school), against 1.742 million, 1.560 million and 1.179 million at private schools — 4.7× at elementary. Over the fifteen years from kindergarten to high-school graduation, the survey's reference cases total about 21 million yen all-private versus about 6 million all-public.",
        },
      },
      { type: "chart", chartId: "ch05-learning-cost" },
      {
        type: "p",
        text: {
          ja: "ただし平均的な家庭の負担は図の公立側に近い点に注意が必要です。私立に通う児童の割合は小学校で1.3%、幼稚園で88.3%と、段階によって全く異なります。また学習費の公私差の主因は学校外教育活動（塾等）ではなく授業料等の学校教育費です。公私の選択は家計の選好と制約の結果であり、塾への支出も含めた「実質的な教育機会の差」は学校種の公私区分だけでは測れません。奨学金・授業料減免の給付型支援（2020年4月開始の高等教育の修学支援新制度）の効果は本章では未検証です。",
          en: "The typical household, however, sits near the public figures: only 1.3% of elementary pupils attend private schools, versus 88.3% of kindergarteners. The public-private gap is driven mainly by school fees, not out-of-school activities. Sector choice reflects household preferences and constraints, and the real difference in opportunity — including cram-school spending — is not captured by the public/private split alone. Effects of grant-type support (the 2020 higher-education support scheme) are not verified here.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "「より多くの支出＝より良い教育」ではない",
          en: "More spending ≠ better education",
        },
        text: {
          ja: "教育支出と学力の関係は国際データでも単純ではありません。支出水準が似た国々の間でPISA得点は大きく異なります。支出の「使い方」（教員の質・授業時間・教材）と「公平な分配」が水準より効くという研究はあるものの、本章の集計データから因果を確定することはできません。次節の支出の国際比較は、構造の記述として読んでください。",
          en: "The spending-outcome relation is not simple in cross-country data: countries with similar spending differ widely in PISA scores. Research suggests allocation (teacher quality, instructional time, materials) and equitable distribution matter more than level, but causal claims cannot be settled from this chapter's aggregates. Read the next figure as a description of structure.",
        },
      },
    ],
  },
  {
    id: "spending",
    heading: {
      ja: "5. 教育費の構造 — 誰がどれだけ負担しているか",
      en: "5. The structure of education spending — who pays, how much",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "公的制度の負担を国際比較します。OECD Education at a Glance（SDMX）の「教育機関への総支出（公私合計・中核サービス）をFTE学生1人当たりに換算」した額では、日本は2023年で小学校11.0千ドル・中学校等13.0千ドルと、OECD平均（13.1・14.5千ドル）を1〜2割下回ります。ところが高等教育（ISCED 5–8）では21.7千ドルと、OECD平均14.9千ドルを約45%上回る。全レベル計では日本14.2千ドル・OECD平均14.1千ドルでほぼ拮抗します。総額ではなく配分が日本の特徴です。",
          en: "Public-system effort in comparison: by OECD Education at a Glance (SDMX), total (public + private) core-services spending per full-time-equivalent student in Japan (2023) is 11.0 thousand USD at primary and 13.0 at secondary — one-to-two-tenths below the OECD averages (13.1 and 14.5). But tertiary spending is 21.7 thousand USD, about 45% above the 14.9 average. Across all levels Japan (14.2) and the OECD average (14.1) are neck and neck. The signature is the allocation, not the total.",
        },
      },
      { type: "chart", chartId: "ch05-cost-per-student" },
      {
        type: "p",
        text: {
          ja: "この配分の偏りの背景として、日本の高等教育では私的負担（授業料）の占める割合が国際的に高いことが知られています。ただし本章で検証したSDMXデータは支出源別の内訳までは取得しており、公私比率の数値はここでは引用しません（未検証の推計は載せない方針）。確実に言えるのは、(1)小・中の義務教育段階の1人当たり支出はOECD平均を下回り、(2)高等教育段階は大きく上回り、(3)その額が学習費調査で見た家計負担（私立進学の際に顕在化する）と重なる構造である、ということです。",
          en: "Behind the tilt, Japan's tertiary funding is known to lean on private (tuition) contributions — but our SDMX extract does not carry the source breakdown, and we do not quote unverified public/private ratios (policy: no unverified estimates). What is solid: (1) per-student spending at the compulsory stage runs below the OECD average, (2) tertiary runs far above it, and (3) the amounts overlap with the household costs seen in the learning-cost survey, which surface when families choose private schools.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "PPP換算と「年」の取り方",
          en: "PPP conversion and accounting years",
        },
        text: {
          ja: "1人当たり支出の国際比較には、購買力平価（PPP）換算・現行価格・教育機関への支出という共通定義を使いますが、各国のデータ年は2022〜2023年とずれます。またISCEDレベルの国内対応（日本の専門学校専門課程をどこに計上するか等）は各国の申告に依存します。千ドル単位の差は「構造の目安」として読み、国際序列として扱いません。",
          en: "The comparison uses a common definition (current-price PPP, spending on institutions) but reference years straddle 2022–2023, and ISCED mapping (e.g., where Japan's specialized training colleges sit) depends on national reporting. Read thousand-dollar gaps as structural indications, not rankings.",
        },
      },
      {
        type: "p",
        text: {
          ja: "支出の「果実」の一つの側面として、学歴別の雇用率を見ておきます。2025年の25〜64歳の雇用率は、日本では高等教育修得88.3%・上位中等教育修得83.1%で、差は5.2ポイント。表示した9か国・地域の中で最小です（OECD平均の差は9.6ポイント、アメリカ11.8、フランス12.6）。日本では学歴による雇用面での「割引」が国際的に見て小さい。ただしこれは雇用率の差であり、賃金・同一労働同一賃金の実態（第4章で検証した雇用形態間格差）とは別の次元です。",
          en: "One fruit of spending: employment by attainment. In 2025, employment rates for 25–64-year-olds were 88.3% (tertiary) and 83.1% (upper secondary) in Japan — a 5.2-point gap, the smallest among the nine economies shown (OECD average 9.6; United States 11.8; France 12.6). The employment discount for lower attainment is comparatively small in Japan — though this is an employment-rate gap, distinct from pay gaps by employment form (verified in Chapter 4).",
        },
      },
      { type: "chart", chartId: "ch05-employment-attainment" },
    ],
  },
];
