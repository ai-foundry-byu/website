"use client"

import { motion, MotionConfig, type Variants } from "motion/react"

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
/* Runout retheme, system v2: sections are set in the way the hero mark is
   built, on the kit's travel easing (--af-ease-travel: lift, travel, slow
   final approach), a short slide with no blur, and grid children are placed
   one after another like members off a crane. Reduced motion still strips
   the transform (MotionRoot); the fade remains, so content always appears. */
export const TRAVEL: [number, number, number, number] = [0.65, 0, 0.25, 1]
const TWEEN = { duration: 0.55, ease: TRAVEL } as const
const HIDDEN = { opacity: 0, y: 16 }
const SHOWN = { opacity: 1, y: 0 }

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className="m-reveal"
      initial={HIDDEN}
      whileInView={SHOWN}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...TWEEN, delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

const STAGGER_PARENT: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const STAGGER_CHILD: Variants = {
  hidden: HIDDEN,
  show: { ...SHOWN, transition: TWEEN },
}

/** Grid wrapper: children (StaggerItem) land in sequence, once. */
export function Stagger({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div
      variants={STAGGER_PARENT}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div className="m-reveal" variants={STAGGER_CHILD} style={style}>
      {children}
    </motion.div>
  )
}

/**
 * A 1px rule that draws itself in from the left when it enters view.
 * tone "hairline" (default) or "strong" (solid navy). `bleed` pins it to
 * the top edge of a position:relative section so it stays full-bleed the
 * way the section borders it replaces were.
 */
export function DrawRule({
  tone = "hairline",
  bleed = false,
  delay = 0,
}: {
  tone?: "hairline" | "strong"
  bleed?: boolean
  delay?: number
}) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ ...TWEEN, delay }}
      style={{
        height: "1px",
        background: tone === "strong" ? "var(--border-strong)" : "var(--border-hairline)",
        transformOrigin: "left",
        ...(bleed ? { position: "absolute", top: 0, left: 0, right: 0 } : {}),
      }}
    />
  )
}
