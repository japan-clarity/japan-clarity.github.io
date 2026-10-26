#!/usr/bin/env bash
# =============================================================================
# fetch-statb-housing.sh — Statistics Bureau of Japan / e-Stat data collection
# for Japan Clarity Chapter 03 (Housing & Cost of Living)
#
# Purpose : Reproducibility. These are the EXACT curl commands used on
#           2026-10-26 (access date) to build
#           research/chapter03/raw/statb-housing/*
# Sources :
#   - Statistics Bureau of Japan (総務省統計局) 住宅・土地統計調査 portal
#     https://www.stat.go.jp/data/jyutaku/index.html
#     (2023 round: /data/jyutaku/2023/tyousake.html ; 2018 round:
#      /data/jyutaku/2018/tyousake.html ; 2013 round:
#      /data/jyutaku/2013/tyousake.html ; round index: /data/jyutaku/kekka.html)
#   - e-Stat 政府統計の総合窓口 file listings and file downloads
#     2023 round tstat=000001207800 / 2018 round tstat=000001127155
#     (政府統計名 住宅・土地統計調査, 統計コード 00200522; each round has its
#      own 調査コード, e.g. 令和5年=00200522 as recorded in the 公表予定 XML)
# License : Statistics Bureau / e-Stat statistics are Japanese government
#           works; reproduction with attribution is permitted under the
#           e-Stat terms of use
#           (https://www.e-stat.go.jp/info/tetsuduki). The survey results page
#           itself requests the citation form
#           「○○年住宅・土地統計調査結果」（総務省統計局）
#           (research/chapter03/raw/statb-housing/jyutaku2023_tyousake.utf8.html,
#           link "/data/jyutaku/2023/riyou2.html").
# Notes   :
#   - stat.go.jp HTML/XML pages are Shift_JIS (XML is UTF-16LE); decoded
#     copies are saved alongside with ".utf8." in the filename. No stat.go.jp
#     CSV needed to be fetched: the long-run time series and statistical
#     tables are published as e-Stat EXCEL (.xlsx) files, and the overview
#     headline figures as PDF. PDFs were decoded with `pdftotext -layout`
#     into .txt extractions (kept next to the PDFs).
#   - e-Stat "files" listing pages are JavaScript-driven; the server-rendered
#     category expansion is obtained by fetching
#     /stat-search/files?tstat=<ID>&toukei=00200522&cycle=0&tclass1=<catID>
#     &layout=datalist&page=1&tclass2val=0 which embeds the per-table
#     file-download links (/stat-search/file-download?statInfId=<ID>&fileKind=N).
#     2018-round files use fileKind=0, 2023-round files use fileKind=4 —
#     both facts verified live (fileKind=1..3 → HTTP 404 on the 2018 table).
#   - The XHR endpoint /retrieve/api_file was used only to confirm the
#     accordion structure (kept as *.json probes).
#   - Every call uses --max-time 30 (60 for PDFs/XLSX; workspace rule) and a
#     browser User-Agent.
#   - 404s recorded honestly: the /data/jyutaku/<year>/nn/index.htm pattern
#     returns 404 for 2023/2018/2013 (stat.go.jp error pages kept as
#     jyutaku20XX_nn_index.html); no English outline exists for the 2018 or
#     2023 rounds (probed /english/data/jyutaku/3001.html and /5001.html →
#     404, bodies archived as jyutaku_en_3001_404.html / jyutaku_en_5001_404.html).
#     Newest English outline is the 2013 round (2501.html).
#   - Survey identifiers verified live:
#     2018 round  tstat=000001127155 (69+55+318+192+34+2+6 files)
#     2023 round  tstat=000001207800
#     時系列統計表 category: tclass1=000001140366 (2018) / 000001207807 (2023)
#     主要統計表 category:   tclass1=000001207804 (2023)
#   - Publication schedule (from /data/kouhyou/e-stat_jyutaku2023.xml):
#     住宅数概数集計 2024-04-30 14:00 / 基本集計 2024-09-25 14:00 /
#     構造等集計 2025-01-29 14:00 / 土地集計 2025-03-26 14:00.
# =============================================================================
set -euo pipefail

OUT="/home/z/jc-ch03/research/chapter03/raw/statb-housing"
mkdir -p "$OUT"
cd "$OUT"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

# -----------------------------------------------------------------------------
# 1) stat.go.jp survey portal + round pages (Shift_JIS HTML; decode to UTF-8)
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -A "$UA" -o jyutaku_portal.html \
  "https://www.stat.go.jp/data/jyutaku/index.html"
curl -sS --max-time 30 -A "$UA" -o jyutaku_portal_en.html \
  "https://www.stat.go.jp/english/data/jyutaku/index.html"
iconv -f CP932 -t UTF-8 jyutaku_portal.html    > jyutaku_portal.utf8.html
cp jyutaku_portal_en.html jyutaku_portal_en.utf8.html   # EN pages are ASCII

# Round "調査の結果" pages (the /nn/index.htm pattern 404s; these are live):
for y in 2023 2018 2013; do
  curl -sS --max-time 30 -A "$UA" -o "jyutaku${y}_tyousake.html" \
    "https://www.stat.go.jp/data/jyutaku/${y}/tyousake.html"
  iconv -f CP932 -t UTF-8 "jyutaku${y}_tyousake.html" > "jyutaku${y}_tyousake.utf8.html"
  # documented 404 (kept as evidence):
  curl -sS --max-time 30 -A "$UA" -o "jyutaku${y}_nn_index.html" \
    "https://www.stat.go.jp/data/jyutaku/${y}/nn/index.htm"
done

curl -sS --max-time 30 -A "$UA" -o jyutaku2023_tyougai.html \
  "https://www.stat.go.jp/data/jyutaku/2023/tyougai.html"      # 調査の概要
curl -sS --max-time 30 -A "$UA" -o jyutaku2023_gaisuu.html \
  "https://www.stat.go.jp/data/jyutaku/2023/gaisuu.html"       # 住宅数概数集計（速報）
curl -sS --max-time 30 -A "$UA" -o jyutaku2013_kekka.html \
  "https://www.stat.go.jp/data/jyutaku/kekka.html"             # round index → e-Stat
curl -sS --max-time 30 -A "$UA" -o jyutaku2013_gaiyou.html \
  "https://www.stat.go.jp/data/jyutaku/2013/gaiyou.html"       # 2013 overview landing
curl -sS --max-time 30 -A "$UA" -o jyutaku2013_10_3.html \
  "https://www.stat.go.jp/data/jyutaku/2013/10_3.html"         # 2013 確報概要 landing
for f in jyutaku2023_tyougai jyutaku2023_gaisuu jyutaku2013_kekka \
         jyutaku2013_gaiyou jyutaku2013_10_3; do
  iconv -f CP932 -t UTF-8 "${f}.html" > "${f}.utf8.html"
done

# English pages (outline series; no EN outline exists for 2018/2023 rounds —
# /english/data/jyutaku/3001.html and /5001.html probed → 404, bodies archived):
for p in results 2501 2502 1501 2001 1520100; do
  curl -sS --max-time 30 -A "$UA" -o "jyutaku_en_${p}.html" \
    "https://www.stat.go.jp/english/data/jyutaku/${p}.html"
done
# documented 404s (kept as evidence; same generic stat.go.jp error page):
curl -sS --max-time 30 -A "$UA" -o jyutaku_en_3001_404.html \
  "https://www.stat.go.jp/english/data/jyutaku/3001.html"   # 2018 EN outline: absent
curl -sS --max-time 30 -A "$UA" -o jyutaku_en_5001_404.html \
  "https://www.stat.go.jp/english/data/jyutaku/5001.html"   # 2023 EN outline: absent

# -----------------------------------------------------------------------------
# 2) Publication-schedule XML (UTF-16LE) — release dates for the 2023/2018 rounds
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -A "$UA" -o kouhyou_jyutaku2023.xml \
  "https://www.stat.go.jp/data/kouhyou/e-stat_jyutaku2023.xml"
curl -sS --max-time 30 -A "$UA" -o kouhyou_jyutaku2018.xml \
  "https://www.stat.go.jp/data/kouhyou/e-stat_jyutaku2018.xml"
iconv -f UTF-16LE -t UTF-8 kouhyou_jyutaku2023.xml > kouhyou_jyutaku2023.utf8.xml
iconv -f UTF-16LE -t UTF-8 kouhyou_jyutaku2018.xml > kouhyou_jyutaku2018.utf8.xml

# -----------------------------------------------------------------------------
# 3) 結果の概要 PDFs (headline figures; decode with pdftotext -layout)
# -----------------------------------------------------------------------------
curl -sS --max-time 60 -A "$UA" -o jyutaku2023_kihon_gaiyou.pdf \
  "https://www.stat.go.jp/data/jyutaku/2023/pdf/kihon_gaiyou.pdf"   # 基本集計 確報
curl -sS --max-time 60 -A "$UA" -o jyutaku2023_kouzou_gaiyou.pdf \
  "https://www.stat.go.jp/data/jyutaku/2023/pdf/kouzou_gaiyou.pdf"  # 構造等集計 確報
curl -sS --max-time 60 -A "$UA" -o jyutaku2023_tochi_gaiyou.pdf \
  "https://www.stat.go.jp/data/jyutaku/2023/pdf/tochi_gaiyou.pdf"   # 土地集計 確報
curl -sS --max-time 60 -A "$UA" -o jyutaku2023_yougo.pdf \
  "https://www.stat.go.jp/data/jyutaku/2023/pdf/yougo.pdf"          # 用語の解説 (持ち家 definition)
curl -sS --max-time 60 -A "$UA" -o jyutaku2023_gaisuu_gaiyou.pdf \
  "https://www.stat.go.jp/data/jyutaku/2023/pdf/g_kekka.pdf"        # 住宅数概数集計 速報
curl -sS --max-time 60 -A "$UA" -o jyutaku2018_kihon_gaiyou.pdf \
  "https://www.stat.go.jp/data/jyutaku/2018/pdf/kihon_gaiyou.pdf"   # 2018 基本集計 確報
curl -sS --max-time 120 -A "$UA" -o jyutaku2013_gaiyou_all.pdf \
  "https://www.stat.go.jp/data/jyutaku/2013/pdf/kgiy00.pdf"         # 2013 確報 概要 (全章)
for f in jyutaku2023_kihon_gaiyou jyutaku2023_kouzou_gaiyou \
         jyutaku2023_gaisuu_gaiyou jyutaku2018_kihon_gaiyou \
         jyutaku2013_gaiyou_all; do
  pdftotext -layout "${f}.pdf" "${f}.txt"
done

# 2023 aggregation-item catalog (集計事項一覧, table index; NOT data):
curl -sS --max-time 60 -A "$UA" -o jyutaku2023_jikou_zenkoku.xlsx \
  "https://www.stat.go.jp/data/jyutaku/2023/zuhyou/jikou_zenkoku.xlsx"

# -----------------------------------------------------------------------------
# 4) e-Stat file listings (server-rendered category expansions)
# -----------------------------------------------------------------------------
curl -sS --max-time 60 -A "$UA" -o estat_2018_files.html \
  "https://www.e-stat.go.jp/stat-search/files?tstat=000001127155"
curl -sS --max-time 60 -A "$UA" -o estat_2023_files.html \
  "https://www.e-stat.go.jp/stat-search/files?tstat=000001207800"
# 時系列統計表 category (55 tables each round):
curl -sS --max-time 60 -A "$UA" -o estat_2018_timeseries_page.html \
  "https://www.e-stat.go.jp/stat-search/files?tstat=000001127155&toukei=00200522&cycle=0&tclass1=000001140366&layout=datalist&page=1&tclass2val=0"
curl -sS --max-time 60 -A "$UA" -o estat_2023_timeseries_page.html \
  "https://www.e-stat.go.jp/stat-search/files?tstat=000001207800&toukei=00200522&cycle=0&tclass1=000001207807&layout=datalist&page=1&tclass2val=0"
# 2023 主要統計表 category (contains 建築の時期別住宅数):
curl -sS --max-time 60 -A "$UA" -o estat_2023_shuyo_page.html \
  "https://www.e-stat.go.jp/stat-search/files?tstat=000001207800&toukei=00200522&cycle=0&tclass1=000001207804&layout=datalist&page=1&tclass2val=0"
# Discovery probes (XHR endpoints; kept for provenance):
curl -sS --max-time 30 -A "$UA" -H "X-Requested-With: XMLHttpRequest" \
  -H "Accept: application/json" -o estat_2018_apifile.json \
  "https://www.e-stat.go.jp/retrieve/api_file?tstat=000001127155&layout=datalist&page=1"
curl -sS --max-time 30 -A "$UA" -H "X-Requested-With: XMLHttpRequest" \
  -H "Accept: application/json" -o estat_2018_tclass_expand.json \
  "https://www.e-stat.go.jp/retrieve/api_file?tstat=000001127155&tclass=000001140366&layout=datalist&page=1&result_page=50"
curl -sS --max-time 30 -A "$UA" -H "X-Requested-With: XMLHttpRequest" \
  -H "Accept: application/json" -o estat_2018_timeseries.json \
  "https://www.e-stat.go.jp/retrieve/api_file?tstat=000001127155&tclass1=000001140366&layout=datalist&page=1&result_page=50"
curl -sS --max-time 30 -A "$UA" -H "X-Requested-With: XMLHttpRequest" \
  -H "Accept: application/json" -o estat_2018_tclass.json \
  "https://www.e-stat.go.jp/retrieve/api_file_tclass?tstat=000001127155&tclass1=000001140366&layout=datalist&page=1&result_page=50"
curl -sS --max-time 30 -A "$UA" -o estat_file.js \
  "https://www.e-stat.go.jp/modules/custom/retrieve/src/js/file.js"

# -----------------------------------------------------------------------------
# 5) e-Stat 時系列統計表 EXCEL downloads (long-run series through 2018/2023)
#    2018 round: fileKind=0 ; 2023 round: fileKind=4
# -----------------------------------------------------------------------------
# 2018 round (平成30年, series through 2018; released 2020-06-30):
curl -sS --max-time 60 -A "$UA" -o estat_2018_timeseries_table1-1.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000031959512&fileKind=0"  # 居住世帯の有無別住宅数 1948-2018
curl -sS --max-time 60 -A "$UA" -o estat_2018_timeseries_table4.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000031959517&fileKind=0"  # 空き家の種類・建て方別 1958-2018
curl -sS --max-time 60 -A "$UA" -o estat_2018_timeseries_table9-1.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000031959523&fileKind=0"  # 住宅の所有の関係別 1963-2018
curl -sS --max-time 60 -A "$UA" -o estat_2018_timeseries_table13.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000031959529&fileKind=0"  # 建て方別住宅の規模 1993-2018
curl -sS --max-time 60 -A "$UA" -o estat_2018_timeseries_table14-1.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000031959630&fileKind=0"  # 所有の関係別住宅の規模 1968-2018

# 2023 round (令和5年, series through 2023; released 2025-09-30):
curl -sS --max-time 60 -A "$UA" -o estat_2023_timeseries_table1-1.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354027&fileKind=4"  # 居住世帯の有無別住宅数 1948-2023
curl -sS --max-time 60 -A "$UA" -o estat_2023_timeseries_table4.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354032&fileKind=4"  # 空き家の種類・建て方別 1958-2023
curl -sS --max-time 60 -A "$UA" -o estat_2023_timeseries_table9-1.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354038&fileKind=4"  # 住宅の所有の関係別 1963-2023
curl -sS --max-time 60 -A "$UA" -o estat_2023_timeseries_table13.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354044&fileKind=4"  # 建て方別住宅の規模 1993-2023
curl -sS --max-time 60 -A "$UA" -o estat_2023_timeseries_table14-1.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354045&fileKind=4"  # 所有の関係別住宅の規模 1968-2023
curl -sS --max-time 60 -A "$UA" -o estat_2023_timeseries_table2-1.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040354029&fileKind=4"  # 世帯の種類別世帯数・世帯人員 1948-2023

# 2023 主要統計表 第4表: 住宅の建築の時期(14区分)別住宅数 (Series 7):
curl -sS --max-time 60 -A "$UA" -o estat_2023_shuyo_b4-4_chikunensu.xlsx \
  "https://www.e-stat.go.jp/stat-search/file-download?statInfId=000040353905&fileKind=4"

# -----------------------------------------------------------------------------
# 6) Integrity manifest (bytes + sha256 for every raw file)
# -----------------------------------------------------------------------------
{ echo -e "file\tbytes\tsha256"; \
  for f in $(ls | rg -v '^MANIFEST'); do \
    echo -e "$f\t$(stat -c%s "$f")\t$(sha256sum "$f" | cut -d' ' -f1)"; \
  done; } > MANIFEST.tsv
echo "done: $(ls | wc -l) files in $OUT"
