import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    /**
     * Pin the workspace root to this directory.
     *
     * Without this, Turbopack infers the root by walking up looking for a
     * lockfile, and it picks the OUTERMOST one it finds. A stray
     * package-lock.json anywhere above this folder therefore silently
     * repoints the root, and the dev server then looks for tailwindcss in
     * that directory's node_modules, fails to resolve it, and crashes on
     * boot with a resolution error that says nothing about lockfiles.
     *
     * That happened on 2026-07-29: an npm command run from the home
     * directory left a package.json and package-lock.json there, and every
     * subsequent `next dev` died. The error surfaces as a missing Tailwind
     * import, which sends you looking in entirely the wrong place.
     *
     * Pinning it makes the project independent of whatever exists in parent
     * directories, which is what you want on any machine where this repo is
     * not at the top of the tree.
     */
    root: path.resolve(__dirname),
  },

  /**
   * The VC jobs board is RETIRED (2026-10-20).
   *
   * Until then /jobs, /jobs/:path* and /api/jobs/:path* were rewritten in from
   * a separate Next app (repo ai-foundry-jobs, Vercel project ai-foundry-jobs).
   * It had about two real users a month and more than 99% of its traffic was
   * crawlers, which made it the bulk of the hosting bill. The Vercel project is
   * paused, not deleted, and all of its data is kept.
   *
   * Now /jobs and every /jobs/* URL send people to the home page with a
   * TEMPORARY redirect (307), so search engines do not treat the move as final
   * and the board can come back at the same URLs. /api/jobs/* answers 410 Gone
   * from src/app/api/jobs/[[...path]]/route.ts.
   *
   * Rollback: restore the three afterFiles rewrites from commit 3192635 (and
   * src/app/robots.ts from the same commit), drop the two /jobs redirects
   * below and the 410 route, then unpause the ai-foundry-jobs project.
   */
  /**
   * /terms and /privacy land on /legal.
   *
   * There is one legal page, and external verification flows do not agree on
   * where to look for it: some ask for a terms URL, some for a privacy URL,
   * some just want "a public page linking the domain to your organization".
   * Redirecting both to the anchors on /legal means whichever one a reviewer
   * tries resolves, instead of 404ing and looking like the site has no notice
   * at all.
   *
   * 308 (permanent) so the canonical URL is unambiguous to crawlers; /legal
   * sets `alternates.canonical` to match.
   */
  async redirects() {
    return [
      { source: "/terms", destination: "/legal#site-use", permanent: true },
      { source: "/terms-of-service", destination: "/legal#site-use", permanent: true },
      { source: "/privacy", destination: "/legal#privacy", permanent: true },
      { source: "/privacy-policy", destination: "/legal#privacy", permanent: true },
      // Jobs board retired 2026-10-20 (see the note above). Temporary on purpose.
      { source: "/jobs", destination: "/", permanent: false },
      { source: "/jobs/:path*", destination: "/", permanent: false },
    ]
  },

  async rewrites() {
    /**
     * Serve the AI Foundry app at aifoundry.byu.edu/app, the same way the jobs
     * board used to be served. Since the 2026 cutover this is the app shared with BYU Strategy
     * (Vercel project strategy-program), reached at its Foundry address
     * ai-foundry-app.vercel.app; that host is how the app knows to show the
     * Foundry. It keeps every page, asset and API call under /app, so these two
     * rules carry everything, and its sign-in cookie binds to aifoundry.byu.edu.
     * Rollback: point this back at https://ai-foundry-cockpit.vercel.app.
     * Plan: docs/PLATFORM-PLAN.md and docs/CUTOVER.md in the Strategy repo.
     */
    const cockpit = "https://ai-foundry-app.vercel.app"
    return {
      // /app runs before this site's own routing. Next 16 turns a page's
      // segment-prefetch requests (header Next-Router-Segment-Prefetch) into
      // internal .segment.rsc paths, which 404 here before an afterFiles rule
      // sees them; forwarding first hands them to the app untouched.
      beforeFiles: [
        { source: "/app", destination: `${cockpit}/app` },
        { source: "/app/:path*", destination: `${cockpit}/app/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
