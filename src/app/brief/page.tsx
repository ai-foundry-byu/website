import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  ENDOWMENT,
  FOUNDING_DONOR,
  LINKEDIN_GROWTH,
  MILESTONES,
  NEEDS,
  UPTICK,
  WINS,
  type Point,
} from "@/lib/brief-data"

/**
 * The AI Foundry standing report. NOT linked from anywhere on the site.
 *
 * A one-pager in website form: an executive should get the whole position from
 * one screen and one scroll — where we are, the curve behind it, who funded the
 * year, what next year costs, and the ask. Everything that would have been a
 * paragraph is a row.
 *
 * Order is deliberate. The ask is last because an ask lands differently after
 * the proof than it does cold, and the money section sits directly above it so
 * the reader arrives at "founding partner" already holding the arithmetic.
 *
 * Gated because it carries client counts and a funding position. Fails CLOSED:
 * no token in the environment and every request 404s, so a misconfigured deploy
 * hides the page rather than exposing it. Same shape as /ops.
 *
 * On the gate, honestly: a token in a query string is obscurity, not security —
 * it leaks through referrers, history, and any log that keeps full URLs. That is
 * an acceptable trade here. Nothing on this page is private about a person: the
 * donor is named with written consent on file and there are no contact details
 * anywhere. Keep it that way.
 */

export const metadata: Metadata = {
  title: "Standing report",
  robots: { index: false, follow: false, nocache: true },
}

export const revalidate = 300

export default async function BriefPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>
}) {
  const expected = process.env.BRIEF_TOKEN || process.env.OPS_TOKEN
  const { k } = await searchParams
  if (!expected || k !== expected) notFound()

  const multiple = (UPTICK.last30 / UPTICK.prior30).toFixed(1)

  return (
    <main className="min-h-screen bg-surface-default">
      {/* ── Band one: the whole position, above the fold ─────────── */}
      <header className="bg-surface-inverse">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-14">
          <p className="eyebrow text-text-on-dark-soft">
            AI Foundry · BYU Marriott · Standing report, August 2026
          </p>
          <h1 className="mt-5 max-w-[24ch] font-serif text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.02em] text-text-on-inverse md:text-[2.7rem]">
            One year in, the Foundry is a working studio with paying clients.
          </h1>

          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border-on-inverse pt-8 md:grid-cols-5">
            {WINS.map((w) => (
              <div key={w.label}>
                <span className="stat block text-[2.4rem] leading-none tabular-nums text-text-on-inverse md:text-[2.7rem]">
                  {w.value}
                </span>
                <span className="mt-2.5 block text-[0.82rem] leading-snug text-text-on-dark-soft">
                  {w.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        {/* ── Band two: the curve, and what it is doing lately ────── */}
        <section className="grid gap-x-12 gap-y-8 pt-12 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow text-text-meta">LinkedIn · audience growth</p>
            <h2 className="mt-2 font-serif text-[1.35rem] font-semibold leading-snug tracking-[-0.01em] text-text-primary">
              The curve is steepening, not flattening.
            </h2>
            <p className="mt-2.5 max-w-[42rem] text-[0.95rem] leading-relaxed text-text-meta">
              <strong className="font-semibold text-text-primary">
                {UPTICK.last30} new followers in the last 30 days
              </strong>{" "}
              against {UPTICK.prior30} in the 30 before — {multiple}× the rate,
              three months after launch, with nothing paid.
            </p>
            <div className="mt-6">
              <GrowthChart points={LINKEDIN_GROWTH} />
            </div>
            <p className="mt-3 text-[0.78rem] text-text-meta">
              Cumulative followers by week, from the LinkedIn Analytics export
              through 24 August. {UPTICK.today} as of today.
            </p>
          </div>

          <div className="md:pt-8">
            <p className="eyebrow text-text-meta">Also landed</p>
            <ul className="mt-3 list-none border-t border-border-strong p-0">
              {MILESTONES.map((m) => (
                <li key={m.title} className="border-b border-border-subtle py-3">
                  <p className="text-[0.92rem] font-medium leading-snug text-text-primary">
                    {m.title}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] leading-snug text-text-meta">
                    {m.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Band three: the money, both directions ──────────────── */}
        <section className="grid gap-x-12 gap-y-10 pt-14 md:grid-cols-2">
          {/* Where it came from. */}
          <div>
            <p className="eyebrow text-text-meta">Our first gift</p>
            <div className="mt-3 h-full border-2 border-border-accent p-6 md:p-7">
              <p className="eyebrow text-text-accent">Founding donor</p>
              <p className="mt-2.5 font-serif text-[1.45rem] font-semibold leading-tight text-text-primary">
                {FOUNDING_DONOR.name}
              </p>
              <p className="mt-1 text-[0.92rem] font-medium text-text-primary opacity-80">
                {FOUNDING_DONOR.fund}
              </p>
              <p className="mt-3.5 text-[0.92rem] leading-relaxed text-text-meta">
                {FOUNDING_DONOR.detail}
              </p>
              <p className="mt-4 text-[0.8rem] text-text-meta">
                Established {FOUNDING_DONOR.established}.
              </p>
            </div>
          </div>

          {/* What the year ahead costs. */}
          <div>
            <p className="eyebrow text-text-meta">What the year ahead needs</p>
            <table className="mt-3 w-full border-collapse">
              <tbody>
                {NEEDS.map((n) => (
                  <tr key={n.item} className="border-b border-border-subtle align-top">
                    <td className="py-3.5 pr-4">
                      <p className="text-[0.92rem] font-medium leading-snug text-text-primary">
                        {n.item}
                      </p>
                      <p className="mt-0.5 text-[0.78rem] leading-snug text-text-meta">
                        {n.basis}
                      </p>
                    </td>
                    <td className="whitespace-nowrap py-3.5 text-right align-top">
                      {n.amount ? (
                        <span className="stat text-[1.15rem] tabular-nums text-text-accent">
                          {n.amount}
                        </span>
                      ) : (
                        <span className="text-[0.78rem] text-text-meta">
                          To be scoped
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[0.78rem] leading-snug text-text-meta">
              Seat pricing read from claude.com/pricing on 26 August. The
              competition budgets are genuinely unscoped — a number invented here
              would anchor every conversation that followed it.
            </p>
          </div>
        </section>

        {/* ── Band four: the one ask ──────────────────────────────── */}
        <section className="pt-14 pb-16">
          <div className="bg-surface-inverse p-8 md:p-10">
            <p className="eyebrow text-text-on-dark-soft">Still open</p>
            <h2 className="mt-3.5 max-w-[22ch] font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-text-on-inverse md:text-[2rem]">
              {ENDOWMENT.heading}
            </h2>
            <div className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
              <p className="text-[0.95rem] leading-relaxed text-text-on-dark-body">
                {ENDOWMENT.body}
              </p>
              <p className="text-[0.95rem] leading-relaxed text-text-on-inverse">
                {ENDOWMENT.ask}
              </p>
            </div>
          </div>
          <p className="mt-5 text-[0.78rem] leading-relaxed text-text-meta">
            Cohort, client and project counts current as of 26 August, ahead of
            the pipeline tracker. Network count read from our own database.
            Follower series from the LinkedIn Analytics export. No gift amounts
            appear on this page, per the standing rule on our donors page. Not
            linked from the site and excluded from search indexing.
          </p>
        </section>
      </div>
    </main>
  )
}

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
 */
function GrowthChart({ points }: { points: Point[] }) {
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
