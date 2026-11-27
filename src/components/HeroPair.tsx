"use client"

import { useEffect } from "react"
import { CUT, HEX } from "@/components/AFBuild"
import { BUILDER_RING, BUILDER_TITLE, CONSULTANT_RING, CONSULTANT_TITLE, HERO_STACK } from "@/lib/content"
import { LIFT, STAGGER, heroLift } from "@/lib/heroLift"
import "@/app/hero.css"

/**
 * HeroPair: the home hero's headline and the two profiles under it (Scott Murff, 2026-11-26).
 * BUILDER-CONSULTANTS. is set on one line, centred, with the two shapes as a centred pair beneath it:
 * the Builder's hexagon left, under BUILDER, and the Consultant's diamond right, under CONSULTANTS.
 * They sit over the centres of the left and right doors below (Scott, 2026-11-27), so the shapes and
 * the doors share one set of verticals and the hero is one centred composition.
 *
 * On a wide screen, as the bar's AI FOUNDRY finishes its build (AFBuild in SiteHeader, home only),
 * an outline of the hexagon lifts out of the bar's O and lands as the Builder, and the diamond
 * leaves the cut and lands as the Consultant, at about 1.4 s and 1.7 s, one after the other. They are navy over the white bar
 * and white over the navy hero. The O stays whole. The travellers (src/lib/heroLift.ts) are the only
 * script here, run inline as the HTML parses (HERO_LIFT_SCRIPT, page.tsx); the
 * profiles themselves are server HTML and CSS (src/app/hero.css), so with no script, or with
 * prefers-reduced-motion, the page simply shows the finished hero. Below 900 px the words stack
 * over the shapes and the shapes are drawn in place, with no lift.
 *
 * The shapes are the framework only, the shape and its named corners (no grid, no data), in the
 * same ring order as ToolkitDiagram on /approach.
 */

type Geo = { names: string[]; start: number; R: number; w: number; h: number }
const BUILDER: Geo = { names: BUILDER_RING, start: 0, R: 70, w: 360, h: 224 }
const CONSULTANT: Geo = { names: CONSULTANT_RING, start: -90, R: 60, w: 360, h: 196 }
const LINE = 17 // label line height

function Profile({ g, label, cls }: { g: Geo; label: string; cls: string }) {
  const cx = g.w / 2
  const cy = g.h / 2
  const n = g.names.length
  const pt = (i: number, r: number) => {
    const a = ((g.start + (360 / n) * i) * Math.PI) / 180
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, c: Math.cos(a), s: Math.sin(a) }
  }
  const frame = g.names.map((_, i) => pt(i, g.R)).map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ")
  return (
    <figure className={`af-prof ${cls}`} aria-label={`${label}: ${g.names.join(", ")}`}>
      <svg viewBox={`0 0 ${g.w} ${g.h}`} width={g.w} height={g.h} aria-hidden="true">
        <polygon className="af-prof-frame" pathLength={1} points={frame} />
        {g.names.map((name, i) => {
          const p = pt(i, g.R + 12)
          const anchor = Math.abs(p.c) < 0.01 ? "middle" : p.c > 0 ? "start" : "end"
          const words = name.split(" ")
          const lines = words.length > 1 && name.length > 12 ? [words[0], words.slice(1).join(" ")] : [name]
          const base = Math.abs(p.s) < 0.01 ? -((lines.length - 1) * LINE) / 2 + 5 : p.s < 0 ? -(lines.length - 1) * LINE - 2 : 12
          const style = { "--i": i, "--dx": p.c.toFixed(3), "--dy": p.s.toFixed(3) } as React.CSSProperties
          return (
            <text key={name} className="af-prof-lab" style={style} textAnchor={anchor} x={p.x.toFixed(2)} y={(p.y + base).toFixed(2)}>
              {lines.map((l, j) => (
                <tspan key={l} x={p.x.toFixed(2)} dy={j ? LINE : 0}>
                  {l}
                </tspan>
              ))}
            </text>
          )
        })}
      </svg>
    </figure>
  )
}

export function HeroPair() {
  const [first, second] = HERO_STACK

  // the lift normally starts from the inline script page.tsx writes after the hero (HERO_LIFT_SCRIPT);
  // this covers arriving here by client-side navigation, where that script does not run
  useEffect(() => heroLift(HEX, CUT, LIFT, STAGGER), [])

  return (
    <div className="af-pair">
      <h1 className="af-pair-title">
        {[first, second].map((w, i) => (
          <span key={w} className="af-w" style={{ "--i": i } as React.CSSProperties}>
            {w}
          </span>
        ))}
      </h1>
      <div className="af-pair-shapes">
        <Profile g={BUILDER} label={BUILDER_TITLE} cls="af-prof-b" />
        <Profile g={CONSULTANT} label={CONSULTANT_TITLE} cls="af-prof-c" />
      </div>
    </div>
  )
}
