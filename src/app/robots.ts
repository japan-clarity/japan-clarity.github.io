import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** robots.txt — allow crawling; no analytics or tracking exists. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
