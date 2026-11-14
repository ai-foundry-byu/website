#!/usr/bin/env python3
"""
Builds the AI FOUNDRY hexagon-and-diamond logo from the brand typeface.

    python3 scripts/build-logo.py --font <Archivo[wdth,wght].ttf> [--variant b] [--out _brand-src/hex-diamond]

The wordmark is the brand's stamped nameplate (Archivo 700, width 125, all caps; see
design_handoff_ai_foundry_website/DESIGN_SYSTEM.md) with the O replaced by the Foundry symbol:

  - an outer regular hexagon, flat top and bottom, points left and right: the Builder Hexagon,
    drawn the way the Strategy app draws it (axes at 1, 3, 5, 7, 9 and 11 o'clock);
  - an inner diamond, a square turned 45 degrees with vertices at top, right, bottom and left:
    the Consultant Diamond, as the app draws it.

Both are outlines. Every shape is built as filled geometry (outer contour minus inner contour), never
as an SVG stroke, so the files render identically everywhere and scale without stroke surprises.
Letters are converted to outlines from the font, so no font is needed to display the files.

Optics, all measured from the font at build time:
  - the hexagon's flat edges sit exactly on the baseline and cap height (flats need no overshoot);
  - its slanted edges carry the stem weight, its flat edges the thinner weight of the O's top and
    bottom, as an O in this face does;
  - its side bearings are smaller than the O's, because a pointed side reads farther away than a round one.

Colors are the official BYU palette from the design tokens and nothing else: navy #002E5D, royal #003DA5,
white. Royal never sits on navy, so the reversed version is all white.

The font is not stored in the repository. It is OFL (Google Fonts, github.com/google/fonts, ofl/archivo).
"""
import argparse
import json
import math
import subprocess
import tempfile
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

NAVY, ROYAL, WHITE, BLACK = "#002E5D", "#003DA5", "#FFFFFF", "#000000"

# The three directions on the comparison sheet. Values are fractions of the font's own measurements:
# hex_side = slanted-edge weight / stem, hex_flat = flat-edge weight / the O's top thickness,
# dia = diamond weight / stem, gap = clear space between diamond and hexagon / diamond weight.
VARIANTS = {
    "a": {"name": "Balanced", "hex_side": 0.80, "hex_flat": 0.86, "dia": 0.32, "gap": 0.95},
    "b": {"name": "Strong core", "hex_side": 0.86, "hex_flat": 0.92, "dia": 0.40, "gap": 0.70},
    "c": {"name": "Open", "hex_side": 0.76, "hex_flat": 0.82, "dia": 0.26, "gap": 1.50},
    # Scott, 2026-11-14: the inner shape follows the hexagon's angled lines. A rhombus whose sides run
    # parallel to the hexagon's slanted sides (60 degrees at top and bottom, 120 at left and right).
    "e": {"name": "Cut", "cut": True, "hex_flat": 0.72, "wall": 0.80},
    # Scott, 2026-11-14: the diamond's points run to the hexagon's edges (top and bottom flats, left and right points).
    "f": {"name": "Facets", "facets": True, "square": True, "flat": 0.50},
    "g": {"name": "Facets, stretched", "facets": True},
    "d": {"name": "Parallel", "hex_side": 0.80, "hex_flat": 0.86, "dia": 0.26, "gap": 0.62, "rhombus": True},
}
# The compact mark (favicon, avatar) is drawn for 16 to 48 px: a lighter hexagon to open the interior,
# a heavier diamond so its outline survives, a tighter gap.
COMPACT = {"name": "Compact", "hex_side": 0.80, "hex_flat": 0.80, "dia": 0.40, "gap": 0.60}
# At 16 px no outline survives inside the hexagon, so the smallest favicon fills the diamond.
COMPACT_16 = dict(COMPACT, hex_side=0.92, hex_flat=0.92, dia=0.40, gap=0.85, solid=True)
TRACKING = -0.015  # em, the nameplate's letter-spacing
WORD_SPACE = 0.80  # fraction of the font's space between AI and FOUNDRY
SIDE_BEARING = (0.40, 0.62)  # symbol left and right bearings as fractions of the O's: pointed sides need
# less, and the left less again because F's open right side already leaves white (fonts kern F-O tight)


def poly(points):
    return "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in points) + " Z"


def inset(points, thickness):
    """Offsets each edge of a convex polygon (clockwise in SVG space) inward by its own thickness."""
    n = len(points)
    lines = []
    for i in range(n):
        (x1, y1), (x2, y2) = points[i], points[(i + 1) % n]
        dx, dy = x2 - x1, y2 - y1
        length = math.hypot(dx, dy)
        nx, ny = -dy / length, dx / length  # inward normal for a clockwise polygon in y-down space
        t = thickness[i]
        lines.append(((x1 + nx * t, y1 + ny * t), (dx, dy)))
    out = []
    for i in range(n):
        (p1, d1), (p2, d2) = lines[i - 1], lines[i]
        den = d1[0] * d2[1] - d1[1] * d2[0]
        s = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den
        out.append((p1[0] + d1[0] * s, p1[1] + d1[1] * s))
    return out


def seg_dist(p, a, b):
    ax, ay = a
    bx, by = b
    px, py = p
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)


def inside(p, poly_):
    """True if point p is inside the convex polygon (either winding)."""
    signs = []
    for i in range(len(poly_)):
        (ax, ay), (bx, by) = poly_[i], poly_[(i + 1) % len(poly_)]
        signs.append((bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax) > 0)
    return all(signs) or not any(signs)



def poly_gap(inner_poly, outer_poly):
    """Smallest distance between two nested convex polygons; 0 if the inner one is not inside the outer."""
    if not all(inside(p, outer_poly) for p in inner_poly):
        return 0.0
    best = float("inf")
    for P, Q in ((inner_poly, outer_poly), (outer_poly, inner_poly)):
        for p in P:
            for i in range(len(Q)):
                best = min(best, seg_dist(p, Q[i], Q[(i + 1) % len(Q)]))
    return best


def symbol(cx, cy, H, m, v):
    """Hexagon and diamond centered at (cx, cy), flat-to-flat height H. Returns (hexagon path, diamond path)."""
    R, h = H / math.sqrt(3), H / 2
    outer = [(cx + R, cy), (cx + R / 2, cy + h), (cx - R / 2, cy + h), (cx - R, cy), (cx - R / 2, cy - h), (cx + R / 2, cy - h)]
    # Scott, 2026-11-14: the diamond's four corners must reach the hexagon together when scaled up from the
    # center: top and bottom to the flats' midpoints, left and right to the points. Only the rhombus joining
    # those four points does that, so every diamond is a scaled copy of it: half-width / half-height = R / h
    # = 2 / sqrt(3). D keeps its own rule (sides parallel to the slants), which cannot also meet this one.
    ka = R / h
    full = [(cx, cy - h), (cx + R, cy), (cx, cy + h), (cx - R, cy)]  # the diamond at full size, corners on the hexagon
    if v.get("facets") and v.get("square") and v.get("flat"):
        # Scott, 2026-11-14: a little width on the top and bottom lines so the hexagon reads whole: the square
        # diamond stops `flat` x the O's top weight short of each flat, and is cut out of the solid hexagon.
        s = h - m["o_top"] * v["flat"]
        hole = [(cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)]
        return poly(outer) + " " + poly(hole[::-1]), ""
    if v.get("facets") and v.get("square"):
        # Scott, 2026-11-14: keep the diamond a true square (90-degree corners). The largest square that fits
        # has its top and bottom points on the flats; its side corners then fall short of the hexagon's points
        # by R - h (about 13% of the half-width). What is left is two arrowhead pieces, left and right.
        right = [full[0], outer[5], outer[0], outer[1], (cx, cy + h), (cx + h, cy)]
        left = [(cx, cy + h), outer[2], outer[3], outer[4], full[0], (cx - h, cy)]
        return poly(right) + " " + poly(left), ""
    if v.get("facets"):
        # Scott, 2026-11-14: the diamond runs to the edges: top and bottom points on the flats, left and right
        # corners on the hexagon's points. Cut from a solid hexagon, it leaves four triangles in the corners.
        tris = [[full[0], outer[5], outer[0]], [outer[0], outer[1], full[2]], [full[2], outer[2], outer[3]],
                [outer[3], outer[4], full[0]]]
        return " ".join(poly(tr) for tr in tris), ""
    if v.get("cut"):
        # Scott, 2026-11-14: the diamond IS the O's counter. A solid hexagon with a square diamond cut out of
        # its center. The hole is as large as the two weights allow: the flats keep the O's top thickness,
        # and the narrowest wall to a slanted side keeps `wall` x stem.
        flat, wall = m["o_top"] * v["hex_flat"], m["stem"] * v["wall"]
        slants = [(outer[i], outer[(i + 1) % 6]) for i in (0, 2, 3, 5)]

        def wall_at(d):
            dia = [(cx, cy - d), (cx + d * ka, cy), (cx, cy + d), (cx - d * ka, cy)]
            best = min(seg_dist(p, a, b) for p in dia for a, b in slants)
            for q in outer:
                best = min(best, min(seg_dist(q, dia[i], dia[(i + 1) % 4]) for i in range(4)))
            return best

        lo, hi = 0.0, h - flat
        for _ in range(60):
            d = (lo + hi) / 2
            lo, hi = (d, hi) if wall_at(d) >= wall else (lo, d)
        d = lo
        hole = [(cx, cy - d), (cx + d * ka, cy), (cx, cy + d), (cx - d * ka, cy)]
        return poly(outer) + " " + poly(hole[::-1]), ""
    side, flat = m["stem"] * v["hex_side"], m["o_top"] * v["hex_flat"]
    inner = inset(outer, [side, flat, side, side, flat, side])
    td = m["stem"] * v["dia"]
    gap = td * v["gap"]
    k = 1 / math.sqrt(3) if v.get("rhombus") else ka  # half-width / half-height of the inner shape
    lo, hi = 0.0, h
    for _ in range(60):  # the largest diamond that keeps `gap` clear of the hexagon all round
        d = (lo + hi) / 2
        dia = [(cx, cy - d), (cx + d * k, cy), (cx, cy + d), (cx - d * k, cy)]
        if poly_gap(dia, inner) >= gap:
            lo = d
        else:
            hi = d
    d = lo
    dia_out = [(cx, cy - d), (cx + d * k, cy), (cx, cy + d), (cx - d * k, cy)]
    if not v.get("solid") and inset(dia_out, [td] * 4)[0][1] >= cy - td * 0.5:
        raise SystemExit(f"no room for an outlined diamond (half-height {d:.0f}, weight {td:.0f}); lighten the strokes or the gap")
    if v.get("solid"):
        return poly(outer) + " " + poly(inner[::-1]), poly(dia_out)
    dia_in = inset(dia_out, [td] * 4)
    return poly(outer) + " " + poly(inner[::-1]), poly(dia_out) + " " + poly(dia_in[::-1])


def load(font_path):
    tmp = Path(tempfile.mkdtemp()) / "Archivo-700-125.ttf"
    instancer.instantiateVariableFont(TTFont(font_path), {"wght": 700, "wdth": 125}).save(tmp)
    font = TTFont(tmp)
    gs, cmap = font.getGlyphSet(), font.getBestCmap()

    def bounds(ch):
        from fontTools.pens.boundsPen import BoundsPen
        bp = BoundsPen(gs)
        gs[cmap[ord(ch)]].draw(bp)
        return bp.bounds

    o = bounds("O")
    m = {
        "upm": font["head"].unitsPerEm,
        "cap": bounds("H")[3],
        "stem": bounds("I")[2] - bounds("I")[0],
        "o_lsb": o[0],
        "o_rsb": gs[cmap[ord("O")]].width - o[2],
    }
    from fontTools.pens.recordingPen import RecordingPen
    rp = RecordingPen()
    gs[cmap[ord("O")]].draw(rp)
    ys, contours = [], []
    for op, args in rp.value:
        ys += [p[1] for p in args]
        if op in ("closePath", "endPath"):
            contours.append(max(ys))
            ys = []
    m["o_top"] = max(contours) - min(contours)  # outer top minus counter top
    return tmp, font, gs, cmap, m


def shape(font_file, text):
    out = subprocess.run(["hb-shape", str(font_file), text, "--output-format=json"], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def wordmark(tmp, font, gs, m, v, letters, hexc, diac):
    """Returns (svg body, width, height) in font units, baseline at y = cap height (y down)."""
    upm, cap = m["upm"], m["cap"]
    track = TRACKING * upm
    parts, x = [], 0.0

    def run(text):
        nonlocal x
        for g in shape(tmp, text):
            name = font.getGlyphOrder()[g["g"]] if isinstance(g["g"], int) else g["g"]
            pen = SVGPathPen(gs)
            gs[name].draw(TransformPen(pen, (1, 0, 0, -1, x + g.get("dx", 0), cap - g.get("dy", 0))))
            parts.append(pen.getCommands())
            x += g["ax"] + track

    run("AI")
    x += gs["space"].width * WORD_SPACE - track
    run("F")
    H = cap
    W = 2 * H / math.sqrt(3)
    x += m["o_lsb"] * SIDE_BEARING[0]
    hexp, diap = symbol(x + W / 2, cap / 2, H, m, v)
    x += W + m["o_rsb"] * SIDE_BEARING[1] + track
    run("UNDRY")
    width = x - track - (gs["Y"].width - 866)  # trim Y's right bearing so the artwork ends at the letter
    body = (f'<path fill="{letters}" d="{" ".join(parts)}"/>'
            f'<path fill="{hexc}" fill-rule="evenodd" d="{hexp}"/>'
            f'<path fill="{diac}" fill-rule="evenodd" d="{diap}"/>')
    return body, width, cap


def svg(body, x0, y0, w, h, title, bg=None):
    import re
    body = re.sub(r'<path [^>]*d=""/>', "", body)  # a cut symbol has no separate diamond
    rect = f'<rect x="{x0:.1f}" y="{y0:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {w:.1f} {h:.1f}" role="img" '
            f'aria-label="{title}"><title>{title}</title>{rect}{body}</svg>\n')


def build(font_path, key, out):
    tmp, font, gs, cmap, m = load(font_path)
    v = VARIANTS[key]
    out.mkdir(parents=True, exist_ok=True)
    pad = m["cap"] * 0.12  # a small margin; the clear-space rule is in the README, not baked into files
    files = {}
    for name, (letters, hexc, diac, bg) in {
        "wordmark": (NAVY, NAVY, ROYAL, None),            # primary: navy, diamond in royal
        "wordmark-navy": (NAVY, NAVY, NAVY, None),        # single colour
        "wordmark-black": (BLACK, BLACK, BLACK, None),    # single colour, print
        "wordmark-white": (WHITE, WHITE, WHITE, None),    # reversed, for navy grounds
    }.items():
        body, w, h = wordmark(tmp, font, gs, m, v, letters, hexc, diac)
        files[name] = svg(body, -pad, -pad, w + 2 * pad, h + 2 * pad, "AI Foundry", bg)
    H = m["cap"]
    W = 2 * H / math.sqrt(3)
    for name, (hexc, diac) in {"glyph": (NAVY, ROYAL), "glyph-navy": (NAVY, NAVY), "glyph-black": (BLACK, BLACK),
                               "glyph-white": (WHITE, WHITE)}.items():
        hexp, diap = symbol(0, 0, H, m, v)
        side = W * 1.16
        body = f'<path fill="{hexc}" fill-rule="evenodd" d="{hexp}"/><path fill="{diac}" fill-rule="evenodd" d="{diap}"/>'
        files[name] = svg(body, -side / 2, -side / 2, side, side, "AI Foundry symbol")
    # Compact mark for favicons and avatars: a navy tile, the symbol in white, weights raised so the
    # diamond and the gap survive at 16 px. Rounded at the brand box radius (5 of 32).
    if v.get("cut"):
        compact = dict(v, hex_flat=v["hex_flat"] * 1.2, wall=v["wall"] * 1.1)
        compact16 = dict(v, hex_flat=v["hex_flat"] * 1.35, wall=v["wall"] * 1.2)
    elif v.get("facets"):
        compact = compact16 = v
    else:
        compact, compact16 = COMPACT, COMPACT_16
    hexp, diap = symbol(0, 0, H, m, compact)
    t = W * 1.42
    tile = f'<rect x="{-t/2:.1f}" y="{-t/2:.1f}" width="{t:.1f}" height="{t:.1f}" rx="{t*5/32:.1f}" fill="{NAVY}"/>'
    files["favicon"] = svg(tile + f'<path fill="{WHITE}" fill-rule="evenodd" d="{hexp}"/><path fill="{WHITE}" fill-rule="evenodd" d="{diap}"/>',
                           -t / 2, -t / 2, t, t, "AI Foundry")
    a = W * 1.9  # avatar: square navy ground, symbol inside the circle a platform crops to
    files["avatar"] = svg(f'<rect x="{-a/2:.1f}" y="{-a/2:.1f}" width="{a:.1f}" height="{a:.1f}" fill="{NAVY}"/>'
                          f'<path fill="{WHITE}" fill-rule="evenodd" d="{hexp}"/><path fill="{WHITE}" fill-rule="evenodd" d="{diap}"/>',
                          -a / 2, -a / 2, a, a, "AI Foundry")
    hexp16, diap16 = symbol(0, 0, H, m, compact16)
    files["favicon-16"] = svg(tile + f'<path fill="{WHITE}" fill-rule="evenodd" d="{hexp16}"/><path fill="{WHITE}" d="{diap16}"/>',
                              -t / 2, -t / 2, t, t, "AI Foundry")
    for name, text in files.items():
        (out / f"{name}.svg").write_text(text)
    return m


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True)
    ap.add_argument("--variant", default="b", choices=sorted(VARIANTS))
    ap.add_argument("--out", default="_brand-src/hex-diamond")
    a = ap.parse_args()
    m = build(a.font, a.variant, Path(a.out))
    print(f"variant {a.variant} ({VARIANTS[a.variant]['name']}) -> {a.out}  measurements {m}")
