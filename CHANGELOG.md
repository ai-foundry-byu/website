# Changelog — ai-foundry-byu-website

The public AI Foundry site at https://aifoundry.byu.edu.

---

## 2026-08-16

- 19:12 — (corbin-curtain-site branch) Switched the site-wide curtain from doors to fade after review: nav now fades to deep navy, swaps the route behind the veil, and fades out. One-word change (effect="fade" on the provider); the ember-seam doors remain available via the effect prop and in the /lab/page-curtain harness.

- 19:06 — (corbin-curtain-site branch, PREVIEW-ONLY) Wired the PageCurtain experiment into real site navigation so the team can feel it beyond the lab harness: CurtainRoute.tsx adds a CurtainRouteProvider (one client leaf in the layout; pages stay prerendered — children cross as a ReactNode prop) and CurtainNavLink, which the header nav now uses. Click a nav link → deep-navy doors close over the viewport meeting in a 3px ember seam (the accent-bar motif), router.push() runs behind cover, doors part on the committed route. Hash links, modified clicks, back/forward, and reduced motion all bypass the curtain; a 2.5s watchdog force-opens if a route never commits. This branch exists for its Vercel preview and is not meant to merge as-is — whether the site *should* curtain its navigation is the open question it exists to answer.

- 18:56 — (corbin-experiments branch) Added PageCurtain, an experimental curtain page-transition (doors/wipe/iris/fade) with preview at /lab/page-curtain (unlinked, noindexed). Rebuilt from scratch after motion.dev's @motion/page-curtain proved Motion+ paywalled (registry 401s without a paid token); this version needs only the `motion` package the site already ships for MotionCta — no new dependencies. Direction-aware wipes, mid-close retargeting, JS-level reduced-motion handling (instant swap), StrictMode-pure state machine. Curtain and demo surfaces use semantic tokens only (navy curtain, flat bands, no gradients). Tension flagged in the component header: it's a client component with state on a site that keeps hydration to tiny leaves — fine as a section widget, but wiring it into real route navigation would break the static prerender model and needs a deliberate decision. Verified on dev (all four effects, lint, tsc, next build all clean).

- 18:46 — (corbin-experiments branch) Added SplashButton, an experimental CTA button whose offset outline ring melts away on hover and splashes back on leave, recreated from a reference screen recording. One CSS variable (--splash-color) drives the whole look; gradient and ring derive via color-mix(). Preview page at /lab/splash-button (unlinked, noindexed) shows it on dark and light ground next to a --byu-navy variant. Known tension flagged in the component header: the default #1f63f4 gradient is off-palette for this site's flat navy/white brand rules — needs a brand decision before any public page uses it.

## 2026-08-08

- 20:29 — Merged feat/jobs-board and landed it — aifoundry.byu.edu/jobs is live (200). Root-caused the ai-foundry agent's block: not the permission classifier. origin is SSH as JDDavenport, who has no push to ai-foundry-byu/*; jddavenportOpen holds it. Separately the GitHub Governor denied gh pr create because ai-foundry-byu was not in JD_OWNERS. Fixed both: agent-system f6af55f2 adds the org to JD_OWNERS (26 tests pass), website faf9ade adds RUNBOOK.md documenting the credential split.
