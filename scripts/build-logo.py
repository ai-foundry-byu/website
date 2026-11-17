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
    "f": {"name": "Facets", "facets": True, "square": True, "flat": 0.125},
    # Scott, 2026-11-14: "try smaller so the weight of the O is consistent with other letters." F's O has an ink
    # density of 0.36 against the font's own O at 0.53 and U, N, D, R at 0.59; a band of 0.75 brings it to 0.54.
    # Scott, 2026-11-14: H with the O weighted like the letters: the hexagon at 0.75 of the touching size (chosen by
    # eye from 1.00, 0.85, 0.75 and 0.65 in the lockup; average stroke went from 44 to near the letters').
    "m": {"name": "Inverted, balanced", "inverted": True, "overshoot": 0.03, "wall": 0, "hex_scale": 0.75},
    # Scott, 2026-11-14: L is F with the O weighted like the letters ("a little less weight on the blue... almost like a
    # special letter of the font"). 0.75 matched the font's O on box fill and average stroke but read heavy: the
    # hexagon's corners put solid shoulders where a round O is thinnest. Chosen by eye from 0.75, 0.60, 0.50, 0.40: 0.50.
    "l": {"name": "Facets, balanced", "facets": True, "square": True, "flat": 0.50},
    # Scott, 2026-11-14: L with the hexagon turned point up (Agentic Workflow at the peak; Discovery and Design down the
    # right, Application Architecture and AI Systems down the left; Launch and Learn at the bottom). Its vertical
    # sides keep `band` x stem beside the square diamond; its points overshoot like an O.
    "n": {"name": "Facets, point up", "facets": True, "square": True, "pointy": True, "band": 0.50, "overshoot": 0.03},
    # Scott, 2026-11-14, dialed in on the tuner: a square diamond at 65% of the largest that fits, cut out of a
    # flat-topped hexagon, its right half shaded (navy at 14% over the ground) for a hint of depth, lit from the left.
    # Single-colour files drop the shading.
    "o": {"name": "Cut, shaded", "cut_size": 0.65, "shade": 0.14},
    # Scott, 2026-11-14: O with the hexagon point up ("it actually looks really good with the vertical"); less like a
    # hex nut. Points overshoot 6% as on the tuner; its vertical sides take the O's own side spacing.
    # Scott, 2026-11-14, from the tuner: O with the diamond at 90.5%, so the hexagon is a thin frame (thinnest wall
    # 0.19 stem) and the diamond carries the letter. Favicons use a smaller diamond so the frame survives.
    "q": {"name": "Cut, shaded, large diamond", "cut_size": 0.905, "shade": 0.14},
    # Scott, 2026-11-14, from the tuner: between O and Q. Diamond at 80% (thinnest wall 0.40 stem), shading 16%.
    "r": {"name": "Cut, shaded, balanced", "cut_size": 0.80, "shade": 0.16},
    # Scott, 2026-11-14: R in two colours only. The shaded half takes the grey of SCHOOL OF BUSINESS in the official
    # lockup (sampled from public/brand: #7C878E at 51% on white shows as #BCC1C5; white at 67% on navy as #AAB9C9).
    # On navy the light half is the grey, so the lit half moves to the left to keep the light coming from the left.
    "s": {"name": "Cut, two colour", "cut_size": 0.80, "shade": 1, "shade_on_white": "#BCC1C5", "shade_on_navy": "#AAB9C9"},
    "p": {"name": "Cut, shaded, point up", "cut_size": 0.65, "shade": 0.14, "pointy": True, "overshoot": 0.06, "sb": (0.80, 1.00)},
    "g": {"name": "Facets, stretched", "facets": True},
    # Scott, 2026-11-14: inverted. The diamond is the O; the hexagon is cut out of it as the counter.
    "h": {"name": "Inverted", "inverted": True, "overshoot": 0.03, "wall": 0},
    # Scott, 2026-11-14: H with the fills reversed: a solid hexagon inside a diamond outline (royal in the primary).
    "i": {"name": "Inverted, solid hexagon", "inverted": True, "solid_hex": True, "overshoot": 0.03, "outline": 0.40},
    # Scott, 2026-11-14: I with a white border around the hexagon that notches the diamond's outline where they meet.
    # Scott, 2026-11-14: a solid white diamond with a hairline navy border (about 1.5 pt at a 100 pt wordmark), and
    # a solid navy hexagon inscribed in it, its four upper and lower corners on the diamond's sides. Only the
    # diamond's four corners show around the hexagon. On navy, the diamond is solid white and needs no border.
    "k": {"name": "Inscribed", "inverted": True, "solid_hex": True, "white_diamond": True, "overshoot": 0.03, "outline": 0.09},
    "j": {"name": "Inverted, keyline", "inverted": True, "solid_hex": True, "keyline": 0.20, "overshoot": 0.03, "outline": 0.40},
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


def geom_path(g):
    """SVG path for a shapely (Multi)Polygon; holes as subpaths, for fill-rule evenodd."""
    parts = []
    for pg in getattr(g, "geoms", [g]):
        for ring in [pg.exterior, *pg.interiors]:
            parts.append(poly(list(ring.coords)[:-1]))
    return " ".join(parts)


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


def mix(fg, bg, a):
    """fg laid over bg at opacity a, as one solid colour (files stay flat: no transparency)."""
    f, b = (tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)) for c in (fg, bg))
    return "#" + "".join(f"{round(b[i] + (f[i] - b[i]) * a):02X}" for i in range(3))


def sym_width(H, v):
    """Width of the symbol for a cap height H."""
    if v.get("inverted"):
        return H * (1 + 2 * v["overshoot"])  # a square diamond: as wide as it is tall
    if v.get("pointy"):
        return H * (1 + 2 * v["overshoot"]) * math.sqrt(3) / 2  # point to point is the height
    return 2 * H / math.sqrt(3)


def symbol(cx, cy, H, m, v):
    """Hexagon and diamond centered at (cx, cy), flat-to-flat height H. Returns (hexagon path, diamond path)."""
    if v.get("inverted"):
        # Scott, 2026-11-14: the roles swapped. The diamond is the letter: a square turned 45 degrees whose
        # points overshoot the baseline and cap height a little (a point reads small next to flat letters).
        # The hexagon, flat top and bottom, is cut out of it as the counter, as large as a wall of
        # `wall` x stem to the diamond's sides allows.
        a = H / 2 * (1 + 2 * v["overshoot"])
        dia = [(cx, cy - a), (cx + a, cy), (cx, cy + a), (cx - a, cy)]
        if v.get("solid_hex"):
            # Scott, 2026-11-14: the hexagon solid, the diamond an outline with white inside. The diamond's stroke
            # is `outline` x stem; the largest flat-topped hexagon touches its inner edge at four corners.
            tw = m["stem"] * v["outline"]
            dia_in = inset(dia, [tw] * 4)
            a_in = a - tw * math.sqrt(2)
            # With a keyline, the hexagon's white border is the space between it and the outline: the hexagon
            # plus its border touches the outline, so its four nearest corners stop `keyline` x stem away.
            kw = m["stem"] * v.get("keyline", 0)
            r = 2 * (a_in - kw * math.sqrt(2)) / (1 + math.sqrt(3))
            s3 = r * math.sqrt(3) / 2
            hexa = [(cx + r, cy), (cx + r / 2, cy + s3), (cx - r / 2, cy + s3), (cx - r, cy), (cx - r / 2, cy - s3), (cx + r / 2, cy - s3)]
            if v.get("solid_dia"):
                return poly(hexa), poly(dia)  # reversed: a solid white diamond under the navy hexagon
            return poly(hexa), poly(dia) + " " + poly(dia_in[::-1])
        wall = m["stem"] * v["wall"]
        lo, hi = 0.0, a
        for _ in range(60):
            r = (lo + hi) / 2  # the hole's point radius; its flat half-height is r * sqrt(3) / 2
            hx = [(cx + r, cy), (cx + r / 2, cy + r * math.sqrt(3) / 2), (cx - r / 2, cy + r * math.sqrt(3) / 2),
                  (cx - r, cy), (cx - r / 2, cy - r * math.sqrt(3) / 2), (cx + r / 2, cy - r * math.sqrt(3) / 2)]
            lo, hi = (r, hi) if poly_gap(hx, dia) >= wall else (lo, r)
        r = lo
        if v.get("hex_scale"):
            # Scott, 2026-11-14: a smaller hexagon so the O weighs what the letters do: a fraction of the largest
            # hexagon that fits (the touching one).
            r = 2 * a / (1 + math.sqrt(3)) * v["hex_scale"]
        if v["wall"] == 0 and not v.get("hex_scale"):
            # Scott, 2026-11-14: literally touching. The largest flat-topped hexagon in the square diamond has its
            # four upper and lower corners exactly on the diamond's sides: r/2 + r*sqrt(3)/2 = a.
            r = 2 * a / (1 + math.sqrt(3))
        hole = [(cx + r, cy), (cx + r / 2, cy + r * math.sqrt(3) / 2), (cx - r / 2, cy + r * math.sqrt(3) / 2),
                (cx - r, cy), (cx - r / 2, cy - r * math.sqrt(3) / 2), (cx + r / 2, cy - r * math.sqrt(3) / 2)]
        return poly(dia) + " " + poly(hole[::-1]), ""
    if v.get("cut_size"):
        if v.get("pointy"):
            Rp = H / 2 * (1 + 2 * v["overshoot"])
            w = Rp * math.sqrt(3) / 2
            outer = [(cx, cy - Rp), (cx + w, cy - Rp / 2), (cx + w, cy + Rp / 2), (cx, cy + Rp), (cx - w, cy + Rp / 2), (cx - w, cy - Rp / 2)]
            s = w * v["cut_size"]  # point up, the largest square diamond touches the vertical sides: half-width w
        else:
            R, h = H / math.sqrt(3), H / 2
            outer = [(cx + R, cy), (cx + R / 2, cy + h), (cx - R / 2, cy + h), (cx - R, cy), (cx - R / 2, cy - h), (cx + R / 2, cy - h)]
            s = h * v["cut_size"]  # the largest square diamond in a flat-topped hexagon touches the flats: half-height h
        T, Rt, B, L = (cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)
        half = [B, L, T] if v.get("shade_side") == "left" else [T, Rt, B]
        shade = poly(half) if v.get("shade") else ""  # one half, under the cut-out
        return poly(outer) + " " + poly([T, Rt, B, L][::-1]), shade
    if v.get("pointy"):
        Rp = H / 2 * (1 + 2 * v["overshoot"])  # points at top and bottom, overshooting the cap height and baseline
        wp = Rp * math.sqrt(3) / 2
        outer = [(cx, cy - Rp), (cx + wp, cy - Rp / 2), (cx + wp, cy + Rp / 2), (cx, cy + Rp), (cx - wp, cy + Rp / 2), (cx - wp, cy - Rp / 2)]
        s = wp - m["stem"] * v["band"]
        hole = [(cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)]
        return poly(outer) + " " + poly(hole[::-1]), ""
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
    W = sym_width(H, v)
    x += m["o_lsb"] * v.get("sb", SIDE_BEARING)[0]
    hexp, diap = symbol(x + W / 2, cap / 2, H, m, v)
    x += W + m["o_rsb"] * v.get("sb", SIDE_BEARING)[1] + track
    run("UNDRY")
    width = x - track - (gs["Y"].width - 866)  # trim Y's right bearing so the artwork ends at the letter
    body = (f'<path fill="{letters}" d="{" ".join(parts)}"/>'
            f'<path fill="{diac}" fill-rule="evenodd" d="{diap}"/>'
            f'<path fill="{hexc}" fill-rule="evenodd" d="{hexp}"/>')  # diamond first: in K the hexagon sits on it
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
    wd = v.get("white_diamond")
    vr = dict(v, solid_dia=True) if wd else v  # the version drawn on navy
    flat1 = dict(v, shade=0) if v.get("shade") else v  # single-colour files: no shading
    if v.get("shade"):
        on_white = v.get("shade_on_white") or mix(NAVY, WHITE, v["shade"])
        on_navy = v.get("shade_on_navy") or mix(WHITE, NAVY, v["shade"])
        if v.get("shade_on_navy"):  # a light grey on navy is the lit half: put it on the left
            vr = dict(v, shade_side="left")
    for name, (letters, hexc, diac, bg) in {
        "wordmark": (NAVY, NAVY, on_white if v.get("shade") else NAVY if wd else ROYAL, None),  # primary: navy, diamond in royal (K: all navy)
        "wordmark-navy": (NAVY, NAVY, NAVY, None),        # single colour
        "wordmark-black": (BLACK, BLACK, BLACK, None),    # single colour, print
        "wordmark-white": (WHITE, NAVY if wd else WHITE, on_navy if v.get("shade") else WHITE, None),  # reversed, for navy grounds
        "wordmark-white-flat": (WHITE, WHITE, WHITE, None),  # single colour, white: swag, embroidery, etching
    }.items():
        if name == "wordmark-white-flat" and not v.get("shade"):
            continue  # unshaded directions: wordmark-white is already flat
        body, w, h = wordmark(tmp, font, gs, m, vr if name == "wordmark-white" else flat1 if name in ("wordmark-navy", "wordmark-black", "wordmark-white-flat") else v, letters, hexc, diac)
        files[name] = svg(body, -pad, -pad, w + 2 * pad, h + 2 * pad, "AI Foundry", bg)
    H = m["cap"]
    W = sym_width(H, v)
    for name, (hexc, diac) in {"glyph": (NAVY, on_white if v.get("shade") else NAVY if wd else ROYAL), "glyph-navy": (NAVY, NAVY), "glyph-black": (BLACK, BLACK),
                               "glyph-white": (NAVY if wd else WHITE, on_navy if v.get("shade") else WHITE), "glyph-white-flat": (WHITE, WHITE)}.items():
        if name == "glyph-white-flat" and not v.get("shade"):
            continue
        hexp, diap = symbol(0, 0, H, m, vr if name == "glyph-white" else flat1 if name in ("glyph-navy", "glyph-black", "glyph-white-flat") else v)
        side = W * 1.16
        body = f'<path fill="{diac}" fill-rule="evenodd" d="{diap}"/><path fill="{hexc}" fill-rule="evenodd" d="{hexp}"/>'
        files[name] = svg(body, -side / 2, -side / 2, side, side, "AI Foundry symbol")
    # Compact mark for favicons and avatars: a navy tile, the symbol in white, weights raised so the
    # diamond and the gap survive at 16 px. Rounded at the brand box radius (5 of 32).
    if v.get("cut_size"):
        # favicons cap the diamond so the hexagon's frame stays visible in a browser tab; 16 px also drops the shading
        compact = dict(vr, cut_size=min(v["cut_size"], 0.80))  # drawn white on the navy tile
        compact16 = dict(flat1, cut_size=min(v["cut_size"], 0.70))
    elif v.get("cut"):
        compact = dict(v, hex_flat=v["hex_flat"] * 1.2, wall=v["wall"] * 1.1)
        compact16 = dict(v, hex_flat=v["hex_flat"] * 1.35, wall=v["wall"] * 1.2)
    elif v.get("inverted"):
        # favicons keep a visible wall so the diamond stays one shape in a browser tab
        if wd:
            compact = compact16 = vr  # on the navy tile: a solid white diamond, the navy hexagon on it
        elif v.get("solid_hex"):
            compact, compact16 = dict(v, outline=0.55), dict(v, outline=0.70)
            if v.get("keyline"):
                compact, compact16 = dict(compact, keyline=0.26), dict(compact16, keyline=0.32)
        else:
            compact = compact16 = v  # the same touching geometry at every size
    elif v.get("pointy"):
        compact, compact16 = dict(v, band=max(v["band"], 0.55)), dict(v, band=max(v["band"], 0.65))
    elif v.get("facets") and v.get("square"):
        # favicons and avatars keep a heavier band so the hexagon's top and bottom lines survive in a browser tab
        compact = dict(v, flat=max(v.get("flat", 0), 0.45))
        compact16 = dict(v, flat=max(v.get("flat", 0), 0.60))
    elif v.get("facets"):
        compact = compact16 = v
    else:
        compact, compact16 = COMPACT, COMPACT_16
    hexp, diap = symbol(0, 0, H, m, compact)
    hx = NAVY if wd else WHITE  # the hexagon's color on the navy tile
    t = W * 1.42
    tile = f'<rect x="{-t/2:.1f}" y="{-t/2:.1f}" width="{t:.1f}" height="{t:.1f}" rx="{t*5/32:.1f}" fill="{NAVY}"/>'
    dfill = on_navy if v.get("shade") else WHITE  # the shaded half on the navy tile
    files["favicon"] = svg(tile + f'<path fill="{dfill}" fill-rule="evenodd" d="{diap}"/><path fill="{hx}" fill-rule="evenodd" d="{hexp}"/>',
                           -t / 2, -t / 2, t, t, "AI Foundry")
    a = W * 1.9  # avatar: square navy ground, symbol inside the circle a platform crops to
    files["avatar"] = svg(f'<rect x="{-a/2:.1f}" y="{-a/2:.1f}" width="{a:.1f}" height="{a:.1f}" fill="{NAVY}"/>'
                          f'<path fill="{dfill}" fill-rule="evenodd" d="{diap}"/><path fill="{hx}" fill-rule="evenodd" d="{hexp}"/>',
                          -a / 2, -a / 2, a, a, "AI Foundry")
    hexp16, diap16 = symbol(0, 0, H, m, compact16)
    files["favicon-16"] = svg(tile + f'<path fill="{WHITE}" d="{diap16}"/><path fill="{hx}" fill-rule="evenodd" d="{hexp16}"/>',
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
