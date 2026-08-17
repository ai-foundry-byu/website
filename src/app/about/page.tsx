import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { TeamCard } from "@/components/ds/TeamCard"
import { ValueRow } from "@/components/ds/ValueRow"
import {
  ABOUT_EYEBROW,
  ABOUT_HEADING,
  BUILDERS_DETAIL,
  BUILDERS_EYEBROW,
  CULTURE_DOUBLE_CLICK_LEAD,
  CULTURE_EYEBROW,
  CULTURE_LEAD,
  CULTURE_PRACTICES,
  CULTURE_PRINCIPLES,
  FACULTY,
  SCHOOL_FULL,
  TEAM,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "About us",
  description:
    "The people behind AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ".",
  alternates: { canonical: "/about" },
}

/**
 * About, rebuilt to design_handoff .../ui_kits/about: intro, the faculty
 * advisor in a hairline card, the team as compact photo cards (headshots
 * rest in navy-tinted monochrome, full color on hover), then culture as
 * expanding rows with credits.
 *
 * The design's cards carry name, role, and photo only — the long-form bios
 * in TEAM stay in content.ts as the record that backs the employer claims,
 * they just no longer render here. Roster order is presentation: staff
 * roles first, undergraduates after, each group in content.ts order.
 */
const STAFF = TEAM.filter((m) => m.role !== "Undergraduate")
const UNDERGRADS = TEAM.filter((m) => m.role === "Undergraduate")
const ROSTER = [...STAFF, ...UNDERGRADS]

/** Culture rows: principles then the Foundry's own practices, credit in parens. */
const CULTURE_ROWS = [...CULTURE_PRINCIPLES, ...CULTURE_PRACTICES]

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "88px 24px 56px" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Eyebrow>{ABOUT_EYEBROW}</Eyebrow>
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
              {ABOUT_HEADING}
            </h1>
            <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-meta)", maxWidth: "60ch", margin: "16px 0 0" }}>
              {BUILDERS_DETAIL}
            </p>
          </div>
        </section>

        <section style={{ padding: "0 24px 56px" }}>
          <div
            style={{
              maxWidth: "var(--container)",
              margin: "0 auto",
              border: "1px solid var(--border-hairline)",
              padding: "28px",
              display: "flex",
              gap: "24px",
              alignItems: "center",
              flexWrap: "wrap",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ flex: "1 1 380px" }}>
              <Eyebrow tone="meta">{FACULTY.role}</Eyebrow>
              <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h3)", margin: "8px 0 4px" }}>
                {FACULTY.name}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.55, margin: 0, maxWidth: "66ch" }}>
                {FACULTY.detail}
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: "0 24px 96px" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <div style={{ marginBottom: "20px" }}>
              <Eyebrow>{BUILDERS_EYEBROW}</Eyebrow>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {ROSTER.map((m) => (
                <TeamCard key={m.name} name={m.name} role={m.role} photo={m.photo} />
              ))}
            </div>
          </div>
        </section>

        <section style={{ borderTop: "1px solid var(--border-hairline)", padding: "72px 24px 96px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "14px" }}>
              <Eyebrow>{CULTURE_EYEBROW}</Eyebrow>
            </div>
            <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-primary)", textAlign: "center", margin: "0 0 8px" }}>
              {CULTURE_LEAD}
            </p>
            <p className="caption" style={{ color: "var(--text-meta)", textAlign: "center", margin: "0 0 32px" }}>
              {CULTURE_DOUBLE_CLICK_LEAD}
            </p>
            <div style={{ borderBottom: "1px solid var(--border-strong)" }}>
              {CULTURE_ROWS.map((p) => (
                <ValueRow key={p.title} name={p.title} body={`${p.blurb} (${p.credit})`} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
