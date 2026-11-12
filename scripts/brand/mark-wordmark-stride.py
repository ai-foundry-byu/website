"""Build public/brand/stride/mark-wordmark-stride-white.svg: the AF Stride mark and the AI FOUNDRY wordmark, all
White, exactly as they sit in the right half of the draft co-brand lockup (no Marriott logo, no rule). Used in the
site header below 768 px, where the full lockup cannot hold its 250 px Marriott logo plus clear space; the brief allows
this secondary version where the BYU Marriott logo is clearly visible elsewhere on the page (the footer).
Draft for BYU Marriott approval.

Runs on the Mac mini only (it imports the design team's system v3 builder):
    ~/agent-system/.venv-design/bin/python scripts/brand/mark-wordmark-stride.py
"""
import io
import re
import sys
from pathlib import Path

SYS = Path("/Users/davenportmini/clawd/projects/design-team/clients/ai-foundry/final-v3-2026-11-12/system/_build")
sys.path.insert(0, str(SYS))
import cobrand as CB  # noqa: E402
from svgelements import SVG  # noqa: E402

OUT = Path(__file__).resolve().parents[2] / "public" / "brand" / "stride" / "mark-wordmark-stride-white.svg"

right, _ = CB.lockup_svg("stride", "white", "right")
inner = re.search(r"</title>(.*)</svg>", right, re.S).group(1)
x0, y0, x1, y1 = SVG.parse(io.StringIO(right)).bbox()      # ink bounds, transforms applied
w, h = x1 - x0, y1 - y0
OUT.write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.2f} {y0:.2f} {w:.2f} {h:.2f}" width="{w:.2f}" '
    f'height="{h:.2f}"><title>AI Foundry, AF Stride: the mark and AI FOUNDRY, all White (the secondary version, the '
    f'right half of the draft co-brand lockup). {CB.LABEL}</title>{inner}</svg>\n')
print(OUT, f"{w:.2f} x {h:.2f}")
