import { SiteHeader } from "@/components/SiteHeader"
import { DrawRule, Reveal, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import { SiteFooter } from "@/components/SiteFooter"
import { HeroStride } from "@/components/HeroStride"
import { Button } from "@/components/ds/Button"
import { Card } from "@/components/ds/Card"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { NameCarousel } from "@/components/ds/NameCarousel"
import { SectionHeader } from "@/components/ds/SectionHeader"
import { ValueRow } from "@/components/ds/ValueRow"
import {
  BUILD_HEADING,
  BUILD_LEAD,
  BUILDERS_LOGOS,
  BUILDERS_STRIP_EYEBROW,
  HERO_FACTS,
  HERO_LEAD,
  HERO_STACK,
  HERO_SUPPORT,
  CULTURE_LEAD,
  MARRIOTT_GUIDING,
  MARRIOTT_MISSION,
  MARRIOTT_VALUES,
  MARRIOTT_VISION,
  NAV_CTA,
  OFFERINGS,
  QUOTE_CTA,
  PURPOSE,
  QUOTE_HEADLINE,
} from "@/lib/content"

/**
 * The landing page, rebuilt to design_handoff_ai_foundry_website/ui_kits/
 * landing (direction 4b on structure 1b). Section order is the design's:
 * hero over the motion layer, the shipped-at strip, the Foundry's purpose,
 * then BYU Marriott's vision
 * then mission in their own bands, its values as expanding rows, the offerings, the navy CTA
 * band. All copy comes from src/lib/content.ts.
 */

/* AF Stride demo (brand/stride-2026-11). The hero is the brand guide's
   website spec: Carbon with one key light behind the mark, the label, one
   Display line in the steel text gradient, the offerings line, ONE heat
   button, three facts, and on the right the digital mark playing the rise
   once (HeroStride). The old shader layer (HeroMotionLayer, three.js) is no
   longer imported, so the landing page ships lighter. */
function Hero() {
  return (
    <section className="sx-hero" data-ground="navy">
      <div className="sx-hero-bg" aria-hidden="true" />
      <div className="sx-hero-grid">
        <div className="sx-hero-copy">
          {/* Two lines, broken where the sentence turns, as the guide's hero sets it. */}
          <Eyebrow tone="on-dark" style={{ lineHeight: 1.8 }}>
            {HERO_SUPPORT.replace(/\.$/, "").split(" at the ")[0]}
            <br className="sx-br" />
            at the {HERO_SUPPORT.replace(/\.$/, "").split(" at the ")[1]}
          </Eyebrow>
          {/* One phrase per line. Sizing lives in .sx-display (globals.css):
              "PRODUCTION-GRADE." measures 14.25 px of line per px of type at
              Archivo 125/700, so desktop caps the size by that; phones let
              that one phrase break at its hyphen. */}
          <h1 className="hero sx-display">
            {HERO_STACK.map((line) => (
              <span key={line} className="sx-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="sx-hero-lead">{HERO_LEAD}</p>
          <div style={{ display: "flex", gap: "14px", marginTop: "34px", flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary" size="lg" href={NAV_CTA.href}>
              {NAV_CTA.label}
            </Button>
            <Button variant="steel" size="lg" href="/network">
              Join the network
            </Button>
          </div>
          <dl className="sx-facts">
            {HERO_FACTS.map((f) => (
              <div key={f.value}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroStride />
      </div>
    </section>
  )
}

function MissionVision() {
  const block = (eyebrow: string, text: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      {/* Two lines, not three (Corbin, 2026-08-16): the measure widened
          from 34ch, and text-wrap balance evens the pair. */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontStretch: "var(--w-plate)",
          fontSize: "34px",
          lineHeight: 1.2,
          margin: 0,
          maxWidth: "58ch",
          color: "var(--navy)",
        }}
      >
        {text}
      </h2>
    </div>
  )
  return (
    <section style={{ padding: "64px 24px", position: "relative" }}>
      <DrawRule bleed />
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        {/* The Foundry keeps one statement of its own, its purpose. Mission,
            vision and values are BYU Marriott's, verbatim (Scott, 2026-10-19). */}
        <Reveal>{block("Our purpose", PURPOSE)}</Reveal>
        <Reveal>
          <p style={{ margin: "0 auto", maxWidth: "58ch", textAlign: "center", fontSize: "18px", lineHeight: 1.5, color: "var(--text-meta)" }}>
            {CULTURE_LEAD}
          </p>
        </Reveal>
        <Reveal>{block("Vision", MARRIOTT_VISION)}</Reveal>
        <Reveal>{block("Mission", MARRIOTT_MISSION)}</Reveal>
      </div>
    </section>
  )
}

function Values() {
  return (
    <section style={{ padding: "0 24px 64px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Eyebrow>Values</Eyebrow>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-strong)" }}>
            {[...MARRIOTT_VALUES, MARRIOTT_GUIDING].map((v) => (
              <ValueRow key={v.title} name={v.title} body={v.blurb} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Build() {
  return (
    <section id="quote" style={{ padding: "64px 24px", position: "relative" }}>
      <DrawRule bleed />
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "36px" }}>
        <Reveal>
          <SectionHeader title={BUILD_HEADING} lead={BUILD_LEAD} />
        </Reveal>
        {/* minmax(min(300px, 100%), …) rather than a bare minmax(300px, …):
            a hard 300px track cannot shrink, so on a 320px viewport the
            card sat 24px in and ran 4px past the right edge and the whole
            document scrolled sideways. Same guard WorkShowcaseGrid already
            uses on its 420px tracks. */}
        <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "16px", alignItems: "stretch" }}>
          {OFFERINGS.map((o) => (
            <StaggerItem key={o.name}>
              <Card title={o.name} blurb={o.blurb} points={o.points} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* Headline and button only, per Corbin 2026-08-16 — the supporting
   sentence and the two-minute note moved off; /quote still carries both.
   Measured Color Tier 3: the band and the footer below it are ONE
   composed navy terminal (Stripe never stacks two dark regions) — the
   white/15 hairline is the internal seam. */
function QuoteBand() {
  return (
    <section
      data-ground="navy"
      className="sx-band"
      style={{ background: "var(--surface-inverse)", padding: "88px 24px 80px", borderBottom: "1px solid rgba(255,255,255,.08)" }}
    >
      <Reveal
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          textAlign: "center",
        }}
      >
        <h2
          className="sx-steel-text"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontStretch: "125%",
            textTransform: "uppercase",
            letterSpacing: "0.01em",
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.08,
            margin: 0,
          }}
        >
          {QUOTE_HEADLINE}
        </h2>
        <Button variant="primary" size="lg" href={QUOTE_CTA.href}>
          {QUOTE_CTA.label}
        </Button>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        {/* The proof strip closes the Carbon hero instead of opening the
            Studio page: one dark lead surface, then the document. */}
        <div className="sx-proof" data-ground="navy">
          <NameCarousel eyebrow={BUILDERS_STRIP_EYEBROW} items={BUILDERS_LOGOS} tone="on-dark" />
        </div>
        <MissionVision />
        <Values />
        <Build />
        <QuoteBand />
      </main>
      <SiteFooter />
    </>
  )
}
