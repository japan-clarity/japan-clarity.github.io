/**
 * Japan Clarity — Chapter 01 data code generation.
 *
 * Reads research/chapter01/notes/extracted-series.json (produced by
 * scripts/extract-series.py with anchor validation against the archived raw
 * official documents) and generates src/chapters/chapter-01/data.ts.
 *
 * This keeps the published site data mechanically derived from the verified
 * extraction — no manual transcription. `scripts/validate-research.ts`
 * re-checks the generated file against the JSON on every run.
 *
 * Usage: bun run scripts/generate-chapter-data.ts
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const sourcePath = resolve(ROOT, "research/chapter01/notes/extracted-series.json");
const targetPath = resolve(ROOT, "src/chapters/chapter-01/data.ts");

const series = JSON.parse(readFileSync(sourcePath, "utf-8")) as Record<string, any>;
const hash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex").slice(0, 16);

const fmt = (v: unknown) =>
  v === null || v === undefined ? "null" : JSON.stringify(v);

function yearValuePairs(obj: Record<string, any>, field: string): string {
  const entries = Object.entries(obj)
    .map(([year, row]) => [Number(year), row[field]] as const)
    .sort((a, b) => a[0] - b[0]);
  return `[\n${entries.map(([y, v]) => `  [${y}, ${fmt(v)}],`).join("\n")}\n]`;
}

function extract(obj: Record<string, any>, field: string): { years: number[]; values: Array<number | null> } {
  const entries = Object.entries(obj)
    .map(([year, row]) => [Number(year), row[field]] as const)
    .sort((a, b) => a[0] - b[0]);
  return {
    years: entries.map(([y]) => y),
    values: entries.map(([, v]) => (v === null || v === undefined ? null : (v as number))),
  };
}

function toTs(name: string, doc: string, data: { years: number[]; values: Array<number | null> }): string {
  return `export const ${name}: ReadonlyArray<[number, number | null]> = [\n${data.years
    .map((y, i) => `  [${y}, ${fmt(data.values[i])}],`)
    .join("\n")}\n];`;
}

const vitalCounts = series.vital.counts;
const vitalRates = series.vital.rates;
const le = series.lifeExpectancy;
const census = series.census;
const aging = series.aging;
const households = series.households;
const ipss = series.ipssMedium;
const wb = series.worldbank;

// ---- Series selections ----------------------------------------------------

const births = extract(vitalCounts, "births");
const deaths = extract(vitalCounts, "deaths");
const natural = extract(vitalCounts, "natural");
const marriages = extract(vitalCounts, "marriages");
const tfrAll = extract(vitalRates, "tfr");
const tfrPostwar = {
  years: tfrAll.years.filter((y) => y >= 1947),
  values: tfrAll.values.filter((_, i) => tfrAll.years[i] >= 1947),
};
const leSeries = { years: Object.keys(le).map(Number).sort((a, b) => a - b) };
const leM = extract(le, "male");
const leF = extract(le, "female");
const censusTotal = extract(census, "total");
const agingObserved = Object.fromEntries(
  Object.entries(aging).filter(([y]) => Number(y) <= 2026),
);
const agingProjected = Object.fromEntries(
  Object.entries(aging).filter(([y]) => Number(y) >= 2030),
);
const agingObs65 = extract(agingObserved, "share65");
const agingObs75 = extract(agingObserved, "share75");
const agingProj65 = extract(agingProjected, "share65");
const agingProj75 = extract(agingProjected, "share75");
const householdSize = extract(households.avgSize, undefined as unknown as string)
const householdSizeSeries = {
  years: Object.keys(households.avgSize).map(Number).sort((a, b) => a - b),
  values: Object.keys(households.avgSize)
    .map(Number)
    .sort((a, b) => a - b)
    .map((y) => households.avgSize[String(y)]),
};
const onePerson = {
  years: Object.keys(households.onePersonShare).map(Number).sort((a, b) => a - b),
  values: Object.keys(households.onePersonShare)
    .map(Number)
    .sort((a, b) => a - b)
    .map((y) => households.onePersonShare[String(y)]),
};
const ipss5y = Object.entries(ipss)
  .map(([y, row]) => [Number(y), row.totalThousand as number] as const)
  .filter(([y]) => y % 5 === 0)
  .sort((a, b) => a[0] - b[0]);
const ipssShare5y = Object.entries(ipss)
  .map(([y, row]) => [Number(y), row.share65 as number] as const)
  .filter(([y]) => y % 5 === 0)
  .sort((a, b) => a[0] - b[0]);

const wbAge = wb.japan["SP.POP.65UP.TO.ZS"];
const wbAge14 = wb.japan["SP.POP.0014.TO.ZS"];
const wbAge1564 = wb.japan["SP.POP.1564.TO.ZS"];
const wbYears = wbAge.years as number[];
const wbShare65 = wbAge.values as Array<number | null>;
const wbShare14 = wbAge14.values as Array<number | null>;
const wbShare1564 = wbAge1564.values as Array<number | null>;

const COUNTRY_NAMES: Record<string, { ja: string; en: string }> = {
  JPN: { ja: "日本", en: "Japan" },
  KOR: { ja: "韓国", en: "South Korea" },
  SGP: { ja: "シンガポール", en: "Singapore" },
  AUS: { ja: "オーストラリア", en: "Australia" },
  NZL: { ja: "ニュージーランド", en: "New Zealand" },
  DEU: { ja: "ドイツ", en: "Germany" },
  FRA: { ja: "フランス", en: "France" },
  SWE: { ja: "スウェーデン", en: "Sweden" },
  NLD: { ja: "オランダ", en: "Netherlands" },
  CAN: { ja: "カナダ", en: "Canada" },
  GBR: { ja: "イギリス", en: "United Kingdom" },
  USA: { ja: "アメリカ", en: "United States" },
  ITA: { ja: "イタリア", en: "Italy" },
};

function wbCompare(indicator: string): string {
  const block = wb.compare[indicator];
  const year = block.year as number;
  const values = block.values as Record<string, number>;
  const lines = Object.keys(COUNTRY_NAMES)
    .filter((c) => values[c] !== undefined && values[c] !== null)
    .map((c) => `  ["${c}", ${values[c]}],`)
    .join("\n");
  return `export const WB_COMPARE_YEAR_${indicator.replace(/[.\s]/g, "_")}_NUM = ${year};\nexport const WB_COMPARE_${indicator.replace(/[.\s]/g, "_")}: ReadonlyArray<[string, number]> = [\n${lines}\n];`;
}

// ---- Emit -----------------------------------------------------------------

const header = `/**
 * Japan Clarity — Chapter 01 verified data series.
 *
 * GENERATED FILE — do not edit by hand.
 * Generated by scripts/generate-chapter-data.ts from
 * research/chapter01/notes/extracted-series.json
 * (extraction validated against archived raw official documents;
 *  see research/chapter01/notes/*.md for verbatim source quotes).
 *
 * Source snapshot sha256 (first 16 hex): ${hash}
 * Access/verification date: 2026-10-22.
 *
 * Pair arrays are [year, value]; null = value not published for that year.
 */

`;

const pairs = (name: string, doc: string, arr: ReadonlyArray<[number, number | null]>) =>
  `/** ${doc} */\nexport const ${name}: ReadonlyArray<[number, number | null]> = [\n${arr
    .map(([y, v]) => `  [${y}, ${fmt(v)}],`)
    .join("\n")}\n];\n`;

const body = [
  pairs(
    "CENSUS_TOTAL",
    "Total population, Population Census 1920–2025 (Statistics Bureau; 2020 = 126,146,099; 2025 = 122,972,528; 1940/1945 are wartime corrected figures).",
    Object.entries(census)
      .map(([y, row]) => [Number(y), row.total] as [number, number | null])
      .sort((a, b) => a[0] - b[0]),
  ),
  pairs(
    "VITAL_BIRTHS",
    "Live births, 1899–2025 (MHLW Vital Statistics final counts; 1944–1946 omitted by the source — war records lost; 1947–1972 exclude Okinawa).",
    births.years.map((y, i) => [y, births.values[i]] as [number, number | null]),
  ),
  pairs(
    "VITAL_DEATHS",
    "Deaths, 1899–2025 (MHLW Vital Statistics final counts; same caveats as VITAL_BIRTHS).",
    deaths.years.map((y, i) => [y, deaths.values[i]] as [number, number | null]),
  ),
  pairs(
    "VITAL_NATURAL",
    "Natural increase (births − deaths), 1899–2025 (MHLW Vital Statistics; negative = natural decrease).",
    natural.years.map((y, i) => [y, natural.values[i]] as [number, number | null]),
  ),
  pairs(
    "MARRIAGES",
    "Marriages, 1899–2025 (MHLW Vital Statistics final counts).",
    marriages.years.map((y, i) => [y, marriages.values[i]] as [number, number | null]),
  ),
  pairs(
    "TFR",
    "Total fertility rate, 1947–2025 (MHLW Vital Statistics; 2025 = 1.14, record low; to be recalculated with the 2025 Census population, revision due Nov 2026).",
    tfrPostwar.years.map((y, i) => [y, tfrPostwar.values[i]] as [number, number | null]),
  ),
  pairs(
    "LIFE_EXPECTANCY_MALE",
    "Life expectancy at birth, male, 1947–2025 (MHLW abridged life tables; 2025 = 81.35; Okinawa excluded before 1972).",
    leM.years.map((y, i) => [y, leM.values[i]] as [number, number | null]),
  ),
  pairs(
    "LIFE_EXPECTANCY_FEMALE",
    "Life expectancy at birth, female, 1947–2025 (MHLW abridged life tables; 2025 = 87.33).",
    leF.years.map((y, i) => [y, leF.values[i]] as [number, number | null]),
  ),
  pairs(
    "AGING_SHARE_65_OBSERVED",
    "Population share aged 65+, observed, 1950–2026 (Statistics Bureau elderly-release series; 2026 = 29.6%, based on estimates as of 2026-09-15).",
    agingObs65.years.map((y, i) => [y, agingObs65.values[i]] as [number, number | null]),
  ),
  pairs(
    "AGING_SHARE_75_OBSERVED",
    "Population share aged 75+, observed, 1950–2026 (2026 = 17.7%).",
    agingObs75.years.map((y, i) => [y, agingObs75.values[i]] as [number, number | null]),
  ),
  pairs(
    "AGING_SHARE_65_PROJECTED",
    "Population share aged 65+, projected 2030–2050 (IPSS 2023 medium variant, republished in the Statistics Bureau 2026 elderly release; scenarios, not observations).",
    agingProj65.years.map((y, i) => [y, agingProj65.values[i]] as [number, number | null]),
  ),
  pairs(
    "AGING_SHARE_75_PROJECTED",
    "Population share aged 75+, projected 2030–2050 (IPSS 2023 medium variant).",
    agingProj75.years.map((y, i) => [y, agingProj75.values[i]] as [number, number | null]),
  ),
  pairs(
    "HOUSEHOLD_SIZE",
    "Average persons per (ordinary) household, census years 1960–2025 (no 1965 value: household definition change; 2025 = 2.10).",
    householdSizeSeries.years.map((y, i) => [y, householdSizeSeries.values[i]] as [number, number | null]),
  ),
  pairs(
    "ONE_PERSON_SHARE",
    "Share of one-person households among ordinary households, census years 2005–2025 (2025 = 41.4%).",
    onePerson.years.map((y, i) => [y, onePerson.values[i]] as [number, number | null]),
  ),
  pairs(
    "IPSS_MEDIUM_TOTAL",
    "IPSS 2023 medium-variant total population, 5-year steps 2020–2070, thousands (baseline 2020 = 126,146.099k; 2070 = 86,996.009k). Projection — not an observation.",
    ipss5y as ReadonlyArray<[number, number | null]>,
  ),
  pairs(
    "IPSS_MEDIUM_SHARE_65",
    "IPSS 2023 medium-variant 65+ share, 5-year steps 2020–2070 (peaks around 2043). Projection.",
    ipssShare5y as ReadonlyArray<[number, number | null]>,
  ),
  pairs(
    "WB_JAPAN_SHARE_65",
    "Japan population share aged 65+ per World Bank WDI (UN WPP-based estimates), 1960–2025; 2025 = 29.994…%. Secondary-source series — differs slightly from Statistics Bureau figures due to estimation methodology.",
    wbYears.map((y, i) => [y, wbShare65[i]] as [number, number | null]),
  ),
  pairs(
    "WB_JAPAN_SHARE_0_14",
    "Japan population share aged 0–14 per World Bank WDI, 1960–2025.",
    wbYears.map((y, i) => [y, wbShare14[i]] as [number, number | null]),
  ),
  pairs(
    "WB_JAPAN_SHARE_15_64",
    "Japan population share aged 15–64 per World Bank WDI, 1960–2025.",
    wbYears.map((y, i) => [y, wbShare1564[i]] as [number, number | null]),
  ),
  wbCompare("SP.DYN.TFRT.IN"),
  wbCompare("SP.POP.65UP.TO.ZS"),
  wbCompare("SP.DYN.LE00.IN"),
  `/** Country display names for World Bank comparison charts (ISO3 → bilingual). */\nexport const WB_COUNTRIES: Readonly<Record<string, { ja: string; en: string }>> = ${JSON.stringify(
    COUNTRY_NAMES,
    null,
    2,
  ) as string};`,
  `/** sha256 (first 16 hex) of the extracted-series.json snapshot this file was generated from. */\nexport const DATA_SNAPSHOT_HASH = "${hash}";`,
].join("\n\n");

writeFileSync(targetPath, header + body + "\n", "utf-8");
console.log(`Wrote ${targetPath}`);
console.log(`Snapshot hash: ${hash}`);
console.log(
  `Series: census ${censusTotal.years.length} | births ${births.years.length} | tfr ${tfrPostwar.years.length} | LE ${leM.years.length} | aging obs ${agingObs65.years.length} proj ${agingProj65.years.length} | households ${householdSizeSeries.years.length} | IPSS ${ipss5y.length} | WB years ${wbYears.length}`,
);
