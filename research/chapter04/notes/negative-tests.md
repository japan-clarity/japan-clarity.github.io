# Chapter 04 — Negative Regression Test Record

Run: 2026-10-28 (AEST), on feature/chapter-04-labor-working-conditions working tree (base 5b3a847).
Driver: `research/chapter04/scripts/negative-tests.sh` (backup → corrupt → run → record → restore; byte-identity re-verified after every fixture).

Gate under test: `bun run validate:research` — 1351 checks (post-hardening), 0 failures pristine.

## Fixtures and observed guard failures

| ID | Defect class (historical lesson) | Corruption | Expected | Observed | Verdict |
|----|----------------------------------|-----------|----------|----------|---------|
| N1 | Ch01 cross-table contamination — wrong cell in LFS series | `data.ts` UNEMPLOYMENT_RATE 2002: 5.4 → 5.2 | ≥2 | **2** (LFS unemployment-rate data agreement; G-A peak 2002/5.4) | PASS |
| N2 | Ch02 unit conflation — monthly value in annual series | `data.ts` OECD_HOURS_JPN 2025: 1597.507 (h/year) → 135.1 (h/month) | ≥2 | **2** (OECD hours JPN data agreement; G-F monthly-vs-annual distinctness) | PASS |
| N3 | Ch03 narrative-peak fabrication contradicting data | `content-a.ts` non-regular "2019年38.3%で頂点→低下" → "2025年36.5%と非正規の割合が過去最高" (record-high claim) | ≥1 | **1** (G-B forbidden record-high phrasing) | PASS |
| N4 | Ch03 wrong minimum/trough value | `data.ts` ACCIDENT_INJURY 2009: 105718 → 115718 | ≥3 | **3** (Accident injury data agreement; G-D injury minimum 105718@2009; G-D Lehman drop 119,291→105,718) | PASS |
| N5 | Fabricated prose statistic (self-audit lesson class) | `content-b.ts` mental claims 4,958→6,958, 約2.7倍→約3.8倍, EN "2.7×"→"3.8×" | ≥1 | **0 → 1 after G-L added** | GAP CLOSED |
| N6 | Survey-year vs calendar-year conflation (Ch02 reference-period lesson) | `content-a.ts` "2025年調査（2024年暦年）では66.9%" → "2025年には66.9%" | ≥1 | **0 → 1 after G-M added** | GAP CLOSED |

## Gap discovery and hardening (first run, 1345 checks)

First run exposed two guard-coverage gaps — exactly the purpose of negative testing:

1. **N5 initial 0 failures**: no guard tied prose-cited figures to the data layer (the
   `some()` co-occurrence checks were satisfiable by chart descriptions when prose was
   corrupted). Root cause of the first hardening attempt failing: `charts.ts` mental
   chart descriptions retained the correct triple.
   Fix: **G-L allow-list** — every non-year number in a string matching
   `/精神障害の労災請求件数|精神障害の件数|work-related mental disorders/` must resolve to
   MENTAL_CLAIMS / MENTAL_DECISIONS / MENTAL_GRANTED values (with/without thousands
   separators) or the verbatim same-release note anchors {2.7, 28.2, 1,254, 217, 17}.
   Intermediate defect found & fixed during hardening: a first draft triggered on any
   string mentioning 精神障害 and false-positived on the WLB paragraph citing the verified
   reasons-table value 173万人 (正規の職員・従業員の仕事がないから, extraction
   detail2025.reasons2025); trigger narrowed to mental-claims strings.
2. **N6 initial 0 failures**: (a) first fixture draft ("2024年暦年では66.9%") was factually
   still true and left the disclosure elsewhere; redesigned to the genuine error class
   ("2025年には66.9%" — calendar-2025 attribution of the R7 survey figure).
   (b) first guard draft (`t.includes("調査")`) was satisfied by the survey NAME
   就労条件総合調査 appearing in the same paragraph.
   Fix: **G-M** — in any string citing 66.9: JA `2025年` must be part of `2025年調査`
   (regex `2025年(?!調査)`) unless the `2024年暦年` form is used; EN `2025` requires
   survey/round/calendar-2024 framing.

Post-hardening re-run: N5 → 1 failure, N6 → 1 failure, pristine 1351/0.

## Final state

- Guards added: G-L (prose-number agreement incl. mental-comp allow-list, 5 checks) and
  G-M (survey-year framing, 1 check) → gate 1345 → **1351 checks**.
- Pristine re-run after every fixture: **1351 checks, 0 failures**; working tree
  byte-identical after restore (diff-verified).
- Prose-anchor co-occurrence checks also retained for accidents (347,407/105,718/700/4,330),
  headline (6,828万/2,128万), leave (66.9/18.1/12.1), wage (58.8/76.6).

## Post-remediation extension (D1–D5 regression fixtures)

After the adversarial-audit remediation (D1 1973-row fix, D2 category-basis fix, D3 trough fix,
D4 unverifiable-claim removal, D5 bilingual anchor fix), five new fixtures were added and the
full suite re-run on the remediated tree:

| ID | Class | Corruption | Observed | Verdict |
|----|-------|-----------|----------|---------|
| N7 | D1 — 1973 row-swap regression | data.ts UNEMPLOYMENT_RATE 1973: 1.3 → 1.2 (excl-Okinawa row) | **2** (data agreement; G-N 1973-row guard) | PASS |
| N8 | D2 — category-composition regression | 355万 契約社員・嘱託 claim re-introduced | **2** (G-O forbidden 355万; G-O disclosure-removed) | PASS |
| N9 | D3 — wrong-trough regression | 65+ trough re-anchored to 約20% around 2000 | **1** (G-P text-anchor guard; data min guard still passes) | PASS |
| N10 | D4 — unverifiable-claim regression | student-excluded 24.3% parenthetical re-introduced | **1** (G-Q) | PASS |
| N11 | D5 — bilingual year-anchor regression | EN "1.9% after the 1973" re-introduced | **1** (G-R) | PASS |

Full suite: N1–N11 all FAIL as designed; pristine re-run **1358 checks, 0 failures**;
working tree byte-identical after restore (diff-verified). Gate: 1345 → 1351 (G-L/G-M) →
**1358** (G-N…G-R).
