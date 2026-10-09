"use client"

import { useEffect, useRef, useState } from "react"
import { APP_HOME, APP_PROFILE, APP_SIGN_IN, APP_SIGN_OUT } from "@/lib/content"

type Me = { signedIn: false } | { signedIn: true; first: string | null; initials: string; email: string | null }

const LINK: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "var(--size-ui)",
  color: "var(--navy)",
}

const PERSON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none" }}>
    <circle cx="8" cy="5.5" r="2.75" />
    <path d="M2.75 14c.6-2.9 2.7-4.5 5.25-4.5s4.65 1.6 5.25 4.5" />
  </svg>
)

/**
 * The door into the app (aifoundry.byu.edu/app, the Strategy repo's docs/LOGIN-DOOR.md).
 * Signed out: "Sign in". Signed in: initials and first name with a menu (Home, My
 * profile, Sign out), as the strategy lane's header does. In the phone menu, the
 * signed-in rows are Home and My profile.
 *
 * It asks the app who is signed in at /app/api/auth/me. Same origin through the /app
 * rewrite in next.config.ts, so the app's sign-in cookie rides along and this site
 * needs no Supabase keys. Until the answer arrives, and if the app does not answer,
 * it shows Sign in: a door that always works beats a blank space.
 *
 * Plain <a>, never next/link: /app is the other app, so a client-side route change
 * would ask this site's router for a page it does not have.
 */
export function AccountMenu({ variant }: { variant: "bar" | "menu" }) {
  const [me, setMe] = useState<Me>({ signedIn: false })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/app/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { signedIn: false }))
      .then((m: Me) => setMe(m))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  if (!me.signedIn) {
    return variant === "bar" ? (
      <a href={APP_SIGN_IN} className="link-draw inline-flex items-center gap-1.5 whitespace-nowrap no-underline" style={LINK}>
        {PERSON}
        Sign in
      </a>
    ) : (
      <a href={APP_SIGN_IN} className="flex items-center gap-2 px-4 py-3 no-underline" style={LINK}>
        {PERSON}
        Sign in
      </a>
    )
  }

  const avatar = (
    <span
      aria-hidden="true"
      style={{ width: 28, height: 28, borderRadius: 999, background: "var(--navy)", color: "#fff", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", letterSpacing: ".02em", flex: "none" }}
    >
      {me.initials}
    </span>
  )

  if (variant === "menu")
    return (
      <>
        <a href={APP_HOME} className="flex items-center gap-2 px-4 py-3 no-underline" style={LINK}>
          {avatar}
          {me.first ?? "Your account"}: Home
        </a>
        <a href={APP_PROFILE} className="block px-4 py-3 no-underline" style={LINK}>
          My profile
        </a>
      </>
    )

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu" className="inline-flex items-center gap-2 whitespace-nowrap" style={{ ...LINK, background: "none", border: 0, cursor: "pointer", padding: 0 }}>
        {avatar}
        {me.first ?? "Account"}
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m4.5 6 3.5 3.5L11.5 6" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 py-1.5" style={{ top: "calc(100% + 14px)", width: 240, background: "#fff", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius)", boxShadow: "0 8px 24px rgba(0,46,93,.12)" }}>
          {me.email && (
            <div className="px-4 pb-2.5 pt-2" style={{ fontSize: 12.5, color: "var(--text-secondary, #5b6770)", borderBottom: "1px solid var(--border-hairline)" }}>
              Signed in as {me.email}
            </div>
          )}
          <a role="menuitem" href={APP_HOME} className="block px-4 py-2.5 no-underline" style={LINK}>
            Home
          </a>
          <a role="menuitem" href={APP_PROFILE} className="block px-4 py-2.5 no-underline" style={LINK}>
            My profile
          </a>
          {/* The app's sign-out: clears its session on this address (and on strategy.byu.edu
              for someone in both lanes), then lands on the app's sign-in page. */}
          <form method="post" action={APP_SIGN_OUT}>
            <button role="menuitem" type="submit" className="block w-full px-4 py-2.5 text-left" style={{ ...LINK, background: "none", border: 0, borderTop: "1px solid var(--border-hairline)", cursor: "pointer" }}>
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
