# AI Foundry logo: hexagon and diamond (proposed)

Status: **proposed, not approved.** Nothing here is in `public/` or on the live site. On approval, the chosen
direction's files move to `public/brand/` beside the current assets.

## The idea

The wordmark is the brand's stamped nameplate (Archivo 700, width 125, all caps) with the O of FOUNDRY replaced
by one symbol:

- **The hexagon** is the Builder Profile: Discovery, Design, Application Architecture, AI Systems, Agentic
  Workflow, Launch and Learn. Flat top and bottom, points left and right, as the app draws the Builder Hexagon.
- **The diamond** is the Consultant Profile: Judgment, Ownership, Communication, Collaboration, vertices at top,
  right, bottom and left, as the app draws the Consultant Diamond.

Building working AI products, and the judgment to deliver client outcomes, as one mark.

## Construction

All geometry is computed from the typeface by `scripts/build-logo.py`, so it stays consistent if anything changes:

- The hexagon's flat edges sit exactly on the baseline and cap height (flats need no overshoot).
- Its slanted edges carry 0.76 to 0.86 of the stem weight and its flat edges 0.82 to 0.92 of the O's top
  thickness: a 60-degree band reads darker than a vertical stem of the same width, so it is drawn lighter to
  match the letters' color.
- Every diamond is a scaled copy of the rhombus that joins the midpoints of the hexagon's flats to its two
  points (width : height = 2 : sqrt 3). Scaled up from the center, its four corners reach the hexagon together:
  top and bottom at the flats, left and right at the points (Scott, 2026-11-14). D is the exception: its sides
  run parallel to the hexagon's slants instead.
- In A to D the diamond is royal and lighter than the hexagon, fitted to keep an exact clear space from the
  hexagon on every side. In E it is cut out of a solid hexagon as the O's counter.
- The symbol's side bearings are smaller than the O's (a pointed side reads farther away), and smaller again on
  the left, where F's open side already leaves white.
- Shapes are filled outlines, never SVG strokes. Letters are outlined from the font; no font is needed.

## Directions

`comparison.html` shows thirteen. `variants/` holds every file for each.

| | Name | Hexagon (slants / flats) | Diamond weight | Clear space |
|---|---|---|---|---|
| A | Balanced | 0.80 / 0.86 | 0.32 stem | 0.95 of the diamond weight |
| B | Strong core | 0.86 / 0.92 | 0.40 stem | 0.70 |
| C | Open | 0.76 / 0.82 | 0.26 stem | 1.50 |
| D | Parallel | 0.80 / 0.86 | 0.26 stem, a rhombus with sides parallel to the hexagon's slants | 0.62 |
| E | Cut | solid; flats 0.72 of the O's top, narrowest wall 0.80 stem | none: the aligned diamond cut out of the hexagon is the O's counter | n/a |
| F | Facets | solid; a hairline band (0.125 of the O's top) above and below the diamond keeps the hexagon whole | none: a true square diamond cut out nearly to the edges; its side corners stop short of the hexagon's points (a square cannot reach them and the flats at once) | n/a |
| G | Facets, stretched | solid, split into four triangles | none: the diamond stretched 2 : sqrt 3 so all four corners touch the hexagon | none |
| H | Inverted | none: a square diamond is the O (points overshoot 3%) | a flat-topped hexagon cut out as the counter, as large as fits: its four upper and lower corners sit exactly on the diamond's sides (point radius 2/(1+sqrt 3) of the diamond's half-width), which splits the navy into four pieces meeting at those points | n/a |
| I | Inverted, solid hexagon | a diamond outline (0.40 stem, royal in the primary) with white inside | the largest solid navy hexagon, its four upper and lower corners touching the outline's inner edge | n/a |
| J | Inverted, keyline | a diamond outline (0.40 stem, royal in the primary) with white inside | a solid navy hexagon with a white keyline (0.20 stem): the hexagon plus its keyline touches the outline at four corners | n/a |
| K | Inscribed | a solid white diamond with a hairline navy border (0.09 stem, about 1.5 pt at a 100 pt wordmark); on navy the diamond is solid white | a solid navy hexagon inscribed, its four upper and lower corners on the diamond's sides; only the diamond's four corners show | n/a |
| L | Facets, balanced | solid, as F, with the band at 0.50 of the O's top so the O reads as a letter of the font (Scott, 2026-11-14, chosen by eye from 0.75 / 0.60 / 0.50 / 0.40) | a square diamond cut out, as F | n/a |
| M | Inverted, balanced | none: a square diamond is the O, as H | the hexagon cut out at 0.75 of the largest that fits, so the navy forms one ring and the O carries the letters' weight (chosen by eye from 1.00 / 0.85 / 0.75 / 0.65) | n/a |

`svg/`, `png/`, `favicon.ico` and `preview.html` are the chosen direction (currently L). To rebuild with another:

    python3 scripts/export-logo.py --font <Archivo[wdth,wght].ttf> --choose d

The font is OFL, from github.com/google/fonts (`ofl/archivo`); it is not stored in this repo.

## Files

| File | Use |
|---|---|
| `svg/wordmark.svg` | Primary. Navy, diamond in royal, on white |
| `svg/wordmark-navy.svg`, `-black.svg` | Single color |
| `svg/wordmark-white.svg` | Reversed, on navy |
| `svg/glyph*.svg` | The symbol alone, same color set |
| `svg/favicon.svg`, `favicon.ico`, `png/favicon-*.png` | Browser tab, Apple touch icon (180), PWA icons (192, 512) |
| `svg/favicon-16.svg` | 16 px only: the diamond is filled, since no outline survives at that size |
| `svg/lockup.svg`, `svg/lockup-white.svg` | Mockups of the BYU Marriott lockup for review only; never ship them |
| `svg/avatar.svg`, `png/avatar-*.png` | Social avatars; the symbol sits inside the circle platforms crop to |

## Notes on L (chosen, 2026-11-14)

Scott, 2026-11-14, after seeing L and M side by side with the BYU Marriott lockup: "I like the diamond inscribed in the hex better." L is F with the band at 0.50 of the O's top: the hexagon is as wide as the font's O, so FOUNDRY keeps its letter spacing, and the band reads at every size down to the 16 px favicon.

## Notes on H

Scott, 2026-11-14: tried with the roles swapped, then picked for a time ("I think this could look really cool"); M is H with the hexagon at 0.75 so the O carries the letters' weight; L replaced both. A strong standalone symbol (a gem with a hexagonal window), a weaker
letter: the diamond's mass sits in its four points, which a flat-topped hexagon cannot reach into, so the O reads darker
than the letters; and a square diamond at cap height is about 18% narrower than the font's O, so the word can read as
F-diamond-UNDRY at small sizes.

## Notes on F

Scott, 2026-11-14: keep the diamond a true square (90-degree corners), as close to the hexagon's edges as it can go,
with a little width left on the top and bottom lines so it reads as a hexagon with a diamond set into it. The band
is 0.125 of the O's top weight (Scott halved it twice: "a bit bigger... split the difference", then "split the
difference again"). It shows at about 32 px tall and up; below that the band fades and the top and bottom read as
broken, so prefer the wordmark at 32 px or larger. The
favicon and avatar files keep 0.45 (0.60 at 16 px) so the hexagon's top and bottom lines survive in a browser tab. A square cannot touch the
flats and the points at once (the points are 2 / sqrt 3 farther out), so the side corners stop short; G shows the
stretched diamond that touches all four.

## Use

- Colors: navy #002E5D, royal #003DA5, white. Royal never sits on navy, so the reversed version is all white.
- Clear space: keep the height of the hexagon clear on every side.
- Minimum size: wordmark 32 px tall on screen for the band to show (it still reads as AI FOUNDRY down to 16 px),
  0.4 in in print. Symbol 16 px (use the favicon files below 24 px).
- Never stretch, rotate, recolor outside the palette, add effects, or redraw the letters.
- Never show "AI Foundry" without BYU identification nearby. The co-branded BYU Marriott lockup comes only from
  BYU Marriott Marketing and is never recreated.
- BYU's marks rule allows navy or white only; the two-color primary (royal diamond) uses an official BYU color,
  but confirm with BYU Marriott Marketing before it appears beside a BYU mark. The navy single-color version is
  always safe.
