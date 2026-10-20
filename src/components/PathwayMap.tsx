import { ArrowDown, ArrowRight, Certificate } from "@carbon/icons-react"
import {
  PATH_FOUNDATION,
  PATH_GATE,
  PATH_LECTURES,
  PATH_PRACTICUM,
  PATH_SEMESTERS,
  PATH_STUDIO,
  type PathStep,
} from "@/lib/content"

/**
 * The product pathway as a map: four semesters left to right, the foundation
 * course, the entrance exam drawn as a gate, then the studio and the
 * practicum taken together across a fall and a winter. The lecture series
 * runs in its own lane underneath because it has no prerequisite.
 *
 * Desktop (lg): one five-column grid, the narrow second column is the gate.
 * Below lg the same items stack in path order with down arrows between them,
 * and each card carries its own semester line in place of the column heads.
 */
const COLS = "lg:grid-cols-[minmax(0,1fr)_132px_minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1fr)]"

function Step({ s, accent = false, dashed = false }: { s: PathStep; accent?: boolean; dashed?: boolean }) {
  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
        background: "#fff",
        border: dashed ? "1px dashed var(--border-strong)" : `1px solid ${accent ? "var(--navy)" : "var(--border-hairline)"}`,
        borderTop: dashed ? undefined : `3px solid ${accent ? "var(--royal)" : "var(--navy)"}`,
        borderRadius: "var(--radius)",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--royal)" }}>
        {s.step}
      </span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStretch: "var(--w-plate)", fontSize: "22px", lineHeight: 1.1, color: "var(--navy)" }}>
        {s.number}
      </span>
      <span style={{ fontWeight: 600, fontSize: "16px", lineHeight: 1.3, color: "var(--navy)" }}>{s.title}</span>
      <p style={{ margin: "4px 0 0", fontSize: "14px", lineHeight: 1.5, color: "var(--text-meta)" }}>{s.detail}</p>
      <p className="lg:hidden" style={{ margin: "6px 0 0", fontSize: "13px", fontWeight: 600, color: "var(--navy)" }}>
        {s.when}
      </p>
      <p style={{ margin: "auto 0 0", paddingTop: "10px", fontSize: "12.5px", color: "var(--text-meta)", borderTop: "1px solid var(--border-hairline)" }}>
        {s.today}
      </p>
    </div>
  )
}

/** A connector: a rule with an arrowhead across (lg) or a down arrow (stacked). */
function Across({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`hidden lg:flex items-center ${className}`} style={{ color: "var(--navy)" }}>
      <div style={{ flex: 1, height: 2, background: "var(--navy)" }} />
      <ArrowRight size={20} style={{ marginLeft: -6 }} />
    </div>
  )
}

function Down() {
  return (
    <div aria-hidden="true" className="flex lg:hidden justify-center" style={{ color: "var(--navy)", padding: "2px 0" }}>
      <ArrowDown size={22} />
    </div>
  )
}

export function PathwayMap() {
  return (
    <figure style={{ margin: 0 }} aria-label="The product pathway: foundation course, entrance exam, then the studio and the practicum">
      {/* Column heads, desktop only */}
      <div className={`hidden lg:grid ${COLS} gap-x-4`} style={{ marginBottom: "12px" }}>
        {[PATH_SEMESTERS[0], "", PATH_SEMESTERS[1], PATH_SEMESTERS[2], PATH_SEMESTERS[3]].map((label, i) => (
          <div
            key={i}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-meta)",
              borderBottom: label ? "1px solid var(--border-strong)" : "none",
              paddingBottom: "8px",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div className={`flex flex-col gap-2 lg:grid ${COLS} lg:gap-x-4 lg:gap-y-4`}>
        {/* Foundation: fall of year 1, spans the two main lanes */}
        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2">
          <Step s={PATH_FOUNDATION} />
        </div>
        <Down />

        {/* The gate */}
        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 flex items-stretch">
          <div
            className="flex w-full flex-row lg:flex-col items-center lg:justify-center gap-3 lg:gap-2 lg:text-center"
            style={{ background: "var(--navy)", color: "#fff", borderRadius: "var(--radius)", padding: "18px 16px" }}
          >
            <Certificate size={32} aria-hidden="true" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-on-dark-soft)" }}>
                Gateway
              </span>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontStretch: "var(--w-plate)", fontSize: "18px", lineHeight: 1.15, margin: "4px 0 6px" }}>
                {PATH_GATE.label}
              </span>
              <span style={{ display: "block", fontSize: "13px", lineHeight: 1.45, color: "var(--text-on-dark-body)" }}>{PATH_GATE.detail}</span>
            </div>
          </div>
        </div>
        <Down />

        {/* Arrows through winter of year 1 into each lane of year 2 */}
        <Across className="lg:col-start-3 lg:row-start-1" />
        <Across className="lg:col-start-3 lg:row-start-2" />

        {/* Studio and practicum: fall and winter of year 2, taken together */}
        <div className="lg:col-start-4 lg:col-span-2 lg:row-start-1">
          <Step s={PATH_STUDIO} accent />
        </div>
        <div className="lg:col-start-4 lg:col-span-2 lg:row-start-2">
          <Step s={PATH_PRACTICUM} accent />
        </div>

        {/* Lecture series: its own lane, no prerequisite */}
        <div className="mt-4 lg:mt-0 lg:col-start-3 lg:row-start-3">
          <Step s={PATH_LECTURES} dashed />
        </div>
      </div>
    </figure>
  )
}
