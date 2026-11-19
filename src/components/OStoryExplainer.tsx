import { CUT, HEX, LETTERS, MASK } from "@/components/AFBuild"
import { OStoryMeasure } from "@/components/OStoryMeasure"
import { O_STORY_MEASURE_JS } from "@/lib/oStoryMeasure"
import {
  APPROACH_EYEBROW,
  APPROACH_HEADING,
  APPROACH_LEAD,
  BUILDER_RING,
  BUILDER_SUMMARY,
  BUILDER_TITLE,
  CONSULTANT_RING,
  CONSULTANT_SUMMARY,
  CONSULTANT_TITLE,
  O_STORY_CAPTION,
  O_STORY_DIAMOND_SKILLS,
  O_STORY_HEADING,
  O_STORY_HEX_SKILLS,
  O_STORY_LINK,
} from "@/lib/content"
import "@/app/o-story-approach.css"

/**
 * The /approach opener: the page claim under a scroll story that teaches the O (mockup for Scott
 * Murff, 2026-11-17). The wordmark settles, the O is scored, drops out of the word, grows, and
 * splits into its two profiles: the Builder hexagon and the Consultant diamond, drawn the way
 * ToolkitDiagram draws them (rings, spokes, a labelled corner per axis) but on navy, White ink.
 * Then each profile's summary, then the line that ties them together.
 *
 * The h1 comes first in the DOM (readers and search meet the claim first); CSS places it after
 * the story. The motion is CSS keyframes (src/app/o-story-approach.css) held paused and seeked by
 * the inline script from the section's scroll progress, so WebKit and Chromium play it the same;
 * the script also measures where the O sits so the frames can start inside it. Everything outside
 * the motion block is the end state, which is what reduced motion and no-script show.
 */

const VBW = 520
const VBH = 330
const CX = VBW / 2
const CY = 160 // 14 units above the top labels, 24 below the lowest
const R = 100

const pt = (start: number, n: number, i: number, r: number) => {
  const a = ((start + (360 / n) * i) * Math.PI) / 180
  return [Math.cos(a) * r, Math.sin(a) * r] as const
}
const poly = (start: number, n: number, r: number) =>
  Array.from({ length: n }, (_, i) => pt(start, n, i, r).map((v) => v.toFixed(2)).join(",")).join(" ")

/** One on-navy profile frame. t0 is the scroll progress (percent) where its corners begin; each
 *  corner's delay is on the story's 1000 ms clock (o-story-approach.css). */
function Profile({ axes, start, kind, title, t0 }: { axes: string[]; start: number; kind: "builder" | "consultant"; title: string; t0: number }) {
  const n = axes.length
  const step = n === 6 ? 1.6 : 2.4
  const at = `translate(${CX} ${CY})`
  return (
    <svg className={`oa-dg oa-dg-${kind} oa-dg-story`} viewBox={`0 0 ${VBW} ${VBH}`} role="img" aria-label={`${title}: ${axes.join(", ")}`}>
      <g transform={at} className="oa-dg-under">
        <polygon className="oa-dg-fill" points={poly(start, n, R)} />
        {[0.25, 0.5, 0.75].map((k) => (
          <polygon key={k} className="oa-dg-ring" points={poly(start, n, R * k)} />
        ))}
        {axes.map((_, i) => {
          const [x, y] = pt(start, n, i, R)
          return <path key={i} className="oa-dg-spoke" pathLength={1} d={`M0 0L${x.toFixed(2)} ${y.toFixed(2)}`} />
        })}
      </g>
      {/* the frame that leaves the O: transformed in svg user units from the view-box origin */}
      <g className="oa-dg-travel">
        <g transform={at}>
          <polygon className="oa-dg-frame" pathLength={1} points={poly(start, n, R)} />
        </g>
      </g>
      <g transform={at}>
        {axes.map((name, i) => {
          const [x, y] = pt(start, n, i, R)
          const [lx, ly] = pt(start, n, i, R + 18)
          const anchor = Math.abs(lx) < 1 ? "middle" : lx > 0 ? "start" : "end"
          const words = name.split(" ")
          const lines = words.length > 1 && name.length > 12 ? [words[0], words.slice(1).join(" ")] : [name]
          const m = lines.length - 1
          const dy0 = Math.abs(ly) < 1 ? 0.32 - m * 0.575 : ly < 0 ? -m * 1.15 : 0.95
          const a = t0 + i * step
          const style = { "--a": `${Math.round(a * 10)}ms` } as React.CSSProperties
          return (
            <g key={name} className="oa-dg-corner" style={style}>
              <circle className="oa-dg-dot" cx={x.toFixed(2)} cy={y.toFixed(2)} r="4" />
              <text className="oa-dg-label" x={lx.toFixed(2)} y={ly.toFixed(2)} textAnchor={anchor}>
                {lines.map((l, j) => (
                  <tspan key={l} x={lx.toFixed(2)} dy={`${(j === 0 ? dy0 : 1.15).toFixed(3)}em`}>
                    {l}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function OStoryExplainer() {
  return (
    <section className="oa-band" data-ground="navy" aria-labelledby="approach-title">
      <div className="oa-hero-copy">
        <span className="oa-eb">{APPROACH_EYEBROW}</span>
        <h1 id="approach-title">{APPROACH_HEADING}</h1>
        <p>{APPROACH_LEAD}</p>
      </div>
      <div className="oa-story">
        <div className="oa-stage">
          <p className="oa-cue" aria-hidden="true">
            <span>{O_STORY_LINK.label}</span>
            <i />
          </p>
          <div className="oa-wm-slot">
            {/* the locked mark (AFBuild's paths), White on navy */}
            <svg className="oa-wm" viewBox="0 0 868.952 101.348" role="img" aria-label="AI Foundry">
              {LETTERS.map(([k, d]) => (
                <path key={k} className="oa-wm-ink" d={d} />
              ))}
              <mask id="oa-wm-cut" maskUnits="userSpaceOnUse" x={MASK.x} y={MASK.y} width={MASK.width} height={MASK.height}>
                <rect x={MASK.x} y={MASK.y} width={MASK.width} height={MASK.height} fill="#fff" />
                <path fill="#000" d={CUT} />
              </mask>
              <g mask="url(#oa-wm-cut)">
                <path className="oa-wm-ink" d={HEX} />
              </g>
            </svg>
          </div>
          <h2 className="sr-only" id="o-story-title">
            {O_STORY_HEADING}
          </h2>
          <div className="oa-profiles">
            <figure className="oa-profile oa-profile-builder">
              <Profile axes={BUILDER_RING} start={0} kind="builder" title={BUILDER_TITLE} t0={54} />
              <figcaption>
                <span className="oa-eb">{O_STORY_HEX_SKILLS}</span>
                <b>{BUILDER_TITLE}</b>
                <span className="oa-sum">{BUILDER_SUMMARY}</span>
              </figcaption>
            </figure>
            <figure className="oa-profile oa-profile-consultant">
              <Profile axes={CONSULTANT_RING} start={-90} kind="consultant" title={CONSULTANT_TITLE} t0={56} />
              <figcaption>
                <span className="oa-eb">{O_STORY_DIAMOND_SKILLS}</span>
                <b>{CONSULTANT_TITLE}</b>
                <span className="oa-sum">{CONSULTANT_SUMMARY}</span>
              </figcaption>
            </figure>
          </div>
          <p className="oa-caption">{O_STORY_CAPTION}</p>
        </div>
      </div>
      {/* Measures before first paint on a full page load; OStoryMeasure covers client navigation. */}
      <script dangerouslySetInnerHTML={{ __html: O_STORY_MEASURE_JS }} />
      <OStoryMeasure />
    </section>
  )
}
