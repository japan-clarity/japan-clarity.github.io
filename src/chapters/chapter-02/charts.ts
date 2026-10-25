import type { ChartSpec } from "@/lib/research/types";
import {
  GDP_NOMINAL_TRILLION,
  GDP_REAL_TRILLION,
  GDP_REAL_GROWTH,
  WAGE_NOMINAL_INDEX,
  WAGE_REAL_INDEX,
  INDUSTRY_VA_SHARE_PRIMARY,
  INDUSTRY_VA_SHARE_SECONDARY,
  INDUSTRY_VA_SHARE_TERTIARY,
  INDUSTRY_VA_SHARE_MANUFACTURING,
  EMPLOYMENT_SHARE_PRIMARY,
  EMPLOYMENT_SHARE_SECONDARY,
  EMPLOYMENT_SHARE_TERTIARY,
  EMPLOYMENT_SHARE_MANUFACTURING,
  RD_GDP_RATIO,
  OECD_GDP_HOUR_COMPARE,
  OECD_COMPARE_YEAR,
  OECD_COUNTRIES,
  OECD_JPN_GDP_HOUR_VOLUME,
  WB_PC_JPN,
  WB_PC_COMPARE,
  WB_COMPARE_YEAR,
  WB_COUNTRIES,
} from "./data";

/**
 * Chapter 02 chart specifications.
 *
 * Every series references the generated verified data module; nothing is
 * hand-entered. Derived series (the chained wage index, the aggregated
 * industry sectors) carry notes explaining the derivation and are disclosed
 * in the chapter limitations.
 */

const years = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([y]) => y);
const values = (pairs: ReadonlyArray<[number, number | null]>) =>
  pairs.map(([, v]) => v);

export const chapter02Charts: ChartSpec[] = [
  {
    id: "ch02-gdp-levels",
    title: {
      ja: "名目GDPと実質GDPの推移（暦年・兆円）",
      en: "Nominal and real GDP, calendar years (¥ trillion)",
    },
    description: {
      ja: "内閣府の国民経済計算年次推計（2020年基準）による暦年の名目GDPと実質GDP。名目GDPは1994年の521.7兆円から2024年の634.2兆円まで増加したが、実質GDP（2020年価格）は464.3兆円から584.5兆円へ。両者の差（GDPデフレーター）は1994年の112.4から2024年の108.5へと低下し、モノやサービスの価格水準が約30年間ほぼ横ばいだったことを示す。",
      en: "Calendar-year nominal and real GDP from the Cabinet Office national accounts (2020 base). Nominal GDP rose from ¥521.7T (1994) to ¥634.2T (2024), while real GDP (2020 prices) moved from ¥464.3T to ¥584.5T. The gap between them — the GDP deflator — fell from 112.4 to 108.5 (2020=100), showing that the overall price level was roughly flat for about thirty years.",
    },
    years: years(GDP_NOMINAL_TRILLION),
    series: [
      {
        key: "nominal",
        name: { ja: "名目GDP", en: "Nominal GDP" },
        values: values(GDP_NOMINAL_TRILLION),
        kind: "line",
      },
      {
        key: "real",
        name: { ja: "実質GDP（2020年価格）", en: "Real GDP (2020 prices)" },
        values: values(GDP_REAL_TRILLION),
        kind: "line",
      },
    ],
    unit: { ja: "兆円", en: "¥ trillion" },
    valueKind: "float1",
    yLabel: { ja: "兆円", en: "¥ trillion" },
    sourceIds: ["esri-na-2024"],
    note: {
      ja: "支出側GDP。実質は連鎖方式（2020暦年基準）。名目と実質の差がGDPデフレーター（2020年=100：1994年112.4→2024年108.5）。1994年以前は旧基準の系列であり接続していません。",
      en: "Expenditure-side GDP; real series is chain-linked (2020 base). The nominal/real gap is the GDP deflator (2020=100: 112.4 in 1994 → 108.5 in 2024). Pre-1994 history is not linked (older SNA bases).",
    },
    rangeFilter: true,
  },
  {
    id: "ch02-gdp-growth",
    title: {
      ja: "実質GDP成長率の推移（暦年・％）",
      en: "Real GDP growth rate, calendar years (%)",
    },
    description: {
      ja: "内閣府公表の対前年増加率。1990年代後半から2000年代半ばまで年平均1%前後の低成長が続き、2008年（−1.2%）と2009年（−5.9%）の世界同時不況、2020年（−4.3%）の新型コロナ禍で大きく落ち込み、その後持ち直した。2023年は+0.7%、2024年は−0.2%と足踏みが続いている。",
      en: "Year-on-year growth as published by the Cabinet Office. After the mid-1990s, growth averaged around 1% or less; the global financial crisis brought −1.2% (2008) and −5.9% (2009), and the pandemic −4.3% (2020), each followed by recovery. Growth was +0.7% in 2023 and −0.2% in 2024 — still stalling.",
    },
    years: years(GDP_REAL_GROWTH),
    series: [
      {
        key: "growth",
        name: { ja: "実質GDP成長率", en: "Real GDP growth" },
        values: values(GDP_REAL_GROWTH),
        kind: "bar",
      },
    ],
    unit: { ja: "％（前年比）", en: "% (year on year)" },
    valueKind: "float1",
    yLabel: { ja: "％", en: "%" },
    sourceIds: ["esri-na-2024"],
    note: {
      ja: "年次推計の公表値（増加率表）。2025暦年の年次確定値は未公表（世界銀行WDIによる速報値は+1.2%）。",
      en: "As published in the annual estimates (growth-rate sheet). Calendar-2025 finals are not yet published (World Bank WDI preliminary: +1.2%).",
    },
    rangeFilter: true,
  },
  {
    id: "ch02-percapita-trend",
    title: {
      ja: "一人当たりGDPの推移（PPP・国際ドル、日本）",
      en: "GDP per capita, Japan (PPP, international $)",
    },
    description: {
      ja: "世界銀行WDIによる日本の一人当たりGDP（購買力平価・現在国際ドル）。1990年の20,331国際ドルから2025年の55,422国際ドルへと約2.7倍になった。総GDPがほぼ横ばいでも、人口の減少が進む中で一人当たりでは緩やかな向上が続いてきたことを示す。",
      en: "Japan's GDP per capita (current PPP int$) from World Bank WDI: roughly 2.7× growth from 20,331 int$ (1990) to 55,422 int$ (2025). Even with total GDP nearly flat, per-capita output has kept improving slowly as the population shrinks.",
    },
    years: years(WB_PC_JPN),
    series: [
      {
        key: "pc",
        name: { ja: "一人当たりGDP（PPP）", en: "GDP per capita (PPP)" },
        values: values(WB_PC_JPN),
        kind: "line",
      },
    ],
    unit: { ja: "現在国際ドル", en: "current int$" },
    valueKind: "int",
    yLabel: { ja: "国際ドル（PPP）", en: "int$ (PPP)" },
    sourceIds: ["wb-wdi-2026-10"],
    note: {
      ja: "PPPは価格構造の違いを調整した推計値（2021年ICPサイクル）。為替レート換算の額（例：2024年33,785米ドル・内閣府参考表）とは意味が異なる。1990年より前はPPP系列の提供なし。",
      en: "PPP adjusts for price-level differences (2021 ICP cycle) and differs in meaning from market-exchange-rate figures (e.g. USD 33,785 in 2024 per the Cabinet Office reference table). The PPP series starts in 1990.",
    },
    rangeFilter: true,
  },
  {
    id: "ch02-percapita-compare",
    title: {
      ja: `国際比較：一人当たりGDP（PPP・${WB_COMPARE_YEAR}年、13の国・地域）`,
      en: `International comparison: GDP per capita (PPP, ${WB_COMPARE_YEAR}, 13 economies)`,
    },
    description: {
      ja: `世界銀行WDIによる同一年（${WB_COMPARE_YEAR}年）の一人当たりGDP（PPP）の比較。日本は55,422国際ドルで、比較した13経済の中で最も低い。米国90,027、オランダ87,320、ドイツ75,407などが上位。シンガポールは163,354国際ドルと都市国家としての特殊な構造を反映した外れ値。`,
      en: `Same-year (${WB_COMPARE_YEAR}) per-capita GDP (PPP) from World Bank WDI. Japan, at 55,422 int$, is the lowest of the 13 economies compared; the United States (90,027), the Netherlands (87,320) and Germany (75,407) are higher. Singapore's 163,354 int$ is an outlier reflecting its city-state structure.`,
    },
    years: WB_PC_COMPARE.map(([code]) => code),
    categories: WB_PC_COMPARE.map(([code]) => WB_COUNTRIES[code] ?? { ja: code, en: code }),
    series: [
      {
        key: "pc",
        name: { ja: "一人当たりGDP（PPP）", en: "GDP per capita (PPP)" },
        values: WB_PC_COMPARE.map(([, v]) => v),
        kind: "bar",
      },
    ],
    unit: { ja: "現在国際ドル", en: "current int$" },
    valueKind: "int",
    yLabel: { ja: "国際ドル（PPP）", en: "int$ (PPP)" },
    sourceIds: ["wb-wdi-2026-10"],
    horizontal: true,
    note: {
      ja: "PPP・現在国際ドル（2021年ICPサイクル）。台湾はWDIの対象外。シンガポールは参考値（都市国家）。市場為替換算の順位とは異なる結果になり得る。",
      en: "PPP, current int$ (2021 ICP cycle). Taiwan is outside WDI coverage; Singapore shown as a city-state reference. Rankings can differ from market-exchange-rate comparisons.",
    },
  },
  {
    id: "ch02-wages",
    title: {
      ja: "賃金指数の推移：名目と実質（2020年平均=100）",
      en: "Nominal and real wage indices (2020 average = 100)",
    },
    description: {
      ja: "毎月勤労統計調査（現金給与総額・調査産業計・事業所規模5人以上）。公表前年比を用いて2020年=100に連結した系列。名目賃金は1997年の108.2から2025年の108.9へと約30年間ほぼ横ばい。実質賃金（持家の帰属家賃を除く総合CPIで実質化）は1997年の117.5をピークに2025年には95.6まで低下し、約19%の減少となった。2024–25年は名目+2.8%/+2.3%に対し実質−0.3%/−1.3%と物価上昇に賃金が追いつかず、2026年1–8月は8か月連続で実質プラスに転じている。",
      en: "Monthly Labour Survey (total cash earnings, all survey industries, establishments with 5+ employees), chained to 2020=100 using published year-on-year rates. Nominal wages were essentially flat for three decades (108.2 in 1997 → 108.9 in 2025). Real wages (deflated by the CPI excluding imputed rent) peaked at 117.5 in 1997 and fell to 95.6 by 2025 — a decline of about 19%. In 2024–25 nominal pay rose +2.8%/+2.3% but real pay fell −0.3%/−1.3%; from January 2026 real wages have been positive for eight consecutive months.",
    },
    years: years(WAGE_REAL_INDEX),
    series: [
      {
        key: "nominal",
        name: { ja: "名目賃金指数（連結）", en: "Nominal wage index (chained)" },
        values: WAGE_NOMINAL_INDEX.filter(([y]) => y >= 1997).map(([, v]) => v),
        kind: "line",
      },
      {
        key: "real",
        name: { ja: "実質賃金指数（連結）", en: "Real wage index (chained)" },
        values: values(WAGE_REAL_INDEX),
        kind: "line",
      },
    ],
    unit: { ja: "指数（2020年平均=100）", en: "index (2020 avg = 100)" },
    valueKind: "float1",
    yLabel: { ja: "指数（2020年=100）", en: "index (2020=100)" },
    sourceIds: ["mhlw-mls-2025-final", "mhlw-mls-2026-08"],
    note: {
      ja: "公表前年比に基づく成長連鎖による派生系列（1997–2025）。2018–2023年は公表指数水準と一致。2024年1月のベンチマーク更新（2021年経済センサス基準）により公表指数水準は約+2.6%上方に跳ぶため、本図の2024–25年水準は公表指数（109.2/111.7）より約2.6%低く、公表前年比と整合する経済実感ベースの系列となっている（厚労省利用上の注意9）。",
      en: "Derived series (1997–2025): growth-chain from published YoY. Matches published index levels for 2018–2023. Because the Jan-2024 benchmark update lifted published levels by ≈ +2.6%, our 2024–25 levels sit ≈ 2.6% below the published indices (109.2/111.7) and remain consistent with the officially published growth rates (MHLW usage note 9).",
    },
    rangeFilter: true,
  },
  {
    id: "ch02-industry-va",
    title: {
      ja: "産業構造の変化：付加価値額の構成比（名目・％）",
      en: "Industrial structure: value-added shares (nominal, %)",
    },
    description: {
      ja: "内閣府の経済活動別国内総生産（名目）を第一次・第二次・第三次産業に集計した構成比（産業計に対する割合）。第一次産業は1994年の1.8%から2024年の1.0%へ。第二次産業は34.8%から27.0%へ低下し、なかでも製造業は23.4%から19.0%へ。第三次産業は63.4%から72.0%へ拡大した。",
      en: "Shares of nominal value added by sector (Cabinet Office activity-side GDP, aggregated into primary/secondary/tertiary as a share of total industry value added). The primary sector fell from 1.8% (1994) to 1.0% (2024); the secondary sector from 34.8% to 27.0% — manufacturing within it from 23.4% to 19.0%; the tertiary sector expanded from 63.4% to 72.0%.",
    },
    years: years(INDUSTRY_VA_SHARE_PRIMARY),
    series: [
      {
        key: "primary",
        name: { ja: "第一次産業", en: "Primary sector" },
        values: values(INDUSTRY_VA_SHARE_PRIMARY),
        kind: "line",
      },
      {
        key: "secondary",
        name: { ja: "第二次産業", en: "Secondary sector" },
        values: values(INDUSTRY_VA_SHARE_SECONDARY),
        kind: "line",
      },
      {
        key: "tertiary",
        name: { ja: "第三次産業", en: "Tertiary sector" },
        values: values(INDUSTRY_VA_SHARE_TERTIARY),
        kind: "line",
      },
      {
        key: "manufacturing",
        name: { ja: "（参考）製造業", en: "(ref.) Manufacturing" },
        values: values(INDUSTRY_VA_SHARE_MANUFACTURING),
        kind: "line",
        dashed: true,
      },
    ],
    unit: { ja: "％（産業計に占める割合）", en: "% of total industry value added" },
    valueKind: "float1",
    yLabel: { ja: "構成比（％）", en: "share (%)" },
    sourceIds: ["esri-na-2024"],
    note: {
      ja: "16経済活動分類からの集計（第一次＝農林水産業、第二次＝鉱業＋製造業＋電気・ガス・水道・廃棄物処理＋建設業、第三次＝残り）。分母は生産・輸入税を含まない「経済活動計」。名目構成比。",
      en: "Aggregated from the 16-activity classification (primary = agriculture/forestry/fisheries; secondary = mining + manufacturing + utilities + construction; tertiary = the rest). Denominator is total industry value added (excluding taxes on production and imports). Nominal shares.",
    },
    rangeFilter: true,
  },
  {
    id: "ch02-employment-structure",
    title: {
      ja: "就業者の産業構造の変化（％）",
      en: "Employment structure by sector (%)",
    },
    description: {
      ja: "内閣府の経済活動別就業者数（SNAベース）を3部門に集計した構成比。第一次産業は1994年の7.3%から2024年の3.1%へ。第二次産業は32.3%から22.2%へ低下し、製造業就業者は1,411万人から1,010万人へと約400万人減少。第三次産業は60.4%から74.6%へ拡大し、雇用のサービス化が進んだ。",
      en: "Shares of employed persons by sector (Cabinet Office SNA activity-side employment). The primary sector fell from 7.3% (1994) to 3.1% (2024); the secondary sector from 32.3% to 22.2%, with manufacturing employment down about 4 million people (14.11M → 10.10M); the tertiary sector rose from 60.4% to 74.6%.",
    },
    years: years(EMPLOYMENT_SHARE_PRIMARY),
    series: [
      {
        key: "primary",
        name: { ja: "第一次産業", en: "Primary sector" },
        values: values(EMPLOYMENT_SHARE_PRIMARY),
        kind: "line",
      },
      {
        key: "secondary",
        name: { ja: "第二次産業", en: "Secondary sector" },
        values: values(EMPLOYMENT_SHARE_SECONDARY),
        kind: "line",
      },
      {
        key: "tertiary",
        name: { ja: "第三次産業", en: "Tertiary sector" },
        values: values(EMPLOYMENT_SHARE_TERTIARY),
        kind: "line",
      },
      {
        key: "manufacturing",
        name: { ja: "（参考）製造業", en: "(ref.) Manufacturing" },
        values: values(EMPLOYMENT_SHARE_MANUFACTURING),
        kind: "line",
        dashed: true,
      },
    ],
    unit: { ja: "％（就業者合計に占める割合）", en: "% of total employed" },
    valueKind: "float1",
    yLabel: { ja: "構成比（％）", en: "share (%)" },
    sourceIds: ["esri-na-2024"],
    note: {
      ja: "SNA経済活動別の就業者数（国民経済計算と同じ定義連続性）。労働力調査（ILO定義）の就業者総数とは体系が異なる（労働力調査：1953年3,913万人→2025年6,828万人）。",
      en: "SNA activity-side employment (definitionally consistent with the national accounts). Not the same system as the Labour Force Survey's ILO-definition totals (LFS: 39.13M in 1953 → 68.28M in 2025).",
    },
    rangeFilter: true,
  },
  {
    id: "ch02-rd-gdp",
    title: {
      ja: "研究費の対GDP比率の推移（年度・％）",
      en: "R&D expenditure as a share of GDP (fiscal years, %)",
    },
    description: {
      ja: "総務省科学技術研究調査による研究費の対GDP比。2000年代後半から2010年代前半は3.5%前後で推移し、2014年度（2015年調査）の3.87%を境に、2015年度以降の新しいGDP基準では3.3〜3.5%台で底打ちし、その後徐々に上昇して2024年度は3.70%と4年連続で増加した。研究費総額は2024年度に23兆7,925億円（前年度比+7.9%）。",
      en: "R&D expenditure relative to GDP from the Statistics Bureau's R&D survey. The ratio hovered around 3.5% in the late 2000s and early 2010s; after the FY2014 peak (3.87%, on the older GDP vintage) it bottomed in the 3.3–3.5% range on the newer basis and then climbed gradually to 3.70% in FY2024 — the fourth consecutive increase. Total R&D reached ¥23.79T in FY2024 (+7.9% year on year).",
    },
    years: years(RD_GDP_RATIO),
    series: [
      {
        key: "ratio",
        name: { ja: "研究費の対GDP比", en: "R&D / GDP" },
        values: values(RD_GDP_RATIO),
        kind: "line",
      },
    ],
    unit: { ja: "％（年度）", en: "% (fiscal year)" },
    valueKind: "float2",
    yLabel: { ja: "対GDP比（％）", en: "% of GDP" },
    sourceIds: ["statb-rd-2025"],
    note: {
      ja: "2005–2014年度は2015年調査の概要表（GDP＝平成26年度確報ベース）、2015–2024年度は2025年調査の表1-2（GDP＝2024年度年次推計ベース）。2014→2015年度の境界はGDPヴィンテージが異なるため比率の水準の連続性は保証されない（研究費自体はほぼ横ばいでも3.87%→3.43%へ低下）。",
      en: "FY2005–2014 from the 2015-round summary (GDP on the FY2014-final vintage); FY2015–2024 from the 2025-round table 1-2 (GDP on the 2024 annual-estimates vintage). The FY2014→15 boundary crosses GDP vintages, so ratio-level continuity is not guaranteed (R&D itself nearly flat while the ratio steps 3.87% → 3.43%).",
    },
    rangeFilter: true,
  },
  {
    id: "ch02-productivity-compare",
    title: {
      ja: `国際比較：時間当たりGDP（PPP・${OECD_COMPARE_YEAR}年、12か国）`,
      en: `International comparison: GDP per hour worked (PPP, ${OECD_COMPARE_YEAR}, 12 economies)`,
    },
    description: {
      ja: `OECD生産性統計による時間当たりGDP（現在価格・PPP換算）の同年比較。日本は${OECD_COMPARE_YEAR}年に米ドルPPPで61.8ドル/時間であり、比較した12か国中で最も低い。オランダ105.5、米国104.7、ドイツ102.7が上位。韓国（62.5）は日本を上回った。カナダ76.8、イタリア80.4、英国85.6、フランス96.1などの中位グループとも2〜3割の差がある。`,
      en: `GDP per hour worked (current prices, PPP) from OECD Productivity Statistics. In ${OECD_COMPARE_YEAR} Japan stood at USD 61.8/hour — the lowest of the 12 economies compared. The Netherlands (105.5), the United States (104.7) and Germany (102.7) lead; South Korea (62.5) now exceeds Japan. Mid-group economies such as Canada (76.8), Italy (80.4), the UK (85.6) and France (96.1) are roughly 20–30% higher.`,
    },
    years: OECD_GDP_HOUR_COMPARE.map(([code]) => code),
    categories: OECD_GDP_HOUR_COMPARE.map(([code]) => OECD_COUNTRIES[code] ?? { ja: code, en: code }),
    series: [
      {
        key: "gph",
        name: { ja: "時間当たりGDP（PPP）", en: "GDP per hour worked (PPP)" },
        values: OECD_GDP_HOUR_COMPARE.map(([, v]) => v),
        kind: "bar",
      },
    ],
    unit: { ja: "米ドル/時間（PPP・現在価格）", en: "USD per hour (PPP, current prices)" },
    valueKind: "float1",
    yLabel: { ja: "米ドル/時間", en: "USD per hour" },
    sourceIds: ["oecd-pdb-2026"],
    horizontal: true,
    note: {
      ja: "OECD編集の全経済活動ベース。PPP換算のため価格構造の違いを調整済み（為替レート換算ではない）。現在価格の水準は国際比較用であり、時間軸の比較には実質系列（別図）を用いる。シンガポールはOECD生産性統計の対象外。",
      en: "OECD-compiled, total economy. PPP conversion adjusts for price-level differences (not market exchange rates). Current-price levels are for cross-country comparison; use the volume series (separate chart) for trends. Singapore is not covered by the OECD productivity database.",
    },
  },
  {
    id: "ch02-productivity-japan",
    title: {
      ja: "日本の時間当たりGDPの推移（実質・2020年=100）",
      en: "Japan's GDP per hour worked, volume series (2020 = 100)",
    },
    description: {
      ja: "OECD生産性統計による日本の時間当たりGDPの実質系列（連鎖・2020年基準）。1970年の14.9から1990年には33.5へと年平均3.8%で上昇したが、1990年から2025年（53.0）までの年平均伸びは約1.0%に半減以下となり、1990年代以降の生産性の伸び悩みを示す。2020年は新型コロナ禍で一時低下（50.5）し、その後回復している。",
      en: "Japan's real GDP per hour worked (chain-linked, 2020 base) from OECD. It climbed from 14.9 (1970) to 33.5 (1990) — about 3.8% a year — but growth slowed to roughly 1.0% a year between 1990 and 2025 (53.0), illustrating the post-1990 productivity slowdown. The pandemic year 2020 dipped to 50.5 before recovering.",
    },
    years: years(OECD_JPN_GDP_HOUR_VOLUME),
    series: [
      {
        key: "volume",
        name: { ja: "時間当たりGDP（実質）", en: "GDP per hour worked (volume)" },
        values: values(OECD_JPN_GDP_HOUR_VOLUME),
        kind: "line",
      },
    ],
    unit: { ja: "指数（2020年=100）", en: "index (2020 = 100)" },
    valueKind: "float1",
    yLabel: { ja: "指数（2020年=100）", en: "index (2020=100)" },
    sourceIds: ["oecd-pdb-2026"],
    note: {
      ja: "連鎖実質系列（2020年基準）。OECD編集値であり内閣府の国内公表値とは基準・改訂方針が異なる。生産性は個人や職場の努力度ではなく、資本装備・産業構成・労働時間など構造要因を含む macro 指標。",
      en: "Chain-linked volume series (2020 base). OECD-compiled; benchmarks and revision policy differ from Japan's own publications. Productivity is a macro indicator reflecting capital intensity, industry mix and hours — not a measure of individual effort.",
    },
    rangeFilter: true,
  },
];
