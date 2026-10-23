import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";
import { localePath, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { LogoMark } from "@/components/shared/logo";
import { formatDate } from "@/lib/visualization/format";

/**
 * Site footer — carries the independent-project disclaimer (specification
 * section 24), license notes, repository link, and the evidence
 * verification date. The layout pins it to the bottom of short pages.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getUI(locale).footer;
  return (
    <footer className="mt-auto border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7" />
              <span className="font-serif text-sm font-semibold text-heading">
                {locale === "ja" ? siteConfig.brand.ja : siteConfig.brand.en}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {siteConfig.tagline[locale]}
            </p>
            <h2 className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-sand">
              {t.disclaimerTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-[11.5px] leading-relaxed text-muted-foreground">
              {t.disclaimerBody}
            </p>
            <p className="mt-3 max-w-2xl text-[11.5px] leading-relaxed text-muted-foreground">
              {t.licenseNote}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {locale === "ja" ? "ナビゲーション" : "Navigation"}
            </h2>
            <Link href={localePath(locale, "methodology")} className="py-2 text-muted-foreground hover:text-teal">
              {getUI(locale).nav.methodology}
            </Link>
            <Link href={localePath(locale, "sources")} className="py-2 text-muted-foreground hover:text-teal">
              {getUI(locale).nav.sources}
            </Link>
            <a
              href={siteConfig.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 py-2 text-muted-foreground hover:text-teal"
            >
              {t.repository}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {t.lastVerified}: {formatDate(siteConfig.researchVerifiedDate, locale)}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-1.5 border-t border-border pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t.copyright}</p>
          <p>{t.notAffiliated}</p>
        </div>
      </div>
    </footer>
  );
}
