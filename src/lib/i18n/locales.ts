/**
 * Locale definitions for Japan Clarity.
 *
 * Exactly two official languages are supported:
 *   - Japanese (ja-JP) — the DEFAULT language, shown as the LEFT switch option.
 *   - English (en)     — the secondary language, shown as the RIGHT option.
 *
 * Routing: statically generated locale routes `/ja/...` and `/en/...`.
 * This is a deliberate choice (documented in docs/ARCHITECTURE.md):
 *   - Works with GitHub Pages static export without server middleware.
 *   - URLs are self-documenting; direct links and refreshes preserve language.
 *   - The switcher swaps the first path segment, preserving the current page.
 */
export const locales = ["ja", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja";

export interface LocaleMeta {
  /** Value for the `<html lang>` attribute. */
  htmlLang: string;
  /** Full label used in the language switcher (left = ja, right = en). */
  label: string;
  /** Compact label for constrained UI. */
  shortLabel: string;
  /** BCP 47 tag passed to Intl formatters. */
  intlLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  ja: {
    htmlLang: "ja-JP",
    label: "日本語",
    shortLabel: "JA",
    intlLocale: "ja-JP",
  },
  en: {
    htmlLang: "en",
    label: "English",
    shortLabel: "EN",
    intlLocale: "en",
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Locale-aware path helper (always trailing-slash form). */
export function localePath(locale: Locale, path = ""): string {
  const suffix = path ? `/${path.replace(/^\/+|\/+$/g, "")}` : "";
  return `/${locale}${suffix}/`;
}
