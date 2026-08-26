/**
 * The board brief's non-database numbers.
 *
 * Everything the Supabase tables can answer is read live by `getRoadmapStats`.
 * What lives here is the set of figures whose source of truth is a Google Sheet
 * in the Foundry Drive, plus the gate targets we committed to in July. Those
 * cannot be queried from this deploy, so they are transcribed with the date
 * they were read on and the sheet they came from.
 *
 * The rule for this file: every number carries `asOf`. A stale figure that
 * announces its own age is a fact the reader can discount. A stale figure
 * presented as live is a lie with a timestamp on it.
 *
 * When a number here starts disagreeing with a live one, the live one wins and
 * the constant gets deleted — do not "reconcile" them into a third number.
 */

/** Fall semester opens. Every gate below was set against this date. */
export const SEMESTER_START = "2026-09-01"

/** The SkillJar course deadline, set independently of the semester date. */
export const CERT_DEADLINE = "2026-09-03"

/**
 * Prospective Clients Pipeline, Foundry Drive → 02 Deals & Clients.
 * Sheet id 1Kl2e9zRiy6HRj29JjY8KVuLLsn7EHVKnHV3rLnL3VI4.
 *
 * `evaluating` is the whole quoted column and it is one deal — Breckenridge at
 * $22,000. Stating it as a portfolio figure would imply a spread that does not
 * exist, so the copy names the client.
 */
export const PIPELINE = {
  asOf: "2026-08-13",
  prospects: 18,
  accepted: 0,
  evaluatingUsd: 22_000,
  collectedUsd: 0,
} as const

/**
 * Certified Claude Architect Tracker, Foundry Drive.
 * Sheet id 1RfFbYEXYb4f-bk9tg2wJVnjEUNcYjB1S1H2Xiq9oRY4.
 *
 * `complete` counts only 4-of-4. `started` counts anyone with at least one
 * course but not all four — currently one person on one course. The gap
 * between `complete + started` and `slots` is the number that matters, and it
 * is seven people who have not opened anything.
 */
export const CERTS = {
  asOf: "2026-08-17",
  slots: 13,
  complete: 5,
  started: 1,
} as const

/**
 * The advisory board, from state/board-payments.yaml — JD's own confirmation
 * record, last corrected by him on 2026-08-02.
 *
 * This deliberately does NOT read the live `advisoryBoard` stat. That count
 * comes from `af_people`, which still carries the pre-August roster and returns
 * three. The live number is wrong and undercounts us; correcting a table that
 * also feeds the public roadmap is a call for JD, not for this page. So the
 * brief cites its source explicitly and the discrepancy is written into the
 * footer rather than papered over.
 *
 * `charters` is zero and is stated every time the headcount is. Ten people who
 * said yes are ten commitments we owe, not ten credentials we hold — the same
 * standard the roadmap applies to a verbal yes.
 */
export const BOARD = {
  asOf: "2026-08-02",
  confirmed: 10,
  charters: 0,
  /** Unpaid since JD's 2026-08-03 call, which removed the modelled seat fees. */
  paid: false,
} as const

export type Member = { name: string; org: string }

/** Ordered by confirmation date, so the reader sees how it was built. */
export const MEMBERS: Member[] = [
  { name: "Johny Wudel", org: "MBA Product, BYU Marriott" },
  { name: "Brian Murphy", org: "Venture capital" },
  { name: "Mark Keith", org: "Information Systems, BYU Marriott" },
  { name: "Aaron Arnoldsen", org: "BCG X" },
  { name: "Spencer Rogers", org: "iHub Utah" },
  { name: "Mike Hendron", org: "Rollins Center, BYU" },
  { name: "Chris Cooper", org: "Pelion Venture Partners" },
  { name: "Tom Peterson", org: "BYU Marriott" },
  { name: "Jason Alleger", org: "QuantXM" },
  { name: "Adjetey “AJ” Wilson", org: "AI Square · Trust & Safety Institute" },
]

/**
 * The five gates set on 2026-07-11 as the bar to clear before fall semester.
 *
 * `state` is deliberately three values and not a colour. A board reading this
 * on a phone should be able to tell met from missed by the shape of the mark,
 * and the palette has no red in it to spend anyway.
 */
export type GateState = "met" | "partial" | "none"

export type Gate = {
  name: string
  detail: string
  target: number
  actual: number
  /** Display override — used where a raw ratio would misread as progress. */
  pct?: number
  state: GateState
  standing: string
}

export const GATES: Gate[] = [
  {
    name: "Advisory board",
    detail:
      "Ten confirmed against a bar of five. Every seat now has a working email on file, three of which were only tracked down this week.",
    target: 5,
    actual: 10,
    pct: 100,
    state: "met",
    standing: "Cleared",
  },
  {
    name: "Certified Claude Architects",
    detail:
      "Four SkillJar courses per member. Five are done, one is a quarter through, and seven have not opened a course.",
    target: CERTS.slots,
    actual: CERTS.complete,
    state: "partial",
    standing: `Hard deadline ${CERT_DEADLINE}`,
  },
  {
    name: "Foundry network",
    detail:
      "The list is real but it stopped growing on 28 July, and sixty of the names arrived through the jobs-board gate rather than through the Foundry.",
    target: 200,
    actual: 132,
    state: "partial",
    standing: "Flat for four weeks",
  },
  {
    name: "Signed project contracts",
    detail:
      "Eighteen named prospects and one live inbound request. No scope call is currently booked with any of them.",
    target: 20,
    actual: 0,
    state: "none",
    standing: "Not started",
  },
  {
    name: "Founding partner",
    detail:
      "The only gate with no owner other than JD and no candidate in a live conversation.",
    target: 1,
    actual: 0,
    state: "none",
    standing: "Not started",
  },
]

export const MOVED = [
  {
    title: "The first gift landed.",
    detail:
      "Tiffany and Ken Palmer are the AI Foundry's founding donor, established August 2026. The Tiffany and Ken Palmer Frontier Cohort funds enterprise AI tooling for the student builders who ship client work. Their consent to be named is on file.",
  },
  {
    title: "The public site is live and rebuilt.",
    detail:
      "The new design system shipped on 23 August, a donors page went up on the 25th, and the bot challenge that briefly blocked the domain has cleared.",
  },
  {
    title: "Official program status.",
    detail: "Dan Snow gave formal approval on 2 July. The pilot is no longer a pilot.",
  },
  {
    title: "The board went from three to ten.",
    detail:
      "Five seats added on 2 August, spanning venture, consulting, faculty and AI governance.",
  },
  {
    title: "A deals committee now exists.",
    detail:
      "First working session 19 August. Alex owns the scoping and discovery process, Brandon owns training the team to pitch.",
  },
]

export const STUCK = [
  {
    title: "A paying lead has been waiting a month.",
    detail:
      "Cyrus Health asked for clinical decision-support work on 25 July through this site. Nobody has opened it.",
  },
  {
    title: "Cohort applications are untriaged.",
    detail:
      "Mostly BYU students, arriving steadily through July, with Cohort Two recruiting about to stack on top of them.",
  },
  {
    title: "Ten advisors, zero charters.",
    detail:
      "No signed agreement and no agreed terms for any seat — including one member who said yes in June and has still never received a written invitation.",
  },
  {
    title: "The network stopped growing.",
    detail: "No new members since 28 July. Nothing is currently feeding it.",
  },
]

export const DECISIONS = [
  {
    title: "Answer Cyrus Health, and set the rule for next time.",
    owner: "Deals committee",
    body:
      "One real inbound request has sat untouched for a month. Replying is a ten-minute job. The durable fix is deciding who owns that inbox and what the response clock is, because today the answer to both is nobody.",
  },
  {
    title: "Decide whether the certification deadline is real.",
    owner: "JD",
    body:
      "Seven of thirteen have not started and the deadline is 3 September. Either it holds and those seven are told plainly this week, or it moves and we say so. Letting it lapse quietly is the one option that costs us credibility with the board that vouched for this.",
  },
  {
    title: "Convert three prospects into booked scope calls.",
    owner: "Alex, Corbin, Brandon",
    body:
      "Eighteen names, twenty needed, zero calls booked. Scenthound, DVL Group and New Frontier Capital are already warm and each has a Foundry member attached. Booking them is what turns a list into a funnel.",
  },
]
