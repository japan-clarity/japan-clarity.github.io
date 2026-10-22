/**
 * Central site configuration for Japan Clarity.
 *
 * The GitHub Organization and repository were created by the project owner:
 *   https://github.com/japan-clarity/japan-clarity.github.io
 *
 * `siteUrl` reflects the deterministic GitHub Pages URL for an Organization
 * Pages repository of that exact name. Deployment has NOT yet been verified —
 * if the site is ever served from a different origin, override
 * `NEXT_PUBLIC_SITE_URL` at build time.
 *
 * The prospective domain `japan-clarity.com` has NOT been purchased. No CNAME
 * and no custom-domain configuration exist in this repository.
 */
export const siteConfig = {
  brand: {
    en: "Japan Clarity",
    ja: "ジャパン・クラリティ",
  },
  tagline: {
    en: "Understanding Japan through Data and Evidence",
    ja: "データと根拠から、日本を理解する。",
  },
  repository: "https://github.com/japan-clarity/japan-clarity.github.io",
  organization: "japan-clarity",
  repositoryName: "japan-clarity.github.io",
  /** Intended production origin (configurable, see header comment). */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://japan-clarity.github.io")
    .replace(/\/$/, ""),
  /** Date on which the currently published research evidence was verified. */
  researchVerifiedDate: "2026-10-22",
  /** Project identity line for metadata. */
  description: {
    en: "An independent, non-commercial, nonpartisan research platform examining Japan's society through evidence, international comparisons, interactive data, and constructive individual action.",
    ja: "独立・非営利・党派に偏らない調査研究プラットフォーム。データと根拠、国際比較、インタラクティブな可視化を通じて、日本社会の実像と建設的な行動を探ります。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
