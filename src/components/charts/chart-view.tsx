"use client";

import { useEffect, useRef, useState } from "react";
import type { EChartsType } from "echarts/core";
import type { ChartSpec } from "@/lib/research/types";
import type { Locale } from "@/lib/i18n/locales";
import { buildChartOption, type RangeFilter } from "@/lib/visualization/chartTheme";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ECharts view — the rendering half of the chart framework.
 *
 * Reliability rules (specification section 13):
 * - The echarts bundle is imported lazily so static-export pages stay light.
 * - Init/dispose are strictly paired; the ResizeObserver keeps the canvas
 *   correct across viewport and container changes.
 * - The parent re-mounts this component whenever the chart view becomes
 *   visible again (Radix Tabs unmount inactive content), so returning from
 *   the table view always produces a fully re-rendered chart — the
 *   chart → table → chart restoration requirement.
 * - The canvas uses `touch-action: pan-y`, so mobile tooltips work while the
 *   page keeps scrolling vertically.
 */
export function ChartView({
  spec,
  locale,
  range,
  ariaLabel,
}: {
  spec: ChartSpec;
  locale: Locale;
  range?: RangeFilter;
  ariaLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType | null>(null);
  const [loading, setLoading] = useState(true);

  // Mount: lazy-load echarts, register modules, init, observe resize.
  useEffect(() => {
    let disposed = false;
    let observer: ResizeObserver | null = null;
    let onWindowResize: (() => void) | null = null;

    (async () => {
      const echarts = await import("echarts/core");
      const [
        { LineChart, BarChart },
        { GridComponent, LegendComponent, TooltipComponent, DataZoomComponent },
        { CanvasRenderer },
      ] = await Promise.all([
        import("echarts/charts"),
        import("echarts/components"),
        import("echarts/renderers"),
      ]);
      echarts.use([
        LineChart,
        BarChart,
        GridComponent,
        LegendComponent,
        TooltipComponent,
        DataZoomComponent,
        CanvasRenderer,
      ]);
      if (disposed || !containerRef.current) return;
      chartRef.current = echarts.init(containerRef.current);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const option = buildChartOption(spec, locale, range);
      option.animation = !reduceMotion;
      chartRef.current.setOption(option);
      observer = new ResizeObserver(() => chartRef.current?.resize());
      observer.observe(containerRef.current);
      onWindowResize = () => chartRef.current?.resize();
      window.addEventListener("resize", onWindowResize);
      setLoading(false);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      if (onWindowResize) window.removeEventListener("resize", onWindowResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  // Locale or range changes: rebuild the option in place (no re-init).
  useEffect(() => {
    if (!chartRef.current || loading) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const option = buildChartOption(spec, locale, range);
    option.animation = !reduceMotion;
    chartRef.current.setOption(option, { notMerge: true });
  }, [spec, locale, range, loading]);

  const heightClass = spec.horizontal
    ? "h-[460px] sm:h-[520px]"
    : "h-[320px] sm:h-[380px] lg:h-[410px]";

  return (
    <div className="relative">
      {loading ? (
        <div className={`absolute inset-0 z-10 flex items-center justify-center ${heightClass}`}>
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      ) : null}
      <div
        ref={containerRef}
        role="img"
        aria-label={ariaLabel}
        className={`jc-chart-canvas w-full ${heightClass}`}
      />
    </div>
  );
}
