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
type Variant = "primary" | "secondary" | "inverse" | "ghost"

const PALETTES: Record<string, React.CSSProperties> = {
  primary: { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" },
  primaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
  secondary: { background: "transparent", color: "var(--navy)", border: "1px solid var(--navy)" },
  secondaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
  inverse: { background: "#fff", color: "var(--navy)", border: "1px solid #fff" },
  inverseHover: { background: "rgba(255,255,255,.85)", color: "var(--navy)", border: "1px solid rgba(255,255,255,.85)" },
  ghost: { background: "transparent", color: "var(--royal)", border: "1px solid transparent" },
  ghostHover: { background: "transparent", color: "var(--navy)", border: "1px solid transparent" },
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  onClick,
  type = "button",
  disabled,
  loading,
  style,
}: {
  variant?: Variant
  size?: "md" | "lg"
  href?: string
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
  loading?: boolean
  style?: React.CSSProperties
}) {
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)
  const off = disabled || loading
  const look = PALETTES[hover && !off ? variant + "Hover" : variant] || PALETTES.primary
  const s: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    lineHeight: 1.2,
    fontSize: size === "lg" ? "16px" : "var(--size-ui)",
    padding: size === "lg" ? "16px 28px" : "12px 20px",
    borderRadius: "var(--radius)",
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
    transition: "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast)",
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
  // Splash ring on the royal primary only: on navy grounds (inverse) a
  // royal ring would put royal on navy, which the palette prohibits.
  const className = variant === "primary" ? styles.splash : undefined
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
    return href.startsWith("/") ? (
      <Link href={href} className={className} style={s} {...handlers}>
        {inner}
      </Link>
    ) : (
      <a href={href} className={className} style={s} {...handlers}>
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
