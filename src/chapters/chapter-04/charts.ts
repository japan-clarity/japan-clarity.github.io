import type { ChartSpec } from "@/lib/research/types";
import {
  STATUS_SELFEMPLOYED,
  STATUS_FAMILY,
  STATUS_EMPLOYEE,
  UNEMPLOYMENT_RATE,
  OLDER_EMPRATE_65,
  OLDER_EMPRATE_6064,
  NONREGULAR_SHARE_TOTAL,
  NONREGULAR_SHARE_MALE,
  NONREGULAR_SHARE_FEMALE,
  NONREGULAR_AGE_2025,
  NONREGULAR_REASONS_2025,
  HOURS_TOTAL_30,
  HOURS_TOTAL_5,
  HOURS_OVERTIME_5,
  HOURS_GENERAL,
  HOURS_PARTTIME,
  LEAVE_RATE,
  GENDER_WAGE_RATIO,
  FORM_WAGE_GAP,
  WAGE_CURVE_MALE,
  WAGE_CURVE_FEMALE,
  WAGE_CURVE_AGES,
  ACCIDENT_DEATH,
  ACCIDENT_INJURY,
  MENTAL_CLAIMS,
  MENTAL_DECISIONS,
  MENTAL_GRANTED,
  OECD_HOURS_LATEST,
  OECD_NAMES,
} from "./data";

/**
 * Chapter 04 chart specifications.
 *
 * Every series references the generated verified data module; nothing is
 * hand-entered. Non-regular shares are the LFS's own published rates
 * (非正規 ÷ 役員を除く雇用者). OECD hours carry the OECD's own
 * comparability warning (trend comparison, not level ranking) in the note.
 */

const years = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([y]) => y);
const values = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([, v]) => v);
/** Align a shorter series to a longer axis by padding missing years with null. */
const padTo = (
  axis: ReadonlyArray<[number, number | null]>,
  series: ReadonlyArray<[number, number | null]>,
): Array<number | null> => {
  const m = new Map<number, number | null>(series.map(([y, v]) => [y as number, v as number | null]));
  return axis.map(([y]) => (m.has(y as number) ? m.get(y as number) ?? null : null));
};

export const chapter04Charts: ChartSpec[] = [
  // ----- 1. Employment status composition ----------------------------------
  {
    id: "ch04-employment-status",
    title: {
      ja: "従業上の地位別就業者数の推移（1953–2025年）",
      en: "Employed persons by status in employment (1953–2025)",
    },
    description: {
      ja: "労働力調査（基本集計・年平均）による就業者の内訳。雇用者は1953年の1,660万人から2025年の6,185万人へ3.7倍に増える一方、自営業主は991万人から499万人へ、無給の家族従業者は1,262万人から115万人へと減り続けた。日本の就業構造はこの70年で圧倒的に「雇用者」の構造になった。常雇・臨時雇・日雇の内訳は2017年までの公表。",
      en: "Composition of employment from the Labour Force Survey (basic tabulation, annual averages). Employees grew 3.7× from 16.60 million (1953) to 61.85 million (2025), while the self-employed fell from 9.91 to 4.99 million and unpaid family workers from 12.62 to 1.15 million. Over seventy years Japan's employment became overwhelmingly employee-based. The regular/temporary/daily sub-break was published through 2017.",
    },
    years: years(STATUS_SELFEMPLOYED),
    series: [
      { key: "employee", name: { ja: "雇用者", en: "Employees" }, values: values(STATUS_EMPLOYEE), kind: "area", stack: "status" },
      { key: "self", name: { ja: "自営業主", en: "Self-employed" }, values: values(STATUS_SELFEMPLOYED), kind: "area", stack: "status", colorIndex: 6 },
      { key: "family", name: { ja: "家族従業者", en: "Family workers" }, values: values(STATUS_FAMILY), kind: "area", stack: "status", colorIndex: 8 },
    ],
    unit: { ja: "万人", en: "10k persons" },
    valueKind: "int",
    yLabel: { ja: "万人", en: "10,000 persons" },
    sourceIds: ["estat-lfs-t4-status"],
    note: {
      ja: "年平均。公表表では自営業主＋家族従業者＋雇用者の合計が就業者総数より近年で約30–45万人少ない（役員分類に関わる公表残差）。1973年は沖縄県を含む行を採用。2018年以降の常雇・臨時雇・日雇の区分は廃止。",
      en: "Annual averages. In the published table the three components sum slightly below total employed persons in recent years (residual ≈ 0.3–0.45 million, related to the executive-officer classification). The 1973 row including Okinawa is used. The regular/temporary/daily split was discontinued from 2018.",
    },
    rangeFilter: true,
  },

  // ----- 2. Unemployment rate ----------------------------------------------
  {
    id: "ch04-unemployment-rate",
    title: {
      ja: "完全失業率の推移（1953–2025年）",
      en: "Unemployment rate (1953–2025)",
    },
    description: {
      ja: "労働力調査による完全失業者（調査週間中、仕事がなく求職活動をした者）の労働力人口に占める割合。高度成長期には1%台を維持し、第一次石油危機後の1975年に一時2.0%まで上昇。その後、1990年代後半から2000年代前半の「就職氷河期」に2.5%から急上昇し、2002年に5.4%で頂点を打った。2010年代に緩やかに低下し、2025年は2.5%。2020年のコロナ禍でも3.0%前後に留まった。",
      en: "The share of the labour force without work but actively searching, from the Labour Force Survey. The rate held near 1% through the high-growth era, spiked temporarily to 2.0% after the first oil shock (1975), then climbed through the post-bubble 'employment ice age' to a 5.4% peak in 2002. It eased through the 2010s and stood at 2.5% in 2025 — barely 3% even in the 2020 pandemic year.",
    },
    years: years(UNEMPLOYMENT_RATE),
    series: [
      { key: "rate", name: { ja: "完全失業率", en: "Unemployment rate" }, values: values(UNEMPLOYMENT_RATE), kind: "line" },
    ],
    unit: { ja: "%", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "％", en: "%" },
    sourceIds: ["estat-lfs-t2-main"],
    note: {
      ja: "年平均。完全失業率＝完全失業者÷労働力人口。1995年以前は沖縄復帰（1972年7月）前の値を含む長期接続系列。",
      en: "Annual averages. Rate = unemployed ÷ labour force. Pre-1978 values are the retro-linked long-run series (see the survey's own continuity notes).",
    },
    rangeFilter: true,
  },

  // ----- 3. Older-workers employment rate ----------------------------------
  {
    id: "ch04-older-employment",
    title: {
      ja: "高年齢層の就業率の推移（1968–2025年）",
      en: "Employment rates at older ages (1968–2025)",
    },
    description: {
      ja: "労働力調査による年齢別就業率（人口に対する就業者の割合）。65歳以上の就業率は1968年の33.3%から低下を続け、2011年に19.2%で底を打った後、反転して2025年には26.0%まで戻した。60～64歳では1968年の59.2%から2025年の74.9%へと大きく上昇している。高齢者雇用安定法による65歳までの雇用確保措置（2021年義務化）や年金支給開始年齢の引き上げが背景にあるとされるが、本図はその効果を分離しない。",
      en: "Age-specific employment rates (employed ÷ population) from the Labour Force Survey. The 65+ rate declined steadily from 33.3% (1968) to its 19.2% trough in 2011, then turned and climbed back to 26.0% by 2025. At 60–64 the rate rose steeply from 59.2% (1968) to 74.9% (2025). The stabilization-of-employment measures up to age 65 (mandatory from 2021) and the rising pension-eligibility age are widely cited background factors, but this figure does not isolate their effects.",
    },
    years: years(OLDER_EMPRATE_65),
    series: [
      { key: "r6064", name: { ja: "60～64歳", en: "60–64" }, values: values(OLDER_EMPRATE_6064), kind: "line", colorIndex: 6 },
      { key: "r65", name: { ja: "65歳以上", en: "65 and over" }, values: values(OLDER_EMPRATE_65), kind: "line" },
    ],
    unit: { ja: "%", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "％", en: "%" },
    sourceIds: ["estat-lfs-t3-age"],
    note: {
      ja: "年平均。就業率＝就業者÷各年齢の15歳以上人口（人口推計ベンチマーク）。1968年の65歳以上就業率が高いのは、年金制度が未成熟で自営業比率が高かった時代を反映する。",
      en: "Annual averages. Employment rate = employed ÷ population at each age (population-estimate benchmarks). The high 1968 rate for 65+ reflects an era of immature pensions and heavy self-employment.",
    },
    rangeFilter: true,
  },

  // ----- 4. Non-regular share ----------------------------------------------
  {
    id: "ch04-nonregular-share",
    title: {
      ja: "非正規の職員・従業員の割合の推移（2002–2025年・男女別）",
      en: "Share of non-regular employees (2002–2025, by sex)",
    },
    description: {
      ja: "労働力調査（詳細集計）による、役員を除く雇用者のうち非正規の職員・従業員が占める割合。男女計では2002年の29.4%から上昇を続け、2019年の38.3%で頂点に達した後、緩やかに低下して2025年は36.5%。女性は2002年の49.3%から52.0%へ、男性は15.0%から22.3%へと上昇した。2009年の一時的な低下（33.7%）は、非正規を中心とした雇用調整が起きたためである。",
      en: "The LFS detailed tabulation's share of non-regular staff among employees excluding executive officers. The overall share climbed from 29.4% (2002) to its 38.3% peak in 2019, then eased gently to 36.5% by 2025. Among women it went from 49.3% to 52.0%; among men from 15.0% to 22.3%. The dip to 33.7% in 2009 reflects post-Lehman adjustment concentrated in non-regular jobs.",
    },
    years: years(NONREGULAR_SHARE_TOTAL),
    series: [
      { key: "total", name: { ja: "男女計", en: "Both sexes" }, values: values(NONREGULAR_SHARE_TOTAL), kind: "line" },
      { key: "male", name: { ja: "男性", en: "Men" }, values: values(NONREGULAR_SHARE_MALE), kind: "line", colorIndex: 6 },
      { key: "female", name: { ja: "女性", en: "Women" }, values: values(NONREGULAR_SHARE_FEMALE), kind: "line", colorIndex: 5 },
    ],
    unit: { ja: "%", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "％", en: "%" },
    sourceIds: ["estat-lfs-t10-form"],
    note: {
      ja: "年平均。割合＝非正規の職員・従業員÷役員を除く雇用者（公表値）。「正規・非正規」は雇用形態による区分であり、希望する働き方かどうかを示さない（理由は図6）。統計上、2002年より前の比較可能な系列は公表されていない。",
      en: "Annual averages; published rate = non-regular ÷ employees excluding executives. 'Regular/non-regular' is an employment-form classification — it says nothing about whether the arrangement is desired (see Figure 6). No comparable pre-2002 series is published.",
    },
    rangeFilter: true,
  },

  // ----- 5. Non-regular share by age (2025) --------------------------------
  {
    id: "ch04-nonregular-age",
    title: {
      ja: "年齢階級別 非正規の職員・従業員の割合（2025年平均）",
      en: "Non-regular share by age group (2025 average)",
    },
    description: {
      ja: "2025年の年齢別の非正規割合（役員を除く雇用者比）。15～24歳は52.7%と半数を超え、25～34歳で一度20.7%まで下がり、その後年齢とともに上昇して55～64歳で42.6%、65歳以上では76.1%に達するU字型（     J字型）の分布を示す。若年層は学業との併用、高年層は定年後の再雇用・パート就労が主な要因とされるが、図単体では原因を特定できない。",
      en: "The 2025 age profile of the non-regular share (of employees excluding executives). It exceeds half at 15–24 (52.7%), dips to 20.7% at 25–34, then climbs with age to 42.6% at 55–64 and 76.1% at 65+ — a U/J-shaped distribution. Combining study and work explains much of the young peak, and post-retirement re-employment and part-time work the older one, though the figure alone cannot establish causes.",
    },
    years: NONREGULAR_AGE_2025.map(([k]) => k),
    categories: NONREGULAR_AGE_2025.map(([k]) => ({ ja: k === "65+" ? "65歳以上" : k.replace("-", "～") + "歳", en: k === "65+" ? "65+" : k.replace("-", "–") })),
    series: [
      { key: "share", name: { ja: "非正規の職員・従業員の割合", en: "Non-regular share" }, values: NONREGULAR_AGE_2025.map(([, v]) => v), kind: "bar" },
    ],
    unit: { ja: "%", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "％", en: "%" },
    sourceIds: ["estat-lfs-t10-form"],
    note: {
      ja: "年平均・役員を除く雇用者を分母とする公表割合。15～24歳には在学中の者を含む。",
      en: "Annual averages; published rates over employees excluding executives. Ages 15–24 include students.",
    },
  },

  // ----- 6. Reasons for non-regular work (2025) -----------------------------
  {
    id: "ch04-nonregular-reasons",
    title: {
      ja: "非正規の職員・従業員についた主な理由（2025年平均）",
      en: "Main reasons for current non-regular job (2025 average)",
    },
    description: {
      ja: "労働力調査（2025年平均結果の概要・表Ⅱ-1）による内訳。「自分の都合のよい時間に働きたいから」が36.6%（757万人）と最多で5年連続増加。「家計の補助・学費等を得たいから」17.7%、「家事・育児・介護等と両立しやすいから」10.9%が続く。「正規の職員・従業員の仕事がないから」（いわゆる不本意非正規）は8.4%（173万人）で、男性は13.0%・女性は6.2%と男女で逆転する。合計が100%に満たない分は理由不詳を含む。",
      en: "From the LFS 2025 annual results overview (Table II-1). 'To work hours that suit me' leads at 36.6% (7.57 million), rising for a fifth straight year; 'to supplement household income or tuition' follows at 17.7%, and 'easier to combine with housework, childcare or care' at 10.9%. 'No regular job available' — the involuntarily non-regular — is 8.4% (1.73 million), and reverses by sex: 13.0% of men versus 6.2% of women. The remainder below 100% is unstated reasons.",
    },
    years: NONREGULAR_REASONS_2025.map(([k]) => k),
    categories: NONREGULAR_REASONS_2025.map(([k]) => ({
      ja: k,
      en: ({
        "自分の都合のよい時間に働きたいから": "Want hours that suit me",
        "家計の補助・学費等を得たいから": "Supplement household income/tuition",
        "家事・育児・介護等と両立しやすいから": "Easier to combine with care duties",
        "通勤時間が短いから": "Shorter commute",
        "専門的な技能等をいかせるから": "Can use specialist skills",
        "正規の職員・従業員の仕事がないから": "No regular job available",
        "その他": "Other",
      } as Record<string, string>)[k] ?? k,
    })),
    series: [
      { key: "share", name: { ja: "割合", en: "Share" }, values: NONREGULAR_REASONS_2025.map(([, v]) => v), kind: "bar" },
    ],
    unit: { ja: "%", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "％", en: "%" },
    horizontal: true,
    sourceIds: ["statb-lfs-2025-overview"],
    note: {
      ja: "非正規の職員・従業員（2,128万人）の内訳。割合は理由別合計に占める割合で、総数には「理由不詳」を含むため合計は100%にならない。「正規の職員・従業員の仕事がないから」は比較可能な2014年以降、男性は12年連続減少。",
      en: "Breakdown of the 21.28 million non-regular employees. Shares are of stated reasons; the total includes unstated reasons, so they do not sum to 100%. 'No regular job available' has declined for 12 straight years among men since comparable data began in 2014.",
    },
  },

  // ----- 7. Working hours long run -------------------------------------------
  {
    id: "ch04-hours-longrun",
    title: {
      ja: "総実労働時間の年間推移（1970–2025年・月平均）",
      en: "Total actual working hours per month (1970–2025)",
    },
    description: {
      ja: "毎月勤労統計調査（全国・調査産業計）による月平均の総実労働時間。事業所規模30人以上では1970年の186.6時間から2025年の141.1時間へ、45.5時間（週換算約10時間半）減少した。5人以上では1990年の172.0時間から2025年の135.1時間へ。所定外労働（残業など）は5人以上で1990年の13.0時間から2019年の10.6時間へ減った後、コロナ禍（2020年・9.2時間）を挟んで2025年は9.8時間と低水準で推移している。",
      en: "Monthly average total actual hours from the Monthly Labour Survey (national, all surveyed industries). For establishments with 30+ workers, hours fell from 186.6 (1970) to 141.1 (2025) — 45.5 hours a month, roughly 10.5 a week. For 5+ establishments, from 172.0 (1990) to 135.1 (2025). Overtime at 5+ establishments eased from 13.0 hours (1990) to 10.6 (2019), dipped to 9.2 in the 2020 pandemic, and stood at 9.8 in 2025.",
    },
    years: years(HOURS_TOTAL_30),
    series: [
      { key: "h30", name: { ja: "総実労働時間（30人以上）", en: "Total hours (30+)" }, values: values(HOURS_TOTAL_30), kind: "line" },
      { key: "h5", name: { ja: "総実労働時間（5人以上）", en: "Total hours (5+)" }, values: padTo(HOURS_TOTAL_30, HOURS_TOTAL_5), kind: "line", colorIndex: 5 },
      { key: "ot5", name: { ja: "所定外労働時間（5人以上）", en: "Overtime (5+)" }, values: padTo(HOURS_TOTAL_30, HOURS_OVERTIME_5), kind: "line", colorIndex: 3 },
    ],
    unit: { ja: "時間/月", en: "hours/month" },
    valueKind: "float1",
    yLabel: { ja: "時間／月", en: "hours per month" },
    sourceIds: ["mhlw-mls-longrun"],
    note: {
      ja: "暦年の年平均（月平均）。30人以上は1970年以降、5人以上は1990年以降の公表。所定外には残業のほか休日労働・深夜労働を含む。2018年以降はパート労働者を含む集計方法の変更（不連続）に注意。",
      en: "Calendar-year averages of monthly hours. 30+ published from 1970, 5+ from 1990. Overtime includes holiday and night work. Note the methodological break around 2018 (inclusion of part-time workers in some aggregates).",
    },
    rangeFilter: true,
  },

  // ----- 8. Hours: general vs part-time --------------------------------------
  {
    id: "ch04-hours-parttime",
    title: {
      ja: "一般労働者とパートタイム労働者の実労働時間（1993–2025年・月平均）",
      en: "Actual hours: general vs part-time workers (1993–2025)",
    },
    description: {
      ja: "毎月勤労統計調査による就業形態別の総実労働時間（5人以上）。一般労働者は1993年の170.4時間から2025年の160.5時間へ、パートタイム労働者は98.7時間から79.1時間へと、ともに減少している。パートタイム労働者は5人以上の事業所の労働者のうち31.3%（2025年）を占め、その割合が高まることで全労働者の平均実労働時間（135.1時間）は両者の中間へ引き下げられる。つまり平均の減少には「構成効果」が含まれる。",
      en: "Actual monthly hours by employment type (5+ establishments). General workers fell from 170.4 hours (1993) to 160.5 (2025); part-timers from 98.7 to 79.1. Part-timers now make up 31.3% of workers at 5+ establishments (2025), so the all-worker average (135.1 hours) is pulled toward the part-time level: part of the average's decline is a composition effect, not shorter hours for the same worker.",
    },
    years: years(HOURS_GENERAL),
    series: [
      { key: "general", name: { ja: "一般労働者", en: "General workers" }, values: values(HOURS_GENERAL), kind: "line" },
      { key: "part", name: { ja: "パートタイム労働者", en: "Part-time workers" }, values: values(HOURS_PARTTIME), kind: "line", colorIndex: 5 },
    ],
    unit: { ja: "時間/月", en: "hours/month" },
    valueKind: "float1",
    yLabel: { ja: "時間／月", en: "hours per month" },
    sourceIds: ["mhlw-mls-longrun"],
    note: {
      ja: "年平均（月平均）・5人以上。「一般労働者」はパートタイム労働者（1日または1週の所定労働時間が一般労働者より短い者）以外の労働者。同一労働者の時間変化と労働者構成の変化は区別されない。",
      en: "Annual averages of monthly hours, 5+ establishments. 'General workers' are all workers other than part-timers (whose scheduled hours are shorter). The series does not separate hours change per worker from changes in workforce composition.",
    },
    rangeFilter: true,
  },

  // ----- 9. Paid leave -------------------------------------------------------
  {
    id: "ch04-paid-leave",
    title: {
      ja: "年次有給休暇の取得率の推移（1984–2025年調査）",
      en: "Annual paid-leave acquisition rate (surveys 1984–2025)",
    },
    description: {
      ja: "就労条件総合調査（令和7年調査＝2024年暦年の取得状況）による、労働者1人平均の年次有給休暇取得率（取得日数計÷付与日数計）。1980年代後半から2000年代前半にかけて48%前後で底を這い、2013年の47.1%から上昇に転じて2025年調査の66.9%（付与18.1日・取得12.1日）と昭和59年の調査開始以来最高を更新した。2025年調査では5年連続の上昇。ただし全体の平均であり、産業間の差は大きい（電気・ガス等75.2%に対し宿泊・飲食50.7%）。",
      en: "From the General Survey on Working Conditions (the 2025 round covering calendar-2024 leave): the average acquisition rate (days taken ÷ days granted). It scraped along near 48% from the late 1980s through the early 2000s, turned upward from 47.1% (2013), and reached 66.9% in the 2025 round (18.1 days granted, 12.1 taken) — the highest since the series began in 1984, and a fifth consecutive rise. The average still conceals wide industry gaps: 75.2% in utilities vs 50.7% in accommodation and food services.",
    },
    years: years(LEAVE_RATE),
    series: [
      { key: "rate", name: { ja: "取得率", en: "Acquisition rate" }, values: values(LEAVE_RATE), kind: "line" },
    ],
    unit: { ja: "%", en: "%" },
    valueKind: "float1",
    yLabel: { ja: "％", en: "%" },
    sourceIds: ["mhlw-shugyojoken-r7"],
    note: {
      ja: "調査年の軸。平成13年以降の調査は前年1年間（1月1日時点）の状況で、令和7年調査は2024年暦年。平成11年以前は調査年当年。1989年の調査なし。平成20年と平成27年に調査対象の範囲変更。対象は常用労働者30人以上の民営企業・法人。",
      en: "X-axis is survey year. From 2001 onward surveys cover the previous calendar year (the 2025 round = calendar 2024); through 1999 they covered the survey year itself. No 1989 survey; survey-frame changes in 2008 and 2015. Covers private enterprises/corporations with 30+ regular employees.",
    },
    rangeFilter: true,
  },

  // ----- 10. Wage gaps ---------------------------------------------------------
  {
    id: "ch04-wage-gaps",
    title: {
      ja: "男女間賃金格差と雇用形態間賃金格差の推移（1976–2025年）",
      en: "Gender and employment-form wage ratios (1976–2025)",
    },
    description: {
      ja: "賃金構造基本統計調査（一般労働者・きまって支給する賃金）による2つの格差指標。女性の賃金の対男性比率（男=100）は1976年の58.8から2000年の65.5、2025年の76.6へと48年かけて17.8ポイント改善した。正社員・正職員以外の賃金の対正社員比率（正社員=100）は2005年の60.1から2025年の67.4へ。2つの比率は定義・母集団が異なり、同じ目盛りの上では比較できないが、いずれも「未調整」の格差であり、勤続年数・就業構造の違いを含む。",
      en: "Two gap measures from the Basic Survey on Wage Structure (general workers, scheduled cash earnings). The female-to-male ratio (male=100) improved from 58.8 (1976) to 65.5 (2000) and 76.6 (2025) — 17.8 points over 48 years. The non-regular-to-regular ratio (regular=100) went from 60.1 (2005) to 67.4 (2025). The two ratios differ in definition and population and are not directly comparable on one scale; both are unadjusted gaps that embed differences in tenure and employment structure.",
    },
    years: years(GENDER_WAGE_RATIO),
    series: [
      { key: "gender", name: { ja: "女性／男性（男=100）", en: "Female/male (male=100)" }, values: values(GENDER_WAGE_RATIO), kind: "line" },
      { key: "form", name: { ja: "正社員以外／正社員（正社員=100）", en: "Non-regular/regular (regular=100)" }, values: padTo(GENDER_WAGE_RATIO, FORM_WAGE_GAP), kind: "line", colorIndex: 6 },
    ],
    unit: { ja: "比率（男=100／正社員=100）", en: "ratio (base=100)" },
    valueKind: "float1",
    yLabel: { ja: "指数（基準=100）", en: "index (base=100)" },
    sourceIds: ["mhlw-chinginkouzou-r7"],
    note: {
      ja: "いずれも年齢・勤続年数・就業構造を調整しない未調整の格差。女性比は一般労働者（短時間労働者を除く）、雇用形態間比は2005年以降の公表。令和2年から有効回答率を考慮した推計方法へ変更（元年再計値は同一の74.3）。",
      en: "Both are unadjusted for age, tenure or employment structure. The gender ratio covers general workers (excluding short-hour employees); the form ratio is published from 2005. Estimation changed to account for response rates from 2020 (restated 2019 ratio identical at 74.3).",
    },
    rangeFilter: true,
  },

  // ----- 11. Age-wage curve -----------------------------------------------------
  {
    id: "ch04-wage-curve",
    title: {
      ja: "年齢階級別賃金カーブ（2025年・男女別）",
      en: "The age-wage curve by sex (2025)",
    },
    description: {
      ja: "賃金構造基本統計調査（2025年・一般労働者・きまって支給する賃金）による男女の年齢別賃金。男性は20～24歳の245.7千円から55～59歳の445.6千円へ1.8倍に達した後に緩やかに下降する標準的なカーブを描く。女性は239.6千円から45～49歳・55～59歳の305.7千円へ1.3倍で、上昇は全体として緩やか。この形の差には、勤続年数・雇用形態・産業構成の違いが混在しており、差のすべてを「同じ仕事の賃金差」と解釈してはならない。",
      en: "Scheduled cash earnings by age and sex, general workers, 2025. Men trace a classic curve, rising 1.8× from ¥245.7 thousand at 20–24 to ¥445.6 thousand at 55–59 before easing down. Women rise only 1.3×, from ¥239.6 thousand to ¥305.7 thousand at 45–49 and 55–59. The gap in shape mixes differences in tenure, employment form and industry mix — it must not be read as unequal pay for identical work.",
    },
    years: WAGE_CURVE_AGES.map(([, en]) => en),
    categories: WAGE_CURVE_AGES.map(([ja, en]) => ({ ja, en })),
    series: [
      { key: "male", name: { ja: "男性", en: "Men" }, values: [...WAGE_CURVE_MALE], kind: "line", colorIndex: 6 },
      { key: "female", name: { ja: "女性", en: "Women" }, values: [...WAGE_CURVE_FEMALE], kind: "line", colorIndex: 5 },
    ],
    unit: { ja: "千円/月", en: "¥1,000/month" },
    valueKind: "float1",
    yLabel: { ja: "千円／月", en: "¥1,000 per month" },
    sourceIds: ["mhlw-chinginkouzou-r7"],
    note: {
      ja: "きまって支給する賃金（所定内＋所定外）・月額。一般労働者（1週の所定労働時間が短時間労働者より長い労働者）。年齢計には70歳以上を含むため図示範囲を超える。",
      en: "Scheduled cash earnings (scheduled + non-scheduled), monthly, general workers (longer scheduled hours than short-hour employees). The 'total' row includes ages 70+, beyond the plotted range.",
    },
  },

  // ----- 12. Injuries -----------------------------------------------------------
  {
    id: "ch04-accident-injury",
    title: {
      ja: "労働災害による死傷者数の推移（1974–2025年・休業4日以上）",
      en: "Occupational injuries with 4+ lost days (1974–2025)",
    },
    description: {
      ja: "厚生労働省の労働災害統計による休業4日以上の死傷者数。1974年の347,407人（1978年の348,826人がピーク）から長期的に減少し、2009年に最小値の105,718人まで下がった。しかし2015年頃からは増加に転じ、2020年以降はコロナ禍を挟みながらも125,115人（2020年）から135,333人（2025年）へと、おおむね10年ぶりの高水準域で推移している。高齢労働者の増加と第三次産業の比重拡大が指摘されているが、本図は原因を特定しない。",
      en: "Injuries requiring four or more lost workdays, from MHLW accident statistics. The count fell long-term from 347,407 (1974; peak 348,826 in 1978) to its 2009 minimum of 105,718, then turned upward around 2015; after the pandemic dip-and-rebound it has run at 125,115 (2020) to 135,333 (2025) — roughly its highest levels in a decade. An ageing workforce and the growing weight of services are cited factors, though this figure does not identify causes.",
    },
    years: years(ACCIDENT_INJURY),
    series: [
      { key: "injury", name: { ja: "死傷者数（休業4日以上）", en: "Injuries (4+ lost days)" }, values: values(ACCIDENT_INJURY), kind: "line" },
    ],
    unit: { ja: "人", en: "persons" },
    valueKind: "int",
    yLabel: { ja: "人", en: "persons" },
    sourceIds: ["mhlw-rousai-2025"],
    note: {
      ja: "労働者死傷病報告等による。2020年以降の値は新型コロナウイルス感染症へのり患による労働災害を除く（2025年：135,333人）。2011年以前は労災保険給付データを含む集計のため、2012年以降と厳密には接続しない（出典注記に従い公表値をそのまま掲載）。",
      en: "Compiled from worker casualty reports. Values from 2020 exclude COVID-infection cases (2025: 135,333). Through 2011 the series includes workers'-comp insurance data, so 2012 onward is not strictly continuous (published values shown as-is, per the source note).",
    },
    rangeFilter: true,
  },

  // ----- 13. Fatalities -----------------------------------------------------------
  {
    id: "ch04-accident-death",
    title: {
      ja: "労働災害による死亡者数の推移（1974–2025年）",
      en: "Occupational fatalities (1974–2025)",
    },
    description: {
      ja: "同じく厚生労働省の労働災害統計による死亡者数。1974年の4,330人（観測期間の最多）から2025年の700人へと約84%減少し、直近では減少傾向が続いている。年度による増減はあるが（2017年の978人など）、長期 trend は明確な改善である。産業別では建設業と製造業の比重が大きい。死傷者数とは逆に死亡者数は近年も減少を続けており、重症災害の防止効果と、死傷報告の範囲変化の両方が含まれ得る。",
      en: "Fatalities from the same MHLW statistics. Deaths fell about 84% from 4,330 in 1975 — the series maximum — to 700 in 2025, and the decline has continued of late. Year-to-year upticks occur (978 in 2017), but the long-run improvement is unambiguous. Construction and manufacturing carry the largest weights. Unlike injuries, fatalities keep falling; both genuine prevention gains and changes in the reporting scope may contribute.",
    },
    years: years(ACCIDENT_DEATH),
    series: [
      { key: "death", name: { ja: "死亡者数", en: "Fatalities" }, values: values(ACCIDENT_DEATH), kind: "line", colorIndex: 3 },
    ],
    unit: { ja: "人", en: "persons" },
    valueKind: "int",
    yLabel: { ja: "人", en: "persons" },
    sourceIds: ["mhlw-rousai-2025"],
    note: {
      ja: "死亡災害報告による。2020年以降は新型コロナウイルス感染症へのり患による労働災害を除く（2025年：700人＝確定値、令和8年4月7日までの報告集計）。",
      en: "From fatality reports. Values from 2020 exclude COVID-infection cases (2025: 700, final as of reports through 7 April 2026).",
    },
    rangeFilter: true,
  },

  // ----- 14. Mental-health comp ----------------------------------------------------
  {
    id: "ch04-mental-comp",
    title: {
      ja: "精神障害の労災補償：請求・決定・支給決定件数（2018–2025年度）",
      en: "Mental-health workers' comp: claims, decisions, grants (FY2018–2025)",
    },
    description: {
      ja: "厚生労働省「過労死等の労災補償状況」による業務災害に係る精神障害の件数。請求件数は2018年度の1,820件から2025年度の4,958件へと約2.7倍に増加した。支給決定（業務災害と認定）は2025年度1,082件で、認定率（支給決定÷決定）は28.2%。請求件数の増加は、申請しやすさの変化・勤労者の意識変化・労働環境の変化のいずれも含み得るため、増加=疾病増加とは解釈できない。決定件数には前年度以前の請求分を含む。",
      en: "Claims, decisions and grants for work-related mental disorders from MHLW's karoshi compensation statistics. Claims rose about 2.7× from 1,820 (FY2018) to 4,958 (FY2025). Grants (recognized as work-related) reached 1,082 in FY2025, a 28.2% recognition rate. The claim rise may reflect easier application procedures, changing awareness, and changing workplaces alike — it cannot be read as a pure rise in illness. Decisions include claims lodged in earlier years.",
    },
    years: years(MENTAL_CLAIMS),
    series: [
      { key: "claims", name: { ja: "請求件数", en: "Claims" }, values: values(MENTAL_CLAIMS), kind: "bar" },
      { key: "decisions", name: { ja: "決定件数", en: "Decisions" }, values: values(MENTAL_DECISIONS), kind: "line", colorIndex: 6 },
      { key: "granted", name: { ja: "支給決定件数", en: "Granted" }, values: values(MENTAL_GRANTED), kind: "line", colorIndex: 5 },
    ],
    unit: { ja: "件", en: "cases" },
    valueKind: "int",
    yLabel: { ja: "件", en: "cases" },
    sourceIds: ["mhlw-karoshi-r7"],
    note: {
      ja: "年度（4月～翌3月）。自殺は未遂を含む。支給決定件数は決定件数のうち「業務災害」と認定した件数。決定件数には前年度以前に請求されたものの決定を含む。",
      en: "Fiscal years (April–March). Suicide counts include attempts. Grants are decisions recognized as work-related; decisions include claims from previous years.",
    },
  },

  // ----- 15. OECD hours ---------------------------------------------------------------
  {
    id: "ch04-oecd-hours",
    title: {
      ja: "主要国の年間実労働時間（OECD・最新年）",
      en: "Average annual hours actually worked, selected economies (OECD, latest year)",
    },
    description: {
      ja: "OECD（ELS.SAE）による1人当たり年間実労働時間。日本は2025年の1,597.5時間で、OECD平均（1,736.1時間・2025年）を下回り、ドイツ（1,332.2時間）やフランスを上回る位置にある。韓国は1,833.0時間と最も長い。ただしOECD自身が「水準の直接比較には適さない」と明記しており（出典・推計方法が国により異なる）、この図は長期トレンドの文脈での目安として読むべきである。日本の系列は1970年の2,243時間から約650時間減少した。",
      en: "Annual hours actually worked per employed person from the OECD (ELS.SAE). Japan, at 1,597.5 hours (2025), sits below the OECD average (1,736.1, 2025) and above Germany (1,332.2) or France; Korea is longest at 1,833.0. The OECD itself warns the levels are not directly comparable across countries (sources and estimation differ), so this chart should be read as context for long-run trends. Japan's own series is down roughly 650 hours from 2,243 in 1970.",
    },
    years: OECD_HOURS_LATEST.map(([a]) => a),
    categories: OECD_HOURS_LATEST.map(([a, y]) => ({
      ja: `${OECD_NAMES[a]?.ja ?? a}（${y}）`,
      en: `${OECD_NAMES[a]?.en ?? a} (${y})`,
    })),
    series: [
      { key: "hours", name: { ja: "年間実労働時間", en: "Annual hours" }, values: OECD_HOURS_LATEST.map(([, , v]) => Math.round(v * 10) / 10), kind: "bar" },
    ],
    unit: { ja: "時間/年", en: "hours/year" },
    valueKind: "float1",
    yLabel: { ja: "時間／年", en: "hours per year" },
    horizontal: true,
    sourceIds: ["oecd-els-sae"],
    note: {
      ja: "各国最新年（2024または2025年）。OECDの定義は「年間の総実労働時間を年平均就業者数で除した値」。OECD公式注意書き：データはトレンド比較を意図しており、出典が異なるため同年の水準比較には適さない。パートタイム労働者も含む。",
      en: "Latest year per economy (2024 or 2025). OECD definition: total hours worked over the year divided by average employment. Official OECD caveat: the data are intended for comparisons of trends over time and are unsuitable for level comparisons in a given year; part-time workers are included.",
    },
  },
];
