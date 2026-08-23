"use client"

/**
 * CurtainRoute — real route navigation behind the PageCurtain experiment.
 * PREVIEW-ONLY (corbin-curtain-site branch): exists so the team can feel the
 * curtain on the actual site, not just the /lab/page-curtain harness.
 *
 * How it keeps the static model intact: pages stay server-rendered and
 * prerendered. This provider is one client leaf in the layout that receives
 * the page tree as children (a ReactNode prop crosses the boundary without
 * hydrating it). Navigation is intercepted at the link: close the curtain
 * over the viewport, router.push() while covered, open when the new pathname
 * commits. Cost is one fixed overlay and the interception logic — the pages
 * themselves ship no extra JavaScript.
 *
 * The doors carry a 3px ember edge, so at full close they meet as the site's
 * vertical accent-bar motif before parting onto the next page.
 *
 * What is deliberately NOT curtained: hash links (/#quote), external URLs,
 * modified clicks (cmd/ctrl/shift/alt, middle-click), browser back/forward
 * (popstate swaps content directly), and any navigation under
 * prefers-reduced-motion, which goes straight to router.push().
 *
 * A 2.5s watchdog force-opens the curtain if a pushed route never commits
 * (redirect, slow network chunk), so the site can never be left covered.
 */

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import {
  curtainPanels,
  EASE,
  type CurtainDirection,
  type CurtainEffect,
} from "@/components/PageCurtain"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

type Phase = "idle" | "closing" | "navigating" | "opening"

interface CurtainRouteContextValue {
  go: (href: string) => void
}

const CurtainRouteContext = React.createContext<CurtainRouteContextValue | null>(null)

/** Ember seam: the door edges that meet at centre echo the accent-bar motif. */
const DOOR_EDGE: Record<string, CSSProperties> = {
  "door-left": { borderRight: "3px solid var(--surface-accent)" },
  "door-right": { borderLeft: "3px solid var(--surface-accent)" },
}

export interface CurtainRouteProviderProps {
  /** Route order for wipe direction; unknown routes navigate as forward. */
  order?: readonly string[]
  effect?: CurtainEffect
  closeDuration?: number
  openDuration?: number
  children: ReactNode
}

export function CurtainRouteProvider({
  order = ["/", "/work", "/network", "/about"],
  effect = "doors",
  closeDuration = 0.45,
  openDuration = 0.45,
  children,
}: CurtainRouteProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const reduced = useReducedMotion()

  interface State {
    phase: Phase
    target: string | null
    direction: CurtainDirection
  }
  const [state, setState] = React.useState<State>({
    phase: "idle",
    target: null,
    direction: 1,
  })
  const { phase, target, direction } = state

  const go = React.useCallback(
    (href: string) => {
      if (reduced) {
        router.push(href)
        return
      }
      setState((s) => {
        if (s.phase !== "idle") return s
        const from = order.indexOf(pathname)
        const to = order.indexOf(href)
        const dir: CurtainDirection = from !== -1 && to !== -1 && to < from ? -1 : 1
        return { phase: "closing", target: href, direction: dir }
      })
    },
    [order, pathname, reduced, router],
  )

  // Curtain fully closed: perform the real navigation while covered.
  const handleClosed = React.useCallback(() => {
    setState((s) => (s.phase === "closing" ? { ...s, phase: "navigating" } : s))
  }, [])
  React.useEffect(() => {
    if (phase === "navigating" && target) router.push(target)
  }, [phase, target, router])

  // New route committed (or was already current): part the curtain.
  React.useEffect(() => {
    if (phase === "navigating" && target && pathname === target.split("#")[0]) {
      setState((s) => ({ ...s, phase: "opening", target: null }))
    }
  }, [phase, target, pathname])

  // Watchdog: never leave the site covered if a push doesn't commit.
  React.useEffect(() => {
    if (phase !== "navigating") return
    const t = setTimeout(
      () => setState((s) => (s.phase === "navigating" ? { ...s, phase: "opening", target: null } : s)),
      2500,
    )
    return () => clearTimeout(t)
  }, [phase])

  const handleOpened = React.useCallback(() => {
    setState((s) => (s.phase === "opening" ? { ...s, phase: "idle" } : s))
  }, [])

  const panels = React.useMemo(() => curtainPanels(effect, direction), [effect, direction])

  // A phase completes when every panel (doors has two) finishes animating.
  const doneCount = React.useRef(0)
  React.useEffect(() => {
    doneCount.current = 0
  }, [phase])
  const active = phase !== "idle"
  const closingward = phase === "closing" || phase === "navigating"
  const handlePanelDone = () => {
    doneCount.current += 1
    if (doneCount.current < panels.length) return
    if (phase === "closing") handleClosed()
    else if (phase === "opening") handleOpened()
  }

  const context = React.useMemo(() => ({ go }), [go])

  return (
    <CurtainRouteContext.Provider value={context}>
      {children}
      {active && (
        <div
          aria-hidden
          style={{ position: "fixed", inset: 0, zIndex: 100, overflow: "hidden" }}
        >
          {panels.map((panel) => (
            <motion.div
              key={panel.key}
              className="bg-surface-inverse-deep"
              style={{
                position: "absolute",
                ...panel.style,
                ...(effect === "doors" ? DOOR_EDGE[panel.key] : undefined),
              }}
              initial={panel.initial}
              animate={closingward ? panel.close : panel.open}
              transition={{
                duration: phase === "navigating" ? 0 : closingward ? closeDuration : openDuration,
                ease: EASE,
              }}
              onAnimationComplete={handlePanelDone}
            />
          ))}
        </div>
      )}
    </CurtainRouteContext.Provider>
  )
}

export type CurtainNavLinkProps = ComponentProps<typeof Link>

/**
 * Drop-in for next/link in the header nav. Renders a real <a> via next/link
 * (href, prefetch, cmd-click, copy-link all intact); a plain left-click on an
 * internal, hash-free href goes through the curtain instead.
 */
export function CurtainNavLink({ href, onClick, ...rest }: CurtainNavLinkProps) {
  const curtain = React.useContext(CurtainRouteContext)
  const pathname = usePathname()

  const hrefString = typeof href === "string" ? href : (href.pathname ?? "")
  const curtainable =
    curtain !== null && hrefString.startsWith("/") && !hrefString.includes("#")

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (!curtainable || event.defaultPrevented) return
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return
        event.preventDefault()
        if (hrefString === pathname) return
        curtain.go(hrefString)
      }}
      {...rest}
    />
  )
}
