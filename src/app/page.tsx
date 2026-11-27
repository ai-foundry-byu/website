import { SiteHeader } from "@/components/SiteHeader"
import { DrawRule, Reveal, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import { SiteFooter } from "@/components/SiteFooter"
import { ArrowRight } from "lucide-react"
import { HeroPair } from "@/components/HeroPair"
import { CUT, HEX } from "@/components/AFBuild"
import { LIFT, STAGGER, heroLift } from "@/lib/heroLift"
import { Button } from "@/components/ds/Button"
import { Card } from "@/components/ds/Card"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { NameCarousel } from "@/components/ds/NameCarousel"
import { SectionHeader } from "@/components/ds/SectionHeader"
import { FeaturedCard } from "@/components/ds/ShowcaseCard"
import "./home.css"
import {
  BUILD_HEADING,
  BUILDERS_LOGOS,
  BUILDERS_STRIP_EYEBROW,
  HERO_DOORS,
  HERO_STATEMENT,
  HOME_PHASES,
  HOME_HOW_HEADING,
  HOME_WORK,
  HOME_WORK_HEADING,
  OFFERINGS,
  PURPOSE,
  QUOTE_CTA,
  WORK_CTA,
} from "@/lib/content"

/**
 * The landing page (storyline, Scott Murff, 2026-11-27). Each section answers the next question a
 * visitor has: what are you (the hero), are you any good (where our builders have shipped, then
 * three things we built), what can you build for me (the offerings), what is it like (how a
 * project works), why do you exist and what do I do now (the purpose over the three doors again).
 * BYU Marriott's mission, vision and values live on marriott.byu.edu, not here.
 * All copy comes from src/lib/content.ts.
 */

/* The hero (Scott Murff, 2026-11-26): no wordmark of its own. The bar's AI FOUNDRY is built as a
   blueprint on first paint (SiteHeader home), then its hexagon and diamond lift out into the Builder and
   the Consultant under BUILDER-CONSULTANTS. (HeroPair). The studio line sits above as a lead-in, the
   three doors (one per audience) below. Styles and clock: src/app/hero.css. */
const HERO_LIFT_SCRIPT = `(${heroLift.toString()})(${JSON.stringify(HEX)},${JSON.stringify(CUT)},${LIFT},${STAGGER})`

/** The three doors, one per audience: under the hero and again in the closing band. */
function Doors({ label }: { label: string }) {
  return (
    <nav className="af-doors" aria-label={label}>
      {HERO_DOORS.map((d, i) => (
        <a key={d.href} className="af-door" href={d.href} style={{ "--i": i } as React.CSSProperties}>
          <span className="af-door-who">{d.who}</span>
          <span className="af-door-act">{d.label}</span>
          <ArrowRight className="af-door-arrow" size={18} aria-hidden="true" />
        </a>
      ))}
    </nav>
  )
}

function Hero() {
  return (
    <section className="af-hero is-playing" data-ground="navy">
      <div className="af-hero-inner">
        <p className="af-hero-lead">{HERO_STATEMENT}</p>
        <HeroPair />
        <Doors label="Get involved" />
      </div>
      {/* the lift starts as this HTML is parsed, not when the bundle hydrates (src/lib/heroLift.ts) */}
      <script dangerouslySetInnerHTML={{ __html: HERO_LIFT_SCRIPT }} />
    </section>
  )
}

/** Three things we built, as the /work page's featured cards, then the way into the library. */
function Work() {
  return (
    <section style={{ padding: "72px 24px 64px", position: "relative" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
        <Reveal>
          <SectionHeader title={HOME_WORK_HEADING} />
        </Reveal>
        <div className="work-grid">
          {HOME_WORK.map((it) => (
            <FeaturedCard key={it.name} item={it} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="secondary" href={WORK_CTA.href}>
            {WORK_CTA.label}
          </Button>
        </div>
      </div>
    </section>
  )
}

/* id="quote": the bar's Start a project button on every other page targets /#quote. */
function Build() {
  return (
    <section id="quote" style={{ padding: "64px 24px", position: "relative" }}>
      <DrawRule bleed />
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "36px" }}>
        <Reveal>
          <SectionHeader title={BUILD_HEADING} />
        </Reveal>
        {/* minmax(min(300px, 100%), …) rather than a bare minmax(300px, …):
            a hard 300px track cannot shrink, so on a 320px viewport the
            card sat 24px in and ran 4px past the right edge and the whole
            document scrolled sideways. */}
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

/** How a project works: three phases on one drawn rule, each with the milestones a client does or
 *  receives, then the form. No timelines or fees (Scott, 2026-11-27). */
function How() {
  return (
    <section style={{ padding: "64px 24px 80px", position: "relative" }}>
      <DrawRule bleed />
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
        <Reveal>
          <SectionHeader title={HOME_HOW_HEADING} />
        </Reveal>
        <ol className="af-phases">
          {HOME_PHASES.map((p, i) => (
            <li key={p.phase} className="af-phase">
              <span className="af-phase-mark" aria-hidden="true" />
              <span className="af-phase-n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="af-phase-name">{p.phase}</h3>
              <ul className="af-ms">
                {p.milestones.map((m) => (
                  <li key={m.title}>
                    <span className="af-ms-title">{m.title}</span>
                    {m.detail && <span className="af-ms-detail">{m.detail}</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="primary" size="lg" href={QUOTE_CTA.href}>
            {QUOTE_CTA.label}
          </Button>
        </div>
      </div>
    </section>
  )
}

/** The close, on navy: why the Foundry exists, then the three doors again. */
function Close() {
  return (
    <section data-ground="navy" className="af-band af-close">
      <div aria-hidden="true" className="af-horizon-rule" />
      <div className="af-close-inner">
        <Reveal>
          <Eyebrow tone="on-dark">Our purpose</Eyebrow>
          <h2 className="af-close-purpose">{PURPOSE}</h2>
        </Reveal>
        <Doors label="Get involved, again" />
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <SiteHeader home />
      <main>
        <Hero />
        <NameCarousel eyebrow={BUILDERS_STRIP_EYEBROW} items={BUILDERS_LOGOS} />
        <Work />
        <Build />
        <How />
        <Close />
      </main>
      <SiteFooter />
    </>
  )
}
