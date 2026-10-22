# Japan Clarity — Deployment Guide

Target repository (already created by the project owner):
**https://github.com/japan-clarity/japan-clarity.github.io** (Organization
Pages repository → site served at **https://japan-clarity.github.io/** from
the repository root).

The custom domain `japan-clarity.com` has **not** been purchased. There is
no `CNAME` file and no custom-domain configuration anywhere in this
repository, and none should be added until a domain is actually owned.

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
none were requested). From the machine holding this project folder:

```bash
cd /path/to/my-project

# 1. Final sanity check (optional but recommended)
bun install --frozen-lockfile
bunx tsc --noEmit && bun run lint && bun run validate:research
bun run export:static && bun run verify:export

# 2. Connect to the existing repository (preserve its README history)
git remote add origin https://github.com/japan-clarity/japan-clarity.github.io.git
#    (or: git remote set-url origin … if a remote already exists)

# 3. Push main
git push -u origin main
```

The repository's current README content is preserved at the top of this
project's `README.md`; the initial template commit in the local history is
`69507c9`. Local commit authorship is set to "Japan Clarity Build" — amend
with `git commit --amend --reset-author` if personal attribution is preferred
before pushing.

What is *not* committed (by design, see `.gitignore`): build outputs
(`.build-export/`), the dev log and internal workspace files, the sandbox
template folders, and the raw copies of Japanese government PDFs/HTML
(redistribution kept to summaries, quotes, and links; World Bank API
responses under CC BY 4.0 *are* committed for reproducibility).

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

After the first successful run, verify **https://japan-clarity.github.io/**
loads the Japanese homepage, then spot-check `/en/`, a chapter deep link with
a refresh, and a chart's table view. The `NEXT_PUBLIC_SITE_URL` default
(`https://japan-clarity.github.io`) then matches the live origin for
canonicals/sitemap; if you ever serve the site elsewhere, override that
variable at build time.

## Verification status

- Mode A (dev preview): verified working in the development environment.
- Mode B (static export): build + artifact verified (57 checks, 0 failures);
  the GitHub Actions deployment itself has **not** been executed from this
  environment (no write credentials) — follow the steps above to deploy.
