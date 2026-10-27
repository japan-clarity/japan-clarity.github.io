import type { ChartSpec } from "@/lib/research/types";
import {
  PISA_JPN_MATH,
  PISA_JPN_READING,
  PISA_JPN_SCIENCE,
  PISA_OECD_MATH,
  PISA_OECD_READING,
  PISA_OECD_SCIENCE,
  PISA_2025_INTL_SCIENCE,
  PISA_2025_INTL_READING,
  PISA_2025_INTL_MATH,
  PISA_PROF_JAPAN,
  PISA_PROF_OECD,
  HS_PROGRESSION_EXCL_COMM,
  UNIV_FRESHMAN_PROGRESSION,
  UNIV_FRESHMAN_PROGRESSION_M,
  UNIV_FRESHMAN_PROGRESSION_F,
  HS_DESTINATIONS_2025,
  IJIME_TOTAL,
  IJIME_ELEMENTARY,
  IJIME_JHS,
  IJIME_HS_SP,
  NET_IJIME,
  FUTOUKOU_OLD,
  FUTOUKOU_TOTAL,
  FUTOUKOU_ELEMENTARY,
  FUTOUKOU_JHS,
  IJIME_JUDAITAI,
  LIFE_SATISFACTION_SHARE,
  TERTIARY_25_64,
  PER_STUDENT_BY_LEVEL_2023,
  EMPLOYMENT_BY_ATTAINMENT,
  ECEC_3_5,
  PIAAC_2012,
  UNIV_ENROLLMENT,
  SENSHU_ENROLLMENT,
  GAKUSHUUHI_2023,
} from "./data";

/**
 * Chapter 05 chart specifications.
 *
 * Every series references the generated verified data module; nothing is
 * hand-entered. PISA scores are scale points (not percentages) and are never
 * presented as a ranking of national "education quality". OECD averages are
 * the OECD's own aggregate series, not averages of shown countries. The
 * 不登校 chart joins two survey bases with the break year disclosed. 学習費
 * and 在籍者数 are unit-converted (円→万円, 人→万人) from published values.
 */

const years = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([y]) => y);
const values = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([, v]) => v);
/** Align a shorter series to a longer axis by padding missing years with null. */
const padTo = (
  axis: ReadonlyArray<[number, number | null]>,
  series: ReadonlyArray<[number, number | null]>,
): Array<number | null> => {
  const m = new Map<number, number | null>(series.map(([y, v]) => [y as number, v as number | null]));
  return axis.map(([y]) => (m.has(y as number) ? m.get(y as number) ?? null : null));
};

/** PISA reading axis (2000–2025) is the longest; math/science pad onto it. */
const PISA_AXIS = PISA_JPN_READING;

const profLowJPN = PISA_PROF_JAPAN.map(([y, v]) => [y, Math.round((v[0]) * 10) / 10] as [number, number]);
const profLowOECD = PISA_PROF_OECD.map(([y, v]) => [y, Math.round((v[0]) * 10) / 10] as [number, number]);
const profHighJPN = PISA_PROF_JAPAN.map(([y, v]) => [y, Math.round((v[4] + v[5]) * 10) / 10] as [number, number]);
const profHighOECD = PISA_PROF_OECD.map(([y, v]) => [y, Math.round((v[4] + v[5]) * 10) / 10] as [number, number]);

const AREA_KEYS = ["JPN", "OECD", "KOR", "EST", "GBR", "CAN", "NZL", "AUS", "FIN", "USA", "CHE", "IRL", "POL", "NLD", "BEL"];
const AREA_JA: Record<string, string> = {
  JPN: "日本", OECD: "OECD平均", KOR: "韓国", EST: "エストニア", GBR: "イギリス", CAN: "カナダ",
  NZL: "ニュージーランド", AUS: "オーストラリア", FIN: "フィンランド", USA: "アメリカ",
  CHE: "スイス", IRL: "アイルランド", POL: "ポーランド", NLD: "オランダ", BEL: "ベルギー",
  DEU: "ドイツ", FRA: "フランス",
};
const AREA_EN: Record<string, string> = {
  JPN: "Japan", OECD: "OECD average", KOR: "Korea", EST: "Estonia", GBR: "United Kingdom",
  CAN: "Canada", NZL: "New Zealand", AUS: "Australia", FIN: "Finland", USA: "United States",
  CHE: "Switzerland", IRL: "Ireland", POL: "Poland", NLD: "Netherlands", BEL: "Belgium",
  DEU: "Germany", FRA: "France",
};
const intlMap = (data: ReadonlyArray<[string, number]>, keys: string[]) =>
  keys.map((k) => data.find(([a]) => a === k)?.[1] ?? null);

// 不登校 combined series: old basis 1991–2013 + unified basis 2014–2024
const FUTOUKOU_COMBINED: ReadonlyArray<[number, number | null]> = [
  ...FUTOUKOU_OLD,
  ...FUTOUKOU_TOTAL,
];

// 高等教育修得率 chart: Japan + OECD + Korea + Canada + Germany
const TER_AXIS = TERTIARY_25_64.JPN;
const terPad = (key: string) => padTo(TER_AXIS, TERTIARY_25_64[key]);

// ECEC chart: Japan + OECD + selected
const ECEC_AXIS = ECEC_3_5.JPN;
const ececPad = (key: string) => padTo(ECEC_AXIS, ECEC_3_5[key]);

// Employment by attainment: country × (upper-secondary, tertiary)
const EMP_KEYS = ["JPN", "OECD", "DEU", "AUS", "GBR", "KOR", "CAN", "USA", "FRA"];
const empVal = (k: string, lev: string) => EMPLOYMENT_BY_ATTAINMENT[k]?.[lev] ?? null;

export const chapter05Charts: ChartSpec[] = [
  // ----- 1. PISA trend ------------------------------------------------------
  {
    id: "ch05-pisa-trend",
    title: {
      ja: "PISA平均得点の推移 — 日本とOECD平均（2000–2025年）",
      en: "PISA mean scores over time — Japan vs OECD average (2000–2025)",
    },
    description: {
      ja: "OECD生徒の学習到達度調査（PISA）の3分野の平均得点。日本は3分野ともOECD平均を大きく上回る水準を25年間維持した。OECD平均は2015年以降3分野すべてで低下し、2025年は数学463点・読解461点・科学482点。日本は2025年に3分野すべてでOECD加盟国中1位となった（調査開始以来初）。ただし読解力は2022年比13点の有意な低下であり、平均得点は経年比較可能な設計とはいえ数値差と有意差は区別して読む必要がある。",
      en: "Mean scores in the three PISA domains. Japan has stayed far above the OECD average in all three domains for a quarter century, while the OECD average fell in every domain after 2015 (2025: math 463, reading 461, science 482). In 2025 Japan ranked first among OECD countries in all three domains for the first time. Reading nevertheless fell a significant 13 points from 2022; scores are designed for trend comparison, but numerical and statistically significant differences must be distinguished.",
    },
    years: years(PISA_AXIS),
    series: [
      { key: "jpn_math", name: { ja: "日本・数学的リテラシー", en: "Japan · math" }, values: padTo(PISA_AXIS, PISA_JPN_MATH), kind: "line" },
      { key: "jpn_reading", name: { ja: "日本・読解力", en: "Japan · reading" }, values: padTo(PISA_AXIS, PISA_JPN_READING), kind: "line", colorIndex: 2 },
      { key: "jpn_science", name: { ja: "日本・科学", en: "Japan · science" }, values: padTo(PISA_AXIS, PISA_JPN_SCIENCE), kind: "line", colorIndex: 3 },
      { key: "oecd_math", name: { ja: "OECD平均・数学", en: "OECD avg · math" }, values: padTo(PISA_AXIS, PISA_OECD_MATH), kind: "line", dashed: true, colorIndex: 5 },
      { key: "oecd_reading", name: { ja: "OECD平均・読解", en: "OECD avg · reading" }, values: padTo(PISA_AXIS, PISA_OECD_READING), kind: "line", dashed: true, colorIndex: 6 },
      { key: "oecd_science", name: { ja: "OECD平均・科学", en: "OECD avg · science" }, values: padTo(PISA_AXIS, PISA_OECD_SCIENCE), kind: "line", dashed: true, colorIndex: 7 },
    ],
    unit: { ja: "点（尺度得点）", en: "scale points" },
    valueKind: "int",
    yLabel: { ja: "平均得点（点）", en: "Mean score (points)" },
    sourceIds: ["nier-pisa2025", "nier-pisa2012", "nier-pisa2015", "nier-pisa2018", "mext-pisa2022"],
    note: {
      ja: "平均得点は経年比較可能な設計。数学は2003年以降、科学は2006年以降が比較可能系列（読解力は2000年以降）。2025年から分野名「科学的リテラシー」は「科学コンピテンシー」に改称（測定対象は同一）。3分野は尺度が異なり、分野間の点数比較はできない。日本の2025年の信頼区間は数学517–534・読解495–510・科学530–545。PISAは15歳の標本調査であり、得点は知能・学校の優劣・将来の成功を測るものではない。",
      en: "Mean scores are designed for trend comparison; math is comparable from 2003 and science from 2006 (reading from 2000). From 2025 the science domain is renamed \"science competency\" (same measured domain). The three domains use different scales and cannot be compared with each other. Japan's 2025 confidence intervals: math 517–534, reading 495–510, science 530–545. PISA is a sample survey of 15-year-olds; scores do not measure intelligence, school quality rankings, or future success.",
    },
    rangeFilter: true,
  },

  // ----- 2. PISA 2025 international comparison ------------------------------
  {
    id: "ch05-pisa-2025-intl",
    title: {
      ja: "PISA2025の国際比較 — OECD加盟国上位（2025年）",
      en: "PISA 2025 international comparison — leading OECD countries",
    },
    description: {
      ja: "PISA2025（2026年9月8日公表、91か国・地域・約76万人参加）のOECD加盟38か国中の上位国。日本は科学538点・読解503点・数学525点で、3分野すべてOECD加盟国中1位（調査開始以来初）。全参加国・地域中では科学5位・読解4位・数学5位。OECD平均との差は科学+56点・読解+42点・数学+62点。点数の近い国との順位は信頼区間で入れ替わり得るため、序列としてではなく水準の目安として読む。",
      en: "Leading OECD countries in PISA 2025 (published 8 Sep 2026; 91 countries/economies, ~760,000 students). Japan scored 538 in science, 503 in reading and 525 in math — first among the 38 OECD countries in all three domains for the first time. Among all 91 participants Japan ranks 5th in science, 4th in reading and 5th in math. Gaps to the OECD average: +56 (science), +42 (reading), +62 (math). Rankings between countries with close scores can interchange within confidence intervals — read as levels, not orders.",
    },
    years: AREA_KEYS.filter((k) => PISA_2025_INTL_SCIENCE.some(([a]) => a === k)),
    categories: AREA_KEYS.filter((k) => PISA_2025_INTL_SCIENCE.some(([a]) => a === k)).map((k) => ({ ja: AREA_JA[k], en: AREA_EN[k] })),
    series: [
      { key: "science", name: { ja: "科学コンピテンシー", en: "Science" }, values: intlMap(PISA_2025_INTL_SCIENCE, AREA_KEYS.filter((k) => PISA_2025_INTL_SCIENCE.some(([a]) => a === k))), kind: "bar" },
      { key: "reading", name: { ja: "読解力", en: "Reading" }, values: intlMap(PISA_2025_INTL_READING, AREA_KEYS.filter((k) => PISA_2025_INTL_SCIENCE.some(([a]) => a === k))), kind: "bar", colorIndex: 2 },
      { key: "math", name: { ja: "数学的リテラシー", en: "Math" }, values: intlMap(PISA_2025_INTL_MATH, AREA_KEYS.filter((k) => PISA_2025_INTL_SCIENCE.some(([a]) => a === k))), kind: "bar", colorIndex: 3 },
    ],
    unit: { ja: "点（尺度得点）", en: "scale points" },
    valueKind: "int",
    yLabel: { ja: "平均得点（点）", en: "Mean score (points)" },
    sourceIds: ["nier-pisa2025"],
    note: {
      ja: "OECD加盟38か国の比較。＊印の国（カナダ・ニュージーランド・アメリカ・オランダ等）はOECDのサンプリング基準を1つ以上満たさない。全参加国・地域では北京・上海・江蘇・浙江（中国）が科学597点・数学612点、シンガポールが読解535点で最多得点。OECD平均は公表された加盟国平均であり、図に表示した国の平均ではない。",
      en: "Comparison across the 38 OECD member countries. Countries marked with ＊ in the source (Canada, New Zealand, United States, Netherlands, etc.) fail at least one OECD sampling standard. Among all participants, Beijing-Shanghai-Jiangsu-Zhejiang (China) scored highest in science (597) and math (612), Singapore in reading (535). The OECD average is the published member average, not an average of the countries shown.",
    },
    horizontal: true,
  },

  // ----- 3. PISA proficiency distribution ------------------------------------
  {
    id: "ch05-pisa-levels",
    title: {
      ja: "科学の習熟度レベル別割合 — 低得点層と高得点層（2006–2025年）",
      en: "Science proficiency — low and top achievers (2006–2025)",
    },
    description: {
      ja: "PISA科学（2025年は科学コンピテンシー）の習熟度レベル別構成比。低得点層（レベル1以下）は日本では2006年の12.0%から2022年の8.0%へ減少した後、2025年に11.3%へ有意に上昇した。高得点層（レベル5以上）は2025年17.2%と2022年（18.0%）と有意差なし。OECD平均の低得点層は19.2%から25.7%へ増加。日本の分布は依然OECD平均より裾が狭いが、下方への広がりが再び拡大した。",
      en: "Distribution of science proficiency levels. Japan's low achievers (level 1 or below) fell from 12.0% (2006) to 8.0% (2022) and then rose significantly to 11.3% in 2025; the top share (level 5+) was 17.2% in 2025, not significantly different from 2022 (18.0%). The OECD average's low-achiever share grew from 19.2% to 25.7%. Japan's distribution remains narrower than the OECD's, but its lower tail widened again.",
    },
    years: profLowJPN.map(([y]) => y),
    series: [
      { key: "low_jpn", name: { ja: "日本・レベル1以下", en: "Japan · level ≤1" }, values: profLowJPN.map(([, v]) => v), kind: "line" },
      { key: "low_oecd", name: { ja: "OECD平均・レベル1以下", en: "OECD avg · level ≤1" }, values: profLowOECD.map(([, v]) => v), kind: "line", dashed: true, colorIndex: 5 },
      { key: "high_jpn", name: { ja: "日本・レベル5以上", en: "Japan · level ≥5" }, values: profHighJPN.map(([, v]) => v), kind: "line", colorIndex: 3 },
      { key: "high_oecd", name: { ja: "OECD平均・レベル5以上", en: "OECD avg · level ≥5" }, values: profHighOECD.map(([, v]) => v), kind: "line", dashed: true, colorIndex: 7 },
    ],
    unit: { ja: "％", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "生徒の割合（％）", en: "Share of students (%)" },
    sourceIds: ["nier-pisa2025"],
    note: {
      ja: "中心分野（科学）の生徒の割合。各年の合計は約100％。習熟度レベルは得点に基づく区分で、レベル2が基礎的習熟度。日本のレベル1以下の割合は2022年比で3.3ポイントの有意な上昇、レベル5以上は有意差なし（2025年報告書本文）。",
      en: "Shares in the major domain (science); categories sum to ~100% each year. Proficiency levels are score-based bands, level 2 being baseline. Japan's level-≤1 share rose a significant 3.3 points from 2022; the level-≥5 share shows no significant change (2025 report text).",
    },
  },

  // ----- 4. Progression long-run ---------------------------------------------
  {
    id: "ch05-progression-longrun",
    title: {
      ja: "進学率の長期推移 — 高校等進学と大学等現役進学（1950–2025年）",
      en: "Long-run progression rates — upper secondary and university (1950–2025)",
    },
    description: {
      ja: "学校基本調査（e-Stat時系列・確報再算定）による進学率。高校等への進学率（通信制を除く）は1950年代の~50%台から1970年代前半に90%台へ到達し、以後ほぼ100%に張り付く。大学・短期大学等への現役進学率は1984年の~30%台から2010年代前半に一旦横ばいとなった後、2025年に61.4%（男59.7%・女63.2%）と過去最高に達した。女子の現役進学率は2014年以降一貫して男子を上回る。",
      en: "Progression rates from the School Basic Survey (e-Stat long-run series, final-report recalculation). Upper-secondary progression (excluding correspondence courses) climbed from the ~50%s of the 1950s to the 90%s by the early 1970s and has sat near 100% since. The fresh-graduate progression rate to universities and junior colleges rose from ~30% in 1984 to a record 61.4% in 2025 (men 59.7%, women 63.2%), after plateauing in the early 2010s. Women's rate has exceeded men's consistently since 2014.",
    },
    years: years(HS_PROGRESSION_EXCL_COMM),
    series: [
      { key: "hs", name: { ja: "高校等への進学率（通信制除く）", en: "Upper secondary (excl. correspondence)" }, values: values(HS_PROGRESSION_EXCL_COMM), kind: "line", colorIndex: 8 },
      { key: "univ_t", name: { ja: "大学等への現役進学率（計）", en: "University etc. · total" }, values: padTo(HS_PROGRESSION_EXCL_COMM, UNIV_FRESHMAN_PROGRESSION), kind: "line" },
      { key: "univ_m", name: { ja: "現役進学率（男）", en: "University etc. · men" }, values: padTo(HS_PROGRESSION_EXCL_COMM, UNIV_FRESHMAN_PROGRESSION_M), kind: "line", dashed: true, colorIndex: 5 },
      { key: "univ_f", name: { ja: "現役進学率（女）", en: "University etc. · women" }, values: padTo(HS_PROGRESSION_EXCL_COMM, UNIV_FRESHMAN_PROGRESSION_F), kind: "line", dashed: true, colorIndex: 6 },
    ],
    unit: { ja: "％", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "進学率（％）", en: "Progression rate (%)" },
    sourceIds: ["estat-kihon-nenji"],
    note: {
      ja: "高校等進学率は「通信制課程（本科）への進学者を除く」系列（1950年以降）。現役進学率系列は1984年以降（R7確報の再算定系列）。2025年の高校等への進学率（通信制含む計）は98.6%。現役進学率＝高校等卒業者のうち同年に大学等（大学・短大・高専・専修専門課程）へ進学した者の割合。学校年度ベース。",
      en: "The upper-secondary series excludes correspondence-course entrants (from 1950); the fresh-graduate university series starts 1984 (recalculated in the R7 final report). Including correspondence students, upper-secondary progression in 2025 is 98.6%. Fresh-graduate progression = entrants to universities, junior colleges, colleges of technology or specialized training colleges in the same year ÷ that year's upper-secondary graduates. School-year basis.",
    },
    rangeFilter: true,
  },

  // ----- 5. HS destinations 2025 ---------------------------------------------
  {
    id: "ch05-hs-destinations",
    title: {
      ja: "高校卒業者の進路 — 令和7年度（2025年）",
      en: "Upper-secondary graduates' destinations — school year 2025",
    },
    description: {
      ja: "学校基本調査R7確報による高校（全日制・定時制）等卒業者の進路構成。大学（学部）58.3%、短大等3.1%（61.4%との差分）、専門学校14.4%、就職13.8%（過去最低）、残り約10.4%は進学・就職以外（家事・一時休職・その他など）。高等教育機関全体への進学率（過年度卒含む）は85.4%。約7人に1人が卒業後すぐには進学も就職もしていない計算になる。",
      en: "Destinations of upper-secondary graduates from the R7 final School Basic Survey. University (bachelor) 58.3%, junior college etc. 3.1% (residual of the 61.4% combined figure), specialized training colleges 14.4%, employment 13.8% (a record low), with the remaining ~10.4% neither progressing nor employed immediately. The higher-education progression rate including past-year graduates is 85.4%. Roughly one in seven graduates neither progresses nor starts work right away.",
    },
    years: HS_DESTINATIONS_2025.map(([k]) => k),
    categories: [
      { ja: "大学（学部）", en: "University (bachelor)" },
      { ja: "短大等（差分）", en: "Junior college etc. (residual)" },
      { ja: "専門学校", en: "Specialized training college" },
      { ja: "就職", en: "Employment" },
      { ja: "左記以外", en: "Other" },
    ],
    series: [
      { key: "share", name: { ja: "卒業者の割合", en: "Share of graduates" }, values: HS_DESTINATIONS_2025.map(([, v]) => v), kind: "bar", colorIndex: 9 },
    ],
    unit: { ja: "％", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "卒業者に占める割合（％）", en: "Share of graduates (%)" },
    sourceIds: ["mext-kihon-r7"],
    note: {
      ja: "大学・短大等進学者の割合61.4%と学部58.3%は公表値。「短大等（差分）」3.1%と「左記以外」10.4%は公表値からの算出値（100−61.4−14.4−13.8）。進路の内訳区分（家事・一時休職等）はこの図では分割していない。",
      en: "The 61.4% combined and 58.3% bachelor shares are published; \"junior college etc.\" (3.1%) and \"other\" (10.4%) are residuals computed from published figures. The finer destination categories (home duties, temporary leave, etc.) are not split here.",
    },
    horizontal: true,
    csv: true,
  },

  // ----- 6. ECEC ---------------------------------------------------------------
  {
    id: "ch05-ecec-intl",
    title: {
      ja: "就学前教育（ECEC）への参加率 — 3〜5歳（2015–2024年）",
      en: "Early childhood education participation — ages 3–5 (2015–2024)",
    },
    description: {
      ja: "OECD Education at a Glance（SDMX）による3〜5歳児の就学前教育（ISCEDレベル0）在籍率。日本は2015年の91.0%から2024年の95.2%へ上昇し、OECD平均（86.0%）を約9ポイント上回る。韓国（95.6%）やドイツ（95.6%）と同水準で、フランス（99.8%）が最高。日本では義務教育開始が6歳のため3〜5歳の小学校在籍は0%であり、日本の数値はそのまま就学前教育の参加率を表す。",
      en: "Enrolment of 3–5-year-olds in early childhood education (ISCED level 0) from OECD Education at a Glance (SDMX). Japan rose from 91.0% (2015) to 95.2% (2024), about 9 points above the OECD average (86.0%) and on par with Korea (95.6%) and Germany (95.6%); France is highest at 99.8%. Because compulsory schooling starts at age 6 in Japan, primary enrolment at ages 3–5 is 0%, so Japan's figure is the ECEC participation rate itself.",
    },
    years: years(ECEC_AXIS),
    series: [
      { key: "jpn", name: { ja: "日本", en: "Japan" }, values: values(ECEC_3_5.JPN), kind: "line" },
      { key: "oecd", name: { ja: "OECD平均", en: "OECD average" }, values: ececPad("OECD"), kind: "line", dashed: true, colorIndex: 5 },
      { key: "kor", name: { ja: "韓国", en: "Korea" }, values: ececPad("KOR"), kind: "line", colorIndex: 2 },
      { key: "deu", name: { ja: "ドイツ", en: "Germany" }, values: ececPad("DEU"), kind: "line", colorIndex: 3 },
      { key: "gbr", name: { ja: "イギリス", en: "United Kingdom" }, values: ececPad("GBR"), kind: "line", colorIndex: 8 },
    ],
    unit: { ja: "％", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "同年齢人口比（％）", en: "Share of same-age population (%)" },
    sourceIds: ["oecd-eag-sdmx"],
    note: {
      ja: "ISCEDレベル0（幼稚園・認定こども園等）の在籍率。イギリス（66.5%）は小学校在籍32.1%を合わせると全体では約99%。日本のISCED分類では3〜5歳の小学校在籍は0%。就学前教育の年齢別内訳や質（保育士比・待機児童）はこの図の範囲外。",
      en: "Enrolment in ISCED level 0 (kindergartens, certified centres). The United Kingdom (66.5%) adds 32.1% in primary school for a combined ~99%. Under Japan's ISCED mapping primary enrolment at ages 3–5 is 0%. Age-level detail and quality measures (staff ratios, waiting lists) are outside this chart.",
    },
  },

  // ----- 7. Tertiary attainment ------------------------------------------------
  {
    id: "ch05-tertiary-attainment",
    title: {
      ja: "高等教育修得率（25〜64歳）— 日本と国際比較（1997–2025年）",
      en: "Tertiary attainment, ages 25–64 — Japan in comparison (1997–2025)",
    },
    description: {
      ja: "OECD Education at a Glance（SDMX・LSO-NEAC集計）による高等教育（ISCED 5–8）修得者の割合。日本は1997年の30.5%から2025年の57.9%へほぼ倍増し、OECD平均（42.7%）を15ポイント上回る。ただし25歳以上人口全体の修得率ではカナダ（63.9%）・韓国（58.2%）に次ぐ水準。若い世代（25〜34歳）の修得率はさらに高く、日本では2025年に約66%となっている。",
      en: "Share of adults (25–64) with tertiary education (ISCED 5–8) from OECD Education at a Glance (SDMX, LSO-NEAC collection). Japan nearly doubled from 30.5% (1997) to 57.9% (2025), 15 points above the OECD average (42.7%), behind Canada (63.9%) and Korea (58.2%). The younger cohort (25–34) is higher still — about 66% in Japan in 2025.",
    },
    years: years(TER_AXIS),
    series: [
      { key: "jpn", name: { ja: "日本", en: "Japan" }, values: values(TERTIARY_25_64.JPN), kind: "line" },
      { key: "oecd", name: { ja: "OECD平均", en: "OECD average" }, values: terPad("OECD"), kind: "line", dashed: true, colorIndex: 5 },
      { key: "kor", name: { ja: "韓国", en: "Korea" }, values: terPad("KOR"), kind: "line", colorIndex: 2 },
      { key: "can", name: { ja: "カナダ", en: "Canada" }, values: terPad("CAN"), kind: "line", colorIndex: 3 },
      { key: "deu", name: { ja: "ドイツ", en: "Germany" }, values: terPad("DEU"), kind: "line", colorIndex: 8 },
    ],
    unit: { ja: "％", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "成人人口比（％）", en: "Share of adult population (%)" },
    sourceIds: ["oecd-eag-sdmx"],
    note: {
      ja: "ISCED 5–8（短大・高専・専門学校専門課程・大学・大学院を含む）。25〜34歳の日本の数値は図の注記本文参照（データは収集済み）。OECD平均は公表された加盟国平均。修得率は過去の教育成果の蓄積であり、現在の教育の質そのものを示さない。",
      en: "ISCED 5–8 (including junior colleges, colleges of technology, specialized training colleges, universities and graduate schools). Japan's 25–34 figure appears in the text. The OECD average is the published member average. Attainment measures the accumulated stock of past education, not current education quality.",
    },
    rangeFilter: true,
  },

  // ----- 8. Bullying ------------------------------------------------------------
  {
    id: "ch05-bullying",
    title: {
      ja: "いじめの認知件数の推移（2013–2024年度）",
      en: "Recognized bullying incidents (school years 2013–2024)",
    },
    description: {
      ja: "文部科学省「児童生徒の問題行動・不登校等生徒指導上の諸課題に関する調査」による、学校が認知したいじめの件数。合計は2013年の18.6万件から2024年（令和6年度）の769,022件へ4.1倍となり過去最多。小学校が61.1万件と全体の8割を占める。1,000人当たり認知件数は13.4件から61.3件へ。文科省自身、増加の背景として「いじめの定義と積極的認知の普及」「見取りの精緻化」を挙げており、認知件数の増加イコール実態の悪化とは解釈しないよう注意を促している。",
      en: "Bullying incidents recognized by schools, from MEXT's student-guidance survey. The total grew 4.1× from 186 thousand (2013) to a record 769,022 (school year 2024), with elementary schools accounting for 611 thousand — about 80%. Incidents per 1,000 students rose from 13.4 to 61.3. MEXT itself attributes the rise largely to the spread of the legal definition and proactive recognition, and cautions that growing counts do not equal worsening reality.",
    },
    years: years(IJIME_TOTAL),
    series: [
      { key: "elem", name: { ja: "小学校", en: "Elementary" }, values: values(IJIME_ELEMENTARY), kind: "area", stack: "ijime" },
      { key: "jhs", name: { ja: "中学校", en: "Junior high" }, values: values(IJIME_JHS), kind: "area", stack: "ijime", colorIndex: 2 },
      { key: "hs_sp", name: { ja: "高校・特別支援学校", en: "High + special" }, values: values(IJIME_HS_SP), kind: "area", stack: "ijime", colorIndex: 8 },
      { key: "total", name: { ja: "合計", en: "Total" }, values: values(IJIME_TOTAL), kind: "line", colorIndex: 6 },
    ],
    unit: { ja: "件", en: "cases" },
    valueKind: "int",
    yLabel: { ja: "認知件数（件）", en: "Recognized cases" },
    sourceIds: ["mext-shidou-r6"],
    note: {
      ja: "「認知件数」はいじめ防止対策推進法の定義に基づき学校が把握した件数。2018年度（R1）の調査から重大事態の取扱いが明確化される等、調査項目は随時追加・見直し。年度末時点で解消と判断されたのは76.1%（2024年度）。1,000人当たりの系列は本文参照（単位が異なるため同一軸には表示しない）。",
      en: "\"Recognized\" counts are incidents schools identified under the bullying-prevention act's definition; survey items have been revised repeatedly. At year-end 76.1% were judged resolved (2024). The per-1,000 series appears in the text (different unit, so not on the same axis).",
    },
  },

  // ----- 9. Network bullying ----------------------------------------------------
  {
    id: "ch05-net-bullying",
    title: {
      ja: "ネット上のいじめの認知件数（2013–2024年度）",
      en: "Recognized online bullying incidents (2013–2024)",
    },
    description: {
      ja: "同調査のいじめの態様別統計のうち、「パソコンや携帯電話等で、ひぼう・中傷や嫌なことをされる。」と認知された件数。2013年の8,788件から2024年の27,365件へ3.1倍。全体のいじめ認知件数に占める割合は約3.6%。オンラインでの嫌がらせは見えにくく、認知の前提となる相談・見取りの充実が件数に反映される点は、一般のいじめと同じである。",
      en: "Cases recognized under the category \"being insulted or slandered via computer or mobile phone\" within the same survey's bullying-modality statistics. They tripled from 8,788 (2013) to 27,365 (2024), about 3.6% of all recognized bullying. Online harassment is hard to see, and counts reflect the outreach and detection that precede recognition — as with bullying generally.",
    },
    years: years(NET_IJIME),
    series: [
      { key: "net", name: { ja: "ネット上のいじめ", en: "Online bullying" }, values: values(NET_IJIME), kind: "line", colorIndex: 6 },
    ],
    unit: { ja: "件", en: "cases" },
    valueKind: "int",
    yLabel: { ja: "認知件数（件）", en: "Recognized cases" },
    sourceIds: ["mext-shidou-r6"],
    note: {
      ja: "態様は複数回答。2024年度の値（27,365件）は報告書本文、2013–2023年度は推移の注記から。いじめ全体の認知件数（図8）との比率は本文参照。",
      en: "Modalities are multi-response. The 2024 value (27,365) is from the report body; 2013–2023 from the trend note. See Figure 8 for the ratio to all recognized bullying.",
    },
  },

  // ----- 10. Nonattendance ------------------------------------------------------
  {
    id: "ch05-nonattendance",
    title: {
      ja: "不登校児童生徒数の推移（1991–2024年度）",
      en: "Students absent from school (1991–2024)",
    },
    description: {
      ja: "年間30日以上欠席し病気・経済的理由を除く「不登校」の児童生徒数（小・中学校計）。旧系列（学校基本調査の長期欠席のうち不登校区分）は1991年の66,817人から増加して2001年に138,722人でピークに達し、その後11.7〜12.3万人台で推移した2013年まで。新系列（2015年調査から学校基本調査と生徒指導調査を一本化）では2014年の12.3万人から増加が加速し、2024年（令和6年度）は353,970人と過去最多。ただし増加率は前年度の+15.9%から+2.2%へ大きく低下し、新規不登校は9年ぶりに減少（153,828人）。中学校の1,000人当たり不登校は67.9人。",
      en: "Students (elementary + junior high) absent 30+ days for reasons other than illness or finance. The old series (the nonattendance category of the School Basic Survey's long-absence table) rose from 66,817 (1991) to a 138,722 peak (2001), then drifted in the 117–123 thousand range to 2013. The unified series (surveys merged from 2015) accelerated from 123 thousand (2014) to a record 353,970 (2024). Growth slowed sharply, however, from +15.9% to +2.2%, and new cases fell for the first time in nine years (153,828). The junior-high rate is 67.9 per 1,000 students.",
    },
    years: years(FUTOUKOU_COMBINED),
    series: [
      { key: "total", name: { ja: "小・中計（合計）", en: "Elementary + junior high (total)" }, values: values(FUTOUKOU_COMBINED), kind: "line" },
      { key: "elem", name: { ja: "小学校（新系列）", en: "Elementary (unified series)" }, values: padTo(FUTOUKOU_COMBINED, FUTOUKOU_ELEMENTARY), kind: "line", colorIndex: 2 },
      { key: "jhs", name: { ja: "中学校（新系列）", en: "Junior high (unified series)" }, values: padTo(FUTOUKOU_COMBINED, FUTOUKOU_JHS), kind: "line", colorIndex: 3 },
      { key: "old", name: { ja: "旧系列・合計", en: "Old series · total" }, values: padTo(FUTOUKOU_COMBINED, FUTOUKOU_OLD), kind: "line", dashed: true, colorIndex: 8 },
    ],
    unit: { ja: "人", en: "students" },
    valueKind: "int",
    yLabel: { ja: "児童生徒数（人）", en: "Students" },
    sourceIds: ["mext-shidou-r6", "estat-kihon-nenji"],
    note: {
      ja: "不登校＝年間30日以上欠席（1991年調査から）のうち病気・経済的理由を除く。2014年の接続点では旧系列122,650人と新系列122,897人が約0.2%異なり、厳密な水準接続はない（2015年調査から学校基本調査・生徒指導調査の一本化）。旧系列は1991–2013年、新系列は2014年以降を実線で表示（合計）。新規不登校・継続率の数値は本文。欠席日数の延長や「不登校」概念の受容など、増加の解釈には複数の仮説があり得る。",
      en: "\"Not attending school\" = 30+ days absent per year (basis since the 1991 survey), excluding illness and financial reasons. At the 2014 junction the old (122,650) and unified (122,897) series differ by ~0.2% — no strict level continuity (surveys unified from 2015). Old series 1991–2013, unified 2014 onward, totals solid. New-case and persistence figures in the text. Longer absences and wider acceptance of the concept are among the possible readings of the increase.",
    },
    rangeFilter: true,
  },

  // ----- 11. Life satisfaction ---------------------------------------------------
  {
    id: "ch05-life-satisfaction",
    title: {
      ja: "生徒の生活満足度 — 「満足」以上の割合（2015–2025年）",
      en: "Student life satisfaction — \"satisfied\" or above (2015–2025)",
    },
    description: {
      ja: "PISA生徒質問調査の生活満足度（0〜10段階）で「十分に満足（9-10）」または「満足（7-8）」と回答した生徒の割合。日本は2015年の61.1%から2018年の50.2%へ9.9ポイント低下した後、2022年60.8%、2025年68.9%へ回復し、2015年を上回る水準に達した。平均値は2018年の6.2から2025年7.2へ。OECD平均（2025年70.6%）とおおむね同程度。PISA2018年調査の前後で下落と回復が見られ、その解釈（調査時期の影響等）は不確実性として本文で扱う。",
      en: "Share of students answering \"completely satisfied\" (9–10) or \"satisfied\" (7–8) on the PISA life-satisfaction scale. Japan fell from 61.1% (2015) to 50.2% (2018), then recovered through 60.8% (2022) to 68.9% (2025), exceeding 2015. The mean rose from 6.2 (2018) to 7.2 (2025), roughly matching the OECD average (70.6% in 2025). The dip-and-recovery pattern around 2018 carries interpretive uncertainty (survey timing etc.) discussed in the text.",
    },
    years: LIFE_SATISFACTION_SHARE.map(([y]) => y),
    series: [
      { key: "jpn", name: { ja: "日本", en: "Japan" }, values: LIFE_SATISFACTION_SHARE.map(([, v]) => v.JPN), kind: "line" },
      { key: "oecd", name: { ja: "OECD平均", en: "OECD average" }, values: LIFE_SATISFACTION_SHARE.map(([, v]) => v.OECD), kind: "line", dashed: true, colorIndex: 5 },
    ],
    unit: { ja: "％", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "生徒の割合（％）", en: "Share of students (%)" },
    sourceIds: ["nier-pisa2025"],
    note: {
      ja: "「十分に満足＋満足」の割合は4区分の公表値からの算出値。平均値（0–10）は報告書記載（日本 2015:6.8, 2018:6.2, 2022:6.8, 2025:7.2）。主観的な満足度であり、臨床的な精神保健状態の測定ではない。",
      en: "The \"satisfied+\" share is computed from the four published categories. Means (0–10) as reported (Japan 2015: 6.8, 2018: 6.2, 2022: 6.8, 2025: 7.2). Subjective satisfaction — not a clinical mental-health measure.",
    },
  },

  // ----- 12. University enrollment long-run --------------------------------------
  {
    id: "ch05-university-longrun",
    title: {
      ja: "大学・専修学校の在籍者数の推移（1948–2025年）",
      en: "University and specialized-training college enrollment (1948–2025)",
    },
    description: {
      ja: "学校基本調査（e-Stat時系列）による在籍者数。大学在籍者数は1948年の1.2万人から1970年代の急拡大、2000年代前半の第2次拡大を経て2025年には295万人規模でほぼプラトー状態。一方、専修学校（専門課程を主とする職業教育機関）は1976年の13.1万人から増加し続け、近年は60〜70万人台で大学と補完的な進路を形成している。2025年の高校卒業者の14.4%が専門学校へ進学した。",
      en: "Enrollment from the School Basic Survey long-run tables. University enrollment grew from 12 thousand (1948) through the 1970s expansion and a second expansion in the early 2000s, plateauing at around 2.95 million by 2025. Specialized training colleges — vocationally oriented institutions — grew from 131 thousand (1976) to the 600–700 thousand range, forming a complementary pathway; 14.4% of 2025 upper-secondary graduates progressed to them.",
    },
    years: years(UNIV_ENROLLMENT),
    series: [
      { key: "univ", name: { ja: "大学（学部等）", en: "Universities" }, values: values(UNIV_ENROLLMENT), kind: "area" },
      { key: "senshu", name: { ja: "専修学校", en: "Specialized training colleges" }, values: padTo(UNIV_ENROLLMENT, SENSHU_ENROLLMENT), kind: "line", colorIndex: 6 },
    ],
    unit: { ja: "万人", en: "10k students" },
    valueKind: "float1",
    yLabel: { ja: "在籍者数（万人）", en: "Enrollment (10k)" },
    sourceIds: ["estat-kihon-nenji"],
    note: {
      ja: "在籍者数は公表値（人）を万人換算（10^4）。大学は学部＋大学院を含む計（2025年: 学部等295万人規模、大学院は別表）。専修学校は1976年（専修学校制度創設）以降。通信制課程の別掲は含まない。",
      en: "Enrollment converted from published persons to 10k. Universities include undergraduate + graduate totals; correspondence-course figures are listed separately in the source. Specialized training colleges exist as a category from 1976.",
    },
    rangeFilter: true,
  },

  // ----- 13. Household learning cost ----------------------------------------------
  {
    id: "ch05-learning-cost",
    title: {
      ja: "子供の学習費 — 1人当たり年額 by 学校種（令和5年度・2023年）",
      en: "Household spending per child by school stage (school year 2023)",
    },
    description: {
      ja: "文部科学省「子供の学習費調査」（令和5年度）による、保護者が支出した1人当たりの年間学習費総額。公立小学校36.7万円に対し私立小学校は174.2万円と4.7倍。公立中学校54.2万円に対し私立は156.0万円。高校（全日制）は公立59.7万円・私立117.9万円。幼稚園は公立18.5万円・私立34.7万円（園児の88.3%が私立）。小・中の公立と私立の差額は、学校外教育活動費よりも授業料等の学校教育費が主因。",
      en: "Annual household spending per child from MEXT's 2023 survey. Private elementary school costs 1.742 million yen — 4.7× the public figure of 367 thousand; junior high 1.560 million vs 542 thousand; high school (full-time) 1.179 million vs 597 thousand; kindergarten 347 thousand vs 185 thousand (88.3% of kindergarteners attend private institutions). The public-private gap is driven mainly by school fees rather than out-of-school activities.",
    },
    years: GAKUSHUUHI_2023.map(([k]) => k),
    categories: [
      { ja: "幼稚園・公立", en: "Kindergarten · public" },
      { ja: "幼稚園・私立", en: "Kindergarten · private" },
      { ja: "小学校・公立", en: "Elementary · public" },
      { ja: "小学校・私立", en: "Elementary · private" },
      { ja: "中学校・公立", en: "Junior high · public" },
      { ja: "中学校・私立", en: "Junior high · private" },
      { ja: "高校・公立", en: "High school · public" },
      { ja: "高校・私立", en: "High school · private" },
    ],
    series: [
      { key: "cost", name: { ja: "学習費総額", en: "Total learning cost" }, values: GAKUSHUUHI_2023.map(([, v]) => v), kind: "bar", colorIndex: 9 },
    ],
    unit: { ja: "万円", en: "10k yen" },
    valueKind: "float1",
    yLabel: { ja: "年間学習費総額（万円）", en: "Annual spending (10k yen)" },
    sourceIds: ["mext-gakushuuhi-r5"],
    note: {
      ja: "学習費総額＝学校教育費＋学校外教育活動費等。公表値（円）を万円換算。幼稚園から高校まで15年間全て私立に通った場合の総額は約2,100万円、全て公立の場合は約600万円（同調査の参考試算）。公私立の在籍比率（小学校1.3%・幼稚園88.3%）により、平均的な家庭の負担は図の公立側に近い。",
      en: "Total = school education costs + out-of-school activities. Published yen converted to 10k yen. The survey's own reference case: ~21 million yen for 15 years all-private vs ~6 million all-public. Because only 1.3% of elementary students (88.3% of kindergarteners) attend private schools, the typical household sits near the public figures.",
    },
    horizontal: true,
  },

  // ----- 14. Expenditure per student -----------------------------------------------
  {
    id: "ch05-cost-per-student",
    title: {
      ja: "教育機関支出 — 学生1人当たり by レベル（2023年・USD PPP）",
      en: "Spending per student by education level (2023, USD PPP)",
    },
    description: {
      ja: "OECD Education at a Glance（SDMX）による、教育機関への総支出（公私合計・中核サービス）をFTE学生数で割った1人当たり額。日本は小学校11.0千ドル・中学校等13.0千ドルとOECD平均（13.1・14.5千ドル）を下回る一方、高等教育（短大・大学等）は21.7千ドルとOECD平均（14.9千ドル）を約45%上回る。全レベル計では日本14.2千ドル・OECD平均14.1千ドルでほぼ同等。日本の教育支出は高等教育に相対的に厚い構造である。",
      en: "Total (public + private) core-services spending per full-time-equivalent student from OECD Education at a Glance. Japan spends below the OECD average at primary (11.0 vs 13.1 thousand USD) and secondary (13.0 vs 14.5), but 45% above it in tertiary (21.7 vs 14.9). Across all levels Japan (14.2) is on par with the OECD average (14.1). Japan's education spending tilts relatively heavily toward higher education.",
    },
    years: ["primary", "secondary", "tertiary", "all"],
    categories: [
      { ja: "小学校（ISCED 1）", en: "Primary (ISCED 1)" },
      { ja: "中学校・高校（ISCED 2–3）", en: "Secondary (ISCED 2–3)" },
      { ja: "高等教育（ISCED 5–8）", en: "Tertiary (ISCED 5–8)" },
      { ja: "全レベル（ISCED 1–8）", en: "All levels (ISCED 1–8)" },
    ],
    series: [
      { key: "jpn", name: { ja: "日本", en: "Japan" }, values: ["primary", "secondary", "tertiary", "all"].map((k) => Math.round((PER_STUDENT_BY_LEVEL_2023[k as "primary"].JPN ?? 0) / 100) / 10), kind: "bar" },
      { key: "oecd", name: { ja: "OECD平均", en: "OECD average" }, values: ["primary", "secondary", "tertiary", "all"].map((k) => Math.round((PER_STUDENT_BY_LEVEL_2023[k as "primary"].OECD ?? 0) / 100) / 10), kind: "bar", colorIndex: 5 },
    ],
    unit: { ja: "千米ドル（PPP・現行価格）", en: "thousand USD (PPP, current)" },
    valueKind: "float1",
    yLabel: { ja: "1人当たり年間支出（千USD）", en: "Annual spending per student (k USD)" },
    sourceIds: ["oecd-eag-sdmx"],
    note: {
      ja: "公表値は米ドル（現行PPP）。図は千ドル換算。教育機関への支出（研究開発等は中核サービスから除く）。支出源は公私合計。日本の最新値は2023年。PPP換算は価格水準の差の調整であり、名目為替での比較とは異なる。支出の多寡がそのまま教育の質を示すわけではない。",
      en: "Published in current-price USD PPP; charted in thousands. Spending on educational institutions (core services, excluding R&D ancillary), all funding sources. Japan's latest year is 2023. PPP adjusts for price levels — different from nominal-exchange comparisons. Spending levels are not by themselves measures of education quality.",
    },
    horizontal: true,
  },

  // ----- 15. Employment by attainment ------------------------------------------------
  {
    id: "ch05-employment-attainment",
    title: {
      ja: "雇用率 by 学歴 — 25〜64歳（2025年・国際比較）",
      en: "Employment rate by attainment, ages 25–64 (2025, international)",
    },
    description: {
      ja: "OECD Education at a Glance（SDMX）による学歴別雇用率。日本は高等教育修得（ISCED 5–8）88.3%・上位中等教育修得（ISCED 3–4）83.1%で、その差は5.2ポイントと表示国の中で最小（OECD平均の差は9.6ポイント）。アメリカ（11.8ポイント）やフランス（12.6ポイント）と比べ、日本では学歴間の雇用率の差が小さい。ただし同一労働同一賃金等の待遇差はこの指標では測られない。日本の「中学卒（ISCED 0–2）」行はこのデータセットに存在しないため非表示。",
      en: "Employment rates by attainment from OECD Education at a Glance. Japan's tertiary (88.3%) vs upper-secondary (83.1%) gap of 5.2 points is the smallest among the countries shown (OECD average gap: 9.6), versus 11.8 in the United States and 12.6 in France. The employment penalty for lower attainment is comparatively small in Japan — though treatment differences (equal pay etc.) are not measured here. Japan's below-upper-secondary rows are absent from this dataset and therefore not shown.",
    },
    years: EMP_KEYS,
    categories: EMP_KEYS.map((k) => ({ ja: AREA_JA[k], en: AREA_EN[k] })),
    series: [
      { key: "upper_sec", name: { ja: "上位中等教育修得（ISCED 3–4）", en: "Upper secondary (ISCED 3–4)" }, values: EMP_KEYS.map((k) => empVal(k, "ISCED11A_3_4")), kind: "bar" },
      { key: "tertiary", name: { ja: "高等教育修得（ISCED 5–8）", en: "Tertiary (ISCED 5–8)" }, values: EMP_KEYS.map((k) => empVal(k, "ISCED11A_5T8")), kind: "bar", colorIndex: 2 },
    ],
    unit: { ja: "％", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "雇用率（％）", en: "Employment rate (%)" },
    sourceIds: ["oecd-eag-sdmx"],
    note: {
      ja: "日本の高等教育修得者の雇用率系列（2015年82.3%→2025年88.3%）は本文参照。「中学卒」の日本の行はLSO-NEACデータセットに存在せず（下位中等教育修得者の雇用率）、これは日本の0–2区分の公表データがこの集計に無いことによる。雇用率＝就業者÷同世代人口。2025年（または各国最新年）。",
      en: "Japan's tertiary employment series (82.3% in 2015 → 88.3% in 2025) appears in the text. Japan's below-upper-secondary rows do not exist in the LSO-NEAC dataset — no published 0–2 figures for Japan in this collection. Employment rate = employed ÷ population of the same age. 2025 or each country's latest year.",
    },
    horizontal: true,
  },

  // ----- 16. PIAAC 2012 ---------------------------------------------------------------
  {
    id: "ch05-piaac-2012",
    title: {
      ja: "成人のスキル — PIAAC第1回調査（2011–12年）",
      en: "Adult skills — PIAAC Round 1 (2011–12)",
    },
    description: {
      ja: "OECD国際成人力調査（PIAAC）第1回（2011–12年実施・16〜65歳）の平均得点。日本は読解力296点・数的思考力288点で、いずれも参加国中第1位（OECD平均は273点・269点）。得点分布では上位5%と下位5%の差が129点と参加国中最小（OECD平均152点）で、スキルのばらつきが小さい構造だった。2024年12月に公表された第2回（2023年）調査の結果は本サイトの検証環境から原典確認ができなかったため、本章では図示しない（制限事項参照）。",
      en: "Mean scores from Round 1 of the OECD Survey of Adult Skills (PIAAC, fielded 2011–12, ages 16–65). Japan ranked first among participants in both literacy (296 vs OECD average 273) and numeracy (288 vs 269). Its top-5% to bottom-5% gap of 129 points was the smallest of any participant (OECD average 152) — a comparatively narrow skills distribution. Round 2 (2023) results, published in December 2024, could not be verified from primary sources in this project's environment and are therefore not charted (see limitations).",
    },
    years: ["literacy", "numeracy"],
    categories: [
      { ja: "読解力（リテラシー）", en: "Literacy" },
      { ja: "数的思考力（ニューメラシー）", en: "Numeracy" },
    ],
    series: [
      { key: "jpn", name: { ja: "日本", en: "Japan" }, values: [PIAAC_2012.japan.literacy, PIAAC_2012.japan.numeracy], kind: "bar" },
      { key: "oecd", name: { ja: "OECD平均", en: "OECD average" }, values: [PIAAC_2012.oecd.literacy, PIAAC_2012.oecd.numeracy], kind: "bar", colorIndex: 5 },
    ],
    unit: { ja: "点（0–500尺度）", en: "points (0–500 scale)" },
    valueKind: "int",
    yLabel: { ja: "平均得点（点）", en: "Mean score" },
    sourceIds: ["mext-piaac-2012"],
    note: {
      ja: "第1回調査（2011年8月〜2012年〈日本は2011年8月〜9月実施〉回答料抽出調査）。ITを活用した問題解決能力はコンピュータ調査解答者ベースで日本294点（第1位、参加国の平均283点）。0–500尺度。第2回（2023年）調査の結果の未掲載の理由は本章の制限事項に記載。",
      en: "Round 1 (Japan fielded Aug–Sep 2011), a household sample survey. In problem-solving in technology-rich environments Japan scored 294 (first) among computer-assessment respondents (participant average 283). 0–500 scale. The reason Round 2 (2023) is not shown is documented in this chapter's limitations.",
    },
    horizontal: true,
  },
];
