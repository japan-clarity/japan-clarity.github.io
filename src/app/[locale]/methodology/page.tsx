import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getUI } from "@/lib/i18n/dictionary";
import { ReadingSection } from "@/components/shared/reading-section";

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
  const ui = getUI(locale).methodology;
  return {
    title: ui.title,
    description: ui.lead,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/methodology/`,
      languages: {
        "ja-JP": `${siteConfig.siteUrl}/ja/methodology/`,
        en: `${siteConfig.siteUrl}/en/methodology/`,
      },
    },
  };
}

const DATA_SOURCES = [
  {
    name: { ja: "政府統計の総合窓口 e-Stat", en: "e-Stat (Portal Site of Official Statistics)" },
    url: "https://www.e-stat.go.jp/en",
    desc: { ja: "日本の官公庁統計の検索・取得", en: "Search and access point for Japanese government statistics" },
  },
  {
    name: { ja: "総務省統計局", en: "Statistics Bureau, MIC" },
    url: "https://www.stat.go.jp/english/",
    desc: { ja: "国勢調査・人口推計ほか", en: "Census, population estimates, and more" },
  },
  {
    name: { ja: "国立社会保障・人口問題研究所（IPSS）", en: "National Institute of Population and Social Security Research" },
    url: "https://www.ipss.go.jp/index-e.asp",
    desc: { ja: "人口・世帯の将来推計", en: "Population and household projections" },
  },
  {
    name: { ja: "厚生労働省（MHLW）", en: "Ministry of Health, Labour and Welfare" },
    url: "https://www.mhlw.go.jp/english/",
    desc: { ja: "人口動態統計・生命表", en: "Vital statistics and life tables" },
  },
  {
    name: { ja: "世界銀行 Open Data（WDI）", en: "World Bank Open Data (WDI)" },
    url: "https://data.worldbank.org/",
    desc: { ja: "国際比較指標（CC BY 4.0）", en: "International comparison indicators (CC BY 4.0)" },
  },
  {
    name: { ja: "OECD Data", en: "OECD Data" },
    url: "https://data.oecd.org/",
    desc: { ja: "加盟国比較・社会指標", en: "Member-country social indicators" },
  },
];

export default async function MethodologyPage({ params }: PageParams) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ja") as Locale;
  const ui = getUI(locale);
  const t = ui.methodology;
  const approach = ui.approach;

  const steps = [
    { label: approach.observe, desc: approach.observeDesc },
    { label: approach.verify, desc: approach.verifyDesc },
    { label: approach.compare, desc: approach.compareDesc },
    { label: approach.investigate, desc: approach.investigateDesc },
    { label: approach.evaluate, desc: approach.evaluateDesc },
    { label: approach.act, desc: approach.actDesc },
  ];

  const verificationClasses: Array<{ key: string; label: string; desc: { ja: string; en: string } }> = [
    {
      key: "verified-primary",
      label: ui.verification["verified-primary"],
      desc: {
        ja: "原典（発行機関の公式ページ・PDF・データセット）を取得し、引用した数値が文書内に実際に存在することを確認した状態。生資料は開発環境の証拠アーカイブに保管。",
        en: "The original document (official page, PDF, or dataset) was fetched and the cited figure was literally found inside it. Raw copies are archived in the development evidence store.",
      },
    },
    {
      key: "verified-secondary",
      label: ui.verification["verified-secondary"],
      desc: {
        ja: "世界銀行WDIなど、手法が文書化された権威ある二次編集資料で検証した状態。API応答をそのまま保管。",
        en: "Verified through an authoritative, methodologically documented secondary compilation such as World Bank WDI. API responses are archived verbatim.",
      },
    },
    {
      key: "derived",
      label: ui.verification.derived,
      desc: {
        ja: "検証済みデータから本サイトが算出した値（構成比など）。算出方法を出典記録の方法注記に明記。",
        en: "Values computed by this site from verified data (e.g., shares); the derivation is documented in the source record's methodology notes.",
      },
    },
    {
      key: "provisional",
      label: ui.verification.provisional,
      desc: {
        ja: "公式だが暫定・概数の数値。確定値の公表後に更新する。",
        en: "Official but provisional/flash figures, to be updated when final counts are published.",
      },
    },
    {
      key: "unverified",
      label: ui.verification.unverified,
      desc: {
        ja: "検証が完了していないため、公開コンテンツでは使用しない（出典一覧の開示専用）。",
        en: "Not used in published content; appears only as explicit disclosure in the source register.",
      },
    },
  ];

  return (
    <div>
      <header className="border-b border-border bg-gradient-to-b from-[#131A22] to-[#0F141A]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
            {ui.nav.methodology}
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold leading-snug text-heading sm:text-3xl">
            {t.title}
          </h1>
          <p className="mt-4 text-[13.5px] leading-relaxed text-foreground/85">{t.lead}</p>
        </div>
      </header>

      <ReadingSection id="steps" title={t.stepsTitle} locale={locale}>
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.stepsLead}</p>
        <ol className="mt-6 grid gap-3">
          {steps.map((step, i) => (
            <li key={step.label} className="flex gap-4 rounded-xl border border-border bg-surface/60 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal/40 bg-teal/10 font-mono text-xs text-teal">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-heading">{step.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </ReadingSection>

      <ReadingSection id="provenance" title={t.provenanceTitle} locale={locale} variant="raised">
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.provenanceLead}</p>
        <ul className="reading-prose mt-5 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[13px] text-foreground/85 sm:grid-cols-2">
          {t.provenanceFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {ui.sources.evidencePolicyBody}
        </p>
      </ReadingSection>

      <ReadingSection id="verification" title={t.verificationTitle} locale={locale}>
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.verificationLead}</p>
        <ul className="mt-5 grid gap-3">
          {verificationClasses.map((v) => (
            <li key={v.key} className="rounded-lg border border-border bg-surface/60 p-4">
              <p className="text-xs font-semibold text-heading">{v.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.desc[locale]}</p>
            </li>
          ))}
        </ul>
      </ReadingSection>

      <ReadingSection id="integrity" title={t.integrityTitle} locale={locale} variant="raised">
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.integrityLead}</p>
        <ul className="reading-prose mt-4 text-[13px] text-foreground/85">
          {t.integrityNever.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ReadingSection>

      <ReadingSection id="spreadsheet" title={t.spreadsheetTitle} locale={locale}>
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.spreadsheetLead}</p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {locale === "ja"
            ? "実際の適用例：第01章のデータ抽出スクリプト（research/chapter01/scripts/）は、和暦・西暦の混在する公式統計表を解析し、41個以上のアンカー値（例：2025年出生数67万1270人）を原典と照合しています。"
            : "Applied in practice: the Chapter 01 extraction pipeline (research/chapter01/scripts/) parses official tables mixing Japanese-era and western years and validates 40+ anchor values (e.g., 671,270 births in 2025) against the source documents."}
        </p>
      </ReadingSection>

      <ReadingSection id="comparison" title={t.comparisonTitle} locale={locale} variant="raised">
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.comparisonLead}</p>
      </ReadingSection>

      <ReadingSection id="sources" title={t.dataSourcesTitle} locale={locale}>
        <p className="text-[13.5px] leading-relaxed text-foreground/85">{t.dataSourcesLead}</p>
        <ul className="mt-5 grid gap-2.5">
          {DATA_SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-3 rounded-lg border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-teal/50"
              >
                <span>
                  <span className="text-[13px] font-medium text-heading">{s.name[locale]}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">{s.desc[locale]}</span>
                </span>
                <span className="text-[11px] text-teal">{s.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
              </a>
            </li>
          ))}
        </ul>
      </ReadingSection>
    </div>
  );
}
