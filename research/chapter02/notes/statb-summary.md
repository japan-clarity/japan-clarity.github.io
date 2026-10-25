# 総務省統計局 — 労働力調査・科学技術研究調査 — Chapter 02 research summary

## 労働力調査 (Labour Force Survey)

- **Agency:** 総務省統計局 (Statistics Bureau, MIC)
- **Files:** raw/statb/lfs-2-1-shuyo.xlsx (長期時系列表２ 就業状態別15歳以上人口,
  e-Stat statInfId 000001082681), lfs-5-1/5-2/5-3 (産業別就業者数), plus pages.
- **Publication evidence:** 長期時系列データ files updated on e-Stat (公開日 per file,
  2025-12-12 era); latest monthly 2026年8月分 published 2026-10-02; long-series Excel
  includes 2025 annual values.
- **Access/verification date:** 2026-10-25.
- **Anchors (男女計, 年平均):** total employed 1953 = 3,913万人 → 1997 = 6,557万人 →
  2025 = 6,828万人. (就業者 = employed persons, ILO-compatible definition.)
- **Use in chapter:** long-run employment context in the narrative; the employment chart
  uses ESRI SNA activity-side employment for definitional consistency with the
  value-added chart (both from the same 年次推計 vintage).
- **Known limitation:** 産業別 long series chains three 日本標準産業分類 revisions
  (10th 1953–2002, 11th 2002–2009, 12/13th 2002–2025); no official 第一次/第二次/第三次
  aggregate is published in the long-series files.

## 科学技術研究調査 (Research and Development Survey)

- **Agency:** 総務省統計局
- **Files used:** raw/statb/kagaku-2025-kekkagai.pdf (2025年調査 = FY2024 results,
  e-Stat 公開日 2025-12-12) 表１－２ 「研究費、ＧＤＰの推移」; kagaku-2015-kekkagai.pdf
  (2015年調査 = FY2014 results) 表２ 「研究費，国内総生産の推移」.
- **Access/verification date:** 2026-10-25.
- **Verbatim quotes:**
  - 2025 概要 p6 表１－２: 2015年度 = 189,391億円 / GDP 5,519,449億円 / 3.43%;
    2024年度 = 237,925億円 / GDP 6,424,147億円 / 3.70%.
    注)「ＧＤＰは、内閣府「2024年度（令和６年度）国民経済計算年次推計」（2025年12月８日公表）による。」
  - 2025 概要 p6 総括: 「2024年度の我が国の科学技術研究費…は23兆7925億円で、前年度に比べ
    7.9％増となっている。また、我が国の研究費の国内総生産（ＧＤＰ）に対する比率は、3.70％と、
    0.14ポイントの上昇となっている。」
  - 2015 概要 p6 表２: 平成17年度 = 178,452億円 / 5,053,494億円 / 3.53%;
    平成26年度 = 189,713億円 / 4,896,234億円 / 3.87%.
- **Chain used on the site:** 対GDP比 2005–2014 from the 2015-survey 表２ + 2015–2024 from
  the 2025-survey 表１－２. **The 2014→2015 boundary crosses GDP vintages** (H26確報-based
  denominators before, 2024年次推計-based after): 研究費 itself is nearly flat
  (189,713 → 189,391億円) while the ratio steps down 3.87% → 3.43% mostly because the
  newer GDP vintage is higher. This is disclosed in the chart note and limitations.
- **Coverage limitation:** machine-readable 研究費 series online reach 1995 only (via the
  2004 概要 HTM); 1953–1994 would require printed年报/NISTEP indicators (different
  agency) — documented as out of scope, not estimated.

## e-Stat download evidence

- LFS long-series files downloaded via https://www.e-stat.go.jp/stat-search/file-download?statInfId=…
  (statInfIds logged in notes/mhlw-statb-inventory.md §B.1 with sha256s).
- Format warning: e-Stat serves legacy BIFF .xls through the same endpoint as xlsx;
  file magic verified at download time (lfs-5-2/5-3 are .xls despite .xlsx extension).
