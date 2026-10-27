import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 04 — Labor & Working Conditions. Research narrative, sections 1–5.
 *
 * Every figure in this text is drawn from the verified data module
 * (src/chapters/chapter-04/data.ts, generated from archived official
 * documents — see research/chapter04/notes/). Nothing is estimated by the
 * authors; derived quantities (part-time ratio) are computed from published
 * components and identified as derived. Interpretive statements are confined
 * to callouts labeled interpretation, and uncertainty to callouts labeled
 * uncertainty.
 */
export const chapter04SectionsA: ChapterSection[] = [
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
          ja: "この章は、日本の働き方を「健診」のように調べます。まず測定可能な状態を観測し（観測）、原典で数値を検証し（検証）、手法の整合する国々と比較し（比較）、考えられる説明を検討し（調査）、対応の方向と不確実性を評価し（評価）、現実的な行動を整理します（行動）。「日本の働き方は悪い」とか「働き方が変わった」のような総括を最初に置くことはしません。",
          en: "This chapter examines working life in Japan the way a careful medical examination works: observe measurable conditions, verify the figures against original sources, compare with methodologically compatible economies, weigh possible explanations, evaluate directions and their uncertainty, and outline realistic actions. It does not begin with a verdict such as \"Japanese work is bad\" or \"the way we work has changed\".",
        },
      },
      {
        type: "p",
        text: {
          ja: "取り上げるのは、雇用と労働力の構造、正規・非正規という雇用形態の分布、労働時間と残業と休暇、賃金とその格差、労働災害と心の健康、ワークライフバランス、そしてキャリア形成の機会です。使用する統計は、総務省統計局の労働力調査（基本集計・詳細集計の長期時系列）、厚生労働省の毎月勤労統計調査・就労条件総合調査・賃金構造基本統計調査・労働災害統計・過労死等の労災補償状況、そして国際比較にはOECDの雇用統計です。いずれも2026年10月26日に原典から取得し、数値をアーカイブした資料内で直接確認しています。",
          en: "We cover the structure of employment and the labour force, the distribution of regular and non-regular work, working hours, overtime and leave, wages and their gaps, occupational accidents and mental health, work-life balance, and opportunities for career development. Sources: the Statistics Bureau's Labour Force Survey (basic and detailed long-run tabulations); MHLW's Monthly Labour Survey, General Survey on Working Conditions, Basic Survey on Wage Structure, occupational-accident statistics and karoshi compensation statistics; and, for international comparison, OECD employment data. All were fetched from the original domains on 2026-10-26, and every cited figure was read inside the archived documents.",
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
          ja: "労働統計には目的の異なる系列が並存します。労働力調査の「非正規の職員・従業員」は雇用形態の区分であって、希望する働き方かどうかを示しません（その内訳は図6の理由統計）。毎月勤労統計の「事業所規模5人以上」と「30人以上」は対象が異なる別系列です。賃金構造基本統計調査の男女間・雇用形態間の格差は、年齢・勤続年数を調整しない「未調整」の値です。労働災害の死傷数は2011年以前と2012年以降で集計手法が異なります（出典が明示）。OECDの年間実労働時間は、OECD自身が「同年の水準比較には適さない」と注意する推計です。本章では各図表に出典・基準・単位を明記します。",
          en: "Labour statistics carry series with different purposes. The LFS's \"non-regular employees\" is an employment-form classification — it says nothing about whether the arrangement is desired (see the reasons statistics, Figure 6). The Monthly Labour Survey's \"5+\" and \"30+\" establishment series are different populations. The wage-structure survey's gender and form gaps are unadjusted for age or tenure. Accident-injury counts change compilation method between ≤2011 and 2012+ (per the source's own note). The OECD's annual hours are estimates the OECD itself flags as unsuitable for same-year level comparisons. Every figure here carries its source, frame and unit.",
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
          ja: "賃金の水準そのもの（名目・実質の長期推移）は第2章「経済・産業」で既に検証済みです。本章は賃金の「格差と雇用形態」に絞り、水準の繰り返しを避けます。また、教育・訓練制度の詳細は第5章「教育・人材」に譲り、本章は雇用に紐づく訓練の機会のみを扱います。",
          en: "Wage levels themselves (long-run nominal and real series) were verified in Chapter 2, Economy & Industry. This chapter focuses on wage gaps and employment forms and avoids repeating the levels. Education and training systems belong to Chapter 5; here we treat only training opportunities tied to employment.",
        },
      },
    ],
  },
  {
    id: "structure",
    heading: {
      ja: "2. 雇用と労働力の構造：70年間の変化",
      en: "2. The structure of employment: seventy years of change",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "2025年の年平均で、日本の就業者は6,828万人、労働力人口は7,004万人、完全失業者は176万人で、完全失業率は2.5%でした。15歳以上人口10,973万人に対する就業率は62.2%です。単年度の数字だけでは見えない構造変化を、長期系列で確認します。",
          en: "In 2025 annual averages, Japan had 68.28 million employed persons, a labour force of 70.04 million, and 1.76 million unemployed — an unemployment rate of 2.5%. The employment-to-population rate among the 109.73 million people aged 15+ was 62.2%. The structural change invisible in a single year becomes clear in the long series.",
        },
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "6,828万人", en: "68.28 million" },
            label: { ja: "就業者（2025年・年平均）", en: "Employed persons (2025 average)" },
            sourceId: "estat-lfs-t2-main",
          },
          {
            value: { ja: "2.5%", en: "2.5%" },
            label: { ja: "完全失業率（2025年）", en: "Unemployment rate (2025)" },
            sourceId: "estat-lfs-t2-main",
          },
          {
            value: { ja: "62.2%", en: "62.2%" },
            label: { ja: "就業率（15歳以上・2025年）", en: "Employment rate, 15+ (2025)" },
            sourceId: "estat-lfs-t2-main",
          },
        ],
      },
      {
        type: "p",
        text: {
          ja: "最大の構造変化は「雇用者化」です。1953年、就業者3,913万人のうち雇用者は1,660万人（42%）で、自営業主991万人、無給の家族従業者1,262万人が残りの過半を占めていました。2025年、雇用者は6,185万人（就業者の約9割）に達し、自営業主は499万人、家族従業者は115万人まで縮小しました。農業・小売・製造の家族経営から、組織に雇われて働く構造への移行が、この70年の基底にあります。",
          en: "The deepest change is the shift to employee status. In 1953, of 39.13 million employed persons only 16.60 million (42%) were employees; 9.91 million were self-employed and 12.62 million unpaid family workers made up most of the rest. By 2025 employees numbered 61.85 million — about 91% of the employed — while the self-employed fell to 4.99 million and family workers to 1.15 million. Underneath everything else lies the move from family-run farming, retail and manufacturing to work inside organizations.",
        },
      },
      { type: "chart", chartId: "ch04-employment-status" },
      {
        type: "p",
        text: {
          ja: "労働力の需給は、完全失業率に最も集約的に現れます。高度成長期の失業率は1%前後で、第一次石油危議後の1975年に1.9%へ一時上昇した後、再び低下しました。転機は1990年代後半です。1997年の3.4%を起点に上昇は続き、2002年に5.4%で頂点に達しました。いわゆる「就職氷河期」です。その後10年かけて緩やかに低下し、2020年のコロナ禍でも2.8%程度（年平均）に留まり、2025年は2.5%です。ただし失業率は労働力の「入口」しか見ません。働きたくても求職を断念した潜在労働力人口（2025年平均35万人）や、週35時間未満で追加就労を希望する追加就労希望就業者（198万人）は失業率に現れません。",
          en: "Supply and demand show most sharply in the unemployment rate. Through the high-growth era it hovered near 1%; it rose temporarily to 1.9% in 1975, after the first oil shock, then subsided. The break came in the late 1990s: from 3.4% in 1997 the rate climbed to its 5.4% peak in 2002 — the employment ice age. A decade of easing followed; even the 2020 pandemic year averaged only about 2.8%, and 2025 stands at 2.5%. But the rate sees only the front door of the labour market. Potential labour force (0.35 million in the 2025 average) — people who want work but have stopped searching — and underemployed workers wanting more hours (1.98 million) never appear in it.",
        },
      },
      { type: "chart", chartId: "ch04-unemployment-rate" },
      {
        type: "p",
        text: {
          ja: "高齢側では逆の動きが起きています。65歳以上の就業率は1968年の33.3%から低下を続け、2011年に19.2%で底を打った後、反転して2025年には26.0%になっています。60～64歳では1968年の59.2%から2025年の74.9%へと大幅に上昇しました。2025年の時点で65歳以上の就業者は943万人に上ります。背景として、2000年代以降の高年齢者雇用安定法の段階的な拡充（2021年4月から65歳までの雇用確保措置が義務）と年金支給開始年齢の引き上げが指摘されます。ただし、本章の図は制度と就業率の因果を分離できません——制度変更・年金・賃金・世帯構造が同時に動いています。",
          en: "At the older end the movement runs the other way. The 65+ employment rate declined steadily from 33.3% (1968) to its 19.2% trough in 2011, then turned and recovered to 26.0% by 2025. At 60–64 it rose steeply from 59.2% (1968) to 74.9% (2025); 9.43 million people aged 65+ were employed in 2025. The staged expansion of the Act on Stabilization of Employment of Elderly Persons (employment-security measures up to 65 mandatory from April 2021) and the rising pension age are cited background. This chapter's figures cannot isolate the causal share of policy — law, pensions, wages and household structure all moved together.",
        },
      },
      { type: "chart", chartId: "ch04-older-employment" },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "失業率の国際比較は定義依存",
          en: "Unemployment comparisons are definition-dependent",
        },
        text: {
          ja: "OECD基準の失業率は各国の労働力調査を調整して算出されますが、調査の設計（標本・期間・求職活動の定義）は国ごとに異なります。日本の完全失業率（調査週間中に求職活動があった者）と他国の失業率を小数点単位で並べる比較には限界があります。また潜在労働力を含む補助指標（ILOのLU指標群、日本の労働力調査も2018年から公表）を使えば、需給の余剰は失業率より大きく見えます。本章は失業率を単一の国際序列として扱いません。",
          en: "OECD-harmonized unemployment rates adjust national surveys, but survey design — sampling, reference periods, the definition of job search — still differs by country. Ranking Japan's unemployment rate (search within the survey week) against others to decimal places has limits; supplementary measures including the potential labour force (the ILO LU indicators; Japan's LFS has published them since 2018) show more slack than unemployment alone. This chapter treats the unemployment rate as one indicator, not a single international league table.",
        },
      },
    ],
  },
  {
    id: "regular-nonregular",
    heading: {
      ja: "3. 正規雇用と非正規雇用",
      en: "3. Regular and non-regular employment",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "働き方の議論で最も使われる区分が「正規／非正規」です。統計上の定義を先に確認します。労働力調査（詳細集計）では、役員を除く雇用者を「正規の職員・従業員」と「非正規の職員・従業員」に分け、非正規の内訳としてパート・アルバイト、労働者派遣事業所の派遣社員、契約社員・嘱託、その他を数えます。2025年の年平均で、役員を除く雇用者5,828万人のうち非正規は2,128万人、割合は36.5%です（正規3,700万人）。",
          en: "No distinction structures the debate about work more than \"regular/non-regular\". The statistical definition first: the LFS detailed tabulation splits employees excluding executive officers into \"regular\" and \"non-regular\" staff, the latter broken into part-time/arbeit, agency dispatch, contract/entrusted, and other. In 2025 averages, 21.28 million of the 58.28 million employees excluding officers were non-regular — 36.5% (regular: 37.00 million).",
        },
      },
      {
        type: "p",
        text: {
          ja: "この割合がどう動いたかは、比較可能な系列が始まる2002年から追えます。男女計では2002年の29.4%から上昇を続け、2019年の38.3%で頂点に達した後、緩やかに低下して2025年は36.5%です。内訳の増加を支えたのは主にパート・アルバイト（2002年1,053万人→2025年1,512万人）と労働者派遣（同43万人→156万人）です。契約社員は2002年の230万人から2025年の273万人へと、パートほどではないものの増加しています。嘱託は2013年から別区分として数えられ（2025年は105万人）、両者を合わせた378万人は、2013年の区分変更前とは厳密には比較できません。男女別では、女性の非正規割合が52.0%（2025年）と男性の22.3%の約2倍ですが、上昇幅でみると男性の方が大きく（15.0%→22.3%）、2000年代以降の非正規化は性別を超えて進んだことが分かります。",
          en: "How the share moved can be traced from 2002, where the comparable series begins. It climbed from 29.4% to its 38.3% peak in 2019, then eased gently to 36.5% by 2025. The rise was carried mainly by part-time/arbeit work (10.53 million in 2002 → 15.12 million in 2025) and agency dispatch (0.43 → 1.56 million); contract employment rose from 2.30 million (2002) to 2.73 million (2025). Entrusted (嘱託) posts became a separate category only in 2013 (1.05 million in 2025), so the combined 3.78 million is not strictly comparable across the 2013 category change. By sex, women's share (52.0% in 2025) is about double men's (22.3%), but the increase has been larger for men (15.0% → 22.3%): non-regularization since the 2000s spread beyond sex lines.",
        },
      },
      { type: "chart", chartId: "ch04-nonregular-share" },
      {
        type: "p",
        text: {
          ja: "年齢別の分布は特徴的です。2025年、15～24歳の非正規割合は52.7%と半数を超えます。これは在学中のパート・アルバイトを多く含むためです。25～34歳で20.7%まで下がり、以降は年齢とともに上昇して55～64歳42.6%、65歳以上76.1%というU字型になります。高年齢側の高さは、定年後の再雇用・嘱託・パート就労の形をとります。つまり「非正規」と一口に言っても、その中身は人生段階によってまったく異なります。",
          en: "The age profile is distinctive. In 2025 the 15–24 share tops half at 52.7% — many are students in part-time jobs. It dips to 20.7% at 25–34, then climbs with age to 42.6% at 55–64 and 76.1% at 65+, a U-shape. The high older end reflects post-retirement re-employment, entrusted and part-time arrangements. \"Non-regular\" therefore means entirely different things at different stages of life.",
        },
      },
      { type: "chart", chartId: "ch04-nonregular-age" },
      {
        type: "p",
        text: {
          ja: "非正規=希望しない働き方、という短絡的な解釈は統計が許しません。労働力調査は、非正規の職員・従業員が「現職の雇用形態についた主な理由」を尋ねています。2025年で最多は「自分の都合のよい時間に働きたいから」の36.6%（757万人、5年連続増加）で、以下「家計の補助・学費等を得たいから」17.7%、「家事・育児・介護等と両立しやすいから」10.9%、「通勤時間が短いから」5.3%、「専門的な技能等をいかせるから」8.0%と続きます。「正規の職員・従業員の仕事がないから」——いわゆる不本意非正規の代理指標——は8.4%（173万人）です。",
          en: "The shortcut equation \"non-regular = unwanted\" is not something the statistics allow. The LFS asks non-regular staff their main reason for the current form. In 2025 the largest was \"to work hours that suit me\" at 36.6% (7.57 million, rising for a fifth year), followed by \"to supplement household income or tuition\" 17.7%, \"easier to combine with housework, childcare or care\" 10.9%, \"shorter commute\" 5.3%, and \"can use specialist skills\" 8.0%. \"No regular job available\" — the proxy for involuntary non-regularity — was 8.4% (1.73 million).",
        },
      },
      { type: "chart", chartId: "ch04-nonregular-reasons" },
      {
        type: "callout",
        kind: "interpretation",
        title: {
          ja: "理由統計の読み方",
          en: "How to read the reasons",
        },
        text: {
          ja: "理由の内訳は、制度と個人の事情が混ざった結果です。「家計の補助」や「家事・育児・介護との両立」が多いことは、社会保障・保育・介護サービス・税制（配偶者控除など）が働き方を選択の余地の中で形作ってきた可能性を示しますが、本章のデータだけでは原因を確定できません。逆に「正規の仕事がない」が男性で13.0%と女性の6.2%の約2倍であることは、性別によって制約の種類が違うことを示唆します。いずれにしても、36.6%の「都合のよい時間」が即「満足」を、8.4%の「仕事がない」が即「不満」を意味するわけではありません。理由は単一回答です。",
          en: "The reasons mix institutions and personal circumstances. The weight of \"supplementing household income\" and \"compatibility with care\" may reflect how social insurance, childcare and care services, and the tax system (spousal deductions among them) have shaped the choice set — but these data alone cannot establish causes. Conversely, \"no regular job available\" running at 13.0% for men versus 6.2% for women hints that the binding constraint differs by sex. Neither does 36.6% \"hours that suit me\" mean satisfaction, nor 8.4% \"no job available\" mean dissatisfaction — the question records one main reason.",
        },
      },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "1984年から2001年：失われた比較可能な系列",
          en: "1984–2001: the missing comparable series",
        },
        text: {
          ja: "非正規の推移を1980年代まで遡る図をよく見ますが、労働力調査（詳細集計）の比較可能な公表系列は2002年からです。2001年以前は「労働力調査特別調査」が類似の項目を2月調査として実施していました（1984年2月以降、雇用形態の項目が現在とほぼ同じ）。ただし調査時期（2月の単月）と対象が詳細集計（年平均）とは異なり、厚労省・統計局自身が「時系列の比較は調査時期や調査対象等に相違があることに留意」と明記しています。本章は2002年以降のみ図示し、1984–2001年はこの注意とともに本文でのみ言及します。",
          en: "Charts reaching back to the 1980s for non-regular work are common, but the LFS's comparable published series starts in 2002. Before that, the LFS Special Survey fielded similar items each February (with the employment-form question essentially current from February 1984). Its timing (single February month) and frame differ from the detailed tabulation's annual averages, and the statistics offices themselves state the two \"can be compared only with attention to differences in timing and coverage\". This chapter charts 2002 onward only, and mentions 1984–2001 in the text together with this caveat.",
        },
      },
    ],
  },
  {
    id: "hours",
    heading: {
      ja: "4. 労働時間・残業・休暇",
      en: "4. Working hours, overtime and leave",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "日本の労働時間は長期的に減ってきました。毎月勤労統計調査（調査産業計）では、事業所規模30人以上の月平均総実労働時間は1970年の186.6時間から2025年の141.1時間へ、45.5時間減少しました。週換算すれば約10時間半です。5人以上の系列（1990年以降）でも172.0時間から135.1時間へ36.9時間の減少です。所定外労働時間（残業・休日労働等）は5人以上で1990年の13.0時間から2025年の9.8時間へ減っています。",
          en: "Working hours in Japan have fallen over the long run. In the Monthly Labour Survey (all surveyed industries), average monthly total actual hours at 30+ establishments fell from 186.6 (1970) to 141.1 (2025) — 45.5 hours a month, roughly 10.5 a week. The 5+ series (from 1990) fell 36.9 hours, from 172.0 to 135.1. Overtime (including holiday work) at 5+ establishments declined from 13.0 hours (1990) to 9.8 (2025).",
        },
      },
      { type: "chart", chartId: "ch04-hours-longrun" },
      {
        type: "p",
        text: {
          ja: "ただし平均の減少を「同じ人が短く働くようになった」と読むのは正確ではありません。5人以上の事業所では、2025年時点で労働者の31.3%がパートタイム労働者です（1990年12.3%）。一般労働者の月平均は160.5時間、パートタイム労働者は79.1時間です。パート比率が高まれば、全労働者の平均（135.1時間）は自動的に引き下げられます。つまり平均の低下には、同一労働者の時間短縮と、短時間労働者の構成増加（構成効果）の両方が含まれます。図8の2系列の間の距離が、この構成の幅です。",
          en: "But reading the falling average as \"the same people now work less\" would be wrong. At 5+ establishments, 31.3% of workers are part-timers (2025; 12.3% in 1990). General workers average 160.5 hours a month, part-timers 79.1. As the part-time share grows, the all-worker average (135.1) is mechanically pulled down. The average's decline therefore bundles shorter hours per worker and a rising weight of short-hours workers — a composition effect. The distance between the two lines in Figure 8 is the width of that composition.",
        },
      },
      { type: "chart", chartId: "ch04-hours-parttime" },
      {
        type: "p",
        text: {
          ja: "休暇の指標として、年次有給休暇の取得率があります。就労条件総合調査（対象：常用労働者30人以上の民営企業）では、取得率は1980年代末から2000年代初頭にかけて48%前後で低迷しました。転機は2010年代半ばです。2013年の47.1%から上昇に転じ、2019年に62.1%へ跳ね上がり、コロナ禍で一度加速した後、2025年調査（2024年暦年）では66.9%と、統計がある1984年（55.6%）以来の最高水準です。付与日数は18.1日、取得日数は12.1日でした。",
          en: "On the leave side, the acquisition rate of annual paid leave. In the General Survey on Working Conditions (private enterprises with 30+ regular employees) the rate scraped along near 48% from the late 1980s into the early 2000s. The turn came in the mid-2010s: from 47.1% in 2013 it jumped to 62.1% in 2019, accelerated through the pandemic, and reached 66.9% in the 2025 round (calendar 2024) — its highest since 55.6% in 1984, when the series begins. Days granted averaged 18.1, days taken 12.1.",
        },
      },
      { type: "chart", chartId: "ch04-paid-leave" },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "取得率66.9%の意味と限界",
          en: "What 66.9% does and does not mean",
        },
        text: {
          ja: "取得率は企業の総括に基づく平均です。2025年調査でも、産業別には電気・ガス・熱供給・水道業の75.2%に対して宿泊業・飲食サービス業は50.7%と、25ポイント近い差があります。また付与日数は勤続年数に応じた法定日数の水準に近く（繰越を除く18.1日）、計画的付与制度のある企業は40.8%にとどまります。平均の改善を、個人の休暇権利の一律の改善としては読めません。",
          en: "The rate is an enterprise-level average. Even in the 2025 round, utilities reach 75.2% while accommodation and food services sit at 50.7% — a gap of nearly 25 points. Granted days (18.1, excluding carry-overs) track statutory minima by tenure, and only 40.8% of firms operate planned-granting schemes. The improving average is not a uniform improvement in individuals' right to rest.",
        },
      },
      {
        type: "p",
        text: {
          ja: "国際的な位置づけでは、OECDの推計で日本の年間実労働時間は2025年に1,597.5時間でした。OECD平均の1,736.1時間を下回り、ドイツの1,332.2時間を上回ります。1970年の2,243.0時間からは約645時間の減少で、これは比較国の中でも大きい幅度です。ただしこの推計はOECD自身が「水準の直接比較には適さない（出典と推計方法が国により異なる）」と注意しており、詳細は第9節で扱います。",
          en: "In international position, the OECD estimates Japan's annual hours actually worked at 1,597.5 in 2025 — below the OECD average of 1,736.1 and above Germany's 1,332.2. The fall from 2,243.0 hours in 1970, about 645 hours, is among the larger declines in the comparison set. But the OECD itself cautions that the levels are not directly comparable (sources and estimation differ by country); Section 9 treats this in detail.",
        },
      },
    ],
  },
  {
    id: "wages",
    heading: {
      ja: "5. 賃金と労働条件の格差",
      en: "5. Wages and the gaps in working conditions",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "賃金水準の長期推移は第2章で検証済みなので、本章は格差に絞ります。最初に確認すべきは、2つの「格差」指標の定義です。賃金構造基本統計調査の男女間賃金格差は、一般労働者のきまって支給する賃金について女性の対男性比率（男=100）を表します。雇用形態間賃金格差は、正社員・正職員=100とした正社員以外の比率です。いずれも年齢・勤続年数・産業構成を調整しない「未調整」の格差です。",
          en: "Since Chapter 2 verified long-run wage levels, this chapter narrows to gaps. First, definitions. The wage-structure survey's gender gap is the female-to-male ratio (male=100) of general workers' scheduled cash earnings; the employment-form gap is the non-regular ratio with regular staff =100. Both are unadjusted for age, tenure or industry composition.",
        },
      },
      {
        type: "p",
        text: {
          ja: "女性の賃金の対男性比率は、1976年の58.8から2000年の65.5、2025年の76.6へと、49年間で17.8ポイント改善しました。改善は長期ですが、途上は急ではありません——直近10年（2015年72.2→2025年76.6）で4.4ポイントです。2025年の水準は男性373.4千円に対して女性285.9千円です。雇用形態間では、2005年の60.1から2025年の67.4へと7.3ポイントの改善です（正規358.8千円、非正規241.7千円）。女性の賃金上昇には非正規比率の変化と勤続構造の変化が含まれ、賃金カーブの形と密接に関係します。",
          en: "The female-to-male ratio improved 17.8 points over 49 years — from 58.8 (1976) to 65.5 (2000) and 76.6 (2025). The improvement is long but not fast: 4.4 points in the last decade (72.2 in 2015). In 2025 men averaged ¥373.4 thousand against women's ¥285.9 thousand. The form gap improved 7.3 points, from 60.1 (2005) to 67.4 (2025) — regular ¥358.8 thousand, non-regular ¥241.7 thousand. Women's rising ratio embeds changing non-regular shares and tenure structures, and ties directly to the shape of the wage curve.",
        },
      },
      { type: "chart", chartId: "ch04-wage-gaps" },
      {
        type: "p",
        text: {
          ja: "年齢別賃金カーブ（2025年・一般労働者）は、格差の構造を示します。男性の賃金は20～24歳の245.7千円から55～59歳の445.6千円へ1.8倍に達し、その後緩やかに下降します。女性は239.6千円から45～49歳・55～59歳の305.7千円へ1.3倍で、上昇は緩やかです。この「カーブの傾き」の差は、昇進・勤続・雇用形態の分布が年齢とともにどう開くかを反映します。OECDの中央値ベースの男女賃金格差（第9節）では日本は2025年20.1%で、国際的にまだ大きい方です。",
          en: "The age-wage curve (2025, general workers) exposes the structure. Men's earnings climb 1.8×, from ¥245.7 thousand at 20–24 to ¥445.6 thousand at 55–59, then ease down. Women rise just 1.3×, from ¥239.6 thousand to ¥305.7 thousand at 45–49 and 55–59. The difference in slope reflects how promotion, tenure and employment form open up with age. On the OECD's median-based gender gap (Section 9), Japan still ranks large at 20.1% in 2025.",
        },
      },
      { type: "chart", chartId: "ch04-wage-curve" },
      {
        type: "p",
        text: {
          ja: "雇用形態間の格差は年齢とともに拡大します。2025年、15～19歳では非正規の賃金は正規の88.4%とほぼ同等ですが、25～29歳で80.0%、35～39歳で65.3%、55～59歳では54.8%まで下がります。若年層の「ほぼ同等」から高年層の「約55%」までの開きは、正規の昇給カーブ（年功）と非正規の平坦な賃金との差が蓄積した結果です。これは同一時点の横断比較であり、個人のライフコース上の賃金経路を直接追ったものではない点に注意が必要です。",
          en: "The employment-form gap widens with age. In 2025, non-regular wages are 88.4% of regular wages at 15–19 — near parity — then 80.0% at 25–29, 65.3% at 35–39, and 54.8% by 55–59. The spread from near-parity young to roughly 55% older is the accumulation of the regular wage curve against non-regular flatness. Note this is a cross-section, not a longitudinal follow of any individual's earnings path.",
        },
      },
      {
        type: "callout",
        kind: "interpretation",
        title: {
          ja: "格差の「なぜ」は統計だけでは確定しない",
          en: "The \"why\" of gaps is not settled by statistics alone",
        },
        text: {
          ja: "未調整の男女差76.6（男=100）には、勤続年数の分布差、雇用形態の分布差、産業・職業構成の差がすべて含まれます。調整済みの差（同じ職務・勤続での差）を推定するには追加の微視的データが必要で、本章の統計では算出できません。同様に雇用形態間の67.4も、労働時間・職務内容の違いを含む「包括的な賃金の比」です。差を「差別」や「選択」に単一帰属させる説明は、このデータでは支持されません。雇用形態間の時間当たり賃金は、勤務時間が短い非正規で割引かれる構造（月額比較の上方バイアス）にも注意します。",
          en: "The unadjusted gender ratio of 76.6 (male=100) bundles differences in tenure distributions, employment forms, and industry and occupation mix. Estimating an adjusted gap (same job, same tenure) requires additional microdata beyond this chapter's statistics. Likewise the 67.4 form ratio is an all-in comparison that includes hours and job content. Explanations attributing the gaps wholly to discrimination or wholly to choice find no support here. Note too that monthly comparisons flatter part-time-heavy non-regular wages; hourly comparisons would discount them.",
        },
      },
    ],
  },
];
