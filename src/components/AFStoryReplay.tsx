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
 *     lands past the small mark (its O under the sticky header) sees the hexagon come in just under
 *     the Builder's caption instead, or, with the Consultant in view as well, the Builder already
 *     built. When the Consultant's diagram is in view and the Builder is built, a solid diamond
 *     (.tk-dtrav) lifts out of the Builder's cut, rides the Consultant's rule into its box and the
 *     Consultant is drawn up; when that cut is not on screen it comes in just under the Consultant's
 *     caption, never parked on it. A reader who arrives at the Consultant without having seen the
 *     Builder build (a fast scroll, a jump past it) gets the Builder finished at once, so the
 *     Consultant never waits on a diagram that is off screen, mostly under the header, or whose
 *     caption is under the header. Each
 *     flight is measured afresh on every frame, so one set off mid-scroll still rides the page as it
 *     settles. html.io arms the waits; with no script it is never set and both profiles show their
 *     end state.
 * The button shows only when motion is allowed and the story has played (o-story.css).
 */
const FLY = 820 // ms: a traveller's flight from its source into its profile's box
const BUILT = 2120 // ms from the hexagon's lift: the Builder's last label is seated (the sb- clock)
const TOLD = 1500 // ms from the diamond's landing: the Consultant is drawn up (the sc- clock)
const RIDE = 22 // px: a traveller's width while it rides down a rule
const RULE = 52 // px: each 40 px rule starts this far above its profile's box (.tk-box::before)
const DIVE = 360 // ms: a traveller whose way the page has moved under the sticky header goes straight to its landing in this time
/* the Consultant waits on a Builder still being built only while this share of it is in view */
const KEEP = 0.75

type Pt = readonly [number, number, number] // centre x, centre y, width (viewport px)
type Leg = { at: number; to: () => Pt; opacity: number; ease: (t: number) => number; free?: boolean }

/* a CSS cubic-bezier timing function (solved for x by bisection) */
const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const c = (a: number, b: number, u: number) => 3 * (1 - u) * (1 - u) * u * a + 3 * (1 - u) * u * u * b + u * u * u
  return (t: number) => {
    if (t <= 0 || t >= 1) return t <= 0 ? 0 : 1
    let lo = 0
    let hi = 1
    let u = t
    for (let i = 0; i < 24; i++) {
      u = (lo + hi) / 2
      if (c(x1, x2, u) < t) lo = u
      else hi = u
    }
    return c(y1, y2, u)
  }
}
const linear = (t: number) => t
const ease = bezier(0.45, 0, 0.2, 1)
const lift = bezier(0.3, 0, 0.3, 1)

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
    let flights: { finish: () => void; cancel: () => void }[] = []
    let frame = 0
    const later = (f: () => void, ms: number) => timers.push(window.setTimeout(f, ms))

    /* every point of a flight is measured on each frame, in viewport coordinates, so a flight that
       starts while the page is still moving (a flick, a smooth jump) follows the page and the sticky
       header as they really are, not as they were when the observer fired */
    const header = document.querySelector("header")
    const top = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().height : 0
    const box = (r: DOMRect): Pt => [r.left + r.width / 2, r.top + r.height / 2, r.width]
    const onScreen = (r: DOMRect) => r.width > 0 && r.top >= top && r.bottom <= window.innerHeight
    const visible = (el: Element, min = 0.3) => {
      const r = el.getBoundingClientRect()
      const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, top)
      return r.height > 0 && seen / r.height >= min
    }
    /* the share of the whole Builder (caption, diagram and labels) in view under the sticky header */
    const cap = builder.querySelector(".tk-cap")
    const shown = () => {
      const r = builder.getBoundingClientRect()
      let t = r.top
      let b = r.bottom
      builder.querySelectorAll(".tk-lab").forEach((l) => {
        const q = l.getBoundingClientRect()
        t = Math.min(t, q.top)
        b = Math.max(b, q.bottom)
      })
      const h = b - t
      return h > 0 ? (Math.min(b, window.innerHeight) - Math.max(t, top)) / h : 0
    }
    /* the Consultant waits on the Builder only while the reader can read it: its caption (its name)
       clear of the sticky header and most of it in view */
    const keep = () => (!cap || cap.getBoundingClientRect().top >= top - 2) && shown() >= KEEP
    const canFly = () => !still.matches
    const ruleOf = (el: Element) => {
      const r = el.getBoundingClientRect()
      return [r.left + r.width / 2, r.top - RULE] as const
    }
    const edgeY = () => top + RIDE
    /* a traveller that cannot leave its source on screen comes in on the axis just under its
       profile's caption (and never higher than the header's edge), so it is never parked on the
       caption's words while the page settles */
    const under = (el: Element): Pt => {
      const c = el.querySelector(".tk-cap")
      const b = c ? c.getBoundingClientRect().bottom : el.getBoundingClientRect().top
      return [ruleOf(el)[0], Math.max(edgeY(), b + RIDE / 2 + 6), RIDE]
    }
    const settle = (p: Pt): Pt => [p[0], p[1] + 6, p[2]]

    /* one flight: legs of live points, eased like keyframes; every point but the landing (free) is
       held below the sticky header, so the traveller is never hidden under it on its way. When the
       page moves its way under the header after it set off (a flick that goes on), it is not held
       there, where a caption scrolling up would run under it and it would sit on the words: it goes
       straight to its landing instead, on the same clock, so the landing and the drawing that
       follows keep their time */
    const fly = (legs: Leg[], duration: number, place: (p: Pt, opacity: number) => void, done: () => void) => {
      const t0 = performance.now()
      let id = 0
      let live = true
      let path = legs
      let dived = false
      let last: Pt | null = null
      let lastOp = 1
      const hold = (l: Leg): Pt => {
        const p = l.to()
        return l.free ? p : [p[0], Math.max(p[1], top + p[2] / 2), p[2]]
      }
      const held = (l: Leg) => {
        if (l.free) return false
        const p = l.to()
        return p[1] < top + p[2] / 2 - 0.5
      }
      const end = () => {
        if (!live) return
        live = false
        window.cancelAnimationFrame(id)
        done()
      }
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / duration)
        let i = 0
        while (i < path.length - 2 && k > path[i + 1].at) i++
        let a = path[i]
        let b = path[i + 1]
        const j = path.findIndex((l) => l.free)
        if (!dived && j > i && (held(a) || held(b))) {
          dived = true
          const from = last ?? hold(a)
          const land = path[j]
          const at = Math.min(land.at, k + DIVE / duration)
          path = [{ at: k, to: () => from, opacity: lastOp, ease: ease }, ...(at < land.at ? [{ ...land, at }] : []), ...path.slice(j)]
          i = 0
          a = path[0]
          b = path[1]
        }
        const e = a.ease(Math.min(1, Math.max(0, (k - a.at) / (b.at - a.at || 1))))
        const pa = hold(a)
        const pb = hold(b)
        last = [pa[0] + (pb[0] - pa[0]) * e, pa[1] + (pb[1] - pa[1]) * e, pa[2] + (pb[2] - pa[2]) * e]
        lastOp = a.opacity + (b.opacity - a.opacity) * e
        place(last, lastOp)
        if (k < 1) id = window.requestAnimationFrame(step)
        else end()
      }
      step()
      const f = { finish: end, cancel: end }
      flights.push(f)
      return f
    }

    const told = () => {
      hero.classList.add("is-told")
    }

    /* the hexagon: out of the small O, down the rule, into the Builder's box (its own box, moved).
       A reader already past the small mark (a jump, a fast flick: its O is under the sticky header or
       above the viewport) never sees that O, so the hexagon comes in under the caption instead; when the
       Consultant is in view too it waits for the Builder (wait), so the reader still sees both build. */
    const build = () => {
      if (phase) return
      phase = 1
      builder.classList.add("is-telling")
      if (canFly()) {
        hex.style.transform = ""
        const o0 = inner.getBoundingClientRect()
        const h0 = box(hex.getBoundingClientRect())
        /* the hexagon's own box, in .af-hero-inner coordinates: it moves with the page */
        const own = [h0[0] - o0.left, h0[1] - o0.top, h0[2]] as const
        const ownAt = (): Pt => {
          const o = inner.getBoundingClientRect()
          return [o.left + own[0], o.top + own[1], own[2]]
        }
        const fromEdge = !onScreen(srcO.getBoundingClientRect())
        const from = () => box(srcO.getBoundingClientRect())
        const rule = (dy: number): Pt => {
          const [x, y] = ruleOf(builder)
          return [x, y + dy, RIDE]
        }
        const legs: Leg[] = fromEdge
          ? [
              { at: 0, to: () => under(builder), opacity: 0, ease: linear },
              { at: 0.12, to: () => settle(under(builder)), opacity: 1, ease: ease },
            ]
          : [
              { at: 0, to: from, opacity: 1, ease: lift },
              { at: 0.16, to: () => { const f = from(); return [f[0], f[1] - 6, f[2]] }, opacity: 1, ease: ease },
              { at: 0.42, to: () => rule(0), opacity: 1, ease: linear },
              { at: 0.7, to: () => rule(40), opacity: 1, ease: ease },
            ]
        src.classList.remove("is-whole")
        src.classList.add("is-out")
        /* the hexagon box is 2R x 1.732R: centre offsets move it, its width scales it */
        fly(
          [...legs, { at: 1, to: ownAt, opacity: 1, ease: linear, free: true }],
          FLY,
          (p, op) => {
            const [x, y, w] = ownAt()
            hex.style.transform = `translate(${(p[0] - x).toFixed(1)}px, ${(p[1] - y).toFixed(1)}px) scale(${(p[2] / w).toFixed(4)})`
            hex.style.opacity = op < 1 ? op.toFixed(3) : ""
          },
          () => {
            hex.style.transform = ""
            hex.style.opacity = ""
          },
        )
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
       can read it, and finish it the moment its caption or most of it is under the header or off
       screen (a flick that stops between the two must not leave the Consultant empty behind a
       half-hidden Builder) */
    const wait = () => {
      window.cancelAnimationFrame(frame)
      const tick = () => {
        if (phase !== 1) return
        if (!keep()) {
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
      const to = () => box(dm.getBoundingClientRect())
      const cut = () => box(hole.getBoundingClientRect())
      const rule = (dy: number): Pt => {
        const [x, y] = ruleOf(consult)
        return [x, y + dy, RIDE]
      }
      /* just under the Consultant's caption when the Builder's cut is not on screen, else straight out of it */
      const fromEdge = !onScreen(hole.getBoundingClientRect())
      const legs: Leg[] = fromEdge
        ? [
            { at: 0, to: () => under(consult), opacity: 0, ease: linear },
            { at: 0.12, to: () => settle(under(consult)), opacity: 1, ease: ease },
          ]
        : [
            { at: 0, to: cut, opacity: 0, ease: lift },
            { at: 0.16, to: () => { const c = cut(); return [c[0], c[1] - 6, c[2]] }, opacity: 1, ease: ease },
            { at: 0.42, to: () => rule(0), opacity: 1, ease: linear },
            { at: 0.7, to: () => rule(40), opacity: 1, ease: ease },
          ]
      const dist = fromEdge ? Math.max(0, to()[1] - under(consult)[1]) : 0
      const duration = fromEdge ? Math.min(1200, 480 + dist * 0.6) : FLY
      /* the diamond traveller is a 100 px square (transform-origin 0 0) moved to a box */
      fly(
        [
          ...legs,
          { at: 0.94, to, opacity: 1, ease: linear, free: true },
          { at: 1, to, opacity: 0, ease: linear, free: true },
        ],
        duration,
        ([x, y, w], op) => {
          const o = inner.getBoundingClientRect()
          trav.style.transform = `translate(${(x - o.left - w / 2).toFixed(1)}px, ${(y - o.top - w / 2).toFixed(1)}px) scale(${(w / 100).toFixed(4)})`
          trav.style.opacity = op.toFixed(3)
        },
        () => {
          trav.style.transform = ""
          trav.style.opacity = ""
        },
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
          if (!narrow.matches || !entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.24)) return
          cio?.disconnect()
          consultSeen = true
          /* both in view at once (a tall phone, a jump): the observers can report in either order, so
             build the Builder while it is on screen and finish it only when it is not */
          if (phase === 0) {
            if (visible(builder) && keep()) build()
            else finish()
          }
          if (phase === 1) return wait()
          arrive()
        },
        /* the whole Consultant (caption, diagram, labels), a quarter in view below the header: the caption
           never sits over an empty box */
        { threshold: [0, 0.25], rootMargin: `-${Math.round(top)}px 0px 0px 0px` },
      )
      cio.observe(consult)
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
