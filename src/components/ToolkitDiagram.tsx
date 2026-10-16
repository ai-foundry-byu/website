/**
 * The Builder hexagon or the Consultant diamond, drawn as an empty frame:
 * rings, spokes, and a labeled corner per axis, with no one's scores in it.
 * The course books carry the same figure (images/hexagon-and-diamond.png)
 * with an example profile; this one is the shape only. Royal frame, navy
 * labels, hairline rings: the site's palette, so no new colors.
 *
 * Corners run clockwise from `start` degrees (0 = right, 90 = down).
 */
export function ToolkitDiagram({ axes, start, title }: { axes: string[]; start: number; title: string }) {
  const R = 100
  const rings = [0.25, 0.5, 0.75]
  const point = (i: number, r: number) => {
    const a = ((start + (360 / axes.length) * i) * Math.PI) / 180
    return [Math.cos(a) * r, Math.sin(a) * r] as const
  }
  const poly = (r: number) => axes.map((_, i) => point(i, r).map((v) => v.toFixed(1)).join(",")).join(" ")

  return (
    <svg viewBox="-240 -150 480 300" role="img" aria-label={`${title}: ${axes.join(", ")}`} style={{ width: "100%", height: "auto", maxWidth: 460 }}>
      {rings.map((k) => (
        <polygon key={k} points={poly(R * k)} fill="none" stroke="var(--border-hairline)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, R)
        return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="var(--border-hairline)" strokeWidth="1" />
      })}
      <polygon points={poly(R)} fill="var(--fill-selected)" stroke="var(--royal)" strokeWidth="2" strokeLinejoin="round" />
      {axes.map((name, i) => {
        const [x, y] = point(i, R)
        const [lx, ly] = point(i, R + 18)
        const anchor = Math.abs(lx) < 1 ? "middle" : lx > 0 ? "start" : "end"
        // Two-word-plus labels break after the first word so the left and
        // right corners stay inside the frame.
        const words = name.split(" ")
        const lines = words.length > 1 && name.length > 12 ? [words[0], words.slice(1).join(" ")] : [name]
        const dy = Math.abs(ly) < 1 ? -(lines.length - 1) * 8 : ly < 0 ? -(lines.length - 1) * 16 : 12
        return (
          <g key={name}>
            <circle cx={x} cy={y} r="4" fill="var(--royal)" />
            <text
              x={lx}
              y={ly + dy}
              textAnchor={anchor}
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, fill: "var(--navy)" }}
            >
              {lines.map((l, j) => (
                <tspan key={l} x={lx} dy={j === 0 ? 4 : 16}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
