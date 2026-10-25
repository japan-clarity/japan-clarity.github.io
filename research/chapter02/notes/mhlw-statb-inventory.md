# MHLW 毎月勤労統計調査 + 統計局 労働力調査/科学技術研究調査 — Acquisition & Structure Inventory (Task 2-b)

- **Project:** Japan Clarity, Chapter 02 (Economy & Industry)
- **Datasets:** (A) MHLW 毎月勤労統計調査（全国調査）— nominal/real wage & hours index series; (B) 総務省統計局 労働力調査 長期時系列データ — employment by industry; (C) 総務省統計局 科学技術研究調査 — R&D expenditure incl. 対GDP比
- **Download window:** 2026-10-25 (sandbox session), `curl -sS --max-time 60`
- **Local dirs:** `/home/z/jc-ch02/research/chapter02/raw/mhlw/`, `/home/z/jc-ch02/research/chapter02/raw/statb/`
- **Scope note:** structure inventory only. No statistics were extracted to JSON and no values are interpreted here; numeric excerpts below are verbatim renderings of file structure/page text.
- **Encoding note (correction to task tech note):** `www.mhlw.go.jp/toukei/list/*` and `/toukei/itiran/roudou/monthly/*` pages are **Shift_JIS** (decode with `iconv -f SHIFT_JIS -t UTF-8`), BUT `/toukei/itiran/index.html` (厚生労働統計一覧) and `/toukei/saikin/index.html` (最近公表の統計資料) are **UTF-8**. All `www.stat.go.jp` pages confirmed Shift_JIS. Shift_JIS originals are kept alongside `*.utf8.html` decoded copies for every key page.

---

## Goal A — MHLW 毎月勤労統計調査（全国調査）

### A.0 Navigation trail & publication dates

| Page | URL | Title (verbatim) | Publication date shown |
|---|---|---|---|
| Survey top | https://www.mhlw.go.jp/toukei/list/30-1.html | `毎月勤労統計調査（全国調査・地方調査）｜厚生労働省` | 過去情報 section `dateCH("2026","10","23")` |
| 結果の概要 index | https://www.mhlw.go.jp/toukei/list/30-1a.html | `毎月勤労統計調査（全国調査・地方調査） 結果の概要｜厚生労働省` | — (monthly list r08=2026 … r02=2020; 年結果・年度結果 section) |
| 過去の結果の概要 | https://www.mhlw.go.jp/toukei/list/30-1k.html | `毎月勤労統計調査（全国調査・地方調査）　過去の結果の概要｜厚生労働省` | — (monthly back to 平成9年=1997; annual back to 平成9年分) |
| Latest monthly 速報 | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r08/2608p/2608p.html | `毎月勤労統計調査　2026（令和8）年８月分結果速報｜厚生労働省` | **`2026（令和8）年10月７日`** (on page) — also `2026年10月7日掲載` on 最近公表 index |
| Latest monthly 確報 | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r08/2608r/2608r.html | `毎月勤労統計調査　2026（令和８）年８月分結果確報｜厚生労働省` | **`2026（令和8）年10月23日`** (on page) — marked `NEW` on 最近公表 index |
| 2025 annual 確報 | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r07/25cr/25cr.html | `毎月勤労統計調査　2025（令和７）年分結果確報｜厚生労働省` | `2026年2月25日掲載` (最近公表 index) |
| 最近公表の統計資料 | https://www.mhlw.go.jp/toukei/saikin/index.html | `最近公表の統計資料｜厚生労働省` (UTF-8) | source of all `…掲載` dates above |

**Latest reported month (recency citation): 2026年8月** — 速報 published 2026-10-07, 確報 published 2026-10-23. (2026年9月分 not yet published as of 2026-10-25.)

**Long-run route finding:** MHLW publishes **no single 1990–2025 長期時系列 file** for the MLS. The annual 年分結果確報 pages each attach 時系列第N表 Excel files that cover only a rolling ~8–13-year window (base year changes each 5 years). A long-run annual series must be **chained across vintage releases** (files below overlap at boundaries). Probed and rejected: `/toukei/list/30-11*.html`, `30-1g/t/u/v`, `/toukei/youran/`, `/toukei/tokeidb-links.html`, `/toukei/sonota/acquire_range.html` — none host long-series data. `30-1h.html` (`毎月勤労統計調査における「時系列比較のための推計値」等の公表について`) is a 2019 notice page, no data files.

### A.1 Download log (URL · HTTP status · bytes · sha256)

All files HTTP **200**, saved under `raw/mhlw/`. Format verified with `file`/openpyxl/xlrd.

| # | Local file | URL | Bytes | sha256 |
|---|---|---|---|---|
| 1 | `mls-2608p.html` (+`.utf8.html`) | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r08/2608p/2608p.html | 12,101 | `6ecf4a2a5955f4b1f20d4413940d72a3adf3ae695a9ccfb8a073c817f6f36706` |
| 2 | `mls-2608r.html` (+utf8) | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r08/2608r/2608r.html | 11,963 | `01ef7f8e7cdb99e156ce2a8dac6dc5fe58c577c9baaf58683e1d551cb97ee4ca` |
| 3 | `mls-2608p-gaiyo.pdf` (概況 PDF) | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r08/2608p/dl/pdf2608p.pdf | 946,715 | `49e00706d32e4fe461167504ea0f25e1f86fa20af8dfc30b1c219a74923a1850` |
| 4 | `2608t01p.xlsx` 時系列第1表 賃金指数 (速報) | …/r08/2608p/xls/2608t01p.xlsx | 25,944 | `5020eeb93f0ba278a025042702fc1176d6a33e983fdcbe69aa019c26a5bcc74a` |
| 5 | `2608t02p.xlsx` 時系列第2表 労働時間指数 (速報) | …/r08/2608p/xls/2608t02p.xlsx | 23,896 | `169e555f83fb1e47acd393e99bcaf9302c39403058a482666a5eaa84d862c139` |
| 6 | `2608t06p.xlsx` 時系列第6表 各国公表による主要国の実質賃金 (速報) | …/r08/2608p/xls/2608t06p.xlsx | 22,175 | `fa9855f4c254bff81c6c62f20ab6389b395fc7b2da7acb2ed8f29ef03ff0d642` |
| 7 | `2608t01r.xlsx` 時系列第1表 賃金指数 (確報) | …/r08/2608r/xls/2608t01r.xlsx | 25,978 | `8ca36322d39d40845319fbeb4e177cfdf46959cb015f73351410b44cb04defc5` |
| 8 | `2608t02r.xlsx` 時系列第2表 労働時間指数 (確報) | …/r08/2608r/xls/2608t02r.xlsx | 23,903 | `fe3259c6330d886cdf803a4f8020c8b66cb372061cb0b0384948b1de7a6ffc7e` |
| 9 | `25ct01r.xlsx` 時系列第1表 賃金指数 (2025年分確報) | …/r07/25cr/xls/25ct01r.xlsx | 28,546 | `96c1cf4e74c223ffe7f74cc1fbb2d4dbd6eb0ab5a7d12f91da3dc76d175551e6` |
| 10 | `25ct02r.xlsx` 時系列第2表 労働時間指数 (2025年分確報) | …/r07/25cr/xls/25ct02r.xlsx | 26,543 | `cbc96fc051782c2e86375a52a061bfebf62e016dfb1fb4b981321fb8d06e7722` |
| 11 | `29ct01r.xls` 時系列第1表 賃金指数 (平成29年分確報) | …/29/29r/dl/29ct01r.xls | 45,568 | `9411839fcc95df09f467d182a6a499633f40beeb073d00c0aa333adedbfa8295` |
| 12 | `29ct02r.xls` 時系列第2表 労働時間指数 (平成29年分確報) | …/29/29r/dl/29ct02r.xls | 45,056 | `76fcecbdd66df31f6044f9cac17133ea7a808781119ee9ea9c4f77e93bc6eb13` |
| 13 | `29ct06r.xls` 時系列第6表 実質賃金指数 (平成29年分確報) | …/29/29r/dl/29ct06r.xls | 40,960 | `f2f802c9c317da4db77a3e4857e838d96195536214f8e4f7e0bbce842119f785` |
| 14 | `27t01r.xls` 時系列第1表 賃金指数 (平成27年分確報) | …/27/27r/dl/27t01r.xls | 33,280 | `741a4cad006aa15f360898bc94cfb996077d7eee348a386cd6dfd98886d4832b` |
| 15 | `27t02r.xls` 時系列第2表 労働時間指数 (平成27年分確報) | …/27/27r/dl/27t02r.xls | 32,768 | `973265711b7d939640ccb43e23905b2915522f6816785e2d131d6a606fd31802` |
| 16 | `27t06r.xls` 時系列第6表 実質賃金指数 (平成27年分確報) | …/27/27r/dl/27t06r.xls | 27,648 | `15d1771e79ae1f2d1eec7273bf49cb86a56b694de21d8576cd97b73bf23d1f1c` |
| 17 | `19t01r.xls` 時系列表第1表 賃金指数 (平成19年分確報) | …/19/19fr/xls/19t01r.xls | 24,064 | `d4fc7841b3b7d181cf06f403eb8ff74a3f7882bacb50d9dc8b533d2ed0e711d5` |
| 18 | `19t02r.xls` 時系列表第2表 労働時間指数 (平成19年分確報) | …/19/19fr/xls/19t02r.xls | 23,552 | `611b18371671315f6df270cab1454bca1c1cff306d41c62c9aa01f2ccddb0cc3` |
| 19 | `19t06r.xls` 時系列表第6表 実質賃金指数 (平成19年分確報) | …/19/19fr/xls/19t06r.xls | 18,944 | `92724892a1caee759120763dfd1aab705ab3d3f5a727928f521a951301714191` |
| 20 | `mls-h11annual.html` (+utf8) 平成11年分結果確報 index | https://www.mhlw.go.jp/www2/kisya/daijin/20000217_02_d/mk11r.html | 16,093 | `34013452a8de0dea2fa05649d1942c4ccba4d6b9f9032362c1ce4f6c47e19df8` |
| 21 | `mls-h11-t01.html` (+utf8) 時系列表第1表 賃金指数 (HTML table) | …/www2/kisya/daijin/20000217_02_d/11t01r.html | 26,049 | `9d8aed03abc22eefcf722e4caa2485c9c76724e79ce77ed3770fad586b4ffaac` |
| 22 | `mls-h11-t02.html` (+utf8) 時系列表第2表 労働時間指数 (HTML table) | …/www2/kisya/daijin/20000217_02_d/11t02r.html | 26,194 | `d9f9a4cab46ba92b805835f1c64fb84c84fd00be695a308ff7ef57bfe96b1c0b` |
| 23 | `mls-h11-fu.html` (+utf8) 付表 前年比の推移 | …/www2/kisya/daijin/20000217_02_d/fu11r.html | 10,364 | `6526eb2c1af430580730c49a29900350755a3a8f5ffac3bf0be6e2993c530c30` |
| 24 | `mls-h19annual.html` (+utf8) 平成19年分結果確報 index | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/19/19fr/mk19r.html | 10,569 | `392782721507d9597fa5e78e49d07ef759108f22a9f0b81c90367bdbaa59663d` |
| 25 | `mls-h27annual.html` (+utf8) 平成27年分結果確報 index | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/27/27r/27r.html | 12,673 | `0fbb9eab5619c9dabd26d3cbeb1018c9ded623faccd717fc81e59b4ac3834c29` |
| 26 | `mls-h29annual.html` (+utf8) 平成29年分結果確報 index | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/29/29r/29r.html | 11,668 | `3d52186d154a4651d5c3766af8a0389bbf1576ad6955450aceb432691655dc56` |
| 27 | `mls-2025annual.html` (+utf8) 2025年分結果確報 index | https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/r07/25cr/25cr.html | 11,927 | `8a5d75f3ecb43755851edffe71f75240c794390f97b8458779f177f2e326b50b` |
| 28 | `30-1.html`, `30-1a.html`, `30-1k.html`, `saikin.html` (+utf8 copies) | survey top / 結果の概要 / 過去の結果の概要 / 最近公表 | 21,999 / 44,862 / 81,617 / 184,950 | `8ef9cfa8…`, `8b2938ab…`, `0be53b5d…`, `3cd26c71…` |

URL prefix `…/` = `https://www.mhlw.go.jp/toukei/itiran/roudou/monthly/`. Dead/404 probes: `www.jil.go.jp/jil/kisya/daijin/980216_01_d/mk09r.html` (平成9年分結果, JIL host — 404), `/toukei/list/30-11*.html` (404). Older-than-1997 annual pages live on JIL (dead) — 1987–1999 coverage obtained instead from the 平成11年分 (1999) release HTML tables.

### A.2 Structure inventory (key verbatim labels & coverage)

**Common layout of 時系列第1表/第2表 (all vintages):** row 1 = table title (`時系列表第１表　　賃金指数` / `時系列表第２表　　労働時間指数`); row 2 = `（事業所規模５人以上）`; base year in last populated header cell (e.g. `（2020（令和２）年平均＝１００）`); column group headers `調　査　産　業　計` / `製造業` / `一 般 労 働 者` / `パートタイム労働者` / `事業所規模30人以上`; sub-headers `前年比` `％`; **series label in column A**; year axis in column A (`　　2022年` style / `平成15年` style) with annual rows first, then quarter rows (`Ⅳ期` etc.).

**Nominal wage index — verbatim row label: `現　金　給　与　総　額`** (full-width spaces as in file; h11 HTML: `現　金　給　与　総　額`).

| File | Sheet(s) | Base | Coverage (annual rows with values) | Columns |
|---|---|---|---|---|
| `mls-h11-t01.html` (平成11年分) | HTML table | 平成7年平均＝100 | **昭和62年(1987) – 平成11年(1999)**, annual | 調査産業計 / 製造業 / 卸売・小売業 / サービス業 × {index, 前年比} + 規模30人以上 |
| `19t01r.xls` | `賃金指数` | 平成17年平均＝100 | **平成7年(1995) – 平成19年(2007)** + 四半期 | 調査産業計 / 製造業 × {index, 前年比} + 規模30人以上 |
| `27t01r.xls` | `賃金指数` | 平成22年平均＝100 | **平成15年(2003) – 平成27年Ⅰ期(2015)** | 同上 |
| `29ct01r.xls` | `賃金指数` | 平成27年平均＝100 | **平成17年(2005) – 平成29年(2017)** | 調査産業計 × {一般労働者/パートタイム/30人以上} — sheet 61×11 |
| `25ct01r.xlsx` | `賃金指数` | 2020年平均＝100 | **2018 – 2025** + 四半期 | 調査産業計 / 製造業 / 卸売業，小売業 / 医療，福祉; header incl. **`実質前年比` `％`** columns |
| `2608t01p.xlsx` / `2608t01r.xlsx` | `賃金指数` | 2020年平均＝100 | 2022 – 2026年8月 (monthly rows `2026年１月`…`８月` + 前年比) | incl. 実質前年比 |
| `2608t06p.xlsx` | `国際比較` | — | 2022–2024 annual + monthly 2024-2026 | `各国公表による主要国の実質賃金` (日本/アメリカ/イギリス/ドイツ, 前年比 %) |

**Chained nominal coverage: 1987–2025 annual (files overlap: 1987-99 / 1995-2007 / 2003-15 / 2005-17 / 2018-25).**

**Hours index — verbatim row label: `総　実　労　働　時　間`** (h11 HTML: `総実労働時間`).

| File | Sheet(s) | Base | Coverage |
|---|---|---|---|
| `mls-h11-t02.html` | HTML table | 平成7年平均＝100 | **1987–1999 annual** |
| `19t02r.xls` | `時間指数` | 平成17年平均＝100 | **1995–2007** + quarters |
| `27t02r.xls` | `時間指数` | 平成22年平均＝100 | **2003–2015** |
| `29ct02r.xls` | `時間指数` | 平成27年平均＝100 | **2005–2017** |
| `25ct02r.xlsx` | `時間指数` | 2020年平均＝100 | **2018–2025** |
| `2608t02p/r.xlsx` | `時間指数` | 2020年平均＝100 | 2022–2026年8月 monthly |

**Chained hours coverage: 1987–2025 annual.**

**Real wage index — verbatim labels: table title `時系列表第６表　　実質賃金指数`, row `現　金　給　与　総　額`** (19t06r sheet name `労働異動率・実質賃金`, title `時系列表第６表　　実質賃金指数`); 29ct06r header: `時系列第6表` / `実質賃金指数` / `（事業所規模５人以上）` / `（平成２７年平均＝１００）` / column `現 金 給 与 総 額` (＋ `きまって支給する給与`).

| File | Sheet | Base | Coverage |
|---|---|---|---|
| `19t06r.xls` | `労働異動率・実質賃金` | (平成17年=100 vintage) | **平成9年(1997) – 平成19年(2007)** |
| `27t06r.xls` | `実質賃金` | 平成22年=100 | **平成17年(2005) – 平成27年Ⅰ期(2015)** |
| `29ct06r.xls` | `実質賃金` | 平成27年=100 | **平成17年(2005) – 平成29年(2017)** |
| `25ct01r.xlsx` / `2608t01*.xlsx` | `賃金指数` | 2020年=100 | **2018–2026: 実質賃金指数 level table no longer published; `実質前年比`(％) column only** |
| `mls-h11-fu.html` 付表 | HTML | — | 1987–1999: `実質賃金(総額)` **前年比** only |

**Chained real-wage coverage: index levels 1997–2017; YoY real wage 1997–2026 (plus 1987–1999 YoY from 付表).** Extraction note (structure only): the 2018–2025 real-wage level must be derived from 名目 index × CPI or chained from 実質前年比; MHLW's own guidance page is `30-1r.html` (`毎月勤労統計調査の実質賃金の利用上の注意`, saved).

### A.3 MLS notes for the extraction agent

- Base years change across vintages (1995→2005→2010→2015→2020 =100); chain via 前年比 columns, using overlap years to verify.
- 2016–2017 annual values exist in `29ct01r/29ct06r` (2015=100). The 2018 method change (unincorporated solo proprietors excluded / 標準的な時系列推計) is documented at `30-1h.html` (no data files).
- 毎月 pages also carry `第1表 月間現金給与額`/`第2表 月間実労働時間及び出勤日数`/`付表`/`季節調整済指数`(第8表) xls — not downloaded (level data, not the index series requested); 一括ダウンロード zip also available per release.
- MHLW e-Stat DB: 統計表一覧 tid=000001011791 (linked from 30-1.html) — not curl-friendly, not needed given the above.

---

## Goal B — 統計局 労働力調査 長期時系列データ (産業別就業者数)

### B.0 Navigation trail & publication dates

| Page | URL | Title | Publication date |
|---|---|---|---|
| Survey top | https://www.stat.go.jp/data/roudou/index.html | `統計局ホームページ/労働力調査` | — |
| 主な結果 (長期時系列 section) | https://www.stat.go.jp/data/roudou/2.html | `統計局ホームページ/労働力調査 主な結果` | links: `2026年8月分結果 ※2026年10月2日公表`; `2025年平均結果 ※2026年1月30日公表`(基本) / `※2026年2月13日公表`(詳細); `2025年度平均結果 ※2026年4月28日公表` |
| 長期時系列データ (e-Stat file list) | https://www.e-stat.go.jp/stat-search/files?tclass=000001226526&cycle=0 | `労働力調査 … 長期時系列データ 基本集計 | ファイル | 統計データを探す` | per-file `公開（更新）日` shown (e.g. 2025-12-12 style) |
| Latest monthly (HTML saved) | https://www.stat.go.jp/data/roudou/sokuhou/tsuki/index.html | `統計局ホームページ/労働力調査（基本集計）月次結果` | **`2026年（令和8年）8月分結果 2026年10月2日公表`** |
| 2025年平均結果 基本集計 (HTML saved) | https://www.stat.go.jp/data/roudou/sokuhou/nen/ft/index.html | `労働力調査（基本集計）年平均結果` — `2025年（令和7年）平均結果 2026年1月30日公表`; 統計表 section labels itself `【2022年（令和4年）平均結果統計表】` (since 2023 the stat.go.jp-hosted Excel tables are the 2022 vintage; current-year tables are on e-Stat) | as stated |
| 2025年平均結果 詳細集計 (HTML saved) | https://www.stat.go.jp/data/roudou/sokuhou/nen/dt/index.html | `労働力調査（詳細集計）年平均結果` | `2026年2月13日公表` |

**Latest reported month (recency citation): 2026年8月分 (published 2026-10-02).** Long-series Excel files already include **2025 annual** values.

### B.1 Download log (e-Stat file-download endpoint)

Download URL pattern: `https://www.e-stat.go.jp/stat-search/file-download?statInfId=<ID>&fileKind=0` (HTTP 200, `application/octet-stream`). statInfIds verified from the parsed file-list HTML (`raw/statb/estat-lts.html`, sha256 `9917f4368954831308cb0217ddf5e84822142eb3e28542d1360e214cbf0b5105`).

| # | Local file | e-Stat table | statInfId | Bytes | sha256 |
|---|---|---|---|---|---|
| 1 | `lfs-5-1-sangyo-12-13.xlsx` | 表5-1 `主な産業別就業者数【第12・13回改定日本標準産業分類】`(年平均) | 000001082692 | 49,942 | `8d598c30277027a8f6b0113345f7685f4aa36e15b02d40020b701741ed0f3040` |
| 2 | `lfs-5-2-sangyo-11.xlsx` | 表5-2 `第11回改定日本標準産業分類別就業者数`(年平均) | 000004703169 | 31,232 | `079855eedab089ae8ddf9764e3a998790423b1cd27dac63862ad0c99c75054b8` |
| 3 | `lfs-5-3-sangyo-10.xlsx` | 表5-3 `第10回改定日本標準産業分類別就業者数`(年平均) | 000001082693 | 45,056 | `daf85aaf12adbc9b232bd8677e6a1c28409688a04f6701db8e49703f9cfe67ee` |
| 4 | `lfs-2-1-shuyo.xlsx` | 表2-1 `主要項目（労働力人口、就業者、完全失業者、非労働力人口、完全失業率など）`(年平均) | 000001082681 | 50,384 | `7ee865692c8882a8452c5d36f5c5111cb2f75ebee9d972205ebd4941eb5afdab` |
| 5 | `lfs-2025-054bh01.xlsx` | 2022年平均結果統計表 `第1表 就業状態別15歳以上人口、産業別就業者数、求職理由別完全失業者数` (stat.go.jp direct: /data/roudou/sokuhou/nen/ft/zuhyou/054bh01.xlsx) | — | 21,391 | `e1af0482735fe87c9fa86cbf37c7bdc810e7cadb86b5bc2ca5c013b770f9a087` |

**Format warning:** e-Stat serves both modern xlsx and legacy BIFF `.xls` through the same endpoint. `lfs-5-2/5-3` downloaded with `.xlsx` extension are actually **legacy .xls (Composite Document File)** — read with `xlrd`, not openpyxl. `lfs-5-1/2-1` are true xlsx (zip).

### B.2 Structure inventory

**`lfs-5-1-sangyo-12-13.xlsx` (長期時系列表５ (1)産業（第12・13回改定分類）別就業者数)**
- **Sheets:** `長期05`, `長期05 (既公表値)`, `※注_Notes`
- Sheet `長期05`: 54 rows × 65 cols. Title rows: `[基本集計] 長期時系列表５　　(1)産業（第12・13回改定分類）別就業者数 －` / `[Basic Tabulation] Historical data 5`; unit `(万人) (Ten thousand persons)`; sex blocks `男女計 Both sexes` / `男 Male` / `女 Female` (3 blocks of 22 industry columns each).
- **Year axis:** column A = era (`平成14年`), column B = **AD year (machine-readable)**; data rows 2002–2025 (24 rows).
- **Verbatim column labels (男女計 block):** `総数` (Total), `農業，林業`, `非農林業`, `漁業`, `鉱業，採石業，砂利採取業`, `建設業`, `製造業`, `電気・ガス・熱供給・水道業`, `情報通信業`, `運輸業，郵便業`, `卸売業，小売業`, `金融業，保険業`, `不動産業，物品賃貸業`, `学術研究，専門・技術サービス業`, `宿泊業，飲食サービス業`, `生活関連サービス業，娯楽業`, `教育，学習支援業`, `医療，福祉`, `複合サービス事業`, `サービス業（他に分類されないもの）`, `公務（他に分類されるものを除く）` (+ `既公表値` second sheet = previously-published values).
- **Coverage: 2002–2025 annual.**

**`lfs-5-2-sangyo-11.xlsx` (長期時系列表５ (2)産業（第11回改定分類）別就業者数)**
- **Sheet:** `長期05` (single). 28 rows × ~30 cols. Era+AD-year axis (col A era / col B AD year).
- **Verbatim column labels:** `総数`, `農林業`, `非農林業`, `漁業`, `鉱業`, `建設業`, `製造業`, `電気・ガス・熱供給・水道業`, `運輸・通信業`, `卸売・小売業，飲食店`, `金融・保険業，不動産業`, `サービス業`, `公務`.
- **Coverage: 2002–2009 annual** (平成14年–平成21年).

**`lfs-5-3-sangyo-10.xlsx` (長期時系列表５ (3)産業（第10回改定分類）別就業者数)**
- **Sheet:** `長期05` (single). 84 rows; era label only on era-initial rows (`昭和28年`, `平成元年`), other rows carry indented year numerals (`　　29`) with AD year in col B.
- **Verbatim column labels:** same 10th-revision set as 5-2 (`農林業`, `漁業`, `鉱業`, `建設業`, `製造業`, `電気・ガス・熱供給・水道業`, `運輸・通信業`, `卸売・小売業，飲食店`, `金融・保険業，不動産業`, `サービス業`, `公務`); first cells include `…` (not available) markers for early years in some columns (e.g. 電気・ガス for 1953).
- **Coverage: 1953 (昭和28年) – 2002 (平成14年) annual; 50 unique years; the year 1973 appears in TWO adjacent rows (both labelled `48`) — a classification-boundary artifact to be inspected during extraction (structure note only, values not interpreted).**

**`lfs-2-1-shuyo.xlsx` (長期時系列表２ 就業状態別15歳以上人口)**
- **Sheets:** `長期02`, `長期02 (既公表値)`, `※注_Notes`; 90 rows × 40 cols; units `(万人)`; sex blocks 男女計/男/女.
- **Verbatim row labels:** `15歳以上人口` (`Population aged 15 years`), `労働力人口` → `総数` / `就業者` (`Employed person`) / `完全失業者` (`Unemployed person`), `非労働力人口` → `総数` / `通学` / `家事` / `その他`, plus `労働力人口比率（％）`, `就業率（％）`, `完全失業率 （％）`.
- **Coverage: 1953–2025 annual (74 year rows).**

**`lfs-2025-054bh01.xlsx`** — sheet `第1表`; header `第 １ 表　　就業状態別15歳以上人口、産業別就業者数、求職理由別完全失業者数`, block label `2022年平均 （万人)`, section `〔主 な 産 業 別 就 業 者〕` with rows `農業，林業`, `建　設　業`, `製　造　業`, `情報通信業`, `運`運輸業，郵便業`, `卸売業，小売業`, `金融業，保険業`, `不動産業，物品賃貸業`, `学術研究，専門・技術サービス業`, `宿泊業，飲食サービス業`, `生活関連サービス業，娯楽業`, `教育，学習支援業`, `医療，福祉`, `サービス業(他に分類されないもの)`, `公務` + `〔主 な 産 業 別 雇 用 者〕` block; columns 実数/対前年増減/増減率 by sex. Single-year (2022) cross-section — 2022-vintage tables still hosted on stat.go.jp.

### B.3 LFS notes for the extraction agent

- **Chained 産業別就業者数 coverage: 1953–2025 annual** (5-3: 1953–2002, 10th rev.; 5-2: 2002–2009, 11th rev.; 5-1: 2002–2025, 12/13th rev.). Classification vintages differ; overlap years (2002, 2002–2009) allow linking.
- **No single official 第一次産業/第二次産業/第三次産業 long-run annual file exists in the 長期時系列データ set** (parsed all 54 files: 表1 月別 (季節調整・原数値), 表2/3/4 年平均, 表5 産業別, 表6 職業別, 表7 完全失業者, 表8 地域別). Three-sector aggregates must be derived from the detailed industry columns (or taken from per-year 結果原表 on e-Stat — links on roudou-2.html `結果原表`, e.g. `…stat-search/files?…cycle=7…`, not downloaded: per-release files). The monthly-release 表7 産業別就業者数 and the 2022 annual table (`lfs-2025-054bh01.xlsx`) publish the official detailed-industry counts for their own period.
- The 長期時 series also offers 表5-4~5-6 産業別**雇用者**数 (statInfIds 000001082696 / 000004702640 / 000004702507) — not downloaded (就業者数 requested); available via same endpoint if needed.
- e-Stat file page is React-rendered; download links are plain `<a href="/stat-search/file-download?statInfId=…&fileKind=0">` in static HTML — curl-friendly.

---

## Goal C — 統計局 科学技術研究調査 (R&D expenditure)

### C.0 Navigation trail & publication dates

| Page | URL | Title / key text | Publication date |
|---|---|---|---|
| Survey top | https://www.stat.go.jp/data/kagaku/index.html | `統計局ホームページ/科学技術研究調査`; headline `2024年度の科学技術研究費は、23兆7925億円（対前年度比7.9％増、4年連続で増加）` | — |
| 調査の結果 | https://www.stat.go.jp/data/kagaku/kekka/index.html | `統計局ホームページ/科学技術研究調査　調査の結果` — `2025年（令和7年）科学技術研究調査の結果`; per-year rows (2025 → 平成15年) with 結果の要約/結果の概要/e-Stat統計表/調査の概要/調査票 links | e-Stat files show `公開（更新）日 2025-12-12` |
| e-Stat 2025 file list | https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&lid=000001471830 | `科学技術研究調査 2025年（令和７年）科学技術研究調査 2025年 | ファイル` — 59 articles (総括5 / 企業12 / 非営利8 / 大学等4 / 分析表30) | 2025-12-12 (all files) |
| e-Stat 時系列 tab | …/stat-search/files?…toukei=00200543&cycle=0 | **empty — no 時系列 files exist for this survey on e-Stat** | — |

**Latest release (recency citation): 2025年（令和7年）科学技術研究調査 (survey of FY2024), e-Stat files 公開日 2025-12-12.**

### C.1 Key finding — no long-run Excel/CSV exists

Both the 2025 and the 2016 e-Stat Excel 結果表 sets (parsed in full, `raw/statb/estat-kagaku-2025.html` / `estat-kagaku-2016.html`) contain **current-year cross-sections only** (総括表1~5, 企業1~12, 非営利1~8, 大学等1~4, 分析表1~30). e-Stat digitized survey years 2000–2025 (1,207 files; ~26–60 per year) — all current-year. The long-run 研究費 series with 対GDP比 is published **inside the 結果の概要 PDF of each survey year** (推移 tables, ~10-year windows), so a 1996–2024 chain needs 4 PDFs; pre-1996 reaches 1995 via the 平成16年 概要 HTM. stat.go.jp `参考表` Excel files (`16rf.xls` etc.) are current-year 組織別 tables, not time series (verified, kept as evidence).

### C.2 Download log

| # | Local file | URL | HTTP | Bytes | sha256 |
|---|---|---|---|---|---|
| 1 | `kagaku-2025-kekkagai.pdf` 結果の概要 | https://www.stat.go.jp/data/kagaku/kekka/kekkagai/pdf/2025ke_gai.pdf | 200 | 1,712,689 | `998e8756d91301a8549e0b93221c32d465019c83a2e5056202027a79da82aefc` |
| 2 | `kagaku-2025-youyaku.pdf` 結果の要約 | https://www.stat.go.jp/data/kagaku/kekka/youyaku/pdf/2025youyak.pdf | 200 | 421,582 | `c1105d72f63da113d527a86f240fffa6ff90f18de12d0ed1bf981edca83725df` |
| 3 | `kagaku-2015-kekkagai.pdf` 結果の概要 (2015 survey) | …/kekka/kekkagai/pdf/27ke_gai.pdf | 200 | 1,789,013 | `25ca22a3fb84c227a955e590981d1e0bd2660fd8376acda7c577b8246622317f` |
| 4 | `kagaku-2011-kekkagai.pdf` 結果の概要 (2011 survey) | …/kekka/kekkagai/pdf/23ke_gai.pdf | 200 | 1,309,662 | `57a44e8614d2122264188fab48de7cea1f6db549d54685439feff213ef21ce63` |
| 5 | `kagaku-2007-kekkagai.pdf` 結果の概要 (2007 survey) | …/kekka/kekkagai/pdf/19ke_gai.pdf | 200 | 274,282 | `c81b739c32d70cac8e3ad23801836ab4607e3a8062d02b29f650d5a7e9cf7389` |
| 6 | `kagaku-2004-kekkagai.html` (+utf8) 結果の概要 HTM (2004 survey) | …/kekka/kekkagai/16gaiyo2/16gaiyo2.html | 200 | 43,932 | `a2106abcad2b69c8ee28837f43b1be7d525f0f2da66ea9f356d0bbd515299c2e` |
| 7 | `kagaku-2025-soukatsu-t2.xlsx` 総括表第2表 (current-year Excel) | https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040377600&fileKind=0 | 200 | 27,961 | `7ee6902956f18149f978a640e525cdc0eab7041d6ad4175a672f911cf27629d3` |
| 8 | `kagaku-pamphlet.pdf` 統計でみる日本の科学技術研究 (2007 pamphlet) | …/kekka/pdf/07pamphlet.pdf | 200 | 1,246,215 | `b27938a2f88d05166dfff78b6610c450231a3b58d1beb6337009ab5e6e81e73a` |
| 9 | `kagaku-16rf.xls` 参考表 (2016, current-year 組織別 — evidence only) | …/kekka/zuhyou/16rf.xls | 200 | 78,848 | `5567ef7c4556db11ec8e5f583891327ab6b6ed72b9981b2b9efe7b0add5812e0` |
| 10 | `kagaku-2003-gaiyou.pdf` 調査の概要 (2003 — outline only, no trend data; evidence only) | …/gaiyou/pdf/15gaiyo.pdf | 200 | 18,755 | `6f52b472698ba20b53cd21bd6ca1f50e07afcda1fdee898154d99f1551f7c551` |

URL prefix `…/` = `https://www.stat.go.jp/data/kagaku/`. pdftotext (UTF-8) extracts saved alongside each PDF (`*.txt`).

### C.3 Structure inventory (verbatim labels & coverage)

**`kagaku-2025-kekkagai.pdf` (2025年調査 = FY2024 results) — table inventory (from pdftotext):**
- `表１－１ 研究費の推移` — columns: `年度`, `総額（億円）`; **coverage 2015–2024** (values present each year, e.g. last row `2024 … 237 925`).
- `表１－２ 研究費、ＧＤＰの推移` — columns: `研究費 (A)（億円）`, `ＧＤＰ (B)（億円）`, `対`対ＧＤＰ比率 (A/B)（％）`; **coverage 2015–2024** — the requested 研究費の対GDP比.
- `表１－３ 研究主体別研究費の推移`, `表１－４ 支出源別研究費の推移`, `表１－５ 費目別研究費の推移（総括）`, `表１－６ 性格別研究費（自然科学に使用した研究費）の推移（総括）`, `表１－７ 特定目的別研究費（８分野）の推移（総括）` — same 10-year window.
- Headline text (要約 PDF): `2024年度の科学技術研究費は、23兆7925億円（対前年度比7.9％増、4年連続で増加）` (verbatim from survey top page).

**Chain (annual 研究費総額 + 対GDP比 where present):**

| Source file | Table (verbatim) | Coverage |
|---|---|---|
| `kagaku-2025-kekkagai.pdf` | `表１－１ 研究費の推移`, `表１－２ 研究費、ＧＤＰの推移` | **2015–2024** (incl. 対GDP比) |
| `kagaku-2015-kekkagai.pdf` | `研究費の推移` (平成17年度–平成26年度); `研究費の対ＧＤＰ比率（％）` | **2005–2014** (incl. 対GDP比) |
| `kagaku-2011-kekkagai.pdf` | `研究費の推移` (平成12年度–平成22年度) | **2000–2010** |
| `kagaku-2007-kekkagai.pdf` | `研究費の推移` (平成8年度–; incl. 実質研究費 columns) | **1996–2006** |
| `kagaku-2004-kekkagai.html` | `研究費の推移` (平成7年度–平成15年度) | **1995–2003** |

**Chained coverage: 1995–2024 annual 研究費総額 (億円); 対GDP比 directly published for 2005–2014 and 2015–2024** (GDP values (B) are printed alongside, enabling ratio reconstruction for 2000–2010 via 表 `研究費，国内総生産の推移` in the 2011 PDF).

**`kagaku-2025-soukatsu-t2.xlsx` (総括表第2表):**
- **Sheet:** `A102`; metadata rows: `統計名：科学技術研究調査`, `統計表番号：総括表第2表`, `表題：研究主体、組織別内部使用研究費、受入研究費及び外部支出研究費`; axis columns `時間軸コード` / `時間軸` (`102` / `2025年`) — current-year (2025 survey = FY2024) long-format DB table (e-Stat DB export layout). For the latest single-year 研究費 by 研究主体/組織.

**`kagaku-pamphlet.pdf` (統計でみる日本の科学技術研究, 2007):** chart-based (e.g. `科学技術研究費の推移`, `国内総生産（ＧＤＰ）に対する研究費の比率の推移`) — year labels are graphical; usable as visual reference only, not machine-readable.

### C.4 R&D notes / honest limitations

- **1953–1994: NOT obtainable as data files from stat.go.jp/e-Stat today.** The survey dates to 1953, but online 概要 PDFs reach back only to 1995 (via the 2004 HTM), and e-Stat Excel tables (2000–2025) are current-year only. Covering 1953–1994 would require printed 年報/『日本の長期統計系列』 or re-derivation from 文部科学省科学技術・学術政策研究所 (NISTEP) 科学技術指標 — different agencies, out of this task's scope.
- 専従換算 post-2023 correction note: `/data/kagaku/kekka/ref2023.html` (大学等フルタイム換算) — flagged on 調査の結果 page, not downloaded (affects 研究者数/専従換算値, not headline 研究費).
- All 59 files of the 2025 e-Stat set are listed in `raw/statb/estat-kagaku-2025.html` (sha256 `a4def2b1601224ace5bc84d1597186f8ea1e53700ade1e7c291a29a9e18bc0ef`) with their statInfIds should further current-year tables be needed.

---

## Environment & method notes

- All downloads `curl -sS --max-time 60`; HTTP status and byte counts captured with `-w`. No download failures among the files listed; the only 404s were URL probes documented above.
- Spreadsheets inspected with `python3 + openpyxl` (xlsx) and `xlrd` (legacy BIFF); PDFs with `pdftotext -enc UTF-8`; HTML parsed with python `re` (stat.go.jp Shift_JIS → iconv; MHLW mixed Shift_JIS/UTF-8 as noted).
- No statistics extracted, no values interpreted, no judgments made about data quality — structure/labels/coverage only.
- Files NOT downloaded (documented for the extraction agent): MLS monthly 第1表/第2表 level xls, 付表, 季節調整済 (第8表), 一括 zip; LFS 表5-4~5-6 雇用者数, 表1-a-3 monthly 農林/非農林, 表8 地域別; R&D e-Stat current-year tables other than 総括表2.
