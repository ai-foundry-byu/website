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
- The diamond is royal and lighter than the hexagon; it is fitted to keep an exact clear space from the
  hexagon on every side.
- The symbol's side bearings are smaller than the O's (a pointed side reads farther away), and smaller again on
  the left, where F's open side already leaves white.
- Shapes are filled outlines, never SVG strokes. Letters are outlined from the font; no font is needed.

## Directions

`comparison.html` shows five. `variants/` holds every file for each.

| | Name | Hexagon (slants / flats) | Diamond weight | Clear space |
|---|---|---|---|---|
| A | Balanced | 0.80 / 0.86 | 0.32 stem | 0.95 of the diamond weight |
| B | Strong core | 0.86 / 0.92 | 0.40 stem | 0.70 |
| C | Open | 0.76 / 0.82 | 0.26 stem | 1.50 |
| D | Parallel | 0.80 / 0.86 | 0.26 stem, a rhombus with sides parallel to the hexagon's slants | 0.62 |
| E | Cut | solid; flats 0.72 of the O's top, narrowest wall 0.80 stem | none: a square diamond cut out of the hexagon is the O's counter | n/a |

`svg/`, `png/`, `favicon.ico` and `preview.html` are the chosen direction (currently E). To rebuild with another:

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
| `svg/avatar.svg`, `png/avatar-*.png` | Social avatars; the symbol sits inside the circle platforms crop to |

## Use

- Colors: navy #002E5D, royal #003DA5, white. Royal never sits on navy, so the reversed version is all white.
- Clear space: keep the height of the hexagon clear on every side.
- Minimum size: wordmark 16 px tall on screen, 0.25 in in print. Symbol 16 px (use the favicon files below 24 px).
- Never stretch, rotate, recolor outside the palette, add effects, or redraw the letters.
- Never show "AI Foundry" without BYU identification nearby. The co-branded BYU Marriott lockup comes only from
  BYU Marriott Marketing and is never recreated.
- BYU's marks rule allows navy or white only; the two-color primary (royal diamond) uses an official BYU color,
  but confirm with BYU Marriott Marketing before it appears beside a BYU mark. The navy single-color version is
  always safe.
