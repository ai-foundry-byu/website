import React from "react";

/* Credibility number. Cast 125, tight tracking, numerals not words. */
export function Stat({ value, caption, onDark, size = "48px" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStretch: "var(--w-cast)", letterSpacing: "-0.02em", lineHeight: 1, fontSize: size, color: onDark ? "#fff" : "var(--navy)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      {caption ? <span className="caption" style={{ color: onDark ? "var(--text-on-dark-soft)" : "var(--text-meta)" }}>{caption}</span> : null}
    </div>
  );
}
