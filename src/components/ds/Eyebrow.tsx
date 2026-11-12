/* All-caps label (AF Stride demo: Archivo Expanded 500, +14%, per the kit). tone: accent (royal), meta (slate), on-dark.
   Port of design_handoff .../display/Eyebrow.jsx. */
const COLORS: Record<string, string> = {
  accent: "var(--accent)",
  meta: "var(--text-meta)",
  "on-dark": "var(--af-mist)",
}

export function Eyebrow({
  children,
  tone = "accent",
  style,
}: {
  children: React.ReactNode
  tone?: "accent" | "meta" | "on-dark"
  style?: React.CSSProperties
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        fontStretch: "var(--w-rail)",
        fontSize: "var(--size-eyebrow)",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        lineHeight: 1.2,
        color: COLORS[tone] || COLORS.accent,
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  )
}
