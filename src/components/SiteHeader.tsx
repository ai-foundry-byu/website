import Image from "next/image"
import { CurtainNavLink } from "@/components/CurtainRoute"
import { Button } from "@/components/ds/Button"
import { NAV, NAV_CTA, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Top bar: co-brand lockup left, links + one action right. Port of
 * design_handoff .../navigation/NavBar.jsx onto the repo's nav content.
 *
 * The mark is the locked BYU Marriott + AI Foundry lockup file, never a
 * typographic recreation. White bar, so the navy variant is the
 * sanctioned one here.
 *
 * Nav links render through CurtainNavLink (the corbin-curtain-site
 * experiment) so route changes run behind the curtain. The CTA is
 * deliberately not curtained: it targets the /#quote anchor.
 *
 * The handoff bar is desktop-only; the mobile disclosure below is the
 * repo's own, styled to the system (Plex 500 UI labels, hairline panel).
 */
export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "#fff", borderBottom: "1px solid var(--border-hairline)" }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-6"
        style={{ maxWidth: "var(--container)", padding: "0 var(--container-pad)", height: "72px" }}
      >
        <CurtainNavLink href="/" className="flex items-center no-underline">
          <Image
            src="/byu-marriott-ai-foundry.png"
            alt={`${SCHOOL_FULL}, ${PROGRAM}`}
            width={3305}
            height={360}
            priority
            className="h-6 w-auto md:h-8"
          />
        </CurtainNavLink>

        {/* desktop nav — the tabs carry the link-draw underline (motion
            plan #2) so header hover speaks the same hairline language. */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((link) => (
            <CurtainNavLink
              key={link.href}
              href={link.href}
              className="link-draw whitespace-nowrap no-underline"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--navy)" }}
            >
              {link.label}
            </CurtainNavLink>
          ))}
          <Button variant="primary" href={NAV_CTA.href}>
            {NAV_CTA.label}
          </Button>
        </nav>

        {/* mobile nav: native disclosure, no script */}
        <details className="relative md:hidden">
          <summary
            className="cursor-pointer list-none px-2 py-2 [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--navy)" }}
          >
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 top-full z-50 mt-2 w-56 py-2"
            style={{ background: "#fff", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius)" }}
          >
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 no-underline"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--navy)" }}
                  >
                    {link.label}
                  </CurtainNavLink>
                </li>
              ))}
              <li className="px-4 pb-2 pt-3">
                <Button variant="primary" href={NAV_CTA.href} style={{ width: "100%" }}>
                  {NAV_CTA.label}
                </Button>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  )
}
