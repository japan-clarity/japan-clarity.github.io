# ESRI 国民経済計算年次推計 — Chapter 02 research summary

## Source identity

- **Agency:** 内閣府 経済社会総合研究所 (Economic and Social Research Institute, Cabinet Office)
- **Release used:** 2024年度（令和6年度）国民経済計算年次推計（2020年基準・2008SNA）
- **Publication date:** 2025-12-23 (per point_flow PDF cover 「令和７年12月23日 内閣府経済社会総合研究所」
  and 「12/23（火）15:00公表予定」; file suffixes `_20251223`; the annual-report main page
  https://www.esri.cao.go.jp/jp/sna/data/data_list/kakuhou/files/2024/2024_kaku_top.html links every table used)
- **Access/verification date:** 2026-10-25 (downloaded by acquisition agent Task 2-a; verified by extraction Task 6)
- **License:** 内閣府公表資料 — 統計事実の引用・出典明示转载 is permitted under the bureau's terms;
  raw files NOT redistributed in the repository (see research/DATA-LICENSES.md). Extracted
  statistics (facts) and fragment-length verbatim quotes below carry full attribution.

## Files used (raw/, sha256 first 12 in notes/esri-inventory.md)

| File | Content | Rows used |
|---|---|---|
| esri-2024fcm1n_jp.xlsx | 主要系列 暦年 名目 (単位:10億円) | 実数 r48 「５．国内総生産（支出側）(1+2+3+4)」 1994–2024 (cols B–AF) |
| esri-2024fcm1rn_jp.xlsx | 暦年 実質（2020暦年連鎖価格） | 実数 r48; 増加率 sheet r48 (対前年増加率 %) 1995–2024 |
| esri-2024fcm1dn_jp.xlsx | 暦年 デフレーター (2020暦年=100) | 実数 r44 「５．国内総生産（支出側）」 |
| esri-2024i5_jp.xlsx | 家計（個人企業を含む）所得勘定 | 暦年（２）r22 「2.4 可処分所得（純）」 1994–2024 |
| esri-2024s2n_jp.xlsx | 経済活動別国内総生産（名目） | 31 yearly sheets 平成６–令和６; rows 8–37 (16 activities), col D 「国内総生産」=(3)=(1)-(2); totals r39 「経済活動 計」, r44 「合計」 |
| esri-2024s3_jp.xlsx | 経済活動別就業者数 | 暦年（１）就業者 rows 8–37 (万人), r39 「合計」 |
| esri-katudo_bunrui.pdf | 経済活動別分類 (activity classification reference) | used to confirm the 16-activity classification |
| esri-kokusaihikaku_20251223.pdf | ＧＤＰの国際比較 (参考表6) | narrative anchors (below) |
| esri-hitoriatarigdp_20251223.pdf | 一人当たり名目ＧＤＰ等 (参考表5) | narrative anchors |
| esri-point_flow20251223.pdf | ポイント (フロー編) | publication-date evidence; 図 captions |

## Verbatim quotes (fragment-length, verification evidence)

- fcm1n 実数 r48 row label: 「５．　国内総生産（支出側）(1+2+3+4)」 — 1994 = 521,675.1; 2024 = 634,226.0 (10億円).
- fcm1rn 実数 r48 — 1994 = 464,267.4; 2024 = 584,471.1 (10億円, 2020暦年連鎖価格).
- fcm1rn 増加率 r48 — 1995 = 2.3; 2020 = −4.3; 2024 = −0.2 (％).
- fcm1dn 実数 r44 — 1994 = 112.4; 2024 = 108.5 (2020暦年=100).
- i5 暦年（２）r22 「2.4　可処分所得（純）((2.5+2.6+2.7)-(2.1+2.2+2.3)),(3.2),(4.3)」 — 1994 = 297,177.1; 2024 = 329,715.5 (10億円).
- s2n 平成６ sheet: row 10 「３．製　造　業」 col(3) = 122,042.1; row 39 「経済活動　計」 col(3) = 520,863.5;
  row 44 「合　　　　　計」 col(3) = 521,625.1. 令和６ sheet: 製造業 = 119,345.1; 経済活動計 = 628,936.0.
- s3 暦年（１）就業者: r8 「１．農林水産業」 1994 = 485.7 → 2024 = 217.9; r10 「３．製造業」 1994 = 1,410.9 → 2024 = 1,010.1; r39 「合計」 1994 = 6,698.3 → 2024 = 6,928.4 (万人).
- kokusaihikaku p1: 「我が国の名目目ＧＤＰは、令和６（2024）暦年には４兆1,869億ドルとなり、世界のＧＤＰに占める比率は3.8％となった。」
  (日本 row: 2005 = 4,878.4 十億ドル・世界比 10.2% → 2024 = 4,186.9 十億ドル・世界比 3.8%)
- kokusaihikaku p2: 「我が国の一人当たりの名目ＧＤＰは、令和６（2024）暦年には３万3,785ドルとなり、ＯＥＣＤ加盟国の中で第24位となった。」
  (source note in PDF: 中国統計年鑑2025 / IMF IFS / World Bank WDI)
- point_flow cover: 「公表前情報 / (12/23（火）15:00公表予定) / 厳重取扱注意 / 2024年度（令和６年度）国民経済計算年次推計（2020年（令和２年）基準改定値）（フロー編）ポイント / 令和７年12月23日 内閣府経済社会総合研究所」

## Derived series documentation

- **産業3部門 aggregates (s2n / s3):** The yearly sheets publish 16 economic activities but no
  printed 第一次/第二次/第三次産業 rows. Aggregation follows the standard ESRI activity grouping
  (confirmed against 経済活動別分類 katudo_bunrui.pdf):
  第一次 = 農林水産業; 第二次 = 鉱業 + 製造業 + 電気・ガス・水道・廃棄物処理業 + 建設業;
  第三次 = 残り11サービス活動. Validation: sector sums reproduce the printed 「経済活動　計」
  within ≤0.5 十億円 every year; shares sum to 100.0% (±0.01).
- **構成比 denominator:** value-added shares use 「経済活動　計」 (total industry value added),
  not GDP at market prices (生産・輸入税 excluded), so the three shares sum to 100%.
- **実質GDP成長率:** taken from the published 増加率 sheet (not recomputed); cross-checked
  against real levels (2020: recomputed −4.24% vs published −4.3 ✓ within rounding).

## Known limitations

- 暦年 (calendar-year) series only reach 1994 in the 2020-base annual estimates; longer
  history exists only under older SNA bases/rebasing chains which are NOT linked here
  (documented as out of scope rather than fabricated).
- Annual estimates are subject to revision (年次推計 vintages); the Dec-2025 vintage is
  the latest at access time. 2025 calendar-year annual results were not yet published
  (expected Dec 2026); the 2025 figures cited in this chapter come from other sources
  (World Bank WDI / OECD) and are labeled as such.
- 生産側 (activity) GDP total (521,625.1 in 1994) differs from 支出側 GDP (521,675.1) by
  the statistical discrepancy — normal for SNA; both are used only within their own side.
- household disposable income is 10億円 aggregate for the household sector (incl.
  individual proprietorships per the 2008SNA sector definition), not per-capita.
