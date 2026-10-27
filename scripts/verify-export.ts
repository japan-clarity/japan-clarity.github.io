/**
 * Japan Clarity — static export verification (Mode B acceptance check).
 *
 * Verifies that `.build-export/` exists and contains the expected pages and assets,
 * including locale routes, chapter pages (published + placeholders), the
 * post-export root redirect, sitemap/robots, and client JS chunks (needed
 * for interactive charts). Exits non-zero on any missing artifact.
 *
 * Usage: bun run scripts/verify-export.ts
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(import.meta.dir, "..", ".build-export");

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

console.log("Verifying static export at .build-export/ …");

ok(".build-export/ directory exists", existsSync(OUT));
ok(".build-export/index.html exists (root redirect)", existsSync(resolve(OUT, "index.html")));
ok(
  "root redirect points to /ja/",
  existsSync(resolve(OUT, "index.html")) &&
    readFileSync(resolve(OUT, "index.html"), "utf-8").includes('url=/ja/'),
);
ok(".build-export/404.html exists", existsSync(resolve(OUT, "404.html")));

for (const locale of ["ja", "en"]) {
  ok(`.build-export/${locale}/index.html exists`, existsSync(resolve(OUT, locale, "index.html")));
  const html = readFileSync(resolve(OUT, locale, "index.html"), "utf-8");
  ok(
    `.build-export/${locale}/ has correct html lang`,
    html.includes(`<html lang="${locale === "ja" ? "ja-JP" : "en"}"`),
  );
  ok(`.build-export/${locale}/overview/index.html exists`, existsSync(resolve(OUT, locale, "overview", "index.html")));
  ok(`.build-export/${locale}/methodology/index.html exists`, existsSync(resolve(OUT, locale, "methodology", "index.html")));
  ok(`.build-export/${locale}/sources/index.html exists`, existsSync(resolve(OUT, locale, "sources", "index.html")));
}

// Chapter pages: published 01 + placeholders 02–14, both locales.
const chapterSlugs = [
  "population-family",
  "economy-industry",
  "housing-cost-of-living",
  "labor-working-conditions",
  "education-talent",
  "healthcare-wellbeing",
  "social-protection-inequality",
  "environment-energy",
  "transportation-urban-development",
  "food-systems-agriculture",
  "technology-digital-society",
  "public-governance-institutions",
  "social-relationships-culture",
  "safety-societal-resilience",
];
for (const locale of ["ja", "en"]) {
  for (const slug of chapterSlugs) {
    ok(
      `.build-export/${locale}/chapters/${slug}/ exists`,
      existsSync(resolve(OUT, locale, "chapters", slug, "index.html")),
    );
  }
}

// The published chapter must carry its verified content and chart panels.
const ch01ja = readFileSync(resolve(OUT, "ja", "chapters", "population-family", "index.html"), "utf-8");
ok("chapter 01 (ja) contains chart panels", ch01ja.includes("figure-ch01-births-deaths"));
ok("chapter 01 (ja) contains verified figure (2025 births)", ch01ja.includes("671,270") || ch01ja.includes("67万1270"));
ok("chapter 01 (ja) contains source attribution", ch01ja.includes("厚生労働省") && ch01ja.includes("統計局"));
ok("chapter 01 (ja) contains limitations section", ch01ja.includes("限界と留意点"));
const ch01en = readFileSync(resolve(OUT, "en", "chapters", "population-family", "index.html"), "utf-8");
ok("chapter 01 (en) contains chart panels", ch01en.includes("figure-ch01-births-deaths"));
ok("chapter 01 (en) contains limitations section", ch01en.includes("Limitations and caveats"));

// Chapter 02 is now published (economy & industry) — assert real content.
const ch02ja = readFileSync(resolve(OUT, "ja", "chapters", "economy-industry", "index.html"), "utf-8");
ok("chapter 02 (ja) contains chart panels", ch02ja.includes("figure-ch02-gdp-levels") && ch02ja.includes("figure-ch02-wages"));
ok("chapter 02 (ja) contains verified figure (2024 nominal GDP)", ch02ja.includes("634.2"));
ok("chapter 02 (ja) contains source attribution", ch02ja.includes("内閣府") && ch02ja.includes("厚生労働省") && ch02ja.includes("OECD"));
ok("chapter 02 (ja) contains limitations section", ch02ja.includes("限界と留意点"));
ok("chapter 02 (ja) no longer shows the unpublished placeholder", !ch02ja.includes("この章はまだ公開されていません"));
const ch02en = readFileSync(resolve(OUT, "en", "chapters", "economy-industry", "index.html"), "utf-8");
ok("chapter 02 (en) contains chart panels", ch02en.includes("figure-ch02-gdp-levels") && ch02en.includes("figure-ch02-wages"));
ok("chapter 02 (en) contains limitations section", ch02en.includes("Limitations and caveats"));
ok("chapter 02 (en) contains the long title", ch02en.includes("Understanding Japan's Economy and Industrial Structure"));

// Chapter 03 is now published (housing & cost of living) — assert real content.
const ch03ja = readFileSync(resolve(OUT, "ja", "chapters", "housing-cost-of-living", "index.html"), "utf-8");
ok("chapter 03 (ja) contains chart panels", ch03ja.includes("figure-ch03-stock") && ch03ja.includes("figure-ch03-vacancy-rate"));
ok("chapter 03 (ja) contains verified figure (2023 vacancy rate 13.8%)", ch03ja.includes("13.8"));
ok("chapter 03 (ja) contains verified figure (2025 FIES expenditure 314,001円)", ch03ja.includes("314,001"));
ok("chapter 03 (ja) contains source attribution", ch03ja.includes("総務省") && ch03ja.includes("国土交通省") && ch03ja.includes("OECD"));
ok("chapter 03 (ja) contains limitations section", ch03ja.includes("限界と留意点"));
ok("chapter 03 (ja) no longer shows the unpublished placeholder", !ch03ja.includes("この章はまだ公開されていません"));
const ch03en = readFileSync(resolve(OUT, "en", "chapters", "housing-cost-of-living", "index.html"), "utf-8");
ok("chapter 03 (en) contains chart panels", ch03en.includes("figure-ch03-stock") && ch03en.includes("figure-ch03-rent-burden"));
ok("chapter 03 (en) contains limitations section", ch03en.includes("Limitations and caveats"));
ok("chapter 03 (en) contains the OECD index-base disclosure", ch03en.includes("2015=100"));

// Chapter 04 is now PUBLISHED — verify the real chapter rendered (charts + tables).
const ch04ja = readFileSync(resolve(OUT, "ja", "chapters", "labor-working-conditions", "index.html"), "utf-8");
ok("chapter 04 (ja) published (no placeholder marker)", !ch04ja.includes("この章はまだ公開されていません"));
ok("chapter 04 (ja) contains employment-status chart", ch04ja.includes("従業上の地位別就業者数"));
ok("chapter 04 (ja) contains mental-comp chart", ch04ja.includes("精神障害の労災"));
ok("chapter 04 (ja) contains limitations section", ch04ja.includes("限界") || ch04ja.includes("本章が検証していない主題"));
const ch04en = readFileSync(resolve(OUT, "en", "chapters", "labor-working-conditions", "index.html"), "utf-8");
ok("chapter 04 (en) published (no placeholder marker)", !ch04en.includes("has not been published yet"));
ok("chapter 04 (en) contains OECD hours chart", ch04en.includes("Average annual hours actually worked"));
ok("chapter 04 (en) contains the trend-not-level caveat", ch04en.includes("unsuitable for level comparisons") || ch04en.includes("not directly comparable"));

// Metadata routes.
ok(".build-export/sitemap.xml exists", existsSync(resolve(OUT, "sitemap.xml")));
const sitemap = readFileSync(resolve(OUT, "sitemap.xml"), "utf-8");
ok(
  "sitemap covers both locales + chapters",
  sitemap.includes("/ja/chapters/population-family/") && sitemap.includes("/en/chapters/population-family/"),
);
ok(".build-export/robots.txt exists", existsSync(resolve(OUT, "robots.txt")));

// Client assets for interactivity.
const nextDir = resolve(OUT, "_next");
ok(".build-export/_next exists", existsSync(nextDir));
if (existsSync(nextDir)) {
  const staticDir = resolve(nextDir, "static");
  ok(".build-export/_next/static exists", existsSync(staticDir));
  // ECharts chunk is lazy-loaded — verify at least one JS chunk exists.
  const chunks = existsSync(staticDir) ? readdirSync(resolve(staticDir, "chunks")) : [];
  ok("client JS chunks present", chunks.length > 0, `${chunks.length} chunk files`);
}

// Favicon + fonts policy (no external font downloads).
ok("favicon.svg exists", existsSync(resolve(OUT, "favicon.svg")));
const ch01html = ch01ja + ch01en;
ok(
  "no external font imports (fonts.googleapis etc.)",
  !ch01html.includes("fonts.googleapis") && !ch01html.includes("fonts.gstatic"),
);

console.log("\n" + "=".repeat(60));
console.log(`${checks} checks, ${failures} failures`);
if (failures > 0) {
  console.error("STATIC EXPORT VERIFICATION FAILED");
  process.exit(1);
}
const totalSize = (() => {
  let bytes = 0;
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else bytes += statSync(full).size;
    }
  };
  walk(OUT);
  return bytes;
})();
console.log(`Static export verified (${(totalSize / 1024 / 1024).toFixed(1)} MB total).`);
