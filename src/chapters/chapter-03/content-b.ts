import type { ChapterSection } from "@/chapters/types";

/**
 * Chapter 03 — Housing & Cost of Living. Research narrative, sections 6–10.
 *
 * Same conventions as content-a.ts: every figure traces to the verified
 * data module; interpretive statements stay in interpretation callouts and
 * uncertainty in uncertainty callouts.
 */
export const chapter03SectionsB: ChapterSection[] = [
  {
    id: "vacancy",
    heading: {
      ja: "6. 空き家：900万戸の中身",
      en: "6. Vacant homes: inside the 9 million",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "空き家率は1963年の2.5%から1990年代に入ると急上昇し、2008年に13.1%で過去最高となってからも毎回の調査で更新を続け、2023年は13.8%となりました。空き家数では900.2万戸。これは総住宅数の約7分の1にあたり、総世帯数の16%に相当する規模です。",
          en: "The vacancy rate was 2.5% in 1963, surged through the 1990s, and has set a new record with every round since first reaching 13.1% in 2008 — 13.8% in 2023, or 9.00 million vacant dwellings. That is roughly one in seven of all dwellings, a stock equivalent to about 16% of all households.",
        },
      },
      { type: "chart", chartId: "ch03-vacancy-rate" },
      {
        type: "p",
        text: {
          ja: "重要なのは内訳です。2023年の空き家900.2万戸のうち、賃貸用の空き家は443.6万戸と最多（空き家の49.3%）で、入居者を募集中か即入居可能な住宅もここに含まれます。売却用は32.6万戸、別荘などの二次的住宅は38.4万戸。そして「賃貸・売却用及び二次的住宅を除く空き家」が385.6万戸（42.8%）あり、2018年から36.9万戸増えました。この分類には市場に出ていない空き家が含まれ、老朽化が進んだ住宅の相当部分がここにあるとみられますが、状態の分布は統計からは分かりません。",
          en: "The composition matters most. Of the 9.00 million vacancies in 2023, dwellings vacant for rent lead at 4.44 million (49.3%) — including units on the market or immediately available. For-sale units number 0.33 million and second dwellings 0.38 million. The remainder — \"vacant excluding for rent, for sale and as second dwellings\" — stands at 3.86 million (42.8%), up 369 thousand from 2018. This category holds homes not offered to the market; a substantial share is likely to be deteriorating stock, but the statistics do not reveal its condition.",
        },
      },
      { type: "chart", chartId: "ch03-vacancy-types" },
      {
        type: "callout",
        kind: "interpretation",
        title: {
          ja: "解釈：空き家＝使える住宅、ではない",
          en: "Interpretation: vacancies are not automatically usable homes",
        },
        text: {
          ja: "「空き家900万戸があるのだから住宅不足は解決できるはずだ」という議論には、統計上の限界が3つあります。第一に、約5割は賃貸用で、既に市場にある住宅です。第二に、残る約4割の立地・状態・権利関係はこの統計では分かりません。空き家が発生している地域（地方・郊外）と世帯が増えている地域（大都市圏中心部）は必ずしも重なりません。第三に、二次的住宅は意図的に空けてある資産です。空き家の活用は、立地・規模・状態と世帯動態の組合せの問題であり、総数だけで語れるものではありません。",
          en: "The argument that \"9 million vacancies should solve any housing shortage\" runs into three statistical limits. First, about half are for rent — already on the market. Second, the location, condition and title situation of the remaining ~40% is invisible in these statistics; vacancies arise in regional and suburban areas while households grow in central metropolitan ones. Third, second dwellings are deliberately held empty. Making use of vacancies is a problem of location, size, condition and household dynamics — not of totals alone.",
        },
      },
      {
        type: "p",
        text: {
          ja: "統計の取り扱い上の注意として、2023年の調査で空き家の類型名称が整理されました。2013年・2018年の「その他の住宅」は、2023年には「賃貸・売却用及び二次的住宅を除く空き家」と表記されます（概念は同一）。また1978〜1998年の「賃貸用」には「売却用」が含まれるため、類型間の長期比較は2003年以降で厳密に行う必要があります。本章の類型図は、分類が整った2013・2018・2023年の3時点に限っています。",
          en: "A handling note: the 2023 round renamed the vacancy categories — the 2013/2018 \"other dwellings\" appear as \"vacant excluding for rent, for sale and second dwellings\" (identical concept). Between 1978 and 1998 the \"for rent\" category also included \"for sale\", so strict type-level comparisons date from 2003 onward. This chapter's type chart therefore covers only 2013, 2018 and 2023, where the classification is settled.",
        },
      },
    ],
  },
  {
    id: "expenditure",
    heading: {
      ja: "7. 生活費の構造と物価",
      en: "7. Living costs: expenditure structure and prices",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "家計調査で2025年の二人以上の世帯の消費支出は月平均314,001円でした。名目では前年比+4.6%と大きく伸びていますが、物価変動（+3.7%）を除いた実質では+0.9%です。名目の支出額は2000年の317,328円にほぼ並び、約四半世紀ぶりの水準回復です。ただしその間に支出の中身は変わっており、2020年の277,926円への落ち込みからの回復過程でもあります。",
          en: "The FIES puts 2025 monthly consumption expenditure of 2+ households at ¥314,001. Nominal growth of +4.6% is large, but only +0.9% survives in real terms after +3.7% inflation. The nominal level has returned almost exactly to the 2000 figure of ¥317,328 — a quarter-century round trip — while the composition along the way has shifted, including the pandemic-era trough of ¥277,926 in 2020.",
        },
      },
      { type: "chart", chartId: "ch03-fies-expenditure" },
      {
        type: "p",
        text: {
          ja: "2025年の支出構成では、食料が28.6%と最大です。これはエンゲル係数として過去30年で最も高い水準です。交通・通信14.5%、教養娯楽9.8%が続きます。住居は5.9%と小さく見えますが、これは持ち家世帯（家計調査の二人以上では87.3%）が家賃をほとんど支払っていないための統計上の性質であり、賃貸世帯の実際の負担（前節の20.9%・26.4%）とは別物です。帰属家賃を含まないため、国際比較の住居費構成比とも直接は比べられません。",
          en: "By category in 2025, food leads at 28.6% — an Engel coefficient at its highest in three decades — followed by transport & communication (14.5%) and culture & recreation (9.8%). Housing looks small at 5.9%, but that is the statistical artifact of owner-occupiers (87.3% of the FIES's 2+ households) paying almost no rent, not the renters' actual burden (20.9% and 26.4% in the previous section). With no imputed rent included, this share is also not directly comparable with international housing-cost shares.",
        },
      },
      { type: "chart", chartId: "ch03-fies-structure" },
      {
        type: "p",
        text: {
          ja: "物価の長期図景は3つの局面に分かれます。1970年代のインフレ（総合指数は1970年の27.6から1980年の65.4へ）、1990年代後半から2010年代のデフレと停滞（2010年の84.7は1990年代半ばの水準を下回る）、そして2022年以降の再インフレ（2025年=100）です。2025年の総合前年比は+3.2%、2026年9月時点でも+2.1%と、日本は約30年ぶりの持続的な物価上昇局面にあります。",
          en: "The long price record divides into three regimes: 1970s inflation (the all-items index moves from 27.6 in 1970 to 65.4 in 1980), the deflationary drift of the late 1990s through the 2010s (84.7 in 2010, below the mid-1990s level), and renewed inflation from 2022 (2025 = 100). Headline CPI rose +3.2% in 2025 and was still running +2.1% in September 2026 — Japan's first sustained inflationary period in roughly three decades.",
        },
      },
      { type: "chart", chartId: "ch03-cpi-long" },
      {
        type: "p",
        text: {
          ja: "直近の物価上昇は品目間で極めて不均一です。2022年以降、エネルギーは2022年に+17.1%と急騰し、食料は2023年+8.1%、2025年+6.8%と総合を大きく上回り続けています。一方で家賃は前節のとおり+0.1%、+0.2%、+0.3%とほぼ静止しています。光熱・水道（2025年+3.6%）は総合と同程度です。暮らしのコスト上昇は食とエネルギーに集中し、住宅費の中の賃料は上昇から取り残されている — これが2020年代前半の日本の生活費の非対称な構図です。",
          en: "The recent inflation is strikingly uneven across categories. Energy spiked +17.1% in 2022; food exceeded headline inflation continuously (+8.1% in 2023, +6.8% in 2025). Rent, as in the previous section, has been nearly static at +0.1%, +0.2% and +0.3%, while utilities (+3.6% in 2025) track the headline. The cost of living has risen fastest in food and energy while rents lag the upswing — the asymmetric shape of Japan's early-2020s living costs.",
        },
      },
      { type: "chart", chartId: "ch03-cpi-groups" },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "注記：CPIの基準改定",
          en: "Note: the CPI base revision",
        },
        text: {
          ja: "消費者物価指数は2026年に2020年基準から2025年基準へ移行しました。2025年暦年平均は旧基準では111.9として公表され（2026年1月23日）、新基準の長期時系列（2026年8月7日公開）では2025年=100.0です。指数の水準は基準により異なりますが、増減率は両基準で一致します（2025年は+3.2%）。本章の長期推移図は新基準の接続指数、直近の月次値（2026年9月総合102.2・前年同月比+2.1%）は2025年基準です。",
          en: "The CPI moved from the 2020 base to the 2025 base during 2026. The 2025 calendar-year average was published on the old base as 111.9 (2026-01-23) and equals 100.0 on the new base's long-run series (published 2026-08-07). Levels differ by base; rates of change agree (+3.2% for 2025). This chapter's long-run chart uses the new-base chained series, and the latest monthly figure (September 2026: 102.2, +2.1% YoY) is on the 2025 base.",
        },
      },
    ],
  },
  {
    id: "quality",
    heading: {
      ja: "8. 住宅の質と居住水準",
      en: "8. Housing quality and living standards",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "居住水準を量的にみる最も長い系列は延べ面積です。1住宅当たり平均は1968年の73.86㎡から拡大を続け、2013年に94.42㎡でピークに達した後、2023年は91.66㎡と緩やかに縮小に転じています。人口減少期に入り、一人当たりの空間は広くなったものの、平均的な新規建設の面積が小さめに振れている可能性を示唆する変化です。",
          en: "The longest quantitative lens on living space is floor area. Average area per dwelling expanded from 73.86 m² in 1968 to a 2013 peak of 94.42 m², and has eased to 91.66 m² in 2023 — space per person widened in the depopulating era, while average newly built units now appear to be trending smaller.",
        },
      },
      { type: "chart", chartId: "ch03-floor-area" },
      {
        type: "p",
        text: {
          ja: "所有形態別の差は大きいです。2023年で持ち家の平均118.25㎡に対し借家は45.39㎡と、約2.6倍の開きがあります。借家の面積は1998年の44.49㎡からほぼ横ばいで、賃貸住宅のコンパクトさは構造的に続いています。居住面積の国際比較には住居の定義差（台所・浴室・壁厚の扱い）があるため、本章では行っていません。",
          en: "The tenure gap is wide: owned dwellings average 118.25 m² against 45.39 m² for rentals in 2023 — about 2.6×. Rental area has been essentially flat since 1998 (44.49 m²), a structural compactness; International floor-area comparisons founder on definitional differences (kitchens, bathrooms, wall thickness), so this chapter does not attempt them.",
        },
      },
      {
        type: "p",
        text: {
          ja: "ストックの年代構成も公表されています。居住世帯のある住宅5,566.5万戸（2023年）のうち、1970年以前に着工された住宅は385.6万戸（2つの公表帯域の合計）、1971〜1980年着工は718.6万戸、最多の帯域は1991〜2000年着工の1,047.1万戸です。建築の時期「不詳」が361.7万戸あり、総数との差として公表資料の脚注に明示されています。",
          en: "The stock's age profile is published too. Of 55.67 million occupied dwellings (2023), those built up to 1970 total 3.86 million (sum of the two published bands), 1971–1980 construction adds 7.19 million, and the largest cohort is 1991–2000 at 10.47 million. A further 3.62 million have unknown construction period — disclosed as the footnote residual against the published total.",
        },
      },
      {
        type: "callout",
        kind: "uncertainty",
        title: {
          ja: "不確実性：耐震基準の境界は集計帯域をまたぐ",
          en: "Uncertainty: the seismic-code boundary straddles the bands",
        },
        text: {
          ja: "建築の時期の公表区分は「〜1970年」「1971〜1980年」であり、1981年の新耐震基準の適用境界はこの帯域の途中にあります。そのため「旧耐震基準の住宅数」はこの統計からは直接読み取れず、本章は推計しません。築年と住宅の状態はイコールではありません — 増改築・耐震改修済みの住宅も多数あります（その集計は本章では検証していません）。住宅のアクセシビリティ・省エネ性能・高齢者世帯の居住条件は重要な論点ですが、本章で検証済みの統計がないため、今後の課題として明示的に残します。",
          en: "The published construction bands end at \"1970\" and \"1971–1980\" — the 1981 introduction of the new seismic code falls mid-band, so a count of pre-code dwellings cannot be read from these statistics and this chapter does not estimate one. Age is not condition: many older dwellings have been renovated or seismically retrofitted (tabulations this chapter has not verified). Accessibility, energy efficiency and housing conditions of older households matter, but in the absence of verified statistics they are explicitly left as future work.",
        },
      },
    ],
  },
  {
    id: "international",
    heading: {
      ja: "9. 国際比較と競合する説明",
      en: "9. International comparison and competing explanations",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "OECD分析的住宅価格統計の住宅価格所得比（2015年=100の指数）で2025年を比べると、オランダ135.3、カナダ130.7、アメリカ126.3、スペイン125.9、オーストラリア119.9と、2015年比3割前後上昇した国が上位に並びます。日本は114.6で中位、イギリス103.9・フランス94.1・イタリア88.1・韓国74.4は2015年を下回るか微増です。日本の住宅価格は2015年以降確かに上昇していますが、比較した国々の中では穏やかな部類です。",
          en: "On the OECD price-to-income ratio (2015=100 index) for 2025, the biggest risers since 2015 are the Netherlands (135.3), Canada (130.7), the United States (126.3), Spain (125.9) and Australia (119.9). Japan sits mid-table at 114.6, while the United Kingdom (103.9), France (94.1), Italy (88.1) and Korea (74.4) are below or barely above their 2015 levels. Japanese house prices have clearly risen since 2015 — but mildly by this comparison.",
        },
      },
      { type: "chart", chartId: "ch03-oecd-pti-compare" },
      {
        type: "callout",
        kind: "note",
        title: {
          ja: "注記：指数の伸びは水準の比較ではない",
          en: "Note: index growth is not a comparison of levels",
        },
        text: {
          ja: "この図の値はすべて2015年=100の指数です。100を超えても「住宅が手に入らない」ことを直接意味せず、未満でも「安い」ことを意味しません。各国の2015年時点の水準・住宅市場の制度（固定金利の普及率、賃貸市場の厚み、規制）・指数のカバー範囲が異なるためです。OECD編集値であり、日本の国内公表値（地価公示等）とは基準が異なります。また国により系列の開始年が異なります（イギリスは1987年から、韓国・ニュージーランドは1986年から）。",
          en: "Every value in this chart is a 2015=100 index. Exceeding 100 does not mean housing is unattainable, nor does falling below it mean cheapness: starting levels in 2015, institutions (fixed-rate prevalence, rental-market depth, regulation) and index coverage all differ. These are OECD-compiled figures on a different basis from Japan's national publications (published land prices and the like). Series start years also vary (the United Kingdom from 1987, Korea and New Zealand from 1986).",
        },
      },
      {
        type: "p",
        text: {
          ja: "日本の穏やかな上昇については、複数の説明が可能であり、本章はいずれも決定的とは扱いません。所得の回復が価格上昇を相殺した可能性（価格所得比の分母の回復）。低金利と建設余剰が価格の上昇を抑制した可能性（着工の縮小とストックの厚み）。東京圏への人口集中が全国平均を薄める可能性（首都圏の地価上昇は全国平均より大きい）。逆に、賃料の上昇の遅れ（第7節）は住宅費が家計に与えるインフレ圧力を小さくする側面と、賃貸供給の伸びを反映する側面の両方があり得ます。これらの仮説を定量的に分解することは本章の検証範囲を超えます。",
          en: "Several explanations for Japan's moderate rise are possible, and this chapter treats none as decisive: income recovery offsetting price growth (the ratio's denominator rebounding); low interest rates and construction over-capacity restraining prices (shrinking starts, a thick stock); and Tokyo-centric concentration diluting the national average (capital-region land prices rose faster than the national mean). Conversely, the lag in rents (section 7) could either dampen the inflation pressure of housing costs on households or reflect expanding rental supply. Quantitatively decomposing these hypotheses lies beyond what this chapter has verified.",
        },
      },
    ],
  },
  {
    id: "actions",
    heading: {
      ja: "10. 証拠に基づく行動",
      en: "10. Evidence-based actions",
    },
    blocks: [
      {
        type: "p",
        text: {
          ja: "本章の観測から、個人・地域・専門職・制度の4つのレベルで現実的な行動を整理します。ただし、住宅・生活費の構造は個人の努力では解決しない部分が大きく、行動の多くは条件（所得・地域・家族構成・制度の適用要件）に依存します。ここに挙げるものは、本章が検証した統計と整合的な選択肢の例であり、特定の政策・事業の推奨ではありません。",
          en: "From this chapter's observations, realistic actions follow at four levels: individuals, communities, professionals, and institutions. Much of the housing and cost-of-living structure cannot be solved by individual effort alone, and most actions depend on conditions — income, location, family composition, eligibility rules. What follows are options consistent with the verified statistics, not endorsements of particular policies or businesses.",
        },
      },
      {
        type: "h3",
        id: "actions-individuals",
        text: {
          ja: "個人・世帯レベル",
          en: "Individuals and households",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "賃貸の住居費割合（単身・民営借家で26.4%、二人以上で20.9%）を家計の中で位置づけて把握する。家計調査の分類を参考に、住居費・光熱・食料の3点を定期的に記録するだけで構造は見えてきます。",
            en: "Locate your housing-cost share in the household budget (26.4% for solo private renters, 20.9% for 2+ renter households in the verified data). Even periodically recording just housing, utilities and food — the FIES categories — reveals the structure.",
          },
          {
            ja: "転居・転職を検討する際は、賃料だけでなく光熱・水道の地域差（北海道・東北で月3.1万円超、沖縄で2.3万円）と通勤・交通費を合算して比較する。",
            en: "When considering a move or job change, compare rent together with regional utility costs (over ¥31,000/month in Hokkaido and Tohoku versus ¥22,500 in Okinawa) and commuting costs — not rent alone.",
          },
          {
            ja: "住宅の購入判断では、価格所得比や平均価格だけでなく、金利・返済期間・頭金・維持費（固定資産税・修繕）を合算して総費用で比較する。本章の価格所得比は指数であり、個別の返済負担を直接は示しません。",
            en: "For purchase decisions, compare total costs — interest rates, loan terms, down payment, and upkeep (property tax, repairs) — not the price-to-income ratio or average prices alone. The ratio in this chapter is an index and says nothing directly about any individual repayment burden.",
          },
        ],
      },
      {
        type: "h3",
        id: "actions-communities",
        text: {
          ja: "地域・コミュニティレベル",
          en: "Local communities",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "空き家率が20%を超える地域では、空き家の発生（相続・入居者不在）を早期に把握する仕組み — 例えば自治体の空き家台帳や地域での見守り網 — が、放置による老朽化（「その他」分類の増加）の前に立てる現実的な手段です。",
            en: "In areas with vacancy rates above 20%, mechanisms for early awareness of vacancies arising (inheritance, departure) — municipal vacancy registers, neighbourhood watch networks — are practical steps that can precede the decay reflected in the growing \"other\" category.",
          },
          {
            ja: "一方で空き家率が低い都市部では、空き家の活用より既存ストックの改修・居心地向上（エネルギー効率、バリアフリー）が地域の住宅政策として効果的な領域です。ただしその効果の定量評価は本章の検証範囲外です。",
            en: "In low-vacancy urban areas, retrofit and liveability improvements to the existing stock (energy efficiency, barrier-free design) are a more relevant arena than vacancy utilisation; their measured effectiveness, however, lies outside this chapter's verification.",
          },
        ],
      },
      {
        type: "h3",
        id: "actions-professionals",
        text: {
          ja: "専門職・研究者レベル",
          en: "Professionals and researchers",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "本章が使用した一次資料はすべて公開統計です（住宅・土地統計調査、家計調査、CPI、地価公示、着工統計、OECD）。住宅市場の分析では、これらの分母・基準の違い（空き家率と持ち家率、用途分類と品目分類、CPI基準）を明示した上で、原典にあたることが再現性の条件です。",
            en: "Every primary source used here is public (the Housing and Land Survey, FIES, CPI, published land prices, housing starts, OECD). Sound housing analysis must state denominators and bases explicitly — vacancy vs homeownership rates, use- vs item-classification, CPI bases — and return to the originals.",
          },
          {
            ja: "未検証の論点（旧耐震住宅の数量、住宅ローン返済負担の分布、住宅取得価格の所得階級別データ、賃貸市場のミクロ構造）には、家計の住宅・土地に関する調査の再開や不動産取引価格データの整備が資するところが大きい。",
            en: "The unverified questions here — the number of pre-code dwellings, the distribution of mortgage burdens, acquisition prices by income class, the microstructure of rental markets — would benefit most from reinstating the household housing-and-land survey and improving transaction-price data.",
          },
        ],
      },
      {
        type: "h3",
        id: "actions-institutions",
        text: {
          ja: "制度・公共レベル",
          en: "Institutions and public-sector stakeholders",
        },
      },
      {
        type: "ul",
        items: [
          {
            ja: "統計整備の観点では、家計の住宅・土地に関する調査のオンライン公開の再開、CPI基準改定に伴う接続指数の周知、空き家類型の状態別内訳（老朽・立地・権利関係）の統計化が、本章が直面した測定の限界への制度的回答です。",
            en: "On statistics: reinstating online publication of the household housing-and-land survey, clear communication of chained CPI series around base revisions, and tabulating vacancy conditions (decay, location, title) would institutionally answer the measurement limits this chapter hit.",
          },
          {
            ja: "住宅政策の評価では、価格所得比の指数や平均価格ではなく、所得階級・年齢・地域別の負担指標（賃料所得比、返済負担率）に基づく評価が、負担の非対称（20.9%対4.0%）を正しく捉える前提となります。",
            en: "Policy evaluation should rest not on index ratios or average prices but on burden indicators disaggregated by income class, age and region (rent-to-income, repayment ratios) — the precondition for capturing the verified asymmetry (20.9% vs 4.0%).",
          },
          {
            ja: "地域分化（価格上昇地域と空き家増加地域）が続く中、全国一律の政策記述ではなく、都市階級・地方別の実測（本章の関東337,946円対沖縄235,742円、大都市住居構成比7.0%対町村4.4%など）に基づく地域別の設計と評価が求められます。",
            en: "With regions bifurcating into rising-price and rising-vacancy areas, policy design and evaluation need regional grounding in measured differences (Kanto ¥337,946 vs Okinawa ¥235,742 in spending; 7.0% vs 4.4% housing shares) rather than one national narrative.",
          },
        ],
      },
      {
        type: "callout",
        kind: "action",
        title: {
          ja: "行動の前提：個人の責任と構造の境界",
          en: "Actions: the boundary between personal and structural",
        },
        text: {
          ja: "上記のうち個人・地域レベルの行動は今すぐ可能です。専門職・制度レベルの行動は統計整備や制度設計を含み、構造の変化を待つ必要があります。住宅費の重い賃貸世帯（単身26.4%）や空き家率20%超の地域の状況は、個人の家計管理だけでは解決しない構造的な側面を持つことを、行動を勧める際には明示すべきです。",
          en: "The individual and community actions are available now; the professional and institutional ones involve statistical infrastructure and design, and depend on structural change. When recommending action, be explicit that heavily burdened renter households (26.4% for solo renters) and regions above 20% vacancy face conditions that household management alone cannot resolve.",
        },
      },
    ],
  },
];
