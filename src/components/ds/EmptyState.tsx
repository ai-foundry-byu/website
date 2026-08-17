import { Eyebrow } from "./Eyebrow"

/* Empty state: honest and quiet. No illustrations — an eyebrow, a plain
   statement, an optional action.
   Port of design_handoff .../feedback/EmptyState.jsx. */
export function EmptyState({
  eyebrow = "Nothing here yet",
  title,
  detail,
  children,
}: {
  eyebrow?: string
  title?: string
  detail?: string
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius)",
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        textAlign: "center",
      }}
    >
      <Eyebrow tone="meta">{eyebrow}</Eyebrow>
      {title ? <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h3)", margin: 0 }}>{title}</h3> : null}
      {detail ? (
        <p className="caption" style={{ color: "var(--text-meta)", margin: 0, maxWidth: "44ch" }}>
          {detail}
        </p>
      ) : null}
      {children}
    </div>
  )
}
