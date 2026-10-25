import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locales";
import type { CalloutKind } from "@/chapters/types";
import { getUI } from "@/lib/i18n/dictionary";

const KIND_STYLE: Record<CalloutKind, { border: string; label: string }> = {
  observation: { border: "border-l-teal", label: "text-teal" },
  comparison: { border: "border-l-bluegrey", label: "text-bluegrey" },
  interpretation: { border: "border-l-sand", label: "text-sand" },
  uncertainty: { border: "border-l-[#A99B87]", label: "text-[#6B655C]" },
  action: { border: "border-l-teal", label: "text-teal" },
  note: { border: "border-l-border", label: "text-muted-foreground" },
};

/**
 * Labeled callout blocks distinguishing observations, comparisons,
 * interpretations, uncertainty, action, and definitional notes
 * (specification sections 6 and 9) — by text label AND a left accent,
 * never color alone.
 */
export function Callout({
  kind,
  title,
  children,
  locale,
}: {
  kind: CalloutKind;
  title?: string;
  children: ReactNode;
  locale: Locale;
}) {
  const label = getUI(locale).callout[kind];
  const style = KIND_STYLE[kind];
  return (
    <aside
      className={`my-5 rounded-r-lg border border-l-4 border-border bg-block/50 px-5 py-4 ${style.border}`}
    >
      <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${style.label}`}>
        {label}
        {title ? <span className="ml-2 tracking-normal normal-case">— {title}</span> : null}
      </p>
      <div className="text-[13.5px] leading-relaxed text-foreground/90">{children}</div>
    </aside>
  );
}
