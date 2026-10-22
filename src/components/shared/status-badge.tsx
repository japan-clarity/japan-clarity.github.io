import type { Locale } from "@/lib/i18n/locales";
import type { ChapterStatus } from "@/lib/research/types";
import { getUI } from "@/lib/i18n/dictionary";

/** Publication status chip rendered consistently across the site. */
export function StatusBadge({
  status,
  locale,
}: {
  status: ChapterStatus;
  locale: Locale;
}) {
  const t = getUI(locale).status;
  const label =
    status === "published"
      ? t.published
      : status === "published-limited"
        ? t.publishedLimited
        : status === "in-progress"
          ? t.inProgress
          : t.planned;
  const tone =
    status === "published" || status === "published-limited"
      ? "border-teal/40 bg-teal/10 text-teal"
      : status === "in-progress"
        ? "border-sand/40 bg-sand/10 text-sand"
        : "border-border bg-surface text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 py-px text-[10px] leading-4 font-medium ${tone}`}
    >
      {label}
    </span>
  );
}
