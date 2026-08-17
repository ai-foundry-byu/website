import Image from "next/image"
import { Badge } from "./Badge"
import { Icon } from "./Icon"

/* Reference build. Image is a 16:10 crop of the live product; without one a
   typographic plate stands in. Honesty rules: state where the build actually
   is, claim no client.
   Port of design_handoff .../content/ShowcaseCard.jsx. */
export function ShowcaseCard({
  name,
  blurb,
  tags = [],
  links = [],
  image,
}: {
  name: string
  blurb?: string
  tags?: string[]
  links?: { href: string; label: string }[]
  image?: string
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border-hairline)",
        background: "#fff",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 10",
          background: image ? "transparent" : "rgba(0,46,93,.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderBottom: "1px solid var(--border-hairline)",
          position: "relative",
        }}
      >
        {image ? (
          <Image src={image} alt={name} fill sizes="(max-width: 900px) 100vw, 580px" style={{ objectFit: "cover" }} />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontStretch: "var(--w-plate)",
              fontSize: "22px",
              color: "var(--slate)",
              padding: "0 20px",
              textAlign: "center",
            }}
          >
            {name}
          </span>
        )}
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "18px", margin: 0 }}>{name}</h3>
          <div style={{ display: "flex", gap: "6px" }}>
            {tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.55, margin: 0, flex: 1 }}>{blurb}</p>
        {links.length ? (
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "13px",
                  color: "var(--royal)",
                  textDecoration: "none",
                }}
              >
                {l.label} <Icon name="arrow--up-right" size={13} />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
