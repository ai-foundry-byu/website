/* Progress toward a goal (roadmap pattern). Royal fill on a navy-tint track,
   tabular numerals.
   Port of design_handoff .../feedback/Progress.jsx. */
export function Progress({
  value = 0,
  max = 100,
  label,
  caption,
  ariaLabel,
}: {
  value?: number | null
  max?: number
  label?: string
  caption?: string
  ariaLabel?: string
}) {
  const pct = value == null ? 0 : Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {label ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)" }}>{label}</span>
          <span
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--size-ui)", fontVariantNumeric: "tabular-nums", color: "var(--text-meta)" }}
          >
            {value == null ? "—" : value} / {max}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={ariaLabel ?? ((label ? label + ": " : "") + (value == null ? "not measured" : value) + " of " + max)}
        aria-valuenow={value == null ? undefined : value}
        aria-valuemax={max}
        style={{ height: "6px", background: "rgba(0,46,93,.1)", borderRadius: "var(--radius)", overflow: "hidden" }}
      >
        <div style={{ height: "100%", width: pct + "%", background: "var(--royal)", transition: "width var(--dur-base) var(--ease-stamp)" }} />
      </div>
      {caption ? (
        <span className="caption" style={{ color: "var(--text-meta)" }}>
          {caption}
        </span>
      ) : null}
    </div>
  )
}
