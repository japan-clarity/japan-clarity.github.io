import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { chapters } from "@/config/chapters";
import { locales } from "@/lib/i18n/locales";

/** Static sitemap covering both locales and every chapter page. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;
  const lastModified = new Date("2026-10-22");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${base}/${locale}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "ja-JP": `${base}/ja/`,
          en: `${base}/en/`,
        },
      },
    });
    for (const path of ["overview", "methodology", "sources"]) {
      entries.push({
        url: `${base}/${locale}/${path}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    for (const chapter of chapters) {
      entries.push({
        url: `${base}/${locale}/chapters/${chapter.slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: chapter.status === "planned" ? 0.3 : 0.9,
      });
    }
  }
  return entries;
}
