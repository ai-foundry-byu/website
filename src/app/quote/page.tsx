import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { QuoteForm } from "@/components/QuoteForm"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { DrawRule, Reveal, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import { QUOTE_FOLLOW, QUOTE_HEADLINE, QUOTE_STEPS, SCHOOL_FULL } from "@/lib/content"

export const metadata: Metadata = {
  title: "Request a proposal",
  description:
    "Tell AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ", what you want built. Eight fields, and you get back a scope of work, a cost estimate, and a delivery timeline.",
  alternates: { canonical: "/quote" },
}

/**
 * The form, and nothing else. Rebuilt to design_handoff .../ui_kits/quote:
 * plate H1 over the lead, the eight-field form, then the three
 * "what happens next" steps with royal cast numerals.
 */
export default function QuotePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 0" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            {/* The page eyebrow keeps naming the action; only BUTTONS
                changed to "Work with us" (Corbin, 2026-08-16). */}
            <Eyebrow>Request a proposal</Eyebrow>
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
              {QUOTE_HEADLINE}
            </h1>
            <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-meta)", maxWidth: "56ch", margin: "16px 0 0" }}>
              {QUOTE_FOLLOW}
            </p>
          </div>
        </section>
        {/* The one recessed surface per page (Measured Color Tier 3,
            sanctioned by Corbin 2026-08-17): navy/4 behind the form, so
            the white inputs read raised with zero shadows — Stripe's
            #F6F9FC move, Carbon's layer step. */}
        <section id="form" style={{ background: "var(--surface-recessed)", padding: "48px 24px 56px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <QuoteForm />
          </div>
        </section>
        <section style={{ padding: "56px 24px 64px", position: "relative" }}>
          <DrawRule bleed />
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <Eyebrow>What happens next</Eyebrow>
              </div>
            </Reveal>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px" }}>
              {QUOTE_STEPS.map((s) => (
                <StaggerItem key={s.n} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontStretch: "var(--w-cast)",
                      fontSize: "40px",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: "var(--royal)",
                    }}
                  >
                    {s.n}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "18px", margin: 0 }}>{s.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.55, color: "var(--text-primary)", margin: 0, maxWidth: "40ch" }}>
                    {s.detail}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
