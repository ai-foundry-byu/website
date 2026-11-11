"use client"

import { MotionConfig } from "motion/react"

/**
 * The site's scroll-entrance motion system (proposals 1 and 3 of the
 * 2026-08-16 motion plan, approved by Corbin).
 *
 * Three primitives, one voice:
 *   Reveal    — a section (or block) fades in with a 12px rise, once.
 *   Stagger / StaggerItem — a grid whose children land 60ms apart.
 *   DrawRule  — a hairline rule that draws itself left-to-right, once.
 *
 * Everything runs the brand tween (300ms, stamp ease) — never springs.
 * MotionRoot's reducedMotion="user" strips the transforms for
 * prefers-reduced-motion users; the opacity fade remains, so content
 * always appears.
 */
export const STAMP: [number, number, number, number] = [0.2, 0.9, 0.3, 1]

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

/*
 * AF Stride demo (brand/stride-2026-11): Reveal, Stagger and DrawRule are now
 * SCROLL-DRIVEN CSS (animation-timeline: view(), rules in globals.css under
 * "Scroll-driven reveal"). Each block rises 24px out of a soft blur on the
 * rise's own easing, tied to scroll position rather than a timer, with no
 * JavaScript and no observers. Browsers without scroll timelines, and anyone
 * who asks for reduced motion, get the content in place, never hidden.
 * Signatures are unchanged so every page keeps working.
 */
export function Reveal({
  children,
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}) {
  return (
    <div className="sd-reveal" style={style}>
      {children}
    </div>
  )
}

/** Grid wrapper: children (StaggerItem) land in sequence as they scroll in. */
export function Stagger({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="sd-stagger" style={style}>
      {children}
    </div>
  )
}

export function StaggerItem({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="sd-reveal" style={style}>
      {children}
    </div>
  )
}

/**
 * A 1px rule that draws itself in from the left as it scrolls into view.
 * tone "hairline" (default) or "strong" (solid navy). `bleed` pins it to
 * the top edge of a position:relative section so it stays full-bleed.
 */
export function DrawRule({
  tone = "hairline",
  bleed = false,
}: {
  tone?: "hairline" | "strong"
  bleed?: boolean
  delay?: number
}) {
  return (
    <div
      aria-hidden="true"
      className="sd-draw"
      style={{
        height: "1px",
        background: tone === "strong" ? "var(--border-strong)" : "var(--border-hairline)",
        transformOrigin: "left",
        ...(bleed ? { position: "absolute", top: 0, left: 0, right: 0 } : {}),
      }}
    />
  )
}
