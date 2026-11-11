/* Rail-62 all-caps label. tone: accent (royal), meta (slate), on-dark.
   Port of design_handoff .../display/Eyebrow.jsx. */
const COLORS: Record<string, string> = {
  accent: "var(--accent)",
  meta: "var(--text-meta)",
  "on-dark": "rgba(255,255,255,.65)",
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
        /* Runout: the kit's label, Archivo at full width with open
           tracking, in place of the condensed Rail 62. */
        fontWeight: 600,
        fontStretch: "125%",
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
