import Image from "next/image"
import { Badge } from "./Badge"
import { Icon } from "./Icon"

/* Reference build. Image is a 16:10 crop of the live product; without one a
   typographic plate stands in. Honesty rules: state where the build actually
   is, claim no client.
   Port of design_handoff .../content/ShowcaseCard.jsx, plus the approved
   motion-plan #7 treatment: hover swaps the border to royal, slides four
   registration ticks in at the corners, and raises a caption bar over the
   image's bottom edge. All CSS (globals: .reg-card/.reg-tick/.reg-bar);
   devices without hover keep the bar visible. */
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
      className="reg-card"
      style={{
        border: "1px solid var(--border-hairline)",
        background: "#fff",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <span aria-hidden="true" className="reg-tick tl" />
      <span aria-hidden="true" className="reg-tick tr" />
      <span aria-hidden="true" className="reg-tick bl" />
      <span aria-hidden="true" className="reg-tick br" />
      {/* Linear's rule (Measured Color Tier 3): the screenshot is the only
          saturated object, presented in one monochrome frame — a flat
          browser-chrome bar with three navy-alpha dots, hairlines, no
          shadow — so its color reads intentional. */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          padding: "8px 12px",
          background: "#fff",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "rgba(0,46,93,.25)" }} />
        ))}
      </div>
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
        <span aria-hidden="true" className="reg-bar">
          {name} <span style={{ color: "var(--royal)" }}>→</span>
        </span>
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
                className="link-draw"
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
                {l.label}{" "}
                <span className="arr">
                  <Icon name="arrow--up-right" size={13} />
                </span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
