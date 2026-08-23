import React from "react";

/* Rail-62 all-caps label. tone: accent (royal), meta (slate), on-dark. */
export function Eyebrow({ children, tone = "accent", style }) {
  const colors = { accent: "var(--accent)", meta: "var(--text-meta)", "on-dark": "rgba(255,255,255,.65)" };
  return (
    <span style={{
      fontFamily: "var(--font-display)", fontWeight: 600, fontStretch: "var(--w-rail)",
      fontSize: "var(--size-eyebrow)", textTransform: "uppercase", letterSpacing: "0.10em",
      lineHeight: 1.2, color: colors[tone] || colors.accent, display: "inline-block", ...style,
    }}>{children}</span>
  );
}
