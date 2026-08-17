import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { NetworkForm } from "@/components/NetworkForm"
import { NETWORK_INTERESTS, SCHOOL_FULL } from "@/lib/content"

export const metadata: Metadata = {
  title: "Join the network",
  description:
    "Join the AI Foundry network at the " +
    SCHOOL_FULL +
    ". Events, a periodic AI digest, access to the cohort for hiring, and project proposals.",
  alternates: { canonical: "/network" },
}

/**
 * One column, one axis, one thing to do.
 *
 * This page used to be a two-column split: a left rail of four interest items
 * with orange left-border rules, and the embedded form beside it on the right.
 * Two problems with that, and they compound.
 *
 * First, the interests ARE the checkbox options inside the form (see FORMS.md,
 * form 3, field 6). Beside the form they read as a duplicate of something the
 * reader can already see. Stacked above it they read as the legend for it: the
 * page explains the four options with a line each, then the form asks you to
 * pick among the same four by name. Same words, different job.
 *
 * Second, an asymmetric 360px/1fr split cannot coexist with a centred hero. The
 * page had two competing axes, so nothing lined up with anything.
 *
 * Now everything below the header hangs off one 768px column, so the interests
 * ledger and the form plate share both edges all the way down.
 */
export default function NetworkPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* ────────────────────────────────────────────────────
            1. Hero. Headline, nothing else.
            ──────────────────────────────────────────────────── */}
        {/* surface-iron, not the surface-iron-deep the landing hero uses. That
            class pools its light radially at 28% from the left, which is right
            for a left-aligned hero and wrong for a centred one: the brightest
            part of the band would sit off to one side of the headline. This class
            is a straight top-to-bottom tonal gradient, so it stays symmetrical
            about the same axis as the content. */}
        <section className="surface-iron text-text-on-inverse">
          {/*
            py-16 md:py-20, down from py-20 md:py-28.

            The old padding was sized for an eyebrow, a heading, and three lines
            of lead copy. Two of those three are gone, so the same padding left
            the navy band 413px tall around 177px of content and the navy-to-white
            boundary sat far below the fold of the composition. With the anvil
            glyph also gone the band now holds the 65px headline alone, framed
            by the same 80px of air above and below at md.

            Not py-28 md:py-40 like the landing hero either. That hero carries
            four stacked elements and is the first thing on the site; this is an
            interior page whose job is to hand you to the form quickly.
          */}
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-12 text-center md:py-14">
            {/* The anvil glyph that used to sit above this headline was removed
                2026-08-01, same day and same reason as the landing hero's: the
                header lockup already identifies the program. */}

            {/*
              No `wonk` class, deliberately. Fraunces' off-baseline alternates are
              the landing hero's signature and globals.css scopes them to it. A
              second headline wearing the same flourish makes it a style rather
              than a signature, and /quote and /about are both plain too.

              No eyebrow above this either. It said "Join the network", which is
              also the nav tab, the document title, and the form's own heading
              further down.
            */}
            <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-6xl">
              Forge intelligence with us.
            </h1>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────
            2. What you can opt into, then the form.

            Same band, in that order. The four items are the reason to fill the
            form in, so they come before it, not after it as /quote puts its
            "what happens next" steps. That page's steps are reassurance for
            someone already committed; these are the offer itself.

            The lead paragraph that used to introduce all of this is gone from
            the page and from content.ts. It is not lost: it is NetworkForm's
            own intro line, so it renders inside the plate below, once, in the
            place where it is actually load-bearing.
            ──────────────────────────────────────────────────── */}
        <section className="surface-paper">
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-16">
            <h2 className="text-center font-serif text-2xl font-semibold tracking-[-0.01em] text-text-primary md:text-3xl">
              What you can opt into
            </h2>

            {/*
              A hairline-divided ledger, one row per interest, not a 2x2 grid and
              not four bordered cards.

              Rejected, in order:

                - Four cards in a 2x2 grid. It introduces a second vertical
                  alignment at the column's midpoint, which is exactly the
                  competing-axis problem the two-column layout had, just smaller.
                - Four across in one row. Even at the max-w-6xl the rest of the
                  site uses, each cell gets about 228px of text, and the longest
                  title needs 253px with its bullet. Two of the four would wrap
                  and two would not. Ragged.
                - Keeping the orange left-border rule per item. Four left rules
                  inside a centred page read as four little left-aligned blocks
                  rather than one block, and the accent has a job at the top of
                  each row instead.

              This is the same divided-list component as VALUES on the landing
              page: a title column wide enough to hold every title on one line,
              and the blurb in the reading column beside it.

              17rem for the title column is measured, not chosen. The longest
              title, "Live BYU-sponsored AI events", renders 235px wide at 16px
              semibold, and the bullet plus its gap adds 18px, so the row needs
              253px. 17rem is 272px, which clears it by 19px. Anything wider takes
              the slack out of the blurb column, which needs it more; anything
              narrower and one of the four titles wraps while the others do not.

              The two columns arrive at md, not sm. At exactly the sm breakpoint
              the column is 592px wide, which leaves the blurb 288px and pushes
              the longest blurb to three lines while the other three hold two. Two
              columns only earn their keep from 768px up, so below that the rows
              stack and the blurb gets the full measure.
            */}
            {/*
              One spacing ladder governs this band, biggest gap outermost, the
              same rule the landing page's mission/values section runs on:

                 6px  title to blurb inside a row when it stacks (gap-y-1.5)
                40px  between rows (py-5, two adjacent rows each give 20px)
                48px  heading to the top of the list (this mt)
                64px  list to the form, because that is a change of task
                96px  band padding, 80px below md

              mt-12 rather than mt-10: at 40px the heading-to-list gap tied the
              between-rows gap and the heading stopped reading as the parent of
              the list. Each step has to beat the one nested inside it.
            */}
            <ul className="mt-12 border-t border-border-subtle">
              {NETWORK_INTERESTS.map((interest) => (
                <li
                  key={interest.title}
                  className="grid gap-x-8 gap-y-1.5 border-b border-border-subtle py-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
                >
                  <div className="flex gap-3">
                    {/* The accent as a fill, never as type. A 6px square of
                        orange carries no meaning on its own, so it is safe on
                        any surface, and it is the same bullet the offering
                        cards use. mt-[0.45rem] centres it on the cap height of
                        16px text at leading-relaxed. */}
                    <span
                      aria-hidden
                      className="ember-bar mt-[0.45rem] h-1.5 w-1.5 shrink-0"
                    />
                    <p className="text-base font-semibold leading-relaxed text-text-primary">
                      {interest.title}
                    </p>
                  </div>
                  {/* Indented to the title's text, not to the bullet, when the
                      row stacks on narrow screens. pl-[1.125rem] is the bullet
                      plus its gap. */}
                  <p className="pl-[1.125rem] text-base leading-relaxed text-text-primary opacity-80 md:pl-0">
                    {interest.blurb}
                  </p>
                </li>
              ))}
            </ul>

            {/*
              The form, on the same 768px column, so its edges land on the
              ledger's edges above it.

              tone stays "light": this sits on the white surface, so the plate
              needs the hairline border to have an edge at all. tone="inverse"
              is for a navy band, which is why /quote uses it and this does not.

              height 1440, up from 780. Measured: the form's own content is
              1421px tall once its card hits its 640px cap, which it does at any
              plate width over about 724px. At 780 the reader met a 780px window
              onto a 1421px form, so the page had a nested scroll region that
              swallowed trackpad scrolling and hid the submit button behind a
              scrollbar most people never noticed. At 1440 the whole form is on
              the page and the only scrollbar is the browser's.

              It cannot be right at every width: below about 640px the form's
              labels wrap and its content grows past 1440 again, so narrow
              screens still scroll inside the frame. One fixed number cannot fix
              both, and the desktop case is the one that was broken.
            */}
            <div className="mt-16">
              {/* Native form posting to /api/network, which upserts into
                  Supabase keyed on email. Its height is its content's height,
                  so the measured-iframe bookkeeping the embed needed is gone. */}
              <NetworkForm />
              <p className="mt-6 text-center text-base text-text-primary opacity-80">
                No spam. Leave at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
