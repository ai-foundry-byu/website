#!/usr/bin/env python3
"""
MOCKUP for review: the BYU Marriott co-brand lockup with the proposed AI FOUNDRY wordmark.

    python3 scripts/build-lockup.py --font <Archivo[wdth,wght].ttf> [--variant h] [--out _brand-src/hex-diamond/lockup]

The left half (BYU MARRIOTT / SCHOOL OF BUSINESS) and the divider are the official lockup's own pixels, cropped
from public/brand/lockup.png and lockup-white.png and never redrawn. Only the AI FOUNDRY half is replaced, set at
the original's left edge (x 2159), cap height (177 px) and baseline (y 268).

The official co-brand lockup is issued by BYU Marriott Marketing and is never recreated (DESIGN_SYSTEM.md). This
file is a mockup to show them; the final lockup, ideally in vector, comes from them.
"""
import argparse
import base64
import importlib.util
import io
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("build_logo", HERE / "build-logo.py")
bl = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bl)

KEEP_TO = 2032          # through the divider (x 2026 to 2031)
TEXT_LEFT = 2159        # where the original AI FOUNDRY starts
CAP_TOP, BASELINE = 91, 268
HEIGHT = 360


def build(font, key, out):
    tmp, f, gs, cmap, m = bl.load(font)
    v = bl.VARIANTS[key]
    out.mkdir(parents=True, exist_ok=True)
    s = (BASELINE - CAP_TOP) / m["cap"]  # font units to lockup pixels
    for name, src, letters in (("lockup", "lockup.png", bl.NAVY), ("lockup-white", "lockup-white.png", bl.WHITE)):
        left = Image.open(HERE.parent / "public/brand" / src).convert("RGBA").crop((0, 0, KEEP_TO, HEIGHT))
        buf = io.BytesIO()
        left.save(buf, "PNG")
        uri = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
        body, w, _h = bl.wordmark(tmp, f, gs, m, v, letters, letters, letters)
        width = TEXT_LEFT + w * s
        pad = 0
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
               f'viewBox="0 0 {width:.0f} {HEIGHT}" role="img" aria-label="BYU Marriott School of Business, AI Foundry">'
               f'<title>BYU Marriott School of Business | AI Foundry (mockup)</title>'
               f'<image href="{uri}" x="0" y="0" width="{KEEP_TO}" height="{HEIGHT}"/>'
               f'<g transform="translate({TEXT_LEFT} {CAP_TOP}) scale({s:.6f})">{body}</g></svg>\n')
        import re
        svg = re.sub(r'<path [^>]*d=""/>', "", svg)
        (out / f"{name}.svg").write_text(svg)
    return width


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True)
    ap.add_argument("--variant", default="h", choices=sorted(bl.VARIANTS))
    ap.add_argument("--out", default="_brand-src/hex-diamond/lockup")
    a = ap.parse_args()
    w = build(a.font, a.variant, Path(a.out))
    print(f"lockup mockup ({a.variant}) {w:.0f} x {HEIGHT} -> {a.out}")
