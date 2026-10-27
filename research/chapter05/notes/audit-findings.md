# Chapter 05 — Independent Adversarial Audit Report

Audit date: 2026-10-27 (UTC) · Auditor: independent audit pass on
`/home/z/jc-ch05` @ `feature/chapter-05-education-talent` (base `a4fefde`).
Method: live re-fetch of primary sources from official domains into a fresh
directory (`/home/z/ch05-audit-refetch/`), fresh parser code (pdftotext +
grep / csv — no reuse of `extract-series.py`, `extracted-series.json`, or
the pdfplumber coordinate pipeline), value-by-value comparison against the
DELIVERED `src/chapters/chapter-05/data.ts`. Narrative-claim audit via the
delivered 1,866-check validate gate plus targeted re-reads of source prose.

## Phase 1 — Live re-fetch manifest (HTTP 200 unless noted)

| Source | URL basis | sha256-16 | vs archived |
|---|---|---|---|
| 生徒指導調査 R6 結果概要 | mext.go.jp 20260305-mxt_jidou02-100002753_3.pdf | `a9aee9ebccbbc4d3` | byte-identical |
| PISA 2025 総括 (01_point) | nier.go.jp 05_kenkyu_seika/pisa/pdf/2025/01_point.pdf | `c74870bee15b1a61` | byte-identical |
| 学習費 R5 ポイント | mext.go.jp 20260116-mxt_chousa01-000039333_1.pdf | `c07853cbbcdbfe15` | byte-identical |
| 学校基本調査 R7 確報概要 | mext.go.jp 20251226-mxt_chousa01-000044291_01.pdf | `aefb21b8ed966379` | byte-identical |
| 学校基本調査 R8 速報概要 | mext.go.jp 20260826-mxt_chousa01-000050842_01.pdf | `9067324d03623430` | byte-identical |
| PIAAC 2012 調査結果の概要 | mext.go.jp b_menu/toukei/data/Others/20220712-mxt_kouhou02-1.pdf | `ee6456357bbbe893` | byte-identical |
| EAG attainment 25–64 (live SDMX) | OECD.EDU.IMEP,DSD_EAG_LSO_EA@DF_LSO_NEAC_DISTR_EA,1.0 key JPN._T.Y25T64.._T.POP… OBS | 789 rows | values match archive |
| EAG attainment 25–34 (live SDMX) | same flow, key Y25T34 | 614 rows | values match archive |

Audit-tooling note (own-process finding A0): the first live SDMX query
attempt used the flow id `DF_LSO_NEAC_DISTR` (missing the `_EA` suffix) and
returned HTTP 404; correct id read off the archived CSV's DATAFLOW column.
Also the first audit comparison script keyed live rows by (area, level)
without AGE so the 25–34 pull overwrote the 25–64 pull, producing 20 phantom
"mismatches"; corrected by keying (area, age, level) — both defects were in
the AUDIT script, not the delivered chapter (re-run: 58/58 PASS). Recorded
here for honesty about auditor error.

## Phase 2 — Numerical comparison (fresh parse vs delivered)

| Check | Method | Values | Result |
|---|---|---|---|
| EAG tertiary attainment, JPN/KOR/OECD × 9 economies, both ages, ISCED 5–8 | live SDMX CSV vs data.ts regex parse | 58 points | **PASS** (max diff < 0.005) |
| JPN 0T2 rows existence | live SDMX key wildcard | 0 rows | PASS — absent in live too (limitation disclosed, not fabricated) |
| いじめ認知件数 R6 769,022 + 12-year trend row | pdftotext grep of fresh gaiyou | series line 185,803→769,022 | **PASS** |
| 不登校 353,970 (前年 346,482) | same | prose line | **PASS** |
| 自殺 413 (2024) | same | breakdown table | **PASS** |
| 新規不登校 153,828 (9年ぶり減少; 前年 165,300) | same | prose line | **PASS** |
| ネットいじめ 27,365 (前年 24,678) | pdftotext grep of kekka (結果本編) | "パソコンや携帯電話等を使ったいじめは 27,365 件" | **PASS** (definition = ICT-mediated bullying, chapter wording consistent) |
| PISA 2025 JPN science 538 / reading 503 / math 525 | fresh 01_point.pdf | "1 日本 538 日本 503 日本 525" | **PASS** |
| PISA 2025 OECD avg 482/461/463 | same | "OECD平均 482 … 461 … 463" | **PASS** |
| PISA 2025 CIs (517–534 / 495–510 / 530–545) | same | "525点(517-534)" etc. | **PASS** |
| Reading −13 significant | same | "読解力が有意に低下※（－13点）" | **PASS** (significance preserved) |
| R7 headline 61.4 / 58.3 / 2.6 / 14.4 / 13.8 / 85.4 | fresh kihon_r7_gaiyou | "955,335 586,639 (61.4) 557,170 (58.3) 24,657 (2.6) 137,876 (14.4)" + 85.4 | **PASS** |
| 学習費 R5 by stage ×6 (pub/priv × 幼/小/中) | fresh gakushuuhi ポイント | all 6 exact | **PASS** |
| PIAAC R1 296/288/294, 35%, OECD 273/269/283 | fresh piaac gaiyou | "日本 296（1） 288（1） 35%（10） 294（1）" / "OECD平均 273 269 34% 283" | **PASS** |
| PIAAC equity gap 129 vs 152 | same | "得点差が129点であり、ＯＥＣＤ平均152点" | **PASS** (grep initially missed it: \b boundary vs 全角 context — value present) |

Cross-check vs extraction snapshot: `extracted-series.json` sha256-16 equals
`DATA_SNAPSHOT_HASH` in data.ts (validate gate) — re-run 991 checks / 0
failures.

## Phase 3 — Narrative-claims audit

- Delivered validate gate: **1,866 checks, 0 failures** (PISA population-base
  discipline, year attributions, bilingual parity, unit conflation guards,
  disclosure-presence guards).
- Negative regression suite: **13/13 fixtures CAUGHT** (N1–N12 incl. N3b),
  byte-identical restore, suite exit 0. The N12 guard additionally caught a
  real leftover: the pre-audit pristine charts.ts JA note still carried the
  injected-style claim "OECD平均は図に表示した国の平均値である" (a
  negative-test residue from the pre-reset session) — **fixed before
  delivery** to "公表された加盟国平均であり、図に表示した国の平均ではな
  い" (matching the EN note). Post-fix gate = 1866/0. This is remediation
  entry R1.
- Targeted prose re-reads: the いじめ interpretation follows MEXT's own
  caution (認知件数増加≠実態悪化); 自殺 counts carry the 5.6%
  detailed-investigation caveat; 不登校 junction (122,650 vs 122,897)
  disclosed; PIAAC Round-2 absence disclosed as INCONCLUSIVE with pointers.

## Phase 4 — Sanitize scan

- No API keys / secrets / tokens / credentials patterns in src/, scripts/,
  research notes (all grep hits are design-color "tokens" and parser
  "numeric tokens" — benign).
- No local absolute paths (/home/z, C:\Users) in src/ or scripts/.
- No .env files in the worktree.
- fetchlog.tsv contains only public official URLs.

## Findings ledger

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| A0 | auditor | audit-script defects (flow-id suffix; age-key collision) | fixed in audit script; no chapter impact |
| R1 | low (fixed) | pre-audit charts.ts JA note contained N12-class residue "図に表示した国の平均値である" | **fixed pre-delivery**; guard proves regression coverage |
| — | none | no data-value defects found in delivered chapter data | n/a |

**Verdict: no unresolved data or narrative defects. Delivered values match
live official sources on every independently re-parsed point.**
