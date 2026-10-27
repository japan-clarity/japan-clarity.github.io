# Japan Clarity — Recovery Checkpoint

**Checkpoint date:** 2026-10-25 (museum light-theme redesign session; prior
checkpoints 2026-10-23 and 2026-10-22 below)
**Production (unchanged):** `v1.0.0-rc1` live at https://japan-clarity.github.io/
— `origin/main` = `266eb23` (post-launch QA chain, pushed by the owner
2026-10-24; verified via `git fetch`).
**State:** a complete, tested Japanese-museum-editorial light-theme redesign
(Scheme A: Washi White × Celadon × Kuchiba Gold) sits on the **local feature
branch `design/japanese-museum-light-theme`** (based on `origin/main`).
Nothing has been pushed, merged, or deployed. Design documentation:
`docs/MUSEUM-LIGHT-THEME.md`.

## Current git state (2026-10-25)

```
design/japanese-museum-light-theme   ← local only; visual redesign commits
  └─ based on origin/main = 266eb23 (deployed v1.0.0-rc1 + QA fixes)
main (local) = 09f49b3  ← STALE sandbox artifact (see below); do not push
```

- Research/content diff vs `origin/main`: **empty** (all 14 chapters,
  Chapter 01 data/citations, extraction scripts, source records untouched).
- Gates on the branch: tsc 0 · eslint clean · research 259/0 · export OK ·
  verify-export 57/0 (15.9 MB) · contrast audit 58/0 (new
  `scripts/contrast-audit.ts`).
- Local-only git config: `core.filemode=false` (sandbox filesystem sets
  executable bits; content hashes verified identical — not a repo change).

### Sandbox anomaly (recorded for safety)

The development sandbox was reprovisioned between sessions: the previous
worklog/dev.log were wiped, and local `main` was reconstructed by automation
("Japan Clarity Build") as `09f49b3` — a recreation of the pre-QA `be76c6a`
content WITHOUT the five QA commits (6+/11− lines behind `origin/main`).
Additionally, a workspace watchdog periodically forces the main checkout
back to `main`. Consequences, all mitigated:

- The redesign was built in an isolated **git worktree at
  `/home/z/jc-design`** (branch `design/japanese-museum-light-theme`), immune
  to the watchdog; `/home/z/my-project` stays untouched on `main`.
- `node_modules` is hard-link-copied into the worktree (symlinks are
  rejected by bun); `.env` is copied. A branch-tracking `git bundle`
  (`/home/z/design-theme.bundle`) snapshots the branch after each commit
  series.
- Treat `origin/main` (`266eb23`) as canonical; **never push local `main`
  (`09f49b3`)** — it is a stale environment artifact.

## Museum light-theme redesign (2026-10-25) — completed

Visual-only redesign per the owner's spec: Scheme A palette as central
semantic tokens in `src/app/globals.css`; all gradients removed; charts,
logo, favicon, header/sheet, callouts, sparkline, pills restyled; Noto
Serif JP (OFL, next/font, headings only) + Japanese system sans body;
post-export redirect/404 templates de-darkened. Three documented WCAG
deviations (interactive celadon, text-safe gold, text-safe blue-grey) —
see `docs/MUSEUM-LIGHT-THEME.md` §2.3.

Full verification matrix: `docs/MUSEUM-LIGHT-THEME.md` §6 — 7 viewports
(320–1440) with zero horizontal overflow, 11 canvases everywhere, chart⇄table
×3 desktop + mobile, tooltips hover/tap, range filters, legend toggles,
JA↔EN round trips with refresh, keyboard focus rings, CSV blob 3,163 B
(baseline-identical), footer pinned/pushed, bilingual 404, before/after
screenshots in `research/theme-screenshots/` (16 PNG).

## Next safe action

1. Owner reviews the branch (see §Resuming after an interruption for
   commands; full change list in `docs/MUSEUM-LIGHT-THEME.md` §5).
2. With approval, the owner pushes **only the feature branch**:
   `git push origin design/japanese-museum-light-theme` (from a clone of
   the delivered archive or this workspace; **no push to `main`, no
   force-push, no merge, no deploy from this environment**).
3. Owner opens the PR (base `main`, compare `design/japanese-museum-light-theme`,
   title “Redesign Japan Clarity with a Japanese museum-inspired light theme”),
   screenshots the creation page **before** clicking Create, waits for CI.
4. The redesign is live only after merge + a green Pages deploy is verified.

## Post-launch QA (2026-10-23) — completed

Live-site acceptance at 1440/768/390/375/320 px: Japanese-default routing,
JA↔EN round trips with context preservation, 14-chapter navigation,
planned-chapter placeholders, bilingual 404s, all 11 figures, chart⇄table
restoration ×3 desktop + ×3 mobile, tooltips (hover + touch), range filters,
legend toggles, keyboard tabs, CSV with attribution, back-to-top, sticky
footer, zero console errors. Research spot-checks (1947 TFR 4.54, natural
decrease 19th year, census totals) verified in both languages. Full matrix:
`docs/POST-LAUNCH-QA.md`; fixes: `docs/POST-LAUNCH-REMEDIATION.md`.

Gates re-run after fixes: tsc 0 errors · eslint clean · research 259/0 ·
export 42 pages · verify-export 57/0 (8.4 MB) · dev-preview smoke green.

## Next safe action

1. Owner reviews the three fix commits (`git show` each; see
   `docs/POST-LAUNCH-REMEDIATION.md` §Git state).
2. Owner pushes (normal fast-forward, no force) and confirms the deploy
   workflow goes green; spot-check the live sheet close label, footer link
   spacing, and an X card preview for a chapter URL.
3. After the push verifies: tag `v1.0.0` and freeze before Chapter 02.

## Historical checkpoints (2026-10-22)

**Checkpoint date:** 2026-10-22 (updated in the remediation session and the
final pre-deployment cleanup)
**Release candidate:** tag `v1.0.0-rc1` on `main` (history rewritten — see
`docs/REMEDIATION.md` §2 for the old→new commit mapping)
**State (at that time):** platform complete and verified; Chapter 01
published with disclosed limitations; pre-publication remediation applied
(security purge, repo minimization, copy corrections, re-verification).

## Completed and verified

1. **Reference inspection** — all three reference sites + repos inspected
   (Taiwan Forward, Global Food Crisis, Remember to Prevent); patterns reused:
   dual-mode Next.js 16 export config, tree-shaken ECharts with table
   alternatives, official Pages workflow shape, source registers with access
   dates. Japan Clarity repo state captured (README only).
2. **Foundation** — bilingual `/ja/…` + `/en/…` static routing (ja default,
   switch with 日本語 left / English right), dark-only design system, 14-chapter
   registry, provenance types, chapter-isolation contract.
3. **Research verification (Chapter 01)** — all figures read inside archived
   copies of the original documents (MHLW vital stats 2025 final & life tables,
   2025 census basic tabulation, Statistics Bureau estimates & elderly release,
   Statistical Handbook 2026, IPSS 2023 projections & 2024 household
   projections, internal migration 2025, World Bank WDI API for 13-economy
   comparisons). Extraction pipeline with 40+ anchor validations; two parsing
   bugs caught and fixed by anchors (footnote column-shift; war-gap years).
4. **Chart framework** — 11 interactive figures; chart ⇄ table restoration
   verified 3× desktop + 3× mobile; touch tooltips, legend toggles, range
   filters, keyboard tabs, CSV with attribution, accessible tables.
5. **Dual-mode** — static export (33 routes, 57 artifact checks, 8.4 MB)
   verified while the dev server stayed healthy; dev-only `/` → `/ja/`
   redirect; post-export root redirect + bilingual 404 for Pages.
6. **Quality gates** — tsc 0 errors, eslint clean, research integrity gate
   259 checks / 0 failures; full browser verification log in
   `docs/VERIFICATION.md` with screenshots in `research/verification-screenshots/`.
7. **Deployment readiness** — `ci.yml` + `deploy.yml` (least-privilege,
   concurrency-controlled, no secrets); deployment instructions with Git Bash
   commands in `docs/DEPLOYMENT.md`.
8. **Pre-publication remediation (2026-10-22, second session)** — `.env`
   purged from all git history (verified 0 reachable matches); remote
   initial commit `9e8e68e` merged locally (no force-push needed);
   scaffold/dependency minimization (67→13 runtime deps); two copy-level
   factual errors corrected after an independent audit; all gates and browser
   regressions re-run green. Full report: `docs/REMEDIATION.md`.
9. **Final documentation sanitization (2026-10-22, same-day follow-up)** —
   the literal development `DATABASE_URL` value and environment-specific
   host paths were removed from `docs/REMEDIATION.md` and this file; the
   three commits that had carried them were rewritten so the delivered
   history contains neither (verified: 0 reachable matches; second-pass
   mapping in `docs/REMEDIATION.md` §2); all gates re-run green on the
   final tree.

## Completed but not fully verified

- Clipboard copy-link success is inferred (headless browser blocks
  read-back); manual confirmation recommended.
- CSV file bytes not compared in-browser (content covered by the integrity
  gate instead).
- GitHub Actions runs have not executed on GitHub's runners (no push access
  from this environment).

## Blocked / not done (honest)

- **Deployment itself** — no repository write credentials exist here; the
  owner must push (commands in `docs/DEPLOYMENT.md`) and enable
  Pages → Source: GitHub Actions.
- **Custom domain** — intentionally not purchased/configured; no CNAME.
- **Chapters 02–14 research** — registered as planned with scope text; no
  substantive research published for them (by design: no fabrication).

## Pending (recommended next steps)

1. ~~Push to GitHub and verify the first Actions deployment~~ — **done by
   the owner 2026-10-22; verified live by QA 2026-10-23.**
2. ~~Owner review + push of the three post-launch QA fix commits~~ — **pushed
   by the owner 2026-10-24 (`origin/main` = `266eb23`, verified by fetch).**
3. Owner review + PR for the museum light-theme branch (see Next safe action).
4. After the MHLW November 2026 recalculation of 2025 rates/TFR: update the
   TFR figure and note (re-run `extract-series.py` → `generate-chapter-data.ts`
   → `validate:research`; the anchors will need updating to the revised
   values — that is intentional friction).
5. Begin Chapter 02 — Economy & Industry research using the same pipeline
   (add `src/chapters/chapter-02/`, register, gate, publish with limitations) —
   only after the redesign PR is decided.
6. Optional: add a LICENSE file (owner's choice), and enable branch
   protection requiring the CI workflow (recommended in the QA report —
   owner decision).

## Resuming after an interruption

- **Redesign worktree:** the feature branch is checked out at
  `/home/z/jc-design` (git worktree of `/home/z/my-project`). Start the dev
  preview there: `cd /home/z/jc-design && bun run dev` (port 3000).
  A branch snapshot bundle is kept at `/home/z/design-theme.bundle`.
- **Do not work on branches in `/home/z/my-project`** — the sandbox watchdog
  reverts that checkout to `main` (see the anomaly note above).
- Running `bun run export:static` while the dev server is up can OOM-kill
  the dev server on this 4 GB sandbox (distDir is isolated, so nothing is
  corrupted) — restart `bun run dev` afterwards if it dies.
- Dev server log: `/home/z/my-project/dev.log` (redirected from the worktree).
- All research evidence lives under `research/chapter01/` (raw documents are
  in the workspace but not committed; notes + scripts + World Bank responses
  are committed). The pre-remediation git history is preserved only in
  `pre-remediation.bundle` on the development workspace host (outside the
  repository; the environment-specific absolute path is recorded only in the
  private workspace) — do not re-import it into the public repo.
- A second bundle, `pre-final-cleanup.bundle`, snapshots the release
  candidate immediately before the documentation-sanitization rewrite
  (same handling rules: workspace-only, never re-imported into the public
  repository).
- Data drift is detected automatically: `bun run validate:research` compares
  the generated module against `extracted-series.json` by content hash.
- The shared agent worklog is `worklog.md` (workspace-only, not committed).

---

## Chapter 02 checkpoint (2026-10-25) — feature/chapter-02-economy-industry

**State:** Chapter 02 (Economy & Industry / 経済・産業) fully implemented, verified, and
committed locally on `feature/chapter-02-economy-industry` (based on `origin/main`
= 9a9aad1, the merged museum light-theme PR #1). NOT pushed; awaiting owner review.

**Worktree:** `/home/z/jc-ch02` (the main sandbox checkout `/home/z/my-project` stays on
`main`; the previous design worktree `/home/z/jc-design` is no longer used for dev).
Dev server runs from `/home/z/jc-ch02` on port 3000.

**Commits (this branch):**
1. `feat(ch02): evidence-verified Chapter 02 — Economy & Industry (JA/EN)` — research
   assets, extraction pipeline, chapter module, wiring, validation extensions.
2. (subsequent) screenshots + docs + recovery checkpoint — see `git log`.

**Data/research pipeline (all reproducible):**
- Raw evidence: `research/chapter02/raw/{esri,mhlw,statb,oecd,worldbank}/`
  (NOT committed except WB JSONs + OECD CSVs — see `research/DATA-LICENSES.md`).
- Extraction: `python3 research/chapter02/scripts/extract-series.py`
  → `research/chapter02/notes/extracted-series.json` (107 anchor checks).
- Codegen: `bun run scripts/generate-chapter-02-data.ts`
  → `src/chapters/chapter-02/data.ts` (snapshot hash in file header).
- Validation: `bun run validate:research` (513 checks; ch02 data-agreement = section [4b]).

**Gates at checkpoint:** tsc 0 errors · eslint clean · validate:research 513/0 ·
export:static OK · verify:export 65/0 · browser acceptance complete (both locales,
320–1440px, chart↔table ×3 on ch01+ch02, tooltips, range filter, CSV, 404, footer) ·
Chapter 01 zero-diff proven (`git diff origin/main -- src/chapters/chapter-01/
research/chapter01/ src/lib/research/` = empty).

**Key methodology decisions (documented on-site):**
- MHLW wage indices are growth-chains from published YoY (2020=100), excluding the
  documented Jan-2024 benchmark-update level jump (+2.6%) — see notes/mhlw-summary.md.
- Industry 3-sector shares derived from the 16-activity classification, verified
  against printed 経済活動計 totals.
- R&D ratio chain crosses GDP vintages at FY2014→15 (disclosed in chart note).

**Next safe actions for the owner:**
```bash
cd "/c/Users/guest177/Documents/GitHub/japan-clarity.github.io"
git fetch origin
git log --stat feature/chapter-02-economy-industry   # after branch transfer (bundle)
# review, then:
git push origin feature/chapter-02-economy-industry
# open: https://github.com/japan-clarity/japan-clarity.github.io/pull/new/feature/chapter-02-economy-industry
```
Do NOT merge before CI runs on the PR and the diff review is complete.

**Restart notes:** if the sandbox resets, re-create the worktree
`git worktree add /home/z/jc-ch02 feature/chapter-02-economy-industry`, hardlink-copy
`node_modules` from another worktree (bun rejects cross-root symlinks), and restart
`bun run dev` from the worktree. Re-run the three commands above to re-verify.

---

## Recovery checkpoint — Chapter 02 audit remediation (2026-10-25)

State: `feature/chapter-02-economy-industry` = 637688e (published PR tip, fetched and
verified identical to origin) **+ 2 corrective commits** (audit remediation; see
`docs/REMEDIATION-CH02-AUDIT.md`). Nothing pushed; the owner transfers the new
commits from the refreshed bundle and pushes to the EXISTING PR branch (fast-forward,
no force). Remediated state re-verified: extraction 107/0 (md5-identical output),
validate:research 523/0 (new [4c] OECD unit-metadata guards, negative-tested),
tsc/eslint clean, export 65/0, browser re-acceptance, Chapter 01 zero-diff.

Recovery bundle (full branch history including the corrective commits):
`/home/z/chapter-02-economy-industry-remediated.bundle` — verify with
`git bundle verify`, then in the origin clone:
`git fetch /path/to/chapter-02-economy-industry-remediated.bundle feature/chapter-02-economy-industry:audit-remediation`
and fast-forward/merge into `feature/chapter-02-economy-industry` before pushing.
If the sandbox resets: re-create worktree `git worktree add /home/z/jc-ch02
feature/chapter-02-economy-industry`, hardlink-copy `node_modules`, `bun install`,
`bun run dev`, and re-run `bun run validate:research && bun run typecheck &&
bun run lint && bun run export:static && bun run verify:export`.

---

## Recovery checkpoint — Chapter 01 independent research audit (2026-10-25)

State: `origin/main` = `d2fb85d` (Chapter 02 remediation merged via PR #2) **+ audit
branch `audit/chapter-01-research-methodology`** (based directly on `d2fb85d`, worktree
`/home/z/jc-ch01-audit`) containing the audit deliverables and one corrective change
set. Nothing pushed; the owner transfers the branch from the delivered bundle and
pushes it for PR review. Do NOT merge before CI and the diff review are complete.

Audit outcome (full report: `docs/CH01-INDEPENDENT-RESEARCH-AUDIT.md`; evidence
register: `docs/CH01-AUDIT-EVIDENCE-REGISTER.md`): 62 figure groups audited against
re-fetched primary sources — 59 PASS, 1 FAIL corrected (household-size 1980: 2.30 →
3.22, handbook Table 2.3; root cause: whole-handbook scan let Table 14.6's traffic
row overwrite the value), 1 INCONCLUSIVE remediated (the unverified "126,226,568"
2020 estimate in the census note/callout → replaced with the verified 2025
estimate-vs-census pair 123.21M / 122,972,528), 1 vintage disclosure added
(one-person 2020: handbook 38.1% vs census re-tabulation 38.0%).

Corrective changes: `extract-series.py` (Table 2.3-block-restricted parser + 13
anchors + monotonicity), `extracted-series.json` (single-point diff, 1980 only),
`generate-chapter-data.ts` + `data.ts` (audit header, 1980 = 3.22, new snapshot hash
`6fbecdf93dd73ea2`), `charts.ts` + `content-a.ts` (two remediated surfaces ×2
languages), `validate-research.ts` (new [4d]: 5 guards, negative-tested — corrupting
1980 → 2.3 fails 3 checks; reintroducing 126,226,568 fails the provenance guard).

Gates on the branch: extraction anchors all pass · validate:research **528/0** ·
tsc 0 · eslint clean · export 65/0 (17.3 MB) · browser re-acceptance complete
(household 3.22 JA+EN, chart⇄table ×3 desktop+mobile, hover/touch tooltips, range
filter, legend, keyboard, CSV `1980,3.22`, JA↔EN round trips, zero console errors) ·
Chapter 02 + theme + i18n + app shell zero-diff vs `d2fb85d` (proven).

Raw audit evidence (re-fetched official documents + WB transcript + pre-fix JSON
snapshot) lives in `research/chapter01/raw/audit-2026-10-25/` (workspace-only,
gitignored). Before/after screenshots are committed at
`research/ch01-audit-screenshots/`.

Next safe actions for the owner:
```bash
cd "/c/Users/guest177/Documents/GitHub/japan-clarity.github.io"
git fetch origin && git switch -c audit/chapter-01-research-methodology d2fb85d
git fetch /path/to/japan-clarity-ch01-audit.bundle audit/chapter-01-research-methodology:audit-import
git merge --ff-only audit-import        # inspect with git log --stat first
git push origin audit/chapter-01-research-methodology
# open: https://github.com/japan-clarity/japan-clarity.github.io/pull/new/audit/chapter-01-research-methodology
```
Do NOT merge before CI runs on the PR and the audit evidence is reviewed.

If the sandbox resets: re-create the worktree
`git worktree add /home/z/jc-ch01-audit audit/chapter-01-research-methodology`,
hardlink-copy `node_modules` from another worktree, `bun run dev`, and re-run
`python3 research/chapter01/scripts/extract-series.py && bun run generate:chapter-data
&& bun run validate:research && bun run typecheck && bun run lint && bun run
export:static && bun run verify:export`. The raw sources needed by the extractor are
re-fetchable from the official domains (URLs in the source register and in
`research/chapter01/notes/*.md`); the re-fetch script pattern is documented in the
audit report §2.2.

---

## Checkpoint 6 — Chapter 03: Housing & Cost of Living (2026-10-27)

Branch `feature/chapter-03-housing-cost-of-living` from `origin/main = f7e1fee`
(PR #3 merge). Two scoped commits: research pipeline + chapter module +
guards/docs (see `git log --stat` on the branch). Nothing pushed; no history
rewritten; Chapters 01/02 byte-identical to the audited baseline (verified by
`git diff f7e1fee --stat -- src/chapters/chapter-01 src/chapters/chapter-02
research/chapter01 research/chapter02` → empty).

Research architecture (mirrors ch01/ch02, new in `research/chapter03/`):
- `raw/{statb-housing,statb-fies,statb-cpi,oecd,mlit,review}/` — archived
  official documents (gitignored) with MANIFEST.tsv; `raw/review/` holds the
  independent reviewer's live re-fetches (25 files, ACCESS-LOG.md).
- `notes/{statb-housing,statb-fies-cpi,oecd-mlit}-{summary,inventory}.md` —
  verbatim-quoted source values with table anchors and checksums (committed).
- `notes/extracted-series.json` — anchored extraction output (sha256-16
  `66c6f5355fe7fcab`, pinned in data.ts + validate gate).
- `scripts/extract-series.py` — 1,656 anchor checks; block-scoped parsers with
  label anchors, 1973 double-row handling, era state machine for MLIT labels.
- `scripts/fetch-*.sh` — reproducible curl commands for every raw file.

Regenerate: `python3 research/chapter03/scripts/extract-series.py && bun run
scripts/generate-chapter-03-data.ts && bun run validate:research`.

Gates on the branch: extraction 1,656 anchors pass · validate:research
**940/0** (was 528; §[4e] +412 with 5 negative-tested guard families) · tsc 0 ·
eslint clean · contrast 58/0 · export **74/0** (18.6 MB) · browser acceptance
complete (5 chart⇄table round-trips incl. EN+mobile, hover+touch tooltips
verified against data, CSV attribution header, range filter, keyboard tabs,
JA↔EN + deep links, viewports 320–1440, Ch01/Ch02 spot regressions, clean
console; 16 screenshots at `research/ch03-screenshots/`) · independent
falsification review **20/20 PASS on live re-fetches** (CONDITIONAL GO →
its two one-word editorial conditions applied and re-verified → GO).

If the sandbox resets: re-create the worktree
`git worktree add /home/z/jc-ch03 feature/chapter-03-housing-cost-of-living`,
`bun install`, `bun run dev` (port 3000), then re-run the regenerate command
above and `bun run lint && bun run typecheck && bun run export:static && bun
run verify:export`. All raw sources are re-fetchable from the official domains
(URLs in the source register and `research/chapter03/notes/*.md`).

---

## Checkpoint 7 — Chapter 03 pre-merge audit + remediation (2026-10-26)

Independent pre-merge audit of the Chapter 03 feature branch (delivered tip
`b4f6c06`) performed in a fresh worktree with live re-fetches of every primary
source. Data layer: **100% PASS** (all data-module values re-verified against
freshly downloaded official files; extraction re-run was byte-identical,
sha256-16 `66c6f5355fe7fcab`). Narrative layer: **five demonstrated prose
defects** (RHP peak 1990/163.3 → 1991/165.8; PTI trough 2010/97.4 or
「2015年を底に」 → 2009/96.0; floor-area peak 2013/94.42 → 2003/94.85; FIES
2025 "above the 2000 level" → below; vacancy ≈4× misplaced onto the
post-1990s period → anchored to 1963→1993) — all corrected in commit
`37072e5` together with nine G9 regression guards (gate 940 → **949/0**,
negative-tested by re-injecting the old prose). Full record:
`docs/CH03-PREMERGE-INDEPENDENT-AUDIT.md` and
`docs/remediation-ledger-ch03.csv`.

Security/sanitization PASS (no secrets/env/PII/databases/dev artifacts in
tracked files; workflows untouched and policy-compliant). Clean-worktree
gates on `37072e5`: tsc 0 · eslint 0/0 · validate:research 949/0 · contrast
58/0 · export 74/0 (18.6 MB) · Ch01/Ch02 byte-identical to `f7e1fee`.
Browser verification: 13 figures JA/EN, five chart⇄table round-trips with
exact cells, hover+touch tooltips, CSV attribution, range filters, keyboard
tabs, JA↔EN + deep links, viewports 320–1440, sticky footer, 404, Ch01/Ch02
spot regressions, clean console. Release recommendation: **GO** (owner
imports `37072e5`, pushes the existing feature branch, CI re-runs green,
then merge approval).

If the sandbox resets: re-create the worktree
`git worktree add /home/z/jc-ch03 feature/chapter-03-housing-cost-of-living`,
`bun install`, `bun run dev` (port 3000), then re-run
`python3 research/chapter03/scripts/extract-series.py && bun run
scripts/generate-chapter-03-data.ts && bun run validate:research && bun run
lint && bun run typecheck && bun run export:static && bun run verify:export`.
The auditor's re-fetches reproduced the raw inputs byte-identically, so all
gates are re-runnable from the official domains alone.

---

## Checkpoint 8 — Chapter 04 (Labor & Working Conditions) development + pre-merge audit

Chapter 04 was built end-to-end on `feature/chapter-04-labor-working-conditions`
(from `origin/main = 5b3a847`) and audited in the same pass: anchored extraction
(192→196 checks), data generation (snapshot `7e27634ebb7e62c9`), 15 bilingual
figures across 10 sections, then the independent adversarial audit with live
re-fetches from e-Stat/MHLW/stat.go.jp/OECD SDMX (42-check fresh-parser
comparison vs the delivered data.ts).

Audit findings and remediation (all FIXED+VERIFIED, negative-tested):
- **D1** (data layer): LFS 1973 double-row — extraction kept the
  Okinawa-EXCLUDED row against its own documented convention; fixed to the
  included row (1973: employed 5,259 / rate 1.3 / self 970 / family 665 /
  employee 3,615 / 60-64 rate 56.9); guard G-N.
- **D2** (narrative): 契約社員・嘱託 2002 "355万" was 契約社員230 + その他125
  mislabeled (嘱託 is a separate category only since 2013); rewritten with the
  category-break disclosure; guard G-O.
- **D3**: 65+ employment-rate trough was claimed at "around 2000 / 約20%" —
  actual trough 19.2% in 2011; corrected (prose + chart description, JA+EN);
  guard G-P.
- **D4**: unverifiable student-excluded 24.3% claim (no published 2025 value;
  series ends 2022) removed; guard G-Q.
- **D5**: EN attached the 1.9% unemployment value to 1973 instead of 1975;
  corrected; guard G-R.
- Guard hardening from negative testing: G-L (prose-number allow-list for
  mental-comp) and G-M (survey-year framing) closed two discovered gaps; the
  gate grew 1345 → **1358 checks, 0 failures**, with 11 negative fixtures
  (N1–N11) all failing as designed.

Gates on the final tip: tsc 0 · eslint 0/0 · validate:research 1358/0 ·
contrast 58/0 · export 80/0 (20.4 MB) · Ch01–Ch03/components/lib zero-diff vs
`5b3a847`. Browser verification: 15 figures JA/EN, five chart⇄table
round-trips with exact cells (unemployment 1973 = 1.3 post-fix), tooltips,
CSV attribution, keyboard, range filters, JA↔EN, deep links, 320–1440 px,
sticky footer, 404, Ch01–03 regressions (Ch01 1980 = 3.22 re-confirmed),
clean console. Security/sanitization PASS (raw/ gitignored per
DATA-LICENSES; workflows untouched, validation-only CI + main-only deploy).
Full record: `docs/CH04-PREMERGE-INDEPENDENT-AUDIT.md`,
`docs/remediation-ledger-ch04.csv`, `research/chapter04/notes/` (audit
findings, negative tests, browser verification). Release recommendation:
**GO**.

If the sandbox resets: re-create the worktree
`git worktree add /home/z/jc-ch04 feature/chapter-04-labor-working-conditions`,
`bun install`, then re-run `python3 research/chapter04/scripts/extract-series.py
&& bun run scripts/generate-chapter-04-data.ts && bun run validate:research &&
bunx tsc --noEmit && bunx eslint src scripts && bun run export:static && bun run
verify:export`. The auditor's re-fetches (OECD byte-identical; e-Stat/MHLW
re-parsed fresh) are documented in `research/chapter04/notes/audit-findings.md`.

## Checkpoint 9 — Chapter 05 (Education & Talent) development + pre-merge audit

Chapter 05 was built end-to-end on `feature/chapter-05-education-talent`
(from `origin/main = a4fefde`) and audited in the same pass: anchored
extraction (**991 checks / 0 failures**, snapshot `b223943072ca13e2`), data
generation (47 exports), **16 bilingual figures across 10 sections, 11
source records**, then the independent adversarial audit with live
re-fetches from mext.go.jp / nier.go.jp / e-Stat / OECD SDMX (fresh-parser
comparison vs the delivered data.ts).

Coverage highlights: PISA full trend 2000–2025 including the **2025 cycle
(published 2026-09-08: Japan science 538 / reading 503 / math 525 — first
among OECD-38 in all three domains; reading −13 significant)**, science
proficiency distributions, questionnaire measures (life satisfaction,
belonging, family support, ICT use); 生徒指導調査 R6 (いじめ 769,022 /
不登校 353,970 / 新規 153,828 first decline in 9 years / 自殺 413 with the
5.6% investigation caveat / ネットいじめ 27,365); the **34-year nonattendance
series joining the 1991–2013 K014 basis with the 2014+ unified basis**
(junction gap 122,650 vs 122,897 disclosed); 学校基本調査 long-run tables
(進学率 1950–, 大学在籍 1948–, 専修 1976–), R7 確報 headlines (61.4 /
85.4 / 14.4 / 13.8) and R8 速報 labeled preliminary; 学習費 R5 by stage and
sector; PIAAC Round 1 (296/288/294; equity 129 vs 152) with **Round 2
(2023) disclosed as INCONCLUSIVE** — unverifiable from any accessible
primary channel (attempts documented); OECD EAG via SDMX (attainment 9
economies 1995–2025, per-FTE-student PPP by level, employment by
attainment with the absent JPN 0T2 rows disclosed, ECEC 3–5).

Audit findings and remediation:
- **R1** (fixed pre-delivery): a negative-test residue in the pristine
  charts.ts JA note ("OECD平均は図に表示した国の平均値である") was caught by
  the N12 guard during the pre-audit gate run; corrected to the member-
  average wording matching the EN note.
- **A0** (auditor-side): the audit script's first SDMX query used a flow id
  missing the `_EA` suffix (HTTP 404) and its first comparison keyed live
  rows without the AGE dimension (25–34 overwrote 25–64); both fixed in the
  audit tooling — the delivered chapter data was correct throughout
  (58/58 live values matched after the fix).
- No data-value or narrative defects found: every independently re-parsed
  value (SDMX 58, PDF anchors いじめ/不登校/自殺/新規/ネット/PISA 2025
  headline+CIs+−13 significance/R7 headline/学習費×6/PIAAC×8) matched the
  delivered series exactly.

Guard hardening: validate-research.ts grew to **1,866 checks / 0 failures**
([5f] section incl. negative-test-hardened round-2 guards); the negative
suite N1–N12 (+N3b) — **13/13 fixtures CAUGHT** with byte-identical
restore, including two historical defect classes per lesson bank (Ch01
contamination, Ch02 unit conflation, Ch03 narrative-peak fabrication, Ch04
category/basis error) plus PIAAC-fabrication, bilingual year mismatch,
record-year, significance erasure, series-basis erasure, score-to-percent,
school-level contamination, and OECD-average recompute claims.

Gates on the final tip: tsc 0 · eslint 0/0 · validate:research **1866/0** ·
contrast 58/0 · export verify **94/0 (22.1 MB)** · Ch01–04/lib/app
**zero-diff** vs `a4fefde` (diff touches only ch05 files + registry/config
status + validate/verify scripts + package.json scripts). Browser
verification (agent-browser): JA/EN render, chart⇄table round-trip (77-row
long series), range filters, CSV blob download, deep links, 320–1440 px no
overflow, sticky footer (short pages perfect-stick; long pages natural
push), Ch01–04 regressions clean, zero console errors. Sanitization PASS
(no secrets/keys/absolute paths; raw/ gitignored per DATA-LICENSES;
workflows untouched). Full record: `docs/CH05-PREMERGE-INDEPENDENT-AUDIT.md`,
`docs/remediation-ledger-ch05.csv`, `research/chapter05/notes/` (oecd /
estat-mext summaries, audit findings, negative tests, browser
verification). Release recommendation: **GO**.

If the sandbox resets: re-create the worktree
`git worktree add /home/z/jc-ch05 feature/chapter-05-education-talent`,
`bun install`, then re-run `python3 research/chapter05/scripts/extract-series.py
&& bun run scripts/generate-chapter-05-data.ts && bash
research/chapter05/scripts/negative-tests.sh && bun run validate:research &&
bunx tsc --noEmit && bunx eslint src scripts && bun run export:static && bun run
verify:export`. The auditor's re-fetches (six MEXT/NIER PDFs byte-identical;
OECD SDMX live values matching the archive) are documented in
`research/chapter05/notes/audit-findings.md`.
