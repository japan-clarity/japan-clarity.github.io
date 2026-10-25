import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { chapters as allChapterMeta } from "@/config/chapters";
import { getRegisteredChapter, allRegisteredChapters } from "@/chapters/registry";
import type { ContentBlock } from "@/chapters/types";
import { isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { StatusBadge } from "@/components/shared/status-badge";
import { ReadingSection } from "@/components/shared/reading-section";
import { Callout } from "@/components/shared/callout";
import { ChartPanel } from "@/components/charts/chart-panel";
import { formatDate } from "@/lib/visualization/format";
import type { VerificationStatus } from "@/lib/research/types";

interface PageParams {
  params: Promise<{ locale: string; slug: string }>;
}

/** Editorial long titles per published chapter (placeholder chapters fall back to meta.title). */
const CHAPTER_LONG_TITLES: Record<string, { ja: string; en: string }> = {
  "population-family": {
    ja: "日本の人口課題：人口変動と未来を理解する",
    en: "Japan's Population Question: Understanding Demographic Change and the Future",
  },
  "economy-industry": {
    ja: "日本経済と産業の構造を読み解く",
    en: "Understanding Japan's Economy and Industrial Structure",
  },
};

export function generateStaticParams() {
  return allChapterMeta.flatMap((chapter) => [
    { locale: "ja", slug: chapter.slug },
    { locale: "en", slug: chapter.slug },
  ]);
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const entry = getRegisteredChapter(slug);
  if (!entry) return {};
  const { meta, module } = entry;
  const longTitle = module
    ? (CHAPTER_LONG_TITLES[slug]?.[locale] ?? meta.title[locale])
    : meta.title[locale];
  return {
    title: `${meta.number} ${meta.title[locale]}`,
    description: `${longTitle} — ${meta.scope[locale]}`,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/chapters/${slug}/`,
      languages: {
        "ja-JP": `${siteConfig.siteUrl}/ja/chapters/${slug}/`,
        en: `${siteConfig.siteUrl}/en/chapters/${slug}/`,
      },
    },
    openGraph: {
      title: `${meta.number} ${meta.title[locale]} — ${siteConfig.brand[locale === "ja" ? "ja" : "en"]}`,
      description: meta.scope[locale],
    },
  };
}

const VERIFICATION_TONE: Record<VerificationStatus, string> = {
  "verified-primary": "border-teal/40 bg-teal/10 text-teal",
  "verified-secondary": "border-teal/40 bg-teal/10 text-teal",
  derived: "border-bluegrey/40 bg-bluegrey/10 text-bluegrey",
  provisional: "border-sand/40 bg-sand/10 text-sand",
  unverified: "border-border bg-surface text-muted-foreground",
};

export default async function ChapterPage({ params }: PageParams) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const entry = getRegisteredChapter(slug);
  if (!entry) notFound();
  const { meta, module } = entry;
  const ui = getUI(locale);
  const t = ui.chapter;

  const index = allChapterMeta.findIndex((c) => c.slug === slug);
  const prev = index > 0 ? allChapterMeta[index - 1] : null;
  const next = index < allChapterMeta.length - 1 ? allChapterMeta[index + 1] : null;

  const chapterTitle = module
    ? (CHAPTER_LONG_TITLES[slug]?.[locale] ?? meta.title[locale])
    : meta.title[locale];

  return (
    <div>
      {/* Chapter header */}
      <header className="border-b border-border bg-block/60">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
            {t.chapterNumber.replace("{n}", meta.number)}
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold leading-snug text-heading sm:text-3xl">
            {chapterTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
            {meta.scope[locale]}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
            <StatusBadge status={meta.status} locale={locale} />
            {module ? (
              <span>
                {ui.common.lastUpdated}: {formatDate(module.updatedAt, locale)}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {module ? (
        <>
          {/* Mini TOC */}
          <nav
            aria-labelledby="toc-heading"
            className="border-b border-border bg-surface/50"
          >
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
              <h2 id="toc-heading" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t.inThisChapter}
              </h2>
              <ol className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {module.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-xs text-foreground/80 underline-offset-2 hover:text-teal hover:underline"
                    >
                      {section.heading[locale]}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* Sections */}
          {module.sections.map((section, i) => (
            <ReadingSection
              key={section.id}
              id={section.id}
              title={section.heading[locale]}
              locale={locale}
              variant={i % 2 === 1 ? "raised" : "base"}
            >
              <div className="reading-prose">
                {section.blocks.map((block, j) => (
                  <ContentBlockView
                    key={j}
                    block={block}
                    locale={locale}
                    module={module}
                  />
                ))}
              </div>
            </ReadingSection>
          ))}

          {/* Limitations */}
          <ReadingSection
            id="chapter-limitations"
            title={t.limitationsTitle}
            locale={locale}
            variant="raised"
          >
            <ul className="reading-prose text-[13px] text-foreground/85">
              {module.limitations.map((limitation) => (
                <li key={limitation.ja}>{limitation[locale]}</li>
              ))}
            </ul>
          </ReadingSection>

          {/* Sources */}
          <ReadingSection id="chapter-sources" title={t.sourcesTitle} locale={locale}>
            <ul className="grid gap-2.5">
              {module.sources.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg border border-border bg-surface/60 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium text-teal underline decoration-teal/40 underline-offset-2"
                    >
                      {s.organization[locale]} — {s.displayTitle[locale]}
                      <ExternalLink className="ml-1 inline h-3 w-3 align-[-1px]" aria-hidden />
                    </a>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${VERIFICATION_TONE[s.verification]}`}
                    >
                      {ui.verification[s.verification]}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    {locale === "ja" ? "対象期間" : "Reference period"}: {s.referencePeriod} ·{" "}
                    {ui.common.accessDate}: {formatDate(s.accessDate, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </ReadingSection>
        </>
      ) : (
        /* Unpublished chapter placeholder — honest, non-fabricated */
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="rounded-xl border border-border bg-surface/70 p-6 sm:p-10">
            <h2 className="font-serif text-lg font-semibold text-heading sm:text-xl">
              {t.notPublishedTitle}
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/85">
              {t.notPublishedBody}
            </p>
            <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-sand">
              {t.plannedFocus}
            </h3>
            <ul className="reading-prose mt-3 text-[13px] text-foreground/85">
              {meta.focus[locale].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-8 border-border">
              <Link href={localePath(locale, "overview")}>
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                {t.backToOverview}
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Prev / next */}
      <nav
        aria-label={locale === "ja" ? "章のナビゲーション" : "Chapter navigation"}
        className="border-t border-border bg-surface/40"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
          {prev ? (
            <Link
              href={localePath(locale, `chapters/${prev.slug}`)}
              className="group flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3 text-xs text-muted-foreground transition-colors hover:border-teal/50 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                <span className="block text-[10px]">{t.previous}</span>
                <span className="font-medium text-foreground/90">
                  {prev.number} {prev.title[locale]}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={localePath(locale, `chapters/${next.slug}`)}
              className="group flex items-center justify-end gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3 text-right text-xs text-muted-foreground transition-colors hover:border-teal/50 hover:text-foreground"
            >
              <span>
                <span className="block text-[10px]">{t.next}</span>
                <span className="font-medium text-foreground/90">
                  {next.number} {next.title[locale]}
                </span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}

/** Renders one typed content block of a chapter section. */
function ContentBlockView({
  block,
  locale,
  module,
}: {
  block: ContentBlock;
  locale: Locale;
  module: NonNullable<ReturnType<typeof getRegisteredChapter>>["module"];
}) {
  switch (block.type) {
    case "p":
      return <p className="text-[13.5px] text-foreground/90">{block.text[locale]}</p>;
    case "h3":
      return (
        <h3 id={block.id} className="mt-8 scroll-mt-24 font-serif text-base font-semibold text-heading">
          {block.text[locale]}
        </h3>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i} className="text-[13px] text-foreground/90">
              {item[locale]}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <Callout kind={block.kind} title={block.title ? block.title[locale] : undefined} locale={locale}>
          {block.text[locale]}
        </Callout>
      );
    case "stats": {
      return (
        <dl className="my-6 grid gap-3 sm:grid-cols-3">
          {block.items.map((item, i) => {
            const source = module?.sources.find((s) => s.id === item.sourceId);
            return (
              <div key={i} className="rounded-xl border border-border bg-surface/70 p-4">
                <dd className="font-serif text-xl font-semibold text-heading">{item.value[locale]}</dd>
                <dt className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.label[locale]}</dt>
                {source ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[10px] text-teal/80 underline decoration-teal/30 underline-offset-2 hover:text-teal"
                  >
                    {source.organization[locale]}
                  </a>
                ) : null}
              </div>
            );
          })}
        </dl>
      );
    }
    case "chart": {
      const spec = module?.charts.find((c) => c.id === block.chartId);
      if (!spec || !module) {
        return (
          <p className="my-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            Missing chart: {block.chartId}
          </p>
        );
      }
      const chartIndex = module.charts.findIndex((c) => c.id === block.chartId) + 1;
      const sources = spec.sourceIds
        .map((id) => module.sources.find((s) => s.id === id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s));
      return (
        <div className="reading-prose my-2">
          <ChartPanel
            spec={spec}
            locale={locale}
            sources={sources}
            figureIndex={chartIndex}
          />
        </div>
      );
    }
    default:
      return null;
  }
}
