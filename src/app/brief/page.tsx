import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRoadmapStats } from "@/lib/roadmap-stats"
import {
  CERTS,
  DECISIONS,
  GATES,
  MEMBERS,
  MOVED,
  PIPELINE,
  SEMESTER_START,
  CERT_DEADLINE,
  STUCK,
  type Gate,
} from "@/lib/brief-data"

/**
 * The standing report we send the advisory board. NOT linked from anywhere.
 *
 * Ten people accepted a seat and have received nothing since. This is the page
 * that fixes that, and it is written for them rather than for us: it opens on
 * the gates we said we would clear, it names what is stuck before what shipped,
 * and it ends in three decisions rather than a status dump. A board update that
 * asks for nothing is a newsletter.
 *
 * Why this is gated rather than public: it carries a zero next to "signed
 * contracts" and a zero next to "collected". Those are true and the board must
 * see them; a prospective client reading them on an open URL is the most
 * expensive sentence this program could publish about itself. Same reasoning
 * as /ops, same fail-closed gate, its own token so the two can be shared
 * independently.
 *
 * On the gate, honestly: a token in a query string is obscurity, not security.
 * It leaks through referrers, history, and any log that records full URLs. That
 * is an acceptable trade for figures that are embarrassing rather than
 * sensitive. Nothing here is private about a person — the roster is names and
 * employers, no contact details. Keep it that way.
 */

export const metadata: Metadata = {
  title: "Standing report",
  robots: { index: false, follow: false, nocache: true },
}

export const revalidate = 300

const money = (n: number) =>
  n === 0 ? "$0" : `$${(n / 1000).toFixed(0)}K`

const dayjs = (iso: string, from: Date) =>
  Math.max(0, Math.ceil((new Date(iso + "T00:00:00Z").getTime() - from.getTime()) / 86_400_000))

export default async function BriefPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>
}) {
  // Its own token when one is set, so the brief and the operating view can be
  // shared to different people. Falls back to OPS_TOKEN so a deploy that has
  // not had BRIEF_TOKEN added yet still works for whoever already holds the
  // internal link. Both unset still 404s — the fallback loosens who can read
  // it, never whether the gate exists.
  const expected = process.env.BRIEF_TOKEN || process.env.OPS_TOKEN
  const { k } = await searchParams
  if (!expected || k !== expected) notFound()

  const stats = await getRoadmapStats()
  // Live, not hardcoded — see BOARD in brief-data. Falls back to the roster we
  // actually print, so the sentence and the list can never disagree.
  const advisors = stats.advisoryBoard ?? MEMBERS.length
  const toSemester = dayjs(SEMESTER_START, stats.readAt)
  const toCerts = dayjs(CERT_DEADLINE, stats.readAt)

  return (
    <main className="min-h-screen bg-surface-default">
      {/* ── Masthead. The thesis, not a title bar. ─────────────────── */}
      <header className="bg-surface-inverse">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
          <p className="eyebrow text-text-on-dark-soft">
            AI Foundry · BYU Marriott · Standing report
          </p>
          <h1 className="mt-5 max-w-[15ch] font-serif text-3xl font-semibold leading-[1.06] tracking-[-0.015em] text-text-on-inverse md:text-[2.9rem]">
            The machine is built. The revenue is not.
          </h1>
          <p className="mt-5 max-w-[52rem] text-base leading-relaxed text-text-on-dark-body">
            Cohort One opens next week. The program, the brand, the site, the
            board and the deals committee all exist, and the first gift has
            landed. What does not yet exist is a single signed client, a
            founding partner, or a dollar of client revenue. This is the honest
            state of play and the three decisions that need to land this week.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-border-on-inverse pt-6">
            <Countdown n={toSemester} label={`days to Cohort One · ${SEMESTER_START}`} />
            <Countdown n={toCerts} label={`days to the certification deadline · ${CERT_DEADLINE}`} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6">
        {/* ── The four numbers a board member should leave with. ───── */}
        <div className="grid grid-cols-2 border-b border-border-subtle lg:grid-cols-4">
          <Figure
            v={String(advisors)}
            label="advisors confirmed"
            note="against a target of five"
          />
          <Figure
            v={String(PIPELINE.prospects)}
            label="prospects in the pipeline"
            note="none converted to clients"
          />
          <Figure
            v={money(PIPELINE.collectedUsd)}
            label="client revenue collected"
            note={`${money(PIPELINE.evaluatingUsd)} quoted to one client`}
          />
          <Figure
            v={stats.applications == null ? "—" : String(stats.applications)}
            label="cohort applications"
            note={
              stats.applicationsUntriaged == null
                ? "seeded test rows excluded"
                : `${stats.applicationsUntriaged} never triaged`
            }
            last
          />
        </div>

        {/* ── The gates. This is the spine of the page. ────────────── */}
        <section className="pt-14">
          <p className="eyebrow text-text-meta">The commitment we made in July</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary">
            Five gates were due before fall semester. One cleared.
          </h2>
          <p className="mt-3 max-w-[46rem] text-base leading-relaxed text-text-meta">
            These were set on 11 July as the pre-semester bar. The pattern
            matters more than any single row: everything that depended only on
            this team organising itself has moved, and everything that depends
            on someone outside the room saying yes has not.
          </p>

          {/* Phones get cards, not a sideways-scrolling table. The numbers ARE
              the content here, and a scroller hides them off the right edge —
              a board member reading this on a phone would see five gate names
              and no scores at all. */}
          <div className="mt-8 border-t border-border-strong md:hidden">
            {GATES.map((g) => (
              <GateCard key={g.name} g={g} />
            ))}
          </div>

          <div className="mt-8 hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border-strong">
                  <th className="eyebrow py-0 pr-3 pb-3 text-left text-text-meta">Gate</th>
                  <th className="eyebrow pr-3 pb-3 text-right text-text-meta">Target</th>
                  <th className="eyebrow pr-3 pb-3 text-right text-text-meta">Today</th>
                  <th className="eyebrow pb-3 text-left text-text-meta">Standing</th>
                </tr>
              </thead>
              <tbody>
                {GATES.map((g) => (
                  <GateRow key={g.name} g={g} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Moved / stuck, side by side so neither hides. ────────── */}
        <section className="pt-14">
          <p className="eyebrow text-text-meta">Since the last update</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary">
            What moved, and what is quietly stuck.
          </h2>
          <div className="mt-8 grid gap-x-12 md:grid-cols-2">
            <Ledger title="Moved" items={MOVED} />
            <Ledger title="Stuck" items={STUCK} className="mt-10 md:mt-0" />
          </div>
        </section>

        {/* ── The asks. A board update that asks for nothing is a
             newsletter, so the page ends here, not on the roster. ── */}
        <section className="pt-14">
          <p className="eyebrow text-text-meta">Decisions</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary">
            Three things that need to land this week.
          </h2>
          <ol className="mt-8 border-t border-border-strong">
            {DECISIONS.map((d, i) => (
              <li
                key={d.title}
                className="grid gap-x-5 border-b border-border-subtle py-6 md:grid-cols-[2.5rem_minmax(0,1fr)]"
              >
                <span
                  aria-hidden
                  className="stat pt-1 text-lg text-text-meta tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-text-primary">
                    {d.title}
                  </h3>
                  <p className="mt-2 max-w-[46rem] text-base leading-relaxed text-text-primary opacity-80">
                    {d.body}
                  </p>
                  <p className="eyebrow mt-4 inline-block border border-border-subtle px-2 py-1 text-text-meta">
                    Owner · {d.owner}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Roster. Names and employers only, per the gate note. ── */}
        <section className="pt-14">
          <p className="eyebrow text-text-meta">
            Advisory board · {advisors} founding members
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary">
            Who is in the room.
          </h2>
          <p className="mt-3 max-w-[46rem] text-base leading-relaxed text-text-meta">
            All {advisors} confirmed. None have signed a charter and terms are
            unset for every seat — board service became unpaid on 3 August, so
            what remains is the written agreement itself. Tom Peterson supports
            the program as an institutional champion rather than from a seat,
            which is why he is not on this list.
          </p>
          <div className="mt-8 grid gap-x-12 border-t border-border-strong md:grid-cols-2">
            {MEMBERS.map((m) => (
              <div
                key={m.name}
                className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-3"
              >
                <span className="text-base font-medium text-text-primary">{m.name}</span>
                <span className="text-right text-sm text-text-meta">{m.org}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Provenance. Every number's age, and what we are NOT
             claiming. The second paragraph is the important one. ── */}
        <footer className="mt-14 border-t border-border-strong pt-6 pb-16 text-sm leading-relaxed text-text-meta">
          <p className="max-w-[52rem]">
            <strong className="font-semibold text-text-primary">Sources.</strong>{" "}
            Pipeline figures from the Foundry Drive as of {PIPELINE.asOf};
            certification figures as of {CERTS.asOf} ({CERTS.complete} of{" "}
            {CERTS.slots} complete, {CERTS.started} partway). Network,
            application and inbound-request counts read live at{" "}
            {stats.readAt.toISOString()}. Gate targets as set 11 July. Board
            headcount read live from the same roster table the public roadmap
            uses, so this page and that one cannot drift apart.
          </p>
          <p className="mt-3 max-w-[52rem]">
            <strong className="font-semibold text-text-primary">
              Two things this brief does not claim.
            </strong>{" "}
            The network figure counts everyone on the list, including sixty-three
            who arrived through a jobs-board gate rather than through the
            Foundry; it is a softer list than the number suggests. And no gift
            amounts appear anywhere on this page, per the standing rule on
            /donors — once a larger gift is listed, implicit magnitudes turn a
            thank-you into a ranking.
          </p>
          <p className="mt-3">
            Not linked from the site, excluded from search indexing, and gated on
            a token that is obscurity rather than security. Do not put anything
            private about a person on this page.
          </p>
        </footer>
      </div>
    </main>
  )
}

function Countdown({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="stat text-3xl tabular-nums text-text-on-inverse">{n}</span>
      <span className="text-sm text-text-on-dark-soft">{label}</span>
    </div>
  )
}

function Figure({
  v,
  label,
  note,
  last,
}: {
  v: string
  label: string
  note: string
  last?: boolean
}) {
  return (
    <div
      className={`px-5 py-7 ${last ? "" : "lg:border-r lg:border-border-subtle"}`}
    >
      <span className="stat block text-[2.6rem] tabular-nums text-text-primary">
        {v}
      </span>
      <span className="mt-2 block text-sm leading-snug text-text-primary opacity-80">
        {label}
      </span>
      <span className="mt-0.5 block text-sm leading-snug text-text-meta">{note}</span>
    </div>
  )
}

/**
 * Status reads as a shape before it reads as a word: filled square met, half
 * square partial, struck square not started. The palette has four colours and
 * no red, so form carries the signal — which also means it survives being
 * printed, forwarded, or read by someone who does not see colour.
 */
function Mark({ state }: { state: Gate["state"] }) {
  const base = "inline-block h-[0.7rem] w-[0.7rem] shrink-0 border"
  if (state === "met")
    return <span aria-hidden className={`${base} border-navy bg-navy`} />
  if (state === "partial")
    return (
      <span
        aria-hidden
        className={`${base} border-navy`}
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--navy) 0 50%, transparent 50% 100%)",
        }}
      />
    )
  return (
    <span
      aria-hidden
      className={`${base} relative overflow-hidden border-border-strong`}
    >
      <span
        className="absolute left-1/2 top-1/2 h-px w-[1.1rem] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-border-strong"
      />
    </span>
  )
}

function GateBar({ g }: { g: Gate }) {
  const pct = g.pct ?? (g.target > 0 ? Math.min(100, (g.actual / g.target) * 100) : 0)
  return (
    <div
      className="h-[3px] w-full max-w-[13rem] bg-fill-selected"
      role="progressbar"
      aria-valuenow={g.actual}
      aria-valuemin={0}
      aria-valuemax={g.target}
      aria-label={`${g.name}: ${g.actual} of ${g.target}`}
    >
      <div className="ember-bar h-full" style={{ width: `${pct}%` }} />
    </div>
  )
}

function GateCard({ g }: { g: Gate }) {
  return (
    <div className="border-b border-border-subtle py-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-medium text-text-primary">{g.name}</p>
        <p className="font-mono text-sm tabular-nums text-text-primary">
          {g.actual}
          <span className="text-text-meta"> / {g.target}</span>
        </p>
      </div>
      <div className="mt-3">
        <GateBar g={g} />
      </div>
      <span className="mt-3 inline-flex items-center gap-2 text-sm text-text-meta">
        <Mark state={g.state} />
        {g.standing}
      </span>
      <p className="mt-2 text-sm leading-snug text-text-meta">{g.detail}</p>
    </div>
  )
}

function GateRow({ g }: { g: Gate }) {
  return (
    <tr className="border-b border-border-subtle last:border-b-0">
      <td className="py-4 pr-3 align-top">
        <p className="font-medium text-text-primary">{g.name}</p>
        <p className="mt-1 max-w-[34rem] text-sm leading-snug text-text-meta">
          {g.detail}
        </p>
        <div className="mt-3">
          <GateBar g={g} />
        </div>
      </td>
      <td className="py-4 pr-3 text-right align-top font-mono text-sm tabular-nums text-text-meta">
        {g.target}
      </td>
      <td className="py-4 pr-3 text-right align-top font-mono text-sm tabular-nums text-text-primary">
        {g.actual}
      </td>
      <td className="py-4 align-top">
        <span className="inline-flex items-center gap-2 text-sm text-text-meta">
          <Mark state={g.state} />
          {g.standing}
        </span>
      </td>
    </tr>
  )
}

function Ledger({
  title,
  items,
  className = "",
}: {
  title: string
  items: readonly { title: string; detail: string }[]
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className="eyebrow border-b border-border-strong pb-3 text-text-primary">
        {title}
      </h3>
      <ul className="list-none p-0">
        {items.map((it) => (
          <li key={it.title} className="border-b border-border-subtle py-4 last:border-b-0">
            <p className="font-medium text-text-primary">{it.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-meta">{it.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
