import React from "react";

export function Footer({ links = [], colophon = "An experiential learning program of the BYU Marriott School of Business." }) {
  return (
    <footer style={{ background: "var(--surface-inverse)", color: "#fff" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px var(--container-pad) 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <span className="nameplate" style={{ fontSize: "24px" }}>AI FOUNDRY</span>
          <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "var(--size-ui)", color: "var(--text-on-dark-soft)", textDecoration: "none" }}>{l.label}</a>
            ))}
          </nav>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", marginTop: "32px", paddingTop: "20px" }}>
          <p className="caption" style={{ color: "var(--text-on-dark-soft)", fontWeight: 300, margin: 0 }}>{colophon}</p>
        </div>
      </div>
    </footer>
  );
}
