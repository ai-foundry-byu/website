/**
 * Bay Area Trek, Nov 4-6 2026. The data behind /trek.
 *
 * Copied from the trip plan word for word, with one deliberate exception:
 * every person's name in the source was replaced with that person's role
 * (trip host, Career Services, sign-up contact, AI Foundry). This repo is
 * public and so is the page, so the rule here is the same as /board's and
 * stricter: NO person names, emails, phone numbers or LinkedIn URLs, ever.
 * Contact-level leads live in a private sheet held by the trip leads, and the
 * page says so without linking to it.
 *
 * Company names are plain text. No logos (see the rule in content.ts).
 *
 * To update the trip, edit the values below and bump TRIP.updated.
 */

export type TrekStatus = "Confirmed" | "Likely" | "Potential" | "Proposed" | "Planned" | "Backup"

export type TrekTrip = {
  name: string
  dates: string
  lead: string
  focus: string
  status_note: string
  /** ISO date, rendered as "Updated Oct 6, 2026". */
  updated: string
}

export type TrekLogistic = { k: string; v: string }

export type TrekStop = {
  time: string
  /** Empty when the stop has no fixed end. */
  end: string
  what: string
  where: string
  /** Street address for the Maps link. Empty means no link. */
  address: string
  status: TrekStatus
  note: string
}

export type TrekDay = { date: string; area: string; items: TrekStop[] }

export type TrekLead = {
  company: string
  slot: string
  status: TrekStatus
  owner: string
  path: string
  next: string
}

export type TrekTask = { due: string; task: string; owner: string }

export const TRIP: TrekTrip = { name: "BYU MBA Bay Area Trek", dates: "Wed Nov 4 - Fri Nov 6, 2026", lead: "The trip host, with BYU MBA Career Services", focus: "Product management, with a Friday AI-company day in San Francisco", status_note: "Draft. Confirmed visits are marked Confirmed. Everything else is still being arranged and may move.", updated: "2026-10-06" }

export const LOGISTICS: TrekLogistic[] = [
  { k: "Arrive", v: "Tue Nov 3 evening. Fly into SJC (closest to Wed/Thu visits) or SFO." },
  { k: "Base, Tue-Thu nights", v: "Santa Clara / Sunnyvale. Every Wed and Thu visit is within 25 minutes of it." },
  { k: "Base, Thu night", v: "Move to San Francisco (SoMa) after Thursday dinner for the Friday city day." },
  { k: "Getting around", v: "Carpool in rental cars Wed-Thu (one car per 4-5 people). In SF on Friday, walk, Muni, or Waymo." },
  { k: "Depart", v: "Fri Nov 6, flights out of SFO after 6:00 PM." },
  { k: "Dress", v: "Business casual. Tech, so no suits. Bring comfortable shoes for campus tours." },
  { k: "Arrive early", v: "Be in the lobby 20 minutes before each start time. Badging takes time, and big campuses need a walk from the parking." },
  { k: "Bring", v: "Government ID for badging, a phone with LinkedIn ready, and 2-3 sharp questions for each company." },
  { k: "Stipend", v: "$350 travel stipend confirmed by Career Services (2026-10-05)." },
]

export const DAYS: TrekDay[] = [
  {
    date: "Wed Nov 4",
    area: "Peninsula + San Jose",
    items: [
      { time: "7:45 AM", end: "8:30 AM", what: "Team breakfast + briefing", where: "Hotel", address: "", status: "Planned", note: "Quick review of the day's companies. Each attendee owns the one-page brief for one company." },
      { time: "9:00 AM", end: "10:30 AM", what: "Intuit", where: "Mountain View", address: "2700 Coast Ave, Mountain View, CA 94043", status: "Proposed", note: "Intuit hires MBAs into product through its Rotational Product Manager program, so it is a strong PM fit. Backup for this slot: Google (Mountain View)." },
      { time: "12:00 PM", end: "2:00 PM", what: "Meta", where: "Menlo Park", address: "1 Hacker Way, Menlo Park, CA 94025", status: "Confirmed", note: "Confirm the building and visitor lobby with the host the week before." },
      { time: "3:00 PM", end: "5:00 PM", what: "Adobe", where: "San Jose", address: "345 Park Ave, San Jose, CA 95110", status: "Confirmed", note: "Downtown San Jose. Use the visitor garage." },
      { time: "6:30 PM", end: "", what: "Group dinner", where: "Downtown San Jose", address: "", status: "Planned", note: "" },
    ],
  },
  {
    date: "Thu Nov 5",
    area: "South Bay",
    items: [
      { time: "9:00 AM", end: "11:00 AM", what: "Cisco", where: "San Jose", address: "170 W Tasman Dr, San Jose, CA 95134", status: "Confirmed", note: "" },
      { time: "11:30 AM", end: "12:30 PM", what: "Lunch", where: "Sunnyvale", address: "", status: "Planned", note: "" },
      { time: "1:00 PM", end: "3:00 PM", what: "LinkedIn", where: "Sunnyvale", address: "1000 W Maude Ave, Sunnyvale, CA 94085", status: "Likely", note: "" },
      { time: "4:30 PM", end: "6:00 PM", what: "NVIDIA", where: "Santa Clara", address: "2788 San Tomas Expy, Santa Clara, CA 95051", status: "Potential", note: "" },
      { time: "7:00 PM", end: "9:00 PM", what: "BYU alumni night", where: "South Bay (venue TBD)", address: "", status: "Proposed", note: "Dinner with Bay Area BYU alumni in product and AI roles. The best networking hour of the trip." },
      { time: "9:30 PM", end: "", what: "Drive to San Francisco hotel", where: "SoMa, San Francisco", address: "", status: "Planned", note: "About 1 hour at night." },
    ],
  },
  {
    date: "Fri Nov 6",
    area: "San Francisco: AI day",
    items: [
      { time: "9:00 AM", end: "10:30 AM", what: "Anthropic", where: "SoMa, San Francisco", address: "500 Howard St, San Francisco, CA 94105", status: "Proposed", note: "If a full visit is not possible, the fallback is a coffee with BYU alumni who work there." },
      { time: "11:00 AM", end: "12:30 PM", what: "OpenAI", where: "Mission Bay, San Francisco", address: "1455 3rd St, San Francisco, CA 94158", status: "Proposed", note: "Ten minutes from Anthropic. Same alumni-coffee fallback." },
      { time: "1:00 PM", end: "2:00 PM", what: "Waymo", where: "Location TBD", address: "", status: "Potential", note: "The current contact is in operations. Asking for a product manager to join. If the visit is in SF, ride Waymos between stops." },
      { time: "2:30 PM", end: "4:00 PM", what: "Health-tech startup (Chief Product Officer)", where: "Location TBD", address: "", status: "Potential", note: "Was 9-11 AM. Can move back to the morning if that is the CPO's only window." },
      { time: "4:15 PM", end: "5:00 PM", what: "Debrief", where: "San Francisco", address: "", status: "Planned", note: "Ten minutes per person: who you met, what you promised, when you will follow up." },
      { time: "6:00 PM", end: "", what: "Fly home", where: "SFO", address: "", status: "Planned", note: "" },
    ],
  },
]

export const PIPELINE: TrekLead[] = [
  { company: "Meta", slot: "Wed 12-2", status: "Confirmed", owner: "Trip host / Career Services", path: "Career Services host", next: "Confirm room, headcount, and visitor lobby" },
  { company: "Adobe", slot: "Wed 3-5", status: "Confirmed", owner: "Trip host / Career Services", path: "Career Services host; PMs hosted the Jan 2026 trip", next: "Ask for a PM panel" },
  { company: "Cisco", slot: "Thu 9-11", status: "Confirmed", owner: "Trip host / Career Services", path: "Career Services host", next: "Confirm agenda" },
  { company: "LinkedIn", slot: "Thu 1-3", status: "Likely", owner: "Trip host", path: "Host in progress", next: "Lock it by Oct 14" },
  { company: "NVIDIA", slot: "Thu 4:30-6", status: "Potential", owner: "Trip host / Career Services", path: "Career Services connection", next: "Lock it, or free the slot by Oct 14" },
  { company: "Health-tech startup", slot: "Fri", status: "Potential", owner: "Trip host", path: "Chief Product Officer", next: "Get time and location" },
  { company: "Waymo", slot: "Fri 1-2", status: "Potential", owner: "Trip host", path: "Operations contact", next: "Ask for a PM in the room; SF location if possible" },
  { company: "Anthropic", slot: "Fri 9-10:30", status: "Proposed", owner: "AI Foundry", path: "BYU alumni in Applied AI; AI Foundry is a Claude Partner Network member", next: "Warm ask by Oct 8" },
  { company: "OpenAI", slot: "Fri 11-12:30", status: "Proposed", owner: "AI Foundry", path: "Find BYU alumni there; warm intro", next: "Map alumni by Oct 8, ask by Oct 9" },
  { company: "Intuit", slot: "Wed 9-10:30", status: "Proposed", owner: "AI Foundry", path: "Contact met at NBMBAA 2026", next: "Ask by Oct 8" },
  { company: "Google", slot: "Wed 9-10:30 (backup)", status: "Backup", owner: "Trip host / Career Services", path: "BYU alumni who hosted the Jan 2026 trip", next: "Hold as the backup for Intuit" },
  { company: "BYU alumni night", slot: "Thu 7-9 PM", status: "Proposed", owner: "AI Foundry + Career Services", path: "BYU Management Society (Silicon Valley) and Bay Area MBA alumni", next: "Venue and invites by Oct 16" },
]

export const TIMELINE: TrekTask[] = [
  { due: "Oct 7", task: "Send the trip host the master company + contacts list and this draft plan", owner: "AI Foundry" },
  { due: "Oct 8", task: "Lock the AI Foundry lead's spot: resume to the trip host, check in with the sign-up contact (sign-ups close Fri Oct 9)", owner: "AI Foundry" },
  { due: "Oct 8", task: "Warm asks: Anthropic, Intuit", owner: "AI Foundry" },
  { due: "Oct 9", task: "OpenAI alumni map + ask; Google backup ask", owner: "AI Foundry / Trip host" },
  { due: "Oct 14", task: "LinkedIn + NVIDIA locked or released", owner: "Trip host" },
  { due: "Oct 16", task: "Every slot confirmed or its fallback chosen; alumni night venue set", owner: "Trip host + AI Foundry" },
  { due: "Oct 20", task: "Lodging (both bases) and rental cars booked", owner: "Attendees" },
  { due: "Oct 23", task: "Final roster + resume book to each host", owner: "Trip host" },
  { due: "Oct 28", task: "One-page company briefs, one per attendee", owner: "Attendees" },
  { due: "Nov 2", task: "Final itinerary: parking, badging, host names to attendees", owner: "Trip host" },
  { due: "Nov 4-6", task: "Trip", owner: "Everyone" },
  { due: "Nov 8", task: "Thank-you notes sent within 48 hours; every contact logged", owner: "Everyone" },
  { due: "Nov 20", task: "Two-week follow-ups: referrals, coffee chats, applications", owner: "Everyone" },
]
