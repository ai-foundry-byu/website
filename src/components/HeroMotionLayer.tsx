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
 * prefers-reduced-motion never mounts the shader at all: the CSS layer
 * remains, and the global reduced-motion rules already still its blobs.
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

export function HeroMotionLayer() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [cover, setCover] = useState<{ w: number; h: number } | null>(null)
  const [shader, setShader] = useState(false)
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Both flips ride timeouts: mounting on the next tick keeps setState
    // out of the effect body (react-hooks/set-state-in-effect), and the
    // fade lands a beat later so the WebGL context and shader compile
    // have a moment — a fade, not a pop. 400ms is enough now that
    // enableTransition={false} puts the plane at its final pose on the
    // first frame (no fly-in to hide).
    const mount = setTimeout(() => setShader(true), 0)
    const fade = setTimeout(() => setShaderOn(true), 400)
    return () => {
      clearTimeout(mount)
      clearTimeout(fade)
    }
  }, [])

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
      {shader && cover && (
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
              #002E5D — black cannot exist, brighter field is untouched. */}
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
