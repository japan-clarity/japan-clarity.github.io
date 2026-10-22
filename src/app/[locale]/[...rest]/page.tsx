import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";

/**
 * Locale-tree catch-all: any unmatched path under /ja/… or /en/… renders the
 * bilingual not-found page (which keeps the header/footer layout) instead of
 * the framework default.
 *
 * Static export generates `/ja/not-found/` and `/en/not-found/` (rendering
 * the localized 404 content); all other unknown paths simply do not exist as
 * files on GitHub Pages, which serves the standalone `404.html` written by
 * scripts/post-export.ts. In development the catch-all matches any unknown
 * locale-tree path and renders the bilingual 404 directly.
 */
export function generateStaticParams() {
  return [
    { locale: "ja", rest: ["not-found"] },
    { locale: "en", rest: ["not-found"] },
  ];
}

export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  notFound();
}
