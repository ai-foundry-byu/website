"use client"

import { useEffect } from "react"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Button } from "@/components/ds/Button"
import { Eyebrow } from "@/components/ds/Eyebrow"

/**
 * The route-level error boundary. The app previously had none anywhere,
 * which mattered more here than it looks: the hero mounts three.js through
 * dynamic(ssr:false), and while that correctly keeps WebGL off the server
 * it does NOT catch a throw during client render. A library throw with no
 * boundary above it unmounts the whole tree and leaves a blank page.
 *
 * This catches it, keeps the site's chrome around the failure so the
 * visitor can still navigate, and offers reset() — which re-renders the
 * segment and is genuinely enough for a transient WebGL or network fault.
 *
 * It does NOT report anywhere yet. There is no error-tracking sink wired
 * up for this site; console.error at least surfaces the digest in the
 * Vercel function logs. Wiring a real sink is worth doing and is not
 * this file's job to invent.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("site error boundary:", error)
  }, [error])

  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "96px 24px 112px" }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
            <Eyebrow>Something went wrong</Eyebrow>
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
              This page did not load.
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
              The failure is on our side, not yours. Trying again usually clears it. If it does not,
              the rest of the site is still up.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap" }}>
              <Button variant="primary" size="lg" onClick={reset}>
                Try again
              </Button>
              <Button variant="secondary" size="lg" href="/">
                Back to the homepage
              </Button>
            </div>
            {error.digest && (
              <p style={{ marginTop: "28px", color: "var(--text-meta)", fontSize: "13px" }}>
                Reference: {error.digest}
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
