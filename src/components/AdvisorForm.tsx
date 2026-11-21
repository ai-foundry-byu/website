"use client"

import { useState } from "react"
import { Button } from "@/components/ds/Button"
import { EmptyState } from "@/components/ds/EmptyState"
import { Input } from "@/components/ds/Input"
import { Textarea } from "@/components/ds/Textarea"
import styles from "./QuoteForm.module.css"

/** Advisor sign-up for the competition. Posts to /api/competition/advise. */
const REQUIRED: Record<string, string> = { name: "Name", email: "Email", company: "Company", title: "Title" }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AdvisorForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) || "").trim()
    const errs: Record<string, string> = {}
    for (const k in REQUIRED) if (!v(k)) errs[k] = REQUIRED[k] + " is required."
    if (v("email") && !EMAIL.test(v("email"))) errs.email = "Enter a valid email address."
    if (!f.get("agreed_terms")) errs.agreed_terms = "Please confirm before you submit."
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    setServerError(null)
    try {
      const body: Record<string, unknown> = {}
      for (const [k, val] of f.entries()) body[k] = typeof val === "string" ? val : ""
      body.agreed_terms = true
      const res = await fetch("/api/competition/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        setServerError(j?.error ?? "Could not submit right now. Please try again.")
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
      <EmptyState
        eyebrow="Thank you"
        title="We have your name."
        detail="Scott Murff will be in touch about team selection and the trip to Provo."
      />
    )
  }

  return (
    <form onSubmit={submit} noValidate className={styles.grid}>
      <Input label="Full name" name="name" required autoComplete="name" error={errors.name} />
      <Input label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
      <Input label="Company or AI lab" name="company" required autoComplete="organization" error={errors.company} />
      <Input label="Title" name="title" required autoComplete="organization-title" error={errors.title} />
      <div style={{ gridColumn: "1 / -1" }}>
        <Input label="LinkedIn" name="linkedin" type="url" />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Textarea label="What could you help a team with?" name="expertise" rows={4} hint="For example: model choice, evaluation, product scoping, shipping fast" />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Input label="How did you hear about the competition?" name="heard_from" />
      </div>
      <label style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", alignItems: "flex-start", fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.5 }}>
        <input type="checkbox" name="agreed_terms" value="yes" style={{ marginTop: "4px", width: "18px", height: "18px", flex: "none" }} />
        <span>
          If I am matched with a team, I will advise them during the build on January 27 and 28, 2027, travel to BYU in
          Provo, Utah, at my own expense for Friday, January 29, and serve as a judge that day. I will not score my own team.
          <span style={{ color: "var(--royal)" }}> *</span>
          {errors.agreed_terms ? (
            <span style={{ display: "block", color: "var(--royal)", fontWeight: 600, fontSize: "var(--size-caption)", marginTop: "4px" }}>
              Error: {errors.agreed_terms}
            </span>
          ) : null}
        </span>
      </label>
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "14px", marginTop: "6px", flexWrap: "wrap" }}>
        <Button variant="primary" size="lg" type="submit" loading={sending}>
          {sending ? "Sending" : "I'm willing to advise"}
        </Button>
        {serverError ? (
          <p role="alert" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-caption)", color: "var(--royal)", margin: 0, flexBasis: "100%" }}>
            Error: {serverError}
          </p>
        ) : null}
      </div>
    </form>
  )
}
