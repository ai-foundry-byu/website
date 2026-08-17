import React from "react";
import { Button } from "../forms/Button";

/* Modal: navy scrim, sharp white panel, no shadow. actions = array of
   Button props ({label, variant, onClick}). */
export function Dialog({ open, onClose, title, children, actions = [] }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,46,93,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: 100 }}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", maxWidth: "480px", width: "100%", borderRadius: "var(--radius)", padding: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h3)", lineHeight: 1.3, margin: 0 }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: 0, cursor: "pointer", fontSize: "22px", lineHeight: 1, color: "var(--navy)", padding: 0 }}>×</button>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.55 }}>{children}</div>
        {actions.length ? (
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "6px" }}>
            {actions.map((a) => <Button key={a.label} variant={a.variant || "primary"} onClick={a.onClick}>{a.label}</Button>)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
