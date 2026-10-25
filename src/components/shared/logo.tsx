import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Typography-first identity: a restrained, data-inspired abstract mark
 * (three ascending bars inside a rounded square — no national or political
 * symbolism) plus the wordmark. No external font or image assets.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Japan Clarity mark"
      className={className}
      fill="none"
    >
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="7"
        stroke="#A99B87"
        strokeWidth="1.5"
      />
      <line x1="8.5" y1="21.5" x2="8.5" y2="23.5" stroke="#6C7B8B" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="15" y1="16" x2="15" y2="23.5" stroke="#B89A6A" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="21.5" y1="9.5" x2="21.5" y2="23.5" stroke="#4E685E" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ locale }: { locale: Locale }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-serif text-[15px] font-semibold tracking-wide text-heading">
        {locale === "ja" ? siteConfig.brand.ja : siteConfig.brand.en}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {locale === "ja" ? siteConfig.brand.en : siteConfig.brand.ja}
      </span>
    </span>
  );
}
