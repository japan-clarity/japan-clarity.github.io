import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { isLocale, locales, localeMeta, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { BackToTop } from "@/components/shared/back-to-top";
import "@/app/globals.css";

/**
 * Root layout, generated per locale (ja default, en secondary). Placing the
 * root layout inside `[locale]` lets each statically exported page carry the
 * correct `<html lang>` — no server middleware, fully GitHub Pages
 * compatible. See docs/ARCHITECTURE.md for the routing tradeoffs.
 */

interface LayoutParams {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const brand = locale === "ja" ? siteConfig.brand.ja : siteConfig.brand.en;
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: `${brand} — ${siteConfig.tagline[locale]}`,
      template: `%s — ${brand}`,
    },
    description: siteConfig.description[locale],
    applicationName: brand,
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      type: "website",
      siteName: brand,
      title: `${brand} — ${siteConfig.tagline[locale]}`,
      description: siteConfig.description[locale],
      locale: localeMeta[locale].htmlLang,
    },
    twitter: {
      // No explicit title/description: X falls back to the (page-specific)
      // og:title / og:description, so shared chapter pages advertise
      // themselves instead of the generic site title.
      card: "summary",
    },
    alternates: {
      languages: {
        "ja-JP": `${siteConfig.siteUrl}/ja/`,
        en: `${siteConfig.siteUrl}/en/`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;
  const ui = getUI(locale);

  return (
    <html lang={localeMeta[locale].htmlLang} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <a href="#content" className="skip-link">
          {ui.nav.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
        <BackToTop locale={locale} />
      </body>
    </html>
  );
}
