"use client"

import { useState } from "react"
import { Button } from "@/components/ds/Button"
import { EmptyState } from "@/components/ds/EmptyState"
import { Input } from "@/components/ds/Input"
import { Select } from "@/components/ds/Select"
import { Textarea } from "@/components/ds/Textarea"
import { QUOTE_CONFIRM, QUOTE_CTA, QUOTE_CTA_NOTE, QUOTE_FIELDS } from "@/lib/content"
import styles from "./QuoteForm.module.css"

/**
 * The quote request form, rebuilt to design_handoff .../ui_kits/quote:
 * eight fields in a two-column grid (textarea and select span both),
 * required-field validation with royal borders and "Error:" in words,
 * a loading spinner on submit, and a quiet confirmation state.
 *
 * Field set and copy are QUOTE_FIELDS (FORMS.md form 1). Submissions post
 * to /api/quote, which writes to Supabase (project_proposals) — same
 * payload contract as before the redesign.
 */

/** Copy lookup: the label is the key into QUOTE_FIELDS. */
const field = (label: string) => {
  const f = QUOTE_FIELDS.find((x) => x.label === label)
  if (!f) throw new Error(`QUOTE_FIELDS is missing "${label}"`)
  return f
}

const REQUIRED: Record<string, string> = {
  first: "First name",
  last: "Last name",
  email: "Email",
  phone: "Phone number",
  company: "Company",
  brief: "This field",
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function QuoteForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const f = new FormData(e.currentTarget)
    const errs: Record<string, string> = {}
    for (const k in REQUIRED) {
      if (!String(f.get(k) || "").trim()) errs[k] = REQUIRED[k] + " is required."
    }
    const email = String(f.get("email") || "").trim()
    if (email && !EMAIL.test(email)) errs.email = "Enter a valid email address."
    const website = String(f.get("website") || "").trim()
    if (website && (/\s/.test(website) || !website.includes("."))) {
      errs.website = "Enter a valid website address."
    }
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    setServerError(null)
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: f.get("first"),
          last_name: f.get("last"),
          email: f.get("email"),
          phone: f.get("phone"),
          company: f.get("company"),
          website: f.get("website"),
          project_description: f.get("brief"),
          desired_timeline: f.get("timeline"),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setServerError(body?.error ?? "Could not submit right now. Please try again.")
        return
      }
      setSent(true)
    } catch {
      setServerError("Could not submit right now. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <EmptyState eyebrow={QUOTE_CONFIRM.eyebrow} title={QUOTE_CONFIRM.title} detail={QUOTE_CONFIRM.detail}>
        <div style={{ marginTop: "8px" }}>
          <Button variant="secondary" onClick={() => setSent(false)}>
            Back to the form
          </Button>
        </div>
      </EmptyState>
    )
  }

  return (
    <form onSubmit={submit} noValidate className={styles.grid}>
      <Input label="First name" name="first" required autoComplete="given-name" error={errors.first} />
      <Input label="Last name" name="last" required autoComplete="family-name" error={errors.last} />
      <Input label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
      <Input label="Phone number" name="phone" type="tel" required autoComplete="tel" error={errors.phone} />
      <Input label="Company" name="company" required autoComplete="organization" error={errors.company} />
      <Input label="Website" name="website" type="url" autoComplete="url" error={errors.website} />
      <div style={{ gridColumn: "1 / -1" }}>
        <Textarea
          label="What do you want built"
          name="brief"
          required
          rows={5}
          error={errors.brief}
          hint={field("What do you want built").help}
        />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Select label="When do you need it" name="timeline" options={field("When do you need it").options} placeholder="Choose one" />
      </div>
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "14px", marginTop: "6px", flexWrap: "wrap" }}>
        <Button variant="primary" size="lg" type="submit" loading={sending}>
          {sending ? "Sending" : QUOTE_CTA.label}
        </Button>
        <span className="caption" style={{ color: "var(--text-meta)" }}>
          {QUOTE_CTA_NOTE}
        </span>
        {serverError ? (
          <p
            role="alert"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "var(--size-caption)",
              lineHeight: 1.4,
              color: "var(--royal)",
              margin: 0,
              flexBasis: "100%",
            }}
          >
            Error: {serverError}
          </p>
        ) : null}
      </div>
    </form>
  )
}
