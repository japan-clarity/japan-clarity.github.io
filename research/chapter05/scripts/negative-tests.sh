#!/usr/bin/env bash
# Chapter 05 negative regression tests (audit SOP step: prove the guards FAIL on
# deliberately corrupted fixtures, then prove pristine state is all-green).
# Each fixture instantiates one historical defect class:
#   N1  Ch01-class cross-table contamination (wrong cell value in PISA series)
#   N2  Ch02-class unit conflation (per-student USD vs thousand-USD prose)
#   N3  Ch03-class narrative-peak fabrication (old nonattendance peak year/value)
#   N3b content-b prose peak also corrupted (same class, second location)
#   N4  Ch04-class category/basis error (nationality vs JASSO residence basis)
#   N5  fabricated PIAAC Round-2 statistic (unverifiable claim) — probe for gaps
#   N6  bilingual year-value mismatch (EN anchors a wrong year)
#   N7  wrong record-year (いじめ total year attribution)
#   N8  significance erasure (reading drop claimed as not significant)
#   N9  series-basis erasure (不登校 old/new junction undisclosed)
#   N10 score-to-percentage conflation (PISA value labeled as %)
#   N11 school-level contamination (elementary bullying value into 中学校 row)
#   N12 OECD-average recompute claim (average of shown countries)
#
# A test PASSES only when (a) the fixture actually applied (python anchor assert
# held — an INJECT-ERROR is a script defect, not a pass) and (b) the validate
# gate failed with >=1 [FAIL] line. The suite exits non-zero if any fixture
# escapes the guards, if any injection fails to apply, or if the pristine
# restore is not byte-identical.
set -u
cd /home/z/jc-ch05

D=src/chapters/chapter-05/data.ts
A=src/chapters/chapter-05/content-a.ts
B=src/chapters/chapter-05/content-b.ts
C=src/chapters/chapter-05/charts.ts

RESULT_LOG=/tmp/ch05-negative-results.txt
: > "$RESULT_LOG"

cp "$D" /tmp/data5.pristine.ts
cp "$A" /tmp/content-a5.pristine.ts
cp "$B" /tmp/content-b5.pristine.ts
cp "$C" /tmp/charts5.pristine.ts

restore_pristine () {
  cp /tmp/data5.pristine.ts "$D"
  cp /tmp/content-a5.pristine.ts "$A"
  cp /tmp/content-b5.pristine.ts "$B"
  cp /tmp/charts5.pristine.ts "$C"
}

run_guard () {
  local label="$1"
  local out code nfail tail_line
  out=$(bun run validate:research 2>&1)
  code=$?
  tail_line=$(echo "$out" | grep -E "^[0-9]+ checks, [0-9]+ failures" | tail -1)
  nfail=$(echo "$out" | grep -c "\[FAIL")
  echo "RESULT $label | exit=$code | ${tail_line:-no-summary} | FAIL-lines=${nfail}"
  echo "$out" | grep "\[FAIL" | sed 's/^/    /' | head -6
  if [ "$code" -ne 0 ] && [ "$nfail" -gt 0 ]; then
    echo "$label CAUGHT" >> "$RESULT_LOG"
  else
    echo "$label MISSED" >> "$RESULT_LOG"
  fi
  restore_pristine
}

# test_fixture LABEL PYTHON_CODE — injects the fixture, then runs the guard.
# If the python anchor assertion fails the fixture never applied: recorded as
# INJECT-ERROR (a negative-test script defect) and counted as a failure.
test_fixture () {
  local label="$1"
  local code="$2"
  if ! python3 -c "$code"; then
    echo "RESULT $label | INJECT-ERROR (anchor not found — fixture did NOT apply)"
    echo "$label INJECT-ERROR" >> "$RESULT_LOG"
    restore_pristine
    return
  fi
  run_guard "$label"
}

echo "=== N1: wrong cell value — PISA_JPN_MATH 2012: 536 -> 526 (Ch01 contamination class) ==="
test_fixture "N1" '
p = "src/chapters/chapter-05/data.ts"
s = open(p).read()
assert s.count("[2012, 536],") == 1, "anchor not found"
open(p, "w").write(s.replace("[2012, 536],", "[2012, 526],"))
'

echo "=== N2: unit conflation — per-student prose: 21.7千ドル -> 21,700千ドル (Ch02 class) ==="
test_fixture "N2" '
p = "src/chapters/chapter-05/content-a.ts"
s = open(p).read()
assert s.count("高等教育（ISCED 5–8）では21.7千ドル") == 1, "anchor not found"
open(p, "w").write(s.replace("高等教育（ISCED 5–8）では21.7千ドル", "高等教育（ISCED 5–8）では21,700千ドル"))
'

echo "=== N3: narrative-peak fabrication — old-series peak 2001/138,722 -> 1998/135,000 (Ch03 class) ==="
test_fixture "N3" '
p = "src/chapters/chapter-05/charts.ts"
s = open(p).read()
assert s.count("2001年に138,722人でピーク") == 1, "anchor not found"
open(p, "w").write(s.replace("2001年に138,722人でピーク", "1998年に135,000人でピーク"))
'

echo "=== N3b: content-b prose peak also corrupted ==="
test_fixture "N3b" '
p = "src/chapters/chapter-05/content-b.ts"
s = open(p).read()
assert s.count("2001年の138,722人への増加") == 1, "anchor not found"
open(p, "w").write(s.replace("2001年の138,722人への増加", "1998年の135,000人への増加"))
'

echo "=== N4: basis error — foreign students relabeled as JASSO residence-basis ==="
test_fixture "N4" '
p = "src/chapters/chapter-05/content-a.ts"
s = open(p).read()
assert s.count("国籍・地域ベースです") == 1, "anchor not found"
open(p, "w").write(s.replace("国籍・地域ベースです", "在留資格ベース（JASSO留学生統計と同一）です"))
'

echo "=== N5: fabricated PIAAC Round-2 statistic (unverifiable claim probe) ==="
test_fixture "N5" '
p = "src/chapters/chapter-05/content-b.ts"
s = open(p).read()
old = "第2回の数値についてはOECD・文科省の公表資料を直接ご確認ください。"
assert s.count(old) == 1, "anchor not found"
open(p, "w").write(s.replace(old, "第2回では日本の読解力は281点だったとされています。ご確認ください。"))
'

echo "=== N6: bilingual year-value mismatch — EN reading decline year 2022 -> 2018 ==="
test_fixture "N6" '
p = "src/chapters/chapter-05/content-a.ts"
s = open(p).read()
old = "while Japan'"'"'s 2025 reading fell a significant 13 points from 2022, mathematics and science declined without statistical significance"
assert s.count(old) == 1, "anchor not found"
open(p, "w").write(s.replace(old, "while Japan'"'"'s 2025 reading fell a significant 13 points from 2018, mathematics and science declined without statistical significance"))
'

echo "=== N7: wrong record-year — いじめ 769,022 attributed to 2023 ==="
test_fixture "N7" '
p = "src/chapters/chapter-05/content-b.ts"
s = open(p).read()
old = "いじめの認知件数は769,022件と過去最多となりました"
assert s.count(old) == 1, "anchor not found"
open(p, "w").write(s.replace(old, "2023年度のいじめの認知件数は769,022件と過去最多となりました"))
'

echo "=== N8: significance erasure — reading −13 downgraded to 'not significant' ==="
test_fixture "N8" '
p = "src/chapters/chapter-05/content-a.ts"
s = open(p).read()
old = "読解力が2022年比で13点の有意な低下に対して"
assert s.count(old) == 1, "anchor not found"
open(p, "w").write(s.replace(old, "読解力が2022年比で13点の統計的に有意とは言えない低下に対して"))
'

echo "=== N9: series-basis erasure — 不登校 junction note removed ==="
test_fixture "N9" '
p = "src/chapters/chapter-05/charts.ts"
s = open(p).read()
old = "2014年の接続点では旧系列122,650人と新系列122,897人が約0.2%異なり、厳密な水準接続はない（2015年調査から学校基本調査・生徒指導調査の一本化）。"
assert s.count(old) == 1, "anchor not found"
open(p, "w").write(s.replace(old, "旧系列と新系列は連続している。"))
'

echo "=== N10: score-to-percentage conflation — PISA 538 described as 5.38% ==="
test_fixture "N10" '
p = "src/chapters/chapter-05/content-a.ts"
s = open(p).read()
old = "科学（科学コンピテンシー）538点・読解力503点・数学的リテラシー525点"
assert s.count(old) == 1, "anchor not found"
open(p, "w").write(s.replace(old, "科学（科学コンピテンシー）5.38%・読解力5.03%・数学的リテラシー5.25%"))
'

echo "=== N11: category contamination — elementary bullying value into 中学校 series ==="
test_fixture "N11" '
p = "src/chapters/chapter-05/data.ts"
s = open(p).read()
assert s.count("[2024, 135865],") == 1, "anchor not found"
open(p, "w").write(s.replace("[2024, 135865],", "[2024, 610612],"))
'

echo "=== N12: OECD-average recompute claim (average of shown countries) ==="
test_fixture "N12" '
p = "src/chapters/chapter-05/content-b.ts"
s = open(p).read()
old = "OECD平均は公表された加盟国平均であり、順位は信頼区間で入れ替わり得ます。"
assert s.count(old) == 1, "anchor not found"
open(p, "w").write(s.replace(old, "OECD平均は図に表示した国の平均値である。順位は信頼区間で入れ替わり得ます。"))
'

echo ""
echo "=== PRISTINE RESTORE + FINAL GATE ==="
restore_pristine
out=$(bun run validate:research 2>&1)
echo "$out" | grep -E "^[0-9]+ checks, [0-9]+ failures"
echo "$out" | grep -E "passed\.$"

echo ""
echo "=== SUMMARY (fixture -> guard outcome) ==="
cat "$RESULT_LOG"
CAUGHT=$(grep -c "CAUGHT" "$RESULT_LOG")
ESCAPED=$(grep -c "MISSED\|INJECT-ERROR" "$RESULT_LOG")
echo ""
echo "caught=$CAUGHT escaped-or-inject-error=$ESCAPED"
if [ "$ESCAPED" -eq 0 ]; then
  echo "NEGATIVE TEST SUITE PASSED: every fixture was caught by the guards"
else
  echo "NEGATIVE TEST SUITE FAILED: at least one fixture escaped or failed to apply"
fi

echo ""
echo "=== BYTE-IDENTICAL RESTORE VERIFICATION ==="
if cmp -s "$D" /tmp/data5.pristine.ts && cmp -s "$A" /tmp/content-a5.pristine.ts && cmp -s "$B" /tmp/content-b5.pristine.ts && cmp -s "$C" /tmp/charts5.pristine.ts; then
  echo "RESTORE OK: data.ts, content-a.ts, content-b.ts, charts.ts byte-identical to pristine"
else
  echo "RESTORE FAILED — working tree corrupted!"
  exit 1
fi

if [ "$ESCAPED" -ne 0 ]; then
  exit 1
fi
exit 0
