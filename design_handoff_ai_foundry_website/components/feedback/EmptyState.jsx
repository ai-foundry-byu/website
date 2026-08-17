import React from "react";
import { Eyebrow } from "../display/Eyebrow";

/* Empty state: honest and quiet. No illustrations — an eyebrow, a plain
   statement, an optional action. */
export function EmptyState({ eyebrow = "Nothing here yet", title, detail, children }) {
  return (
    <div style={{ border: "1px solid var(--border-hairline)", borderRadius: "var(--radius)", padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" }}>
      <Eyebrow tone="meta">{eyebrow}</Eyebrow>
      {title ? <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h3)", margin: 0 }}>{title}</h3> : null}
      {detail ? <p className="caption" style={{ color: "var(--text-meta)", margin: 0, maxWidth: "44ch" }}>{detail}</p> : null}
      {children}
    </div>
  );
}
