import React from "react";

/* Primary action. Royal fill, hover to navy, press stamps down 1px. */
export function Button({ variant = "primary", size = "md", href, children, onClick, type = "button", disabled, loading, style }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const palettes = {
    primary: { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" },
    primaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
    secondary: { background: "transparent", color: "var(--navy)", border: "1px solid var(--navy)" },
    secondaryHover: { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" },
    inverse: { background: "#fff", color: "var(--navy)", border: "1px solid #fff" },
    inverseHover: { background: "rgba(255,255,255,.85)", color: "var(--navy)", border: "1px solid rgba(255,255,255,.85)" },
    ghost: { background: "transparent", color: "var(--royal)", border: "1px solid transparent" },
    ghostHover: { background: "transparent", color: "var(--navy)", border: "1px solid transparent" },
  };
  const off = disabled || loading;
  const look = palettes[hover && !off ? variant + "Hover" : variant] || palettes.primary;
  const s = {
    fontFamily: "var(--font-body)", fontWeight: 500, lineHeight: 1.2,
    fontSize: size === "lg" ? "16px" : "var(--size-ui)",
    padding: size === "lg" ? "16px 28px" : "12px 20px",
    borderRadius: "var(--radius)", cursor: off ? "default" : "pointer", opacity: disabled ? 0.45 : 1,
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
    textDecoration: "none", userSelect: "none", whiteSpace: "nowrap", flex: "none",
    transform: press && !off ? "translateY(1px)" : "none",
    transition: "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast)",
    ...look, ...style,
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    onClick: off ? undefined : onClick,
  };
  const spinner = loading ? <span aria-hidden="true" style={{ width: "12px", height: "12px", border: "2px solid currentColor", borderRightColor: "transparent", animation: "btn-spin .8s linear infinite", display: "inline-block" }}></span> : null;
  const inner = <React.Fragment>{loading ? <style>{"@keyframes btn-spin{to{transform:rotate(360deg)}}"}</style> : null}{spinner}{children}</React.Fragment>;
  return href
    ? <a href={href} style={s} {...handlers}>{inner}</a>
    : <button type={type} disabled={disabled || loading} style={s} {...handlers}>{inner}</button>;
}
