"use client"

import { useEffect, useRef } from "react"
import { O_STORY_REPLAY } from "@/lib/content"

/**
 * The hero story's one bit of script (AFStory). The first desktop play is CSS alone: .is-playing on
 * the hero and .is-building on the mark ship in the server HTML. This adds two things:
 *   - Replay: restarts the build and the story from the top.
 *   - Below 1200 px the profiles sit in their own band under the facts, so they wait until that
 *     band is 35% in view (and never before the build and its hold are done) to tell their part.
 *     html.io arms that wait; with no script it is never set and the band shows its end state.
 * The button shows only when motion is allowed and the story has played (o-story.css).
 */
const HOLD = 4800 // ms: the blueprint build (3.85 s) and its hold, before the phone stage may start

export function AFStoryReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const replay = useRef<() => void>(() => {})

  useEffect(() => {
    const hero = ref.current?.closest(".af-hero")
    const mark = hero?.querySelector(".af-build")
    const stage = hero?.querySelector(".tk-stage")
    if (!hero || !mark || !stage) return
    const narrow = window.matchMedia("(max-width: 1199px)")
    const root = document.documentElement
    let t0 = performance.now()
    let timer = 0
    let io: IntersectionObserver | null = null

    const tell = () => {
      stage.classList.add("is-telling")
      io?.disconnect()
    }
    const watch = () => {
      if (!("IntersectionObserver" in window)) return
      io = new IntersectionObserver(
        (entries) => {
          if (!narrow.matches || !entries.some((e) => e.isIntersecting)) return
          window.clearTimeout(timer)
          timer = window.setTimeout(tell, Math.max(0, t0 + HOLD - performance.now()))
        },
        { threshold: 0.35 },
      )
      io.observe(stage)
    }
    if ("IntersectionObserver" in window) root.classList.add("io")
    watch()

    replay.current = () => {
      window.clearTimeout(timer)
      io?.disconnect()
      stage.classList.remove("is-telling")
      hero.classList.remove("is-playing")
      mark.classList.remove("is-building")
      void (hero as HTMLElement).offsetWidth
      hero.classList.add("is-playing")
      mark.classList.add("is-building")
      t0 = performance.now()
      watch()
    }
    return () => {
      window.clearTimeout(timer)
      io?.disconnect()
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
