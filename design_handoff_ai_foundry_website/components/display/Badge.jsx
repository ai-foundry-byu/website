import React from "react";

/* Tag/badge: sharp, bordered, Plex 500. tone: default (slate border, navy
   text), accent (royal), on-dark (for navy grounds). */
export function Badge({ children, tone = "default", style }) {
  const tones = {
    default: { border: "1px solid var(--slate)", color: "var(--navy)" },
    accent: { border: "1px solid var(--royal)", color: "var(--royal)" },
    "on-dark": { border: "1px solid rgba(255,255,255,.4)", color: "#fff" },
  };
  return <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "var(--radius)", padding: "4px 10px", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "12px", lineHeight: 1.2, letterSpacing: "0.02em", whiteSpace: "nowrap", ...(tones[tone] || tones.default), ...style }}>{children}</span>;
}
