import type { ChapterModule } from "@/chapters/types";
import { chapter01Charts } from "./charts";
import { chapter01SectionsA } from "./content-a";
import { chapter01SectionsB } from "./content-b";
import { chapter01Sources } from "./sources";

/**
 * Chapter 01 — Population & Family (人口・家族).
 *
 * Publication status: published with disclosed limitations. All figures trace
 * to the generated verified data module and the archived raw sources; the
 * chapter-level limitations below are rendered on the page.
 */
export const chapter01: ChapterModule = {
  slug: "population-family",
  updatedAt: "2026-10-22",
  sections: [...chapter01SectionsA, ...chapter01SectionsB],
  charts: chapter01Charts,
  sources: chapter01Sources,
  limitations: [
    {
      ja: "出生・死亡は「発生基準」の届出統計であり、未届出の出来事は反映されない。1944〜1946年は原典が公表を省略（戦災による資料喪失）、1947〜1972年は沖縄県を含まない。",
      en: "Births and deaths are registration statistics on the occurrence basis; unregistered events are not captured. 1944–1946 are omitted by the source (war records lost), and 1947–1972 exclude Okinawa.",
    },
    {
      ja: "2025年（令和7年）確定数の率・合計特殊出生率は、2025年国勢調査人口を分母とする再計算が2026年11月に予定されており、改訂される可能性がある。",
      en: "The rates and TFR in the 2025 final vital statistics will be recalculated with the 2025 Census population in November 2026 and may be revised.",
    },
    {
      ja: "国勢調査（全数調査・10月1日基準）、人口推計（月次・推計値）、高齢者統計の年次推計（9月15日基準）は、それぞれ異なる統計製品であり、0.1〜0.6ポイント程度の差が生じる。本chapter（章）は各図表に出典を明記して区別した。",
      en: "The census (full enumeration, October 1), monthly population estimates, and the elderly-release series (September 15 basis) are different statistical products with gaps of roughly 0.1–0.6 percentage points; each figure here states which product it uses.",
    },
    {
      ja: "将来推計（IPSS 2023年推計）は仮定に依存するシナリオであり、実測ではない。上位・下位推計の差（2070年に9,549万人／8,024万人）が、不確実性の大きさを示す。",
      en: "The IPSS 2023 projections are assumption-dependent scenarios, not observations; the high/low spread (95.49M / 80.24M in 2070) indicates the size of the uncertainty.",
    },
    {
      ja: "国際比較には世界銀行WDI（国連WPP等を編集した二次資料）を使用した。日本の国内統計と0.1〜0.6ポイント程度の差があり、日本自身の叙述には国内統計を使用して混用を避けた。台湾はWDIに含まれないため比較対象外とした。",
      en: "International comparisons use World Bank WDI (a secondary compilation of UN WPP and national sources), which differs from Japan's national statistics by about 0.1–0.6 points; national sources are used for Japan's own narrative to avoid mixing. Taiwan is outside WDI coverage.",
    },
    {
      ja: "国内人口移動は住民基本台帳の移動届に基づく（外国人の移動は対象外）。実居住の変化とは完全には一致しない。",
      en: "Internal migration is based on resident-registration filings (Japanese movers only) and does not perfectly match actual residence changes.",
    },
    {
      ja: "本章は全国レベルの分析であり、都道府県・市区町村レベルの人口動態、ならびに出生力の要因分解（結婚率・配偶関係別出生率など）は今後の調査課題である。",
      en: "This chapter is a national-level analysis; prefectural and municipal demographics and decomposition of fertility drivers (marriage rates, marital-status-specific fertility) remain future research tasks.",
    },
  ],
};
