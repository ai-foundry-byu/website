"use client"

/**
 * PageCurtain — curtain-style page transitions (fade / wipe / doors / iris).
 *
 * Rebuilt from scratch after motion.dev's `@motion/page-curtain` turned out to
 * be Motion+ paywalled (their registry 401s without a paid token, and the
 * component depends on the private `motion-plus` npm package). This version
 * needs only `react` and the open-source `motion` package this site already
 * ships for MotionCta — no motion.dev account, registry, or network access.
 *
 * EXPERIMENT — scope and tension, read before promoting to a public page:
 *
 *   This is a client component with state, and this site deliberately keeps
 *   hydration to tiny leaves (see MotionCta's header) with every route
 *   prerendered static. A section-level widget (tabbed showcase, program
 *   switcher) fits that budget: one leaf hydrates. Wiring it into real
 *   *route* navigation would drag whole pages across the client boundary and
 *   break the static model — that's a rearchitecture, not a drop-in, and it
 *   should not happen casually. Delete this file alongside /lab/page-curtain
 *   if the experiment dies.
 *
 * The controller (`usePageCurtain`) runs a three-phase machine per navigation:
 * idle → closing (curtain covers the stage) → swap content → opening → idle.
 * Navigating forward in `pages` order wipes one way, backward the other.
 * Reduced motion is handled in JS, not CSS: globals.css only neutralises CSS
 * animation, and these transforms are JavaScript-driven, so the hook checks
 * useReducedMotion() itself and swaps pages instantly with no curtain.
 *
 * All structural CSS is inline; the curtain's colour comes in via
 * `curtainClassName` (use a semantic token class, e.g. "bg-surface-inverse").
 * State updaters are deliberately pure — StrictMode double-invokes them, and
 * an earlier draft that mutated a ref inside setState swapped pages twice.
 */

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import type { TargetAndTransition } from "motion/react"
import type { CSSProperties, ReactNode } from "react"

export type CurtainEffect = "fade" | "wipe" | "doors" | "iris"
export type CurtainDirection = 1 | -1
type CurtainPhase = "idle" | "closing" | "opening"

export const EASE = [0.76, 0, 0.24, 1] as const

export interface PageCurtainOptions<T extends string> {
  /** Ordered list of page keys; order determines transition direction. */
  pages: readonly T[]
  /** Page shown on mount. Defaults to the first entry of `pages`. */
  initialPage?: T
  /** Seconds for the curtain to close over the old page. Default 0.5 */
  closeDuration?: number
  /** Seconds for the curtain to open onto the new page. Default 0.5 */
  openDuration?: number
  /** Called after the visible page changes (fires behind the closed curtain). */
  onPageChange?: (page: T) => void
}

export interface PageCurtainController<T extends string> {
  page: T
  pages: readonly T[]
  /** True while a curtain transition is running. */
  isPending: boolean
  /** 1 when navigating forward in `pages` order, -1 backward. */
  direction: CurtainDirection
  /** Navigate to a page. Retargets if called again while the curtain closes. */
  go: (page: T) => void
  /* internal — consumed by PageCurtainStage */
  _phase: CurtainPhase
  _durations: { close: number; open: number }
  _onPhaseDone: () => void
}

interface CurtainState<T extends string> {
  page: T
  /** Pending destination while the curtain is closing. */
  target: T | null
  phase: CurtainPhase
  direction: CurtainDirection
}

export function usePageCurtain<T extends string>(
  options: PageCurtainOptions<T>,
): PageCurtainController<T> {
  const { pages, initialPage, closeDuration = 0.5, openDuration = 0.5, onPageChange } = options
  const reduced = useReducedMotion()
  const [state, setState] = React.useState<CurtainState<T>>({
    page: initialPage ?? pages[0],
    target: null,
    phase: "idle",
    direction: 1,
  })

  const onPageChangeRef = React.useRef(onPageChange)
  React.useEffect(() => {
    onPageChangeRef.current = onPageChange
  }, [onPageChange])
  const lastNotified = React.useRef(state.page)
  React.useEffect(() => {
    if (state.page !== lastNotified.current) {
      lastNotified.current = state.page
      onPageChangeRef.current?.(state.page)
    }
  }, [state.page])

  const go = React.useCallback(
    (next: T) => {
      if (!pages.includes(next)) return
      setState((s) => {
        if (s.phase === "opening") return s // too late to retarget this run
        if (s.phase === "closing") {
          // Curtain still closing — silently retarget the pending swap.
          return { ...s, target: next }
        }
        if (next === s.page) return s
        if (reduced) return { ...s, page: next } // reduced motion: instant swap
        const direction: CurtainDirection =
          pages.indexOf(next) >= pages.indexOf(s.page) ? 1 : -1
        return { ...s, direction, phase: "closing", target: next }
      })
    },
    [pages, reduced],
  )

  const _onPhaseDone = React.useCallback(() => {
    setState((s) => {
      if (s.phase === "closing") {
        return { ...s, page: s.target ?? s.page, target: null, phase: "opening" }
      }
      if (s.phase === "opening") return { ...s, phase: "idle" }
      return s
    })
  }, [])

  return {
    page: state.page,
    pages,
    isPending: state.phase !== "idle",
    direction: state.direction,
    go,
    _phase: state.phase,
    _durations: { close: closeDuration, open: openDuration },
    _onPhaseDone,
  }
}

export interface PanelSpec {
  key: string
  style: CSSProperties
  initial: TargetAndTransition
  close: TargetAndTransition
  open: TargetAndTransition
}

export function curtainPanels(effect: CurtainEffect, direction: CurtainDirection): PanelSpec[] {
  switch (effect) {
    case "fade":
      return [
        {
          key: "fade",
          style: { inset: 0 },
          initial: { opacity: 0 },
          close: { opacity: 1 },
          open: { opacity: 0 },
        },
      ]
    case "wipe": {
      const enter = direction === 1 ? "-101%" : "101%"
      const exit = direction === 1 ? "101%" : "-101%"
      return [
        {
          key: "wipe",
          style: { inset: 0 },
          initial: { x: enter },
          close: { x: "0%" },
          open: { x: exit },
        },
      ]
    }
    case "doors":
      return [
        {
          key: "door-left",
          // 51% width: the doors overlap slightly so no seam shows at centre
          style: { top: 0, bottom: 0, left: 0, width: "51%" },
          initial: { x: "-102%" },
          close: { x: "0%" },
          open: { x: "-102%" },
        },
        {
          key: "door-right",
          style: { top: 0, bottom: 0, right: 0, width: "51%" },
          initial: { x: "102%" },
          close: { x: "0%" },
          open: { x: "102%" },
        },
      ]
    case "iris":
      return [
        {
          key: "iris",
          style: { inset: 0 },
          initial: { clipPath: "circle(0% at 50% 50%)" },
          close: { clipPath: "circle(75% at 50% 50%)" },
          open: { clipPath: "circle(0% at 50% 50%)" },
        },
      ]
  }
}

export interface PageCurtainStageProps<T extends string> {
  curtain: PageCurtainController<T>
  /** Which curtain animation to use. Default "doors". */
  effect?: CurtainEffect
  /**
   * Class for the curtain panels — pass a semantic surface token, e.g.
   * "bg-surface-inverse". Without it, panels fall back to a near-black
   * inline background so the component works with no CSS setup at all.
   */
  curtainClassName?: string
  className?: string
  style?: CSSProperties
  /** Static children, or a render function receiving the current page key. */
  children: ReactNode | ((page: T) => ReactNode)
}

export function PageCurtainStage<T extends string>({
  curtain,
  effect = "doors",
  curtainClassName,
  className,
  style,
  children,
}: PageCurtainStageProps<T>) {
  const phase = curtain._phase
  const active = phase !== "idle"

  const panels = React.useMemo(
    () => curtainPanels(effect, curtain.direction),
    [effect, curtain.direction],
  )

  // A phase completes when every panel (doors has two) finishes animating.
  const doneCount = React.useRef(0)
  React.useEffect(() => {
    doneCount.current = 0
  }, [phase])
  const handlePanelDone = () => {
    doneCount.current += 1
    if (doneCount.current >= panels.length) curtain._onPhaseDone()
  }

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      aria-busy={curtain.isPending || undefined}
    >
      {typeof children === "function" ? children(curtain.page) : children}
      {active && (
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, zIndex: 50, overflow: "hidden" }}
        >
          {panels.map((panel) => (
            <motion.div
              key={panel.key}
              className={curtainClassName}
              style={{
                position: "absolute",
                ...(curtainClassName ? {} : { background: "#16161a" }),
                ...panel.style,
              }}
              initial={panel.initial}
              animate={phase === "closing" ? panel.close : panel.open}
              transition={{
                duration:
                  phase === "closing"
                    ? curtain._durations.close
                    : curtain._durations.open,
                ease: EASE,
              }}
              onAnimationComplete={handlePanelDone}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export interface PageCurtainTabsProps<T extends string> {
  curtain: PageCurtainController<T>
  /** Optional display labels; defaults to the page keys themselves. */
  labels?: Partial<Record<T, ReactNode>>
  className?: string
  tabClassName?: string
  activeTabClassName?: string
}

export function PageCurtainTabs<T extends string>({
  curtain,
  labels,
  className,
  tabClassName,
  activeTabClassName,
}: PageCurtainTabsProps<T>) {
  return (
    <nav className={className} aria-label="Page navigation">
      {curtain.pages.map((page) => {
        const isActive = curtain.page === page
        return (
          <button
            key={page}
            type="button"
            onClick={() => curtain.go(page)}
            aria-current={isActive ? "page" : undefined}
            className={
              [tabClassName, isActive ? activeTabClassName : undefined]
                .filter(Boolean)
                .join(" ") || undefined
            }
          >
            {labels?.[page] ?? page}
          </button>
        )
      })}
    </nav>
  )
}
