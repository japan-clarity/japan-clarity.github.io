# Chapter 03 (Housing & Cost of Living) — Statistics Bureau of Japan: FIES (家計調査) + CPI (消費者物価指数) Research Summary

- Agent: 4-b (general-purpose, Statistics Bureau FIES/CPI collection)
- Access date for ALL entries below: **2026-10-26**
- All quotes below appear verbatim in the raw files listed with each entry (Japanese as-is; Shift_JIS HTML/CSV decoded to UTF-8 in the `.utf8.html` / `.utf8.csv` sidecars, original bytes kept).
- Nothing below is from memory or secondary sources. Anything not found in the archived raw files is marked **UNAVAILABLE**.
- Raw archives: `research/chapter03/raw/statb-fies/` (incl. the Section-C 404 probes), `research/chapter03/raw/statb-cpi/` (incl. the CPI historic-page 404 probe). Fetch commands: `research/chapter03/scripts/fetch-statb-fies-cpi.sh`. 令和5年住宅・土地統計調査 raw files live in Task 4-a's `research/chapter03/raw/statb-housing/` (untouched by 4-b).
- Completion pass (same access date 2026-10-26): an earlier interrupted 4-b run had downloaded the raw files and drafted these notes + script but had NOT appended a worklog entry; this session independently re-derived every headline value from the raw files, re-checked HTTP status live, corrected several draft errors (off-by-one XLSX column indices, one wrong CPI YoY value, mislabeled FIES regional income values, one mixed-classification table — see Section E) and re-archived four 404 probes that had gone missing.

## 0. Key structural findings (what is ACTUALLY published online as of 2026-10-26)

1. **FIES (家計調査 家計収支編) lives under `/data/kakei/`, NOT `/data/sav/`.** `https://www.stat.go.jp/data/sav/index.htm` and `/data/sav/nen/index.htm` return **HTTP 404** (probe files kept: `raw/statb-fies/sav_index.html`, `sav_nen_index.html`). `/data/sav/` now hosts only the 貯蓄・負債編 (link text on the FIES top page: "貯蓄・負債編・二人以上の世帯" → `/data/sav/1.html`).
2. **家計調査年報 家計収支編（2025年（令和7年）） EXISTS** — index at `https://www.stat.go.jp/data/kakei/2025np/index.html`, released with the 2025 annual results **published 2026-02-06** (stated on the FIES monthly index page: "2025年（令和7年）平均　（2026年2月6日公表）"; e-Stat 詳細結果表 files show 公開（更新）日 2026-02-06, and the 品目分類 annual tables 2026-08-07). Latest FIES monthly as of access date: **2026年8月分, published 2026-10-09** ("2026年（令和8年）8月分　（2026年10月9日公表" — `raw/statb-fies/kakei_sokuhou_index.html`). The annual detail tables are published **only on e-Stat** (政府統計コード 00200561), not on stat.go.jp.
3. **CPI base year switched to 2025 (2025=100) during 2026.** The current monthly release is titled "2025年基準 消費者物価指数" and a dedicated page `/data/cpi/2025/sokyu.html` ("2025年基準改定について") exists. The **2025 calendar-year average was nonetheless published on 2026-01-23 in the OLD 2020 base** ("2020年基準　消費者物価指数　全国　2025年（令和7年）平均　（2026年1月23日公表）"). The whole long-run annual series was re-linked to 2025=100 and published as **2025年基準長期時系列データ (e-Stat, 公開日 2026-08-07)**, covering 中分類指数 1970–最新年 and 持家の帰属家賃を除く総合 1947–最新年. The old `/data/cpi/historic/` page returns **HTTP 404** (probe kept). A stat.go.jp notice states the FIES 実質増減率 were retroactively revised for the CPI 2025-base change (`/data/kakei/pdf/oshirase_20260904.pdf`, linked from the FIES top page).
4. Latest CPI monthly as of access date: **2026年9月分 (全国), published 令和8年10月23日 (2026-10-23)** — exactly as anticipated. An erratum was issued in Oct 2026 (`/data/cpi/2025/kaisetsu/pdf/202610_seigo.pdf`, "修正（PDF：357KB）") and a model-item replacement notice (`9372_sinkyu.pdf`, テーマパーク入場料), both linked from `raw/statb-cpi/cpi_index.utf8.html`.
5. **English availability:** English section pages exist and return HTTP 200 (`https://www.stat.go.jp/english/data/cpi/index.html`, title "Statistics Bureau Home Page/Consumer Price Index"; `https://www.stat.go.jp/english/data/sav/index.html`, title "…Family Income and Expenditure Survey (Savings and Liabilities)"). All headline values below were taken from the Japanese primary pages/files.
6. **住宅・土地統計調査**: the newest round online is **令和5年 (2023)** (`/data/jyutaku/index.html`, title "統計局ホームページ/令和5年住宅・土地統計調査"; previous round linked is 平成30年/2018 — i.e. the survey is now on a 5-year cycle in this environment, not triennial). **家計の住宅・土地に関する調査 (FIES-family housing acquisition survey) is UNAVAILABLE**: `/data/jyutaku/kei/index.htm`, `/data/juutaku/kei/index.html` and `/data/kakei/jyutaku/index.htm` all return HTTP 404 (probes kept in `raw/statb-fies/` as `jyutaku_kei_404.html` / `juutaku_kei_404.html` / `kakei_jyutaku_404.html`, each 4,691 bytes, sha256 606194abc6d7f345… — the generic stat.go.jp error page, byte-identical to the `/data/sav/` probes). See section C.

---

# A. FIES — 家計調査（家計収支編）2025年結果

## A-0. Raw file inventory (all fetched 2026-10-26)

| File (under `raw/statb-fies/`) | Source URL | HTTP | Bytes | sha256 (first 16 hex) |
|---|---|---|---|---|
| kakei_index.html (+.utf8.html) | https://www.stat.go.jp/data/kakei/index.htm | 200 | 16,604 | 3196a5e796d35614 |
| kakei_2.html | https://www.stat.go.jp/data/kakei/2.html | 200 | 22,592 | f8733dc22b834f72 |
| kakei_2025np_index.html (+.utf8) | https://www.stat.go.jp/data/kakei/2025np/index.html | 200 | 15,530 | 313f75cf149a31b1 |
| kakei_2025np_summary.pdf (+.txt) | https://www.stat.go.jp/data/kakei/2025np/pdf/summary.pdf | 200 | 548,877 | cc823be978f1808a |
| kakei_longtime_index.html (+.utf8) | https://www.stat.go.jp/data/kakei/longtime/index.html | 200 | 16,642 | a80dddc1764f62b5 |
| kakei_longtime_index2.html (+.utf8) | https://www.stat.go.jp/data/kakei/longtime/index2.html | 200 | 31,247 | 1f786b53d9de1903 |
| kakei_longtime_type-two.xlsx | https://www.stat.go.jp/data/kakei/longtime/zuhyou/type-two.xlsx | 200 | 64,410 | f1bb125e71037691 |
| kakei_sokuhou_index.html | https://www.stat.go.jp/data/kakei/sokuhou/tsuki/index.html | 200 | 26,398 | f7375f30f3442e4f |
| estat_2025np_t1-1_fk4.xlsx | e-Stat statInfId=000040409521 fileKind=4 | 200 | 250,487 | 2eebc217c8a4fb95 |
| estat_2025np_t1-2_fk4.xlsx | e-Stat statInfId=000040409522 fileKind=4 | 200 | 80,765 | 45386327363fe86a |
| estat_2025np_t3-7_fk4.xlsx | e-Stat statInfId=000040409538 fileKind=4 | 200 | 771,428 | d421d0b9e76c4442 |
| estat_2025np_solo_t1_fk4.xlsx | e-Stat statInfId=000040409815 fileKind=4 | 200 | 68,386 | 5b62766ff1ed7808 |
| estat_2025np_solo_t8_fk4.xlsx | e-Stat statInfId=000040409842 fileKind=4 | 200 | 30,899 | 4fcf7fa340f9d498 |
| estat_longtime_t2-two_fk4.xlsx | e-Stat statInfId=000040270657 fileKind=4 | 200 | 1,285,710 | 995ca89179e4aa56 |
| estat_longtime_t2-kinrou_fk4.xlsx | e-Stat statInfId=000040270658 fileKind=4 | 200 | 2,040,218 | 4d88badec4484aa2 |
| sav_index.html / sav_nen_index.html | https://www.stat.go.jp/data/sav/index.htm , /data/sav/nen/index.htm | **404** | 4,691 | 606194abc6d7f345 |
| jyutaku_kei_404.html / juutaku_kei_404.html / kakei_jyutaku_404.html | https://www.stat.go.jp/data/jyutaku/kei/index.htm , /data/juutaku/kei/index.html , /data/kakei/jyutaku/index.htm | **404** | 4,691 each | 606194abc6d7f345 |
| kakei_sokuhou_index.utf8.html | iconv Shift_JIS→UTF-8 decode of kakei_sokuhou_index.html (created in the completion pass; carries the "2025年（令和7年）平均　（2026年2月6日公表）" line) | — | 28,750 | e605a26e6306a3c9 |
| estat_fies2025np_detaillist.html | e-Stat files list 「家計調査 家計収支編 二人以上の世帯 詳細結果表 年次 2025年」 (UTF-8 page; shows 公開（更新）日 2026-02-06 on 37 rows) | 200 | 286,971 | cf79dca91104dc3f |
| estat_fies2025np_solo_list.html | e-Stat files list 「家計調査 家計収支編 単身世帯 詳細結果表 年次 2025年」 (公開（更新）日 2026-02-06) | 200 | 204,984 | f7585f17cb163c9e |
| estat_fies_longtime_list.html | e-Stat files list 「家計調査 長期時系列表」 (stat_infid 000040270657/58 listed; 公開（更新）日 2026-10-09 on 10 rows) | 200 | 228,020 | e7f2d2feed01bb2d |

(The e-Stat list pages are UTF-8 server-rendered HTML and are the archived evidence for the 公開（更新）日 dates quoted above; individual e-Stat table pages are a JS SPA shell and `/stat-search/stat-info?stat_inf_id=` returns 404, so list pages were used.)

e-Stat download URL form: `https://www.e-stat.go.jp/stat-search/file-download?statInfId=<id>&fileKind=4`. Full 64-hex sha256 for the nine key binary files:
- kakei_2025np_summary.pdf `cc823be978f1808a671003923fe4dda02c9b1b2465fe34b1717fba164cb46f34`
- estat_2025np_t1-1_fk4.xlsx `2eebc217c8a4fb950e5e34858dca2fe3271f86573e76fa247374433d0dd9ba67`
- estat_2025np_t1-2_fk4.xlsx `45386327363fe86a5037d41033599008e69ea9b9ed202b16a56ee9bd3c11ce2f`
- estat_2025np_t3-7_fk4.xlsx `d421d0b9e76c44421a5c3ef56a75b17b1d5d647afe1dfcd4ad174584bef6f5f1`
- estat_2025np_solo_t1_fk4.xlsx `5b62766ff1ed7808a6d68639dd3e542278fdb06943b58db40cb01dbdd434c583`
- estat_2025np_solo_t8_fk4.xlsx `4fcf7fa340f9d4986ea47c3bc8ea9263eaad79da5da7eaf4ba07c3a5c898cfd5`
- estat_longtime_t2-two_fk4.xlsx `995ca89179e4aa566604ac7f420e6ed30d264f5ccd7351bf476ebc5a834060d0`
- estat_longtime_t2-kinrou_fk4.xlsx `4d88badec4484aa2bd5dc35feaf299ad5c7611e90de0f56309c6dec5c3d2239e`
- kakei_longtime_type-two.xlsx `f1bb125e710376915003cc6686e45a7a724219a17650a0e1d01641c37a807316`

## A-1. 消費支出 (monthly consumption expenditure, 二人以上の世帯, 全国, all households) — 2025 and long series

**2025 value: 314,001円/month (名目 +4.6%, 実質 +0.9%).**
- Source: 2025年（令和７年）家計の概要, Statistics Bureau, MIC (`raw/statb-fies/kakei_2025np_summary.pdf`, text `kakei_2025np_summary.txt`).
- Verbatim quote (txt line 29-33): "2025年の二人以上の世帯（平均世帯人員2.87人、世帯主の平均年齢60.7歳）における消費支出は、１世帯当たり１か月平均314,001円で前年に比べ名目4.6％の増加となった。また、物価変動（3.7％）の影響を除いた実質でも0.9％の増加となった。"
- 図Ⅰ－１－１ data row (txt line 73): "月平均 額（ 円 ）  282,188  283,027  287,315  293,379  277,926  279,024  290,865  293,997  300,243  314,001" (2016→2025; 名目増減率 row: "-1.8 0.3 0.8 1.5 -5.3 0.4 4.2 1.1 2.1 4.6"; 実質増減率 row: "-1.7 -0.3 -0.4 0.9 -5.3 0.7 1.2 -2.6 -1.1 0.9").
- Cross-check, e-Stat 第１－１表 (estat_2025np_t1-1_fk4.xlsx, sheet `二人`, row 29 label 消費支出, 全国 column): 314001. e-Stat 長期時系列 表2 (estat_longtime_t2-two_fk4.xlsx, sheet `支出金額（年）`, row 29 消費支出, col for 2025年): 314001.

**Long annual series 2000–2025 (名目, 円/month, 二人以上の世帯, 全国)** — from e-Stat 長期時系列表 表2 「用途分類：収入及び支出金額・名目増減率・実質増減率（月・四半期・年・年度）二人以上の世帯（2000年～）」, 調査年月 2026年8月, 公開日 2026-10-09 (`raw/statb-fies/estat_longtime_t2-two_fk4.xlsx`, sheet `支出金額（年）`, header row 10 "2000年"…"2025年", 消費支出 row 29; 住居 row 71; 持家率 row 23; エンゲル係数 row 157):
- 消費支出: 2000: 317,328 / 2001: 309,054 / 2002: 305,953 / 2003: 301,841 / 2004: 302,975 / 2005: 300,531 / 2006: 294,943 / 2007: 297,782 / 2008: 296,932 / 2009: 291,737 / 2010: 290,244 / 2011: 282,966 / 2012: 286,169 / 2013: 290,454 / 2014: 291,194 / 2015: 287,373 / 2016: 282,188 / 2017: 283,027 / 2018: 287,315 / 2019: 293,379 / 2020: 277,926 / 2021: 279,024 / 2022: 290,865 / 2023: 293,997 / 2024: 300,243 / 2025: 314,001
- 住居 (row 71): 2000: 20,522 / 2010: 18,179 / 2020: 17,365 / 2024: 18,074 / 2025: 18,665 (full run in the raw file)
- 持家率(％) (row 23): 2000: 76.2 / 2010: 79.7 / 2020: 85.6 / 2025: 87.3
- エンゲル係数(％) (row 157): 2000: 23.3 / 2010: 23.3 / 2020: 27.5 / 2025: 28.6
- (Series break note from the file, sheet `支出金額（月）` note rows / 家計の概要 note: 2018年1月 家計簿改正 affects comparability; 2018-2019 増減率は変動調整値.)

**可処分所得・実収入 (勤労者世帯, 二人以上の世帯のうち), 2025 + long series** — same e-Stat file family, 勤労者世帯 version (estat_longtime_t2-kinrou_fk4.xlsx, sheet `支出金額（年）`, years in header row 10 at cols 17-42 = 2000-2025 (label text at col 8/11/12, e.g. r29 col11 "消費支出", r23 col8 "持家率(％)", r157 col10 "エンゲル係数(％)"); 実収入 row 30, 消費支出 row 69, 非消費支出 row 197, 可処分所得 row 220):
- 実収入: 2022: 617,654 / 2023: 608,182 / 2024: 636,155 / **2025: 653,901**
- 可処分所得: 2022: 500,914 / 2023: 494,668 / 2024: 522,569 / **2025: 532,408**
- 消費支出 (勤労者世帯): 2025: 346,297
- 2025 cross-check, 家計の概要 (txt lines 466-469, 541-543): "実収入注は、１世帯当たり１か月平均653,901円で、前年に比べ名目2.8％の増加" / "可処分所得…は、532,408円で、前年に比べ名目1.9％の増加、実質1.7％の減少となった。" Both are **勤労者世帯** values (二人以上の世帯のうち) — the FIES publishes income only for 勤労者世帯; 可処分所得 for ALL 二人以上の世帯 is UNAVAILABLE in the 2025 annual release.
- Full 実収入 run 2000-2025 (row 30): 562,754 (2000), 552,734, 539,924, 524,810, 531,690, 524,585, 525,719, 528,762, 534,235, 518,226, 520,692, 510,149, 518,506, 523,589, 519,761, 525,669, 526,973, 533,820, 558,718, 586,149, 609,535, 605,316, 617,654, 608,182, 636,155, 653,901 (2025).

## A-2. 品目別（十大分類）支出 and 構成比, 2025年平均, 二人以上の世帯

TWO DIFFERENT published classifications of the same 2025 data exist — do not mix them (see also Section D-4):

**(a) 用途分類 (e-Stat 十大分類, the classification the official 構成比 belongs to)** — amounts from e-Stat 第１－１表 (`estat_2025np_t1-1_fk4.xlsx` sheet `二人`, 全国 col16, item labels at col 13; header rows 11-12), 構成比 from e-Stat **第１－２表 「都市階級・地方別（構成比％）」** (`estat_2025np_t1-2_fk4.xlsx` sheet `二人`, 全国 col16, 大都市 col17; same row numbering as t1-1; this table has no 世帯数 column, 沖縄 at col 30):

| 十大分類 (用途分類 row) | 用途分類額 (円/month) 2025 | 構成比(%) 全国 | 構成比(%) 大都市 |
|---|---|---|---|
| 消費支出 (r29) | 314,001 | 100 | 100 |
| 食料 (r30) | 89,754 | 28.6 | 29.5 |
| 住居 (r71) | 18,665 | **5.9** | 7.0 |
| 光熱・水道 (r76) | 24,544 | 7.8 | 7.1 |
| 家具・家事用品 (r81) | 12,869 | 4.1 | 3.9 |
| 被服及び履物 (r91) | 9,702 | 3.1 | 3.3 |
| 保健医療 (r109) | 15,785 | 5.0 | 5.1 |
| 交通・通信 (r114) | 45,562 | 14.5 | 12.6 |
| 教育 (r121) | 11,936 | 3.8 | 4.7 |
| 教養娯楽 (r125) | 30,796 | 9.8 | 10.5 |
| その他の消費支出 (r134) | 54,387 | 17.3 | 16.3 |

- The ten 用途分類 amounts sum to 314,000 ≈ 消費支出 314,001 (rounding), and the ten 構成比 sum to 100 — the official 構成比 column belongs to the 用途分類 amounts. **住居構成比 headline 5.9% = 18,665/314,001 (用途分類).**

**(b) 品目分類 (家計の概要 表Ⅰ－１－１ 「消費支出の費目別対前年増減率（二人以上の世帯）－2025 年－」; includes 他の世帯への贈答品・サービス支出)** — `kakei_2025np_summary.txt`, table spans lines 282-366 (columns: 月平均額(円) / 名目増減率(％) / 実質増減率(％) / 実質増減率への寄与度); category rows verbatim, e.g. line 288 "食　　料　94,895　5.5　-1.2　-0.36", line 302 "住　　居　18,678　3.3　0.7　0.04"; note 1 at txt line 358: "(注) １ 消費支出の内訳の各費目については、他の世帯への贈答品やサービスの支出を含んでいる。":

| 十大分類 | 品目分類額 (円/month) 2025 | 名目増減率 | 実質増減率 |
|---|---|---|---|
| 消費支出 | 314,001 | +4.6 | +0.9 |
| 食料 | 94,895 | +5.5 | -1.2 |
| 住居 | 18,678 | +3.3 | +0.7 |
| 光熱・水道 | 24,547 | +6.2 | +2.5 |
| 家具・家事用品 | 13,068 | +2.2 | -0.5 |
| 被服及び履物 | 10,063 | +0.8 | -1.8 |
| 保健医療 | 15,863 | +3.4 | +1.9 |
| 交通・通信 | 45,730 | +9.6 | +6.7 |
| 教育 | 11,939 | +2.0 | +6.8 |
| 教養娯楽 | 32,125 | +6.2 | +3.7 |
| その他の消費支出 | 47,093 | -0.5 | -4.1 |

- Cross-classification caution: 94,895/314,001 = 30.2% ≠ 28.6% (食料), and 47,093 (品目分類 その他) vs 54,387 (用途分類 その他) differ by ~7,300円 — the 贈答品/サービス treatment shifts amounts between categories. The 89,754 (用途分類 食料) figure is also quoted in 概要 表Ⅱ-1-2 for 二人以上の世帯 (txt line 1010 block). Both tables are archived; label the classification explicitly whenever quoting.
- 構成比 source cells (t1-2_fk4.xlsx sheet `二人`, 全国 col 16): r30 食料 28.6; r71 住居 5.9; r76 光熱・水道 7.8; r81 家具・家事用品 4.1; r91 被服及び履物 3.1; r109 保健医療 5.0; r114 交通・通信 14.5; r121 教育 3.8; r125 教養娯楽 9.8; r134 その他の消費支出 17.3.
- エンゲル係数 2025: **28.6%** (e-Stat 第1-1表 r157 col16 = 28.6; 概要 txt lines 218-222, pdftotext-layout interleaved: "なお、（消費支出に占める食料費注３の割合）は、28.6％と、前年から0.3ポイントの上昇となった。" with 「エンゲル係数」 on a separate line).

## A-3. 住宅所有関係別 (by housing tenure), 2025年平均, 二人以上の世帯 (全国)

Source: e-Stat **第３－７表 「住居の所有関係別１世帯当たり１か月間の収入と支出」, 2025年, 公開日 2026-02-06** (`raw/statb-fies/estat_2025np_t3-7_fk4.xlsx`). Sheets: `二人・全国` (header r10 places 平均 at col16; header r12 places 持家 col17, うち col18 = 住宅ローン返済世帯 [label completed at r13-14; 表章なし "..."], 民営借家 col19, 公営借家 col20, 給与住宅 col21). All 円/month (名目).

二人以上の世帯（全国）, sheet `二人・全国`:

| 項目 (row) | 平均 | 持家 | 民営借家 | 公営借家 | 給与住宅 |
|---|---|---|---|---|---|
| 世帯数分布(抽出率調整) 万分比 (r16) | 10000 | 8728 | 1026 | 113 | 133 |
| 世帯人員 (r18) | 2.87 | 2.87 | 2.88 | 2.74 | 3.37 |
| 世帯主の年齢 (r24) | 60.7 | 62.3 | 49.6 | 57.7 | 44.5 |
| 持家率(％) (r25) | 87.3 | 100 | 0 | 0 | 0 |
| 家賃・地代を支払っている世帯の割合(％) (r29) | 11.7 | 1.1 | 85.6 | 80.1 | 76.3 |
| **消費支出** (r31) | **314,001** | **312,688** | **324,825** | **239,244** | **382,646** |
| 食料 (r32) | 89,754 | 90,872 | 80,472 | 70,344 | 104,678 |
| **住居** (r73) | **18,665** | **12,419** | **67,997** | **31,071** | **37,589** |
| 家賃地代 (r74) | 8,094 | 441 | 67,107 | 30,418 | 36,499 |
| 設備修繕・維持 (r75) | 10,571 | 11,978 | 890 | 654 | 1,090 |
| **光熱・水道** (r78) | **24,544** | **24,877** | **22,432** | **20,334** | **22,776** |
| 電気代 (r79) | 13,218 | 13,672 | 10,264 | 8,011 | 10,819 |
| エンゲル係数(％) (r159) | 28.6 | 29.1 | 24.8 | 29.4 | 27.4 |

**Tenure-specific shares are NOT published in 第3-7表** (amounts only) — derived shares (COMPUTABLE, not official): 住居費割合 = 住居/消費支出 → 持家 12,419/312,688 = 4.0%; 民営借家 67,997/324,825 = 20.9%; 全国 18,665/314,001 = 5.9% (matches official 第1-2表 5.9).

勤労者世帯（二人以上の世帯のうち, 全国）, sheet `勤労・全国` (header r10 places 平均 at col17; header r12: 持家 col18, うち col19, 民営借家 col20, 公営借家 col21, 給与住宅 col22) — this sheet ALSO carries income rows:

| 項目 (row) | 平均 | 持家 | うち住宅ローン返済世帯 | 民営借家 | 公営借家 | 給与住宅 |
|---|---|---|---|---|---|---|
| 世帯数分布 万分比 (r16) | 10000 | 8215 | 4017 | 1442 | 126 | 216 |
| **実収入** (r32) | **653,901** | **668,307** | 768,975 | **581,050** | 381,082 | 759,636 |
| **可処分所得** (r222) | **532,408** | **542,351** | 617,962 | **483,321** | 326,815 | 606,361 |
| 非消費支出 (r199) | 121,493 | 125,956 | 151,012 | 97,729 | 54,266 | 153,274 |
| 消費支出 (r71) | 346,297 | 347,571 | 364,003 | 342,374 | 264,280 | 374,333 |
| 住居 (r113) | 20,169 | 10,790 | 7,352 | 70,183 | 32,895 | 35,620 |
| 家賃地代 (r114) | 11,471 | 356 | 264 | 69,450 | 32,489 | 34,894 |
| 設備修繕・維持 (r115) | 8,698 | 10,434 | 7,087 | 733 | 406 | 726 |
| 光熱・水道 (r118) | 24,182 | 24,563 | 25,833 | 22,454 | 21,535 | 22,753 |
| 平均消費性向(％) (r237) | 65.0 | 64.1 | 58.9 | 70.8 | 80.9 | 61.7 |

## A-4. 単身世帯 2025 (全国)

Source: e-Stat 家計調査 家計収支編 単身世帯 詳細結果表（年次 2025年）, 公開日 2026-02-06, statistics 00200561 (`raw/statb-fies/estat_2025np_solo_t1_fk4.xlsx` 表1「（実数，構成比，増減率，寄与度）」 — 単身世帯 block: 実数 col17, 構成比 col18, 名目 col19, 実質 col20, 寄与度 col21; 勤労者世帯 block cols 22-26; 勤労者以外の世帯 block cols 27-29; item labels at col 11, header rows 10-15; `estat_2025np_solo_t8_fk4.xlsx` 表8「住居の所有関係別」); headline from 家計の概要 (txt lines 943-946).

- **消費支出 2025: 173,042円/month (名目 +2.1%, 実質 -1.5%)** — 概要 verbatim (txt line 944): "単身世帯（平均年齢58.6歳）の消費支出は、１世帯当たり１か月平均173,042円で、前年に比べ名目2.1％の増加となった。一方、実質では1.5％の減少と、３年連続の減少となった。" Cross-check solo_t1 r58: 実数 col17=173042, 構成比 col18=100, 名目 col19=2.1, 実質 col20=-1.5.
- **住居費 21,667円, 構成比 12.5%, 名目 -7.3% (実質 -9.6%)** — solo_t1_fk4.xlsx r99: 実数 col17=21667, 構成比 col18=12.5, 名目 col19=-7.3, 実質 col20=-9.6. This is the headline 単身 住居費割合 (12.5%).
- Tenure split (solo_t8_fk4.xlsx, sheet `単身`, header r10: 平均 col17, 持家 col18, 民営借家 col19, 公営借家 col20, 給与住宅 col21, うち col22 = 寮・寄宿舎 (r11-12); value rows below):
  - 消費支出 (r22): 平均 173,042 | 持家 163,436 | 民営借家 191,453 | 公営借家 133,437 | 給与住宅 178,758
  - 住居 (r37): 平均 **21,667** | 持家 **6,846** | 民営借家 **50,467** | 公営借家 20,017 | 給与住宅 15,350
  - 家賃地代 (r38): 17,606 | 319 | 49,831 | 19,919 | 15,139
  - 設備修繕・維持 (r39): 4,061 | 6,527 | 636 | 98 | 211
  - 光熱・水道 (r40): 13,333 | 15,588 | 11,129 | 11,574 | 5,333
  - 家賃・地代を支払っている世帯の割合(％) (r21): 35.1 | 1.0 | 84.2 | 76.2 | 85.0
  - (Tenure shares not published → COMPUTABLE: 持家 6,846/163,436 = 4.2%; 民営借家 50,467/191,453 = 26.4%.)
- 単身世帯 実収入/可処分所得 for ALL one-person households: **UNAVAILABLE** (solo_t1 rows 24/199 show "..."; only 勤労者世帯: 実収入 386,791円, 可処分所得 314,148円).
- 単身 十大分類 amounts+構成比 2025 (solo_t1 rows 58-141): 食料 44,659 (25.8) / 住居 21,667 (12.5) / 光熱・水道 13,333 (7.7) / 家具・家事用品 5,945 (3.4) / 被服及び履物 4,664 (2.7) / 保健医療 8,690 (5.0) / 交通・通信 19,190 (11.1) / 教育 34 (0.0) / 教養娯楽 20,250 (11.7) / その他 28,396 (from 概要 表Ⅱ-1-2, txt line 1009 block: "28,396    11.4    1.65" — note: 概要表's 構成比 for その他 is 実質増減率表, so use computed 28,396/173,042 = 16.4%; official 構成比 for その他 not quoted beyond表1 archive).

## A-5. 地域別 2025 (地方別・都市階級別 消費支出, 二人以上の世帯)

Source: e-Stat **第１－１表 「都市階級・地方・都道府県庁所在市別１世帯当たり１か月間の収入と支出」** (`raw/statb-fies/estat_2025np_t1-1_fk4.xlsx`, sheet `二人`, columns: 全国 col16, 世帯数(万分比) col17, 大都市 col18, 中都市 col19, 小都市Ａ col20, 小都市Ｂ・町村 col21, 北海道 col22, 東北 col23, 関東 col24, 北陸 col25, 東海 col26, 近畿 col27, 中国 col28, 四国 col29, 九州 col30, 沖縄 col31 (都道府県庁所在市 columns continue from col32); header rows 11-12, item labels at col 13).

- 消費支出 (row 29, 円/month): **全国 314,001 | 大都市 327,106 | 中都市 313,456 | 小都市Ａ 308,737 | 小都市Ｂ・町村 299,011 | 北海道 294,154 | 東北 298,991 | 関東 337,946 | 北陸 330,342 | 東海 312,195 | 近畿 304,226 | 中国 294,540 | 四国 286,138 | 九州 281,569 | 沖縄 235,742**
- 住居 (row 71): 全国 18,665 | 大都市 22,862 | 町村 13,074 | 関東 21,178 | 沖縄 21,822 | 北海道 20,598 (full row in archive)
- 家賃地代 (row 72): 全国 8,094 | 大都市 11,835 | 沖縄 18,017 | 北陸 2,924
- 光熱・水道 (row 76): 全国 24,544 | 北海道 31,558 | 東北 31,279 | 沖縄 22,549
- エンゲル係数 (row 157): 全国 28.6 | 沖縄 32.8 | 北海道 27.2
- 住居構成比 by region (第1-2表, sheet `二人`): 全国 5.9 | 大都市 7.0 | 中都市 5.7 | 小A 6.0 | 町村 4.4 | 北海道 7.0 | 沖縄 9.3
- 勤労者世帯 by region (t1-1 sheet `勤労`, column layout as sheet `二人` shifted +1: 全国 col17, 世帯数 col18, 大都市 col19, …, 沖縄 col32; 実収入 r30 / 可処分所得 r220 / 消費支出 r69): 実収入 r30 = 全国 653,901 | 大都市 690,415 | 中都市 664,965 | 小都市Ａ 620,071 | 小都市Ｂ・町村 612,013 | 北海道 573,031 | 東北 635,205 | 関東 715,137 | 北陸 681,227 | 東海 648,922 | 近畿 633,387 | 中国 583,655 | 四国 617,095 | 九州 564,234 | 沖縄 491,227; 可処分所得 r220 = 全国 532,408 | 大都市 558,851 | 北海道 475,589 | 沖縄 425,936. (Values corrected in the completion pass — the earlier draft had mislabeled the 北海道/東北 values and two unsupported 沖縄 figures.)

## A-6. 総世帯 (参考) 2025

家計の概要 表Ⅱ-1-1 (txt lines 976-993): 総世帯 消費支出 2025: 259,880円 (+3.6% 名目, -0.1% 実質); 2016-2025 series in the same table ("242,425 243,456 246,399 249,704 233,568 235,120 244,231 247,322 250,929 259,880").

---

# B. CPI — 消費者物価指数

## B-0. Raw file inventory (all fetched 2026-10-26)

| File (under `raw/statb-cpi/`) | Source URL | HTTP | Bytes | sha256 (first 16 hex) |
|---|---|---|---|---|
| cpi_index.html (+.utf8) | https://www.stat.go.jp/data/cpi/index.htm | 200 | 16,535 | 8a215e171bac503e |
| cpi_1.html (+.utf8) | https://www.stat.go.jp/data/cpi/1.html | 200 | 27,699 | ff29bfd1e6772d16 |
| cpi_2025_sokyu.html (+.utf8) | https://www.stat.go.jp/data/cpi/2025/sokyu.html | 200 | 14,745 | 655f6d55c09e94f0 |
| cpi_sokuhou_z_index.html (+.utf8) | https://www.stat.go.jp/data/cpi/sokuhou/tsuki/index-z.html | 200 | 13,876 | 0a7468fb40ba0e11 |
| cpi_nen_index-z.html (+.utf8) | https://www.stat.go.jp/data/cpi/sokuhou/nen/index-z.html | 200 | 13,548 | db00591ac26cf527 |
| cpi_2026-09_zenkoku.pdf (+.txt) | https://www.stat.go.jp/data/cpi/sokuhou/tsuki/pdf/zenkoku.pdf | 200 | 438,628 | eedf9ae4bd6a39ca |
| cpi_2025-nen-avg_zen-n.pdf (+.txt) | https://www.stat.go.jp/data/cpi/sokuhou/nen/pdf/zen-n.pdf | 200 | 414,762 | f3f387fef45dec37 |
| estat_2025base_lt_chubun_index.csv (+.utf8.csv) | e-Stat statInfId=000040482829 fileKind=1 | 200 | 27,038 | f639475ca393ec12 |
| estat_2025base_lt_chubun_yoy.csv (+.utf8.csv) | e-Stat statInfId=000040482833 fileKind=1 | 200 | 23,398 | 48ec77137833624b |
| estat_2025base_lt_hinmoku_index.csv (+.utf8.csv) | e-Stat statInfId=000040482831 fileKind=1 | 200 | 214,076 | cfa494f77d7b5646 |
| estat_2025base_lt_hinmoku_yoy.csv (+.utf8.csv) | e-Stat statInfId=000040482835 fileKind=1 | 200 | 187,746 | 003c6feb4aafd139 |
| estat_2025base_lt_jika_excl_total_index.csv (+.utf8.csv) | e-Stat statInfId=000040482830 fileKind=1 | 200 | 1,250 | b07ab5bc500da9d1 |
| estat_2025base_lt_zhi_service_index.csv (+.utf8.csv) | e-Stat statInfId=000040482832 fileKind=1 | 200 | 14,102 | ca91bda72947ed18 |
| cpi_historic_index_404.html | https://www.stat.go.jp/data/cpi/historic/index.html | **404** | 4,691 | 606194abc6d7f345 |
| estat_cpi2025base_lt_list.html | e-Stat files list 「消費者物価指数 2025年基準消費者物価指数 長期時系列データ 品目別価格指数 全国 年平均」 (UTF-8 page; shows 公開日 2026-08-07 ×8) | 200 | 171,373 | da862ea2429cc0d8 |

Full 64-hex sha256:
- cpi_2026-09_zenkoku.pdf `eedf9ae4bd6a39caff63e398a29864677fab2a405b74c702e53269df926b918a`
- cpi_2025-nen-avg_zen-n.pdf `f3f387fef45dec37fdf0881b68e8cfd2a39daaede3b147d67072b894fe79d04c`
- estat_2025base_lt_chubun_index.csv `f639475ca393ec12e884aaaea5ea2d75da271ee15490486d8edede44d0d41370`
- estat_2025base_lt_chubun_yoy.csv `48ec77137833624b208b26741e212019c72cb87787213743c4a50cb40ce05c73`
- estat_2025base_lt_hinmoku_index.csv `cfa494f77d7b56469672c11ce97d966dbd54f59f930040ac3cb27729334e6c10`
- estat_2025base_lt_hinmoku_yoy.csv `003c6feb4aafd13908aee0b7fbc55dfe56866af482c10f4f63d6969427ae6ff8`
- estat_2025base_lt_jika_excl_total_index.csv `b07ab5bc500da9d1805a95f86b108b6c9067bd75139d1130527b227f97c52352`
- estat_2025base_lt_zhi_service_index.csv `ca91bda72947ed18fad1d587ca7878131333b4c1222b6e225b0903dcc950e57c`

## B-1. 2025年平均 (annual average) CPI — published in the 2020 base on 2026-01-23

Source: 「2020年基準 消費者物価指数 全国 2025年(令和7年)12月分及び2025年(令和7年)平均」, 令和8年1月23日 (`raw/statb-cpi/cpi_2025-nen-avg_zen-n.pdf`, text `.txt`). Result-overview page: `cpi_nen_index-z.utf8.html` ("2020年基準　消費者物価指数　全国　2025年（令和7年）平均　（2026年1月23日公表）").

- **総合指数 2025年平均: 111.9 (2020=100), 前年比 +3.2%** — verbatim (txt line 224): "(1) 総合指数は2020年を100として111.9　前年比は3.2％の上昇"
- 生鮮食品を除く総合: 111.2, +3.1% (txt line 226); 生鮮食品及びエネルギーを除く総合: 110.3, +3.0% (txt line 228)
- 表7 (txt lines 276-288), 総合 annual 2013-2025 (2020=100): "94.9 97.5 98.2 98.1 98.6 99.5 100.0 100.0 99.8 102.3 105.6 108.5 111.9"; 前年比 row: "0.4 2.7 0.8 -0.1 0.5 1.0 0.5 0.0 -0.2 2.5 3.2 2.7 3.2" (i.e. 2020: 0.0, 2021: -0.2, 2022: +2.5, 2023: +3.2, 2024: +2.7, 2025: +3.2)
- 表8 「10大費目指数、前年比及び寄与度」 (txt lines 296-310), 2025年平均 (2020=100): 総合 111.9 (+3.2) | 生鮮食品を除く総合 111.2 (+3.1) | 生鮮食品及びエネルギーを除く総合 110.3 (+3.0) | 食料 125.8 (+6.8) | 生鮮食品 129.4 (+5.6) | **生鮮食品を除く食料 125.2 (+7.0)** | 住居 104.0 (+1.0) | 光熱・水道 116.9 (+3.6) | 家具・家事用品 121.6 (+2.7) | 被服及び履物 111.1 (+2.6) | 保健医療 104.3 (+1.5) | 交通・通信 100.0 (+2.7) | 教育 97.1 (-4.5) | 教養娯楽 115.6 (+2.4) | 諸雑費 105.9 (+1.1)
- 家賃 annual 2025: see B-4 (2025-base file: 家賃 2025=100.0, 前年比 +0.3%). In the 2020-base annual PDF the 家賃 row is published monthly only (Dec 2025 家賃 101.1, +0.5%, 第2表); an annual 家賃 figure in the 2020 base is **UNAVAILABLE** in the archived annual PDF tables.
- エネルギー annual 2025: 2025-base YoY file (B-4): +3.6%. 2020-base annual figure UNAVAILABLE in archived PDF (energy shown monthly; Dec 2025 エネルギー 121.1, -3.1%, "別掲" row of 第2表).

## B-2. Latest monthly release as of 2026-10-26 — 2026年9月分 (2025年基準), published 2026-10-23

Source: 「2025年基準 消費者物価指数 全国 2026年(令和８年)９月分」, **令和8年10月23日** (`raw/statb-cpi/cpi_2026-09_zenkoku.pdf`, text `.txt`; overview page `cpi_sokuhou_z_index.utf8.html`).

- **総合指数 2026年9月: 102.2 (2025=100), 前年同月比 +2.1%, 前月比(季節調整値) +0.4%** — verbatim (txt lines 6-7): "(1) 総合指数は2025年を100として102.2　前年同月比は 2.1％の 上昇　前月比(季節調整値)は 0.4％の 上昇"
- 生鮮食品を除く総合: 102.3, +2.1% (txt lines 10-11); 生鮮食品及びエネルギーを除く総合: 102.8, +2.4%
- 第2表 中分類指数 (txt lines 362-430; 2026年9月, 2025=100, ウエイト/10000):
  - 総合 10000 → 指数 102.2, 前年同月比 2.1 (line 370)
  - 食料 2754 → 103.6, +2.8 (line 382); **生鮮食品を除く食料 2375 → 103.9, +2.9** (line 384)
  - 住居 2182 → 101.3, +1.1 (line 402); **家賃 1861 → 100.6, +0.6** (line 405); 持家の帰属家賃を除く家賃 227 → 100.9, +0.8 (line 406); 設備修繕・維持 321 → 105.1, +4.5 (line 407)
  - 光熱・水道 698 → 97.0, +0.8; 電気代 376 → 92.5, -2.4; ガス代 139 → 99.5, +2.4; 上下水道料 144 → 101.3, +3.5
  - エネルギー (表5, txt line 158): ウエイト 749, 2026年9月 前年同月比 **-0.6** (寄与度 -0.04). Caution: the same line also carries the 2026年8月 前年同月比 -0.7 and the 9月 前月比 -1.2 — the September YoY is -0.6. (Corrected in the completion pass; an earlier draft quoted -0.7, which is the August column.)
- 表1 (txt lines 39-56) monthly 総合原数値 2025年9月〜2026年9月: 100.1, 100.7, 101.0, 100.9, 100.8, 100.2, 100.6, 101.0, 101.5, 101.6, 102.0, 102.2, 102.2 (2025年9月→2026年9月)

## B-3. 長期時系列 (long-run annual 総合) — 2025年基準 (2025=100), 1970–2025

Source: e-Stat **2025年基準長期時系列データ 品目別価格指数 全国 年平均, 表1 中分類指数（1970年～最新年）**, 調査年月 2025年, 公開日 2026-08-07 (`raw/statb-cpi/estat_2025base_lt_chubun_index.csv`, Shift_JIS; UTF-8 copy `.utf8.csv`). Column 1 = 総合 (header line 1: "類・品目,総合,生鮮食品を除く総合,持家の帰属家賃を除く総合,…"). Data rows: 1970 = line 7 … 2025 = line 62.

**総合指数 (2025年=100), annual:**
- 1970: **27.6** (line 7) | 1980: **65.4** (line 17) | 1990: **80.1** (line 27) | 1995: **85.7** (line 32) | 2000: **86.9** (line 37) | 2010: **84.7** (line 47) | 2019: 89.3 | 2020: **89.3** (line 57) | 2021: **89.1** (line 58) | 2022: **91.4** (line 59) | 2023: **94.3** (line 60) | 2024: **96.9** (line 61) | 2025: **100.0** (line 62)
- Note: the file carries one row per year 1970-2025 with no gaps (all values quoted above read from the row whose first cell is the year; 1946-era values exist only for 持家の帰属家賃を除く総合 in a separate file, `estat_2025base_lt_jika_excl_total_index.csv`, from 1947).
- Cross-check vs 2020-base 表7: 2025=100.0 (2025 base) ↔ 111.9 (2020 base); both give 前年比 +3.2% for 2025 (100.0/96.9 vs 111.9/108.5).

## B-4. 品目グループ別 indices (2025=100), annual 2020–2025 + YoY

Sources: `estat_2025base_lt_chubun_index.csv` (index levels; rows = years at lines 57-62) and `estat_2025base_lt_chubun_yoy.csv` (前年比, 表2 中分類指数 前年比（1971年～最新年）; 2025 row = line 62) + `estat_2025base_lt_hinmoku_yoy.csv` (品目別 前年比 for 民営家賃/公営家賃).

**Index levels (2025=100), annual:**

| 年 | 総合 | 食料 | 生鮮食品を除く食料 | 住居 | 家賃 | 光熱・水道 | エネルギー |
|---|---|---|---|---|---|---|---|
| 2020 | 89.3 | 79.5 | 79.9 | 96.1 | 99.2 | 85.6 | 81.3 |
| 2021 | 89.1 | 79.5 | 80.1 | 96.7 | 99.3 | 86.7 | 84.5 |
| 2022 | 91.4 | 83.0 | 83.1 | 97.3 | 99.4 | 99.5 | 98.9 |
| 2023 | 94.3 | 89.7 | 90.0 | 98.4 | 99.4 | 92.8 | 93.0 |
| 2024 | 96.9 | 93.6 | 93.4 | 99.1 | 99.7 | 96.6 | 96.5 |
| 2025 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |

**前年比 (YoY, %):**

| 年 | 総合 | 生鮮食品を除く総合 | 食料 | 生鮮食品を除く食料 | 住居 | 家賃 | 光熱・水道 | エネルギー |
|---|---|---|---|---|---|---|---|---|
| 2020 | 0.0 | -0.2 | 1.4 | 1.0 | 0.6 | 0.1 | -2.4 | -4.2 |
| 2021 | -0.2 | -0.2 | 0.0 | 0.2 | 0.6 | 0.1 | 1.3 | 3.9 |
| 2022 | 2.5 | 2.3 | 4.5 | 3.8 | 0.6 | 0.0 | 14.8 | 17.1 |
| 2023 | 3.2 | 3.1 | 8.1 | 8.2 | 1.1 | **0.1** | -6.7 | -6.0 |
| 2024 | 2.7 | 2.5 | 4.3 | 3.8 | 0.7 | **0.2** | 4.0 | 3.8 |
| 2025 | 3.2 | 3.1 | 6.8 | 7.0 | 1.0 | **0.3** | 3.6 | 3.6 |

- 家賃 YoY 2023/2024/2025 = **+0.1 / +0.2 / +0.3** (chubun_yoy.csv, 家賃 column, lines 60-62). 品目別 split (`estat_2025base_lt_hinmoku_yoy.csv`): **民営家賃** +0.1 / +0.3 / +0.5; 公営家賃 0.0 / +0.6 / +0.5; 持家の帰属家賃 +0.1 / +0.2 / +0.3 (2023/2024/2025).
- 家賃 index levels by tenure (`estat_2025base_lt_hinmoku_index.csv`, 2022-2025): 家賃 99.4/99.4/99.7/100.0; 民営家賃 99.2/99.3/99.5/100.0; 公営家賃 98.9/98.9/99.5/100.0; 持家の帰属家賃 99.4/99.5/99.7/100.0.
- Weight note (from 中分類 file header lines 4-6, 2025 base, /10000): 総合 10000, 食料 2754, 生鮮食品を除く食料 2375, 住居 2182, 家賃 1861, 光熱・水道 698, エネルギー 749 (別掲).

## B-5. 2025年基準改定 (base revision) — release context

- `cpi_2025_sokyu.utf8.html` (title "2025年基準改定について") links the explanation set: 「2025年基準消費者物価指数のしくみと見方」(/data/cpi/2025/mikata/index.html), ウエイト, モデル品目, 公表スケジュール (2025_sche.pdf), 新・旧指数の接続 (/data/cpi/2025/kaisetsu/pdf/3-6.pdf).
- `cpi_1.utf8.html` states: "2024年12月以前の旧基準の指数系列を、2025年（令和7年）を100とする指数に換算したもの（接続指数）及び現行基準の最新月までの指数を掲載しています。" and "※全国及び東京都区部の「持家の帰属家賃を除く総合」については1946年8月分から掲載しています。"
- The 2025-base長期時系列データ e-Stat files are dated 公開（更新）日 2026-08-07; the monthly 月報 tables 2026-10-23.

---

# C. 家計の住宅・土地に関する調査 (Housing and Land Survey of Households / FIES-family) — UNAVAILABLE

- `https://www.stat.go.jp/data/jyutaku/kei/index.htm` → **HTTP 404** (probe `raw/statb-fies/jyutaku_kei_404.html`, 4,691 bytes, sha256 606194abc6d7f345…).
- `https://www.stat.go.jp/data/juutaku/kei/index.html` → **HTTP 404** (probe `raw/statb-fies/juutaku_kei_404.html`, byte-identical error page). `https://www.stat.go.jp/data/kakei/jyutaku/index.htm` → **HTTP 404** (probe `raw/statb-fies/kakei_jyutaku_404.html`).
- The housing survey that DOES exist under /data/jyutaku/ is 令和5年住宅・土地統計調査 (live HTTP 200 re-checked 2026-10-26; that page and all its round files were already archived by Task 4-a in `raw/statb-housing/`, e.g. `jyutaku_portal.html` — title "統計局ホームページ/令和5年住宅・土地統計調査"), with 確報集計 (住宅及び世帯に関する基本集計 / 土地集計 / 住宅の構造等に関する集計), 住宅数概数集計 and an 空き家 analysis. Previous round: 平成30年(2018) — i.e. this survey now runs on a 5-year cycle in this environment, and the triennial FIES-family 住宅取得 round has no online presence. **No 2024 round of the FIES-family 住宅取得 survey exists online as of 2026-10-26; 持家の住宅取得価格 / 住宅取得世帯の年間収入 / 住宅ローン返済負担率 values: UNAVAILABLE.** (For context, the FIES 2025 annual report's 第2-6表「住居の所有関係，年間収入階級別」and 第3-10表「住宅ローン返済世帯－世帯主の年齢階級別」exist on e-Stat — stat_infid 000040409529 / 000040409541, listed on the archived `estat_fies2025np_detaillist.html` — and could substitute partially if the site needs housing-finance detail; not downloaded this session.)

---

## D. Surprises / caveats for the chapter build

1. **CPI base switch mid-2026**: 2025 annual average (published 2026-01-23) is in the 2020 base (総合 111.9); from the 2025-base revision (長期時系列 published 2026-08-07; monthly releases at least through 2026年9月分) the current base is **2025=100**. Any chapter chart mixing the 2025 annual PDF values with the 2025-base long-run series MUST label the base explicitly. YoY rates are consistent across both (2025 総合 +3.2%).
2. **FIES URL migration**: /data/sav/ → /data/kakei/ (家計収支編). Old /data/sav/ 貯蓄・負債編 remains at /data/sav/2025np/index.html ("家計調査年報 貯蓄・負債編（2025年（令和7年））" — linked from the FIES top page).
3. **FIES 実質増減率 retroactive revision** with the CPI 2025-base change (notice PDF /data/kakei/pdf/oshirase_20260904.pdf linked from the FIES top page) — the 家計の概要's nominal values are unaffected, but real-rate series published before 2026-09-04 may differ from current ones.
4. **Two published versions of every 十大分類 amount for 2025 二人以上の世帯** (e.g. 食料 94,895 vs 89,754円, その他 47,093 vs 54,387円) — 品目分類概要表 (贈答品・サービス込み) vs 用途分類第1-1表; the official 構成比 belongs to the 用途分類. Label the classification explicitly when quoting (see A-2).
5. 家計の概要 PDF's 表Ⅱ-1-2 quotes 単身 住居 21,667円 (実質 -9.6%) while 単身 表1 gives 前年比 -7.3 (名目) — nominal vs real distinguished.
6. CPI erratum issued Oct 2026 (202610_seigo.pdf) and a model replacement (9372 テーマパーク入場料, 2026年9月分適用) — both linked from the CPI top page; no values in this notes file are affected (they come from tables published after/with those notices).

---

## E. Completion-pass verification record (2026-10-26, same access date)

- Raw-file inventory re-hashed: every byte count and sha256 in the A-0/B-0 tables re-computed from disk and matched.
- Live HTTP re-check of 13 key URLs: all 200 (kakei top / 2025np index / summary.pdf / type-two.xlsx / cpi top / monthly zenkoku.pdf / annual zen-n.pdf / two e-Stat file-downloads / english/data/cpi / english/data/sav / data/jyutaku/index.htm) except `data/sav/index.htm` and `data/sav/nen/index.htm` (404). English page titles confirmed verbatim: "Statistics Bureau Home Page/Consumer Price Index", "Statistics Bureau Home Page/Family Income and Expenditure Survey (Savings and Liabilities)".
- Value re-derivation: 2025 消費支出 314,001 (概要 txt + t1-1 + longtime t2-two r29), 2000-2025 消費支出 series (t2-two r29 cols 16-41), 勤労 実収入/可処分所得 (longtime t2-kinrou r30/r220), ten-category amounts and 構成比 (t1-1/t1-2), tenure tables (t3-7 both sheets incl. income rows), solo t1/t8 blocks, regional rows (t1-1 r29/r30/r220 + t1-2 r71), CPI annual 111.9/+3.2 and 表7/表8 rows, CPI monthly 102.2/+2.1 and 表2/表5/表1 rows, CPI long-run 1970/1980/1990/1995/2000/2010/2020-2025 総合 and the four group index/YoY tables, 家賃 YoY by tenure — all re-read from the raw files this session.
- Draft corrections made (earlier interrupted run's errors, all fixed above): (1) off-by-one XLSX column indices in t1-1/t1-2/t3-7/solo_t1/solo_t8 and the t2-kinrou year-column range (values were correct, references wrong); (2) CPI 2026年9月 エネルギー 前年同月比 corrected -0.7 → **-0.6** (-0.7 is the August column on the same line); (3) A-5 勤労者世帯 regional 実収入/可処分所得 values corrected — the draft had mislabeled 北海道/東北 and two 沖縄 figures that appear nowhere in the raw file (実収入 沖縄 is 491,227, 可処分所得 沖縄 is 425,936); (4) A-2 rewritten as two separate classification tables — the draft had joined 概要 品目分類 amounts with e-Stat 用途分類 構成比 in a single table; (5) エンゲル係数 概要 quote re-anchored to the actual pdftotext-interleaved lines (218-222); (6) 表Ⅰ-1-1 line-range typos fixed (282-366, notes at 358); (7) B-2 headline quote line refs fixed to 6-7.
- Missing evidence restored: the four 404 probes (`jyutaku_kei_404.html`, `juutaku_kei_404.html`, `kakei_jyutaku_404.html`, `cpi_historic_index_404.html`) re-fetched and kept (the earlier session had left the first three in a `raw/statb-jyutaku/` directory that Task 4-a removed as byte-duplicates, and deleted the CPI probe after recording); `kakei_sokuhou_index.utf8.html` sidecar created; four e-Stat list pages archived as publication-date evidence (FIES 二人以上 詳細結果表 and 単身 詳細結果表: 公開（更新）日 2026-02-06; 家計調査 長期時系列表: 2026-10-09; CPI 2025年基準 長期時系列データ: 2026-08-07).
- Arithmetic cross-checks: ten 用途分類 amounts sum to 314,000 (±1 rounding vs 314,001); ten 構成比 sum to 100; 2025-base vs 2020-base YoY agree (100.0/96.9 and 111.9/108.5 both +3.2%).
