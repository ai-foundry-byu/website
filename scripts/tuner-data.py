import importlib.util, json, sys
from pathlib import Path
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
spec = importlib.util.spec_from_file_location("bl", "scripts/build-logo.py"); bl = importlib.util.module_from_spec(spec); spec.loader.exec_module(bl)
tmp, font, gs, cmap, m = bl.load(sys.argv[1])
cap = m["cap"]; track = bl.TRACKING * m["upm"]
def run(text, x0):
    parts, x = [], x0
    for g in bl.shape(tmp, text):
        name = font.getGlyphOrder()[g["g"]] if isinstance(g["g"], int) else g["g"]
        pen = SVGPathPen(gs)
        gs[name].draw(TransformPen(pen, (1, 0, 0, -1, x + g.get("dx", 0), cap - g.get("dy", 0))))
        parts.append(pen.getCommands()); x += g["ax"] + track
    return " ".join(parts), x
a, x = run("AI", 0)
x += gs["space"].width * bl.WORD_SPACE - track
f, x = run("F", x)
u, xu = run("UNDRY", 0)
uw = xu - track - (gs["Y"].width - 866)
o, ow = run("O", 0)
print(json.dumps({"aif": a + " " + f, "afterF": x, "undry": u, "undryW": uw, "O": o, "oAdv": ow - track,
  "cap": cap, "stem": m["stem"], "oTop": m["o_top"], "oLsb": m["o_lsb"], "oRsb": m["o_rsb"], "track": track,
  "sb": bl.SIDE_BEARING}))
