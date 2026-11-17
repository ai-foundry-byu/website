# BYU Marriott co-brand lockup with the proposed wordmark (MOCKUP)

**Mockup for review, not an official lockup.** The co-brand lockup is issued by BYU Marriott Marketing and is
never recreated (design_handoff_ai_foundry_website/DESIGN_SYSTEM.md). This shows them what the new AI FOUNDRY
wordmark looks like in it; the final lockup, ideally in vector, comes from them.

Built by `scripts/build-lockup.py` (direction H). The left half and the divider are the official lockup's own
pixels, cropped from `public/brand/lockup.png` and `lockup-white.png` (x 0 to 2031 of 3305 x 360), never redrawn.
The new wordmark replaces the old AI FOUNDRY at the original's left edge (x 2159), cap height (177 px) and
baseline (y 268). The lockup grows from 3305 to 4126 px wide because the brand nameplate face is wider than the
old one; the cap height was kept, not reduced to fit.

| File | Use |
|---|---|
| `lockup.svg`, `lockup-2000.png` | on white |
| `lockup-white.svg`, `lockup-white-2000.png` | on navy (transparent background) |
| `lockup-sheet.png` | both, for review |

The SVGs embed the BYU Marriott half as a raster (the only source in the repo), so they are not pure vector.
At the website header's size the wordmark's cap height is about 20 px, where H's four touching pieces begin to
separate; check it in place before use.
