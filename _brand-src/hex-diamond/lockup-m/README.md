# BYU Marriott co-brand lockup with the proposed wordmark (MOCKUP, direction M: H with the O weighted like the letters)

**Mockup for review, not an official lockup.** The co-brand lockup is issued by BYU Marriott Marketing and is
never recreated (design_handoff_ai_foundry_website/DESIGN_SYSTEM.md). This shows them what the new AI FOUNDRY
wordmark looks like in it; the final lockup, ideally in vector, comes from them.

Built by `scripts/build-lockup.py` (direction M). The left half and the divider are the official lockup's own
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

## Why M

Scott, 2026-11-14: H, with the O's weight consistent with the other letters. Box-fill density cannot measure a
diamond (a solid diamond fills half its box), so weight was measured as average stroke (2 x area / edge length):
U, N, D and the font's O are about 156 units; H's touching hexagon left 44. Matching that number exactly shrinks
the hexagon to about half and over-counts the solid points, so the size was chosen by eye in the lockup from
1.00, 0.85, 0.75 and 0.65 of the touching hexagon (`hexagon-size-comparison.png`): 0.75.
