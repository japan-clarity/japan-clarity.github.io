# Chapter 03 (Housing & Cost of Living) — Statistics Bureau 住宅・土地統計調査 Research Summary

- Agent: 4-a (general-purpose, Statistics Bureau Housing and Land Survey)
- Access date for ALL entries below: **2026-10-26**
- Completion pass: headline values (空き家率 2013/2018/2023, 総住宅数/空き家数 2023, 持ち家率 rows, 付表 prefecture rows, 時系列表 1-1/4/9-1/13/14-1 spot rows), MANIFEST hashes and all claimed HTTP status codes were re-verified against the raw files / live URLs on 2026-10-26 before the worklog entry was written; the 3001/5001 English-outline 404 bodies were additionally archived as `jyutaku_en_3001_404.html` / `jyutaku_en_5001_404.html`.
- All quotes below appear verbatim in the raw files listed with each entry (raw dir: `research/chapter03/raw/statb-housing/`; byte sizes and sha256 in `raw/statb-housing/MANIFEST.tsv`).
- Convention: figures in this file are copies of the exact text in raw files; Japanese quotes are given as-is (Shift_JIS HTML decoded to UTF-8 in the `.utf8.html` files; PDFs decoded with `pdftotext -layout` into `.txt` files; e-Stat tables are `.xlsx` quoted by sheet name and row number, rows counted 1-based from the top of the sheet as printed by openpyxl).
- No stat.go.jp CSV was needed: the long-run time series are published as e-Stat EXCEL files (`.xlsx`) and the headline figures as PDF, so the Shift_JIS-CSV → `.utf8.csv` rule did not apply. Shift_JIS HTML pages were decoded to `.utf8.html` alongside the originals; the 公表予定 XML is UTF-16LE and was decoded to `.utf8.xml`.

## 0. Key structural findings (what is ACTUALLY published online as of 2026-10-26)

1. **The current survey round is 令和5年（2023）住宅・土地統計調査** (survey date 2023-10-01). Its results page is `https://www.stat.go.jp/data/jyutaku/2023/tyousake.html` (HTTP 200). The URL pattern `https://www.stat.go.jp/data/jyutaku/2023/nn/index.htm` (and the 2018/2013 equivalents) returns **HTTP 404** — the round pages are `tyousake.html`, not `nn/index.htm` (404 error pages archived as `jyutaku2023_nn_index.html` etc.).
2. **2023-round releases and dates** (from the Statistics Bureau 公表予定 XML `kouhyou_jyutaku2023.utf8.xml`, os_code id="00200522" name="令和５年住宅・土地統計調査"):
   - 住宅数概数集計（速報値）: **2024-04-30 14:00** (全国・都道府県)
   - 住宅及び世帯に関する基本集計（確定値）: **2024-09-25 14:00**
   - 住宅の構造等に関する集計: **2025-01-29 14:00**
   - 土地集計: **2025-03-26 14:00**
   (The 2023 結果の概要 PDF itself states: "令和６年４月30日に公表した「住宅数概数集計（速報集計）」… 今回、令和６年９月25日に公表した「住宅及び世帯に関する基本集計（確報集計）」" — `jyutaku2023_kihon_gaiyou.txt` lines 1470-1475.)
3. **Each survey round publishes its statistical tables on e-Stat**, not as stat.go.jp CSVs. The e-Stat file listings are JavaScript-driven, but the server-rendered category expansion works at `/stat-search/files?tstat=<ID>&toukei=00200522&cycle=0&tclass1=<catID>&layout=datalist&page=1&tclass2val=0`. Round IDs verified live: **2018 round tstat=000001127155**, **2023 round tstat=000001207800**; 時系列統計表 category tclass1=000001140366 (2018) / 000001207807 (2023); 主要統計表 category (2023) tclass1=000001207804. File downloads use `/stat-search/file-download?statInfId=<ID>&fileKind=N` with **fileKind=0 for 2018-round files and fileKind=4 for 2023-round files** (fileKind=1/2/3 tested → HTTP 404). The 2023-round 時系列統計表 show 公開（更新）日 **2025-09-30**; the 2018-round 時系列統計表 2020-06-30.
4. **The long-run series are the e-Stat 時系列統計表 published within each round** (55 tables per round). The 2023-round versions run through 令和5年 (2023): 第1-1表 (居住世帯の有無別住宅数, 1948–2023), 第4表 (空き家の種類・建て方別空き家数, 1958–2023), 第9-1表 (住宅の所有の関係(5区分)別住宅数, 1963–2023), 第13表/第14-1表 (住宅の規模, 1993–2023 / 1968–2023), 第2-1表 (世帯の種類別世帯数, 1948–2023). The 2023 結果の概要 explicitly points pre-1978 users there: "1973年以前の結果は、「政府統計の総合窓口（e-Stat）」…の「平成30年住宅・土地統計調査」から時系列統計表（第１－１表）を参照" (`jyutaku2023_kihon_gaiyou.txt` lines 335-337).
5. **English versions**: English outline pages exist for the 1998 (`1520100.html`), 2003 (`1501.html`), 2008 (`2001.html`) and 2013 (`2501.html`, `2502.html` = terms) rounds — titles verified: "Outline of the 2013 Housing and Land Survey" etc. **No English outline/summary exists for the 2018 or 2023 rounds**: `/english/data/jyutaku/3001.html` and `/5001.html` probed → **HTTP 404** (bodies archived as `jyutaku_en_3001_404.html` / `jyutaku_en_5001_404.html`; stat.go.jp serves the same generic 4,691-byte error page for every 404). The English results page `jyutaku_en_results.html` links only to the e-Stat statistical-table listings ("2023 Housing and Land Survey Statistical Tables / 2018 … / 2013 …"). So the newest round with an official English narrative description is the **2013** survey.
6. **Round naming on e-Stat**: 2013 and earlier rounds are listed on stat.go.jp's round index `https://www.stat.go.jp/data/jyutaku/kekka.html` with legacy e-Stat IDs (平成25年 tid=000001063455, 平成20年 tid=000001028768, 平成15年 tid=000000050002, 平成10年 tid=000000050001) — not fetched this session; the long-run 1963–2013 values were instead taken from the 2023-round 時系列統計表 and cross-verified against the 2013-round 結果の概要 PDF.
7. **Survey identifier correction**: the government statistics code shown in the live e-Stat URLs and the 公表予定 XML is **00200522** (住宅・土地統計調査), not 00200541 as given in the task brief. Each round also carries its own 調査コード in the XML (`os_code id="00200522" name="令和５年住宅・土地統計調査"`).

---

## A. 2023 住宅及び世帯に関する基本集計（確報集計）結果の概要 (headline figures)

Raw: `raw/statb-housing/jyutaku2023_kihon_gaiyou.pdf` (747,841 B, sha256 4ffbfaf1…ed8f2, HTTP 200) + text extraction `jyutaku2023_kihon_gaiyou.txt`. Source URL: https://www.stat.go.jp/data/jyutaku/2023/pdf/kihon_gaiyou.pdf (linked from https://www.stat.go.jp/data/jyutaku/2023/tyousake.html as 「結果の概要（PDF：730KB）」). Publisher: 総務省統計局 (Statistics Bureau, MIC).

### A-1. 総住宅数 / 総世帯数 (2023)
- Value: 総住宅数 **65,047千戸 (6504万7千戸)**; 総世帯数 **56,215千世帯**; １世帯当たり住宅数 **1.16戸**; +4.2% vs 2018.
- Verbatim (txt lines 72-77): "○総住宅数は6504万７千戸、2018年から4.2％の増加となり、過去最多" / "2023年10月１日現在における我が国の総住宅数は6504万７千戸で、2018年と比べ、4.2％（263万９千戸）の増加、総世帯数は5621万５千世帯で、2018年と比べ、4.1％（221万４千世帯）の増加となっている。"
- 表１（総住宅数、総世帯数及び１世帯当たり住宅数の推移－全国（1958年～2023年）, txt line 132）実数 rows (千戸/千世帯): 1958* 17,934 / 18,647; 1963* 21,090 / 21,821; 1968* 25,591 / 25,320; 1973 31,059 / 29,651; 1978 35,451 / 32,835; 1983 38,607 / 35,197; (1988/1993/1998/2003/2008/2013/2018 rows continue; 2018: 62,407 / 54,001; 2023: 65,047 / 56,215). "（*印の数値は、沖縄県を含まない。）" (line 130).

### A-2. 空き家数 / 空き家率 (2023)
- Value: 空き家 **9,002千戸 (900万2千戸)**, 空き家率 **13.8%** (総住宅数に占める空き家の割合); 賃貸・売却用及び二次的住宅を除く空き家 3,856千戸 (5.9%).
- Verbatim (txt lines 162-171): "○空き家数は900万２千戸と過去最多、空き家率も13.8％と過去最高" / "総住宅数のうち、空き家は900万２千戸と、2018年（848万９千戸）と比べ、51万３千戸の増加で過去最多となっており、総住宅数に占める空き家の割合（空き家率）は13.8％と、2018年（13.6％）から0.2ポイント上昇し、過去最高となっている。" / "「賃貸・売却用及び二次的住宅を除く空き家」は385万６千戸と、2018年と比べ、36万９千戸の増加となっており、総住宅数に占める割合は5.9％となっている。"

### A-3. 持ち家住宅率 (2023)
- Value: 持ち家 33,876千戸, 持ち家住宅率 **60.9%** (住宅全体 = 居住世帯のある住宅 55,665千戸に対する割合; 借家 19,462千戸 = 35.0%).
- Verbatim (txt lines 787-798): "○持ち家は3387万６千戸、持ち家住宅率は60.9％" / "住宅を所有の関係別にみると、持ち家が3387万６千戸で、住宅全体に占める持ち家住宅の割合（以下「持ち家住宅率」という。）は60.9％となっており、2018年と比べ、0.3ポイントの低下となっている。" / "借家は1946万２千戸で、住宅全体に占める割合は35.0％となっており、…「民営借家」が1568万４千戸（住宅全体に占める割合28.2％）と最も多く、次いで「公営の借家」が176万戸（同3.2％）、「給与住宅」が130万２千戸（同2.3％）、「都市再生機構(UR)・公社の借家」が71万６千戸（同1.3％）となっている。"
- 表５ 住宅の所有の関係別住宅数の推移－全国（1993年～2023年）(txt line 838): 実数（1000戸）rows 846-852 and 割合（％）rows 854-860, quoted in full in Series 1 below.

### A-4. 住宅の規模 (2023, 専用住宅)
- Value: １住宅当たり延べ面積 90.86㎡ (居住室数 4.26室, 畳数 32.49畳).
- Verbatim (txt lines 872-874): "住宅のうち居住専用に建築された住宅（以下「専用住宅」という。）について、１住宅当たりの住宅の規模をみると、居住室数は4.26室、居住室の畳数は32.49畳、延べ面積（居住室のほか玄関、トイレ、台所などを含めた住宅の床面積の合計）は90.86㎡で、１人当たり居住室の畳数は14.65畳、１室当たり人員は0.52人となっている。"
- 表６ 専用住宅の建て方別住宅の規模の推移－全国（1993年～2023年）(txt line 882), 延べ面積（㎡）rows: 総数 88.38 / 89.59 / 92.49 / 92.41 / 92.97 / 92.06 / 90.86 (1993→2023); 一戸建 118.74 / 122.20 / 126.37 / 127.21 / 128.63 / 126.63 / 126.32; 共同住宅 44.17 / 44.96 / 47.59 / 47.88 / 48.91 / 51.14 / 50.31.

### A-5. 居住世帯の有無別住宅数 (Series 2/3/4 core table, 1978–2023)
表２－１ 居住世帯の有無別住宅数の推移－全国（1978年～2023年）(txt line 263). Column heads (lines 265-274): 総数 / 居住世帯あり（総数・同居世帯あり） / 居住世帯なし（総数・一時現在者のみ） / 空き家（総数・賃貸・売却用及び二次的住宅を除く空き家・賃貸用の空き家・売却用の空き家・二次的住宅・建築中）.
実数（1000戸）rows (lines 277-286, verbatim):
```
 1978 年（ 昭和 53年 ）    35,451       32,189       307    3,262          318     2,679      977    1,565 ※      -       137      264
 1983 年（    58年 ）    38,607       34,705       196    3,902          447     3,302    1,252    1,834 ※      -       216      154
 1988 年（    63年 ）    42,007       37,413       180    4,594          435     3,940    1,310    2,336 ※      -       295      218
 1993 年（ 平成 ５年 ）     45,879       40,773       196    5,106          429     4,476    1,488    2,619 ※      -       369      201
 1998 年（    10年 ）    50,246       43,922       260    6,324          394     5,764    1,825    3,520 ※      -       419      166
 2003 年（    15年 ）    53,891       46,863       280    7,028          326     6,593    2,118    3,675       303      498      109
 2008 年（    20年 ）    57,586       49,598       276    7,988          326     7,568    2,681    4,127       349      411       93
 2013 年（    25年 ）    60,629       52,102       259    8,526          243     8,196    3,184    4,292       308      412       88
 2018 年（    30年 ）    62,407       53,616       286    8,791          217     8,489    3,487    4,327       293      381       86
 2023 年（ 令和 ５年 ）     65,047       55,665       337    9,382          286     9,002    3,856    4,436       326      384       95
```
割合－１（％）rows (lines 289-298) give the 空き家率 series 1978–2023: 7.6 / 8.6 / 9.4 / 9.8 / 11.5 / 12.2 / 13.1 / 13.5 / 13.6 / 13.8 (the 空き家総数 column). Footnote (line 334): "※は、「賃貸用の空き家」に「売却用の空き家」を含む。"; 注１ (lines 335-341): "本表は、空き家の種類別に住宅数の比較が可能な1978年以降の結果を掲載 … ・1948年の結果は、住宅数に「建築中の住宅」を含まない。・1953年の結果は、市部のみの結果である。・1968年以前の結果は、沖縄県を含まない。"

### A-6. 空き家の種類 naming change (2023 vs 2018) — important for Series 4 comparability
Verbatim (txt lines 250-259, box 「今回の調査結果では、空き家の種類について以下のとおり名称及び表記順の整理を行った。」):
```
                                     平成30年調査                                                                                   令和５年調査
                       空き家                                                                                      空き家
                                 二次的住宅                 別荘                                                                賃貸・売却用及び二次的住宅を
                                                       その他                                                               除く空き家
                                 賃貸用の住宅                                                                                  賃貸用の空き家
                                 売却用の住宅                                                                                  売却用の空き家
                                 その他の住宅                                                                                  二次的住宅               別荘
                                                                                                                                             その他
```
i.e. 2013/2018 category 「その他の住宅」 = 2023 「賃貸・売却用及び二次的住宅を除く空き家」; 2013/2018 「二次的住宅（別荘・その他）」 = 2023 「二次的住宅」.

---

## B. Series 1 — 持ち家率 long series (e-Stat 時系列統計表 第9-1表, 2023 round)

Raw: `raw/statb-housing/estat_2023_timeseries_table9-1.xlsx` (28,914 B, sha256 e4074a51…3d376, HTTP 200). Source URL: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354038&fileKind=4 (listed on `estat_2023_timeseries_page.html` as 「9-1 住宅の所有の関係(5区分)別住宅数―全国(昭和38年～令和５年)」, 公開（更新）日 2025-09-30). Sheet `009_1`.

Table title (sheet row 2): "第９－１表 住宅の所有の関係(5区分)別住宅数―全国(昭和38年～令和５年)"; headers (rows 6-14): 調査年 / 総数 Total1) / 持ち家 Owned houses / 借家 Rented houses（総数 / 公営の借家 Rented houses owned by local government / 都市再生機構(UR)・公社の借家 by urban renaissance agency or public corporation 2) / 民営借家 Rented houses owned privately / 給与住宅 Issued houses）.

実数 Number（戸）rows (sheet rows 18-31, verbatim cell values):
```
昭和38年 1963 3)  20372000  13093000  7279000  944000  *  4904000  1433000
昭和43年 1968 3)  24197900  14594200  9603600  1402800  *  6526600  1674200
昭和48年 1973 3)  28501200  16850500  11650700  1400200  589300  7824200  1836900
昭和48年 1973      28730500  17006800  11723700  1405200  590000  7889300  1839200
   53年 1978       32188700  19428400  12689200  1719000  723000  8408300  1838800
   58年 1983       34704500  21649600  12951000  1868300  776600  8487300  1818800
   63年 1988       37413400  22948200  14014600  1989500  809300  9666300  1549500
平成５年 1993      40773300  24376200  15691000  2033000  845000  10762400  2050500
   10年 1998       43922100  26467800  16730000  2086700  864300  12049800  1729200
   15年 2003       46862900  28665900  17166000  2182600  936000  12561300  1486100
   20年 2008       49598300  30316100  17770000  2088900  918000  13365500  1397600
   25年 2013       52102200  32165800  18518900  1958600  855500  14582500  1122300
   30年 2018       53616300  32801500  19064700  1922300  747200  15295300  1099900
令和５年 2023      55665000  33875500  19461700  1760200  716000  15683500  1302100
```
割合（%）rows (sheet rows 33-46, 持ち家 column = 持ち家率):
```
1963 3) 100  64.3  35.7  4.6  *  24.1  7
1968 3) 100  60.3  39.7  5.8  *  27    6.9
1973 3) 100  59.1  40.9  4.9  2.1  27.5  6.4
1973    100  59.2  40.8  4.9  2.1  27.5  6.4
1978    100  60.4  39.4  5.3  2.2  26.1  5.7
1983    100  62.4  37.3  5.4  2.2  24.5  5.2
1988    100  61.3  37.5  5.3  2.2  25.8  4.1
1993    100  59.8  38.5  5    2.1  26.4  5
1998    100  60.3  38.1  4.8  2    27.4  3.9
2003    100  61.2  36.6  4.7  2    26.8  3.2
2008    100  61.1  35.8  4.2  1.9  26.9  2.8
2013    100  61.7  35.5  3.8  1.6  28    2.2
2018    100  61.2  35.6  3.6  1.4  28.5  2.1
2023    100  60.9  35    3.2  1.3  28.2  2.3
```
Footnotes (sheet rows 75-77): "1) 昭和53年以降は住宅の所有の関係「不詳」を含む。" / "2) 平成15年までは「公団・公社の借家」として表章" / "3) 沖縄県を含まない。"

**Denominator note**: 総数 here = 居住世帯のある住宅数 (occupied dwellings, incl. 所有の関係「不詳」 since 1978). The 持ち家 rate definition used by the Statistics Bureau in this table is 持ち家数 ÷ 総数（居住世帯のある住宅）. The 都市再生機構(UR)・公社の借家 cells for 1963 and 1968 are printed as "*" (as in the raw file; no footnote explains the asterisk — recorded as printed).

**UNAVAILABLE**: 持ち家率 for 1948, 1953 and 1958 — the online 時系列統計表 (both 2018 and 2023 rounds) starts at 昭和38年 (1963) for 住宅の所有の関係. No official online file among those fetched publishes a 1948/1953/1958 homeownership rate. (The 2023 概要 表５ likewise starts 1993.)

Cross-checks (round's own files):
- 2023 概要 表５ (txt lines 838-860): 1993-2023 持ち家率 59.8 / 60.3 / 61.2 / 61.1 / 61.7 / 61.2 / 60.9 — identical to 時系列表 9-1; 実数 2023 row: "2023 年 55,665 33,876 19,462 1,760 716 15,684 1,302" (1000戸), with note "1）住宅の所有の関係｢不詳｣を含む。 2）2003年までは「公団・公社の借家」として表章".
- 2018 概要 表３ (jyutaku2018_kihon_gaiyou.txt lines 341-372): 1973-2018 持ち家率 59.2 / 60.4 / 62.4 / 61.3 / 59.8 / 60.3 / 61.2 / 61.1 / 61.7 / 61.2 — identical.
- 2013 概要 (jyutaku2013_gaiyou_all.txt line 436): "持ち家住宅率は61.7％" and lines 437-443: "住宅を所有の関係別にみると，持ち家が3217万戸で，住宅全体に占める割合（持ち家住宅率）は61.7％となっており，平成20年と比べると，185万戸（6.1％）増加している。また，借家は1852万戸で，住宅全体の35.5％となっている。"

---

## C. Series 2 & 3 — housing stock, households and vacancy rate long series (e-Stat 時系列統計表 第1-1表 / 第2-1表, 2023 round)

### C-1. 第1-1表 居住世帯の有無別住宅数 (1948–2023)
Raw: `raw/statb-housing/estat_2023_timeseries_table1-1.xlsx` (35,250 B, sha256 bd381410…e8f4e, HTTP 200). URL: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354027&fileKind=4. Sheet `001_1`. Title (row 2): "第１－１表 居住世帯の有無(9区分)別住宅数及び建物の種類(6区分)別住宅以外で人が居住する建物数―全国(昭和23年～令和５年)". Headers (rows 6-14): 調査期日 / 住宅数（総数 Total / 居住世帯あり Occupied（総数 / 同居世帯なし Without shared households / 同居世帯あり With shared households）/ 居住世帯なし Unoccupied（総数 / 一時現在者のみ Temporary occupants only / 空き家 Vacant（総数 / 賃貸・売却用及び二次的住宅を除く空き家 Vacant, excluding for rent, for sale and as second dwellings / 賃貸用の空き家 For rent / 売却用の空き家 For sale / 二次的住宅 …）））.

実数 Number（戸）rows (sheet rows 18-34, columns 総数 / 居住世帯あり総数 / … / 居住世帯なし総数 / 一時現在者のみ / 空き家総数 / 除く空き家 / 賃貸用 / 売却用 / 二次的住宅):
```
昭和23年 ８月 １日 Aug.1,1948 3)4)  13907024  13847769  -  -  59255  59255  *  -  -  -  -
昭和28年 ９月 １日 Sep.1,1953 3)5)   7127000   6964000  6276000  688000  162000  40000  94000  -  -  -  -
昭和33年10月 １日 Oct.1,1958 3)     17934000  17432000  16584000  848000  503000  68000  360000  -  -  -  -
昭和38年10月 １日 Oct.1,1963 3)     21090000  20372000  19402000  970000  718000  74700  522000  -  -  -  -
昭和43年10月 １日 Oct.1,1968 3)     25591200  24197900  23556400  641400  1393300  186200  1034200  -  -  -  -
昭和48年10月 １日 Oct.1,1973 3)     30810100  28501200  28027900  473300  2308900  340900  1707500  -  -  -  -
昭和48年10月 １日 Oct.1,1973         31058900  28730500  28253700  476800  2328400  343800  1720300  -  -  -  -
昭和53年10月 １日 Oct.1,1978         35450500  32188700  31881500  307300  3261700  318400  2679200  976600  1565400  *  137200
昭和58年10月 １日 Oct.1,1983         38606800  34704500  34508500  196000  3902400  446900  3301800  1251500  1834000  *  216200
昭和63年10月 １日 Oct.1,1988         42007300  37413400  37233100  180300  4593900  435300  3940400  1309500  2335800  *  295000
平成５年10月 １日 Oct.1,1993          45878800  40773300  40577500  195800  5105500  428600  4475800  1487800  2618900  *  369100
平成10年10月 １日 Oct.1,1998          50246000  43922100  43661800  260400  6323900  393600  5764100  1824900  3520000  *  419300
平成15年10月 １日 Oct.1,2003          53890900  46862900  46583000  279900  7027900  325900  6593300  2117600  3674900  302600  498200
平成20年10月 １日 Oct.1,2008          57586000  49598300  49322500  275800  7987600  326400  7567900  2681100  4126800  348800  411200
平成25年10月 １日 Oct.1,2013          60628600  52102200  51842900  259300  8526400  242800  8195600  3183600  4291800  308200  412000
平成30年10月 １日 Oct.1,2018          62407400  53616300  53330100  286200  8791100  216700  8488600  3487200  4327200  293200  381000
令和５年10月 １日 Oct.1,2023          65046700  55665000  55327600  337400  9381700  285500  9001600  3856000  4435800  326200  383500
```
割合（%）rows (sheet rows 36-52; 空き家率 = 空き家総数 column): 1948: 0.4; 1953: 1.3; 1958: 2.0; 1963: 2.5; 1968: 4.0; 1973: 5.5 (both rows); 1978: 7.6; 1983: 8.6; 1988: 9.4; 1993: 9.8; 1998: 11.5; 2003: 12.2; 2008: 13.1; 2013: 13.5; 2018: 13.6; 2023: 13.8.
Footnotes (sheet rows 83-87): "1) 平成20年以降は「下宿屋」を含む。" / "2) 平成30年までは「高齢者居住施設」を含む。" / "3) 沖縄県を含まない。" / "4) 「建築中の住宅」を含まない。" / "5) 市部のみ。" (notes 3)-5) attach to the 1948/1953/1958/pre-reversion years; the double 1973 rows are 沖縄を含まない / 沖縄を含む, in that order per note 3)).

**So: 空き家率 series (Series 3) 1963–2023 = 2.5, 4.0, 5.5, 7.6, 8.6, 9.4, 9.8, 11.5, 12.2, 13.1, 13.5, 13.6, 13.8 (%). Earlier: 1948 0.4% (建築中を含まず), 1953 1.3% (市部のみ), 1958 2.0% (沖縄を含まず). 1978–1998 「賃貸用」 includes 売却用 (※).**

### C-2. 第2-1表 世帯の種類別世帯数 (1948–2023)
Raw: `raw/statb-housing/estat_2023_timeseries_table2-1.xlsx` (31,526 B, sha256 ba46d976…3804, HTTP 200). URL: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354029&fileKind=4. Sheet `002_1`. Title (row 2): "第２－１表 世帯の種類(3区分)別世帯数及び世帯人員―全国(昭和23年～令和５年)". 実数 rows 16-32 (総数 / 住宅に居住 総数 / 主世帯 / 同居世帯 / 住宅以外の建物に居住): 2023 row (row 32): "56215300  56071400  55665000  406400  143900"; 2018 (row 31): "54001400  53925000  53616300  308700  76400"; 2013 (row 30): "52452900  52378600  52102200  276400  74400"; … 1948 (row 16): "-  15466983  -  -  -".
**UNAVAILABLE**: 普通世帯数 as a named concept is NOT tabulated in the Housing and Land Survey files fetched — the survey's household classification is 世帯の種類（主世帯 / 同居世帯 / 住宅以外の建物に居住する世帯）. The census-style 普通世帯 series must come from the Population Census (Chapter 01 sources), not from this survey. Recorded explicitly per anti-fabrication rule 4.

---

## D. Series 4 — 空き家の類型 (e-Stat 時系列統計表 第4表, 2023 round)

Raw: `raw/statb-housing/estat_2023_timeseries_table4.xlsx` (133,369 B, sha256 23aa2420…42c37, HTTP 200). URL: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354032&fileKind=4. Sheets: `総数`, `一戸建`, `長屋建`, `共同住宅`, `その他`. Title (sheet 総数, rows 2/6): "第４表 空き家の種類(4区分)、建て方(4区分)別空き家数―全国、３大都市圏、都道府県、大都市(昭和33年～令和５年) その１．総数 Part 1. Total".

Column blocks (header rows 9-13): 総数 Total (1958–2023, 13 columns) / 賃貸・売却用及び二次的住宅を除く空き家 Vacant, excluding for rent, for sale and as second dwellings (1983–2023) / 賃貸用の空き家 For rent 1) (1983–2023) / 売却用の空き家 For sale (2003–2023) / 二次的住宅 As second dwellings (1978–2023).

全国 row (sheet row 16, all columns, 戸):
```
総数:        -  -  -  1720300  2679200  3301800  3940400  4475800  5764100  6593300  7567900  8195600  8488600  9001600
除く空き家:  (1983) 1251500  (1988) 1309500  (1993) 1487800  (1998) 1824900  (2003) 2117600  (2008) 2681100  (2013) 3183600  (2018) 3487200  (2023) 3856000
賃貸用1):    (1983) 1834000  (1988) 2335800  (1993) 2618900  (1998) 3520000  (2003) 3674900  (2008) 4126800  (2013) 4291800  (2018) 4327200  (2023) 4435800
売却用:      (2003) 302600  (2008) 348800  (2013) 308200  (2018) 293200  (2023) 326200
二次的住宅:  (1978) 137200  (1983) 216200  (1988) 295000  (1993) 369100  (1998) 419300  (2003) 498200  (2008) 411200  (2013) 412000  (2018) 381000  (2023) 383500
```
Second 全国 row (sheet row 17, marked 2)) supplies the pre-reversion 総数: 1958: 360000; 1963: 522000; 1968: 1034200; 1973: 1707500.
Footnotes (sheet rows 94-95): "1) 空き家の種類「売却用の空き家」を含む。" / "2) 沖縄県を含まない。"
(1) attaches to 賃貸用の空き家 columns 1983–1998: for those years 賃貸用 includes 売却用, which is why 売却用 columns only start in 2003.)

**2023 類型別 values (Series 4 headline): 賃貸用の空き家 4,435,800戸 / 売却用の空き家 326,200戸 / 二次的住宅 383,500戸 / 賃貸・売却用及び二次的住宅を除く空き家 3,856,000戸.**

Cross-checks in round's own files:
- 2023 概要 表２－１ (Section A-5 above): 2023 row "9,002  3,856  4,436  326  384" (1000戸) — identical.
- 2018 概要 (jyutaku2018_kihon_gaiyou.txt lines 166-168): "「賃貸用の住宅」が 432 万７千戸（総住宅数に占める割合 6.9％）となっており，「売却用の住宅」が 29 万３千戸（同 0.5％），別荘などの「二次的住宅」が 38 万１千戸（同 0.6％），「その他の住宅」が 348 万７千戸（同 5.6％）となっている。" — matches 時系列表 4 2018: 4,327,200 / 293,200 / 381,000 / 3,487,200.
- 2013 概要 (jyutaku2013_gaiyou_all.txt lines 182-190): "空き家の内訳をみると,「賃貸用の住宅」が429万戸,「売却用の住宅」が31万戸で，それぞれ空き家全体の52.4％，3.8％となっており，供給可能な住宅が過半数を占めている。" and 図１－３ labels "その他の住宅 38.8 / 賃貸用の住宅 52.4 / 二次的住宅 5.0 / 売却用の住宅 3.8" — matches 時系列表 4 2013: 4,291,800 (52.4% of 8,195,600) / 308,200 (3.8%) / 412,000 (5.0%) / 3,183,600 (38.8% = その他/除く空き家).

---

## E. Series 5 — 平均床面積 (e-Stat 時系列統計表 第13表 / 第14-1表, 2023 round)

### E-1. 第14-1表 住宅の所有の関係(6区分)別 １住宅当たり… (1968–2023, ALL occupied dwellings)
Raw: `raw/statb-housing/estat_2023_timeseries_table14-1.xlsx` (38,386 B, sha256 09b5ff54…953a7, HTTP 200). URL: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354045&fileKind=4. Sheet `014_1`. Title (row 2): "第14-１表 住宅の所有の関係(6区分)別１住宅当たり居住室数、１住宅当たり居住室の畳数、１住宅当たり延べ面積、住宅の１人当たり居住室の畳数及び住宅の１室当たり人員―全国(昭和43年～令和５年)".

１住宅当たり延べ面積(㎡) rows (sheet rows 46-58; 総数 / 持ち家 / 借家総数 / 公営の借家 / UR・公社 1) / 民営借家（木造・設備専用 / 木造・設備共用 / 非木造・設備専用）):
```
昭和43年 1968 4)  73.86   97.42   38.05   37.78   *   41.07   18.41   -
   48年 1973 4)  77.33  103.46   39.53   40.02   *   40.45   17.67   -
   48年 1973     77.14  103.09   39.49   40.01   *   40.41   17.78   -
   53年 1978     80.28  106.16   40.64   41.52  43.32   41.10   16.16  38.51
   58年 1983     85.92  111.67   42.88   44.90  44.67   43.07   16.30  39.23
   63年 1988     89.29  116.78   44.27   47.00  44.84   45.61   16.32  39.97
平成５年 1993     91.92  122.08   45.08   49.44  46.66   45.81   17.17  39.46
   10年 1998     92.43  122.74   44.49   50.19  46.97   46.86   15.98  39.07
   15年 2003     94.85  123.93   46.30   51.56  48.99   50.18     *    40.55
   20年 2008     94.13  122.63   45.49   51.52  49.51   52.01     *    39.28
   25年 2013     94.42  122.32   45.95   51.91  50.19   53.74     *    40.37
   30年 2018     93.04  119.91   46.79   51.48  51.03   54.44     *    42.32
令和５年 2023     91.66  118.25   45.39   51.29  50.66   50.21     *    41.99
```
Footnotes (rows 91-94): "1) 平成15年までは「公団・公社の借家」として表章" / "2) 昭和48年までは「非木造・設備専用」を含む。" / "3) 昭和48年までは「非木造・設備共用」を含む。" / "4) 沖縄県を含まない。"

### E-2. 第13表 住宅の建て方(4区分)別 １住宅当たり… (1993–2023, ALL occupied dwellings)
Raw: `raw/statb-housing/estat_2023_timeseries_table13.xlsx` (33,470 B, sha256 3a3804b3…57db, HTTP 200). URL: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354044&fileKind=4. Sheet `013`. Title (rows 2-4): "第13表 住宅の建て方(4区分)別１住宅当たり居住室数、…、１住宅当たり延べ面積、…―全国(平成５年～令和５年)". １住宅当たり延べ面積(㎡) rows (sheet rows 37-43; 総数 / 一戸建 / 長屋建 / 共同住宅 / その他): 1993: 91.92 / 122.33 / 53.73 / 44.29 / 121.02; 1998: 92.43 / 124.83 / 55.90 / 45.00 / 133.06; 2003: 94.85 / 128.54 / 62.24 / 47.67 / 131.18; 2008: 94.13 / 128.64 / 65.57 / 47.92 / 145.72; 2013: 94.42 / 129.84 / 64.73 / 48.95 / 152.81; 2018: 93.04 / 127.29 / 63.27 / 51.17 / 139.26; 2023: 91.66 / 126.89 / 63.74 / 50.33 / 146.25.

**Definitional caveat (project-critical)**: the 時系列統計表 13/14-1 series cover ALL occupied dwellings; the 概要 PDFs' 表４/表６ cover **専用住宅** (居住専用に建築された住宅) only, which yields slightly smaller averages (2023: 91.66 ㎡ all-occupied vs 90.86 ㎡ 専用住宅). Both are quoted above with their table titles; never mix the two denominators in a chart. Also, the 2013 概要's 図２－10 (専用住宅, by tenure, 1983–2013) gives 持ち家 2013: 120.93㎡ / 総数 92.97 / 借家 45.59 (jyutaku2013_gaiyou_all.txt lines 492-505). **UNAVAILABLE**: 平均床面積 for 1963 (both 時系列表 13 and 14-1 start at 1993 / 1968; no online official file fetched publishes a 1963 floor-space average).

---

## F. Series 6 — 都道府県別空き家率 2023 (all 47 prefectures)

Raw: `raw/statb-housing/jyutaku2023_kihon_gaiyou.pdf` → `jyutaku2023_kihon_gaiyou.txt` 付表, lines 1268-1327. Table title (line 1268): "付表 都道府県別の主な指標（2023年）". Column heads (lines 1269-1277): 総住宅数（1000戸）1)（2023年 / 2018年 / 2018年～2023年の増減率）/ 空き家数（1000戸）/ 空き家率（％）/ 賃貸・売却用及び二次的住宅を除く空き家数（1000戸）/ （％）/ 居住世帯のある住宅 総数 / うち 一戸建（1000戸・割合％）/ うち 共同住宅 / うち 持ち家（1000戸・割合％）. Footnote (line 1328): "1)居住世帯なしの住宅を含む。"

空き家率（％）column, all 47 prefectures + 全国 (verbatim from rows 1279-1327; format: prefecture 総住宅数2023 総住宅数2018 増減率 空き家数 空き家率 除く空き家数 除く空き家率):
```
全    国   65,047    62,407      4.2   9,002   13.8     3,856     5.9   55,665    29,319    52.7   24,968   44.9   33,876   60.9
北 海 道     2,889    2,807      2.9     452   15.6       163     5.6    2,423    1,258    51.9    1,082   44.6    1,381   57.0
青 森 県       590      592     -0.4      99   16.7        55     9.3      489      368    75.3      103   21.0      349   71.4
岩 手 県       579      579      0.0     100   17.3        54     9.3      477      344    72.2      119   24.9      335   70.3
宮 城 県     1,129    1,089      3.7     140   12.4        52     4.6      984      543    55.2      422   42.9      590   60.0
秋 田 県       441      446     -1.1      70   15.8        44    10.0      369      293    79.4       69   18.6      285   77.1
山 形 県       455      449      1.4      62   13.5        36     7.9      392      298    76.1       88   22.4      294   75.0
福 島 県       863      861      0.2     131   15.2        63     7.3      727      513    70.6      196   27.0      497   68.3
茨 城 県     1,391    1,329      4.7     196   14.1        93     6.7    1,187      832    70.1      328   27.6      824   69.4
栃 木 県       971      927      4.8     164   16.9        64     6.6      802      571    71.2      213   26.5      555   69.1
群 馬 県       967      949      1.9     161   16.7        73     7.6      802      589    73.5      197   24.6      570   71.1
埼 玉 県     3,555    3,385      5.0     330    9.3       136     3.8    3,205    1,730    54.0    1,408   43.9    2,087   65.1
千 葉 県     3,191    3,030      5.3     394   12.3       159     5.0    2,782    1,463    52.6    1,268   45.6    1,800   64.7
東 京 都     8,201    7,672      6.9     897   10.9       214     2.6    7,235    1,901    26.3    5,181   71.6    3,235   44.7
神 奈 川県    4,765    4,504      5.8     467    9.8       151     3.2    4,272    1,740    40.7    2,434   57.0    2,508   58.7
新 潟 県     1,015      995      2.1     155   15.3        78     7.6      852      629    73.9      207   24.3      630   74.0
富 山 県       474      453      4.7      70   14.7        40     8.4      402      297    74.0       95   23.6      301   74.9
石 川 県       554      536      3.4      86   15.6        41     7.3      464      319    68.7      136   29.2      315   67.8
福 井 県       341      325      4.9      53   15.6        29     8.5      287      214    74.7       65   22.5      211   73.5
山 梨 県       427      422      1.2      87   20.4        37     8.7      337      242    71.9       88   26.2      231   68.6
長 野 県     1,040    1,008      3.1     209   20.1        92     8.9      825      605    73.4      197   23.9      592   71.7
岐 阜 県       924      894      3.4     148   16.1        74     8.1      770      571    74.2      181   23.5      568   73.7
静 岡 県     1,774    1,715      3.5     296   16.7       105     5.9    1,468      964    65.7      474   32.3      990   67.4
愛 知 県     3,665    3,482      5.3     433   11.8       156     4.3    3,211    1,638    51.0    1,468   45.7    1,914   59.6
三 重 県       874      854      2.3     143   16.3        83     9.5      727      526    72.4      188   25.8      526   72.3
滋 賀 県       664      626      6.1      82   12.3        49     7.3      579      383    66.1      182   31.5      410   70.9
京 都 府     1,372    1,338      2.5     180   13.1        85     6.2    1,183      635    53.7      523   44.2      718   60.7
大 阪 府     4,929    4,680      5.3     702   14.2       227     4.6    4,197    1,672    39.8    2,408   57.4    2,286   54.5
兵 庫 県     2,798    2,681      4.4     387   13.8       173     6.2    2,397    1,190    49.6    1,144   47.7    1,545   64.4
奈 良 県       640      618      3.5      94   14.6        50     7.7      543      366    67.5      165   30.5      397   73.2
和 歌 山県      496      485      2.1     105   21.2        60    12.1      387      288    74.5       86   22.3      285   73.8
鳥 取 県       262      257      2.2      41   15.7        25     9.7      220      158    71.8       57   25.9      153   69.6
島 根 県       320      314      1.9      55   17.0        36    11.3      264      186    70.6       70   26.6      184   69.6
岡 山 県       955      916      4.3     157   16.5        83     8.6      794      523    65.9      252   31.7      521   65.6
広 島 県     1,466    1,431      2.4     231   15.8       115     7.8    1,228      677    55.1      521   42.4      761   61.9
山 口 県       726      720      0.9     141   19.4        81    11.1      583      388    66.6      169   29.0      391   67.0
徳 島 県       389      381      2.2      83   21.3        48    12.2      303      211    69.4       83   27.4      206   68.1
香 川 県       493      488      1.0      92   18.6        48     9.7      399      265    66.5      116   29.2      277   69.4
愛 媛 県       737      714      3.1     146   19.8        90    12.2      586      387    65.9      179   30.6      381   65.0
高 知 県       388      392     -0.9      79   20.3        50    12.9      307      210    68.2       90   29.2      203   66.0
福 岡 県     2,703    2,581      4.7     335   12.4       126     4.6    2,352    1,008    42.8    1,289   54.8    1,239   52.7
佐 賀 県       368      352      4.5      53   14.5        28     7.7      312      214    68.6       90   28.8      212   67.9
長 崎 県       655      660     -0.7     113   17.3        65     9.9      538      345    64.1      177   32.9      348   64.7
熊 本 県       851      814      4.6     127   14.9        65     7.6      718      449    62.5      244   34.0      451   62.9
大 分 県       603      582      3.7     116   19.1        58     9.6      486      296    60.9      182   37.5      303   62.3
宮 崎 県       557      546      1.9      91   16.3        55     9.9      463      317    68.4      130   28.0      304   65.7
鹿 児 島県      900      879      2.3     184   20.5       122    13.6      711      470    66.1      226   31.7      450   63.3
沖 縄 県       699      653      7.2      65    9.4        28     4.0      627      235    37.4      382   60.9      267   42.6
```
- **東京都 10.9%** (空き家数 897千戸, 総住宅数 8,201千戸); **沖縄県 9.4%** (65千戸 / 699千戸); **全国 13.8%**.
- Highest 空き家率: 徳島県 21.3, 和歌山県 21.2, 鹿児島県 20.5, 山梨県 20.4, 高知県 20.3, 長野県 20.1. Lowest: 埼玉県 9.3, 沖縄県 9.4, 神奈川県 9.8, 東京都 10.9.
- Corroborated by e-Stat 時系列統計表 第4表 (sheet 総数, 都道府県 rows, 空き家総数 2023 column): e.g. 東京都 row 36 (col 17) = 897000; 沖縄県 row 70 = 65000; 徳島県 row 59 = 83000 (values in 戸).

---

## G. Series 7 — housing quality: 建築の時期別住宅数 2023 (best effort, obtained)

Raw: `raw/statb-housing/estat_2023_shuyo_b4-4_chikunensu.xlsx` (31,313 B, sha256 57ec9b43…1e64a, HTTP 200). URL: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040353905&fileKind=4 (listed on `estat_2023_shuyo_page.html` as 「4 住宅の建築の時期(14区分)別住宅数―全国、都道府県、21大都市」, 主要統計表 category, 2023 round). Sheet `C004`.

Table title (row 4): "第４表 住宅の建築の時期(14区分)別住宅数―全国、都道府県、21大都市". Column heads (rows 9-14): 総数 Total 1) / 昭和25年以前 (1950 or earlier) / 昭和26年～45年 (1951 to 1970) / 昭和46年～55年 (1971 to 1980) / 昭和56年～平成２年 (1981 to 1990) / 平成３年～12年 (1991 to 2000) / 平成13年～17年 (2001 to 2005) / 平成18年～22年 (2006 to 2010) / 平成23年～27年 (2011 to 2015) / 平成28年～30年 (2016 to 2018) / 平成31年・令和元年 (2019) / 令和２年 (2020) / 令和３年 (2021) / 令和４年 (2022) / 令和５年１月～９月 (Jan. to Sep. 2023). Footnote (row 88): "1) 建築の時期「不詳」を含む。"

全国 Japan row (sheet row 17, 户; occupied dwellings, 総数 = 55,665,000):
```
1127200 (≤1950) / 2729100 (1951-70) / 7185600 (1971-80) / 8921800 (1981-90) / 10470700 (1991-2000) / 5201100 (2001-05) / 4660900 (2006-10) / 4446400 (2011-15) / 2837200 (2016-18) / 1408600 (2019) / 921500 (2020) / 853700 (2021) / 769600 (2022) / 514300 (2023 Jan-Sep)
```
Prefecture rows 18-64 give the same breakdown per prefecture (e.g. 東京都 row 30: "7235400  38500  301600  797100  1089700  1248200  760800  658500  664500  416000 …").
**UNAVAILABLE as a single published figure**: a "1972年以前着工（旧耐震基準）" count/share is NOT tabulated in this file — the building-period bands are ≤1950 / 1951–1970 / 1971–1980 …, which straddle 1972. 築30年以上 (pre-1993) is likewise not a published band (1991–2000 straddles it). Any 1972-以前 figure would have to be computed from a finer aggregation (not fetched) — not estimated here per anti-fabrication rule 4. Note the 2023 構造等集計 概要 (`jyutaku2023_kouzou_gaiyou.txt` lines 98-109) covers 増改築・耐震改修工事 by 建築の時期 for 持ち家 only ("2019年以降に増改築・改修工事等が行われた持ち家は974万８千戸で、持ち家全体の28.8％" line 98; "2019年以降に耐震改修工事が行われた持ち家は63万７千戸で、持ち家全体の1.9％" line 182).

---

## H. 速報（概数集計） vs 確報（基本集計） — 2023 revision record

- 速報の概要 (provisional, published 2024-04-30): `jyutaku2023_gaisuu_gaiyou.pdf` / `.txt` (475,083 B, sha256 ca015e4a…7986, HTTP 200; URL https://www.stat.go.jp/data/jyutaku/2023/pdf/g_kekka.pdf). Verbatim (txt lines 17-20): "○ 我が国の総住宅数は6502万戸（2023年10月１日現在）、2018年から4.2％（261万戸）の増加" / "2023年10月１日現在における我が国の総住宅数は6502万戸と…"; (lines 105-112): "○ 空き家数は900万戸と過去最多、2018年から51万戸の増加、空き家率も13.8％と過去最高 … 総住宅数のうち、空き家は900万戸と、2018年（849万戸）と比べ、51万戸の増加で過去最多となっており、総住宅数に占める空き家の割合（空き家率）は13.8％ …「賃貸・売却用及び二次的住宅を除く空き家」は385万戸と、2018年（349万戸）と比べ、37万戸の増加となっており、総住宅数に占める割合は5.9％となっている。"
- 確報 vs 速報 (from `jyutaku2023_kihon_gaiyou.txt` 参考２, 表１, lines ~1485-1492): 速報集計 65,021 / 8,995 / 13.8 / 3,853 / 5.9; 確報集計 65,047 / 9,002 / 13.8 / 3,856 / 5.9; 差（確報－速報） 26 / 6 / 0.0 / 3 / 0.0 (1000戸・％). Verbatim FAQ: "Ａ１：速報集計結果と比べると、確報集計結果では総住宅数が２万６千戸、空き家数が６千戸増加しました。全国の空き家率（13.8％）は変わりません。"
- 19 prefectures' 空き家率 changed by ±0.1–0.2 pt between 速報 and 確報 (表２, lines ~1496-1516), e.g. 秋田県 15.7→15.8, 埼玉県 9.4→9.3, 東京都 11.0→10.9, 沖縄県 9.3→9.4, 滋賀県 12.1→12.3 (+0.2). **Use 確報 values (本ノートSections A/F) for publication.**

## I. 2018 / 2013 round verification (per-round files, anti-fabrication cross-checks)

### I-1. 2018 round (平成30年, survey date 2018-10-01)
Raw: `jyutaku2018_kihon_gaiyou.pdf` (747,556 B, sha256 39994729…1c84, HTTP 200; URL https://www.stat.go.jp/data/jyutaku/2018/pdf/kihon_gaiyou.pdf) + `.txt`.
- 総住宅数 6240万7千戸, 総世帯数 5400万1千世帯 (txt lines 80-83): "2018 年 10 月１日現在における我が国の総住宅数は 6240 万７千戸，総世帯数は 5400 万１千世帯となっており…"
- 空き家 848万9千戸, 空き家率 13.6% (lines 159-165): "空き家は 848 万９千戸と 3.6％の増加，空き家率は 13.6％と過去最高" / "…総住宅数に占める空き家の割合（空き家率）は 13.6％と，2013 年から 0.1 ポイント上昇し，過去最高となっている。"
- 持ち家 3280万2千戸, 持ち家住宅率 61.2% (lines 294-304, quoted in Section B cross-checks).
- 表２ 居住世帯の有無別住宅数の推移－全国（1958年～2018年）(line 222): 実数 rows 233-245 (identical values to the 2023 時系列表 1-1 for 1958-2018; category names 2018 file: 賃貸用の住宅 / 売却用の住宅 / 二次的住宅 / その他の住宅; ※ = 売却用を含む for 1978-1998).
- 表３ 住宅の所有の関係別住宅数の推移－全国（1973年～2018年）(line 341): 2018 row "53,616 32,802 19,065 1,922 747 15,295 1,100" (1000戸), 割合 row "100.0 61.2 35.6 3.6 1.4 28.5 2.1" — identical to 時系列表 9-1.
- 表４ 専用住宅の建て方別規模の推移－全国（1993年～2018年）(line 389): 延べ面積 総数 88.38/89.59/92.49/92.41/92.97/92.06, 一戸建 …126.63, 共同住宅 …51.14 — identical to 2023 概要 表６ for 1993-2018 (confirming the 専用住宅 series' continuity across rounds).

### I-2. 2013 round (平成25年, survey date 2013-10-01)
Raw: `jyutaku2013_gaiyou_all.pdf` (2,451,254 B, sha256 7f25f54d…3417, HTTP 200; URL https://www.stat.go.jp/data/jyutaku/2013/pdf/kgiy00.pdf, 「結果の概要」（PDF：2,394KB） linked from https://www.stat.go.jp/data/jyutaku/2013/10_3.html 「平成25年住宅・土地統計調査（確報集計）結果の概要 平成27年2月」) + `.txt`.
- 総住宅数 6063万戸, 総世帯数 5245万世帯 (txt lines 87-97): "総住宅数は6063万戸" / "…我が国の総住宅数は6063万戸，総世帯数は5245万世帯となっており…"
- 空き家 820万戸, 空き家率 13.5% (lines 139-176): "総住宅数の13.5％が空き家" / "…空き家，建築中の住宅などの「居住世帯のない住宅」は853万戸で，14.1％となっている。…平成25年には820万戸となっている。また，空き家率（総住宅数に占める空き家の割合）は…平成25年には13.5％と，20年に比べ0.4ポイント上昇し，過去最高となっている。" (図１－２ series labels: 2.0 / 2.5 / 4.0 / 5.5 / 7.6 / 8.6 / 9.4 / 9.8 / 11.5 / 12.2 / 13.1 / 13.5, 昭和33年～平成25年, "*印の数値は，沖縄県を含まない").
- 持ち家住宅率 61.7% (line 436; see Section B). 専用住宅 延べ面積 92.97㎡ (lines 492-505).
- 2013 category names for vacancy types: 賃貸用の住宅 / 売却用の住宅 / 二次的住宅 / その他の住宅 (図１－３, lines 182-190) — see Series 4 cross-check.

### I-3. 2018-round 時系列統計表 (through 2018; downloaded as provenance backup)
`estat_2018_timeseries_table1-1.xlsx` (25,765 B, sha256 3ca0584c…f2b6), `table4.xlsx` (127,458 B, c7c01a78…3db9), `table9-1.xlsx` (22,736 B, cb21a6b6…d287), `table13.xlsx` (24,672 B, e350c3f1…c745), `table14-1.xlsx` (30,014 B, 59e5a4c3…05df). URLs: https://www.e-stat.go.jp/stat-search/file-download?statInfId=000031959512 / …517 / …523 / …529 / …630 &fileKind=0 (listed in `estat_2018_timeseries_page.html`, 公開（更新）日 2020-06-30). Spot-check: table 9-1 (2018 round) 2018 row = "53616300 32801500 19064700 1922300 747200 15295300 1099900" — identical to the 2023-round table 9-1; the 2023-round tables simply add the 2023 row. No revisions found between the 2018-round and 2023-round time-series files for overlapping years (values quoted above are byte-identical).

---

## J. Raw-file register (URL → file, HTTP status, bytes, sha256)

All HTTP 200 except where noted 404. Full machine-readable copy: `raw/statb-housing/MANIFEST.tsv`. UA used on every request: Chrome/130 browser string (see `scripts/fetch-statb-housing.sh`).

| URL | file | HTTP | bytes | sha256 (first 12) |
|---|---|---|---|---|
| https://www.stat.go.jp/data/jyutaku/index.html | jyutaku_portal.html (+.utf8) | 200 | 17,429 | ab67bb1ade74 |
| https://www.stat.go.jp/data/jyutaku/2023/tyousake.html | jyutaku2023_tyousake.html (+.utf8) | 200 | 19,834 | 9c0e648304c3 |
| https://www.stat.go.jp/data/jyutaku/2023/tyougai.html | jyutaku2023_tyougai.html (+.utf8) | 200 | 21,766 | bdd087b29b25 |
| https://www.stat.go.jp/data/jyutaku/2023/gaisuu.html | jyutaku2023_gaisuu.html (+.utf8) | 200 | 13,015 | 9a53b999a461 |
| https://www.stat.go.jp/data/jyutaku/2018/tyousake.html | jyutaku2018_tyousake.html (+.utf8) | 200 | 20,582 | c42a3b4ac33c |
| https://www.stat.go.jp/data/jyutaku/2013/tyousake.html | jyutaku2013_tyousake.html (+.utf8) | 200 | 20,436 | b3d5d99f31bd |
| https://www.stat.go.jp/data/jyutaku/kekka.html | jyutaku2013_kekka.html (+.utf8) | 200 | 12,968 | ccc56b055cae |
| https://www.stat.go.jp/data/jyutaku/2013/gaiyou.html | jyutaku2013_gaiyou.html (+.utf8) | 200 | 13,384 | 7abb3a50746f |
| https://www.stat.go.jp/data/jyutaku/2013/10_3.html | jyutaku2013_10_3.html (+.utf8) | 200 | 14,361 | d4c6abfdda6c |
| https://www.stat.go.jp/data/jyutaku/{2023,2018,2013}/nn/index.htm | jyutaku20XX_nn_index.html | **404** | 4,691 | 606194abc6d7 (×3) |
| https://www.stat.go.jp/english/data/jyutaku/index.html | jyutaku_portal_en.html | 200 | 10,804 | ad93f1f220c9 |
| https://www.stat.go.jp/english/data/jyutaku/results.html | jyutaku_en_results.html | 200 | 11,067 | 08e70f7d6e00 |
| https://www.stat.go.jp/english/data/jyutaku/2501.html | jyutaku_en_2501.html | 200 | 15,127 | 1824b753b3d4 |
| https://www.stat.go.jp/english/data/jyutaku/2502.html | jyutaku_en_2502.html | 200 | 8,989 | e9150c0dd7fb |
| https://www.stat.go.jp/english/data/jyutaku/1501.html | jyutaku_en_1501.html | 200 | 14,250 | 70a4c5f3a143 |
| https://www.stat.go.jp/english/data/jyutaku/2001.html | jyutaku_en_2001.html | 200 | 14,404 | 74f0686f2b97 |
| https://www.stat.go.jp/english/data/jyutaku/1520100.html | jyutaku_en_1520100.html | 200 | 14,058 | 0f394dad3e42 |
| https://www.stat.go.jp/english/data/jyutaku/3001.html | jyutaku_en_3001_404.html | **404** | 4,691 | 606194abc6d7 | EN outline for 2018 round does not exist |
| https://www.stat.go.jp/english/data/jyutaku/5001.html | jyutaku_en_5001_404.html | **404** | 4,691 | 606194abc6d7 | EN outline for 2023 round does not exist |
| https://www.stat.go.jp/data/kouhyou/e-stat_jyutaku2023.xml | kouhyou_jyutaku2023.xml (+.utf8) | 200 | 8,922 | 52d10a96c28c |
| https://www.stat.go.jp/data/kouhyou/e-stat_jyutaku2018.xml | kouhyou_jyutaku2018.xml (+.utf8) | 200 | 12,282 | c05889d74cb7 |
| https://www.stat.go.jp/data/jyutaku/2023/pdf/kihon_gaiyou.pdf | jyutaku2023_kihon_gaiyou.pdf (+.txt) | 200 | 747,841 | 4ffbfaf126bd |
| https://www.stat.go.jp/data/jyutaku/2023/pdf/kouzou_gaiyou.pdf | jyutaku2023_kouzou_gaiyou.pdf (+.txt) | 200 | 1,783,239 | a353310dd0f9 |
| https://www.stat.go.jp/data/jyutaku/2023/pdf/tochi_gaiyou.pdf | jyutaku2023_tochi_gaiyou.pdf | 200 | 593,918 | 24ca4430fc3a |
| https://www.stat.go.jp/data/jyutaku/2023/pdf/g_kekka.pdf | jyutaku2023_gaisuu_gaiyou.pdf (+.txt) | 200 | 475,083 | ca015e4a3f40 |
| https://www.stat.go.jp/data/jyutaku/2018/pdf/kihon_gaiyou.pdf | jyutaku2018_kihon_gaiyou.pdf (+.txt) | 200 | 747,556 | 399947294364 |
| https://www.stat.go.jp/data/jyutaku/2013/pdf/kgiy00.pdf | jyutaku2013_gaiyou_all.pdf (+.txt) | 200 | 2,451,254 | 7f25f54dbe4c |
| https://www.stat.go.jp/data/jyutaku/2023/pdf/yougo.pdf | jyutaku2023_yougo.pdf (+.txt) | 200 | 431,598 | 63e8e98d8bec |
| https://www.e-stat.go.jp/stat-search/files?tstat=000001127155 | estat_2018_files.html | 200 | 183,441 | 45082dc975f5 |
| https://www.e-stat.go.jp/stat-search/files?tstat=000001207800 | estat_2023_files.html | 200 | 181,585 | 38278e146e49 |
| …tclass1=000001140366 (2018 時系列) | estat_2018_timeseries_page.html | 200 | 301,599 | ab1f21ba57d7 |
| …tclass1=000001207807 (2023 時系列) | estat_2023_timeseries_page.html | 200 | 305,815 | 091ae684f2dc |
| …tclass1=000001207804 (2023 主要統計表) | estat_2023_shuyo_page.html | 200 | 322,025 | fdce42ce9f43 |
| https://www.e-stat.go.jp/retrieve/api_file… (3 probes) + api_file_tclass + /modules/custom/retrieve/src/js/file.js | estat_2018_apifile.json / estat_2018_timeseries.json / estat_2018_tclass_expand.json / estat_2018_tclass.json / estat_file.js | 200 | 67,044 / 37,507 / 67,308 / 18 / 41,258 | 9d2ad57a… / 0a3370cf… / 41fb69d7… / 7725ba0e… / b33cd598… |
| …file-download?statInfId=000040354027&fileKind=4 | estat_2023_timeseries_table1-1.xlsx (sheet 001_1) | 200 | 35,250 | bd381410b1e9 |
| …statInfId=000040354032&fileKind=4 | estat_2023_timeseries_table4.xlsx (sheets 総数/一戸建/長屋建/共同住宅/その他) | 200 | 133,369 | 23aa24206e62 |
| …statInfId=000040354038&fileKind=4 | estat_2023_timeseries_table9-1.xlsx (sheet 009_1) | 200 | 28,914 | e4074a510db7 |
| …statInfId=000040354044&fileKind=4 | estat_2023_timeseries_table13.xlsx (sheet 013) | 200 | 33,470 | 3a3804b33109 |
| …statInfId=000040354045&fileKind=4 | estat_2023_timeseries_table14-1.xlsx (sheet 014_1) | 200 | 38,386 | 09b5ff542500 |
| …statInfId=000040354029&fileKind=4 | estat_2023_timeseries_table2-1.xlsx (sheet 002_1) | 200 | 31,526 | ba46d976a556 |
| …statInfId=000040353905&fileKind=4 | estat_2023_shuyo_b4-4_chikunensu.xlsx (sheet C004) | 200 | 31,313 | 57ec9b4383db |
| …statInfId=000031959512/…517/…523/…529/…630 &fileKind=0 | estat_2018_timeseries_table{1-1,4,9-1,13,14-1}.xlsx | 200 | 25,765 / 127,458 / 22,736 / 24,672 / 30,014 | 3ca0584c… / c7c01a78… / cb21a6b6… / e350c3f1… / 59e5a4c3… |
| …statInfId=000031959512&fileKind=1 (CSV probe) | (not saved) | **404** | — | e-Stat serves these tables as EXCEL only (fileKind=0 for 2018 round, =4 for 2023 round) |

---

## K. Caveats for Chapter 03 authors

1. **Denominators**: 持ち家率 and the 概要 表５ use 居住世帯のある住宅 (occupied dwellings, incl. 所有の関係不詳 since 1978) as denominator; 空き家率 uses 総住宅数. Never divide 持ち家 by 総住宅数.
2. **持ち家 definition** (2023 survey's own glossary, `jyutaku2023_yougo.txt` lines 254-257, from https://www.stat.go.jp/data/jyutaku/2023/pdf/yougo.pdf): "持ち家　そこに居住している世帯が全部又は一部を所有している住宅　最近建築、購入又は相続した住宅で、登記がまだ済んでいない場合やローンなどの支払が完了していない場合も「持ち家」とした。また、親の名義の住宅に住んでいる場合も「持ち家」とした。" **Note: the term 帰属持ち家 does NOT appear in the 2023 survey's 用語の解説** (rg "帰属" over `jyutaku2023_yougo.txt` = 0 hits; also 0 hits in the 2018/2013 概要 texts) — 帰属持ち家 is a Population Census concept, not a 住宅・土地統計調査 category for the rounds fetched. The 時系列表 9-1 rate is labelled simply 持ち家 / Owned houses.
3. **Okinawa / coverage breaks**: 1968-and-earlier figures exclude Okinawa; the 1973 double rows are 沖縄を含まない (28,501,200) / 沖縄を含む (28,730,500); 1948 excludes 建築中; 1953 is 市部のみ (city areas only — the reason the 1953 total of 7,127,000 is lower than 1948's 13,907,024). These breaks are stated in the files themselves (第1-1表 footnotes; 2023 概要 注１).
4. **Vacancy-type comparability**: 1978–1998 「賃貸用」includes 売却用; 2013/2018 「その他の住宅」 was renamed 「賃貸・売却用及び二次的住宅を除く空き家」 in 2023 (box quoted in A-6). The 2023 概要 also flags this explicitly.
5. **Floor area denominators**: 時系列表 13/14-1 = all occupied dwellings; 概要 表４/表６ = 専用住宅 only (2023: 91.66 vs 90.86 ㎡). Label charts with the exact table title used.
6. **速報 vs 確報**: use 確報 (基本集計, 2024-09-25) figures; the 速報 (2024-04-30) understated 総住宅数 by 26 thousand and 空き家数 by 6 thousand and shifted 19 prefectures' vacancy rates by ±0.1–0.2 pt (Section H).
