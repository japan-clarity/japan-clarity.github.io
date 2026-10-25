import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";
import { allSources } from "@/chapters/registry";
import { isLocale, localePath, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { ReadingSection } from "@/components/shared/reading-section";
import { formatDate } from "@/lib/visualization/format";
import type { VerificationStatus } from "@/lib/research/types";

interface PageParams {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: "ja" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const ui = getUI(locale).sources;
  return {
    title: ui.title,
    description: ui.lead,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/sources/`,
      languages: {
        "ja-JP": `${siteConfig.siteUrl}/ja/sources/`,
        en: `${siteConfig.siteUrl}/en/sources/`,
      },
    },
  };
}

const VERIFICATION_TONE: Record<VerificationStatus, string> = {
  "verified-primary": "border-teal/40 bg-teal/10 text-teal",
  "verified-secondary": "border-teal/40 bg-teal/10 text-teal",
  derived: "border-bluegrey/40 bg-bluegrey/10 text-bluegrey",
  provisional: "border-sand/40 bg-sand/10 text-sand",
  unverified: "border-border bg-surface text-muted-foreground",
};

export default async function SourcesPage({ params }: PageParams) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ja") as Locale;
  const ui = getUI(locale);
  const t = ui.sources;
  const grouped = allSources();
  const v = ui.verification;

  return (
    <div>
      <header className="border-b border-border bg-block/60">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
            {ui.nav.sources}
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold leading-snug text-heading sm:text-3xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-3xl text-[13.5px] leading-relaxed text-foreground/85">{t.lead}</p>
        </div>
      </header>

      <ReadingSection
        id="evidence-policy"
        title={t.evidencePolicyTitle}
        locale={locale}
      >
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.evidencePolicyBody}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          {ui.footer.lastVerified}: {formatDate(siteConfig.researchVerifiedDate, locale)}
        </p>
      </ReadingSection>

      {grouped.map(({ chapter, sources }) => (
        <ReadingSection
          key={chapter.slug}
          id={`sources-${chapter.slug}`}
          title={`${chapter.number} — ${chapter.title[locale]}`}
          locale={locale}
          variant="raised"
          eyebrow={t.chapterScope}
        >
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="jc-data-table w-full min-w-[760px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="px-3 py-3 text-left font-medium">{t.organization}</th>
                  <th scope="col" className="px-3 py-3 text-left font-medium">{t.document}</th>
                  <th scope="col" className="px-3 py-3 text-left font-medium">{t.reference}</th>
                  <th scope="col" className="px-3 py-3 text-left font-medium">{t.accessed}</th>
                  <th scope="col" className="px-3 py-3 text-left font-medium">{t.verification}</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 align-top last:border-0">
                    <td className="px-3 py-3 leading-relaxed">{s.organization[locale]}</td>
                    <th scope="row" className="px-3 py-3 text-left font-normal">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-teal underline decoration-teal/40 underline-offset-2"
                      >
                        {s.displayTitle[locale]}
                        <ExternalLink className="ml-1 inline h-3 w-3 align-[-1px]" aria-hidden />
                      </a>
                      <span className="mt-1 block max-w-md text-[10.5px] leading-relaxed text-muted-foreground">
                        {s.limitations[locale]}
                      </span>
                    </th>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{s.referencePeriod}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {formatDate(s.accessDate, locale)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${VERIFICATION_TONE[s.verification]}`}
                      >
                        {v[s.verification]}
                      </span>
                      <span className="mt-1 block text-[10.5px] leading-relaxed text-muted-foreground">
                        {s.license[locale]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReadingSection>
      ))}

      <ReadingSection id="how-to-read" title={locale === "ja" ? "この表の読み方" : "Reading this table"} locale={locale}>
        <ul className="reading-prose text-[13px] text-foreground/85">
          <li>
            {locale === "ja"
              ? "「検証」は、原典の文書内に引用数値が存在することを実際に確認したかどうかを示します（HTTPステータスではありません）。"
              : "\"Verification\" indicates that the cited figure was literally found inside the original document — not merely that the URL responded."}
          </li>
          <li>
            {locale === "ja"
              ? "各出典の統計上の定義・対象期間・限界は、出典行の注記と各章の「限界と留意点」に記載しています。"
              : "Definitions, reference periods, and limitations for each source appear in the row notes and in each chapter's limitations section."}
          </li>
          <li>
            {locale === "ja"
              ? "検証作業の記録（抽出スクリプト・アンカー照合）はリポジトリの research/ フォルダで確認できます。"
              : "The verification pipeline (extraction scripts and anchor checks) is available in the repository's research/ folder."}
          </li>
        </ul>
      </ReadingSection>
    </div>
  );
}
