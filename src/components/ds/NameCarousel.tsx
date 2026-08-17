import { Fragment } from "react"
import { Eyebrow } from "../ds/Eyebrow"

/* Auto-scrolling strip of employer names. Names as text, never logos —
   "shipped at" is a resume claim, and a logo would read as endorsement.
   Port of design_handoff .../content/NameCarousel.jsx; the nc-scroll
   keyframes live in globals.css. */
export function NameCarousel({
  eyebrow = "Our builders have shipped at",
  names = [],
  duration = 28,
}: {
  eyebrow?: string
  names: string[]
  duration?: number
}) {
  const row = names.map((n, i) => (
    <Fragment key={i}>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "15px", color: "var(--navy)", whiteSpace: "nowrap" }}>
        {n}
      </span>
      <span aria-hidden="true" style={{ color: "var(--text-meta)", fontSize: "15px" }}>
        ·
      </span>
    </Fragment>
  ))
  return (
    <div
      style={{
        borderTop: "1px solid var(--border-hairline)",
        borderBottom: "1px solid var(--border-hairline)",
        padding: "14px 0",
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <Eyebrow style={{ flex: "none", paddingLeft: "var(--container-pad)" }}>{eyebrow}</Eyebrow>
      <div
        style={{
          overflow: "hidden",
          flex: 1,
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "20px",
            paddingRight: "20px",
            animation: `nc-scroll ${duration}s linear infinite`,
            willChange: "transform",
          }}
        >
          {row}
          {row}
        </div>
      </div>
    </div>
  )
}
