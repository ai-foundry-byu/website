"use client"

import { useState } from "react"
import { Field, type FieldProps } from "./Input"

/* Port of design_handoff .../forms/Select.jsx. */
export function Select({
  label,
  required,
  hint,
  error,
  options = [],
  placeholder,
  ...rest
}: Partial<FieldProps> & {
  options?: string[]
  placeholder?: string
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "required">) {
  const [focus, setFocus] = useState(false)
  const s: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: 1.4,
    color: "var(--text-primary)",
    background: "#fff",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "var(--radius)",
    appearance: "auto",
    border: error ? "2px solid var(--royal)" : "1px solid " + (focus ? "var(--royal)" : "var(--border-input)"),
    outline: "none",
    transition: "border-color var(--dur-fast)",
  }
  const el = (
    <select
      required={required}
      aria-invalid={!!error}
      style={s}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      defaultValue=""
      {...rest}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
  return label ? (
    <Field label={label} required={required} hint={hint} error={error}>
      {el}
    </Field>
  ) : (
    el
  )
}
