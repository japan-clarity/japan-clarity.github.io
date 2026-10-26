/**
 * Japan Clarity — Chapter 03 data code generation.
 *
 * Reads research/chapter03/notes/extracted-series.json (produced by
 * research/chapter03/scripts/extract-series.py — anchored extraction with
 * 1,640 validation checks against the archived raw official documents) and
 * generates src/chapters/chapter-03/data.ts.
 *
 * Unit conventions (documented so validate-research.ts can mirror them):
 *  - Housing stock / vacancy / tenure counts: source 戸 → emitted 万戸 (÷10,000, 1 dp)
 *  - Tenure shares, vacancy rates, CPI YoY: % as published
 *  - Floor area: ㎡ as published (2 dp)
 *  - FIES amounts: 円/month as published (int); derived burden shares: % (1 dp, DERIVED)
 *  - CPI indices: as published (2025=100 long-run; 2020=100 for the 2025
 *    annual-average headline only — different base, kept separate)
 *  - OECD price-to-income & real house price indices: 2015=100, emitted 1 dp
 *  - MLIT housing starts: 户 int as published; land prices: 円/㎡ int
 *
 * Usage: bun run scripts/generate-chapter-03-data.ts
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const sourcePath = resolve(ROOT, "research/chapter03/notes/extracted-series.json");
const targetPath = resolve(ROOT, "src/chapters/chapter-03/data.ts");

const series = JSON.parse(readFileSync(sourcePath, "utf-8")) as Record<string, any>;
const hash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex").slice(0, 16);

const fmt = (v: unknown) =>
  v === null || v === undefined ? "null" : JSON.stringify(v);

function pairs(map: Record<string, number | null>, transform?: (v: number) => number): string {
  const entries = Object.entries(map)
    .map(([year, v]) => [Number(year), v === null ? null : transform ? transform(v) : v] as const)
    .sort((a, b) => a[0] - b[0]);
  return `[\n${entries.map(([y, v]) => `  [${y}, ${fmt(v)}],`).join("\n")}\n]`;
}

const man = (v: number) => Math.round(v / 1000) / 10; // 戸 → 万戸 (1 dp)
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

// ---------------------------------------------------------------------------
// Housing and Land Survey (住宅・土地統計調査)
// ---------------------------------------------------------------------------
const housing = series.housing;
const stock = housing.stock as Record<string, Record<string, number>>;
const vacRate = housing.vacancyRate as Record<string, number>;
const tenureShare = housing.tenureShare as Record<string, Record<string, number | null>>;
const tenureCount = housing.tenureCount as Record<string, Record<string, number | null>>;
const vacTypes = housing.vacancyTypes as Record<string, Record<string, number>>;
const floorArea = housing.floorArea as Record<string, Record<string, number>>;
const pref = housing.prefecture2023 as Record<string, Record<string, number>>;

// Chart series 1963–2023 (1948/1953/1958 carry coverage breaks — 市部のみ for
// 1953, 沖縄除外 pre-1968, 建築中除外 1948 — and are documented in the chapter
// text rather than charted, to avoid a misleading apparent dip).
const stockYears = Object.keys(stock).map(Number).filter((y) => y >= 1963);
const stockSlice: Record<number, Record<string, number>> = {};
for (const y of stockYears) stockSlice[y] = stock[String(y)];

const STOCK_TOTAL = pairs(
  Object.fromEntries(stockYears.map((y) => [y, stock[y].total])),
  man,
);
const STOCK_OCCUPIED = pairs(
  Object.fromEntries(stockYears.map((y) => [y, stock[y].occupied])),
  man,
);
const STOCK_VACANT = pairs(
  Object.fromEntries(stockYears.map((y) => [y, stock[y].vacant])),
  man,
);

const tenureYears = Object.keys(tenureShare).map(Number);
const TENURE_OWNED = pairs(Object.fromEntries(tenureYears.map((y) => [y, tenureShare[y].owned])));
const TENURE_PUBLIC = pairs(Object.fromEntries(tenureYears.map((y) => [y, tenureShare[y].public])));
const TENURE_UR = pairs(Object.fromEntries(tenureYears.map((y) => [y, tenureShare[y].ur])));
const TENURE_PRIVATE = pairs(Object.fromEntries(tenureYears.map((y) => [y, tenureShare[y].private])));
const TENURE_COMPANY = pairs(Object.fromEntries(tenureYears.map((y) => [y, tenureShare[y].company])));

// Chart span 1963–2023 (pre-1963 rates carry the 1953 市部のみ break and a
// null 1948 — documented in text; the 2013 概要's own chart also starts 1958).
const VACANCY_RATE = pairs(
  Object.fromEntries(Object.entries(vacRate).filter(([y]) => Number(y) >= 1963)),
);

// Vacancy types: chart 2013/2018/2023 (category chart), values 万戸.
const typeYears = [2013, 2018, 2023];
const typeRows = (key: string) =>
  typeYears.map((y) => `  [${y}, ${fmt(man(vacTypes[String(y)][key]))}],`).join("\n");

const areaYears = Object.keys(floorArea).map(Number);
const AREA_TOTAL = pairs(Object.fromEntries(areaYears.map((y) => [y, floorArea[y].total])));
const AREA_OWNED = pairs(Object.fromEntries(areaYears.map((y) => [y, floorArea[y].owned])));
const AREA_RENTED = pairs(Object.fromEntries(areaYears.map((y) => [y, floorArea[y].rented])));

// Prefecture vacancy chart: top-6 + national + bottom-4, sorted descending.
// Selection rule disclosed in the chart note (no cherry-picking concealment).
const prefEntries = Object.entries(pref).filter(([name]) => name !== "全国");
const prefSorted = prefEntries
  .map(([name, row]) => ({ name, rate: row.vacancyRate as number }))
  .sort((a, b) => b.rate - a.rate);
const prefTop = prefSorted.slice(0, 6);
const prefBottom = prefSorted.slice(-4);
const prefNational = { name: "全国", rate: pref["全国"].vacancyRate };
const prefChart = [...prefTop, prefNational, ...prefBottom];
const PREF_LABELS: Record<string, { ja: string; en: string }> = {};
for (const p of prefChart) {
  const enNames: Record<string, string> = {
    "徳島県": "Tokushima", "和歌山県": "Wakayama", "鹿児島県": "Kagoshima",
    "山梨県": "Yamanashi", "高知県": "Kochi", "長野県": "Nagano",
    "東京都": "Tokyo", "神奈川県": "Kanagawa", "沖縄県": "Okinawa", "埼玉県": "Saitama",
    "全国": "Japan (national)",
  };
  PREF_LABELS[p.name] = { ja: p.name, en: enNames[p.name] ?? p.name };
}

// ---------------------------------------------------------------------------
// FIES 2025 (家計調査 家計収支編)
// ---------------------------------------------------------------------------
const fies = series.fies;
const exp2 = fies.expenditureTwoPlus as Record<string, number>;
const FIES_EXPENDITURE = pairs(exp2);
const structure = fies.structure2025 as Record<string, { amount: number; share: number }>;
const tenure = fies.tenure2025twoPlus as Record<string, { avg: number; owned: number; privateRent: number }>;
const solo = fies.solo2025 as { expenditure: number; housing: number; housingShare: number };
const soloTenure = fies.soloTenure2025 as Record<string, number>;
const kinrou = fies.tenure2025kinrou as Record<string, number>;
const regional = fies.regional2025 as Record<string, { expenditure: number; housingShare: number }>;

// Derived rent-burden shares (住居費 ÷ 消費支出 — NOT published as such; the
// FIES publishes amounts only; these shares are computed here and disclosed
// as derived in the chart note + chapter limitations).
const derivedShare = (housing: number, expenditure: number) => r1((housing / expenditure) * 100);
const BURDEN_TWO_OWNED = derivedShare(tenure["住居"].owned, tenure["消費支出"].owned);
const BURDEN_TWO_RENT = derivedShare(tenure["住居"].privateRent, tenure["消費支出"].privateRent);
const BURDEN_SOLO_OWNED = derivedShare(soloTenure.housingOwned, soloTenure.expenditureOwned);
const BURDEN_SOLO_RENT = derivedShare(soloTenure.housingPrivateRent, soloTenure.expenditurePrivateRent);

// Structure chart (published 用途分類 shares, 2025, 二人以上の世帯).
const STRUCT_ORDER = ["食料", "その他の消費支出", "交通・通信", "教養娯楽", "光熱・水道",
  "住居", "保健医療", "家具・家事用品", "教育", "被服及び履物"];
const STRUCT_EN: Record<string, string> = {
  "食料": "Food", "住居": "Housing", "光熱・水道": "Fuel, light & water",
  "家具・家事用品": "Furniture & utensils", "被服及び履物": "Clothing & footwear",
  "保健医療": "Medical care", "交通・通信": "Transport & communication",
  "教育": "Education", "教養娯楽": "Culture & recreation", "その他の消費支出": "Other consumption",
};

// ---------------------------------------------------------------------------
// CPI
// ---------------------------------------------------------------------------
const cpi = series.cpi;
const CPI_LONG = pairs(cpi.longRunAll as Record<string, number>);
const groups = cpi.groups as Record<string, Record<string, number>>;
const groupYears = Object.keys(groups).map(Number);
const CPI_G_ALL = pairs(Object.fromEntries(groupYears.map((y) => [y, groups[String(y)]["総合"]])));
const CPI_G_FOOD = pairs(Object.fromEntries(groupYears.map((y) => [y, groups[String(y)]["食料"]])));
const CPI_G_HOUSING = pairs(Object.fromEntries(groupYears.map((y) => [y, groups[String(y)]["住居"]])));
const CPI_G_RENT = pairs(Object.fromEntries(groupYears.map((y) => [y, groups[String(y)]["家賃"]])));
const CPI_G_ENERGY = pairs(Object.fromEntries(groupYears.map((y) => [y, groups[String(y)]["エネルギー"]])));
const yoyGroups = cpi.yoyGroups as Record<string, Record<string, number>>;
const CPI_YOY_TABLE = Object.entries(yoyGroups)
  .sort((a, b) => Number(a[0]) - Number(b[0]))
  .map(([y, row]) => `  [${y}, ${row["総合"]}, ${row["食料"]}, ${row["住居"]}, ${row["家賃"]}, ${row["エネルギー"]}],`)
  .join("\n");

// ---------------------------------------------------------------------------
// OECD (2015=100 indices — NOT price levels, NOT 2020-based)
// ---------------------------------------------------------------------------
const oecd = series.oecd;
const PTI_JPN = pairs(oecd.ptiJpn as Record<string, number>, r1);
const RHP_JPN = pairs(oecd.rhpJpn as Record<string, number>, r1);
const ptiLatest = oecd.ptiLatest as Record<string, number>;
const OECD_YEAR = ptiLatest.year;
const oecdCompare = Object.entries(ptiLatest)
  .filter(([k]) => k !== "year")
  .map(([area, v]) => [area, r1(v)] as const)
  .sort((a, b) => a[1] - b[1]);
const OECD_NAME_JA: Record<string, string> = {
  JPN: "日本", KOR: "韓国", NZL: "ニュージーランド", CAN: "カナダ", ITA: "イタリア",
  GBR: "イギリス", AUS: "オーストラリア", FRA: "フランス", SWE: "スウェーデン",
  DEU: "ドイツ", USA: "アメリカ", NLD: "オランダ", ESP: "スペイン",
};
const OECD_NAME_EN: Record<string, string> = {
  JPN: "Japan", KOR: "South Korea", NZL: "New Zealand", CAN: "Canada", ITA: "Italy",
  GBR: "United Kingdom", AUS: "Australia", FRA: "France", SWE: "Sweden",
  DEU: "Germany", USA: "United States", NLD: "Netherlands", ESP: "Spain",
};

// ---------------------------------------------------------------------------
// MLIT
// ---------------------------------------------------------------------------
const mlit = series.mlit;
const starts = mlit.starts as Record<string, number>;
const STARTS_YEARS = Object.keys(starts).map(Number);
const STARTS_SELECTED = [1960, 1973, 1980, 1990, 2000, 2010, 2020, 2023, 2024, 2025]
  .map((y) => `  [${y}, ${starts[String(y)]}],`).join("\n");
const landPrice = mlit.landPriceResidential as Record<string, Record<string, number>>;

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------
const out = `/**
 * Japan Clarity — Chapter 03 verified data series (Housing & Cost of Living).
 *
 * GENERATED FILE — do not edit by hand.
 * Generated by scripts/generate-chapter-03-data.ts from
 * research/chapter03/notes/extracted-series.json
 * (anchored extraction validated against archived raw official documents;
 *  see research/chapter03/notes/*.md for verbatim source quotes).
 *
 * Source snapshot sha256 (first 16 hex): ${hash}
 * Access/verification date: 2026-10-26.
 *
 * Pair arrays are [year, value]; null = value not published for that year.
 * Units: housing counts 万戸 (source 戸 ÷ 10,000); shares/rates %; floor area ㎡;
 * FIES amounts 円/month; CPI indices 2025=100 (long-run) or 2020=100 (the
 * separately-published 2025 annual headline); OECD indices are 2015=100
 * (price-to-income ratio and real house price — never price levels).
 */

// ===== Housing and Land Survey (住宅・土地統計調査) — 2023 round 確報 =====
// e-Stat 時系列統計表 第1-1表 (居住世帯の有無別住宅数), 第9-1表 (住宅の所有の
// 関係別), 第4表 (空き家の種類別), 第14-1表 (1住宅当たり延べ面積). Chart span
// 1963–2023: 1963/1968 exclude Okinawa (pre-reversion); 1973 = 沖縄を含む row.
// 1948/1953/1958 are documented in text only (1953 = 市部のみ).

/** Total dwelling stock (万戸) — 1963: 2,109.0; 2023: 6,504.7. */
export const STOCK_TOTAL: ReadonlyArray<[number, number | null]> =
${STOCK_TOTAL};

/** Occupied dwellings (居住世帯のある住宅, 万戸) — 2023: 5,566.5. */
export const STOCK_OCCUPIED: ReadonlyArray<[number, number | null]> =
${STOCK_OCCUPIED};

/** Vacant dwellings (空き家, 万戸) — 2023: 900.2. */
export const STOCK_VACANT: ReadonlyArray<[number, number | null]> =
${STOCK_VACANT};

/** Vacancy rate (空き家率, %) — 1963: 2.5; 2013: 13.5; 2018: 13.6; 2023: 13.8. */
export const VACANCY_RATE: ReadonlyArray<[number, number | null]> =
${VACANCY_RATE};

/** Homeownership share (持ち家率, % of occupied dwellings) — 1963: 64.3; 2023: 60.9. */
export const TENURE_OWNED: ReadonlyArray<[number, number | null]> =
${TENURE_OWNED};

/** Public rental share (公営の借家, %) — 2023: 3.2. */
export const TENURE_PUBLIC: ReadonlyArray<[number, number | null]> =
${TENURE_PUBLIC};

/** UR・公社 rental share (%, null 1963/1968 — category not tabulated) — 2023: 1.3. */
export const TENURE_UR: ReadonlyArray<[number, number | null]> =
${TENURE_UR};

/** Private rental share (民営借家, %) — 1963: 24.1; 2023: 28.2. */
export const TENURE_PRIVATE: ReadonlyArray<[number, number | null]> =
${TENURE_PRIVATE};

/** Company housing share (給与住宅, %) — 1963: 7.0; 2023: 2.3. */
export const TENURE_COMPANY: ReadonlyArray<[number, number | null]> =
${TENURE_COMPANY};

/** Owned dwellings (持ち家, 万戸) — 2023: 3,387.6 (count, for text). */
export const TENURE_COUNT_OWNED: ReadonlyArray<[number, number | null]> =
${pairs(Object.fromEntries(tenureYears.map((y) => [y, tenureCount[String(y)]?.owned ?? null])), man)};

/** Private rental dwellings (民営借家, 万戸) — 2023: 1,568.4 (count, for text). */
export const TENURE_COUNT_PRIVATE: ReadonlyArray<[number, number | null]> =
${pairs(Object.fromEntries(tenureYears.map((y) => [y, tenureCount[String(y)]?.private ?? null])), man)};

// Vacancy types (第4表). 2013/2018 「その他の住宅」 = 2023 「賃貸・売却用及び
// 二次的住宅を除く空き家」 (renamed, same concept). 1978–1998 賃貸用 included
// 売却用 — 2013+ shown here is the clean four-way split.
/** Vacant dwellings for rent (賃貸用の空き家, 万戸) — 2023: 443.6. */
export const VAC_TYPE_RENTAL: ReadonlyArray<[number, number | null]> = [
${typeRows("rental")}
];

/** Vacant dwellings for sale (売却用の空き家, 万戸) — 2023: 32.6. */
export const VAC_TYPE_SALE: ReadonlyArray<[number, number | null]> = [
${typeRows("sale")}
];

/** Second dwellings (二次的住宅, 万戸) — 2023: 38.4. */
export const VAC_TYPE_SECONDARY: ReadonlyArray<[number, number | null]> = [
${typeRows("secondary")}
];

/** Vacant excluding rent/sale/second (その他, 万戸) — 2023: 385.6. */
export const VAC_TYPE_OTHER: ReadonlyArray<[number, number | null]> = [
${typeRows("other")}
];

/** Average floor area, all occupied dwellings (㎡) — 1968: 73.86; 2023: 91.66. */
export const AREA_TOTAL: ReadonlyArray<[number, number | null]> =
${AREA_TOTAL};

/** Average floor area, owned dwellings (㎡) — 2023: 118.25. */
export const AREA_OWNED: ReadonlyArray<[number, number | null]> =
${AREA_OWNED};

/** Average floor area, rented dwellings (㎡) — 1968: 38.05; 2023: 45.39. */
export const AREA_RENTED: ReadonlyArray<[number, number | null]> =
${AREA_RENTED};

/** Construction-period bands of occupied dwellings 2023 (戸) — the 14
 *  published bands; the residual 3,617,300 (not shown) is 建築の時期「不詳」. */
export const BUILT_PERIOD_2023: Record<string, number> = {
${Object.entries(housing.builtPeriod2023 as Record<string, number>).map(([k, v]) => `  "${k}": ${v},`).join("\n")}
};

/** Derived: dwellings built ≤1970 (sum of the two fully-pre-1971 bands, 戸). */
export const BUILT_PRE1971 = ${housing.builtPeriod2023["1950 or earlier"] + housing.builtPeriod2023["1951 to 1970"]};

/** Prefecture vacancy rates 2023 (%, chart selection: top-6 + national + bottom-4). */
export const PREF_VACANCY: ReadonlyArray<[string, number]> = [
${prefChart.map((p) => `  ["${p.name}", ${p.rate}],`).join("\n")}
];

export const PREF_LABELS: Record<string, { ja: string; en: string }> = ${JSON.stringify(PREF_LABELS).replace(/"([一-龥]+)":/g, '"$1":').replace(/", "/g, '", "')};

// ===== FIES 2025 (家計調査 家計収支編, published 2026-02-06) =====

/** Monthly consumption expenditure, 2+ person households (円) — 2000: 317,328; 2025: 314,001. */
export const FIES_EXPENDITURE: ReadonlyArray<[number, number | null]> =
${FIES_EXPENDITURE};

/** 2025 consumption structure (用途分類, published shares, %, 2+ households). */
export const FIES_STRUCTURE: ReadonlyArray<[string, number, number]> = [
${STRUCT_ORDER.map((k) => `  ["${k}", ${structure[k].amount}, ${structure[k].share}],`).join("\n")}
];

export const FIES_STRUCTURE_EN: Record<string, string> = ${JSON.stringify(STRUCT_EN)};

/** Tenure table 2025 (円/month, 2+ households) — [avg, owned, private rental]. */
export const FIES_TENURE_2025: Record<string, [number, number, number]> = {
  消費支出: [${tenure["消費支出"].avg}, ${tenure["消費支出"].owned}, ${tenure["消費支出"].privateRent}],
  住居: [${tenure["住居"].avg}, ${tenure["住居"].owned}, ${tenure["住居"].privateRent}],
  家賃地代: [${tenure["家賃地代"].avg}, ${tenure["家賃地代"].owned}, ${tenure["家賃地代"].privateRent}],
  設備修繕維持: [${tenure["設備修繕・維持"].avg}, ${tenure["設備修繕・維持"].owned}, ${tenure["設備修繕・維持"].privateRent}],
  光熱水道: [${tenure["光熱・水道"].avg}, ${tenure["光熱・水道"].owned}, ${tenure["光熱・水道"].privateRent}],
};

/** DERIVED housing-cost burden (住居費 ÷ 消費支出, %, 1 dp) — computed on this
 *  site from the published FIES amounts above; the survey itself publishes
 *  no such share. 2+ owned: ${BURDEN_TWO_OWNED}%, 2+ private rental: ${BURDEN_TWO_RENT}%. */
export const FIES_BURDEN = {
  twoPlusOwned: ${BURDEN_TWO_OWNED},
  twoPlusPrivateRent: ${BURDEN_TWO_RENT},
  soloOwned: ${BURDEN_SOLO_OWNED},
  soloPrivateRent: ${BURDEN_SOLO_RENT},
  soloAll: ${solo.housingShare},
} as const;

/** Solo households 2025 (円/month) — expenditure ${solo.expenditure}, housing ${solo.housing} (share ${solo.housingShare}% published). */
export const FIES_SOLO_2025 = {
  expenditure: ${solo.expenditure},
  housing: ${solo.housing},
  housingShare: ${solo.housingShare},
  expenditureOwned: ${soloTenure.expenditureOwned},
  expenditurePrivateRent: ${soloTenure.expenditurePrivateRent},
  housingOwned: ${soloTenure.housingOwned},
  housingPrivateRent: ${soloTenure.housingPrivateRent},
} as const;

/** Tenure metadata 2025 (2+ households) — FIES household-frame owned rate
 *  87.3% (definitionally distinct from the dwelling-based 60.9%); head ages. */
export const FIES_TENURE_META = {
  ownedRate: ${tenure["_meta"].ownedRate},
  headAgeAvg: ${tenure["_meta"].headAgeAvg},
  headAgeOwned: ${tenure["_meta"].headAgeOwned},
  headAgePrivateRent: ${tenure["_meta"].headAgePrivateRent},
} as const;

/** Worker households 2025 (勤労者世帯, 円/month) — income ${kinrou.income}, disposable ${kinrou.disposable}. */
export const FIES_KINROU_2025 = {
  income: ${kinrou.income},
  disposable: ${kinrou.disposable},
  expenditure: ${kinrou.expenditure},
  housingOwned: ${kinrou.housingOwned},
  housingPrivateRent: ${kinrou.housingPrivateRent},
} as const;

/** Regional 2025 (2+ households): expenditure 円/month + published housing share % + utilities 円/month. */
export const FIES_REGIONAL_2025: Record<string, { expenditure: number; housingShare: number; utilities: number }> = {
${Object.entries(regional).map(([k, v]) => `  "${k}": { expenditure: ${v.expenditure}, housingShare: ${v.housingShare}, utilities: ${v.utilities} },`).join("\n")}
};

/** All households 2025 (総世帯, 円/month) — from 家計の概要. */
export const FIES_ALL_2025 = {
  expenditure: ${fies.headline.totalHouseholds2025},
} as const;

// ===== CPI (総務省 消費者物価指数) =====

/** Long-run all-items CPI (2025=100, annual) — 1970: 27.6; 2000: 86.9; 2010: 84.7; 2025: 100.0. */
export const CPI_LONG: ReadonlyArray<[number, number | null]> =
${CPI_LONG};

// Recent group indices (2025=100). NOTE: 2025 annual average was published in
// the 2020 base (総合 111.9) on 2026-01-23; the 2025-base long-run series
// above is the e-Stat release of 2026-08-07. YoY rates agree across bases.
/** All-items index (総合). */
export const CPI_G_ALL: ReadonlyArray<[number, number | null]> =
${CPI_G_ALL};

/** Food index (食料). */
export const CPI_G_FOOD: ReadonlyArray<[number, number | null]> =
${CPI_G_FOOD};

/** Housing index (住居). */
export const CPI_G_HOUSING: ReadonlyArray<[number, number | null]> =
${CPI_G_HOUSING};

/** Rent index (家賃) — notably flat: 2020: 99.2 → 2025: 100.0. */
export const CPI_G_RENT: ReadonlyArray<[number, number | null]> =
${CPI_G_RENT};

/** Energy index (エネルギー). */
export const CPI_G_ENERGY: ReadonlyArray<[number, number | null]> =
${CPI_G_ENERGY};

/** YoY by group (%, [year, all, food, housing, rent, energy]) — 2025: +3.2/+6.8/+1.0/+0.3/+3.6. */
export const CPI_YOY_GROUPS: ReadonlyArray<[number, number, number, number, number, number]> = [
${CPI_YOY_TABLE}
];

/** Private rent YoY (民営家賃, %) — 2023: +0.1; 2024: +0.3; 2025: +0.5. */
export const CPI_RENT_PRIVATE_YOY: ReadonlyArray<[number, number]> = [
${Object.entries(cpi.yoyRentPrivate as Record<string, number>).map(([y, v]) => `  [${y}, ${v}],`).join("\n")}
];

/** CPI headline values (from the annual + Sep-2026 release PDFs). */
export const CPI_HEADLINE = {
  avg2025Index2020base: ${cpi.headline.avg2025Index2020base},
  avg2025Yoy: ${cpi.headline.avg2025Yoy},
  sep2026Index: ${cpi.headline.sep2026Index},
  sep2026Yoy: ${cpi.headline.sep2026Yoy},
} as const;

// ===== OECD Analytical House Price Statistics (2015=100 indices) =====
// HPI_YDH = price-to-income ratio index; RHP = real house price index.
// BOTH are indices on base 2015=100 (BASE_PER=2015, UNIT=IX) — neither is a
// price level, a percentage, nor 2020-based. Seasonally adjusted, annual.

/** Japan price-to-income ratio (2015=100) — 1973 peak: 213.1; 2005–2015 ≈ 100; 2025: 114.6. */
export const OECD_PTI_JPN: ReadonlyArray<[number, number | null]> =
${PTI_JPN};

/** Japan real house price index (2015=100) — 1990: 163.3; 2025: 118.0. */
export const OECD_RHP_JPN: ReadonlyArray<[number, number | null]> =
${RHP_JPN};

/** Price-to-income ratio, latest year = ${OECD_YEAR} (2015=100), ascending. */
export const OECD_PTI_COMPARE: ReadonlyArray<[string, number]> = [
${oecdCompare.map(([a, v]) => `  ["${a}", ${v}],`).join("\n")}
];

export const OECD_PTI_YEAR = ${OECD_YEAR};
export const OECD_COUNTRIES: Record<string, { ja: string; en: string }> = {
${oecdCompare.map(([a]) => `  ${a}: { ja: "${OECD_NAME_JA[a]}", en: "${OECD_NAME_EN[a]}" },`).join("\n")}
};

// ===== MLIT (国土交通省) =====

/** Housing starts, selected years (戸) — 1973 peak: 1,905,112; 2025: 740,667. */
export const MLIT_STARTS_SELECTED: ReadonlyArray<[number, number]> = [
${STARTS_SELECTED}
];

/** Full housing-starts history 1948–2025 (戸) — for text reference. */
export const MLIT_STARTS_FULL: ReadonlyArray<[number, number]> = [
${STARTS_YEARS.map((y) => `  [${y}, ${starts[String(y)]}],`).join("\n")}
];

/** Published land prices (地価公示, 住宅地平均価格, 円/㎡) — simple average over 標準地. */
export const MLIT_LAND_PRICE = {
  national2023: ${landPrice["全国"]["2023"]},
  national2024: ${landPrice["全国"]["2024"]},
  national2025: ${landPrice["全国"]["2025"]},
  national2026: ${landPrice["全国"]["2026"]},
  tokyo2023: ${landPrice["東京都"]["2023"]},
  tokyo2024: ${landPrice["東京都"]["2024"]},
  tokyo2025: ${landPrice["東京都"]["2025"]},
  tokyo2026: ${landPrice["東京都"]["2026"]},
} as const;

export const DATA_SNAPSHOT_HASH = "${hash}";
`;

import { mkdirSync } from "node:fs";
mkdirSync(resolve(ROOT, "src/chapters/chapter-03"), { recursive: true });
writeFileSync(targetPath, out, "utf-8");
console.log(`wrote ${targetPath}`);
console.log(`source snapshot hash: ${hash}`);
console.log(`source snapshot hash: ${hash}`);
