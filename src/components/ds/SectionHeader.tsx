import { Eyebrow } from "./Eyebrow"

/* The compression pair as a section opener: rail eyebrow over a plate title.
   Port of design_handoff .../display/SectionHeader.jsx. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "center",
  onDark,
}: {
  eyebrow?: string
  title: string
  lead?: string
  align?: "center" | "left"
  onDark?: boolean
}) {
  const center = align === "center"
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: center ? "center" : "flex-start",
        textAlign: center ? "center" : "left",
        gap: "12px",
      }}
    >
      {eyebrow ? <Eyebrow tone={onDark ? "on-dark" : "accent"}>{eyebrow}</Eyebrow> : null}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontStretch: "var(--w-plate)",
          fontSize: "var(--size-h2)",
          lineHeight: 1.15,
          margin: 0,
          color: onDark ? "#fff" : "var(--navy)",
          maxWidth: "24ch",
        }}
      >
        {title}
      </h2>
      {lead ? (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: onDark ? 300 : 400,
            fontSize: "var(--size-body)",
            lineHeight: onDark ? 1.6 : 1.55,
            color: onDark ? "var(--text-on-dark-body)" : "var(--text-meta)",
            margin: 0,
            maxWidth: "56ch",
          }}
        >
          {lead}
        </p>
      ) : null}
    </div>
  )
}
