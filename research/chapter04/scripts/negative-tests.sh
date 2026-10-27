#!/usr/bin/env bash
# Chapter 04 negative regression tests (audit SOP step: prove the guards FAIL on
# deliberately corrupted fixtures, then prove pristine state is all-green).
# Each fixture instantiates one historical defect class:
#   N1 Ch01-class cross-table contamination (wrong cell value in LFS series)
#   N2 Ch02-class unit conflation (monthly value placed into annual series)
#   N3 Ch03-class narrative-peak fabrication (record-high claim contradicting data)
#   N4 Ch03-class wrong trough value (accident injury minimum)
#   N5 fabricated prose statistic (mental-comp claims) — PROBE for guard gaps
#   N6 reference-period erasure (survey-year → calendar-year conflation)
set -u
cd /home/z/jc-ch04

D=src/chapters/chapter-04/data.ts
A=src/chapters/chapter-04/content-a.ts
B=src/chapters/chapter-04/content-b.ts

cp "$D" /tmp/data.pristine.ts
cp "$A" /tmp/content-a.pristine.ts
cp "$B" /tmp/content-b.pristine.ts

run_guard () {
  local label="$1"
  local out
  out=$(bun run validate:research 2>&1)
  local code=$?
  local tail_line
  tail_line=$(echo "$out" | grep -E "^[0-9]+ checks, [0-9]+ failures" | tail -1)
  local nfail
  nfail=$(echo "$out" | grep -c "^\[FAIL")
  echo "RESULT $label | exit=$code | ${tail_line:-no-summary} | FAIL-lines=${nfail}"
  echo "$out" | grep "^\[FAIL" | sed 's/^/    /' | head -8
  cp /tmp/data.pristine.ts "$D"
  cp /tmp/content-a.pristine.ts "$A"
  cp /tmp/content-b.pristine.ts "$B"
}

echo "=== N1: wrong cell value — UNEMPLOYMENT_RATE 2002: 5.4 -> 5.2 (Ch01 contamination class) ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/data.ts"
s = open(p).read()
assert s.count("[2002, 5.4],") == 1
open(p, "w").write(s.replace("[2002, 5.4],", "[2002, 5.2],"))
EOF
run_guard "N1"

echo "=== N2: unit conflation — OECD_HOURS_JPN 2025: 1597.507 (h/YEAR) -> 135.1 (h/MONTH) (Ch02 class) ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/data.ts"
s = open(p).read()
assert s.count("[2025, 1597.507],") == 1
open(p, "w").write(s.replace("[2025, 1597.507],", "[2025, 135.1],"))
EOF
run_guard "N2"

echo "=== N3: narrative fabrication — non-regular record-high claim contradicting data (Ch03 class) ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/content-a.ts"
s = open(p).read()
old = "2019年の38.3%で頂点に達した後、緩やかに低下して2025年は36.5%です。"
new = "2019年の38.3%以降も増加は止まらず、2025年は36.5%と非正規の割合が過去最高です。"
assert s.count(old) == 1
open(p, "w").write(s.replace(old, new))
EOF
run_guard "N3"

echo "=== N4: wrong trough — ACCIDENT_INJURY 2009: 105718 -> 115718 (Ch03 min/max class) ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/data.ts"
s = open(p).read()
assert s.count("[2009, 105718],") == 1
open(p, "w").write(s.replace("[2009, 105718],", "[2009, 115718],"))
EOF
run_guard "N4"

echo "=== N5: fabricated prose statistic — mental claims 4,958->6,958, 2.7x->3.8x (JA+EN) — gap probe ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/content-b.ts"
s = open(p).read()
a = "2025年度の4,958件へ約2.7倍になりました"
b = "2025年度の6,958件へ約3.8倍になりました"
c = "from 1,820 (FY2018) to 4,958 (FY2025)"
d = "from 1,820 (FY2018) to 6,958 (FY2025)"
e = "rose about 2.7×"
f = "rose about 3.8×"
assert s.count(a) == 1 and s.count(c) == 1 and s.count(e) == 1
s = s.replace(a, b).replace(c, d).replace(e, f)
open(p, "w").write(s)
EOF
run_guard "N5"

echo "=== N6: calendar-2025 attribution — 2025年調査（2024年暦年）-> 2025年には (survey-year conflation) ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/content-a.ts"
s = open(p).read()
old = "2025年調査（2024年暦年）では66.9%"
new = "2025年には66.9%"
assert s.count(old) == 1
open(p, "w").write(s.replace(old, new))
EOF
run_guard "N6"

echo "=== N7: D1 regression — 1973 reverted to excl-Okinawa row (1.3 -> 1.2) ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/data.ts"
s = open(p).read()
assert s.count("[1973, 1.3],") == 1
open(p, "w").write(s.replace("[1973, 1.3],", "[1973, 1.2],"))
EOF
run_guard "N7"

echo "=== N8: D2 regression — 契約社員・嘱託 355万 claim re-introduced ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/content-a.ts"
s = open(p).read()
old = "契約社員は2002年の230万人から2025年の273万人へと、パートほどではないものの増加しています。"
new = "契約社員・嘱託の合計は2002年の355万人から2025年の378万人へと、パートほどではないものの増加しています。"
assert s.count(old) == 1
open(p, "w").write(s.replace(old, new))
EOF
run_guard "N8"

echo "=== N9: D3 regression — 65+ trough re-anchored to 約20% around 2000 ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/content-a.ts"
s = open(p).read()
old = "65歳以上の就業率は1968年の33.3%から低下を続け、2011年に19.2%で底を打った後、反転して2025年には26.0%になっています。"
new = "65歳以上の就業率は1968年の33.3%から2000年頃の約20%まで下がりましたが、その後反転して2025年には26.0%になっています。"
assert s.count(old) == 1
open(p, "w").write(s.replace(old, new))
EOF
run_guard "N9"

echo "=== N10: D4 regression — unverifiable student-excluded 24.3% claim re-introduced ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/content-a.ts"
s = open(p).read()
old = "これは在学中のパート・アルバイトを多く含むためです。"
new = "これは在学中のパート・アルバイトを多く含むためです（同範囲の在学中を除くと24.3%）。"
assert s.count(old) == 1
open(p, "w").write(s.replace(old, new))
EOF
run_guard "N10"

echo "=== N11: D5 regression — EN 1.9% anchored to 1973 again ==="
python3 - <<'EOF'
p = "src/chapters/chapter-04/content-a.ts"
s = open(p).read()
old = "it rose temporarily to 1.9% in 1975, after the first oil shock, then subsided."
new = "it spiked to 1.9% after the 1973 oil shock and subsided."
assert s.count(old) == 1
open(p, "w").write(s.replace(old, new))
EOF
run_guard "N11"

echo "=== Final: pristine re-run (must be all-green) ==="
run_guard "PRISTINE"

echo "=== diff check: working tree must be byte-identical to pre-test state ==="
diff -q /tmp/data.pristine.ts "$D" && diff -q /tmp/content-a.pristine.ts "$A" && diff -q /tmp/content-b.pristine.ts "$B" && echo "RESTORE-VERIFIED"
