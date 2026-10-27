import type { ChapterModule } from "@/chapters/types";
import { chapter04Charts } from "./charts";
import { chapter04SectionsA } from "./content-a";
import { chapter04SectionsB } from "./content-b";
import { chapter04Sources } from "./sources";

/**
 * Chapter 04 — Labor & Working Conditions (労働・就業環境).
 *
 * Publication status: published with disclosed limitations. All figures trace
 * to the generated verified data module and the archived raw sources; the
 * chapter-level limitations below are rendered on the page.
 */
export const chapter04: ChapterModule = {
  slug: "labor-working-conditions",
  updatedAt: "2026-10-26",
  sections: [...chapter04SectionsA, ...chapter04SectionsB],
  charts: chapter04Charts,
  sources: chapter04Sources,
  limitations: [
    {
      ja: "非正規雇用の比較可能な公表系列は2002年からである。2001年以前の「労働力調査特別調査」（1984年2月以降、ほぼ同じ項目）は、調査時期（2月の単月）と対象が詳細集計（年平均）と異なり、統計局自身が比較には留意を求めている。特別調査の原系列は2026年10月時点でオンライン入手不能であり、本章は1984–2001年を図示しない。",
      en: "The comparable published non-regular series starts in 2002. The earlier LFS Special Survey (similar items from February 1984) differed in timing (single February month) and frame from the detailed tabulation's annual averages, and the statistics office itself asks for caution in comparison. The Special Survey's raw series is no longer retrievable online as of October 2026, so this chapter does not chart 1984–2001.",
    },
    {
      ja: "本章の賃金格差（男女間76.6・雇用形態間67.4、2025年）は、年齢・勤続年数・産業構成を調整しない「未調整」の値である。調整済みの格差の推定には微視的データが必要であり、本章では算出も公表値の確認もしていない。賃金は月額の「きまって支給する賃金」であり、時間当たり換算すれば非正規（短時間労働者を多く含む）の割引はさらに大きくなる点に注意を要する。",
      en: "The wage gaps here (gender 76.6 and employment-form 67.4, 2025) are unadjusted for age, tenure or industry mix. Adjusted gaps require microdata; this chapter neither computes one nor has verified a published figure. Wages are monthly scheduled earnings; converted to hourly rates, the non-regular discount (short-hours workers are common) would be larger still.",
    },
    {
      ja: "労働災害の死傷者数系列は、出典の公表注記のとおり2011年まで労災保険給付データを含む集計で、2012年以降は死傷病報告ベースであり、水準の厳密な接続はない。2020年以降の値は新型コロナウイルス感染症へのり患による労働災害を除く。死亡・死傷とも、本章の1974–2025年系列は公式公表のグラフ数値を復元したもので、2002年以降を独立の公表値で、1998・2008・2015年を年報確定値で検証している（検証記録：research/chapter04/notes/mhlw-summary.md）。労災認定件数は被災の全体を表さない。",
      en: "Per the source's own note, the injury series through 2011 includes workers'-comp benefit data and switches to casualty reports from 2012 — no strictly continuous level. Values from 2020 exclude COVID-infection cases. For both fatalities and injuries, the 1974–2025 series reconstructs official chart data labels, with 2002 onward verified against independent published tables and 1998/2008/2015 against year-file totals (verification trail in the research notes). Recognized-compensation counts do not measure the whole burden of harm.",
    },
    {
      ja: "「働き方」の主観的な満足・帰属意識・心理的負荷そのものは、本章の行政統計では測られていない。精神障害の労災請求件数は制度利用の指標であり、発生の下限であって規模ではない。就労条件総合調査は企業の総括回答に基づき、能力開発基本調査は支出の有無と主観的実績判断を聞く。主観指標を含む調査（労働者幸福感等）は本章では未検証である。",
      en: "Subjective satisfaction, attachment and psychological load themselves are not measured by the administrative statistics used here. Mental-health comp claims measure system use — a floor, not a total. The working-conditions survey rests on enterprise summaries; the skills-development survey asks about spending and subjective performance. Surveys carrying subjective indicators are not verified in this chapter.",
    },
    {
      ja: "OECDの年間実労働時間は、OECD自身が「トレンド比較を意図しており、同年の水準比較には適さない」と注意する推計である（出典・推計方法が国により異なる）。OECDの「臨時雇用」は契約期間で定義され、日本の「非正規」とは概念が異なる（直接比較不可）。OECDの男女賃金格差は中央値ベースの未調整値である。本章はこれらを国際序列として扱わない。",
      en: "The OECD's annual hours are estimates the OECD itself flags as trend-comparison data, unsuitable for same-year level comparisons (sources and estimation differ by country). The OECD's \"temporary employment\" is defined by contract duration and is conceptually distinct from Japan's \"non-regular\" (not directly comparable). The OECD gender wage gap is an unadjusted median-based measure. None are treated here as international rankings.",
    },
    {
      ja: "本章が検証していない主題：同一労働同一賃金の調整済み賃金差、勤続年数別の離職率・契約更新率、パートタイム労働者の時間当たり賃金の国際比較、派遣労働者の待遇差、労働組合率と団体交渉の被覆率、勤務間インターバル制度の導入状況の年次系列、外国籍労働者の労働災害・賃金の詳細、業務上疾病（じん肺・腰痛等）の推移。これらは今後の調査課題として記録し、推測で埋めていない。",
      en: "Topics NOT verified in this chapter: adjusted equal-pay gaps; tenure-specific turnover and contract-renewal rates; hourly-wage international comparisons for part-timers; dispatch-worker treatment differences; union density and collective-bargaining coverage; annual series for rest-interval adoption; detailed accident and wage statistics for foreign workers; trends in occupational diseases such as pneumoconiosis and back pain. They are recorded as future work, not filled with conjecture.",
    },
  ],
};
