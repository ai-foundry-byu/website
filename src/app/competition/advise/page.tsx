import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { AdvisorForm } from "@/components/AdvisorForm"
import { Eyebrow } from "@/components/ds/Eyebrow"

export const metadata: Metadata = {
  title: "Advise a team: MBA Full-Stack Product Builder Case Competition",
  description:
    "Advise one of twelve MBA teams building a working AI product, January 27 to 29, 2027, and judge the finals at BYU. Hosted by the AI Foundry at BYU Marriott.",
  alternates: { canonical: "/competition/advise" },
}

const body: React.CSSProperties = { fontSize: "var(--size-body)", lineHeight: 1.6, color: "var(--text-primary)", margin: "10px 0 0", maxWidth: "62ch" }
const h2: React.CSSProperties = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "20px", margin: "36px 0 0", color: "var(--navy)" }

export default function AdvisePage() {
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
              Advise a team
            </h1>
            <p style={{ ...body, fontSize: "19px", color: "var(--text-meta)" }}>
              MBA Full-Stack Product Builder Case Competition. Twelve teams of two MBA students each build a working AI
              product in 36 hours, and every team is advised by someone from a top AI lab.
            </p>

            <h2 style={h2}>What advisors do</h2>
            <p style={body}>
              Each advisor is matched with one team. You help them during the build on Wednesday and Thursday, January 27
              and 28, remotely and on your own schedule. On Friday, January 29, you are at BYU in Provo, Utah, and serve
              on the panel of judges. You do not score your own team.
            </p>

            <h2 style={h2}>What we ask</h2>
            <p style={body}>
              Advisors travel to BYU at their own expense. Lunch on Friday is provided. Tell us below that you are willing,
              and we will be in touch about matching.
            </p>

            <p style={{ ...body, marginTop: "36px", fontSize: "15px", color: "var(--text-meta)" }}>
              Hosted by the AI Foundry, an experiential learning experience for MBA and undergraduate students within the
              BYU Marriott Strategy Program. Details for students: <a href="/competition">aifoundry.byu.edu/competition</a>.
              Questions: <a href="mailto:scott.murff@byu.edu">scott.murff@byu.edu</a>
            </p>
          </div>
        </section>
        <section id="advise" style={{ background: "var(--surface-recessed)", padding: "48px 24px 64px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ ...h2, margin: "0 0 24px", fontSize: "24px" }}>I&apos;m willing to advise</h2>
            <AdvisorForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
