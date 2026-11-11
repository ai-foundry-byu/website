/**
 * The AF Stride mark in the landing hero (brand/stride-2026-11 demo).
 *
 * - The rise: the kit's motion/animated-transparent.svg (SMIL, 1.85 s, plays
 *   once, then holds the digital mark). Loaded as an <img>, so it costs no
 *   JavaScript and its ids never collide with the page.
 * - Reduced motion: a <picture> source swaps in the rest frame, per the brand
 *   guide section 5. No script decides this; the media query does.
 * - The horizon: one thin line through the mark's own cut, out to the edge
 *   of the page, hot where it meets the mark and cooling to steel. It runs
 *   out from the centre on load (the Horizon beat) and then stays.
 * - The sheen: on hover, one band of specular light crosses the steel, masked
 *   to the outline of record. The mark itself never moves.
 *
 * Geometry: rise.svg places the 512 master at translate(50.286 56.286)
 * scale(0.803571) inside a 512 box, so the cut sits at y 344 to 377 of the
 * box. The horizon SVG shares that unit (its box is 5 mark-boxes wide) and
 * its arc crosses x 130 to 330 at y 360, inside the cut.
 */
export function HeroStride() {
  return (
    <div className="sx-mark">
      <svg className="sx-horizon" viewBox="-1024 0 2560 512" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="sxh-grad" gradientUnits="userSpaceOnUse" x1="-1024" y1="0" x2="1536" y2="0">
            <stop offset="0" stopColor="#5E8BBA" stopOpacity="0" />
            <stop offset="0.38" stopColor="#5E8BBA" stopOpacity="0" />
            <stop offset="0.43" stopColor="#7FA6CC" stopOpacity="0.55" />
            <stop offset="0.465" stopColor="#FF6A13" />
            <stop offset="0.5" stopColor="#FFF4D6" />
            <stop offset="0.58" stopColor="#FF6A13" />
            <stop offset="0.74" stopColor="#7FA6CC" stopOpacity="0.45" />
            <stop offset="1" stopColor="#5E8BBA" stopOpacity="0" />
          </linearGradient>
          <filter id="sxh-glow" x="-10%" y="-200%" width="120%" height="500%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <g className="sx-horizon-glow" filter="url(#sxh-glow)">
          <path pathLength={1} d="M256 360Q-384 360 -1024 470" />
          <path pathLength={1} d="M256 360Q896 360 1536 470" />
        </g>
        <g className="sx-horizon-core">
          <path pathLength={1} d="M256 360Q-384 360 -1024 470" />
          <path pathLength={1} d="M256 360Q896 360 1536 470" />
        </g>
      </svg>
      <picture>
        <source srcSet="/brand/stride/rest.svg" media="(prefers-reduced-motion: reduce)" />
        <img
          className="sx-mark-img"
          src="/brand/stride/rise.svg"
          alt="AI Foundry"
          width={640}
          height={640}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <span className="sx-sheen" aria-hidden="true" />
    </div>
  )
}
