import type { L10n } from "@/lib/research/types";
import type { Locale } from "./locales";

/**
 * The complete bilingual UI dictionary. Japanese and English must carry
 * equivalent keys — the type system enforces parity, and
 * `scripts/validate-research.ts` double-checks it at runtime.
 */
export interface UIDictionary {
  nav: {
    home: string;
    overview: string;
    methodology: string;
    sources: string;
    chapters: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
    switchLanguage: string;
  };
  common: {
    backToTop: string;
    copyLink: string;
    copied: string;
    accessDate: string;
    lastUpdated: string;
    publishedOn: string;
    readChapter: string;
    viewAllChapters: string;
    status: string;
    missingValue: string;
  };
  status: {
    published: string;
    publishedLimited: string;
    inProgress: string;
    planned: string;
  };
  verification: {
    "verified-primary": string;
    "verified-secondary": string;
    derived: string;
    provisional: string;
    unverified: string;
  };
  chart: {
    chart: string;
    table: string;
    viewAsChart: string;
    viewAsTable: string;
    loading: string;
    touchHint: string;
    legendHint: string;
    downloadCsv: string;
    source: string;
    sources: string;
    note: string;
    unit: string;
    year: string;
    period: string;
    allYears: string;
    fromYear: string;
    projectionNote: string;
    missingValue: string;
    figurePrefix: string;
  };
  home: {
    kicker: string;
    heroLead: string;
    ctaRead: string;
    ctaMethod: string;
    publishedNow: string;
    chaptersPublished: string;
    sparkCaption: string;
    sparkSource: string;
    approachTitle: string;
    approachLead: string;
    principlesTitle: string;
    principlesQuote: string;
    chaptersTitle: string;
    chaptersLead: string;
    exploreEvidence: string;
  };
  approach: {
    observe: string;
    observeDesc: string;
    verify: string;
    verifyDesc: string;
    compare: string;
    compareDesc: string;
    investigate: string;
    investigateDesc: string;
    evaluate: string;
    evaluateDesc: string;
    act: string;
    actDesc: string;
  };
  overview: {
    title: string;
    lead: string;
    tableTitle: string;
    tableChapter: string;
    tableDimension: string;
    tableStatus: string;
    tableFocus: string;
    statusLegend: string;
    statusLegendLead: string;
    statusLegendPublished: string;
    statusLegendLimited: string;
    statusLegendInProgress: string;
    statusLegendPlanned: string;
    sequenceNote: string;
    howWeResearch: string;
    howWeResearchLead: string;
    goMethodology: string;
  };
  methodology: {
    title: string;
    lead: string;
    stepsTitle: string;
    stepsLead: string;
    provenanceTitle: string;
    provenanceLead: string;
    provenanceFields: string[];
    verificationTitle: string;
    verificationLead: string;
    integrityTitle: string;
    integrityLead: string;
    integrityNever: string[];
    spreadsheetTitle: string;
    spreadsheetLead: string;
    comparisonTitle: string;
    comparisonLead: string;
    dataSourcesTitle: string;
    dataSourcesLead: string;
  };
  sources: {
    title: string;
    lead: string;
    id: string;
    organization: string;
    document: string;
    language: string;
    published: string;
    reference: string;
    accessed: string;
    verification: string;
    license: string;
    limitations: string;
    evidencePolicyTitle: string;
    evidencePolicyBody: string;
    chapterScope: string;
    allChapters: string;
  };
  chapter: {
    chapterNumber: string;
    inThisChapter: string;
    notPublishedTitle: string;
    notPublishedBody: string;
    plannedFocus: string;
    inProgressTitle: string;
    inProgressBody: string;
    actionTitle: string;
    limitationsTitle: string;
    sourcesTitle: string;
    previous: string;
    next: string;
    backToOverview: string;
    chartSrLabel: string;
  };
  callout: {
    observation: string;
    comparison: string;
    interpretation: string;
    uncertainty: string;
    action: string;
    note: string;
  };
  footer: {
    disclaimerTitle: string;
    disclaimerBody: string;
    licenseNote: string;
    repository: string;
    copyright: string;
    lastVerified: string;
    notAffiliated: string;
  };
  notFound: {
    title: string;
    body: string;
    goHome: string;
  };
}

const t = (ja: string, en: string): L10n => ({ ja, en });

export const ui: Record<Locale, UIDictionary> = {
  ja: {
    nav: {
      home: "ホーム",
      overview: "研究の概要",
      methodology: "調査方法",
      sources: "データと出典",
      chapters: "14章の一覧",
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる",
      skipToContent: "本文へスキップ",
      switchLanguage: "言語の切り替え",
    },
    common: {
      backToTop: "上へ戻る",
      copyLink: "このセクションへのリンクをコピー",
      copied: "コピーしました",
      accessDate: "取得日",
      lastUpdated: "最終更新",
      publishedOn: "公開",
      readChapter: "この章を読む",
      viewAllChapters: "14章の一覧を見る",
      status: "公開状態",
      missingValue: "公表値なし",
    },
    status: {
      published: "公開（検証済み）",
      publishedLimited: "公開（限界事項あり）",
      inProgress: "調査中",
      planned: "計画中",
    },
    verification: {
      "verified-primary": "原典で検証済み",
      "verified-secondary": "権威ある二次資料で検証済み",
      derived: "検証済みデータから算出",
      provisional: "暫定値（改訂の可能性あり）",
      unverified: "未検証",
    },
    chart: {
      chart: "グラフ",
      table: "表",
      viewAsChart: "グラフで見る",
      viewAsTable: "表で見る",
      loading: "グラフを準備しています…",
      touchHint: "グラフ上でホバー（またはタップ・ドラッグ）すると数値を確認できます",
      legendHint: "凡例の項目をクリックすると系列の表示／非表示を切り替えられます",
      downloadCsv: "CSVをダウンロード",
      source: "出典",
      sources: "出典",
      note: "注記",
      unit: "単位",
      year: "年",
      period: "期間",
      allYears: "全期間",
      fromYear: "…年以降",
      projectionNote: "推計開始年以降の値は将来推計（シナリオ）であり、実測値ではありません",
      missingValue: "公表値なし",
      figurePrefix: "図",
    },
    home: {
      kicker: "独立・非営利・党派に偏らない調査研究プラットフォーム",
      heroLead:
        "ジャパン・クラリティは、日本社会の到達点と構造的な課題、長期的な変化と不確実性、そして建設的な改善の機会を、信頼できる証拠・歴史的文脈・透明な統計手法・国際比較を通じて読み解く、14領域の調査研究プラットフォームです。",
      ctaRead: "第01章「人口・家族」を読む",
      ctaMethod: "調査方法を確認する",
      publishedNow: "現在公開中",
      chaptersPublished: "章（全14章）",
      sparkCaption: "日本の総人口の推移（国勢調査 1920–2025）",
      sparkSource: "出典：総務省統計局「国勢調査」（1920年から5年ごと、2025年は確報値）",
      approachTitle: "健康診断のように、社会を調べる",
      approachLead:
        "医師が検査値を確認し、強みと異常を見極め、可能な説明を検討し、不確実性を認めたうえで対応を探すように、私たちは社会の状態を段階的に調べます。国や人々を「欠陥」として扱うのではなく、理解してから判断します。",
      principlesTitle: "4つの原則",
      principlesQuote:
        "判断する前に理解する。結論を出す前に検証する。選び抜かずに比較する。集団に責任を負わせずに改善を探す。",
      chaptersTitle: "14の調査領域",
      chaptersLead:
        "第01章「人口・家族」から順に、出典で検証した調査研究のみを公開します。未公開の章は、現状を明示したうえで「計画中」として表示されます。",
      exploreEvidence: "証拠と出典を見る",
    },
    approach: {
      observe: "観測",
      observeDesc: "測定可能な状態と歴史的な推移を、数値として記述します。",
      verify: "検証",
      verifyDesc: "原典・定義・単位・対象期間・改訂状況を確認します。",
      compare: "比較",
      compareDesc: "手法が整合する国・地域と比較し、文脈を加えます。",
      investigate: "調査",
      investigateDesc: "相関と因果を区別しながら、説明を検討します。",
      evaluate: "評価",
      evaluateDesc: "取り組み得る対応と、その不確実性を評価します。",
      act: "行動",
      actDesc: "個人・地域・専門職・制度が関与できる現実的な行動を整理します。",
    },
    overview: {
      title: "研究の概要",
      lead:
        "このプラットフォームは、日本社会を14の領域で調査します。各章は「観測→検証→比較→調査→評価→行動」の過程をたどり、強みと課題の両方を同じ厳密さで扱います。",
      tableTitle: "14の調査領域と進捗",
      tableChapter: "章",
      tableDimension: "領域",
      tableStatus: "状態",
      tableFocus: "主な論点",
      statusLegend: "公開状態の凡例",
      statusLegendLead:
        "公開状態は、検証の進捗に応じてのみ更新されます。見た目を整えるために未検証の内容を公開することはありません。",
      statusLegendPublished:
        "文書化した範囲内で検証が完了し、本文・図表・出典が揃った状態で公開しています。",
      statusLegendLimited:
        "本文と図表を公開していますが、一部の系列に暫定値・二次資料・推計への依存など、明示された限界が残ります。第01章が現在この状態です。",
      statusLegendInProgress:
        "出典の検証と文章化が進行中です。検証済みの断片のみを公開する場合があります。",
      statusLegendPlanned:
        "調査設計（対象範囲・論点）は決まっていますが、検証済みの本文はまだ公開していません。",
      sequenceNote:
        "章は公開順（第01章から）に並んでいます。2026年10月時点で公開中は第01章のみで、以降は準備が整い次第、順次公開します。",
      howWeResearch: "証拠の扱い方",
      howWeResearchLead:
        "数値は原典で検証したもののみ掲載し、出典・対象期間・定義・限界を明示します。将来推計は推計として明示し、実測値と混ぜて表示しません。",
      goMethodology: "調査方法の詳細を見る",
    },
    methodology: {
      title: "調査方法",
      lead:
        "ジャパン・クラリティのすべての章は、同じ証拠に基づく過程「観測→検証→比較→調査→評価→行動」に従います。このページでは、その実践方法と、決して破らない原則を公開します。",
      stepsTitle: "6つの過程",
      stepsLead: "すべての章は、次の過程をたどって執筆・公開されます。",
      provenanceTitle: "出典・データの管理",
      provenanceLead:
        "サイト内で使用する実質的なデータには、構造化された出典記録を付与します。記録には少なくとも以下の項目を含めます。",
      provenanceFields: [
        "一意の出典ID",
        "公表機関",
        "原典の正式名称",
        "文書・データセットへの直接URL",
        "原典の言語",
        "公表日",
        "対象期間（データの帰属する期間）",
        "取得日",
        "地理的対象範囲",
        "人口・世帯などの定義",
        "統計単位",
        "方法上の注記",
        "データの版",
        "検証状態",
        "ライセンス・再利用条件",
        "既知の限界",
        "証拠資料の保管場所",
      ],
      verificationTitle: "検証状態の分類",
      verificationLead:
        "データは、HTTPステータスではなく「文書の中に引用した数値が実際に存在し、意味が確認できたか」で分類します。",
      integrityTitle: "リサーチ・インテグリティ",
      integrityLead: "このプラットフォームは、次のことを決して行いません。",
      integrityNever: [
        "数値の捏造",
        "出典・文献の捏造",
        "予測を実測として提示",
        "方法上の違い（定義・単位・暦年・届出基準など）の隠蔽",
        "相関を因果として扱うこと",
        "比較国の恣意的選択",
        "別の指標への無断のすり替え",
        "欠損値の隠蔽",
        "未検証データの検証済み扱い",
        "国際ランキングで国や社会の価値を断定すること",
      ],
      spreadsheetTitle: "表計算・統計表の抽出ルール",
      spreadsheetLead:
        "XLSX・CSV・統計表から数値を転記する際は、項目名・列位置・単位の桁・届出基準と発生基準の別・暦年の取り扱い・複数シート・欠損値・丸め精度を確認し、複数の値を目視で検証します。公表値との不一致を見つけた場合は、解析ミスの可能性を排除してから、相違報告として整理します。",
      comparisonTitle: "国際比較の原則",
      comparisonLead:
        "国際比較は文脈のためであり、扇動的な順位表ではありません。指標ごとに定義・単位・対象年・年齢範囲・価格調整・制度上の違いを確認し、実測値と推計値を区別して表示します。同じ比較国セットを全指標に機械的に使い回すことはしません。",
      dataSourcesTitle: "主なデータソース",
      dataSourcesLead:
        "日本の官公庁統計（e-Stat、総務省統計局、国立社会保障・人口問題研究所、厚生労働省ほか）を原則として原典から取得し、国際比較にはWorld Bank Open Data（CC BY 4.0）など出典と手法が明確な機関のデータを使用します。",
    },
    sources: {
      title: "データと出典",
      lead:
        "本サイトで使用するすべての実質的なデータには、構造化された出典記録を付与し、このページで一覧を公開します。出典の原文は各機関のページから直接確認できます。",
      id: "ID",
      organization: "機関",
      document: "文書・データセット",
      language: "言語",
      published: "公表",
      reference: "対象期間",
      accessed: "取得",
      verification: "検証",
      license: "ライセンス",
      limitations: "限界・注記",
      evidencePolicyTitle: "証拠資料の保管について",
      evidencePolicyBody:
        "検証作業で取得した生の証拠資料（原文HTML・PDF、API応答）のうち、World Bank APIの応答（CC BY 4.0）はリポジトリ内に保管しています。日本の官公庁資料は再配布条件を確認したうえで、要約・引用・リンクを公開し、生資料の保管は開発環境の証拠アーカイブで行います。",
      chapterScope: "利用章",
      allChapters: "全章",
    },
    chapter: {
      chapterNumber: "第{n}章",
      inThisChapter: "この章の構成",
      notPublishedTitle: "この章はまだ公開されていません",
      notPublishedBody:
        "調査の設計は完了していますが、出典で検証された調査研究が揃っていないため、本文は公開していません。虚構の数値や引用で見た目を整えることはしません。",
      plannedFocus: "この章で予定している論点",
      inProgressTitle: "この章は調査中です",
      inProgressBody: "現在、出典の検証と文章化を進めています。",
      actionTitle: "証拠から行動へ",
      limitationsTitle: "限界と留意点",
      sourcesTitle: "この章の出典",
      previous: "前の章",
      next: "次の章",
      backToOverview: "研究の概要に戻る",
      chartSrLabel: "図表",
    },
    callout: {
      observation: "観測",
      comparison: "比較",
      interpretation: "解釈",
      uncertainty: "不確実性",
      action: "行動",
      note: "定義・注記",
    },
    footer: {
      disclaimerTitle: "独立したプロジェクトであること",
      disclaimerBody:
        "本プロジェクトは、透明な調査研究と国際比較を通じて日本の社会状況を検証する、独立・非営利・党派に偏らない教育プロジェクトです。本ウェブサイトで参照している政党・政府機関・支援組織その他の団体と、提携・協賛・承認の関係にはありません。調査結果は、それぞれの出典の定義・限界・不確実性および入手可能性に従うものです。外部組織への言及は推奨を意味しません。第三者の資料は、それぞれの帰属表示およびライセンス条件に従います。",
      licenseNote:
        "データの再利用条件は出典ごとに異なります。本サイトの図表からダウンロードできるCSVには帰属情報を付していますが、再利用の際は各出典の表記条件をご確認ください。",
      repository: "GitHubリポジトリ",
      copyright: "© 2026 Japan Clarity（ジャパン・クラリティ）プロジェクト",
      lastVerified: "調査データの最終検証日",
      notAffiliated:
        "日本国政府・地方公共団体・政党・大学・研究機関等の公式サイト・関連団体ではありません。",
    },
    notFound: {
      title: "ページが見つかりません",
      body:
        "お探しのページは存在しないか、移動された可能性があります。以下から主要なページに移動できます。",
      goHome: "ホームへ戻る",
    },
  },
  en: {
    nav: {
      home: "Home",
      overview: "Research Overview",
      methodology: "Methodology",
      sources: "Data & Sources",
      chapters: "All 14 chapters",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      skipToContent: "Skip to content",
      switchLanguage: "Switch language",
    },
    common: {
      backToTop: "Back to top",
      copyLink: "Copy link to this section",
      copied: "Copied",
      accessDate: "Accessed",
      lastUpdated: "Last updated",
      publishedOn: "Published",
      readChapter: "Read this chapter",
      viewAllChapters: "Browse all 14 chapters",
      status: "Status",
      missingValue: "No published value",
    },
    status: {
      published: "Published (verified)",
      publishedLimited: "Published (with limitations)",
      inProgress: "Research in progress",
      planned: "Planned",
    },
    verification: {
      "verified-primary": "Verified at the original source",
      "verified-secondary": "Verified via an authoritative secondary source",
      derived: "Derived from verified data",
      provisional: "Provisional (subject to revision)",
      unverified: "Not yet verified",
    },
    chart: {
      chart: "Chart",
      table: "Table",
      viewAsChart: "View as chart",
      viewAsTable: "View as table",
      loading: "Preparing the chart…",
      touchHint: "Hover (or tap and drag) on the chart to inspect values",
      legendHint: "Click legend items to show or hide series",
      downloadCsv: "Download CSV",
      source: "Source",
      sources: "Sources",
      note: "Note",
      unit: "Unit",
      year: "Year",
      period: "Period",
      allYears: "All years",
      fromYear: "From {year}",
      projectionNote:
        "Values from the projection start year are projections (scenarios), not observations",
      missingValue: "No published value",
      figurePrefix: "Figure",
    },
    home: {
      kicker: "An independent, non-commercial, nonpartisan research platform",
      heroLead:
        "Japan Clarity is a 14-dimension research platform that reads Japan's achievements, structural challenges, long-term changes, uncertainties, and opportunities for constructive improvement through reliable evidence, historical context, transparent statistical methods, and international comparison.",
      ctaRead: "Read Chapter 01 — Population & Family",
      ctaMethod: "See how we research",
      publishedNow: "Now published",
      chaptersPublished: "of 14 chapters",
      sparkCaption: "Japan's total population (Population Census, 1920–2025)",
      sparkSource:
        "Source: Statistics Bureau of Japan, Population Census (quinquennial from 1920; 2025 = final basic count)",
      approachTitle: "Like a medical examination, for a society",
      approachLead:
        "Just as a careful physician reviews measurements, identifies strengths and abnormalities, weighs possible explanations, acknowledges uncertainty, and explores responses, we examine social conditions step by step — understanding before judging, never treating a country or its people as inherently defective.",
      principlesTitle: "Four principles",
      principlesQuote:
        "Understand before judging. Verify before concluding. Compare without cherry-picking. Improve without assigning collective blame.",
      chaptersTitle: "14 research dimensions",
      chaptersLead:
        "Starting with Chapter 01 — Population & Family, only research verified against original sources is published. Unpublished chapters are honestly labeled as planned.",
      exploreEvidence: "Explore the evidence and sources",
    },
    approach: {
      observe: "Observe",
      observeDesc: "Describe measurable conditions and historical trends.",
      verify: "Verify",
      verifyDesc: "Confirm original sources, definitions, units, periods, and revisions.",
      compare: "Compare",
      compareDesc: "Add context through methodologically compatible comparisons.",
      investigate: "Investigate",
      investigateDesc: "Weigh explanations, separating correlation from causation.",
      evaluate: "Evaluate",
      evaluateDesc: "Assess possible responses and their uncertainties.",
      act: "Act",
      actDesc:
        "Identify realistic actions for individuals, communities, professionals, and institutions.",
    },
    overview: {
      title: "Research Overview",
      lead:
        "This platform examines Japanese society across 14 dimensions. Every chapter follows the same evidence process — Observe → Verify → Compare → Investigate → Evaluate → Act — and treats achievements and challenges with equal rigor.",
      tableTitle: "The 14 research dimensions and their status",
      tableChapter: "Chapter",
      tableDimension: "Dimension",
      tableStatus: "Status",
      tableFocus: "Main focus",
      statusLegend: "Status legend",
      statusLegendLead:
        "Publication status changes only when verification progresses. We never publish unverified content for the sake of visual completeness.",
      statusLegendPublished:
        "Published with verification complete within the documented scope: text, figures, and provenance are all in place.",
      statusLegendLimited:
        "Text and figures are published, but some series still depend on provisional figures, secondary sources, or projections — all disclosed. Chapter 01 is currently in this state.",
      statusLegendInProgress:
        "Source verification and drafting are underway; only verified fragments may be published.",
      statusLegendPlanned:
        "The research design (scope and focus) is fixed, but no verified main text has been published yet.",
      sequenceNote:
        "Chapters are ordered by publication sequence (from Chapter 01). As of October 2026 only Chapter 01 is published; later chapters follow as their evidence is verified.",
      howWeResearch: "How evidence is handled",
      howWeResearchLead:
        "Only figures verified against original sources are shown, always with source, reference period, definitions, and limitations. Projections are labeled as projections and never mixed with observations.",
      goMethodology: "Read the full methodology",
    },
    methodology: {
      title: "Methodology",
      lead:
        "Every Japan Clarity chapter follows the same evidence process: Observe → Verify → Compare → Investigate → Evaluate → Act. This page documents how that is practiced — and the rules we never break.",
      stepsTitle: "The six steps",
      stepsLead: "Each chapter is written and published through the following stages.",
      provenanceTitle: "Source provenance",
      provenanceLead:
        "Every substantive dataset used on this site carries a structured provenance record containing at least the following fields.",
      provenanceFields: [
        "Unique source identifier",
        "Publishing organization",
        "Original title",
        "Direct document or dataset URL",
        "Language of the original source",
        "Publication date",
        "Reference period",
        "Access date",
        "Geographic coverage",
        "Population and household definitions",
        "Statistical unit",
        "Methodological notes",
        "Data version",
        "Verification status",
        "Reuse and licensing conditions",
        "Known limitations",
        "Location of archived evidence",
      ],
      verificationTitle: "Verification classifications",
      verificationLead:
        "Data is classified by whether the cited figure was actually found and understood inside the source document — never by HTTP status codes.",
      integrityTitle: "Research integrity",
      integrityLead: "This platform never:",
      integrityNever: [
        "Fabricates numerical values",
        "Invents citations or publications",
        "Presents forecasts as observations",
        "Hides methodological differences (definitions, units, calendar years, reporting bases)",
        "Treats correlation as causation",
        "Cherry-picks comparison countries",
        "Substitutes a different indicator without disclosure",
        "Hides missing data",
        "Labels unverified data as verified",
        "Uses international rankings to pronounce on a country's or society's worth",
      ],
      spreadsheetTitle: "Spreadsheet and table extraction rules",
      spreadsheetLead:
        "When transferring figures from XLSX/CSV/statistical tables, we confirm headers, column positions, unit scales, occurrence-vs-registration reporting bases, calendar-year conventions, multiple worksheets, missing values, and rounding precision, and manually validate several observations. Any discrepancy is checked for parsing errors first, then documented as a discrepancy report separating numerical errors from explained methodological differences.",
      comparisonTitle: "International comparison principles",
      comparisonLead:
        "Comparisons provide context, not sensationalized rankings. For each indicator we verify definitions, units, reference years, age ranges, price adjustments, and institutional differences, and distinguish observed from projected values. The same country set is never reused mechanically for every indicator.",
      dataSourcesTitle: "Primary data sources",
      dataSourcesLead:
        "Japanese government statistics (e-Stat, Statistics Bureau of Japan, IPSS, MHLW, and other ministries) are taken from original publications wherever possible; international comparisons use sources with documented methodology such as World Bank Open Data (CC BY 4.0).",
    },
    sources: {
      title: "Data & Sources",
      lead:
        "Every substantive dataset used on this site carries a structured provenance record, listed on this page. Originals can be checked directly at each publisher's page.",
      id: "ID",
      organization: "Organization",
      document: "Document / dataset",
      language: "Language",
      published: "Published",
      reference: "Reference period",
      accessed: "Accessed",
      verification: "Verification",
      license: "License",
      limitations: "Limitations / notes",
      evidencePolicyTitle: "How evidence is archived",
      evidencePolicyBody:
        "Of the raw evidence gathered during verification (source HTML/PDF, API responses), World Bank API responses (CC BY 4.0) are archived in the repository. For Japanese government materials, after checking redistribution terms we publish summaries, quotations, and links, while raw copies are preserved in the development evidence archive.",
      chapterScope: "Used by",
      allChapters: "All chapters",
    },
    chapter: {
      chapterNumber: "Chapter {n}",
      inThisChapter: "In this chapter",
      notPublishedTitle: "This chapter is not yet published",
      notPublishedBody:
        "The research design is complete, but because verified evidence has not yet been assembled, the main text is not published. We do not pad pages with invented figures or citations.",
      plannedFocus: "Planned focus areas",
      inProgressTitle: "This chapter is in progress",
      inProgressBody: "Source verification and drafting are underway.",
      actionTitle: "From evidence to action",
      limitationsTitle: "Limitations and caveats",
      sourcesTitle: "Sources for this chapter",
      previous: "Previous chapter",
      next: "Next chapter",
      backToOverview: "Back to the research overview",
      chartSrLabel: "Figure",
    },
    callout: {
      observation: "Observation",
      comparison: "Comparison",
      interpretation: "Interpretation",
      uncertainty: "Uncertainty",
      action: "Action",
      note: "Definition & notes",
    },
    footer: {
      disclaimerTitle: "An independent project",
      disclaimerBody:
        "This is an independent, non-commercial, nonpartisan, evidence-based educational project examining Japan's societal conditions through transparent research and international comparison. The project is not affiliated with, sponsored by, or endorsed by any political party, government agency, advocacy organization, or other institution referenced on this website. Research findings are subject to the definitions, limitations, uncertainties, and availability of their underlying sources. References to external organizations do not imply endorsement. Third-party materials remain subject to their respective attribution and licensing requirements.",
      licenseNote:
        "Reuse conditions vary by source. CSV files downloadable from our figures include attribution, but please check each source's terms before reuse.",
      repository: "GitHub repository",
      copyright: "© 2026 The Japan Clarity project",
      lastVerified: "Research evidence last verified",
      notAffiliated:
        "Not an official or affiliated site of any government, political party, university, or research institution.",
    },
    notFound: {
      title: "Page not found",
      body:
        "The page you are looking for does not exist or may have moved. You can return to the main pages below.",
      goHome: "Back to home",
    },
  },
};

/** Helper: pick the localized half of an L10n object. */
export function l10n(text: L10n | undefined, locale: Locale): string {
  return text ? text[locale] : "";
}

/** Get the UI dictionary for a locale. */
export function getUI(locale: Locale): UIDictionary {
  return ui[locale];
}
