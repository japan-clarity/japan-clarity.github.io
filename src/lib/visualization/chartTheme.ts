import type { Locale } from "@/lib/i18n/locales";
import type { ChartSpec } from "@/lib/research/types";
import { formatValue, formatYearLabel } from "./format";

/**
 * Shared ECharts option builder for Japan Clarity.
 *
 * Design rules (specification section 13, museum light theme):
 * - muted, politically neutral chart colors on paper-white panels; never
 *   color alone (tables, line styles and markers provide alternatives)
 * - axis tooltips with units, confine within the canvas (mobile safe)
 * - no data smoothing: straight segments, symbols visible on sparse series
 * - projections render as dashed lines
 *
 * This module is imported by client components only; it produces plain
 * option objects (formatters are closures, never serialized).
 */

/**
 * Muted series palette for the light (paper) theme — celadon, kuchiba gold,
 * blue-grey, russet and light celadon. Every color clears WCAG 1.4.11
 * 3:1 against the #FFFCF7 paper panel background (see
 * docs/MUSEUM-LIGHT-THEME.md for the contrast table).
 */
export const seriesPalette = [
  "#4E685E", // interactive celadon (primary series)
  "#96784A", // kuchiba gold (chart strength)
  "#6C7B8B", // muted blue grey
  "#9C5F50", // muted russet
  "#7B948C", // decorative light celadon
  "#7A7265", // warm olive grey
  "#8C8274", // warm stone grey
] as const;

export const axisLabelColor = "#5C5A57";
export const splitLineColor = "#E7DED1";
export const axisLineColor = "#CFC6B8";
export const tooltipBg = "#2B2B2B";
export const tooltipBorder = "#5C5A57";
export const tooltipTextColor = "#F6F2EA";

export interface RangeFilter {
  fromYear?: number;
}

/**
 * Build a complete ECharts option object for a chart spec.
 * `locale` drives series names, unit labels and number formatting.
 */
export function buildChartOption(
  spec: ChartSpec,
  locale: Locale,
  range?: RangeFilter,
): Record<string, unknown> {
  const unitText = spec.unit[locale];
  const multiSeries = spec.series.length > 1;
  const horizontal = spec.horizontal === true;
  const isBar = spec.series.some((s) => s.kind === "bar");
  const rateLike =
    spec.valueKind === "float1" ||
    spec.valueKind === "float2" ||
    spec.valueKind === "percent1";

  const categoryData = spec.categories
    ? spec.categories.map((c) => c[locale])
    : spec.years.map((y) => String(y));
  const rangeStart = range?.fromYear;

  const valueFormatter = (value: number): string =>
    Number.isFinite(value) ? formatValue(value, spec.valueKind, locale) : "–";
  const series = spec.series.map((s, index) => {
    const color = seriesPalette[(s.colorIndex ?? index) % seriesPalette.length];
    const kind = s.kind ?? "line";
    const base: Record<string, unknown> = {
      name: s.name[locale],
      data: s.values,
      emphasis: { focus: "series" },
      animationDuration: 420,
      z: kind === "line" ? 3 : 2,
    };
    if (kind === "bar") {
      return {
        ...base,
        type: "bar",
        itemStyle: { color, borderRadius: [3, 3, 0, 0] },
        barMaxWidth: 26,
      };
    }
    return {
      ...base,
      type: "line",
      ...(s.stack ? { stack: s.stack } : {}),
      ...(kind === "area"
        ? { areaStyle: { color, opacity: 0.14 }, stack: s.stack ?? "total" }
        : {}),
      lineStyle: {
        width: 2,
        color,
        type: s.dashed ? "dashed" : "solid",
      },
      itemStyle: { color, borderColor: "#FFFCF7", borderWidth: 1 },
      symbol: "circle",
      symbolSize: spec.years.length <= 32 ? 6 : 0,
      showSymbol: spec.years.length <= 32,
      connectNulls: false,
    };
  });

  const categoryAxis = {
    type: "category",
    data: categoryData,
    axisLine: { lineStyle: { color: axisLineColor } },
    axisTick: { show: false },
    axisLabel: {
      color: axisLabelColor,
      hideOverlap: true,
      ...(horizontal
        ? { width: 92, overflow: "truncate" }
        : { interval: "auto" }),
    },
    ...(horizontal ? {} : { boundaryGap: isBar }),
    ...(rangeStart !== undefined && !horizontal
      ? { min: String(rangeStart) }
      : {}),
  };

  const valueAxis = {
    type: "value",
    name: spec.yLabel ? spec.yLabel[locale] : unitText,
    nameTextStyle: { color: axisLabelColor, align: "right" },
    nameGap: 16,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: axisLabelColor,
      formatter: (value: number) => formatValue(value, spec.valueKind, locale),
    },
    splitLine: { lineStyle: { color: splitLineColor } },
    // Rates and shares must not imply a false zero baseline.
    scale: rateLike,
    min: (value: { min: number }) =>
      rateLike ? Math.floor(value.min * 10) / 10 : undefined,
    minInterval: spec.valueKind === "float2" ? 0.2 : undefined,
  };

  return {
    animation: true,
    backgroundColor: "transparent",
    color: spec.series.map(
      (s, i) => seriesPalette[(s.colorIndex ?? i) % seriesPalette.length],
    ),
    grid: {
      left: 8,
      right: 18,
      top: multiSeries ? 40 : 24,
      bottom: 6,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: tooltipTextColor, fontSize: 12.5 },
      ...(isBar ? { axisPointer: { type: "shadow" } } : {}),
      valueFormatter,
      formatter: undefined,
      order: "valueAsc",
    },
    ...(multiSeries
      ? {
          legend: {
            show: true,
            top: 2,
            left: 4,
            right: 4,
            itemGap: 18,
            icon: "roundRect",
            itemWidth: 14,
            itemHeight: 6,
            textStyle: { color: "#5C5A57", fontSize: 12 },
            inactiveColor: "#CFC6B8",
            type: "scroll",
            pageIconColor: "#4E685E",
            pageTextStyle: { color: "#5C5A57" },
          },
        }
      : {}),
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    series,
  };
}

/** Tooltip title (year label) formatter closure helper for custom renderers. */
export function tooltipYearTitle(year: number, locale: Locale): string {
  return formatYearLabel(year, locale);
}
