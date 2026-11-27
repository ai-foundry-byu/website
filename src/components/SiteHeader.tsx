import Image from "next/image"
import { CurtainNavLink } from "@/components/CurtainRoute"
import { AccountMenu } from "@/components/AccountMenu"
import { MobileMenu } from "@/components/MobileMenu"
import { NavMenu } from "@/components/NavMenu"
import { Button } from "@/components/ds/Button"
import { AFBuild } from "@/components/AFBuild"
import { NAV, NAV_ABOUT, NAV_CTA, PROGRAM, SCHOOL_FULL, SPONSORS } from "@/lib/content"

const SPONSOR = SPONSORS[0]

/**
 * Top bar: co-brand lockup left, links, the door into the app (AccountMenu),
 * and one action right. Port of
 * design_handoff .../navigation/NavBar.jsx onto the repo's nav content.
 *
 * The mark is a draft lockup (Scott Murff, 2026-11-26): the official BYU Strategy
 * program logo (Marriott's file, unaltered), a hairline rule, then the AI FOUNDRY
 * wordmark drawn live (AFBuild, light). Marriott Marketing is reviewing it; until
 * it approves a final file this draft is what runs. On the home page (`home`) the
 * wordmark plays its blueprint build on first paint and its O hands the hexagon and
 * diamond to the hero (HeroPair); everywhere else it is still. The home page also
 * drops the bar's Start a project button: the hero's Clients door replaces it.
 *
 * Nav links render through CurtainNavLink (the corbin-curtain-site
 * experiment) so route changes run behind the curtain. The CTA is
 * deliberately not curtained: it targets the /#quote anchor.
 *
 * The handoff bar is desktop-only; the mobile disclosure below is the
 * repo's own, styled to the system (Plex 500 UI labels, hairline panel).
 */
export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "#fff", borderBottom: "1px solid var(--border-hairline)" }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-6"
        style={{ maxWidth: "calc(var(--container) + 2 * var(--container-pad))", padding: "0 var(--container-pad)", height: "72px" }}
      >
        <CurtainNavLink href="/" className="af-lockup no-underline" aria-label={`${PROGRAM}, ${SPONSOR.name}, ${SCHOOL_FULL}`}>
          <Image src={SPONSOR.logo} alt="" width={SPONSOR.width} height={SPONSOR.height} priority className="af-lockup-parent" />
          <span className="af-lockup-rule" aria-hidden="true" />
          <AFBuild theme="light" id="af-bar-wn" build={home} className="af-lockup-mark" />
        </CurtainNavLink>

        {/* desktop nav — the tabs carry the link-draw underline (motion
            plan #2) so header hover speaks the same hairline language. */}
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
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
          <NavMenu label={NAV_ABOUT.label} items={NAV_ABOUT.items} />
          {/* The door into the app, set off from the site's own pages by a hairline. */}
          <span aria-hidden="true" style={{ width: 1, height: 20, background: "var(--border-hairline)", margin: "0 -6px" }} />
          <AccountMenu variant="bar" />
          {!home && (
            <Button variant="primary" href={NAV_CTA.href}>
              {NAV_CTA.label}
            </Button>
          )}
        </nav>

        {/* mobile and tablet nav: a native disclosure that MobileMenu closes on a pick,
            an outside tap, Escape and a route change. The bar
            switches at lg (1024px), not md: with About and Sign in beside
            three tabs and the button, at 768 to 900px the bar squeezed the
            lockup to 36 to 190px wide (measured 2026-10-15). */}
        <MobileMenu className="relative lg:hidden">
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
              {/* About's pages, under a small label, since the phone menu
                  is already a list and needs no second disclosure. */}
              <li
                className="px-4 pb-1 pt-3"
                style={{ borderTop: "1px solid var(--border-hairline)", marginTop: 4, fontFamily: "var(--font-body)", fontSize: "var(--size-caption)", color: "var(--text-meta)" }}
              >
                {NAV_ABOUT.label}
              </li>
              {NAV_ABOUT.items.map((link) => (
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
              <li style={{ borderTop: "1px solid var(--border-hairline)", marginTop: 4 }}>
                <AccountMenu variant="menu" />
              </li>
              <li className="px-4 pb-2 pt-3">
                <Button variant="primary" href={NAV_CTA.href} style={{ width: "100%" }}>
                  {NAV_CTA.label}
                </Button>
              </li>
            </ul>
          </nav>
        </MobileMenu>
      </div>
    </header>
  )
}
