import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 04 — Labor & Working Conditions. Research narrative, sections 6–10.
 *
 * Every figure is drawn from the verified data module. Occupational-disease
 * and training statistics are quoted from archived official documents at the
 * fragment level (research/chapter04/notes/). Interpretation is confined to
 * callouts labeled interpretation; uncertainty to callouts labeled
 * uncertainty.
 */
export const chapter04SectionsB: ChapterSection[] = [
  {
    id: "safety",
    heading: {
      ja: "6. 職業性の安全と健康",
      en: "6. Occupational safety and workplace health",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "労働災害の長期系列は、安全の面では日本の明確な改善を示します。死亡者数は1975年の4,330人（観測期間の最多）から2025年の700人へ約84%減少しました。直近も減少が続いています（2024年746人→2025年700人）。産業別では建設業と製造業の比重が大きいことが、公表資料の一貫した注記です。",
          en: "The long accident series shows clear improvement in safety. Fatalities fell about 84%, from 4,330 in 1975 (the series maximum) to 700 in 2025, and the decline continues (746 in 2024 → 700 in 2025). Published notes consistently flag construction and manufacturing as the heaviest industries.",
        },
      },
      { type: "chart", chartId: "ch04-accident-death" },
      {
        type: "p",
        text: {
          ja: "休業4日以上の死傷者数はより複雑です。1974年の347,407人から2009年の105,718人（最小値）まで長期的に減少しましたが、2015年頃からは増加に転じ、2020年以降はコロナ禍の小康を挟んで125,115人（2020年）から135,333人（2025年）へ増加しています。死傷の増加と死亡の減少が併存する近年の構図は、致命的な事故の防止が進む一方、休業を要する事故——転倒や無理な動作など軽微だが休業を伴う災害——が増えていることを示唆します。厚労省は高年齢労働者の増加と第三次産業の拡大を指摘しています。",
          en: "Injuries requiring 4+ lost days tell a more complicated story. They fell long-term from 347,407 (1974) to their 2009 minimum of 105,718, then turned upward around 2015, and after the pandemic lull climbed from 125,115 (2020) to 135,333 (2025). Fatalities falling while injuries rise suggests prevention of lethal accidents advancing even as less severe but workday-losing events — falls, awkward motions — increase. MHLW points to an ageing workforce and the expansion of services.",
        },
      },
      { type: "chart", chartId: "ch04-accident-injury" },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "死傷者数の系列には出典上の断絶がある",
          en: "The injury series carries a source break",
        },
        text: {
          ja: "厚労省の公表注記によれば、死傷数は平成23年（2011年）まで労災保険給付データ（労災非適用事業を含む）と労働者死傷病報告から、平成24年（2012年）以降は労働者死傷病報告・死亡災害報告のみから作成されています。本章は出典の公表値をそのまま掲載しますが、2011/2012年を跨ぐ水準比較は厳密には意味を持ちません。また2020年以降の値は新型コロナウイルス感染症へのり患による労働災害を除いた値です（例：2020年は除かない値131,156人、除いた値125,115人）。",
          en: "Per MHLW's own note, injury counts through 2011 combine workers'-comp benefit data (including non-covered establishments) with casualty reports; from 2012 they use casualty and fatality reports only. This chapter publishes the source's own values, but level comparisons across 2011/2012 are not strictly meaningful. Values from 2020 exclude COVID-infection cases (e.g. 2020: 131,156 including, 125,115 excluding).",
        },
      },
      {
        type: "p",
        text: {
          ja: "心の健康に関する労災制度の利用は急増しています。業務災害に係る精神障害の労災請求件数は、2018年度の1,820件から2025年度の4,958件へ約2.7倍になりました。支給決定（業務災害と認定）は2025年度1,082件で、認定率（支給決定÷決定）は28.2%です。同じ資料の脳・心臓疾患の請求は2025年度1,254件、支給決定217件でした。また、複数の事業主の下で働く者に係る「複数業務要因災害」の集計区分も公表されており、精神障害の決定件数は令和7年度17件・うち支給決定4件と、まだ件数は小さいです。",
          en: "Use of the workers'-compensation system for mental health has surged. Claims for work-related mental disorders rose about 2.7×, from 1,820 (FY2018) to 4,958 (FY2025). Grants — cases recognized as work-related — reached 1,082 in FY2025, a 28.2% recognition rate. In the same release, brain and heart disease claims numbered 1,254 with 217 granted. A tabulation for multi-employer causal cases (people working across multiple firms) is also published: 17 mental-health decisions with 4 granted in FY2025 — still small counts.",
        },
      },
      { type: "chart", chartId: "ch04-mental-comp" },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "請求件数の増加は何を意味するか",
          en: "What rising claims mean — and do not",
        },
        text: {
          ja: "請求件数の増加をそのまま「労働による心の病の増加」と訳すことはできません。申請のしやすさ（様式・周知・支援の変化）、勤労者と事業所の申請意識、そして労働環境の実態変化がすべて含まれます。認定率の変動（令和7年度28.2%）も、申請構成の変化を反映します。制度利用は発生の下限（フロア）であり、潜在する健康被害の規模は測りません。「過労死等の労災補償状況」の公表自体は2025年度（令和8年5月公表）まで毎年行われています。",
          en: "The claim rise cannot be translated directly into \'more work-related mental illness\'. Easier application procedures (forms, outreach, support), changing propensity of workers and firms to apply, and genuine changes in working conditions all enter. The recognition rate (28.2% in FY2025) also moves with claim composition. System use is a floor for incidence, not a measure of underlying harm. The karoshi statistics themselves have been published annually through FY2025 (released May 2026).",
        },
      },
      {
        type: "p",
        text: {
          ja: "職業性の安全を測るもう一つの系列に、労働災害動向調査（事業所規模100人以上）の度数率（延べ実労働100万時間当たりの死傷度数）があります。度数率は2011年の1.62から2021年の2.14へ上昇した後、2025年は2.01です。この系列は100人以上の事業所に限られ、全国の死傷者数系列（図12）とは分母も対象も異なるため、併記はしません（両者の近年の上昇傾向は同方向です）。",
          en: "A second safety series — the frequency rate (injuries per million hours actually worked) from the Accident Trend Survey, covering establishments with 100+ employees — rose from 1.62 (2011) to 2.14 (2021), easing to 2.01 in 2025. Its frame and denominators differ from the national injury counts of Figure 12, so we do not chart it alongside (their recent directions agree).",
        },
      },
    ],
  },
  {
    id: "worklife",
    heading: {
      ja: "7. ワークライフバランスと雇用の質",
      en: "7. Work-life balance and employment quality",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "第4節で見たとおり、実労働時間は長期的に減少し、有給休暇の取得率は上昇に転じています。ワークライフバランスを数量化する単一指標はありませんが、構成要素を整理できます。就労条件総合調査（2025年調査）によれば、1企業平均の週所定労働時間は39時間24分（1日7時間49分）です。「何らかの週休2日制」を採用する企業は92.6%、「完全週休2日制」は65.5%で、「何らかの週休3日制」は0.9%にとどまります（いずれも企業割合）。年次有給休暇の計画的付与制度がある企業は40.8%です。",
          en: "As Section 4 showed, actual hours have fallen long-term and paid-leave acquisition has turned upward. No single number measures work-life balance, but its components can be laid out. In the 2025 General Survey on Working Conditions, the enterprise-average scheduled workweek is 39 hours 24 minutes (7 hours 49 minutes a day). 'Some form of two-day weekly rest' covers 92.6% of enterprises and 'full two-day rest' 65.5%, while 'some form of three-day rest' remains 0.9% (enterprise shares). Planned granting of annual leave operates at 40.8% of firms.",
        },
      },
      {
        type: "p",
        text: {
          ja: "就業形態と生活の両立では、非正規の理由統計（図6）が再び効きます。「家事・育児・介護等と両立しやすいから」は女性の非正規の15.4%（218万人）を占め、男性では1.2%です。育児・介護との両立が女性の働き方の制約として構造的に重いことを示します。逆に「正規の職員・従業員の仕事がないから」は男性13.0%・女性6.2%です。すなわち、女性はケアとの両立で、男性は正規ポストの入手可能性で、それぞれ制約を受けている構図が統計から読めます——ただし理由は単一回答であり、制約の重みの比較には限界があります。",
          en: "On balancing work with life, the reasons statistics (Figure 6) do real work. \'Easier to combine with housework, childcare or care\' accounts for 15.4% of women's non-regular work (2.18 million) against 1.2% of men's — care compatibility is structurally heavy in women's working arrangements. Conversely \'no regular job available\' runs 13.0% among men and 6.2% among women. The statistics sketch women constrained by care compatibility and men by the availability of regular posts — while remembering that single-answer reasons limit how far the weights can be compared.",
        },
      },
      {
        type: "p",
        text: {
          ja: "雇用の質は賃金・時間・安定・育成の複合です。本章が検証した範囲では、時間（図7・8）と休暇（図9）は改善方向、賃金格差（図10）は緩やかな改善、教育訓練は次節のとおり分布に偏りがあります。安定（雇用継続）については、正規と非正規の間で契約期間・雇用調整のリスクが異なることは制度上明らかですが、本章が検証した統計には離職率・契約更新率の形での直接的な系列は含まれません。この限界は章末に明示します。",
          en: "Employment quality is a composite of pay, hours, stability and development. Within what this chapter verified: hours (Figures 7–8) and leave (Figure 9) point toward improvement, wage gaps (Figure 10) improve slowly, and training — next section — is unevenly distributed. On stability, contract duration and adjustment risk differ by form as a matter of institutional design, but the statistics verified here include no direct series of turnover or contract-renewal rates; the limitation is stated at the chapter's end.",
        },
      },
    ],
  },
  {
    id: "career",
    heading: {
      ja: "8. キャリア形成と流動性",
      en: "8. Career development and mobility",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "雇用に紐づく訓練の機会は、能力開発基本調査（令和7年度）で把握できます。企業が教育訓練に費用を支出するかどうかは、ＯＦＦ－ＪＴ（業務を離れた訓練）と自己啓発支援で分かれます。令和7年度調査では、ＯＦＦ－ＪＴまたは自己啓発支援のいずれかに費用を支出した企業は54.4%でした（両方に支出21.5%・ＯＦＦ-ＪＴのみ28.5%・自己啓発支援のみ4.4%）。自己啓発支援に支出した企業の割合は25.9%で、3年移動平均では近年上昇しています。",
          en: "Training tied to employment is captured by the Skills Development Survey (FY2025). Whether firms spend on training splits into OFF-JT (off-the-job training) and support for self-development. In the FY2025 survey, 54.4% of enterprises spent on either OFF-JT or self-development support (both: 21.5%; OFF-JT only: 28.5%; self-development only: 4.4%); the share spending on self-development support alone was 25.9%, rising on a three-year moving average.",
        },
      },
      {
        type: "p",
        text: {
          ja: "機会の分布に注目します。同調査の労働者側の結果では、自己啓発を行った労働者の割合は正社員で30.2%、正社員以外で17.6%です。訓練への投資とその機会が雇用形態によって分かれていることを示します。また、過去3年間のＯＦＦ－ＪＴ費用の実績をみた企業の答えは、正社員については「横ばい」が最多、正社員以外については増加傾向の報告が増えていますが、これは事業所の主観的回答である点に留意します。",
          en: "The distribution matters. On the worker side, 30.2% of regular staff engaged in self-development versus 17.6% of non-regular — training investment and opportunity divide by employment form. Asked about OFF-JT spending over the past three years, the modal firm answer for regular staff is \'flat\', with more firms reporting increases for non-regular staff; these are subjective establishment replies and are treated as such.",
        },
      },
      {
        type: "p",
        text: {
          ja: "流動性（転職）については、労働力調査が転職者数を公表しています。2025年平均の転職者数は330万人、転職者比率（就業者に占める割合）は4.8%で、前年に比べ1万人の減少・0.1ポイントの低下でした。これは年度内の転職頻度の指標であり、国際的な「仕事の流動性」の比較には定義の調整が必要です。本章は、日本の労働市場の流動性が「低い」か「高い」かの断定的な国際序列を置きません。",
          en: "On mobility, the LFS publishes job changers: 3.30 million in the 2025 average, a 4.8% changer rate among employed persons, down 10 thousand and 0.1 points from the previous year. This measures within-year job-changing; international comparisons of \'labour-market fluidity\' require definitional adjustment. This chapter declines to assert a definitive international ranking of Japan's fluidity.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "訓練統計の限界",
          en: "Limits of the training statistics",
        },
        text: {
          ja: "能力開発基本調査の対象は事業所（民営・常時雇用のある法人等）であり、回答は支出の有無や主観の実績判断です。訓練の質・時間・到達した技能は測られません。また個人への効果（賃金・雇用の改善）の推定には縦断データが必要で、本章の統計では検証できません。教育・人材制度の全体像は第5章に譲ります。",
          en: "The Skills Development Survey covers establishments (private employers with regular staff); replies are about spending and subjective performance judgments. It measures neither the quality, hours nor skills attained. Estimating individual effects (wage or employment gains) requires panel data beyond this chapter's statistics. The education and talent system as a whole belongs to Chapter 5.",
        },
      },
    ],
  },
  {
    id: "international",
    heading: {
      ja: "9. 国際比較と競合する説明",
      en: "9. International comparisons and competing explanations",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "OECDの推計では、日本の1人当たり年間実労働時間は2025年1,597.5時間で、OECD平均1,736.1時間を下回ります。韓国（1,833.0時間）・アメリカ（1,800.2時間）より短く、ドイツ（1,332.2時間）・フランスより長い。1970年の2,243.0時間から約645時間の減少は、この比較国のセットの中で最大級です。ただし繰り返しになりますが、OECDはこの系列について「データはトレンド比較を意図しており、出典が国により異なるため同年の水準比較には適さない」と公式に注意しています。本章もその扱いに従い、図を序列としてではなく文脈として提示します。",
          en: "The OECD estimates Japan's annual hours actually worked per person at 1,597.5 in 2025, below the OECD average of 1,736.1 — shorter than Korea (1,833.0) or the United States (1,800.2), longer than Germany (1,332.2) or France. The decline of about 645 hours since 1970 (2,243.0) is among the largest in this comparison set. Repeated for emphasis: the OECD officially cautions that the series is intended for trend comparison and that level comparisons for a given year are unsuitable because sources differ; this chapter follows that guidance and presents the chart as context, not a ranking.",
        },
      },
      { type: "chart", chartId: "ch04-oecd-hours" },
      {
        type: "p",
        text: {
          ja: "雇用形態の国際比較はさらに注意を要します。OECDの「臨時雇用の割合」（雇用者に占める有期雇用等の割合）は2025年、日本14.2%に対して韓国27.5%、OECD平均11.1%です。ただしOECD自身が、日本については2018年1月の労働力調査改正による系列の断絶（「従業上の地位」項目との直接比較不可）を明記しています。より重要な概念上の注意として、OECDの「臨時雇用」は契約期間で定義され、日本の「非正規」（パート・派遣・契約・嘱託等を含む）とは同一の概念ではありません。日本の非正規36.5%とOECD臨時雇用14.2%を直接比較することはできません。",
          en: "Comparing employment forms demands even more care. The OECD's temporary-employment share (fixed-term and similar, of employees) is 14.2% for Japan in 2025, against Korea 27.5% and an OECD average of 11.1%. The OECD itself notes a series break for Japan at the January 2018 LFS revision (not directly comparable with the earlier status-in-employment items). The deeper conceptual caution: the OECD's \'temporary\' is defined by contract duration and is not the same concept as Japan's \'non-regular\' (which includes part-time, dispatch, contract and entrusted work). Japan's 36.5% non-regular and the OECD's 14.2% temporary must not be compared directly.",
        },
      },
      {
        type: "p",
        text: {
          ja: "男女賃金格差のOECD中央値ベースの指標では、日本は2025年20.1%で、OECD平均（10.1%・2024年）の約2倍、韓国（27.8%・2025年）に次ぐ高い水準です。1975年の42.4%からは長期改善しています。ただしこの指標は「男性の中央値賃金に対する女性の中央値賃金の差の割合」であり、勤続・雇用形態・産業構成の違いを含む未調整の値です。調整後の格差はより小さくなることが一般的に知られていますが、本章のデータでは調整値を算出できず、公表も確認していません。",
          en: "On the OECD's median gender wage gap, Japan stands at 20.1% in 2025 — roughly double the OECD average (10.1% in 2024) and second only to Korea (27.8%, 2025) in this set — after long improvement from 42.4% in 1975. The measure is the gap between women's and men's median earnings; unadjusted, it embeds tenure, employment-form and industry differences. Adjusted gaps are generally known to be smaller, but this chapter's data cannot compute one, and we have not verified a published adjusted figure.",
        },
      },
      {
        type: "callout",
        kind: "interpretation",
        title: {
          ja: "なぜ日本の働き方はこうなのか：競合する説明",
          en: "Why does Japanese work look this way? Competing explanations",
        },
        text: {
          ja: "本章が示した観測——非正規比率の上昇と頭打ち、時間短縮と構成効果、賃金格差の緩慢な改善、災害死亡の減少と精神障害請求の急増——に対して、複数の説明が競合します。①制度的説明：雇用保護・賃金制度・税制（配偶者控除）が正規と非正規の分断を維持したという説明。②構造的説明：サービス業化と人口高齢化が短時間労働の需要を高めたという説明。③選択・規範的説明：家計・ケア・ライフステージの選好が多様な働き方を選んだという説明。④計測的説明：申請・報告のしやすさの変化が災害・労災の統計を押し上げたという説明。これらは排他ではなく併存し得ます。本章の統計は単一の説明を確定できず、確定させません。ただし観測事実——例えば男性の非正規上昇が女性より大きいこと、理由別に「家計補助」が不変で「都合のよい時間」が増えていること——は、一部の単純化された説明と整合しないことを指摘できます。",
          en: "Several explanations compete for the observations here — the rise and plateau of non-regularity, shorter hours with composition effects, slow gap improvement, falling fatalities with surging mental-health claims. (1) Institutional: employment protection, wage systems and tax design (spousal deductions) sustained the regular/non-regular divide. (2) Structural: servicification and population ageing raised demand for short-hours work. (3) Preference and norms: households, care and life-stage choices selected diverse work forms. (4) Measurement: easier application and reporting pushed the accident and compensation statistics upward. These can coexist; the chapter's statistics neither fix nor force a single cause. The observations themselves, though — men's non-regular share rising more than women's; \'household supplement\' flat while \'hours that suit me\' grows — are inconsistent with some simplified accounts.",
        },
      },
    ],
  },
  {
    id: "actions",
    heading: {
      ja: "10. 証拠に基づく個人・世帯・地域・事業主・制度の行動",
      en: "10. Evidence-based actions for individuals, households, communities, employers and institutions",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "本章の観測から、立場ごとに現実的な選択肢を整理します。いずれも統計の観測に照らして意味のあるものに限定し、確実性を過大に示唆しないようにします。個人の行動だけで構造的な問題（賃金格差・請求の急増など）は解決しません。",
          en: "The observations translate into realistic options by position, kept to what the statistics can support and stated without overstated certainty. Individual action alone does not solve structural problems such as wage gaps or surging claims.",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "労働者・個人：働く時間の記録（勤務実績・残業時間）を自分で保持する。実労働時間と所定外時間の公表値（月135.1時間・残業9.8時間・5人以上2025年平均）は、自分の状況を位置づける基準になる。雇用形態の変更を考える際は、賃金の月額だけでなく時間当たり・勤続年数別のカーブ（図11）で比較する。年次有給休暇の取得は制度上の権利であり、取得率の産業差（50.7%～75.2%）は職場選択の情報になる。",
            en: "Workers and individuals: keep your own record of hours worked. Published averages (135.1 hours a month, 9.8 overtime, 5+ establishments, 2025) locate your situation. When considering a change of employment form, compare not just monthly pay but hourly rates and the tenure-based curve (Figure 11). Paid leave is a statutory right; the industry spread in acquisition (50.7–75.2%) is usable information when choosing a workplace.",
          },
          {
            ja: "家計：家計の補助・学費等（366万人）やケアとの両立（226万人）を理由とする短時間就労が多い現実から、「家計内の役割」と「社会保障・税制の枠」を一度見直す。配偶者の扱いが世帯の働き方を規定する制度は、届出・源泉徴収の単位であることを勤労者自身が確認する価値がある。",
            en: "Households: with short-hours work so often justified by household income (3.66 million people) or care compatibility (2.26 million), it is worth reviewing how household roles interact with the tax and social-insurance frames — the very frames that assign spousal treatment are ones workers can and should verify for themselves.",
          },
          {
            ja: "地域・コミュニティ：労働局・ハローワークは、正規の職員・従業員の仕事がない（173万人）という状況への公的窓口であり、またコール、寄附、外国人材の相談窓口など公的な相談機能は、精神障害労災の急増が示す困難の初期段階で使える資源である。地域の安全衛生団体・産業保健総合支援センターの講習・情報は無料で利用できる。",
            en: "Communities: labour bureaus and Hello Work are the public front line for the \'no regular job available\' situation (1.73 million); public consultation functions — labour consultation hotlines, the Anshin Corner for foreign workers — are resources that can be reached before hardship compounds, as the mental-health claim surge suggests. Regional safety-and-health organizations and occupational-health support centres offer free training and information.",
          },
          {
            ja: "事業主・管理職：勤務間インターバットの運用、休憩・休日の確保、時間外労働の上限管理（労働基準法・36協定の枠）は、死亡災害の減少が続く中で死傷増加を抑える方向の施策である。取得率改善は計画的付与制度（導入企業40.8%）との併用が統計上も観察される。教育訓練については、正社員以外の訓練機会（自己啓発17.6%）への投資が、格差の長期的な縮小と整合する。",
            en: "Employers and managers: within the legal frame of overtime caps and 36 agreements, managing intervals between shifts, rest breaks and holidays addresses the rise in injuries even as fatalities keep falling. Acquisition-rate improvement coincides statistically with planned granting (adopted by 40.8% of firms). On training, investing in non-regular staff's development (self-development engagement 17.6%) is consistent with long-run gap narrowing.",
          },
          {
            ja: "制度・研究者：本章が示した限界——非正規の1984–2001年の比較可能系列の喪失、調整済み賃金格差の不在、労災統計の2011/2012年断絶、過労死統計の年次の遡及不能——は、統計整備そのものが政策課題であることを示す。公開統計の長期系列の保存と、調査接続の設計は、将来の研究の前提となる。",
            en: "Institutions and researchers: the gaps this chapter documents — the lost comparable 1984–2001 non-regular series, the absence of adjusted wage gaps, the 2011/2012 accident-series break, the non-retroactive karoshi tabulations — show that statistical infrastructure is itself a policy object. Preserving long-run public series and designing survey continuity are preconditions for future research.",
          },
        ],
      },
      {
        type: "callout",
        kind: "action",
        title: {
          ja: "権利情報への導線",
          en: "Where to find authoritative labour-rights information",
        },
        text: {
          ja: "労働条件・時間外労働・休暇・解雇・ハラスメント等の相談は、都道府県労働局と労働基準監督署（総合労働相談コーナー）が公的な窓口です。精神障害の労災認定の基準は「心理的負荷による精神障害の認定基準」として厚労省が公表しています。本節は情報の導線であり、法的助言ではありません。個別の事案は公的窓口・専門家に確認してください。",
          en: "For consultation on working conditions, overtime, leave, dismissal and harassment, prefectural labour bureaus and labour standards inspection offices (their comprehensive consultation corners) are the official channels. The recognition criteria for work-related mental disorders are published by MHLW as the standard on psychological workload. This section is a pathway to information, not legal advice; verify individual cases with the official channels or specialists.",
        },
      },
    ],
  },
];
