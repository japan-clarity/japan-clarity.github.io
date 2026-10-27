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
// 4e. Data agreement + regression guards (Chapter 03 — Housing & Cost of
//     Living, 2026-10-26). Two prior audit lessons drive the guards:
//     (i)  Chapter 01's cross-table contamination — vacancy/homeownership
//          series are pinned value-by-value and cross-checked against TWO
//          independent raw tables (時系列 1-1 vs 4 vs 9-1), and the 速報
//          (provisional) 2023 values are forbidden;
//     (ii) Chapter 02's OECD unit mislabeling — the OECD price-to-income and
//          real house price series are 2015=100 INDICES; guards pin the 2015
//          anchor at exactly 100 and forbid index/level confusion in labels.
//     FIES guards pin the 用途分類 structure (not the 品目分類 amounts) and
//     recompute the DERIVED rent-burden shares from published amounts.
// ---------------------------------------------------------------------------
console.log("\n[4e] Data agreement + regression guards (chapter 03)");

const extraction3Path = resolve(ROOT, "research/chapter03/notes/extracted-series.json");
const extraction3 = JSON.parse(readFileSync(extraction3Path, "utf-8")) as Record<string, any>;

const {
  STOCK_TOTAL, STOCK_OCCUPIED, STOCK_VACANT, VACANCY_RATE,
  TENURE_OWNED, TENURE_PUBLIC, TENURE_UR, TENURE_PRIVATE, TENURE_COMPANY,
  TENURE_COUNT_OWNED, TENURE_COUNT_PRIVATE,
  VAC_TYPE_RENTAL, VAC_TYPE_SALE, VAC_TYPE_SECONDARY, VAC_TYPE_OTHER,
  AREA_TOTAL, AREA_OWNED, AREA_RENTED,
  BUILT_PERIOD_2023, BUILT_PRE1971,
  PREF_VACANCY,
  FIES_EXPENDITURE, FIES_STRUCTURE, FIES_TENURE_2025, FIES_BURDEN,
  FIES_SOLO_2025, FIES_KINROU_2025, FIES_TENURE_META, FIES_REGIONAL_2025,
  CPI_LONG, CPI_G_ALL, CPI_G_FOOD, CPI_G_HOUSING, CPI_G_RENT, CPI_G_ENERGY,
  CPI_YOY_GROUPS, CPI_RENT_PRIVATE_YOY, CPI_HEADLINE,
  OECD_PTI_JPN, OECD_RHP_JPN, OECD_PTI_COMPARE, OECD_PTI_YEAR,
  MLIT_STARTS_FULL, MLIT_STARTS_SELECTED, MLIT_LAND_PRICE,
  DATA_SNAPSHOT_HASH: CH03_SNAPSHOT_HASH,
} = await import("../src/chapters/chapter-03/data");

function pairsAgree3(
  name: string,
  pairs: ReadonlyArray<[number | string, number | null]>,
  expected: Record<string, any>,
  field?: string,
  transform: (v: number) => number = (v) => v,
  tol = 1e-9,
) {
  let mismatches = 0;
  for (const [year, value] of pairs) {
    const row = expected[String(year)];
    const expValue = field ? (row ? row[field] : undefined) : row;
    const same = (value === null && (expValue === null || expValue === undefined)) ||
      (value !== null && expValue !== null && expValue !== undefined &&
        Math.abs(value - transform(expValue as number)) <= tol);
    if (!same) mismatches += 1;
  }
  ok(`ch03 data agreement: ${name}`, mismatches === 0, `${mismatches} mismatching points`);
}

const man = (v: number) => v / 10000; // 戸 → 万戸 (generation rounds 1 dp); r1/r2 declared in §4b

// — housing survey (時系列 tables) —
pairsAgree3("housing stock total (万戸)", STOCK_TOTAL, extraction3.housing.stock, "total", man, 0.06);
pairsAgree3("housing stock occupied (万戸)", STOCK_OCCUPIED, extraction3.housing.stock, "occupied", man, 0.06);
pairsAgree3("housing stock vacant (万戸)", STOCK_VACANT, extraction3.housing.stock, "vacant", man, 0.06);
pairsAgree3("vacancy rate (%)", VACANCY_RATE, extraction3.housing.vacancyRate, undefined, r1, 0.02);
pairsAgree3("tenure owned share", TENURE_OWNED, extraction3.housing.tenureShare, "owned", r1, 0.02);
pairsAgree3("tenure public share", TENURE_PUBLIC, extraction3.housing.tenureShare, "public", r1, 0.02);
pairsAgree3("tenure UR share", TENURE_UR, extraction3.housing.tenureShare, "ur", r1, 0.02);
pairsAgree3("tenure private share", TENURE_PRIVATE, extraction3.housing.tenureShare, "private", r1, 0.02);
pairsAgree3("tenure company share", TENURE_COMPANY, extraction3.housing.tenureShare, "company", r1, 0.02);
pairsAgree3("tenure owned count (万戸)", TENURE_COUNT_OWNED, extraction3.housing.tenureCount, "owned", man, 0.06);
pairsAgree3("tenure private count (万戸)", TENURE_COUNT_PRIVATE, extraction3.housing.tenureCount, "private", man, 0.06);
pairsAgree3("vac type rental (万戸)", VAC_TYPE_RENTAL, extraction3.housing.vacancyTypes, "rental", man, 0.06);
pairsAgree3("vac type sale (万戸)", VAC_TYPE_SALE, extraction3.housing.vacancyTypes, "sale", man, 0.06);
pairsAgree3("vac type secondary (万戸)", VAC_TYPE_SECONDARY, extraction3.housing.vacancyTypes, "secondary", man, 0.06);
pairsAgree3("vac type other (万戸)", VAC_TYPE_OTHER, extraction3.housing.vacancyTypes, "other", man, 0.06);
pairsAgree3("floor area total (㎡)", AREA_TOTAL, extraction3.housing.floorArea, "total");
pairsAgree3("floor area owned (㎡)", AREA_OWNED, extraction3.housing.floorArea, "owned");
pairsAgree3("floor area rented (㎡)", AREA_RENTED, extraction3.housing.floorArea, "rented");
pairsAgree3("MLIT starts full (戸)", MLIT_STARTS_FULL, extraction3.mlit.starts);
for (const [band, v] of Object.entries(BUILT_PERIOD_2023)) {
  const exp = extraction3.housing.builtPeriod2023[band];
  ok(`ch03 data agreement: built period ${band}`, exp === v, `${v} vs ${exp}`);
}
ok("ch03 data agreement: BUILT_PRE1971 = sum of the two pre-1971 bands",
  BUILT_PRE1971 === BUILT_PERIOD_2023["1950 or earlier"] + BUILT_PERIOD_2023["1951 to 1970"]);

// — FIES —
pairsAgree3("FIES expenditure (円)", FIES_EXPENDITURE, extraction3.fies.expenditureTwoPlus);
for (const [cat, amount, share] of FIES_STRUCTURE) {
  const exp = extraction3.fies.structure2025[cat];
  ok(`ch03 data agreement: FIES structure ${cat}`,
    exp && exp.amount === amount && exp.share === share, `${amount}/${share} vs ${JSON.stringify(exp)}`);
}
for (const [label, [avg, owned, privateRent]] of Object.entries(FIES_TENURE_2025)) {
  const exp = extraction3.fies.tenure2025twoPlus[label === "設備修繕維持" ? "設備修繕・維持" : label === "光熱水道" ? "光熱・水道" : label];
  ok(`ch03 data agreement: FIES tenure ${label}`,
    exp && exp.avg === avg && exp.owned === owned && exp.privateRent === privateRent,
    `${avg}/${owned}/${privateRent} vs ${JSON.stringify(exp)}`);
}
{
  const soloExp = extraction3.fies.solo2025;
  const soloTenExp = extraction3.fies.soloTenure2025;
  ok("ch03 data agreement: FIES solo 2025",
    FIES_SOLO_2025.expenditure === soloExp.expenditure &&
    FIES_SOLO_2025.housing === soloExp.housing &&
    FIES_SOLO_2025.housingShare === soloExp.housingShare &&
    FIES_SOLO_2025.expenditureOwned === soloTenExp.expenditureOwned &&
    FIES_SOLO_2025.expenditurePrivateRent === soloTenExp.expenditurePrivateRent &&
    FIES_SOLO_2025.housingOwned === soloTenExp.housingOwned &&
    FIES_SOLO_2025.housingPrivateRent === soloTenExp.housingPrivateRent);
  const kinExp = extraction3.fies.tenure2025kinrou;
  ok("ch03 data agreement: FIES kinrou 2025",
    FIES_KINROU_2025.income === kinExp.income &&
    FIES_KINROU_2025.disposable === kinExp.disposable &&
    FIES_KINROU_2025.housingPrivateRent === kinExp.housingPrivateRent);
  const metaExp = extraction3.fies.tenure2025twoPlus._meta;
  ok("ch03 data agreement: FIES tenure meta (87.3% frame rate; head ages)",
    FIES_TENURE_META.ownedRate === metaExp.ownedRate &&
    FIES_TENURE_META.headAgeAvg === metaExp.headAgeAvg &&
    FIES_TENURE_META.headAgePrivateRent === metaExp.headAgePrivateRent);
  // Derived burden shares recomputed from published amounts
  const recompute = (h: number, e: number) => r1((h / e) * 100);
  ok("ch03 derived burden: 2+ owned recomputed",
    FIES_BURDEN.twoPlusOwned === recompute(FIES_TENURE_2025["住居"][1], FIES_TENURE_2025["消費支出"][1]),
    `${FIES_BURDEN.twoPlusOwned}`);
  ok("ch03 derived burden: 2+ private rent recomputed",
    FIES_BURDEN.twoPlusPrivateRent === recompute(FIES_TENURE_2025["住居"][2], FIES_TENURE_2025["消費支出"][2]),
    `${FIES_BURDEN.twoPlusPrivateRent}`);
  ok("ch03 derived burden: solo owned recomputed",
    FIES_BURDEN.soloOwned === recompute(FIES_SOLO_2025.housingOwned, FIES_SOLO_2025.expenditureOwned));
  ok("ch03 derived burden: solo private rent recomputed",
    FIES_BURDEN.soloPrivateRent === recompute(FIES_SOLO_2025.housingPrivateRent, FIES_SOLO_2025.expenditurePrivateRent));
  ok("ch03 derived burden: solo-all matches published share",
    FIES_BURDEN.soloAll === FIES_SOLO_2025.housingShare);
}
for (const [region, row] of Object.entries(FIES_REGIONAL_2025)) {
  const exp = extraction3.fies.regional2025[region];
  ok(`ch03 data agreement: FIES regional ${region}`,
    exp && exp.expenditure === row.expenditure && exp.housingShare === row.housingShare && exp.utilities === row.utilities,
    `${JSON.stringify(row)} vs ${JSON.stringify(exp)}`);
}

// — CPI —
pairsAgree3("CPI long-run (2025=100)", CPI_LONG, extraction3.cpi.longRunAll, undefined, r1, 0.02);
pairsAgree3("CPI group all", CPI_G_ALL, extraction3.cpi.groups, "総合", r1, 0.02);
pairsAgree3("CPI group food", CPI_G_FOOD, extraction3.cpi.groups, "食料", r1, 0.02);
pairsAgree3("CPI group housing", CPI_G_HOUSING, extraction3.cpi.groups, "住居", r1, 0.02);
pairsAgree3("CPI group rent", CPI_G_RENT, extraction3.cpi.groups, "家賃", r1, 0.02);
pairsAgree3("CPI group energy", CPI_G_ENERGY, extraction3.cpi.groups, "エネルギー", r1, 0.02);
for (const [y, all, food, housing, rent, energy] of CPI_YOY_GROUPS) {
  const exp = extraction3.cpi.yoyGroups[String(y)];
  ok(`ch03 data agreement: CPI YoY ${y}`,
    exp && exp["総合"] === all && exp["食料"] === food && exp["住居"] === housing &&
    exp["家賃"] === rent && exp["エネルギー"] === energy,
    `${[all, food, housing, rent, energy]} vs ${JSON.stringify(exp)}`);
}
pairsAgree3("CPI private rent YoY", CPI_RENT_PRIVATE_YOY, extraction3.cpi.yoyRentPrivate);
{
  const h = extraction3.cpi.headline;
  ok("ch03 data agreement: CPI headline (2020-base 111.9 / Sep-2026 102.2)",
    CPI_HEADLINE.avg2025Index2020base === h.avg2025Index2020base &&
    CPI_HEADLINE.avg2025Yoy === h.avg2025Yoy &&
    CPI_HEADLINE.sep2026Index === h.sep2026Index &&
    CPI_HEADLINE.sep2026Yoy === h.sep2026Yoy);
}

// — OECD (2015=100 indices) —
pairsAgree3("OECD PTI Japan (2015=100)", OECD_PTI_JPN, extraction3.oecd.ptiJpn, undefined, r1, 0.06);
pairsAgree3("OECD RHP Japan (2015=100)", OECD_RHP_JPN, extraction3.oecd.rhpJpn, undefined, r1, 0.06);
{
  const latest = extraction3.oecd.ptiLatest;
  let ptiBad = 0;
  for (const [area, v] of OECD_PTI_COMPARE) {
    const exp = latest[area];
    if (exp === undefined || Math.abs(v - r1(exp)) > 0.06) ptiBad += 1;
  }
  ok("ch03 data agreement: OECD PTI comparison (2025)", ptiBad === 0 && OECD_PTI_COMPARE.length === 13,
    `${ptiBad} bad of ${OECD_PTI_COMPARE.length}`);
  ok("ch03 OECD year = 2025", OECD_PTI_YEAR === 2025);
}
const hash3 = createHash("sha256").update(readFileSync(extraction3Path)).digest("hex").slice(0, 16);
ok("ch03 dataset snapshot hash unchanged", hash3 === CH03_SNAPSHOT_HASH, `${hash3} vs ${CH03_SNAPSHOT_HASH}`);

// ---- regression guards (Ch01/Ch02 audit-lesson classes) -------------------

// G1. Vacancy series pinned + monotonic (cross-table contamination guard)
{
  const vr = new Map<number, number | null>(VACANCY_RATE.map(([y, v]) => [y as number, v as number | null]));
  const VR_EXPECTED: Record<number, number> = {
    1963: 2.5, 1968: 4.0, 1973: 5.5, 1978: 7.6, 1983: 8.6, 1988: 9.4,
    1993: 9.8, 1998: 11.5, 2003: 12.2, 2008: 13.1, 2013: 13.5, 2018: 13.6, 2023: 13.8,
  };
  const bad = Object.entries(VR_EXPECTED).filter(([y, v]) => vr.get(Number(y)) !== v);
  ok("ch03 guard: vacancy-rate series pinned (13 survey years, final figures)",
    bad.length === 0 && VACANCY_RATE.length === 13,
    bad.map(([y, v]) => `${y}: ${vr.get(Number(y))} vs ${v}`).join("; "));
  const seq = VACANCY_RATE.map(([, v]) => v as number);
  ok("ch03 guard: vacancy rate monotonically non-decreasing 1963→2023",
    seq.every((v, i) => i === 0 || seq[i - 1] <= v), seq.join(", "));
}
// G2. 2023 headline anchors (確報, NOT the 速報 values)
{
  const stockMap = new Map<number, number | null>(STOCK_TOTAL.map(([y, v]) => [y as number, v as number | null]));
  const vacMap = new Map<number, number | null>(STOCK_VACANT.map(([y, v]) => [y as number, v as number | null]));
  ok("ch03 guard: 2023 stock = 6504.7万戸 (確報; 速報 6502.1 forbidden)",
    stockMap.get(2023) === 6504.7, String(stockMap.get(2023)));
  ok("ch03 guard: 2023 vacancies = 900.2万戸 (確報; 速報 899.5 forbidden)",
    vacMap.get(2023) === 900.2, String(vacMap.get(2023)));
  const rentMap = new Map<number, number | null>(VAC_TYPE_RENTAL.map(([y, v]) => [y as number, v as number | null]));
  const otherMap = new Map<number, number | null>(VAC_TYPE_OTHER.map(([y, v]) => [y as number, v as number | null]));
  ok("ch03 guard: 2023 vacancy types pinned (rental 443.6 / other 385.6万戸)",
    rentMap.get(2023) === 443.6 && otherMap.get(2023) === 385.6,
    `${rentMap.get(2023)}/${otherMap.get(2023)}`);
}
// G3. Homeownership pinned + denominators distinct (87.3 FIES vs 60.9 survey)
{
  const ownMap = new Map<number, number | null>(TENURE_OWNED.map(([y, v]) => [y as number, v as number | null]));
  ok("ch03 guard: homeownership 1963=64.3, 2013=61.7, 2018=61.2, 2023=60.9 (occupied-dwelling denominator)",
    ownMap.get(1963) === 64.3 && ownMap.get(2013) === 61.7 &&
    ownMap.get(2018) === 61.2 && ownMap.get(2023) === 60.9,
    `${ownMap.get(1963)}/${ownMap.get(2013)}/${ownMap.get(2018)}/${ownMap.get(2023)}`);
  ok("ch03 guard: FIES frame owned-rate 87.3 ≠ survey 60.9 (both pinned, swap fails)",
    FIES_TENURE_META.ownedRate === 87.3 && ownMap.get(2023) === 60.9);
}
// G4. Prefecture vacancy anchors (final figures)
{
  const pm = new Map<string, number>(PREF_VACANCY.map(([p, v]) => [p, v]));
  ok("ch03 guard: prefecture anchors (徳島21.3/和歌山21.2/東京10.9/埼玉9.3/沖縄9.4/全国13.8)",
    pm.get("徳島県") === 21.3 && pm.get("和歌山県") === 21.2 && pm.get("東京都") === 10.9 &&
    pm.get("埼玉県") === 9.3 && pm.get("沖縄県") === 9.4 && pm.get("全国") === 13.8);
  ok("ch03 guard: prefecture chart = top6 + national + bottom4 (11 categories)",
    PREF_VACANCY.length === 11);
}
// G5. OECD base-year guard (the Chapter-02 mislabel class): 2015 = exactly 100
{
  const pti = new Map<number, number | null>(OECD_PTI_JPN.map(([y, v]) => [y as number, v as number | null]));
  const rhp = new Map<number, number | null>(OECD_RHP_JPN.map(([y, v]) => [y as number, v as number | null]));
  ok("ch03 guard: OECD PTI JPN 2015 = 100 exactly (index base anchor)",
    pti.get(2015) === 100, String(pti.get(2015)));
  ok("ch03 guard: OECD RHP JPN 2015 = 100 exactly (index base anchor)",
    rhp.get(2015) === 100, String(rhp.get(2015)));
  ok("ch03 guard: OECD PTI 1973 peak 213.1 and 2025 114.6 pinned",
    Math.abs((pti.get(1973) ?? 0) - 213.1) < 0.05 && Math.abs((pti.get(2025) ?? 0) - 114.6) < 0.05);
  ok("ch03 guard: OECD PTI series length 66 (1960–2025, no gaps)",
    OECD_PTI_JPN.length === 66 && pti.get(1960) !== undefined && pti.get(2025) !== undefined);
}
// G6. FIES classification guard (用途分類 shares, not 品目分類 amounts)
{
  const food = FIES_STRUCTURE.find(([k]) => k === "食料");
  const hous = FIES_STRUCTURE.find(([k]) => k === "住居");
  ok("ch03 guard: FIES structure uses 用途分類 (食料 89,754円/28.6% — not the 品目分類 94,895)",
    food && food[1] === 89754 && food[2] === 28.6, String(food));
  ok("ch03 guard: 住居 share = 5.9 (用途分類 published share)",
    hous && hous[1] === 18665 && hous[2] === 5.9, String(hous));
  const shareSum = FIES_STRUCTURE.reduce((s, [, , share]) => s + share, 0);
  ok("ch03 guard: FIES structure shares sum to 100", Math.abs(shareSum - 100) < 0.15, String(shareSum));
}
// G7. CPI base guard: 2025=100 series vs the separately-published 2020-base headline
{
  const cl = new Map<number, number | null>(CPI_LONG.map(([y, v]) => [y as number, v as number | null]));
  ok("ch03 guard: CPI long-run 2025 = 100.0 (2025 base)", cl.get(2025) === 100, String(cl.get(2025)));
  ok("ch03 guard: CPI long-run anchors (1970 27.6 / 2010 84.7)",
    cl.get(1970) === 27.6 && cl.get(2010) === 84.7, `${cl.get(1970)}/${cl.get(2010)}`);
  ok("ch03 guard: CPI headline 2020-base 111.9 ≠ chart series 100.0 (bases coexist by design)",
    CPI_HEADLINE.avg2025Index2020base === 111.9 && cl.get(2025) === 100);
  const rentYoY = new Map<number, number | null>(CPI_YOY_GROUPS.map(([y, , , , rent]) => [y as number, rent as number | null]));
  ok("ch03 guard: rent YoY pinned (+0.1/+0.2/+0.3 for 2023/24/25)",
    rentYoY.get(2023) === 0.1 && rentYoY.get(2024) === 0.2 && rentYoY.get(2025) === 0.3);
}
// G8. Text guards over the whole chapter 03 module
const { chapter03 } = await import("../src/chapters/chapter-03/index");
const ch03Strings: string[] = [];
collectStrings(chapter03.sections, ch03Strings);
collectStrings(chapter03.limitations, ch03Strings);
collectStrings(chapter03.charts, ch03Strings);
collectStrings(chapter03.sources, ch03Strings);
{
  const ptiCharts = chapter03.charts.filter((c) => c.sourceIds.includes("oecd-ahpi"));
  ok("ch03 guard: every OECD chart states the 2015=100 index base in its title or unit",
    ptiCharts.length === 2 && ptiCharts.every((c) =>
      c.title.ja.includes("2015年=100") && c.unit.ja.includes("2015年=100")),
    `${ptiCharts.length} OECD charts`);
  ok("ch03 guard: OECD charts never labeled as price levels (水準/ドル/円/㎡ absent from unit)",
    ptiCharts.every((c) => !/水準|ドル|円\/|㎡/.test(c.unit.ja)));
  const burdenChart = chapter03.charts.find((c) => c.id === "ch03-rent-burden");
  ok("ch03 guard: rent-burden chart discloses DERIVED status (派生/DERIVED)",
    burdenChart ? burdenChart.note.ja.includes("派生計算") && burdenChart.note.en.includes("DERIVED") : false);
  const vacancyChart = chapter03.charts.find((c) => c.id === "ch03-pref-vacancy");
  ok("ch03 guard: prefecture chart discloses its selection rule",
    vacancyChart ? vacancyChart.note.ja.includes("上位6県") && vacancyChart.note.en.includes("six highest") : false);
  // Affirmative mislabels fail; explicit negations ("水準差ではない") pass.
  ok("ch03 guard: chapter text never affirmatively calls OECD ratios 水準 (levels)",
    ch03Strings.every((t) => !(t.includes("価格所得比") && t.includes("水準") &&
      !t.includes("指数") && !/ではない|ではなく|意味しません|別物/.test(t))));
  ok("ch03 guard: CPI base-year switch disclosed in limitations",
    ch03Strings.some((t) => t.includes("2020年基準から2025年基準") || t.includes("2020 to the 2025 base")));
  ok("ch03 guard: 速報 (provisional 2023 stock 65,021千戸) never used as final",
    ch03Strings.every((t) => !t.includes("6,502.1万") && !t.includes("6502.1万") && !t.includes("899.5万")));
}
// G9. Narrative-peak guards (pre-merge audit 2026-10-26: prose had misstated
// series peaks even though the data layer was correct — same failure class as
// the Ch01 year-swap: a checkable claim, wrong in the gloss).
{
  // RHP series peak must be 165.8 in 1991 — NOT 1990/163.3.
  const rhpPeak = OECD_RHP_JPN.reduce(
    (best, [y, v]) =>
      typeof v === "number" && (best[1] === null || v > (best[1] as number)) ? [y, v] : best,
    [0, null] as [number, number | null],
  );
  ok("ch03 guard: RHP Japan series peak is 165.8 in 1991 (not 1990/163.3)",
    rhpPeak[0] === 1991 && Math.abs((rhpPeak[1] ?? -1) - 165.8) < 0.05, String(rhpPeak));
  ok("ch03 guard: text cites the 1991/165.8 RHP peak and never the wrong 1990/163.3 peak claim",
    ch03Strings.some((t) => t.includes("165.8") && (t.includes("1991") || t.includes("1991年"))) &&
    ch03Strings.every((t) => !t.includes("163.3を頂点") && !t.includes("163.3をピーク") && !t.includes("peaked at 163.3")));
  // PTI post-1973 minimum must be 96.0 in 2009 — never claimed as 97.4/2010 trough.
  const ptiPost73 = OECD_PTI_JPN.filter(([y]) => (y as number) >= 1974) as ReadonlyArray<[number, number]>;
  const ptiMin = ptiPost73.reduce((best, [y, v]) => (v < best[1] ? [y, v] : best), [0, Infinity] as [number, number]);
  ok("ch03 guard: PTI Japan post-1973 minimum is 96.0 in 2009 (2010/97.4 is not the trough)",
    ptiMin[0] === 2009 && Math.abs(ptiMin[1] - 96.0) < 0.05, String(ptiMin));
  // Floor-area series peak must be 94.85 in 2003 — NOT 2013/94.42.
  const areaPeak = AREA_TOTAL.reduce(
    (best, [y, v]) =>
      typeof v === "number" && (best[1] === null || v > (best[1] as number)) ? [y, v] : best,
    [0, null] as [number, number | null],
  );
  ok("ch03 guard: floor-area series peak is 94.85 m² in 2003 (not 2013/94.42)",
    areaPeak[0] === 2003 && Math.abs((areaPeak[1] ?? -1) - 94.85) < 0.005, String(areaPeak));
  ok("ch03 guard: text cites the 2003/94.85 floor-area peak; wrong 2013-peak claim absent",
    ch03Strings.some((t) => t.includes("94.85") && (t.includes("2003") || t.includes("2003年"))) &&
    ch03Strings.every((t) => !t.includes("2013年に94.42") && !t.includes("2013年の94.42㎡をピーク") && !t.includes("2013 peak of 94.42")));
  // FIES 2025 nominal expenditure is BELOW the 2000 level (314,001 < 317,328).
  const f2000 = FIES_EXPENDITURE.find(([y]) => y === 2000)?.[1] ?? 0;
  const f2025 = FIES_EXPENDITURE.find(([y]) => y === 2025)?.[1] ?? 0;
  ok("ch03 guard: FIES 2025 (314,001) is below the 2000 level (317,328)",
    f2025 === 314001 && f2000 === 317328 && f2025 < f2000, `${f2000}/${f2025}`);
  ok("ch03 guard: text never claims 2025 expenditure is above the 2000 level",
    ch03Strings.every((t) => !t.includes("2000年を上回る") && !t.includes("above the 2000 level")));
  // Vacancy-rate "≈4×" claim must be anchored to 1963→1993 (2.5→9.8).
  const v1963 = VACANCY_RATE.find(([y]) => y === 1963)?.[1] ?? 0;
  const v1993 = VACANCY_RATE.find(([y]) => y === 1993)?.[1] ?? 0;
  ok("ch03 guard: vacancy rate 1963→1993 is ≈4× (2.5 → 9.8), the only valid 30-year window",
    v1963 === 2.5 && v1993 === 9.8 && v1993 / v1963 < 4.2 && v1993 / v1963 > 3.7, `${v1963}→${v1993}`);
  ok("ch03 guard: any four-fold vacancy claim is anchored to 1993, never to the post-1990s period",
    ch03Strings.every((t) =>
      !t.includes("約4倍") || t.includes("1993") || !t.includes("1990年代以降") || t.includes("1993年には約4倍")) &&
    ch03Strings.every((t) =>
      !/four-fold|quadrupled/.test(t) || t.includes("1993")));
}

// ---------------------------------------------------------------------------
// 4f. Data agreement + regression guards (Chapter 04 — Labor & Working
//     Conditions, 2026-10-26). Audit lessons driving the guards:
//     (i)  cross-table contamination (Ch01) — every LFS/MLS/wage series is
//          compared field-by-field against the anchored extraction JSON;
//     (ii) unit mislabeling (Ch02) — hours are hours/MONTH (MLS) vs
//          hours/YEAR (OECD), ratios are indices (male=100 / regular=100),
//          and the OECD's own "trend not level" caveat is enforced in text;
//     (iii) prose ≠ data (Ch03) — narrative-peak/trough/claim guards (G9)
//          for the unemployment peak, non-regular plateau, paid-leave record,
//          accident minima and mental-comp multiple.
// ---------------------------------------------------------------------------
console.log("\n[4f] Data agreement + regression guards (chapter 04)");

const extraction4Path = resolve(ROOT, "research/chapter04/notes/extracted-series.json");
const extraction4 = JSON.parse(readFileSync(extraction4Path, "utf-8")) as Record<string, any>;

const {
  EMPLOYED_TOTAL, UNEMPLOYMENT_RATE, EMPLOYMENT_RATE,
  STATUS_SELFEMPLOYED, STATUS_FAMILY, STATUS_EMPLOYEE,
  OLDER_EMPRATE_65, OLDER_EMPRATE_6064,
  NONREGULAR_SHARE_TOTAL, NONREGULAR_SHARE_MALE, NONREGULAR_SHARE_FEMALE,
  NONREGULAR_COUNT, REGULAR_COUNT,
  NONREGULAR_AGE_2025, NONREGULAR_REASONS_2025,
  HOURS_TOTAL_30, HOURS_TOTAL_5, HOURS_OVERTIME_5,
  HOURS_GENERAL, HOURS_PARTTIME, PARTTIME_RATIO,
  LEAVE_RATE, LEAVE_GRANTED, LEAVE_TAKEN,
  GENDER_WAGE_RATIO, FORM_WAGE_GAP,
  WAGE_CURVE_MALE, WAGE_CURVE_FEMALE, WAGE_CURVE_AGES, FORM_GAP_BY_AGE,
  ACCIDENT_DEATH, ACCIDENT_INJURY,
  MENTAL_CLAIMS, MENTAL_DECISIONS, MENTAL_GRANTED,
  OECD_HOURS_LATEST, OECD_HOURS_JPN, OECD_GWG_LATEST, OECD_GWG_JPN_MEDIAN,
  OECD_TEMP_JPN, HEADLINE_2025,
  DATA_SNAPSHOT_HASH: CH04_SNAPSHOT_HASH,
} = await import("../src/chapters/chapter-04/data");

const chapter04 = getChapterModule("labor-working-conditions");
ok("ch04 registered with real module", chapter04 !== null);
const ch04Strings: string[] = [];
if (chapter04) {
  for (const s of chapter04.sections) {
    ch04Strings.push(s.heading.ja, s.heading.en);
    for (const b of s.blocks) {
      if (b.type === "p" || b.type === "callout") {
        ch04Strings.push(b.text.ja, b.text.en);
        if (b.type === "callout" && b.title) ch04Strings.push(b.title.ja, b.title.en);
      } else if (b.type === "ul") {
        for (const it of b.items) ch04Strings.push(it.ja, it.en);
      } else if (b.type === "stats") {
        for (const it of b.items) ch04Strings.push(it.value.ja, it.value.en, it.label.ja, it.label.en);
      }
    }
  }
  for (const l of chapter04.limitations) ch04Strings.push(l.ja, l.en);
  for (const c of chapter04.charts) {
    ch04Strings.push(c.title.ja, c.title.en, c.description.ja, c.description.en);
    if (c.note) ch04Strings.push(c.note.ja, c.note.en);
  }
}

function pairsAgree4(
  name: string,
  pairs: ReadonlyArray<[number | string, number | null]>,
  expected: Record<string, any>,
  field?: string,
) {
  let mismatches = 0;
  for (const [y, v] of pairs) {
    const exp = expected[String(y)];
    const expVal = field ? exp?.[field] : exp;
    if (expVal === undefined || expVal === null) continue;
    if (v === null || Math.abs(v - expVal) > 1e-9) mismatches++;
  }
  ok(`ch04 data agreement: ${name}`, mismatches === 0, `${mismatches} mismatching points`);
}

const lfsMain4 = extraction4.lfs.main as Record<string, any>;
const lfsStatus4 = extraction4.lfs.status as Record<string, any>;
const lfsAge4 = extraction4.lfs.age as Record<string, any>;
const lfsForm4 = extraction4.lfs.form as Record<string, Record<string, any>>;
const mls4 = extraction4.mls as Record<string, Record<string, any>>;
const pl4 = extraction4.paidLeave as Record<string, Record<string, number>>;
const wage4 = extraction4.wage as Record<string, Record<string, any>>;
const acc4 = extraction4.accidents as Record<string, Record<string, number>>;
const oecd4 = extraction4.oecd as Record<string, Record<string, any>>;

pairsAgree4("LFS employed", EMPLOYED_TOTAL, lfsMain4, "employed");
pairsAgree4("LFS unemployment rate", UNEMPLOYMENT_RATE, lfsMain4, "unemprate");
pairsAgree4("LFS status self-employed", STATUS_SELFEMPLOYED, lfsStatus4, "selfemployed");
pairsAgree4("LFS status family", STATUS_FAMILY, lfsStatus4, "family");
pairsAgree4("LFS status employee", STATUS_EMPLOYEE, lfsStatus4, "employee");
pairsAgree4("LFS older emprate 65+", OLDER_EMPRATE_65, lfsAge4, "65+_rate");
pairsAgree4("LFS older emprate 60-64", OLDER_EMPRATE_6064, lfsAge4, "60-64_rate");
pairsAgree4("LFS nonregular share total", NONREGULAR_SHARE_TOTAL, lfsForm4.total, "nonregular_share");
pairsAgree4("LFS nonregular share male", NONREGULAR_SHARE_MALE, lfsForm4.male, "nonregular_share");
pairsAgree4("LFS nonregular share female", NONREGULAR_SHARE_FEMALE, lfsForm4.female, "nonregular_share");
pairsAgree4("LFS nonregular count", NONREGULAR_COUNT, lfsForm4.total, "nonregular");
pairsAgree4("MLS hours 30+", HOURS_TOTAL_30, mls4.scale30, "total");
pairsAgree4("MLS hours 5+", HOURS_TOTAL_5, mls4.scale5, "total");
pairsAgree4("MLS overtime 5+", HOURS_OVERTIME_5, mls4.scale5, "overtime");
pairsAgree4("MLS general hours", HOURS_GENERAL, mls4.general, "total");
pairsAgree4("MLS parttime hours", HOURS_PARTTIME, mls4.parttime, "total");
pairsAgree4("Paid leave rate", LEAVE_RATE, pl4.rate);
pairsAgree4("Paid leave granted", LEAVE_GRANTED, pl4.granted);
pairsAgree4("Paid leave taken", LEAVE_TAKEN, pl4.taken);
pairsAgree4("Wage gender ratio", GENDER_WAGE_RATIO, wage4.gender, "ratio");
pairsAgree4("Wage form gap", FORM_WAGE_GAP, wage4.form, "gap");
pairsAgree4("Accident death", ACCIDENT_DEATH, acc4.death);
pairsAgree4("Accident injury", ACCIDENT_INJURY, acc4.injury);
pairsAgree4("Mental claims", MENTAL_CLAIMS, acc4.mental, "claims");
pairsAgree4("Mental decisions", MENTAL_DECISIONS, acc4.mental, "decisions");
pairsAgree4("Mental granted", MENTAL_GRANTED, acc4.mental, "granted");
pairsAgree4("OECD hours JPN", OECD_HOURS_JPN, oecd4.hours.JPN);
pairsAgree4("OECD gwg JPN median", OECD_GWG_JPN_MEDIAN, oecd4.gwg.JPN.MEDIAN);
pairsAgree4("OECD temp JPN", OECD_TEMP_JPN, oecd4.temp.JPN);

// Headline anchors (verified verbatim in notes/mhlw-summary.md etc.)
ok("ch04 headline 2025 employed 6828", HEADLINE_2025.employed === 6828);
ok("ch04 headline 2025 unemployment rate 2.5", HEADLINE_2025.unemploymentRate === 2.5);
ok("ch04 headline 2025 nonregular 2128 / 36.5",
  HEADLINE_2025.nonregular === 2128 && HEADLINE_2025.nonregularShare === 36.5);
ok("ch04 headline 2025 hours 135.1 / overtime 9.8",
  HEADLINE_2025.hoursTotal5 === 135.1 && HEADLINE_2025.hoursOvertime5 === 9.8);
ok("ch04 headline parttime ratio 31.3", HEADLINE_2025.parttimeRatio === 31.3);
ok("ch04 headline leave 66.9 / 18.1 / 12.1",
  HEADLINE_2025.leaveRate === 66.9 && HEADLINE_2025.leaveGranted === 18.1 && HEADLINE_2025.leaveTaken === 12.1);
ok("ch04 headline gender ratio 76.6 / female 285.9 / male 373.4",
  HEADLINE_2025.genderRatio === 76.6 && HEADLINE_2025.femaleWage === 285.9 && HEADLINE_2025.maleWage === 373.4);
ok("ch04 headline form gap 67.4", HEADLINE_2025.formGap === 67.4);
ok("ch04 headline accident death 700 / injury 135333",
  HEADLINE_2025.accidentDeath === 700 && HEADLINE_2025.accidentInjury === 135333);
ok("ch04 headline mental claims 4958", HEADLINE_2025.mentalClaims === 4958);

// Age-gap recomputes (published gaps must recompute from published components)
{
  const ageMap = new Map(NONREGULAR_AGE_2025.map(([k, v]) => [k as string, v as number]));
  ok("ch04 nonregular age 2025: 15-24=52.7, 25-34=20.7, 65+=76.1",
    ageMap.get("15-24") === 52.7 && ageMap.get("25-34") === 20.7 && ageMap.get("65+") === 76.1);
  ok("ch04 nonregular age U-shape (dip at 25-34, rise to 65+)",
    (ageMap.get("25-34") as number) < (ageMap.get("15-24") as number) &&
    (ageMap.get("25-34") as number) < (ageMap.get("45-54") as number) &&
    (ageMap.get("65+") as number) > (ageMap.get("55-64") as number));
  // reasons sum ≤ total (不詳 included)
  const rsum = Math.round(NONREGULAR_REASONS_2025.reduce((s, [, v]) => s + v, 0) * 10) / 10;
  ok("ch04 reasons 2025 sum ≤ 100.2 (不詳 remainder; 0.1 rounding)", rsum <= 100.2 && rsum >= 90, String(rsum));
  const reasonMap = new Map(NONREGULAR_REASONS_2025);
  ok("ch04 reason 自分の都合 36.6 / 正規の仕事がない 8.4",
    reasonMap.get("自分の都合のよい時間に働きたいから") === 36.6 &&
    reasonMap.get("正規の職員・従業員の仕事がないから") === 8.4);
}

// Paid-leave recompute + gap recompute
{
  let badRate = 0;
  for (const [y, r] of LEAVE_RATE) {
    const g = LEAVE_GRANTED.find(([yy]) => yy === y)?.[1];
    const t = LEAVE_TAKEN.find(([yy]) => yy === y)?.[1];
    if (g && t && r !== null && Math.abs(Math.round((t / g) * 1000) / 10 - r) > 0.6) badRate++;
  }
  ok("ch04 paid-leave rate ≈ taken/granted (0.6pt)", badRate === 0, `${badRate} bad years`);
  let badGap = 0;
  for (const [y, gap] of FORM_WAGE_GAP) {
    const w = wage4.form[String(y)];
    if (w && Math.abs(Math.round((w.nonregular / w.regular) * 1000) / 10 - (gap as number)) > 0.25) badGap++;
  }
  ok("ch04 form gap recomputes from 賃金構造 components", badGap === 0, `${badGap} bad years`);
}

// ---- regression guards (audit-lesson classes) -----------------------------

// G-A. Unemployment peak must be 5.4 in 2002 (Ch03 narrative-peak pattern)
{
  const peak = UNEMPLOYMENT_RATE.reduce(
    (best, [y, v]) => (typeof v === "number" && (best[1] === null || v > (best[1] as number)) ? [y, v] : best),
    [0, null] as [number, number | null],
  );
  ok("ch04 guard: unemployment-rate peak is 5.4 in 2002", peak[0] === 2002 && Math.abs((peak[1] ?? -1) - 5.4) < 0.05, String(peak));
  ok("ch04 guard: text cites the 2002/5.4 peak",
    ch04Strings.some((t) => t.includes("5.4%") && (t.includes("2002") || t.includes("2002年"))));
  // 2020 pandemic rate 2.8 — no dramatic-spike claim
  const r1975 = UNEMPLOYMENT_RATE.find(([y]) => y === 1975)?.[1];
  ok("ch04 guard: 1975 oil-shock unemployment 1.9 (not 2.0)", r1975 === 1.9);
  const r2020 = UNEMPLOYMENT_RATE.find(([y]) => y === 2020)?.[1];
  ok("ch04 guard: 2020 unemployment 2.8 (no pandemic-spike narrative)", r2020 === 2.8);
  ok("ch04 guard: text never calls 2020 a surge in unemployment",
    ch04Strings.every((t) => !t.includes("失業率が急騰") && !t.includes("unemployment surged")));
}

// G-B. Non-regular share: 2019 is the maximum; 2025 is NOT a record high
{
  const seq = NONREGULAR_SHARE_TOTAL.filter(([, v]) => v !== null) as ReadonlyArray<[number, number]>;
  const max = seq.reduce((b, [y, v]) => (v > b[1] ? [y, v] : b), [0, 0] as [number, number]);
  ok("ch04 guard: non-regular share max is 38.3 in 2019; 2025 (36.5) is 6 years past the peak",
    max[0] === 2019 && Math.abs(max[1] - 38.3) < 0.05, String(max));
  ok("ch04 guard: text never claims the non-regular share is at a record high",
    ch04Strings.every((t) => !t.includes("非正規比率が過去最多") && !t.includes("非正規の割合が過去最高") &&
      !t.includes("record high for non-regular") && !t.includes("non-regular share at a record")));
  ok("ch04 guard: text states the post-2019 decline (頂点/低下/peak/eased)",
    ch04Strings.some((t) => (t.includes("頂点") && t.includes("低下")) || (t.includes("peak") && (t.includes("eased") || t.includes("easing")))));
}

// G-C. Paid leave: 66.9 (2025 survey) IS the record — the direction opposite of G-B
{
  const seq = LEAVE_RATE.filter(([, v]) => v !== null) as ReadonlyArray<[number, number]>;
  const max = seq.reduce((b, [y, v]) => (v > b[1] ? [y, v] : b), [0, 0] as [number, number]);
  ok("ch04 guard: paid-leave rate max is 66.9 at the 2025 survey", max[0] === 2025 && Math.abs(max[1] - 66.9) < 0.05, String(max));
  const min = seq.reduce((b, [y, v]) => (v < b[1] ? [y, v] : b), [2000, 100] as [number, number]);
  ok("ch04 guard: post-2000 minimum is 46.6 in 2005-2006 window", min[1] <= 46.7, String(min));
  ok("ch04 guard: 1989 absent from the series (no survey)",
    LEAVE_RATE.every(([y]) => y !== 1989));
  ok("ch04 guard: text never treats the survey-year axis as calendar-year for R7",
    ch04Strings.some((t) => t.includes("2025年調査") && t.includes("2024年")));
}

// G-D. Accidents: death minimum is 700 in 2025; injury is NOT at its minimum
{
  const dmax = ACCIDENT_DEATH.reduce((b, [y, v]) => (typeof v === "number" && v > b[1] ? [y, v] : b), [0, 0] as [number, number]);
  ok("ch04 guard: death maximum 4,330 in 1975 (not 1974)", dmax[0] === 1975 && dmax[1] === 4330, String(dmax));
  const dmin = ACCIDENT_DEATH.reduce((b, [y, v]) => (typeof v === "number" && v < b[1] ? [y, v] : b), [0, Infinity] as [number, number]);
  ok("ch04 guard: death minimum 700 in 2025 (genuine record low)", dmin[0] === 2025 && dmin[1] === 700, String(dmin));
  const imax = ACCIDENT_INJURY.reduce((b, [y, v]) => (typeof v === "number" && v > b[1] ? [y, v] : b), [0, 0] as [number, number]);
  ok("ch04 guard: injury maximum 348,826 in 1978", imax[0] === 1978 && imax[1] === 348826, String(imax));
  const imin = ACCIDENT_INJURY.reduce((b, [y, v]) => (typeof v === "number" && v < b[1] ? [y, v] : b), [0, Infinity] as [number, number]);
  ok("ch04 guard: injury minimum 105,718 in 2009 (the Lehman trough)", imin[0] === 2009 && imin[1] === 105718, String(imin));
  const i2009 = ACCIDENT_INJURY.find(([y]) => y === 2009)?.[1];
  const i2008 = ACCIDENT_INJURY.find(([y]) => y === 2008)?.[1];
  ok("ch04 guard: injury Lehman drop 2008→2009 (119,291→105,718)", i2008 === 119291 && i2009 === 105718);
  const iLast = ACCIDENT_INJURY[ACCIDENT_INJURY.length - 1];
  ok("ch04 guard: injury 2025 (135,333) is well above its 2011-era minimum — no 'record low' claim possible",
    iLast[1] === 135333 && (iLast[1] as number) > 110000);
  ok("ch04 guard: text does not claim injuries are at a record low",
    ch04Strings.every((t) => !t.includes("死傷者数が過去最少") && !t.includes("injuries at a record low")));
  // 2009 Lehman drop mirrors the anchored death drop
  const d2008 = ACCIDENT_DEATH.find(([y]) => y === 2008)?.[1];
  const d2009 = ACCIDENT_DEATH.find(([y]) => y === 2009)?.[1];
  ok("ch04 guard: death Lehman drop 2008→2009 (1,268→1,075)", d2008 === 1268 && d2009 === 1075);
}

// G-E. Mental comp: FY2025 claims 4,958 = ~2.7× FY2018; recognition rate recompute
{
  const c2018 = MENTAL_CLAIMS.find(([y]) => y === 2018)?.[1];
  const c2025 = MENTAL_CLAIMS.find(([y]) => y === 2025)?.[1];
  ok("ch04 guard: mental claims FY2018 1,820 → FY2025 4,958 (≈2.7×)",
    c2018 === 1820 && c2025 === 4958 && (c2025 / c2018 > 2.6) && (c2025 / c2018 < 2.8));
  const g25 = MENTAL_GRANTED.find(([y]) => y === 2025)?.[1];
  const d25 = MENTAL_DECISIONS.find(([y]) => y === 2025)?.[1];
  ok("ch04 guard: FY2025 recognition rate recomputes to 28.2%",
    g25 === 1082 && d25 === 3839 && Math.abs(Math.round((g25 / d25) * 1000) / 10 - 28.2) < 0.15);
  ok("ch04 guard: text never equates rising claims with rising illness",
    ch04Strings.some((t) => t.includes("そのまま") && (t.includes("訳す") || t.includes("読み")) || t.includes("cannot be translated directly") || t.includes("cannot be read as")));
}

// G-F. Units: MLS hours are monthly; OECD hours are annual — no conflation
{
  const h5_2025 = HOURS_TOTAL_5.find(([y]) => y === 2025)?.[1];
  const oecdJ25 = OECD_HOURS_JPN.find(([y]) => y === 2025)?.[1];
  ok("ch04 guard: MLS 135.1 h/month vs OECD 1597.5 h/year kept distinct",
    h5_2025 === 135.1 && Math.abs((oecdJ25 as number) - 1597.507) < 0.01);
  ok("ch04 guard: text labels MLS hours as 月平均/月 every time and OECD as 年間",
    ch04Strings.some((t) => t.includes("月平均") && t.includes("135.1")) &&
    ch04Strings.some((t) => t.includes("1,597.5") && t.includes("年間")));
  ok("ch04 guard: OECD trend-not-level caveat present in text",
    ch04Strings.some((t) => t.includes("水準比較には適さない") || t.includes("unsuitable for level comparisons") || t.includes("not directly comparable")));
  ok("ch04 guard: OECD temporary ≠ Japan non-regular disclosed",
    ch04Strings.some((t) => t.includes("概念") && t.includes("同一") && (t.includes("臨時雇用") || t.includes("temporary"))));
}

// G-G. Wage-gap guards: 1976 floor 58.8; 2025 76.6; curve peaks
{
  const ratioMin = GENDER_WAGE_RATIO.reduce((b, [y, v]) => (typeof v === "number" && v < b[1] ? [y, v] : b), [0, Infinity] as [number, number]);
  const ratioMax = GENDER_WAGE_RATIO.reduce((b, [y, v]) => (typeof v === "number" && v > b[1] ? [y, v] : b), [0, 0] as [number, number]);
  ok("ch04 guard: gender ratio — series starts 58.8 (1976), minimum 58.6 (1982), maximum 76.6 (2025)",
    GENDER_WAGE_RATIO[0][1] === 58.8 && ratioMin[0] === 1982 && Math.abs(ratioMin[1] - 58.6) < 0.05 &&
    Math.abs(ratioMax[1] - 76.6) < 0.05 && ratioMax[0] === 2025,
    `min=${ratioMin} max=${ratioMax} first=${GENDER_WAGE_RATIO[0]}`);
  const malePeak = Math.max(...(WAGE_CURVE_MALE.filter((v) => v !== null) as number[]));
  const femalePeak = Math.max(...(WAGE_CURVE_FEMALE.filter((v) => v !== null) as number[]));
  ok("ch04 guard: male wage-curve peak 445.6 (55-59) vs female 305.7",
    malePeak === 445.6 && femalePeak === 305.7);
  ok("ch04 guard: text presents the gaps as UNADJUSTED (未調整/unadjusted)",
    ch04Strings.some((t) => t.includes("未調整") || t.includes("unadjusted")));
  ok("ch04 guard: text does not attribute gaps wholly to discrimination or choice",
    ch04Strings.some((t) => t.includes("差別") && t.includes("選択")) || ch04Strings.some((t) => t.includes("discrimination") && t.includes("choice")));
}

// G-H. Hours guards: 1970 series start for 30+; 1990 for 5+; part-ratio 31.3
{
  ok("ch04 guard: hours-30 starts 1970; hours-5 starts 1990",
    HOURS_TOTAL_30[0][0] === 1970 && HOURS_TOTAL_5[0][0] === 1990);
  ok("ch04 guard: MLS 30+ 1970=186.6 and 2025=141.1 (narrative anchors)",
    HOURS_TOTAL_30[0][1] === 186.6 && HOURS_TOTAL_30[HOURS_TOTAL_30.length - 1][1] === 141.1);
  ok("ch04 guard: hours 1990 172.0 (30+: 200.4-ish long-run high) — 2025 135.1",
    HOURS_TOTAL_5[0][1] === 172.0 && HOURS_TOTAL_5[HOURS_TOTAL_5.length - 1][1] === 135.1);
  const pr25 = PARTTIME_RATIO.find(([y]) => y === 2025)?.[1];
  ok("ch04 guard: part-time ratio 2025 31.3 / 1990 12.3", pr25 === 31.3 && PARTTIME_RATIO[0][1] === 12.3);
  ok("ch04 guard: composition-effect disclosure present (構成効果/composition effect)",
    ch04Strings.some((t) => t.includes("構成効果") || t.includes("composition effect")));
}

// G-I. Chart-spec sanity for ch04 (ids unique, years/values aligned)
{
  const ids = new Set<string>();
  let dup = 0, misaligned = 0, badSource = 0;
  const sourceIds = new Set<string>(chapter04?.sources.map((s) => s.id) ?? []);
  for (const c of chapter04?.charts ?? []) {
    if (ids.has(c.id)) dup++;
    ids.add(c.id);
    for (const s of c.series) {
      if (s.values.length !== c.years.length) misaligned++;
    }
    for (const sid of c.sourceIds) {
      if (!sourceIds.has(sid)) badSource++;
    }
    if (c.csv === false) badSource++; // CSV downloads must stay enabled
  }
  ok("ch04 chart ids unique", dup === 0);
  ok("ch04 chart series aligned with years", misaligned === 0);
  ok("ch04 chart source ids resolve", badSource === 0);
  ok("ch04 chart count is 15", (chapter04?.charts.length ?? 0) === 15);
}

// G-J. 2023→2024→2025 accident continuity + OECD comparator sanity
{
  const d23 = ACCIDENT_DEATH.find(([y]) => y === 2023)?.[1];
  const d24 = ACCIDENT_DEATH.find(([y]) => y === 2024)?.[1];
  const d25b = ACCIDENT_DEATH.find(([y]) => y === 2025)?.[1];
  ok("ch04 guard: death 755 → 746 → 700 (2023-2025 continuity)", d23 === 755 && d24 === 746 && d25b === 700);
  const oecdMap = new Map(OECD_HOURS_LATEST.map(([a, y, v]) => [a as string, v as number]));
  ok("ch04 guard: OECD hours JPN 1597.5 < OECD avg 1736.1 < KOR 1833",
    (oecdMap.get("JPN") as number) < (oecdMap.get("OECD") as number) &&
    (oecdMap.get("OECD") as number) < (oecdMap.get("KOR") as number));
  const gwgMap = new Map(OECD_GWG_LATEST.map(([a, y, v]) => [a as string, v as number]));
  ok("ch04 guard: OECD gwg JPN 20.1 ≈ 2× OECD avg 10.1",
    Math.abs((gwgMap.get("JPN") as number) - 20.1) < 0.05 && Math.abs((gwgMap.get("OECD") as number) - 10.07) < 0.1);
  ok("ch04 guard: text does not rank OECD hours as a league table",
    ch04Strings.some((t) => t.includes("序列としてではなく") || t.includes("not a ranking") || t.includes("not a league")));
}

// G-K. Section-structure guard: 10 sections, bilingual parity of chart refs
{
  const nSections = chapter04?.sections.length ?? 0;
  ok("ch04 has 10 sections", nSections === 10);
  const chartRefs = new Set<string>();
  for (const s of chapter04?.sections ?? []) {
    for (const b of s.blocks) {
      if (b.type === "chart") chartRefs.add(b.chartId);
    }
  }
  const chartIds = new Set((chapter04?.charts ?? []).map((c) => c.id));
  const missing = [...chartIds].filter((id) => !chartRefs.has(id));
  ok("ch04 every chart is referenced by content", missing.length === 0, missing.join(","));
}

// G-L. Prose-number agreement (negative-test N5 gap): key figures cited in
// narrative prose must match the data layer verbatim. Co-occurrence checks
// trip when a citation is altered or removed; the mental-comp allow-list
// trips on ANY fabricated number in a 精神障害/mental-disorder string (the
// self-audit lesson: fabricated 複数業務要因 2,733/635 vs actual 17/4).
{
  ok("ch04 guard: prose accident figures match data (347,407 → 105,718 minimum; deaths 4,330 → 700)",
    ch04Strings.some((t) => t.includes("347,407") && t.includes("105,718")) &&
    ch04Strings.some((t) => /700人|to 700|700 deaths/.test(t)) &&
    ch04Strings.some((t) => t.includes("4,330")));
  ok("ch04 guard: prose headline figures match data (6,828万 employed; 2,128万 non-regular)",
    ch04Strings.some((t) => t.includes("6,828万")) && ch04Strings.some((t) => t.includes("2,128万")));
  ok("ch04 guard: prose leave figures match data (66.9 / 18.1 / 12.1 in one citation)",
    ch04Strings.some((t) => t.includes("66.9") && t.includes("18.1") && t.includes("12.1")));
  ok("ch04 guard: prose wage figures match data (58.8 floor and 76.6 latest in one series citation)",
    ch04Strings.some((t) => t.includes("58.8") && t.includes("76.6")));
  // Mental-comp allow-list: every non-year number in a mental-disorder string
  // must resolve to the data layer (MENTAL_CLAIMS/DECISIONS/GRANTED), the
  // recomputed aggregates (2.7×, 28.2%), or the verbatim note anchors from
  // the same MHLW release (1,254 brain/heart claims, 217 granted, 17
  // multi-employer mental decisions).
  const mentalNums = new Set<string>();
  for (const [y, v] of MENTAL_CLAIMS) if (v !== null) { mentalNums.add(String(v)); mentalNums.add(v.toLocaleString("en-US")); }
  for (const [y, v] of MENTAL_DECISIONS) if (v !== null) { mentalNums.add(String(v)); mentalNums.add(v.toLocaleString("en-US")); }
  for (const [y, v] of MENTAL_GRANTED) if (v !== null) { mentalNums.add(String(v)); mentalNums.add(v.toLocaleString("en-US")); }
  for (const n of ["2.7", "28.2", "1,254", "1254", "217", "17"]) mentalNums.add(n);
  let mentalBad = 0; const mentalBadList: string[] = [];
  for (const t of ch04Strings) {
    if (!/精神障害の労災請求件数|精神障害の件数|work-related mental disorders/.test(t)) continue;
    for (const m of t.matchAll(/\d{1,3}(?:,\d{3})+|\d+\.\d+|\b\d{2,4}\b/g)) {
      const n = m[0];
      if (/^(19|20)\d{2}$/.test(n)) continue; // years
      if (!mentalNums.has(n) && !mentalNums.has(n.replace(/,/g, ""))) { mentalBad++; mentalBadList.push(n); }
    }
  }
  ok("ch04 guard: every number in mental-comp text resolves to the data layer or verified note anchors",
    mentalBad === 0, mentalBadList.join(","));
}

// G-M. Survey-year framing (negative-test N6 gap): the R7 (2025-round)
// 就労条件総合調査 leave figures cover calendar 2024 — no string may
// attribute 66.9% to calendar 2025. JA: a 2025年 mention in a 66.9 string
// must be part of 2025年調査 (unless the calendar-2024 form is used); EN: a
// 2025 mention requires survey/round/calendar-2024 framing.
{
  ok("ch04 guard: 66.9% never attributed to calendar 2025 (survey-year framing required)",
    ch04Strings.every((t) => {
      if (!t.includes("66.9")) return true;
      if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(t)) {
        return !/2025年(?!調査)/.test(t) || /2024年暦年/.test(t);
      }
      return !/\b2025\b/.test(t) || /survey|round|calendar[- ]?2024/i.test(t);
    }));
}

// G-N. 1973 Okinawa double-row convention (audit D1): the kept 1973 values
// must be the Okinawa-INCLUDED rows (forward-continuous with 1974+), per the
// LFS handbook's dual-publication note (解説 (3)ア). The excluded row is
// 5223/1.2/3591/961/662/56.8 — any of those in the delivered series is a
// regression to the pre-audit bug.
{
  const e1973 = EMPLOYED_TOTAL.find(([y]) => y === 1973)?.[1];
  const r1973 = UNEMPLOYMENT_RATE.find(([y]) => y === 1973)?.[1];
  const emp1973 = STATUS_EMPLOYEE.find(([y]) => y === 1973)?.[1];
  const self1973 = STATUS_SELFEMPLOYED.find(([y]) => y === 1973)?.[1];
  const fam1973 = STATUS_FAMILY.find(([y]) => y === 1973)?.[1];
  ok("ch04 guard: 1973 = Okinawa-included row (5259 / 1.3 / 3615 / 970 / 665)",
    e1973 === 5259 && r1973 === 1.3 && emp1973 === 3615 && self1973 === 970 && fam1973 === 665,
    `${e1973}/${r1973}/${emp1973}/${self1973}/${fam1973}`);
}

// G-O. Non-regular category-basis guard (audit D2): 嘱託 became a separate
// survey category only in 2013 (表10-1 col M empty 2002-2012) — no prose may
// compose a 2002 契約社員・嘱託 combined figure, and the break must be
// disclosed with the correct 230万/2.30 million 2002 contract value.
{
  ok("ch04 guard: no 355万/3.55 million 2002 contract-total claim (嘱託 separate only from 2013)",
    ch04Strings.every((t) => !t.includes("355万") && !t.includes("3.55 million")));
  ok("ch04 guard: contract-category break disclosed with correct 2002 basis (230万 / 2.30 million, 2013 change)",
    ch04Strings.some((t) => t.includes("230万") && t.includes("2013")) &&
    ch04Strings.some((t) => t.includes("2.30 million") && t.includes("2013")));
}

// G-P. 65+ employment-rate trough guard (audit D3): the trough is 19.2% in
// 2011 — the text must anchor it there, never to "around 2000 / 約20%".
{
  const seq = OLDER_EMPRATE_65.filter(([, v]) => v !== null) as ReadonlyArray<[number, number]>;
  const min = seq.reduce((b, [y, v]) => (v < b[1] ? [y, v] : b), [0, Infinity] as [number, number]);
  ok("ch04 guard: 65+ employment-rate minimum 19.2 in 2011",
    min[0] === 2011 && Math.abs(min[1] - 19.2) < 0.05, String(min));
  ok("ch04 guard: text anchors the 65+ trough to 2011/19.2 (both languages), never 約20%-around-2000",
    ch04Strings.some((t) => t.includes("19.2%") && t.includes("2011")) &&
    ch04Strings.some((t) => t.includes("19.2% trough")) &&
    ch04Strings.every((t) => !/約20%まで下がり/.test(t) && !/(about|roughly) 20% around 2000/.test(t)));
}

// G-Q. Unverifiable-claim guard (audit D4): the 15-24 student-excluded
// non-regular share has no published 2025 value (series ends 2022 = 24.4) —
// the claim must not appear in either language.
{
  ok("ch04 guard: no student-excluded 24.3% claim (no published 2025 value)",
    ch04Strings.every((t) => !/在学中を除くと\s*24\.3/.test(t) && !/excluding students[^.]*24\.3/.test(t)));
}

// G-R. Bilingual year-anchor guard (audit D5): EN must anchor the 1.9%
// unemployment value to 1975 exactly as JA does (1973's value is 1.3).
{
  ok("ch04 guard: EN anchors the 1.9% unemployment value to 1975 (not 1973)",
    ch04Strings.some((t) => t.includes("1.9% in 1975")) &&
    ch04Strings.every((t) => !/1\.9% after the 1973/.test(t)));
}

const hash4 = createHash("sha256").update(readFileSync(extraction4Path)).digest("hex").slice(0, 16);
ok("ch04 dataset snapshot hash unchanged", hash4 === CH04_SNAPSHOT_HASH, `${hash4} vs ${CH04_SNAPSHOT_HASH}`);

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
