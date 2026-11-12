import Image from "next/image"
import Link from "next/link"
import { LINKEDIN_LINK, NAV_ALL, PROGRAM, QUOTE_CTA, ROADMAP_LINK, SCHOOL_FULL, SPONSOR_LABEL, SPONSORS, UPDATE_LINK } from "@/lib/content"

/**
 * Footer. Port of design_handoff .../navigation/Footer.jsx onto the repo's
 * nav content. Navy ground, so text runs Plex 300 (the on-dark optical
 * fix) and soft text is white at 75%. Royal never appears as text here.
 * The roadmap link stays footer-only; see the note on ROADMAP_LINK.
 */
/**
 * Legal sits last, after the roadmap. It is the only footer entry that is not a
 * destination anyone browses to on purpose: it is there because a privacy
 * notice nobody can find is not a notice, and because external verification
 * flows look for exactly this link in exactly this place. BYU's own footers
 * (byu.edu, marriott.byu.edu) carry the same one link and nothing else.
 */
const LEGAL_LINK = { label: "Legal", href: "/legal" }

const FOOTER_LINKS = [...NAV_ALL, QUOTE_CTA, ROADMAP_LINK, UPDATE_LINK, LEGAL_LINK]

export function SiteFooter() {
  return (
    <footer data-ground="navy" className="af-footer mt-auto" style={{ background: "var(--surface-inverse)", color: "#fff" }}>
      {/* Runout: a Slate set-out line runs across the top of the footer
          and draws itself in as it scrolls into view (CSS scroll-driven, globals.css). */}
      <div aria-hidden="true" className="af-horizon-rule" />
      <div style={{ position: "relative", maxWidth: "calc(var(--container) + 2 * var(--container-pad))", margin: "0 auto", padding: "56px var(--container-pad) 32px" }}>
        {/* Top row: the BYU Marriott logo, at least 250px wide with one B
            of clear space (B = 38.26/396 of the logo's width, about 24 to
            27px here) on every side, and opposite it who the Foundry
            belongs to (each sponsor's own logo, white on navy).
            From 640px: the draft co-brand lockup (system v3, white on navy:
            the official BYU Marriott logo, a rule, the Runout mark and AI
            FOUNDRY), 540 to 600px wide, so the Marriott logo is 251 to
            279px. Under 640px the horizontal lockup cannot hold a 250px
            logo plus its clear space inside the gutters (it needs about
            590px), so phones get the official BYU Marriott logo alone,
            the school's own file unchanged, 250 to 270px wide; the header
            already carries the AI Foundry mark (the secondary version the
            brief allows where the Marriott logo is clearly visible
            elsewhere). The 4px inset keeps one B from the screen edge.
            Widths: globals.css; measured at 390 to 1440px. */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="af-footer-brand">
            <Image
              src="/brand/runout/cobrand/lockup-runout-white-web.svg"
              alt={`${SCHOOL_FULL} and ${PROGRAM}, draft co-brand lockup`}
              width={645}
              height={74}
              unoptimized
              className="af-footer-lockup"
            />
            <Image
              src="/brand/byu-marriott/msb_left_white.svg"
              alt={SCHOOL_FULL}
              width={396}
              height={75}
              unoptimized
              className="af-footer-marriott"
            />
          </div>
          <div>
            <span className="caption" style={{ display: "block", color: "var(--text-on-dark-soft)", fontWeight: 300, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
              {SPONSOR_LABEL}
            </span>
            <div className="flex flex-wrap items-center gap-8">
              {SPONSORS.map((sp) => (
                <a key={sp.href} href={sp.href} aria-label={sp.name}>
                  <Image src={sp.logoWhite} alt={sp.name} width={sp.width} height={sp.height} className="h-8 w-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3" style={{ marginTop: "32px" }}>
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="no-underline link-draw"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "var(--size-ui)", color: "var(--text-on-dark-soft)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3" style={{ borderTop: "1px solid var(--af-rule-dark)", marginTop: "28px", paddingTop: "20px" }}>
          <p className="caption" style={{ color: "var(--text-on-dark-soft)", fontWeight: 300, margin: 0 }}>
            © {new Date().getFullYear()} {PROGRAM}, {SCHOOL_FULL}. Provo, Utah.
          </p>
          <a
            href={LINKEDIN_LINK.href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline link-draw"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "var(--size-ui)", color: "var(--text-on-dark-soft)" }}
          >
            {LINKEDIN_LINK.label}
          </a>
        </div>
      </div>
    </footer>
  )
}
