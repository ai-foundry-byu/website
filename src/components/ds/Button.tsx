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
type Variant = "primary" | "secondary" | "inverse" | "ghost" | "glass"

/* Runout retheme (brand/runout-2026-11): the primary is the kit's heat
   CTA, a forged-orange pill with Carbon ink (6.95:1) and the heat glow.
   Kit rule: ONE heat button per surface, so the header carries the
   "glass" variant (steel hairline pill for Carbon grounds) and the hero
   or band below it carries the heat. Hover warms the heat a step and
   lifts it 1px; it never swaps to a second hue. */
const PALETTES: Record<string, React.CSSProperties> = {
  primary: { background: "var(--af-heat-cta)", color: "var(--af-carbon)", border: "1px solid transparent", boxShadow: "var(--af-heat-glow)" },
  primaryHover: {
    background: "var(--af-heat-cta)",
    color: "var(--af-carbon)",
    border: "1px solid transparent",
    boxShadow: "0 0 0 1px rgba(255,200,120,.55) inset, 0 14px 44px -8px rgba(255,106,19,.7)",
    filter: "brightness(1.07) saturate(1.05)",
  },
  secondary: { background: "transparent", color: "var(--navy)", border: "1px solid rgba(0,46,93,.4)" },
  secondaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
  inverse: { background: "#fff", color: "var(--navy)", border: "1px solid #fff" },
  inverseHover: { background: "var(--af-specular)", color: "var(--navy)", border: "1px solid var(--af-specular)" },
  ghost: { background: "transparent", color: "var(--royal)", border: "1px solid transparent" },
  ghostHover: { background: "transparent", color: "var(--af-ember)", border: "1px solid transparent" },
  glass: { background: "rgba(228,238,247,.04)", color: "var(--af-specular)", border: "1px solid rgba(169,197,224,.35)" },
  glassHover: { background: "rgba(228,238,247,.12)", color: "#fff", border: "1px solid rgba(228,238,247,.7)" },
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
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    lineHeight: 1.2,
    fontSize: size === "lg" ? "16px" : "var(--size-ui)",
    padding: size === "lg" ? "16px 28px" : "11px 20px",
    borderRadius: "999px",
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
    transform: press && !off ? "translateY(1px)" : hover && !off && variant === "primary" ? "translateY(-1px)" : "none",
    transition:
      "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast), box-shadow var(--dur-base) var(--af-ease-rise), filter var(--dur-base), transform var(--dur-base) var(--af-ease-rise)",
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
  // Runout: the heat button carries its own glow, so no ring by default.
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
