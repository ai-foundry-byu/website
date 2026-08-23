import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { ProcessScrub } from "@/components/ProcessScrub"

export const metadata: Metadata = {
  title: "Lab: process scroll-scrub",
  robots: { index: false },
}

/**
 * PREVIEW-ONLY lab page (unlinked, noindexed), same convention as
 * /lab/splash-button and /lab/page-curtain: the "How the Foundry works"
 * scroll-scrub prototype from the Machined Motion proposal, staged so the
 * team can feel it before deciding whether it earns a slot on the landing
 * page. Step copy is placeholder pending team sign-off.
 */
export default function ProcessScrubLab() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 40px" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <p className="caption" style={{ color: "var(--text-meta)", maxWidth: "60ch" }}>
              Lab prototype. Scroll into the panel below — it pins for about two and a half screens while the
              four steps run, then releases. Reduced-motion users get a plain stacked list.
            </p>
          </div>
        </section>
        <ProcessScrub />
        <section style={{ padding: "64px 24px" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <p className="caption" style={{ color: "var(--text-meta)", maxWidth: "60ch" }}>
              After the panel releases, the page continues normally — this block stands in for whatever section
              would follow on the landing page.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
