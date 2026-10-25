import { CENSUS_TOTAL } from "@/chapters/chapter-01/data";
import { formatValue } from "@/lib/visualization/format";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Zero-JS hero visualization: Japan's census population 1920–2025 as an
 * inline SVG, drawn directly from the verified data module. Serves as both
 * a design element and an honest preview of the platform's data.
 */
export function PopulationSparkline({ locale }: { locale: Locale }) {
  const width = 520;
  const height = 200;
  const padding = { top: 14, right: 18, bottom: 22, left: 18 };

  const points = CENSUS_TOTAL.filter(([, v]) => v !== null) as Array<[number, number]>;
  const years = points.map(([y]) => y);
  const values = points.map(([, v]) => v as number);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);

  const x = (year: number) =>
    padding.left +
    ((year - years[0]) / (years[years.length - 1] - years[0])) *
      (width - padding.left - padding.right);
  const y = (value: number) =>
    padding.top +
    (1 - (value - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);

  const linePath = points.map(([yr, v], i) => `${i === 0 ? "M" : "L"}${x(yr).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${x(years[years.length - 1]).toFixed(1)},${height - padding.bottom} L${x(years[0]).toFixed(1)},${height - padding.bottom} Z`;

  const peakIndex = values.indexOf(maxY);
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={
        locale === "ja"
          ? "日本の総人口は1920年の5,596万人から2010年の1億2,806万人でピークに達し、2025年には1億2,297万人へ減少した。"
          : "Japan's total population grew from 55.96 million in 1920 to a peak of 128.06 million in 2010, then declined to 122.97 million by 2025."
      }
    >
      <path d={areaPath} fill="#4E685E" opacity="0.12" />
      <path d={linePath} fill="none" stroke="#4E685E" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx={x(years[peakIndex])} cy={y(maxY)} r="3.4" fill="#96784A" />
      <circle cx={x(last[0])} cy={y(last[1] as number)} r="3.4" fill="#4E685E" />
      <text x={x(years[0])} y={height - 6} textAnchor="start" fontSize="10" fill="#5C5A57">
        1920
      </text>
      <text x={x(years[peakIndex])} y={height - 6} textAnchor="middle" fontSize="10" fill="#735C38">
        {locale === "ja" ? "ピーク 2010" : "peak 2010"}
      </text>
      <text x={width - padding.right} y={height - 6} textAnchor="end" fontSize="10" fill="#5C5A57">
        2025
      </text>
      <text x={x(years[peakIndex])} y={y(maxY) - 8} textAnchor="middle" fontSize="10.5" fill="#735C38">
        {formatValue(maxY, "int", locale)}
      </text>
      <text x={x(last[0]) - 4} y={y(last[1] as number) + 16} textAnchor="end" fontSize="10.5" fill="#4E685E">
        {formatValue(last[1] as number, "int", locale)}
      </text>
    </svg>
  );
}
