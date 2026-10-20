import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { StayInTouchForm } from "@/components/StayInTouchForm"
import { APP_JOIN, APP_SIGN_IN, SCHOOL_FULL } from "@/lib/content"

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
        <section data-ground="navy" className="surface-iron text-text-on-inverse">
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
              Join the AI Foundry network.
            </h1>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────
            2. What you can opt into, then the way in.

            Same band, in that order. The items are the reason to join, so they
            come before the Join button, not after it as /quote puts its
            "what happens next" steps. That page's steps are reassurance for
            someone already committed; these are the offer itself.

            The lead paragraph that used to introduce all of this is gone from
            the page and from content.ts. It is not lost: a version of it opens
            the Join plate below, once, in the place where it is load-bearing.
            ──────────────────────────────────────────────────── */}
        <section className="surface-paper">
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-16">
            {/* The "What you can opt into" ledger that stood here was removed
                2026-10-20: the form's checkboxes now carry the same choices, and
                people arriving from a QR code should reach the form first. */}

            {/*
              Two ways in. The form is the main one: email only, no account,
              made for a QR code on a slide (/network?from=aipm). It writes to
              the Strategy database's mailing list through the app (see
              StayInTouchForm). An account in the app (email and a password,
              docs/LOGIN-DOOR.md in the Strategy repo) stays below for people
              who want to sign in, and goes through "Almost in" approval.
            */}
            <div className="border border-border-subtle bg-surface-default p-6 md:p-10">
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStretch: "var(--w-plate)", fontSize: "var(--size-h3)", margin: "0 0 6px", color: "var(--navy)" }}>
                Stay in touch
              </h2>
              <p className="text-base leading-relaxed text-text-primary opacity-80" style={{ margin: "0 0 24px" }}>
                Employers, alumni, clients and students. Leave your email and check what you want to hear about, including whether you could host an intern.
              </p>
              <StayInTouchForm />
            </div>
            <p className="mt-6 text-center text-base text-text-primary">
              Want an account in the app?{" "}
              <a href={APP_JOIN} className="underline">
                Join with a password
              </a>
              {" · "}Already a member?{" "}
              <a href={APP_SIGN_IN} className="underline">
                Sign in
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
