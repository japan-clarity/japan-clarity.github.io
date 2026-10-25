#!/usr/bin/env bash
# =============================================================================
# fetch-worldbank.sh — World Bank API v2 data collection for Japan Clarity
# Chapter 02 (Economy & Industry)
#
# Purpose : Reproducibility. These are the EXACT curl commands used on
#           2026-10-25 (access date) to build
#           research/chapter02/raw/worldbank/*.json
# API     : https://api.worldbank.org/v2  (HTTP 200, lastupdated — see
#           notes/oecd-worldbank-inventory.md for the recorded vintage)
# License : World Bank data is licensed CC BY 4.0
#           https://creativecommons.org/licenses/by/4.0/
#           Source: "World Development Indicators" (source id 2)
# Notes   :
#   - Every response is a JSON array [ meta, data ]; meta.lastupdated = WDI
#     vintage date (provenance).
#   - Full country history for one indicator = 66 records (1960-2025);
#     per_page=200 is enough for a single country (1 page).
#   - The 13-country batched call returns total=858 records (13 x 66),
#     which spans 3 pages at per_page=300 -> pages 1, 2 and 3 are ALL
#     fetched (page 1 alone is incomplete: only AUS..GBR). The page count
#     is read from meta.pages of page 1 (ch01 hard-coded 2..3; here the
#     loop is meta-driven but the -pN suffix naming is identical).
#   - Taiwan is NOT available in the World Bank country list (not an ISO
#     3166-1 member economy covered by WDI); it is never estimated here.
#   - Use --max-time 30 on every call (workspace rule).
# =============================================================================
set -euo pipefail

OUT="/home/z/jc-ch02/research/chapter02/raw/worldbank"
mkdir -p "$OUT"
BASE="https://api.worldbank.org/v2"
COUNTRIES="JPN;KOR;SGP;AUS;NZL;DEU;FRA;SWE;NLD;CAN;GBR;USA;ITA"

# -----------------------------------------------------------------------------
# 1) Japan (JPN) full history, 8 indicators (per_page=200 -> single page)
#    GDP level, GDP growth, GDP per capita PPP (current + constant),
#    manufacturing share, capital formation, exports, imports
# -----------------------------------------------------------------------------
for CODE in \
  NY.GDP.MKTP.CD \
  NY.GDP.MKTP.KD.ZG \
  NY.GDP.PCAP.PP.CD \
  NY.GDP.PCAP.PP.KD \
  NV.IND.MANF.ZS \
  NE.GDI.TOTL.ZS \
  NE.EXP.GNFS.ZS \
  NE.IMP.GNFS.ZS
do
  curl -sS --max-time 30 \
    "${BASE}/country/JPN/indicator/${CODE}?format=json&per_page=200" \
    -o "${OUT}/JPN-${CODE}.json"
  echo "saved ${OUT}/JPN-${CODE}.json"
done

# -----------------------------------------------------------------------------
# 2) International comparison: 13 economies, 3 indicators.
#    per_page=300 -> 858 total records over 3 pages; fetch ALL pages.
#    Page 1 = COMPARE-<CODE>.json ; pages 2+ = COMPARE-<CODE>-p2/-p3.json
# -----------------------------------------------------------------------------
for CODE in NY.GDP.MKTP.KD.ZG NY.GDP.PCAP.PP.CD NV.IND.MANF.ZS; do
  curl -sS --max-time 30 \
    "${BASE}/country/${COUNTRIES}/indicator/${CODE}?format=json&per_page=300" \
    -o "${OUT}/COMPARE-${CODE}.json"
  echo "saved ${OUT}/COMPARE-${CODE}.json (page 1)"
  PAGES=$(python3 -c "import json;d=json.load(open('${OUT}/COMPARE-${CODE}.json'));print(d[0]['pages'])")
  echo "  meta.pages = ${PAGES} (total records: $(python3 -c "import json;d=json.load(open('${OUT}/COMPARE-${CODE}.json'));print(d[0]['total'])"))"
  P=2
  while [ "$P" -le "$PAGES" ]; do
    curl -sS --max-time 30 \
      "${BASE}/country/${COUNTRIES}/indicator/${CODE}?format=json&per_page=300&page=${P}" \
      -o "${OUT}/COMPARE-${CODE}-p${P}.json"
    echo "saved ${OUT}/COMPARE-${CODE}-p${P}.json (page ${P}/${PAGES})"
    P=$((P + 1))
  done
done

# -----------------------------------------------------------------------------
# 3) Indicator metadata (source/organization attribution strings)
# -----------------------------------------------------------------------------
for CODE in NY.GDP.MKTP.KD.ZG NY.GDP.PCAP.PP.CD NV.IND.MANF.ZS; do
  curl -sS --max-time 30 \
    "${BASE}/indicator/${CODE}?format=json" \
    -o "${OUT}/META-${CODE}.json"
  echo "saved ${OUT}/META-${CODE}.json"
done

echo "Done. Verify each file with: python3 -c \"import json;d=json.load(open('<file>'));print(d[0])\""
