#!/usr/bin/env bash
# =============================================================================
# fetch-oecd-mlit.sh — OECD SDMX + MLIT data collection for Japan Clarity
# Chapter 03 (Housing & Cost of Living / 住宅・生活費)
#
# Purpose : Reproducibility. These are the EXACT curl commands used on
#           2026-10-26 (access date) to build
#           research/chapter03/raw/oecd/*  and  research/chapter03/raw/mlit/*
# Sources :
#   OECD SDMX API : https://sdmx.oecd.org/public/rest/...  (slow — 180s cap)
#                   Dataflow OECD.ECO.MPD:DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES(1.0)
#                   "Analytical house prices indicators"
#   MLIT / 国土交通省 : www.mlit.go.jp (30s cap, browser UA required)
# License :
#   OECD — OECD Terms and Conditions (per project DATA-LICENSES.md: reuse
#   with attribution; see notes/oecd-mlit-inventory.md §Licensing for the
#   403 access evidence recorded on 2026-10-26).
#   MLIT — 公共データ利用規約 第1.0版 (PDL1.0), attribution "国土交通省" +
#   page URL (quoted verbatim in notes/oecd-mlit-inventory.md §Licensing).
# Notes   :
#   - OECD data key dimension order (DSD_AN_HOUSE_PRICES v1.0):
#       REF_AREA . FREQ . MEASURE . UNIT_MEASURE
#     Measures used: HPI_YDH (Price to income ratio), RHP (Real house price
#     indices). Unit: IX (Index). BASE_PER attribute = 2015 on every row
#     (index, 2015=100 — NOT price levels, NOT any other base year).
#   - The two task-specified MLIT entry URLs
#       https://www.mlit.go.jp/statistics/tocjyutaku.html
#       https://www.mlit.go.jp/jutaku/jutaku2-4.html
#     both return HTTP 404 (site reorganisation); the working entry chain is
#     /statistics/ -> /statistics/details/ -> category pages -> data pages.
#   - 404/403 responses are saved as diagnostic evidence, not deleted.
#   - OECD SDMX calls use --max-time 180; MLIT calls use --max-time 30 with
#     a desktop-Chrome User-Agent (workspace rule).
# =============================================================================
set -euo pipefail

OUT_OECD="/home/z/jc-ch03/research/chapter03/raw/oecd"
OUT_MLIT="/home/z/jc-ch03/research/chapter03/raw/mlit"
mkdir -p "$OUT_OECD" "$OUT_MLIT"

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
SDMX="https://sdmx.oecd.org/public/rest"
DF="OECD.ECO.MPD,DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES,1.0"
# 13 economies (12 requested + ESP, trivially available in the same call)
C13="JPN+KOR+USA+GBR+DEU+FRA+AUS+CAN+NZL+SWE+NLD+ITA+ESP"

# -----------------------------------------------------------------------------
# 0) OECD dataflow discovery (large: ~10.4 MB; filtered locally, not archived)
# -----------------------------------------------------------------------------
curl -sS --max-time 180 "${SDMX}/dataflow/all?references=none" \
  -H "Accept: application/vnd.sdmx.structure+json;version=2.0.0" \
  -o /tmp/oecd-all-dataflows.json
echo "saved /tmp/oecd-all-dataflows.json ($(stat -c%s /tmp/oecd-all-dataflows.json) bytes; rg for 'house' to find DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES)"

# -----------------------------------------------------------------------------
# 1) Dataflow definition with references=all (DSD, codelists, concepts;
#    meta.prepared timestamp = structure vintage evidence)
# -----------------------------------------------------------------------------
curl -sS --max-time 180 \
  "${SDMX}/dataflow/OECD.ECO.MPD/DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES/1.0?references=all" \
  -H "Accept: application/vnd.sdmx.structure+json;version=2.0.0" \
  -o "${OUT_OECD}/oecd-dataflow-def.json"
echo "saved ${OUT_OECD}/oecd-dataflow-def.json"

# -----------------------------------------------------------------------------
# 2) Price-to-income ratio (HPI_YDH), index 2015=100, annual, 13 economies
# -----------------------------------------------------------------------------
curl -sS --max-time 180 \
  "${SDMX}/data/${DF}/${C13}.A.HPI_YDH.IX?format=csvfilewithlabels" \
  -o "${OUT_OECD}/oecd-hpi-ydh-ptoincome-idx2015.csv"
echo "saved ${OUT_OECD}/oecd-hpi-ydh-ptoincome-idx2015.csv"

# -----------------------------------------------------------------------------
# 3) Real house price index (RHP), index 2015=100, annual, 13 economies
# -----------------------------------------------------------------------------
curl -sS --max-time 180 \
  "${SDMX}/data/${DF}/${C13}.A.RHP.IX?format=csvfilewithlabels" \
  -o "${OUT_OECD}/oecd-rhp-realhouseprice-idx2015.csv"
echo "saved ${OUT_OECD}/oecd-rhp-realhouseprice-idx2015.csv"

# -----------------------------------------------------------------------------
# 4) Diagnostic probes (dimension-value evidence, kept as raw files)
#    a) JPN annual, ALL measures + all units — documents the IX vs
#       PT_AVG_L_TERM ("Percentage of long term average") distinction
#    b) JPN annual HPI_YDH, any unit — confirms IX is the only unit
#    c) JPN quarterly HPI_YDH — documents that quarterly data exists
#       (FREQ=Q) so annual/quarterly are never mixed in deliverables
# -----------------------------------------------------------------------------
curl -sS --max-time 180 \
  "${SDMX}/data/${DF}/JPN.A..?format=csvfilewithlabels" \
  -o "${OUT_OECD}/oecd-jpn-all-measures-annual.csv"
echo "saved ${OUT_OECD}/oecd-jpn-all-measures-annual.csv"
curl -sS --max-time 180 \
  "${SDMX}/data/${DF}/JPN.A.HPI_YDH.?format=csvfilewithlabels" \
  -o "${OUT_OECD}/oecd-jpn-hpiydh-probe.csv"
echo "saved ${OUT_OECD}/oecd-jpn-hpiydh-probe.csv"
curl -sS --max-time 180 \
  "${SDMX}/data/${DF}/JPN.Q.HPI_YDH.IX?format=csvfilewithlabels" \
  -o "${OUT_OECD}/oecd-jpn-hpiydh-quarterly-probe.csv"
echo "saved ${OUT_OECD}/oecd-jpn-hpiydh-quarterly-probe.csv"

# -----------------------------------------------------------------------------
# 5) OECD reuse-terms page (from a datacenter IP this returns HTTP 403
#    Cloudflare challenge — saved as honest evidence of what was accessible)
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -L \
  "https://www.oecd.org/en/about/legal/oecd-data-reuse-terms.html" \
  -H "User-Agent: ${UA}" \
  -o "${OUT_OECD}/oecd-data-reuse-terms.html" || true
echo "saved ${OUT_OECD}/oecd-data-reuse-terms.html (HTTP 403 Cloudflare from sandbox on 2026-10-26)"

# =============================================================================
# MLIT / 国土交通省 (browser UA on every call)
# =============================================================================

# -----------------------------------------------------------------------------
# 6) Dead entry points from the task spec (404 diagnostics, kept as evidence)
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -L "https://www.mlit.go.jp/statistics/tocjyutaku.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-tocjyutaku.html" || true
echo "saved ${OUT_MLIT}/mlit-tocjyutaku.html (HTTP 404)"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/jutaku/jutaku2-4.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-jutaku2-4-404.html" || true
echo "saved ${OUT_MLIT}/mlit-jutaku2-4-404.html (HTTP 404)"

# -----------------------------------------------------------------------------
# 7) Working entry chain: statistics portal -> 統計情報 -> category pages
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -L "https://www.mlit.go.jp/statistics/" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-statistics-root.html"
echo "saved ${OUT_MLIT}/mlit-statistics-root.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/statistics/details/index.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-statistics-details-index.html"
echo "saved ${OUT_MLIT}/mlit-statistics-details-index.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/statistics/details/t-other-2_tk_000346.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-statistics-housing-category.html"
echo "saved ${OUT_MLIT}/mlit-statistics-housing-category.html"

# -----------------------------------------------------------------------------
# 8) 建築動態統計調査 (旧 建築着工統計調査) main page + 令和7年計 press release
#    (CY2025 annual housing starts, published 2026-01-30)
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -L "https://www.mlit.go.jp/statistics/details/t-other-2_tk_000214.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-kenchaku-chuko-main.html"
echo "saved ${OUT_MLIT}/mlit-kenchaku-chuko-main.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/report/press/joho04_hh_001350.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-press-nenkei.html"
echo "saved ${OUT_MLIT}/mlit-press-nenkei.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/report/press/content/kencha25.pdf" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-press-kencha25-2025annual.pdf"
echo "saved ${OUT_MLIT}/mlit-press-kencha25-2025annual.pdf"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/report/press/content/publication25.xls" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-press-publication25-2025annual.xls"
echo "saved ${OUT_MLIT}/mlit-press-publication25-2025annual.xls"

# -----------------------------------------------------------------------------
# 9) MLIT 時系列表 (long-history time series, 令和7年分, updated 2026-01-30)
#    annual-byusage = 利用関係別 annual 戸数 1948-2025 (the long history)
#    monthly        = monthly housing/building starts (年代計 from 平成6年度)
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -L "https://www.mlit.go.jp/sogoseisaku/jouhouka/sosei_jouhouka_tk4_000002.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-timeseries-page.html"
echo "saved ${OUT_MLIT}/mlit-timeseries-page.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/sogoseisaku/jouhouka/content/001979030.xls" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-timeseries-annual-byusage.xls"
echo "saved ${OUT_MLIT}/mlit-timeseries-annual-byusage.xls"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/sogoseisaku/jouhouka/content/jyuu_ken.xls" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-timeseries-monthly-housing-bldg.xls"
echo "saved ${OUT_MLIT}/mlit-timeseries-monthly-housing-bldg.xls"

# -----------------------------------------------------------------------------
# 10) 地価公示 2026 (令和8年地価公示, prices as of 2026-01-01, published
#     March 2026): category page, main page, 概要, and the
#     変動率及び平均価格の時系列推移表 Excel (avg price by area/use, 1975-2026)
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -L "https://www.mlit.go.jp/statistics/details/t-other-2_tk_000345.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-statistics-land-category.html"
echo "saved ${OUT_MLIT}/mlit-statistics-land-category.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/totikensangyo/totikensangyo_fr4_000043.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-chika-koji-page.html"
echo "saved ${OUT_MLIT}/mlit-chika-koji-page.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/tochi_fudousan_kensetsugyo_fr4_000001_00324.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-kojichika2026-gaiyo.html"
echo "saved ${OUT_MLIT}/mlit-kojichika2026-gaiyo.html"
curl -sS --max-time 30 -L "https://www.mlit.go.jp/totikensangyo/content/001989457.xls" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls"
echo "saved ${OUT_MLIT}/mlit-kojichika2026-henkadoritsu-heikinkakaku-timeseries.xls"

# -----------------------------------------------------------------------------
# 11) MLIT link/copyright terms page (PDL1.0 reuse terms, quoted in notes)
# -----------------------------------------------------------------------------
curl -sS --max-time 30 -L "https://www.mlit.go.jp/link.html" \
  -H "User-Agent: ${UA}" -o "${OUT_MLIT}/mlit-link-copyright.html"
echo "saved ${OUT_MLIT}/mlit-link-copyright.html"

echo "Done. Checksums: cd research/chapter03/raw && sha256sum oecd/* mlit/*"
