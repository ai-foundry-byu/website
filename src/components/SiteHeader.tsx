import Image from "next/image"
import { CurtainNavLink } from "@/components/CurtainRoute"
import { AccountMenu } from "@/components/AccountMenu"
import { NavMenu } from "@/components/NavMenu"
import { Button } from "@/components/ds/Button"
import { NAV, NAV_ABOUT, NAV_CTA, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Top bar: co-brand lockup left, links, the door into the app (AccountMenu),
 * and one action right. Port of
 * design_handoff .../navigation/NavBar.jsx onto the repo's nav content.
 *
 * The mark is the locked BYU Marriott + AI Foundry lockup file, never a
 * typographic recreation. Carbon bar, so the white one-colour lockup is the
 * sanctioned one here; menus are Graphite on Carbon (guide: cards and menus).
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
      className="af-header sticky top-0 z-50"
      data-ground="navy"
      style={{ ["--bar-ink" as string]: "var(--af-specular)" } as React.CSSProperties}
    >
      <div
        className="mx-auto flex items-center justify-between gap-6"
        style={{ maxWidth: "calc(var(--container) + 2 * var(--container-pad))", padding: "0 var(--container-pad)", height: "72px" }}
      >
        <CurtainNavLink href="/" className="flex min-h-[44px] items-center no-underline">
          {/* Runout lockup, one-colour white on Carbon: below 48px the kit
              allows only the one-colour drawing. The SVG carries its own
              clear space (50 units each side), so it sits slightly taller
              than the old PNG to keep the same visual size. */}
          <Image
            src="/brand/runout/lockup-horizontal-dark.svg"
            alt={`${PROGRAM}, ${SCHOOL_FULL}`}
            width={938}
            height={300}
            priority
            unoptimized
            className="af-header-lockup h-12 w-auto md:h-14"
            style={{ margin: "0 -8px" }}
          />
        </CurtainNavLink>

        {/* desktop nav — the tabs carry the link-draw underline (motion
            plan #2) so header hover speaks the same hairline language. */}
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((link) => (
            <CurtainNavLink
              key={link.href}
              href={link.href}
              className="link-draw whitespace-nowrap no-underline"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--bar-ink)" }}
            >
              {link.label}
            </CurtainNavLink>
          ))}
          <NavMenu label={NAV_ABOUT.label} items={NAV_ABOUT.items} />
          {/* The door into the app, set off from the site's own pages by a hairline. */}
          <span aria-hidden="true" style={{ width: 1, height: 20, background: "var(--af-rule-dark)", margin: "0 -6px" }} />
          <AccountMenu variant="bar" />
          {/* Glass, not heat: the heat button on any page belongs to the
              surface below the bar (kit: one heat button per surface). */}
          <Button variant="glass" href={NAV_CTA.href}>
            {NAV_CTA.label}
          </Button>
        </nav>

        {/* mobile and tablet nav: native disclosure, no script. The bar
            switches at lg (1024px), not md: with About and Sign in beside
            three tabs and the button, at 768 to 900px the bar squeezed the
            lockup to 36 to 190px wide (measured 2026-10-15). */}
        <details className="relative lg:hidden">
          <summary
            className="flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-center px-3 [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--bar-ink)" }}
          >
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 top-full z-50 mt-2 w-56 py-2"
            style={{ background: "var(--af-graphite)", border: "1px solid var(--af-rule-dark)", borderRadius: "var(--radius)", boxShadow: "0 24px 48px -20px rgba(0,0,0,.75)", ["--bar-ink" as string]: "var(--af-specular)", ["--focus-ring" as string]: "#fff" } as React.CSSProperties}
          >
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 no-underline hover:bg-white/5"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--af-specular)" }}
                  >
                    {link.label}
                  </CurtainNavLink>
                </li>
              ))}
              {/* About's pages, under a small label, since the phone menu
                  is already a list and needs no second disclosure. */}
              <li
                className="px-4 pb-1 pt-3"
                style={{ borderTop: "1px solid var(--af-rule-dark)", marginTop: 4, fontFamily: "var(--font-body)", fontSize: "var(--size-caption)", color: "var(--af-fog)" }}
              >
                {NAV_ABOUT.label}
              </li>
              {NAV_ABOUT.items.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 no-underline hover:bg-white/5"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--af-specular)" }}
                  >
                    {link.label}
                  </CurtainNavLink>
                </li>
              ))}
              <li style={{ borderTop: "1px solid var(--af-rule-dark)", marginTop: 4 }}>
                <AccountMenu variant="menu" />
              </li>
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
