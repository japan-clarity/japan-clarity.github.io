import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 02 — Economy & Industry. Research narrative, sections 1–5.
 *
 * Every figure in this text is drawn from the verified data module
 * (src/chapters/chapter-02/data.ts, generated from archived official
 * documents — see research/chapter02/notes/). Nothing is estimated by the
 * authors; derived percentages are computed from verified series and are
 * identified as such. Interpretive statements are confined to callouts
 * labeled interpretation, and uncertainty to callouts labeled uncertainty.
 */
export const chapter02SectionsA: ChapterSection[] = [
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
          ja: "この章は、日本経済の構造と動きを「健診」のように調べます。まず測定可能な状態を観測し（観測）、原典で数値を検証し（検証）、手法が整合する国々と比較し（比較）、考えられる説明を検討し（調査）、対応の方向と不確実性を評価し（評価）、現実的な行動を整理します（行動）。経済が「良い」か「悪い」かの結論を最初に置くことはしません。",
          en: "This chapter examines Japan's economic structure the way a careful medical examination works: observe measurable conditions, verify the figures against original sources, compare with methodologically compatible economies, weigh possible explanations, evaluate directions and their uncertainty, and outline realistic actions. It does not begin with a conclusion that the economy is \"good\" or \"bad\".",
        },
      },
      {
        type: "p",
        text: {
          ja: "取り上げるのは、経済の規模と成長（GDP）、一人当たりの水準、賃金の名目と実質、労働生産性、産業構造の変化、研究開発投資です。使用する統計は、内閣府・経済社会総合研究所の国民経済計算年次推計（2025年12月23日公表の2024年度分）、厚生労働省の毎月勤労統計調査（2026年2月25日公表の2025年分確報と2026年10月23日公表の8月分確報）、総務省統計局の労働力調査・科学技術研究調査、そして国際比較にはOECD生産性統計と世界銀行WDIです。いずれも2026年10月25日に原典から取得し、数値をアーカイブした資料内で直接確認しています。",
          en: "We cover the scale and growth of the economy (GDP), per-capita living standards, nominal and real wages, labour productivity, industrial structural change, and R&D investment. Sources: the Cabinet Office/ESRI national accounts (2024 annual estimates, published 2025-12-23), the MHLW Monthly Labour Survey (2025 annual finals published 2026-02-25 and the August 2026 finals published 2026-10-23), the Statistics Bureau's Labour Force Survey and R&D survey, and — for international comparison — OECD Productivity Statistics and the World Bank WDI. All were fetched from the original domains on 2026-10-25, and every cited figure was read inside the archived documents.",
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
          ja: "同じ「経済」でも、暦年（1–12月）と年度（4–3月）、名目（当時の価格）と実質（基準年の価格）、為替換算と購買力平価（PPP）では、数値の意味も対象も異なります。賃金指数は基準改定や標本入替え・ベンチマーク更新をまたぐと水準が直接比較できません。本章では各図表に出典・基準・単位を明記し、派生して計算した値（連結指数・構成比など）はその旨を表示して混同を避けます。",
          en: "Even the word \"economy\" hides different products: calendar year (Jan–Dec) versus fiscal year (Apr–Mar); nominal (current prices) versus real (base-year prices); exchange-rate conversion versus purchasing power parity (PPP). Wage indices cannot be compared level-to-level across rebasings, sample rotations and benchmark updates. Every figure here carries its source, base and unit; values computed on this site (chained indices, aggregated shares) are labeled as derived.",
        },
      },
    ],
  },
  {
    id: "output",
    heading: {
      ja: "2. 経済の規模と成長：何がどれだけ動いたか",
      en: "2. The scale and growth of the economy: what moved, and by how much",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "内閣府の国民経済計算年次推計（2020年基準・暦年）によると、名目GDPは1994年の521.7兆円から2024年の634.2兆円へと30年間で21.5%増えました。しかし実質GDP（2020年価格）で見ると、464.3兆円から584.5兆円への25.9%増にとどまり、年平均にすると+0.8%前後のペースです。2008–09年の世界同時不況（2009年は実質−5.9%）、2011年（−0.2%）、2020年の新型コロナ禍（−4.3%）で大きく後退し、そのたびに持ち直す、という繰り返しの30年間でした。直近の2023年は+0.7%、2024年は−0.2%と、成長は再び足踏みしています。",
          en: "According to the Cabinet Office's national accounts (2020 base, calendar years), nominal GDP grew 21.5% over thirty years, from ¥521.7T in 1994 to ¥634.2T in 2024. In real terms (2020 prices) the gain is 25.9%, from ¥464.3T to ¥584.5T — roughly +0.8% a year on average. The period repeated a pattern of sharp setbacks and recoveries: the global financial crisis (real GDP −5.9% in 2009), 2011 (−0.2%), and the pandemic (−4.3% in 2020). Most recently growth was +0.7% in 2023 and −0.2% in 2024 — stalling again.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-gdp-levels",
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "634.2兆円", en: "¥634.2T" },
            label: { ja: "名目GDP（2024暦年・支出側）", en: "Nominal GDP (CY2024, expenditure side)" },
            sourceId: "esri-na-2024",
          },
          {
            value: { ja: "3.8%", en: "3.8%" },
            label: { ja: "日本の名目GDPの世界シェア（2024年・2005年は10.2%）", en: "Japan's share of world nominal GDP (2024; 10.2% in 2005)" },
            sourceId: "esri-na-2024-ref",
          },
          {
            value: { ja: "第24位／33,785ドル", en: "24th / USD 33,785" },
            label: { ja: "OECD加盟国中の一人当たり名目GDPの順位（2024年・市場為替換算）", en: "Per-capita nominal GDP rank among OECD members (2024, market exchange rates)" },
            sourceId: "esri-na-2024-ref",
          },
        ],
      },
      {
        type: "chart",
        chartId: "ch02-gdp-growth",
      },
      {
        type: "callout",
        kind: "observation",
        title: { ja: "観測：価格水準が約30年前より低い", en: "Observation: the price level is below its level of ~30 years ago" },
        text: {
          ja: "名目GDPと実質GDPの比率であるGDPデフレーター（2020暦年=100）は、1994年の112.4から2024年の108.5へと低下しました。これは、経済全体の財・サービスの価格水準が1994年より約3.5%低いことを意味します。多くの先進国が2%前後のインフレを続ける中で、日本の物価水準が約30年間ほぼ横ばいだったことの直接的な記録です。名目GDPの伸びが実質GDPの伸びを下回る年が長く続いた背景の一つです。",
          en: "The GDP deflator (2020=100) fell from 112.4 in 1994 to 108.5 in 2024 — the economy-wide price level is about 3.5% BELOW its 1994 level. While most advanced economies sustained around 2% inflation, Japan's price level stayed roughly flat for three decades. This is one direct reason nominal GDP growth lagged real GDP growth for so long.",
        },
      },
      {
        type: "p",
        text: {
          ja: "名目GDPを米ドルに換算すると、2005年の4兆8,784億ドルから2024年には4兆1,869億ドルへと縮小し、世界に占める比率は10.2%から3.8%へと低下しました（内閣府参考表）。低下の理由は二つあります。一つは円安（市場為替レートの低下）であり、もう一つは名目成長の低迷です。米ドル建ての水準は為替の影響を強く受けるため、これは「モノ・サービスの生産能力が4分の1になった」ことを意味しません。実質GDPはこの間も増えています。",
          en: "Converted to US dollars at market exchange rates, nominal GDP shrank from USD 4.878T in 2005 to USD 4.187T in 2024, and Japan's share of world GDP fell from 10.2% to 3.8% (Cabinet Office reference table). Two forces drove this: yen depreciation and sluggish nominal growth. Dollar-converted levels are highly sensitive to exchange rates, so this does not mean production capacity fell by a quarter — real GDP kept growing over the same period.",
        },
      },
      {
        type: "callout",
        kind: "comparison",
        title: { ja: "国際比較の前に：換算方法の確認", en: "Before comparing: check the conversion" },
        text: {
          ja: "内閣府の国際比較表（市場為替換算）では、2024年の一人当たり名目GDPは33,785ドルでOECD加盟国中第24位です。一方、価格構造の違いを調整した購買力平価（PPP）では、一人当たりGDPは2025年に55,422国際ドルです（世界銀行WDI）。為替レートは金融取引の価格であり生活費の水準を反映しないため、暮らし向きの比較にはPPPが用いられます。両者は「同じ指標の別の値」ではなく「別の問いへの答え」です。",
          en: "In the Cabinet Office's comparison (market exchange rates), per-capita nominal GDP was USD 33,785 in 2024 — 24th among OECD members. Adjusted for price structures (PPP), per-capita GDP was 55,422 international $ in 2025 (World Bank WDI). Exchange rates price financial transactions, not living costs, so PPP is the appropriate lens for living standards. The two figures answer different questions rather than disagreeing.",
        },
      },
    ],
  },
  {
    id: "living-standards",
    heading: {
      ja: "3. 一人当たりで見る：GDPの規模と暮らしは別物",
      en: "3. Per capita: the size of GDP and household living standards are different things",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "GDPの総額がほぼ横ばいでも、人口が減れば一人当たりの水準は改善しうります。世界銀行WDIの購買力平価（PPP・現在国際ドル）で見ると、日本の一人当たりGDPは1990年の20,331国際ドルから2012年の37,974国際ドル、2020年の43,560国際ドルを経て、2025年には55,422国際ドルへと約2.7倍になりました。2012年からの13年間で約46%の増加です。総GDPが低迷した時期にも、一人当たりの水準は緩やかに向上し続けてきたことが分かります。",
          en: "Even with total GDP nearly flat, a shrinking population means per-capita levels can still improve. In PPP terms (current international $, World Bank WDI), Japan's GDP per capita roughly doubled-and-a-half from 20,331 int$ (1990) to 37,974 (2012), 43,560 (2020) and 55,422 int$ (2025) — about 2.7×, including a 46% rise in the thirteen years since 2012. Even while total GDP stagnated, per-capita levels kept improving slowly.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-percapita-trend",
      },
      {
        type: "p",
        text: {
          ja: "同じ2025年で13の国・地域と比べると、日本の55,422国際ドルは比較対象の中で最も低くなっています。米国は90,027、オランダは87,320、ドイツは75,407国際ドルです。近いのはニュージーランド（57,350）で、韓国（63,125）・イタリア（62,803）も日本を上回りました。シンガポール（163,354国際ドル）は都市国家としての構造を反映した外れ値であり、参考値として注記付きで示しています。台湾はWDIの対象外のため比較に含まれていません。",
          en: "Compared across 13 economies in the same year (2025), Japan's 55,422 int$ is the lowest of the set. The United States stands at 90,027, the Netherlands at 87,320 and Germany at 75,407 int$. Japan's nearest neighbor is New Zealand (57,350); South Korea (63,125) and Italy (62,803) are also above Japan. Singapore (163,354 int$) is an outlier reflecting a city-state structure and is shown as a noted reference value. Taiwan is outside WDI coverage and is not included.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-percapita-compare",
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "55,422国際ドル", en: "55,422 int$" },
            label: { ja: "一人当たりGDP（PPP・2025年・WDI）", en: "GDP per capita (PPP, 2025, WDI)" },
            sourceId: "wb-wdi-2026-10",
          },
          {
            value: { ja: "329.7兆円", en: "¥329.7T" },
            label: { ja: "家計部門の純可処分所得（2024暦年・国民経済計算）", en: "Household sector net disposable income (CY2024, national accounts)" },
            sourceId: "esri-na-2024",
          },
          {
            value: { ja: "6,828万人", en: "68.28M" },
            label: { ja: "就業者数（2025年平均・労働力調査）", en: "Employed persons (2025 average, Labour Force Survey)" },
            sourceId: "statb-lfs-2026",
          },
        ],
      },
      {
        type: "p",
        text: {
          ja: "家計部門の所得も同様に緩やかに増えています。国民経済計算の家計（個人企業を含む）の純可処分所得は、1994年の297.2兆円から2024年の329.7兆円へと名目で+10.9%増加しました。GDPデフレーターで実質化すると約+15%であり、年平均では+0.5%弱です。総GDPの実質成長（年平均+0.8%）と同程度かやや低いペースです。賃金の停滞（次節）と家計所得の緩やかな増加が併存している点は、高齢化に伴う給付や世帯構造の変化など、賃金以外の経路の影響を示唆しますが、その分解は本章の確証範囲を超えます。",
          en: "Household incomes show a similarly gradual rise. Net disposable income of the household sector (including individual proprietorships, national accounts) grew +10.9% in nominal terms from ¥297.2T (1994) to ¥329.7T (2024) — about +15% in real terms once deflated by the GDP deflator, or slightly under +0.5% a year, similar to or a little below real GDP growth (+0.8% a year on average). The coexistence of stagnant wages (next section) and slowly rising household income points to channels beyond wages — transfers related to aging, household composition change — but decomposing them is beyond what this chapter can verify.",
        },
      },
      {
        type: "callout",
        kind: "interpretation",
        title: { ja: "解釈：総量と一人当たりの逆転", en: "Interpretation: the total-versus-per-capita reversal" },
        text: {
          ja: "「GDPが成長しない日本」と「一人当たりでは緩やかに豊かになる日本」は同じ観測の両面です。人口減少（第01章参照）が進む中で、総額の停滞は一部「分母の減少」の裏返しです。ただし一人当たり水準の向上がそのまま個々の世帯の満足や幸福を意味するわけではありません。所得・資産の分布（第07章で扱います）、住宅費（第03章）、労働条件（第04章）が暮らしを形づくるためです。ここでは「何が測れ、何が測れていないか」を区別して次に進みます。",
          en: "\"Japan without GDP growth\" and \"Japan becoming slowly richer per person\" are two faces of the same observation: with the population shrinking (see Chapter 01), part of the stagnation of the total is the shrinking denominator. But rising per-capita output is not the same as every household feeling better off — distributions of income and wealth (Chapter 07), housing costs (Chapter 03) and working conditions (Chapter 04) shape daily life. We keep explicit what is measured and what is not, and move on.",
        },
      },
    ],
  },
  {
    id: "wages",
    heading: {
      ja: "4. 賃金：約30年の名目横ばいと実質賃金の低下",
      en: "4. Wages: three decades of flat nominal pay and falling real wages",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "厚生労働省の毎月勤労統計調査（事業所規模5人以上・調査産業計・現金給与総額）で賃金の動きを見ます。公表された前年比を2020年平均=100に連結した系列では、名目賃金指数は1997年の108.2に対して2025年は108.9と、約30年間ほぼ横ばいです。一方、消費者物価指数（持家の帰属家賃を除く総合）で実質化した実質賃金指数は、1997年の117.5を最高値に2025年には95.6まで下がり、約19%の減少です。2008–09年と2013–15年に一段下がり、2022–23年は物価上昇によってさらに低下しました。",
          en: "Wage movements come from the MHLW Monthly Labour Survey (establishments with 5+ employees, all survey industries, total cash earnings). In the series chained to 2020=100 from published year-on-year rates, the nominal wage index was 108.2 in 1997 and 108.9 in 2025 — essentially flat for about thirty years. The real wage index (deflated by the CPI excluding imputed rent) peaked at 117.5 in 1997 and fell to 95.6 by 2025, a decline of roughly 19%, stepping down in 2008–09 and 2013–15 and falling further with the 2022–23 inflation.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-wages",
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "95.6", en: "95.6" },
            label: { ja: "実質賃金指数（2025年・2020年平均=100・連結系列）", en: "Real wage index (2025, 2020 avg = 100, chained)" },
            sourceId: "mhlw-mls-2025-final",
          },
          {
            value: { ja: "+1.6%", en: "+1.6%" },
            label: { ja: "実質賃金の前年同月比（2026年8月・確報）", en: "Real earnings, year on year (Aug 2026, final)" },
            sourceId: "mhlw-mls-2026-08",
          },
          {
            value: { ja: "+2.3%", en: "+2.3%" },
            label: { ja: "名目賃金（現金給与総額）の前年比（2025年・確報）", en: "Nominal earnings, year on year (2025, final)" },
            sourceId: "mhlw-mls-2025-final",
          },
        ],
      },
      {
        type: "p",
        text: {
          ja: "直近の動きは二段階です。2024年は名目+2.8%に対して実質−0.3%、2025年は名目+2.3%に対して実質−1.3%と、賃上げが物価上昇に追いつきませんでした。しかし2026年に入ると、1月から8月まで8か月連続で実質賃金の前年同月比がプラス（1月+0.7%、6月+2.2%、8月+1.6%）に転じています。2026年8月の名目賃金は前年同月比+3.9%でした。この持ち直しが定着するかは、今後の物価と賃金の両方に依存する未確定の事柄です。",
          en: "The recent record has two phases. In 2024, nominal pay rose +2.8% while real pay fell −0.3%; in 2025, +2.3% nominal and −1.3% real — pay rises not keeping up with prices. In 2026, however, real earnings have been positive for eight consecutive months, January through August (+0.7% in Jan, +2.2% in Jun, +1.6% in Aug), with nominal earnings up +3.9% year on year in August. Whether this recovery becomes durable is an open question that depends on both prices and pay.",
        },
      },
      {
        type: "callout",
        kind: "observation",
        title: { ja: "観測：国際比較で見る賃金の回復差", en: "Observation: the wage recovery gap in comparison" },
        text: {
          ja: "毎月勤労統計の国際比較表（各国公表値の引用）では、実質賃金の前年比は2023年に日本−2.0%に対しアメリカ+0.5%、イギリス0.0%、ドイツ+0.2%。2024年は日本0.0%に対しアメリカ+1.0%、イギリス+0.6%、ドイツ+2.0%。2025年は日本−0.8%に対しアメリカ+1.2%、イギリス+1.2%、ドイツ+0.9%でした。インフレ期の実質賃金の落ち込みと回復の幅は国により異なり、日本は2025年時点で再び低下していたことが分かります（2026年の持ち直しは上記のとおり）。",
          en: "The survey's international comparison table (quoting each country's published figures) shows real-earnings year-on-year in 2023 of −2.0% in Japan versus +0.5% in the United States, 0.0% in the United Kingdom and +0.2% in Germany; in 2024, 0.0% in Japan versus +1.0%, +0.6% and +2.0%; and in 2025, −0.8% in Japan versus +1.2%, +1.2% and +0.9%. The depth of the real-wage squeeze and its recovery differed by country, and Japan had slipped back into decline in 2025 (the 2026 recovery is noted above).",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: { ja: "不確実性：賃金指数の「水準」は読み方に注意", en: "Uncertainty: read wage-index levels with care" },
        text: {
          ja: "毎月勤労統計の指数水準は、基準改定（5年ごと）、標本の入替え（2018年から毎年1月に部分入替え）、労働者数のベンチマーク更新をまたぐと直接比較できません。2024年1月分確報から2021年経済センサス基準に更新された際、公表指数の水準は約2.6%上方に修正される一方、公表の前年比はベンチマーク更新の影響を除いて算出されるため、指数から計算した増減率とは一致しなくなりました（厚生労働省「利用上の注意」第9）。本章の連結指数は公表前年比に基づくため、2024–25年の水準は公表指数（109.2／111.7）より約2.6%低くなっています。2026年8月分確報時点の回答率は67.3%（22,241／33,045事業所）であり、回答率の変化自体も統計の質に影響します。",
          en: "Index levels from the Monthly Labour Survey cannot be compared directly across five-yearly rebasings, the annual sample rotation (since January 2018) and worker-count benchmark updates. When the January 2024 final updated the worker benchmark to the 2021 Economic Census, published index levels shifted up by about 2.6%, while the published year-on-year rates deliberately strip out the benchmark effect — so they no longer match growth computed from the raw index (MHLW usage note 9). Our chained series follows the published growth rates, so its 2024–25 levels sit about 2.6% below the published indices (109.2 / 111.7). Note also that the response rate at the August 2026 final was 67.3% (22,241 of 33,045 establishments); changes in response rates themselves affect statistical quality.",
        },
      },
      {
        type: "p",
        text: {
          ja: "この調査が対象とするのは事業所規模5人以上の常用労働者（パートタイムを含む）であり、事業主本人や公務員の大部分は含まれません。また現金給与には賞与も含まれます。実質賃金の長期低下と、前節で見た家計所得の緩やかな増加との差は、こうした調査の枠の外にある所得（公的給付、資産所得、世帯構造の変化）で一部説明されますが、分布を含む詳細な分解は第07章の課題です。",
          en: "The survey covers regular employees (including part-timers) at establishments with 5+ employees; proprietors themselves and most civil servants are outside its frame, and cash earnings include bonuses. The gap between the long decline in real wages and the slow rise of household incomes in the previous section is partly explained by income outside this survey's frame (public transfers, asset income, household composition change); a fuller decomposition including distribution is Chapter 07's task.",
        },
      },
    ],
  },
  {
    id: "productivity",
    heading: {
      ja: "5. 労働生産性：時間当たりGDPで見る",
      en: "5. Labour productivity: GDP per hour worked",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "労働生産性の代表的な指標は「時間当たりGDP」です。OECD生産性統計（PPP換算・現在価格）で2025年を比べると、日本は61.8米ドル/時間で、比較した12か国中最も低くなっています。上位はオランダ105.5、米国104.7、ドイツ102.7ドル/時間で、日本の約1.7倍です。フランス96.1、スウェーデン100.8の中位グループとも約1.5倍以上の差があり、カナダ76.8・イタリア80.4・英国85.6・オーストラリア86.9とも2〜3割の差があります。注目すべきは、韓国（62.5ドル/時間）が日本を上回ったことです。",
          en: "The headline measure of labour productivity is GDP per hour worked. In OECD Productivity Statistics (PPP-converted, current prices) for 2025, Japan stands at USD 61.8 per hour — the lowest of the twelve economies compared. The leaders — the Netherlands (105.5), the United States (104.7) and Germany (102.7) — are about 1.7× Japan's level. The mid group (France 96.1, Sweden 100.8) is at least 1.5× higher, and Canada (76.8), Italy (80.4), the UK (85.6) and Australia (86.9) are 20–30% higher. Notably, South Korea (USD 62.5/hour) has moved above Japan.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-productivity-compare",
      },
      {
        type: "p",
        text: {
          ja: "日本自身の趨勢を見ると、伸びのパターンが明確に変わっています。OECDの実質系列（連鎖・2020年=100）では、時間当たりGDPは1970年の14.9から1990年の33.5へと年平均+3.8%で上昇しました。しかし1990年から2025年（53.0）までの年平均の伸びは約+1.3%に縮み、さらに2010年（46.3）から2025年までは年平均+0.9%です。2020年（50.5）の一時低下の後は回復していますが、水準の差が短期間に埋まる速度ではありません。",
          en: "Japan's own trend shows a clear break. In the OECD's volume series (chain-linked, 2020=100), GDP per hour worked rose from 14.9 in 1970 to 33.5 in 1990 — about +3.8% a year. From 1990 to 2025 (53.0) the average slowed to roughly +1.3% a year, and from 2010 (46.3) to 2025 to about +0.9% a year. After the pandemic dip in 2020 (50.5) the series has recovered, but not at a pace that would close level gaps quickly.",
        },
      },
      {
        type: "chart",
        chartId: "ch02-productivity-japan",
      },
      {
        type: "callout",
        kind: "interpretation",
        title: { ja: "解釈：生産性が測っているもの・測っていないもの", en: "Interpretation: what productivity does and does not measure" },
        text: {
          ja: "時間当たりGDPは、労働投入1時間あたりの付加価値という macro（全体）指標です。そこには資本設備の充実度、産業構成（資本集約的な製造業と対人サービス業の比率）、労働時間の長短、規模の経済などがすべて混在します。したがって国際比較の差は「働く個人の努力や能力」の差ではありません。また非営利部門や帰属家家賃の扱いなど、測定上の前提も結果に影響します。生産性が低い部門に雇用が多く残る「構成効果」は、日本のサービス業比重の高まり（次節）と組み合わせて解釈する必要があります。",
          en: "GDP per hour worked is a macro indicator: value added per hour of labour input. It blends capital intensity, industry mix (capital-intensive manufacturing versus person-to-person services), hours worked and economies of scale. Differences between countries are therefore NOT differences in individual workers' effort or ability. Measurement assumptions — non-profit sectors, imputed rents — also shape the result. The composition effect (a larger share of employment remaining in lower-productivity services) must be read together with the servicification of the economy in the next section.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: { ja: "不確実性：PPPとOECD編集の前提", en: "Uncertainty: PPP and OECD compilation assumptions" },
        text: {
          ja: "国際比較の水準はPPP（購買力平価）換算です。PPPは価格構造の違いを推計で調整するものであり、確定値ではありません。またOECDの数値は各国統計をOECDが編集したものであり、国内公表値とは基準・改訂方針が異なります。現在価格の水準は時間軸比較に使えず、趨勢には実質系列を使います。両系列とも年次更新で遡及改訂されるため、順位や差の大きさは改訂で変わり得ます。",
          en: "The comparison levels are PPP-converted. PPP adjusts for price-structure differences by estimation, not measurement, and is not a fixed value. The OECD figures are OECD compilations of national statistics, with benchmarks and revision policies that differ from each country's own publications. Current-price levels cannot be compared over time — trends use the volume series. Both series are retrospectively revised in annual updates, so rankings and gap sizes can change.",
        },
      },
    ],
  },
];
