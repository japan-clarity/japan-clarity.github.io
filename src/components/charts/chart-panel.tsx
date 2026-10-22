"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChartView } from "@/components/charts/chart-view";
import { ChartTable } from "@/components/charts/chart-table";
import { downloadCsv } from "@/components/charts/csv";
import type { ChartSpec, SourceRecord } from "@/lib/research/types";
import type { Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";

const RANGE_STEPS = [1990, 2010] as const;

/**
 * ChartPanel — every statistical figure on the site renders through this
 * component (specification section 13). It provides:
 *
 * - chart ⇄ table switching with reliable chart restoration (Radix Tabs
 *   unmount inactive content, so returning re-mounts and re-renders the chart)
 * - hover and touch tooltips with units (ECharts, confined to the canvas)
 * - series visibility toggles through the legend, plus a compact time-range
 *   filter for long historical series
 * - an accessible description, a semantic data table as the text alternative,
 *   keyboard-operable tabs, and CSV download with attribution
 * - explicit source notes with verification status and access dates
 */
export function ChartPanel({
  spec,
  locale,
  sources,
  figureIndex,
}: {
  spec: ChartSpec;
  locale: Locale;
  sources: SourceRecord[];
  figureIndex: number;
}) {
  const t = getUI(locale).chart;
  const [rangeFrom, setRangeFrom] = useState<number | undefined>(undefined);
  const figureLabel = `${t.figurePrefix} ${figureIndex}`;
  const hasRangeFilter = spec.rangeFilter === true && spec.years.length > 40;

  const showRange = (from?: number) => {
    setRangeFrom(from);
  };

  return (
    <figure
      id={`figure-${spec.id}`}
      className="my-8 scroll-mt-24 rounded-xl border border-border bg-surface p-4 sm:p-6"
    >
      <figcaption className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
          {figureLabel}
        </p>
        <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-heading sm:text-lg">
          {spec.title[locale]}
        </h3>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {spec.description[locale]}
        </p>
      </figcaption>

      <Tabs defaultValue="chart">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {hasRangeFilter ? (
            <div
              role="group"
              aria-label={t.period}
              className="inline-flex rounded-lg border border-border bg-block/60 p-0.5"
            >
              <button
                type="button"
                onClick={() => showRange(undefined)}
                aria-pressed={rangeFrom === undefined}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                  rangeFrom === undefined ? "bg-teal text-[#0F141A]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.allYears}
              </button>
              {RANGE_STEPS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => showRange(year)}
                  aria-pressed={rangeFrom === year}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    rangeFrom === year ? "bg-teal text-[#0F141A]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {locale === "ja" ? `${year}年以降` : t.fromYear.replace("{year}", String(year))}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <TabsList className="bg-block/60">
            <TabsTrigger value="chart">{t.chart}</TabsTrigger>
            <TabsTrigger value="table">{t.table}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chart" className="mt-0">
          <ChartView
            spec={spec}
            locale={locale}
            range={rangeFrom ? { fromYear: rangeFrom } : undefined}
            ariaLabel={`${spec.title[locale]} — ${spec.description[locale]}`}
          />
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {t.touchHint}
            {spec.series.length > 1 ? ` ／ ${t.legendHint}` : ""}
          </p>
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <ChartTable spec={spec} locale={locale} figureLabel={figureLabel} />
        </TabsContent>
      </Tabs>

      <Separator className="my-4" />

      <div className="flex flex-col gap-3">
        {spec.projectionFromYear !== undefined ? (
          <p className="rounded-md border border-sand/30 bg-sand/10 px-3 py-2 text-[11.5px] leading-relaxed text-sand">
            {t.projectionNote}
            {locale === "ja" ? `（この図では${spec.projectionFromYear}年以降）` : ` (from ${spec.projectionFromYear} in this figure)`}
          </p>
        ) : null}
        {spec.note ? (
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">
            <strong className="font-medium text-foreground/90">{t.note}:</strong>{" "}
            {spec.note[locale]}
          </p>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {sources.length > 1 ? t.sources : t.source}
            </h4>
            <ul className="mt-1 flex flex-col gap-1">
              {sources.map((s) => (
                <li key={s.id} className="text-[11px] leading-relaxed">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal/90 underline decoration-teal/40 underline-offset-2 hover:text-teal"
                  >
                    {s.organization[locale]}
                    {" — "}
                    {s.displayTitle[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {spec.csv !== false ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadCsv(spec, locale, sources, "2026-10-22")}
              className="shrink-0 border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              {t.downloadCsv}
            </Button>
          ) : null}
        </div>
      </div>
    </figure>
  );
}
