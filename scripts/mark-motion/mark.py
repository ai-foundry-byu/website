"""Scott Murff's shipped AI FOUNDRY wordmark (Archivo Expanded, flat-top hexagon O with a 70% diamond cut),
read from _brand-src/hex-diamond/marketing/primary/ai-foundry_primary_white.svg and normalised to the
build's units: cap height = 100, the ink's left edge at x = 0. Exposes LETTERS, HEX, CUT and the derived
geometry (W, H, CX, CY, R, D, HL, HR)."""
import re, json, sys
from pathlib import Path
SRC = Path(__file__).resolve().parents[2] / "_brand-src/hex-diamond/marketing/primary/ai-foundry_primary_white.svg"
svg = open(SRC).read()
g = re.search(r'<g transform="translate\(([\d.]+) ([\d.]+)\) scale\(([\d.]+)\)"><g transform="translate\(0\.0 0\)">(.*?)</g></g>', svg, re.S)
GTX, GTY, GS = map(float, g.group(1, 2, 3))
paths = re.findall(r'<path ([^>]*?)d="([^"]+)"', g.group(4))

def tokens(d):
    return re.findall(r'[MLQHVZ]|-?\d*\.?\d+', d)

def parse(d, dx):
    """absolute M/L/Q/H/V/Z -> list of subpaths, each a list of (cmd, [pts]) in font units (+dx)."""
    t = tokens(d); i = 0; subs = []; cur = None; x = y = 0; cmd = None
    def num():
        nonlocal i; v = float(t[i]); i += 1; return v
    while i < len(t):
        if re.match(r'[MLQHVZ]', t[i]): cmd = t[i]; i += 1
        if cmd == 'M':
            x, y = num() + dx, num(); cur = [('M', [(x, y)])]; subs.append(cur); cmd = 'L'
        elif cmd == 'L':
            x, y = num() + dx, num(); cur.append(('L', [(x, y)]))
        elif cmd == 'H':
            x = num() + dx; cur.append(('L', [(x, y)]))
        elif cmd == 'V':
            y = num(); cur.append(('L', [(x, y)]))
        elif cmd == 'Q':
            c = (num() + dx, num()); x, y = num() + dx, num(); cur.append(('Q', [c, (x, y)]))
        elif cmd == 'Z':
            cur.append(('Z', []))
    return subs

def bbox(sub):
    xs, ys = [], []; px = py = None
    for c, pts in sub:
        if c in 'ML': xs.append(pts[0][0]); ys.append(pts[0][1]); px, py = pts[0]
        elif c == 'Q':
            (cx, cy), (ex, ey) = pts
            for a0, a1, a2, arr in ((px, cx, ex, xs), (py, cy, ey, ys)):
                arr.append(a2)
                den = a0 - 2*a1 + a2
                if abs(den) > 1e-12:
                    tt = (a0 - a1)/den
                    if 0 < tt < 1: arr.append((1-tt)**2*a0 + 2*(1-tt)*tt*a1 + tt*tt*a2)
            px, py = ex, ey
    return min(xs), min(ys), max(xs), max(ys)

subs_all = []  # (is_hex, sub)
for attrs, d in paths:
    m = re.search(r'translate\(([\d.]+) 0\)', attrs)
    dx = float(m.group(1)) if m else 0.0
    ev = 'evenodd' in attrs
    for s in parse(d, dx): subs_all.append((ev, s))

hexsubs = [s for ev, s in subs_all if ev]
letsubs = [s for ev, s in subs_all if not ev]
assert len(hexsubs) == 2
boxes = [bbox(s) for s in letsubs]
X0 = min(b[0] for b in boxes + [bbox(s) for s in hexsubs])
Y0 = min(b[1] for b in boxes + [bbox(s) for s in hexsubs])
X1 = max(b[2] for b in boxes + [bbox(s) for s in hexsubs])
Y1 = max(b[3] for b in boxes + [bbox(s) for s in hexsubs])
assert abs(Y0) < 1e-9, Y0
# cap height -> 100. The hexagon's flats sit exactly on the cap line and the baseline, so its height is the cap
# height in the file's units (687 for Archivo Expanded 700/125; the pre-2026-11-17 face was 742).
_hb = bbox(hexsubs[0]); K = 100 / (_hb[3] - _hb[1])

def fx(v): return (v - X0) * K
def fy(v): return v * K
def f(v): 
    s = f"{v:.3f}".rstrip('0').rstrip('.')
    return "0" if s in ("-0", "") else s
def emit(sub):
    out = []
    for c, pts in sub:
        if c == 'Z': out.append('Z')
        else: out.append(c + " ".join(f"{f(fx(a))} {f(fy(b))}" for a, b in pts))
    return "".join(out)

# group subpaths into letters: a counter sits inside the previous outline's box
NAMES = "AIFUNDRY"; groups = []
for s, b in zip(letsubs, boxes):
    if groups and b[0] >= groups[-1][1][0] - 1e-6 and b[2] <= groups[-1][1][2] + 1e-6:
        groups[-1][0].append(s)
    else:
        groups.append(([s], b))
assert len(groups) == 8, len(groups)
LETTERS = [(n, "".join(emit(s) for s in ss)) for n, (ss, _) in zip(NAMES, groups)]
outer, inner = hexsubs
HEX = emit(outer); CUT = emit(inner)
ob, ib = bbox(outer), bbox(inner)
HL, HR = fx(ob[0]), fx(ob[2])
CX, CY = (fx(ob[0]) + fx(ob[2])) / 2, (fy(ob[1]) + fy(ob[3])) / 2
R = (HR - HL) / 2
D = (fx(ib[2]) - fx(ib[0])) / 2
W, H = fx(X1), fy(Y1)
GEOM = dict(W=round(W, 3), H=round(H, 3), CX=round(CX, 3), CY=round(CY, 3), R=round(R, 3), D=round(D, 3), HL=round(HL, 3), HR=round(HR, 3),
            hex_top=round(fy(ob[1]), 3), hex_bot=round(fy(ob[3]), 3), cut_ratio=round(D / (fy(ob[3]) - CY), 4), K=K, X0=X0,
            src_transform=dict(tx=GTX, ty=GTY, s=GS))
if __name__ == "__main__":
    print(json.dumps(GEOM, indent=1))
    print(HEX); print(CUT)
    for n, d in LETTERS: print(n, d[:80], len(d))
