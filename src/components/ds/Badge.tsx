/* Tag/badge: sharp, bordered, Plex 500. tone: default (slate border, navy
   text), accent (royal), on-dark (for navy grounds).
   Port of design_handoff .../display/Badge.jsx. */
const TONES: Record<string, React.CSSProperties> = {
  default: { border: "1px solid var(--slate)", color: "var(--navy)" },
  accent: { border: "1px solid var(--royal)", color: "var(--royal)" },
  "on-dark": { border: "1px solid rgba(255,255,255,.4)", color: "#fff" },
}

export function Badge({
  children,
  tone = "default",
  style,
}: {
  children: React.ReactNode
  tone?: "default" | "accent" | "on-dark"
  style?: React.CSSProperties
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "var(--radius)",
        padding: "4px 10px",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: 1.2,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        ...(TONES[tone] || TONES.default),
        ...style,
      }}
    >
      {children}
    </span>
  )
}
