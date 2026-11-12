import { CurtainNavLink } from "@/components/CurtainRoute"
import { AccountMenu } from "@/components/AccountMenu"
import { NavMenu } from "@/components/NavMenu"
import { Button } from "@/components/ds/Button"
import { NAV, NAV_ABOUT, NAV_CTA, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Top bar: the BYU Marriott logo left, links, the door into the app
 * (AccountMenu), and one action right. Port of
 * design_handoff .../navigation/NavBar.jsx onto the repo's nav content.
 *
 * Runout, system v3 (brand/runout-2026-11; Scott Murff's logo brief): the
 * first thing on every page is the official BYU Marriott logo, at least
 * 250px wide with one B of clear space (B = 38.26/396 of the logo's width,
 * about 24px) plus a 3px margin, on every side:
 * - from 768px: the draft co-brand lockup (the official logo, unchanged, a
 *   rule, the Runout mark and AI FOUNDRY), 540px wide, so the Marriott logo
 *   is 251px, with 28px of clear space round the whole lockup;
 * - under 768px: the official BYU Marriott logo alone (msb_left_white.svg,
 *   the school's own file, unchanged), 251px wide, 28px clear; the Runout
 *   mark is in the hero below it.
 * The draft label is a strip across the top of the bar, so it travels with
 * the bar and never floats over a logo (the old fixed chip slid over the
 * footer lockup). Heights, widths and breakpoints: globals.css.
 *
 * Nav links render through CurtainNavLink (the corbin-curtain-site
 * experiment) so route changes run behind the curtain. The CTA is
 * deliberately not curtained: it targets the /#quote anchor.
 */
export function SiteHeader() {
  return (
    <header
      className="af-header sticky top-0 z-50"
      data-ground="navy"
      style={{ ["--bar-ink" as string]: "#fff" } as React.CSSProperties}
    >
      <p className="af-draft-strip" role="note">
        Draft for BYU Marriott approval
      </p>
      <div
        className="af-header-row mx-auto flex items-center justify-between"
        style={{ maxWidth: "calc(var(--container) + 2 * var(--container-pad))" }}
      >
        <CurtainNavLink href="/" className="af-header-home flex shrink-0 items-center no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand artwork is served unchanged */}
          <img
            src="/brand/runout/cobrand/lockup-runout-white-web.svg"
            alt={`${SCHOOL_FULL} and ${PROGRAM}, draft co-brand lockup for BYU Marriott approval`}
            width={645}
            height={74}
            className="af-header-lockup"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- the school's own file, unchanged */}
          <img
            src="/brand/byu-marriott/msb_left_white.svg"
            alt={SCHOOL_FULL}
            width={396}
            height={75}
            className="af-header-marriott"
          />
        </CurtainNavLink>

        {/* desktop nav — the tabs carry the link-draw underline (motion
            plan #2) so header hover speaks the same hairline language. */}
        <nav aria-label="Main" className="af-header-nav hidden items-center xl:flex">
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
          {/* Outline, not the primary: the primary on any page belongs to
              the surface below the bar (kit: one primary action per surface). */}
          <Button variant="outline" href={NAV_CTA.href}>
            {NAV_CTA.label}
          </Button>
        </nav>

        {/* mobile and tablet nav: native disclosure, no script. The bar
            switches at xl (1280px): the lockup and its clear space take
            596px, which leaves the inline nav no room below 1280. */}
        <details className="af-header-menu xl:hidden">
          <summary
            className="flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-center px-3 [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--bar-ink)" }}
          >
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-2 top-full z-50 mt-1 w-56 py-2"
            style={{ background: "var(--af-navy-raised)", border: "1px solid var(--af-rule-dark)", borderRadius: "var(--radius)", ["--bar-ink" as string]: "#fff", ["--focus-ring" as string]: "#fff" } as React.CSSProperties}
          >
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 no-underline hover:bg-white/5"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "#fff" }}
                  >
                    {link.label}
                  </CurtainNavLink>
                </li>
              ))}
              {/* About's pages, under a small label, since the phone menu
                  is already a list and needs no second disclosure. */}
              <li
                className="px-4 pb-1 pt-3"
                style={{ borderTop: "1px solid var(--af-rule-dark)", marginTop: 4, fontFamily: "var(--font-body)", fontSize: "var(--size-caption)", color: "var(--af-mist)" }}
              >
                {NAV_ABOUT.label}
              </li>
              {NAV_ABOUT.items.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 no-underline hover:bg-white/5"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "#fff" }}
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
