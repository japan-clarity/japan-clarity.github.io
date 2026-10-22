"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUI } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Copy-link control for section anchors. Falls back to a hidden input +
 * execCommand when the async clipboard API is unavailable (static export,
 * older browsers). Shows inline feedback instead of toasts.
 */
export function CopyLinkButton({
  anchor,
  locale,
  className = "",
}: {
  anchor: string;
  locale: Locale;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const t = getUI(locale).common;

  const onCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${anchor}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onCopy}
      aria-label={copied ? t.copied : t.copyLink}
      title={t.copyLink}
      className={`h-7 w-7 text-muted-foreground hover:bg-accent hover:text-teal ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-teal" aria-hidden /> : <Link2 className="h-3.5 w-3.5" aria-hidden />}
      <span aria-live="polite" className="sr-only">{copied ? t.copied : ""}</span>
    </Button>
  );
}
