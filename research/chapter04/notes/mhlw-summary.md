# MHLW / Statistics Bureau — Chapter 04 research summary

Access/verification date: 2026-10-26 (UTC). All URLs fetched live with a browser UA.
Raw files under `raw/mhlw/` (SHA-256 in fetch manifest below). License: MHLW publications;
facts and fragment-length quotes with attribution; raw files NOT redistributed
(research/DATA-LICENSES.md).

---

## Source 1 — 毎月勤労統計調査 (Monthly Labour Survey) — working HOURS

- **Databank:** e-Stat 毎月勤労統計調査（全国調査）実数・指数累積データ (政府統計コード 00450071;
  tstat=000001011791). Listing page archived: `raw/mhlw/estat-mls-longterm-files.html`.
- **File 1:** 「実数・指数累積データ 実数」 statInfId=000032189776, updated 2026-10-23 (2026年8月分確報
  published 2026-10-23, consistent with Ch02 vintages) → saved `mls-longterm-jissu-table1.csv`
  (+ `.utf8.csv`), 20,6971 rows.
  - Columns (1-based): 1 種別, 2 年, 3 月, 4 産業分類, 5 規模, 6 就業形態, 7 現金給与総額,
    8 きまって支給する給与, 9 所定内給与, 10 所定外給与, 11 特別給与, **12 総実労働時間,
    13 所定内労働時間, 14 所定外労働時間**, 15 出勤日数, 16-19 労働者数, 20 パートタイム労働者数.
  - Codes (from `mls-longterm-symbols.pdf`): 月 `CY`=年平均; 産業 `TL`=調査産業計;
    規模 `T`=事業所規模5人以上(1990–), `0`=30人以上(1970–), `4`=500+, `5`=100–499, `7`=30–99, `9`=5–29;
    就業形態 `0`=計, `1`=一般労働者, `2`=パートタイム労働者.
- **File 2:** 「実数・指数累積データ 指数・伸び率」 statInfId=000032189777 → `mls-longterm-index-table2.csv` (not used for Ch04 charts).
- **Key verbatim values (年平均, 調査産業計):**
  - 規模T (5人以上): 1990: 総実172.0/所定内159.0/所定外13.0h; 2000: 154.4/144.6/9.8;
    2010: 146.2/136.2/10.0; 2019: 139.1/128.5/10.6; 2020: 135.1/125.9/9.2; 2023: 136.3/126.3/10.0;
    2024: 136.9/126.9/10.0; 2025: 135.1/125.3/9.8. パート比率 1990: 12.3% → 2019: 31.6% → 2025: 31.3% (derived from 本月末労働者数/パート).
  - 規模0 (30人以上): 1970–2025 (56 yrs) — used for the long view.
- Coverage caveat: 事業所規模5人以上の民営非一次産業; 2018-01 sample rotation & 2024-01 benchmark update
  affect worker counts/indices (Ch02 notes); actual-hours levels used here are as published.

## Source 2 — 就労条件総合調査 令和7年(2025) — paid leave + scheduled hours

- **Portal:** `sw-top-11-23.html` → latest round 「令和７(2025)年就労条件総合調査 結果の概況」
  (`sw-r07-index.html`, title verified). Files: `sw-r07-gaikyou.pdf` (概況, → .txt),
  `sw-r07-gaiyou01roudoujikan.pdf` (労働時間), `sw-r07-gaiyou02chingin.pdf` (賃金),
  `sw-r07-zuhyou.xlsx`, `sw-r07-graph.xlsx`.
- **Survey target** (概況 txt L47-87): 事業所母集団DB(令和4年次フレーム)の企業(単独事業所及び本社・本店・本所)
  のうち常用労働者30人以上を雇用する民営企業(医療法人・社会福祉法人・各種協同組合等の会社組織以外の法人を含む);
  調査客体数 6,448, 有効回答 3,820, **有効回答率 59.2%**.
- **年次有給休暇 時系列 (時系列11/12/13表, `sw-ts-yukyu-{fuyo,shutoku,shutokuritsu}.xls`, sheet `syuj-R7-1x`):**
  three row-bands per sheet (band1 rows 10-24: 昭和59年[1984]–平成15年[2003], cols 6-25, col 11 [1989] empty;
  band2 rows 32-53: 平成16-20年[2004-08] cols 6-10 + 平成21-31年[2009-19] cols 15-25;
  band3 rows 61-83: 令和2-7年[2020-25] cols 6-11). 調査産業計 取得率 (%):
  1984: 55.6, 1985: 51.6, 1986: 50.3, 1987: 50.2, 1988: 50.0, [1989: —], 1990: 51.5, 1991: 52.9,
  1992: 54.6, 1993: 56.1, 1994: 56.1, 1995: 53.9, 1996: 55.2, 1997: 54.1, 1998: 53.8, 1999: 51.8,
  2000: 50.5, 2001: 49.5, 2002: 48.4, 2003: 48.1, 2004: 47.4, 2005: 46.6, 2006: 47.1, 2007: 46.6,
  2008: 46.7, 2009: 47.4, 2010: 47.1, 2011: 48.1, 2012: 49.3, 2013: 47.1, 2014: 48.8, 2015: 47.6,
  2016: 48.7, 2017: 49.4, 2018: 51.1, 2019: 52.4, 2020: 56.3, 2021: 56.6, 2022: 58.3, 2023: 62.1,
  2024: 65.3, 2025: 66.9.
- **Headline (概況 (4) 年次有給休暇, txt L433-489):** 令和7年調査: 付与 18.1日(令和6年調査 16.9日),
  取得 12.1日(11.0日), 取得率 66.9%(65.3%) — 昭和59年以降最多・最高. 産業別: 電気・ガス・熱供給・水道業
  75.2% (最高), 宿泊業，飲食サービス業 50.7% (最低). 計画的付与制度あり企業 40.8% (2024調査 40.1%).
- **Reference-period convention (第2図 注2, verbatim):** 「年次については、平成13年以降は調査年（１月１日時点）
  の前年１年間の状況を表すものであり、平成11年以前は調査年（12月31日時点）１年間の状況を
  『賃金労働時間制度等総合調査』として取りまとめたものである。」→ 令和7年調査=2024年暦年の取得状況.
- **Scope changes (注3/4):** 平成20年から「常用労働者が30人以上の会社組織の民営企業」へ範囲拡大
  (平成19年以前=本社の常用労働者が30人以上); 平成27年より「30人以上の民営法人」+複合サービス事業を包含.
- 取得率 definition (注1): 取得日数計／付与日数計×100(%). 付与日数は繰越日数を除く.

## Source 3 — 労働災害 (occupational accidents) — long-run death/injury series

- **Primary document:** 「令和７年 労働災害発生状況について」(厚生労働省労働基準局安全衛生部安全課,
  令和8年5月27日付け報道発表) → `rousai-houdou-2025-sankou.pdf` (+ .txt, + -bbox.xml).
  Chart 「労働災害による死亡者数、休業４日以上の死傷者数の長期的な推移」 data labels extracted via
  `pdftotext -bbox-layout`; series 1974–2025 (52 points each; first tick = 昭和49年=1974).
- **Cross-validation documents (same chart, independent label layouts):**
  「令和５年…」`rousai-press-r05-betsuen.pdf` (1974–2023; published 令和6年5月27日);
  「令和２年…」`rousai-press-r02-betsuen.pdf` (1974–2020; 令和3年4月30日);
  「令和６年…」`rousai-s24-16.pdf` (1974–2024; 令和7年5月30日).
- **Death series (死亡者数, 人) 1974–2025** — assignment method: x-sorted label rank order, verified by:
  (a) text anchors 2017=978, 2018=909, 2019=845 (平成31/令和元年分析 doc `rousai-s19-16.pdf` p2: 「845人
  （前年比64人・7.0％減、平成29年比133人・13.6％減）と２年連続で過去最少」), 2020=784 & 2021=778
  (令和3年分析 `rousai-s21-16.pdf` p2: 867−COVID89=778; 令和2年 802−18=784), 2023=755 & 2024=746
  (`rousai-s24-16.txt` R5/R6比較), 2024=746 & 2025=700 (2025 doc R6/R7比較 ▲46人▲6.2%; 確定値
  `rousai-25-16.xlsx` 全産業 700/746 as of 令和8年4月7日);
  (b) year-file anchors: 2015=972 (`y h27_sibou(kakutei).xls` 合計行 c48=972), 2008=1,268
  (`y h20_sibou(kakutei).xls`), 1998=1,844 (`y h10_sibou(kakutei).xls`); (c) tick-position agreement
  in ≥2 renderings for every year.
  Values: 1974: 3,725 | 1975: 4,330 | 1976: 3,345 | 1977: 3,302 | 1978: 3,326 | 1979: 3,077 |
  1980: 2,912 | 1981: 3,009 | 1982: 2,674 | 1983: 2,588 | 1984: 2,635 | 1985: 2,572 | 1986: 2,318 |
  1987: 2,342 | 1988: 2,549 | 1989: 2,419 | 1990: 2,550 | 1991: 2,489 | 1992: 2,354 | 1993: 2,245 |
  1994: 2,301 | 1995: 2,414 | 1996: 2,363 | 1997: 2,078 | 1998: 1,844 | 1999: 1,992 | 2000: 1,889 |
  2001: 1,790 | 2002: 1,658 | 2003: 1,628 | 2004: 1,620 | 2005: 1,514 | 2006: 1,472 | 2007: 1,357 |
  2008: 1,268 | 2009: 1,075 | 2010: 1,195 | 2011: 1,024 | 2012: 1,093 | 2013: 1,030 | 2014: 1,057 |
  2015: 972 | 2016: 928 | 2017: 978 | 2018: 909 | 2019: 845 | 2020: 784 | 2021: 778 | 2022: 774 |
  2023: 755 | 2024: 746 | 2025: 700.
- **Injury series (休業4日以上死傷者数, 人) 1974–2025** — same method; anchors: 2012-2019 = 別表2 of
  s19/s21 analysis docs (2012: 119,576 / 2013: 118,157 / 2014: 119,535 / 2015: 116,311 / 2016: 117,910 /
  2017: 120,460 / 2018: 127,329 / 2019: 125,611 — also 派遣労働者表 別表8 cross-verified); 2020=125,115 &
  2021=130,586 (chart excludes COVID: 131,156−6,041 & 149,918−19,332; 別表9 全業種計 COVID injuries 2021
  = 19,332; 別表8 全労働者 2020=131,156, 2021=149,918); 2023=135,371, 2024=135,718, 2025=135,333
  (press texts: R5/R6 +347人, R6/R7 ▲385人); 2015=116,311 (year file 合計 c48).
  Values: 1974: 347,407 | 1975: 322,322 | 1976: 345,293 | 1977: 333,311 | 1978: 348,826 | 1979: 340,731 |
  1980: 312,844 | 1981: 335,706 | 1982: 294,319 | 1983: 278,623 | 1984: 271,884 | 1985: 257,240 |
  1986: 246,891 | 1987: 232,953 | 1988: 217,964 | 1989: 226,318 | 1990: 210,108 | 1991: 200,633 |
  1992: 189,589 | 1993: 181,900 | 1994: 176,047 | 1995: 167,316 | 1996: 162,862 | 1997: 156,726 |
  1998: 148,248 | 1999: 137,316 | 2000: 133,948 | 2001: 133,598 | 2002: 125,918 | 2003: 125,750 |
  2004: 122,804 | 2005: 120,354 | 2006: 121,378 | 2007: 121,356 | 2008: 119,291 | 2009: 105,718 |
  2010: 107,759 | 2011: 114,176 | 2012: 119,576 | 2013: 118,157 | 2014: 119,535 | 2015: 116,311 |
  2016: 117,910 | 2017: 120,460 | 2018: 127,329 | 2019: 125,611 | 2020: 125,115 | 2021: 130,586 |
  2022: 132,355 | 2023: 135,371 | 2024: 135,718 | 2025: 135,333.
  (*Chart 2011 = 114,176 is the insurance-based compilation; the 死傷病報告-based 別表2 value for 2011
  = 117,958 — chart uses insurance-based ≤2011 per the 出典 note: 「平成23年までは、労災保険給付データ
  （労災非適用事業を含む）、労働者死傷病報告、死亡災害報告より作成。平成24年からは、労働者死傷病報告、
  死亡災害報告より作成」.)
  Method note: in the dense plateau (~1998-2014) chart labels sit systematically ~10-14px LEFT of their
  true year ticks (verified: death 1,844's label sits on 1997's tick while the 1998 year-file proves
  its year is 1998; death 1,268's label sits near 2007's tick while the 2008 year-file proves 2008).
  The x-sorted RANK assignment is immune to this shift and is directly anchored by the death year-files
  (1998/2008/2015) which share the same axis. The 2009 Lehman-year drop (105,718 after 119,291) mirrors
  the anchored death drop (1,075 after 1,268) — consistent timing.
  Residual risk: pre-2012 injury values are chart-label reconstructions (dense-region label offsets
  resolved by 3-rendering cross-reference); mid-history deaths verified at 1998/2008/2015; single
  ambiguity pair (1988/1989 injuries) resolved by 2-of-3 x-order + unanimous tick proximity
  (1988: 217,964 / 1989: 226,318).
- **※新型コロナウイルス感染症へのり患による労働災害を除いたもの。** (chart note — applies to
  2020+ injury/death values as rendered in 2023+ docs.)
- **労働災害動向調査 (establishments 100+):** `rousai-doukou-2025-kekka.pdf/.txt` — 令和7年 度数率 2.01
  (前年 2.10), 強度率 0.09, 死傷者1人平均労働損失日数 45.7日; series 平成23(2011)–令和7(2025):
  度数率 1.62,1.59,1.58,1.66,1.66,1.83,1.80,1.95,2.06,2.09,2.14,2.10,2.01 (per 第1-1図 labels).
  Coverage: 事業所規模100人以上 — NOT comparable to the national 死傷者数 series.

## Source 4 — 精神障害等の労災補償状況 (mental-health workers' comp)

- **Documents:** 令和7年度「過労死等の労災補償状況」(published 2026; press `newpage_74476.html`
  → `karoshi-r7-mental.pdf` [別添資料2 表2-1, 図2-1] and `karoshi-r7-brain.pdf` [別添資料1]);
  令和5年度版 `karoshi-r5-mental.pdf`; 令和4年度版 `karoshi-r4-mental.pdf` (図2-1 covers FY2018-2022).
- **精神障害 (業務災害, 年度, 件):** FY2018: 請求1,820/決定1,461/支給465 | FY2019: 2,060/1,586/509 |
  FY2020: 2,051/1,906/608 | FY2021: 2,346/1,953/629 (認定率32.2%) | FY2022: 2,683/1,986/710 (35.8%) |
  FY2023: 3,575/2,583/883 (34.2%) | FY2024: 3,780/3,496/1,056 (30.2%) | FY2025: 4,958/3,839/1,082 (28.2%).
  Overlap FY2021-2022 identical across R4/R7 docs ✓. Notes (verbatim, 表2-1 注): 請求件数=当該年度中の
  労災保険給付の請求件数(同年度中に決定されるとは限らない); 決定件数=当該年度中の支給・不支給決定の計
  (前年度以前請求分を含む); 支給決定件数=「業務災害」と認定した件数; 自殺は未遂を含む.
- **脳・心臓疾患 (FY2021-2025):** 請求 753/803/1,023/1,030/1,254; 決定 525/509/667/784/811;
  支給 172/194/216/241/217 (認定率 32.8/38.1/32.4/30.7/26.8%).

## Source 5 — 賃金構造基本統計調査 令和7年(2025) — wage gaps

- **Portal:** `chinginkouzou.html` → 令和7年結果の概況 `z2025/index.html`; files saved under
  `chingin-kouzou-r7/`: `ck-r7-{01,02,06,07,14}.pdf` (+.txt) and `ck-r7-zuhyo.xlsx` (表1-13, 図1-9).
- **Survey population:** 民営事業所(10人以上? — 付表1 注1: 10人以上の常用労働者を雇用する民営事業所に
  関する集計は昭和51年以降) — 一般労働者 (短時間労働者は別掲).
- **男女間賃金格差 (男=100), 一般労働者, 付表1 (1976–2025):** 1976: 58.8 | 1980: 58.9 | 1985: 59.6 |
  1990: 60.2 | 1995: 62.5 | 2000: 65.5 | 2005: 65.9 | 2010: 69.3 | 2015: 72.2 | 2020: 74.3 |
  2025: 76.6 (女性 285.9千円 vs 男性 373.4千円; 男女計 340.6千円). Full annual series 1976-2025 in
  `ck-r7-14.txt` L993-1065. Notes: 平成30年以前は「バー，キャバレー，ナイトクラブ」除外; 令和2年から
  有効回答率を考慮した推計方法に変更 (令和元年再計値 74.3 = 同一).
- **雇用形態間賃金格差 (正社員・正職員=100), 付表2 (2005–2025, 一般労働者):** 男女計:
  2005: 60.1 (318.5 vs 191.4千円) | 2010: 63.6 | 2015: 63.9 | 2020: 66.3 | 2023: 67.4 | 2024: 66.9 |
  2025: 67.4 (358.8 vs 241.7千円). 男性 2025: 69.2 (387.4 vs 268.1); 女性 2025: 71.6 (304.9 vs 218.4).
- **2025 年齢階級別 雇用形態間格差 (第6-1表):** ～19歳: 88.4 | 20-24: 82.2 | 25-29: 80.0 | 30-34: 72.8 |
  35-39: 65.3 | (格差は年齢とともに拡大).
- **賃金カーブ (第2表, 2025):** 男性 55-59歳 445.6千円(20-24歳=181.4)でピーク; 女性 45-49/55-59歳
  305.7千円(127.6). Wages = きまって支給する賃金(所定内+所定外), monthly, 千円.

## Source 6 — 能力開発基本調査 令和7年度 (career development)

- **Document:** 「令和７年度『能力開発基本調査』の結果を公表します」(newpage_00233.html, published 2026)
  → `noryoku-r7/noryoku-r7-gaiyou.pdf` (参考1 調査結果の概要).
- Key items for section G: 図1-3 OFF-JT・自己啓発支援費用支出企業割合 (自己啓発支援支出企業 ~24-28%);
  図6/7 正社員 vs 正社員以外の教育訓練費用実績; 自己啓発を行った労働者割合 (正社員 30.2% / 正社員以外 17.6%).
  Survey: 民営企業(30人以上? — 用語の説明参照), 年度ベース.

---

## Statistics Bureau (e-Stat) Labour Force Survey — see notes in extraction pipeline

Raw files: `raw/statb-lf/est-000001082681.xlsx` (長期表2 就業状態別15歳以上人口 1953-2025 年平均),
`est-000001082682.xlsx` (長期表3 年齢5歳階級別 1968-), `est-000021915917.xlsx` (詳細集計 長期表10-1
雇用形態別 2002-2025 by sex/age), `statb-2025avg-900100.xlsx` (2025年平均 雇用形態・年齢階級別役員を除く雇用者),
`statb-2025avg-900300.xlsx` (非正規についた主な理由別), `lf2025-gaiyou.pdf` (2025年平均結果の概要),
`hndbk-main.pdf`/`hndbk-app.pdf` (労働力調査の解説).

## FAILURES / limitations

- 労働力調査特別調査 (pre-2002 employment-form) raw time series: NOT retrievable — e-Stat 年報 databank
  facets render server-side empty (tstat=000001226891 cycle/tclass expansions return 0 cards);
  stat.go.jp /tokubetu/ 404; NDL WARP & Wayback have no snapshots → pre-2002 non-regular series NOT
  charted (limitation disclosed in chapter).
- anst00_r07.html (anzeninfo 令和7年 page) 404s (site bug); r07 equivalent data obtained from the
  mhlw.go.jp press + 25-16.xlsx instead.
- h02 (1990) & h10 (1998) 死傷 year files 404 (naming differs for old years); h10 死亡 file verified instead.
