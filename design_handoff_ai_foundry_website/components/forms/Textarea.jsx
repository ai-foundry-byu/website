import React from "react";
import { Field } from "./Input";

export function Textarea({ label, required, hint, error, rows = 4, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const s = {
    fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "15px", lineHeight: 1.5,
    color: "var(--text-primary)", background: "#fff", width: "100%", boxSizing: "border-box",
    padding: "12px 14px", borderRadius: "var(--radius)", resize: "vertical",
    border: error ? "2px solid var(--royal)" : "1px solid " + (focus ? "var(--royal)" : "var(--border-input)"),
    outline: "none", transition: "border-color var(--dur-fast)",
  };
  const el = <textarea rows={rows} aria-invalid={!!error} style={s} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} {...rest} />;
  return label ? <Field label={label} required={required} hint={hint} error={error}>{el}</Field> : el;
}
