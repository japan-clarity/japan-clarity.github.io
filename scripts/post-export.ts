/**
 * Japan Clarity — static export post-processing.
 *
 * Runs after `DEPLOY_TARGET=github-pages next build`. Static export does not
 * emit redirect pages, so this script writes:
 *
 *  - `.build-export/index.html` — a tiny meta-refresh page sending `/` to the default
 *    locale `/ja/` (with a link fallback and noscript content). Deterministic
 *    and reliable on GitHub Pages.
 *  - `.build-export/404.html` — a bilingual standalone not-found page with links to
 *    both locales.
 *
 * Usage: bun run scripts/post-export.ts
 */

import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(import.meta.dir, "..", ".build-export");

if (!existsSync(resolve(OUT, "ja", "index.html"))) {
  console.error("post-export: .build-export/ja/index.html not found — did the export run?");
  process.exit(1);
}

const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0;url=/ja/">
<link rel="canonical" href="/ja/">
<title>Japan Clarity — ジャパン・クラリティ</title>
<style>body{background:#F6F2EA;color:#5C5A57;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}main{font-family:system-ui,-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif;text-align:center;padding:2rem}a{color:#4E685E}</style>
</head>
<body>
<main>
<p lang="ja">ジャパン・クラリティへようこそ。<a href="/ja/">日本語版へ進む</a></p>
<p lang="en">Welcome to Japan Clarity. <a href="/en/">Continue in English</a></p>
<noscript><meta http-equiv="refresh" content="0;url=/ja/"></noscript>
</main>
</body>
</html>
`;

const notFoundHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Japan Clarity / ジャパン・クラリティ</title>
<style>body{background:#F6F2EA;color:#5C5A57;font-family:system-ui,-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}main{text-align:center;padding:2rem;max-width:32rem}a{color:#4E685E}h1{color:#2B2B2B;font-size:1.25rem;margin:0 0 1rem}</style>
</head>
<body>
<main>
<h1 lang="ja">ページが見つかりません</h1>
<p lang="ja"><a href="/ja/">ホーム（日本語）へ戻る</a></p>
<h1 lang="en">Page not found</h1>
<p lang="en"><a href="/en/">Back to home (English)</a></p>
</main>
</body>
</html>
`;

writeFileSync(resolve(OUT, "index.html"), indexHtml, "utf-8");
writeFileSync(resolve(OUT, "404.html"), notFoundHtml, "utf-8");
console.log("post-export: wrote .build-export/index.html (redirect → /ja/) and .build-export/404.html");
