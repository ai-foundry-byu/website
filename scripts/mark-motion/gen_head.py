import re, math
# geometry from Scott Murff's shipped Archivo mark (mark.py), never typed in
from mark import LETTERS, HEX, CUT, GEOM
WM, HM = GEOM["W"], GEOM["H"]
MASK = dict(x=round(GEOM["HL"] - 60, 3), y=-60, width=round(GEOM["HR"] - GEOM["HL"] + 120, 3), height=220)
T = 3850  # total ms, one shared clock
CX, CY = GEOM["CX"], GEOM["CY"]
R = GEOM["R"]  # circumradius (vertex x HL..HR)
D = GEOM["D"]  # diamond half-diagonal = 70% of the apothem
TR_A = .80   # outline trace alpha (letters and hexagon)
GD_A = .30   # guide alpha
END0, END1 = 3250, 3420  # belt-and-braces own fades; the radial dissolve does the real work

def pct(t): return f"{100*t/T:.3f}%"
kfs = []
def kf(name, pts, ease="cubic-bezier(.45,0,.25,1)"):
    """pts: [(ms, css)], holds before first / after last."""
    s = []
    if pts[0][0] > 0: s.append(f"0%{{{pts[0][1]}}}")
    for t, css in pts: s.append(f"{pct(t)}{{{css};animation-timing-function:{ease}}}")
    if pts[-1][0] < T: s.append(f"100%{{{pts[-1][1]}}}")
    kfs.append(f"@keyframes {name}{{{''.join(s)}}}")
    return name

# ---- groups: feather (grid + guides, edge-feathered), under (rest of construction), over (traces), score (navy)
els_grid, els_feather, els_under, els_over, els_score = [], [], [], [], []
G = dict(grid=els_grid, feather=els_feather, under=els_under, over=els_over, score=els_score)
anim = []
def draw(cls, d, t0, t1, alpha, where="under", fade0=END0, fade1=END1, extra=""):
    name = kf(f"k-{cls}", [(max(t0-80, 0), "stroke-dashoffset:1;opacity:0"), (t0, f"stroke-dashoffset:1;opacity:{alpha}"),
                           (t1, f"stroke-dashoffset:0;opacity:{alpha}"), (fade0, f"stroke-dashoffset:0;opacity:{alpha}"),
                           (fade1, "stroke-dashoffset:0;opacity:0")])
    G[where].append(f'<path class="c {cls}" pathLength="1" d="{d}"{extra}/>')
    anim.append((f".{cls}", name))

def fade(cls, markup, t0, t1, alpha, where="under", fade0=END0, fade1=END1):
    name = kf(f"k-{cls}", [(t0, "opacity:0"), (t1, f"opacity:{alpha}"), (fade0, f"opacity:{alpha}"), (fade1, "opacity:0")])
    G[where].append(markup.replace("CLS", f"c {cls}"))
    anim.append((f".{cls}", name))

# 1. drafting grid: 12.5 minor (desktop only), 25 mid, 50 major; edges feathered over 40 units
X0, X1, Y0, Y1 = -50, round(WM + 50), -50, 150
lines = {12.5: [], 25: [], 50: []}
def tier(v):
    return 50 if abs(v/50-round(v/50)) < 1e-6 else 25 if abs(v/25-round(v/25)) < 1e-6 else 12.5
x = X0
while x <= X1 + 1e-6:
    lines[tier(x)].append(f"M{x:g} {Y0}V{Y1}"); x += 12.5
y = Y0
while y <= Y1 + 1e-6:
    lines[tier(y)].append(f"M{X0} {y:g}H{X1}"); y += 12.5
fade("grid-minor", f'<path class="CLS" d="{"".join(lines[12.5])}"/>', 0, 700, .065, "grid")
fade("grid-mid", f'<path class="CLS" d="{"".join(lines[25])}"/>', 60, 760, .085, "grid")
fade("grid-major", f'<path class="CLS" d="{"".join(lines[50])}"/>', 120, 820, .10, "grid")

# 2. type guides: cap line, centre line (broken around the O, which gets its own dash-dot axis), baseline
GX0, GX1 = -45, round(WM + 45)
draw("g-cap", f"M{GX0} 0H{GX1}", 150, 950, GD_A, "feather")
draw("g-mid", f"M{GX0} {CY}H{CX-84}M{CX+84} {CY}H{GX1}", 270, 1070, GD_A, "feather")
draw("g-base", f"M{GX0} 100H{GX1}", 390, 1190, GD_A, "feather")

# 3. registration marks (circle + cross) at two corners
def reg(cls, x, y, t0):
    m = f'<g class="CLS"><circle cx="{x}" cy="{y}" r="5"/><path d="M{x-9} {y}H{x+9}M{x} {y-9}V{y+9}"/></g>'
    fade(cls, m, t0, t0+400, .5)
reg("reg-a", -30, -22, 250); reg("reg-b", round(WM + 30, 3), round(HM + 22, 3), 380)

# 4. sparse dimension row: ticks and drops only at the mark ends and the hex extents
DY = -18
edges = [0, GEOM["HL"], GEOM["HR"], WM]
draw("dim", f"M-12 {DY}H{round(WM + 12):g}", 300, 1100, GD_A, "feather")
ticks = "".join(f"M{e-2.6} {DY+2.6}L{e+2.6} {DY-2.6}M{e} {DY-5}V{DY+5}" for e in edges)
fade("dim-ticks", f'<path class="CLS" d="{ticks}"/>', 700, 1200, .5)
drops = "".join(f"M{e} {DY+5}V-2" for e in edges)
fade("drops", f'<path class="CLS" d="{drops}"/>', 800, 1300, .26)

# 5. letter outlines traced A..Y, then each floods with a bottom-to-top wipe (the ink rises);
#    each trace dies over the last 150 ms of its own flood
ink_letters = []
FILL = 380
for i, (k, d) in enumerate(LETTERS):
    subs = [s.strip()+"Z" for s in d.split("Z") if s.strip()]
    t0 = 450 + i*85
    f0 = 1650 + i*70
    name = kf(f"k-tr-{k}", [(t0-60, "stroke-dashoffset:1;opacity:0"), (t0, f"stroke-dashoffset:1;opacity:{TR_A}"),
                            (t0+700, f"stroke-dashoffset:0;opacity:{TR_A}"), (f0+FILL-150, f"stroke-dashoffset:0;opacity:{TR_A}"),
                            (f0+FILL, "stroke-dashoffset:0;opacity:0")], ease="cubic-bezier(.55,.05,.3,1)")
    for s in subs:
        els_over.append(f'<path class="c tr tr-{k}" pathLength="1" d="{s}"/>')
    anim.append((f".tr-{k}", name))
    fn = kf(f"k-ink-{k}", [(f0, "clip-path:inset(106% -6% -6% -6%)"), (f0+FILL, "clip-path:inset(-6% -6% -6% -6%)")],
            ease="cubic-bezier(.2,.7,.3,1)")
    ink_letters.append(f'<path class="af-ink af-letter af-letter-{k}" d="{d}"/>')
    anim.append((f".af-letter-{k}", fn))

# 6. hexagon gets its own moment (1000-1900 ms, letters still outline-only):
#    centre mark, dash-dot axes through the O, compass sweep, step-offs, vertex dots, 60-degree diameters
fade("hx-centre", f'<path class="CLS" d="M{CX-6} {CY}H{CX+6}M{CX} {CY-6}V{CY+6}"/>', 950, 1080, .7)
fade("hx-axv", f'<path class="CLS dd" d="M{CX} -32V132"/>', 850, 1150, .42)
fade("hx-axh", f'<path class="CLS dd" d="M{CX-84} {CY}H{CX+84}"/>', 900, 1200, .42)
circle = f"M{CX+R} {CY}A{R} {R} 0 1 0 {CX-R} {CY}A{R} {R} 0 1 0 {CX+R} {CY}"
S0, S1 = 1000, 1650
draw("hx-circle", circle, S0, S1, .45)
kf("k-arm-rot", [(S0, "transform:rotate(0deg)"), (S1, "transform:rotate(-360deg)")])
kf("k-arm-op", [(S0-100, "opacity:0"), (S0, "opacity:.55"), (S1, "opacity:.55"), (S1+200, "opacity:0")], ease="linear")
els_under.append(f'<path class="c hx-arm" d="M{CX} {CY}L{CX+R} {CY}"/>')
def ease_inv(p):
    def bz(t, a, b): return 3*(1-t)**2*t*a + 3*(1-t)*t*t*b + t**3
    lo, hi = 0, 1
    for _ in range(60):
        m = (lo+hi)/2
        if bz(m, 0, 1) < p: lo = m
        else: hi = m
    u = (lo+hi)/2
    return bz(u, .45, .25)
for v in range(6):
    ang = -v*60
    vx, vy = CX + R*math.cos(math.radians(ang)), CY + R*math.sin(math.radians(ang))
    pa = math.radians(ang + 60); px, py = CX + R*math.cos(pa), CY + R*math.sin(pa)
    a0 = math.atan2(vy-py, vx-px)
    sa, ea = a0 - math.radians(7), a0 + math.radians(7)
    ax0, ay0 = px + R*math.cos(sa), py + R*math.sin(sa)
    ax1, ay1 = px + R*math.cos(ea), py + R*math.sin(ea)
    tv = S0 + (S1-S0)*ease_inv(v/6) if v else S0 + 20
    fade(f"hx-step{v}", f'<path class="CLS" d="M{ax0:.3f} {ay0:.3f}A{R} {R} 0 0 1 {ax1:.3f} {ay1:.3f}"/>', tv, tv+120, .7)
    fade(f"hx-dot{v}", f'<circle class="CLS vdot" r="1.6" cx="{vx:.3f}" cy="{vy:.3f}"/>', tv+40, tv+160, .85)
diam = "".join(f"M{CX+R*math.cos(math.radians(a)):.3f} {CY+R*math.sin(math.radians(a)):.3f}"
               f"L{CX-R*math.cos(math.radians(a)):.3f} {CY-R*math.sin(math.radians(a)):.3f}" for a in (60, 120))
draw("hx-diam", diam, 1600, 1900, GD_A)
HF0, HF1 = 2400, 2780
name = kf("k-tr-hex", [(1890, "stroke-dashoffset:1;opacity:0"), (1950, f"stroke-dashoffset:1;opacity:{TR_A}"),
                       (2450, f"stroke-dashoffset:0;opacity:{TR_A}"), (HF1-150, f"stroke-dashoffset:0;opacity:{TR_A}"),
                       (HF1, "stroke-dashoffset:0;opacity:0")], ease="cubic-bezier(.55,.05,.3,1)")
els_over.append(f'<path class="c tr tr-hex" pathLength="1" d="{HEX}"/>')
anim.append((".tr-hex", name))
# opaque top-down wipe (the hexagon drops in), same ink logic as the letters; fill-opacity stays 1
anim.append((".af-hex", kf("k-ink-hex", [(HF0, "clip-path:inset(-6% -6% 106% -6%)"), (HF1, "clip-path:inset(-6% -6% -6% -6%)")], ease="cubic-bezier(.2,.7,.3,1)")))

# 7. one scoring pass on the inked hexagon, in navy: inner circle r=70% apothem, the diamond's diagonals,
#    its outline, then the cut opens
SC0, SC1 = 3280, 3420
# (v3) no scoring circle: the square trace and the diagonals carry the diamond construction
draw("dm-diag", f"M{CX-D} {CY}H{CX+D}M{CX} {CY-D}V{CY+D}", 2900, 3060, .85, "score", SC0, SC1)
draw("dm-tr", f"M{CX} {CY-D}L{CX-D} {CY}L{CX} {CY+D}L{CX+D} {CY}Z", 3000, 3170, .95, "score", SC0, SC1)
anim.append((".af-cut", kf("k-cut", [(3120, "transform:scale(0)"), (3420, "transform:scale(1)")], ease="cubic-bezier(.45,0,.2,1)")))

# 8. the blueprint fades from the edges inward: a feathered radial mask on the hexagon centre
#    scales 1.15 -> .2 (sheet gone, hex construction intact) -> 0
anim.append((".dz", kf("k-dz", [(2600, "transform:scale(1.15)"), (3150, "transform:scale(.2)"), (3400, "transform:scale(0)")],
                        ease="cubic-bezier(.4,0,.6,1)")))


FX = 40/(X1-X0); FY = 40/(Y1-Y0)
DEFS = (
    f'<defs><linearGradient id="bp-fx" gradientUnits="userSpaceOnUse" x1="{X0}" y1="0" x2="{X1}" y2="0">'
    f'<stop offset="0" stop-color="#000"/><stop offset="{FX:.4f}" stop-color="#fff"/>'
    f'<stop offset="{1-FX:.4f}" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>'
    f'<linearGradient id="bp-fy" gradientUnits="userSpaceOnUse" x1="0" y1="{Y0}" x2="0" y2="{Y1}">'
    f'<stop offset="0" stop-color="#000"/><stop offset="{FY:.4f}" stop-color="#fff"/>'
    f'<stop offset="{1-FY:.4f}" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>'
    f'<radialGradient id="bp-dz"><stop offset="0" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/>'
    f'<stop offset="1" stop-color="#000"/></radialGradient>'
    f'<mask id="bp-mx" maskUnits="userSpaceOnUse" x="{X0}" y="{Y0-10}" width="{X1-X0}" height="{Y1-Y0+20}">'
    f'<rect x="{X0}" y="{Y0-10}" width="{X1-X0}" height="{Y1-Y0+20}" fill="url(#bp-fx)"/></mask>'
    f'<mask id="bp-my" maskUnits="userSpaceOnUse" x="{X0-10}" y="{Y0}" width="{X1-X0+20}" height="{Y1-Y0}">'
    f'<rect x="{X0-10}" y="{Y0}" width="{X1-X0+20}" height="{Y1-Y0}" fill="url(#bp-fy)"/></mask>'
    f'<mask id="bp-dzm" maskUnits="userSpaceOnUse" x="-120" y="-200" width="{round(WM + 241)}" height="500">'
    f'<circle class="dz" cx="{CX}" cy="{CY}" r="680" fill="url(#bp-dz)"/></mask></defs>')

