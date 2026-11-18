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
 *   - Below 1200 px, once the Builder has landed (DEPART on the hero clock) and while the O is on
 *     screen, a solid diamond (.tk-dtrav) lifts out of the O's cut and drops out by the bottom of the
 *     viewport, toward the Consultant that sits after the facts.
 *   - When the Consultant's diagram comes into view, the diamond flies in: from the top edge if the
 *     reader saw it leave, else straight out of the O of the small mark that heads the stage. It
 *     passes that O, rides down the 40 px rule and grows into the Consultant's box; when it lands the
 *     Consultant is constructed on its own clock (.is-telling, o-story.css). The caption, the rule and
 *     the small mark show from the first frame, so the stage is never empty. html.io arms the wait;
 *     with no script it is never set and the Consultant shows its end state.
 * The button shows only when motion is allowed and the story has played (o-story.css).
 */
const LIFT = 3450 // ms on the hero clock: just before the O lifts (3.55 s)
const DEPART = 5450 // ms on the hero clock: the Builder's last label is seated, the O is whole again
const RIDE = 22 // px: the diamond's width while it rides down the rule
const EASE = "cubic-bezier(.45,0,.2,1)"

export function AFStoryReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const replay = useRef<() => void>(() => {})

  useEffect(() => {
    const hero = ref.current?.closest(".af-hero")
    const inner = hero?.querySelector<HTMLElement>(".af-hero-inner")
    const mark = hero?.querySelector(".af-build")
    const builder = hero?.querySelector(".tk-builder")
    const consult = hero?.querySelector<HTMLElement>(".tk-consult")
    const cut = hero?.querySelector(".af-build .o-ghost path:last-child") // the big O's cut (the ghost carries the locked CUT)
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

    /* the diamond's flights: a box (centre, width) in .af-hero-inner coordinates, as a transform of a
       100 px square (transform-origin 0 0) */
    const src = hero.querySelector(".tk-src-cut")
    let left = false // the reader saw the diamond leave the big O
    let told = false
    let landing = 0
    const at = ([x, y, w]: readonly [number, number, number]) =>
      `translate(${(x - w / 2).toFixed(1)}px, ${(y - w / 2).toFixed(1)}px) scale(${(w / 100).toFixed(4)})`
    const view = () => {
      const o = inner.getBoundingClientRect()
      const box = (r: DOMRect) => [r.left - o.left + r.width / 2, r.top - o.top + r.height / 2, r.width] as const
      const onScreen = (r: DOMRect) => r.top >= top && r.bottom <= window.innerHeight
      return { o, box, onScreen, vTop: top - o.top, vBottom: window.innerHeight - o.top }
    }
    const canFly = () => !still.matches && typeof trav.animate === "function"

    /* the departure: out of the big O's cut, down and out by the bottom of the viewport */
    const depart = () => {
      if (told || left || !narrow.matches || !canFly()) return
      const v = view()
      const r = cut.getBoundingClientRect()
      if (!onO(v, r)) return
      left = true
      const from = v.box(r)
      const cx = v.o.width / 2
      flight?.cancel()
      flight = trav.animate(
        [
          { offset: 0, transform: at(from), opacity: 0, easing: "cubic-bezier(.3,0,.3,1)" },
          { offset: 0.2, transform: at([from[0], from[1] - 8, from[2]]), opacity: 1, easing: "cubic-bezier(.5,0,.8,.4)" },
          { offset: 1, transform: at([cx, v.vBottom + RIDE, RIDE]), opacity: 1 },
        ],
        { duration: 1100, fill: "none" },
      )
    }
    /* the O's cut counts as on screen when it is fully below the sticky header */
    const onO = (v: ReturnType<typeof view>, r: DOMRect) => r.width > 0 && v.onScreen(r)

    /* the arrival: into the Consultant, which is built the moment it lands */
    const tell = () => {
      consult.classList.add("is-telling")
    }
    const arrive = () => {
      if (told) return
      told = true
      flight?.cancel()
      if (!canFly()) return tell()
      const v = view()
      const c = consult.getBoundingClientRect()
      const to = v.box(dm.getBoundingClientRect())
      const rx = c.left - v.o.left + c.width / 2
      const ruleTop = c.top - v.o.top - 52 // the 40 px rule: .tk-consult::before, top -52px
      const ruleFoot = ruleTop + 40
      const sr = src?.getBoundingClientRect()
      const mini = sr && sr.width > 0 ? v.box(sr) : null
      const miniOn = !!sr && !!mini && v.onScreen(sr)
      const edge = [rx, v.vTop + RIDE, RIDE] as const
      /* from the top edge (the reader saw it leave, or the small mark is above the viewport), else out of the small O */
      const fromEdge = left || !miniOn
      const keys: Keyframe[] = fromEdge
        ? [
            { offset: 0, transform: at(edge), opacity: 0, easing: "linear" },
            { offset: 0.06, transform: at([rx, edge[1] + 6, RIDE]), opacity: 1, easing: EASE },
            { offset: 0.6, transform: at([rx, Math.max(ruleTop, edge[1] + 6), RIDE]), opacity: 1, easing: "linear" },
          ]
        : [
            { offset: 0, transform: at(mini!), opacity: 0, easing: "cubic-bezier(.3,0,.3,1)" },
            { offset: 0.16, transform: at([mini![0], mini![1] - 6, mini![2]]), opacity: 1, easing: EASE },
            { offset: 0.42, transform: at([rx, ruleTop, RIDE]), opacity: 1, easing: "linear" },
          ]
      const dist = fromEdge ? Math.max(0, ruleTop - edge[1]) : 0
      const duration = fromEdge ? Math.min(1200, 760 + dist * 0.6) : 820
      flight = trav.animate(
        [
          ...keys,
          { offset: fromEdge ? 0.78 : 0.7, transform: at([rx, ruleFoot, RIDE]), opacity: 1, easing: EASE },
          { offset: 0.94, transform: at(to), opacity: 1, easing: "linear" },
          { offset: 1, transform: at(to), opacity: 0 },
        ],
        { duration, fill: "both" },
      )
      window.clearTimeout(landing)
      landing = window.setTimeout(tell, Math.round(duration * 0.94) - 20)
    }

    /* the departure is due once the Builder has landed on the hero clock (which waits while held) */
    const watchDepart = () => {
      window.cancelAnimationFrame(frame)
      const tick = () => {
        if (told || left) return
        if (clock() >= DEPART) return depart()
        frame = window.requestAnimationFrame(tick)
      }
      frame = window.requestAnimationFrame(tick)
    }

    let cio: IntersectionObserver | null = null
    const watchConsult = () => {
      cio?.disconnect()
      cio = new IntersectionObserver(
        (entries) => {
          if (!narrow.matches || !entries.some((e) => e.isIntersecting)) return
          cio?.disconnect()
          arrive()
        },
        { threshold: 0.6 },
      )
      cio.observe(dm)
    }
    watchConsult()
    watchDepart()
    armHold()

    replay.current = () => {
      window.clearTimeout(timer)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(landing)
      cio?.disconnect()
      flight?.cancel()
      told = false
      left = false
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
        watchDepart()
        return
      }
      /* on a phone the button sits at the foot of the hero, below the Consultant: go back to the very
         top (scrollIntoView would leave the wordmark under the sticky header), and wait for the page
         to get there before the Consultant listens again, so it is not set off on the way up */
      window.scrollTo({ top: 0, behavior: still.matches ? "auto" : "smooth" })
      const t0 = performance.now()
      const settle = () => {
        if (window.scrollY <= 2 || performance.now() - t0 > 1600) {
          watchConsult()
          watchDepart()
        } else frame = window.requestAnimationFrame(settle)
      }
      frame = window.requestAnimationFrame(settle)
    }
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(landing)
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
