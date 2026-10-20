import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Button } from "@/components/ds/Button"
import { Card } from "@/components/ds/Card"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { Icon } from "@/components/ds/Icon"
import { SectionHeader } from "@/components/ds/SectionHeader"
import { PathwayMap } from "@/components/PathwayMap"
import { DrawRule, Reveal, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import {
  ALUMNI_LINE,
  EXPECT,
  EXPECT_HEADING,
  HANDBOOK_EYEBROW,
  HANDBOOK_LEAD,
  HANDBOOK_LINKS,
  HANDBOOK_URL,
  PATH_NOTE,
  JOIN_EYEBROW,
  JOIN_HEADING,
  NAV_ABOUT,
  PATHWAYS,
  PATHWAYS_NOTE,
  RECEIVE,
  RECEIVE_HEADING,
  SCHOOL_FULL,
  SELF_ASSESSMENT_URL,
  STANDING_EYEBROW,
  STANDING_LEAD,
  STUDENTS_EYEBROW,
  STUDENTS_HEADING,
  STUDENTS_LEAD,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "For students",
  description:
    "How to join the AI Foundry at the " + SCHOOL_FULL + ": the classes, the 2026-2027 pathways, the commitment, and the handbook.",
  alternates: { canonical: "/students" },
}

/**
 * For students: the door for prospective and current students. The course
 * book is the handbook; this page points into it and does not copy it, so
 * the rules live in one place. Sign in is in the header for everyone.
 */
const NETWORK = NAV_ABOUT.items.find((l) => l.href === "/network")!

const BODY: React.CSSProperties = { fontSize: "15px", lineHeight: 1.55, color: "var(--text-meta)", margin: 0 }

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-draw"
      style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 500, fontSize: "15px", color: "var(--royal)", textDecoration: "none" }}
    >
      {children}{" "}
      <span className="arr">
        <Icon name="launch" size={14} />
      </span>
    </a>
  )
}

function List({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h3)", margin: "0 0 10px", color: "var(--navy)" }}>{heading}</h3>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, borderBottom: "1px solid var(--border-hairline)" }}>
        {items.map((t) => (
          <li key={t} style={{ borderTop: "1px solid var(--border-hairline)", padding: "11px 0", fontSize: "15px", lineHeight: 1.5 }}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function StudentsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 48px" }}>
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Eyebrow>{STUDENTS_EYEBROW}</Eyebrow>
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
                maxWidth: "22ch",
              }}
            >
              {STUDENTS_HEADING}
            </h1>
            <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-meta)", maxWidth: "60ch", margin: "16px 0 0" }}>
              {STUDENTS_LEAD}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "28px" }}>
              <Button variant="primary" size="lg" href={SELF_ASSESSMENT_URL}>
                Take the self-assessment
              </Button>
              <Button variant="secondary" size="lg" href={HANDBOOK_URL}>
                Read the handbook
              </Button>
            </div>
          </Reveal>
        </section>

        <section style={{ padding: "56px 24px 64px", position: "relative" }}>
          <DrawRule bleed />
          <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
            <Reveal>
              <SectionHeader eyebrow={JOIN_EYEBROW} title={JOIN_HEADING} align="left" />
            </Reveal>
            <Reveal>
              <PathwayMap />
              <p className="caption" style={{ color: "var(--text-meta)", margin: "16px 0 0", maxWidth: "80ch" }}>{PATH_NOTE}</p>
            </Reveal>
            <Reveal>
              <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h3)", margin: "8px 0 8px", color: "var(--navy)" }}>This year only: three ways in, 2026-2027</h3>
              <p style={{ ...BODY, maxWidth: "66ch" }}>{PATHWAYS_NOTE}</p>
            </Reveal>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "16px", alignItems: "stretch" }}>
              {PATHWAYS.map((p) => (
                <StaggerItem key={p.title}>
                  <Card title={p.title} blurb={p.bestFor} points={[`Fall: ${p.fall}`, `Winter: ${p.winter}`]} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section style={{ padding: "56px 24px 64px", background: "var(--surface-recessed)" }}>
          <Reveal
            style={{ maxWidth: "var(--container)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "48px" }}
          >
            <List heading={EXPECT_HEADING} items={EXPECT} />
            <List heading={RECEIVE_HEADING} items={RECEIVE} />
          </Reveal>
        </section>

        <section style={{ padding: "56px 24px 64px", position: "relative" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "48px" }}>
            <Reveal style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Eyebrow>{STANDING_EYEBROW}</Eyebrow>
              <p style={BODY}>{STANDING_LEAD}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                <OutLink href={SELF_ASSESSMENT_URL}>Take the Builder self-assessment</OutLink>
                <Link href="/approach" className="link-draw" style={{ fontWeight: 500, fontSize: "15px", color: "var(--royal)", textDecoration: "none" }}>
                  The Builder and the Consultant →
                </Link>
              </div>
            </Reveal>
            <Reveal style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Eyebrow>{HANDBOOK_EYEBROW}</Eyebrow>
              <p style={BODY}>{HANDBOOK_LEAD}</p>
              <ul style={{ listStyle: "none", margin: "4px 0 0", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px 24px" }}>
                {HANDBOOK_LINKS.map((l) => (
                  <li key={l.href}>
                    <OutLink href={l.href}>{l.label}</OutLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section style={{ padding: "28px 24px 40px", position: "relative" }}>
          <DrawRule bleed />
          <p style={{ maxWidth: "var(--container)", margin: "0 auto", fontSize: "15px", color: "var(--text-meta)" }}>
            {ALUMNI_LINE}{" "}
            <Link href={NETWORK.href} className="link-draw" style={{ color: "var(--royal)", fontWeight: 500, textDecoration: "none" }}>
              {NETWORK.label} →
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
