"""Seat the Facets L identity (Scott Murff's direction L, round 17 kit) in the site. Draft for BYU Marriott approval.

    ~/agent-system/.venv-design/bin/python scripts/build-facets-assets.py

Source: the design team's round 17 kit (KIT below). Nothing here redraws the mark; every vector is the kit's file.
Writes:
- public/brand/facets/: mark, mark-reversed, wordmark, wordmark-white (kit files, unchanged), and the co-brand
  lockups: the kit's full files (with clear space and the draft label) plus -web crops whose viewBox is the drawing
  only (x 28.987, y 28.987, 657.415 x 56.818: the official BYU Marriott logo, the rule, AI FOUNDRY). The crop changes
  the viewBox only; the official logo inside is the school's file, unchanged. CSS adds the clear space back.
- public/icon.svg (the 32 px tile drawn on the pixel grid), public/favicon-32.png, src/app/favicon.ico (16 + 32),
  public/favicon-180.png and favicon-512.png (the app icon: flat Navy, the white symbol).
- public/og-image.png: the card keeps its layout, line, tagline and draft chip; the two places that carried the
  Runout identity are painted Navy and redrawn from the Facets vectors (the -web lockup 600 px wide, so the BYU
  Marriott logo is 274 px; the reversed symbol on the right).
Renders go through rsvg-convert.
"""
import io
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

R = Path(__file__).resolve().parent.parent
PUB = R / "public"
OUT = PUB / "brand" / "facets"
KIT = Path.home() / "clawd/projects/design-team/clients/ai-foundry/round17-2026-11-14-facets-L/kit"
NAVY = (0, 46, 93)
WEB_VB = "28.987 28.987 657.415 56.818"  # the drawing of lockup-wordmark-*.svg, clear space and label outside


def rsvg(svg_text, w, h):
    with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False) as f:
        f.write(svg_text)
    out = subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), f.name], capture_output=True, check=True)
    return Image.open(io.BytesIO(out.stdout)).convert("RGBA")


def inner(svg_text):
    return svg_text[svg_text.index(">", svg_text.index("<svg")) + 1:svg_text.rindex("</svg>")]


def web_crop(svg_text):
    w, h = WEB_VB.split()[2:]
    head_end = svg_text.index(">", svg_text.index("<svg")) + 1
    head = svg_text[:head_end]
    head = re.sub(r'viewBox="[^"]+"', f'viewBox="{WEB_VB}"', head, count=1)
    head = re.sub(r'width="[^"]+"', f'width="{w}"', head, count=1)
    head = re.sub(r'height="[^"]+"', f'height="{h}"', head, count=1)
    return head + svg_text[head_end:]


def main():
    (OUT / "cobrand").mkdir(parents=True, exist_ok=True)
    for n in ("mark", "mark-reversed", "mark-mono-black", "wordmark", "wordmark-white", "wordmark-black"):
        shutil.copyfile(KIT / f"{n}.svg", OUT / f"{n}.svg")
    for tone in ("white", "color", "navy", "black"):
        for kind in ("wordmark", "symbol-wordmark"):
            src = KIT / "lockups" / f"lockup-{kind}-{tone}.svg"
            shutil.copyfile(src, OUT / "cobrand" / src.name)
    for tone in ("white", "color"):  # the black file carries a placeholder, so it gets no web crop
        src = (KIT / "lockups" / f"lockup-wordmark-{tone}.svg").read_text()
        (OUT / "cobrand" / f"lockup-wordmark-{tone}-web.svg").write_text(web_crop(src))

    shutil.copyfile(KIT / "favicon-32.svg", PUB / "icon.svg")
    shutil.copyfile(KIT / "favicon-32.png", PUB / "favicon-32.png")
    shutil.copyfile(KIT / "favicon.ico", R / "src" / "app" / "favicon.ico")
    shutil.copyfile(KIT / "app-icon-180.png", PUB / "favicon-180.png")
    shutil.copyfile(KIT / "app-icon-512.png", PUB / "favicon-512.png")

    base = Image.open(PUB / "og-image.png").convert("RGBA")
    W, H = base.size
    card = base.copy()
    d = ImageDraw.Draw(card)
    d.rectangle((70, 140, 690, 232), fill=NAVY + (255,))   # the old lockup
    d.rectangle((730, 120, 1090, 510), fill=NAVY + (255,))  # the old mark
    lk = (OUT / "cobrand" / "lockup-wordmark-white-web.svg").read_text()
    mk = (OUT / "mark-reversed.svg").read_text()
    vx, vy, vw, vh = (float(v) for v in WEB_VB.split())
    lw = 600.0
    s = lw / vw
    ly = 185.0 - vh * s / 2  # centred where the old lockup sat
    size = 300.0             # the symbol's 512 grid, so the hexagon is 281 x 244 px
    mx, my = 905.0 - size / 2, 315.0 - size / 2
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
           f'<svg x="76" y="{ly}" width="{lw}" height="{vh * s}" viewBox="{WEB_VB}" overflow="hidden">{inner(lk)}</svg>'
           f'<g transform="translate({mx} {my}) scale({size / 512})">{inner(mk)}</g></svg>')
    card.alpha_composite(rsvg(svg, W, H))
    card.convert("RGB").save(PUB / "og-image.png", optimize=True)
    print("wrote public/brand/facets, icon.svg, favicons, og-image.png")


if __name__ == "__main__":
    main()
