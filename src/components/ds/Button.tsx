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
type Variant = "primary" | "secondary" | "inverse" | "ghost" | "steel"

/* AF Stride demo (brand/stride-2026-11): the primary is the HEAT button,
   the kit's one orange moment per surface (Forge gradient, Carbon ink,
   6.95:1, a glow that only reads on Carbon). Hover lifts the glow and runs
   a white-heat sheen across it (.sx-btn-heat in globals.css). "steel" is the
   outline pill for dark grounds (header, hero). Every variant is a pill set
   in the kit's button type: Archivo Expanded 600, capitals, +8% tracking. */
const PALETTES: Record<string, React.CSSProperties> = {
  primary: { background: "var(--af-heat-cta)", color: "var(--af-carbon)", border: "1px solid transparent", boxShadow: "var(--af-heat-cta-glow)" },
  primaryHover: { background: "var(--af-heat-cta)", color: "var(--af-carbon)", border: "1px solid transparent", boxShadow: "var(--af-heat-cta-glow-hover)", filter: "brightness(1.06) saturate(1.05)" },
  secondary: { background: "transparent", color: "var(--navy)", border: "1px solid var(--navy)" },
  secondaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
  inverse: { background: "var(--af-specular)", color: "var(--af-carbon)", border: "1px solid var(--af-specular)" },
  inverseHover: { background: "#fff", color: "var(--af-carbon)", border: "1px solid #fff" },
  ghost: { background: "transparent", color: "var(--royal)", border: "1px solid transparent" },
  ghostHover: { background: "transparent", color: "var(--navy)", border: "1px solid transparent" },
  steel: { background: "rgba(228, 238, 247, 0.02)", color: "var(--af-specular)", border: "1px solid rgba(228, 238, 247, 0.3)" },
  steelHover: { background: "rgba(228, 238, 247, 0.09)", color: "#fff", border: "1px solid rgba(228, 238, 247, 0.62)" },
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
    transform: press && !off ? "translateY(1px)" : "none",
    transition:
      "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast), box-shadow var(--dur-base) var(--af-ease-rise), filter var(--dur-base)",
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
  // The splash ring is retired in the Stride demo (the heat glow replaces
  // it); ring="royal" or "white" still opts back in.
  const ringTone = ring ?? "none"
  const ringClass =
    ringTone === "none" ? "" : ringTone === "royal" ? styles.splash : `${styles.splash} ${styles.splashWhite}`
  const className = [ringClass, variant === "primary" ? "sx-btn-heat" : ""].filter(Boolean).join(" ") || undefined
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
