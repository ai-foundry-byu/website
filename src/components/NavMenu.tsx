"use client"

import { useEffect, useRef, useState } from "react"
import { CurtainNavLink } from "@/components/CurtainRoute"
import type { NavLink } from "@/lib/content"

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "var(--size-ui)",
  color: "var(--navy)",
}

/**
 * A top-bar tab that opens a short list of pages (About). Click opens it;
 * a click outside, Escape, or choosing a page closes it. Same panel as
 * AccountMenu: white, hairline border, system radius, no shadow.
 */
export function NavMenu({ label, items }: { label: string; items: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", esc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        className="link-draw inline-flex items-center gap-1 whitespace-nowrap"
        style={{ ...LABEL, background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-stamp)" }}>
          <path d="M3 4.5 6 7.5 9 4.5" />
        </svg>
      </button>
      {open ? (
        <ul
          className="absolute left-1/2 top-full z-50 mt-3 w-48 -translate-x-1/2 py-2"
          style={{ background: "#fff", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius)" }}
        >
          {items.map((link) => (
            <li key={link.href}>
              <CurtainNavLink
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 no-underline hover:bg-[var(--fill-selected)]"
                style={LABEL}
              >
                {link.label}
              </CurtainNavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
