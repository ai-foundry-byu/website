/* Credibility number. Cast 125, tight tracking, numerals not words.
   Port of design_handoff .../display/Stat.jsx. */
export function Stat({
  value,
  caption,
  onDark,
  size = "48px",
}: {
  value: React.ReactNode
  caption?: string
  onDark?: boolean
  size?: string
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontStretch: "var(--w-cast)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          fontSize: size,
          color: onDark ? "#fff" : "var(--navy)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      {caption ? (
        <span className="caption" style={{ color: onDark ? "var(--text-on-dark-soft)" : "var(--text-meta)" }}>
          {caption}
        </span>
      ) : null}
    </div>
  )
}
