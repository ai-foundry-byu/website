/**
 * The Runout mark in the landing hero: the rise, in heat and steel, on Carbon.
 *
 * Layers, back to front:
 *   1. The horizon. One arc drawn far past the mark in both directions, hot
 *      only where it passes through the cut, steel and then nothing towards
 *      the edges. It draws outward from the centre as the mark rises, then
 *      breathes very slowly. Same geometry as the cut: the arc's crown sits
 *      at y 318 of the mark's 512-unit drawing, the gap between the A's feet
 *      and the F's top arm. (Guide, Website: "the horizon running out of its
 *      cut across the page as one hairline that is white-hot at the mark and
 *      cools to steel at the edges.")
 *   2. The mark. The kit's own animated SVG (kit/motion/animated.svg: hot
 *      horizon, rise, cast, set, heat, one glint, 3.05 s, plays once and
 *      holds), loaded as an image so its SMIL timeline runs with no script.
 *      prefers-reduced-motion gets the still digital mark instead, through
 *      <picture>, so nothing moves and nothing is downloaded twice.
 *
 * Nothing else moves the mark. The guide's Don'ts forbid tilting it ("the
 * horizon is level"), adding gradients, glows or shadows of our own, and
 * animating it any way but the rise, so the pointer tilt, the hover sheen,
 * the drop shadow and the scroll sink of the first preview are gone
 * (review 2026-11-11). No client script is needed.
 */
export function RunoutHeroMark() {
  return (
    <div className="af-mark">
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
      </div>
    </div>
  )
}
