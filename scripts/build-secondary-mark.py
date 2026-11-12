"""The header's secondary version (Runout mark + AI FOUNDRY, white on the navy bar) and the official BYU Marriott
file the phone footer places. Generated from the design team's system v3 (cobrand.py), so the mark and wordmark are
exactly our half of the draft co-brand lockup, nothing redrawn. Draft for BYU Marriott approval.

    ~/agent-system/.venv-design/bin/python scripts/build-secondary-mark.py

Writes public/brand/runout/cobrand/secondary-runout-white-web.svg (our half only, viewBox trimmed to the ink, the
page supplies the clear space) and copies the official msb_left_white.svg byte for byte to
public/brand/byu-marriott/ (never edited, recoloured or cropped; asserted).
"""
import re
import shutil
import sys
from pathlib import Path

R = Path(__file__).resolve().parent.parent
CLIENT = Path("/Users/davenportmini/clawd/projects/design-team/clients/ai-foundry")
sys.path.insert(0, str(CLIENT / "final-v3-2026-11-12" / "system" / "_build"))
import cobrand as CB  # noqa: E402

svg, info = CB.lockup_svg("runout", "white", part="right")
L = CB.layout("runout")
body = svg[svg.index("</title>") + len("</title>"):svg.rindex("</svg>")]
_, _, wb = CB.shape(CB.WORDMARK, CB.WORD_FONT, L["word_size"], L["word_x"], L["word_base"], CB.TRACK)
x0 = L["x_mark"]
x1 = max(wb[2], L["x_mark"] + L["mark_w"])
y0 = min(L["y_mark"], wb[1])
y1 = max(L["y_mark"] + L["mark_h"], wb[3])
pad = 0.5
vb = f"{x0 - pad:.2f} {y0 - pad:.2f} {x1 - x0 + 2 * pad:.2f} {y1 - y0 + 2 * pad:.2f}"
title = ("AI Foundry, Runout: secondary version, the mark and AI FOUNDRY, white (Draft for BYU Marriott approval). "
         "Used where the BYU Marriott logo is clearly visible elsewhere on the page")
out = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{x1 - x0 + 2 * pad:.2f}" '
       f'height="{y1 - y0 + 2 * pad:.2f}"><title>{title}</title>{body}</svg>\n')
assert "BYU MARRIOTT" not in body and "<svg x=" not in body          # our half only, no Marriott file
dst = R / "public" / "brand" / "runout" / "cobrand" / "secondary-runout-white-web.svg"
dst.write_text(out)
print(dst, "viewBox", vb, "mark ink height", f"{L['mark_h']:.2f}", "of", f"{y1 - y0 + 2 * pad:.2f}")

off_src = CLIENT / "context" / "byu-marriott-official" / "msb_left_white.svg"
off_dst = R / "public" / "brand" / "byu-marriott" / "msb_left_white.svg"
off_dst.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(off_src, off_dst)
assert off_dst.read_bytes() == off_src.read_bytes()
assert re.search(r'viewBox="0 0 396 75"', off_dst.read_text())
print(off_dst, "byte for byte")
