# Official AI Foundry Site — build spec

Everything needed to build this site. Confirmed with Brandon 2026-07-28.
Repo: `ai-foundry-byu/Official-AI-Foundry-Site`

## Decisions already made, do not relitigate

| Decision | Answer |
|---|---|
| Scope | **Clean rebuild.** Landing, Join the Network, About Us. Nothing else ported |
| Forms | **Embedded** (Tally / Google Forms). No backend, no database, **no environment variables** |
| About Us | **15 MBAs**, headshots available. Source roster from Scott's repo `/team` page |
| Hero line | **"An AI-native product studio and consultancy."** |
| Deploy | Push to `main`. Scott wires Vercel afterwards |

Deliberately excluded: `/jobs`, `/admin`, `/apply`, `/projects/new`, all API routes, Supabase.
Zero env vars is a feature. It removes the entire class of failure that broke the old project.

## Site structure

```
/                     landing
  #hero               big statement + 2 buttons
  #mission            mission, vision, values
                      then the proof band, faculty + builder experience
  #quote              Get a quote, offerings and the button out (anchor)
/quote                the form, and nothing else
/network              Join the Network subpage
/about                About Us, 15 MBA tiles
```

**Top nav:** `Join the network` and `About us` as plain tabs, plus `Get a quote`
as a button, all on a navy bar. No dropdowns.

`Get a quote` in the bar points at `/#quote`, the same place the hero button goes.
`Submit a project` is the hero button only, never a nav item.

**Two steps, two destinations, no overlap.** `/#quote` is what we build. `/quote` is
the form and nothing else. The offerings exist in exactly one place and the form
exists in exactly one place, so neither can drift out of step with a second copy of
itself. The only route to the form is through the offerings.

## Landing page, in order

### 1. Hero

Centred, Marketing Lab scale, with the anvil above it on the same axis.
The measure is capped so the sentence breaks over two lines rather than running
the full column width:

> **An AI-native product studio and consultancy.**

Two buttons side by side:

| Button | Behaviour |
|---|---|
| `Submit a project` | Smooth-scrolls **down the same page** to `#quote`. Not a link to another page |
| `Join the network` | Navigates to `/network` |

Later, not now: video or motion background behind the hero, like byumarketinglab.com.
Build the hero so a background layer can be dropped in without restructuring.

### 2. Mission, vision, values

Verbatim. Do not paraphrase, do not shorten, do not "improve."

**Mission**
> We develop AI builders of faith, skill, and integrity who amplify opportunity and increase abundance worldwide.

**Vision**
> A world where expertise is abundant, and human flourishing is never limited by access, only by ambition.

**Values**

1. **Technical Excellence.** We are judged by what we ship: whether it works, and whether someone would pay for it. We compete on output, not pedigree. Credentials, whitepapers, and good intentions don't count as evidence; working systems in production do. Every Foundry builder is expected to master the frontier and prove that mastery through shipped work.

2. **Moral Conviction.** We hold ourselves to a higher standard than any rule will ever require. The real test of character is what you build when no one is auditing you. Access to people's data, attention, and labor is a trust freely given, never a lever to pull. We build only what people would consent to if they fully understood it. Our faith and integrity are not a compliance layer; they are the reason we build at all.

3. **Relentless Urgency.** We don't wait for permission to act on what we already know is right. Free, responsible people don't wait for institutional consensus. Urgency is a choice, the only thing that turns belief into shipped work instead of another meeting. It is how we stay at the frontier, and how we bring the frontier back to BYU.

### 3. Get a quote, anchor `#quote`

Order within the section matters: **the offerings run before the form fields.**
Someone arriving here from the top bar has not necessarily read anything else on
the site, so the first thing they meet is what the engagement is, not a request
for their phone number.

Centred, matching the hero.

1. Heading and lead
2. **Three offerings**: full-stack applications, AI integration and orchestration,
   AI enablement and training. Copy lives in `OFFERINGS` in `content.ts`
3. A `Request a quote` button out to `/quote`

The card text is centred but the bullet lists inside are not: a bulleted list with a
centred ragged left edge is unreadable, so the block is centred and the lines stay
flush left inside it.

### 4. The form page, `/quote`

Exists to hold the form and nothing else. Someone arrives having already read the
offerings and decided to act, so anything competing for attention is a reason to
stop before submitting. One column, no offerings repeated, What happens next below
the form rather than above it.

The eleven-section intake brief is **split across two forms**, decided 2026-07-28
after a teardown of byumarketinglab.com. Nothing from the brief was dropped, it was
sequenced. `FORMS.md` is the field-by-field spec for both.

- **On the page: eight fields.** Marketing Lab's six (first, last, phone, email,
  company, project description) plus website and timeline. Two minutes to fill
- **After first contact: the rest**, as a longer intake survey
- **Budget is deliberately not up front.** It is the strongest qualifier in the brief
  and the fastest way to lose a visitor who has no reason yet to trust a first-year
  program. Revisit once inbound is steady

This supersedes the earlier open recommendation, which is now resolved.

## Join the Network, `/network`

Reachable from the hero button and the top nav. Embedded form.
Reference the existing `/network` page in Scott's repo, which collects: name, email, company, role, LinkedIn.
Existing copy there: "Welcome to the network."

## About Us, `/about`

Picture tiles for the 15 MBAs. Source the roster from Scott's repo `src/app/team/page.tsx`.
Headshots exist. Confirm where the files live before building the grid.

Known names from prior work, verify against Scott's repo before publishing:
JD Davenport, Rachel Moulton, Corbin Sterling, Brandon Jeppson, Alex Sisk, Abe Bedard,
Felix Vivanco Salazar, Jake Healey, Sylvan Scott, Chase Clement, John Passey,
Tyler Doman, Enoch Councill, Jorge Beltran.

Faculty: **Scott Murff**, Faculty Advisor, Associate Teaching Professor of Strategy, ex-McKinsey.
Naming him is the highest-value credibility item on the site. Confirm title with him first.

## Brand rules, non-negotiable

Carried over in `src/app/globals.css` as a three-layer token system with an enforced contrast
contract. `npm run check:contrast` fails the build on a violation.

- Palette is BYU Marriott's (system v3, Scott Murff's logo brief, 2026-11-12): navy `#002E5D` and white
  are the primaries, royal `#003DA5` and slate `#7C878E` the secondaries. No orange in the mark, the
  lockup or a call to action; BYU Marriott's accents are limited use and never an equal to navy
- **Royal is the action colour on light grounds and never sits on navy** (1.43:1). On navy, buttons are
  white with navy labels and links are white
- Secondary text on navy uses Mist `#DDE4EB`, 10.57:1
- Accent on the subtle grey surface is 4.27:1, so large text only
- Sentence case headlines. **No em dashes, ever**
- Never "the Marriott School". "BYU Marriott School of Business" first reference, "BYU Marriott" after
- Never a standalone "AI Foundry" without BYU identification
- The co-brand lockup wherever it can hold the BYU Marriott logo at 250 px or more with one "B" of BYU
  clear all round (Scott Murff's brief); never squeeze it below that. The AI Foundry mark alone (with
  AI FOUNDRY) is the brief's secondary version, allowed only where the BYU Marriott logo is clearly
  visible elsewhere on the page: below 768 px the header carries it and the footer carries the
  official BYU Marriott logo (`public/brand/byu-marriott/msb_left_white.svg`, unchanged) at 250 px
- **The official lockup is the glyph wordmark**, `public/brand/wordmark-glyph-white.png`,
  where the AI glyph stands in for the letters "AI". Treated as official from
  2026-07-29 by Brandon's decision. Regenerate with
  `scripts/build-wordmark.py`, then trim to content before installing
- The earlier lettered lockup is kept at `public/brand/lockup-white.png` as the
  revert path. Nothing references it

## The header glyph, and a measurement I got wrong

I argued against the glyph in the header on legibility grounds, calling it
illegible at 24px. That was wrong and the reasoning behind it was wrong.

The glyph renders 16.6px tall at the desktop header height and 11.1px at the
mobile one, and I judged from those numbers. They are CSS pixels. Every device
that matters renders at a device pixel ratio of 2 or 3, so the browser actually
rasterises the mark at roughly 33px on desktop and 22px on mobile. Rendered at
the real device resolution, the A, the diagonal and the horn all hold.

What survives of the objection is a taste question, not an accessibility one: the
glyph reads as "A plus something" rather than unambiguously "AI", and it is
visually heavier than the lettered version. Brandon's call, and it is made.

The lesson worth keeping: when judging whether artwork survives at a size, use
device pixels, not CSS pixels. A 2x display gives you twice the raster you think
you have.

## Type scale, set 2026-07-28

Measured off the rendered pages, not eyeballed. The rule that matters: **no prose
below 16px, nothing at all below 12px.**

| Size | Used for | Line height |
|---|---|---|
| 12px | labels and eyebrows only, `.eyebrow`, tracked 0.1em | 1.5 |
| 14px | the footer colophon, and nothing else | 1.63 |
| **16px** | **all body copy, nav, links, buttons** | 1.63 |
| 18px | section leads | 1.63 |
| 20 to 30px | card and sub headings | 1.2 to 1.4 |
| 36 to 72px | page headings | 1.0 to 1.11 |

What this replaced: body copy was running at 14px in the offering cards, team bios,
network interests and quote steps, eyebrows were 11px, and the footer colophon was
12px at 1.33 line height, the tightest text on the site.

Measure is capped where prose was running past the readable band. Values body was
84 characters and faculty 93; the comfortable range is 65 to 75, so both are capped
in rem rather than left to fill the column.

Two things worth knowing if you change type again:

- The dev server caches CSS aggressively. A change to `globals.css` that does not
  show up is probably stale Turbopack cache, not a broken selector. `rm -rf .next`
  and restart before debugging anything else
- Card body copy sits at roughly 37 characters a line because the cards are narrow.
  That is below the optimal band and it is fine: in a three-up card grid, size is
  what carries legibility, not measure

## Responsive, verified 2026-07-29

Checked at 360, 390, 640, 768, 1024 and 1440 on all four pages. **No horizontal
overflow anywhere**, gutters a consistent 24px, smallest rendered text 12px, and the
About tiles step 1 to 2 to 3 columns correctly.

`resize_window` does not work on this machine, it clamps at about 1456px, so this was
done with a throwaway page holding a same-origin iframe at a fixed width. An iframe of
a given width is a real viewport of that width, so media queries fire correctly, and
because it is same-origin the inner document can be measured directly rather than
eyeballed from a screenshot. Worth rebuilding if this needs checking again.

### The embedded form heights

A cross-origin iframe cannot report its own content height, so the height is declared
from outside in `EmbeddedForm`. Google Forms rewraps its labels as the frame narrows,
which makes the content **taller** on small screens, so the classes shrink as the
breakpoints rise. Measured content, and the values chosen:

| | content at 390px | content from md | height set |
|---|---|---|---|
| `/quote`, 8 questions | about 1895px | about 1705px | `h-[1950px] sm:h-[1890px] md:h-[1840px]` |
| `/network`, 6 questions | about 1515px | about 1415px | `h-[1600px] sm:h-[1540px] md:h-[1500px]` |

Too short is much worse than too tall: the frame becomes a nested scroll region that
swallows touch and trackpad scrolling and hides Submit behind an inner scrollbar most
people never find. Aim for 80 to 130px of slack. 1460 was tried on `/network` and left
only 45px, which is too thin to survive Google changing anything.

If the form's questions are edited, remeasure. Nothing warns you when this drifts.

## Build status, 2026-07-28

All three pages are built and all three gates pass. `npm run dev`, then look.

| Page | Route | State |
|---|---|---|
| Landing | `/` | Built. Hero, mission/vision/values, `#quote` |
| Request a quote | `/quote` | Built, and the real form is live |
| Join the Network | `/network` | Built. Interests list plus the form slot |
| About Us | `/about` | Built. Faculty, then 15 tiles with headshots |

Where the code lives:

- `src/lib/content.ts` — **every word of copy on the site.** Change text here, not in JSX
- `src/components/SiteHeader.tsx` — navy bar, the co-brand lockup, two nav tabs
- `src/components/SiteFooter.tsx`
- `src/components/EmbeddedForm.tsx` — the form slot and its fallback
- `src/app/{page,network/page,about/page}.tsx` — layout only, no copy

Notes on how it was built:

- **One client component, `MotionCta`.** Everything else is a server component and
  every route still prerenders to static HTML. The mobile menu is a native
  `<details>` and the hero button is a plain `#quote` anchor the browser scrolls
  itself, so neither needs script.

  This used to say "zero client JavaScript", which was always an overclaim: Next's
  App Router ships a framework bundle for hydration regardless. The accurate
  statement is "no client components, all routes static", and as of 2026-07-29 it
  is "one client component". Keep the boundary that tight. `MotionCta` is a small
  leaf, so the button hydrates rather than the page
- **Zero dependencies beyond Next and React.** Dropped `@supabase/supabase-js` and
  `motion`, both unused here. Nothing left to misconfigure
- The hero background is a separate layer already in place, so the video can drop in
  later without restructuring the section
- `data-scroll-behavior="smooth"` is set on `<html>`. Next 16 stopped suppressing CSS
  smooth scroll during navigation, so without it every route change would slowly glide

### The logo, resolved

**Brandon supplied the real co-brand lockup on 2026-07-28.** It is in the header and
the footer. This closes the open compliance risk: the site no longer ships the `af-*`
Block Y derivative, which was AI-generated and never approved.

Sources are archived in `_brand-src/`, and `scripts/build-brand-assets.py` regenerates
everything in `public/brand/`:

| File | Use |
|---|---|
| `lockup.png` | full colour, background knocked out, for light surfaces |
| `lockup-white.png` | white reversal, used in the header and footer |
| `anvil.png` | full colour, trimmed |
| `anvil-white.png` | white reversal, used in the hero |

The white reversal is the sanctioned treatment: BYU marks appear in navy or white
only. The script recolours and trims, it never redraws, so every letterform is the
one that arrived in the source file.

Still open, same category: `favicon-*.png` and `og-image.png` were carried over from
the old repo and probably still contain the derivative mark. Regenerate them from
the real lockup before launch.

## Still needed from Brandon

- [x] ~~The share URL for the project intake form~~ **Done 2026-07-29.** Live on `/quote`
- [ ] **The share URL for Join the Network.** Same, `FORMS.network`
- [ ] Confirm the 15 roles. Titles were carried from the old site and are unverified
- [ ] Confirm Scott Murff's title before it goes public. It is the highest-credibility
      line on the site and the one most worth getting exactly right, and it is now on
      the landing page as well as `/about`
- [x] ~~Confirm the Anthropic Claude Partner Network membership~~ **Confirmed by Brandon
      2026-07-29.** It is the third column of the proof band, stated as membership only
- [ ] **Do not claim the Claude Certified Architect certification until somebody holds
      it.** `voice.md` says students *pursue* it. Pursuing is not holding, and a false
      certification claim is worse than having no proof at all
- [ ] **Before using any Anthropic partner badge**, get the actual asset and its usage
      terms from `partnerportal.anthropic.com`. Do not approximate one. Note also that
      the Services Track tiers (Select, Preferred, Global Premier) are gated on counts
      of *certified individuals*, starting at ten for Select, so a tier badge is a
      different and stronger claim than plain membership and may not apply yet
- [x] ~~Regenerate `og-image.png` and the favicons~~ **Done 2026-07-29.** Both are
      generated from the glyph now, by `scripts/build-icons.py` and
      `scripts/build-og-image.py`. Neither is hand-made any more

Two things I decided rather than block on, both easy to reverse:

- **Nav is two plain tabs**, Join the network and About us, both pointing at pages
  that exist. Edit `NAV` in `content.ts`
- **The 30-field form question, answered.** Split into eight fields up front and a
  follow-up survey for the rest. See `FORMS.md` and the Get a quote section above

## Verification before any push

```sh
npm run lint
npm run check:contrast
npm run build
```

All three must exit 0. CI runs the same three on every PR.
