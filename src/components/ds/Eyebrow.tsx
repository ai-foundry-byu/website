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
        fontWeight: 600,
        fontStretch: "var(--w-rail)",
        fontSize: "var(--size-eyebrow)",
        textTransform: "uppercase",
        letterSpacing: "0.10em",
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
