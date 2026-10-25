"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { locales, localeMeta, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";

/**
 * The two-option language switch: Japanese on the LEFT, English on the RIGHT
 * (fixed order on desktop and mobile). Switching preserves the current path
 * by swapping the first segment, stores the preference, and works under
 * static export (pure client-side navigation).
 */
export function LanguageSwitch({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const pathname = usePathname() || `/${locale}/`;
  const ui = getUI(locale).nav;

  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1).join("/");

  useEffect(() => {
    try {
      window.localStorage.setItem("jc-pref-lang", locale);
    } catch {
      /* storage unavailable — preference simply isn't remembered */
    }
  }, [locale]);

  return (
    <nav
      role="group"
      aria-label={ui.switchLanguage}
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5"
    >
      {locales.map((code) => {
        const active = code === locale;
        const href = `/${code}${rest ? `/${rest}` : ""}/`;
        return (
          <Link
            key={code}
            href={href}
            hrefLang={localeMeta[code].htmlLang}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              compact ? "min-w-[52px] text-center" : "min-w-[64px] text-center"
            } ${
              active
                ? "bg-teal text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {localeMeta[code].label}
          </Link>
        );
      })}
    </nav>
  );
}
