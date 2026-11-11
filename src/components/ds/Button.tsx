"use client"

import { useState } from "react"
import { CurtainNavLink } from "@/components/CurtainRoute"
import styles from "./Button.module.css"

/**
 * Primary action. Flat royal fill with the splash ring (offset outline
 * that melts on hover, from /lab/splash-button — see Button.module.css
 * for the recorded deviation), hover to navy, press stamps down 1px.
 * Both fills are the designated blues and both are inline, so the swap
 * animates solid-to-solid — the earlier gradient fill could not
 * transition to navy and flashed. Otherwise a port of design_handoff
 * .../forms/Button.jsx, values preserved; internal hrefs render through
 * next/link so client navigation keeps working.
 */
type Variant = "primary" | "secondary" | "inverse" | "ghost" | "outline"

/* AF Stride demo v2 (brand/stride-2026-11): the primary is the page's ONE
   orange, flat. Its colours come from tokens that follow the ground: BYU
   Orange with white ink on white (4.67:1), Signal Orange with Ink on navy
   (5.12:1) via [data-ground="navy"] in globals.css. Hover steps the value,
   never adds a glow. "outline" is the white outline button for navy grounds
   (header, hero). Every variant is set in the kit's button type: Archivo
   Expanded 600, capitals, +8% tracking, square 2px corners. */
const PALETTES: Record<string, React.CSSProperties> = {
  primary: { background: "var(--cta-bg)", color: "var(--cta-ink)", border: "1px solid var(--cta-bg)" },
  primaryHover: { background: "var(--cta-bg-hover)", color: "var(--cta-ink)", border: "1px solid var(--cta-bg-hover)" },
  secondary: { background: "transparent", color: "var(--navy)", border: "1px solid var(--navy)" },
  secondaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
  inverse: { background: "#fff", color: "var(--navy)", border: "1px solid #fff" },
  inverseHover: { background: "var(--af-mist)", color: "var(--navy)", border: "1px solid var(--af-mist)" },
  ghost: { background: "transparent", color: "var(--royal)", border: "1px solid transparent" },
  ghostHover: { background: "transparent", color: "var(--navy)", border: "1px solid transparent" },
  outline: { background: "transparent", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.55)" },
  outlineHover: { background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "1px solid #fff" },
}

export function Button({
  variant = "primary",
  size = "md",
  ring,
  href,
  children,
  onClick,
  type = "button",
  disabled,
  loading,
  style,
  download,
}: {
  variant?: Variant
  size?: "md" | "lg"
  /** Splash ring color. Defaults: royal on primary, none elsewhere.
   *  "white" is for white buttons (hero secondary, the navy band's
   *  inverse) — same mechanics, white-derived ring. */
  ring?: "royal" | "white" | "none"
  href?: string
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
  loading?: boolean
  style?: React.CSSProperties
  /** A file, not a page: renders a plain <a download> so next/link never
   *  tries to prefetch or client-route to it. The value is the saved name. */
  download?: string
}) {
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)
  const off = disabled || loading
  const look = PALETTES[hover && !off ? variant + "Hover" : variant] || PALETTES.primary
  const s: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontStretch: "125%",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    lineHeight: 1.2,
    fontSize: size === "lg" ? "13.5px" : "12px",
    padding: size === "lg" ? "17px 30px" : "12px 20px",
    borderRadius: "2px",
    cursor: off ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    textDecoration: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
    flex: "none",
    transform: press && !off ? "translateY(1px)" : "none",
    transition:
      "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast)",
    ...look,
    ...style,
  }
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false)
      setPress(false)
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    onClick: off ? undefined : onClick,
  }
  // The splash ring is retired in the Stride demo (flat buttons only);
  // ring="royal" or "white" still opts back in.
  const ringTone = ring ?? "none"
  const ringClass =
    ringTone === "none" ? "" : ringTone === "royal" ? styles.splash : `${styles.splash} ${styles.splashWhite}`
  const className = ringClass || undefined
  const inner = (
    <>
      {loading ? (
        <span
          aria-hidden="true"
          style={{
            width: "12px",
            height: "12px",
            border: "2px solid currentColor",
            borderRightColor: "transparent",
            animation: "btn-spin .8s linear infinite",
            display: "inline-block",
          }}
        />
      ) : null}
      {children}
    </>
  )
  if (href) {
    return href.startsWith("/") && !download ? (
      <CurtainNavLink href={href} className={className} style={s} {...handlers}>
        {inner}
      </CurtainNavLink>
    ) : (
      <a href={href} download={download} className={className} style={s} {...handlers}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type} disabled={off} className={className} style={s} {...handlers}>
      {inner}
    </button>
  )
}
