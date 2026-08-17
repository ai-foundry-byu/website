"use client"

import { useState } from "react"

/**
 * Field wrapper + text input. Port of design_handoff .../forms/Input.jsx.
 * No red exists in the palette: errors are royal, 2px border, and say
 * "Error:" in words so color is never the only signal.
 */
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "var(--size-ui)",
  lineHeight: 1.2,
  display: "block",
}

const hintStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  fontSize: "var(--size-caption)",
  lineHeight: 1.4,
  color: "var(--text-meta)",
  margin: "6px 0 0",
}

export const boxStyle = (focus: boolean, error?: string): React.CSSProperties => ({
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
  border: error ? "2px solid var(--royal)" : "1px solid " + (focus ? "var(--royal)" : "var(--border-input)"),
  outline: "none",
  transition: "border-color var(--dur-fast)",
})

export type FieldProps = {
  label: string
  required?: boolean
  hint?: string
  error?: string
}

export function Field({ label, required, hint, error, children }: FieldProps & { children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>
        {label}
        {required ? (
          <span style={{ color: "var(--royal)" }}> *</span>
        ) : (
          <span style={{ color: "var(--text-meta)", fontWeight: 400 }}> (optional)</span>
        )}
      </span>
      <div style={{ marginTop: "8px" }}>{children}</div>
      {error ? (
        <p style={{ ...hintStyle, color: "var(--royal)", fontWeight: 600 }}>Error: {error}</p>
      ) : hint ? (
        <p style={hintStyle}>{hint}</p>
      ) : null}
    </label>
  )
}

export function Input({
  label,
  required,
  hint,
  error,
  type = "text",
  ...rest
}: Partial<FieldProps> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "required">) {
  const [focus, setFocus] = useState(false)
  const el = (
    <input
      type={type}
      required={required}
      aria-invalid={!!error}
      style={boxStyle(focus, error)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
    />
  )
  return label ? (
    <Field label={label} required={required} hint={hint} error={error}>
      {el}
    </Field>
  ) : (
    el
  )
}
