/**
 * Japan Clarity — Chapter 05 data code generation.
 *
 * Reads research/chapter05/notes/extracted-series.json (produced by
 * research/chapter05/scripts/extract-series.py — anchored extraction with
 * 991+ validation checks against the archived raw official documents) and
 * generates src/chapters/chapter-05/data.ts.
 *
 * Unit conventions (documented so validate-research.ts can mirror them):
 *  - PISA/PIAAC scores: scale points (int as published)
 *  - 進学率/EAG shares: % as published (1 dp)
 *  - 生徒指導調査: persons 件 (int); rates per-1,000 (1 dp)
 *  - 学習費: 円 as published (int) — charted in 万円 (derived, /10^4)
 *  - 在籍者数: 人 as published (int) — charted in 万人 (derived, /10^4)
 *  - EAG expenditure: USD PPP current (int as published)
 *  - PISA questionnaire shares: % (1 dp)
 *
 * Usage: bun run scripts/generate-chapter-05-data.ts
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const sourcePath = resolve(ROOT, "research/chapter05/notes/extracted-series.json");
const targetPath = resolve(ROOT, "src/chapters/chapter-05/data.ts");

const series = JSON.parse(readFileSync(sourcePath, "utf-8")) as Record<string, any>;
const hash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex").slice(0, 16);

const fmt = (v: unknown) =>
  v === null || v === undefined ? "null" : JSON.stringify(v);

function pairs(map: Record<string, number | null>): string {
  const entries = Object.entries(map)
    .map(([year, v]) => [Number(year), v] as const)
    .sort((a, b) => a[0] - b[0]);
  return `[\n${entries.map(([y, v]) => `  [${y}, ${fmt(v)}],`).join("\n")}\n]`;
}

const r1 = (v: number | null | undefined) =>
  v === null || v === undefined ? null : Math.round(v * 10) / 10;

// ---------------------------------------------------------------------------
// PISA — Japan + OECD average (trend-comparable design)
// ---------------------------------------------------------------------------
const pisa = series.pisa;
const PISA_YEARS: Record<string, number[]> = {
  math: [2003, 2006, 2009, 2012, 2015, 2018, 2022, 2025],
  reading: [2000, 2003, 2006, 2009, 2012, 2015, 2018, 2022, 2025],
  science: [2006, 2009, 2012, 2015, 2018, 2022, 2025],
};
function pisaPairs(who: "japan" | "oecd_average", subj: string): string {
  const m = pisa[who][subj];
  return PISA_YEARS[subj]
    .map((y) => `  [${y}, ${m[String(y)] ?? "null"}],`)
    .join("\n");
}

// PISA 2025 international table (OECD-38 comparison)
const intl = pisa.intl_2025_oecd38;

// ---------------------------------------------------------------------------
// 生徒指導調査 R6 (2024 school year)
// ---------------------------------------------------------------------------
const sd = series.shidou_r6;
function sdPairs(cat: string, key: string): string {
  const m = sd[key][cat];
  return Object.keys(m)
    .map((y) => `  [${y}, ${m[y]}],`)
    .join("\n");
}
function sdPairsFlat(key: string): string {
  const m = sd[key];
  return Object.keys(m)
    .map((y) => `  [${y}, ${m[y]}],`)
    .join("\n");
}

// ---------------------------------------------------------------------------
// EAG series
// ---------------------------------------------------------------------------
const att = series.eag_attainment.tertiary_25_64;
const att34 = series.eag_attainment.tertiary_25_34;
const perst = series.eag_perstudent.all_levels_1T8;
const byLevel = series.eag_perstudent.by_level_2023;
const emp = series.eag_employment;
const ecec = series.eag_ecec.ecec_3_5;

// ---------------------------------------------------------------------------
// Long-run enrollment (万人 derived) and 学習費 (万円 derived)
// ---------------------------------------------------------------------------
function toMan(map: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [y, v] of Object.entries(map)) out[y] = Math.round((v / 1e4) * 10) / 10;
  return out;
}
const univMan = toMan(series.longrun_enrollment.univ_enrollment);
const senshuMan = toMan(series.longrun_enrollment.senshu_enrollment);
const gk = series.gakushuuhi_r5.total_by_stage_2023;
function toManY(v: number): number {
  return Math.round((v / 1e4) * 10) / 10;
}

// 生活満足度 derived share (十分に満足 + 満足)
const ls = series.pisa2025_extra.life_satisfaction;
const lsShare: Record<string, { JPN: number; OECD: number | null }> = {};
for (const y of Object.keys(ls.japan)) {
  const j = ls.japan[y];
  lsShare[y] = { JPN: r1(j[0] + j[1])!, OECD: ls.oecd[y] ? r1(ls.oecd[y][0] + ls.oecd[y][1]) : null };
}

// 不登校 combined long series: old basis 1991-2013 + new basis 2014-2024 (break documented)
const futoukouNew = sd.futoukou["合計"];
const futoukouOld = series.longrun_enrollment.chouki_futoukou_old_series;
const futoukouOldUse: Record<string, number> = {};
for (const [y, v] of Object.entries(futoukouOld)) {
  if (Number(y) <= 2013) futoukouOldUse[y] = v; // 2014 overlap shown from the new series
}

const univF = series.shingakuritsu.series;
const headline = {
  pisa2025: {
    science: pisa.japan.science["2025"],
    reading: pisa.japan.reading["2025"],
    math: pisa.japan.math["2025"],
    oecd: { science: pisa.oecd_average.science["2025"], reading: pisa.oecd_average.reading["2025"], math: pisa.oecd_average.math["2025"] },
  },
  ijime2024: sd.ijime["計"]["2024"],
  futoukou2024: futoukouNew["2024"],
  suicide2024: sd.suicide["2024"],
  dropout2024: sd.dropout["2024"],
  univProgression2025: univF.univ_freshman_progression["2025"],
  foreignStudents2025: series.schoolbasic_r7r8.foreign_students_univ["2025"],
  ecec2024: ecec.JPN["2024"],
  tertiary2025: { JPN: r1(att.JPN["2025"])!, OECD: r1(att.OECD["2025"])! },
  piaac2012: series.piaac_2012.japan,
};

const out = `/**
 * Japan Clarity — Chapter 05 verified data series (Education & Talent).
 *
 * GENERATED FILE — do not edit by hand.
 * Generated by scripts/generate-chapter-05-data.ts from
 * research/chapter05/notes/extracted-series.json
 * (anchored extraction validated against archived raw official documents;
 *  see research/chapter05/notes/*.md for verbatim source quotes).
 *
 * Source snapshot sha256 (first 16 hex): ${hash}
 * Access/verification date: 2026-10-27.
 *
 * Pair arrays are [year, value]; null = value not published for that year.
 * Units: PISA/PIAAC scores are scale points (NOT percentages); 進学率/EAG
 * shares %; 生徒指導調査 counts 人/件 and per-1,000 rates; 在籍者数 万人
 * (derived = published 人 ÷ 10^4); 学習費 万円 (derived = published 円 ÷ 10^4);
 * EAG expenditure USD PPP (current prices); PISA questionnaire shares %.
 */

// ===== PISA (OECD生徒の学習到達度調査) — Japan vs OECD average =====

/** Japan mean score, mathematical literacy (数学的リテラシー) 2003–2025. */
export const PISA_JPN_MATH: ReadonlyArray<[number, number | null]> = [
${pisaPairs("japan", "math")}
];

/** Japan mean score, reading (読解力) 2000–2025. */
export const PISA_JPN_READING: ReadonlyArray<[number, number | null]> = [
${pisaPairs("japan", "reading")}
];

/** Japan mean score, science (科学的リテラシー／2025年から科学コンピテンシー) 2006–2025. */
export const PISA_JPN_SCIENCE: ReadonlyArray<[number, number | null]> = [
${pisaPairs("japan", "science")}
];

/** OECD average mean score, mathematical literacy 2003–2025. */
export const PISA_OECD_MATH: ReadonlyArray<[number, number | null]> = [
${pisaPairs("oecd_average", "math")}
];

/** OECD average mean score, reading 2000–2025. */
export const PISA_OECD_READING: ReadonlyArray<[number, number | null]> = [
${pisaPairs("oecd_average", "reading")}
];

/** OECD average mean score, science 2006–2025. */
export const PISA_OECD_SCIENCE: ReadonlyArray<[number, number | null]> = [
${pisaPairs("oecd_average", "science")}
];

/** PISA 2025 OECD-38 comparison, science (科学コンピテンシー, 中心分野). */
export const PISA_2025_INTL_SCIENCE: ReadonlyArray<[string, number]> = [
${Object.entries(intl.science).map(([k, v]) => `  ["${k}", ${v}],`).join("\n")}
];

/** PISA 2025 OECD-38 comparison, reading (読解力). */
export const PISA_2025_INTL_READING: ReadonlyArray<[string, number]> = [
${Object.entries(intl.reading).map(([k, v]) => `  ["${k}", ${v}],`).join("\n")}
];

/** PISA 2025 OECD-38 comparison, mathematical literacy. */
export const PISA_2025_INTL_MATH: ReadonlyArray<[string, number]> = [
${Object.entries(intl.math).map(([k, v]) => `  ["${k}", ${v}],`).join("\n")}
];

/** Japan 2025 confidence intervals (report-stated, scale points). */
export const PISA_2025_CI: Record<string, [number, number]> = ${JSON.stringify(pisa.japan_2025_ci)};

/** Science proficiency shares, Japan 2006–2025 (levels 1以下,2,3,4,5,6以上, %). */
export const PISA_PROF_JAPAN: ReadonlyArray<[number, number[]]> = [
${Object.entries(series.pisa2025_extra.proficiency_science.japan).map(([y, v]) => `  [${y}, ${JSON.stringify(v)}],`).join("\n")}
];

/** Science proficiency shares, OECD average 2006–2025 (%). */
export const PISA_PROF_OECD: ReadonlyArray<[number, number[]]> = [
${Object.entries(series.pisa2025_extra.proficiency_science.oecd).map(([y, v]) => `  [${y}, ${JSON.stringify(v)}],`).join("\n")}
];

// ===== 学校基本調査 — 進学率 =====

/** 高等学校等への進学率（通信制課程（本科）への進学者を除く, %）1950–2025. */
export const HS_PROGRESSION_EXCL_COMM: ReadonlyArray<[number, number | null]> =
${pairs(univF.hs_progression_excl_comm as Record<string, number | null>)};

/** 大学・短期大学等への現役進学率（計, %）1984–2025 (確報再算定系列). */
export const UNIV_FRESHMAN_PROGRESSION: ReadonlyArray<[number, number | null]> =
${pairs(univF.univ_freshman_progression as Record<string, number | null>)};

/** 大学・短期大学等への現役進学率（男, %）1984–2025. */
export const UNIV_FRESHMAN_PROGRESSION_M: ReadonlyArray<[number, number | null]> =
${pairs(univF.univ_freshman_progression_m as Record<string, number | null>)};

/** 大学・短期大学等への現役進学率（女, %）1984–2025. */
export const UNIV_FRESHMAN_PROGRESSION_F: ReadonlyArray<[number, number | null]> =
${pairs(univF.univ_freshman_progression_f as Record<string, number | null>)};

/** R7 (2025) 高卒進路構成 (%, 学校基本調査確報概要). */
export const HS_DESTINATIONS_2025: ReadonlyArray<[string, number]> = [
  ["univ", 58.3],
  ["junior", 3.1],
  ["senmon", 14.4],
  ["employment", 13.8],
  ["other", 10.4],
];

// ===== 生徒指導調査 (R6 = 2024学校年度) =====

/** いじめ認知件数 — 合計 (件) 2013–2024. */
export const IJIME_TOTAL: ReadonlyArray<[number, number | null]> = [
${sdPairs("計", "ijime")}
];

/** いじめ認知件数 — 小学校 (件) 2013–2024. */
export const IJIME_ELEMENTARY: ReadonlyArray<[number, number | null]> = [
${sdPairs("小学校", "ijime")}
];

/** いじめ認知件数 — 中学校 (件) 2013–2024. */
export const IJIME_JHS: ReadonlyArray<[number, number | null]> = [
${sdPairs("中学校", "ijime")}
];

/** いじめ認知件数 — 高等学校＋特別支援学校 (件, derived sum) 2013–2024. */
export const IJIME_HS_SP: ReadonlyArray<[number, number | null]> = [
${Object.keys(sd.ijime["高等学校"]).map((y) => `  [${y}, ${Math.round((sd.ijime["高等学校"][y] + sd.ijime["特別支援"][y]))}],`).join("\n")}
];

/** いじめ認知件数 — 1,000人当たり (件/千人) 2013–2024. */
export const IJIME_RATE: ReadonlyArray<[number, number | null]> = [
${sdPairs("計", "ijime_rate_per_1000")}
];

/** ネットいじめ認知件数 (「パソコンや携帯電話等で、ひぼう・中傷や嫌なことをされる。」件) 2013–2024. */
export const NET_IJIME: ReadonlyArray<[number, number | null]> = [
${sdPairsFlat("net_ijime")}
];

/** 不登校児童生徒数（年間30日以上欠席・病気/経済的理由除く）— 旧基準系列 1991–2013 (人). */
export const FUTOUKOU_OLD: ReadonlyArray<[number, number | null]> =
${pairs(futoukouOldUse as Record<string, number | null>)};

/** 不登校児童生徒数 — 小・中計 (人) 2014–2024 (新系列). */
export const FUTOUKOU_TOTAL: ReadonlyArray<[number, number | null]> = [
${sdPairs("合計", "futoukou")}
];

/** 不登校児童生徒数 — 小学校 (人) 2014–2024. */
export const FUTOUKOU_ELEMENTARY: ReadonlyArray<[number, number | null]> = [
${sdPairs("小学校", "futoukou")}
];

/** 不登校児童生徒数 — 中学校 (人) 2014–2024. */
export const FUTOUKOU_JHS: ReadonlyArray<[number, number | null]> = [
${sdPairs("中学校", "futoukou")}
];

/** 不登校 — 1,000人当たり (人/千人, 小・中計) 2014–2024. */
export const FUTOUKOU_RATE: ReadonlyArray<[number, number | null]> = [
${sdPairs("合計", "futoukou_rate_per_1000")}
];

/** 新規不登校児童生徒数 — 小・中計 (人) 2014–2024. */
export const FUTOUKOU_NEW_CASES: ReadonlyArray<[number, number | null]> = [
${sdPairsFlat("shinki_futoukou")}
];

/** 重大事態発生件数 (いじめ防止対策推進法28条1項, 件) 2013–2024. */
export const IJIME_JUDAITAI: ReadonlyArray<[number, number | null]> = [
${sd.judaitai.years.map((y: string, i: number) => `  [${y}, ${sd.judaitai.total[i]}],`).join("\n")}
];

// ===== PISA 2025 質問調査 (well-being) =====

/** 生活満足度 — 「十分に満足＋満足」回答割合 (%, derived from category shares). */
export const LIFE_SATISFACTION_SHARE: ReadonlyArray<[number, { JPN: number | null; OECD: number | null }]> = [
${Object.entries(lsShare).map(([y, v]) => `  [${y}, ${JSON.stringify(v)}],`).join("\n")}
];

/** 生活満足度平均 (0–10, PISA報告書記載). */
export const LIFE_SATISFACTION_MEAN: ReadonlyArray<[number, { JPN: number | null; OECD: number | null }]> = [
${[["2015", 6.8], ["2018", 6.2], ["2022", 6.8], ["2025", 7.2]].map(([y, j]) => `  [${y}, ${JSON.stringify({ JPN: j, OECD: { 2015: 7.3, 2018: 7.0, 2022: 6.7, 2025: 7.2 }[y as string] ?? null })}],`).join("\n")}
];

/** 学校への所属感 (2025, 「学校の一員だと感じている」肯定回答割合 %). */
export const SCHOOL_BELONGING_2025 = ${JSON.stringify(series.pisa2025_extra.belonging_2025)};

/** 家庭による支援的な関わり指標 (2025, 標準化指標; OECD平均0・SD1). */
export const FAMILY_SUPPORT_INDEX_2025 = ${JSON.stringify(series.pisa2025_extra.family_support_index_2025)};

// ===== EAG (OECD) =====

/** 高等教育修得率 25–64歳 (%, ISCED 5-8) 1997/1998–2025. */
export const TERTIARY_25_64: Record<string, ReadonlyArray<[number, number | null]>> = {
${Object.entries(att).map(([k, m]) => `  ${JSON.stringify(k)}: ${pairs(m as Record<string, number | null>)},`).join("\n")}
};

/** 高等教育修得率 25–34歳 (%) — 日本・OECD平均・韓国. */
export const TERTIARY_25_34: Record<string, ReadonlyArray<[number, number | null]>> = {
${Object.entries(att34).map(([k, m]) => `  ${JSON.stringify(k)}: ${pairs(m as Record<string, number | null>)},`).join("\n")}
};

/** 教育機関支出 per FTE学生 — 全レベル (ISCED 1–8), USD PPP current. */
export const PER_STUDENT_1T8: Record<string, ReadonlyArray<[number, number | null]>> = {
${Object.entries(perst).map(([k, m]) => `  ${JSON.stringify(k)}: ${pairs(m as Record<string, number | null>)},`).join("\n")}
};

/** 教育機関支出 per FTE学生 2023 — レベル別 (USD PPP current, 日本 vs OECD平均). */
export const PER_STUDENT_BY_LEVEL_2023 = {
  primary: { JPN: ${byLevel.ISCED11_1.JPN ?? "null"}, OECD: ${byLevel.ISCED11_1.OECD ?? "null"} },
  secondary: { JPN: ${byLevel.ISCED11_2_3.JPN ?? "null"}, OECD: ${byLevel.ISCED11_2_3.OECD ?? "null"} },
  tertiary: { JPN: ${byLevel.ISCED11_5T8.JPN ?? "null"}, OECD: ${byLevel.ISCED11_5T8.OECD ?? "null"} },
  all: { JPN: ${perst.JPN["2023"] ?? "null"}, OECD: ${perst.OECD["2023"] ?? "null"} },
};

/** 25–64歳雇用率 by 学歴 (%, 2025 or latest) — 日本の「中学卒」行はデータセットに無し(開示済み). */
export const EMPLOYMENT_BY_ATTAINMENT: Record<string, Record<string, number>> = ${JSON.stringify(emp.latest_by_area)};

/** 日本の高等教育修得者(25–64)雇用率系列 (%, 2015–2025). */
export const JPN_EMPRATE_TERTIARY: ReadonlyArray<[number, number | null]> =
${pairs(emp.japan_tertiary_series as Record<string, number | null>)};

/** 就学前教育(ECEC)参加率 — 3–5歳 (%, ISCED 0). */
export const ECEC_3_5: Record<string, ReadonlyArray<[number, number | null]>> = {
${Object.entries(ecec).map(([k, m]) => `  ${JSON.stringify(k)}: ${pairs(m as Record<string, number | null>)},`).join("\n")}
};

// ===== PIAAC 2012 (第1回国際成人力調査) =====

/** PIAAC 2012 平均得点 (0–500尺度): literacy / numeracy / IT問題解決. */
export const PIAAC_2012 = {
  japan: ${JSON.stringify(series.piaac_2012.japan)},
  oecd: ${JSON.stringify(series.piaac_2012.oecd_average)},
  equity_gap: ${JSON.stringify(series.piaac_2012.equity_top5_bottom5_gap)},
};

// ===== 在籍者数 long-run (万人, derived) =====

/** 大学在籍者数 (万人, 1948–2025). */
export const UNIV_ENROLLMENT: ReadonlyArray<[number, number | null]> =
${pairs(univMan as Record<string, number | null>)};

/** 専修学校在籍者数 (万人, 1976–最新). */
export const SENSHU_ENROLLMENT: ReadonlyArray<[number, number | null]> =
${pairs(senshuMan as Record<string, number | null>)};

// ===== 子供の学習費調査 R5 (2023) =====

/** 学習費総額 by 学校種・公私 (万円, derived = 円 ÷ 10^4). */
export const GAKUSHUUHI_2023: ReadonlyArray<[string, number]> = [
  ["youchien_pub", ${toManY(gk["幼稚園_公立"])}],
  ["youchien_priv", ${toManY(gk["幼稚園_私立"])}],
  ["elem_pub", ${toManY(gk["小学校_公立"])}],
  ["elem_priv", ${toManY(gk["小学校_私立"])}],
  ["jhs_pub", ${toManY(gk["中学校_公立"])}],
  ["jhs_priv", ${toManY(gk["中学校_私立"])}],
  ["hs_pub", ${toManY(gk["高等学校全日制_公立"])}],
  ["hs_priv", ${toManY(gk["高等学校全日制_私立"])}],
];

/** 外国人学生（国籍ベース, 大学）R6–R7 (人). */
export const FOREIGN_STUDENTS_UNIV: ReadonlyArray<[number, number | null]> = [
${Object.entries(series.schoolbasic_r7r8.foreign_students_univ).map(([y, v]) => `  [${y}, ${v}],`).join("\n")}
];

// ===== Headline 2025 snapshot (for stats blocks) =====

/** Headline values quoted in chapter text (all machine-verified). */
export const HEADLINE = ${JSON.stringify(headline, null, 2)} as const;

/** sha256 (first 16 hex) of the source extraction JSON this module was generated from. */
export const DATA_SNAPSHOT_HASH = "${hash}";
`;

writeFileSync(targetPath, out, "utf-8");
console.log(`source snapshot hash: ${hash}`);
console.log(`wrote ${targetPath}`);
