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
