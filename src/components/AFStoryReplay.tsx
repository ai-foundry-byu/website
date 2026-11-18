"use client"

import { useEffect, useRef } from "react"
import { O_STORY_REPLAY } from "@/lib/content"

/**
 * The hero story's one bit of script (AFStory). The desktop play is CSS alone: .is-playing on the
 * hero and .is-building on the mark ship in the server HTML. This adds:
 *   - Replay: on desktop it restarts the build and the story from the top (scrolling the page to the
 *     very top first, so the wordmark is not hidden under the sticky header). Below 1200 px it
 *     replays the section in place: the button sits right under it.
 *   - Below 1200 px the big O only builds, and the story is told by the section after the facts.
 *     When the Builder is in view the hexagon lifts out of the small mark's O (.tk-src.is-out), rides
 *     the 40 px rule down and grows into the Builder's box, which is drawn up on its own clock
 *     (.is-telling, o-story.css); once it is built the small O re-inks (.is-whole). A reader who
 *     lands past the small mark (its O under the sticky header) sees the hexagon enter by the top
 *     edge instead, or, with the Consultant in view as well, the Builder already built. When the
 *     Consultant's diagram is in view and the Builder is built, a solid diamond (.tk-dtrav) lifts out
 *     of the Builder's cut (or enters by the top edge when that cut is above the viewport), rides the
 *     Consultant's rule into its box and the Consultant is drawn up. A reader who arrives at the Consultant without having
 *     seen the Builder build (a fast scroll, a jump past it) gets the Builder finished at once, so the
 *     Consultant never waits on a diagram that is off screen. html.io arms the waits; with no
 *     script it is never set and both profiles show their end state.
 * The button shows only when motion is allowed and the story has played (o-story.css).
 */
const FLY = 820 // ms: a traveller's flight from its source into its profile's box
const BUILT = 2120 // ms from the hexagon's lift: the Builder's last label is seated (the sb- clock)
const TOLD = 1500 // ms from the diamond's landing: the Consultant is drawn up (the sc- clock)
const RIDE = 22 // px: a traveller's width while it rides down a rule
const RULE = 52 // px: each 40 px rule starts this far above its profile's box (.tk-box::before)
const EASE = "cubic-bezier(.45,0,.2,1)"

export function AFStoryReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const replay = useRef<() => void>(() => {})

  useEffect(() => {
    const hero = ref.current?.closest(".af-hero")
    const inner = hero?.querySelector<HTMLElement>(".af-hero-inner")
    const mark = hero?.querySelector(".af-build")
    const stage = hero?.querySelector(".tk-stage")
    const src = hero?.querySelector(".tk-src")
    const srcO = src?.querySelector(".tk-src-o path")
    const builder = hero?.querySelector<HTMLElement>(".tk-builder")
    const hex = builder?.querySelector<HTMLElement>(".tk-hex")
    const hole = builder?.querySelector(".tk-hole")
    const consult = hero?.querySelector<HTMLElement>(".tk-consult")
    const dm = consult?.querySelector(".tk-dm")
    const trav = hero?.querySelector<HTMLElement>(".tk-dtrav")
    if (!hero || !inner || !mark || !stage || !src || !srcO || !builder || !hex || !hole || !consult || !dm || !trav) return
    if (!("IntersectionObserver" in window)) return
    const narrow = window.matchMedia("(max-width: 1199px)")
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    const root = document.documentElement
    root.classList.add("io")
    /* 0: waiting, 1: the Builder is being built, 2: the Builder is built, 3: the Consultant is told */
    let phase = 0
    let consultSeen = false
    let timers: number[] = []
    let flights: Animation[] = []
    let frame = 0
    const later = (f: () => void, ms: number) => timers.push(window.setTimeout(f, ms))

    /* boxes (centre x, centre y, width) in .af-hero-inner coordinates, so a flight rides with the page */
    const header = document.querySelector("header")
    const top = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().height : 0
    const view = () => {
      const o = inner.getBoundingClientRect()
      const box = (r: DOMRect) => [r.left - o.left + r.width / 2, r.top - o.top + r.height / 2, r.width] as const
      const onScreen = (r: DOMRect) => r.width > 0 && r.top >= top && r.bottom <= window.innerHeight
      return { o, box, onScreen, vTop: top - o.top }
    }
    const visible = (el: Element, min = 0.3) => {
      const r = el.getBoundingClientRect()
      const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, top)
      return r.height > 0 && seen / r.height >= min
    }
    const canFly = () => !still.matches && typeof hex.animate === "function"
    /* the diamond traveller is a 100 px square (transform-origin 0 0) moved to a box */
    const at = ([x, y, w]: readonly [number, number, number]) =>
      `translate(${(x - w / 2).toFixed(1)}px, ${(y - w / 2).toFixed(1)}px) scale(${(w / 100).toFixed(4)})`

    const told = () => {
      hero.classList.add("is-told")
    }

    /* the hexagon: out of the small O, down the rule, into the Builder's box (its own box, moved).
       A reader already past the small mark (a jump, a fast flick: its O is under the sticky header or
       above the viewport) never sees that O, so the hexagon enters by the top edge instead; and when
       the Consultant is in view too, the Builder is finished at once so neither box waits empty. */
    const build = () => {
      if (phase) return
      phase = 1
      builder.classList.add("is-telling")
      if (canFly()) {
        const v = view()
        const sr = srcO.getBoundingClientRect()
        const fromEdge = !v.onScreen(sr)
        /* the Consultant's own trigger: 60% of its diagram in view */
        if (fromEdge && (consultSeen || visible(dm, 0.6))) return finish()
        const own = v.box(hex.getBoundingClientRect())
        const from = v.box(sr)
        const b = builder.getBoundingClientRect()
        const rx = b.left - v.o.left + b.width / 2
        const ruleTop = b.top - v.o.top - RULE
        const edge = [rx, v.vTop + RIDE, RIDE] as const
        /* the hexagon box is 2R x 1.732R: centre offsets move it, its width scales it */
        const go = ([x, y, w]: readonly [number, number, number]) =>
          `translate(${(x - own[0]).toFixed(1)}px, ${(y - own[1]).toFixed(1)}px) scale(${(w / own[2]).toFixed(4)})`
        const keys: Keyframe[] = fromEdge
          ? [
              { offset: 0, transform: go(edge), opacity: 0, easing: "linear" },
              { offset: 0.06, transform: go([rx, edge[1] + 6, RIDE]), opacity: 1, easing: EASE },
              { offset: 0.42, transform: go([rx, Math.max(ruleTop, edge[1] + 6), RIDE]), opacity: 1, easing: "linear" },
              { offset: 0.7, transform: go([rx, Math.max(ruleTop + 40, edge[1] + 6), RIDE]), opacity: 1, easing: EASE },
            ]
          : [
              { offset: 0, transform: go(from), opacity: 1, easing: "cubic-bezier(.3,0,.3,1)" },
              { offset: 0.16, transform: go([from[0], from[1] - 6, from[2]]), opacity: 1, easing: EASE },
              { offset: 0.42, transform: go([rx, ruleTop, RIDE]), opacity: 1, easing: "linear" },
              { offset: 0.7, transform: go([rx, ruleTop + 40, RIDE]), opacity: 1, easing: EASE },
            ]
        src.classList.remove("is-whole")
        src.classList.add("is-out")
        flights.push(hex.animate([...keys, { offset: 1, transform: "none", opacity: 1 }], { duration: FLY, fill: "backwards" }))
      }
      later(
        () => {
          if (phase !== 1) return
          phase = 2
          whole()
          if (consultSeen && narrow.matches) arrive()
        },
        canFly() ? BUILT : 0,
      )
    }
    /* the small O re-inks once the hexagon has become the Builder */
    const whole = () => {
      if (!src.classList.contains("is-out")) return
      src.classList.remove("is-out")
      if (canFly()) src.classList.add("is-whole")
    }
    /* the Builder, finished at once (the reader is past it) */
    const finish = () => {
      if (!phase) {
        phase = 1
        builder.classList.add("is-telling")
      }
      if (phase !== 1) return
      flights.forEach((a) => a.finish())
      builder.getAnimations?.({ subtree: true }).forEach((a) => a.finish())
      phase = 2
      whole()
    }
    /* the Consultant is in view while the Builder is still being built: wait for it while the reader
       can see it, and finish it the moment they cannot (an observer's report can lag a fast scroll) */
    const wait = () => {
      window.cancelAnimationFrame(frame)
      const tick = () => {
        if (phase !== 1) return
        if (!visible(builder)) {
          finish()
          return arrive()
        }
        frame = window.requestAnimationFrame(tick)
      }
      frame = window.requestAnimationFrame(tick)
    }

    /* the diamond: out of the Builder's cut, down the Consultant's rule, into its box */
    const tell = () => {
      consult.classList.add("is-telling")
      later(told, canFly() ? TOLD : 0)
    }
    const arrive = () => {
      if (phase !== 2) return
      phase = 3
      if (!canFly()) return tell()
      const v = view()
      const c = consult.getBoundingClientRect()
      const to = v.box(dm.getBoundingClientRect())
      const rx = c.left - v.o.left + c.width / 2
      const ruleTop = c.top - v.o.top - RULE
      const ruleFoot = ruleTop + 40
      const hr = hole.getBoundingClientRect()
      const cut = v.box(hr)
      const edge = [rx, v.vTop + RIDE, RIDE] as const
      /* from the top edge when the Builder's cut is not on screen, else straight out of it */
      const fromEdge = !v.onScreen(hr)
      const keys: Keyframe[] = fromEdge
        ? [
            { offset: 0, transform: at(edge), opacity: 0, easing: "linear" },
            { offset: 0.06, transform: at([rx, edge[1] + 6, RIDE]), opacity: 1, easing: EASE },
            { offset: 0.6, transform: at([rx, Math.max(ruleTop, edge[1] + 6), RIDE]), opacity: 1, easing: "linear" },
          ]
        : [
            { offset: 0, transform: at(cut), opacity: 0, easing: "cubic-bezier(.3,0,.3,1)" },
            { offset: 0.16, transform: at([cut[0], cut[1] - 6, cut[2]]), opacity: 1, easing: EASE },
            { offset: 0.42, transform: at([rx, ruleTop, RIDE]), opacity: 1, easing: "linear" },
          ]
      const dist = fromEdge ? Math.max(0, ruleTop - edge[1]) : 0
      const duration = fromEdge ? Math.min(1200, 480 + dist * 0.6) : FLY
      flights.push(
        trav.animate(
          [
            ...keys,
            { offset: fromEdge ? 0.78 : 0.7, transform: at([rx, ruleFoot, RIDE]), opacity: 1, easing: EASE },
            { offset: 0.94, transform: at(to), opacity: 1, easing: "linear" },
            { offset: 1, transform: at(to), opacity: 0 },
          ],
          { duration, fill: "both" },
        ),
      )
      later(tell, Math.round(duration * 0.94) - 20)
    }

    /* the triggers: the Builder when 30% of it is in view below the sticky header, the Consultant when
       60% of its diagram is; observers fire for a slow scroll, a fast one and a jump alike */
    let bio: IntersectionObserver | null = null
    let cio: IntersectionObserver | null = null
    const watch = () => {
      bio?.disconnect()
      cio?.disconnect()
      bio = new IntersectionObserver(
        (entries) => {
          if (!narrow.matches || !entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.29)) return
          bio?.disconnect()
          build()
        },
        { threshold: [0, 0.3], rootMargin: `-${Math.round(top)}px 0px 0px 0px` },
      )
      bio.observe(builder)
      cio = new IntersectionObserver(
        (entries) => {
          if (!narrow.matches || !entries.some((e) => e.isIntersecting)) return
          cio?.disconnect()
          consultSeen = true
          /* both in view at once (a tall phone, a jump): the observers can report in either order, so
             build the Builder while it is on screen and finish it only when it is not */
          if (phase === 0) {
            if (visible(builder)) build()
            else finish()
          }
          if (phase === 1) return wait()
          arrive()
        },
        { threshold: 0.6 },
      )
      cio.observe(dm)
    }
    watch()

    const reset = () => {
      window.cancelAnimationFrame(frame)
      timers.forEach((t) => window.clearTimeout(t))
      timers = []
      flights.forEach((a) => a.cancel())
      flights = []
      phase = 0
      consultSeen = false
      hero.classList.remove("is-told")
      src.classList.remove("is-out", "is-whole")
      builder.classList.remove("is-telling")
      consult.classList.remove("is-telling")
    }
    replay.current = () => {
      if (narrow.matches) {
        /* the section replays from its head: bring the small mark up under the sticky header, and wait
           for the page to get there before the profiles listen again, so the Consultant is not set off
           on the way up */
        reset()
        bio?.disconnect()
        cio?.disconnect()
        const y = Math.max(0, stage.getBoundingClientRect().top + window.scrollY - top - 16)
        window.scrollTo({ top: y, behavior: still.matches ? "auto" : "smooth" })
        const t0 = performance.now()
        const settle = () => {
          if (Math.abs(window.scrollY - y) <= 2 || performance.now() - t0 > 1600) watch()
          else frame = window.requestAnimationFrame(settle)
        }
        frame = window.requestAnimationFrame(settle)
        return
      }
      hero.classList.remove("is-playing")
      mark.classList.remove("is-building")
      void (hero as HTMLElement).offsetWidth
      hero.classList.add("is-playing")
      mark.classList.add("is-building")
      /* the button sits below the fold: go back to the very top (scrollIntoView would leave the
         wordmark under the sticky header) */
      if (window.scrollY > 2) window.scrollTo({ top: 0, behavior: still.matches ? "auto" : "smooth" })
    }
    return () => {
      reset()
      bio?.disconnect()
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
