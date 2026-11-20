import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { CompetitionForm } from "@/components/CompetitionForm"
import { Eyebrow } from "@/components/ds/Eyebrow"

export const metadata: Metadata = {
  title: "MBA Full-Stack Product Builder Case Competition",
  description:
    "January 27 to 29, 2027. Twelve teams of two MBA students, each advised by someone from a top AI lab, build a working AI product against one case. $10,000 in prizes. Hosted by the AI Foundry at BYU Marriott.",
  alternates: { canonical: "/competition" },
}

const AGENDA = [
  ["Wed., Jan. 27", "8 am", "Case released"],
  ["Thu., Jan. 28", "8 pm", "Entries due"],
  ["Fri., Jan. 29", "9 am", "First round: every team demos for judges"],
  ["", "Noon", "Lunch and finalists announced"],
  ["", "1:15 pm", "Finalists present to the judges"],
  ["", "3:45 pm", "Winners announced"],
]

const body: React.CSSProperties = { fontSize: "var(--size-body)", lineHeight: 1.6, color: "var(--text-primary)", margin: "10px 0 0", maxWidth: "62ch" }
const h2: React.CSSProperties = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "20px", margin: "36px 0 0", color: "var(--navy)" }

export default function CompetitionPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 48px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <Eyebrow>January 27 to 29, 2027</Eyebrow>
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
              MBA Full-Stack Product Builder Case Competition
            </h1>
            <p style={{ ...body, fontSize: "19px", color: "var(--text-meta)" }}>
              $10,000 in prizes. Twelve teams of two MBA students, selected by application. Every team is advised by
              someone from a top AI lab.
            </p>

            <h2 style={h2}>The competition</h2>
            <p style={body}>
              Every team builds against the same case: a specific prompt, written for this event, on using AI to build
              products that enhance human flourishing. Teams have 36 hours to carry an idea from a user problem to a
              working product. Winners are selected by a panel of judges.
            </p>

            <h2 style={h2}>Who can apply</h2>
            <p style={body}>
              Teams of two MBA students from any business school. One application per team. Twelve teams are selected,
              and each is paired with an advisor from a top AI lab. Selected teams pay $50 per student, which includes
              lunch and supports the AI Foundry. There is no payment to apply.
            </p>

            <h2 style={h2}>Agenda</h2>
            <p style={{ ...body, fontSize: "14px", color: "var(--text-meta)", marginTop: "4px" }}>
              All times Mountain. Building is remote; Friday is in person at BYU in Provo, Utah.
            </p>
            <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "12px", fontSize: "15px" }}>
              <tbody>
                {AGENDA.map(([d, t, what], i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border-hairline)", borderBottom: i === AGENDA.length - 1 ? "1px solid var(--border-hairline)" : undefined }}>
                    <td style={{ padding: "9px 12px 9px 0", fontWeight: 600, whiteSpace: "nowrap", width: "130px" }}>{d}</td>
                    <td style={{ padding: "9px 12px 9px 0", whiteSpace: "nowrap", width: "80px" }}>{t}</td>
                    <td style={{ padding: "9px 0" }}>{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 style={h2}>Prizes</h2>
            <p style={body}>First place $7,000. Second place $2,000. Third place $1,000.</p>

            <p style={{ ...body, marginTop: "36px", fontSize: "15px", color: "var(--text-meta)" }}>
              Hosted by the AI Foundry, an experiential learning experience for MBA and undergraduate students within the
              BYU Marriott Strategy Program. Questions: <a href="mailto:scott.murff@byu.edu">scott.murff@byu.edu</a>
            </p>
          </div>
        </section>
        <section id="apply" style={{ background: "var(--surface-recessed)", padding: "48px 24px 64px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ ...h2, margin: "0 0 24px", fontSize: "24px" }}>Apply</h2>
            <CompetitionForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
