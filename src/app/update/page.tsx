import type { Metadata } from "next"
import Image from "next/image"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Button } from "@/components/ds/Button"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { UPDATE } from "@/lib/content"

/**
 * /update — the monthly one-pager, public, so an advisor email can link to a
 * page instead of an attachment. Footer-linked only (UPDATE_LINK).
 *
 * The image is the artifact; the stat list above it exists because the image
 * is a letter-size page, and on a phone its body text shrinks to a few pixels.
 * The list is the readable copy of the headline numbers, and the image opens
 * at full size on tap. From lg up the image renders near its own width and
 * its stat band sits directly below, so the list is hidden there rather than
 * shown twice. The alt text carries the same numbers for every width. Copy and the rule about what may appear
 * here live with UPDATE in src/lib/content.ts.
 */

export const metadata: Metadata = {
  title: `Update, ${UPDATE.month}`,
  description: UPDATE.lead,
  alternates: { canonical: "/update" },
  openGraph: {
    title: UPDATE.title,
    description: UPDATE.lead,
    url: "/update",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BYU AI Foundry" }],
  },
}

export default function UpdatePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="px-6 pt-16 pb-10">
          <div className="mx-auto max-w-[var(--container)]">
            <Eyebrow>Advisory board update</Eyebrow>
            <h1 className="mt-3.5 font-serif text-[length:var(--size-h1)] font-bold leading-[1.05] tracking-[-0.005em] text-navy">
              {UPDATE.title}
            </h1>
            <p className="mt-4.5 max-w-[62ch] text-[length:var(--size-body)] leading-[1.65] text-text-meta">
              {UPDATE.lead}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border-subtle pt-8 sm:grid-cols-3 lg:hidden">
              {UPDATE.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse justify-end">
                  <dt className="caption mt-2 text-text-meta">{s.label}</dt>
                  <dd className="stat m-0 text-[2.2rem] tabular-nums text-navy">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 max-w-[62ch] text-[length:var(--size-body)] leading-[1.65] text-text-meta">
              {UPDATE.board}
            </p>

            <div className="mt-8">
              <Button href={UPDATE.pdf.href} download={UPDATE.pdf.filename}>
                Download the PDF
              </Button>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <figure className="mx-auto max-w-[var(--container)]">
            <a href={UPDATE.image.src} className="block border border-border-subtle">
              <Image
                src={UPDATE.image.src}
                alt={UPDATE.image.alt}
                width={UPDATE.image.width}
                height={UPDATE.image.height}
                sizes="(max-width: 1248px) 100vw, 1200px"
                className="block h-auto w-full"
              />
            </a>
            <figcaption className="caption mt-3 text-text-meta">
              The {UPDATE.month} one-pager. Select the image to open it at full size.
            </figcaption>
          </figure>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
