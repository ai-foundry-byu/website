"use client"

import { useState } from "react"
import { Button } from "@/components/ds/Button"
import { EmptyState } from "@/components/ds/EmptyState"
import { Input } from "@/components/ds/Input"
import { Textarea } from "@/components/ds/Textarea"
import styles from "./QuoteForm.module.css"

/**
 * Application for the MBA Full-Stack Product Builder Case Competition.
 * One application per team of two MBA students. Posts to /api/competition.
 */
const REQUIRED: Record<string, string> = {
  team_name: "Team name",
  student1_name: "Name",
  student1_email: "Email",
  student1_school: "School",
  student2_name: "Name",
  student2_email: "Email",
  student2_school: "School",
  why_team: "This field",
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const h2: React.CSSProperties = {
  gridColumn: "1 / -1",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "18px",
  margin: "12px 0 0",
  color: "var(--navy)",
}

export function CompetitionForm() {
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
    for (const k of ["student1_email", "student2_email"]) {
      if (v(k) && !EMAIL.test(v(k))) errs[k] = "Enter a valid email address."
    }
    if (v("student1_email") && v("student1_email").toLowerCase() === v("student2_email").toLowerCase()) {
      errs.student2_email = "The two students need different email addresses."
    }
    if (!f.get("agreed_terms")) errs.agreed_terms = "Please confirm before you submit."
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    setServerError(null)
    try {
      const body: Record<string, unknown> = {}
      for (const [k, val] of f.entries()) body[k] = typeof val === "string" ? val : ""
      body.agreed_terms = true
      const res = await fetch("/api/competition", {
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
        eyebrow="Application received"
        title="Thank you. Your team is in the review."
        detail="We will email both students with a decision. Accepted teams are told how to pay the $50 fee per student and are matched with their advisor."
      />
    )
  }

  const student = (n: 1 | 2) => (
    <>
      <h2 style={h2}>Student {n}</h2>
      <Input label="Full name" name={`student${n}_name`} required error={errors[`student${n}_name`]} />
      <Input label="Email" name={`student${n}_email`} type="email" required error={errors[`student${n}_email`]} />
      <Input label="School" name={`student${n}_school`} required hint="The business school where you are enrolled in an MBA program" error={errors[`student${n}_school`]} />
      <Input label="MBA graduation year" name={`student${n}_grad_year`} inputMode="numeric" />
      <div style={{ gridColumn: "1 / -1" }}>
        <Input label="LinkedIn" name={`student${n}_linkedin`} type="url" />
      </div>
    </>
  )

  return (
    <form onSubmit={submit} noValidate className={styles.grid}>
      <div style={{ gridColumn: "1 / -1" }}>
        <Input label="Team name" name="team_name" required error={errors.team_name} />
      </div>
      {student(1)}
      {student(2)}
      <h2 style={h2}>Your team</h2>
      <div style={{ gridColumn: "1 / -1" }}>
        <Textarea
          label="Why should your team be selected?"
          name="why_team"
          required
          rows={6}
          hint="What each of you brings, and anything either of you has built, with or without AI. A few paragraphs is plenty."
          error={errors.why_team}
        />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Input label="Link to something you have built" name="built_link" type="url" hint="A product, prototype, repository, or demo video" />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Input label="Is there an AI lab or company you would most like your advisor to come from?" name="advisor_interest" hint="We will try, but cannot promise a match" />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Input label="How did you hear about the competition?" name="heard_from" />
      </div>
      <label style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", alignItems: "flex-start", fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.5 }}>
        <input type="checkbox" name="agreed_terms" value="yes" style={{ marginTop: "4px", width: "18px", height: "18px", flex: "none" }} />
        <span>
          If our team is selected, both of us will build from Wednesday, January 27 to Thursday, January 28, 2027, and attend
          in person at BYU in Provo, Utah, on Friday, January 29. Each of us will pay the $50 fee, which includes lunch.
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
          {sending ? "Sending" : "Submit application"}
        </Button>
        <span className="caption" style={{ color: "var(--text-meta)" }}>
          One application per team.
        </span>
        {serverError ? (
          <p role="alert" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-caption)", color: "var(--royal)", margin: 0, flexBasis: "100%" }}>
            Error: {serverError}
          </p>
        ) : null}
      </div>
    </form>
  )
}
