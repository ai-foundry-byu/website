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

Scott, 2026-11-14: "try smaller so the weight of the O is consistent with other letters", then "a little less
weight on the blue... almost like a special letter of the font." A band of 0.75 of the O's top weight matched the
font's O on box fill (0.54 vs 0.53) and on average stroke (156 vs 156.5 units) but read heavy: the hexagon's four
upper and lower corners hold solid shoulders where a round O is thinnest. Chosen by eye from 0.75, 0.60, 0.50 and
0.40 (`diamond-size-comparison.png`): 0.50, whose counter matches the U's and D's and whose bands match the
letters' horizontals.
