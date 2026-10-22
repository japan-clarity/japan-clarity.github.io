/**
 * Japan Clarity — shared type definitions for research provenance.
 *
 * Every substantive dataset rendered on the site must carry a structured
 * provenance record (see the specification, section 11) and an explicit
 * verification status (section 11 "Verification classifications").
 * The `scripts/validate-research.ts` integrity gate enforces these rules.
 */

/** A string that exists in exactly one language variant per locale. */
export interface L10n {
  ja: string;
  en: string;
}

export type L10nText = L10n;

/**
 * Verification statuses.
 *
 * - `verified-primary`     — the figure was read directly from the original
 *                             publisher's own document/page (e.g. a PDF or HTML
 *                             release fetched from the official domain) and a
 *                             raw copy is archived under `research/`.
 * - `verified-secondary`   — verified through an authoritative secondary
 *                             compiler (e.g. World Bank Open Data) whose
 *                             methodology is documented; raw API response
 *                             archived under `research/`.
 * - `derived`              — computed on this site from verified data (e.g. a
 *                             share calculated from two verified counts). The
 *                             derivation is described in `methodologyNotes`.
 * - `provisional`          — official but provisional/flash figure (e.g. a
 *                             monthly or preliminary release); may be revised.
 * - `unverified`           — NOT allowed in published chapter content. Only
 *                             permitted inside source registers as an explicit
 *                             disclosure of pending verification.
 */
export type VerificationStatus =
  | "verified-primary"
  | "verified-secondary"
  | "derived"
  | "provisional"
  | "unverified";

/** Publication status of a research chapter. */
export type ChapterStatus =
  | "published" // published and verified within documented scope
  | "published-limited" // published with disclosed limitations
  | "in-progress" // research in progress
  | "planned"; // planned, no substantive research published yet

export interface SourceRecord {
  /** Unique source identifier, e.g. "mhlw-vital-2025-final". */
  id: string;
  /** Publishing organization (bilingual). */
  organization: L10n;
  /** Original title of the document/dataset (in its original language). */
  originalTitle: string;
  /** Bilingual descriptive title used on the site. */
  displayTitle: L10n;
  /** Direct URL to the original document or dataset. */
  url: string;
  /** Language of the original source. */
  sourceLanguage: "ja" | "en" | "ja+en";
  /** Publication date of the source (ISO 8601 date). */
  publicationDate: string;
  /** Reference period the data describes, e.g. "2025 (Jan–Dec)". */
  referencePeriod: string;
  /** Date this project accessed and verified the source. */
  accessDate: string;
  /** Geographic coverage, e.g. "Japan (national)". */
  geographicCoverage: L10n;
  /** Primary statistical unit of the figures. */
  statisticalUnit: L10n;
  /** Verification status — see VerificationStatus. */
  verification: VerificationStatus;
  /** Licensing / reuse conditions. */
  license: L10n;
  /** Methodological notes, definitions and caveats that affect interpretation. */
  methodologyNotes: L10n;
  /** Known limitations of this source. */
  limitations: L10n;
  /** Path of the archived raw evidence file inside `research/` (relative). */
  evidenceFile?: string;
}

/** Value formatting categories used by charts and tables. */
export type ValueKind =
  | "int" // 123,802
  | "thousand" // 123,802 thousand persons
  | "million1" // 123.8 million
  | "float1" // 1.1
  | "float2" // 1.15
  | "percent1"; // 29.6%

export type SeriesKind = "line" | "bar" | "area";

export interface SeriesSpec {
  /** Stable series key, unique within its chart. */
  key: string;
  /** Bilingual series name (legend + table header). */
  name: L10n;
  /** Values aligned with `ChartSpec.years`; null = missing/not published. */
  values: Array<number | null>;
  /** Chart kind; defaults to "line". */
  kind?: SeriesKind;
  /** Render as dashed (used for projections/scenarios). */
  dashed?: boolean;
  /** Stack group for "area" series. */
  stack?: string;
  /** Explicit palette index override. */
  colorIndex?: number;
}

export interface ChartSpec {
  /** Unique chart id, e.g. "ch01-births-deaths". */
  id: string;
  title: L10n;
  /** Accessible text alternative summarizing the chart for screen readers. */
  description: L10n;
  /**
   * X-axis categories (or y-axis when horizontal): years for time series
   * (strictly increasing numbers) or category keys such as ISO3 country
   * codes for comparison charts.
   */
  years: Array<number | string>;
  /** Optional bilingual labels for category charts, aligned with `years`. */
  categories?: L10n[];
  series: SeriesSpec[];
  /** Unit label shown on axis, table header and tooltips. */
  unit: L10n;
  /** Number formatting category. */
  valueKind: ValueKind;
  /** Optional y-axis name (defaults to unit). */
  yLabel?: L10n;
  /** Source ids; every id must resolve in the owning chapter's source register. */
  sourceIds: string[];
  /** Interpretation note rendered beneath the chart. */
  note?: L10n;
  /** First year of projected values (series after this year render dashed). */
  projectionFromYear?: number;
  /** Horizontal bar layout (category axis on y) — used for country comparisons. */
  horizontal?: boolean;
  /** Offer compact time-range filter buttons. */
  rangeFilter?: boolean;
  /** Offer CSV download (with attribution header). Default true. */
  csv?: boolean;
}
