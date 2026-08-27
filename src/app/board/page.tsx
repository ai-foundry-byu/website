import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  ASKS,
  BOARD,
  CLOSE,
  EXECUTION,
  LINKEDIN_GROWTH,
  MILESTONES,
  PHASES,
  SEMESTER,
  UPTICK,
  WINS,
} from "@/lib/board-data"
import { GrowthChart } from "@/components/GrowthChart"

/**
 * The advisory board update. NOT linked from anywhere on the site.
 *
 * Written for the eleven people who advise the program, and structured the way
 * a board reads: what happened, what is coming, what is broken, and who else is
 * in the room. The order is deliberate — the gaps sit BEFORE the roster, so a
 * member arrives at their own name having just read what we need, rather than
 * closing the page on a flattering list.
 *
 * It differs from /brief in audience and therefore in ask. /brief is written for
 * a donor and ends in an endowment request; board seats carry no fee (JD,
 * 2026-08-03), so this page never asks a reader for money. It asks for the
 * introduction and the correction.
 *
 * Gated the same way as /brief and /ops, and fails CLOSED: no token in the
 * environment and every request 404s, so a misconfigured deploy hides the page
 * rather than exposing it. Falls back to BRIEF_TOKEN so the page works on the
 * existing deploy without a new environment variable.
 *
 * On the gate, honestly: a token in a query string is obscurity, not security.
 * That is acceptable here for the same reason it is on /brief — but this page
 * carries the client count and eleven people's names and affiliations, so the
 * standing rule is stricter than /brief's: NO CONTACT DETAILS, EVER. A forwarded
 * roster with eleven email addresses on it is a list somebody else can work.
 */

export const metadata: Metadata = {
  title: "Advisory board update",
  robots: { index: false, follow: false, nocache: true },
}

export const revalidate = 300

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>
}) {
  const expected = process.env.BOARD_TOKEN || process.env.BRIEF_TOKEN
  const { k } = await searchParams
  if (!expected || k !== expected) notFound()

  const multiple = (UPTICK.last30 / UPTICK.prior30).toFixed(1)

  return (
    <main className="min-h-screen bg-surface-default">
      {/* ── Band one: the whole position, above the fold ─────────── */}
      <header className="bg-surface-inverse">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-14">
          <p className="eyebrow text-text-on-dark-soft">
            AI Foundry · BYU Marriott · Advisory board update, August 2026
          </p>
          <h1 className="mt-5 max-w-[26ch] font-serif text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.02em] text-text-on-inverse md:text-[2.7rem]">
            One summer took the Foundry from a pilot to a working studio.
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
        {/* ── Band two: the curve, and what the summer produced ───── */}
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
              against {UPTICK.prior30} in the 30 before, {multiple}× the rate,
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
            <p className="eyebrow text-text-meta">What the summer produced</p>
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

        {/* ── Band three: the year ahead ──────────────────────────── */}
        <section className="pt-14">
          <p className="eyebrow text-text-meta">The year ahead</p>
          <h2 className="mt-2 max-w-[34ch] font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-text-primary md:text-[1.9rem]">
            Everything this year serves one outcome: becoming an official BYU
            learning business.
          </h2>
          <p className="mt-3 max-w-[46rem] text-[0.95rem] leading-relaxed text-text-meta">
            Five pillars carry it. None of them has an invented date, because a
            roadmap that schedules things nobody has committed to is the same
            failure as a budget nobody has costed.
          </p>

          <ol className="mt-7 grid list-none gap-x-10 gap-y-0 p-0 md:grid-cols-2">
            {PHASES.map((p, i) => (
              <li
                key={p.name}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-t border-border-subtle py-4"
              >
                <span className="stat text-[1.3rem] leading-none tabular-nums text-text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[0.95rem] font-medium leading-snug text-text-primary">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] font-medium text-text-accent">
                    {p.goal}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-snug text-text-meta">
                    {p.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 border-2 border-border-accent p-6 md:p-7">
            <p className="eyebrow text-text-accent">This semester specifically</p>
            <ul className="mt-3 grid list-none gap-x-10 gap-y-2 p-0 md:grid-cols-2">
              {SEMESTER.map((s) => (
                <li
                  key={s}
                  className="text-[0.92rem] leading-snug text-text-primary before:mr-2 before:text-text-accent before:content-['→']"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Band four: the gaps. Asks first, our own debt second. ─ */}
        <section className="pt-14">
          <p className="eyebrow text-text-meta">The gaps</p>
          <h2 className="mt-2 max-w-[30ch] font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-text-primary md:text-[1.9rem]">
            What we are missing, and which half of it is yours.
          </h2>

          <div className="mt-7 grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div>
              <p className="eyebrow text-text-accent">Where we need the board</p>
              <ul className="mt-3 list-none border-t border-border-strong p-0">
                {ASKS.map((g) => (
                  <li key={g.title} className="border-b border-border-subtle py-4">
                    <p className="text-[0.95rem] font-medium leading-snug text-text-primary">
                      {g.title}
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-text-meta">
                      {g.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-text-meta">What we are behind on ourselves</p>
              <ul className="mt-3 list-none border-t border-border-strong p-0">
                {EXECUTION.map((g) => (
                  <li key={g.title} className="border-b border-border-subtle py-4">
                    <p className="text-[0.92rem] font-medium leading-snug text-text-primary">
                      {g.title}
                    </p>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-text-meta">
                      {g.detail}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.78rem] leading-snug text-text-meta">
                This column is here on purpose. A board update that shows only
                the asks is a fundraising letter.
              </p>
            </div>
          </div>
        </section>

        {/* ── Band five: who is in the room ───────────────────────── */}
        <section className="pt-14">
          <p className="eyebrow text-text-meta">The board</p>
          <h2 className="mt-2 max-w-[32ch] font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-text-primary md:text-[1.9rem]">
            Eleven advisors. The target for the year was five.
          </h2>
          <p className="mt-3 max-w-[46rem] text-[0.95rem] leading-relaxed text-text-meta">
            Venture, enterprise consulting, AI infrastructure, governance,
            entrepreneurship and faculty. Most of you have not met each other
            yet, which is what the founding board meeting is for.
          </p>

          <ul className="mt-7 grid list-none gap-x-10 gap-y-0 p-0 md:grid-cols-2">
            {BOARD.map((a) => (
              <li key={a.name} className="border-t border-border-subtle py-4">
                <p className="text-[0.98rem] font-semibold leading-snug text-text-primary">
                  {a.name}
                </p>
                <p className="mt-0.5 text-[0.82rem] font-medium text-text-accent">
                  {a.org}
                </p>
                <p className="mt-1 text-[0.85rem] leading-snug text-text-meta">
                  {a.brings}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Band six: the close ─────────────────────────────────── */}
        <section className="pt-14 pb-16">
          <div className="bg-surface-inverse p-8 md:p-10">
            <p className="eyebrow text-text-on-dark-soft">Why you</p>
            <h2 className="mt-3.5 max-w-[24ch] font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-text-on-inverse md:text-[2rem]">
              {CLOSE.heading}
            </h2>
            <div className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
              <p className="text-[0.95rem] leading-relaxed text-text-on-dark-body">
                {CLOSE.body}
              </p>
              <p className="text-[0.95rem] leading-relaxed text-text-on-inverse">
                {CLOSE.ask}
              </p>
            </div>
          </div>
          <p className="mt-5 text-[0.78rem] leading-relaxed text-text-meta">
            Cohort, client and project counts are current as of 26 August and run
            ahead of the pipeline tracker. Network count read from our own
            database. Follower series from the LinkedIn Analytics export through
            24 August. No gift amounts appear on this page, per the standing rule
            on our donors page, and no contact details appear for any advisor.
            Not linked from the site and excluded from search indexing.
          </p>
        </section>
      </div>
    </main>
  )
}
