"use client"
/*
 * HeroBuild: the AF Stride mark (round 8 final-3, the master of record),
 * built the way a crew builds: a blueprint grid and construction lines set
 * out, the level line is shot through the horizon, the members are placed
 * bottom up on the crane easing and seat with a small overshoot, a lock
 * marker flashes at each joint, then the scaffolding clears and the clean
 * mark holds. 3.25 s, plays once.
 *
 * System v3 (the BYU Marriott palette), ported from
 * final-v3-2026-11-12/system/motion/HeroBuild.tsx, Stride only. The
 * geometry below is the untouched master: every member is the master path
 * clipped along an edge it already has, so the members put back together
 * are exactly the mark. Draft for BYU Marriott approval.
 *
 * Server render and no-JS show the finished mark. On mount the component
 * arms the animation on frame 0 (so nothing flashes), then plays it once
 * when the mark is in view, which in the hero is on load. With
 * prefers-reduced-motion it never arms: the static mark stays. Colours come
 * from --af-mark-ink, --af-mark-accent, --af-construction and
 * --af-build-marker (set on .sx-mark in globals.css): on the navy hero the
 * whole build is White; on white it is a Navy mark with a Slate accent and
 * Royal lines and markers. No orange.
 */
import "./hero-build.css"
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"

type Part = { d: string; clip: string | null; fill: "ink" | "acc" }
type Member = { id: string; parts: Part[]; lock: [number, number] | null }
type MarkData = {
  name: string
  d: string
  accent: string
  regions: Record<string, string>
  lines: string[]
  level: string
  nodes: [number, number][]
  members: Member[]
  durationMs: number
}

const STRIDE: MarkData = {"name":"AF Stride","d":"M284.5 73 296.5 126H480L305.5 165.5L329.5 271.5H457.5L336 299.5L336 299.5C305.5 297.5 275.5 296.5 245 296.5C202.5 296.5 159.5 298.5 117.5 302C175.5 225.5 234 149.5 284.5 73ZM273.5 271.5Q262.5 201 250.5 130Q213.5 200.5 178 271.5ZM338.5 333.5 362.5 439H295.5Q287.5 385 279.5 330.5C299 331 319 332 338.5 333.5ZM158.5 333Q132.5 385.5 107.5 439H32C56.5 404.5 82 370.5 107.5 337C124.5 335 141.5 334 158.5 333Z","accent":"M329.5 271.5H457.5L336 299.5Z","regions":{"blade":"-200.00,-50.00 284.50,-50.00 284.50,73.00 250.50,130.00 240.00,268.00 180.50,268.00 180.50,271.50 -200.00,271.50","stem":"240.00,268.00 250.50,130.00 284.50,73.00 285.30,73.00 330.43,271.50 272.50,271.50 272.50,268.00","toparm":"292.91,110.00 700.00,110.00 700.00,166.00 305.65,166.00","beam":"-200.00,271.50 180.50,271.50 180.50,268.00 272.50,268.00 272.50,271.50 329.63,271.50 365.67,430.00 -200.00,430.00","midarm":"329.52,271.00 700.00,271.00 700.00,430.00 365.67,430.00"},"lines":["M24 439H488","M24 73H488","M24 321.30A1437.7 1437.7 0 0 1 488 325.50","M273.36 24L378.86 488","M320.23 24L-5.02 470","M480 24V488"],"level":"M24 321.30A1437.7 1437.7 0 0 1 488 325.50","nodes":[[284.5,73],[480,126],[457.5,271.5],[32,439],[362.5,439]],"members":[{"id":"footl","parts":[{"d":"M158.5 333Q132.5 385.5 107.5 439H32C56.5 404.5 82 370.5 107.5 337C124.5 335 141.5 334 158.5 333Z","clip":null,"fill":"ink"}],"lock":[70,437]},{"id":"footr","parts":[{"d":"M338.5 333.5 362.5 439H295.5Q287.5 385 279.5 330.5C299 331 319 332 338.5 333.5Z","clip":null,"fill":"ink"}],"lock":[329,437]},{"id":"beam","parts":[{"d":"M284.5 73 296.5 126H480L305.5 165.5L329.5 271.5H457.5L336 299.5L336 299.5C305.5 297.5 275.5 296.5 245 296.5C202.5 296.5 159.5 298.5 117.5 302C175.5 225.5 234 149.5 284.5 73ZM273.5 271.5Q262.5 201 250.5 130Q213.5 200.5 178 271.5Z","clip":"beam","fill":"ink"},{"d":"M284.5 73 296.5 126H480L305.5 165.5L329.5 271.5H457.5L336 299.5L336 299.5C305.5 297.5 275.5 296.5 245 296.5C202.5 296.5 159.5 298.5 117.5 302C175.5 225.5 234 149.5 284.5 73ZM273.5 271.5Q262.5 201 250.5 130Q213.5 200.5 178 271.5Z","clip":"midarm","fill":"acc"}],"lock":[331,285]},{"id":"stem","parts":[{"d":"M284.5 73 296.5 126H480L305.5 165.5L329.5 271.5H457.5L336 299.5L336 299.5C305.5 297.5 275.5 296.5 245 296.5C202.5 296.5 159.5 298.5 117.5 302C175.5 225.5 234 149.5 284.5 73ZM273.5 271.5Q262.5 201 250.5 130Q213.5 200.5 178 271.5Z","clip":"stem","fill":"ink"}],"lock":[290,271.5]},{"id":"blade","parts":[{"d":"M284.5 73 296.5 126H480L305.5 165.5L329.5 271.5H457.5L336 299.5L336 299.5C305.5 297.5 275.5 296.5 245 296.5C202.5 296.5 159.5 298.5 117.5 302C175.5 225.5 234 149.5 284.5 73ZM273.5 271.5Q262.5 201 250.5 130Q213.5 200.5 178 271.5Z","clip":"blade","fill":"ink"}],"lock":[284.5,76]},{"id":"toparm","parts":[{"d":"M284.5 73 296.5 126H480L305.5 165.5L329.5 271.5H457.5L336 299.5L336 299.5C305.5 297.5 275.5 296.5 245 296.5C202.5 296.5 159.5 298.5 117.5 302C175.5 225.5 234 149.5 284.5 73ZM273.5 271.5Q262.5 201 250.5 130Q213.5 200.5 178 271.5Z","clip":"toparm","fill":"ink"}],"lock":[301,146]}],"durationMs":3250}
const GRID_MAJOR: string[] = ["M64 0V512", "M128 0V512", "M192 0V512", "M256 0V512", "M320 0V512", "M384 0V512", "M448 0V512", "M0 64H512", "M0 128H512", "M0 192H512", "M0 256H512", "M0 320H512", "M0 384H512", "M0 448H512"]
const GRID_MINOR: string = "M16 0V512M32 0V512M48 0V512M80 0V512M96 0V512M112 0V512M144 0V512M160 0V512M176 0V512M208 0V512M224 0V512M240 0V512M272 0V512M288 0V512M304 0V512M336 0V512M352 0V512M368 0V512M400 0V512M416 0V512M432 0V512M464 0V512M480 0V512M496 0V512M0 16H512M0 32H512M0 48H512M0 80H512M0 96H512M0 112H512M0 144H512M0 160H512M0 176H512M0 208H512M0 224H512M0 240H512M0 272H512M0 288H512M0 304H512M0 336H512M0 352H512M0 368H512M0 400H512M0 416H512M0 432H512M0 464H512M0 480H512M0 496H512"

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

export function HeroBuild({ theme, className }: { theme?: "light" | "dark"; className?: string }) {
  const m = STRIDE
  const k = "stride"
  const uid = useId().replace(/:/g, "")
  const ref = useRef<SVGSVGElement>(null)
  const [armed, setArmed] = useState(false)
  const [building, setBuilding] = useState(false)

  useIsoLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setArmed(true)
  }, [])

  useEffect(() => {
    if (!armed || !ref.current) return
    const el = ref.current
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          setBuilding(true)
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed])

  const cid = (r: string) => `${uid}af-${k}-${r}`
  const cls = ["af-build", armed ? "is-armed" : "", building ? "is-building" : "", className ?? ""].join(" ")

  return (
    <svg ref={ref} viewBox="0 0 512 512" className={cls} data-theme={theme} role="img" aria-label="AI Foundry">
      <defs>
        {Object.entries(m.regions).map(([r, p]) => (
          <clipPath key={r} id={cid(r)}>
            <polygon points={p} />
          </clipPath>
        ))}
      </defs>
      <g className={`af-scaffold af-${k}-scaffold`} aria-hidden="true">
        <path className={`af-gridminor af-${k}-gridminor`} d={GRID_MINOR} />
        {GRID_MAJOR.map((d, i) => (
          <path key={i} className={`af-gridline af-${k}-g${i}`} pathLength={1} d={d} />
        ))}
        {m.lines.map((d, i) => (
          <path key={i} className={`af-cline af-${k}-c${i}`} pathLength={1} d={d} />
        ))}
        {m.nodes.map(([x, y], i) => (
          <g key={i} className={`af-node af-${k}-n${i}`}>
            <circle cx={x} cy={y} r={6} />
            <path d={`M${x - 11} ${y}H${x + 11}M${x} ${y - 11}V${y + 11}`} />
          </g>
        ))}
      </g>
      <path className={`af-level af-${k}-level`} pathLength={1} d={m.level} aria-hidden="true" />
      {m.members.map((mem) => (
        <g key={mem.id} className={`af-${k}-${mem.id}-op`} aria-hidden="true">
          <g className={`af-${k}-${mem.id}-mv`}>
            {mem.parts.map((p, i) => (
              <path key={i} className={`af-${p.fill}`} d={p.d} clipPath={p.clip ? `url(#${cid(p.clip)})` : undefined} />
            ))}
          </g>
        </g>
      ))}
      <g className={`af-final af-${k}-final`}>
        <path className="af-ink" d={m.d} />
        <path className="af-acc" d={m.accent} />
      </g>
      {m.members
        .filter((mem) => mem.lock)
        .map((mem) => {
          const [x, y] = mem.lock as [number, number]
          return (
            <g key={mem.id} aria-hidden="true">
              <g className={`af-lock af-${k}-${mem.id}-lock`}>
                <rect x={x - 8} y={y - 8} width={16} height={16} transform={`rotate(45 ${x} ${y})`} />
              </g>
              <rect className={`af-pin af-${k}-${mem.id}-pin`} x={x - 2.5} y={y - 2.5} width={5} height={5} />
            </g>
          )
        })}
    </svg>
  )
}
