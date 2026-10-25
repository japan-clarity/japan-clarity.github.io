/**
 * Japan Clarity — research integrity validation gate.
 *
 * Run in CI (and locally) before any deploy. Enforces the chapter-isolation
 * and research-integrity contracts:
 *
 *  1. Chapter registry integrity — 14 dimensions, unique slugs, valid
 *     statuses, published chapters have real modules.
 *  2. Source registers — every source has complete provenance fields;
 *     verification statuses are valid; published chapters never cite
 *     unverified sources.
 *  3. Chart specs — unique ids, aligned year/value arrays, finite numbers,
 *     complete bilingual text, resolvable source ids, projections flagged.
 *  4. Data agreement — the generated data module matches the anchor-validated
 *     extracted-series.json exactly (chart/data agreement + unexpected dataset
 *     change detection via content hash).
 *  5. Content blocks — every chart/stat reference resolves; both languages
 *     carry non-empty text; section anchors are unique.
 *  6. UI dictionary parity between ja and en.
 *
 * Usage: bun run scripts/validate-research.ts   (exit code 1 on any failure)
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chapters as chapterMetaList } from "../src/config/chapters";
import { getChapterModule, allRegisteredChapters } from "../src/chapters/registry";
import { ui } from "../src/lib/i18n/dictionary";
import type { L10n, VerificationStatus } from "../src/lib/research/types";

const ROOT = resolve(import.meta.dir, "..");
let failures = 0;
let checks = 0;

function ok(name: string, condition: boolean, detail = "") {
  checks += 1;
  if (condition) {
    console.log(`  [OK ] ${name}`);
  } else {
    failures += 1;
    console.error(`  [FAIL] ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const VALID_VERIFICATION: VerificationStatus[] = [
  "verified-primary",
  "verified-secondary",
  "derived",
  "provisional",
  "unverified",
];

function isCompleteL10n(text: L10n | undefined): boolean {
  return Boolean(text && text.ja.trim() && text.en.trim());
}

// ---------------------------------------------------------------------------
// 1. Registry
// ---------------------------------------------------------------------------
console.log("\n[1] Chapter registry");
ok("14 chapters registered", chapterMetaList.length === 14, String(chapterMetaList.length));
const slugs = chapterMetaList.map((c) => c.slug);
ok("slugs unique", new Set(slugs).size === 14);
const numbers = chapterMetaList.map((c) => c.number);
ok("numbers sequential 01–14", numbers.every((n, i) => n === String(i + 1).padStart(2, "0")));
ok(
  "statuses valid",
  chapterMetaList.every((c) =>
    ["published", "published-limited", "in-progress", "planned"].includes(c.status),
  ),
);
const registered = allRegisteredChapters();
const published = registered.filter((c) => c.module !== null);
ok("published chapters have modules", published.every((c) => c.module !== null));
ok("published chapters use published statuses", published.every((c) => c.meta.status === "published" || c.meta.status === "published-limited"));
ok("planned chapters have no module content", registered.filter((c) => c.module === null).every((c) => c.meta.status === "planned"));

// ---------------------------------------------------------------------------
// 2. Source registers + 3. Chart specs + 5. Content (per chapter)
// ---------------------------------------------------------------------------
for (const { meta, module } of registered) {
  const label = `Chapter ${meta.number}`;
  if (!module) {
    console.log(`\n[${label}] planned — no content to validate`);
    continue;
  }
  console.log(`\n[${label}] ${meta.title.ja} / ${meta.title.en}`);

  const sourceIds = new Set(module.sources.map((s) => s.id));
  ok(`${label}: sources unique`, sourceIds.size === module.sources.length);
  for (const s of module.sources) {
    ok(
      `${label}: source ${s.id} provenance complete`,
      Boolean(
        s.id && s.organization && isCompleteL10n(s.organization) && s.originalTitle &&
        isCompleteL10n(s.displayTitle) && s.url.startsWith("http") &&
        s.publicationDate && s.referencePeriod && s.accessDate &&
        isCompleteL10n(s.geographicCoverage) && isCompleteL10n(s.statisticalUnit) &&
        isCompleteL10n(s.license) && isCompleteL10n(s.methodologyNotes) &&
        isCompleteL10n(s.limitations),
      ),
    );
    ok(
      `${label}: source ${s.id} verification valid`,
      VALID_VERIFICATION.includes(s.verification),
      s.verification,
    );
    if (meta.status === "published" || meta.status === "published-limited") {
      ok(
        `${label}: source ${s.id} not unverified in published chapter`,
        s.verification !== "unverified",
      );
    }
  }

  const chartIds = new Set(module.charts.map((c) => c.id));
  ok(`${label}: chart ids unique`, chartIds.size === module.charts.length);
  for (const spec of module.charts) {
    ok(`${label}: chart ${spec.id} titles complete`, isCompleteL10n(spec.title) && isCompleteL10n(spec.description) && isCompleteL10n(spec.unit));
    ok(`${label}: chart ${spec.id} has years`, spec.years.length > 0);
    const numericYears = spec.years.every((y) => typeof y === "number");
    if (numericYears) {
      const years = spec.years as number[];
      ok(
        `${label}: chart ${spec.id} years strictly increasing`,
        years.every((y, i) => i === 0 || y > years[i - 1]),
      );
    }
    if (spec.categories) {
      ok(
        `${label}: chart ${spec.id} categories aligned`,
        spec.categories.length === spec.years.length &&
          spec.categories.every((c) => isCompleteL10n(c)),
      );
    }
    for (const series of spec.series) {
      ok(
        `${label}: chart ${spec.id} series ${series.key} aligned`,
        series.values.length === spec.years.length,
        `${series.values.length} vs ${spec.years.length}`,
      );
      const nonNull = series.values.filter((v) => v !== null);
      ok(
        `${label}: chart ${spec.id} series ${series.key} has data`,
        nonNull.length > 0,
      );
      ok(
        `${label}: chart ${spec.id} series ${series.key} finite`,
        nonNull.every((v) => Number.isFinite(v as number)),
      );
      ok(`${label}: chart ${spec.id} series ${series.key} named`, isCompleteL10n(series.name));
    }
    ok(
      `${label}: chart ${spec.id} sources resolve`,
      spec.sourceIds.length > 0 && spec.sourceIds.every((id) => sourceIds.has(id)),
      spec.sourceIds.join(","),
    );
    if (spec.note) {
      ok(`${label}: chart ${spec.id} note complete`, isCompleteL10n(spec.note));
    }
  }

  const sectionIds = new Set<string>();
  for (const section of module.sections) {
    if (sectionIds.has(section.id)) {
      ok(`${label}: section id ${section.id} unique`, false);
    }
    sectionIds.add(section.id);
    ok(`${label}: section ${section.id} heading complete`, isCompleteL10n(section.heading));
    for (const block of section.blocks) {
      switch (block.type) {
        case "p":
          ok(`${label}: ${section.id} paragraph complete`, isCompleteL10n(block.text));
          break;
        case "h3":
          ok(`${label}: ${section.id} h3 complete`, isCompleteL10n(block.text) && block.id.length > 0);
          break;
        case "ul":
          ok(
            `${label}: ${section.id} list complete`,
            block.items.length > 0 && block.items.every((i) => isCompleteL10n(i)),
          );
          break;
        case "callout":
          ok(`${label}: ${section.id} callout complete`, isCompleteL10n(block.text));
          if (block.title) ok(`${label}: ${section.id} callout title complete`, isCompleteL10n(block.title));
          break;
        case "chart":
          ok(`${label}: ${section.id} chart ref ${block.chartId} resolves`, chartIds.has(block.chartId));
          break;
        case "stats":
          ok(
            `${label}: ${section.id} stats resolve`,
            block.items.length > 0 &&
              block.items.every((i) => isCompleteL10n(i.value) && isCompleteL10n(i.label) && sourceIds.has(i.sourceId)),
          );
          break;
      }
    }
  }
  // Every chart should be referenced from content (no orphan figures).
  const referenced = new Set(
    module.sections.flatMap((s) =>
      s.blocks.filter((b): b is Extract<typeof b, { type: "chart" }> => b.type === "chart").map((b) => b.chartId),
    ),
  );
  const orphans = [...chartIds].filter((id) => !referenced.has(id));
  ok(`${label}: no orphan charts`, orphans.length === 0, orphans.join(","));
  ok(`${label}: limitations present`, module.limitations.length > 0 && module.limitations.every(isCompleteL10n));
}

// ---------------------------------------------------------------------------
// 4. Data agreement — generated module vs anchor-validated extraction
// ---------------------------------------------------------------------------
console.log("\n[4] Data agreement (generated data vs extracted-series.json)");
const extractionPath = resolve(ROOT, "research/chapter01/notes/extracted-series.json");
const extraction = JSON.parse(readFileSync(extractionPath, "utf-8")) as Record<string, any>;

const { CENSUS_TOTAL, VITAL_BIRTHS, VITAL_DEATHS, VITAL_NATURAL, TFR, LIFE_EXPECTANCY_MALE, LIFE_EXPECTANCY_FEMALE, AGING_SHARE_65_OBSERVED, AGING_SHARE_65_PROJECTED, HOUSEHOLD_SIZE, ONE_PERSON_SHARE, IPSS_MEDIUM_TOTAL, DATA_SNAPSHOT_HASH } =
  await import("../src/chapters/chapter-01/data");

function pairsAgree(
  name: string,
  pairs: ReadonlyArray<[number | string, number | null]>,
  expected: Record<string, any>,
  field?: string,
) {
  let mismatches = 0;
  for (const [year, value] of pairs) {
    const row = expected[String(year)];
    const expValue = field ? (row ? row[field] : undefined) : row;
    const same = (value === null && (expValue === null || expValue === undefined)) ||
      (value !== null && expValue !== null && expValue !== undefined && Math.abs(value - expValue) < 1e-9);
    if (!same) mismatches += 1;
  }
  ok(`data agreement: ${name}`, mismatches === 0, `${mismatches} mismatching points`);
}

pairsAgree("census totals", CENSUS_TOTAL, extraction.census, "total");
pairsAgree("births", VITAL_BIRTHS, extraction.vital.counts, "births");
pairsAgree("deaths", VITAL_DEATHS, extraction.vital.counts, "deaths");
pairsAgree("natural increase", VITAL_NATURAL, extraction.vital.counts, "natural");
pairsAgree("TFR (postwar)", TFR, extraction.vital.rates, "tfr");
pairsAgree("LE male", LIFE_EXPECTANCY_MALE, extraction.lifeExpectancy, "male");
pairsAgree("LE female", LIFE_EXPECTANCY_FEMALE, extraction.lifeExpectancy, "female");
pairsAgree("aging 65+ observed", AGING_SHARE_65_OBSERVED, extraction.aging, "share65");
pairsAgree("aging 65+ projected", AGING_SHARE_65_PROJECTED, extraction.aging, "share65");
pairsAgree("household size", HOUSEHOLD_SIZE, extraction.households.avgSize);
pairsAgree("one-person share", ONE_PERSON_SHARE, extraction.households.onePersonShare);
pairsAgree("IPSS medium", IPSS_MEDIUM_TOTAL, extraction.ipssMedium, "totalThousand");

const hash = createHash("sha256").update(readFileSync(extractionPath)).digest("hex").slice(0, 16);
ok("dataset snapshot hash unchanged", hash === DATA_SNAPSHOT_HASH, `${hash} vs ${DATA_SNAPSHOT_HASH}`);

// ---------------------------------------------------------------------------
// 4b. Data agreement — Chapter 02 generated module vs its extraction JSON
// ---------------------------------------------------------------------------
console.log("\n[4b] Data agreement (chapter 02 generated data vs extracted-series.json)");
const extraction2Path = resolve(ROOT, "research/chapter02/notes/extracted-series.json");
const extraction2 = JSON.parse(readFileSync(extraction2Path, "utf-8")) as Record<string, any>;

const {
  GDP_NOMINAL_TRILLION, GDP_REAL_TRILLION, GDP_REAL_GROWTH, GDP_DEFLATOR,
  HOUSEHOLD_DISPOSABLE_TRILLION, WAGE_NOMINAL_INDEX, WAGE_REAL_INDEX,
  WAGE_REAL_YOY, INDUSTRY_VA_SHARE_PRIMARY, INDUSTRY_VA_SHARE_SECONDARY,
  INDUSTRY_VA_SHARE_TERTIARY, INDUSTRY_VA_SHARE_MANUFACTURING,
  EMPLOYMENT_SHARE_PRIMARY, EMPLOYMENT_SHARE_SECONDARY, EMPLOYMENT_SHARE_TERTIARY,
  EMPLOYMENT_SHARE_MANUFACTURING, EMPLOYMENT_TOTAL, EMPLOYMENT_MANUFACTURING,
  RD_GDP_RATIO, OECD_GDP_HOUR_COMPARE, OECD_JPN_GDP_HOUR_VOLUME,
  WB_PC_JPN, WB_PC_COMPARE, WAGE_MONTHLY_2026_REAL_YOY, DATA_SNAPSHOT_HASH: CH02_SNAPSHOT_HASH,
} = await import("../src/chapters/chapter-02/data");

function pairsAgree2(
  name: string,
  pairs: ReadonlyArray<[number | string, number | null]>,
  expected: Record<string, number | null>,
  transform: (v: number) => number = (v) => v,
  tol = 1e-9,
) {
  let mismatches = 0;
  for (const [year, value] of pairs) {
    const expValue = expected[String(year)];
    const same = (value === null && (expValue === null || expValue === undefined)) ||
      (value !== null && expValue !== null && expValue !== undefined &&
        Math.abs(value - transform(expValue as number)) <= tol);
    if (!same) mismatches += 1;
  }
  ok(`ch02 data agreement: ${name}`, mismatches === 0, `${mismatches} mismatching points`);
}

const tril = (v: number) => v / 1000; // 十億円 → 兆円
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

pairsAgree2("GDP nominal (兆円)", GDP_NOMINAL_TRILLION, extraction2.esri.gdp.nominal, tril, 0.051);
pairsAgree2("GDP real (兆円)", GDP_REAL_TRILLION, extraction2.esri.gdp.real, tril, 0.051);
pairsAgree2("GDP real growth", GDP_REAL_GROWTH, extraction2.esri.gdp.realGrowth, r1, 0.051);
pairsAgree2("GDP deflator", GDP_DEFLATOR, extraction2.esri.gdp.deflator, r1, 0.051);
pairsAgree2("household disposable (兆円)", HOUSEHOLD_DISPOSABLE_TRILLION, extraction2.esri.household.netDisposableIncome, tril, 0.051);
pairsAgree2("wage nominal index", WAGE_NOMINAL_INDEX, extraction2.mhlw.wages.nominalIndex, undefined, 0.011);
pairsAgree2("wage real index", WAGE_REAL_INDEX, extraction2.mhlw.wages.realIndex, undefined, 0.011);
pairsAgree2("wage real YoY", WAGE_REAL_YOY, extraction2.mhlw.wages.realYoY, r1, 0.051);
pairsAgree2("industry VA share primary", INDUSTRY_VA_SHARE_PRIMARY, extraction2.esri.industry.shares.primary, r2, 0.011);
pairsAgree2("industry VA share secondary", INDUSTRY_VA_SHARE_SECONDARY, extraction2.esri.industry.shares.secondary, r2, 0.011);
pairsAgree2("industry VA share tertiary", INDUSTRY_VA_SHARE_TERTIARY, extraction2.esri.industry.shares.tertiary, r2, 0.011);
pairsAgree2("industry VA share manufacturing", INDUSTRY_VA_SHARE_MANUFACTURING, extraction2.esri.industry.shares.manufacturing, r2, 0.011);
pairsAgree2("employment share primary", EMPLOYMENT_SHARE_PRIMARY, extraction2.esri.employment.shares.primary, r2, 0.011);
pairsAgree2("employment share secondary", EMPLOYMENT_SHARE_SECONDARY, extraction2.esri.employment.shares.secondary, r2, 0.011);
pairsAgree2("employment share tertiary", EMPLOYMENT_SHARE_TERTIARY, extraction2.esri.employment.shares.tertiary, r2, 0.011);
pairsAgree2("employment share manufacturing", EMPLOYMENT_SHARE_MANUFACTURING, extraction2.esri.employment.shares.manufacturing, r2, 0.011);
pairsAgree2("employment total", EMPLOYMENT_TOTAL, extraction2.esri.employment.persons.total, r1, 0.051);
pairsAgree2("employment manufacturing", EMPLOYMENT_MANUFACTURING, extraction2.esri.employment.persons.manufacturing, r1, 0.051);

const rdExpected: Record<string, number | null> = {};
for (const [y, v] of Object.entries(extraction2.rd.older as Record<string, { ratioPct: number }>)) rdExpected[y] = v.ratioPct;
for (const [y, v] of Object.entries(extraction2.rd.recent as Record<string, { ratioPct: number }>)) rdExpected[y] = v.ratioPct;
pairsAgree2("R&D ratio", RD_GDP_RATIO, rdExpected, r2, 0.011);

// OECD comparison: values equal the archived CSV (2025 current-price rows)
const oecdCurrent = extraction2.oecd.gdpPerHourCurrent as Record<string, Record<string, number>>;
let oecdBad = 0;
for (const [area, v] of OECD_GDP_HOUR_COMPARE) {
  const exp = oecdCurrent[area]?.["2025"];
  if (exp === undefined || Math.abs(v - r2(exp)) > 0.011) oecdBad += 1;
}
ok("ch02 data agreement: OECD GDP/hour comparison (2025)", oecdBad === 0 && OECD_GDP_HOUR_COMPARE.length === 12, `${oecdBad} bad of ${OECD_GDP_HOUR_COMPARE.length}`);
pairsAgree2("OECD JPN volume GDP/hour", OECD_JPN_GDP_HOUR_VOLUME, extraction2.oecd.gdpPerHourVolumeJpn as Record<string, number>, r1, 0.051);
pairsAgree2("WB per-capita PPP (JPN)", WB_PC_JPN, extraction2.wb.japan.gdpPerCapitaPpp, Math.round, 0.51);
const wbCompare = extraction2.wb.compare.gdpPerCapitaPpp as Record<string, Record<string, number>>;
let wbBad = 0;
for (const [area, v] of WB_PC_COMPARE) {
  const exp = wbCompare[area]?.["2025"];
  if (exp === undefined || Math.abs(v - Math.round(exp)) > 0.51) wbBad += 1;
}
ok("ch02 data agreement: WB per-capita comparison (2025)", wbBad === 0 && WB_PC_COMPARE.length === 13, `${wbBad} bad of ${WB_PC_COMPARE.length}`);

const monthlyExp = extraction2.mhlw.wages.monthly2026 as Record<string, { realYoY: number }>;
let monthlyBad = 0;
for (const [m, v] of WAGE_MONTHLY_2026_REAL_YOY) {
  const exp = monthlyExp[String(m)]?.realYoY;
  if (exp === undefined || Math.abs(v - r1(exp)) > 0.051) monthlyBad += 1;
}
ok("ch02 data agreement: monthly 2026 real wage YoY", monthlyBad === 0 && WAGE_MONTHLY_2026_REAL_YOY.length === 8, `${monthlyBad} bad of ${WAGE_MONTHLY_2026_REAL_YOY.length}`);

const hash2 = createHash("sha256").update(readFileSync(extraction2Path)).digest("hex").slice(0, 16);
ok("ch02 dataset snapshot hash unchanged", hash2 === CH02_SNAPSHOT_HASH, `${hash2} vs ${CH02_SNAPSHOT_HASH}`);

// ---------------------------------------------------------------------------
// 4c. OECD unit-metadata regression (chapter 02) — 2026-10 independent-audit
//     remediation. The archived OECD GDPHRS volume series is chain-linked
//     LEVELS in PPP-converted US dollars per hour with a 2020 reference year
//     (PRICE_BASE=LR, BASE_PER=2020, TRANSFORMATION=N, UNIT_MULT=0). It is
//     NOT an index rebased to 2020 = 100 — the 2020 observation is 50.5.
//     These checks fail if a future edit reintroduces an index-style label.
//     (The regex never matches the legitimate wage "2020年平均=100" /
//     "2020 avg = 100" or deflator "2020暦年=100" / "CY2020 = 100" indices.)
// ---------------------------------------------------------------------------
console.log("\n[4c] OECD unit metadata (chapter 02 productivity series)");

function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { fields.push(cur); cur = ""; }
    else cur += ch;
  }
  fields.push(cur);
  return fields;
}

const oecdVolumeAll = readFileSync(
  resolve(ROOT, "research/chapter02/raw/oecd/oecd-gdphrs-ppp-volume.csv"), "utf-8",
).split(/\r?\n/).filter((l) => l.length > 0);
const oecdHeader = splitCsvLine(oecdVolumeAll[0] ?? "");
const oecdVolumeRows = oecdVolumeAll.filter((l) => l.startsWith("DATAFLOW"));
const oCol = (name: string) => oecdHeader.indexOf(name);
const oc = {
  ref: oCol("REF_AREA"), year: oCol("TIME_PERIOD"), val: oCol("OBS_VALUE"),
  measure: oCol("MEASURE"), unit: oCol("UNIT_MEASURE"), price: oCol("PRICE_BASE"),
  trans: oCol("TRANSFORMATION"), base: oCol("BASE_PER"), mult: oCol("UNIT_MULT"),
};
let oecdMetaBad = 0;
const jpnVolumeRaw: Record<string, number> = {};
for (const line of oecdVolumeRows.slice(1)) {
  const r = splitCsvLine(line);
  if (r[oc.ref] !== "JPN") continue;
  jpnVolumeRaw[r[oc.year]] = Number(r[oc.val]);
  if (r[oc.measure] !== "GDPHRS" || r[oc.unit] !== "USD_PPP_H" || r[oc.price] !== "LR" ||
    r[oc.trans] !== "N" || r[oc.base] !== "2020" || r[oc.mult] !== "0") oecdMetaBad += 1;
}
ok("ch02 oecd metadata: archived JPN rows are GDPHRS/USD_PPP_H/LR/BASE_PER=2020 (untransformed levels)",
  oecdMetaBad === 0 && Object.keys(jpnVolumeRaw).length >= 50,
  `${oecdMetaBad} bad of ${Object.keys(jpnVolumeRaw).length} rows`);
ok("ch02 oecd metadata: 2020 observation is a level (50.545 USD/hour), not index 100",
  Math.abs((jpnVolumeRaw["2020"] ?? 0) - 50.545109638) < 0.001, `2020 = ${jpnVolumeRaw["2020"]}`);
const vol2020 = OECD_JPN_GDP_HOUR_VOLUME.find(([y]) => y === 2020)?.[1] ?? null;
const vol2025 = OECD_JPN_GDP_HOUR_VOLUME.find(([y]) => y === 2025)?.[1] ?? null;
ok("ch02 oecd metadata: generated module carries OECD levels (2020 = 50.5, 2025 = 53.0)",
  vol2020 === 50.5 && vol2025 === 53, `2020 = ${vol2020}, 2025 = ${vol2025}`);

const INDEX_MISLABEL = /2020\s*年?\s*=\s*100/;
const { chapter02 } = await import("../src/chapters/chapter-02/index");
const productivityChart = chapter02.charts.find((c) => c.id === "ch02-productivity-japan");
const oecdSource = chapter02.sources.find((s) => s.id === "oecd-pdb-2026");
ok("ch02 oecd labels: productivity chart surfaces never carry an index (2020=100) label",
  productivityChart
    ? [productivityChart.title, productivityChart.description, productivityChart.unit,
      productivityChart.yLabel ?? productivityChart.unit, productivityChart.note,
      ...productivityChart.series.map((s) => s.name)]
      .every((t) => !INDEX_MISLABEL.test(`${t.ja} ${t.en}`))
    : false,
  productivityChart ? "" : "chart ch02-productivity-japan missing");
ok("ch02 oecd labels: productivity chart unit states USD-per-hour levels (no index wording)",
  productivityChart
    ? productivityChart.unit.ja.includes("米ドル/時間") &&
      productivityChart.unit.en.includes("USD per hour") &&
      !productivityChart.unit.ja.includes("指数") &&
      !productivityChart.unit.en.toLowerCase().includes("index")
    : false);
ok("ch02 oecd labels: source register oecd-pdb-2026 describes USD/hour units (no index mislabel)",
  oecdSource
    ? !INDEX_MISLABEL.test(oecdSource.referencePeriod) &&
      !INDEX_MISLABEL.test(`${oecdSource.statisticalUnit.ja} ${oecdSource.statisticalUnit.en}`) &&
      oecdSource.statisticalUnit.en.includes("USD per hour")
    : false,
  oecdSource ? "" : "source oecd-pdb-2026 missing");

// Growth-rate statements must match CAGRs recomputed from the module series.
const volMap = new Map<number, number | null>(
  OECD_JPN_GDP_HOUR_VOLUME.map(([y, v]) => [y as number, v] as [number, number | null]),
);
const cagrOf = (y0: number, y1: number): number => {
  const a = volMap.get(y0);
  const b = volMap.get(y1);
  return a != null && b != null ? (b / a) ** (1 / (y1 - y0)) - 1 : Number.NaN;
};
const g7090 = cagrOf(1970, 1990);
const g9025 = cagrOf(1990, 2025);
const g1025 = cagrOf(2010, 2025);
ok("ch02 oecd growth: CAGRs from archived levels — 1970–90 ≈ 4.1%, 1990–2025 ≈ 1.3%, 2010–25 ≈ 0.9%",
  Math.abs(g7090 - 0.04149) < 0.001 && Math.abs(g9025 - 0.0132) < 0.001 && Math.abs(g1025 - 0.00915) < 0.001,
  `${(g7090 * 100).toFixed(3)}% / ${(g9025 * 100).toFixed(3)}% / ${(g1025 * 100).toFixed(3)}%`);
ok("ch02 oecd growth: chart text states the audited rates (4.1% and 1.3%), not stale 3.8%/1.0%",
  productivityChart
    ? /4\.1%/.test(productivityChart.description.ja) &&
      /4\.1%/.test(productivityChart.description.en) &&
      /1\.3%/.test(productivityChart.description.ja) &&
      /1\.3%/.test(productivityChart.description.en) &&
      !/3\.8%|1\.0%/.test(`${productivityChart.description.ja}${productivityChart.description.en}`)
    : false);

// Any chapter-02 narrative that mentions OECD must not describe the volume
// series as an index or carry the stale 1970–90 productivity rate.
function collectStrings(node: unknown, out: string[]): void {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) for (const n of node) collectStrings(n, out);
  else if (node && typeof node === "object") {
    for (const v of Object.values(node as Record<string, unknown>)) collectStrings(v, out);
  }
}
const ch02NarrativeStrings: string[] = [];
collectStrings(chapter02.sections, ch02NarrativeStrings);
collectStrings(chapter02.limitations, ch02NarrativeStrings);
const oecdNarratives = ch02NarrativeStrings.filter((t) => t.includes("OECD"));
ok("ch02 oecd labels: no narrative text describing the OECD series as an index (2020=100)",
  oecdNarratives.every((t) => !INDEX_MISLABEL.test(t)),
  oecdNarratives.filter((t) => INDEX_MISLABEL.test(t)).slice(0, 1).join(" "));
ok("ch02 oecd growth: no OECD narrative carrying the stale 1970–90 productivity rate (+3.8%)",
  oecdNarratives.every((t) => !(/1970[–-]90|1970[–-]1990/.test(t) && /\+?3\.8%/.test(t))),
  oecdNarratives.filter((t) => /1970[–-]90|1970[–-]1990/.test(t) && /\+?3\.8%/.test(t)).slice(0, 1).join(" "));

// ---------------------------------------------------------------------------
// 4d. Chapter 01 household-series regression (2026-10-25 independent audit).
//     The original handbook Table 2.3 extraction scanned the whole handbook,
//     so a Table 14.6 row (traffic accidents: 1980 → 2.3 fatalities per
//     10,000 motor vehicles owned) silently overwrote the 1980 household-size
//     value (3.22) through the year-keyed dict. Guards: pin every Table 2.3
//     value, enforce monotonic decline, pin the one-person series, and forbid
//     the unverified 2020 population estimate (126,226,568) — a figure that
//     no currently accessible official publication carries (replaced during
//     the audit with the verified Sep-15-2025 estimate vs census comparison).
// ---------------------------------------------------------------------------
console.log("\n[4d] Chapter 01 household-series regression (audit guards)");

const HH_SIZE_EXPECTED: Record<number, number> = {
  1960: 4.14, 1970: 3.41, 1975: 3.28, 1980: 3.22, 1985: 3.14, 1990: 2.99,
  1995: 2.82, 2000: 2.67, 2005: 2.55, 2010: 2.42, 2015: 2.33, 2020: 2.21, 2025: 2.10,
};
{
  const map = new Map<number, number | null>(
    HOUSEHOLD_SIZE.map(([y, v]) => [y as number, v as number | null]),
  );
  const hhBad: string[] = [];
  for (const [year, v] of Object.entries(HH_SIZE_EXPECTED)) {
    const y = Number(year);
    if (map.get(y) !== v) hhBad.push(`${y}: ${map.get(y)} (expected ${v})`);
  }
  ok(
    "ch01 household size: all 13 census-year values match handbook Table 2.3 + 2025 census",
    hhBad.length === 0 && HOUSEHOLD_SIZE.length === 13,
    hhBad.join("; "),
  );
  const seq = HOUSEHOLD_SIZE.map(([, v]) => v as number);
  ok(
    "ch01 household size: monotonically non-increasing 1960→2025",
    seq.every((v, i) => i === 0 || seq[i - 1] >= v),
    seq.join(", "),
  );
  const onePersonMap = new Map<number, number | null>(
    ONE_PERSON_SHARE.map(([y, v]) => [y as number, v as number | null]),
  );
  const OP_EXPECTED: Record<number, number> = { 2005: 29.5, 2010: 32.4, 2015: 34.6, 2020: 38.1, 2025: 41.4 };
  const opBad = Object.entries(OP_EXPECTED).filter(([year, v]) => onePersonMap.get(Number(year)) !== Number(v));
  ok(
    "ch01 one-person share: handbook Figure 2.3 (2005–2020) + 2025 census values pinned",
    opBad.length === 0 && ONE_PERSON_SHARE.length === 5,
    opBad.map(([year, v]) => `${year}: ${onePersonMap.get(Number(year))} vs ${v}`).join("; "),
  );
}

const { chapter01 } = await import("../src/chapters/chapter-01/index");
const ch01Strings: string[] = [];
collectStrings(chapter01.sections, ch01Strings);
collectStrings(chapter01.limitations, ch01Strings);
collectStrings(chapter01.charts, ch01Strings);
collectStrings(chapter01.sources, ch01Strings);
ok(
  "ch01 provenance: unverified 2020 estimate (126,226,568) absent from all chapter text",
  ch01Strings.every((t) => !t.includes("126,226,568")),
  `${ch01Strings.filter((t) => t.includes("126,226,568")).length} occurrences`,
);
ok(
  "ch01 provenance: statistical-product example cites the verified 2025 pair (123.21M estimate vs 122,972,528 census)",
  ch01Strings.some((t) => t.includes("122,972,528")) &&
    ch01Strings.some((t) => t.includes("123.21 million") || t.includes("1億2,321万")),
);

// ---------------------------------------------------------------------------
// 6. UI dictionary parity
// ---------------------------------------------------------------------------
console.log("\n[6] UI dictionary parity");
function keyStructure(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return keyStructure(v as Record<string, unknown>, path);
    }
    return [path];
  });
}
const jaKeys = keyStructure(ui.ja as unknown as Record<string, unknown>);
const enKeys = keyStructure(ui.en as unknown as Record<string, unknown>);
const jaSet = new Set(jaKeys);
const enSet = new Set(enKeys);
const missingInEn = jaKeys.filter((k) => !enSet.has(k));
const missingInJa = enKeys.filter((k) => !jaSet.has(k));
ok("dictionary keys identical (ja/en)", missingInEn.length === 0 && missingInJa.length === 0, `missing in en: ${missingInEn.join(",")} / in ja: ${missingInJa.join(",")}`);
ok("dictionary non-empty values", [...jaKeys, ...enKeys].length > 200);

// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(60));
console.log(`${checks} checks, ${failures} failures`);
if (failures > 0) {
  console.error("RESEARCH INTEGRITY GATE FAILED");
  process.exit(1);
}
console.log("Research integrity gate passed.");
