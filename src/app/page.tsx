import { SiteHeader } from "@/components/SiteHeader"
import { DrawRule, Reveal, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import { SiteFooter } from "@/components/SiteFooter"
import { HeroBuild } from "@/components/HeroBuild"
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

/* Runout retheme, system v3 (brand/runout-2026-11, draft for BYU Marriott
   approval): the hero is flat Navy with the one soft tonal lift behind the
   mark, the headline is flat White (type is never a gradient), the mark is
   built on the right like a builder builds it (HeroBuild: grid, set-out,
   level line, members placed and locked, then it holds, all White on
   navy), and the primary on this surface is White with a Navy label. The shader field
   (HeroMotionLayer) is retired on this branch: the build is the motion. */
const HERO_FACTS = [
  { value: "5 weeks", label: "engagements, extendable" },
  { value: "1 or 2", label: "builders per team" },
  { value: "30", label: "students, many disciplines" },
]

function Hero() {
  return (
    <section className="af-hero" data-ground="navy">
      <div className="af-hero-inner">
        <div className="af-hero-copy">
          <Eyebrow tone="on-dark" style={{ color: "var(--af-mist)", letterSpacing: "0.16em", fontStretch: "125%", fontWeight: 500, lineHeight: 1.7 }}>
            {HERO_SUPPORT.replace(/\.$/, "")}
          </Eyebrow>
          <h1
            className="hero af-hero-title"
            style={{
              /* Each line is one unbroken phrase (white-space: nowrap), so the
                 size is set by the copy column's own width through a container
                 query: in Archivo Cast, "PRODUCTION-GRADE." measures about 14.3
                 px of line per px of font, so 6.8cqi always fits it. */
              fontSize: "min(60px, 6.8cqi)",
              textTransform: "uppercase",
              margin: "22px 0 0",
            }}
          >
            {HERO_STACK.map((line, i) => (
              <span key={line} className="af-line" style={{ ["--i" as string]: i } as React.CSSProperties}>
                {line}
              </span>
            ))}
          </h1>
          <div className="af-hero-ctas">
            <Button variant="primary" size="lg" href={NAV_CTA.href}>
              {NAV_CTA.label}
            </Button>
            <Button variant="outline" size="lg" href="/network">
              Join the network
            </Button>
          </div>
          {/* The guide's three figures (Website: hero), each a fact already on
              the site: five-week engagements (/approach), teams of one or two
              and 30 students (/about). Static facts, never a live counter. */}
          <ul className="af-hero-facts">
            {HERO_FACTS.map((f) => (
              <li key={f.value}>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="af-hero-art">
          <HeroBuild theme="dark" />
        </div>
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
      className="af-band"
      style={{ background: "var(--surface-inverse)", padding: "72px 24px 64px", borderBottom: "1px solid var(--af-rule-dark)", position: "relative", overflow: "hidden" }}
    >
      <div aria-hidden="true" className="af-horizon-rule" />
      <Reveal
        style={{
          position: "relative",
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
          className="af-head-dark"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontStretch: "var(--w-cast)",
            fontSize: "clamp(30px, 4vw, 44px)",
            lineHeight: 1.1,
            margin: 0,
            textTransform: "uppercase",
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
        <NameCarousel eyebrow={BUILDERS_STRIP_EYEBROW} items={BUILDERS_LOGOS} />
        <MissionVision />
        <Values />
        <Build />
        <QuoteBand />
      </main>
      <SiteFooter />
    </>
  )
}
