# Chapter 05 Pre-Merge Independent Research, Security & Release-Readiness Audit

- **Audit**: pre-merge audit of `feature/chapter-05-education-talent`
  (development on top of `origin/main = a4fefde`, the Chapter 04 merge)
- **Scope**: full-stack — data layer, narrative layer, bilingual parity,
  regression guards, negative testing, clean-worktree gates, browser
  verification, security sanitization, packaging
- **Audit date**: 2026-10-27 (UTC; fresh live re-fetches — see §2)
- **Recommendation**: **GO** — after remediation (R1 fixed and verified; see
  `docs/remediation-ledger-ch05.csv`), no material release criterion fails.
  Owner conditions in §9.

---

## 1. Executive summary

This audit covered the complete Chapter 05 delivery (development +
independent audit in one pass, per the SOP's audit-first sequencing):
anchored extraction re-verified after an environment-reset recovery
(**991 checks / 0 failures**, snapshot `b223943072ca13e2` = the
`DATA_SNAPSHOT_HASH` embedded in the delivered data module), the adversarial
numerical audit executed **from freshly re-fetched primary sources** with
fresh parser code, narrative claims checked against the delivered data via a
**1,866-check validate gate**, bilingual parity verified, negative
regression testing used to prove the guard suite (13 fixtures), all technical
gates re-run on the remediated tree, browser-level functional verification
performed, and the release sanitized and packaged.

- **Data layer: PASS.** The live-re-fetch comparison (58 SDMX values +
  ~30 PDF anchors, fresh parsers, delivered `data.ts` as comparator) found
  **zero data-layer defects**. Six MEXT/NIER PDFs re-fetched byte-identical;
  OECD SDMX live values match the archived CSV and the delivered series.
- **Narrative layer: PASS.** One N12-class residue (a leftover negative-test
  injection in a chart note) was caught **by the delivered gate itself**
  during the pre-audit run and fixed before delivery (R1). All sensitive-
  topic framing (いじめ認知件数, 不登校, 自殺) follows the source
  institutions' own cautions; the PIAAC Round-2 absence is disclosed as
  INCONCLUSIVE rather than filled with remembered numbers.
- **Negative testing: PASS.** 13/13 fixtures caught (N1–N12 + N3b), with the
  suite itself hardened this session to fail closed on silent injection
  failures (S1).
- **Gates: PASS.** tsc 0 · eslint 0/0 · validate:research 1866/0 · contrast
  58/0 · export verify 94/0 (22.1 MB) · Ch01–04/lib/app zero-diff vs
  `a4fefde`.
- **Browser verification: PASS** (21 checks: JA/EN render, chart⇄table,
  CSV, deep links, 320–1440 px, sticky footer, Ch01–04 regressions, zero
  console errors).
- **Sanitization: PASS** (no secrets/credentials/absolute paths; raw/
  gitignored per DATA-LICENSES; workflows untouched).

## 2. Live re-fetch manifest (independent of dev-time archives)

| Source | sha256-16 | Match vs archived |
|---|---|---|
| 生徒指導調査 R6 結果概要 (mext.go.jp) | `a9aee9ebccbbc4d3` | byte-identical |
| PISA 2025 総括 01_point.pdf (nier.go.jp) | `c74870bee15b1a61` | byte-identical |
| 学習費 R5 ポイント (mext.go.jp) | `c07853cbbcdbfe15` | byte-identical |
| 学校基本調査 R7 確報概要 (mext.go.jp) | `aefb21b8ed966379` | byte-identical |
| 学校基本調査 R8 速報概要 (mext.go.jp) | `9067324d03623430` | byte-identical |
| PIAAC 2012 調査結果の概要 (mext.go.jp) | `ee6456357bbbe893` | byte-identical |
| OECD SDMX EAG attainment 25–64 / 25–34 (live query, 789 + 614 rows) | — | values match archive |

Fresh-parser comparisons (pdftotext+grep and csv — no reuse of the
extraction pipeline): all values matched. Details in
`research/chapter05/notes/audit-findings.md` §Phase 2.

## 3. Findings and remediation

See `docs/remediation-ledger-ch05.csv` for the full ledger:
- **R1** (fixed): N12-class residue in the delivered charts.ts JA note,
  caught by the delivered guard during the pre-audit gate run.
- **S1** (fixed): negative-test script defect — N12's anchor referenced a
  string that no longer existed after the environment-reset rebuild, so the
  fixture silently never applied; the suite now fails closed
  (INJECT-ERROR detection + summary gate).
- **A0** (auditor-side, documented): two defects in the audit's own tooling
  (SDMX flow-id suffix; age-key collision) — fixed before findings were
  reported; delivered data was correct throughout.

## 4. Coverage and disclosed limitations

- **PIAAC Round 2 (fielded 2023, published 2024-12-10) is INCONCLUSIVE**:
  unverifiable from any accessible primary channel in this environment
  (OECD.org/iLibrary Cloudflare; NIER page broken; no SDMX dataflow; Data
  Explorer empty; Wayback blocked — all attempts logged in
  `research/chapter05/notes/oecd-summary.md` §D). The chapter charts Round 1
  only and discloses Round 2 with pointers to primary sources. No
  remembered or secondhand Round-2 numbers appear anywhere.
- **不登校 series basis**: 1991–2013 (K014, 30-day) joined to 2014+
  (unified survey) with the ~0.2% junction gap (122,650 vs 122,897)
  disclosed on the chart and in limitations (guard-enforced).
- **いじめ認知件数**: framed per MEXT's own caution — recognition-count
  growth ≠ worsening reality; resolution rate 76.1% given alongside.
- **自殺**: school-reported counts with the 5.6% detailed-investigation
  rate; no causal framing.
- **R8 (2026) 学校基本調査**: labeled 速報 (preliminary) wherever cited.
- **JPN below-upper-secondary employment rows**: absent in the OECD
  LSO-NEAC collection — disclosed, never interpolated.
- **OECD average**: always the published member average, never an average
  of displayed countries (guard-enforced, N12).

## 5. Negative regression testing

13 fixtures instantiating the chapter-lesson defect bank: Ch01-class
cross-table contamination, Ch02-class unit conflation, Ch03-class
narrative-peak fabrication (×2 locations), Ch04-class category/basis error,
PIAAC-fabrication probe, bilingual year mismatch, wrong record-year,
significance erasure, series-basis erasure, score-to-percent conflation,
school-level contamination, OECD-average recompute claim. **All 13 caught**
(guard failures with ≥1 [FAIL] line); pristine restore byte-identical;
suite exit 0. Script: `research/chapter05/scripts/negative-tests.sh`.

## 6. Gates (run on the final tip `e7b4fa8` + docs commit)

| Gate | Result |
|---|---|
| `bunx tsc --noEmit` | 0 errors |
| `bun run lint` (eslint) | 0 problems |
| `bun run validate:research` | **1866 checks / 0 failures** |
| `bun run scripts/contrast-audit.ts` | 58/0 (WCAG 2.2 AA) |
| `bun run export:static` | build success + post-export |
| `bun run verify:export` | **94 checks / 0 failures** (22.1 MB) |
| Ch01–04 zero-diff vs `a4fefde` | PASS — diff touches only ch05 files, registry/config status, validate/verify scripts, package.json scripts |
| Negative suite | 13/13 caught, byte-identical restore |

## 7. Browser verification (agent-browser, headless Chromium)

21 checks — all PASS; full table in
`research/chapter05/notes/browser-verification.md`. Highlights: JA and EN
routes render all 10 sections; chart⇄table round-trip renders the 77-row
long-run progression table; range filters respond; CSV download produces a
data blob (13 buttons); deep link `#wellbeing` resolves; 320×568 has no
horizontal overflow; sticky footer perfect on short pages (gap 0) and
naturally pushed on long pages; Ch01–04 regression routes all load with
zero console errors.

## 8. Security & sanitization

- No API keys / secrets / tokens / credentials patterns in src/, scripts/,
  research notes (grep hits were design-color tokens and parser numeric
  tokens — benign).
- No local absolute paths in src/ or scripts/; no .env files.
- `research/chapter05/raw/` is gitignored (per DATA-LICENSES policy — same
  as Ch01–04) and shipped only in the internal audit archive.
- GitHub workflows untouched (validation-only CI; main-only deploy).

## 9. Owner conditions (unchanged from the SOP)

1. Owner creates the PR (link below), reviews, and merges with **Create a
   merge commit** — no rebase/squash, preserving the audit trail.
2. Owner pushes `main` and verifies the deployed site + this chapter.
3. `git push origin feature/chapter-05-education-talent` (or upload the
   bundle) precedes the PR.
4. PR title: **Add independently verified Chapter 05 on education and
   talent** (full description template delivered in the handoff).

PR creation link:
`https://github.com/japan-clarity/japan-clarity.github.io/pull/new/feature/chapter-05-education-talent`
