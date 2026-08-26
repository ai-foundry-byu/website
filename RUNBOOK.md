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

## `npm run build` fails locally but passes in CI — check `NODE_ENV` first

**Symptom.** `next build` compiles fine, then dies during static export:

```
✓ Compiled successfully
Error occurred prerendering page "/_not-found"
TypeError: Cannot read properties of null (reading 'useContext')
Export encountered an error on /_not-found/page, exiting the build.
```

**Cause.** `NODE_ENV=development` is exported in the shell. Next says so, one line
into the output, and it is easy to scroll past:

```
⚠ You are using a non-standard "NODE_ENV" value in your environment.
```

React then resolves a development copy inside a production export and the
prerender of the framework's own `/_not-found` boundary blows up on a null
dispatcher. Nothing is wrong with the page — it is Next's built-in one.

**Fix.** Build with the value the deploy actually uses:

```bash
env NODE_ENV=production npm run build
```

Verified 2026-08-26: identical tree, `NODE_ENV=development` exits 1,
`NODE_ENV=production` exits 0 with 15/15 static pages.

**Do not** chase this into the Node version. It has been blamed on Node 26
before and that was wrong — Node 26.0.0 builds this repo clean. It is the
environment variable, and CI passes precisely because CI does not set it.

## Internal pages and their tokens

Two routes are deliberately unlisted, `noindex`, and fail **closed** — if the
token env var is unset, every request 404s, so a misconfigured deploy hides the
page rather than exposing it.

| Route | Env var | Audience |
|---|---|---|
| `/ops?k=…` | `OPS_TOKEN` | JD + leadership. The wall metric and the shortfalls. |
| `/brief?k=…` | `BRIEF_TOKEN`, falling back to `OPS_TOKEN` | The advisory board standing report. |

The fallback exists so a deploy without `BRIEF_TOKEN` still works for whoever
holds the internal link. Set `BRIEF_TOKEN` separately when the brief goes to
people who should not also get `/ops`.

A token in a query string is obscurity, not security — it leaks through
referrers, history, and any log that keeps full URLs. That is acceptable for
numbers that are embarrassing rather than sensitive. **Do not put anything
private about a person on either page.**
