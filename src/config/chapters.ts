import type { ChapterStatus, L10n } from "@/lib/research/types";

/**
 * The 14 research dimensions (specification section 8), in publication order.
 * Chapter 01 is the current substantive chapter; the remaining chapters are
 * published as clearly-labeled placeholders until their evidence is verified.
 */
export interface ChapterMeta {
  /** Zero-padded chapter number, e.g. "01". */
  number: string;
  /** URL slug (locale-independent). */
  slug: string;
  /** Research dimension names. */
  title: L10n;
  /** One-paragraph scope description used on overview + placeholder pages. */
  scope: L10n;
  /** Bullet list of planned research topics (from the specification). */
  focus: { ja: string[]; en: string[] };
  status: ChapterStatus;
}

export const chapters: ChapterMeta[] = [
  {
    number: "01",
    slug: "population-family",
    title: { ja: "人口・家族", en: "Population & Family" },
    scope: {
      ja: "出生力、人口の高齢化、世帯構成、家族形成、人口移動、地域間の人口差、そして長期の人口推計を扱います。",
      en: "Fertility, population aging, household composition, family formation, migration, regional demographic differences, and long-term population projections.",
    },
    focus: {
      ja: [
        "人口の長期的な推移（国勢調査と人口推計）",
        "出生数・死亡数・自然増減",
        "合計特殊出生率（TFR）の推移と国際比較",
        "高齢化の進展（65歳以上・75歳以上人口の割合）",
        "年齢構造の変化",
        "世帯と家族の変化（平均世帯人員、一人暮らし世帯、婚姻）",
        "国内人口移動と地域差",
        "将来推計（国立社会保障・人口問題研究所）",
        "平均寿命の推移と国際比較",
        "複数の説明仮説の整理",
        "個人・地域・専門職・制度レベルの行動",
      ],
      en: [
        "Long-term population change (census and estimates)",
        "Births, deaths, and natural increase/decrease",
        "Total fertility rate (TFR): trend and international comparison",
        "Progress of aging (share aged 65+ and 75+)",
        "Changing age structure",
        "Households and family change (average household size, one-person households, marriage)",
        "Internal migration and regional differences",
        "Population projections (IPSS)",
        "Life expectancy: trend and international comparison",
        "Competing explanations",
        "Actions for individuals, communities, professionals, and institutions",
      ],
    },
    status: "published-limited",
  },
  {
    number: "02",
    slug: "economy-industry",
    title: { ja: "経済・産業", en: "Economy & Industry" },
    scope: {
      ja: "経済の生産性、実質賃金、産業構造、イノベーション、中小企業、経済の回復力、長期的な競争力を扱います。",
      en: "Economic productivity, real wages, industrial structure, innovation, small and medium enterprises, economic resilience, and long-term competitiveness.",
    },
    focus: {
      ja: ["生産性と実質賃金の長期推移", "産業構造の変化", "イノベーションと研究開発", "中小企業の役割", "長期的な競争力と回復力"],
      en: ["Productivity and real-wage trends", "Industrial structure change", "Innovation and R&D", "The role of SMEs", "Long-term competitiveness and resilience"],
    },
    status: "planned",
  },
  {
    number: "03",
    slug: "housing-cost-of-living",
    title: { ja: "住宅・生活費", en: "Housing & Cost of Living" },
    scope: {
      ja: "住宅の入手可能性、家賃負担、住宅の質、空き家、地域差、世帯の生活費を扱います。",
      en: "Housing affordability, rental burden, housing quality, vacant homes, regional differences, and household living expenses.",
    },
    focus: {
      ja: ["住宅費の負担", "持ち家・賃貸の構造", "空き家の動向", "地域間の価格差", "家計の支出構造"],
      en: ["Housing cost burden", "Ownership and rental structure", "Vacant housing trends", "Regional price differences", "Household expenditure structure"],
    },
    status: "planned",
  },
  {
    number: "04",
    slug: "labor-working-conditions",
    title: { ja: "労働・就業環境", en: "Labor & Working Conditions" },
    scope: {
      ja: "雇用の質、労働時間、ワークライフバランス、雇用形態、職業の安全、賃金、キャリアの機会を扱います。",
      en: "Employment quality, working hours, work-life balance, employment categories, occupational safety, wages, and career opportunities.",
    },
    focus: {
      ja: ["労働時間と休労", "正規・非正規雇用の構造", "賃金格差", "職業性の安全", "キャリア形成の機会"],
      en: ["Working hours and rest", "Regular and non-regular employment", "Wage disparities", "Occupational safety", "Career development opportunities"],
    },
    status: "planned",
  },
  {
    number: "05",
    slug: "education-talent",
    title: { ja: "教育・人材", en: "Education & Talent" },
    scope: {
      ja: "教育の質と機会、生徒の幸福度、高等教育、職業訓練、デジタルスキル、生涯学習を扱います。",
      en: "Education quality, access, student well-being, higher education, vocational training, digital skills, and lifelong learning.",
    },
    focus: {
      ja: ["学力と教育の質", "教育機会の格差", "生徒の幸福度", "高等教育と職業訓練", "生涯学習とデジタルスキル"],
      en: ["Learning outcomes and quality", "Disparities in access", "Student well-being", "Higher and vocational education", "Lifelong learning and digital skills"],
    },
    status: "planned",
  },
  {
    number: "06",
    slug: "healthcare-wellbeing",
    title: { ja: "医療・健康", en: "Healthcare & Well-being" },
    scope: {
      ja: "平均寿命・健康寿命、予防医療、医療アクセス、メンタルヘルス、医療従事者、地域差を扱います。",
      en: "Life expectancy, healthy life expectancy, preventive healthcare, medical access, mental health, healthcare workforce, and regional disparities.",
    },
    focus: {
      ja: ["平均寿命と健康寿命", "予防医療", "医療アクセスの地域差", "メンタルヘルス", "医療従事者体制"],
      en: ["Life and healthy life expectancy", "Preventive care", "Regional access gaps", "Mental health", "Healthcare workforce"],
    },
    status: "planned",
  },
  {
    number: "07",
    slug: "social-protection-inequality",
    title: { ja: "社会保障・格差", en: "Social Protection & Inequality" },
    scope: {
      ja: "貧困、所得格差、資産分布、年金、介護、障害者支援、世代間の不平等を扱います。",
      en: "Poverty, income inequality, wealth distribution, pensions, long-term care, disability support, and intergenerational inequalities.",
    },
    focus: {
      ja: ["相対的貧困率", "所得・資産の分布", "公的年金の持続性", "介護の需要と供給", "世代間の公平"],
      en: ["Relative poverty rates", "Income and wealth distribution", "Pension sustainability", "Care demand and supply", "Intergenerational fairness"],
    },
    status: "planned",
  },
  {
    number: "08",
    slug: "environment-energy",
    title: { ja: "環境・エネルギー", en: "Environment & Energy" },
    scope: {
      ja: "気候の動向、大気の質、生物多様性、エネルギーの安定性、排出量、環境保護、資源の安全を扱います。",
      en: "Climate trends, air quality, biodiversity, energy reliability, emissions, environmental protection, and resource security.",
    },
    focus: {
      ja: ["気候変動の影響と適応", "再生可能エネルギーの導入", "生物多様性", "廃棄物・資源循環", "エネルギーの安定供給"],
      en: ["Climate impacts and adaptation", "Renewable energy adoption", "Biodiversity", "Waste and circularity", "Energy security"],
    },
    status: "planned",
  },
  {
    number: "09",
    slug: "transportation-urban-development",
    title: { ja: "交通・都市開発", en: "Transportation & Urban Development" },
    scope: {
      ja: "公共交通、歩行者の安全、道路交通安全、都市のアクセシビリティ、地域のモビリティ、地方の生活基盤、都市計画を扱います。",
      en: "Public transportation, pedestrian safety, road safety, urban accessibility, regional mobility, rural infrastructure, and urban planning.",
    },
    focus: {
      ja: ["公共交通の維持可能性", "道路交通の安全", "都市と地方のモビリティ", "コンパクトシティと都市計画", "生活基盤の維持"],
      en: ["Public transport sustainability", "Road safety", "Urban and rural mobility", "Compact-city planning", "Maintaining daily-life infrastructure"],
    },
    status: "planned",
  },
  {
    number: "10",
    slug: "food-systems-agriculture",
    title: { ja: "食料・農業", en: "Food Systems & Agriculture" },
    scope: {
      ja: "食料安全保障、食料価格、農業の持続可能性、栄養、輸入、食品ロス、農村社会を扱います。",
      en: "Food security, food prices, agricultural sustainability, nutritional outcomes, imports, food waste, and rural communities.",
    },
    focus: {
      ja: ["食料自給率と輸入構造", "食料価格の動向", "農業従事者の高齢化", "食品ロス", "栄養と健康"],
      en: ["Food self-sufficiency and imports", "Food price trends", "Aging farm workforce", "Food waste", "Nutrition and health"],
    },
    status: "planned",
  },
  {
    number: "11",
    slug: "technology-digital-society",
    title: { ja: "技術・デジタル社会", en: "Technology & Digital Society" },
    scope: {
      ja: "研究とイノベーション、人工知能、サイバーセキュリティ、デジタル・インクルージョン、データ・ガバナンス、技術の回復力を扱います。",
      en: "Research and innovation, artificial intelligence, cybersecurity, digital inclusion, data governance, and technological resilience.",
    },
    focus: {
      ja: ["研究開発とイノベーション", "AIの社会実装", "サイバーセキュリティ", "デジタル格差", "データ・ガバナンス"],
      en: ["R&D and innovation", "AI in society", "Cybersecurity", "Digital divides", "Data governance"],
    },
    status: "planned",
  },
  {
    number: "12",
    slug: "public-governance-institutions",
    title: { ja: "行政・制度", en: "Public Governance & Institutions" },
    scope: {
      ja: "行政の実効性、公共の透明性、法へのアクセス、制度の説明責任、サービス提供、ガバナンス指標を扱います。",
      en: "Administrative effectiveness, public transparency, legal accessibility, institutional accountability, service delivery, and governance indicators.",
    },
    focus: {
      ja: ["行政サービスの質", "透明性と説明責任", "法制度へのアクセス", "デジタル行政", "統計・公文書の公開"],
      en: ["Quality of administrative services", "Transparency and accountability", "Access to the legal system", "Digital government", "Open statistics and records"],
    },
    status: "planned",
  },
  {
    number: "13",
    slug: "social-relationships-culture",
    title: { ja: "社会関係・文化", en: "Social Relationships & Culture" },
    scope: {
      ja: "社会的信頼、孤独、文化の保全、地域社会、社会参加、世代間関係を扱います。",
      en: "Social trust, loneliness, cultural preservation, local communities, social participation, and intergenerational relationships.",
    },
    focus: {
      ja: ["社会的信頼と孤立", "地域社会の変化", "文化の継承", "社会参加とボランティア", "世代間関係"],
      en: ["Social trust and isolation", "Community change", "Cultural continuity", "Participation and volunteering", "Intergenerational relations"],
    },
    status: "planned",
  },
  {
    number: "14",
    slug: "safety-societal-resilience",
    title: { ja: "安全・社会のレジリエンス", en: "Safety & Societal Resilience" },
    scope: {
      ja: "自然災害、地震・津波への備え、生活基盤の耐性、緊急対応、詐欺防止、サプライチェーン、地域の安全を扱います。",
      en: "Natural disasters, earthquake and tsunami preparedness, infrastructure resilience, emergency response, fraud prevention, supply chains, and community safety.",
    },
    focus: {
      ja: ["災害リスクと備え", "基盤施設の耐性", "緊急対応体制", "詐欺・犯罪の防止", "サプライチェーンの安定"],
      en: ["Disaster risk and preparedness", "Infrastructure resilience", "Emergency response systems", "Fraud and crime prevention", "Supply-chain stability"],
    },
    status: "planned",
  },
];

export function getChapterMeta(slug: string): ChapterMeta | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function chapterUrl(locale: string, slug: string): string {
  return `/${locale}/chapters/${slug}/`;
}
