/**
 * The AI Foundry advisory board update — a one-page view for the eleven people
 * who advise the program.
 *
 * This is NOT /brief. That page is written for a donor and ends in an endowment
 * ask; this one is written for an advisor and ends in a list of things only they
 * can do. Board seats carry no fee (JD, 2026-08-03), so nothing here asks a
 * reader for money. It asks for judgment and introductions.
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
 * Rule 4 is load-bearing on WINS below. Read it before editing that array.
 */

/* ────────────────────────────────────────────────────────────
   THE YEAR SO FAR
   ──────────────────────────────────────────────────────────── */

export type Win = { value: string; label: string }

/**
 * SOURCING NOTE — THIS REPO IS PUBLIC. Read this before adding a comment here.
 *
 * The client and project counts are JD's, carried forward from 2026-08-26 and
 * ruled on by him on 2026-08-27. The org's own trackers report a lower figure.
 * The full reconciliation — which records, which numbers, which client, and the
 * reasoning behind the ruling — lives in the PRIVATE domain state, at
 * `~/clawd/domains/ai-foundry/state/board-update-emails-2026-08-27.md`.
 *
 * It is deliberately NOT written out here, and neither is any client name,
 * Drive document id, or contract status. Everything in this file is world
 * readable at raw.githubusercontent.com. A provenance comment that is candid
 * about a disputed number is exactly right in a private state file and exactly
 * wrong in a public repository.
 *
 * Advisors: 11, from the private board roster as of 2026-08-27. NOTE that the
 * public /roadmap will say fewer, because roadmap-stats.ts counts only rows
 * carrying a written confirmation. Both numbers are defensible and they measure
 * different things. Do not "fix" one to match the other without deciding which
 * standard the org actually uses.
 */
export const WINS: Win[] = [
  { value: "31", label: "builders in Cohort One" },
  { value: "3", label: "paying clients" },
  { value: "12", label: "projects booked" },
  { value: "11", label: "advisors seated" },
  { value: "197", label: "LinkedIn followers" },
]

/* ────────────────────────────────────────────────────────────
   THE GROWTH CURVE
   ──────────────────────────────────────────────────────────── */

export type Point = { week: string; value: number }

/**
 * Cumulative LinkedIn followers, weekly, from the LinkedIn Analytics export
 * `ai-foundry-byu_followers` covering 2026-05-27 to 2026-08-24. The export gives
 * daily NEW followers; these are the running totals. Same series as /brief.
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

/** Both halves computed from the same export: 75 new in the trailing 30 days
 *  against 33 in the 30 before it. Not a rounded "more than doubled". */
export const UPTICK = { last30: 75, prior30: 33, today: 197 } as const

/* ────────────────────────────────────────────────────────────
   WHAT THE SUMMER PRODUCED
   ──────────────────────────────────────────────────────────── */

export type Milestone = { title: string; detail: string }

/**
 * Every line here is receipted. The two that are NOT on this list, and why:
 *
 *  · "Two case competitions booked, one national." Removed from /brief on
 *    2026-08-26 after a hunt came back empty: the org's own planning dossier
 *    describes one competition plus a hackathon, not two competitions. It goes
 *    back the day the second one has a name.
 *  · Claude Certified Architect cohort certification. Zero of ten have passed,
 *    so it is a gap below, not a win here. voice.md's standing rule is that
 *    students "pursue" the certification and it becomes a claim only once
 *    somebody holds it.
 */
export const MILESTONES: Milestone[] = [
  {
    title: "Official program status",
    detail:
      "Formal approval from Dan Snow on 2 July. The Foundry is no longer a pilot.",
  },
  {
    title: "Advisory board seated, at more than twice the target",
    detail:
      "Eleven advisors across venture, consulting, AI infrastructure, governance and faculty. The target for the year was five.",
  },
  {
    title: "First founding gift",
    detail:
      "The Tiffany and Ken Palmer Frontier Cohort, established August 2026. It is why the cohort has the tooling to ship production software.",
  },
  {
    title: "Public site live on the BYU domain",
    detail:
      "aifoundry.byu.edu, rebuilt on the official brand and shipped 23 August, with the project intake form running into our own database.",
  },
  {
    title: "Anthropic Claude Partner Network",
    detail:
      "Member since 29 July. We build on the same frontier tooling we train client teams to use.",
  },
  {
    title: "Deals committee running",
    detail: "First working session 19 August. Intake, scoping and staffing now have an owner.",
  },
  {
    title: "Product case competition under way with the MBA office",
    detail:
      "Owner named 18 August, scoped with Dan Snow on the 20th. Targeting 30 September to 15 October.",
  },
  {
    title: "Cohort One staffed and building",
    detail:
      "31 builders across the MBA, the MISM and the undergraduate programs, working in pods matched to each project.",
  },
]

/* ────────────────────────────────────────────────────────────
   THE YEAR AHEAD
   ──────────────────────────────────────────────────────────── */

export type Phase = {
  name: string
  goal: string
  detail: string
}

/**
 * The five conversion pillars from domain state/goals.yaml, plus the semester
 * objectives underneath them. The quarterly goal that governs all five is
 * "Convert the AI Foundry pilot into an OFFICIAL BYU LDB" — that is the year's
 * defining outcome and everything below is instrumental to it.
 *
 * Deliberately no dates on the pillars beyond the ones the org has actually
 * committed to. A roadmap that invents quarters for things nobody has scheduled
 * is the same failure as inventing a budget.
 */
export const PHASES: Phase[] = [
  {
    name: "Network and presence",
    goal: "200 people",
    detail:
      "132 today. The base that makes the program credible to a company deciding whether to send us real work.",
  },
  {
    name: "A self-sustaining project pipeline",
    goal: "~225 projects a year",
    detail:
      "The volume an official learning business has to sustain to justify itself. Today the constraint is conversion, not interest.",
  },
  {
    name: "A talent destination",
    goal: "Inbound recruiting",
    detail:
      "Thought leadership positioned so that frontier AI companies come to BYU for builders rather than us going to them.",
  },
  {
    name: "A yearly BYU AI conference",
    goal: "First edition in 2027",
    detail:
      "Run by the Foundry, not attended by it. This is what makes us an educational institution inside BYU rather than a project shop.",
  },
  {
    name: "A founding partner",
    goal: "One endowment gift",
    detail:
      "One founding gift that funds the seats, the competitions and the lab on an ongoing basis instead of a semester at a time.",
  },
]

/** What lands this semester specifically, from goals.yaml semester_objectives. */
export const SEMESTER: string[] = [
  "Every builder ships two to three real client projects",
  "The Foundry Lab launches",
  "A semester events series: AI education plus recruiting",
  "Ten builders certified as Claude Architects",
]

/* ────────────────────────────────────────────────────────────
   THE GAPS
   ──────────────────────────────────────────────────────────── */

export type Gap = { title: string; detail: string }

/**
 * Split deliberately into two lists.
 *
 * ASKS are things the board can actually move and we cannot. EXECUTION is our
 * own debt, listed anyway. A board update that shows only the asks reads as a
 * fundraising letter; showing what we are behind on is what makes the asks
 * credible. Both lists are honest or neither is worth sending.
 */
export const ASKS: Gap[] = [
  {
    title: "Client introductions",
    detail:
      "Eighteen prospects in the pipeline and the constraint is converting interest into signed work, not generating interest. One warm introduction to a company with real AI work is worth more to us right now than any amount of marketing.",
  },
  {
    title: "A founding partner for the endowment",
    detail:
      "One founding gift makes the program permanent. That conversation has not started, and it is the single most valuable introduction anyone reading this page can make.",
  },
  {
    title: "Case competition sponsorship",
    detail:
      "The competition is scoped with the MBA office for late September. Funding was offered and never closed, and the prize pool, venue and production are genuinely uncosted rather than quietly assumed.",
  },
  {
    title: "Judgment on what we teach",
    detail:
      "One to two curriculum pivots a year, driven by what you are seeing in the market rather than what we guess from inside a university. If agents are table stakes by December, we would rather hear it from you in October.",
  },
]

export const EXECUTION: Gap[] = [
  {
    title: "Zero of ten certified",
    detail:
      "Nobody has completed the Claude Certified Architect track yet, with the semester starting. Ours to fix, and the first cohort of passes is a Q4 milestone.",
  },
  {
    title: "Cohort applications waiting on us",
    detail:
      "Real applications have arrived faster than we have screened them. Every one of those is a student waiting on a reply, and clearing the queue is the first week's work.",
  },
  {
    title: "Contracts, not conversations",
    detail:
      "The pipeline is healthy and the signature rate is not. We are treating the engagement letter and the intake-to-signature path as an operating problem, not a sales one.",
  },
]

/* ────────────────────────────────────────────────────────────
   THE CLOSE
   ──────────────────────────────────────────────────────────── */

export const CLOSE = {
  heading: "You are the first board this program has ever had.",
  body:
    "Everything above happened in one summer, and most of it happened because somebody on this list made an introduction or told us we were wrong about something. The program is real now: official status, a first gift, a public site, a cohort that ships.",
  ask: "What we need from you this year is not time in meetings. It is the introduction you can make that we cannot, and the correction you can make early enough to matter.",
} as const

/* ────────────────────────────────────────────────────────────
   THE BOARD ITSELF
   ──────────────────────────────────────────────────────────── */

export type Advisor = { name: string; org: string; brings: string }

/**
 * All eleven, from domain state/board-payments.yaml as of 2026-08-27.
 *
 * NO CONTACT DETAILS, EVER. Same standing rule as /brief: this page gets
 * forwarded, and a board roster with eleven email addresses on it is a list
 * somebody else can work. Names and affiliations only. The charter promises
 * members "listing on the AI Foundry website and annual program materials",
 * which is exactly this and nothing more.
 *
 * Two seats still need their paperwork closed before this page circulates.
 * Which two, and why, is tracked in the private domain state rather than here:
 * this repo is public, and a note about where a named person's paperwork stands
 * is not something to publish about them.
 *
 * Affiliations are what the records support and nothing more. Brian Murphy's
 * firm is not named in any record we hold, so his line says "Venture capital"
 * rather than a guess.
 */
export const BOARD: Advisor[] = [
  {
    name: "Aaron Arnoldsen",
    org: "BCG X",
    brings: "Enterprise AI strategy and delivery at consulting scale",
  },
  {
    name: "Chris Cooper",
    org: "Pelion Venture Partners",
    brings: "Venture perspective and portfolio access",
  },
  {
    name: "Mike Hawkins",
    org: "Limitless",
    brings:
      "Power infrastructure for AI data centers, working closely with OpenAI and Anthropic",
  },
  {
    name: "Mike Hendron",
    org: "BYU Rollins Center for Entrepreneurship",
    brings: "Entrepreneurship and the campus founder network",
  },
  {
    name: "Mark Keith",
    org: "BYU Marriott, Information Systems",
    brings: "Faculty partnership, and teaches the first-year AI fluency course",
  },
  {
    name: "Brian Murphy",
    org: "Venture capital",
    brings: "Market validation and a hiring channel through portfolio companies",
  },
  {
    name: "Tom Peterson",
    org: "BYU Marriott",
    brings: "Institutional standing inside the school",
  },
  {
    name: "Spencer Rogers",
    org: "iHub Utah",
    brings: "Technology transfer and commercialisation, formerly BYU and LSU",
  },
  {
    name: "Jason Alleger",
    org: "QuantXM",
    brings: "Project referrals and applied analytics",
  },
  {
    name: "Adjetey Wilson",
    org: "AI Square / AI Trust and Safety Institute",
    brings: "AI governance, and a proposed BYU founding chapter",
  },
  {
    name: "Johny Wudel",
    org: "JobNimbus",
    brings: "Product leadership, and teaches the BYU MBA product class",
  },
]
