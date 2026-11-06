/**
 * The AI Foundry advisory board update — a one-page view for the people who
 * advise the program.
 *
 * This is NOT /brief. That page is written for a donor and ends in an endowment
 * ask; this one is written for an advisor and ends in a list of things only they
 * can do. Board seats carry no fee, so nothing here asks a reader for money. It
 * asks for judgment and introductions.
 *
 * The content itself is NOT in this repository. It lives in the Supabase table
 * af_private_pages (slug "board"), read server-side by src/lib/private-pages.ts
 * and loaded from private/board.json by scripts/push-private-pages.mjs. This
 * file holds the shape only (security audit F3). This repo is public: never
 * write a figure, a client name, a Drive id or a person's name into it.
 *
 * Sourcing rules, inherited from brief-data.ts and binding here too:
 *  1. Anything the database can answer is read live or charted from real rows.
 *  2. Every constant carries a source. A stale figure that announces its age is
 *     a fact the reader can discount; a stale figure presented as live is a lie
 *     with a timestamp on it.
 *  3. No number is invented. Where a figure is not yet scoped, it says so.
 *  4. Nothing goes on this page that the org's own records cannot back. Where a
 *     claim and the records disagree, the comment above it names both and cites
 *     the file. Rules 3 and 4 are why this page can be forwarded.
 *
 * Rule 4 is load-bearing on WINS. The reconciliation behind it lives in the
 * private domain state, never here.
 */

/** A headline figure and what it counts. */
export type Win = { value: string; label: string }

/** One weekly point on the cumulative follower curve. */
export type Point = { week: string; value: number }

/** The recent-growth comparison the chart exists to make. */
export type Uptick = { last30: number; prior30: number; today: number }

export type Milestone = { title: string; detail: string }

export type Phase = {
  name: string
  goal: string
  detail: string
}

/**
 * ASKS are things the board can move and we cannot. EXECUTION is our own debt,
 * listed anyway. Both lists are honest or neither is worth sending.
 */
export type Gap = { title: string; detail: string }

/** The closing panel. */
export type Close = { heading: string; body: string; ask: string }

/** Names and affiliations only. No contact details, ever. */
export type Advisor = { name: string; org: string; brings: string }

/** Page copy that carries dates or figures, kept out of the JSX. */
export type BoardNotes = {
  eyebrow: string
  /** Tail of the growth sentence, after the multiple. */
  upticktail: string
  chartSource: string
  phasesIntro: string
  boardHeading: string
  footer: string
}

/** Everything /board renders. One key per block. */
export type BoardData = {
  WINS: Win[]
  LINKEDIN_GROWTH: Point[]
  UPTICK: Uptick
  MILESTONES: Milestone[]
  PHASES: Phase[]
  SEMESTER: string[]
  ASKS: Gap[]
  EXECUTION: Gap[]
  CLOSE: Close
  BOARD: Advisor[]
  NOTES: BoardNotes
}
