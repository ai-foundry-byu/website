import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { ToolkitDiagram } from "@/components/ToolkitDiagram"
import { Button } from "@/components/ds/Button"
import { Card } from "@/components/ds/Card"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { SectionHeader } from "@/components/ds/SectionHeader"
import { DrawRule, Reveal, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import {
  APPROACH_CLIENT_HEADING,
  APPROACH_CLIENT_LEAD,
  APPROACH_CULTURE_LINK,
  APPROACH_EYEBROW,
  APPROACH_HEADING,
  APPROACH_LEAD,
  BUILDER_AXES,
  BUILDER_MEASURE,
  BUILDER_RING,
  BUILDER_SUMMARY,
  CONSULTANT_AXES,
  CONSULTANT_MEASURE,
  CONSULTANT_RING,
  CONSULTANT_SUMMARY,
  PEDAGOGY_EYEBROW,
  PEDAGOGY_HEADING,
  PEDAGOGY_PRINCIPLES,
  PEDAGOGY_STEPS,
  NAV_CTA,
  SCHOOL_FULL,
  TOOLKITS_EYEBROW,
  TOOLKITS_HEADING,
  type Axis,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "Our approach",
  description:
    "How the AI Foundry at the " +
    SCHOOL_FULL +
    " trains AI builder consultants: the Builder and Consultant toolkits, two classes, and real client work.",
  alternates: { canonical: "/approach" },
}

/**
 * Our approach: the curriculum and pedagogy for everyone who reads the site
 * (clients, students, donors, faculty). The two toolkits are the center of
 * the page; the course books are their source (see the note in content.ts).
 * Culture is not repeated here; it lives on About and this page links to it.
 */
function Toolkit({ title, summary, ring, start, axes, measure }: { title: string; summary: string; ring: string[]; start: number; axes: Axis[]; measure: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ToolkitDiagram axes={ring} start={start} title={title} />
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--size-h3)", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0, color: "var(--navy)" }}>
          {title}
        </h3>
        <p style={{ fontSize: "var(--size-body)", lineHeight: 1.5, color: "var(--text-meta)", margin: "6px 0 0" }}>{summary}</p>
      </div>
      <dl style={{ margin: 0, borderBottom: "1px solid var(--border-hairline)" }}>
        {axes.map((a) => (
          <div key={a.name} style={{ borderTop: "1px solid var(--border-hairline)", padding: "11px 0" }}>
            <dt style={{ fontWeight: 600, fontSize: "15px", color: "var(--navy)" }}>{a.name}</dt>
            <dd style={{ margin: "2px 0 0", fontSize: "15px", lineHeight: 1.5, color: "var(--text-meta)" }}>{a.detail}</dd>
          </div>
        ))}
      </dl>
      <p className="caption" style={{ color: "var(--text-meta)", margin: 0, lineHeight: 1.55 }}>
        {measure}
      </p>
    </div>
  )
}

export default function ApproachPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 48px" }}>
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Eyebrow>{APPROACH_EYEBROW}</Eyebrow>
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
              {APPROACH_HEADING}
            </h1>
            <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-meta)", maxWidth: "62ch", margin: "16px 0 0" }}>
              {APPROACH_LEAD}
            </p>
          </Reveal>
        </section>

        <section style={{ padding: "56px 24px 64px", position: "relative" }}>
          <DrawRule bleed />
          <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
            <Reveal>
              <SectionHeader eyebrow={TOOLKITS_EYEBROW} title={TOOLKITS_HEADING} />
            </Reveal>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))", gap: "56px" }}>
              <StaggerItem>
                <Toolkit title="The Builder" summary={BUILDER_SUMMARY} ring={BUILDER_RING} start={0} axes={BUILDER_AXES} measure={BUILDER_MEASURE} />
              </StaggerItem>
              <StaggerItem>
                <Toolkit title="The Consultant" summary={CONSULTANT_SUMMARY} ring={CONSULTANT_RING} start={-90} axes={CONSULTANT_AXES} measure={CONSULTANT_MEASURE} />
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        <section style={{ padding: "56px 24px 64px", position: "relative", background: "var(--surface-recessed)" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "36px" }}>
            <Reveal>
              <SectionHeader eyebrow={PEDAGOGY_EYEBROW} title={PEDAGOGY_HEADING} />
            </Reveal>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "16px", alignItems: "stretch" }}>
              {PEDAGOGY_STEPS.map((s) => (
                <StaggerItem key={s.title}>
                  <Card title={s.title} blurb={s.blurb} points={s.points} />
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(440px, 100%), 1fr))", columnGap: "48px" }}>
              {PEDAGOGY_PRINCIPLES.map((p) => (
                <div key={p.title} style={{ borderTop: "1px solid var(--border-strong)", padding: "18px 0 22px" }}>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "18px", lineHeight: 1.3, margin: 0, color: "var(--navy)" }}>{p.title}</h3>
                  <p style={{ fontSize: "15px", lineHeight: 1.55, color: "var(--text-meta)", margin: "6px 0 0", maxWidth: "60ch" }}>{p.body}</p>
                </div>
              ))}
            </Reveal>
            <p style={{ margin: 0, fontSize: "var(--size-ui)" }}>
              <Link href={APPROACH_CULTURE_LINK.href} className="link-draw" style={{ color: "var(--royal)", fontWeight: 500, textDecoration: "none" }}>
                {APPROACH_CULTURE_LINK.label} →
              </Link>
            </p>
          </div>
        </section>

        <section
          data-ground="navy"
          style={{ background: "var(--surface-inverse)", padding: "56px 24px 48px", borderBottom: "1px solid rgba(255,255,255,.15)" }}
        >
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStretch: "var(--w-plate)", fontSize: "var(--size-h2)", lineHeight: 1.15, margin: 0, color: "#fff" }}>
              {APPROACH_CLIENT_HEADING}
            </h2>
            <p style={{ fontWeight: 300, fontSize: "var(--size-body)", lineHeight: 1.6, color: "var(--text-on-dark-body)", margin: "0 0 8px", maxWidth: "56ch" }}>
              {APPROACH_CLIENT_LEAD}
            </p>
            <Button variant="inverse" size="lg" ring="white" href={NAV_CTA.href}>
              {NAV_CTA.label}
            </Button>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
