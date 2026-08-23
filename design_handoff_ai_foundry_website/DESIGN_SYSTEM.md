# AI Foundry Design System

An AI-native product studio and consultancy. An experiential learning program of the BYU Marriott School of Business: ~30 MBA and undergraduate students building and shipping production AI systems for real clients. A workshop, not a lab and not a startup — everything should feel made, industrial, and durable.

## Sources
- Type system spec (source of truth): `uploads/ai-foundry-design-system-prompt.md`
- Copy source: GitHub `ai-foundry-byu/website` (main), chiefly `src/lib/content.ts` — mission/vision/values are VERBATIM blocks, never paraphrase
- Palette: official BYU brand colors, provided by the team
- Visual direction: locked in-canvas as option 4b of `AI Foundry Wireframes.dc.html` (white-dominant, royal accents, stamped nameplate, cast stack hero)

## Content fundamentals
- Tone: professional, declarative. Short and punchy. No em dashes, no semicolons in prose, no jargon.
- Truthfulness rules are brand law: "Our builders have shipped at …" (a resume claim), never "trusted by" / "partners with" (a relationship claim). No company logos in the shipped-at strip, ever — names as text only. Claims go up only when a named person on /about backs them.
- Naming: "BYU Marriott School of Business" in full on first reference, "BYU Marriott" after. Never a standalone "AI Foundry" without BYU identification.
- Numerals for credibility stats ("30 students"), spelled-out words for asides ("Approximately two minutes").
- Voice: "we" for the program, "you" for the client. No emoji, anywhere.
- Verbatim blocks (do not edit): mission, vision, the three values (Technical Excellence, Moral Conviction, Relentless Urgency).

## Visual foundations
- Color: white-dominant pages. Navy is text and the inverse ground (footer, CTA band). Royal is THE accent: primary buttons, eyebrows, accent words, focus rings. Slate is metadata only. Royal never sits directly on navy. No other colors, no tints beyond navy alphas for hairlines.
- Type: Archivo variable (display, >24px; width stops 125/100/62 only; never below wght 600) + IBM Plex Sans (body/UI, ≤24px; never above 600; drops to 300 on dark grounds) + IBM Plex Mono (code only). Max two width stops per composition. Full spec in `tokens/typography.css` and the uploads md.
- Signature devices: compression pair (rail eyebrow directly above a cast headline), mold fill (stacked lines width-tuned to a shared measure), stamped nameplate (Archivo 700 cast, all caps, max contrast).
- Backgrounds: flat solids only, with ONE exception: the hero motion layer (see Motion). No other gradients, textures, or patterns. Full-bleed hairline rules separate sections.
- Borders: 1px hairlines `rgba(0,46,93,.15)`; strong borders are solid navy. Corners: boxes (cards, buttons, inputs, dialogs, badges) round at 4-6px — the token `--radius` is 5px. Full-bleed bands and hairline rules stay square.
- Shadows: none. Elevation is drawn with hairlines.
- Hover: color swaps (royal→navy fills, links royal→navy). Press: translateY(1px) — stamped. Focus: 2px royal outline, 2px offset.
- Errors: the palette has no red. Error state = 2px royal border + a message that says "Error:" in words, so color is never the only signal. Loading = square royal spinner in the button, label stays.
- Motion: 150/300ms, ease `cubic-bezier(.2,.9,.3,1)`. Fades and small translates; a CSS marquee for the shipped-at strip. No bounces, no springs. Hero motion layer: a slow shader-style gradient field behind the hero (navy, white, royal; grain on; white scrim over the text column). Reference is ShaderGradient (plane, defaults shader, uSpeed 0.1, uFrequency 5.5, uStrength 4, rotationZ 50, grain on, brightness 1.3); the shipped CSS stand-in lives in `ui_kits/landing/index.html` and `guidelines/brand-motion.html`. The reference's #0047BA is normalized to official royal #003DA5 — no off-palette colors.
- Layout: 1200px container, 24px side pad. Sections separated by hairlines or ground changes (white → navy). Generous vertical rhythm (96px+ between sections).
- Cards: white, 1px hairline border, 5px radius, no shadow.
- Imagery: team headshots (assets/team/, square crop) rest in navy-tinted monochrome and reveal full color on hover (TeamCard behavior). Showcase screenshots (assets/showcase/, 1200×750 16:10 crops of live products) stay full color. No AI-generated imagery, no stock photos.
- Dark ground (navy): body text drops to Plex 300, soft text is white at 75%.

## Iconography
Carbon icons (IBM design language — same family as IBM Plex) via CDN, rendered through the Icon component (`components/display/Icon.jsx`), inlined SVG colored by currentColor, default 20px. Use sparingly: link arrows ("arrow--up-right", "launch"), dialogs ("close"), feedback ("checkmark", "warning"), nav ("menu"). Structural glyphs that predate the set stay unicode: + (values expand), · (carousel separator). No emoji, ever. This is a CDN substitution flagged for review: if the team prefers self-hosted assets, copy the SVGs into assets/.

## Logo
No logo files were provided. The wordmark is typographic: the stamped nameplate (`.nameplate` class). "× BYU MARRIOTT" beside it is a text placeholder — the real co-branded lockup ships as a locked file from BYU Marriott Marketing and must never be recreated or approximated.

## Index
- `styles.css` — global entry; imports everything under `tokens/`
- `tokens/` — fonts, colors, typography, spacing/motion
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/forms/` — Button, Input, Textarea, Select
- `components/navigation/` — NavBar, Footer
- `components/display/` — Eyebrow, SectionHeader, Card, Stat, Icon, Badge, Table
- `components/content/` — ValueRow, NameCarousel, TeamCard, ShowcaseCard
- `components/feedback/` — Dialog, EmptyState, Progress
- `ui_kits/landing/` — the hi-fi landing page (direction 4b, structure 1b)
- `ui_kits/quote/` — the quote form page (8 fields, validation, confirmation)
- `ui_kits/work/` — reference builds with real screenshots
- `ui_kits/about/` — faculty, team roster (real headshots), culture principles
- `ui_kits/roadmap/` — three phases, status badges, live-count pattern
- `assets/team/`, `assets/showcase/` — headshots + product screenshots copied from the repo
- `AI Foundry Wireframes.dc.html` — the working canvas (wireframes + style directions)
- `SKILL.md` — agent skill entry point

## Intentional additions
No component inventory existed in the sources (the repo was used for copy only, by the team's decision), so the component set was authored from the approved wireframes: every component corresponds to an element visible in direction 4b / structure 1b. Stat exists for the roadmap/credibility numbers pattern ("30" as numeral).

## Caveats
- Hero motion: CSS stand-in shipped; swap to the real ShaderGradient embed in production if desired (params in Visual foundations).
- The BYU Marriott co-branded lockup is NOT here — request the locked file from BYU Marriott Marketing.
- Fonts load from Google Fonts (Archivo, IBM Plex Sans/Mono are all OFL there); no font binaries ship with this system.
