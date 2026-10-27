import type { ChapterModule } from "@/chapters/types";
import { chapter05Charts } from "./charts";
import { chapter05SectionsA } from "./content-a";
import { chapter05SectionsB } from "./content-b";
import { chapter05Sources } from "./sources";

/**
 * Chapter 05 — Education & Talent (教育・人材).
 *
 * Publication status: published with disclosed limitations. All figures trace
 * to the generated verified data module and the archived raw sources; the
 * chapter-level limitations below are rendered on the page. Coverage runs
 * through the PISA 2025 cycle (published 2026-09-08) — the newest available.
 */
export const chapter05: ChapterModule = {
  slug: "education-talent",
  updatedAt: "2026-10-27",
  sections: [...chapter05SectionsA, ...chapter05SectionsB],
  charts: chapter05Charts,
  sources: chapter05Sources,
  limitations: [
    {
      ja: "成人スキルの第2回国際成人力調査（PIAAC、2023年実施・2024年12月公表）の数値は本章では検証できていない。OECD.orgの国別ノート・データファイルが本検証環境から到達不能で、NIERの結果概要ページも破損しており、SDMX APIにPIAACのデータフローは存在しない（いずれも2026年10月27日時点の確認）。未検証の数値を掲載しない方針により、本章は第1回（2011–12年）のみを図示し、第2回は検証不能（INCONCLUSIVE）として開示する。第2回の数値はOECD・文科省の公表資料を直接確認されたい。",
      en: "Round 2 of the Survey of Adult Skills (PIAAC, fielded 2023, published December 2024) could not be verified in this chapter. The OECD.org country notes and data files are unreachable from this environment, the NIER results page is broken, and no PIAAC dataflow exists on the SDMX API (all checked 27 Oct 2026). Under our policy of publishing only verified figures, the chapter charts Round 1 (2011–12) alone and discloses Round 2 as unverifiable (INCONCLUSIVE). For Round 2 values, consult the OECD and MEXT publications directly.",
    },
    {
      ja: "生徒指導調査の最新公表は令和6年度（2024学校年度）である。令和7年度の結果は2026年10月時点で未公表。いじめの「認知件数」は、いじめ防止対策推進法の定義の普及・積極的認知・見取りの精緻化の影響を含み、文科省自身が増加を実態の悪化と同一視しないよう注意を促している。本章はその注意を維持する。また結果本文の一部の表は埋め込みフォントの文字化けにより機械抽出できず、推移の数列は結果概要の表から抽出して本文記載値と照合した（高校の不登校数の推移表は機械抽出不能のため図示していない）。",
      en: "The latest published student-guidance survey is school year 2024 (R6); R7 results were not yet published as of October 2026. \"Recognized\" bullying counts incorporate the spread of the legal definition, proactive recognition and better detection — MEXT itself warns against reading the increase as straightforwardly worsening reality, and this chapter preserves that caution. Some inner tables of the full report garble in machine extraction; trend series were taken from the summary's tables and cross-checked against body text (the high-school nonattendance trend table could not be extracted and is not charted).",
    },
    {
      ja: "不登校の年次系列は2つの基準をつなげている。1991–2013年は学校基本調査の理由別長期欠席（30日以上）のうち「不登校」区分（病気・経済的理由を除く）、2014年以降は学校基本調査と生徒指導調査の一本化後の系列である。2014年の接続点で両者は約0.2%（122,650人 vs 122,897人）異なり、厳密な水準接続はない。増加の解釈（欠席日数の延長・概念の受容・実態の変化）は分離できず、本章は複数の仮説を明示した。自殺者数は学校からの報告値で、詳細調査の実施率は5.6%であり、背景の全体を把握する統計ではない。",
      en: "The nonattendance series joins two bases: 1991–2013 from the School Basic Survey's long-absence \"nonattendance\" category (30+ days, excluding illness and finance), and 2014 onward from the unified School Basic Survey / student-guidance survey. At the 2014 junction the two differ by about 0.2% (122,650 vs 122,897) — no strict level continuity. The chapter cannot decompose the rise (longer absences, wider acceptance of the concept, or real change) and states the hypotheses explicitly. Suicides are school-reported counts with a 5.6% detailed-investigation rate — not a statistic that captures full background.",
    },
    {
      ja: "PISAは15歳の標本調査である。平均得点は経年比較可能な設計だが、数値差と統計的有意差は別物であり、順位は信頼区間内で入れ替わり得る。3分野は尺度が異なり相互比較できない。PISAの得点は知能・個人の価値・創造性・将来の経済的成功を測らない。本章はOECD平均を公表された加盟国平均として扱い、表示国の平均ではないことを明示する。「OECD加盟国中1位」と「全参加国中5位」のような母集団の違いも本文で区別している。",
      en: "PISA is a sample survey of 15-year-olds. Mean scores are designed for trend comparison, but numerical and statistically significant differences are distinct, and ranks interchange within confidence intervals. The three domains use different scales and cannot be compared across domains. PISA scores do not measure intelligence, personal worth, creativity or future economic success. The OECD average is the published member average, not an average of displayed countries; the text distinguishes population bases such as \"first among OECD countries\" from \"fifth among all participants\".",
    },
    {
      ja: "OECD Education at a Glanceの指標には構造的な留意点がある。高等教育修得率はISCED 5–8（短大・高専・専門学校専門課程を含む）で、日本の「中学卒（ISCED 0–2）」の雇用率行はLSO-NEAC集計に存在しない。1人当たり支出は現行価格PPP・中核サービス・全財源で、国によりデータ年が2022–2023年と異なる。ISCED対応は各国の申告に依存する。ECEC参加率はISCED 0の在籍率であり、待機児童や保育士比などの質の指標を含まない。本章はこれらを国際序列として扱わない。",
      en: "The OECD Education at a Glance indicators carry structural caveats: tertiary attainment covers ISCED 5–8 (including junior colleges, KOSEN and specialized training colleges); Japan's below-upper-secondary employment rows are absent from the LSO-NEAC collection; per-student spending is current-price PPP for core services from all sources, with reference years straddling 2022–2023; ISCED mapping relies on national reporting; ECEC participation is ISCED-0 enrolment and excludes quality measures such as waiting lists or staff ratios. None are treated as international rankings.",
    },
    {
      ja: "本章が検証していない主題：教員の勤務時間・採用・離職、学習塾の規模と効果、給付型奨学金の効果、都市と地方の教育機会の詳細、特別支援教育の実態、外国にルーツを持つ児童生徒の学習・適応、大学入学共通テストと入学者選抜、学校外教育活動（塾・習い事）の国際比較、幼児教育の質（保育士比・待機児童）、职业教育（専修学校）の修了後の所得。これらは今後の調査課題として記録し、推測で埋めていない。",
      en: "Topics NOT verified in this chapter: teacher working hours, hiring and attrition; the scale and effects of juku; grant-scholarship effects; urban-rural detail of opportunity; special-needs education practice; learning and adaptation of foreign-background students; the common test and admissions; international comparison of out-of-school activities; early-childhood quality (staff ratios, waiting lists); post-completion earnings for specialized-training-college graduates. They are recorded as future work, not filled with conjecture.",
    },
  ],
};
