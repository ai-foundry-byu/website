import { CurtainNavLink } from "@/components/CurtainRoute"
import { AccountMenu } from "@/components/AccountMenu"
import { NavMenu } from "@/components/NavMenu"
import { Button } from "@/components/ds/Button"
import { CobrandLockup } from "@/components/CobrandLockup"
import { NAV, NAV_ABOUT, NAV_CTA, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * AF Stride demo, system v3 (brand/stride-2026-11): a flat BYU Navy bar on
 * every page carrying the draft co-brand lockup, white on navy: the official
 * BYU Marriott logo, unchanged, a thin rule, the AF Stride mark and AI
 * FOUNDRY (CobrandLockup; Draft for BYU Marriott approval).
 *
 * Scott Murff's brief: the Marriott logo is at least 250 px wide in every
 * version of the lockup, with one "B" of BYU clear all round. From 768 px the
 * full lockup holds a 250 px logo and its clear space (the component's own
 * padding, 24.2 px, so the bar is about 105 px tall). Below 768 px it cannot,
 * so the bar carries the secondary version the brief allows, the AF mark and
 * AI FOUNDRY, and the footer carries the official BYU Marriott logo at 250 px
 * on the same page (SiteFooter). White labels, and a white
 * outline button for the CTA; the hero carries the page's one filled button.
 * The bar carries view-transition-name: af-header (.sx-header) so it holds
 * still while routes change beneath it.
 *
 * Top bar: lockup left, links, the door into the app (AccountMenu),
 * and one action right. Port of
 * design_handoff .../navigation/NavBar.jsx onto the repo's nav content.
 *
 * Nav links render through CurtainNavLink (the corbin-curtain-site
 * experiment) so route changes run behind the curtain. The CTA is
 * deliberately not curtained: it targets the /#quote anchor.
 *
 * The full lockup at a 250 px logo is 548 px wide, so the inline nav waits
 * for xl (1280 px); below that the repo's own disclosure menu is used.
 */
export function SiteHeader() {
  return (
    <header className="sx-header sticky top-0 z-50" data-ground="navy">
      <div
        className="mx-auto flex items-center justify-between gap-0"
        style={{ maxWidth: "calc(var(--container) + 2 * var(--container-pad))", padding: "0 var(--container-pad)" }}
      >
        <CurtainNavLink href="/" className="sx-header-home flex min-w-0 items-center no-underline">
          <span className="hidden md:block">
            <CobrandLockup tone="white" logoWidth={250} priority alt={`${SCHOOL_FULL} | ${PROGRAM}. Draft co-brand lockup for BYU Marriott approval.`} />
          </span>
          {/* Phones: the secondary version (mark and AI FOUNDRY, the lockup's
              right half). The official Marriott logo is in the footer at 250 px. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- brand artwork is served unchanged */}
          <img
            className="sx-header-secondary md:hidden"
            src="/brand/stride/mark-wordmark-stride-white.svg"
            alt={`${PROGRAM}. Draft mark for BYU Marriott approval.`}
            width={297.86}
            height={52.27}
            style={{ height: 34, width: "auto" }}
          />
        </CurtainNavLink>

        {/* desktop nav — the tabs carry the link-draw underline (motion
            plan #2) so header hover speaks the same hairline language. */}
        <nav aria-label="Main" className="hidden items-center gap-[15px] xl:flex">
          {NAV.map((link) => (
            <CurtainNavLink
              key={link.href}
              href={link.href}
              className="link-draw whitespace-nowrap no-underline"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--nav-ink)" }}
            >
              {link.label}
            </CurtainNavLink>
          ))}
          <NavMenu label={NAV_ABOUT.label} items={NAV_ABOUT.items} />
          {/* The door into the app, set off from the site's own pages by a hairline. */}
          <span aria-hidden="true" style={{ width: 1, height: 20, background: "var(--nav-rule)", margin: "0 -6px" }} />
          <AccountMenu variant="bar" />
          <Button variant="outline" href={NAV_CTA.href}>
            {NAV_CTA.label}
          </Button>
        </nav>

        {/* mobile and tablet nav: native disclosure, no script. The bar
            switches at xl (1280px): the co-brand lockup needs 597 px at the
            brief's 250 px logo with its clear space, and the inline nav
            needs the rest. */}
        <details className="relative xl:hidden">
          <summary
            className="cursor-pointer list-none px-2 py-2 [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--nav-ink)" }}
          >
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 top-full z-50 mt-2 w-56 py-2"
            style={{ background: "var(--nav-panel)", border: "1px solid var(--nav-rule)", borderRadius: "12px" }}
          >
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 no-underline"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--nav-ink)" }}
                  >
                    {link.label}
                  </CurtainNavLink>
                </li>
              ))}
              {/* About's pages, under a small label, since the phone menu
                  is already a list and needs no second disclosure. */}
              <li
                className="px-4 pb-1 pt-3"
                style={{ borderTop: "1px solid var(--nav-rule)", marginTop: 4, fontFamily: "var(--font-body)", fontSize: "var(--size-caption)", color: "var(--af-mist)" }}
              >
                {NAV_ABOUT.label}
              </li>
              {NAV_ABOUT.items.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 no-underline"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--nav-ink)" }}
                  >
                    {link.label}
                  </CurtainNavLink>
                </li>
              ))}
              <li style={{ borderTop: "1px solid var(--nav-rule)", marginTop: 4 }}>
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
