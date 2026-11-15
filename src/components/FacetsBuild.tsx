/**
 * FacetsBuild: the AI FOUNDRY wordmark, direction L (Facets, balanced; designed by Scott
 * Murff), built in three beats in the landing hero. Draft for BYU Marriott approval.
 *
 * Geometry and timing are the design team's round 17 motion kit, unchanged
 * (round17-2026-11-14-facets-L/motion: build.svg, af-build-l.css, timing.json):
 *   1. the letters rise in, A to Y, 55 ms apart (0 to 905 ms);
 *   2. the hexagon drops into the O slot and seats (820 to 1480 ms);
 *   3. the square diamond is cut from its centre (1480 to 2120 ms); then it holds.
 * The CSS lives in src/app/facets-build.css. The base styles are the final mark, and the
 * animations bind only under .afL-build.is-building, which ships in the server HTML, so the
 * build plays once as the page first paints with no hydration step and no flash of the
 * finished mark. prefers-reduced-motion and print cancel every animation and leave the
 * static wordmark. Ink comes from --af-mark-ink (Navy on light grounds, White under
 * data-theme="dark"). The SVG keeps the kit's viewBox and overflow is visible, so the
 * falling hexagon is never clipped.
 */

const LETTERS: [string, string][] = [["A", "M0 110 49.71 9.85H77.99L127.7 110H100.29L91.55 91.92H34.55L25.8 110ZM43.73 72.54H82.36L71.72 49.65Q71.14 48.19 69.83 45.28Q68.51 42.36 67.27 39.3Q66.03 36.24 65.01 33.76Q63.99 31.28 63.7 30.7H62.54Q61.37 33.62 59.77 37.26Q58.16 40.9 56.78 44.33Q55.39 47.76 54.37 49.8Z"], ["I", "M142 110V9.85H167.22V110Z"], ["F", "M230.02 110V9.85H326.66V29.68H255.23V52.27H319.37V72.24H255.23V110Z"], ["U", "M520.9 111.75Q501.66 111.75 489.05 105.92Q476.44 100.09 470.24 89.3Q464.05 78.51 464.05 63.64V9.85H489.27V62.48Q489.27 76.47 497.5 84.13Q505.74 91.78 520.9 91.78Q536.06 91.78 544.3 84.13Q552.53 76.47 552.53 62.48V9.85H577.6V63.64Q577.6 78.51 571.48 89.3Q565.36 100.09 552.75 105.92Q540.14 111.75 520.9 111.75Z"], ["N", "M600.9 110V9.85H624.08L677.73 60.15Q679.33 61.46 681.74 63.94Q684.14 66.41 686.76 69.11Q689.39 71.81 691.28 73.85H692.6Q692.45 70.93 692.23 66.56Q692.01 62.19 692.01 59.27V9.85H716.06V110H693.32L640.12 59.71Q636.33 56.21 632.25 51.98Q628.16 47.76 625.69 45.13H624.52Q624.67 47.03 624.81 51.55Q624.96 56.06 624.96 61.75V110Z"], ["D", "M739.86 110V9.85H794.24Q812.75 9.85 826.02 15.61Q839.28 21.37 846.42 32.52Q853.57 43.67 853.57 60Q853.57 76.18 846.42 87.33Q839.28 98.48 826.02 104.24Q812.75 110 794.24 110ZM765.08 90.03H792.93Q800.51 90.03 806.85 88.21Q813.19 86.38 817.85 82.81Q822.52 79.24 825 73.92Q827.47 68.6 827.47 61.6V58.25Q827.47 51.25 825 45.93Q822.52 40.61 817.85 37.04Q813.19 33.47 806.85 31.57Q800.51 29.68 792.93 29.68H765.08Z"], ["R", "M873.57 110V9.85H954.47Q965.26 9.85 972.18 14.23Q979.11 18.6 982.61 25.74Q986.1 32.89 986.1 41.63Q986.1 50.67 981.51 58.47Q976.92 66.27 967.59 70.79L988.44 110H960.16L942.52 75.31H898.79V110ZM898.79 55.48H947.04Q953.16 55.48 956.73 51.76Q960.3 48.05 960.3 42.22Q960.3 38.13 958.7 35.36Q957.09 32.59 954.18 31.14Q951.26 29.68 947.04 29.68H898.79Z"], ["Y", "M1041.86 110V69.77L992.74 9.85H1022.77L1054.4 49.94H1055.86L1087.78 9.85H1116.35L1067.08 69.77V110Z"]]
const HEX = "M332.863 60L361.709 10L419.401 10L448.247 60L419.401 110L361.709 110Z"
const CUT = "M390.555 19.976L350.531 60L390.555 100.024L430.579 60Z"
const MASK = { x: 272.863, y: -50, width: 235.384, height: 220 }

export function FacetsBuild({
  theme = "dark",
  id = "af-hero-wn",
  className,
}: {
  theme?: "light" | "dark"
  /** Unique per instance on a page: it names the mask that cuts the diamond. */
  id?: string
  className?: string
}) {
  const maskId = `${id}-cut`
  return (
    <svg
      viewBox="0 9.854 1116.351 101.895"
      className={["afL-build is-building", className ?? ""].join(" ")}
      data-theme={theme}
      role="img"
      aria-label="AI Foundry"
    >
      {LETTERS.map(([k, d]) => (
        <path key={k} className={`afL-ink afL-letter afL-letter-${k}`} d={d} />
      ))}
      <mask id={maskId} maskUnits="userSpaceOnUse" x={MASK.x} y={MASK.y} width={MASK.width} height={MASK.height}>
        <rect x={MASK.x} y={MASK.y} width={MASK.width} height={MASK.height} fill="#fff" />
        <path className="afL-cut" fill="#000" d={CUT} />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path className="afL-ink afL-hex" d={HEX} />
      </g>
    </svg>
  )
}
