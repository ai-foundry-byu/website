import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import { FeaturedCard } from "@/components/ds/ShowcaseCard"
import { WorkLibrary } from "@/components/WorkLibrary"
import {
  SCHOOL_FULL,
  WORK,
  WORK_FEATURED,
  WORK_FEATURED_HEADING,
  WORK_FEATURED_LEAD,
  WORK_HEADING,
  WORK_LEAD,
  WORK_LIBRARY_HEADING,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "Our work",
  description:
    "Products and open-source tools built by AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ". Every entry links to the real thing.",
  alternates: { canonical: "/work" },
}

/**
 * /work is one portfolio (content.ts WORK): a header with the whole-library
 * count, the numbered "Start with these" row, then the library, where every
 * entry, product or repo, is the same card and search, Kind and Status
 * facets and a sort narrow it. Until 2026-11-19 this page was two unrelated
 * sections (products, then an open-source toolkit), which read as two sites.
 */
export default function WorkPage() {
  const products = WORK.filter((w) => w.kind === "Product").length
  const repos = WORK.filter((w) => w.repo).length
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 0" }}>
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <h1 className="work-h1">{WORK_HEADING}</h1>
            <p className="work-lead">{WORK_LEAD}</p>
            <p className="work-count">
              <span>{WORK.length} projects</span> · <span>{products} products</span> ·{" "}
              <span>{repos} open-source repos</span>
            </p>
          </Reveal>
        </section>

        <section aria-labelledby="featured-heading" style={{ padding: "48px 24px 0" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <h2 id="featured-heading" className="work-h2">
              {WORK_FEATURED_HEADING}
            </h2>
            <p className="work-sublead">{WORK_FEATURED_LEAD}</p>
            <Stagger style={{ marginTop: "24px" }}>
              <div className="work-grid">
                {WORK_FEATURED.map((it, i) => (
                  <StaggerItem key={it.name} style={{ height: "100%" }}>
                    <FeaturedCard item={it} eager={i < 3} />
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
          </div>
        </section>

        <section aria-labelledby="library-heading" style={{ padding: "72px 24px 80px" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto 24px" }}>
            <h2 id="library-heading" className="work-h2">
              {WORK_LIBRARY_HEADING}
            </h2>
          </div>
          <WorkLibrary items={WORK} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
