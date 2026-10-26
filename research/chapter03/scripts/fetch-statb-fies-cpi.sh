#!/usr/bin/env bash
# =============================================================================
# fetch-statb-fies-cpi.sh — Statistics Bureau of Japan (総務省統計局) +
# e-Stat data collection for Japan Clarity Chapter 03
# (Housing & Cost of Living / 住宅・生活費): 家計調査 (FIES) + 消費者物価指数 (CPI)
#
# Purpose : Reproducibility. These are the EXACT curl commands used on
#           2026-10-26 (access date) to build
#           research/chapter03/raw/statb-fies/ and research/chapter03/raw/statb-cpi/.
#           (An earlier interrupted run had also created a raw/statb-jyutaku/
#           probe dir; Task 4-a removed it as byte-duplicates, so the probes
#           were re-fetched into statb-fies/ with *_404.html names.)
# Sources :
#   - https://www.stat.go.jp/  (総務省統計局; Shift_JIS HTML pages, PDF/XLSX/CSV files)
#   - https://www.e-stat.go.jp/ (政府統計の総合窓口; FIES annual detail tables are
#     ONLY published there as Excel, CPI 2025-base long time series as CSV)
# Notes   :
#   - UA is required (stat.go.jp rejects default curl UA for some PDFs).
#   - stat.go.jp HTML/CSV are Shift_JIS; decoded copies saved as .utf8.html /
#     .utf8.csv alongside the original bytes ( originals kept, per project rule).
#   - e-Stat download endpoint:
#       https://www.e-stat.go.jp/stat-search/file-download?statInfId=<id>&fileKind=4
#     fileKind=4 = 閲覧用EXCEL (FIES tables); fileKind=1 = CSV (CPI long series).
#     fileKind=0 = DB-format Excel (for FIES tables it returned bytes identical
#     to fileKind=4 on 2026-10-26; duplicates were not archived twice).
#   - FIES annual 2025 (家計調査年報 家計収支編 2025年) was published 2026-02-06;
#     CPI 2025 annual average (2020年基準) 2026-01-23; CPI 2026年9月分
#     (2025年基準) 2026-10-23; CPI 2025-base long time series 2026-08-07.
#   - URLs that returned 404 on 2026-10-26 are recorded as probes
#     ( sav_index.html / sav_nen_index.html / jyutaku_kei_404.html /
#       juutaku_kei_404.html / kakei_jyutaku_404.html / cpi_historic_index_404.html ).
#   - e-Stat list pages (server-rendered, UTF-8) are archived as evidence for the
#     公開（更新）日 dates; individual table pages are a JS SPA shell and
#     /stat-search/stat-info?stat_inf_id=... returns 404, so list pages are used.
#   - Use --max-time 30 for HTML, 60-180 for binary files (workspace rule).
# =============================================================================
set -euo pipefail

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
FIES="/home/z/jc-ch03/research/chapter03/raw/statb-fies"
CPI="/home/z/jc-ch03/research/chapter03/raw/statb-cpi"
mkdir -p "$FIES" "$CPI"

# -----------------------------------------------------------------------------
# A. FIES (家計調査 家計収支編) — entry pages
#    NOTE: /data/sav/ and /data/sav/nen/ returned 404 on 2026-10-26.
#    The live FIES section is /data/kakei/ (probe files kept as evidence).
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -A "$UA" -o "$FIES/sav_index.html"          "https://www.stat.go.jp/data/sav/index.htm"                          # 404 probe
curl -sS --max-time 30 -A "$UA" -o "$FIES/sav_nen_index.html"      "https://www.stat.go.jp/data/sav/nen/index.htm"                      # 404 probe
curl -sS --max-time 30 -A "$UA" -o "$FIES/kakei_index.html"        "https://www.stat.go.jp/data/kakei/index.htm"                        # 200 FIES top
curl -sS --max-time 30 -A "$UA" -o "$FIES/kakei_2.html"            "https://www.stat.go.jp/data/kakei/2.html"                            # 200 調査結果
curl -sS --max-time 30 -A "$UA" -o "$FIES/kakei_2025np_index.html" "https://www.stat.go.jp/data/kakei/2025np/index.html"                # 200 年報2025 index
curl -sS --max-time 30 -A "$UA" -o "$FIES/kakei_longtime_index.html"  "https://www.stat.go.jp/data/kakei/longtime/index.html"           # 200 時系列データ
curl -sS --max-time 30 -A "$UA" -o "$FIES/kakei_longtime_index2.html" "https://www.stat.go.jp/data/kakei/longtime/index2.html"          # 200 過去の長期時系列
curl -sS --max-time 30 -A "$UA" -o "$FIES/kakei_sokuhou_index.html"   "https://www.stat.go.jp/data/kakei/sokuhou/tsuki/index.html"      # 200 月次(2026年8月分 2026-10-09公表)

# 2025年 家計の概要 (headline PDF of the 2025 annual report)
curl -sS --max-time 60 -A "$UA" -o "$FIES/kakei_2025np_summary.pdf" "https://www.stat.go.jp/data/kakei/2025np/pdf/summary.pdf"
pdftotext -layout "$FIES/kakei_2025np_summary.pdf" "$FIES/kakei_2025np_summary.txt"

# 時系列データ reference file (購入形態別 2020-2025; not the 消費支出 series)
curl -sS --max-time 60 -A "$UA" -o "$FIES/kakei_longtime_type-two.xlsx" "https://www.stat.go.jp/data/kakei/longtime/zuhyou/type-two.xlsx"

# Shift_JIS -> UTF-8 sidecar copies of the HTML pages kept above
for f in kakei_index kakei_2025np_index kakei_longtime_index kakei_longtime_index2 kakei_sokuhou_index; do
  iconv -f SHIFT_JIS -t UTF-8 "$FIES/$f.html" > "$FIES/$f.utf8.html" 2>/dev/null || true
done

# -----------------------------------------------------------------------------
# B-bis. e-Stat list pages (UTF-8 server-rendered HTML; publication-date evidence)
#        二人以上/単身 詳細結果表: 公開（更新）日 2026-02-06; 長期時系列表: 2026-10-09
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -A "$UA" -o "$FIES/estat_fies2025np_detaillist.html" \
  "https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&cycle=7&month=0&toukei=00200561&tstat=000000330001&tclass1=000000330001&tclass2=000000330004&tclass3=000000330005&year=20250&result_back=1"
curl -sS --max-time 30 -A "$UA" -o "$FIES/estat_fies2025np_solo_list.html" \
  "https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&cycle=7&month=0&toukei=00200561&tstat=000000330001&tclass1=000000330001&tclass2=000000330022&tclass3=000000330023&year=20250&result_back=1"
curl -sS --max-time 30 -A "$UA" -o "$FIES/estat_fies_longtime_list.html" \
  "https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&toukei=00200561&tstat=000000330001&cycle=0&tclass1=000001228280&tclass2val=0"

# -----------------------------------------------------------------------------
# B. FIES 2025 annual detail tables (e-Stat, 家計調査 統計表 00200561)
#    List pages were browsed at:
#      https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&cycle=7&month=0&toukei=00200561&tstat=000000330001&tclass1=000000330001&tclass2=000000330004&tclass3=000000330005&year=20250&result_back=1   (二人以上の世帯 詳細結果表; 2026-02-06公開)
#      https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&cycle=7&month=0&toukei=00200561&tstat=000000330001&tclass1=000000330001&tclass2=000000330022&tclass3=000000330023&year=20250&result_back=1   (単身世帯 詳細結果表; 2026-02-06公開)
#    stat_infid -> table mapping (verified via each stat_infid page title):
#      000040409521 第１－１表 000040409522 第１－２表 000040409538 第３－７表(住居の所有関係別)
#      000040409815 単身 表1 000040409842 単身 表8(住居の所有関係別)
#      000040270657 長期時系列 表2 二人以上の世帯 / 000040270658 同 勤労者世帯 (2026-10-09更新)
# -----------------------------------------------------------------------------
for pair in \
  "000040409521|$FIES/estat_2025np_t1-1_fk4.xlsx" \
  "000040409522|$FIES/estat_2025np_t1-2_fk4.xlsx" \
  "000040409538|$FIES/estat_2025np_t3-7_fk4.xlsx" \
  "000040409815|$FIES/estat_2025np_solo_t1_fk4.xlsx" \
  "000040409842|$FIES/estat_2025np_solo_t8_fk4.xlsx" \
  "000040270657|$FIES/estat_longtime_t2-two_fk4.xlsx" \
  "000040270658|$FIES/estat_longtime_t2-kinrou_fk4.xlsx"
do
  id="${pair%%|*}"; out="${pair##*|}"
  curl -sS --max-time 180 -A "$UA" -o "$out" \
    "https://www.e-stat.go.jp/stat-search/file-download?statInfId=${id}&fileKind=4"
done

# -----------------------------------------------------------------------------
# C. CPI (消費者物価指数) — stat.go.jp pages and PDFs
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -A "$UA" -o "$CPI/cpi_index.html"            "https://www.stat.go.jp/data/cpi/index.htm"                    # 200 CPI top
curl -sS --max-time 30 -A "$UA" -o "$CPI/cpi_1.html"                "https://www.stat.go.jp/data/cpi/1.html"                        # 200 結果リスト
curl -sS --max-time 30 -A "$UA" -o "$CPI/cpi_2025_sokyu.html"       "https://www.stat.go.jp/data/cpi/2025/sokyu.html"               # 200 2025年基準改定
curl -sS --max-time 30 -A "$UA" -o "$CPI/cpi_sokuhou_z_index.html"  "https://www.stat.go.jp/data/cpi/sokuhou/tsuki/index-z.html"   # 200 最新月次概要
curl -sS --max-time 30 -A "$UA" -o "$CPI/cpi_nen_index-z.html"      "https://www.stat.go.jp/data/cpi/sokuhou/nen/index-z.html"      # 200 年平均概要
curl -sS --max-time 30 -A "$UA" -o "$CPI/cpi_historic_index_404.html" "https://www.stat.go.jp/data/cpi/historic/index.html"   # 404 probe (long series moved to e-Stat)

# 2026年9月分 全国 (2025年基準; 2026-10-23公表)
curl -sS --max-time 60 -A "$UA" -o "$CPI/cpi_2026-09_zenkoku.pdf" "https://www.stat.go.jp/data/cpi/sokuhou/tsuki/pdf/zenkoku.pdf"
pdftotext -layout "$CPI/cpi_2026-09_zenkoku.pdf" "$CPI/cpi_2026-09_zenkoku.txt"

# 2025年12月分及び2025年平均 全国 (2020年基準; 2026-01-23公表)
curl -sS --max-time 60 -A "$UA" -o "$CPI/cpi_2025-nen-avg_zen-n.pdf" "https://www.stat.go.jp/data/cpi/sokuhou/nen/pdf/zen-n.pdf"
pdftotext -layout "$CPI/cpi_2025-nen-avg_zen-n.pdf" "$CPI/cpi_2025-nen-avg_zen-n.txt"

for f in cpi_index cpi_1 cpi_2025_sokyu cpi_sokuhou_z_index cpi_nen_index-z; do
  iconv -f SHIFT_JIS -t UTF-8 "$CPI/$f.html" > "$CPI/$f.utf8.html" 2>/dev/null || true
done

# CPI 2025年基準 長期時系列データ e-Stat list page (公開日 2026-08-07 evidence)
curl -sS --max-time 30 -A "$UA" -o "$CPI/estat_cpi2025base_lt_list.html" \
  "https://www.e-stat.go.jp/stat-search/files?page=1&toukei=00200573&tstat=000001243876&cycle=0&tclass1=000001243880&tclass2=000001243881&tclass3=000001243883&tclass4=000001243890&layout=datalist"

# -----------------------------------------------------------------------------
# D. CPI 2025年基準 長期時系列データ (e-Stat CSV; 2026-08-07公開)
#    List page:
#      https://www.e-stat.go.jp/stat-search/files?page=1&toukei=00200573&tstat=000001243876&cycle=0&tclass1=000001243880&tclass2=000001243881&tclass3=000001243883&tclass4=000001243890&layout=datalist
#    stat_infid -> file mapping (verified via stat_infid page titles):
#      000040482829 表1 中分類指数（1970年～最新年）        CSV
#      000040482830 表1 持家の帰属家賃を除く総合指数（1947年～） CSV
#      000040482831 表1 品目別価格指数（1970年～最新年）    CSV
#      000040482832 表1 財・サービス分類指数（1970年～最新年） CSV
#      000040482833 表2 中分類指数 前年比（1971年～最新年） CSV
#      000040482835 表2 品目別価格指数 前年比（1971年～最新年） CSV
#    (CSV files need fileKind=1; fileKind=4 returns 404 for CSV entries.)
# -----------------------------------------------------------------------------
for pair in \
  "000040482829|$CPI/estat_2025base_lt_chubun_index.csv" \
  "000040482830|$CPI/estat_2025base_lt_jika_excl_total_index.csv" \
  "000040482831|$CPI/estat_2025base_lt_hinmoku_index.csv" \
  "000040482832|$CPI/estat_2025base_lt_zhi_service_index.csv" \
  "000040482833|$CPI/estat_2025base_lt_chubun_yoy.csv" \
  "000040482835|$CPI/estat_2025base_lt_hinmoku_yoy.csv"
do
  id="${pair%%|*}"; out="${pair##*|}"
  curl -sS --max-time 90 -A "$UA" -o "$out" \
    "https://www.e-stat.go.jp/stat-search/file-download?statInfId=${id}&fileKind=1"
  iconv -f SHIFT_JIS -t UTF-8 "$out" > "${out%.csv}.utf8.csv" 2>/dev/null || true
done

# -----------------------------------------------------------------------------
# E. (Best effort) 家計の住宅・土地に関する調査 probe — 404 on 2026-10-26.
#    The only housing survey online under /data/jyutaku/ is the 令和5年(2023)
#    住宅・土地統計調査 (5-yearly; 2018 -> 2023; archived by Task 4-a under
#    raw/statb-housing/). Probes kept here as evidence (all 4,691-byte 404 pages).
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -A "$UA" -o "$FIES/jyutaku_kei_404.html"  "https://www.stat.go.jp/data/jyutaku/kei/index.htm"    # 404 probe
curl -sS --max-time 30 -A "$UA" -o "$FIES/juutaku_kei_404.html"  "https://www.stat.go.jp/data/juutaku/kei/index.html"  # 404 probe
curl -sS --max-time 30 -A "$UA" -o "$FIES/kakei_jyutaku_404.html" "https://www.stat.go.jp/data/kakei/jyutaku/index.htm" # 404 probe

echo "Done. Verify: sha256sum + stat -c%s under research/chapter03/raw/{statb-fies,statb-cpi}"
