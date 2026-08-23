"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

/**
 * The hero's motion layer — the ONE exception to flat solids.
 *
 * Layering strategy: the CSS stand-in (blobs + grain, classes in
 * globals.css) server-renders so first paint is instant and identical to
 * the design reference. The real ShaderGradient then loads client-side
 * (dynamic, ssr:false — three.js is ~1MB and worthless to the initial
 * paint) and fades in over it. The CSS layer stays mounted underneath
 * permanently, ON PURPOSE: it is the safety net for slow networks, WebGL
 * failures, and context loss — a torn-down fallback plus a struggling
 * canvas equals a blank hero. Its cost is three blurred blobs the site
 * already shipped. The white scrim stays on top for text legibility.
 *
 * The shader is mounted only when ALL of these hold, and is torn down the
 * moment any stops holding:
 *
 *   1. prefers-reduced-motion is not set. Measured 2026-08-20: honoring it
 *      drops the page from 1,592 KB of script to 388 KB and mounts no
 *      canvas at all.
 *   2. The viewport is at least SHADER_MIN_WIDTH wide. A 390px phone was
 *      pulling 1,220 KB of script and running a WebGL field for a hero
 *      band a few hundred pixels tall — the worst battery-per-pixel trade
 *      on the site. Phones get the CSS stand-in, which is what the design
 *      reference looked like anyway.
 *   3. The hero is actually on screen and the tab is in the foreground.
 *      Without this the field renders forever behind whatever you scrolled
 *      to; Chrome's GL driver reported "GPU stall due to ReadPixels
 *      (Performance, High)" three times on a single page load.
 *
 * All three are LIVE, not sampled once: a resize across the breakpoint, a
 * system motion-preference change, a scroll, or a tab switch each take
 * effect immediately. The previous version read the motion preference a
 * single time on mount and never listened for changes.
 */
const HeroShaderCanvas = dynamic(() => import("./HeroShaderCanvas"), { ssr: false })

/**
 * The library maps fov to the camera's VERTICAL field of view, so what the
 * camera sees horizontally grows with canvas aspect. shadergradient.co
 * frames the config on a full ~16:10 viewport; a wide short hero band
 * shows far more horizontal world than the site does, so the finite plane
 * stops short of the edges ("doesn't stretch across") and its rim creeps
 * in on wide monitors. Cover-fitting the canvas at the site's reference
 * aspect and cropping — background-size: cover, but for the shader —
 * reproduces the site's framing exactly at every hero size.
 */
const REF_ASPECT = 16 / 10

/* Below this the shader never mounts. Matches the `max-width: 768px`
   breakpoint globals.css already uses for the stronger mobile scrim, so
   the two treatments switch over together rather than at different widths. */
const SHADER_MIN_WIDTH = 768

/* Keep the field alive slightly beyond the fold so an ordinary scroll past
   the hero and back does not thrash the WebGL context. */
const VISIBILITY_MARGIN = "200px"

export function HeroMotionLayer() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [cover, setCover] = useState<{ w: number; h: number } | null>(null)
  /* `allowed` = motion preference and viewport permit a shader at all.
     `onScreen` = the hero is in view and the tab is in the foreground.
     `shaderOn` = the fade-in has landed. Mount requires the first two. */
  const [allowed, setAllowed] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const [shaderOn, setShaderOn] = useState(false)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (!width || !height) return
      const h = Math.max(height, width / REF_ASPECT)
      setCover({ w: h * REF_ASPECT, h })
    })
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  /* Motion preference + viewport width, both live. The initial read rides a
     timeout for the same reason the mount flip did: it keeps setState out of
     the effect body (react-hooks/set-state-in-effect). */
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const wide = window.matchMedia(`(min-width: ${SHADER_MIN_WIDTH}px)`)
    const sync = () => setAllowed(!motion.matches && wide.matches)
    const first = setTimeout(sync, 0)
    motion.addEventListener("change", sync)
    wide.addEventListener("change", sync)
    return () => {
      clearTimeout(first)
      motion.removeEventListener("change", sync)
      wide.removeEventListener("change", sync)
    }
  }, [])

  /* On-screen and foreground. Both feed one flag because the response is the
     same either way: stop rendering a field nobody is looking at. */
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    let inView = true
    const sync = () => setOnScreen(inView && !document.hidden)
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { rootMargin: VISIBILITY_MARGIN }
    )
    io.observe(box)
    document.addEventListener("visibilitychange", sync)
    return () => {
      io.disconnect()
      document.removeEventListener("visibilitychange", sync)
    }
  }, [])

  const mounted = allowed && onScreen

  /* The fade lands a beat after mount so the WebGL context and shader
     compile have a moment — a fade, not a pop. 400ms is enough now that
     enableTransition={false} puts the plane at its final pose on the first
     frame (no fly-in to hide). On teardown the flag resets immediately so a
     remount fades in again rather than snapping. */
  useEffect(() => {
    /* One timeout for both directions so no setState runs synchronously in
       the effect body (react-hooks/set-state-in-effect) — the same
       constraint the mount flip was already written around. Fading ON waits
       the 400ms; fading OFF is immediate, so a teardown never leaves a
       stale-opaque frame behind. */
    const t = setTimeout(() => setShaderOn(mounted), mounted ? 400 : 0)
    return () => clearTimeout(t)
  }, [mounted])

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <div className="ml-field">
        <div className="ml-blob ml-b3" />
        <div className="ml-blob ml-b1" />
        <div className="ml-blob ml-b2" />
      </div>
      <div className="ml-grain" />
      {mounted && cover && (
        /* The 16:10 cover frame, centered; the hero shows its middle band.
           This replaces the old flat -12% bleed. */
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${cover.w}px`,
            height: `${cover.h}px`,
            opacity: shaderOn ? 1 : 0,
            transition: "opacity 600ms ease",
          }}
        >
          <HeroShaderCanvas />
          {/* Navy floor: the defaults shader's 3D lighting crushes shaded
              navy toward pure black. This plate, blended with lighten
              (per-channel max), clamps every pixel's floor to brand navy
              #002E5D — black cannot exist, brighter field is untouched.

              Note this is exactly the headline's own color, so wherever the
              field bottoms out the text would vanish into it. The .ml-scrim
              stops in globals.css are what keep the headline legible over
              that floor; the two are calibrated together. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--navy)",
              mixBlendMode: "lighten",
              pointerEvents: "none",
            }}
          />
        </div>
      )}
      <div className="ml-scrim" />
    </div>
  )
}
