# BYU Marriott co-brand lockup with the proposed wordmark (MOCKUP, direction L: F with the O weighted like the letters)

**Mockup for review, not an official lockup.** The co-brand lockup is issued by BYU Marriott Marketing and is
never recreated (design_handoff_ai_foundry_website/DESIGN_SYSTEM.md). This shows them what the new AI FOUNDRY
wordmark looks like in it; the final lockup, ideally in vector, comes from them.

Built by `scripts/build-lockup.py` (direction L). The left half and the divider are the official lockup's own
pixels, cropped from `public/brand/lockup.png` and `lockup-white.png` (x 0 to 2031 of 3305 x 360), never redrawn.
The new wordmark replaces the old AI FOUNDRY at the original's left edge (x 2159), cap height (177 px) and
baseline (y 268). The lockup grows from 3305 to 4143 px wide because the brand nameplate face is wider than the
old one; the cap height was kept, not reduced to fit.

| File | Use |
|---|---|
| `lockup.svg`, `lockup-2000.png` | on white |
| `lockup-white.svg`, `lockup-white-2000.png` | on navy (transparent background) |
| `lockup-sheet.png` | both, for review |

The SVGs embed the BYU Marriott half as a raster (the only source in the repo), so they are not pure vector.
At the website header's size the wordmark's cap height is about 20 px, where F's hairline bands above and below
the diamond fade; check it in place before use.

## Why L

Scott, 2026-11-14: "try smaller so the weight of the O is consistent with other letters." Measured as ink density
(ink area over the letter's box at cap height): U, N, D, R average 0.59, the font's own O 0.53, F's O 0.36. L
shrinks the square diamond so the bands above and below it are 0.75 of the O's top weight, which brings the O to
0.54, the font's own O. `lockup-sheet.png` shows F above and L below.
