/**
 * HeroBuild: the Runout mark, built the way a builder builds it, in the landing hero.
 * Draft for BYU Marriott approval.
 *
 * Adapted from the design team's system v3 (final-v3-2026-11-12, system/motion/HeroBuild.tsx)
 * for this page. The geometry below is the untouched Runout master (round 9
 * refine-runout: the clean F and A, two shapes); the timeline lives in
 * src/app/hero-build.css (2.98 s):
 *   1. a blueprint grid draws in, then the set-out lines and their nodes;
 *   2. one level line is shot along the horizon arc;
 *   3. the members are placed bottom up like beams off a crane: the column is lowered
 *      onto the baseline, the horizon beam slides in along the level, then the lower arm;
 *      the two blades are raised about their feet like an A-frame;
 *   4. each member seats with a small overshoot; a lock ring opens at its joint and a flat
 *      tack weld snaps down and holds a beat (no sparks, no glow);
 *   5. the scaffold comes down and the clean mark holds. Nothing moves after that.
 *
 * Changes from the kit component: Runout only, and no client script. The SVG ships with
 * is-armed and is-building already set, so the CSS plays the build once as the page first
 * paints (the hero is the top of the page), with no hydration step and no flash of the
 * finished mark. prefers-reduced-motion cancels every animation in hero-build.css, which
 * leaves the base styles: the static digital mark.
 * Colours come from --af-mark-ink, --af-mark-accent, --af-construction and --af-build-marker
 * in globals.css. System v3, the BYU Marriott palette, no orange: on light grounds a Navy mark
 * with a Slate horizon beam and Royal lines and markers; theme="dark" (the navy hero) is all
 * White, lines at reduced opacity and markers at 0.8.
 */

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

const RUNOUT: MarkData = {"name":"Runout","d":"M451 331.5C359 338.5 267 347 175.5 364.5L163 398.5C221.5 395.5 280.5 395 339.5 398C276.5 406.5 213.5 416 150.5 433L133 480L61 480C83 428.5 106.5 377 130 326C237 318.5 344.5 320 451 331.5ZM259 32C295 125 338 217.5 380.5 310.5C362 309 343 308 324 307.5Q296 191 259 77Q221.5 191 193.5 307.5C174.5 308 156 309 137 310.5C180 217.5 222.5 125 259 32Z","accent":"M190.86 322.71C277.70 319.43 364.68 322.18 451.00 331.50C359 338.5 267 347 175.5 364.5Z","regions":{"lblade":"-200.00,-50.00 259.00,-50.00 259.00,400.00 -200.00,400.00","rblade":"259.00,-50.00 700.00,-50.00 700.00,400.00 259.00,400.00","stem":"-200.00,-50.00 328.69,-50.00 89.72,600.00 -200.00,600.00","beam":"327.89,-50.00 800.00,-50.00 800.00,365.00 175.32,365.00","lowarm":"163.92,396.00 800.00,396.00 800.00,433.20 150.24,433.20"},"lines":["M24 480H488","M24 32H488","M24 329.75A1811.3 1811.3 0 0 1 488 328.82","M259 24V488","M264.26 20L59.24 488","M253.76 20L457.94 488","M204.38 160L55.62 492"],"level":"M24 329.75A1811.3 1811.3 0 0 1 488 328.82","nodes":[[259,32],[451,331.5],[339.5,398],[61,480],[133,480]],"members":[{"id":"stem","parts":[{"d":"M451 331.5C359 338.5 267 347 175.5 364.5L163 398.5C221.5 395.5 280.5 395 339.5 398C276.5 406.5 213.5 416 150.5 433L133 480L61 480C83 428.5 106.5 377 130 326C237 318.5 344.5 320 451 331.5Z","clip":"stem","fill":"ink"}],"lock":[97,478]},{"id":"beam","parts":[{"d":"M451 331.5C359 338.5 267 347 175.5 364.5L163 398.5C221.5 395.5 280.5 395 339.5 398C276.5 406.5 213.5 416 150.5 433L133 480L61 480C83 428.5 106.5 377 130 326C237 318.5 344.5 320 451 331.5Z","clip":"beam","fill":"acc"}],"lock":[186,343]},{"id":"lowarm","parts":[{"d":"M451 331.5C359 338.5 267 347 175.5 364.5L163 398.5C221.5 395.5 280.5 395 339.5 398C276.5 406.5 213.5 416 150.5 433L133 480L61 480C83 428.5 106.5 377 130 326C237 318.5 344.5 320 451 331.5Z","clip":"lowarm","fill":"ink"}],"lock":[162,415]},{"id":"lblade","parts":[{"d":"M259 32C295 125 338 217.5 380.5 310.5C362 309 343 308 324 307.5Q296 191 259 77Q221.5 191 193.5 307.5C174.5 308 156 309 137 310.5C180 217.5 222.5 125 259 32Z","clip":"lblade","fill":"ink"}],"lock":null},{"id":"rblade","parts":[{"d":"M259 32C295 125 338 217.5 380.5 310.5C362 309 343 308 324 307.5Q296 191 259 77Q221.5 191 193.5 307.5C174.5 308 156 309 137 310.5C180 217.5 222.5 125 259 32Z","clip":"rblade","fill":"ink"}],"lock":[259,38]}],"durationMs":2980}
const GRID_MAJOR: string[] = ["M64 0V512", "M128 0V512", "M192 0V512", "M256 0V512", "M320 0V512", "M384 0V512", "M448 0V512", "M0 64H512", "M0 128H512", "M0 192H512", "M0 256H512", "M0 320H512", "M0 384H512", "M0 448H512"]
const GRID_MINOR: string = "M16 0V512M32 0V512M48 0V512M80 0V512M96 0V512M112 0V512M144 0V512M160 0V512M176 0V512M208 0V512M224 0V512M240 0V512M272 0V512M288 0V512M304 0V512M336 0V512M352 0V512M368 0V512M400 0V512M416 0V512M432 0V512M464 0V512M480 0V512M496 0V512M0 16H512M0 32H512M0 48H512M0 80H512M0 96H512M0 112H512M0 144H512M0 160H512M0 176H512M0 208H512M0 224H512M0 240H512M0 272H512M0 288H512M0 304H512M0 336H512M0 352H512M0 368H512M0 400H512M0 416H512M0 432H512M0 464H512M0 480H512M0 496H512"

const K = "runout"
const ID = "af-hero-build-"

export function HeroBuild({ theme = "dark", className }: { theme?: "light" | "dark"; className?: string }) {
  const m = RUNOUT
  const cid = (r: string) => `${ID}${r}`
  return (
    <svg
      viewBox="0 0 512 512"
      className={["af-build is-armed is-building", className ?? ""].join(" ")}
      data-theme={theme}
      role="img"
      aria-label="AI Foundry, the Runout mark: an A set on a horizon, its crossbar running on as the F"
    >
      <defs>
        {Object.entries(m.regions).map(([r, p]) => (
          <clipPath key={r} id={cid(r)}>
            <polygon points={p} />
          </clipPath>
        ))}
      </defs>
      <g className={`af-scaffold af-${K}-scaffold`} aria-hidden="true">
        <path className={`af-gridminor af-${K}-gridminor`} d={GRID_MINOR} />
        {GRID_MAJOR.map((d, i) => (
          <path key={i} className={`af-gridline af-${K}-g${i}`} pathLength={1} d={d} />
        ))}
        {m.lines.map((d, i) => (
          <path key={i} className={`af-cline af-${K}-c${i}`} pathLength={1} d={d} />
        ))}
        {m.nodes.map(([x, y], i) => (
          <g key={i} className={`af-node af-${K}-n${i}`}>
            <circle cx={x} cy={y} r={6} />
            <path d={`M${x - 11} ${y}H${x + 11}M${x} ${y - 11}V${y + 11}`} />
          </g>
        ))}
      </g>
      <path className={`af-level af-${K}-level`} pathLength={1} d={m.level} aria-hidden="true" />
      {m.members.map((mem) => (
        <g key={mem.id} className={`af-${K}-${mem.id}-op`} aria-hidden="true">
          <g className={`af-${K}-${mem.id}-mv`}>
            {mem.parts.map((p, i) => (
              <path key={i} className={`af-${p.fill}`} d={p.d} clipPath={p.clip ? `url(#${cid(p.clip)})` : undefined} />
            ))}
          </g>
        </g>
      ))}
      <g className={`af-final af-${K}-final`}>
        <path className="af-ink" d={m.d} />
        <path className="af-acc" d={m.accent} />
      </g>
      {m.members
        .filter((mem) => mem.lock)
        .map((mem) => {
          const [x, y] = mem.lock as [number, number]
          return (
            <g key={mem.id} aria-hidden="true">
              <g className={`af-lock af-${K}-${mem.id}-lock`}>
                <rect x={x - 14} y={y - 14} width={28} height={28} transform={`rotate(45 ${x} ${y})`} />
              </g>
              <g transform={`rotate(45 ${x} ${y})`}>
                <rect className={`af-pin af-${K}-${mem.id}-pin`} x={x - 5} y={y - 5} width={10} height={10} />
              </g>
            </g>
          )
        })}
    </svg>
  )
}
