import React from "react";
import { Button } from "../forms/Button";

/* Top bar: stamped nameplate left, links + one action right.
   The "× BYU MARRIOTT" tag is a text placeholder — the real co-branded
   lockup ships as a locked file and must never be recreated. */
export function NavBar({ links = [], ctaLabel = "Work with us", ctaHref, onCta, sticky }) {
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid var(--border-hairline)", position: sticky ? "sticky" : "static", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--container-pad)", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        <a href="/" style={{ display: "flex", alignItems: "baseline", gap: "10px", textDecoration: "none", color: "var(--navy)", whiteSpace: "nowrap" }}>
          <span className="nameplate" style={{ fontSize: "20px" }}>AI FOUNDRY</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontStretch: "100%", fontSize: "11px", letterSpacing: "0.02em", color: "var(--text-meta)" }}>× BYU MARRIOTT</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", color: "var(--navy)", textDecoration: "none", whiteSpace: "nowrap" }}>{l.label}</a>
          ))}
          <Button variant="primary" href={ctaHref} onClick={onCta}>{ctaLabel}</Button>
        </nav>
      </div>
    </header>
  );
}
