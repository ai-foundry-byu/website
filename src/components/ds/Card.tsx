/* Offering card: hairline border, sharp corners, no shadow.
   Points render as hairline rows, not bullets.
   Port of design_handoff .../display/Card.jsx. */
export function Card({
  title,
  blurb,
  points = [],
  children,
}: {
  title: string
  blurb?: string
  points?: string[]
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border-hairline)",
        background: "#fff",
        borderRadius: "var(--radius)",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h3)", lineHeight: 1.3, margin: 0 }}>
        {title}
      </h3>
      {blurb ? (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.55, color: "var(--text-meta)", margin: 0 }}>
          {blurb}
        </p>
      ) : null}
      {points.length ? (
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0 }}>
          {points.map((p) => (
            <li
              key={p}
              style={{ borderTop: "1px solid var(--border-hairline)", padding: "9px 0", fontSize: "var(--size-ui)", lineHeight: 1.4 }}
            >
              {p}
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </div>
  )
}
