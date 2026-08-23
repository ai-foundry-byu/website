import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { Reveal } from "@/components/motion/MotionPrimitives"
import { WorkShowcaseGrid } from "@/components/WorkShowcaseGrid"
import { SCHOOL_FULL, SHOWCASE, SHOWCASE_EYEBROW, WORK_HEADING, WORK_LEAD } from "@/lib/content"

export const metadata: Metadata = {
  title: "Our work",
  description:
    "Products shipped by AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ". Every entry is a real product, shipped and running.",
  alternates: { canonical: "/work" },
}

/**
 * Reference builds, rebuilt to design_handoff .../ui_kits/work: plate H1
 * over the lead, then the showcase grid of 16:10 product screenshots.
 * Honesty rules: every entry states where the build actually is, and no
 * client is claimed.
 */
export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 0" }}>
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Eyebrow>{SHOWCASE_EYEBROW}</Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontStretch: "var(--w-plate)",
                fontSize: "var(--size-h1)",
                lineHeight: 1.05,
                letterSpacing: "-0.005em",
                margin: "14px 0 0",
                color: "var(--navy)",
              }}
            >
              {WORK_HEADING}
            </h1>
            <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-meta)", maxWidth: "56ch", margin: "16px 0 0" }}>
              {WORK_LEAD}
            </p>
          </Reveal>
        </section>
        <section style={{ padding: "40px 24px 64px" }}>
          <WorkShowcaseGrid items={SHOWCASE} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
