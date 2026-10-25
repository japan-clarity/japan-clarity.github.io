import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { allRegisteredChapters } from "@/chapters/registry";
import { isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { StatusBadge } from "@/components/shared/status-badge";
import { ReadingSection } from "@/components/shared/reading-section";

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
  const ui = getUI(locale).overview;
  return {
    title: ui.title,
    description: ui.lead,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/overview/`,
      languages: {
        "ja-JP": `${siteConfig.siteUrl}/ja/overview/`,
        en: `${siteConfig.siteUrl}/en/overview/`,
      },
    },
  };
}

export default async function OverviewPage({ params }: PageParams) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ja") as Locale;
  const ui = getUI(locale).overview;
  const registered = allRegisteredChapters();

  const statusLegend = [
    { status: "published" as const, desc: ui.statusLegendPublished },
    { status: "published-limited" as const, desc: ui.statusLegendLimited },
    { status: "in-progress" as const, desc: ui.statusLegendInProgress },
    { status: "planned" as const, desc: ui.statusLegendPlanned },
  ];

  return (
    <div>
      <header className="border-b border-border bg-block/60">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
            {getUI(locale).nav.overview}
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold leading-snug text-heading sm:text-3xl">
            {ui.title}
          </h1>
          <p className="mt-4 text-[13.5px] leading-relaxed text-foreground/85">{ui.lead}</p>
        </div>
      </header>

      <ReadingSection id="dimensions" title={ui.tableTitle} locale={locale} eyebrow={getUI(locale).nav.chapters}>
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{ui.sequenceNote}</p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="jc-data-table w-full min-w-[640px] border-collapse text-xs sm:text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th scope="col" className="px-4 py-3 text-left font-medium">{ui.tableChapter}</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">{ui.tableDimension}</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">{ui.tableStatus}</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">{ui.tableFocus}</th>
              </tr>
            </thead>
            <tbody>
              {registered.map(({ meta, module }) => (
                <tr key={meta.slug} className="border-b border-border/60 last:border-0 align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-muted-foreground">
                    {meta.number}
                  </td>
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    {module ? (
                      <Link
                        href={localePath(locale, `chapters/${meta.slug}`)}
                        className="font-medium text-teal underline decoration-teal/40 underline-offset-2 hover:text-teal"
                      >
                        {meta.title[locale]}
                      </Link>
                    ) : (
                      <Link
                        href={localePath(locale, `chapters/${meta.slug}`)}
                        className="text-foreground/80 hover:text-teal"
                      >
                        {meta.title[locale]}
                      </Link>
                    )}
                  </th>
                  <td className="px-4 py-3">
                    <StatusBadge status={meta.status} locale={locale} />
                  </td>
                  <td className="px-4 py-3 leading-relaxed text-muted-foreground">
                    {meta.scope[locale]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReadingSection>

      <ReadingSection id="status-legend" title={ui.statusLegend} locale={locale} variant="raised">
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{ui.statusLegendLead}</p>
        <ul className="mt-5 grid gap-3">
          {statusLegend.map((item) => (
            <li key={item.status} className="flex items-start gap-3 rounded-lg border border-border bg-surface/60 p-3.5">
              <StatusBadge status={item.status} locale={locale} />
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </li>
          ))}
        </ul>
      </ReadingSection>

      <ReadingSection id="evidence" title={ui.howWeResearch} locale={locale}>
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{ui.howWeResearchLead}</p>
        <Button asChild variant="outline" size="sm" className="mt-5 border-border">
          <Link href={localePath(locale, "methodology")}>
            {ui.goMethodology}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
          </Link>
        </Button>
      </ReadingSection>
    </div>
  );
}
