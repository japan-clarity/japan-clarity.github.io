import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 03 — Housing & Cost of Living. Research narrative, sections 1–5.
 *
 * Every figure in this text is drawn from the verified data module
 * (src/chapters/chapter-03/data.ts, generated from archived official
 * documents — see research/chapter03/notes/). Nothing is estimated by the
 * authors; the one derived series family (housing-cost burden shares) is
 * computed from published FIES amounts and identified as derived.
 * Interpretive statements are confined to callouts labeled interpretation,
 * and uncertainty to callouts labeled uncertainty.
 */
export const chapter03SectionsA: ChapterSection[] = [
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
          ja: "この章は、日本の住宅と生活費を「健診」のように調べます。まず測定可能な状態を観測し（観測）、原典で数値を検証し（検証）、手法が整合する国々と比較し（比較）、考えられる説明を検討し（調査）、対応の方向と不確実性を評価し（評価）、現実的な行動を整理します（行動）。住宅が「高い」か「安い」か、空き家が「多い」か「少ない」かの結論を最初に置くことはしません。",
          en: "This chapter examines Japan's housing and living costs the way a careful medical examination works: observe measurable conditions, verify the figures against original sources, compare with methodologically compatible economies, weigh possible explanations, evaluate directions and their uncertainty, and outline realistic actions. It does not begin with a conclusion that housing is \"expensive\" or \"cheap\", or that vacancies are \"too many\".",
        },
      },
      {
        type: "p",
        text: {
          ja: "取り上げるのは、住宅ストックと所有の構造、住宅価格と所得の相対関係、持ち家と賃貸の負担の非対称、地域差、空き家の規模と内訳、家計の支出構造と物価です。使用する統計は、総務省統計局の住宅・土地統計調査（2023年10月1日調査・確報2024年9月25日公表）と家計調査（2025年分・2026年2月6日公表）、消費者物価指数（2025年基準の長期時系列）、国土交通省の住宅着工統計と地価公示、そして国際比較にはOECD分析的住宅価格統計です。いずれも2026年10月26日に原典から取得し、数値をアーカイブした資料内で直接確認しています。",
          en: "We cover the structure of the housing stock and tenure, the relative position of house prices and incomes, the asymmetry of burdens between owners and renters, regional differences, the scale and composition of vacant housing, and the structure of household spending and prices. Sources: the Statistics Bureau's Housing and Land Survey (survey date 2023-10-01, final results published 2024-09-25) and Family Income and Expenditure Survey (2025, published 2026-02-06), the Consumer Price Index (2025-base long time series), MLIT's housing-starts statistics and published land prices, and — for international comparison — the OECD Analytical House Price Statistics. All were fetched from the original domains on 2026-10-26, and every cited figure was read inside the archived documents.",
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
          ja: "住宅統計には分母の異なる率が並存します。空き家率の分母は総住宅数、持ち家住宅率の分母は居住世帯のある住宅（1978年以降は所有関係「不詳」を含む）です。家計調査の「持家率」87.3%（二人以上・2025年）は調査世帯の構成に基づく値で、住宅単位で数える住宅・土地統計調査の持ち家住宅率60.9%とは定義が異なります。消費者物価指数は2026年に2020年基準から2025年基準へ移行し、同一の2025年平均が旧基準で111.9・新基準で100.0という異なる水準で公表されました（増減率は一致）。OECDの住宅価格所得比は2015年=100の指数であって、価格水準でも倍率でもありません。本章では各図表に出典・基準・単位を明記します。",
          en: "Housing statistics carry rates with different denominators. The vacancy rate divides by total dwellings; the homeownership rate divides by occupied dwellings (including tenure \"unknown\" since 1978). The FIES \"owned-house\" rate of 87.3% (2+ households, 2025) reflects its household survey frame — a different definition from the dwelling-based 60.9% of the Housing and Land Survey. The CPI switched from the 2020 to the 2025 base during 2026, so the same 2025 annual average appears as 111.9 (old base) and 100.0 (new base) — levels differ, rates of change agree. The OECD price-to-income ratio is a 2015=100 index, not a price level or a multiple. Every figure here carries its source, base and unit.",
        },
      },
    ],
  },
  {
    id: "structure",
    heading: {
      ja: "2. 住宅システムの構造：ストックと所有",
      en: "2. The structure of the housing system: stock and tenure",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "2023年10月1日現在、日本の総住宅数は6,504.7万戸で、2018年比4.2%増と過去最多を更新しました。一方、総世帯数は5,621.5万世帯です。人口は減少局面に入っても世帯数はまだ増えており、しかも住宅は世帯より速く増えたため、1世帯当たり住宅数は1.16戸となり、ストック全体に約900万戸の空き家を含む構造が生まれています。",
          en: "As of 1 October 2023, Japan's total dwelling stock stood at 65.05 million — up 4.2% from 2018 and a record high — against 56.22 million households. Even with the population shrinking, households were still growing; and because dwellings grew faster still, there are now 1.16 dwellings per household, with about 9 million vacancies embedded in the stock.",
        },
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "6,504.7万戸", en: "65.05 million" },
            label: { ja: "総住宅数（2023年・過去最多）", en: "Total dwellings (2023, record high)" },
            sourceId: "statb-jyutaku-2023-kihon",
          },
          {
            value: { ja: "5,621.5万世帯", en: "56.22 million" },
            label: { ja: "総世帯数（2018年比+4.1%）", en: "Total households (+4.1% vs 2018)" },
            sourceId: "statb-jyutaku-2023-kihon",
          },
          {
            value: { ja: "1.16戸", en: "1.16" },
            label: { ja: "1世帯当たり住宅数", en: "Dwellings per household" },
            sourceId: "statb-jyutaku-2023-kihon",
          },
        ],
      },
      { type: "chart", chartId: "ch03-stock" },
      {
        type: "p",
        text: {
          ja: "歴史を遡ると、1948年の総住宅数は1,390.7万戸（建築中を含まず）、1958年は1,793.4万戸（いずれも沖縄県を含まない）でした。1953年は市部のみの集計のため712.7万戸と数値が落ちる点に注意が必要です。高度経済成長期以降の建設積み上げが現在のストックの厚みを作っています。フローでみると、新設住宅着工戸数は1973年の190.5万戸を頂点に、2025年には74.1万戸まで減少（3年連続の減少）しており、ストックの増加ペースは今後緩やかになります。",
          en: "Looking back, the stock numbered 13.91 million dwellings in 1948 (excluding units under construction) and 17.93 million in 1958 (both excluding pre-reversion Okinawa); the 1953 figure of 7.13 million covers city areas only and is not comparable. The post-war build-up created today's thick stock. On the flow side, annual housing starts peaked at 1.905 million in 1973 and fell to 0.741 million by 2025 — a third consecutive decline — so the stock's growth will continue to slow.",
        },
      },
      {
        type: "p",
        text: {
          ja: "所有の構造では、持ち家住宅率は1963年の64.3%を境に緩やかに低下し、2023年は60.9%となりました。内訳をみると、低下を補ったのは民間借家（24.1%→28.2%）です。会社・官公庁の宿舎である給与住宅は7.0%から2.3%へと大幅に縮小し、雇用慣行の変化が住宅にも及んだことが分かります。公営住宅は4.6%から3.2%へ、UR・公社借家は1.3%（2023年）と、公的セクターの比重は一貫して小さいままです。",
          en: "By tenure, the homeownership rate has drifted down from its 1963 peak of 64.3% to 60.9% in 2023. The offset came from private rentals (24.1% → 28.2%). Company and government staff housing collapsed from 7.0% to 2.3% — a housing echo of changing employment customs. Public rentals eased from 4.6% to 3.2%, with UR/agency rentals at just 1.3% in 2023: the public sector's share has stayed consistently small.",
        },
      },
      { type: "chart", chartId: "ch03-tenure-share" },
      {
        type: "callout",
        kind: "observation",
        title: {
          ja: "観測：ストックは増え、フローは縮む",
          en: "Observation: the stock grows while the flow shrinks",
        },
        text: {
          ja: "住宅着工戸数は1973年の190.5万戸（統計開始以来最高）から2025年の74.1万戸へと約6割減少しました。2025年の内訳は持家20.1万戸・貸家32.5万戸・分譲20.8万戸です。一方で総住宅数は5年ごとに増え続けており、空き家は2018年から2023年にかけて51.3万戸増加しました。建設が縮小しても世帯形成がさらに緩やかであれば、空き家率の上昇圧力は続きます。",
          en: "Housing starts have fallen about 60% from the 1973 series peak of 1.905 million to 0.741 million in 2025 (0.20 million owner-built, 0.32 million built for rent, 0.21 million for sale). Yet the total stock keeps growing every five years, and vacancies rose by 513 thousand between 2018 and 2023 alone. As long as household formation grows even more slowly than a shrinking construction sector, upward pressure on the vacancy rate persists.",
        },
      },
    ],
  },
  {
    id: "costs-income",
    heading: {
      ja: "3. 住宅の価格と家計の所得",
      en: "3. Housing prices and household income",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "「住宅の入手可能性」を単一の指標で測ることはできません。住宅取得価格、住宅ローンの金利と返済期間、世帯所得、頭金、税負担が組み合わさって、各世帯の負担は決まります。日本では住宅取得世帯の価格・所得・返済額を調査する「家計の住宅・土地に関する調査」が2026年10月時点でオンライン公開されておらず、本章はOECDの住宅価格所得比（住宅価格を所得で割った相対指標の指数化・2015年=100）と地価公示を利用します。価格所得比が100を超えても直ちに「買えない」を意味しない点は、国際比較の節で改めて整理します。",
          en: "No single indicator measures \"affordability\". Purchase prices, mortgage rates and terms, household income, down payments and taxes combine into each household's burden. Japan's dedicated survey of housing acquisition finances (家計の住宅・土地に関する調査) is not published online as of October 2026, so this chapter uses the OECD price-to-income ratio (an index of house prices relative to income, 2015=100) together with published land prices. That the ratio exceeds 100 does not by itself mean housing is unaffordable — the international section returns to this.",
        },
      },
      { type: "chart", chartId: "ch03-oecd-pti-japan" },
      {
        type: "p",
        text: {
          ja: "日本の住宅価格所得比は、1973年に213.1と半世紀で最高となり、その後2000年代まで長い低下を続けました。リーマン・ショック後の2009年には96.0まで下落し、その後は低位で推移しながら2015年以降緩やかに回復して、2025年は114.6です。実質住宅価格指数は1991年の165.8を頂点に、2010年代には100前後まで調整した後、2025年は118.0へと上昇しています。つまり現在の水準は、バブル期の高値からは依然として大きく下であり、2015年比では中程度の上昇です。",
          en: "Japan's price-to-income ratio peaked at 213.1 in 1973 and ground lower for three decades, bottoming at 96.0 in 2009 and staying near that low through the mid-2010s before recovering to 114.6 in 2025. The real house price index peaked at 165.8 in 1991, reset to around 100 through the 2010s, and has risen to 118.0 in 2025. Today's levels therefore remain far below the bubble-era highs, with a moderate rise relative to 2015.",
        },
      },
      {
        type: "stats",
        items: [
          {
            value: { ja: "14.47万円/㎡", en: "¥144,700/m²" },
            label: { ja: "住宅地平均価格・全国（2026年公示、前年比+5.5%）", en: "Residential average price, national (2026, +5.5% YoY)" },
            sourceId: "mlit-kojichika-2026",
          },
          {
            value: { ja: "56.51万円/㎡", en: "¥565,100/m²" },
            label: { ja: "住宅地平均価格・東京都（前年比+9.7%）", en: "Residential average price, Tokyo (+9.7% YoY)" },
            sourceId: "mlit-kojichika-2026",
          },
          {
            value: { ja: "114.6", en: "114.6" },
            label: { ja: "住宅価格所得比（2025年・2015年=100）", en: "Price-to-income ratio (2025, 2015=100)" },
            sourceId: "oecd-ahpi",
          },
        ],
      },
      {
        type: "p",
        text: {
          ja: "地価公示でみると、全国の住宅地平均価格は2025年の13.71万円/㎡から2026年の14.47万円/㎡へ5.5%上昇し、東京都は51.53万円から56.51万円へ9.7%上昇しました。東京都の住宅地は全国平均の約3.9倍です。同じ国土の中でこれだけの価格差があるため、「日本全体の住宅価格」と一口に語ることには限界があります。なお平均価格は標準地の単純平均であり、実際の取引価格の中央値とは分布が異なります。",
          en: "Published land prices show the national residential average rising 5.5% from ¥137,100/m² (2025) to ¥144,700/m² (2026), with Tokyo up 9.7% from ¥515,300 to ¥565,100 — about 3.9× the national average. With price dispersion this large inside one country, \"Japan's house price\" is a limited concept. Note also that the average is a simple mean over standard appraisal parcels, not a transaction median.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "不確実性：所得側の測定と比較可能性",
          en: "Uncertainty: measuring the income side",
        },
        text: {
          ja: "参考として、家計調査の勤労者世帯（二人以上のうち）では2025年の実収入が月平均653,901円、可処分所得が532,408円です。ただし住宅価格所得比の「所得」はOECDが各国の国民経済計算に基づいて編集したもの区分であり、家計調査の世帯所得と直接は一致しません。また同一の価格所得比でも、固定金利期間の長さ、頭金慣行、賃貸市場の厚みが国によって異なるため、返済負担への意味は同じではありません。日本についてこれらを分解した検証は本章では行っていません。",
          en: "For reference, worker households (within 2+ households) earned ¥653,901 in average monthly income and ¥532,408 in disposable income in 2025 (FIES). The income concept inside the OECD ratio, however, is an OECD compilation from national accounts and does not match survey household income. And an identical ratio implies different repayment burdens across countries depending on fixed-rate availability, down-payment customs and rental-market depth. This chapter does not attempt that decomposition for Japan.",
        },
      },
    ],
  },
  {
    id: "ownership-renting",
    heading: {
      ja: "4. 持ち家と賃貸：負担の非対称",
      en: "4. Owners and renters: an asymmetric burden",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "家計調査の住居の所有関係別表は、持ち家世帯と賃貸世帯の支出構造の違いを直接示します。2025年、二人以上の世帯の消費支出は全体で月314,001円ですが、持ち家世帯では312,688円、民営借家世帯では324,825円と大きな差はありません。しかし住居費は持ち家12,419円に対し民営借家67,997円と約5.5倍（うち家賃地代は441円対67,107円）で、消費支出に占める割合は4.0%対20.9%と約5倍の開きがあります。",
          en: "The FIES tenure table shows the owners-versus-renters structure directly. In 2025, average monthly consumption expenditure differed little — ¥312,688 for owner-occupiers versus ¥324,825 for private renters (all 2+ households: ¥314,001). Housing costs, however, differ by roughly 5.5×: ¥12,419 for owners against ¥67,997 for private renters (rent itself: ¥441 versus ¥67,107), making the housing share of spending 4.0% versus 20.9%.",
        },
      },
      { type: "chart", chartId: "ch03-rent-burden" },
      {
        type: "p",
        text: {
          ja: "単身世帯では傾向がより強く出ます。単身全体の消費支出は月173,042円で住居費は21,667円（構成比12.5%・公表値）。持ち家の単身世帯は住居費6,846円（4.2%）なのに対し、民営借家の単身世帯は50,467円（26.4%）と、消費支出の4分の1超を住居に充てています。家賃地代だけで49,831円です。単身・二人以上を問わず、賃貸で暮らすことの家計への集中負担が数量として確認できます。",
          en: "The pattern intensifies for one-person households. Solo households overall spend ¥173,042 per month with housing at ¥21,667 (a published 12.5% share). Solo owner-occupiers pay ¥6,846 in housing costs (4.2%), while solo private renters pay ¥50,467 — 26.4%, more than a quarter of all spending, of which ¥49,831 is rent. Whether solo or multi-person, renting concentrates a heavy, measurable burden on household budgets.",
        },
      },
      {
        type: "callout",
        kind: "interpretation",
        title: {
          ja: "解釈：平均の裏にある属性差",
          en: "Interpretation: composition behind the averages",
        },
        text: {
          ja: "家計調査の世帯主の平均年齢は、二人以上の全体で60.7歳、民営借家世帯では49.6歳です。賃貸世帯は平均より若い層に多く、所得のライフステージも異なるため、上記の負担率の差は「同じ所得で賃貸が高い」という意味だけではありません。持ち家世帯には住宅ローン返済中の世帯も含まれますが、返済は消費支出ではなく非消費支出に計上されるため、この表の「住居費」には現れません。ローン返済を含めた総負担の比較には、住宅金融の個別データが必要で、本章では検証していません。",
          en: "In the FIES, the average household head is 60.7 years old overall but 49.6 among private renters — renting skews younger, so income life-stages differ, and the burden gap is not solely \"rent costs more at the same income\". Owner households still repaying mortgages are included too, but mortgage payments are recorded as non-consumption expenditure and never appear in the \"housing costs\" above. A total-burden comparison including repayments would require housing-finance microdata, which this chapter has not verified.",
        },
      },
      {
        type: "p",
        text: {
          ja: "賃料の水準だけでなく、その時間的な動きも特徴的です。消費者物価指数の家賃（帰属家賃込み）の前年比は2023年+0.1%、2024年+0.2%、2025年+0.3%と、同期間の総合（+3.2%、+2.7%、+3.2%）や食料（+8.1%、+4.3%、+6.8%）と比べて極めて緩やかです。民営家賃でも2025年は+0.5%です。賃貸世帯の負担が重い一方で、物価上昇期に賃料自体の上昇は抑制されていることが、日本のインフレ期の際立った特徴です。",
          en: "It is not only the level of rents but their movement that stands out. CPI rent (including imputed rent) rose just +0.1% in 2023, +0.2% in 2024 and +0.3% in 2025 — against headline inflation of +3.2%, +2.7% and +3.2%, and food at +8.1%, +4.3% and +6.8%. Even private-market rents rose only +0.5% in 2025. Renters carry a heavy burden, yet rent inflation itself has stayed remarkably contained through this inflationary period — a distinctive feature of Japan's current episode.",
        },
      },
    ],
  },
  {
    id: "regional",
    heading: {
      ja: "5. 地域差：空き家と生活費の両方で",
      en: "5. Regional differences: vacancies and living costs",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "空き家率の地域差は大きいです。2023年の確報値で最も高いのは徳島県21.3%、和歌山県21.2%、鹿児島県20.5%、山梨県20.4%、高知県20.3%、長野県20.1%と、四国・紀伊半島・南九州・山岳観光地の県が並びます。最も低いのは埼玉県9.3%、沖縄県9.4%、神奈川県9.8%、東京都10.9%で、人口が流入し続ける大都市圏では住宅がよく回転していることを示します。全国平均は13.8%です。",
          en: "Regional dispersion in vacancy rates is wide. The 2023 finals are led by Tokushima at 21.3%, Wakayama 21.2%, Kagoshima 20.5%, Yamanashi 20.4%, Kochi 20.3% and Nagano 20.1% — Shikoku, the Kii Peninsula, southern Kyushu and mountain prefectures. The lowest are Saitama 9.3%, Okinawa 9.4%, Kanagawa 9.8% and Tokyo 10.9%, where sustained in-migration keeps housing in use. The national average is 13.8%.",
        },
      },
      { type: "chart", chartId: "ch03-pref-vacancy" },
      {
        type: "p",
        text: {
          ja: "生活費の地域差も同様に実在します。2025年の二人以上の世帯の月平均消費支出は、関東で337,946円と最も高く、沖縄では235,742円と最も低く、差は約1.4倍です。住居費の構成比は大都市7.0%・中都市5.7%・町村4.4%と都市階級で異なり、沖縄では9.3%と住宅所有構造の違いが表れます。同じ「生活費」でも、都市階級別・地方別集計はそれぞれ異なる標本枠に基づくため、東京都の空き家率と沖縄の住居構成比を直接組み合わせて因果を語ることはできません。",
          en: "Living costs differ regionally as well. In 2025, monthly consumption expenditure of 2+ households was highest in Kanto at ¥337,946 and lowest in Okinawa at ¥235,742 — a 1.4× gap. Housing shares vary by city class (7.0% in major cities, 5.7% mid-size, 4.4% towns and villages) and reach 9.3% in Okinawa, reflecting a different ownership structure. These tabulations rest on different survey frames, so combining Tokyo's vacancy rate with Okinawa's housing share into a causal claim is not legitimate.",
        },
      },
      {
        type: "callout",
        kind: "comparison",
        title: {
          ja: "比較：首都圏への価格の集中",
          en: "Comparison: price concentration in the capital region",
        },
        text: {
          ja: "地価公示2026では、住宅地の平均価格は全国で14.47万円/㎡（前年比+5.5%）、東京都で56.51万円/㎡（同+9.7%）でした。価格の上昇は全国でも起きていますが、その速度と水準は東京に強く偏っています。一方、空き家率の高い県は価格上昇が相対的に小さい地方県と重なる傾向があり、「価格が上がる地域」と「空き家が増える地域」が分化しています。ただし地価公示は標準地ベース、空き家率は総住宅数ベースであり、同じ市場を別の角度から測った指標です。",
          en: "In the 2026 published land prices, residential averages rose nationally to ¥144,700/m² (+5.5%) and in Tokyo to ¥565,100/m² (+9.7%). Rising prices are national, but the speed and level concentrate in Tokyo — while high-vacancy prefectures overlap with regional markets where price growth is comparatively weak. Housing is bifurcating into regions where prices rise and regions where vacancies accumulate. The two indicators, however, measure different slices: appraisal parcels versus the whole dwelling stock.",
        },
      },
    ],
  },
];
