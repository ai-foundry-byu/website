import Image from "next/image"
import Link from "next/link"
import { HERO_SUPPORT, NAV, PROGRAM, QUOTE_CTA, ROADMAP_LINK, SCHOOL_FULL } from "@/lib/content"

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

const FOOTER_LINKS = [...NAV, QUOTE_CTA, ROADMAP_LINK, LEGAL_LINK]

export function SiteFooter() {
  return (
    <footer data-ground="navy" className="mt-auto" style={{ background: "var(--surface-inverse)", color: "#fff" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px var(--container-pad) 32px" }}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Image
            src="/byu-marriott-ai-foundry-light.png"
            alt={`${SCHOOL_FULL}, ${PROGRAM}`}
            width={3305}
            height={360}
            className="h-8 w-auto"
          />
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
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
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", marginTop: "32px", paddingTop: "20px" }}>
          <p className="caption" style={{ color: "var(--text-on-dark-soft)", fontWeight: 300, margin: 0 }}>
            {HERO_SUPPORT}
          </p>
          <p className="caption" style={{ color: "var(--text-on-dark-soft)", fontWeight: 300, margin: "6px 0 0" }}>
            © {new Date().getFullYear()} {PROGRAM}, {SCHOOL_FULL}. Provo, Utah.
          </p>
        </div>
      </div>
    </footer>
  )
}
