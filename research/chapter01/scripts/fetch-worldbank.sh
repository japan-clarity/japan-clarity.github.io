#!/usr/bin/env bash
# =============================================================================
# fetch-worldbank.sh — World Bank API v2 data collection for Japan Clarity
# Chapter 01 (Population & Family)
#
# Purpose : Reproducibility. These are the EXACT curl commands used on
#           2026-10-22 (access date) to build
#           research/chapter01/raw/worldbank/*.json
# API     : https://api.worldbank.org/v2  (HTTP 200, lastupdated 2026-10-08)
# License : World Bank data is licensed CC BY 4.0
#           https://creativecommons.org/licenses/by/4.0/
#           Source: "World Development Indicators" (source id 2)
# Notes   :
#   - Every response is a JSON array [ meta, data ]; meta.lastupdated = 2026-10-08.
#   - Full country history for one indicator = 66 records (1960-2025);
#     per_page=200 is enough for a single country (1 page).
#   - The 13-country batched call returns total=858 records (13 x 66),
#     which spans 3 pages at per_page=300 -> pages 1, 2 and 3 are ALL
#     fetched (page 1 alone is incomplete: only AUS..GBR).
#   - Taiwan is NOT available in the World Bank country list (not an ISO
#     3166-1 member economy covered by WDI); it is never estimated here.
#   - Use --max-time 30 on every call (workspace rule).
# =============================================================================
set -euo pipefail

OUT="/home/z/my-project/research/chapter01/raw/worldbank"
mkdir -p "$OUT"
BASE="https://api.worldbank.org/v2"
COUNTRIES="JPN;KOR;SGP;AUS;NZL;DEU;FRA;SWE;NLD;CAN;GBR;USA;ITA"

# -----------------------------------------------------------------------------
# 1) Japan (JPN) full history, 11 indicators (per_page=200 -> single page)
# -----------------------------------------------------------------------------
for CODE in \
  SP.POP.TOTL \
  SP.DYN.CBRT.IN \
  SP.DYN.CDRT.IN \
  SP.DYN.TFRT.IN \
  SP.POP.65UP.TO.ZS \
  SP.POP.0014.TO.ZS \
  SP.POP.1564.TO.ZS \
  SP.DYN.LE00.IN \
  SP.DYN.LE00.MA.IN \
  SP.DYN.LE00.FE.IN \
  SP.POP.GROW
do
  curl -sS --max-time 30 \
    "${BASE}/country/JPN/indicator/${CODE}?format=json&per_page=200" \
    -o "${OUT}/JPN-${CODE}.json"
  echo "saved ${OUT}/JPN-${CODE}.json"
done

# -----------------------------------------------------------------------------
# 2) International comparison: 13 economies, 4 indicators.
#    per_page=300 -> 858 total records over 3 pages; fetch ALL pages.
#    Page 1 = COMPARE-<CODE>.json ; pages 2-3 = COMPARE-<CODE>-p2/-p3.json
# -----------------------------------------------------------------------------
for CODE in SP.DYN.TFRT.IN SP.POP.65UP.TO.ZS SP.DYN.LE00.IN SP.POP.TOTL; do
  curl -sS --max-time 30 \
    "${BASE}/country/${COUNTRIES}/indicator/${CODE}?format=json&per_page=300" \
    -o "${OUT}/COMPARE-${CODE}.json"
  echo "saved ${OUT}/COMPARE-${CODE}.json (page 1)"
  for P in 2 3; do
    curl -sS --max-time 30 \
      "${BASE}/country/${COUNTRIES}/indicator/${CODE}?format=json&per_page=300&page=${P}" \
      -o "${OUT}/COMPARE-${CODE}-p${P}.json"
    echo "saved ${OUT}/COMPARE-${CODE}-p${P}.json"
  done
done

# -----------------------------------------------------------------------------
# 3) Indicator metadata (source/organization attribution strings)
# -----------------------------------------------------------------------------
for CODE in SP.DYN.TFRT.IN SP.POP.65UP.TO.ZS SP.DYN.LE00.IN SP.POP.TOTL; do
  curl -sS --max-time 30 \
    "${BASE}/indicator/${CODE}?format=json" \
    -o "${OUT}/META-${CODE}.json"
  echo "saved ${OUT}/META-${CODE}.json"
done

echo "Done. Verify each file with: python3 -c \"import json;d=json.load(open('<file>'));print(d[0])\""
