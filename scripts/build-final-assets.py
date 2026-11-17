"""Seat the locked AI Foundry logo (Scott Murff, locked 2026-11-17, round 18 kit) in the site. Draft for BYU Marriott approval.

    ~/agent-system/.venv-design/bin/python scripts/build-final-assets.py

Source: the design team's round 18 kit (KIT below). Nothing here redraws the mark; every vector is the kit's file.
Writes:
- public/brand/ai-foundry/: mark, mark-reversed, mark-mono-black, wordmark, wordmark-white, wordmark-black, the
  avatars and app icon (kit files, unchanged), and the co-brand lockups: the kit's full files (with clear space and the
  draft label) plus -web crops whose viewBox is the drawing only (x 28.987, y 28.987, 583.624 x 56.818: the official
  BYU Marriott logo, the rule, AI FOUNDRY). The crop changes the viewBox only; the official logo inside is the school's
  file, unchanged. CSS adds the clear space back.
- public/icon.svg (the kit's 32 px favicon, drawn on the pixel grid), public/favicon-32.png, src/app/favicon.ico,
  public/favicon-180.png and favicon-512.png (the kit's app icon).
- public/og-image.png: the card keeps its layout, line, tagline and draft chip; the two places that carried the
  previous identity are painted Navy and redrawn from the round 18 vectors (the -web lockup 584 px wide, so the BYU
  Marriott logo is 300 px; the reversed symbol on the right).
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
OUT = PUB / "brand" / "ai-foundry"
KIT = Path.home() / "clawd/projects/design-team/clients/ai-foundry/round18-2026-11-17-scott-final/kit"
NAVY = (0, 46, 93)
WEB_VB = "28.987 28.987 583.624 56.818"  # the drawing of lockups/lockup-*.svg, clear space and label outside



def write_ico(pngs, dest):
    """The kit's 16/32/48 px favicon PNGs in one ICO, each re-encoded as RGBA PNG (same pixels). The kit's own .ico
    holds palette PNGs, which Next's image decoder rejects ("The PNG is not in RGBA format")."""
    import struct
    blobs = []
    for f in pngs:
        im = Image.open(f).convert("RGBA")
        buf = io.BytesIO()
        im.save(buf, "PNG", optimize=True)
        blobs.append((im.size, buf.getvalue()))
    head = struct.pack("<HHH", 0, 1, len(blobs))
    off = 6 + 16 * len(blobs)
    dirs, body = b"", b""
    for (w, h), b in blobs:
        dirs += struct.pack("<BBBBHHII", w % 256, h % 256, 0, 0, 1, 32, len(b), off + len(body))
        body += b
    Path(dest).write_bytes(head + dirs + body)

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
    for n in ("mark", "mark-reversed", "mark-mono-black", "wordmark", "wordmark-white", "wordmark-black",
              "app-icon", "avatar-circle", "avatar-square"):
        shutil.copyfile(KIT / f"{n}.svg", OUT / f"{n}.svg")
    for tone in ("white", "color", "navy", "black"):
        shutil.copyfile(KIT / "lockups" / f"lockup-{tone}.svg", OUT / "cobrand" / f"lockup-{tone}.svg")
    for tone in ("white", "color"):
        src = (KIT / "lockups" / f"lockup-{tone}.svg").read_text()
        (OUT / "cobrand" / f"lockup-{tone}-web.svg").write_text(web_crop(src))

    shutil.copyfile(KIT / "favicon-32.svg", PUB / "icon.svg")
    shutil.copyfile(KIT / "favicon-32.png", PUB / "favicon-32.png")
    write_ico([KIT / f"favicon-{n}.png" for n in (16, 32, 48)], R / "src" / "app" / "favicon.ico")
    shutil.copyfile(KIT / "app-icon-180.png", PUB / "favicon-180.png")
    shutil.copyfile(KIT / "app-icon-512.png", PUB / "favicon-512.png")

    base = Image.open(PUB / "og-image.png").convert("RGBA")
    W, H = base.size
    card = base.copy()
    d = ImageDraw.Draw(card)
    d.rectangle((66, 140, 700, 232), fill=NAVY + (255,))   # the previous lockup
    d.rectangle((730, 120, 1090, 510), fill=NAVY + (255,))  # the previous mark
    lk = (OUT / "cobrand" / "lockup-white-web.svg").read_text()
    mk = (OUT / "mark-reversed.svg").read_text()
    vx, vy, vw, vh = (float(v) for v in WEB_VB.split())
    lw = 584.0
    s = lw / vw
    ly = 185.0 - vh * s / 2
    size = 300.0
    mx, my = 905.0 - size / 2, 315.0 - size / 2
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
           f'<svg x="76" y="{ly}" width="{lw}" height="{vh * s}" viewBox="{WEB_VB}" overflow="hidden">{inner(lk)}</svg>'
           f'<g transform="translate({mx} {my}) scale({size / 512})">{inner(mk)}</g></svg>')
    card.alpha_composite(rsvg(svg, W, H))
    card.convert("RGB").save(PUB / "og-image.png", optimize=True)
    print("wrote public/brand/ai-foundry, icon.svg, favicons, og-image.png")


if __name__ == "__main__":
    main()
