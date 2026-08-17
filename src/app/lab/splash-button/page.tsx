import type { Metadata } from "next"
import { SplashButton } from "@/components/SplashButton"

/**
 * Preview for the SplashButton experiment. Unlinked and noindexed; exists
 * so the team can hover the real component on both dark and light ground
 * without wiring it into a live page. Delete alongside the component if
 * the experiment dies.
 */

export const metadata: Metadata = {
  title: "Splash button lab",
  robots: { index: false, follow: false, nocache: true },
}

export default function SplashButtonLab() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Splash button</h1>
      <p className="mt-2 text-sm opacity-70">
        Hover: the ring melts away (100ms). Leave: it splashes back (250ms).
        Color is one variable; gradient and ring derive from it.
      </p>

      <section className="mt-8 flex flex-wrap items-center justify-center gap-10 rounded-xl bg-[#08080a] px-6 py-14">
        <SplashButton>Sign up</SplashButton>
        <SplashButton color="#002e5d">Apply now</SplashButton>
        <SplashButton color="#16a34a">Get started</SplashButton>
      </section>

      <section className="mt-4 flex flex-wrap items-center justify-center gap-10 rounded-xl border px-6 py-14">
        <SplashButton>Sign up</SplashButton>
        <SplashButton color="#002e5d">Apply now</SplashButton>
      </section>

      <p className="mt-4 text-xs opacity-60">
        The navy variant is --byu-navy (#002e5d) for a brand-safe comparison.
      </p>
    </main>
  )
}
