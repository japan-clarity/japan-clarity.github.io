# Chapter 04 Pre-Merge Independent Research, Security & Release-Readiness Audit

- **Audit**: pre-merge audit of `feature/chapter-04-labor-working-conditions`
  (development on top of `origin/main = 5b3a847`, the Chapter 03 merge)
- **Scope**: full-stack — data layer, narrative layer, bilingual parity,
  regression guards, clean-worktree gates, browser verification, security
  sanitization, packaging
- **Audit date**: 2026-10-28 (AEST; fresh live re-fetches — see §2)
- **Recommendation**: **GO** — after the remediation commit (D1–D5, all
  verified with negative-tested guards), no material release criterion fails.
  Owner conditions in §9.

---

## 1. Executive summary

This audit covered the complete Chapter 04 delivery (development + independent
audit in one pass, per the SOP's audit-first sequencing): anchored extraction
re-verified, the adversarial numerical audit executed **from freshly
re-fetched primary sources**, narrative claims checked claim-by-claim against
the delivered data, bilingual parity verified, negative regression testing used
both to prove the guard suite and to discover guard-coverage gaps, all
technical gates re-run on the remediated tree, browser-level functional
verification performed before and after remediation, and the release
sanitized and packaged.

- **Data layer: PASS after one convention fix (D1).** The live-re-fetch
  comparison (42 checks, fresh parser code, delivered `data.ts` as comparator)
  found exactly one data-layer defect: the LFS **1973 Okinawa double-row**
  convention was implemented backwards (first row kept instead of the
  documented second row), affecting six series at a single point. Everything
  else — MLS hours (6 series), paid leave (3 series + recompute), gender wage
  ratio (50 years), form gap (21 years), wage curve, form-gap-by-age,
  accident anchors, mental-comp (10 anchors), OECD (5 datasets incl. 13-economy
  latest snapshots) — matched exactly.
- **Narrative layer: four defects found and fixed (D2–D5).** A
  category-composition error (契約社員・嘱託 2002 "355万" = 契約社員 +
  その他 mislabeled), a wrong trough claim (65+ employment rate "around 2000 /
  約20%" — actual trough 19.2% in 2011), an unverifiable claim (student-excluded
  24.3% — no published 2025 value; series ends 2022), and a bilingual year
  anchor (EN 1.9% attached to 1973 instead of 1975). All corrected JA+EN with
  disclosure notes where the statistical basis genuinely breaks.
- **Guard hardening: 1345 → 1358 checks.** Negative testing (N1–N6) exposed two
  guard-coverage gaps *before* the audit proper (G-L prose-number agreement
  with a mental-comp allow-list; G-M survey-year framing — the first draft of
  G-M was itself defeated by the survey name appearing in the same paragraph,
  caught by re-testing). The audit remediation added G-N…G-R (1973 convention,
  category basis, trough anchor, unverifiable-claim ban, bilingual anchor).
  Eleven negative fixtures (N1–N11) now all fail the gate as designed; the
  pristine tree passes 1358/0.
- **Reproducibility**: extract-series.py re-runs clean on the auditor's
  re-downloads (196 checks incl. the new 1973 assertions); data.ts regenerates
  deterministically (snapshot `7e27634ebb7e62c9`).
- **Gates on the remediated tree**: tsc 0 · eslint 0/0 · validate:research
  1358/0 · contrast 58/0 · export 80/0 (20.4 MB) · Ch01–Ch03 + shared code
  **zero-diff vs origin/main**.
- **Browser verification**: 15 figures JA/EN; 5 chart⇄table round-trips with
  exact cells; desktop hover + mobile tap tooltips; CSV download with full
  attribution; keyboard tablist navigation; range-filter radio state; JA↔EN
  route preservation; deep link; 320–1440 px no horizontal scroll; sticky
  footer; Ch01–03 regression (incl. Ch01's audited 3.22 value); 404; console
  clean. Post-remediation re-verification confirmed the corrected 1973 row
  (1.3) and all four narrative fixes in both languages.
- **Security/sanitization: PASS** (no secrets/.env/PII/databases/build
  artifacts tracked; `research/chapter04/raw/` correctly gitignored per the
  DATA-LICENSES convention — raw files ship only in the internal audit zip;
  sandbox-path references confined to research/ scripts+notes, LOW risk per
  the merged Ch01–Ch03 precedent; workflows unchanged and policy-compliant).

---

## 2. Live re-fetch evidence (independence)

All re-fetches performed 2026-10-28 from the official domains into a fresh
directory; OECD CSVs were **byte-identical** to the development-time fetches
(same sha256), the e-Stat/MHLW files were re-downloaded and parsed with fresh
code (`compare.py`), and the delivered `data.ts` series (exported verbatim via
a one-off module import) were the comparator. Full manifest with sha256-16
values in `research/chapter04/notes/audit-findings.md` §Phase 1. Highlights:

| Claim group | Fresh source | Result |
|---|---|---|
| LFS 表2/表4(1)/表3(3)/表10-1 (73/73/58/24 points × series) | e-Stat xlsx | PASS except 1973 (D1) |
| MLS hours 30+/5+/general/part-time/overtime/part-ratio | e-Stat 000032189776 (20.9 MB CSV) | PASS (part-ratio recompute exact) |
| Paid leave 付与/取得/取得率 1984–2025 | e-Stat 時系列11/12/13 xls | PASS + rate≈taken/granted recompute |
| Gender ratio 1976–2025 · form gap 2005–2025 | mhlw z2025 dl/14.pdf (pdftotext, 付表1/2) | PASS (2019 dual-row basis consistent) |
| Wage curve · form-gap-by-age (第2表/第6-1表) | mhlw z2025 xls/zuhyo.xlsx | PASS (every cell) |
| Accidents 2025 (700 / 135,333 + 2016–25 series) | mhlw content/11302000/001704887.pdf | PASS |
| Mental comp FY2018–2020 + FY2021–2025 | archived R4 original + fresh R7 別添資料2 | PASS (10 anchors; FY2021–22 overlap identical) |
| OECD hours/temp/gwg JPN full series + latest ×13 | sdmx.oecd.org (4 CSVs) | PASS (gwg 6-dp rounding verified) |
| 潜在労働力 35万 · 追加就労 198万 · 転職者 330万/4.8% | stat.go.jp/e-Stat quarterly 4-1, 1-2 | PASS |
| Headline 6,828/7,004/176/2.5/10,973/62.2 · nonregular 2,128/36.5/3,700 · breakdown 1,512/156/273/105/81 | 表2 + 表10-1 + quarterly 1-1 | PASS |

## 3. Defects and remediation

See `docs/remediation-ledger-ch04.csv` for the full ledger (D1–D5, the two
guard-gap entries, and the two no-action observations). Remediation applied in
the working tree as a scoped change set:

1. `research/chapter04/scripts/extract-series.py` — put_year fixed to the
   documented second-row convention + `assert_1973_convention()` (4 checks);
   extraction re-run → `extracted-series.json` regenerated (196 checks, 0
   errors); `data.ts` regenerated (snapshot `7e27634ebb7e62c9`).
2. `src/chapters/chapter-04/content-a.ts` — D2/D3/D4/D5 rewrites (JA+EN, 7
   string replacements).
3. `src/chapters/chapter-04/charts.ts` — D3 chart-description rewrites (JA+EN).
4. `scripts/validate-research.ts` — G-N/G-O/G-P/G-Q/G-R guards added
   (1351 → 1358 checks).
5. `research/chapter04/scripts/negative-tests.sh` + notes — N7–N11 fixtures
   added and executed (all caught; pristine 1358/0; byte-identical restore).

## 4. What the guards now fence (1358 checks)

Data agreement (every series vs the anchored extraction JSON) · headline
anchors · recompute identities (leave rate, form gap, recognition rate,
part-ratio, nonregular components) · G-A…G-K narrative guards (unemployment
peak 2002/5.4; nonregular peak 2019/38.3 with no record-high claim; leave
66.9 record; accident minima 700/105,718 and maxima 4,330/348,826; mental
2.7×/28.2%; MLS-vs-OECD unit separation; wage floors/peaks; hours anchors;
chart-spec sanity; OECD comparator ordering; 10-section structure) · G-L
prose-number agreement incl. the mental-comp allow-list · G-M survey-year
framing · G-N 1973 convention · G-O category basis · G-P trough anchor · G-Q
unverifiable-claim ban · G-R bilingual anchor · snapshot hash · UI dictionary
parity · plus the pre-existing Ch01–Ch03 sections (unchanged, zero-diff).

## 5. Reproducibility

- `extract-series.py` on the auditor's re-downloads: **196 checks, 0 errors**
  (includes the four new 1973 assertions).
- `generate-chapter-04-data.ts` → deterministic `data.ts`
  (snapshot `7e27634ebb7e62c9` embedded and gate-checked).
- OECD SDMX: byte-identical re-fetches (same sha256 as development archives).

## 6. Security & release sanitization

- No secrets, tokens, `.env`, PII, databases, or build artifacts in the
  tracked set; `node_modules/`, `/.next/`, `/.build-export/`, `research/*/raw/`
  gitignored; `/research/chapter04/raw/` added to `.gitignore` (raw files are
  redistributed **only** inside the internal audit zip, per DATA-LICENSES).
- Workflows unchanged vs main: `ci.yml` = PR validation only
  (`contents: read`, no deploy); `deploy.yml` = main-only Pages deploy
  (official actions, no secrets). Policy PASS.
- Sandbox path references: confined to `research/chapter04/notes/` and
  `research/chapter04/scripts/` (audit documentation + dev scripts) — LOW
  risk, consistent with the merged Ch01–Ch03 precedent.
- Screenshots contain no PII (site renders only).

## 7. Browser verification

Full matrix in `research/chapter04/notes/browser-verification.md` (pre- and
post-remediation). Key exact-cell round-trips: unemployment 1975/2002/2025 =
1.9/5.4/2.5 (74 rows; **1973 = 1.3 post-remediation**); employment-status
1953 = 1,660/991/1,262, 2025 = 6,185/499/115; nonregular 2002/2019/2025 =
29.4/38.3/36.5 with male/female splits; injury 1974/2009/2025 =
347,407/105,718/135,333; OECD 13 economies (JPN 1,597.5 < OECD 1,736.1 <
KOR 1,833.0). CSV blob 1,402 B with attribution header. Ch01 household-size
1980 = **3.22** (the Ch01 audit remediation value) re-confirmed.

## 8. Artifacts

- `japan-clarity-ch04-public-source.zip` — git archive of the final tip
  (source only, raw excluded as in the repo).
- `japan-clarity-ch04-internal-audit.zip` — verification results, change
  manifest, ledger copy, screenshots, audit notes (incl. raw-evidence
  pointers), negative-test records, auditor re-fetch manifest.
- `japan-clarity-ch04-audit.bundle` — complete branch history (import-tested
  in an empty repository).
- `SHA256SUMS.txt`, `docs/RECOVERY.md` checkpoint, this report.

## 9. Owner checklist (unchanged policy)

1. Import the bundle or fetch the delivered branch; confirm tip == the
   audited commit in `docs/RECOVERY.md`.
2. Review the diff `5b3a847..<tip>` (Ch01–Ch03/components/lib must be
   zero-diff; they are in the delivered branch).
3. Push the feature branch; the existing/PR validation workflow must go green
   on the new tip (CI is validation-only; it never deploys).
4. Merge on approval; `deploy.yml` deploys main to GitHub Pages.
5. Post-deploy spot-checks: `/ja/chapters/labor-working-conditions/` and
   `/en/…` — 15 figures render; unemployment table 1973 = 1.3; 65+ trough text
   reads 19.2% / 2011; no "355万"/"24.3%"; EN reads "1.9% in 1975"; Ch01–03
   pages unchanged.
