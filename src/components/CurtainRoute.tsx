"use client"

/**
 * Route transitions on the View Transitions API (AF Stride demo,
 * brand/stride-2026-11). Replaces the motion-library curtain overlay.
 *
 * How it works: a plain left-click on an internal, hash-free link calls
 * document.startViewTransition(). Inside the update callback we router.push()
 * and hold the callback open until the new pathname commits, so the browser
 * snapshots the old page, then the new one, and animates between them with
 * the CSS in globals.css ("Route transitions"): the old page settles back
 * and dims while the new page RISES up through a hot horizon line, the
 * brand's own motion.
 *
 * The header carries view-transition-name: af-header, so it stays put while
 * the page beneath it changes.
 *
 * Pages stay server-rendered: this provider is one client leaf that receives
 * the page tree as children. Nothing here is required for navigation to
 * work. Browsers without startViewTransition, prefers-reduced-motion, hash
 * links, external URLs, modified clicks and back/forward all fall straight
 * through to ordinary Next navigation.
 *
 * A 2.5 s watchdog resolves the transition if a pushed route never commits
 * (redirect, slow chunk), so the page can never be left frozen.
 */

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { ComponentProps, ReactNode } from "react"

interface RouteTransitionContextValue {
  go: (href: string) => boolean
}

const RouteTransitionContext = React.createContext<RouteTransitionContextValue | null>(null)

type StartViewTransition = (cb: () => Promise<void>) => { finished: Promise<void> }

export function CurtainRouteProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const pending = React.useRef<{ target: string; resolve: () => void } | null>(null)

  // New route committed: release the transition so the browser snapshots it.
  React.useEffect(() => {
    const p = pending.current
    if (p && pathname === p.target) {
      pending.current = null
      p.resolve()
    }
  }, [pathname])

  const go = React.useCallback(
    (href: string) => {
      const start = (document as Document & { startViewTransition?: StartViewTransition }).startViewTransition
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!start || reduced || pending.current) return false
      const target = href.split("?")[0]
      const vt = start.call(
        document,
        () =>
          new Promise<void>((resolve) => {
            const done = () => {
              // The hot horizon line that leads the reveal: present only in
              // the new snapshot, so it animates as an entering element.
              const line = document.createElement("div")
              line.className = "vt-horizon"
              line.setAttribute("aria-hidden", "true")
              document.body.appendChild(line)
              resolve()
            }
            pending.current = { target, resolve: done }
            router.push(href)
            setTimeout(() => {
              if (pending.current?.target === target) {
                pending.current = null
                done()
              }
            }, 2500)
          }),
      )
      vt.finished.finally(() => document.querySelectorAll(".vt-horizon").forEach((n) => n.remove()))
      return true
    },
    [router],
  )

  const context = React.useMemo(() => ({ go }), [go])
  return <RouteTransitionContext.Provider value={context}>{children}</RouteTransitionContext.Provider>
}

export type CurtainNavLinkProps = ComponentProps<typeof Link>

/**
 * Drop-in for next/link. Renders a real <a> via next/link (href, prefetch,
 * cmd-click, copy-link all intact); a plain left-click on an internal,
 * hash-free href runs through a view transition when the browser has one.
 */
export function CurtainNavLink({ href, onClick, ...rest }: CurtainNavLinkProps) {
  const ctx = React.useContext(RouteTransitionContext)
  const pathname = usePathname()

  const hrefString = typeof href === "string" ? href : (href.pathname ?? "")
  const eligible = ctx !== null && hrefString.startsWith("/") && !hrefString.includes("#")

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (!eligible || event.defaultPrevented) return
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        if (hrefString === pathname) return
        if (ctx.go(hrefString)) event.preventDefault()
      }}
      {...rest}
    />
  )
}
