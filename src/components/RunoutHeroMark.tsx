"use client"

import { useEffect, useRef } from "react"

/**
 * The Runout mark in the landing hero: the rise, in heat and steel, on Carbon.
 *
 * Layers, back to front:
 *   1. The horizon. One arc drawn far past the mark in both directions, hot
 *      only where it passes through the cut, steel and then nothing towards
 *      the edges. It draws outward from the centre as the mark rises, then
 *      breathes very slowly. Same geometry as the cut: the arc's crown sits
 *      at y 318 of the mark's 512-unit drawing, the gap between the A's feet
 *      and the F's top arm.
 *   2. The mark. The kit's own animated SVG (kit/motion/animated.svg: hot
 *      horizon, rise, cast, set, heat, one glint, 3.05 s, plays once and
 *      holds), loaded as an image so its SMIL timeline runs with no script.
 *      prefers-reduced-motion gets the still digital mark instead, through
 *      <picture>, so nothing moves and nothing is downloaded twice.
 *   3. The sheen. A specular band masked to the mark's exact outline
 *      (mark-white.svg shares the 512 viewBox), swept across on hover.
 *
 * The only script is a pointer tilt, a few degrees at most, written into
 * two custom properties. It is skipped for reduced motion and for devices
 * without a fine pointer, and it never re-renders React.
 */
export function RunoutHeroMark() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    if (still.matches || !fine.matches) return
    const zone = el.closest("section") ?? el
    let frame = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
        const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
        el.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`)
        el.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`)
      })
    }
    const leave = () => {
      el.style.setProperty("--tilt-y", "0deg")
      el.style.setProperty("--tilt-x", "0deg")
    }
    zone.addEventListener("pointermove", move as EventListener)
    zone.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      zone.removeEventListener("pointermove", move as EventListener)
      zone.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <div ref={ref} className="af-mark">
      <svg className="af-horizon" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="af-hz" gradientUnits="userSpaceOnUse" x1="-1100" y1="0" x2="1612" y2="0">
            <stop offset="0" stopColor="#5E8BBA" stopOpacity="0" />
            <stop offset="0.27" stopColor="#5E8BBA" stopOpacity="0" />
            <stop offset="0.36" stopColor="#7FA6CC" stopOpacity="0.5" />
            <stop offset="0.43" stopColor="#FF6A13" />
            <stop offset="0.5" stopColor="#FFF4D6" />
            <stop offset="0.57" stopColor="#FF6A13" />
            <stop offset="0.7" stopColor="#7FA6CC" stopOpacity="0.45" />
            <stop offset="1" stopColor="#5E8BBA" stopOpacity="0" />
          </linearGradient>
          <filter id="af-hz-glow" x="-20%" y="-400%" width="140%" height="900%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g className="af-horizon-draw">
          <path className="af-horizon-glow" d="M-1100 448 Q256 188 1612 448" fill="none" stroke="url(#af-hz)" strokeWidth="10" filter="url(#af-hz-glow)" />
          <path d="M-1100 448 Q256 188 1612 448" fill="none" stroke="url(#af-hz)" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
      <div className="af-mark-body">
        <picture>
          <source srcSet="/brand/runout/mark-digital-dark.svg" media="(prefers-reduced-motion: reduce)" />
          {/* A plain img inside picture: an animated SVG, so next/image adds nothing. */}
          <img
            src="/brand/runout/animated.svg"
            alt="The AI Foundry mark: an A risen through a horizon, its crossbar running on as the F"
            width={512}
            height={512}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <span aria-hidden="true" className="af-sheen" />
      </div>
    </div>
  )
}
