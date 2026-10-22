# Japan Clarity — Pre-Publication Security & Git Deployment Remediation

**Date:** 2026-10-22 (remediation session, immediately following the delivery session)
**Scope:** security history purge, repository minimization, independent
re-verification, research attribution audit, and remote-history reconciliation
— producing release candidate **v1.0.0-rc1**.
**Constraint honored:** dual-mode Next.js architecture, all validated research,
and the 14-chapter modular structure are preserved; no Chapter 02 work was
started.

---

## 1. Findings → actions (review item by review item)

### 1.1 `.env` tracked in Git history (SECURITY — fixed)

- **Finding confirmed.** `.env` (containing a `DATABASE_URL` entry whose
  value was a local development database file URL — the literal value is
  deliberately omitted from this public report) was tracked in the initial
  commit `69507c9` and still present at `HEAD`, despite `.env*` being listed
  in `.gitignore` (the file was added before the ignore rule could protect
  it).
- **Action.** The full local history was rewritten before any push or remote
  contact (the repository had **no configured remote** and has never been
  pushed, so no force-push was ever needed):

  ```bash
  FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch \
    --index-filter 'git rm -r --cached --ignore-unmatch .env download research/reference-inspection/raw' \
    -- main
  # then: refs/original/* deleted, reflogs expired, git gc --prune=now
  ```

- **Verification (post-rewrite):**
  - `git log --all --oneline -- .env` → **0 commits**
  - `git grep -F '<the literal DATABASE_URL value>' $(git rev-list --all)` → **0 matches**
  - no `.env` path in any reachable tree → **0**
  - `.env` remains on the local disk only (untracked, `.env*` ignored).
- **Pre-rewrite safety backup:** a git bundle of the original history
  (`pre-remediation.bundle`, kept under a workspace-host directory whose
  environment-specific absolute path is recorded only in the private
  development workspace) plus copies of `.env`, `download/`, and
  `research/reference-inspection/raw/` — kept **outside** the repository, on
  the development workspace host only.

### 1.2 Repository/remote reconciliation (no force-push)

- **Local state found:** 3 commits ending at `722cec4`, single branch `main`,
  **no `origin` remote**, no tags.
- **Remote state found (read-only fetch):**
  `https://github.com/japan-clarity/japan-clarity.github.io` has exactly one
  commit `9e8e68e` ("Initial commit") containing a 2-line `README.md`
  (title + one-sentence description). No branches other than `main`, no
  workflows, no license, no CNAME. The live Pages site still serves the
  Jekyll-rendered README ("deploy from branch" mode).
- **Reconciliation performed locally (reviewable, non-destructive):**
  1. History was rewritten first (§1.1), so the pushed history will never
     contain `.env`.
  2. `origin` was added and the remote fetched — remote commit `9e8e68e`
     preserved as `origin/main`.
  3. `origin/main` was merged into the remediated `main` with
     `--allow-unrelated-histories`. The only collision was `README.md`
     (added independently on both sides); resolved to the project README,
     which preserves the remote's title and description line **verbatim**
     (its first three lines). The remote commit remains an ancestor of the
     merge — **nothing was overwritten, no force-push is required** (the push
     is a normal fast-forward from `9e8e68e`).
- **What the owner should review before pushing:** `git log --graph --oneline
  --all`, `git show` on the merge commit, and `git diff 9e8e68e..HEAD --
  README.md` (shows the README extended, not replaced).

### 1.3 Repository minimization

| Removed | Where | Rationale |
|---|---|---|
| `.env` | entire history + HEAD | environment file must not be public (§1.1) |
| `download/` | entire history | scaffold folder from the initial template commit |
| `research/reference-inspection/raw/` (38 entries, 14 MB) | entire history + HEAD | archived copies of **third-party websites** (HTML/CSS/README copies of Taiwan Forward, Global Food Crisis, Remember to Prevent, plus GitHub API JSON). No redistribution permission exists for the site copies; retained in the dev workspace only. The observation summary (`research/reference-inspection/summary.md`) — our own factual access log — is kept. |
| `.zscripts/` (9 files incl. `dev.pid`), `Caddyfile`, `mini-services/`, `scripts/dev-daemon.py` | HEAD (files remain locally, now gitignored) | sandbox/environment tooling, not project artifacts. Notably a stale PID file was tracked in git. |
| `prisma/schema.prisma`, `src/lib/db.ts`, `db:*` scripts, `prisma` + `@prisma/client` deps | HEAD + disk | the site is fully static; no database layer is used anywhere |
| `tailwind.config.ts` + `tailwindcss-animate` | HEAD + disk | dead Tailwind v3 config; the v4 theme lives in `src/app/globals.css` (`@theme inline`) and nothing references the file |
| 42 unused shadcn/ui components; `use-toast` / `use-mobile` hooks | HEAD + disk | the app imports exactly 6 primitives: button, dropdown-menu, sheet, skeleton, separator, tabs |
| 54 npm dependencies | `package.json` / `bun.lock` | dnd-kit, prisma, next-auth, next-intl, next-themes, recharts, sonner, vaul, cmdk, @mdxeditor, @tanstack/*, zustand, zod, react-hook-form, sharp, uuid, z-ai-web-dev-sdk, etc. — none imported anywhere |

**Dependency surface: 67 → 13 runtime packages (+9 dev).** `bun.lock` shrank
by 966 lines. Research pipeline untouched: `research/chapter01/notes/`
(incl. `extracted-series.json`), `scripts/` (extract → generate → validate →
export → verify), and the CC BY 4.0 World Bank API responses under
`research/chapter01/raw/worldbank/` all remain committed.

**Redistribution permissions (new doc):** `research/DATA-LICENSES.md` now
states, per category, what is redistributed and under which terms (World Bank
CC BY 4.0 with attribution; Japanese government figures reproduced as
facts/short quotes with source attribution; raw government PDFs and
third-party site archives never redistributed).

### 1.4 Independent re-verification (all gates re-run from scratch)

| Check | Command | Result (this session) |
|---|---|---|
| Install/lockfile | `bun install` | 7 installed, **54 removed**, lockfile −966 lines |
| TypeScript | `bunx tsc --noEmit` | **0 errors** |
| ESLint | `bun run lint` | **0 errors, 0 warnings** |
| Research integrity | `bun run validate:research` | **259 checks, 0 failures** |
| Static export | `bun run export:static` | 42 HTML files / 35 routes prerendered, no errors |
| Export verification | `bun run verify:export` | **57 checks, 0 failures (8.4 MB)** |
| Dev server (Mode A) | `curl` before/during/after export | **200** throughout |

Browser regression (agent-browser / Chromium, re-run in full):

- `/` → `/ja/` redirect; `ja-JP` default; 日本語 left / English right.
- **Japanese ⇄ English switching**: home and Chapter 01 deep link both
  preserved across ja → en → ja round trips; `html lang` and titles update
  (`ja-JP | 01 人口・家族…` ↔ `en | 01 Population & Family…`).
- **11 chart canvases** render on Chapter 01 (desktop and mobile).
- **Chart → Table → Chart ×3 (desktop)**: census chart table shows 22 rows,
  births/deaths table shows 124 rows; canvas count restores 11/11 every time;
  first canvas `toDataURL()` length **identical before/after** (42,126 =
  42,126) — pixel-level restoration.
- **Chart → Table → Chart ×3 (mobile 375×667)**: 22-row table each time,
  canvases restored 11/11 each time.
- **Mobile chart interaction**: touch-type pointer events produce the
  localized tooltip with verified values (`1960 | 総人口（国勢調査） |
  94,301,623`); mobile Sheet menu opens/closes.
- **Range filters**: `1990年以降` flips `aria-pressed` and updates the chart.
- **Footer**: pinned exactly to viewport bottom on a short page at
  1440×1400 (footer bottom == 1400); pushed naturally below content on the
  22,077 px chapter page.
- **Overflow**: none at 1440, 375, and 320 px.
- **Console**: **zero errors**; only pre-existing benign dev warnings
  (smooth-scroll hint, ECharts `containLabel` deprecation log, Radix
  `DialogContent` description hint). The two historical 500s near the top of
  `dev.log` predate the original delivery's Callout fix and do not recur.
- Screenshots: `research/verification-screenshots/remediation-{desktop,mobile}
  -ch01-ja.png`, `remediation-desktop-footer-sticky.png`.

### 1.5 Preserved (no regression to architecture or scope)

- Dual-mode Next.js config unchanged (`next.config.ts`: Mode A dev preview +
  Mode B `output: "export"` with isolated `.build-export` distDir).
- 14-chapter registry and all Chapter 01 research intact; Chapters 02–14
  remain honest placeholders — **no Chapter 02 work performed**.
- `ci.yml` / `deploy.yml` unchanged (least-privilege, no secrets, no CNAME).

### 1.6 2025 statistics attribution audit (independent read-only audit R-2)

A full audit of every 2025-vintage figure against the archived research notes
found **16 figure groups: 14 PASS, 2 copy-level factual errors (both JA and
EN), 5 minor attribution nits**. All were fixed in commit
`fix(research): …`:

| Issue | Fix |
|---|---|
| Natural decrease described as "largest on record" for 2025 (−918,263) | Corrected: the record is **2024's −919,205** ("過去最大の減少" per MHLW final counts); 2025 narrowed slightly |
| TFR chart description: "fell from 4.54 in **1949**" | Corrected to **1947** (4.54 is the 1947 value; 1949 = 4.32) |
| IPSS 2023 round "published December 2023" (unverifiable) | Aligned to the verified date **2023-04-26** in content and source register |
| May-2026 foreign residents (3.97 M) paired with the census 3.1% share | Corrected to **≈3.2%** (May-2026 basis) |
| Age-structure approximations tracked the World Bank series | Made census-consistent (≈ just under 60% / ≈11% / ≈30%) |
| `ch01-one-person` omitted `ipss-household-2024` from `sourceIds` | Added (the chart note cites its 44.3%-by-2050 projection) |

**Attribution confirmed correct (no change needed):** all 12 series carrying
2025/2026 values match `extracted-series.json` byte-for-byte; every `sourceId`
resolves (13/13); the final 確定数 values are used (never the June 概数
preliminaries); the 2025 census **Basic Complete Tabulation** (2026-09-29) is
used, never the May preliminary counts; and the official revision caveats are
retained in both languages:

- 2025 TFR 1.14 is provisional in character — MHLW will recalculate rates
  with the 2025 Census population in **November 2026** (may revise the value).
- Population Estimates distinguish 概算 (provisional) vs 確定値 (final), and
  the benchmark switches to the 2025 census from the **November 2026 report**.
- 65+ 29.6% (Statistics Topics No.149, Sept-15 basis) vs 29.4% (census,
  Oct-1 basis) both appear with the 0.1–0.3 pp reference-date caveat.
- IPSS projections labeled as scenarios everywhere, with assumption-dependent
  high/low bounds disclosed.

---

## 2. Commit mapping (history rewrite)

| Old (superseded, exists only in the local backup bundle) | New (release candidate history) | Subject |
|---|---|---|
| `69507c9` | `4e43682` | Initial commit |
| `20c246b` | `5ab80fe` | Foundation + Chapter 01 |
| `722cec4` | `afe257e` | Verification, workflows, docs |
| — | `3771b7a` | chore: remove development-environment scaffold |
| — | `421d187` | chore: remove unused scaffold dependencies and UI components |
| — | `7a64b7a` | fix(research): correct two factual copy errors and attribution nits |
| — | `ccdb3ba` | docs: pre-publication remediation report, data licensing, deployment update |
| — | `a3d5668` | Merge remote initial README history into remediated main (remote `9e8e68e` preserved as ancestor) |

Release tag: **`v1.0.0-rc1`** (annotated, at the tip of `main`).

> If any old-hash references exist elsewhere (e.g., in old notes), the mapping
> above is authoritative. The old objects were removed with
> `git gc --prune=now`; the only remaining copy of the pre-remediation
> history is the backup bundle in the development workspace host, outside the
> repository.

## 3. Deployment status (honest)

- **No push was performed and no deployment is claimed.** This environment
  has no GitHub credentials (no `gh` CLI, no credential helper, no tokens).
- The release candidate is fully prepared locally, including the remote
  reconciliation merge, so the owner's push is a normal (non-force) push.
- Follow `docs/DEPLOYMENT.md` (updated this session): review → push →
  switch Pages source to GitHub Actions → independently verify the live
  Actions run and the deployed site.
