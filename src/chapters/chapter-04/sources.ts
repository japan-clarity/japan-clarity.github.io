import type { SourceRecord } from "@/lib/research/types";

/**
 * Chapter 04 source register — structured provenance for every dataset used
 * by this chapter. Verification happened on 2026-10-26 by fetching each
 * document directly from its official domain and reading the cited figures
 * inside the archived copies under `research/chapter04/raw/` (see
 * research/chapter04/notes/*.md for verbatim quotes, table anchors and
 * checksums; research/chapter04/scripts/extract-series.py re-asserts 192
 * anchor checks before any data reaches the site).
 */
export const chapter04Sources: SourceRecord[] = [
  {
    id: "estat-lfs-t2-main",
    organization: {
      ja: "総務省統計局（労働力調査・e-Stat）",
      en: "Statistics Bureau, MIC (Labour Force Survey via e-Stat)",
    },
    originalTitle: "労働力調査（基本集計）長期時系列表２ 就業状態別15歳以上人口",
    displayTitle: {
      ja: "労働力調査 長期時系列表2（就業状態別・1953–2025年・年平均）",
      en: "LFS long-run table 2: population 15+ by labour-force status (1953–2025, annual averages)",
    },
    url: "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000001082681&fileKind=0",
    sourceLanguage: "ja",
    publicationDate: "2026-10-02",
    referencePeriod: "1953–2025 calendar-year averages (2026 August update cycle)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "万人・％（15歳以上人口、労働力人口、就業者、完全失業者、非労働力人口、労働力人口比率、就業率、完全失業率）",
      en: "10k persons and % (population 15+, labour force, employed, unemployed, not in the labour force, LFPR, employment rate, unemployment rate)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上での引用・転載は統計局の利用規約に従います。原資料は再配布していません。",
      en: "Statistics Bureau publication; citation with attribution under the bureau's terms. Raw files are not redistributed.",
    },
    methodologyNotes: {
      ja: "年平均。1978年以降の数値は通常の接続系列。1977年以前は1967年の調査改正と1975年国勢調査基準の人口で補正した「時系列接続用数値」であり、公表値の内部構成（労働力＋非労働力＝15歳以上人口等）は厳密には一致しない。1973年は沖縄県を含む行を採用（同年の沖縄を除く値は別途記録）。完全失業率＝完全失業者÷労働力人口。2022年1月分から2020年国勢調査基準の人口に切り替え。",
      en: "Annual averages. Values from 1978 form the regular continuous series; 1953–1977 are retro-linked values adjusted for the 1967 survey reform and the 1975 census benchmark, whose published components do not exactly reconcile. For 1973 the Okinawa-inclusive row is used (the exclusive row is archived separately). Unemployment rate = unemployed ÷ labour force. Benchmark switched to the 2020 census from the January 2022 round.",
    },
    limitations: {
      ja: "15歳以上人口は人口推計のベンチマークであり、調査推計である労働力・非労働力の合計と厳密には一致しない（直近で約7–9万人の差）。",
      en: "The population-15+ column is an external benchmark and does not exactly equal survey-estimated labour force + not-in-labour-force (recent gap ≈ 70–90 thousand).",
    },
    evidenceFile: "research/chapter04/raw/statb-lf/est-000001082681.xlsx",
  },
  {
    id: "estat-lfs-t4-status",
    organization: {
      ja: "総務省統計局（労働力調査・e-Stat）",
      en: "Statistics Bureau, MIC (Labour Force Survey via e-Stat)",
    },
    originalTitle: "労働力調査（基本集計）長期時系列表４(1) 従業上の地位別就業者数",
    displayTitle: {
      ja: "労働力調査 長期時系列表4-1（従業上の地位別・1953–2025年・年平均）",
      en: "LFS long-run table 4(1): employed by status in employment (1953–2025)",
    },
    url: "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000001082690&fileKind=0",
    sourceLanguage: "ja",
    publicationDate: "2026-10-02",
    referencePeriod: "1953–2025 calendar-year averages",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "万人（自営業主、家族従業者、雇用者［常雇・臨時雇・日雇］）",
      en: "10k persons (self-employed, family workers, employees [regular/temporary/daily])",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上での引用・転載は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; citation with attribution under the bureau's terms.",
    },
    methodologyNotes: {
      ja: "年平均。公表表では自営業主＋家族従業者＋雇用者の合計が就業者総数を近年で約30–45万人下回る（役員分類に由来する公表残差）。常雇・臨時雇・日雇の区分は2018年1月の雇用契約期間別集計の開始に伴い廃止（2015–2017年は2015年国勢調査基準の値）。2015年から2021年は2020年国勢調査基準に遡及改定。",
      en: "Annual averages. In the published table the three components sum below total employed persons by ≈0.3–0.45 million in recent years (a published residual tied to the executive-officer classification). The regular/temporary/daily split ended in January 2018 with the switch to contract-duration tabulation (2015–2017 on the 2015-census benchmark); 2015–2021 were retro-revised to the 2020-census benchmark.",
    },
    limitations: {
      ja: "役員の内訳はこの表では公表されない。残差の解釈は限定的。",
      en: "Executive officers are not broken out in this table; the residual's interpretation is limited.",
    },
    evidenceFile: "research/chapter04/raw/statb-lf/est-000001082690.xlsx",
  },
  {
    id: "estat-lfs-t3-age",
    organization: {
      ja: "総務省統計局（労働力調査・e-Stat）",
      en: "Statistics Bureau, MIC (Labour Force Survey via e-Stat)",
    },
    originalTitle: "労働力調査（基本集計）長期時系列表３(3) 年齢階級(5歳階級)別就業者数及び就業率",
    displayTitle: {
      ja: "労働力調査 長期時系列表3-3（年齢別就業者数・就業率・1968–2025年）",
      en: "LFS long-run table 3(3): employment by 5-year age group and rates (1968–2025)",
    },
    url: "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000001082684&fileKind=0",
    sourceLanguage: "ja",
    publicationDate: "2026-10-02",
    referencePeriod: "1968–2025 calendar-year averages",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "万人・％（年齢階級別就業者数と就業率）",
      en: "10k persons and % (employment counts and rates by 5-year age band)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上での引用・転載は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; citation with attribution under the bureau's terms.",
    },
    methodologyNotes: {
      ja: "年平均。就業率＝各年齢の就業者÷同年齢の15歳以上人口（人口推計ベンチマーク）。65歳以上は65～69・70～74・75歳以上に細分。1968年は沖縄を含まない行を含む長期接続系列。",
      en: "Annual averages. Employment rate = employed ÷ population at the same age (population-estimate benchmarks). 65+ is subdivided into 65–69/70–74/75+. The 1968 rows belong to the retro-linked long-run series.",
    },
    limitations: {
      ja: "1968年以前の年齢別系列は公表されていない。",
      en: "No age-detail series is published before 1968.",
    },
    evidenceFile: "research/chapter04/raw/statb-lf/est-000001082684.xlsx",
  },
  {
    id: "estat-lfs-t10-form",
    organization: {
      ja: "総務省統計局（労働力調査詳細集計・e-Stat）",
      en: "Statistics Bureau, MIC (LFS detailed tabulation via e-Stat)",
    },
    originalTitle: "労働力調査（詳細集計）長期時系列表10(1) 年齢階級別就業者数及び雇用形態別雇用者数（年平均）",
    displayTitle: {
      ja: "労働力調査詳細集計 長期表10-1（雇用形態別・2002–2025年・男女・年齢別）",
      en: "LFS detailed tabulation table 10(1): employees by employment form (2002–2025, by sex and age)",
    },
    url: "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000021915917&fileKind=0",
    sourceLanguage: "ja",
    publicationDate: "2026-05-29",
    referencePeriod: "2002–2025 calendar-year averages",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "万人・％（正規・非正規の職員・従業員数と構成比、パート・派遣・契約社員・嘱託・その他の内訳）",
      en: "10k persons and % (regular/non-regular counts and shares; part-time, dispatch, contract, entrusted, other breakdown)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上での引用・転載は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; citation with attribution under the bureau's terms.",
    },
    methodologyNotes: {
      ja: "年平均・四半期平均のもととなる詳細集計（基本集計の約4分の1の標本）。非正規の割合は役員を除く雇用者を分母とする公表値。詳細集計は2002年1月に開始され、2001年以前は労働力調査特別調査が類似の項目を調査（調査時期・対象が異なるため厳密には接続しない——調査の解説に明記）。2018年1～3月期から「失業者」（求職活動期間1か月）を含む区分に変更。",
      en: "Annual averages from the detailed tabulation (≈1/4 subsample of the basic survey). The non-regular share uses employees excluding executive officers as denominator, as published. The detailed tabulation began in January 2002; before that the Special Survey of the LFS covered similar items with different timing and frames — not strictly continuous (per the official handbook). From Q1 2018 the 'unemployed' definition widened to a one-month search window.",
    },
    limitations: {
      ja: "2002年より前の比較可能な系列は公表されていない（特別調査の原系列はオンラインで入手不可）。このため本章の非正規系列は2002年開始とし、1984–2001年は本文でのみ言及。",
      en: "No comparable pre-2002 series is published (the Special Survey raw series is no longer online). This chapter's non-regular series therefore starts in 2002; 1984–2001 are discussed in the text only.",
    },
    evidenceFile: "research/chapter04/raw/statb-lf/est-000021915917.xlsx",
  },
  {
    id: "statb-lfs-2025-overview",
    organization: {
      ja: "総務省統計局（労働力調査）",
      en: "Statistics Bureau, MIC (Labour Force Survey)",
    },
    originalTitle: "労働力調査（基本集計）2025年（令和7年）平均結果の概要",
    displayTitle: {
      ja: "労働力調査 2025年平均結果の概要（表Ⅱ-1：非正規についた主な理由）",
      en: "LFS 2025 annual results overview (Table II-1: reasons for non-regular work)",
    },
    url: "https://www.stat.go.jp/data/roudou/sokuhou/nen/dt/pdf/gaiyou.pdf",
    sourceLanguage: "ja",
    publicationDate: "2026-10-02",
    referencePeriod: "2025 calendar-year averages",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国・男女）", en: "Japan (national, by sex)" },
    statisticalUnit: {
      ja: "万人・％（非正規の職員・従業員についた主な理由別の内訳と割合）",
      en: "10k persons and % (reasons for current non-regular employment)",
    },
    verification: "verified-primary",
    license: {
      ja: "総務省統計局の公表資料。出典明示の上での引用・転載は統計局の利用規約に従います。",
      en: "Statistics Bureau publication; citation with attribution under the bureau's terms.",
    },
    methodologyNotes: {
      ja: "表Ⅱ-1の総数（2,128万人）には「現職の雇用形態についた主な理由不詳」を含むため、理由別の合計は総数に満たない（差＝不詳）。割合は理由別合計に占める割合。「正規の職員・従業員の仕事がないから」の比較可能な系列は2014年以降。",
      en: "The Table II-1 total (21.28 million) includes unstated reasons, so stated reasons sum below it; shares are of stated reasons. The comparable series for 'no regular job available' starts in 2014.",
    },
    limitations: {
      ja: "理由は単一回答であり、複数の事情の重み付けは測らない。",
      en: "A single main reason per person; it does not weigh multiple circumstances.",
    },
    evidenceFile: "research/chapter04/raw/statb-lf/lf2025-gaiyou.pdf",
  },
  {
    id: "mhlw-mls-longrun",
    organization: {
      ja: "厚生労働省（毎月勤労統計調査・e-Stat）",
      en: "MHLW (Monthly Labour Survey via e-Stat)",
    },
    originalTitle: "毎月勤労統計調査 全国調査結果（実数・指数累積データ・実数）",
    displayTitle: {
      ja: "毎月勤労統計調査 実数累積データ（1970年／1990年–2025年・年平均）",
      en: "Monthly Labour Survey cumulative actuals (1970/1990–2025, annual averages)",
    },
    url: "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000032189776&fileKind=0",
    sourceLanguage: "ja",
    publicationDate: "2026-10-23",
    referencePeriod: "1970–2025 calendar-year averages (30+); 1990–2025 (5+); 1993–2025 (general vs part-time)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国・民営非一次産業）", en: "Japan (national, private non-primary industries)",
    },
    statisticalUnit: {
      ja: "時間/月・日/月・人（総実労働時間、所定内・所定外労働時間、出勤日数、月末労働者数、パートタイム労働者数）",
      en: "hours/month, days/month, persons (total/scheduled/overtime hours, days worked, month-end workers, part-time workers)",
    },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典明示の上での引用は厚労省の利用規約に従います。原資料は再配布していません。",
      en: "MHLW publication; citation with attribution under MHLW terms. Raw files are not redistributed.",
    },
    methodologyNotes: {
      ja: "調査産業計・年平均（月平均）。規模5人以上は1990年以降、30人以上は1970年以降、就業形態別（一般／パートタイム）は1993年以降の公表。2018年1月に標本の部分入替えとパートタイム労働者の扱い変更があった。2024年1月分確報時に労働者数推計のベンチマーク更新（2021年経済センサス基準）が行われ、指数の前年比は参考値と比較して算出（原数値とは一致しない）。パートタイム比率は月末労働者数ベースの派生計算。",
      en: "All-surveyed-industry annual averages. 5+ from 1990, 30+ from 1970, employment-type split from 1993. January 2018 brought partial sample rotation and revised part-timer treatment. At the January 2024 final release the worker-count benchmark updated to the 2021 Economic Census, with YoY ratios computed against adjusted reference values (they need not match raw index changes). The part-time ratio is derived from month-end worker counts.",
    },
    limitations: {
      ja: "事業所規模5人以上の民営非一次産業が対象で、公務員・自営業主を含まない。集約平均には就業構成の変化（パート比率の上昇）が含まれる。",
      en: "Covers private non-primary establishments with 5+ employees; civil servants and the self-employed are excluded. Aggregate averages embed composition shifts (rising part-time share).",
    },
    evidenceFile: "research/chapter04/raw/mhlw/mls-longterm-jissu-table1.utf8.csv",
  },
  {
    id: "mhlw-shugyojoken-r7",
    organization: {
      ja: "厚生労働省（就労条件総合調査）",
      en: "MHLW (General Survey on Working Conditions)",
    },
    originalTitle: "令和7年就労条件総合調査 結果の概況（時系列11～13表）",
    displayTitle: {
      ja: "就労条件総合調査2025（年次有給休暇の付与・取得・取得率 1984–2025年調査）",
      en: "2025 General Survey on Working Conditions (paid leave granted/taken/rate, surveys 1984–2025)",
    },
    url: "https://www.mhlw.go.jp/stf/houdou/newpage_74476.html",
    sourceLanguage: "ja",
    publicationDate: "2026-06-19",
    referencePeriod: "Surveys 1984–2025; R13+ surveys cover the preceding calendar year (2025 survey = calendar 2024)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（民営企業・常用労働者30人以上）", en: "Japan (private enterprises with 30+ regular employees)" },
    statisticalUnit: {
      ja: "日・％（労働者1人平均の付与日数・取得日数・取得率）",
      en: "days and % (per-worker average granted days, days taken, acquisition rate)",
    },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典明示の上での引用は厚労省の利用規約に従います。",
      en: "MHLW publication; citation with attribution under MHLW terms.",
    },
    methodologyNotes: {
      ja: "取得率＝取得日数計÷付与日数計×100（付与日数は繰越を除く）。年次の定義：平成13年以降の調査は調査年1月1日時点の前年1年間、平成11年以前は調査年（12月31日時点）の1年間（旧賃金労働時間制度等総合調査）。平成20年に対象を「常用30人以上の会社組織の民営企業」へ拡大、平成27年に「常用30人以上の民営法人」＋複合サービス事業を包含。2025年調査の調査客体数6,448・有効回答率59.2%。",
      en: "Acquisition rate = total days taken ÷ total days granted ×100 (granted excludes carry-overs). Year convention: from the 2001 survey the reference is the preceding calendar year (2025 round = calendar 2024); through 1999 it was the survey year itself. The frame widened in 2008 (30+ employee incorporated private enterprises) and 2015 (30+ private juridical persons incl. composite services). The 2025 round surveyed 6,448 enterprises with a 59.2% response rate.",
    },
    limitations: {
      ja: "企業の総括回答に基づく推計であり、勤務条件の個人差は見えない。1989年の調査なし。",
      en: "Enterprise-level summary estimates; individual variation is invisible. No 1989 survey.",
    },
    evidenceFile: "research/chapter04/raw/mhlw/sw-r07-gaikyou.pdf",
  },
  {
    id: "mhlw-chinginkouzou-r7",
    organization: {
      ja: "厚生労働省（賃金構造基本統計調査）",
      en: "MHLW (Basic Survey on Wage Structure)",
    },
    originalTitle: "令和7年賃金構造基本統計調査 結果の概況（第1・2・6-1表、付表1・2）",
    displayTitle: {
      ja: "賃金構造基本統計調査2025（賃金・格差・年齢カーブ・1976年–2025年）",
      en: "2025 Basic Survey on Wage Structure (wages, gaps, age curves, 1976–2025)",
    },
    url: "https://www.mhlw.go.jp/toukei/itiran/roudou/chingin/kouzou/z2025/index.html",
    sourceLanguage: "ja",
    publicationDate: "2026-07-08",
    referencePeriod: "June 2025 survey; supplementary tables 1976–2025",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（民営事業所・10人以上）", en: "Japan (private establishments with 10+ employees)" },
    statisticalUnit: {
      ja: "千円/月・比率（きまって支給する賃金、女性/男性比率、正社員以外/正社員比率）",
      en: "¥1,000/month and ratios (scheduled cash earnings; female/male and non-regular/regular ratios)",
    },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典明示の上での引用は厚労省の利用規約に従います。",
      en: "MHLW publication; citation with attribution under MHLW terms.",
    },
    methodologyNotes: {
      ja: "一般労働者（1週の所定労働時間が短時間労働者より長い労働者）のきまって支給する賃金（所定内＋所定外）。男女間賃金格差は男=100、雇用形態間格差は正社員・正職員=100（2005年以降公表）。平成30年以前は「バー，キャバレー，ナイトクラブ」を調査対象から除外。令和2年から有効回答率を考慮した推計方法に変更（令和元年再計値を参考値として併記）。未調整の格差であり、勤続年数・就業構造の影響を含む。",
      en: "Scheduled cash earnings (scheduled + non-scheduled) of general workers (longer scheduled hours than short-hour employees). Gender ratio male=100; form ratio regular=100 (published from 2005). Bars/cabarets/night clubs were excluded through 2018. From 2020 the estimation accounts for response rates (2019 restated values quoted as reference). The gaps are unadjusted — they embed tenure and employment-structure differences.",
    },
    limitations: {
      ja: "同一労働・同一賃金の評価には、職務・勤続年数・雇用形態を調整した分析が必要で、この調査の未調整格差では測れない。",
      en: "Assessing equal pay for equal work requires adjusted analysis; the survey's unadjusted gaps cannot measure it.",
    },
    evidenceFile: "research/chapter04/raw/mhlw/chingin-kouzou-r7/ck-r7-14.txt",
  },
  {
    id: "mhlw-rousai-2025",
    organization: {
      ja: "厚生労働省労働基準局（労働災害統計）",
      en: "MHLW Labour Standards Bureau (occupational accident statistics)",
    },
    originalTitle: "令和7年労働災害発生状況について（死亡者数・休業4日以上死傷者数の長期的推移）",
    displayTitle: {
      ja: "労働災害発生状況2025（死亡・死傷の長期系列 1974–2025年）",
      en: "Occupational accident statistics 2025 (long-run fatalities and injuries, 1974–2025)",
    },
    url: "https://www.mhlw.go.jp/stf/houdou/newpage_74476.html",
    sourceLanguage: "ja",
    publicationDate: "2026-05-27",
    referencePeriod: "1974–2025 (2025 final as of reports through 2026-04-07)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国・全産業）", en: "Japan (national, all industries)" },
    statisticalUnit: {
      ja: "人（死亡者数、休業4日以上の死傷者数）",
      en: "persons (fatalities; injuries with 4+ lost workdays)",
    },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典明示の上での引用は厚労省の利用規約に従います。",
      en: "MHLW publication; citation with attribution under MHLW terms.",
    },
    methodologyNotes: {
      ja: "出典（公式注記）：平成23年までは労災保険給付データ（労災非適用事業を含む）・労働者死傷病報告・死亡災害報告より作成、平成24年からは労働者死傷病報告・死亡災害報告より作成。2020年以降の値は新型コロナウイルス感染症へのり患による労働災害を除く（2020年：131,156→125,115、2021年：149,918→130,586）。本章の系列は、4つの公式公表のグラフ数値ラベルを復元し、2002–2025年を独立の公表値（別表2・報道本文・確定値表）で、1998・2008・2015年を年報確定値ファイルで直接検証した（検証記録は notes/mhlw-summary.md）。",
      en: "Official source note: through 2011 the series combines workers'-comp benefit data (including non-covered establishments), worker casualty reports and fatality reports; from 2012 it uses casualty and fatality reports only. Values from 2020 exclude COVID-infection cases (2020: 131,156→125,115; 2021: 149,918→130,586). The series used here reconstructs the data labels of four official chart renderings, with 2002–2025 verified against independent published tables (appendix tables, press text, final-value files) and 1998/2008/2015 against year-file totals (verification trail in notes/mhlw-summary.md).",
    },
    limitations: {
      ja: "1974–2011年の死傷系列は保険給付ベースを含む集計であり、2012年以降とは手法上の断絶がある（出典が明示する通り）。労災認定件数は被災の全体を表さない。",
      en: "The 1974–2011 injury series includes insurance-benefit data — a methodological break against 2012+ (as the source itself states). Recognized-compensation counts do not measure the full burden of harm.",
    },
    evidenceFile: "research/chapter04/raw/mhlw/rousai-houdou-2025-sankou.pdf",
  },
  {
    id: "mhlw-karoshi-r7",
    organization: {
      ja: "厚生労働省（過労死等の労災補償状況）",
      en: "MHLW (karoshi and related compensation statistics)",
    },
    originalTitle: "令和7年度「過労死等の労災補償状況」を公表します（別添資料2 業務災害に係る精神障害に関する事案の労災補償状況）",
    displayTitle: {
      ja: "過労死等の労災補償状況2025年度（精神障害の請求・決定・支給決定 2018–2025年度）",
      en: "Karoshi compensation statistics FY2025 (mental-health claims, decisions, grants FY2018–2025)",
    },
    url: "https://www.mhlw.go.jp/content/11402000/001723467.pdf",
    sourceLanguage: "ja",
    publicationDate: "2026-06-17",
    referencePeriod: "FY2018–FY2025 (April–March fiscal years)",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "日本（全国）", en: "Japan (national)" },
    statisticalUnit: {
      ja: "件（請求件数、決定件数、支給決定件数、認定率）",
      en: "cases (claims, decisions, grants, recognition rate)",
    },
    verification: "verified-primary",
    license: {
      ja: "厚生労働省の公表資料。出典明示の上での引用は厚労省の利用規約に従います。",
      en: "MHLW publication; citation with attribution under MHLW terms.",
    },
    methodologyNotes: {
      ja: "労働基準法施行規則別表第1の2第9号に係る精神障害についての集計。請求件数は当該年度中の請求（同年度中に決定されるとは限らない）。決定件数は当該年度中の支給・不支給決定の計で前年度以前の請求分を含む。支給決定件数は「業務災害」と認定した件数。自殺は未遂を含む。（ ）内は女性の内数。認定率＝支給決定÷決定。",
      en: "Covers mental disorders under item 9 of the Ordinance's supplementary table 1-2. Claims are lodged within the fiscal year (not necessarily decided then); decisions include claims from earlier years; grants are cases recognized as work-related. Suicide includes attempts. Recognition rate = grants ÷ decisions.",
    },
    limitations: {
      ja: "請求・認定は制度上の発生の下限であり、潜在被害の規模を測らない。認定率の年度差は申請構成の変化も反映する。",
      en: "Claims and recognitions are a floor for incidence, not a measure of the underlying burden; year-to-year recognition-rate shifts also reflect changing claim composition.",
    },
    evidenceFile: "research/chapter04/raw/mhlw/karoshi-r7-mental.pdf",
  },
  {
    id: "oecd-els-sae",
    organization: {
      ja: "OECD（雇用・労働・社会的包摂局）",
      en: "OECD (Directorate for Employment, Labour and Social Affairs)",
    },
    originalTitle: "Average annual hours actually worked per worker (DSD_HW@DF_AVG_ANN_HRS_WKD), temporary employment (DSD_TEMP@DF_TEMP_I), gender wage gap (DSD_EARNINGS@GENDER_WAGE_GAP)",
    displayTitle: {
      ja: "OECD SDMX：年間実労働時間・臨時雇用比率・男女賃金格差（2026-10-26取得）",
      en: "OECD SDMX: annual hours worked, temporary employment, gender wage gap (fetched 2026-10-26)",
    },
    url: "https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_HW@DF_AVG_ANN_HRS_WKD/...",
    sourceLanguage: "en",
    publicationDate: "2026-10-26",
    referencePeriod: "Hours: 1970–2025; temporary employment: 1980–2025; gender gap: 1975–2025",
    accessDate: "2026-10-26",
    geographicCoverage: { ja: "OECD加盟13経済圏＋OECD平均", en: "13 OECD economies plus the OECD average" },
    statisticalUnit: {
      ja: "時間/年・人（1人当たり年間実労働時間）、％（臨時雇用比率、男女賃金格差）",
      en: "hours/year per person (annual hours actually worked); % (temporary share; gender wage gap)",
    },
    verification: "verified-secondary",
    license: {
      ja: "OECDデータ。出典（OECD）を明示した上での再利用はOECD利用条件に従います。",
      en: "OECD data; reuse with attribution under the OECD terms and conditions.",
    },
    methodologyNotes: {
      ja: "年間実労働時間は「年間の総実労働時間÷年平均就業者数」。OECD公式注意書き：データはトレンド比較を意図しており、出典が国により異なるため同年の水準比較には適さない。パートタイム労働者も含む。臨時雇用比率は雇用者に占める割合で、日本の「非正規」とは概念が異なる（2018年1月の労働力調査改正による系列断絶あり）。男女賃金格差は男性中央値賃金に対する女性中央値賃金の差の割合（未調整）。",
      en: "Annual hours = total hours worked ÷ average employment. Official OECD caveat: intended for trend comparisons, unsuitable for level comparisons in a given year (sources differ); part-timers included. The temporary-employment share uses employees as denominator and is not equivalent to Japan's non-regular concept (with a documented break at the January 2018 LFS revision). The gender wage gap compares women's median earnings with men's (unadjusted).",
    },
    limitations: {
      ja: "水準の国際ランキングとしてではなく、趨勢の文脈として使用。OECD平均は加盟国の平均であり日本を含む。",
      en: "Used as trend context, not a level ranking. The OECD average includes Japan.",
    },
    evidenceFile: "research/chapter04/raw/oecd/oecd-hours-1.csv",
  },
];
