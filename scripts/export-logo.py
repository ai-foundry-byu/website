#!/usr/bin/env python3
"""
Exports the hexagon-and-diamond logo: every variant's SVGs, the PNGs and favicon.ico for the chosen
variant, and two review pages.

    python3 scripts/export-logo.py --font <Archivo[wdth,wght].ttf> [--choose a] [--out _brand-src/hex-diamond]

Writes, under --out:
    variants/{a,b,c}/           every SVG for each direction on the comparison sheet
    svg/                        the chosen direction's SVG masters
    png/                        PNG exports of the chosen direction
    favicon.ico                 16, 32 and 48 px
    comparison.html             the three directions side by side, light and dark, large and small
    preview.html                the chosen direction on light and dark, large and small, every version

Needs rsvg-convert (Homebrew librsvg) and Pillow. Nothing here touches public/ or the live site.
"""
import argparse
import importlib.util
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("build_logo", HERE / "build-logo.py")
bl = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bl)

NAVY = bl.NAVY


def png(src, dst, w=None, h=None, bg=None):
    cmd = ["rsvg-convert", str(src), "-o", str(dst)]
    if w:
        cmd += ["-w", str(w)]
    if h:
        cmd += ["-h", str(h)]
    if bg:
        cmd += ["-b", bg]
    subprocess.run(cmd, check=True)


def inline(path, height=None, width=None):
    s = Path(path).read_text().strip()
    size = (f' height="{height}"' if height else "") + (f' width="{width}"' if width else "")
    return s.replace("<svg ", f"<svg{size} style=\"display:block\" ", 1)


PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><style>
:root{{--navy:#002e5d;--royal:#003da5;--slate:#7c878e}}
body{{margin:0;font:15px/1.5 "IBM Plex Sans",system-ui,sans-serif;color:var(--navy);background:#fff}}
main{{max-width:1200px;margin:0 auto;padding:40px 24px 80px}}
h1{{font:700 28px/1.2 system-ui,sans-serif;margin:0 0 6px}} h2{{font:600 13px/1.2 system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--slate);margin:40px 0 12px}}
p.lede{{margin:0 0 24px;max-width:760px}} .note{{color:rgba(0,46,93,.7);font-size:13px;max-width:760px}}
.grid{{display:grid;gap:16px}} .g3{{grid-template-columns:repeat(2,minmax(0,1fr))}} .g2{{grid-template-columns:repeat(2,minmax(0,1fr))}}
.card{{border:1px solid rgba(0,46,93,.15);border-radius:5px;padding:24px;display:flex;flex-direction:column;gap:18px}}
.dark{{background:var(--navy);border-color:var(--navy);color:#fff}} .row{{display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap}}
.cap{{font-size:12px;color:var(--slate)}} .dark .cap{{color:#bfcbd7}} .k{{font:600 15px system-ui,sans-serif}}
svg{{max-width:100%}} .card>svg{{align-self:flex-start}}
@media (max-width:800px){{.g3,.g2{{grid-template-columns:1fr}}}}
</style></head><body><main>{body}</main></body></html>
"""


def caption(v):
    """One line describing a direction's construction, for the comparison sheet."""
    if v.get("white_diamond"):
        return (f"a solid white diamond with a {v['outline']:.2f}-stem navy border; a solid navy hexagon inscribed, its four "
                "upper and lower corners on the diamond's sides; on navy, the diamond is solid white")
    if v.get("keyline"):
        return (f"a diamond outline {v['outline']:.2f} stem, royal in the primary, white inside; a solid navy hexagon with a "
                f"{v['keyline']:.2f}-stem white border: its four nearest corners stop that far from the outline")
    if v.get("solid_hex"):
        return (f"a diamond outline {v['outline']:.2f} stem, royal in the primary, white inside; the largest solid "
                "flat-topped hexagon inside it, its four upper and lower corners touching the outline's inner edge")
    if v.get("hex_scale"):
        return (f"square diamond as the O; flat-topped hexagon cut out at {v['hex_scale']:.2f} of the largest that fits, "
                "so the O weighs what the letters do")
    if v.get("inverted"):
        if v["wall"] == 0:
            fit = "its four upper and lower corners exactly on the diamond's sides"
        else:
            fit = f"its corners {v['wall']:.2f} stem short of the diamond's sides"
        return "square diamond turned 45 degrees as the O, points overshooting 3%; the largest flat-topped hexagon cut out as the counter, " + fit
    if v.get("facets") and v.get("square"):
        return (f"square diamond cut out of the hexagon, stopping {v.get('flat', 0):.3f} of the O's top short of the "
                "flats; side corners short of the points")
    if v.get("facets"):
        return "diamond stretched 2 : sqrt 3 so all four corners touch: four corner triangles"
    if v.get("cut"):
        return (f"solid hexagon, diamond cut out as the O's counter · flats {v['hex_flat']:.2f} of the O's top · "
                f"narrowest wall {v['wall']:.2f} stem")
    return (f"hexagon {v['hex_side']:.2f} stem (slants), {v['hex_flat']:.2f} of the O's top (flats) · diamond "
            f"{v['dia']:.2f} stem · gap {v['gap']:.2f} of the diamond weight")


def comparison(out):
    cards = ""
    for key in sorted(bl.VARIANTS):
        v = bl.VARIANTS[key]
        d = out / "variants" / key
        cards += f"""<div class="card"><div class="k">{key.upper()} · {v['name']}</div>
<div class="cap">{caption(v)}</div>
{inline(d / 'glyph.svg', width=220)}
{inline(d / 'wordmark.svg', height=56)}
<div class="row">{inline(d / 'wordmark.svg', height=28)}</div>
<div class="row">{inline(d / 'wordmark.svg', height=16)}{inline(d / 'glyph.svg', height=24)}{inline(d / 'glyph.svg', height=16)}</div>
</div>"""
    darks = "".join(f"""<div class="card dark"><div class="k">{k.upper()}</div>{inline(out / 'variants' / k / 'wordmark-white.svg', height=48)}
<div class="row">{inline(out / 'variants' / k / 'glyph-white.svg', height=64)}{inline(out / 'variants' / k / 'wordmark-white.svg', height=18)}</div></div>""" for k in sorted(bl.VARIANTS))
    body = f"""<h1>AI Foundry logo: directions</h1>
<p class="lede">The same construction thirteen ways. The hexagon is the Builder Hexagon (flat top and bottom, as the app draws it); the inner shape is the Consultant Diamond. A, B and C use an outlined diamond and differ in the weight of the hexagon, the weight of the diamond, and the clear space between them. D turns the diamond into a rhombus whose sides run parallel to the hexagon's slanted sides, so every line in the symbol sits at 0 or 60 degrees. E drops the inner outline: the hexagon is solid and the diamond is cut out of it as the O's counter, so there is one shape and nothing to balance. F cuts a true square diamond out of the hexagon, nearly as large as it can go: its top and bottom points stop a hairline band short of the flats, so the hexagon stays whole, and its side corners stop short of the hexagon's points. G stretches the diamond so all four corners touch, which leaves four triangles but makes it wider than tall. H inverts the roles: the diamond is the letter and the hexagon is cut out of it as the counter. I reverses H's fills: a solid hexagon inside a diamond outline. J adds a white keyline around I's hexagon, so frame, keyline and hexagon each read on their own. K inscribes a solid navy hexagon in a solid white diamond that carries only a hairline navy border; on navy the white diamond shows on its own. In every direction but D, the diamond is proportioned so that, scaled up from the center, its four corners reach the hexagon together: top and bottom at the flats, left and right at the points. Type is the brand nameplate: Archivo 700 at width 125, outlined.</p>
<h2>On white, large to small</h2><div class="grid g3">{cards}</div>
<h2>Reversed on navy</h2><div class="grid g3">{darks}</div>
<p class="note">Reversed versions are all white: royal never sits on navy (brand rule, 1.43:1). The 16 px row is the smallest size a wordmark should be used at.</p>"""
    (out / "comparison.html").write_text(PAGE.format(title="AI Foundry logo directions", body=body))


def preview(out, key):
    s = out / "svg"
    vv = bl.VARIANTS[key]
    cut = vv.get("cut") or vv.get("facets") or vv.get("inverted")
    prim = ("Navy hexagon inscribed in a white diamond with a hairline navy border" if vv.get("white_diamond") else "Navy hexagon with a white border, inside a royal diamond outline" if vv.get("keyline") else "Navy hexagon, diamond outline in royal" if vv.get("solid_hex") else "All navy; the diamond is the O and the hexagon its counter" if vv.get("inverted") else "All navy; a square diamond set into the hexagon" if bl.VARIANTS[key].get("square") else "All navy; the diamond runs to the hexagon's edges" if bl.VARIANTS[key].get("facets") else "All navy; the diamond is the O's counter") if cut else "Navy, diamond in royal"
    symcap = ("Solid navy hexagon inscribed in a white diamond, hairline navy border" if vv.get("white_diamond") else "Solid navy hexagon, a white keyline, a royal diamond outline" if vv.get("keyline") else "Solid navy hexagon inside a royal diamond outline" if vv.get("solid_hex") else "Navy diamond, the largest hexagon cut out, touching its sides" if vv.get("inverted") else ("Navy hexagon, square diamond cut out nearly to its edges" if bl.VARIANTS[key].get("square") else "Four navy triangles around a full-size diamond") if bl.VARIANTS[key].get("facets") else "Navy hexagon, diamond cut out") if cut else "Navy hexagon, royal diamond"
    body = f"""<h1>AI Foundry logo · direction {key.upper()} ({bl.VARIANTS[key]['name']})</h1>
<p class="lede">Proposed. Not yet in public/ or on the live site.</p>
<h2>Primary wordmark</h2>
<div class="grid g2"><div class="card">{inline(s / 'wordmark.svg', height=96)}<div class="row">{inline(s / 'wordmark.svg', height=40)}{inline(s / 'wordmark.svg', height=20)}</div><div class="cap">{prim} · on white</div></div>
<div class="card dark">{inline(s / 'wordmark-white.svg', height=96)}<div class="row">{inline(s / 'wordmark-white.svg', height=40)}{inline(s / 'wordmark-white.svg', height=20)}</div><div class="cap">Reversed, all white · on navy</div></div></div>
<h2>Symbol</h2>
<div class="grid g2"><div class="card"><div class="row">{inline(s / 'glyph.svg', height=200)}{inline(s / 'glyph.svg', height=64)}{inline(s / 'glyph.svg', height=32)}{inline(s / 'glyph.svg', height=20)}</div><div class="cap">{symcap}</div></div>
<div class="card dark"><div class="row">{inline(s / 'glyph-white.svg', height=200)}{inline(s / 'glyph-white.svg', height=64)}{inline(s / 'glyph-white.svg', height=32)}{inline(s / 'glyph-white.svg', height=20)}</div><div class="cap">White</div></div></div>
<h2>Single color</h2>
<div class="grid g2"><div class="card">{inline(s / 'wordmark-navy.svg', height=64)}{inline(s / 'glyph-navy.svg', height=80)}<div class="cap">Navy only</div></div>
<div class="card">{inline(s / 'wordmark-black.svg', height=64)}{inline(s / 'glyph-black.svg', height=80)}<div class="cap">Black only, for print that cannot take navy</div></div></div>
<h2>Compact: favicon and avatar</h2>
<div class="card"><div class="row">{inline(s / 'avatar.svg', height=160)}<div style="border-radius:50%;overflow:hidden;width:160px;height:160px">{inline(s / 'avatar.svg', height=160)}</div>{inline(s / 'favicon.svg', height=96)}{inline(s / 'favicon.svg', height=48)}{inline(s / 'favicon.svg', height=32)}{inline(s / 'favicon-16.svg', height=16)}</div>
<div class="cap">Avatar (square and circle crop) · favicon at 96, 48, 32 and 16 px{" · the same cut shape at every size" if cut else " · the 16 px favicon fills the diamond"}</div></div>
<p class="note">Brand rule: the Foundry is never shown as a standalone "AI Foundry" without BYU identification. Use this wordmark where BYU Marriott is identified nearby; the co-branded BYU Marriott lockup itself comes only from BYU Marriott Marketing and is never recreated.</p>"""
    (out / "preview.html").write_text(PAGE.format(title="AI Foundry logo preview", body=body))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True)
    ap.add_argument("--choose", default="a", choices=sorted(bl.VARIANTS))
    ap.add_argument("--out", default="_brand-src/hex-diamond")
    a = ap.parse_args()
    out = Path(a.out)
    for key in sorted(bl.VARIANTS):
        bl.build(a.font, key, out / "variants" / key)
    bl.build(a.font, a.choose, out / "svg")
    p = out / "png"
    p.mkdir(parents=True, exist_ok=True)
    s = out / "svg"
    for name in ("wordmark", "wordmark-navy", "wordmark-black", "wordmark-white"):
        for w in (600, 1200, 2400):
            png(s / f"{name}.svg", p / f"{name}-{w}.png", w=w)
    for name in ("glyph", "glyph-navy", "glyph-black", "glyph-white"):
        for w in (256, 512, 1024):
            png(s / f"{name}.svg", p / f"{name}-{w}.png", w=w)
    for w in (32, 48, 180, 192, 512):
        png(s / "favicon.svg", p / f"favicon-{w}.png", w=w, h=w)
    png(s / "favicon-16.svg", p / "favicon-16.png", w=16, h=16)
    for w in (400, 1080):
        png(s / "avatar.svg", p / f"avatar-{w}.png", w=w, h=w)
    from PIL import Image
    Image.open(p / "favicon-48.png").save(out / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
                                           append_images=[Image.open(p / "favicon-16.png"), Image.open(p / "favicon-32.png")])
    comparison(out)
    preview(out, a.choose)
    print(f"exported direction {a.choose} to {out}")


if __name__ == "__main__":
    main()
