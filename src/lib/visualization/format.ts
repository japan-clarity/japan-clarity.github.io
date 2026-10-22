import type { Locale } from "@/lib/i18n/locales";
import { localeMeta } from "@/lib/i18n/locales";
import type { ValueKind } from "@/lib/research/types";

/**
 * Locale-aware number formatting shared by charts, tables, and prose.
 * Values are stored unrounded; rounding happens only at render time.
 */

const formatterCache = new Map<string, Intl.NumberFormat>();

function numberFormat(
  locale: Locale,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  let fmt = formatterCache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(localeMeta[locale].intlLocale, options);
    formatterCache.set(key, fmt);
  }
  return fmt;
}

export function formatValue(
  value: number,
  kind: ValueKind,
  locale: Locale,
): string {
  switch (kind) {
    case "int":
    case "thousand":
      return numberFormat(locale, { maximumFractionDigits: 0 }).format(value);
    case "million1":
      return numberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value);
    case "float1":
      return numberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value);
    case "float2":
      return numberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    case "percent1":
      return `${numberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value)}%`;
  }
}

/** Plain year label for chart axes and table headers (no era suffix). */
export function formatYearPlain(year: number): string {
  return String(year);
}

/** Localized year label for tooltips and prose (2024年 / 2024). */
export function formatYearLabel(year: number, locale: Locale): string {
  return locale === "ja" ? `${year}年` : String(year);
}

/** Localized date for ISO date strings (access/publication dates). */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(localeMeta[locale].intlLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Compact localized millions, e.g. 1.26億人 / 126.1 million. */
export function formatMillionsPersons(
  valueInThousands: number,
  locale: Locale,
): string {
  const millions = valueInThousands / 1000;
  if (locale === "ja") {
    const oku = millions / 100; // 億 = 100 million
    if (oku >= 1) {
      return `${numberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(oku)}億人`;
    }
    return `${numberFormat(locale, { maximumFractionDigits: 0 }).format(millions)}万人`;
  }
  return `${numberFormat(locale, { maximumFractionDigits: 1 }).format(millions)} million`;
}
