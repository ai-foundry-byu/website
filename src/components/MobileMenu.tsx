"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * The phone and tablet menu: a native disclosure (it opens and closes with no script), plus the
 * closing a menu needs. A <details> stays open until its summary is tapped again, so a tap on
 * /#quote scrolled the form under an open panel, and a tap on the page you are on did nothing
 * visible. This closes it when a link inside is chosen, on a tap or click outside it, on Escape,
 * on a hash change and on a route change, as the desktop About menu (NavMenu) closes.
 */
export function MobileMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (ref.current) ref.current.open = false
  }, [pathname])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const close = () => {
      el.open = false
    }
    const pick = (e: MouseEvent) => (e.target as Element | null)?.closest?.("a[href]") && close()
    const outside = (e: PointerEvent) => el.open && !el.contains(e.target as Node) && close()
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !el.open) return
      close()
      el.querySelector("summary")?.focus()
    }
    el.addEventListener("click", pick)
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", esc)
    window.addEventListener("hashchange", close)
    return () => {
      el.removeEventListener("click", pick)
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", esc)
      window.removeEventListener("hashchange", close)
    }
  }, [])

  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  )
}
