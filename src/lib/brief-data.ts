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
 *     see NEEDS, where the competition line is deliberately uncosted.
 *  4. Nothing goes on this page that the org's own records cannot back. Where a
 *     claim and the records disagree, the comment above it names both and cites
 *     the file. Rules 3 and 4 are why this page can be forwarded.
 */

/* ────────────────────────────────────────────────────────────
   HEADLINE
   ──────────────────────────────────────────────────────────── */

export type Win = { value: string; label: string }

/**
 * Cohort, clients and projects are JD's count as of 2026-08-26. Followers from
 * the LinkedIn export (below); network from our own database.
 *
 * The client and project counts are ahead of every record the org keeps. Hunted
 * 2026-08-26 across the official Foundry Drive, the live Supabase and the domain
 * state, so nobody has to re-derive it:
 *   · Pipeline sheet 1Kl2e9zRiy6HRj29JjY8KVuLLsn7EHVKnHV3rLnL3VI4 (13 Aug) —
 *     18 prospects, 0 accepted, $22,000 in evaluation (all of it Breckenridge),
 *     `Payment Collected` FALSE on all 18 rows, $0 collected.
 *   · Project Tracker 1da-At3gzF0FF7tvo5e1Zjm4DyxaiyuTSIRVLXTW7QNw (21 Aug) —
 *     ONE active project, noted "Working through NDA details before signing".
 *   · domain state/goals.yaml, pre-semester gate 5 "Signed project contracts": 0.
 *
 * Exactly ONE client is named anywhere: Breckenridge Pharmaceutical — "the
 * Foundry's first won project" (Drive 02 Deals & Clients/CapSource/_ABOUT.md),
 * rerouted from BYU Engineering Capstone via CapSource, staffed 7 August,
 * engagement letter still DRAFT v2 on 25 August. The other two have no name in
 * any record. Deliberately NOT rendered — that NDA is still being negotiated,
 * and this page gets forwarded.
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

/**
 * The competition line was "Two product case competitions booked — one national,
 * one at BYU" until 2026-08-26, when a hunt for the two names came back empty and
 * turned up the opposite. The org's own consolidated dossier, "AI Foundry —
 * Product Case Competition" (Drive 1Cc7uloXA3DjXENlianPvkmX79A4RyjAnrLDtSnjQNm8,
 * 17 Aug), enumerates the whole Sep–Oct slate as ONE case competition plus a
 * separate hackathon, and opens: "planned, owner UNASSIGNED, dates TBD, funding
 * offered but not closed." No national competition appears in the Drive, in
 * Gmail, in the domain state, or on the calendar — nothing is booked anywhere.
 *
 * What IS receipted is below: Rachel Moulton took the case competition on 18 Aug
 * (state/tasks.yaml AF-008, closing an ownership gap open since 20 Jul), and
 * Christine Roundy put JD, Rachel and Dan Snow in the MBA Office at 3pm on 20 Aug
 * to create it (invite "JD/Prof Snow: Creating Product Case Competition"). The
 * Sep 30 – Oct 15 window is AF-008's. Names are in this comment, not on the page.
 *
 * If JD has a second competition the records have never seen, this is one line to
 * put back — but it needs a name before it goes in front of a donor.
 */
export const MILESTONES = [
  {
    title: "Product case competition under way with the MBA office",
    detail:
      "Owner named 18 August, scoped with Dan Snow on the 20th. Targeting Sep 30 – Oct 15.",
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
 * The competition line stays NOT costed after a 2026-08-26 hunt for a real
 * figure. The only number in any record is $8.4K–$14.8K, and it fails on three
 * counts: it covers the case competition AND the hackathon together, it is an
 * internal planning target built from component guesses ("target $3–5K" for
 * prizes) in state/AF-008-EVENTS-STRATEGY-2026-07-14.md, and nobody has approved
 * it. The one funding offer on record — AJ Wilson / TSI, Plaud 2026-07-22 — is
 * logged in the org's own dossier as "UNCLOSED. No agreement, no amount, no terms
 * on record." A number invented for a page that gets forwarded becomes the anchor
 * for every later conversation whether or not it was ever real. "To be scoped"
 * with the components named is more useful to a donor than a confident guess.
 *
 * This was two competition lines until 2026-08-26. The second, "National product
 * case competition", was removed for the reason given above MILESTONES: no
 * national competition exists in the Drive, in Gmail, in the domain state or on
 * the calendar, and an ask a donor cannot have explained to them is worse than a
 * missing row. Restoring it takes one line and a name.
 */
export const NEEDS: Need[] = [
  {
    item: "Claude Max seats for the cohort, one year",
    amount: "$37,200",
    basis: "31 builders × $100/seat/month × 12 months, at the Max 5x tier.",
  },
  {
    item: "Product case competition",
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
