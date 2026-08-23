# Handoff: AI Foundry website redesign

## Overview
A full redesign of the AI Foundry marketing site (landing, quote, work, about, roadmap) plus the design system behind it: BYU official palette, the Archivo + IBM Plex type system, and a component library. Target codebase: `ai-foundry-byu/website` (Next.js App Router). All copy comes from `src/lib/content.ts` in that repo and is used verbatim here.

## About the design files
Everything in this bundle is a **design reference built in HTML**: prototypes showing intended look and behavior, not production code to ship. The task is to **recreate these designs inside the existing Next.js codebase** using its established patterns (App Router pages, `src/lib/content.ts` for copy, `globals.css` for tokens). The `.jsx` component files here are plain React with inline styles and no dependencies, so most port with minor changes (see Integration map). Ignore `ds-fallback-loader.js` and the Babel/CDN scaffolding in the `ui_kits/*.html` files: that is preview plumbing for the design tool, not part of the design.

## Fidelity
**High-fidelity.** Colors, type (including Archivo variable width stops), spacing, radii, and interactions are final. Recreate pixel-perfectly.

## Integration map (repo-specific)
- **Tokens** → merge `tokens/*.css` custom properties into `src/app/globals.css` `:root`. The files are small and commented; keep the comments, they carry the rules.
- **Fonts** → replace the current font setup with `next/font/google`: `Archivo` (variable, axes: `wdth 62..125`, `wght`), `IBM_Plex_Sans` (300/400/500/600 + italic 400), `IBM_Plex_Mono` (400). Wire them to `--font-display`, `--font-body`, `--font-mono`. Critical: Archivo must load with the `wdth` axis or every width stop breaks; control width via `font-stretch`, never `font-variation-settings`.
- **Components** → port `components/**/*.jsx` to `src/components/`. Each has a `.d.ts` (props contract) and a `.prompt.md` (usage). They are self-contained React function components with inline styles reading CSS custom properties; hover/press state uses `useState`. Port as-is or translate to the repo's styling convention, preserving exact values.
- **Icons** → the `Icon` component fetches Carbon SVGs from CDN. In the repo, install `@carbon/icons-react` instead and keep the same names (flagged in DESIGN_SYSTEM.md as a substitution decision).
- **Pages** → the five `ui_kits/*/index.html` files map to routes: landing → `/`, quote → `/quote`, work → `/work`, about → `/about`, roadmap → `/roadmap`. Copy strings must keep coming from `src/lib/content.ts` (mission/vision/values are verbatim blocks; never inline-edit them in components).
- **Images** → already in the repo: `public/team/*.jpg`, `public/showcase/*.jpg`. This bundle references its own copies under `assets/`-style relative paths; swap to `/team/...`, `/showcase/...`.
- **Forms** → the quote form posts to the existing `/api/quote` route (Supabase). The design's client-side validation and error/loading/success states are in `ui_kits/quote/index.html`; keep the field set exactly (8 fields, budget deliberately excluded).
- **Roadmap counts** → read live via the existing `src/lib/roadmap-stats.ts` pattern; the design shows a labeled sample value in the cert progress bar.

## Screens
1. **Landing** (`ui_kits/landing/index.html`): sticky NavBar; hero with rail-62 eyebrow over an all-caps cast-125 stack ("Student-built. / Production-grade. / AI-native." with AI-native in royal), slow shader-style motion layer behind (navy/white/royal blobs, grain, white scrim left; ShaderGradient reference params in DESIGN_SYSTEM.md); auto-scrolling shipped-at name strip (text only, never logos); Mission then Vision centered, each in its own band (Archivo plate, 34px); Values as three expanding rows (verbatim bodies); What we build as three hairline cards; navy CTA band; navy footer.
2. **Quote** (`ui_kits/quote/index.html`): plate H1, lead, 8-field form in a 2-col grid (textarea + select span both), required-field validation (error = 2px royal border + "Error: …" text, no red exists in the palette), loading spinner on submit, confirmation empty-state, three "what happens next" steps with royal cast numerals.
3. **Work** (`ui_kits/work/index.html`): "Built here. Running now." + four ShowcaseCards (16:10 screenshot, name, tags as Badges, verbatim blurbs, outbound links with Carbon arrow).
4. **About** (`ui_kits/about/index.html`): intro, faculty advisor block (hairline card), 25 TeamCards with real headshots — resting navy-tinted monochrome (grayscale + navy color-blend at 45%), full color on hover, 300ms stamp ease — then culture principles as expanding rows with credits.
5. **Roadmap** (`ui_kits/roadmap/index.html`): three phases with royal cast numerals, hairline item rows, status Badges (live = royal border, active/planned = slate), cert Progress bar.

## Interactions & behavior
- Buttons: hover swaps royal→navy (secondary fills navy); press translates down 1px; loading shows a square spinner; `white-space: nowrap; flex: none`.
- Links: royal, hover navy. Focus: 2px royal outline, 2px offset, on everything.
- ValueRow: grid-template-rows 0fr→1fr expand, "+" rotates 45°; 300ms `cubic-bezier(.2,.9,.3,1)`.
- NameCarousel: CSS marquee (duplicated row, translateX −50%, ~28s linear loop), masked edges.
- Motion layer: three blurred blobs, 52–64s alternate drift, grain overlay at .16, `prefers-reduced-motion` disables.
- Dialog: navy scrim `rgba(0,46,93,.55)`, sharp 5px-radius panel, click-outside closes.

## Design tokens
- Colors: navy `#002E5D`, white `#FFFFFF`, royal `#003DA5`, slate `#7C878E` only. Hairline `rgba(0,46,93,.15)`, input border `rgba(0,46,93,.4)`. Royal never sits directly on navy. Slate = metadata only.
- Type: Archivo display only above 24px, width stops 125/100/62 only, never below wght 600; IBM Plex Sans ≤24px, never above 600, drops to 300 on navy; full scale in `tokens/typography.css`.
- Spacing: 4px base scale (see `tokens/spacing.css`); container 1200px/24px pad; body measure 60–75ch.
- Radius: `--radius: 5px` on boxes (buttons, inputs, cards, badges, dialogs). Full-bleed bands and hairline rules stay square. No shadows anywhere.
- Motion: 150/300ms, `cubic-bezier(.2,.9,.3,1)`.

## Assets
- Headshots and showcase screenshots: already in the repo under `public/`.
- The BYU Marriott co-branded lockup is a locked file from BYU Marriott Marketing — the "× BYU MARRIOTT" text next to the nameplate is a placeholder for it. Never recreate it.
- No other imagery. No AI-generated images, no stock.

## Files
- `DESIGN_SYSTEM.md` — the full brand/system documentation (rules, voice, honesty claims)
- `SKILL.md` — agent-skill entry point (drop into the repo for Claude Code to use)
- `styles.css` + `tokens/` — the token source of truth
- `components/<group>/<Name>.jsx|.d.ts|.prompt.md` — 20 components in forms/navigation/display/content/feedback
- `ui_kits/<page>/index.html` — the five page references (open in a browser to inspect)
- `guidelines/*.html` — visual specimen cards (type, color, spacing, devices, voice)

## Suggested Claude Code workflow
1. Create a branch in `ai-foundry-byu/website`; drop this folder at the repo root.
2. Prompt: "Read design_handoff_ai_foundry_website/README.md and DESIGN_SYSTEM.md. Implement the design system tokens and fonts first (globals.css + next/font), then port the components, then rebuild the five routes to match the ui_kits references. Copy stays in src/lib/content.ts."
3. Review pages against the HTML references side by side; the type width stops (125/100/62) and the no-logos/voice rules are the things most worth checking.
