import type { Metadata } from "next"
import { PageCurtainLab } from "@/components/PageCurtainLab"

/**
 * Preview for the PageCurtain experiment. Unlinked and noindexed; exists so
 * the team can feel all four curtain effects on real brand surfaces before
 * deciding whether any public section uses one. See PageCurtain.tsx's header
 * for the client-boundary tension before promoting this beyond the lab.
 * Delete alongside PageCurtain.tsx and PageCurtainLab.tsx if the experiment
 * dies.
 */

export const metadata: Metadata = {
  title: "Page curtain lab",
  robots: { index: false, follow: false, nocache: true },
}

export default function PageCurtainLabPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold text-text-primary">Page curtain</h1>
      <p className="mt-2 max-w-xl text-sm text-text-muted">
        Curtain transitions between content panes: doors, wipe, iris, fade. The
        curtain is navy (surface-inverse); tab order sets the wipe direction;
        reduced motion swaps instantly. Rebuilt free of motion.dev&apos;s
        Motion+ paywall on the `motion` package the site already ships.
      </p>
      <PageCurtainLab />
    </main>
  )
}
