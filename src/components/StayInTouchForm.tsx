"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ds/Button"
import { EmptyState } from "@/components/ds/EmptyState"
import { Input } from "@/components/ds/Input"
import { QUOTE_CTA, STAY_CONFIRM, STAY_INTERESTS } from "@/lib/content"
import styles from "./QuoteForm.module.css"

/**
 * "Stay in touch": the no-account way into the network, built for a QR code
 * on a slide. Email is the only required field. Posts to the app's
 * /app/api/network/signup (same origin through the /app rewrite), which adds
 * the person to the Strategy database's shared mailing list (contacts) with a
 * tag per interest. ?from=<source> on the page URL is passed along, so
 * /network?from=aipm marks signups from the AI PM Bootcamp.
 *
 * Replaces the six-field NetworkForm retired 2026-10-08, which wrote to the
 * old site's database. The app sign-up (email and password) stays below it.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function StayInTouchForm() {
  const [from, setFrom] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<string[] | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    setFrom(new URLSearchParams(window.location.search).get("from"))
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const f = new FormData(e.currentTarget)
    const email = String(f.get("email") || "").trim()
    const err = !email ? "Email is required." : !EMAIL.test(email) ? "Enter a valid email address." : undefined
    setError(err)
    if (err) return
    const interests = STAY_INTERESTS.map((i) => i.key).filter((k) => f.get(k) === "on")
    setSending(true)
    setServerError(null)
    try {
      const res = await fetch("/app/api/network/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: f.get("first"),
          last_name: f.get("last"),
          company: f.get("company"),
          interests,
          from,
          website: f.get("website"),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setServerError(body?.error ?? "Could not save that right now. Please try again.")
        return
      }
      setSent(interests)
    } catch {
      setServerError("Could not save that right now. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <EmptyState eyebrow={STAY_CONFIRM.eyebrow} title={STAY_CONFIRM.title} detail={STAY_CONFIRM.detail}>
        {sent.includes("project") ? (
          <div style={{ marginTop: "8px" }}>
            <Button variant="primary" href={QUOTE_CTA.href}>
              {QUOTE_CTA.label}
            </Button>
          </div>
        ) : null}
      </EmptyState>
    )
  }

  return (
    <form onSubmit={submit} noValidate className={styles.grid}>
      <Input label="First name" name="first" autoComplete="given-name" />
      <Input label="Last name" name="last" autoComplete="family-name" />
      <Input label="Email" name="email" type="email" required autoComplete="email" error={error} />
      <Input label="Company or school" name="company" autoComplete="organization" />
      {/* Honeypot: hidden from people and screen readers; a bot fills it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <fieldset style={{ gridColumn: "1 / -1", border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "var(--size-ui)", marginBottom: "10px" }}>
          I&apos;m interested in
        </legend>
        <div style={{ display: "grid", gap: "10px" }}>
          {STAY_INTERESTS.map((i) => (
            <label key={i.key} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "var(--text-primary)", cursor: "pointer" }}>
              <input type="checkbox" name={i.key} style={{ width: 18, height: 18, accentColor: "var(--royal)" }} />
              {i.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "14px", marginTop: "6px", flexWrap: "wrap" }}>
        <Button variant="primary" size="lg" type="submit" loading={sending}>
          {sending ? "Sending" : "Stay in touch"}
        </Button>
        <span className="caption" style={{ color: "var(--text-meta)" }}>
          Only your email is required.
        </span>
        {serverError ? (
          <p
            role="alert"
            style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-caption)", lineHeight: 1.4, color: "var(--royal)", margin: 0, flexBasis: "100%" }}
          >
            Error: {serverError}
          </p>
        ) : null}
      </div>
    </form>
  )
}
