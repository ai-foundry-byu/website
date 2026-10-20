import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRoadmapStats } from "@/lib/roadmap-stats"
import { CERT_GOAL, CONTRACT_GOAL, CONTRACT_DEADLINE } from "@/lib/content"

/**
 * The internal operating view. NOT linked from anywhere on the site.
 *
 * This exists because the CEO review named a wall metric (signed contracts
 * against the September target) that must not go on the public roadmap. A
 * prospective client reading "0 contracts signed" is the single most
 * expensive sentence this program could publish about itself. So the outward
 * page shows what is true and appropriate, and the shortfall lives here.
 *
 * On the gate, honestly: a token in the query string is obscurity, not
 * security. It leaks through referrers, browser history, and any log that
 * records full URLs. That is an acceptable trade for internal counts that are
 * embarrassing rather than sensitive, and it would NOT be acceptable for
 * anything private about a person. Nothing on this page is.
 *
 * It fails CLOSED. If OPS_TOKEN is unset in the environment, every request
 * 404s, so a misconfigured deploy hides the page rather than exposing it. The
 * response is 404 rather than 403 so the URL does not confirm that it exists.
 */

export const metadata: Metadata = {
  title: "Operating view",
  robots: { index: false, follow: false, nocache: true },
}

export const revalidate = 300

export default async function OpsPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>
}) {
  const expected = process.env.OPS_TOKEN
  const { k } = await searchParams
  if (!expected || k !== expected) notFound()

  const stats = await getRoadmapStats()

  const deadline = new Date(CONTRACT_DEADLINE + "T00:00:00Z")
  const days = Math.max(
    0,
    Math.ceil((deadline.getTime() - stats.readAt.getTime()) / 86_400_000)
  )
  const signed = stats.contractsSigned ?? 0

  return (
    <main className="surface-paper min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="eyebrow text-text-accent">Internal · not public</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.02em] text-text-primary md:text-4xl">
          Operating view
        </h1>
        <p className="mt-3 max-w-[46rem] text-base leading-relaxed text-text-primary opacity-75">
          The numbers the public roadmap deliberately does not carry. Read live
          when this page loaded.
        </p>

        {/* The wall metric. One number, stated at the size of its importance. */}
        <section className="mt-10 border-2 border-border-accent p-8">
          <p className="eyebrow text-text-primary opacity-70">
            The main target
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
            <span className="font-serif text-7xl font-semibold leading-none tabular-nums text-text-accent">
              {signed}
              <span className="text-4xl text-text-primary opacity-40">
                /{CONTRACT_GOAL}
              </span>
            </span>
            <div>
              <p className="font-serif text-2xl font-semibold text-text-primary">
                Signed project contracts
              </p>
              <p className="mt-1 text-base text-text-primary opacity-75">
                {days} days to {CONTRACT_DEADLINE}
              </p>
            </div>
          </div>
          <div
            className="mt-6 h-2 w-full max-w-xl bg-surface-subtle"
            role="progressbar"
            aria-valuenow={signed}
            aria-valuemin={0}
            aria-valuemax={CONTRACT_GOAL}
            aria-label={`Signed contracts: ${signed} of ${CONTRACT_GOAL}`}
          >
            <div
              className="ember-bar h-full"
              style={{
                width: `${Math.min(100, (signed / CONTRACT_GOAL) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-5 max-w-[44rem] text-base leading-relaxed text-text-primary opacity-75">
            Advisory board seats stopped being a paid product on 2026-08-03, which
            removed roughly $33,000 of modelled 2026 revenue. Signed project work is
            now the only path to revenue.
          </p>
        </section>

        {/* Pipeline reality, including what the public number excludes. */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Pipeline
          </h2>
          <div className="mt-5 grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-4">
            <Cell
              v={stats.proposals}
              label="Genuine inbound proposals"
              note="test and self-submitted rows removed"
            />
            <Cell
              v={stats.proposalsExcluded}
              label="Rows excluded as test data"
              note="smoke tests and our own submissions"
            />
            <Cell v={stats.applications} label="Cohort applications" />
            <Cell v={stats.network} label="Network members" />
          </div>
          <p className="mt-4 max-w-[44rem] text-base leading-relaxed text-text-primary opacity-75">
            The public roadmap previously published every row in this table as an
            inbound proposal. One of them is real. Demand is not yet proven, so
            distribution is the constraint, not conversion.
          </p>
        </section>

        {/* Commitments that cost nothing and have not been made. */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Ranked actions, from the CEO review
          </h2>
          <ol className="mt-5 border-t border-border-subtle">
            {ACTIONS.map((a, i) => (
              <li
                key={a.title}
                className="grid gap-x-6 gap-y-2 border-b border-border-subtle py-5 md:grid-cols-[auto_minmax(0,22rem)_minmax(0,1fr)]"
              >
                <span
                  aria-hidden
                  className="font-serif text-2xl font-semibold leading-none text-text-accent"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-text-primary">{a.title}</p>
                  <p className="mt-1 text-sm text-text-primary opacity-60">
                    {a.cost}
                  </p>
                </div>
                <p className="text-base leading-relaxed text-text-primary opacity-80">
                  {a.why}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Credential counts, restated so the gap to the public page is visible. */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Confirmed commitments
          </h2>
          <div className="mt-5 grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-3">
            <Cell
              v={stats.advisoryBoard}
              label="Advisory board confirmed"
              note="Keith, Wudel, Murphy"
            />
            <Cell
              v={stats.foundingPartners}
              label="Founding partners signed"
              note="outreach and invalid rows excluded"
            />
            <Cell
              v={stats.claudeArchCerts}
              label={`Architect certs of ${CERT_GOAL}`}
            />
          </div>
        </section>

        <p className="mt-12 border-t border-border-subtle pt-6 text-sm text-text-primary opacity-60">
          Read {stats.readAt.toISOString()}. Not linked from the site, excluded from
          search indexing, and gated on a token that is obscurity rather than
          security. Do not put anything private about a person on this page.
        </p>
      </div>
    </main>
  )
}

const ACTIONS = [
  {
    title: "Send Aaron Arnoldsen the written board invite",
    cost: "One email · 7 weeks late",
    why: "BCG X Managing Partner. Verbal yes on 2026-06-15, two re-confirms since, invite still unsent. He offered BCG people to teach and chief-AI-officer introductions, both of which are direct paths to signed work before the deadline.",
  },
  {
    title: "Post to #mba_announcements with a hard call to action",
    cost: "One form submission · free",
    why: "119 target-audience MBAs, a daily channel, an open submission form, no gatekeeper. AI Foundry has never appeared in that workspace. Time it to the fall restart.",
  },
  {
    title: "Force AF-001 to a decision, then build what you sign",
    cost: "One decision · one template",
    why: "Fifteen documents, blocked on the same question since 2026-07-13. Then put a contract and an invoice template in the empty Finance folder, because there is currently nothing to sign.",
  },
]

function Cell({
  v,
  label,
  note,
}: {
  v: number | null
  label: string
  note?: string
}) {
  return (
    <div className="bg-surface-default p-6">
      <p className="font-serif text-4xl font-semibold leading-none tabular-nums text-text-primary">
        {v == null ? "—" : v.toLocaleString("en-US")}
      </p>
      <p className="mt-3 text-base text-text-primary">{label}</p>
      {note && (
        <p className="mt-1 text-sm text-text-primary opacity-60">{note}</p>
      )}
    </div>
  )
}
