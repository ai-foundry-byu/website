import React from "react";

/* Expanding value row. Titles only until clicked; body text is verbatim
   brand copy and must not be paraphrased. */
export function ValueRow({ name, body, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--border-strong)" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: "100%", background: "transparent", border: 0, padding: "18px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "18px", lineHeight: 1.3, color: "var(--navy)" }}>{name}</span>
        <span aria-hidden="true" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "22px", lineHeight: 1, color: "var(--royal)", transform: open ? "rotate(45deg)" : "none", transition: "transform var(--dur-base) var(--ease-stamp)", flex: "none" }}>+</span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-stamp)" }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15.5px", lineHeight: 1.6, color: "var(--text-primary)", margin: 0, padding: "0 4px 20px", maxWidth: "66ch" }}>{body}</p>
        </div>
      </div>
    </div>
  );
}
