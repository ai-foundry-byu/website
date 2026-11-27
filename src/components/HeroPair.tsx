"use client"

import { useEffect } from "react"
import { CUT, HEX } from "@/components/AFBuild"
import { BUILDER_RING, BUILDER_TITLE, CONSULTANT_RING, CONSULTANT_TITLE, HERO_STACK } from "@/lib/content"
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
 * leaves the cut and lands as the Consultant, both at about 1.4 s. They are navy over the white bar
 * and white over the navy hero. The O stays whole. The travellers are the only script here; the
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
const LIFT = 950 // ms on the hero's CSS clock when the outlines leave the bar's O

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

/** One traveller: an outline of `d` that starts over `from` and lands on `to`, recoloured navy to white.
 *  `start` is the CSS clock's start (document timeline ms), so it lands exactly as the CSS shows the frame. */
function fly(d: string, viewBox: string, from: DOMRect, to: DOMRect, start: number) {
  const ns = "http://www.w3.org/2000/svg"
  const svg = document.createElementNS(ns, "svg")
  svg.setAttribute("viewBox", viewBox)
  svg.setAttribute("preserveAspectRatio", "none")
  svg.setAttribute("aria-hidden", "true")
  svg.setAttribute("class", "af-trav")
  const path = document.createElementNS(ns, "path")
  path.setAttribute("d", d)
  svg.appendChild(path)
  Object.assign(svg.style, {
    left: `${to.left + window.scrollX}px`,
    top: `${to.top + window.scrollY}px`,
    width: `${to.width}px`,
    height: `${to.height}px`,
  })
  document.body.appendChild(svg)
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  const from0 = `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`
  // lands at LIFT + 460 = 1410 ms on the CSS clock; the frame is shown from 1400 ms (hero.css), so
  // the outline hands over to the frame under it instead of fading out before it appears
  const timing = { duration: 460, delay: LIFT, easing: "cubic-bezier(.65,0,.25,1)", fill: "both" as const }
  const move = svg.animate(
    [
      { opacity: 0, transform: from0 },
      { opacity: 1, transform: from0, offset: 0.08 },
      { opacity: 1, transform: "none", offset: 0.98 },
      { opacity: 0, transform: "none" },
    ],
    timing,
  )
  const tint = svg.animate([{ color: "#002e5d" }, { color: "#002e5d", offset: 0.16 }, { color: "#ffffff", offset: 0.3 }, { color: "#ffffff" }], timing)
  move.startTime = start
  tint.startTime = start
  move.finished.then(() => svg.remove(), () => svg.remove())
  return svg
}

export function HeroPair() {
  const [first, second] = HERO_STACK

  useEffect(() => {
    // The lift belongs to the first paint only: skip it on narrow screens and for reduced motion. It
    // runs on the hero's CSS clock (the start of the frame's own CSS animation), not on page load,
    // and is skipped if the page hydrated too late to start it before the shapes land.
    if (!window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) return
    const css = document.querySelector(".af-prof-b .af-prof-frame")?.getAnimations()[0]
    const clock = css?.startTime
    const now = document.timeline.currentTime
    if (typeof clock !== "number" || typeof now !== "number" || now - clock > LIFT - 50) return
    const o = document.querySelector<SVGPathElement>(".af-lockup .af-hex")
    const b = document.querySelector<SVGPolygonElement>(".af-prof-b .af-prof-frame")
    const c = document.querySelector<SVGPolygonElement>(".af-prof-c .af-prof-frame")
    if (!o || !b || !c) return
    const hx = o.getBoundingClientRect()
    // the cut sits centred in the hexagon: 70 of its 115.473 units wide, 70 of its 100 tall
    const cw = (hx.width * 70) / 115.473
    const ch = hx.height * 0.7
    const cut = new DOMRect(hx.left + (hx.width - cw) / 2, hx.top + (hx.height - ch) / 2, cw, ch)
    const made = [
      fly(HEX, "333.654 0 115.473 100", hx, b.getBoundingClientRect(), clock),
      fly(CUT, "356.39 15.007 70 70", cut, c.getBoundingClientRect(), clock),
    ]
    return () => made.forEach((el) => el.remove())
  }, [])

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
