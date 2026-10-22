import Link from "next/link";
import { localePath, locales, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";

/**
 * Locale-scoped 404 page. In static export, the post-export script also
 * writes a standalone bilingual `out/404.html` for URLs outside the locale
 * trees.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      {locales.map((code) => {
        const locale = code as Locale;
        const t = getUI(locale).notFound;
        return (
          <div key={code} className={code === "ja" ? "" : "mt-8 border-t border-border pt-8"}>
            <h1 className="font-serif text-xl font-semibold text-heading">{t.title}</h1>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted-foreground">{t.body}</p>
            <Link
              href={localePath(locale)}
              className="mt-4 inline-flex rounded-lg border border-teal/50 bg-teal/10 px-4 py-2 text-xs font-medium text-teal hover:bg-teal/20"
            >
              {t.goHome}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
