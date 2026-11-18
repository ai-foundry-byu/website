import Link from "next/link"
import { CUT, HEX } from "@/components/AFBuild"
import {
  BUILDER_RING,
  BUILDER_SUMMARY,
  BUILDER_TITLE,
  CONSULTANT_RING,
  CONSULTANT_SUMMARY,
  CONSULTANT_TITLE,
  O_STORY_DIAMOND_EYEBROW,
  O_STORY_HEADING,
  O_STORY_HEX_EYEBROW,
  O_STORY_LINK,
} from "@/lib/content"
import "@/app/o-story.css"

/**
 * AFStory: after the blueprint build, the O tells its story in the home hero (mockup for Scott
 * Murff, 2026-11-17). The hexagon lifts out of the O, runs a hairline leader to the right-hand
 * column and grows into the Builder profile; the diamond comes forward out of its cut into the
 * Consultant profile; the O re-inks, so the mark ends exactly as the locked mark. The travellers
 * carry the locked HEX and CUT paths from AFBuild unchanged: only their box moves and grows.
 *
 * Render it inside .af-hero-inner, after the copy, with <AFBuild story /> as the mark and
 * .is-playing on the .af-hero section. The first play is CSS only (src/app/o-story.css); the replay
 * button and the phone Consultant's in-view start are AFStoryReplay. The Builder is its own box
 * beside the stage: on desktop both sit in the right-hand column; below 1200 px the Builder sits
 * right under the wordmark, so the hexagon is seen leaving the O and being drawn up in the first
 * screen, and the stage (the Consultant and the link) follows the facts: when it scrolls into view
 * the diamond leaves its cut, drops down into the Consultant (.tk-dtrav) and the Consultant is built.
 * Labels are HTML text in the body font, placed at each corner by its angle (the same ring order as
 * ToolkitDiagram on /approach).
 */

const CX = 312.067 // the hexagon's centre and circumradius, in mark units
const CY = 49.99
const R = 57.724
const RD = 34.993 // the diamond's half-diagonal (the cut)

const ring = (n: number, start: number, i: number, r: number) => {
  const a = ((start + (360 / n) * i) * Math.PI) / 180
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const
}
const poly = (n: number, start: number, r: number) =>
  Array.from({ length: n }, (_, i) => ring(n, start, i, r).map((v) => v.toFixed(3)).join(",")).join(" ")
const spoke = (n: number, start: number, i: number, r: number) => {
  const [x, y] = ring(n, start, i, r)
  return `M${CX} ${CY}L${x.toFixed(3)} ${y.toFixed(3)}`
}
const idx = (i: number) => ({ "--i": i }) as React.CSSProperties

function Dots({ n, start, r, rr }: { n: number; start: number; r: number; rr: number }) {
  return (
    <g className="tk-dots">
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = ring(n, start, i, r)
        return <circle key={i} cx={x.toFixed(3)} cy={y.toFixed(3)} r={rr} style={idx(i)} />
      })}
    </g>
  )
}

function Rings({ n, start, r }: { n: number; start: number; r: number }) {
  return (
    <g className="tk-grid">
      {[0.25, 0.5, 0.75].map((k) => (
        <polygon key={k} className="tk-ring" points={poly(n, start, r * k)} />
      ))}
      {/* one path per spoke, so each can be drawn out from the centre (phones) */}
      {Array.from({ length: n }, (_, i) => (
        <path key={i} className="tk-spoke" pathLength={1} d={spoke(n, start, i, r)} style={idx(i)} />
      ))}
    </g>
  )
}

/** One label per corner: anchored by the corner's angle, two-word-plus names break after word one. */
function Labels({ names, start, cls }: { names: string[]; start: number; cls: "tk-lb" | "tk-lc" }) {
  return (
    <>
      {names.map((name, i) => {
        const a = ((start + (360 / names.length) * i) * Math.PI) / 180
        const c = Math.cos(a)
        const s = Math.sin(a)
        const h = Math.abs(c) < 0.01 ? "c" : c > 0 ? "l" : "r"
        const v = Math.abs(s) < 0.01 ? "m" : s < 0 ? "t" : "b"
        const words = name.split(" ")
        const split = words.length > 1 && name.length > 12
        const style = { "--c": c.toFixed(4), "--s": s.toFixed(4), "--i": i } as React.CSSProperties
        return (
          <span key={name} className={`tk-lab ${cls} tk-h${h} tk-v${v}`} style={style}>
            {split ? (
              <>
                {words[0]}
                <br />
                {words.slice(1).join(" ")}
              </>
            ) : (
              name
            )}
          </span>
        )
      })}
    </>
  )
}

export function AFStory({ id = "af-hero-story" }: { id?: string }) {
  const cut = `${id}-cut`
  return (
    <>
      <div className="tk-lead tk-lead-a" aria-hidden="true" />
      <div className="tk-lead tk-lead-b" aria-hidden="true" />
      <div className="tk-lead tk-lead-c" aria-hidden="true" />
      <figure
        className="tk-box tk-builder"
        aria-label={`${BUILDER_TITLE}, the hexagon, six axes: ${BUILDER_RING.join(", ")}. ${BUILDER_SUMMARY}`}
      >
        <figcaption className="tk-cap">
          <span className="tk-eye">{O_STORY_HEX_EYEBROW}</span>
          <span className="tk-name">{BUILDER_TITLE}.</span> <span className="tk-sum">{BUILDER_SUMMARY}</span>
        </figcaption>
        <div className="tk-trav tk-hex">
          <svg className="tk-svg" viewBox="254.333 0 115.448 100" aria-hidden="true">
            <mask id={cut} maskUnits="userSpaceOnUse" x="240" y="-14" width="144" height="128">
              <rect x="240" y="-14" width="144" height="128" fill="#fff" />
              <path fill="#000" d={CUT} />
            </mask>
            <path className="tk-fill" mask={`url(#${cut})`} d={HEX} />
            <Rings n={6} start={0} r={R} />
            <path className="tk-frame" d={HEX} />
            <path className="tk-trace" pathLength={1} d={HEX} />
            <path className="tk-hole" d={CUT} />
            <Dots n={6} start={0} r={R} rr={2.6} />
          </svg>
        </div>
        <Labels names={BUILDER_RING} start={0} cls="tk-lb" />
      </figure>
      <aside className="tk-stage" aria-label={O_STORY_HEADING}>
        <figure
          className="tk-box tk-consult"
          aria-label={`${CONSULTANT_TITLE}, the diamond, four axes: ${CONSULTANT_RING.join(", ")}. ${CONSULTANT_SUMMARY}`}
        >
          <figcaption className="tk-cap">
            <span className="tk-eye">{O_STORY_DIAMOND_EYEBROW}</span>
            <span className="tk-name">{CONSULTANT_TITLE}.</span> <span className="tk-sum">{CONSULTANT_SUMMARY}</span>
          </figcaption>
          <div className="tk-trav tk-dm">
            <svg className="tk-svg" viewBox="277.074 14.997 69.986 69.986" aria-hidden="true">
              <path className="tk-fill" d={CUT} />
              <Rings n={4} start={-90} r={RD} />
              <path className="tk-frame" d={CUT} />
              <path className="tk-trace" pathLength={1} d={CUT} />
              <Dots n={4} start={-90} r={RD} rr={1.6} />
            </svg>
          </div>
          <Labels names={CONSULTANT_RING} start={-90} cls="tk-lc" />
        </figure>
        <Link className="tk-more" href={O_STORY_LINK.href}>
          {O_STORY_LINK.label}
        </Link>
      </aside>
      {/* phones: the diamond that leaves the cut and drops into the Consultant (AFStoryReplay moves it) */}
      <div className="tk-dtrav" aria-hidden="true">
        <svg viewBox="277.074 14.997 69.986 69.986">
          <path d={CUT} />
        </svg>
      </div>
    </>
  )
}
