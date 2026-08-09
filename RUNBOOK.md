# RUNBOOK — ai-foundry-byu-website

The public site at **https://aifoundry.byu.edu** (Vercel, Next.js).
Repo: `git@github.com:ai-foundry-byu/website.git` — an **org** repo, not a
`JDDavenport/*` repo. That one fact is behind most of the trouble agents hit here.

## Pushing (read this before you push)

`origin` is SSH, and SSH on this box authenticates as **JDDavenport**, which has
**no push access** to `ai-foundry-byu/*`. A push over `origin` fails with:

```
ERROR: Permission to ai-foundry-byu/website.git denied to JDDavenport.
```

Push access is held by **jddavenportOpen**. Use its token:

```bash
cd ~/clawd/projects/ai-foundry-byu-website
T=$(grep -E '^GH_OPEN_TOKEN=' ~/agent-system/.env | cut -d= -f2- | tr -d '"'"'"'')
git push "https://jddavenportOpen:${T}@github.com/ai-foundry-byu/website.git" main
```

Do **not** bake the token into `.git/config` via `git remote set-url` — it ends
up in a plaintext file that gets read by every agent and every `git remote -v`.
Pass the URL on the command line; the token stays in `.env`.

Merging is ordinary local git — `git merge --no-ff <branch>` on `main`. There is
no branch protection and no ruleset on this repo, so there is no reason to open a
PR for a change JD has already authorized (and JD does not review PRs). Merge on
`main`, push, verify prod.

## GitHub Governor

`scripts/hooks/github_governor.py` judges outbound GitHub actions. `ai-foundry-byu`
was added to `JD_OWNERS` on 2026-08-08 — before that, a routine `gh pr create`
against this repo was denied as "self-promotion", because the governor had never
heard of the org and fail-safes to deny for unknown owners. If a governor deny
ever looks wrong here again, check `logs/github-governor.log` for the actual
reason before assuming it is the permission classifier.

## Verifying a deploy

Vercel builds on push to `main`; a deploy lands in roughly 30–60s.

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://aifoundry.byu.edu/          # 200
curl -s https://aifoundry.byu.edu/jobs | grep -oE "<title>[^<]*</title>"     # jobs board title
```

## /jobs — the VC jobs board

`/jobs` is **not** in this repo. It is a separate Next app (`ai-foundry-jobs`,
its own Supabase project and ingest pipeline) served through three rewrite rules
in `next.config.ts`:

- `/jobs` and `/jobs/:path*` → the board
- `/api/jobs/:path*` → the board's API — **required, not optional**. The board's
  sign-in and save calls are same-origin fetches; without this rule they resolve
  against this app, 404, and the gate silently accepts an email and does nothing.

A rewrite, not a redirect, so the host stays `aifoundry.byu.edu` — the board's
sign-in cookie is set with no `Domain` attribute, so it binds to the serving host.

Rollback for the whole board integration is deleting the `rewrites()` block.
