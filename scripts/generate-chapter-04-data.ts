/**
 * Japan Clarity — Chapter 04 data code generation.
 *
 * Reads research/chapter04/notes/extracted-series.json (produced by
 * research/chapter04/scripts/extract-series.py — anchored extraction with
 * 192 validation checks against the archived raw official documents) and
 * generates src/chapters/chapter-04/data.ts.
 *
 * Unit conventions (documented so validate-research.ts can mirror them):
 *  - LFS counts: source 万人 as published (1 dp where published)
 *  - LFS rates: % as published (1 dp)
 *  - 非正規 share: % as published (1 dp); counts 万人
 *  - MLS hours: hours/month as published (1 dp); workers: persons (int)
 *  - Paid leave: days (1 dp) and % (1 dp) as published
 *  - 賃金構造 wages: 千円/month as published (1 dp); ratios/gaps: index (1 dp)
 *  - Accidents: persons (int) as published
 *  - Mental-health comp: 件 (int)
 *  - OECD hours: hours/year per worker as published; temp/gwg: %
 *
 * Usage: bun run scripts/generate-chapter-04-data.ts
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const sourcePath = resolve(ROOT, "research/chapter04/notes/extracted-series.json");
const targetPath = resolve(ROOT, "src/chapters/chapter-04/data.ts");

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

function kv(obj: Record<string, any>, indent = "  "): string {
  return Object.entries(obj)
    .map(([k, v]) => `${indent}${JSON.stringify(k)}: ${typeof v === "object" ? JSON.stringify(v) : JSON.stringify(v)},`)
    .join("\n");
}

// ---------------------------------------------------------------------------
// LFS — employment status & rates
// ---------------------------------------------------------------------------
const main = series.lfs.main as Record<string, any>;
const status = series.lfs.status as Record<string, any>;
const age = series.lfs.age as Record<string, any>;

const EMPLOYED_TOTAL = pairs(Object.fromEntries(
  Object.entries(main).map(([y, d]) => [y, (d as any).employed])));
const UNEMPLOYMENT_RATE = pairs(Object.fromEntries(
  Object.entries(main).map(([y, d]) => [y, (d as any).unemprate])));
const EMPLOYMENT_RATE = pairs(Object.fromEntries(
  Object.entries(main).map(([y, d]) => [y, (d as any).emprate])));

const STATUS_SELFEMPLOYED = pairs(Object.fromEntries(
  Object.entries(status).map(([y, d]) => [y, (d as any).selfemployed])));
const STATUS_FAMILY = pairs(Object.fromEntries(
  Object.entries(status).map(([y, d]) => [y, (d as any).family])));
const STATUS_EMPLOYEE = pairs(Object.fromEntries(
  Object.entries(status).map(([y, d]) => [y, (d as any).employee])));

// 65+ employment rate (from 表3(3) 就業率 columns), 1968–2025
const OLDER_EMPRATE_65 = pairs(Object.fromEntries(
  Object.entries(age).map(([y, d]) => [y, (d as any)["65+_rate"]])));
const OLDER_EMPRATE_6064 = pairs(Object.fromEntries(
  Object.entries(age).map(([y, d]) => [y, (d as any)["60-64_rate"]])));

// 2025 snapshot: age-specific employment rates (for the text)
const age25 = age["2025"] as any;
const AGE_EMPRATE_2025 = Object.entries({
  "15-19": age25["15-19_rate"], "20-24": age25["20-24_rate"],
  "25-29": age25["25-29_rate"], "30-34": age25["30-34_rate"],
  "35-39": age25["35-39_rate"], "40-44": age25["40-44_rate"],
  "45-49": age25["45-49_rate"], "50-54": age25["50-54_rate"],
  "55-59": age25["55-59_rate"], "60-64": age25["60-64_rate"],
  "65+": age25["65+_rate"],
});

// ---------------------------------------------------------------------------
// LFS — employment form (詳細集計 表10-1)
// ---------------------------------------------------------------------------
const form = series.lfs.form as any;
const formTotal = form.total as Record<string, any>;
const formMale = form.male as Record<string, any>;
const formFemale = form.female as Record<string, any>;

const NONREGULAR_SHARE = {
  total: pairs(Object.fromEntries(Object.entries(formTotal).map(([y, d]) => [y, (d as any).nonregular_share]))),
  male: pairs(Object.fromEntries(Object.entries(formMale).map(([y, d]) => [y, (d as any).nonregular_share]))),
  female: pairs(Object.fromEntries(Object.entries(formFemale).map(([y, d]) => [y, (d as any).nonregular_share]))),
};
const NONREGULAR_COUNT = pairs(Object.fromEntries(
  Object.entries(formTotal).map(([y, d]) => [y, (d as any).nonregular])));
const REGULAR_COUNT = pairs(Object.fromEntries(
  Object.entries(formTotal).map(([y, d]) => [y, (d as any).regular])));

const age2025 = form.age2025 as Record<string, any>;
const NONREGULAR_AGE_2025 = Object.entries({
  "15-24": age2025["15-24"].nonregular_share,
  "25-34": age2025["25-34"].nonregular_share,
  "35-44": age2025["35-44"].nonregular_share,
  "45-54": age2025["45-54"].nonregular_share,
  "55-64": age2025["55-64"].nonregular_share,
  "65+": age2025["65+"].nonregular_share,
});

const reasons = (series.lfs.detail2025 as any).reasons2025 as Record<string, any>;
const REASONS_2025 = Object.entries(reasons).map(([k, v]) => [k, v.total_share] as [string, number]);

// ---------------------------------------------------------------------------
// MLS — hours
// ---------------------------------------------------------------------------
const mls = series.mls as any;
const HOURS_TOTAL_30 = pairs(Object.fromEntries(
  Object.entries(mls.scale30 as Record<string, any>).map(([y, d]) => [y, (d as any).total])));
const HOURS_TOTAL_5 = pairs(Object.fromEntries(
  Object.entries(mls.scale5 as Record<string, any>).map(([y, d]) => [y, (d as any).total])));
const HOURS_OVERTIME_5 = pairs(Object.fromEntries(
  Object.entries(mls.scale5 as Record<string, any>).map(([y, d]) => [y, (d as any).overtime])));
const HOURS_GENERAL = pairs(Object.fromEntries(
  Object.entries(mls.general as Record<string, any>).map(([y, d]) => [y, (d as any).total])));
const HOURS_PARTTIME = pairs(Object.fromEntries(
  Object.entries(mls.parttime as Record<string, any>).map(([y, d]) => [y, (d as any).total])));
const PARTTIME_RATIO = pairs(mls.parttime_ratio as Record<string, number>);

// ---------------------------------------------------------------------------
// Paid leave
// ---------------------------------------------------------------------------
const pl = series.paidLeave as any;
const LEAVE_RATE = pairs(pl.rate as Record<string, number>);
const LEAVE_GRANTED = pairs(pl.granted as Record<string, number>);
const LEAVE_TAKEN = pairs(pl.taken as Record<string, number>);

// ---------------------------------------------------------------------------
// Wage structure survey
// ---------------------------------------------------------------------------
const wage = series.wage as any;
const GENDER_WAGE_RATIO = pairs(Object.fromEntries(
  Object.entries(wage.gender as Record<string, any>).map(([y, d]) => [y, (d as any).ratio])));
const FORM_WAGE_GAP = pairs(Object.fromEntries(
  Object.entries(wage.form as Record<string, any>).map(([y, d]) => [y, (d as any).gap])));

const curve = wage.curve2025 as Record<string, any>;
const CURVE_AGES: [string, string][] = [
  ["～１９歳", "15-19"], ["２０～２４", "20-24"], ["２５～２９", "25-29"],
  ["３０～３４", "30-34"], ["３５～３９", "35-39"], ["４０～４４", "40-44"],
  ["４５～４９", "45-49"], ["５０～５４", "50-54"], ["５５～５９", "55-59"],
  ["６０～６４", "60-64"], ["６５～６９", "65-69"],
];
const WAGE_CURVE_MALE = CURVE_AGES.map(([k]) => curve[k]?.male ?? null);
const WAGE_CURVE_FEMALE = CURVE_AGES.map(([k]) => curve[k]?.female ?? null);

const gapAge = wage.formGapByAge2025 as Record<string, any>;
const GAP_AGES: [string, string][] = [
  ["～１９歳", "15-19"], ["２０～２４", "20-24"], ["２５～２９", "25-29"],
  ["３０～３４", "30-34"], ["３５～３９", "35-39"], ["４０～４４", "40-44"],
  ["４５～４９", "45-49"], ["５０～５４", "50-54"], ["５５～５９", "55-59"],
  ["６０～６４", "60-64"], ["６５～６９", "65-69"],
];
const FORM_GAP_BY_AGE = GAP_AGES.map(([k]) => gapAge[k]?.gap ?? null);

// ---------------------------------------------------------------------------
// Accidents
// ---------------------------------------------------------------------------
const acc = series.accidents as any;
const ACCIDENT_DEATH = pairs(acc.death as Record<string, number>);
const ACCIDENT_INJURY = pairs(acc.injury as Record<string, number>);
const MENTAL = acc.mental as Record<string, any>;
const MENTAL_CLAIMS = pairs(Object.fromEntries(Object.entries(MENTAL).map(([y, d]) => [y, (d as any).claims])));
const MENTAL_DECISIONS = pairs(Object.fromEntries(Object.entries(MENTAL).map(([y, d]) => [y, (d as any).decisions])));
const MENTAL_GRANTED = pairs(Object.fromEntries(Object.entries(MENTAL).map(([y, d]) => [y, (d as any).granted])));

// ---------------------------------------------------------------------------
// OECD
// ---------------------------------------------------------------------------
const oecd = series.oecd as any;
const hours = oecd.hours as Record<string, Record<string, number>>;
const AREA_ORDER = ["DEU", "FRA", "SWE", "NLD", "ESP", "ITA", "AUS", "GBR", "CAN", "OECD", "USA", "JPN", "KOR"];
const latestHours: [string, number, number][] = AREA_ORDER.map((a) => {
  const d = hours[a];
  const yrs = Object.keys(d).map(Number).sort((x, y) => y - x);
  const y = yrs.find((yy) => yy <= 2025) ?? yrs[0];
  return [a, y, d[String(y)]];
});
const OECD_HOURS_LATEST = latestHours.map(([a, y, v]) => `  ["${a}", ${y}, ${v}],`).join("\n");
const OECD_HOURS_JPN = pairs(hours["JPN"]);
const OECD_NAMES: Record<string, [string, string]> = {
  JPN: ["日本", "Japan"], USA: ["アメリカ", "United States"], DEU: ["ドイツ", "Germany"],
  FRA: ["フランス", "France"], GBR: ["イギリス", "United Kingdom"], ITA: ["イタリア", "Italy"],
  CAN: ["カナダ", "Canada"], AUS: ["オーストラリア", "Australia"], KOR: ["韓国", "Korea"],
  ESP: ["スペイン", "Spain"], SWE: ["スウェーデン", "Sweden"], NLD: ["オランダ", "Netherlands"],
  OECD: ["OECD平均", "OECD average"],
};

const gwg = oecd.gwg as Record<string, Record<string, Record<string, number>>>;
const gwgLatest: [string, number, number][] = AREA_ORDER.map((a) => {
  const d = gwg[a]?.["MEDIAN"] ?? {};
  const yrs = Object.keys(d).map(Number).sort((x, y) => y - x);
  const y = yrs.find((yy) => yy <= 2025) ?? yrs[0];
  return [a, y, d[String(y)]];
});
const OECD_GWG_LATEST = gwgLatest.map(([a, y, v]) => `  ["${a}", ${y}, ${v}],`).join("\n");
const OECD_GWG_JPN_MEDIAN = pairs(gwg["JPN"]["MEDIAN"]);
const OECD_TEMP_JPN = pairs(oecd.temp["JPN"]);

// ---------------------------------------------------------------------------
const t25 = main["2025"] as any;
const f25 = formTotal["2025"] as any;
const m25 = (mls.scale5 as Record<string, any>)["2025"] as any;
const w25 = (wage.gender as Record<string, any>)["2025"] as any;
const fw25 = (wage.form as Record<string, any>)["2025"] as any;

const out = `/**
 * Japan Clarity — Chapter 04 verified data series (Labor & Working Conditions).
 *
 * GENERATED FILE — do not edit by hand.
 * Generated by scripts/generate-chapter-04-data.ts from
 * research/chapter04/notes/extracted-series.json
 * (anchored extraction validated against archived raw official documents;
 *  see research/chapter04/notes/*.md for verbatim source quotes).
 *
 * Source snapshot sha256 (first 16 hex): ${hash}
 * Access/verification date: 2026-10-26.
 *
 * Pair arrays are [year, value]; null = value not published for that year.
 * Units: LFS counts 万人 (10k persons); rates %; MLS hours h/month; workers 人;
 * paid leave 日 / %; 賃金構造 wages 千円/month, ratios are indices (male=100 or
 * regular=100); accidents 人; mental-health comp 件 (fiscal years); OECD hours
 * h/year per worker; OECD temp/gwg %.
 */

// ===== Labour Force Survey (労働力調査) — 基本集計 長期時系列 =====

/** Employed persons (就業者, 万人) — 1953: 3,913; 2025: 6,828. */
export const EMPLOYED_TOTAL: ReadonlyArray<[number, number | null]> =
${EMPLOYED_TOTAL};

/** Unemployment rate (完全失業率, %) — 2002 peak: 5.4; 2025: 2.5. */
export const UNEMPLOYMENT_RATE: ReadonlyArray<[number, number | null]> =
${UNEMPLOYMENT_RATE};

/** Employment-to-population rate, 15+ (就業率, %) — 2025: 62.2. */
export const EMPLOYMENT_RATE: ReadonlyArray<[number, number | null]> =
${EMPLOYMENT_RATE};

/** Self-employed (自営業主, 万人) — 1953: 991; 2025: 499. */
export const STATUS_SELFEMPLOYED: ReadonlyArray<[number, number | null]> =
${STATUS_SELFEMPLOYED};

/** Unpaid family workers (家族従業者, 万人) — 1953: 1,262; 2025: 115. */
export const STATUS_FAMILY: ReadonlyArray<[number, number | null]> =
${STATUS_FAMILY};

/** Employees (雇用者, 万人) — 1953: 1,660; 2025: 6,185. */
export const STATUS_EMPLOYEE: ReadonlyArray<[number, number | null]> =
${STATUS_EMPLOYEE};

/** Employment rate, 65+ (65歳以上就業率, %) — 1968: 33.3; 2025: 26.0. */
export const OLDER_EMPRATE_65: ReadonlyArray<[number, number | null]> =
${OLDER_EMPRATE_65};

/** Employment rate, 60–64 (60～64歳就業率, %) — 1968: 59.2; 2025: 74.9. */
export const OLDER_EMPRATE_6064: ReadonlyArray<[number, number | null]> =
${OLDER_EMPRATE_6064};

/** Age-specific employment rates 2025 (%) — for text reference. */
export const AGE_EMPRATE_2025: ReadonlyArray<[string, number]> = [
${AGE_EMPRATE_2025.map(([k, v]) => `  ["${k}", ${v}],`).join("\n")}
];

// ===== LFS 詳細集計 長期表10(1) — 雇用形態別 (2002–2025) =====
// Non-regular share = 非正規の職員・従業員 ÷ 役員を除く雇用者 (published rate).

/** Non-regular share of employees excl. executives, both sexes (%) — 2002: 29.4; 2025: 36.5. */
export const NONREGULAR_SHARE_TOTAL: ReadonlyArray<[number, number | null]> =
${NONREGULAR_SHARE.total};

/** Non-regular share, men (%) — 2025: 25.9. */
export const NONREGULAR_SHARE_MALE: ReadonlyArray<[number, number | null]> =
${NONREGULAR_SHARE.male};

/** Non-regular share, women (%) — 2002: 45.9; 2025: 52.4. */
export const NONREGULAR_SHARE_FEMALE: ReadonlyArray<[number, number | null]> =
${NONREGULAR_SHARE.female};

/** Non-regular employees (非正規の職員・従業員, 万人) — 2002: 1,451; 2025: 2,128. */
export const NONREGULAR_COUNT: ReadonlyArray<[number, number | null]> =
${NONREGULAR_COUNT};

/** Regular employees (正規の職員・従業員, 万人) — 2002: 3,489; 2025: 3,700. */
export const REGULAR_COUNT: ReadonlyArray<[number, number | null]> =
${REGULAR_COUNT};

/** Non-regular share by age group, 2025 (%) — U-shape: 15–24: 52.7 … 65+: 76.1. */
export const NONREGULAR_AGE_2025: ReadonlyArray<[string, number]> = [
${NONREGULAR_AGE_2025.map(([k, v]) => `  ["${k}", ${v}],`).join("\n")}
];

/** Reasons for current non-regular job, 2025 (% of non-regular employees). */
export const NONREGULAR_REASONS_2025: ReadonlyArray<[string, number]> = [
${REASONS_2025.map(([k, v]) => `  [${JSON.stringify(k)}, ${v}],`).join("\n")}
];

// ===== 毎月勤労統計調査 (Monthly Labour Survey) — hours =====

/** Total actual hours/month, establishments 30+ (調査産業計) — 1970: 186.6; 2025: 141.1. */
export const HOURS_TOTAL_30: ReadonlyArray<[number, number | null]> =
${HOURS_TOTAL_30};

/** Total actual hours/month, establishments 5+ — 1990: 172.0; 2025: 135.1. */
export const HOURS_TOTAL_5: ReadonlyArray<[number, number | null]> =
${HOURS_TOTAL_5};

/** Overtime hours/month (所定外), 5+ — 1990: 13.0; 2025: 9.8. */
export const HOURS_OVERTIME_5: ReadonlyArray<[number, number | null]> =
${HOURS_OVERTIME_5};

/** General (non-part-time) workers' actual hours/month — 1993: 170.4; 2025: 160.5. */
export const HOURS_GENERAL: ReadonlyArray<[number, number | null]> =
${HOURS_GENERAL};

/** Part-time workers' actual hours/month — 1993: 98.7; 2025: 79.1. */
export const HOURS_PARTTIME: ReadonlyArray<[number, number | null]> =
${HOURS_PARTTIME};

/** Part-time share of workers (%, month-end, 5+) — 1990: 12.3; 2019: 31.6; 2025: 31.3. */
export const PARTTIME_RATIO: ReadonlyArray<[number, number | null]> =
${PARTTIME_RATIO};

// ===== 就労条件総合調査 令和7年(2025) — paid leave =====
// Survey-year axis (R7 survey = calendar-2024 acquisitions; pre-2001 surveys
// = survey-year acquisitions — see chart note).

/** Paid-leave acquisition rate (%) — 1984: 55.6; 2024(R7 survey): 66.9; no 1989 survey. */
export const LEAVE_RATE: ReadonlyArray<[number, number | null]> =
${LEAVE_RATE};

/** Average granted days — 2024: 18.1. */
export const LEAVE_GRANTED: ReadonlyArray<[number, number | null]> =
${LEAVE_GRANTED};

/** Average days taken — 2024: 12.1. */
export const LEAVE_TAKEN: ReadonlyArray<[number, number | null]> =
${LEAVE_TAKEN};

// ===== 賃金構造基本統計調査 令和7年(2025) — wage gaps =====

/** Female-to-male wage ratio, general workers (男=100) — 1976: 58.8; 2025: 76.6. */
export const GENDER_WAGE_RATIO: ReadonlyArray<[number, number | null]> =
${GENDER_WAGE_RATIO};

/** Non-regular-to-regular wage ratio (正社員・正職員=100) — 2005: 60.1; 2025: 67.4. */
export const FORM_WAGE_GAP: ReadonlyArray<[number, number | null]> =
${FORM_WAGE_GAP};

/** Age-wage curve 2025, men (千円/month) — peak 55–59: 445.6. */
export const WAGE_CURVE_MALE: ReadonlyArray<number | null> = [${WAGE_CURVE_MALE.join(", ")}];

/** Age-wage curve 2025, women (千円/month) — peak 45–49/55–59: 305.7. */
export const WAGE_CURVE_FEMALE: ReadonlyArray<number | null> = [${WAGE_CURVE_FEMALE.join(", ")}];

/** Age-wage curve labels (age bands). */
export const WAGE_CURVE_AGES: ReadonlyArray<[string, string]> = [
${CURVE_AGES.map(([ja, en]) => `  ["${ja}", "${en}"],`).join("\n")}
];

/** Employment-form wage gap by age, 2025 (正社員=100) — 15–19: 88.4 … 55–59: 54.8. */
export const FORM_GAP_BY_AGE: ReadonlyArray<number | null> = [${FORM_GAP_BY_AGE.join(", ")}];

// ===== 労働災害 (occupational accidents, MHLW) =====

/** Fatalities (死亡者数, 人) — 1974: 3,725; 2025: 700. */
export const ACCIDENT_DEATH: ReadonlyArray<[number, number | null]> =
${ACCIDENT_DEATH};

/** Injuries with 4+ lost days (休業4日以上死傷者数, 人) — 1974: 347,407; 2025: 135,333. */
export const ACCIDENT_INJURY: ReadonlyArray<[number, number | null]> =
${ACCIDENT_INJURY};

/** Mental-health workers' comp claims (件, fiscal years) — FY2018: 1,820; FY2025: 4,958. */
export const MENTAL_CLAIMS: ReadonlyArray<[number, number | null]> =
${MENTAL_CLAIMS};

/** Mental-health comp decisions (件) — FY2025: 3,839. */
export const MENTAL_DECISIONS: ReadonlyArray<[number, number | null]> =
${MENTAL_DECISIONS};

/** Mental-health comp granted (支給決定, 件) — FY2025: 1,082 (認定率 28.2%). */
export const MENTAL_GRANTED: ReadonlyArray<[number, number | null]> =
${MENTAL_GRANTED};

// ===== OECD (SDMX, fetched 2026-10-26) =====

/** Average annual hours actually worked per worker — latest year per economy. */
export const OECD_HOURS_LATEST: ReadonlyArray<[string, number, number]> = [
${OECD_HOURS_LATEST}
];

/** Japan average annual hours actually worked — 1970: 2,243; 2025: 1,597.5. */
export const OECD_HOURS_JPN: ReadonlyArray<[number, number | null]> =
${OECD_HOURS_JPN};

/** OECD median gender wage gap — latest year per economy (%). */
export const OECD_GWG_LATEST: ReadonlyArray<[string, number, number]> = [
${OECD_GWG_LATEST}
];

/** Japan median gender wage gap (%) — 1975: 42.4; 2025: 20.1. */
export const OECD_GWG_JPN_MEDIAN: ReadonlyArray<[number, number | null]> =
${OECD_GWG_JPN_MEDIAN};

/** Japan temporary-employment share (%) — 1980: 9.6; 2025: 14.2 (2013–17 gap). */
export const OECD_TEMP_JPN: ReadonlyArray<[number, number | null]> =
${OECD_TEMP_JPN};

export const OECD_NAMES: Record<string, { ja: string; en: string }> = {
${Object.entries(OECD_NAMES).map(([a, [ja, en]]) => `  ${a}: { ja: "${ja}", en: "${en}" },`).join("\n")}
};

// ===== Headline 2025 snapshot (for stats blocks) =====
export const HEADLINE_2025 = {
  employed: ${t25.employed},
  laborforce: ${t25.laborforce},
  unemployed: ${t25.unemployed},
  unemploymentRate: ${t25.unemprate},
  employmentRate: ${t25.emprate},
  nonregular: ${f25.nonregular},
  nonregularShare: ${f25.nonregularShare ?? f25.nonregular_share},
  regular: ${f25.regular},
  hoursTotal5: ${m25.total},
  hoursOvertime5: ${m25.overtime},
  parttimeRatio: ${(mls.parttime_ratio as Record<string, number>)["2025"]},
  leaveRate: ${(pl.rate as Record<string, number>)["2025"]},
  leaveGranted: ${(pl.granted as Record<string, number>)["2025"]},
  leaveTaken: ${(pl.taken as Record<string, number>)["2025"]},
  genderRatio: ${w25.ratio},
  femaleWage: ${w25.female},
  maleWage: ${w25.male},
  formGap: ${fw25.gap},
  accidentDeath: ${(acc.death as Record<string, number>)["2025"]},
  accidentInjury: ${(acc.injury as Record<string, number>)["2025"]},
  mentalClaims: ${MENTAL["2025"].claims},
} as const;

export const DATA_SNAPSHOT_HASH = "${hash}";
`;

import { mkdirSync } from "node:fs";
mkdirSync(resolve(ROOT, "src/chapters/chapter-04"), { recursive: true });
writeFileSync(targetPath, out, "utf-8");
console.log(`wrote ${targetPath}`);
console.log(`source snapshot hash: ${hash}`);
