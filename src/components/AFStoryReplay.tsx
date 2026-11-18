"use client"

import { useEffect, useRef } from "react"
import { O_STORY_REPLAY } from "@/lib/content"

/**
 * The hero story's one bit of script (AFStory). The first play is CSS alone: .is-playing on the hero
 * and .is-building on the mark ship in the server HTML. This adds four things:
 *   - Replay: restarts the build and the story from the top (on a phone it scrolls the page to the
 *     very top first, so the wordmark is not hidden under the sticky header).
 *   - Below 1200 px the Builder sits under the wordmark and plays on the hero clock. If the reader
 *     has already scrolled it out of view when the lift is due, it waits just before the lift
 *     (.is-held) and plays as soon as it is back in view.
 *   - Below 1200 px the Consultant sits after the facts. The moment any of it is in view, the diamond
 *     (.tk-dtrav) lifts out of the cut it sits in (the O, or the Builder once that has played),
 *     drops to the top of the Consultant's rule, rides down it and grows into the Consultant's box;
 *     the Consultant is then constructed on its own clock (.is-telling, o-story.css). html.io arms
 *     that wait; with no script it is never set and the Consultant shows its end state.
 * The button shows only when motion is allowed and the story has played (o-story.css).
 */
const LIFT = 3450 // ms on the hero clock: just before the O lifts (3.55 s)
const TRAVEL = 1000 // ms: the diamond's move; it lands at 920 ms on the Consultant's clock (LAND in gen_ostory.py)
const RIDE = 22 // px: the diamond's width while it rides down the rule

export function AFStoryReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const replay = useRef<() => void>(() => {})

  useEffect(() => {
    const hero = ref.current?.closest(".af-hero")
    const inner = hero?.querySelector<HTMLElement>(".af-hero-inner")
    const mark = hero?.querySelector(".af-build")
    const builder = hero?.querySelector(".tk-builder")
    const consult = hero?.querySelector<HTMLElement>(".tk-consult")
    const cut = hero?.querySelector(".tk-hex .tk-hole")
    const dm = consult?.querySelector(".tk-dm")
    const trav = hero?.querySelector<HTMLElement>(".tk-dtrav")
    if (!hero || !inner || !mark || !builder || !consult || !cut || !dm || !trav) return
    if (!("IntersectionObserver" in window)) return
    const narrow = window.matchMedia("(max-width: 1199px)")
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    const root = document.documentElement
    root.classList.add("io")
    let timer = 0
    let frame = 0
    let builderSeen = true
    let flight: Animation | null = null

    /* the hero clock's position, read from the O's own animation (CSS started it at first paint) */
    const clock = () => {
      const a = mark.querySelector(".o-ink")?.getAnimations?.()[0]
      const t = a?.currentTime
      return typeof t === "number" ? t : 0
    }
    const armHold = () => {
      window.clearTimeout(timer)
      const wait = LIFT - clock()
      if (wait < 0) return
      timer = window.setTimeout(() => {
        if (narrow.matches && !builderSeen) hero.classList.add("is-held")
      }, wait)
    }

    /* the Builder counts as seen when half of it is in view below the sticky header */
    const header = document.querySelector("header")
    const top = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().height : 0
    const bio = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1]
        builderSeen = e.isIntersecting && e.intersectionRatio >= 0.49
        if (builderSeen) hero.classList.remove("is-held")
      },
      { threshold: [0, 0.5], rootMargin: `-${Math.round(top)}px 0px 0px 0px` },
    )
    bio.observe(builder)

    /* the diamond's flight: a box (centre, width) in .af-hero-inner coordinates, as a transform of a
       100 px square (transform-origin 0 0) */
    const fly = () => {
      flight?.cancel()
      if (still.matches || typeof trav.animate !== "function") return
      const o = inner.getBoundingClientRect()
      const box = (r: DOMRect) => [r.left - o.left + r.width / 2, r.top - o.top + r.height / 2, r.width] as const
      const at = ([x, y, w]: readonly [number, number, number]) =>
        `translate(${(x - w / 2).toFixed(1)}px, ${(y - w / 2).toFixed(1)}px) scale(${(w / 100).toFixed(4)})`
      const c = consult.getBoundingClientRect()
      const from = box(cut.getBoundingClientRect())
      const to = box(dm.getBoundingClientRect())
      const rx = c.left - o.left + c.width / 2
      const ruleTop = c.top - o.top - 52 // the 40 px rule: .tk-consult::before, top -52px
      const ruleFoot = ruleTop + 40
      const lifted = [from[0], from[1] - 8, from[2]] as const
      flight = trav.animate(
        [
          { offset: 0, transform: at(from), opacity: 0, easing: "cubic-bezier(.3,0,.3,1)" },
          { offset: 0.16, transform: at(lifted), opacity: 1, easing: "cubic-bezier(.45,0,.2,1)" },
          { offset: 0.62, transform: at([rx, ruleTop, RIDE]), opacity: 1, easing: "linear" },
          { offset: 0.8, transform: at([rx, ruleFoot, RIDE]), opacity: 1, easing: "cubic-bezier(.45,0,.2,1)" },
          { offset: 0.92, transform: at(to), opacity: 1, easing: "linear" },
          { offset: 1, transform: at(to), opacity: 0 },
        ],
        { duration: TRAVEL, fill: "both" },
      )
    }

    let cio: IntersectionObserver | null = null
    const watchConsult = () => {
      cio?.disconnect()
      cio = new IntersectionObserver(
        (entries) => {
          if (!narrow.matches || !entries.some((e) => e.isIntersecting)) return
          cio?.disconnect()
          fly()
          consult.classList.add("is-telling")
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
      )
      cio.observe(consult)
    }
    watchConsult()
    armHold()

    replay.current = () => {
      window.clearTimeout(timer)
      window.cancelAnimationFrame(frame)
      cio?.disconnect()
      flight?.cancel()
      hero.classList.remove("is-held")
      consult.classList.remove("is-telling")
      hero.classList.remove("is-playing")
      mark.classList.remove("is-building")
      void (hero as HTMLElement).offsetWidth
      hero.classList.add("is-playing")
      mark.classList.add("is-building")
      armHold()
      if (!narrow.matches || window.scrollY <= 2) {
        watchConsult()
        return
      }
      /* on a phone the button sits at the foot of the hero, below the Consultant: go back to the very
         top (scrollIntoView would leave the wordmark under the sticky header), and wait for the page
         to get there before the Consultant listens again, so it is not set off on the way up */
      window.scrollTo({ top: 0, behavior: still.matches ? "auto" : "smooth" })
      const t0 = performance.now()
      const settle = () => {
        if (window.scrollY <= 2 || performance.now() - t0 > 1600) watchConsult()
        else frame = window.requestAnimationFrame(settle)
      }
      frame = window.requestAnimationFrame(settle)
    }
    return () => {
      window.clearTimeout(timer)
      window.cancelAnimationFrame(frame)
      flight?.cancel()
      bio.disconnect()
      cio?.disconnect()
      root.classList.remove("io")
    }
  }, [])

  return (
    <div className="af-after" ref={ref}>
      <button type="button" onClick={() => replay.current()}>
        {O_STORY_REPLAY}
      </button>
    </div>
  )
}
