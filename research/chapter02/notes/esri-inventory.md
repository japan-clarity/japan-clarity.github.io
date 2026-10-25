# ESRI National Accounts — Acquisition & Structure Inventory (Task 2-a)

- **Project:** Japan Clarity, Chapter 02 (Economy & Industry)
- **Dataset:** 内閣府経済社会総合研究所 (ESRI, Cabinet Office) 国民経済計算年次推計 — 2024年度 (令和6年度) annual estimates, **2020年基準 (2020 base), 2008SNA**
- **Listing page:** https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/2024_kaku_top.html (title: `2024年度国民経済計算（2020年基準・2008SNA） : 経済社会総合研究所 - 内閣府`)
- **Publication date evidence:** the point_flow PDF cover states `令和７年12月23日` (= 2025-12-23) and `(12/23（火）15:00公表予定)`; all three reference PDFs carry the `_20251223` filename suffix. **No explicit date string (令和7年12月23日 / 2025年12月23日) exists on the listing HTML itself.**
- **Download window:** 2026-10-25 (sandbox session), `curl -sS --max-time 60`
- **Local dir:** `/home/z/jc-ch02/research/chapter02/raw/esri/`
- **Scope note:** structure inventory only. No statistics were extracted to JSON and no values are interpreted here; numeric excerpts below are verbatim renderings of file structure/page text.

---

## 1. Download log (URL · HTTP status · bytes · sha256)

| # | Local file | URL | HTTP | Bytes | sha256 |
|---|---|---|---|---|---|
| 1 | `esri-2024fcm1n_jp.xlsx` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/tables/2024fcm1n_jp.xlsx | 200 | 47,539 | `2cd1d8d72b3e715fbc6bfb46758aff0d07ba08172dc143640a598f5a90ade12d` |
| 2 | `esri-2024fcm1rn_jp.xlsx` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/tables/2024fcm1rn_jp.xlsx | 200 | 39,116 | `dd90bf943a2067756652f2c22c4912fbd89424431c6ab47aa898820832b7d2c7` |
| 3 | `esri-2024fcm1dn_jp.xlsx` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/tables/2024fcm1dn_jp.xlsx | 200 | 27,613 | `777e4fda325d452caf3651ceebf63ceda95a43a3a7e10d8d7f28eb6b029f9556` |
| 4 | `esri-2024s2n_jp.xlsx` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/tables/2024s2n_jp.xlsx | 200 | 172,210 | `560a8883941efee581b784219327daa7e03e6a7d4955f04f140f64d19f0118a7` |
| 5 | `esri-2024s3_jp.xlsx` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/tables/2024s3_jp.xlsx | 200 | 64,141 | `fe6fc354cebacaff1e97906f42e88701c4f3e591ff16af913393b820bd2429b8` |
| 6 | `esri-2024i5_jp.xlsx` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/tables/2024i5_jp.xlsx | 200 | 192,672 | `5c72b85469dbe9b8320f76c99409cebc8bc5a45932aec9ee33c11cf54115164a` |
| 7 | `esri-hitoriatarigdp_20251223.pdf` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/sankou/pdf/hitoriatarigdp_20251223.pdf | 200 | 205,482 | `c4f22ca9448d070fc4bdd0abe61e196dda14f1d5691d806b8234ed28091ca480` |
| 8 | `esri-kokusaihikaku_20251223.pdf` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/sankou/pdf/kokusaihikaku_20251223.pdf | 200 | 182,440 | `bbaa2ea0b393be3be9fb7d29865a03dfdfdbdd3e80a93eb8bbaca1022c8ce48d` |
| 9 | `esri-point_flow20251223.pdf` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/sankou/pdf/point_flow20251223.pdf | 200 | 810,044 | `ee843b33ea8a5fa987517cd1f1cd989928ee3a2920ac6e08d3f9e971d0abf2a4` |
| 10 | `esri-2024_kaku_top.html` | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/2024_kaku_top.html | 200 | 37,127 | `b750318661744a7f5d28e3ea9d7bd1b483769dbabe4bd7c3faa599c31788a46f` |
| 11 | `esri-2024_materials_j.html` (supplementary provenance) | https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/materials_j.html | 200 | 8,834 | `6e669f06548e10af0959f03409ec30b42734d881028afc0d017690ed8c6ce93c` |

File-format verification (`file` magic): all 6 `.xlsx` = "Microsoft Excel 2007+"; all 3 `.pdf` = "PDF document, version 1.7"; HTML = UTF-8 with CRLF. **No download failures.**

---

## 2. Excel structure inventory

Common layout for the `fcm1*` and `i5`/`s3` time-series sheets:
- row 1 = table title; row 4 = unit (`（単位：…）`) / measure (`実数` etc.); row 5 = Japanese era-year column labels (e.g. `平成6暦年`, `平成6年度`); **row 7 = AD year numbers (the machine-readable year axis)**; series labels in **column A** from row 8; data in columns B onward (one column per year, B=1994 … AF=2024 = 31 columns).

### 2.1 `esri-2024fcm1n_jp.xlsx` — 主要系列・暦年・名目 (main series, calendar year, nominal)

- **Sheets (4):** `実数`, `増加率`, `構成比`, `寄与度`
- Title (sheet `実数` r1): `１．国内総生産（支出側、名目）`; unit (r4): `（単位：１０億円）` + `実数`.
- Year coverage: `実数` and `構成比` = **1994–2024 (31 columns, B–AF)**; `増加率` and `寄与度` = **1995–2024 (30 columns)** (year-on-year measures start 1995).
- **GDP row (verbatim):** sheet `実数` **row 48**: `５．　国内総生産（支出側）(1+2+3+4)` — values present in every year column, **first value col B (1994), last value col AF (2024)**.
- Other verbatim key rows (sheet `実数`): r8 `１．　民間最終消費支出`; r9 `（１）家計最終消費支出`; r18 `２．　政府最終消費支出`; r22 `３．　総資本形成`; r23 `（１）総固定資本形成` (r24 `ａ．民間`, r25 `（ａ）住宅`, r26 `（ｂ）企業設備`, r27 `ｂ．公的`); r31 `（２）在庫変動`; r40 `４．　財貨・サービスの純輸出`; r41 `（１）財貨・サービスの輸出`; r44 `（２）（控除）財貨・サービスの輸入`; r48 `５．　国内総生産（支出側）(1+2+3+4)`; r50 `（参考）海外からの所得の純受取`; r53 `国民総所得`; r55 `（参考）国内需要`; r56 `民間需要`; r57 `公的需要`. Notes rows r58–r61 define 民間需要/公的需要/国内需要/国民総所得 identities.

### 2.2 `esri-2024fcm1rn_jp.xlsx` — 暦年・実質 (real, chain-linked)

- **Sheets (3):** `実数`, `増加率`, `寄与度` (no 構成比 for real series)
- Title: `１．国内総生産（支出側、実質：連鎖方式）`; unit: `（単位：１０億円）　（2020暦年連鎖価格）`.
- Year coverage: `実数` 1994–2024 (31 cols); `増加率`/`寄与度` 1995–2024 (30 cols).
- **GDP row:** sheet `実数` **row 48**: `５．　国内総生産（支出側）` — values B(1994)–AF(2024).

### 2.3 `esri-2024fcm1dn_jp.xlsx` — 暦年・デフレーター (deflator, chain-linked)

- **Sheets (2):** `実数`, `増加率`
- Title: `１．国内総生産（支出側、デフレーター：連鎖方式）`; unit: `（2020暦年=100）`.
- Year coverage: `実数` 1994–2024 (31 cols); `増加率` 1995–2024 (30 cols).
- **GDP row:** sheet `実数` **row 44**: `５．　国内総生産（支出側）` — values B(1994)–AF(2024).

### 2.4 `esri-2024s2n_jp.xlsx` — 経済活動別GDP（名目） (value added by economic activity, nominal)

- **Sheets (31): one sheet per calendar year**, full-width sheet names `平成６`,`平成７`,…,`平成３０`,`令和元`,`令和２`,…,`令和６` = **1994–2024**. (`令和元` = 2019, unnumbered.)
- Per-sheet layout (identical across years): r1 title `２．経済活動別の国内総生産・要素所得`; r4 `（単位：１０億円）` + year tag e.g. `令和6暦年 (2024)` + `名目`; r5–r7 column headers: `産出額（生産者価格表示）(1)`, `中間投入(2)`, `国内総生産（生産者価格表示）(3)=(1)-(2)`, `固定資本減耗(4)`, `国内純生産(5)=(3)-(4)`, `生産・輸入品に課される税（控除）補助金(6)`, `国内要素所得(7)=(5)-(6)`, `雇用者報酬(8)`, `営業余剰・混合所得(9)` — data columns **B–J**.
- Row labels (column A, r8–r51), verbatim: `１．農林水産業`, `２．鉱　業`, `３．製　造　業` (+14 sub-rows `（１）食　料　品` … `（１４）その他の製造業` incl. `（１０）電子部品・デバイス`, `（１３）輸送用機械`), `４．電気・ガス・水道・廃棄物処理業`, `５．建　設　業`, `６．卸売・小売業`, `７．運輸・郵便業`, `８．宿泊・飲食サービス業`, `９．情報通信業`, `１０．金融・保険業`, `１１．不動産業`, `１２．専門・科学技術、業務支援サービス業`, `１３．公　務`, `１４．教　育`, `１５．保健衛生・社会事業`, `１６．その他のサービス`; then **r39 `　　経済活動　計`**, r41 `　　輸入品に課される税・関税`, r42 `　　（控除）総資本形成に係る消費税`, **r44 `　　合　　　　計`** (= GDP), and a reference block r46–r51: `（参考）制度部門別の国内総生産・要素所得` → `市場生産者`, `一般政府`, `対家計民間非営利団体`, `計`.
- ⚠ **Structural finding:** there are **NO `産業合計` / `第一次産業` / `第二次産業` / `第三次産業` aggregate rows anywhere in this workbook** (0 matches, all 31 sheets). Primary/secondary/tertiary aggregates must be **derived** by summing the 16 activities (the activity→industry mapping is documented in ESRI's `経済活動別分類` PDF, linked from the materials page as `../2024/sankou/pdf/katudo_bunrui.pdf`). The extraction agent must do this mapping explicitly; note e.g. that ESRI's "第三次産業" convention includes 電気・ガス・水道・廃棄物処理業.

### 2.5 `esri-2024s3_jp.xlsx` — 経済活動別の就業者数・雇用者数、労働時間数 (employment & hours by activity)

- **Sheets (6):** `年度（１）就業者`, `年度（２）雇用者`, `年度（３）労働時間数`, `暦年（１）就業者`, `暦年（２）雇用者`, `暦年（３）労働時間数`
- Layout per sheet: r1 title `３．経済活動別の就業者数・雇用者数、労働時間数`; r2 sub-title (`（１）就業者` / `（２）うち雇用者` / `（３）労働時間数（雇用者）`); r4 unit — `（単位：万人）` for 就業者/雇用者, `（単位：時間）` for 労働時間数 (hours are per **employee**, annual); r5 era labels (`平成6年度` for 年度 sheets, `平成6暦年` for 暦年 sheets); **r7 AD years, 1994–2024 (31 cols, B–AF)**; rows from r8 = same 16-activity classification as s2n.
- Verbatim totals rows: **r39 `　　　合　　　　計`** (all-activities total; values B(1994)–AF(2024)); institutional-sector block r42 `　　市場生産者`, r43 `　　一般政府`, r44 `　　対家計民間非営利団体`, r45 `　　合　　　　計`.
- ⚠ Same structural finding as s2n: **no `第N次産業` / `産業合計` rows** (0 matches). Sector aggregates must be derived from the 16 activities.
- 年度 sheets = fiscal years (平成6年度 = FY1994 … 令和6年度 = FY2024); 暦年 sheets = calendar years 1994–2024.

### 2.6 `esri-2024i5_jp.xlsx` — 家計（個人企業を含む）勘定 (household account incl. personal businesses)

- **Sheets (15):** `年度（１）`,`年度（２）`,`年度（３）`,`年度（４）a`,`年度（４）b` (fiscal year) · `暦年（１）`…`暦年（４）a`,`暦年（４）b` (calendar year) · `四半期（１）`…`四半期（４）a`,`四半期（４）b` (quarterly)
- Accounts (r2 sub-titles, verbatim): `（１）第１次所得の配分勘定`, `（２）所得の第２次分配勘定`, `（３）現物所得の再分配勘定`, `（４）所得の使用勘定　ａ．可処分所得の使用勘定`, `（４）所得の使用勘定　ｂ．調整可処分所得の使用勘定`. Title r1: `５．家計（個人企業を含む）`; unit r4 `（単位：１０億円）`.
- Year coverage: 年度 and 暦年 sheets = **1994–2024 (31 cols, B–AF)**; 四半期 sheets = quarterly columns (r5 era-year `平成6年`…; r7 quarter tags `１－３．`/`４－６．`/`７－９．`/`１０－１２．`), data columns B–DV.
- **可処分所得 (disposable income) rows, verbatim (暦年 sheets, values B(1994)–AF(2024)):**
  - `暦年（２）` **r22**: `2.4 　可処分所得（純）((2.5+2.6+2.7)-(2.1+2.2+2.3)),(3.2),(4.3)` ← net disposable income (the canonical household disposable income row)
  - `暦年（２）` **r23**: `　　（再掲）可処分所得（総）` (gross)
  - `暦年（３）` r8: `3.1 　調整可処分所得（純）(5.3)`; r9: `　　（再掲）調整可処分所得（総）`; r14: `3.2 　可処分所得（純）(2.4)`; r15: `　　（再掲）可処分所得（総）`
  - `暦年（４）a` r15: `4.3 　可処分所得（純）(2.4)`; r16: `　　（再掲）可処分所得（総）`; note r23: `（注）貯蓄率＝貯蓄（純）÷（可処分所得（純）＋年金受給権の変動調整（受取））`
  - `暦年（４）b` r15: `5.3 　調整可処分所得（純）(3.1)`; r16: `　　（再掲）調整可処分所得（総）`
  - Identical rows exist in the `年度（*）` and `四半期（*）` sheets.
- Other useful verbatim rows in `暦年（２）`: r8 `2.1 　所得・富等に課される経常税（支払）`; r11 `2.2 　純社会負担（支払）`; r17 `2.3 　その他の経常移転（支払）`; r28 `2.5 　第１次所得バランス（純）(1.2)`; r31 `2.6 　現物社会移転以外の社会給付（受取）`; r36 `2.7 　その他の経常移転（受取）`.

---

## 3. PDF inventory (pdfplumber)

### 3.1 `esri-hitoriatarigdp_20251223.pdf` — 1人当たり名目GDP等 (reference)

- **1 page.** Page-1 first lines (verbatim excerpt):
  ```
  ５．一人当たり名目ＧＤＰ、名目ＧＮＩ、国民所得、実質ＧＤＰ
  令和６年度は、一人当たりの名目ＧＤＰが519.0万円となり、前年度より20.9万円増加（４年連続の増加）、一人当たりの名目Ｇ
  ＮＩが551.1万円となり、前年度より23.7万円増加（４年連続の増加）、一人当たりの国民所得（要素費用表示）が365.2万円とな
  り、前年度より10.2万円増加（４年連続の増加）、一人当たりの実質ＧＤＰが474.1万円となり、前年度より4.4万円増加（４年連
  続の増加）となった。
  （参考）
  一人当たり名目ＧＤＰ 一人当たり名目ＧＮＩ 一人当たり国民所得 一人当たり実質ＧＤＰ 総人口
  年 度
  実額 前年度比 実額 前年度比 実額 前年度比 実額 前年度比 実数 前年度比
  （千円） （％） （千円） （％） （千円） （％） （千円） （％） （千人） （％）
  平成 17 (2005) 4,218 0.8 4,319 1.2 3,002 -0.5 4,172 2.3 127,761 0.0
  ```
- Table structure: rows = **年度 (fiscal years) 平成17 (2005) … 令和6 (2024)**; columns = 一人当たり名目ＧＤＰ / 一人当たり名目ＧＮＩ / 一人当たり国民所得 / 一人当たり実質ＧＤＰ (each 実額 千円 + 前年度比 ％) + 総人口 (実数 千人 + 前年度比 ％). Last data row: `６ (2024) 5,190 4.2 5,511 4.5 3,652 2.9 4,741 0.9 123,776 -0.5`.
- Source/notes (verbatim): `（出所）総人口：総務省「人口推計月報」月初人口の単純平均。`; `（注）…年度値を各月初人口の年度平均で割ったもの。実質ＧＤＰは、2020暦年連鎖価格。`
- **No numbered 図/表 captions**; one unnumbered table under `（参考）`.

### 3.2 `esri-kokusaihikaku_20251223.pdf` — 国際比較 (reference)

- **2 pages.** Page-1 first lines (verbatim excerpt):
  ```
  ６．ＧＤＰの国際比較
  （１）主要国の名目ＧＤＰ
  我が国の名目ＧＤＰは、令和６（2024）暦年には４兆1,869億ドルとなり、世界のＧＤＰに占める比率は3.8％となった。
  平成 平成 … 令和 令和 令和 令和 令和
  17暦年 18暦年 … ５暦年 [６暦年]
  (2005) (2006) …
  アメリカ (10億ドル) 13,039.2 …
  (世界に占める比率、％) 27.2 …
  中 国 (10億ドル) … ド イ ツ … 日 本 … イ ン ド …
  ```
- p1 table: `（１）主要国の名目ＧＤＰ` — columns = 暦年 **2005–2024**; rows per country (アメリカ/中国/ドイツ/日本/インド/…): GDP (10億ドル) + 世界に占める比率 (％).
- Page 2: `（２）主要国の一人当たり名目ＧＤＰ` — USD per capita + `(OECD加盟国中の順位)` rows, same 2005–2024 calendar-year columns.
- Source notes p2 (verbatim): `中国 ： 中国統計年鑑2025（為替レートはIMF“International Financial Statistics”）`; `ロシア、ブラジル、インド ： 世界銀行“World Development Indicators Database”`; `（注）中国は香港及びマカオを含まない。インドは会計年度。`; FX references: `2023（令和５）暦年における、円の対米ドルレートは 140.5（円／ドル）…` / `2024（令和６）暦年における、円の対米ドルレートは 151.5（円／ドル）…`.
- **No numbered 図/表 captions**; two unnumbered tables (`（１）`, `（２）`).

### 3.3 `esri-point_flow20251223.pdf` — ポイント（フロー編）release highlights

- **18 pages.** Cover page-1 lines (verbatim):
  ```
  公表前情報
  (12/23（火）15:00公表予定)
  厳重取扱注意
  2024年度（令和６年度）国民経済計算年次推計
  （2020年（令和２年）基準改定値）
  （フロー編）
  ポ イ ン ト
  １ ． 支 出 ・・・・・・ P 1
  ２ ． 所 得 ・・・・・・ P 3
  ３ ． 生 産 ・・・・・・ P 9
  ４ ． 純貸出(+)／純借入(-) ・・・・・・ P 11
  ５ ． 一人当たり名目ＧＤＰ、名目ＧＮＩ、国民所得、実質ＧＤＰ ・・・・・・ P 15
  ６ ． ＧＤＰの国際比較 ・・・・・・ P 16
  令和７年12月23日
  内閣府経済社会総合研究所
  ```
- ⚠ The file is the **embargoed pre-release copy** (`公表前情報`, `厳重取扱注意`) distributed ahead of the 12/23 15:00 embargo; it is the standard ESRI publication-date evidence (令和7年12月23日 = 2025-12-23).
- 図 captions spotted (first line per page): p3 `図１－１ ＧＤＰ成長率（名目・実質）`; p5 `図２－１ GNI、GDI、GDP成長率（実質） 図２－２ 実質GNI成長率の要因別寄与度`; p7 `図２－３ 国民所得伸び率に対する各要素所得の寄与度 図２－５ 労働分配率`; p9 `図２－８ 家計貯蓄率前年度差に対する…`; p11 `図３ 経済活動別ＧＤＰ構成比（名目）`; p13 `図４－１ 制度部門別の純貸出(＋)／純借入(－)（対名目ＧＤＰ比）`; p15 `図４－２ 一般政府のプライマリーバランス（対名目ＧＤＰ比）`. Sections: p2 `１．支出`; p4 `２．所得`; p6 `（２）国民所得`; p8 `（３）家計貯蓄`; p10 `３．生産`; p12 `４．純貸出(＋)／純借入(－)`; p14 `（２）一般政府のプライマリーバランス`; p16 `５．一人当たり名目ＧＤＰ…`; p17 `６．ＧＤＰの国際比較`; p18 `（２）主要国の一人当たり名目ＧＤＰ`.
- p16–p18 content corresponds exactly to the two standalone reference PDFs (§3.1, §3.2).

---

## 4. Listing-page HTML findings

- `esri-2024_kaku_top.html`: `<title>2024年度国民経済計算（2020年基準・2008SNA） : 経済社会総合研究所 - 内閣府</title>`. Headings: フロー編 `Ⅰ. 統合勘定` / `Ⅱ. 制度部門別所得支出勘定` / `Ⅲ. 制度部門別資本勘定・金融勘定` / `Ⅳ. 主要系列表` / `Ⅴ. 付表`; ストック編 `Ⅰ. 統合勘定` / `Ⅱ. 制度部門別勘定` / `Ⅲ. 付表` / `Ⅳ. 参考表`. 126 hrefs total.
- **Provenance confirmed:** all 6 xlsx files are hyperlinked from this page (relative `tables/2024fcm1n_jp.xlsx` etc.).
- **No publication-date text** (`令和7年12月23日` / `2025年12月23日` / `更新日`) anywhere in the HTML. Date evidence therefore rests on the point_flow PDF cover (`令和７年12月23日`, `(12/23（火）15:00公表予定)`) and `_20251223` filename suffixes.
- The three `sankou/pdf/*` PDFs are **not** hyperlinked from this page. `point_flow20251223.pdf` is linked from the sibling materials page `materials_j.html` (`参考資料（ポイント、利用上の注意、政府諸機関の分類等）`, saved as supplementary file #11, which also links `point_stock20260120.pdf` and classification PDFs incl. `katudo_bunrui.pdf` 経済活動別分類). `hitoriatarigdp_20251223.pdf` and `kokusaihikaku_20251223.pdf` are served live at the given URLs (HTTP 200, valid PDFs whose section numbers 5/6 match the point_flow TOC) but **no linking HTML page was identified** among the 4 pages checked live (2024_kaku_top.html, materials_j.html, kakuhou_top.html, files_kakuhou.html — the latter two fetched to /tmp for checking only, not saved).

---

## 5. Extraction-agent handoff notes (structure only)

1. **Year axis = row 7** (AD years) in all fcm1*/s3/i5 time-series sheets; era labels row 5 are display-only. Data columns B..AF = 1994..2024 (31 cols) for 実数-type sheets; rate sheets start 1995.
2. **GDP (expenditure) verbatim rows:** fcm1n `実数` r48 `５．　国内総生産（支出側）(1+2+3+4)`; fcm1rn `実数` r48 `５．　国内総生産（支出側）`; fcm1dn `実数` r44 `５．　国内総生産（支出側）`.
3. **s2n is one-sheet-per-year (1994–2024)** with 16-activity rows and columns 産出額/中間投入/国内総生産/固定資本減耗/国内純生産/税/要素所得/雇用者報酬/営業余剰; totals at r39 `経済活動　計`, r44 `合計`. **No 第一次/第二次/第三次産業 rows — must be derived** (see ESRI 経済活動別分類 PDF for the official mapping).
4. **s3 employment/hours:** 6 sheets (年度/暦年 × 就業者/雇用者/労働時間数); totals r39 `合　計`; 16 activities r8–r37; same derived-aggregate caveat.
5. **i5 household disposable income:** canonical row `暦年（２）` r22 `2.4 　可処分所得（純）`; gross variant r23; 調整可処分所得 rows in sheets （３）/（４）b; quarterly variants available.
6. **Units:** fcm1n/fcm1rn/s2n/i5 = 10億円 (billion yen); fcm1dn = index 2020暦年=100; s3 就業者/雇用者 = 万人 (10k persons), 労働時間数 = 時間 (hours, employees); hitoriatarigdp = 千円 per capita / 千人 population (fiscal-year basis, FY2005–FY2024); kokusaihikaku = 10億ドル & USD (calendar years 2005–2024).
7. Per project licensing model (DATA-LICENSES.md): these are government files — **raw files stay uncommitted** under research/raw/; only extracted facts + short quotes in notes.

---
*Inventory generated by Task 2-a acquisition agent. Structure recon only — no statistics extracted, no values interpreted.*
