import type { ChapterModule } from "@/chapters/types";
import { chapter03Charts } from "./charts";
import { chapter03SectionsA } from "./content-a";
import { chapter03SectionsB } from "./content-b";
import { chapter03Sources } from "./sources";

/**
 * Chapter 03 — Housing & Cost of Living (住宅・生活費).
 *
 * Publication status: published with disclosed limitations. All figures trace
 * to the generated verified data module and the archived raw sources; the
 * chapter-level limitations below are rendered on the page.
 */
export const chapter03: ChapterModule = {
  slug: "housing-cost-of-living",
  updatedAt: "2026-10-26",
  sections: [...chapter03SectionsA, ...chapter03SectionsB],
  charts: chapter03Charts,
  sources: chapter03Sources,
  limitations: [
    {
      ja: "住居費の負担割合（持ち家4.0%・民営借家20.9%・単身26.4%など）は、家計調査が公表する金額から当サイトが派生計算した値である（調査自体は割合を公表しない）。持家の住居費には固定資産税相当・修繕費等が含まれるが住宅ローンの元本返済は含まない。賃貸世帯は世帯主が平均より約11歳若く、所得のライフステージが異なるため、平均値の直接比較には限界がある。",
      en: "The housing-cost burden shares (4.0% owners, 20.9% 2+ private renters, 26.4% solo renters, …) are DERIVED on this site from FIES amounts — the survey itself publishes no such share. Owners' housing costs include property-tax equivalents and upkeep but not mortgage principal. Renters' household heads are about 11 years younger on average, so income life-stages differ and direct comparison of means has limits.",
    },
    {
      ja: "住宅価格所得比（OECD）は2015年=100の指数であり、価格水準でも倍率でもない。構築に用いる所得はOECDが各国の国民経済計算から編集した概念で、家計調査の世帯所得とは一致しない。日本の住宅取得の実態（価格・頭金・金利・返済負担率の分布）を調べる「家計の住宅・土地に関する調査」は2026年10月時点でオンライン公開されておらず、本章は住宅金融の個別データを検証していない。",
      en: "The OECD price-to-income ratio is a 2015=100 index — neither a price level nor a multiple — and its income concept is an OECD national-accounts compilation, not survey household income. Japan's survey of housing acquisition finances (家計の住宅・土地に関する調査) is not published online as of October 2026, so this chapter has verified no housing-finance microdata.",
    },
    {
      ja: "空き家の類型別統計は状態を測らない。「賃貸・売却用及び二次的住宅を除く空き家」385.6万戸の中の老朽・立地・権利関係の分布は不明であり、「空き家=利用可能な住宅」とも「空き家=廃屋」とも解釈できない。1978〜1998年の「賃貸用」には「売却用」が含まれ、類型の厳密な比較は2003年以降に限られる。2023年の類型名称変更（その他の住宅→賃貸・売却用及び二次的住宅を除く空き家）は概念同一の表記変更である。",
      en: "Vacancy-type statistics do not measure condition. The distribution of decay, location and title within the 3.86 million 'other' vacancies is unknown — they are neither automatically 'usable housing' nor 'ruins'. Pre-1999 'for rent' includes 'for sale', so strict type comparisons date from 2003; the 2023 renaming (その他の住宅 → vacancies excluding rent/sale/second) is a notational change with the same concept.",
    },
    {
      ja: "住宅統計の率は分母が異なる。空き家率は総住宅数、持ち家住宅率は居住世帯のある住宅（1978年以降は「不詳」含む）が分母。家計調査の「持家率」87.3%は調査世帯枠に基づき、住宅・土地統計調査の60.9%とは定義が異なる。床面積は時系列表第14-1表（居住世帯のある住宅全体）であり、概要表の専用住宅ベース（2023年90.86㎡）とは分母が異なる。1963・1968年は沖縄県を含まない。",
      en: "Housing rates use different denominators: vacancy over total dwellings; homeownership over occupied dwellings (including 'unknown' from 1978). The FIES 'owned-house' rate (87.3%) follows its household frame and is definitionally distinct from the survey's 60.9%. Floor area follows time-series table 14-1 (all occupied dwellings), not the summary's exclusive-use basis (90.86 m² in 2023). The 1963/1968 rounds exclude Okinawa.",
    },
    {
      ja: "CPIは2026年に2020年基準から2025年基準へ移行した。同一の2025年暦年平均が旧基準111.9・新基準100.0として異なる水準で公表されており、基準を跨ぐ指数水準の比較はできない（増減率は一致）。FIESの実質増減率は2026年9月4日に基準改定に伴い遡及改訂された。本章の物価図はすべて新基準（2025年=100）であり、2025年平均の旧基準値は補助的に明示してある。",
      en: "The CPI moved from the 2020 to the 2025 base during 2026: the same 2025 annual average appears as 111.9 (old base) and 100.0 (new base) — levels are not comparable across bases (rates agree). FIES real growth rates were retroactively revised on 2026-09-04 with the rebasing. All price charts here use the new base (2025=100), with the old-base 2025 average quoted only as an auxiliary headline.",
    },
    {
      ja: "本章が検証していない主題：住宅ローン返済負担率の所得階級別分布、旧耐震基準（1981年以前着工）住宅の数量（公表帯域が境界を跨ぐため推計せず）、賃貸市場のミクロ構造と家賃決定要因、住宅の省エネ性能・アクセシビリティ、空き家の状態別（老朽・権利関係）内訳、自治体別・市区町村別の分析。これらは今後の調査課題として記録し、推測で埋めていない。",
      en: "Topics NOT verified in this chapter: mortgage repayment burdens by income class; the count of pre-1981 seismic-code dwellings (the published bands straddle the boundary — not estimated here); the microstructure and rent-setting of the rental market; energy efficiency and accessibility of dwellings; vacancy condition (decay, title) breakdowns; municipal-level analysis. They are recorded as future work, not filled with conjecture.",
    },
  ],
};
