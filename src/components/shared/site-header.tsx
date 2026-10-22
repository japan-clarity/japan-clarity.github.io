"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoMark, Wordmark } from "@/components/shared/logo";
import { LanguageSwitch } from "@/components/shared/language-switch";
import { chapters } from "@/config/chapters";
import { localePath, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { StatusBadge } from "@/components/shared/status-badge";

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "text-heading"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}/`;
  const [open, setOpen] = useState(false);
  const ui = getUI(locale);
  const t = ui.nav;

  const isActive = (path: string) => pathname === path;

  const primary = [
    { href: localePath(locale), label: t.home },
    { href: localePath(locale, "overview"), label: t.overview },
    { href: localePath(locale, "methodology"), label: t.methodology },
    { href: localePath(locale, "sources"), label: t.sources },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#0F141A]/90 backdrop-blur supports-[backdrop-filter]:bg-[#0F141A]/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href={localePath(locale)}
          className="flex items-center gap-2.5 rounded-md py-1"
          aria-label={siteBrand(locale)}
        >
          <LogoMark className="h-9 w-9 shrink-0" />
          <Wordmark locale={locale} />
        </Link>

        <nav aria-label="primary" className="ml-auto hidden items-center gap-1 lg:flex">
          {primary.map((item) => (
            <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
              {item.label}
            </NavLink>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <BookOpen className="h-4 w-4" aria-hidden />
                {t.chapters}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="max-h-[70vh] w-[340px] overflow-y-auto border-border bg-popover"
            >
              <div className="grid grid-cols-2 gap-0.5 p-1">
                {chapters.map((ch) => (
                  <DropdownMenuItem key={ch.slug} asChild>
                    <Link
                      href={localePath(locale, `chapters/${ch.slug}`)}
                      className="flex items-start gap-2 rounded-md p-2"
                    >
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {ch.number}
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-xs leading-tight text-foreground">
                          {ch.title[locale]}
                        </span>
                        <StatusBadge status={ch.status} locale={locale} />
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-2">
            <LanguageSwitch locale={locale} compact />
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <LanguageSwitch locale={locale} compact />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={open ? t.closeMenu : t.openMenu}
                className="text-muted-foreground"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[290px] border-border bg-[#0F141A] p-0"
            >
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle className="text-left font-serif text-sm text-heading">
                  {t.chapters}
                </SheetTitle>
              </SheetHeader>
              <div className="flex h-[calc(100%-64px)] flex-col overflow-y-auto px-5 py-4">
                <nav aria-label="primary" className="flex flex-col gap-1">
                  {primary.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-md px-3 py-2.5 text-sm ${
                        isActive(item.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <h2 className="mb-2 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.chapters}
                </h2>
                <ul className="mb-4 flex flex-col">
                  {chapters.map((ch) => (
                    <li key={ch.slug}>
                      <Link
                        href={localePath(locale, `chapters/${ch.slug}`)}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent/60"
                      >
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {ch.number}
                        </span>
                        <span className="flex-1">{ch.title[locale]}</span>
                        <StatusBadge status={ch.status} locale={locale} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function siteBrand(locale: Locale): string {
  return locale === "ja" ? "ジャパン・クラリティ ホーム" : "Japan Clarity home";
}
