"use client"

import { useState } from "react"
import Link from "next/link"
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

/* Runout retheme, system v3 (brand/runout-2026-11, draft for BYU Marriott
   approval): flat, square-shouldered buttons, no orange. The primary's
   colours for its ground come from CSS (globals.css, --cta-*): Royal #003DA5
   with a White label on white and paper (9.5:1), White with a Navy label on
   Navy (13.6:1). Royal never sits on navy. ONE primary per surface, so the
   bar carries the "outline" variant (a white hairline on navy) and the hero
   or band below it carries the primary. Hover steps one value (Royal to
   Navy, White to Mist); it never glows. */
const PALETTES: Record<string, React.CSSProperties> = {
  primary: { background: "var(--cta-bg)", color: "var(--cta-ink)", border: "1px solid var(--cta-bg)" },
  primaryHover: { background: "var(--cta-bg-hover)", color: "var(--cta-ink)", border: "1px solid var(--cta-bg-hover)" },
  secondary: { background: "transparent", color: "var(--navy)", border: "1px solid var(--navy)" },
  secondaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
  inverse: { background: "#fff", color: "var(--navy)", border: "1px solid #fff" },
  inverseHover: { background: "var(--af-mist)", color: "var(--navy)", border: "1px solid var(--af-mist)" },
  ghost: { background: "transparent", color: "var(--royal)", border: "1px solid transparent" },
  ghostHover: { background: "transparent", color: "var(--navy)", border: "1px solid transparent" },
  outline: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.7)" },
  outlineHover: { background: "#fff", color: "var(--navy)", border: "1px solid #fff" },
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
    /* Kit: Archivo Expanded capitals, tracked open, 2px corners. */
    fontFamily: "var(--font-display)",
    fontStretch: "125%",
    fontWeight: 600,
    lineHeight: 1.2,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: size === "lg" ? "14px" : "12.5px",
    padding: size === "lg" ? "17px 26px" : "12px 18px",
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
    transition: "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast), transform 110ms var(--af-ease-seat)",
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
  // Ring defaults: royal on the primary, none elsewhere. A royal ring
  // never goes on navy grounds (prohibited pair) — white is the ring for
  // buttons that live there.
  // Runout v2: flat buttons, no splash ring unless a caller asks for one.
  const ringTone = ring ?? "none"
  const className =
    ringTone === "none"
      ? undefined
      : ringTone === "royal"
        ? styles.splash
        : `${styles.splash} ${styles.splashWhite}`
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
      <Link href={href} className={className} style={s} {...handlers}>
        {inner}
      </Link>
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
