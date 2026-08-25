import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Badge } from "@/components/ds/Badge"
import { Button } from "@/components/ds/Button"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { Table } from "@/components/ds/Table"
import { DrawRule, Reveal } from "@/components/motion/MotionPrimitives"
import {
  DONORS,
  DONORS_EYEBROW,
  DONORS_HEADING,
  DONORS_LEAD,
  FOUNDING_DONOR,
  GIVE_CONTACT,
  GIVE_HEADING,
  GIVE_LEAD,
  GIVE_ONLINE,
  GIVE_URL,
  SCHOOL_FULL,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "Donors",
  description:
    "The alumni and friends whose gifts support AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ".",
  alternates: { canonical: "/donors" },
}

/**
 * Donors, at /donors. A thank-you page: who gave, what the fund is
 * called, what it pays for. See the DONORS block in content.ts for the
 * two standing rules (no amounts or derivable proxies; nobody listed
 * without written permission) and why they exist.
 *
 * Colour notes, since this page is mostly navy on white:
 *   - The rail beside the founding entry is NAVY, not royal. Royal means
 *     interactive, and a rail differentiates no action. The system's own
 *     review question ("what does this differentiate?") sends it back.
 *   - The founding badge is the default slate-bordered tone for the same
 *     reason: it marks a status, not something to click.
 *   - Royal is spent on the eyebrows and the one button.
 */
const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "var(--size-eyebrow)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-meta)",
  lineHeight: 1.9,
  margin: 0,
}

const VALUE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--size-ui)",
  color: "var(--text-primary)",
  margin: 0,
}

const COLUMN_HEADING: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "var(--size-h3)",
  lineHeight: 1.3,
  color: "var(--navy)",
  margin: 0,
}

export default function DonorsPage() {
  const rows = DONORS.map((d) => ({
    year: d.year,
    donor: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "var(--size-h3)", fontWeight: 600 }}>{d.name}</span>
        {d.founding ? <Badge>Founding</Badge> : null}
      </span>
    ),
    fund: <span style={{ color: "var(--text-meta)" }}>{d.fund}</span>,
  }))

  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 40px" }}>
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Eyebrow>{DONORS_EYEBROW}</Eyebrow>
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
              {DONORS_HEADING}
            </h1>
            <p
              style={{
                fontSize: "var(--size-body)",
                lineHeight: 1.55,
                color: "var(--text-meta)",
                maxWidth: "60ch",
                margin: "16px 0 0",
              }}
            >
              {DONORS_LEAD}
            </p>
          </Reveal>
        </section>

        {/* The founding entry, as a named-fund register entry. */}
        <section style={{ padding: "0 24px 48px" }}>
          <Reveal
            style={{
              maxWidth: "var(--container)",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "3px 1fr",
              gap: "0 32px",
            }}
          >
            <div aria-hidden="true" style={{ background: "var(--navy)" }} />
            <div>
              <Eyebrow>{FOUNDING_DONOR.eyebrow}</Eyebrow>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontStretch: "var(--w-plate)",
                  fontSize: "var(--size-h2)",
                  lineHeight: 1.15,
                  margin: "12px 0 0",
                  color: "var(--navy)",
                }}
              >
                {FOUNDING_DONOR.name}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "var(--size-h3)",
                  color: "var(--navy)",
                  margin: "8px 0 0",
                }}
              >
                {FOUNDING_DONOR.fund}
              </p>
              <p
                style={{
                  fontSize: "var(--size-body)",
                  lineHeight: 1.55,
                  color: "var(--text-meta)",
                  maxWidth: "60ch",
                  margin: "16px 0 0",
                }}
              >
                {FOUNDING_DONOR.detail}
              </p>

              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "max-content 1fr",
                  gap: "8px 32px",
                  margin: "32px 0 0",
                  maxWidth: "44rem",
                }}
              >
                <dt style={LABEL}>Established</dt>
                <dd style={VALUE}>{FOUNDING_DONOR.established}</dd>
                <dt style={LABEL}>Supports</dt>
                <dd style={VALUE}>{FOUNDING_DONOR.supports}</dd>
              </dl>
            </div>
          </Reveal>
        </section>

        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 24px" }}>
          <DrawRule />
        </div>

        <section style={{ padding: "48px 24px" }}>
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontStretch: "var(--w-plate)",
                fontSize: "var(--size-h2)",
                lineHeight: 1.15,
                margin: "0 0 32px",
                color: "var(--navy)",
              }}
            >
              {DONORS_HEADING}
            </h2>
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={[
                  { key: "year", label: "Year" },
                  { key: "donor", label: "Donor" },
                  { key: "fund", label: "Fund" },
                ]}
                rows={rows}
              />
            </div>
          </Reveal>
        </section>

        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 24px" }}>
          <DrawRule />
        </div>

        {/* Kept on the white ground: royal is the button colour and royal
            may never sit on navy, so a navy band here costs the CTA. */}
        <section style={{ padding: "48px 24px 80px" }}>
          <Reveal style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontStretch: "var(--w-plate)",
                fontSize: "var(--size-h2)",
                lineHeight: 1.15,
                margin: 0,
                color: "var(--navy)",
              }}
            >
              {GIVE_HEADING}
            </h2>
            <p
              style={{
                fontSize: "var(--size-body)",
                lineHeight: 1.55,
                color: "var(--text-meta)",
                maxWidth: "60ch",
                margin: "16px 0 0",
              }}
            >
              {GIVE_LEAD}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
                gap: "32px 48px",
                marginTop: "48px",
              }}
            >
              <div
                style={{
                  borderTop: "1px solid var(--border-hairline)",
                  paddingTop: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <h3 style={COLUMN_HEADING}>{GIVE_ONLINE.heading}</h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--size-ui)",
                    lineHeight: 1.55,
                    color: "var(--text-meta)",
                    maxWidth: "40ch",
                    margin: 0,
                  }}
                >
                  {GIVE_ONLINE.detail}
                </p>
                <Button variant="primary" href={GIVE_URL}>
                  {GIVE_ONLINE.cta}
                </Button>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border-hairline)",
                  paddingTop: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <h3 style={COLUMN_HEADING}>{GIVE_CONTACT.heading}</h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--size-ui)",
                    lineHeight: 1.55,
                    color: "var(--text-meta)",
                    maxWidth: "40ch",
                    margin: 0,
                  }}
                >
                  {GIVE_CONTACT.detail}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "var(--size-ui)",
                      color: "var(--navy)",
                      margin: 0,
                    }}
                  >
                    {GIVE_CONTACT.name}
                  </p>
                  <a
                    href={`mailto:${GIVE_CONTACT.email}`}
                    className="link-draw"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--size-ui)",
                      color: "var(--royal)",
                    }}
                  >
                    {GIVE_CONTACT.email}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
