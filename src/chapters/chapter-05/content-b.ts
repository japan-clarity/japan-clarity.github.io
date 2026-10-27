import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 05 — Education & Talent. Research narrative, sections 6–10.
 *
 * Every figure in this text is drawn from the verified data module
 * (src/chapters/chapter-05/data.ts, generated from archived official
 * documents — see research/chapter05/notes/). Sensitive topics (suicide,
 * bullying, nonattendance) follow the source institutions' own framing and
 * avoid causal or sensational claims. Interpretive statements are confined
 * to callouts labeled interpretation, and uncertainty to callouts labeled
 * uncertainty.
 */
export const chapter05SectionsB: ChapterSection[] = [
  {
    id: "wellbeing",
    heading: {
      ja: "6. 生徒のウェルビーイング — いじめ・不登校・満足度",
      en: "6. Student well-being — bullying, nonattendance, satisfaction",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "学力の高さと生徒の心の状態は別の次元です。文部科学省の生徒指導調査（令和6年度＝2024学校年度・全数調査）では、いじめの認知件数は769,022件と過去最多となりました。1,000人当たり61.3件（2013年度は13.4件）。ただしこの数字の読み方には注意が要ります。文科省自身が「いじめの定義と積極的認知の普及」「一人一台端末を活用した心の健康観察」「見取りの精緻化」を増加の背景として挙げており、認知件数の増加をそのまま実態の悪化とは解解釈しないよう求めています。年度末時点で「解消」と判断されたのは76.1%です。",
          en: "High scores and students' inner states are different dimensions. In MEXT's student-guidance survey (school year 2024, a census), recognized bullying reached a record 769,022 cases — 61.3 per 1,000 students (13.4 in 2013). The reading requires care: MEXT itself attributes the rise largely to the spread of the legal definition, one-device-per-student wellbeing monitoring and better detection, and cautions against equating rising counts with worsening reality. At year-end 76.1% were judged resolved.",
        },
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "769,022件", en: "769,022" },
            label: { ja: "いじめ認知件数（2024年度・過去最多）", en: "Recognized bullying (2024, record high)" },
            sourceId: "mext-shidou-r6",
          },
          {
            value: { ja: "353,970人", en: "353,970" },
            label: { ja: "不登校児童生徒数・小中計（2024年度）", en: "Nonattendance, elementary + junior high (2024)" },
            sourceId: "mext-shidou-r6",
          },
          {
            value: { ja: "68.9%", en: "68.9%" },
            label: { ja: "生活満足度「満足」以上（2025年・PISA）", en: "Life satisfaction \"satisfied+\" (2025, PISA)" },
            sourceId: "nier-pisa2025",
          },
          {
            value: { ja: "88.9%", en: "88.9%" },
            label: { ja: "学校への所属感・肯定回答（2025年）", en: "School belonging, affirmative (2025)" },
            sourceId: "nier-pisa2025",
          },
        ],
      },
      { type: "chart", chartId: "ch05-bullying" },
      {
        type: "p",
        text: {
          ja: "構造を見ると、認知件数の8割（610,612件）は小学校です。学校種別の1,000人当たり認知件数は小学校101.9件・中学校42.6件・高校5.9件と、低学年ほど高い。これは「小学校でいじめが多い」ことの直接の証明ではなく、観察の密度（学級担任制・保護者との接点）と早期対応の成果が数字に現れている可能性があります。重大事態（同法28条1項）は1,404件とこちらも過去最多ですが、増加率は前年度の42.1%から7.5%へ大きく低下しました。ネット上のいじめ（「パソコンや携帯電話等で、ひぼう・中傷や嫌なことをされる。」）は27,365件で、2013年度の8,788件から3.1倍です。",
          en: "Structurally, 80% of recognized cases (610,612) are in elementary schools; per-1,000 rates run 101.9 (elementary), 42.6 (junior high) and 5.9 (high school). That is not direct proof that bullying is most common in the early grades — observation density (homeroom systems, parent contact) and early response may surface in the numbers. Serious incidents (Article 28-1 of the act) also hit a record 1,404, though growth slowed sharply from 42.1% to 7.5%. Online bullying (\"insulted or slandered via computer or phone\") reached 27,365 — 3.1× the 2013 figure.",
        },
      },
      { type: "chart", chartId: "ch05-net-bullying" },
      {
        type: "p",
        text: {
          ja: "不登校（年間30日以上欠席・病気と経済的理由を除く）は353,970人と過去最多ですが、増加率は前年度の+15.9%から+2.2%へ低下し、新規不登校児童生徒は9年ぶりに減少（153,828人）しました。中学校の1,000人当たりでは67.9人と、小学校（23.0人）の約3倍です。旧系列（学校基本調査の長期欠席のうち不登校区分）は1991年の66,817人から2001年の138,722人への増加とその後の頭打ちを示しており、「不登校」概念の受容と把握の変化も長期の増加に寄与していると考えられます。文科省はR6の増加率低下について「チーム学校による丁寧なアセスメント」等を挙げていますが、増加の一因とされた「義務教育の段階における普通教育の方針等の多様化」の啓発が続く中での動向として注視が必要です。",
          en: "Nonattendance (30+ absences, excluding illness and finance) reached a record 353,970, but growth slowed from +15.9% to +2.2% and new cases fell for the first time in nine years (153,828). The junior-high rate is 67.9 per 1,000 — about 3× the elementary rate (23.0). The old series (the nonattendance category of the long-absence table) rose from 66,817 (1991) to a 138,722 peak (2001) before flattening, suggesting that wider acceptance of the concept and better capture also contribute to long-run growth. MEXT credits careful team-based assessment for the slowdown; the trend deserves continued attention while outreach continues.",
        },
      },
      { type: "chart", chartId: "ch05-nonattendance" },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "自殺という数字の扱い",
          en: "Handling the suicide figure",
        },
        text: {
          ja: "小・中・高等学校から報告のあった児童生徒の自殺は2024年度413人（前年度397人）で、文科省は「極めて憂慮すべき状況」と表現しています。学校による基本調査は全件実施された一方、詳細調査の実施は23件（5.6%）にとどまります。本章はこの数字を過去2年分のみ文脈付きで引用し、原因の推論もグラフ化も行いません。数字の背景には報告・把握の制度的な制約があり、統計としての自殺数は実態の下限に近いことに留意してください。",
          en: "School-reported suicides numbered 413 (397 the year before) in 2024 — a situation MEXT calls \"extremely grave\". Basic fact-finding covered all cases, but detailed investigation reached only 23 (5.6%). This chapter quotes the figure for two years only, with context, and performs no causal inference and no charting. Reporting and detection are institutionally constrained, so the count stands closer to a floor than a total.",
        },
      },
      {
        type: "p",
        text: {
          ja: "ポジティブな指標も見ておきます。PISA質問調査の生活満足度（0〜10段階）で「満足」以上と回答した日本の生徒は2018年の50.2%から2025年の68.9%へ回復し、2015年（61.1%）を上回りました。平均値は6.2から7.2へ。OECD平均（70.6%）とほぼ同水準です。「学校の一員だと感じている」という所属感の肯定回答は88.9%と、OECD平均（76.2%）を12.7ポイント上回ります。一方、家庭による支援的な関わりの頻度を示す指標はOECD平均-0.19に対して日本-0.64と、37か国中下位です。",
          en: "Positive indicators matter too. The share of Japanese students \"satisfied\" or above on PISA's 0–10 life-satisfaction scale recovered from 50.2% (2018) to 68.9% (2025), above the 2015 level (61.1%); the mean rose from 6.2 to 7.2, nearly matching the OECD average (70.6%). Belonging — \"feeling like part of the school\" — is affirmative for 88.9%, 12.7 points above the OECD average (76.2%). By contrast, the index of supportive family involvement is -0.64 against an OECD average of -0.19, near the bottom of 37 countries.",
        },
      },
      { type: "chart", chartId: "ch05-life-satisfaction" },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "満足度の2018年下落と回復の解釈",
          en: "Interpreting the 2018 dip and recovery",
        },
        text: {
          ja: "生活満足度の2015→2018年下落（−10.9ポイント）とその後の回復は、PISAの質問調査の回答傾向の変化、調査実施時期（2018年は9〜11月、2022年と2025年は6〜8月）、社会的な出来事など複数の要因が重なり得ます。自己申告の満足度は臨床的な精神保健状態の測定ではなく、国際比較でも回答スタイルの差（控えめさ等）が知られています。本章は下落と回復を「日本の生徒の幸福が2018年に崩壊しその後回復した」とは断定しません。",
          en: "The 2015→2018 drop (−10.9 points) and recovery may mix changing response styles, survey timing (Sep–Nov in 2018; Jun–Aug in 2022 and 2025) and social events. Self-reported satisfaction is not a clinical mental-health measure, and cross-country comparisons are known to reflect response-style differences such as modesty. This chapter does not conclude that Japanese students' well-being \"collapsed in 2018 and then recovered\".",
        },
      },
      {
        type: "p",
        text: {
          ja: "高校段階では、中途退学者数は44,571人（中退率1.4%）と前年度から減少しました。退学の主な理由は進路変更で18,505人（41.5%）です。進路再編を含む「途中下車」が 高校中退の半分近くを占める構造は、単一の「学校離れ」では記述できません。",
          en: "At the upper-secondary level, dropouts fell to 44,571 (1.4%), with route-changing the leading reason at 18,505 (41.5%). When nearly half of attrition is route re-planning, a single narrative of \"leaving school\" cannot describe it.",
        },
      },
    ],
  },
  {
    id: "higher-vocational",
    heading: {
      ja: "7. 高等教育と職業教育 — 規模・多様性・開かれた入口",
      en: "7. Higher and vocational education — scale, diversity, open entry",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "高等教育は「大学」と同義ではありません。2025年の時点で、大学（学部＋大学院）の在籍者数は297.2万人、専修学校（専門課程中心）は62.2万人です。高校卒業者の14.4%が専門学校へ進学しており、約7人に1人の割合で「大学以外の高等教育」を選択しています。高等専門学校（高専）や短期大学を含めれば、日本の高等教育は複数の入口を持つ構造です。大学と専門学校は目的も修業年限も異なり、優劣の序列としてではなく、進路の多様性として読むべきです。",
          en: "Higher education is not synonymous with universities. In 2025, universities (undergraduate plus graduate) enroll 2.972 million while specialized training colleges enroll 622 thousand; 14.4% of upper-secondary graduates enter the latter — roughly one in seven choosing a non-university tertiary route. Including colleges of technology and junior colleges, Japanese higher education has multiple entry points. Universities and specialized colleges differ in purpose and programme length; read them as diversity of pathways, not a hierarchy.",
        },
      },
      {
        type: "p",
        text: {
          ja: "開かれた入口の例として、国際的にも注目される動きがあります。学校基本調査（国籍・地域ベース）では、大学の外国人学生は2024年の101,357人から2025年に107,206人へ5.7%増加しました。コロナ禍で一時大きく減少した後の回復が続いています。ただし在留資格ベースで数えるJASSO「留学生受入れ状況調査」の数値とは定義が異なるため、国際的な議論ではどちらの定義かを明示する必要があります。",
          en: "One sign of open entry: by nationality basis (School Basic Survey), foreign nationals enrolled in Japanese universities rose 5.7%, from 101,357 (2024) to 107,206 (2025) — a recovery continuing after the pandemic-era drop. Because JASSO's residence-status-based survey counts differently, any international comparison must state which definition is in use.",
        },
      },
      {
        type: "p",
        text: {
          ja: "高等教育の「成果」の蓄積として、修得率をもう一段詳細に見ておきます。25〜64歳の高等教育修得率が57.9%であるのに対し、25〜34歳では67.5%と10ポイント近く高い。世代が下るほど高学歴化が進んでいることが分かります。またPISA2025の質問調査では、学校内でのデジタル・リソースの利用頻度はOECD24か国中5位、学校外では2位と、学習機会のデジタル化は国際的に上位にあります。",
          en: "On accumulated outcomes, attainment by cohort: 25–34-year-olds hold tertiary credentials at 67.5%, nearly 10 points above the 25–64 rate of 57.9% — each cohort is more credentialed than the last. And in the PISA 2025 questionnaires, Japan ranks 5th of 24 for in-school digital-resource use and 2nd for out-of-school use — digital learning opportunity sits high internationally.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "大学院・高専・短大の位置づけ",
          en: "Graduate schools, KOSEN, junior colleges",
        },
        text: {
          ja: "本章の長期在籍図は大学（学部＋大学院の計）と専修学校の2系列に絞っています。短期大学（在籍者数は縮小傾向）と高専（中高一貫の技術教育）の系列も収集・検証済みですが、図の煩雑さを避けるため本文での引用に留めています。大学院在籍者数の推移は今後の章で扱う予定です（未検証の推計は載せない方針）。",
          en: "The long-run chart shows only universities (undergraduate + graduate totals) and specialized colleges; junior-college (shrinking) and KOSEN series were collected and verified but are kept to the text to avoid clutter. Graduate-enrollment trends belong to future chapters (no unverified estimates here).",
        },
      },
    ],
  },
  {
    id: "adult-skills",
    heading: {
      ja: "8. 生涯学習とデジタルスキル — 大人になってからの力",
      en: "8. Lifelong learning and digital skills — skills after school",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "学校を離れた後の力は、OECD国際成人力調査（PIAAC）が測ってきました。第1回（2011–12年実施・16〜65歳）では、日本は読解力296点・数的思考力288点と、いずれも参加国・地域中第1位でした（OECD平均273点・269点）。特に注目すべきは分布です。上位5%と下位5%の得点差は129点と参加国中最小（OECD平均152点）で、スキルのばらつきが小さい国でした。平均の高さと分布の狭さは、日本の成人スキルの構造的特徴です。",
          en: "Skills after school are measured by the OECD's Survey of Adult Skills (PIAAC). In Round 1 (2011–12, ages 16–65) Japan ranked first in both literacy (296 vs OECD average 273) and numeracy (288 vs 269). Most striking is the distribution: the top-5% to bottom-5% gap of 129 points was the smallest of any participant (OECD average 152). High means with a narrow spread is the structural signature of Japanese adult skills.",
        },
      },
      { type: "chart", chartId: "ch05-piaac-2012" },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "PIAAC第2回（2023年）を図示しない理由",
          en: "Why Round 2 (2023) is not charted",
        },
        text: {
          ja: "OECDは2024年12月に第2回調査（2023年実施）の結果を公表し、文部科学省も結果公表の報道発表を行っています。しかし本サイトの検証時点（2026年10月）で、NIERの結果概要ページは破損しており、OECD.orgの一次資料（国別ノート・データファイル）は本検証環境から到達不能でした。SDMX APIにもPIAACのデータフローは存在しません。未検証の数値を掲載しないという本サイトの方針により、本章は第1回（2012年）のみを図示し、第2回の結果は「検証不能」として制限事項に明示します。第2回の数値についてはOECD・文科省の公表資料を直接ご確認ください。",
          en: "The OECD published Round 2 (fielded 2023) in December 2024, and MEXT announced the results. But at our verification date (October 2026) the NIER results page is broken, the OECD.org primary materials (country notes, data files) are unreachable from this environment, and no PIAAC dataflow exists on the SDMX API. Under this site's policy of publishing only verified figures, the chapter charts Round 1 (2012) alone and marks Round 2 as unverifiable in its limitations. For Round 2 values, please consult the OECD and MEXT publications directly.",
        },
      },
      {
        type: "p",
        text: {
          ja: "デジタルスキルについて、注意して区別すべきことがあります。「インターネットを使う」ことと「デジタルに熟達している」ことは別です。PISA2025のICT活用調査では、日本の生徒は学校内・学校外ともデジタル・リソースの利用頻度がOECD平均より高い（学校内5位・学校外2位/24か国）一方で、「好奇心」に関する項目の肯定回答はOECD平均よりおおむね低く、「忍耐力」は同程度でした。利用頻度が高いことと、自律的な学習・探求の姿勢が高いことは、別の指標です。",
          en: "On digital skills, a distinction matters: using the internet is not digital proficiency. In the PISA 2025 ICT survey, Japanese students use digital resources more often than the OECD average both in and out of school (5th and 2nd of 24) — while curiosity-related items run mostly below the OECD average and persistence is about level. High frequency of use and strong self-directed inquiry are different indicators.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "利用頻度×技能という交差",
          en: "The use × skill crossing",
        },
        text: {
          ja: "PISA2025の革新分野「ラーニング・イン・デジタルワールド（LDW）」では日本はOECD加盟国中1位（全参加4位）でしたが、この結果は「コンピュテーショナルな問題解決能力」部分のみで、自己調整学習を含む全体は2027年に公表予定です。デジタル環境での自律学習力の全体像はまだ出揃っていません。LDWの暫定結果と利用頻度・好奇心の結果を組み合わせた解釈は、確定した結論としてではなく仮説として扱います。",
          en: "In PISA 2025's innovative domain, Learning in the Digital World, Japan ranked first among OECD countries (fourth overall) — but that result covers only the computational problem-solving component; the self-regulated-learning component arrives in 2027. The full picture of autonomous digital learning is not yet in. We treat combinations of the provisional LDW result with usage and curiosity indicators as hypotheses, not settled conclusions.",
        },
      },
      {
        type: "p",
        text: {
          ja: "生涯学習の機会という観点では、家庭での支援的な関わりが次世代の学びの土台になります。PISA2025の「家庭による支援的な関わりの頻度」指標で日本は-0.64と37か国中下位（OECD平均-0.19）でした。「その日あなたが学校で何をしたかを聞く」のは日本の保護者の38.4%が毎日〜ほとんど毎日、OECD平均50.7%。日本の生徒が学校で高いパフォーマンスを出している一方で、家庭での学習についての会話の頻度が国際的に低いという交差は、性能の源泉を「家庭の関心」一つに還元できないことを示しています。",
          en: "For lifelong learning, supportive family involvement underpins the next generation. On the PISA 2025 index Japan scores -0.64, near the bottom of 37 (OECD average -0.19): 38.4% of Japanese parents ask what their child did at school daily or almost daily, versus 50.7% across the OECD. Japanese students perform highly while home-school conversation frequency runs low — a crossing that warns against reducing performance to a single cause such as parental engagement.",
        },
      },
    ],
  },
  {
    id: "synthesis",
    heading: {
      ja: "9. 国際比較が示す全体像 — 高性能・高公平・中期の支出",
      en: "9. The whole picture — high performance, high equity, mid-level spending",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "本章のデータを並べると、日本の教育の全体像が浮かび上がります。(1)成果は高い：PISA2025で3分野すべてOECD加盟国中1位、PIAAC2012で読解・数的思考とも参加国中1位。(2)公平性は高い：ESCS別の得点差が小さく、習熟度の下位層の割合もOECD平均より低い。(3)支出は中位で配分が特徴的：全レベルの1人当たり支出はOECD平均並み（14.2 vs 14.1千ドル）だが、義務教育は下回り高等教育は45%上回る。(4)雇用面の学歴差は小さい：高等教育と上位中等の雇用率差5.2ポイントは比較国中最小。",
          en: "Lined up, the data sketch Japan's education in the round. (1) Outcomes are high: first in all three PISA 2025 domains among OECD countries, first in literacy and numeracy in PIAAC 2012. (2) Equity is high: small ESCS-linked score gaps and low-achiever shares below the OECD average. (3) Spending is mid-level with a distinctive tilt: all-level per-student spending matches the OECD average (14.2 vs 14.1 thousand USD), below it in compulsory schooling and 45% above it in tertiary. (4) The employment penalty by attainment is small: the 5.2-point tertiary/upper-secondary gap is the smallest among comparators.",
        },
      },
      {
        type: "p",
        text: {
          ja: "この全体像は「成功」とも「課題」とも単純に言えない側面を含みます。低得点層（レベル1以下）の割合は3分野すべてで有意に上昇しており（科学8.0%→11.3%）、読解力は2022年比で有意に低下しました。生活満足度は回復したものの、2018年の水準の低さや家庭内支援指標の下位という点は、認知的な成果と非認知的な側面の非対称を示します。いじめ認知件数と不登校は増加（後者は伸びが鈍化）しています。支出の配分が高等教育に厚いことは、家計負担の公私格差（第4節）と重なって、機会の平等への問いを残します。",
          en: "The picture is neither simple success nor simple deficit. Low-achiever shares rose significantly in all three domains (science 8.0%→11.3%) and reading fell significantly from 2022. Life satisfaction recovered, yet its low 2018 level and the bottom-tier family-involvement index reveal an asymmetry between cognitive outcomes and other dimensions. Recognized bullying and nonattendance are up (the latter slowing). The spending tilt toward tertiary overlaps with the public-private household gap (Section 4), leaving a live question about equality of opportunity.",
        },
      },
      {
        type: "callout",
        kind: "interpretation",
        title: {
          ja: "「なぜ日本は高いのか」への説明は複数ある",
          en: "Why Japan scores high — several explanations",
        },
        text: {
          ja: "日本のPISA得点の高さについて、よく挙げられる仮説は、(a)学習指導要領に基づく一貫したカリキュラムと授業時間の確保、(b)教員の養成・研修制度、(c)学習塾など学校外学習の普及、(d)宿題・予習復習を含む学習習慣、(e)社会・家庭の教育への期待の高さ——です。これらは排他的ではなく、相互に補強し得ます。本章の集計データはこれらの相対寄与を分解できません。因果を主張する研究（例えば塾の効果推定）は存在しますが、本章では検証していないため引用しません。「どの説明がどの程度効いているか」は今後の調査課題です。",
          en: "For Japan's high PISA scores, recurring hypotheses include (a) a coherent curriculum with protected instructional time, (b) teacher preparation and training, (c) the prevalence of out-of-school learning such as juku, (d) study habits including homework and review, and (e) high social and family expectations of education. They are not mutually exclusive and may reinforce one another. This chapter's aggregates cannot decompose their relative contributions; causal studies exist (e.g., juku-effect estimates) but are not verified here and are not cited. The weighting of these explanations remains future work.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "比較可能なものだけを並べる",
          en: "Comparing only the comparable",
        },
        text: {
          ja: "本章が国際比較に使ったのは、(1)同一調査・同一尺度内の比較（PISA・PIAAC）、(2)ISCED分類とPPP換算で定義を統一した指標（EAG）——の2種類だけです。TIMSS（数学・理科の教育到達度調査）は日本の得点が高いことも知られていますが、母集団（4年生・8年生）がPISAと異なり本章では未検証のため図示していません。教育投資の対GDP比など他の指標も、定義の確認を経ていないものは掲載しません。",
          en: "International comparisons here use only (1) within-survey, within-scale comparisons (PISA, PIAAC) and (2) indicators harmonized by ISCED classification and PPP conversion (EAG). TIMSS (mathematics and science) is known to show Japan high as well, but its populations (grades 4 and 8) differ from PISA's and it is not verified here, so it is not charted. Other indicators such as education spending as a share of GDP are omitted until their definitions are verified.",
        },
      },
    ],
  },
  {
    id: "act",
    heading: {
      ja: "10. エビデンスに基づく行動 — 何ができ、何を知るべきか",
      en: "10. Evidence-based action — what can be done, what to know",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "個人としてできることから。統計リテラシーは教育についての議論を健全にする最初の道具です。「日本の学力は○位」という見出しを見たら、(1)それがどの調査で（PISA? TIMSS? 全国学力・学習状況調査?）(2)どの母集団で（15歳? 4年生?）(3)どの尺度（得点? 順位? OECD加盟国のみ? 全参加国?）で算出されたかを確認してください。本章が示したように、OECD平均は公表された加盟国平均であり、順位は信頼区間で入れ替わり得ます。一次資料（文科省・NIER・OECDの公表資料）は誰でもアクセスできます。",
          en: "Start with what individuals can do. Statistical literacy is the first tool for sound discussion of education. When you see a headline like \"Japan ranks Nth\", check (1) which survey (PISA? TIMSS? the national assessment?), (2) which population (15-year-olds? fourth-graders?), and (3) which measure (score? rank? OECD members only? all participants?). As this chapter showed, the OECD average is the published member average, and ranks interchange within confidence intervals. The primary sources — MEXT, NIER and OECD publications — are open to everyone.",
        },
      },
      {
        type: "p",
        text: {
          ja: "保護者・地域として。学校との対話に使える観察があります。生活満足度・所属感のような主観指標は、成績とは独立に動きます。家庭での「今日学校で何をした？」という会話の頻度が国際的に低いというデータは、改善の余地がある領域を示します（因果の方向は確定していませんが、会話のコストは低い）。いじめの認知件数が多い学校が「悪い学校」とは限らない——文科省自身が積極的認知を評価している——という点も、学校との協働の前提として知っておく価値があります。",
          en: "As parents and communities: some observations are directly usable in dialogue with schools. Subjective indicators such as life satisfaction and belonging move independently of grades. The data showing low international frequency of \"what did you do at school today?\" conversations marks an area with room to improve (causation unset, but the cost of conversation is low). And a school recognizing many bullying incidents is not thereby a bad school — MEXT itself treats proactive recognition positively — a premise worth holding in school partnerships.",
        },
      },
      {
        type: "p",
        text: {
          ja: "教育関係者として。本章のデータが示すのは、改善の余地が具体的に観測できる領域です。習熟度レベル1以下の割合の上昇（科学8.0%→11.3%）は、底上げの従来の強みが揺らいだ可能性を示します。読解力の有意な低下（−13点）は、読みの流ちょう性（速く正確に読む）の正答率低下を含みます。不登校の新規発生の減少は、多様な学びの場（教育支援センター等）との接続が機能し始めた可能性の一つですが、増加率低下の要因分解は今後の分析課題です。これらの指標を校内で継続的に見ること自体が、エビデンスに基づく実践の第一歩です。",
          en: "As educators: the data mark where improvement is concretely observable. The rise in level-≤1 shares (science 8.0%→11.3%) suggests the traditional strength of lifting the floor may be wavering. Reading's significant decline (−13 points) includes falling accuracy in reading fluency. The drop in new nonattendance cases may be one sign that links to diverse learning venues (education support centres) are beginning to work, though decomposing the slowdown is future analysis. Watching these indicators continuously within a school is itself the first step of evidence-based practice.",
        },
      },
      {
        type: "p",
        text: {
          ja: "制度・政策レベルとして。本章が開示した制限事項は、政策論議の土台を固めるための課題リストでもあります。(1)PIAAC第2回の一次資料の到達性（公表資料のURL安定性）、(2)生徒指導調査の本文表の機械可読性（埋め込みフォント）、(3)日本の「中学卒」雇用率のEAG集計への収録、(4)私立学校の家計負担と給付型支援の効果の検証。統計の公表方法そのものが改善されれば、本サイトのような独立検証も容易になります。",
          en: "At the institutional level: this chapter's disclosed limitations double as a to-do list for strengthening the foundations of policy debate — (1) the reachability of PIAAC Round 2 primary materials (stable publication URLs), (2) machine-readability of the student-guidance survey's inner tables (embedded fonts), (3) inclusion of Japan's below-upper-secondary employment rates in the EAG collection, and (4) verification of private-school household burden and grant-support effects. Better publication practice would make independent verification like this site's easier.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "この章の結論ではないもの",
          en: "What this chapter does not conclude",
        },
        text: {
          ja: "本章は「日本の教育は成功している」とも「危機にある」とも結論しません。観測された事実は、高い平均的成果と狭い格差、増える低得点層、回復した生活満足度、過去最多の認知いじめと不登校（伸びは鈍化）、中期の支出と高等教育への配分傾斜——の共存です。これらの重み付けは、読む人の価値観と、まだ測られていない領域（創造性・道徳・社会性・身体）の評価に依存します。本章の仕事は、その判断のための検証済みの材料を提供することまでです。",
          en: "This chapter concludes neither that Japanese education \"succeeds\" nor that it is \"in crisis\". The observed facts coexist: high average outcomes with narrow gaps; growing low-achiever shares; recovered life satisfaction; record recognized bullying and nonattendance (slowing); mid-level spending tilted toward tertiary. How these weigh depends on the reader's values and on domains not yet measured (creativity, character, sociability, physical health). Our task ends at supplying verified material for that judgment.",
        },
      },
    ],
  },
];
