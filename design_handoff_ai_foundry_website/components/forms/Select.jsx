import React from "react";
import { Field } from "./Input";

export function Select({ label, required, hint, error, options = [], placeholder, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const s = {
    fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "15px", lineHeight: 1.4,
    color: "var(--text-primary)", background: "#fff", width: "100%", boxSizing: "border-box",
    padding: "12px 14px", borderRadius: "var(--radius)", appearance: "auto",
    border: error ? "2px solid var(--royal)" : "1px solid " + (focus ? "var(--royal)" : "var(--border-input)"),
    outline: "none", transition: "border-color var(--dur-fast)",
  };
  const el = (
    <select aria-invalid={!!error} style={s} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} defaultValue="" {...rest}>
      {placeholder ? <option value="" disabled>{placeholder}</option> : null}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  return label ? <Field label={label} required={required} hint={hint} error={error}>{el}</Field> : el;
}
