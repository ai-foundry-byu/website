"use client"

import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { Eyebrow } from "@/components/ds/Eyebrow"

/**
 * PROTOTYPE (lab only): the "How the Foundry works" scroll-scrub from the
 * Machined Motion proposal — the one sanctioned set piece.
 *
 * A flat panel pins while ~260vh of scroll drives four steps: the giant
 * Archivo cast numeral and step copy crossfade, a hairline rail fills, and
 * the four mono step markers light as they pass. The restrained form on
 * purpose: no zoom, no 3D, no image warping — a pinned plate and
 * crossfades, all inside the brand's flat/hairline language.
 *
 * STEP COPY IS PLACEHOLDER, written to the site's voice but not decided by
 * the team — it lives here, not in content.ts, until Brandon signs copy.
 *
 * Reduced motion: the scrub never mounts; the four steps render as a
 * plain stacked list, fully readable.
 */
const STEPS = [
  {
    n: "1",
    label: "Intake",
    title: "You tell us what you want built.",
    detail: "Eight fields, two minutes. A conversation follows, plus a longer intake covering process, users, data, and compliance.",
  },
  {
    n: "2",
    label: "Scope",
    title: "We scope it in writing.",
    detail: "Deliverables, cost, and schedule — from a velocity pod matched to the expertise your project needs.",
  },
  {
    n: "3",
    label: "Build",
    title: "Students build, production-grade.",
    detail: "Working software early, weekly check-ins, and the same frontier tooling we train your team on.",
  },
  {
    n: "4",
    label: "Ship",
    title: "You own what ships.",
    detail: "Deployed, documented, and handed off. Training for your own team if you want it.",
  },
]

const STAMP: [number, number, number, number] = [0.2, 0.9, 0.3, 1]

/** Opacity window for step i of n, with a hard-edged crossfade at the seams. */
function useStepOpacity(progress: MotionValue<number>, i: number, n: number) {
  const start = i / n
  const end = (i + 1) / n
  return useTransform(
    progress,
    i === 0
      ? [0, end - 0.03, end + 0.03]
      : i === n - 1
        ? [start - 0.03, start + 0.03, 1]
        : [start - 0.03, start + 0.03, end - 0.03, end + 0.03],
    i === 0 ? [1, 1, 0] : i === n - 1 ? [0, 1, 1] : [0, 1, 1, 0],
  )
}

function StepLayer({ progress, i, count }: { progress: MotionValue<number>; i: number; count: number }) {
  const opacity = useStepOpacity(progress, i, count)
  const s = STEPS[i]
  return (
    <motion.div
      style={{
        opacity,
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: "minmax(180px, 340px) minmax(0, 1fr)",
        gap: "48px",
        alignItems: "center",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontStretch: "var(--w-cast)",
          fontSize: "clamp(120px, 22vw, 280px)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "var(--royal)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {s.n}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "44ch" }}>
        <span className="mono-step" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-meta)" }}>
          0{s.n} — {s.label}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontStretch: "var(--w-plate)",
            fontSize: "clamp(28px, 3.4vw, 44px)",
            lineHeight: 1.1,
            margin: 0,
            color: "var(--navy)",
          }}
        >
          {s.title}
        </h2>
        <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-primary)", margin: 0 }}>{s.detail}</p>
      </div>
    </motion.div>
  )
}

function Marker({ progress, i, count }: { progress: MotionValue<number>; i: number; count: number }) {
  const color = useTransform(progress, (v) => (v >= i / count - 0.03 ? "var(--royal)" : "var(--slate)"))
  const weight = useTransform(progress, (v) => (v >= i / count - 0.03 && v < (i + 1) / count ? 600 : 400))
  return (
    <motion.span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color,
        fontWeight: weight,
      }}
    >
      {STEPS[i].label}
    </motion.span>
  )
}

export function ProcessScrub() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] })
  // Relay through a plain motion value set imperatively: this keeps every
  // downstream binding JS-driven. Motion otherwise promotes direct
  // scroll→style chains to native ScrollTimeline WAAPI animations, which
  // misresolve against this sticky-inside-track geometry in some engines
  // (seen frozen mid-fade in headless Chromium during QA).
  const progress = useMotionValue(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => progress.set(v))
  const rail = useTransform(progress, [0, 1], [0, 1])

  if (reduced) {
    return (
      <section style={{ padding: "64px 24px", position: "relative" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          <Eyebrow>How the Foundry works</Eyebrow>
          {STEPS.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
              <span className="stat" style={{ fontSize: "48px", color: "var(--royal)" }}>{s.n}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: "28px" }}>{s.title}</h2>
                <p style={{ margin: "8px 0 0", color: "var(--text-primary)" }}>{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div ref={trackRef} style={{ height: "260vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--surface-page)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            width: "100%",
            margin: "0 auto",
            padding: "96px var(--container-pad) 48px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "24px", flexWrap: "wrap" }}>
            <Eyebrow>How the Foundry works</Eyebrow>
            <div style={{ display: "flex", gap: "22px" }}>
              {STEPS.map((_, i) => (
                <Marker key={i} progress={progress} i={i} count={STEPS.length} />
              ))}
            </div>
          </div>

          {/* The rail: a hairline track whose royal fill is the scrub gauge. */}
          <div style={{ height: "1px", background: "var(--border-hairline)" }}>
            <motion.div style={{ height: "1px", background: "var(--royal)", scaleX: rail, transformOrigin: "left" }} />
          </div>

          <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
            {STEPS.map((_, i) => (
              <StepLayer key={i} progress={progress} i={i} count={STEPS.length} />
            ))}
          </div>

          <p className="caption" style={{ color: "var(--text-meta)" }}>
            Scroll to run the sequence — the panel releases after step 4.
          </p>
        </div>
      </div>
    </div>
  )
}
