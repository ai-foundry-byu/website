"""Re-seat the Runout mark in the OG card and the app icons from the vector files in public/brand/runout.

    python3.12 scripts/build-runout-og-icons.py            # write public/og-image.png, favicon-180.png, favicon-512.png
    python3.12 scripts/build-runout-og-icons.py --check    # render into a temp file only and report the pixel diff

OG card (1200 x 630, Navy): the layout, the line, the tagline and the draft chip are kept as they are; only the two
places that carry the mark are painted Navy and redrawn from vector: the header lockup
(cobrand/lockup-runout-white-web.svg, 600 px wide at x 76, y 150.5) and the large mark (mark-white.svg, the 512-unit
master drawn at 400 px, origin 703.8, 115). App icons: the v3 tile as the site has
carried it, a flat Navy 512 field with mark-white.svg on it at full size, full bleed, no alpha, at 512 and 180. Renders go through rsvg-convert.
"""
import io
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

R = Path(__file__).resolve().parent.parent
PUB = R / "public"
BR = PUB / "brand" / "runout"
NAVY = (0, 46, 93)

LOCKUP = dict(x=76.0, y=150.5, w=600.0)            # ink box of the drawn lockup on the card
MARK = dict(x=751.5 - 61 * 400 / 512, y=140 - 32 * 400 / 512, size=400.0)


def rsvg(svg_text, w, h):
    with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False) as f:
        f.write(svg_text)
    out = subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), f.name], capture_output=True, check=True)
    return Image.open(io.BytesIO(out.stdout)).convert("RGBA")


def inner(svg_text):
    return svg_text[svg_text.index(">", svg_text.index("<svg")) + 1:svg_text.rindex("</svg>")]


def viewbox(svg_text):
    import re
    return [float(v) for v in re.search(r'viewBox="([^"]+)"', svg_text).group(1).split()]


def og(base):
    lk = (BR / "cobrand" / "lockup-runout-white-web.svg").read_text()
    mk = (BR / "mark-white.svg").read_text()
    lx, ly, lw, lh = viewbox(lk)
    pad = 0.5  # the -web viewBox carries 0.5 units of pad round the ink
    s = LOCKUP["w"] / (lw - 2 * pad)
    W, H = base.size
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
           f'<svg x="{LOCKUP["x"] - pad * s}" y="{LOCKUP["y"] - pad * s}" width="{lw * s}" height="{lh * s}" '
           f'viewBox="{lx} {ly} {lw} {lh}" overflow="hidden">{inner(lk)}</svg>'
           f'<g transform="translate({MARK["x"]} {MARK["y"]}) scale({MARK["size"] / 512})">{inner(mk)}</g></svg>')
    layer = rsvg(svg, W, H)
    card = base.convert("RGBA").copy()
    from PIL import ImageDraw
    d = ImageDraw.Draw(card)
    d.rectangle((LOCKUP["x"] - 4, LOCKUP["y"] - 4, LOCKUP["x"] + LOCKUP["w"] + 4, 224), fill=NAVY + (255,))
    d.rectangle((740, 130, 1070, 500), fill=NAVY + (255,))
    card.alpha_composite(layer)
    return card.convert("RGB")


def main():
    check = "--check" in sys.argv
    base = Image.open(PUB / "og-image.png").convert("RGB")
    card = og(base)
    if check:
        import numpy as np
        a, b = np.asarray(base).astype(int), np.asarray(card).astype(int)
        diff = np.abs(a - b).sum(2)
        print("og pixels differing by >60:", int((diff > 60).sum()), "max", int(diff.max()))
        return
    card.save(PUB / "og-image.png", optimize=True)
    mk = (BR / "mark-white.svg").read_text()
    icon = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" '
            f'fill="#002E5D"/>{inner(mk)}</svg>')
    for n in (512, 180):
        rsvg(icon, n, n).convert("RGB").save(PUB / f"favicon-{n}.png", optimize=True)
    print("wrote og-image.png, favicon-512.png, favicon-180.png")


if __name__ == "__main__":
    main()
