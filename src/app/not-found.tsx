import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Button } from "@/components/ds/Button"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { SCHOOL_FULL } from "@/lib/content"

/**
 * The 404. Before this file existed the app had no not-found boundary at
 * all, so every mistyped URL — and every notFound() call, which is how
 * /ops fails closed — rendered Next's built-in black-on-white "404: This
 * page could not be found." with no header, no footer, no way back, and
 * none of the type or palette. On a byu.edu domain that reads as a broken
 * site rather than a wrong address.
 *
 * Deliberately quiet: an error page is not a place to be clever. One
 * heading, one line of explanation, and the two routes a lost visitor
 * actually wants.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist at AI Foundry, an experiential learning program of the " + SCHOOL_FULL + ".",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "96px 24px 112px" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Eyebrow>Error 404</Eyebrow>
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
              That page does not exist.
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
              The link may be out of date, or the address may have a typo in it. Everything the
              program has published is reachable from the pages below.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap" }}>
              <Button variant="primary" size="lg" href="/">
                Back to the homepage
              </Button>
              <Button variant="secondary" size="lg" href="/work">
                See our work
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
