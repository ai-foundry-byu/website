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
   * Serve the VC jobs board at aifoundry.byu.edu/jobs.
   *
   * The board is a separate Next app (repo: ai-foundry-jobs) with its own
   * ingest pipeline, its own Supabase project, and a twice-daily refresh. It
   * is rewritten in rather than ported so this repo takes on no jobs code, no
   * extra environment variables, and no build-time dependency on that data.
   * If the board is ever retired, deleting this block is the whole rollback.
   *
   * A rewrite rather than a redirect, so the URL the member sees stays on
   * aifoundry.byu.edu. That matters for more than cosmetics: the board's
   * sign-in cookie is deliberately set with no Domain attribute, so it binds
   * to whichever host served the request. Under this rewrite that host is
   * aifoundry.byu.edu and the cookie is scoped correctly with no further
   * configuration.
   *
   * The /api/jobs/* rule is required, not optional. The board's sign-in and
   * save calls are same-origin fetches; without it they would resolve against
   * this app, 404, and the gate would appear to accept an email and then do
   * nothing. That exact failure took the previous board down for weeks, so it
   * is worth being explicit: both rules ship together or neither does.
   */
  async rewrites() {
    const board = "https://ai-foundry-jobs.vercel.app"
    /**
     * Serve the AI Foundry Cockpit at aifoundry.byu.edu/app, the same way as the
     * jobs board. The Cockpit is built with basePath "/app", so its pages, assets
     * (/app/_next/...) and API routes all sit under /app and these two rules carry
     * everything. Its sign-in cookie binds to aifoundry.byu.edu for the same reason
     * the board's does. Plan: docs/PLATFORM-PLAN.md in the Strategy repo.
     */
    const cockpit = "https://ai-foundry-cockpit.vercel.app"
    return [
      { source: "/jobs", destination: `${board}/jobs` },
      { source: "/jobs/:path*", destination: `${board}/jobs/:path*` },
      { source: "/api/jobs/:path*", destination: `${board}/api/jobs/:path*` },
      { source: "/app", destination: `${cockpit}/app` },
      { source: "/app/:path*", destination: `${cockpit}/app/:path*` },
    ]
  },
}

export default nextConfig
