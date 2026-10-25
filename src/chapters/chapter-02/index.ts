import type { ChapterModule } from "@/chapters/types";
import { chapter02Charts } from "./charts";
import { chapter02SectionsA } from "./content-a";
import { chapter02SectionsB } from "./content-b";
import { chapter02Sources } from "./sources";

/**
 * Chapter 02 — Economy & Industry (経済・産業).
 *
 * Publication status: published with disclosed limitations. All figures trace
 * to the generated verified data module and the archived raw sources; the
 * chapter-level limitations below are rendered on the page.
 */
export const chapter02: ChapterModule = {
  slug: "economy-industry",
  updatedAt: "2026-10-25",
  sections: [...chapter02SectionsA, ...chapter02SectionsB],
  charts: chapter02Charts,
  sources: chapter02Sources,
  limitations: [
    {
      ja: "賃金指数（1997–2025・2020年=100）は、厚生労働省が公表した前年比を用いた成長連鎖による派生系列である。公表指数水準は基準改定・標本入替え・2024年1月のベンチマーク更新（2021年経済センサス基準・約+2.6%の水準跳び）をまたいで直接比較できず、本サイトの連結指数は2024–25年について公表指数（109.2／111.7）より約2.6%低い。2018年の調査枠変更（個人業主等の除外）以前と以後も連結の前提が異なる。",
      en: "The wage index (1997–2025, 2020=100) is a derived growth-chain built from MHLW's published year-on-year rates. Published index levels are not directly comparable across rebasings, sample rotations, or the January-2024 benchmark update to the 2021 Economic Census (a ≈ +2.6% level jump); our chained index therefore sits ≈ 2.6% below the published 2024–25 levels (109.2 / 111.7). The 2018 survey-frame change (exclusion of individual proprietors) also alters the linking assumption.",
    },
    {
      ja: "産業の3部門構成比は、内閣府の16経済活動分類を当サイトが第一次・第二次・第三次産業に集計した派生値である（公表の「経済活動計」との一致は毎年検証済み）。分母は生産・輸入税を含まない産業計であり、GDP（市場価格）に対する割合とは異なる。1994年より前の長期系列は旧SNA基準であり接続していない。",
      en: "The three-sector industry shares are derived on this site by aggregating the Cabinet Office's 16-activity classification into primary/secondary/tertiary sectors (verified each year against the printed activity totals). The denominator is total industry value added excluding taxes on production and imports — not GDP at market prices. Pre-1994 history exists only under older SNA bases and is not linked.",
    },
    {
      ja: "研究費の対GDP比（2005–2024年度）は2つの公表ウィンドウの連結であり、2014年度→2015年度の境界で分母のGDPヴィンテージが変わる（平成26年度確報→2024年度年次推計）。比率の水準の連続性はこの境界で保証されない。研究費・GDP・比率はすべて公表値どおりで、A/B×100との一致を各年で検証済み。",
      en: "The R&D-to-GDP ratio (FY2005–2024) splices two published windows whose GDP denominators change vintage at the FY2014→FY2015 boundary (FY2014-final accounts → 2024 annual estimates). Ratio-level continuity is not guaranteed across that boundary. R&D, GDP and ratios are all as published, with A/B×100 verified against the printed ratio for every year.",
    },
    {
      ja: "国際比較は換算方法に強く依存する。PPP（2021年ICPサイクル）は価格構造差の推計であり確定値ではない。市場為替換算の額（内閣府参考表・2024年一人当たり33,785ドル・OECD第24位）は円安の影響を含み、PPP（2025年55,422国際ドル）とは意味が異なる。OECD生産性統計はOECD編集値であり国内公表値とは基準・改訂方針が異なり、年次更新で遡及改訂される。シンガポールはOECD生産性統計の対象外。台湾はWDIの対象外。",
      en: "International comparisons depend heavily on conversion method. PPP (2021 ICP cycle) is an estimate of price-level differences, not a measured value. Market-exchange-rate figures (Cabinet Office reference table: USD 33,785 per capita in 2024, 24th in the OECD) embed yen depreciation and mean something different from PPP (55,422 int$ in 2025). OECD productivity figures are OECD-compilations whose benchmarks and revision policy differ from national publications, with retrospective revisions in annual updates. Singapore is outside the OECD productivity database; Taiwan is outside WDI.",
    },
    {
      ja: "日本自身の叙述には一次資料（内閣府・厚生労働省・総務省）を使用し、2025暦年の年次確定値は未公表のため世界銀行WDIの速報値（実質+1.2%）のみを「速報値」と明示して補助的に使用した。2025年の実質賃金・雇用・産業構造の確定値は今後の公表・改訂で変わり得る。",
      en: "Japan's own narrative uses primary sources (Cabinet Office, MHLW, MIC); calendar-2025 national-accounts finals are unpublished, so the World Bank WDI preliminary (+1.2% real) is used only as a labeled stopgap. Final 2025 figures for wages, employment and industrial structure may change with future releases and revisions.",
    },
    {
      ja: "毎月勤労統計調査は事業所規模5人以上の常用労働者が対象で、事業主・公務員の大部分・農林漁業個人事業者は対象外。回答率は低下傾向にあり（2026年8月分確報時点で67.3%）、統計の精度への影響が懸念される。労働力調査（ILO定義）と国民経済計算（SNA活動別）の就業者数は体系が異なり、本章では目的に応じて使い分けを出典で明示した。",
      en: "The Monthly Labour Survey covers regular employees at establishments with 5+ employees; proprietors, most civil servants and self-employed farmers/foresters/fishers are out of scope. The response rate has been falling (67.3% at the August 2026 final), with implications for precision. The Labour Force Survey (ILO definition) and the national accounts (SNA activity side) count employment differently; the chapter states which system each figure uses.",
    },
    {
      ja: "本章が検証していない主題：雇用形態別賃金系列の分解（二重構造仮説の定量的評価）、産業別時間当たり付加価値の国際比較、貿易構造の内訳、特許・論文などのイノベーション成果指標、中小企業の実態統計（経済センサスの企業規模別集計）、地域別の経済指標。これらは今後の調査課題として記録し、推測で埋めていない。",
      en: "Topics NOT verified in this chapter: decomposition of wage series by employment type (quantitative test of the dualism hypothesis), industry-level GDP-per-hour comparisons, the composition of trade, innovation-outcome indicators such as patents and publications, SME statistics (establishment-size tabulations of the economic census), and regional economic indicators. They are recorded as future work rather than filled with conjecture.",
    },
  ],
};
