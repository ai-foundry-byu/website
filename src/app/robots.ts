import type { MetadataRoute } from "next"

/**
 * robots.txt for aifoundry.byu.edu. Until 2026-10-20 the site had none (404).
 *
 * Almost all of this is about the jobs board, which next.config rewrites in
 * from ai-foundry-jobs.vercel.app. Crawlers read robots.txt from THIS origin
 * only, so the board's own robots.ts cannot steer them here.
 *
 * Why it exists: from 2026-10-14 crawlers walked the board's URL space at up to
 * ~26 requests a second. Two links made that space effectively unbounded:
 * every detail link carries `?from=<the filter view it was clicked from>`, and
 * every anonymous Save links `/jobs/join?next=<that detail URL>`. Each filter
 * combination times 55k roles was a "new" page. GPTBot and PerplexityBot were
 * deep in it (one request was ?from=page=2048). Canonical URLs carry neither
 * parameter and the board's sitemap lists the canonical ones, so disallowing
 * the parameterised variants loses nothing for search.
 *
 * GPTBot is OpenAI's training crawler. It sends no visitors (ChatGPT search and
 * browsing use OAI-SearchBot and ChatGPT-User, which are untouched), so it is
 * kept off the board entirely.
 *
 * Everything outside /jobs keeps the old behaviour: allowed for everyone.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/jobs/*?from=", "/jobs/*&from=", "/jobs/join?", "/jobs/member/", "/api/jobs/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/jobs", "/api/jobs/"],
      },
    ],
    sitemap: "https://aifoundry.byu.edu/jobs/sitemap.xml",
  }
}
