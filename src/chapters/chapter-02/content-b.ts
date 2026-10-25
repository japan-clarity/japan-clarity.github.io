import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 02 — Economy & Industry. Research narrative, sections 6–10.
 *
 * Same rules as sections 1–5 (see content-a.ts): every figure traces to the
 * verified data module; interpretations are labeled; uncertainty is disclosed.
 */
export const chapter02SectionsB: ChapterSection[] = [
  {
    id: "industry",
    heading: {
      ja: "6. 産業構造の転換：何が縮み、何が広がったか",
      en: "6. Industrial transformation: what shrank and what expanded",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "内閣府の経済活動別国内総生産（名目）を第一次・第二次・第三次産業に集計すると（16経済活動分類からの集計・派生値）、30年間の構造変化が数値で見えます。第一次産業の構成比は1994年の1.8%から2024年の1.0%へ。第二次産業は34.8%から27.0%へ低下し、その中心の製造業は23.4%から19.0%へ縮小しました。第三次産業は63.4%から72.0%へ拡大しています。世界銀行WDIの製造業付加価値シェア（GDP比）でも1994年23.4%→2024年18.8%と同様の傾向が確認でき、独立した二つの系列が同じ方向を示しています。",
          en: "Aggregating the Cabinet Office's activity-side nominal GDP into primary, secondary and tertiary sectors (derived from the 16-activity classification) makes the thirty-year structural change legible. The primary sector's share fell from 1.8% (1994) to 1.0% (2024); the secondary sector from 34.8% to 27.0%, with manufacturing within it shrinking from 23.4% to 19.0%; the tertiary sector expanded from 63.4% to 72.0%. The World Bank's manufacturing value-added share of GDP shows the same slope (23.4% in 1994 → 18.8% in 2024), so two independent series point the same way.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-industry-va",
      },
      {
        type: "callout",
        kind: "observation",
        title: { ja: "観測：製造業は「縮小」というより「相対的な縮小」", en: "Observation: manufacturing shrank relatively, not absolutely" },
        text: {
          ja: "製造業の名目付加価値は1994年の122.0兆円に対して2024年は119.3兆円と、30年間でほぼ横ばいです。構成比が23.4%から19.0%へ下がったのは、製造業が縮んだというより、サービス部門の名目付加価値が伸びて分母が拡大したためです。同じ現象が雇用ではより強く働き、後述のとおり製造業就業者は約400万人減少しました。生産の自動化・海外移転と国内雇用のサービス化が同時に進んだことを示唆します。",
          en: "Manufacturing's nominal value added was ¥122.0T in 1994 and ¥119.3T in 2024 — roughly flat over thirty years. Its share fell from 23.4% to 19.0% mainly because the service sector's nominal value added grew the denominator, not because manufacturing collapsed. The same force worked more strongly on employment: manufacturing jobs fell by about four million, as discussed below — consistent with automation and offshoring of production advancing alongside the servicification of domestic employment.",
        },
      },
      {
        type: "p",
        text: {
          ja: "雇用側の変化はより大きいです。国民経済計算の経済活動別就業者数（SNAベース）では、製造業の就業者は1994年の1,410.9万人から2024年の1,010.1万人へと400.8万人減少しました。第一次産業（農林水産業）は485.7万人から217.9万人へ半減以下です。一方で就業者合計は6,698.3万人から6,928.4万人へ増え、第三次産業の構成比は60.4%から74.6%へと14.2ポイント上昇しました。より長い視野では、労働力調査の就業者数は1953年の3,913万人から2025年の6,828万人へと拡大し、その重心が農業から工業へ、さらにサービスへと移動してきました。",
          en: "The employment-side change is larger. In the national accounts' activity-side employment, manufacturing fell from 14.109M workers (1994) to 10.101M (2024) — a loss of 4.008M. Primary-sector (agriculture, forestry, fisheries) employment more than halved, from 4.857M to 2.179M. Over the same period total employment rose from 66.98M to 69.28M, and the tertiary share climbed 14.2 points, from 60.4% to 74.6%. On the longer Labour Force Survey view, total employment grew from 39.13M (1953) to 68.28M (2025), its center of gravity moving from agriculture to industry and on to services.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-employment-structure",
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "19.0%", en: "19.0%" },
            label: { ja: "製造業の付加価値構成比（2024年・名目）", en: "Manufacturing share of value added (2024, nominal)" },
            sourceId: "esri-na-2024",
          },
          {
            value: { ja: "1,010万人", en: "10.10M" },
            label: { ja: "製造業就業者（2024年・SNAベース）", en: "Manufacturing employment (2024, SNA basis)" },
            sourceId: "esri-na-2024",
          },
          {
            value: { ja: "74.6%", en: "74.6%" },
            label: { ja: "第三次産業の就業者構成比（2024年）", en: "Tertiary-sector employment share (2024)" },
            sourceId: "esri-na-2024",
          },
        ],
      },
      {
        type: "p",
        text: {
          ja: "対外的な側面を補うと、2024年の時点で財・サービスの輸出はGDPの21.98%、輸入は22.87%です（世界銀行WDI）。総資本形成はGDPの27.7%です。輸出入がほぼ均衡した構造は、エネルギー・食料などの輸入依存と、その裏側の輸出産業の競争力の両方を内包しています。貿易収支の詳しい構造（何を誰と取引しているか）は本章では検証しておらず、今後の調査課題として記録しておきます。",
          en: "On the external side, exports of goods and services were 21.98% of GDP in 2024 and imports 22.87% (World Bank WDI); gross capital formation was 27.7% of GDP. A roughly balanced trade structure embeds both import dependence (energy, food) and the export industries that offset it. The detailed composition of trade — what, with whom — is not verified in this chapter and is recorded as future work.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: { ja: "不確実性：産業分類の改定と集計の前提", en: "Uncertainty: classification revisions and aggregation assumptions" },
        text: {
          ja: "本章の3部門集計は、内閣府の16経済活動分類を第一次＝農林水産業、第二次＝鉱業＋製造業＋電気・ガス・水道・廃棄物処理＋建設業、第三次＝残り、として当サイトで集計した派生値です（公表の「経済活動計」との一致は検証済み）。分母は生産・輸入税を含まない産業計としています。日本標準産業分類は数年ごとに改定され、旧分類の系列とは厳密に接続しません。部門の帰属変更（例：一部の修理業や流通業務の製造業への帰属）が構成比を動かすこともあります。",
          en: "Our three-sector aggregation is derived on this site from the Cabinet Office's 16-activity classification (primary = agriculture/forestry/fisheries; secondary = mining + manufacturing + utilities + construction; tertiary = the rest), verified to reproduce the published activity totals. The denominator is total industry value added excluding taxes on production and imports. The Japan Standard Industrial Classification is revised periodically and older series do not link strictly; reclassification of activities (some repair and logistics operations, for example) can move the shares on its own.",
        },
      },
    ],
  },
  {
    id: "innovation",
    heading: {
      ja: "7. 研究開発：未来的な投資は増えている",
      en: "7. R&D: investment in the future has been rising",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "総務省の科学技術研究調査によると、2024年度の研究費は23兆7,925億円で、前年度比+7.9%と4年連続の増加です。GDPに対する比率は3.70%で、前年度比+0.14ポイントの上昇でした。系列が始まる2005年度（3.53%）以降、リーマン・ショック後の2009年度（3.64%）を挟んで2010年代前半は3.5%台で推移し、2016年度に3.31%で底打ち、その後緩やかに上昇して2023年度3.56%、2024年度3.70%に至っています。",
          en: "According to the Statistics Bureau's R&D survey, Japan's R&D expenditure reached ¥23.7925T in FY2024, up +7.9% year on year — the fourth consecutive increase — and equal to 3.70% of GDP, up +0.14 points. Since the start of our series (3.53% in FY2005), the ratio moved around 3.5% through the early 2010s (3.64% in the post-crisis FY2009), bottomed at 3.31% in FY2016, and then climbed gradually to 3.56% in FY2023 and 3.70% in FY2024.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-rd-gdp",
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "3.70%", en: "3.70%" },
            label: { ja: "研究費の対GDP比（2024年度）", en: "R&D as a share of GDP (FY2024)" },
            sourceId: "statb-rd-2025",
          },
          {
            value: { ja: "23兆7,925億円", en: "¥23.79T" },
            label: { ja: "研究費総額（2024年度）", en: "Total R&D expenditure (FY2024)" },
            sourceId: "statb-rd-2025",
          },
          {
            value: { ja: "+7.9%", en: "+7.9%" },
            label: { ja: "研究費の前年度比（2024年度・4年連続増加）", en: "R&D growth, year on year (FY2024; fourth consecutive rise)" },
            sourceId: "statb-rd-2025",
          },
        ],
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: { ja: "不確実性：2014年度→2015年度の系列の継ぎ目", en: "Uncertainty: the FY2014→FY2015 series splice" },
        text: {
          ja: "対GDP比の系列は2つの公表ウィンドウをつないでいます。2005–2014年度は2015年調査の概要表（分母＝平成26年度国民経済計算確報）、2015–2024年度は2025年調査の表1-2（分母＝2024年度年次推計）です。このため2014年度（3.87%）から2015年度（3.43%）への低下は、研究費自体の減少（189,713→189,391億円とほぼ横ばい）ではなく、主に分母のGDPヴィンテージが新しい基準に変わったことで生じた水準差です。比率のトレンドは各ウィンドウ内で読むのが正確です。",
          en: "The ratio series splices two published windows: FY2005–2014 from the 2015-round summary (denominator = the FY2014-final national accounts) and FY2015–2024 from the 2025-round table 1-2 (denominator = the 2024 annual estimates). The step down from FY2014 (3.87%) to FY2015 (3.43%) therefore reflects the change of GDP vintage in the denominator, not a collapse in R&D itself (¥18.9713T → ¥18.9391T, nearly flat). Read the trend within each window for accuracy.",
        },
      },
      {
        type: "p",
        text: {
          ja: "研究開発費は「将来の生産性や競争力への投入」であり、その成果（新製品・新工芸・生産性の向上）そのものではありません。特許出願数や論文数などの代理指標は、各国の制度・出願行動・分類の影響を強く受け、イノベーションの成果を完全には代理しないため、本章では数値として採用していません。研究主体別の内訳や国際比較（専従換算値を用いたOECD比較など）には前提依存が大きく、原典での検証を要するため、今後の調査課題とします。",
          en: "R&D spending is an input to future productivity and competitiveness — not the outcome itself. Proxy indicators such as patent counts and publication counts are strongly shaped by national institutions, filing behaviour and classification, and do not fully proxy innovation outcomes, so this chapter does not adopt them numerically. Breakdowns by performing sector and international comparisons (OECD comparisons rely on full-time-equivalent conversions) carry large assumption dependencies and remain future research items pending primary-source verification.",
        },
      },
    ],
  },
  {
    id: "explanations",
    heading: {
      ja: "8. 競合する説明：何が日本経済を形づくったか",
      en: "8. Competing explanations: what shaped Japan's economy",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "ここまでの観測——総GDPの低成長、物価水準の長期横ばい、実質賃金の低下、時間当たりGDPの水準の低さと伸びの鈍化、雇用のサービス化——を、単一の原因に帰着させることはできません。以下に主要な説明仮説を挙げ、それぞれの根拠の強さを区別して整理します。",
          en: "The observations so far — low total GDP growth, a long-flat price level, falling real wages, low and slowly-growing GDP per hour, and the servicification of employment — cannot be reduced to a single cause. The main candidate explanations follow, with the strength of their supporting evidence distinguished.",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "生産性の伸び悩み（根拠：強い）。OECDの実質系列で伸びが1990年以降に年平均+1.3%へ半減以下（1970–90年は+4.1%）したことは、総GDP・一人当たり所得・賃金のいずれの停滞とも整合します。ただし生産性そのものが「原因」なのか、資本投入・産業構成・規制環境などのより深い要因の「結果」なのかは、この観測だけでは決められません。",
            en: "The productivity slowdown (strong support). The OECD volume series shows growth halving-and-more after 1990 (about +1.3% a year versus +4.1% in 1970–90), consistent with stagnation in total GDP, per-capita income and wages. Whether productivity is itself the cause or an outcome of deeper forces — capital deepening, industry mix, the regulatory environment — cannot be settled by observation alone.",
          },
          {
            ja: "デフレと名目の硬直（根拠：強い）。GDPデフレーターが1994年112.4→2024年108.5（2020年=100）と約30年下向きであったことは観測済みです。名目賃金がほぼ横ばいのまま物価が下がる環境と、その後の物価上昇期に名目賃金の伸びが物価に追いつかなかったこと（2022–25年）は、実質賃金の2度の低下に対応します。",
            en: "Deflation and nominal rigidity (strong support). The GDP deflator drifted down for three decades (112.4 in 1994 to 108.5 in 2024, 2020=100) — an observed fact. Nominal wages staying nearly flat while prices fell, and then failing to keep pace when prices rose (2022–25), maps directly onto the two episodes of real-wage decline.",
          },
          {
            ja: "人口動態（根拠：中程度・間接）。労働投入の減少は総GDPの水準を直接的に押し下げ、一人当たり指標との逆転（第3節）を生みます。ただし人口そのものは時間差を伴って作用し、生産性への影響の経路（国内需要の縮小、市場の細分化、人手不足による投資促進など）には相反する予測があり、単純な割り算では評価できません。人口の詳細は第01章で扱います。",
            en: "Demographics (moderate, indirect). A shrinking labour input directly lowers the level of total GDP and produces the per-capita reversal in section 3. But demographics act with long lags, and the channels into productivity (shrinking domestic demand, fragmented markets, or investment forced by labour scarcity) push in different directions; it cannot be evaluated by simple arithmetic. Population itself is Chapter 01's subject.",
          },
          {
            ja: "労働市場の二重構造（根拠：中程度・本章では未検証）。非正規雇用の拡大が平均賃金の伸びを抑えたという説明は広く挙げられますが、本章が検証した統計（事業所ベースの賃金指数）では雇用形態の構成変化の影響を直接分解していません。每勤統計は一般労働者とパートタイム労働者を別系列で公表しており、将来の検証課題です。",
            en: "Labour-market dualism (moderate; not verified in this chapter). The explanation that the expansion of non-regular employment held down average wage growth is widely offered, but the establishment-based wage index verified here does not decompose employment-composition effects directly. The survey does publish separate series for full-time and part-time workers — a verification task for the future.",
          },
          {
            ja: "外部ショックと政策対応（根拠：観測されるが評価は複雑）。2008–09年（実質−1.2%／−5.9%）、2011年（−0.2%）、2020年（−4.3%）の低下と回復の軌跡はデータに現れています。ただし各ショックの「恒久的な影響」と「一時的な影響」を分離すること、金融・財政政策の反実仮想を評価することは、本章の方法では行えません。",
            en: "External shocks and policy responses (observed; evaluation is complex). The dips and recoveries of 2008–09 (real −1.2%/−5.9%), 2011 (−0.2%) and 2020 (−4.3%) are visible in the data. Separating their permanent from transitory effects, or evaluating the counterfactual for monetary and fiscal policy, is beyond this chapter's methods.",
          },
          {
            ja: "為替と輸入価格（根拠：名目換算に強く影響・実質への影響は間接）。米ドル建て名目GDPの落ち込み（2005年4.88兆ドル→2024年4.19兆ドル）には円安が大きく寄与しています。これは国際的な「規模」の見え方を変えますが、実質GDPや実質賃金とは別の経路です。",
            en: "Exchange rates and import prices (strong effect on nominal conversions; indirect on real outcomes). Yen depreciation contributes heavily to the fall in dollar-converted nominal GDP (USD 4.88T in 2005 → USD 4.19T in 2024). That changes how Japan's \"size\" appears internationally, but it operates on a different path from real GDP or real wages.",
          },
        ],
      },
      {
        type: "callout",
        kind: "note",
        title: { ja: "因果推論の限界", en: "The limits of causal inference" },
        text: {
          ja: "これらの仮説は相互に絡み合い、同一のデータから複数の説明が導けます（識別の問題）。時間差・交絡・期待の自己実現があり、厳密な意味での因果の確定は本章の範囲を超えます。したがって本章は「どの説明がどの観測と整合するか」の整理にとどめ、特定の政策や制度を優劣づけません。",
          en: "These hypotheses intertwine, and the same data admit multiple explanations (an identification problem). Lags, confounders and self-fulfilling expectations mean that strict causal attribution is beyond this chapter's scope. We therefore stop at mapping which explanations are consistent with which observations, and do not rank policies or institutions.",
        },
      },
      {
        type: "p",
        text: {
          ja: "今後の検証で優先すべきは、（1）雇用形態別の賃金系列の検証による二重構造仮説の評価、（2）産業別の時間当たり付加価値の国際比較（OECDの産業別生産性統計）による「構成効果」の分解、（3）貿易構造の原典検証です。いずれも本章では原典検証が済んでいないため、行動提案の根拠としては使用していません。",
          en: "Priorities for future verification: (1) testing the dualism hypothesis against the published full-time/part-time wage series; (2) decomposing the composition effect using OECD industry-level productivity statistics; (3) verifying trade structure from primary sources. None of these has completed primary-source verification here, so they are not used as grounds for the action guidance below.",
        },
      },
    ],
  },
  {
    id: "actions",
    heading: {
      ja: "9. 個人・地域・専門職・制度レベルの行動",
      en: "9. Actions for individuals, communities, professionals, and institutions",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "最後に、本章の観測と根拠に基づく現実的な行動を整理します。大前提として、個人の選択がGDPや生産性といった macro 構造を直接動かすことはありません。ここに挙げるのは、理解を深め、意思決定の質を高め、参加の選択肢を広げる自発的な行動です。費用・限界・リスクも併記します。",
          en: "Finally, realistic actions grounded in this chapter's observations. As a premise: no individual choice directly moves macro structures like GDP or productivity. What follows are voluntary actions that deepen understanding and improve decision quality, with costs, limits and risks stated alongside.",
        },
      },
      {
        type: "h3",
        id: "action-individual",
        text: { ja: "個人：経済統計を読めるようになる", en: "Individuals: learning to read economic statistics" },
      },
      {
        type: "ul",
        items: [
          {
            ja: "誰に向くか：給与・物価・年金など経済的な判断をするすべての人。何ができるか：政府統計ポータル（e-Stat）や総務省統計局で、自分に関係する指標（CPI、実質賃金、賃金構造基本統計調査）の一次情報に触れる。費用は無料・数十分。根拠：一次統計の多くが無料公開されており、二次報道の数字と定義がしばしば異なるため（本章の「暦年と年度」「名目と実質」参照）。限界：統計の定義や改定の背景を知る必要がある。リスクはほぼなし。",
            en: "Who it suits: anyone making economic decisions about pay, prices or pensions. What to do: consult primary sources on the government statistics portal (e-Stat) and the Statistics Bureau — the CPI, real-wage indices, the Basic Survey on Wage Structure — rather than second-hand headlines. Cost: free, tens of minutes. Evidence: most primary statistics are published free, and second-hand numbers often differ in definition (see this chapter's calendar-vs-fiscal and nominal-vs-real distinctions). Limits: requires learning definitions and revision practices. Risk: negligible. Start at https://www.e-stat.go.jp/ and https://www.stat.go.jp/data/cpi/",
          },
          {
            ja: "誰に向くか：就労世代。何ができるか：厚生労働省の毎月勤労統計の公表（速報・確報）を定期的に確認し、実質賃金の動きを物価の動きと並べて読む習慣を作る。費用は無料。根拠：実質賃金の前年比は月次で公表されており（2026年1–8月は8か月連続でプラス）、賃金交渉や転職の判断の背景情報になる。限界：月次値は改訂され、指数水準には構造的な継ぎ目がある（本章第4節）。リスク：単月の動きへの過剰反応。",
            en: "Who it suits: working-age adults. What to do: follow the MHLW Monthly Labour Survey releases (preliminary and final) and read real-earnings movements alongside prices. Cost: free. Evidence: real-earnings YoY is published monthly (positive for eight consecutive months, Jan–Aug 2026), background useful in pay bargaining or job decisions. Limits: monthly figures get revised, and index levels carry structural splices (section 4). Risk: over-reacting to single months. Start at https://www.mhlw.go.jp/toukei/list/30-1.html",
          },
          {
            ja: "誰に向くか：貯蓄・投資に関心のある人。何ができるか：為替レート換算とPPPの違い、名目と実質の違いを金融情報の読み分けに使う。費用は無料。限界とリスク：本章は投資助言ではありません。個別の金融商品の選択は、各自の状況とリスク許容度に依存します。",
            en: "Who it suits: people interested in saving and investing. What to do: apply the exchange-rate-versus-PPP and nominal-versus-real distinctions when reading financial news. Cost: free. Limits and risks: this chapter is not investment advice; product choices depend on individual circumstances and risk tolerance.",
          },
        ],
      },
      {
        type: "h3",
        id: "action-community",
        text: { ja: "地域：地域経済の実態を知り、参加する", en: "Communities: knowing and participating in the local economy" },
      },
      {
        type: "ul",
        items: [
          {
            ja: "誰に向くか：地域の商工業者・自治体職員・住民。何ができるか：e-Statの地域統計（県・市区町村の経済センサス、労働力調査の地域系列）で、自分の地域の産業構成・就業構造を確認する。費用は無料。根拠：本章で見た全国の構造変化（第三次産業化・製造業雇用の減少）は地域によって強さが大きく異なり、全国値のみでは地域の実態は分からない。限界：市区町村レベルの統計は集計単位が粗い場合がある。リスクは低い。",
            en: "Who it suits: local businesses, municipal staff, residents. What to do: use e-Stat regional statistics (economic census, regional labour-force series) to check your own area's industry and employment structure. Cost: free. Evidence: the national structural change documented here (servicification, manufacturing job losses) varies greatly by region, and national figures alone do not describe local reality. Limits: municipal-level aggregates can be coarse. Risk: low. Start at https://www.e-stat.go.jp/regional-statistics",
          },
          {
            ja: "誰に向くか：中小規模の事業者・従業者。何ができるか：中小企業庁の公表情報で経営環境・生産性向上の制度支援（融資・補助金・経営改善の公的窓口）を確認する。費用は情報収集のみ無料（制度利用は要件による）。限界：支援制度は要件・時期で変わるため、最新の公式情報で確認する。リスク：民間の仲介業者を介した高額な有料相談に留意し、まず公的窓口を確認する。",
            en: "Who it suits: small and medium-sized businesses and their employees. What to do: check the SME Agency's official information on institutional support for productivity and management improvement (finance, subsidies, public consultation). Cost: information is free; program use depends on eligibility. Limits: programs change with requirements and timing — verify against the latest official notices. Risk: beware paid intermediaries; check public channels first. Start at https://www.chusho.meti.go.jp/",
          },
        ],
      },
      {
        type: "h3",
        id: "action-professional",
        text: { ja: "専門職：データの取り扱いと職場の実践", en: "Professionals: handling data and workplace practice" },
      },
      {
        type: "ul",
        items: [
          {
            ja: "誰に向くか：経営・人事・企画・報道・教育に携わる人。何ができるか：統計の引用に出典・基準・単位・公表時点を添える（本章が出典ごとに基準を書き分けているのはこのため）。費用はほぼゼロ。根拠：同じ指標でも基準改定で水準が変わる（毎勤のベンチマーク更新の例）。限界：一次資料の確認には時間がかかる。リスクはほぼなし。",
            en: "Who it suits: people in management, HR, planning, journalism, education. What to do: attach source, base, unit and vintage when citing statistics (this chapter labels bases for every source precisely for that reason). Cost: near zero. Evidence: the same indicator changes level across rebasings (the MLS benchmark update is a worked example). Limits: checking primary sources takes time. Risk: negligible.",
          },
          {
            ja: "誰に向くか：職場の管理・実務担当者。何ができるか：時間当たり付加価値という「生産性」の意味を、長時間労働の是正（労働時間の記録と見える化）や業務プロセスの改善と併せて職場で検討する。費用：記録・見直しの運用コスト。根拠：時間当たりGDPの定義そのものが「労働投入で割る」であり、時間の把握は改善の出発点になる。限界：生産性の macro 格差は職場努力で直接埋まるものではない（第5節）。リスク：短期的な数値目標だけを追うと品質・勤務間バランスを損なう可能性。",
            en: "Who it suits: workplace managers and practitioners. What to do: pair the meaning of \"productivity\" (value added per hour) with concrete practices — recording and visualising working hours, reviewing processes. Cost: the operational cost of tracking and review. Evidence: GDP-per-hour is defined by dividing by labour input, so measuring hours is the natural starting point. Limits: macro productivity gaps are not closable by workplace effort alone (section 5). Risk: chasing short-term numeric targets can damage quality and work-life balance.",
          },
        ],
      },
      {
        type: "h3",
        id: "action-institution",
        text: { ja: "制度・公共参加：透明性と統計基盤", en: "Institutions and public participation: transparency and the statistics infrastructure" },
      },
      {
        type: "ul",
        items: [
          {
            ja: "誰に向くか：関心のある市民・研究者・事業者。何ができるか：内閣府の国民経済計算や各統計の公表計画・改定情報を確認し、パブリックコメント等の公式の手続きを通じて意見を出す。費用は無料。根拠：統計の品質（回答率・ベンチマーク更新の扱い・遡及改訂の方針）は制度設計に依存し、本章が明示したような継ぎ目の開示は利用側の理解に不可欠。限界：手続きの効果は不確定。リスクは低い。",
            en: "Who it suits: interested citizens, researchers, businesses. What to do: follow release plans and revision notices for the national accounts and other statistics, and submit views through official channels such as public comment procedures. Cost: free. Evidence: statistical quality (response rates, benchmark-update treatment, revision policy) depends on institutional design, and disclosure of the splices documented in this chapter is essential for users' understanding. Limits: the effect of any single submission is uncertain. Risk: low.",
          },
          {
            ja: "誰に向くか：データを扱う組織・開発者。何ができるか：OECD・世界銀行・e-StatのオープンデータAPIを活用し、出典と取得日を記録した上で再利用する。費用は無料。根拠：本章のOECD・WDIの取得手順（クエリURLと取得日の記録）は再現可能な利用の実例。限界：PPP・改訂の扱いには前提知識が要る。リスク：ライセンス表記の欠落（WDIはCC BY 4.0で帰属表示が必須）。",
            en: "Who it suits: data-handling organisations and developers. What to do: reuse OECD, World Bank and e-Stat open-data APIs, recording sources and retrieval dates. Cost: free. Evidence: this chapter's OECD/WDI acquisition procedure (query URLs and retrieval dates recorded) is a reproducible worked example. Limits: PPP and revision practices require background knowledge. Risk: missing attribution (WDI is CC BY 4.0 — attribution required).",
          },
        ],
      },
      {
        type: "callout",
        kind: "action",
        title: { ja: "行動の前に：期待の大きさを正当化しない", en: "Before acting: keep expectations honest" },
        text: {
          ja: "統計リテラシーの向上や職場の改善は価値がありますが、それらがGDP成長率や生産性の国際格差を個人の力で解決するという主張は、本章のいずれの観測からも支持されません。構造的な課題への対応は、集合的な・制度的なプロセスを通じるものです。ここに挙げた行動は、理解・参加・透明性を広げる範囲でのみ、根拠を持っています。",
          en: "Better statistical literacy and workplace improvements have value, but no observation in this chapter supports the claim that individual actions by themselves resolve GDP growth or international productivity gaps. Structural issues are addressed through collective, institutional processes. The actions listed here are evidenced only insofar as they broaden understanding, participation and transparency.",
        },
      },
    ],
  },
];
