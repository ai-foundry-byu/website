#!/usr/bin/env python3
"""
Outlines AI FOUNDRY in several typefaces for the logo tuner's font selector.

    python3 scripts/tuner-fonts.py <fonts dir> > fonts.json

Each face is an OFL font from github.com/google/fonts, saved as <fonts dir>/<key>/font.ttf (Archivo as
<fonts dir>/Archivo-wdth-wght.ttf). The choice follows BYU Marriott's type: its primary face is Ringside Narrow
(an American gothic) and its documented substitute is Franklin Gothic; BYU's web face is IBM Plex Sans. So the list is
gothic and grotesque sans faces of that family, all set bold and in capitals.
"""
import importlib.util, json, sys, tempfile
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("bl", HERE / "build-logo.py"); bl = importlib.util.module_from_spec(spec); spec.loader.exec_module(bl)

FACES = [  # key, label, file, axes, tracking (em)
    ("archivo125", "Archivo Expanded (current)", "Archivo-wdth-wght.ttf", {"wght": 700, "wdth": 125}, -0.015),
    ("archivo100", "Archivo", "Archivo-wdth-wght.ttf", {"wght": 700, "wdth": 100}, 0.0),
    ("librefranklin", "Libre Franklin (Franklin Gothic, Marriott's substitute)", "librefranklin/font.ttf", {"wght": 700}, 0.01),
    ("plexcond", "IBM Plex Sans Condensed (narrow, like Ringside Narrow)", "plexsans/font.ttf", {"wght": 700, "wdth": 85}, 0.01),
    ("plexsans", "IBM Plex Sans (BYU's web face)", "plexsans/font.ttf", {"wght": 700, "wdth": 100}, 0.01),
    ("publicsans", "Public Sans", "publicsans/font.ttf", {"wght": 700}, 0.01),
    ("barlowsc", "Barlow Semi Condensed", "barlowsc/font.ttf", None, 0.01),
    ("worksans", "Work Sans", "worksans/font.ttf", {"wght": 700}, 0.0),
]


def face(path, axes):
    f = TTFont(path)
    if axes:
        f = instancer.instantiateVariableFont(f, {k: v for k, v in axes.items() if k in {a.axisTag for a in f["fvar"].axes}})
    tmp = Path(tempfile.mkdtemp()) / "face.ttf"
    f.save(tmp)
    return tmp, TTFont(tmp)


def stem(gs, cmap, cap):
    """Width of the H's left stem, where a line a quarter of the way up crosses it (some faces' I has serifs)."""
    rp = RecordingPen(); gs[cmap[ord("H")]].draw(rp)
    y, xs, pts = cap * 0.25, [], []
    for op, args in rp.value:
        if op == "moveTo": pts = [args[0]]
        elif op in ("lineTo", "qCurveTo", "curveTo"): pts.append(args[-1])
        elif op in ("closePath", "endPath"):
            for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]):
                if (y0 - y) * (y1 - y) < 0: xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
    xs.sort()
    return xs[1] - xs[0]


def data(path, axes, tracking):
    tmp, font = face(path, axes)
    gs, cmap = font.getGlyphSet(), font.getBestCmap()
    def bounds(ch):
        bp = BoundsPen(gs); gs[cmap[ord(ch)]].draw(bp); return bp.bounds
    cap, upm = bounds("H")[3], font["head"].unitsPerEm
    o = bounds("O")
    rp = RecordingPen(); gs[cmap[ord("O")]].draw(rp)
    ys, tops = [], []
    for op, args in rp.value:
        ys += [p[1] for p in args]
        if op in ("closePath", "endPath"):
            tops.append(max(ys)); ys = []
    track = tracking * upm
    def run(text, x0):
        parts, x = [], x0
        for g in bl.shape(tmp, text):
            name = font.getGlyphOrder()[g["g"]] if isinstance(g["g"], int) else g["g"]
            pen = SVGPathPen(gs)
            gs[name].draw(TransformPen(pen, (1, 0, 0, -1, x + g.get("dx", 0), cap - g.get("dy", 0))))
            parts.append(pen.getCommands()); x += g["ax"] + track
        return " ".join(parts), x
    a, x = run("AI", 0)
    x += gs[cmap[32]].width * bl.WORD_SPACE - track
    fStart = x
    f, x = run("F", x)
    u, xu = run("UNDRY", 0)
    yb = bounds("Y")
    O, ow = run("O", 0)
    r = lambda v: round(v, 1)
    return {"aif": a + " " + f, "ai": a, "f": f, "fStart": r(fStart), "afterF": r(x), "undry": u,
            "undryW": r(xu - track - (gs[cmap[ord("Y")]].width - yb[2])), "O": O, "oAdv": r(ow - track),
            "cap": cap, "stem": stem(gs, cmap, cap), "oTop": max(tops) - min(tops),
            "oLsb": o[0], "oRsb": gs[cmap[ord("O")]].width - o[2], "track": r(track), "sb": list(bl.SIDE_BEARING)}


if __name__ == "__main__":
    root = Path(sys.argv[1])
    out = {}
    for key, label, file, axes, tracking in FACES:
        out[key] = dict(data(root / file, axes, tracking), label=label)
    print(json.dumps(out))
