"use client"

import { ShaderGradient, ShaderGradientCanvas } from "shadergradient"

/**
 * The real ShaderGradient hero field — the reference the CSS stand-in was
 * imitating, with the team's exact parameters (DESIGN_SYSTEM.md, Visual
 * foundations; added by Corbin 2026-08-16). One value differs from the
 * shadergradient.co snippet on purpose: color3 #0047BA is normalized to
 * official royal #003DA5 — no off-palette colors.
 *
 * Only ever imported through HeroMotionLayer's dynamic(ssr:false): three.js
 * cannot render on the server, and this chunk (~1MB of three) must not ride
 * the initial bundle. The editor/export props from the snippet (axesHelper,
 * gizmoHelper, format, frameRate, destination, embedMode, range*) are not
 * part of the library's render API and are dropped.
 *
 * Camera values are Corbin's second reference config (2026-08-16): pulled
 * far back (cDistance 15.99) through a narrow fov 10, azimuth 377 / polar
 * 83 — a flat, wide sweep of the plane rather than the first config's
 * close-up, which at the hero's aspect had left half the plane near-black.
 */
export default function HeroShaderCanvas() {
  return (
    <ShaderGradientCanvas
      fov={10}
      pixelDensity={1}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ShaderGradient
        control="props"
        type="plane"
        animate="on"
        uTime={0}
        uSpeed={0.1}
        uStrength={4}
        uDensity={1.3}
        uFrequency={5.5}
        uAmplitude={1}
        positionX={-1.4}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
        color1="#002E5D"
        color2="#ffffff"
        color3="#003DA5"
        reflection={0.1}
        wireframe={false}
        shader="defaults"
        cAzimuthAngle={377}
        cPolarAngle={83}
        cDistance={15.99}
        cameraZoom={1}
        lightType="3d"
        brightness={1.1}
        envPreset="city"
        grain="on"
        zoomOut={false}
      />
    </ShaderGradientCanvas>
  )
}
