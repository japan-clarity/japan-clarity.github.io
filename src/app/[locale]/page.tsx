import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { chapters } from "@/config/chapters";
import { allRegisteredChapters } from "@/chapters/registry";
import { isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { StatusBadge } from "@/components/shared/status-badge";
import { PopulationSparkline } from "@/components/shared/population-sparkline";
import { formatDate } from "@/lib/visualization/format";

interface PageParams {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: "ja" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const brand = locale === "ja" ? siteConfig.brand.ja : siteConfig.brand.en;
  return {
    title: locale === "ja" ? "ホーム" : "Home",
    description: siteConfig.description[locale],
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/`,
      languages: {
        "ja-JP": `${siteConfig.siteUrl}/ja/`,
        en: `${siteConfig.siteUrl}/en/`,
      },
    },
  };
}

export default async function HomePage({ params }: PageParams) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ja") as Locale;
  const ui = getUI(locale);
  const home = ui.home;
  const approach = ui.approach;
  const registered = allRegisteredChapters();
  const publishedCount = registered.filter((c) => c.module !== null).length;
  const firstPublished = registered.find((c) => c.module !== null);

  const steps = [
    { key: "observe", label: approach.observe, desc: approach.observeDesc },
    { key: "verify", label: approach.verify, desc: approach.verifyDesc },
    { key: "compare", label: approach.compare, desc: approach.compareDesc },
    { key: "investigate", label: approach.investigate, desc: approach.investigateDesc },
    { key: "evaluate", label: approach.evaluate, desc: approach.evaluateDesc },
    { key: "act", label: approach.act, desc: approach.actDesc },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-[#131A22] to-[#0F141A]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rise-in">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
              {home.kicker}
            </p>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-heading sm:text-4xl sm:leading-tight">
              {locale === "ja" ? (
                <>
                  データと根拠から、
                  <br />
                  日本を理解する。
                </>
              ) : (
                <>
                  Understanding Japan through
                  <br />
                  Data and Evidence
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-[13.5px] leading-relaxed text-foreground/85 sm:text-sm">
              {home.heroLead}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {firstPublished ? (
                <Button asChild className="bg-teal text-[#0F141A] hover:bg-teal/90">
                  <Link href={localePath(locale, `chapters/${firstPublished.meta.slug}`)}>
                    {home.ctaRead}
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" className="border-border text-foreground hover:bg-accent">
                <Link href={localePath(locale, "methodology")}>
                  <ShieldCheck className="mr-1.5 h-4 w-4" aria-hidden />
                  {home.ctaMethod}
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-[11px] text-muted-foreground">
              {home.publishedNow}:{" "}
              <span className="font-medium text-sand">
                {publishedCount} / {chapters.length} {home.chaptersPublished}
              </span>
              {" · "}
              {ui.footer.lastVerified}: {formatDate(siteConfig.researchVerifiedDate, locale)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface/80 p-5 sm:p-6">
            <h2 className="text-xs font-medium text-heading">{home.sparkCaption}</h2>
            <div className="mt-3">
              <PopulationSparkline locale={locale} />
            </div>
            <p className="mt-3 border-t border-border pt-3 text-[10.5px] leading-relaxed text-muted-foreground">
              {home.sparkSource}
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-heading" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 id="approach-heading" className="font-serif text-xl font-semibold text-heading sm:text-2xl">
            {home.approachTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-foreground/85">
            {home.approachLead}
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.key}
                className="flex gap-3 rounded-xl border border-border bg-surface/60 p-4"
              >
                <span className="font-mono text-xs text-teal">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-sm font-semibold text-heading">{step.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <figure className="mt-8 border-l-2 border-teal/60 pl-5">
            <blockquote className="font-serif text-base italic leading-relaxed text-foreground/90">
              {home.principlesQuote}
            </blockquote>
            <figcaption className="mt-2 text-[11px] text-muted-foreground">
              {home.principlesTitle} — Japan Clarity
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Chapters */}
      <section aria-labelledby="chapters-heading" className="border-b border-border bg-block/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="chapters-heading" className="font-serif text-xl font-semibold text-heading sm:text-2xl">
                {home.chaptersTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                {home.chaptersLead}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-teal hover:bg-accent">
              <Link href={localePath(locale, "overview")}>
                <FileSearch className="mr-1.5 h-4 w-4" aria-hidden />
                {ui.common.viewAllChapters}
              </Link>
            </Button>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {registered.map(({ meta, module }) => (
              <li key={meta.slug}>
                <Link
                  href={localePath(locale, `chapters/${meta.slug}`)}
                  className="flex h-full flex-col rounded-xl border border-border bg-surface/70 p-4 transition-colors hover:border-teal/50 hover:bg-accent/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {locale === "ja" ? `第${meta.number}章` : `Chapter ${meta.number}`}
                    </span>
                    <StatusBadge status={meta.status} locale={locale} />
                  </div>
                  <h3 className="mt-2 font-serif text-[15px] font-semibold leading-snug text-heading">
                    {meta.title[locale]}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {meta.scope[locale]}
                  </p>
                  {module ? (
                    <span className="mt-auto pt-3 text-[11px] font-medium text-teal">
                      {ui.common.readChapter} →
                    </span>
                  ) : (
                    <span className="mt-auto pt-3 text-[11px] text-muted-foreground">
                      {ui.status.planned}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Evidence */}
      <section aria-labelledby="evidence-heading">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10 sm:px-6">
          <div>
            <h2 id="evidence-heading" className="text-sm font-semibold text-heading">
              {home.exploreEvidence}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {ui.sources.lead}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-border">
            <Link href={localePath(locale, "sources")}>
              {ui.nav.sources}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
