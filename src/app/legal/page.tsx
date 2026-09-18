import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { SCHOOL_FULL } from "@/lib/content"
import {
  BYU_FERPA_URL,
  BYU_PRIVACY_URL,
  CONTACT,
  LEGAL_UPDATED,
  ORG,
  PRIVACY,
  SECTIONS,
  SITE_USE,
} from "@/lib/legal"

/**
 * /legal — the public page that ties this domain to the organization, plus the
 * site's first privacy disclosure.
 *
 * This page is PUBLIC and indexable on purpose. Every other page carrying
 * internal numbers (/ops, /brief) is token-gated and noindex; this one is the
 * opposite, because a verification reviewer has to be able to reach it cold and
 * a privacy notice nobody can find is not a notice.
 *
 * /terms and /privacy redirect here (see next.config.ts) so that whichever path
 * an external verifier happens to try, it lands on the one real page instead of
 * a 404. One source of truth, three doors.
 *
 * The rationale for every claim, and for the ones that were cut, lives in
 * src/lib/legal.ts. Read that before editing the copy.
 */

export const metadata: Metadata = {
  title: "Legal",
  description:
    "The organization behind aifoundry.byu.edu, the conditions for using it, and what the site collects. AI Foundry is a program of the " +
    SCHOOL_FULL +
    ".",
  alternates: { canonical: "/legal" },
}

const MAX = { maxWidth: "var(--container)", margin: "0 auto" } as const
const PROSE = { maxWidth: "62ch" } as const

const h2 = {
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontStretch: "var(--w-plate)",
  fontSize: "var(--size-h3)",
  lineHeight: 1.2,
  letterSpacing: "-0.005em",
  margin: "0 0 14px",
  color: "var(--navy)",
} as const

const h3 = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "var(--size-ui)",
  lineHeight: 1.4,
  margin: "0 0 4px",
  color: "var(--navy)",
} as const

const body = {
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  fontSize: "var(--size-body)",
  lineHeight: 1.65,
  color: "var(--text-meta)",
  margin: 0,
} as const

export default function LegalPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* ── Masthead + jump list ───────────────────────────────────── */}
        <section style={{ padding: "64px 24px 32px" }}>
          <div style={MAX}>
            <Eyebrow>Legal</Eyebrow>
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
              Who runs this site, and what it collects.
            </h1>
            <p style={{ ...body, ...PROSE, marginTop: "18px" }}>
              This page identifies the organization behind aifoundry.byu.edu,
              explains how the site may be used, and describes what each form on
              it collects.
            </p>

            <nav
              aria-label="On this page"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px 22px",
                marginTop: "28px",
                paddingTop: "18px",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="no-underline link-draw"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--size-ui)",
                    color: "var(--royal)",
                  }}
                >
                  {s.title}
                </a>
              ))}
            </nav>
            <p
              className="caption"
              style={{ color: "var(--text-meta)", margin: "16px 0 0" }}
            >
              Last updated {LEGAL_UPDATED}.
            </p>
          </div>
        </section>

        {/* ── The verification payload. First, and unmissable. ────────── */}
        <section id="organization" style={{ padding: "28px 24px 12px", scrollMarginTop: "90px" }}>
          <div style={MAX}>
            <h2 style={h2}>{SECTIONS[0].title}</h2>
            <p
              style={{
                ...PROSE,
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "var(--size-h4)",
                lineHeight: 1.55,
                color: "var(--navy)",
                margin: 0,
              }}
            >
              {ORG.lead}
            </p>
            <p style={{ ...body, ...PROSE, marginTop: "14px" }}>{ORG.detail}</p>

            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 12rem) minmax(0, 1fr)",
                gap: 0,
                margin: "26px 0 0",
                maxWidth: "46rem",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              {ORG.facts.map((f) => (
                <div key={f.k} style={{ display: "contents" }}>
                  <dt
                    className="caption"
                    style={{
                      color: "var(--text-meta)",
                      padding: "12px 16px 12px 0",
                      borderBottom: "1px solid var(--border-hairline)",
                      margin: 0,
                    }}
                  >
                    {f.k}
                  </dt>
                  <dd
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--size-ui)",
                      color: "var(--navy)",
                      padding: "12px 0",
                      borderBottom: "1px solid var(--border-hairline)",
                      margin: 0,
                    }}
                  >
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Using this site ─────────────────────────────────────────── */}
        <section id="site-use" style={{ padding: "44px 24px 12px", scrollMarginTop: "90px" }}>
          <div style={MAX}>
            <h2 style={h2}>{SECTIONS[1].title}</h2>
            <p style={{ ...body, ...PROSE }}>{SITE_USE.lead}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "26px 0 0", maxWidth: "52rem" }}>
              {SITE_USE.points.map((p) => (
                <li
                  key={p.title}
                  style={{
                    padding: "16px 0",
                    borderTop: "1px solid var(--border-hairline)",
                  }}
                >
                  <h3 style={h3}>{p.title}</h3>
                  <p style={{ ...body, fontSize: "var(--size-ui)" }}>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What this site collects ─────────────────────────────────── */}
        <section id="privacy" style={{ padding: "44px 24px 12px", scrollMarginTop: "90px" }}>
          <div style={MAX}>
            <h2 style={h2}>{SECTIONS[2].title}</h2>
            <p style={{ ...body, ...PROSE }}>
              {PRIVACY.lead}{" "}
              <a
                href={BYU_PRIVACY_URL}
                className="no-underline link-draw"
                style={{ color: "var(--royal)" }}
              >
                Read BYU&rsquo;s privacy notice
              </a>
              .
            </p>

            <table
              style={{
                width: "100%",
                maxWidth: "52rem",
                borderCollapse: "collapse",
                margin: "26px 0 0",
              }}
            >
              <thead>
                <tr>
                  {["Form", "What it collects", "Where it goes"].map((th) => (
                    <th
                      key={th}
                      className="caption"
                      style={{
                        textAlign: "left",
                        color: "var(--text-meta)",
                        padding: "0 16px 10px 0",
                        borderBottom: "1px solid var(--border-strong)",
                      }}
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRIVACY.collects.map((c) => (
                  <tr key={c.path}>
                    <td
                      style={{
                        verticalAlign: "top",
                        padding: "14px 16px 14px 0",
                        borderBottom: "1px solid var(--border-hairline)",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--size-ui)",
                        fontWeight: 500,
                        color: "var(--navy)",
                        minWidth: "9rem",
                      }}
                    >
                      {c.form}
                      <span
                        className="caption"
                        style={{ display: "block", color: "var(--text-meta)", fontWeight: 400 }}
                      >
                        {c.path}
                      </span>
                    </td>
                    <td
                      style={{
                        verticalAlign: "top",
                        padding: "14px 16px 14px 0",
                        borderBottom: "1px solid var(--border-hairline)",
                        ...body,
                        fontSize: "var(--size-ui)",
                      }}
                    >
                      {c.fields}
                    </td>
                    <td
                      style={{
                        verticalAlign: "top",
                        padding: "14px 0",
                        borderBottom: "1px solid var(--border-hairline)",
                        ...body,
                        fontSize: "var(--size-ui)",
                      }}
                    >
                      {c.where}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul style={{ listStyle: "none", padding: 0, margin: "30px 0 0", maxWidth: "52rem" }}>
              {[PRIVACY.ai, PRIVACY.verification, PRIVACY.cookie].map((n) => (
                <li
                  key={n.title}
                  style={{ padding: "16px 0", borderTop: "1px solid var(--border-hairline)" }}
                >
                  <h3 style={h3}>{n.title}</h3>
                  <p style={{ ...body, fontSize: "var(--size-ui)" }}>{n.body}</p>
                </li>
              ))}

              <li style={{ padding: "16px 0", borderTop: "1px solid var(--border-hairline)" }}>
                <h3 style={h3}>{PRIVACY.rights.title}</h3>
                <p style={{ ...body, fontSize: "var(--size-ui)" }}>{PRIVACY.rights.body}</p>
                <p style={{ ...body, fontSize: "var(--size-ui)", marginTop: "8px" }}>
                  {PRIVACY.rights.caveat}
                </p>
              </li>

              <li style={{ padding: "16px 0", borderTop: "1px solid var(--border-hairline)" }}>
                <h3 style={h3}>{PRIVACY.students.title}</h3>
                <p style={{ ...body, fontSize: "var(--size-ui)" }}>
                  {PRIVACY.students.body}{" "}
                  <a
                    href={BYU_FERPA_URL}
                    className="no-underline link-draw"
                    style={{ color: "var(--royal)" }}
                  >
                    Records privacy and FERPA at BYU
                  </a>
                  .
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Contact ─────────────────────────────────────────────────── */}
        <section id="contact" style={{ padding: "44px 24px 72px", scrollMarginTop: "90px" }}>
          <div style={MAX}>
            <h2 style={h2}>{SECTIONS[3].title}</h2>
            <p style={{ ...body, ...PROSE }}>{CONTACT.lead}</p>
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
                maxWidth: "52rem",
                margin: "24px 0 0",
              }}
            >
              {CONTACT.routes.map((r) => (
                <div
                  key={r.title}
                  style={{ padding: "20px", border: "1px solid var(--border-hairline)" }}
                >
                  <h3 style={h3}>{r.title}</h3>
                  <p style={{ ...body, fontSize: "var(--size-ui)" }}>{r.body}</p>
                  {r.href.startsWith("/") ? (
                    <Link
                      href={r.href}
                      className="no-underline link-draw"
                      style={{
                        display: "inline-block",
                        marginTop: "12px",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--size-ui)",
                        color: "var(--royal)",
                      }}
                    >
                      {r.action}
                    </Link>
                  ) : (
                    <a
                      href={r.href}
                      className="no-underline link-draw"
                      style={{
                        display: "inline-block",
                        marginTop: "12px",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--size-ui)",
                        color: "var(--royal)",
                      }}
                    >
                      {r.action}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
