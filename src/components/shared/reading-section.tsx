import type { ReactNode } from "react";
import { CopyLinkButton } from "@/components/shared/copy-link-button";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Visually separated reading block (specification section 6): alternating
 * dark surfaces, numbered section headers with copy-link anchors,
 * generous but balanced spacing.
 */
export function ReadingSection({
  id,
  title,
  eyebrow,
  children,
  locale,
  variant = "base",
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  locale: Locale;
  variant?: "base" | "raised";
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-24 border-t border-border first:border-t-0 ${
        variant === "raised" ? "bg-block/40" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
                {eyebrow}
              </p>
            ) : null}
            <h2 id={`${id}-heading`} className="font-serif text-xl font-semibold leading-snug text-heading sm:text-2xl">
              {title}
            </h2>
          </div>
          <CopyLinkButton anchor={id} locale={locale} className="mt-1 shrink-0" />
        </div>
        {children}
      </div>
    </section>
  );
}
