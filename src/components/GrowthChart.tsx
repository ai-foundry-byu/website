/**
 * Cumulative growth, one series.
 *
 * One series means no legend — the heading names it — and no categorical
 * palette to validate: the mark is brand navy on the page surface, the
 * highest-contrast pairing the system has. Grid and axes stay recessive so the
 * line is the only thing carrying weight.
 *
 * The last four weeks are shaded, because the argument this chart makes is
 * about the recent slope rather than the total. The endpoint is the only
 * labelled point — a number on every point is noise.
 *
 * Inline SVG with a `<title>` per point gives a native hover readout with no
 * client JavaScript on an otherwise static page.
 *
 * Lifted out of /brief on 2026-08-27 when /board needed the same chart. It was
 * always presentational and stateless; the only reason it lived inside the page
 * was that nothing else had asked for it yet. Two copies of a hundred lines of
 * SVG would have drifted the first time either page was touched.
 */

export type Point = { week: string; value: number }

export function GrowthChart({ points }: { points: Point[] }) {
  const W = 640
  const H = 230
  const PAD = { t: 16, r: 14, b: 30, l: 40 }
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b

  const max = 200
  const x = (i: number) => PAD.l + (i / (points.length - 1)) * plotW
  const y = (v: number) => PAD.t + plotH - (v / max) * plotH

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ")
  const area = `${line} L${x(points.length - 1)},${PAD.t + plotH} L${x(0)},${PAD.t + plotH} Z`
  const ticks = [0, 50, 100, 150, 200]
  const last = points[points.length - 1]
  const upFrom = points.length - 5 // start of the highlighted trailing window

  const tickLabel = (w: string) =>
    new Date(w + "T00:00:00Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full min-w-[26rem]"
        role="img"
        aria-label={`Cumulative AI Foundry LinkedIn followers by week, rising from zero in late May 2026 to ${last.value} by 24 August 2026, with the steepest growth in the final month.`}
      >
        <defs>
          <linearGradient id="lifill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--navy)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--navy)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* The window the headline is about. */}
        <rect
          x={x(upFrom)}
          y={PAD.t}
          width={x(points.length - 1) - x(upFrom)}
          height={plotH}
          fill="var(--fill-selected)"
        />

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border-hairline)"
              strokeWidth="1"
            />
            <text
              x={PAD.l - 9}
              y={y(t) + 4}
              textAnchor="end"
              className="fill-[var(--text-meta)] font-mono text-[10px] tabular-nums"
            >
              {t}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#lifill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--navy)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <g key={p.week}>
            <circle cx={x(i)} cy={y(p.value)} r="13" fill="transparent">
              <title>{`Week of ${p.week}: ${p.value} followers`}</title>
            </circle>
            <circle
              cx={x(i)}
              cy={y(p.value)}
              r={i === points.length - 1 ? 5 : 3}
              fill="var(--navy)"
              stroke="var(--surface-page)"
              strokeWidth="2"
            />
          </g>
        ))}

        <text
          x={x(points.length - 1) - 6}
          y={y(last.value) - 13}
          textAnchor="end"
          className="fill-[var(--navy)] font-sans text-[14px] font-semibold tabular-nums"
        >
          {last.value}
        </text>

        {points.map((p, i) =>
          i % 4 === 0 || i === points.length - 1 ? (
            <text
              key={`x-${p.week}`}
              x={x(i)}
              y={H - 10}
              textAnchor="middle"
              className="fill-[var(--text-meta)] font-mono text-[10px]"
            >
              {tickLabel(p.week)}
            </text>
          ) : null
        )}
      </svg>
    </div>
  )
}
