/**
 * The AI Foundry standing report — a one-page executive view.
 *
 * Built to be read in under a minute by someone who will not scroll twice: the
 * numbers, the growth curve behind them, the gift that funded the year, what
 * the year ahead costs, and the one thing still open.
 *
 * The content itself is NOT in this repository. It lives in the Supabase table
 * af_private_pages (slug "brief"), read server-side by src/lib/private-pages.ts
 * and loaded from private/brief.json by scripts/push-private-pages.mjs. This
 * file holds the shape only (security audit F3).
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

/** A headline figure and what it counts. */
export type Win = { value: string; label: string }

/** One weekly point on the cumulative follower curve. */
export type Point = { week: string; value: number }

/** The recent-growth comparison the chart exists to make. */
export type Uptick = { last30: number; prior30: number; today: number }

export type Milestone = { title: string; detail: string }

/** The founding gift. Says what it is for, never an amount. */
export type FoundingDonor = {
  name: string
  fund: string
  established: string
  detail: string
}

export type Need = {
  item: string
  /** Formatted amount, or null where the figure is not yet scoped. */
  amount: string | null
  /** The arithmetic, so a reader can check it rather than trust it. */
  basis: string
}

/** The one open ask at the bottom of the page. */
export type Endowment = { heading: string; body: string; ask: string }

/** Page copy that carries dates or figures, kept out of the JSX. */
export type BriefNotes = {
  eyebrow: string
  /** Tail of the growth sentence, after the multiple. */
  upticktail: string
  chartSource: string
  pricingNote: string
  footer: string
}

/** Everything /brief renders. One key per block. */
export type BriefData = {
  WINS: Win[]
  LINKEDIN_GROWTH: Point[]
  UPTICK: Uptick
  MILESTONES: Milestone[]
  FOUNDING_DONOR: FoundingDonor
  NEEDS: Need[]
  ENDOWMENT: Endowment
  NOTES: BriefNotes
}
