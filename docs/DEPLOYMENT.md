# Japan Clarity — Deployment Guide

Target repository (already created by the project owner):
**https://github.com/japan-clarity/japan-clarity.github.io** (Organization
Pages repository → site served at **https://japan-clarity.github.io/** from
the repository root).

The custom domain `japan-clarity.com` has **not** been purchased. There is
no `CNAME` file and no custom-domain configuration anywhere in this
repository, and none should be added until a domain is actually owned.

> This guide was updated during the pre-publication remediation (see
> `docs/REMEDIATION.md`): the local history was rewritten to purge the
> tracked `.env`, and the remote's initial README commit (`9e8e68e`) has
> already been merged locally — so the push below is a **normal,
> non-force push**.

## One-time repository setup (GitHub web UI)

1. Open **Settings → Pages** in the repository.
2. Under *Build and deployment → Source*, select **GitHub Actions**
   (not "Deploy from a branch").
3. (Recommended) **Settings → Actions → General → Workflow permissions**:
   set to "Read repository contents and packages permissions", and allow the
   workflows in this repository (they declare their own least-privilege
   permissions).
4. (Recommended) **Settings → Branches** → protect `main`: require the `CI`
   workflow to pass before merging.

## Publishing from the development workspace (Git Bash)

This environment could not push to GitHub (no credentials were provided, and
none were requested). The release candidate is prepared on `main`, **already
containing the reconciliation merge** with the remote's initial commit.
From the machine holding this project folder:

```bash
cd /path/to/my-project

# 1. Review what will be pushed (no force-push is involved)
git log --graph --oneline --all          # shows the merge with 9e8e68e
git diff 9e8e68e..HEAD -- README.md      # README extended, description preserved
git show <merge-commit>                   # the reconciliation itself

# 2. Final sanity check (optional but recommended)
bun install --frozen-lockfile
bunx tsc --noEmit && bun run lint && bun run validate:research
bun run export:static && bun run verify:export

# 3. Connect to the existing repository (remote may already be configured)
git remote add origin https://github.com/japan-clarity/japan-clarity.github.io.git
#    (or: git remote set-url origin … if a remote already exists)
git fetch origin

# 4. Confirm the remote has not moved since the merge was prepared
git log --oneline origin/main            # expect: 9e8e68e Initial commit

# 5. Push main (normal push — the merge makes it a fast-forward of 9e8e68e)
git push -u origin main
git push origin v1.0.0-rc1               # optional: the annotated release tag
```

**If the remote has changed since the merge was prepared** (new commits on
`origin/main`): do **not** force-push. Instead run
`git merge origin/main`, review the result, resolve any conflicts (keep our
README, which preserves the original description line verbatim), and push the
new merge commit.

The original repository README content is preserved verbatim at the top of
this project's `README.md` (title + description line). Local commit
authorship is set to "Japan Clarity Build" — amend with
`git commit --amend --reset-author` if personal attribution is preferred
before pushing. For the record: the pre-remediation commit hashes
(`69507c9`, `20c246b`, `722cec4`) were superseded by the security rewrite;
the mapping is documented in `docs/REMEDIATION.md` §2.

What is *not* committed (by design, see `.gitignore` and
`research/DATA-LICENSES.md`): build outputs (`.build-export/`), environment
files, the dev log and internal workspace files, sandbox tooling, raw copies
of Japanese government documents, and archived third-party reference-site
content. World Bank API responses (CC BY 4.0, with attribution) *are*
committed for reproducibility, along with all extraction/validation scripts
and research notes.

## What happens on push

`deploy.yml` runs on every push to `main` (and via manual *Run workflow*):

1. checkout → install Bun → `bun install --frozen-lockfile`
2. `bunx tsc --noEmit` → `bun run lint` → `bun run validate:research`
3. `bun run export:static` (static export into `.build-export/`, plus the
   root redirect and 404 pages)
4. `bun run verify:export` (57 artifact checks)
5. upload `.build-export/` as the Pages artifact → `actions/deploy-pages@v4`

`ci.yml` runs the same gates (plus an inspection artifact upload) on pull
requests and non-main pushes, without any deployment permission.

## Verify the deployment (required before calling it done)

1. Open **Actions** in the repository and wait for the "Deploy to GitHub
   Pages" run triggered by your push: both jobs (`Build static export`,
   `Deploy to GitHub Pages`) must show green. Open the run log and confirm
   the gates actually executed (tsc / lint / 259-check research gate /
   57-check export verification).
2. Open **https://japan-clarity.github.io/** — it should land on the Japanese
   homepage (root redirect → `/ja/`).
3. Spot-check: `/en/`, a chapter deep link with a hard refresh
   (`/ja/chapters/population-family/`), and a chart's table view
   (Chart ⇄ Table round trip).
4. If anything fails: fix locally, commit, push again — never force-push.

The `NEXT_PUBLIC_SITE_URL` default (`https://japan-clarity.github.io`)
matches the live origin for canonicals/sitemap; if you ever serve the site
elsewhere, override that variable at build time.

## Verification status

- Mode A (dev preview): verified working in the development environment,
  including after the dependency minimization (re-verified 2026-10-22).
- Mode B (static export): build + artifact verified (57 checks, 0 failures,
  8.4 MB; 42 HTML files) — re-verified from scratch after remediation.
- The GitHub Actions deployment itself has **not** been executed from this
  environment (no write credentials) — follow the steps above to deploy, and
  verify the live run and site as described above before announcing the
  launch.
