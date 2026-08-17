"use client"

import { Fragment, useState } from "react"
import { Eyebrow } from "../ds/Eyebrow"

/* Auto-scrolling strip of employer names. Port of design_handoff
   .../content/NameCarousel.jsx; the nc-scroll keyframes live in
   globals.css.

   LOGO MODE (Corbin's override, 2026-08-16): items with a `logo` path
   render the company's artwork instead of text, grayscaled to keep the
   strip monochrome; items without one fall back to the name as text.
   THIS OVERRIDES RECORDED BRAND LAW — content.ts ("No logos, ever… a
   logo reads as endorsement") and DESIGN_SYSTEM.md say the strip is
   names-as-text only, precisely because no agreement exists with these
   companies. Reverting is one change: stop passing `logo` values. */
export type CarouselItem = { name: string; logo?: string }

export function NameCarousel({
  eyebrow = "Our builders have shipped at",
  items = [],
  duration = 28,
}: {
  eyebrow?: string
  items: CarouselItem[]
  duration?: number
}) {
  const [paused, setPaused] = useState(false)
  const anyLogos = items.some((i) => i.logo)
  const row = items.map((item, i) => (
    <Fragment key={i}>
      {item.logo ? (
        /* Plain <img> on purpose: tiny local static assets, heights vary
           by intrinsic ratio, and next/image buys nothing here. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt={item.name}
          style={{
            height: "22px",
            width: "auto",
            display: "block",
            flex: "none",
            filter: "grayscale(1)",
            opacity: 0.75,
          }}
        />
      ) : (
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "15px", color: "var(--navy)", whiteSpace: "nowrap" }}>
          {item.name}
        </span>
      )}
      {/* The · separator belongs to the text treatment; logo strips
          separate with space alone. */}
      {!anyLogos && (
        <span aria-hidden="true" style={{ color: "var(--text-meta)", fontSize: "15px" }}>
          ·
        </span>
      )}
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
            gap: anyLogos ? "44px" : "20px",
            paddingRight: anyLogos ? "44px" : "20px",
            animation: `nc-scroll ${duration}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform",
          }}
        >
          {row}
          {/* Duplicate copy exists only to make the loop seamless; hide it
              from assistive tech so the list is announced once. */}
          <div aria-hidden="true" style={{ display: "contents" }}>
            {row}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? "Play animation" : "Pause animation"}
        style={{
          flex: "none",
          marginRight: "var(--container-pad)",
          padding: "2px 8px",
          background: "none",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "12px",
          color: "var(--text-meta)",
          cursor: "pointer",
        }}
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  )
}
