# Changelog — ai-foundry-byu-website

The public AI Foundry site at https://aifoundry.byu.edu.

---

## 2026-08-08

- 20:29 — Merged feat/jobs-board and landed it — aifoundry.byu.edu/jobs is live (200). Root-caused the ai-foundry agent's block: not the permission classifier. origin is SSH as JDDavenport, who has no push to ai-foundry-byu/*; jddavenportOpen holds it. Separately the GitHub Governor denied gh pr create because ai-foundry-byu was not in JD_OWNERS. Fixed both: agent-system f6af55f2 adds the org to JD_OWNERS (26 tests pass), website faf9ade adds RUNBOOK.md documenting the credential split.
