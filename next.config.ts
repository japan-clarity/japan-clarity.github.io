import type { NextConfig } from "next";

/**
 * Japan Clarity — dual-mode Next.js configuration.
 *
 * Mode A (default, GLM development preview): standard `next dev` on port 3000.
 *   A dev-only redirect sends `/` to the default locale `/ja/`.
 *
 * Mode B (production static export): `DEPLOY_TARGET=github-pages next build`
 *   - `output: "export"` produces a fully static `out/` directory.
 *   - `distDir` is isolated as `.build-export` so a production export can never
 *     clobber the development server's `.next` directory.
 *   - No redirects are registered in this mode; `scripts/post-export.ts`
 *     writes `out/index.html` (meta-refresh to `/ja/`) and `out/404.html`
 *     after the build, which is reliable on GitHub Pages.
 *
 * The repository is `japan-clarity/japan-clarity.github.io` (an Organization
 * Pages repository), so the site is served from the repository root and no
 * basePath is required. `NEXT_PUBLIC_BASE_PATH` is still honored for the
 * future case where the site is deployed as a project Pages repository.
 */
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        distDir: ".build-export",
      }
    : {
        async redirects() {
          return [
            {
              source: "/",
              destination: "/ja/",
              permanent: false,
            },
          ];
        },
        allowedDevOrigins: ["preview-chat-396f35dd-a7f0-4110-815b-6e1107f4bc67.space-z.ai"],
      }),
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
