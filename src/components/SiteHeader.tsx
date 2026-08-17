import Image from "next/image"
import { CurtainNavLink } from "@/components/CurtainRoute"
import { MotionCta } from "@/components/MotionCta"
import { NAV, NAV_CTA, PROGRAM, SCHOOL_FULL } from "@/lib/content"

/**
 * Top bar. Navy, so it reads as one surface with the hero below it. Two tabs,
 * Join the network and About us. Click either and it takes you straight there.
 *
 * Still a server component. The mobile menu is a native <details>, so the
 * disclosure needs no script.
 *
 * corbin-curtain-site preview: nav links render through CurtainNavLink (a
 * client leaf wrapping next/link) so route changes run behind the curtain —
 * see CurtainRoute.tsx. The /#quote CTA is deliberately not curtained.
 *
 * The Get a quote button is the exception: it is a MotionCta, which is a client
 * component, so that one leaf hydrates. It used to be true that this header
 * shipped no JavaScript of its own and that is no longer the case.
 *
 * The mark is the BYU Marriott + AI Foundry wordmark carried over from the
 * original site, in its light reversal for dark surfaces. BYU's rule is that
 * marks appear in navy or white only, so the white treatment is the
 * sanctioned one here.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface-inverse">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <CurtainNavLink href="/" className="flex items-center">
          <Image
            src="/byu-marriott-ai-foundry-light.png"
            alt={`${SCHOOL_FULL}, ${PROGRAM}`}
            width={3305}
            height={360}
            priority
            className="h-6 w-auto md:h-9"
          />
        </CurtainNavLink>

        {/* desktop nav */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-2">
            {NAV.map((link) => (
              <li key={link.href}>
                <CurtainNavLink
                  href={link.href}
                  className="block px-4 py-2 text-base font-semibold text-text-on-inverse transition-opacity hover:opacity-70"
                >
                  {link.label}
                </CurtainNavLink>
              </li>
            ))}
            <li className="ml-3">
              <MotionCta
                href={NAV_CTA.href}
                className="btn-ember px-6 py-2.5 text-base"
              >
                {NAV_CTA.label}
              </MotionCta>
            </li>
          </ul>
        </nav>

        {/* mobile nav: native disclosure, no script */}
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none px-2 py-2 text-base font-semibold text-text-on-inverse [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 top-full z-50 mt-2 w-56 border border-border-on-inverse bg-surface-inverse-deep py-2 shadow-lg"
          >
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <CurtainNavLink
                    href={link.href}
                    className="block px-4 py-3 text-base font-semibold text-text-on-inverse transition-colors hover:bg-surface-inverse-soft"
                  >
                    {link.label}
                  </CurtainNavLink>
                </li>
              ))}
              <li className="px-4 pb-2 pt-3">
                <MotionCta
                  href={NAV_CTA.href}
                  className="btn-ember w-full px-4 py-2.5 text-base"
                >
                  {NAV_CTA.label}
                </MotionCta>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  )
}
