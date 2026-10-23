# Japan Clarity — Post-Launch Minimal Remediation

**Date:** 2026-10-23
**Scope:** three low-severity defects confirmed on the live production site
during post-launch QA (`docs/POST-LAUNCH-QA.md` §6). Each fix is a scoped,
reviewable local commit on top of the deployed `be76c6a`. **No push has been
performed** — deployment requires owner authorization (commands in §5).

Research datasets, chapter content, and the dual-mode architecture are
untouched. All gates re-ran green after the fixes (§4).

---

## QA-F1 — Mobile sheet close button: English accessible name on JA pages

- **Severity:** Low (a11y / i18n)
- **Where observed:** live production, `/ja/` at 390 px (also present at all
  viewports whenever the Sheet is open)
- **File/line:** `src/components/ui/sheet.tsx:77` — hardcoded
  `<span className="sr-only">Close</span>`; the localized dictionary key
  `nav.closeMenu` (ja: メニューを閉じる / en: Close menu) existed but was
  applied only to the burger trigger, not the built-in close button.
- **Impact:** screen readers announced English inside an otherwise
  all-Japanese dialog.
- **Fix (commit `b8a68bb`):** added an optional `closeLabel` prop to
  `SheetContent` (default `"Close"` preserves the shadcn/ui baseline);
  `site-header.tsx` passes `ui.nav.closeMenu`.
- **Verified:** dev preview at 390 px — accessible name is now
  「メニューを閉じる」 (ja) / "Close menu" (en); localized string present in
  the rebuilt static export's client bundle.

## QA-F2 — X/Twitter cards showed the generic site title on chapter pages

- **Severity:** Low (SEO / social sharing)
- **Where observed:** live production — `/ja/chapters/population-family/`
  rendered page-specific `og:title` ("01 人口・家族 — ジャパン・クラリティ")
  but a site-generic `twitter:title` ("ジャパン・クラリティ — …tagline").
- **File/line:** `src/app/[locale]/layout.tsx:51-55` — layout-level
  `twitter.title/description` always won because pages never define
  page-level `twitter` metadata.
- **Impact:** sharing a chapter URL on X advertised the site title instead
  of the chapter.
- **Fix (commit `9aa6578`):** removed the explicit `twitter.title`/
  `twitter.description` from the layout, keeping `card: "summary"`.
  Next.js then resolves `twitter:title/description` from the page-specific
  `og:title/og:description`.
- **Verified in the rebuilt export:**
  - `/ja/chapters/population-family/` → `twitter:title` = `01 人口・家族 — ジャパン・クラリティ` (page-specific)
  - `/ja/` → `twitter:title` = site-level title (correct for the homepage)

## QA-F3 — Footer navigation link targets below the WCAG 2.5.8 minimum

- **Severity:** Low (WCAG 2.2 AA, target size 2.5.8)
- **Where observed:** live production, 390 px — the three footer links
  (調査方法 / データと出典 / GitHubリポジトリ) rendered 358×16 px
  (all other 32 interactive elements passed ≥ 24 px).
- **File/line:** `src/components/shared/site-footer.tsx:44-54` — `text-xs`
  links without vertical padding.
- **Fix (commit `1334791`):** added `py-2` to the three links → 32 px tall
  targets.
- **Verified:** dev preview at 390 px — all footer links now 32 px; no
  layout regression (footer remains pinned on short pages).

## Deliberately NOT fixed (scope discipline)

- Radix dev-mode advisory "Missing Description for DialogContent" — the
  dialog is properly named via its title; production builds strip the
  advisory. No user-facing failure demonstrated.
- Missing `og:image` — would require designing a share image asset (new
  content decision for the owner, not a defect).
- Branch protection / PR policy — repository settings are owner decisions;
  recommended in the QA report.

## Full gate re-run after fixes (2026-10-23)

| Check | Result |
|---|---|
| `bunx tsc --noEmit` | 0 errors |
| `bun run lint` | 0 errors, 0 warnings |
| `bun run validate:research` | 259 checks, 0 failures |
| `bun run export:static` | 42 HTML files, success |
| `bun run verify:export` | 57 checks, 0 failures (8.4 MB) |
| Dev-preview browser smoke | 11 canvases, no overflow, correct JA/EN titles |
| Production-live regression of unaffected features | chart⇄table ×3, tooltips, filters, legend, keyboard, CSV — all still pass (tested on the live site this session; the fixes touch none of those paths) |

## Git state (local, awaiting review)

```
1334791 fix(a11y): enlarge footer navigation link touch targets
9aa6578 fix(seo): share page-specific titles on X/Twitter cards
b8a68bb fix(a11y): localize the mobile sheet close button label
be76c6a (origin/main) docs: sanitize environment-specific values from public documentation
```

`origin/main` is untouched; the three commits are a normal fast-forward
when the owner chooses to push.
