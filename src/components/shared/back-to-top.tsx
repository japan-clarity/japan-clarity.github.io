"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUI } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

/** Floating back-to-top control; appears after meaningful scroll. */
export function BackToTop({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = getUI(locale).common.backToTop;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={t}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full border-border bg-surface/95 shadow-lg backdrop-blur hover:bg-accent"
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </Button>
  );
}
