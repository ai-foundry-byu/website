import type { Metadata } from "next"
import { Icon } from "@/components/ds/Icon"
import { DAYS, LOGISTICS, PIPELINE, TIMELINE, TRIP, type TrekStatus } from "@/lib/trek"

/**
 * /trek: the Bay Area Trek itinerary and plan. NOT linked from anywhere on
 * the site, not in any nav, sitemap or footer, and excluded from indexing.
 *
 * Public on purpose: attendees open it on a phone mid-trip, and this domain
 * has no page token configured (/board and /ops 404 here), so a token gate
 * would lock out the people it is for. Being public is why the data file
 * carries no person names or contact details, and why the contact-level
 * leads list is kept in a private sheet that this page mentions but never
 * links.
 *
 * Mobile first: the itinerary leads, every stop is one tap from Google Maps,
 * and the jump bar sticks to the top of the screen. The plan and pipeline
 * come after it because only the trip leads need them.
 *
 * Static. Content lives in src/lib/trek.ts.
 */

export const metadata: Metadata = {
  title: "Bay Area Trek",
  description: `${TRIP.name}, ${TRIP.dates}.`,
  alternates: { canonical: "/trek" },
  robots: { index: false, follow: false, nocache: true },
  // Attendees will paste this link into a group chat, so the preview should
  // name the trip rather than inherit the site's homepage card.
  openGraph: {
    title: TRIP.name,
    description: `${TRIP.dates}. ${TRIP.focus}.`,
    url: "/trek",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BYU AI Foundry" }],
  },
}

/**
 * Six statuses in a four-color palette with no tints (globals.css). The
 * chips are told apart by fill and stroke, never by a new hue, and from most
 * certain to least: a solid navy fill, a solid outline, a dashed outline, a
 * dotted outline. Planned (the group's own breakfasts, drives and debriefs,
 * not a company booking) sits on the recessed ground with no outline, and
 * Backup takes a slate stroke with secondary ink. Every ink/ground pair is
 * one the contrast contract already allows, and the word is always printed,
 * so color is never the only signal.
 */
const CHIP: Record<TrekStatus, string> = {
  Confirmed: "border-navy bg-navy text-text-on-inverse",
  Likely: "border-navy text-text-primary",
  Potential: "border-dashed border-navy text-text-primary",
  Proposed: "border-dotted border-navy text-text-primary",
  Planned: "border-transparent bg-surface-recessed text-text-primary",
  Backup: "border-slate text-text-meta",
}

function Chip({ status }: { status: TrekStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-[var(--radius)] border-2 px-2 py-0.5 text-[0.75rem] font-medium leading-tight tracking-[0.02em] ${CHIP[status]}`}
    >
      {status}
    </span>
  )
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2026-10-06" -> "Oct 6, 2026". Parsed by hand so no timezone can shift it a day. */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/** "Wed Nov 4" -> anchor "wed", label "Wed", sub "Nov 4". */
function dayParts(date: string) {
  const [dow, ...rest] = date.split(" ")
  return { id: dow.toLowerCase(), label: dow, sub: rest.join(" ") }
}

export default function TrekPage() {
  const jumps = [
    ...DAYS.map((d) => dayParts(d.date)),
    { id: "plan", label: "Plan", sub: "& leads" },
  ]

  return (
    <main className="surface-paper min-h-screen">
      {/* ── The trip, in one band ──────────────────────────────── */}
      <header data-ground="navy" className="bg-surface-inverse">
        <div className="mx-auto max-w-5xl px-5 pt-8 pb-7 md:px-6 md:pt-12 md:pb-10">
          <p className="eyebrow text-text-on-dark-soft">AI Foundry · BYU Marriott · Trip itinerary</p>
          <h1 className="mt-3 max-w-[22ch] font-serif text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.015em] text-text-on-inverse md:text-[2.7rem]">
            {TRIP.name}
          </h1>
          <p className="mt-2.5 text-[1.05rem] font-medium text-text-on-inverse md:text-[1.15rem]">
            {TRIP.dates}
          </p>

          <dl className="mt-6 grid gap-x-10 gap-y-4 border-t border-border-on-inverse pt-5 md:grid-cols-2">
            <div>
              <dt className="eyebrow text-text-on-dark-soft">Lead</dt>
              <dd className="mt-1.5 text-[0.95rem] leading-snug text-text-on-dark-body">{TRIP.lead}</dd>
            </div>
            <div>
              <dt className="eyebrow text-text-on-dark-soft">Focus</dt>
              <dd className="mt-1.5 text-[0.95rem] leading-snug text-text-on-dark-body">{TRIP.focus}</dd>
            </div>
          </dl>

          <p className="mt-5 max-w-[60ch] text-[0.92rem] leading-relaxed text-text-on-dark-body">
            {TRIP.status_note}
          </p>
          <p className="caption mt-2 text-text-on-dark-soft">
            Updated <time dateTime={TRIP.updated}>{formatDate(TRIP.updated)}</time>
          </p>
        </div>
      </header>

      {/* ── Jump bar: sticks so any day is one tap away ─────────── */}
      <nav aria-label="Jump to a day" className="sticky top-0 z-20 border-b border-border-strong bg-surface-default">
        <ul className="mx-auto grid max-w-5xl list-none grid-cols-4 p-0 md:px-6">
          {jumps.map((j) => (
            <li key={j.id} className="border-l border-border-subtle first:border-l-0">
              <a
                href={`#${j.id}`}
                className="flex min-h-12 flex-col items-center justify-center py-1.5 text-text-primary no-underline hover:bg-fill-selected hover:text-text-primary"
              >
                <span className="text-[0.95rem] font-semibold leading-tight">{j.label}</span>
                <span className="text-[0.72rem] leading-tight text-text-meta">{j.sub}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-5xl px-5 pb-16 md:px-6">
        {/* ── Itinerary, one section per day ─────────────────────── */}
        {DAYS.map((day) => {
          const { id } = dayParts(day.date)
          return (
            <section key={day.date} id={id} aria-labelledby={`${id}-h`} className="scroll-mt-14 pt-9 md:pt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border-strong pb-3">
                <h2
                  id={`${id}-h`}
                  className="font-serif text-[1.55rem] font-semibold leading-tight tracking-[-0.01em] text-text-primary md:text-[1.9rem]"
                >
                  {day.date}
                </h2>
                <p className="eyebrow text-text-meta">{day.area}</p>
              </div>

              <ol className="list-none p-0">
                {day.items.map((stop) => (
                  <li
                    key={`${stop.time}-${stop.what}`}
                    className="grid gap-x-8 gap-y-1.5 border-b border-border-subtle py-4 md:grid-cols-[10rem_minmax(0,1fr)] md:py-5"
                  >
                    <div className="flex items-center justify-between gap-3 md:flex-col md:items-start md:justify-start md:gap-2">
                      <p className="text-[0.95rem] font-semibold tabular-nums leading-snug text-text-primary">
                        {stop.time}
                        {stop.end && <> – {stop.end}</>}
                      </p>
                      <Chip status={stop.status} />
                    </div>

                    <div>
                      <h3 className="text-[1.1rem] font-semibold leading-snug text-text-primary">{stop.what}</h3>
                      <p className="mt-0.5 text-[0.9rem] leading-snug text-text-meta">{stop.where}</p>
                      {stop.address && (
                        <a
                          href={mapsUrl(stop.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${stop.what} in Google Maps: ${stop.address}`}
                          className="mt-0.5 inline-flex min-h-11 items-center gap-1.5 text-[0.9rem] font-medium underline underline-offset-2"
                        >
                          {stop.address}
                          <Icon name="arrow--up-right" size={16} />
                        </a>
                      )}
                      {stop.note && (
                        <p className="mt-1 max-w-[62ch] text-[0.9rem] leading-relaxed text-text-primary">{stop.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}

        {/* ── Logistics ──────────────────────────────────────────── */}
        <section id="logistics" aria-labelledby="logistics-h" className="scroll-mt-14 pt-12">
          <div className="border-b border-border-strong pb-3">
            <h2
              id="logistics-h"
              className="font-serif text-[1.55rem] font-semibold leading-tight tracking-[-0.01em] text-text-primary md:text-[1.9rem]"
            >
              Logistics
            </h2>
          </div>
          <dl className="m-0">
            {LOGISTICS.map((l) => (
              <div
                key={l.k}
                className="grid gap-x-8 gap-y-1 border-b border-border-subtle py-3.5 md:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <dt className="text-[0.9rem] font-semibold leading-snug text-text-primary">{l.k}</dt>
                <dd className="m-0 max-w-[62ch] text-[0.92rem] leading-relaxed text-text-primary">{l.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Plan & leads: for the trip leads, after the itinerary ─ */}
        <section id="plan" aria-labelledby="plan-h" className="scroll-mt-14 pt-14">
          <p className="eyebrow text-text-meta">For the trip leads</p>
          <h2
            id="plan-h"
            className="mt-2 font-serif text-[1.55rem] font-semibold leading-tight tracking-[-0.01em] text-text-primary md:text-[1.9rem]"
          >
            Plan &amp; leads
          </h2>

          <h3 className="mt-7 text-[1.05rem] font-semibold text-text-primary">Company pipeline</h3>

          {/* Phone: one card per company. */}
          <ul className="mt-3 list-none border-t border-border-strong p-0 md:hidden">
            {PIPELINE.map((p) => (
              <li key={p.company} className="border-b border-border-subtle py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[1rem] font-semibold leading-snug text-text-primary">{p.company}</p>
                  <Chip status={p.status} />
                </div>
                <dl className="mt-2 grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3 gap-y-1 text-[0.88rem] leading-snug">
                  <dt className="text-text-meta">Slot</dt>
                  <dd className="m-0 text-text-primary">{p.slot}</dd>
                  <dt className="text-text-meta">Owner</dt>
                  <dd className="m-0 text-text-primary">{p.owner}</dd>
                  <dt className="text-text-meta">Path</dt>
                  <dd className="m-0 text-text-primary">{p.path}</dd>
                  <dt className="text-text-meta">Next step</dt>
                  <dd className="m-0 text-text-primary">{p.next}</dd>
                </dl>
              </li>
            ))}
          </ul>

          {/* Desktop: the table. */}
          <table className="mt-3 hidden w-full border-collapse md:table">
            <thead>
              <tr className="border-b border-border-strong">
                {["Company", "Slot", "Status", "Owner", "Path", "Next step"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="py-2 pr-4 text-left align-bottom text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-text-meta last:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PIPELINE.map((p) => (
                <tr key={p.company} className="border-b border-border-subtle align-top">
                  <th scope="row" className="py-3 pr-4 text-left font-semibold text-text-primary">
                    {p.company}
                  </th>
                  <td className="py-3 pr-4 text-text-primary">{p.slot}</td>
                  <td className="py-3 pr-4">
                    <Chip status={p.status} />
                  </td>
                  <td className="py-3 pr-4 text-text-primary">{p.owner}</td>
                  <td className="py-3 pr-4 text-text-primary">{p.path}</td>
                  <td className="py-3 text-text-primary">{p.next}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 max-w-[62ch] text-[0.88rem] leading-relaxed text-text-meta">
            The contact-level leads list is kept privately with the trip leads.
          </p>

          <h3 className="mt-10 text-[1.05rem] font-semibold text-text-primary">Timeline</h3>
          <ol className="mt-3 list-none border-t border-border-strong p-0">
            {TIMELINE.map((t) => (
              <li
                key={`${t.due}-${t.task}`}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 border-b border-border-subtle py-3 md:grid-cols-[10rem_minmax(0,1fr)_14rem] md:gap-x-8"
              >
                <p className="text-[0.92rem] font-semibold tabular-nums leading-snug text-text-primary">{t.due}</p>
                <p className="text-[0.92rem] leading-snug text-text-primary">{t.task}</p>
                <p className="col-start-2 text-[0.84rem] leading-snug text-text-meta md:col-start-auto">{t.owner}</p>
              </li>
            ))}
          </ol>
        </section>

      </div>
    </main>
  )
}
