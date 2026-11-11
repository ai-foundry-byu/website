"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

/**
 * Route changes through the View Transitions API (Runout preview).
 *
 * Replaces the curtain experiment on this branch. One document-level click
 * listener (capture phase, so it runs before next/link's own handler, which
 * then sees defaultPrevented and stands down) takes every plain left-click on
 * an internal link and runs the navigation inside
 * document.startViewTransition(). The callback's promise resolves when the
 * new pathname commits, so the browser snapshots the old page, React swaps
 * the tree, and the CSS in globals.css animates between the two: the outgoing
 * page steps back and clears, the incoming one is set in from below on the
 * builder's seat easing, an orange level line is shot along the bar's foot, and
 * the header (view-transition-name: af-header) holds perfectly still.
 *
 * Left alone, exactly as the curtain left them: hash links, links that open a
 * new tab or download, external URLs, /app (rewritten to another Vercel
 * project), /api, any path with a file extension, modified clicks, browser
 * back and forward, and every navigation when prefers-reduced-motion is set
 * or the browser has no View Transitions (Firefox before 144): those go
 * through next/link untouched. A 2.5 s watchdog resolves the transition if a
 * route never commits, so the page can never stay frozen on a snapshot.
 */
export function RouteTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const pending = React.useRef<{ path: string; resolve: () => void } | null>(null)

  React.useEffect(() => {
    const p = pending.current
    if (p && p.path === pathname) {
      pending.current = null
      p.resolve()
    }
  }, [pathname])

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const doc = document as Document & {
        startViewTransition?: (cb: () => Promise<void>) => unknown
      }
      if (typeof doc.startViewTransition !== "function") return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      const a = (e.target as Element | null)?.closest?.("a")
      if (!a || !a.href) return
      if (a.target && a.target !== "_self") return
      if (a.hasAttribute("download")) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.hash) return
      if (/^\/(app|api)(\/|$)/.test(url.pathname)) return
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return
      if (url.pathname === window.location.pathname) return
      e.preventDefault()
      const href = url.pathname + url.search
      const root = document.documentElement
      const vt = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            // New state only: the bar's level line is shot as the page is set in.
            root.setAttribute("data-af-vt", String(Date.now()))
            const done = () => {
              clearTimeout(watchdog)
              resolve()
            }
            const watchdog = setTimeout(() => {
              pending.current = null
              resolve()
            }, 2500)
            pending.current = { path: url.pathname, resolve: done }
            router.push(href)
          }),
      ) as { finished?: Promise<void> } | undefined
      const mark = () => root.getAttribute("data-af-vt")
      Promise.resolve(vt?.finished)
        .catch(() => {})
        .then(() => {
          const stamp = mark()
          // The line takes 0.9 s; the transition itself about 0.5 s.
          setTimeout(() => {
            if (mark() === stamp) root.removeAttribute("data-af-vt")
          }, 600)
        })
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [router])

  return <>{children}</>
}
