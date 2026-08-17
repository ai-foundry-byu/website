import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Button } from "@/components/ds/Button"
import { Card } from "@/components/ds/Card"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { NameCarousel } from "@/components/ds/NameCarousel"
import { SectionHeader } from "@/components/ds/SectionHeader"
import { ValueRow } from "@/components/ds/ValueRow"
import {
  BUILD_HEADING,
  BUILD_LEAD,
  BUILDERS_NAMES,
  BUILDERS_STRIP_EYEBROW,
  HERO_STACK,
  HERO_STACK_SUPPORT,
  HERO_SUPPORT,
  MISSION,
  NAV_CTA,
  OFFERINGS,
  QUOTE_CTA,
  QUOTE_CTA_NOTE,
  QUOTE_FOLLOW,
  QUOTE_HEADLINE,
  VALUES,
  VISION,
} from "@/lib/content"

/**
 * The landing page, rebuilt to design_handoff_ai_foundry_website/ui_kits/
 * landing (direction 4b on structure 1b). Section order is the design's:
 * hero over the motion layer, the shipped-at strip, mission then vision in
 * their own bands, values as expanding rows, the offerings, the navy CTA
 * band. All copy comes from src/lib/content.ts.
 */

function Hero() {
  return (
    <section style={{ padding: "112px 24px 96px", position: "relative", overflow: "hidden" }}>
      {/* The one exception to flat solids: the slow shader-style field.
          Classes live in globals.css; reduced motion stills the blobs. */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div className="ml-field">
          <div className="ml-blob ml-b3" />
          <div className="ml-blob ml-b1" />
          <div className="ml-blob ml-b2" />
        </div>
        <div className="ml-grain" />
        <div className="ml-scrim" />
      </div>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Eyebrow>{HERO_SUPPORT.replace(/\.$/, "")}</Eyebrow>
        <h1
          className="hero"
          style={{ fontSize: "clamp(48px, 5.6vw, 80px)", textTransform: "uppercase", margin: "18px 0 0", color: "var(--navy)" }}
        >
          {HERO_STACK[0]}
          <br />
          {HERO_STACK[1]}
          <br />
          <span style={{ color: "var(--royal)" }}>{HERO_STACK[2]}</span>
        </h1>
        <p style={{ fontSize: "var(--size-body)", color: "var(--text-meta)", maxWidth: "52ch", margin: "24px 0 0" }}>
          {HERO_STACK_SUPPORT}
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" href={NAV_CTA.href}>
            {NAV_CTA.label}
          </Button>
          <Button variant="secondary" size="lg" href="/network">
            Join the network
          </Button>
        </div>
      </div>
    </section>
  )
}

function MissionVision() {
  const block = (eyebrow: string, text: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontStretch: "var(--w-plate)",
          fontSize: "34px",
          lineHeight: 1.2,
          margin: 0,
          maxWidth: "34ch",
          color: "var(--navy)",
        }}
      >
        {text}
      </h2>
    </div>
  )
  return (
    <section style={{ padding: "96px 24px", borderTop: "1px solid var(--border-hairline)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "72px" }}>
        {block("Mission", MISSION)}
        {block("Vision", VISION)}
      </div>
    </section>
  )
}

function Values() {
  return (
    <section style={{ padding: "0 24px 96px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Eyebrow>Values</Eyebrow>
        </div>
        <div style={{ borderBottom: "1px solid var(--border-strong)" }}>
          {VALUES.map((v) => (
            <ValueRow key={v.name} name={v.name} body={v.body} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Build() {
  return (
    <section id="quote" style={{ padding: "96px 24px", borderTop: "1px solid var(--border-hairline)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
        <SectionHeader eyebrow={BUILD_HEADING} title={BUILD_HEADING} lead={BUILD_LEAD} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", alignItems: "stretch" }}>
          {OFFERINGS.map((o) => (
            <Card key={o.name} title={o.name} blurb={o.blurb} points={o.points} />
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteBand() {
  return (
    <section style={{ background: "var(--surface-inverse)", padding: "96px 24px" }}>
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontStretch: "var(--w-plate)",
            fontSize: "40px",
            lineHeight: 1.1,
            margin: 0,
            color: "#fff",
          }}
        >
          {QUOTE_HEADLINE}
        </h2>
        <p className="on-dark" style={{ fontSize: "var(--size-body)", color: "var(--text-on-dark-soft)", maxWidth: "56ch", margin: 0 }}>
          {QUOTE_FOLLOW}
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "14px" }}>
          <Button variant="inverse" size="lg" href={QUOTE_CTA.href}>
            {QUOTE_CTA.label}
          </Button>
          <span className="caption" style={{ color: "var(--text-on-dark-soft)", fontWeight: 300 }}>
            {QUOTE_CTA_NOTE}
          </span>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <NameCarousel eyebrow={BUILDERS_STRIP_EYEBROW} names={BUILDERS_NAMES} />
        <MissionVision />
        <Values />
        <Build />
        <QuoteBand />
      </main>
      <SiteFooter />
    </>
  )
}
