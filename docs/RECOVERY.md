# Japan Clarity — Recovery Checkpoint

**Checkpoint date:** 2026-10-23 (post-launch QA session; prior checkpoints
2026-10-22 below)
**Release:** `v1.0.0-rc1` — **DEPLOYED and LIVE** at
https://japan-clarity.github.io/ (deploy workflow run `39837722570`, commit
`be76c6a`, completed successfully 2026-10-22T19:10:08Z).
**State:** production verified end-to-end by post-launch QA
(`docs/POST-LAUNCH-QA.md`); three low-severity defects confirmed on the live
site and fixed as scoped **local** commits awaiting owner review — **not yet
pushed** (no authorization to push from this environment).

## Current git state (2026-10-23)

```
1334791 fix(a11y): enlarge footer navigation link touch targets      \ local,
9aa6578 fix(seo): share page-specific titles on X/Twitter cards       \ not
b8a68bb fix(a11y): localize the mobile sheet close button label       / pushed
be76c6a (origin/main, deployed) docs: sanitize environment-specific…
```

- Working tree: clean apart from this checkpoint/docs commit.
- Local-only git config: `core.filemode=false` (sandbox filesystem sets
  executable bits; content hashes verified identical — not a repo change).
- Dev server: `bun run dev` on port 3000 (started with `nohup` this session;
  `scripts/dev-daemon.py` no longer exists in the workspace).

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
2. Owner review + push of the three post-launch QA fix commits (see above).
3. After the MHLW November 2026 recalculation of 2025 rates/TFR: update the
   TFR figure and note (re-run `extract-series.py` → `generate-chapter-data.ts`
   → `validate:research`; the anchors will need updating to the revised
   values — that is intentional friction).
4. Begin Chapter 02 — Economy & Industry research using the same pipeline
   (add `src/chapters/chapter-02/`, register, gate, publish with limitations).
5. Optional: add a LICENSE file (owner's choice), and enable branch
   protection requiring the CI workflow (recommended in the QA report —
   owner decision).

## Resuming after an interruption

- Dev server in this sandbox: `bun run dev` (port 3000; log at `dev.log`).
  The historical `scripts/dev-daemon.py` wrapper no longer exists in the
  workspace — start the dev server directly. NOTE: it remains a
  **workspace-only** concern (gitignored), not part of the public repository.
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
