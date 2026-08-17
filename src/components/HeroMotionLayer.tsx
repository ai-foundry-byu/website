"use client"

import { useEffect, useState } from "react"
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

export function HeroMotionLayer() {
  const [shader, setShader] = useState(false)
  const [shaderOn, setShaderOn] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setShader(true)
    // Fade the canvas in a beat after mount, giving the WebGL context and
    // shader compile a moment so the reveal is a fade, not a pop.
    const fade = setTimeout(() => setShaderOn(true), 700)
    return () => clearTimeout(fade)
  }, [])

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div className="ml-field">
        <div className="ml-blob ml-b3" />
        <div className="ml-blob ml-b1" />
        <div className="ml-blob ml-b2" />
      </div>
      <div className="ml-grain" />
      {shader && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: shaderOn ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        >
          <HeroShaderCanvas />
        </div>
      )}
      <div className="ml-scrim" />
    </div>
  )
}
