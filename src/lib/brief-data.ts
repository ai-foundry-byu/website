/**
 * The AI Foundry standing report — a one-page executive view.
 *
 * Built to be read in under a minute by someone who will not scroll twice: the
 * numbers, the growth curve behind them, the gift that funded the year, what
 * the year ahead costs, and the one thing still open.
 *
 * Sourcing rules:
 *  1. Anything the database can answer is read live or charted from real rows.
 *  2. Every constant carries a source. A stale figure that announces its age is
 *     a fact the reader can discount; a stale figure presented as live is a lie
 *     with a timestamp on it.
 *  3. No number is invented. Where a figure is not yet scoped, it says so —
 *     see NEEDS, where two of three lines are deliberately uncosted.
 */

/* ────────────────────────────────────────────────────────────
   HEADLINE
   ──────────────────────────────────────────────────────────── */

export type Win = { value: string; label: string }

/**
 * Cohort, clients and projects are JD's count as of 2026-08-26 and are ahead of
 * the pipeline sheet in the Foundry Drive, which still reads 18 prospects and 0
 * accepted from 13 August. Followers from the LinkedIn export (below); network
 * from our own database.
 */
export const WINS: Win[] = [
  { value: "31", label: "builders in Cohort One" },
  { value: "3", label: "paying clients" },
  { value: "12", label: "projects booked" },
  { value: "197", label: "LinkedIn followers" },
  { value: "150", label: "in the network" },
]

/* ────────────────────────────────────────────────────────────
   THE GROWTH CURVE
   ──────────────────────────────────────────────────────────── */

export type Point = { week: string; value: number }

/**
 * Cumulative LinkedIn followers, weekly, from the LinkedIn Analytics export
 * `ai-foundry-byu_followers` covering 2026-05-27 to 2026-08-24. The export gives
 * daily NEW followers; these are the running totals.
 *
 * The June step is the launch announcement. What matters is the right-hand
 * third: the curve steepens through August rather than flattening after the
 * launch spike, which is the opposite of what a page that has run out of things
 * to say looks like.
 */
export const LINKEDIN_GROWTH: Point[] = [
  { week: "2026-05-25", value: 0 },
  { week: "2026-06-01", value: 53 },
  { week: "2026-06-08", value: 72 },
  { week: "2026-06-15", value: 74 },
  { week: "2026-06-22", value: 85 },
  { week: "2026-06-29", value: 94 },
  { week: "2026-07-06", value: 97 },
  { week: "2026-07-13", value: 108 },
  { week: "2026-07-20", value: 119 },
  { week: "2026-07-27", value: 135 },
  { week: "2026-08-03", value: 160 },
  { week: "2026-08-10", value: 173 },
  { week: "2026-08-17", value: 191 },
  { week: "2026-08-24", value: 192 },
]

/**
 * The headline the chart exists to make. Both halves computed from the same
 * export: 75 new followers in the trailing 30 days against 33 in the 30 before
 * it. Not a rounded "more than doubled" — the actual multiple.
 */
export const UPTICK = {
  last30: 75,
  prior30: 33,
  /** Followers today, ahead of the export's 2026-08-24 cutoff. */
  today: 197,
} as const

/* ────────────────────────────────────────────────────────────
   MILESTONES
   ──────────────────────────────────────────────────────────── */

export const MILESTONES = [
  {
    title: "Two product case competitions booked",
    detail: "One national, one at BYU.",
  },
  {
    title: "Official program status",
    detail: "Formal approval from Dan Snow, 2 July. No longer a pilot.",
  },
  {
    title: "Nine-person advisory board",
    detail: "Venture, consulting, faculty, AI governance. Target was five.",
  },
  {
    title: "Public site live on the BYU domain",
    detail: "Rebuilt on the official brand, shipped 23 August.",
  },
  {
    title: "Deals committee running",
    detail: "First working session 19 August.",
  },
]

/* ────────────────────────────────────────────────────────────
   GIVING
   ──────────────────────────────────────────────────────────── */

/**
 * NO GIFT AMOUNTS. Standing rule from /donors: once a larger second gift is
 * listed, implicit magnitudes turn a thank-you into a public ranking with the
 * founding donor at the bottom of the list they started. Say what it is FOR.
 */
export const FOUNDING_DONOR = {
  name: "Tiffany and Ken Palmer",
  fund: "The Tiffany and Ken Palmer Frontier Cohort",
  established: "August 2026",
  detail:
    "The first gift to the AI Foundry, and the reason the cohort has the tooling to ship production software for real clients.",
}

/* ────────────────────────────────────────────────────────────
   WHAT THE YEAR COSTS
   ──────────────────────────────────────────────────────────── */

export type Need = {
  item: string
  /** Formatted amount, or null where the figure is not yet scoped. */
  amount: string | null
  /** The arithmetic, so a reader can check it rather than trust it. */
  basis: string
}

/**
 * The seat line is fully costed and the arithmetic is shown: 31 builders on
 * Claude Max at the $100/seat/month tier, twelve months. That per-seat price was
 * read off claude.com/pricing on 2026-08-26; the 20x tier costs more, so treat
 * $37,200 as the floor rather than the estimate.
 *
 * The two competition lines are deliberately NOT costed. Nobody has scoped them
 * yet, and a number invented for a page that gets forwarded becomes the anchor
 * for every later conversation whether or not it was ever real. "To be scoped"
 * with the components named is more useful to a donor than a confident guess.
 */
export const NEEDS: Need[] = [
  {
    item: "Claude Max seats for the cohort, one year",
    amount: "$37,200",
    basis: "31 builders × $100/seat/month × 12 months, at the Max 5x tier.",
  },
  {
    item: "National product case competition",
    amount: null,
    basis: "Prize pool, team travel, registration. Not yet scoped.",
  },
  {
    item: "BYU product case competition",
    amount: null,
    basis: "Prize pool, venue and production. Not yet scoped.",
  },
]

/* ────────────────────────────────────────────────────────────
   THE OPEN ASK
   ──────────────────────────────────────────────────────────── */

export const ENDOWMENT = {
  heading: "We need a founding partner for the endowment.",
  body:
    "One year, one founding gift, and everything above. An endowment is what makes it permanent — funding the seats, the competitions and the lab on an ongoing basis instead of a semester at a time.",
  ask: "We are looking for one founding partner to anchor it. That conversation has not started, and it is the most valuable introduction anyone reading this page can make.",
}
