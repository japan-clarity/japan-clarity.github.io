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
