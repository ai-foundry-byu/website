"""Regenerate the site's Runout hero build from the v3 system outputs.
CSS: v3 base rules + v3 runout rules, carrying the site's review pass 1 (lock ring 28 units,
stroke 3.2, the 10 unit pin that snaps 2.2x to 1x and holds) on top. TSX: the v3 runout data."""
import json, re, sys
R = "/Users/davenportmini/clawd/projects/website-brand-runout"
V = "/Users/davenportmini/clawd/projects/design-team/clients/ai-foundry/final-v3-2026-11-12/system/motion"
v3css = open(f"{V}/hero-build.css").read().splitlines()
cur = open(f"{R}/src/app/hero-build.css").read().splitlines()

# site pin keyframes (review pass 1), keyed by member
site_pins = {re.match(r"@keyframes (af-runout-\w+-pin)", l).group(1): l for l in cur if re.match(r"@keyframes af-runout-\w+-pin", l)}
assert len(site_pins) == 4, site_pins.keys()

end = next(i for i, l in enumerate(v3css) if l.rstrip().endswith("*/"))
base = [l for l in v3css[end + 1:] if "stride" not in l and "runout" not in l]
runout = [l for l in v3css if "runout" in l]
v3pins = {re.match(r"@keyframes (af-runout-\w+-pin)", l).group(1): l for l in runout if re.match(r"@keyframes af-runout-\w+-pin", l)}
assert set(v3pins) == set(site_pins)

def tweak(l):
    if l.startswith(".af-lock{"):
        assert "stroke-width:2.6" in l
        return l.replace("stroke-width:2.6", "stroke-width:3.2")
    if l.startswith(".af-pin{"):
        assert l.endswith("}")
        return l[:-1] + ";transform-box:fill-box;transform-origin:center}"
    return l
base = [tweak(l) for l in base]
out_runout = []
for l in runout:
    m = re.match(r"@keyframes (af-runout-\w+-pin)", l)
    if m:
        # same seat timing in v2 and v3 (only the opacity frames); keep the site's snap-down weld
        old_pts = re.findall(r"(\d+(?:\.\d+)?)%", v3pins[m.group(1)])
        site_pts = re.findall(r"(\d+(?:\.\d+)?)%", site_pins[m.group(1)])
        assert set(old_pts) <= set(site_pts), (old_pts, site_pts)
        l = site_pins[m.group(1)]
    out_runout.append(l)

header = """/* The builder motion for the Runout hero (HeroBuild.tsx). Generated from the design
   team's system v3 (final-v3-2026-11-12, system/motion/hero-build.css), Runout rules only,
   by scripts/regen-hero-build.py. Draft for BYU Marriott approval.
   v3 is the BYU Marriott palette: no orange anywhere. Light ground: Navy mark, Slate accent
   member, Royal construction lines, level line and lock markers. Navy ground: everything
   White (lines at reduced opacity, markers at 0.8).
   Base styles are the FINAL mark: no JS, prefers-reduced-motion or print all show the
   static mark. .is-armed applies the animations paused on frame 0; .is-building plays
   them once (2.98 s), then the mark holds. Flat inks only: no metal, glow or blur.
   Site review pass 1 kept on top of the kit: the lock ring is 28 units (stroke 3.2) and the
   pin is a 10 unit diamond that snaps down from 2.2x to 1x and holds a beat. */"""
css = "\n".join([header] + base + out_runout) + "\n"
for bad in ("D14124", "FC4C02", "0072CE", "BDD6E6", "F2560F"):
    assert bad.lower() not in css.lower(), bad
open(f"{R}/src/app/hero-build.css", "w").write(css)

# TSX
v3tsx = open(f"{V}/HeroBuild.tsx").read()
marks = json.loads(re.search(r"const MARKS: Record<[^>]+> = (\{.*?\});\n", v3tsx).group(1))
runout = marks["runout"]
grid_minor_v3 = re.search(r'const GRID_MINOR: string = (".*?");', v3tsx).group(1)
grid_major_v3 = re.search(r'const GRID_MAJOR: string\[\] = (\[.*?\]);', v3tsx).group(1)
tsx = open(f"{R}/src/components/HeroBuild.tsx").read()
tsx = re.sub(r"const RUNOUT: MarkData = \{.*?\}\n", lambda m: "const RUNOUT: MarkData = " + json.dumps(runout, separators=(",", ":")) + "\n", tsx, count=1, flags=re.S)
tsx = re.sub(r'const GRID_MINOR: string = ".*?"', lambda m: "const GRID_MINOR: string = " + grid_minor_v3, tsx, count=1)
tsx = re.sub(r'const GRID_MAJOR: string\[\] = \[.*?\]', lambda m: "const GRID_MAJOR: string[] = " + grid_major_v3, tsx, count=1)
doc_old = tsx[: tsx.index("*/") + 2]
doc_new = """/**
 * HeroBuild: the Runout mark, built the way a builder builds it, in the landing hero.
 * Draft for BYU Marriott approval.
 *
 * Adapted from the design team's system v3 (final-v3-2026-11-12, system/motion/HeroBuild.tsx)
 * for this page. The geometry below is the untouched Runout master (round 10 runout-cut,
 * option 44: round 9 plus the 11-12 slit, which stops just inside the A's outer edge);
 * the timeline lives in src/app/hero-build.css (2.98 s):
 *   1. a blueprint grid draws in, then the set-out lines (the last one is the cut) and
 *      their nodes;
 *   2. one level line is shot along the horizon arc;
 *   3. the members are placed bottom up like beams off a crane: the column is lowered
 *      onto the baseline, the horizon beam slides in along the level, then the lower arm;
 *      the two blades are raised about their feet like an A-frame;
 *   4. each member seats with a small overshoot; a lock ring opens at its joint and a flat
 *      tack weld snaps down and holds a beat (no sparks, no glow);
 *   5. the scaffold comes down and the clean mark holds. Nothing moves after that.
 *
 * Changes from the kit component: Runout only, and no client script. The SVG ships with
 * is-armed and is-building already set, so the CSS plays the build once as the page first
 * paints (the hero is the top of the page), with no hydration step and no flash of the
 * finished mark. prefers-reduced-motion cancels every animation in hero-build.css, which
 * leaves the base styles: the static digital mark.
 * Colours come from --af-mark-ink, --af-mark-accent, --af-construction and --af-build-marker
 * in globals.css. System v3, the BYU Marriott palette, no orange: on light grounds a Navy mark
 * with a Slate horizon beam and Royal lines and markers; theme="dark" (the navy hero) is all
 * White, lines at reduced opacity and markers at 0.8.
 */"""
tsx = tsx.replace(doc_old, doc_new, 1)
assert '"durationMs":2980' in tsx and "M363.65 150L335.84 330" in tsx
open(f"{R}/src/components/HeroBuild.tsx", "w").write(tsx)
print("ok", len(css), len(tsx))
