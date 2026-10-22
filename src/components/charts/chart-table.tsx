import type { ChartSpec } from "@/lib/research/types";
import type { Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { formatValue } from "@/lib/visualization/format";

/**
 * Accessible data table — the text alternative for every chart and the
 * "View as Table" mode. Semantic markup: caption, scoped headers, tabular
 * numerals, sticky header inside a scroll region.
 */
export function ChartTable({
  spec,
  locale,
  figureLabel,
}: {
  spec: ChartSpec;
  locale: Locale;
  figureLabel: string;
}) {
  const t = getUI(locale).chart;
  const categoryLabel = (index: number): string => {
    if (spec.categories && spec.categories[index]) {
      return spec.categories[index][locale];
    }
    const y = spec.years[index];
    return typeof y === "number" ? String(y) : y;
  };

  return (
    <div
      className="max-h-[520px] overflow-auto rounded-lg border border-border"
      role="region"
      aria-label={`${figureLabel}: ${spec.title[locale]}`}
    >
      <table className="jc-data-table w-full border-collapse text-xs">
        <caption className="sr-only">
          {figureLabel}: {spec.title[locale]} ({spec.unit[locale]})
        </caption>
        <thead className="sticky top-0 z-10 bg-surface">
          <tr className="border-b border-border">
            <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-left font-medium">
              {spec.categories ? t.period : t.year}
            </th>
            {spec.series.map((s) => (
              <th key={s.key} scope="col" className="whitespace-nowrap px-3 py-2.5 text-right font-medium">
                {s.name[locale]}
                <span className="ml-1 font-normal text-muted-foreground">({spec.unit[locale]})</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.years.map((_, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0">
              <th scope="row" className="whitespace-nowrap px-3 py-2 text-left font-normal text-muted-foreground">
                {categoryLabel(i)}
              </th>
              {spec.series.map((s) => {
                const v = s.values[i];
                return (
                  <td key={s.key} className="num whitespace-nowrap px-3 py-2 text-foreground">
                    {v === null || v === undefined ? (
                      <span className="text-muted-foreground">{t.missingValue}</span>
                    ) : (
                      formatValue(v, spec.valueKind, locale)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
