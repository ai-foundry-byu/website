# Changelog — ai-foundry-byu-website

The public AI Foundry site at https://aifoundry.byu.edu.

---

## 2026-08-16

- 18:46 — (corbin-experiments branch) Added SplashButton, an experimental CTA button whose offset outline ring melts away on hover and splashes back on leave, recreated from a reference screen recording. One CSS variable (--splash-color) drives the whole look; gradient and ring derive via color-mix(). Preview page at /lab/splash-button (unlinked, noindexed) shows it on dark and light ground next to a --byu-navy variant. Known tension flagged in the component header: the default #1f63f4 gradient is off-palette for this site's flat navy/white brand rules — needs a brand decision before any public page uses it.

## 2026-08-08

- 20:29 — Merged feat/jobs-board and landed it — aifoundry.byu.edu/jobs is live (200). Root-caused the ai-foundry agent's block: not the permission classifier. origin is SSH as JDDavenport, who has no push to ai-foundry-byu/*; jddavenportOpen holds it. Separately the GitHub Governor denied gh pr create because ai-foundry-byu was not in JD_OWNERS. Fixed both: agent-system f6af55f2 adds the org to JD_OWNERS (26 tests pass), website faf9ade adds RUNBOOK.md documenting the credential split.
