import re, sys
exec(open(__import__('os').path.join(__import__('os').path.dirname(__file__) or '.', 'gen_head.py')).read())

# ---------- CSS for the site ----------
sel_rules = []
for sel, nm in anim:
    sel_rules.append(f".af-build.is-building {sel}{{animation:{nm} {T}ms linear 0ms backwards}}")
sel_rules.append(f".af-build.is-building .hx-arm{{animation:k-arm-rot {T}ms linear 0ms backwards,k-arm-op {T}ms linear 0ms backwards}}")
kfs_site = [k.replace("@keyframes k-", "@keyframes af-bp-") for k in kfs]
sel_rules = [re.sub(r"animation:k-", "animation:af-bp-", r).replace(",k-arm-op", ",af-bp-arm-op") for r in sel_rules]

CSS = f"""/* AI Foundry logo (Scott Murff, shipped 2026-11-17: Archivo Expanded, the O a flat-top hexagon with a 70% diamond cut): the blueprint build.
   Generated from the design team's blueprint kit (round18 motion/blueprint-build.html). One {T} ms clock.
   Base styles are the FINAL mark: every construction line (.c) rests at opacity 0 and the blueprint group
   rests fully masked, so no class, no CSS, print and prefers-reduced-motion all show the locked mark only.
   The animations bind only under .af-build.is-building. Line and ground colours follow the mark ink:
   White lines with Navy scoring under data-theme="dark", Navy lines with White scoring on light grounds. */
.af-build{{overflow:visible;--af-bp-line:var(--af-mark-ink,#002E5D);--af-bp-ground:#FFFFFF}}
.af-build[data-theme=dark],[data-theme=dark] .af-build{{--af-bp-line:var(--af-mark-ink,#FFFFFF);--af-bp-ground:#002E5D}}
.af-ink{{fill:var(--af-mark-ink,#002E5D)}}
.af-build[data-theme=dark] .af-ink,[data-theme=dark] .af-build .af-ink{{fill:var(--af-mark-ink,#FFFFFF)}}
.af-hex,.af-cut{{transform-box:fill-box;transform-origin:50% 50%}}
.af-build .dz{{transform-box:fill-box;transform-origin:50% 50%;transform:scale(0)}}
.af-build .c{{fill:none;stroke:var(--af-bp-line);stroke-width:.75px;vector-effect:non-scaling-stroke;opacity:0;stroke-linecap:round;stroke-linejoin:round}}
.af-build .c *{{fill:none;stroke:inherit;vector-effect:non-scaling-stroke}}
.af-build .grid-minor,.af-build .grid-mid,.af-build .grid-major{{stroke-width:.6px}}
/* user-unit strokes (dash-drawn lines): --k = user units per CSS px of the rendered mark, stepped by viewport
   for the hero, which runs the full container (1200 px at desktop, viewport minus 48 px below that) */
.af-build{{--k:.73}}
@media (max-width:1249px){{.af-build{{--k:.88}}}}
@media (max-width:899px){{.af-build{{--k:1.3}}}}
@media (max-width:599px){{.af-build{{--k:2.2}}}}
@media (max-width:420px){{.af-build{{--k:2.5}}}}
.af-build [pathLength]{{vector-effect:none;stroke-dasharray:1 1;stroke-width:calc(.75 * var(--k))}}
.af-build .tr{{stroke-width:calc(1.1 * var(--k))}}
.af-build .dd{{vector-effect:none;stroke-width:calc(.75 * var(--k));stroke-linecap:butt;stroke-dasharray:calc(9 * var(--k)) calc(3 * var(--k)) calc(1.5 * var(--k)) calc(3 * var(--k))}}
.af-build .vdot{{fill:var(--af-bp-line);stroke:none;r:calc(1.2px * var(--k))}}
.af-build .dm-tr,.af-build .dm-diag{{stroke:var(--af-bp-ground);stroke-width:calc(1.15 * var(--k))}}
.af-build .dm-diag{{stroke-width:calc(.85 * var(--k))}}
.af-build .hx-arm{{stroke-width:.9px;transform-box:view-box;transform-origin:{CX}px {CY}px}}
/* phone: drop the 12.5 grid and the dimension row; keep the hex circle, axes and step-offs */
@media (max-width:759px){{.af-build .grid-minor,.af-build .dim,.af-build .dim-ticks,.af-build .drops{{display:none}}}}
{chr(10).join(kfs_site)}
{chr(10).join(sel_rules)}
/* symbol variant (hexagon alone, .af-symbol): it carries no construction; the hexagon drops in, then the cut opens */
@keyframes af-hex-sym{{0%{{opacity:0;transform:translateY(-24.96px) scale(1.1)}}30%{{opacity:1}}100%{{opacity:1;transform:translateY(0) scale(1)}}}}
@keyframes af-cut-sym{{0%{{transform:scale(0)}}100%{{transform:scale(1)}}}}
.af-build.af-symbol.is-building .af-hex{{animation:af-hex-sym 660ms cubic-bezier(.2,.75,.25,1) 0ms backwards}}
.af-build.af-symbol.is-building .af-cut{{animation:af-cut-sym 640ms cubic-bezier(.45,0,.2,1) 640ms backwards}}
@media (prefers-reduced-motion:reduce){{.af-build *{{animation:none!important}}.af-build .c{{display:none}}}}
@media print{{.af-build *{{animation:none!important}}.af-build .c{{display:none}}}}
"""
open(sys.argv[1], 'w').write(CSS)

# ---------- JSX for construction ----------
def jsx(m):
    m = m.replace(' class="', ' className="').replace('stop-color=', 'stopColor=')
    m = re.sub(r'(\w+)="([^"]*@@[^"]*)"', lambda g: g.group(1) + '={`' + g.group(2).replace('@@', '${p}') + '`}', m)
    m = re.sub(r'pathLength="1"', 'pathLength={1}', m)
    m = re.sub(r'/>', ' />', m)
    return m
defs = DEFS.replace('id="bp-', 'id="@@-').replace('url(#bp-', 'url(#@@-')
under = ('<g aria-hidden="true" mask="url(#@@-dzm)">'
         '<g mask="url(#@@-mx)"><g mask="url(#@@-my)">' + "".join(els_grid) + "</g>" + "".join(els_feather) + "</g>"
         + "".join(els_under) + "</g>")
score = "".join(els_score)
out = open(sys.argv[2], 'w')
out.write("/* generated by the blueprint kit (gen.py): the construction under and over the ink */\n")
out.write("function Blueprint({ p }: { p: string }) {\n  return (\n    <>\n      " + jsx(defs) + "\n      " + jsx(under) + "\n    </>\n  )\n}\n\n")
out.write("function Scoring() {\n  return (\n    <>\n      " + jsx(score) + "\n    </>\n  )\n}\n")
print("anims", len(anim), "kfs", len(kfs))
