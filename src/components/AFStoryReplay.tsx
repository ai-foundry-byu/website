"use client"

import { useEffect, useRef } from "react"
import { O_STORY_REPLAY } from "@/lib/content"

/**
 * The hero story's one bit of script (AFStory). The first play is CSS alone: .is-playing on the hero
 * and .is-building on the mark ship in the server HTML. This adds three things:
 *   - Replay: restarts the build and the story from the top (on a phone it scrolls the wordmark back
 *     into view first, since the button sits below the Builder).
 *   - Below 1200 px the Consultant sits after the facts: it is drawn up on its own short clock the
 *     moment any of it is in view (.is-telling), whether the reader scrolls slowly, fast, or jumps.
 *     html.io arms that wait; with no script it is never set and the Consultant shows its end state.
 *   - Below 1200 px the Builder sits under the wordmark and plays on the hero clock. If the reader
 *     has already scrolled it out of view when the lift is due, it waits just before the lift
 *     (.is-held) and plays as soon as it is back in view.
 * The button shows only when motion is allowed and the story has played (o-story.css).
 */
const LIFT = 3450 // ms on the hero clock: just before the O lifts (3.55 s)

export function AFStoryReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const replay = useRef<() => void>(() => {})

  useEffect(() => {
    const hero = ref.current?.closest(".af-hero")
    const mark = hero?.querySelector(".af-build")
    const builder = hero?.querySelector(".tk-builder")
    const consult = hero?.querySelector(".tk-consult")
    if (!hero || !mark || !builder || !consult || !("IntersectionObserver" in window)) return
    const narrow = window.matchMedia("(max-width: 1199px)")
    const root = document.documentElement
    root.classList.add("io")
    let timer = 0
    let builderSeen = true

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

    const bio = new IntersectionObserver(
      (entries) => {
        builderSeen = entries[entries.length - 1].isIntersecting
        if (builderSeen) hero.classList.remove("is-held")
      },
      { threshold: 0.2 },
    )
    bio.observe(builder)

    let cio: IntersectionObserver | null = null
    const watchConsult = () => {
      cio?.disconnect()
      cio = new IntersectionObserver(
        (entries) => {
          if (!narrow.matches || !entries.some((e) => e.isIntersecting)) return
          consult.classList.add("is-telling")
          cio?.disconnect()
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
      )
      cio.observe(consult)
    }
    watchConsult()
    armHold()

    replay.current = () => {
      window.clearTimeout(timer)
      hero.classList.remove("is-held")
      consult.classList.remove("is-telling")
      hero.classList.remove("is-playing")
      mark.classList.remove("is-building")
      void (hero as HTMLElement).offsetWidth
      hero.classList.add("is-playing")
      mark.classList.add("is-building")
      watchConsult()
      armHold()
      /* on a phone the button sits at the foot of the hero, below the Builder: bring the wordmark
         back up so the replay is seen (else the Builder would wait out of view) */
      if (narrow.matches && !builderSeen) hero.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    return () => {
      window.clearTimeout(timer)
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
