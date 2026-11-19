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
    fontSize: "16px", /* 16 px or iOS Safari zooms on focus */
    lineHeight: 1.4,
    color: "var(--text-primary)",
    backgroundColor: "#fff",
    /* Our own chevron: with appearance auto, iOS Safari ignores the padding
       and draws a 25 px tall control (measured 2026-11-11). */
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%231f4e7e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 40px 12px 14px",
    borderRadius: "var(--radius)",
    appearance: "none",
    WebkitAppearance: "none",
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
