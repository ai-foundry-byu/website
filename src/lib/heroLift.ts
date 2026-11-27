/**
 * The home hero's lift (Scott Murff, 2026-11-27): an outline of the bar's hexagon and of its diamond
 * cut lifts out of the O and lands on the Builder and the Consultant frames (HeroPair, hero.css).
 *
 * It runs from an inline script written into the page right after the hero (HERO_LIFT_SCRIPT), so it
 * starts as the browser parses the HTML, not when the JavaScript bundle hydrates; on a real connection
 * hydration came too late and the lift was skipped. HeroPair's effect calls the same function, which
 * covers arriving at / by client-side navigation (React does not run inline scripts it inserts).
 * Each frame is marked once handled, so the two never both run.
 *
 * `heroLift` must stay self-contained (no imports, no outside names): it is serialized with
 * toString() into the inline script. It times everything on the frame's own CSS animation clock, so
 * each outline lands exactly as the CSS shows the frame under it (1400 and 1700 ms, hero.css).
 */
/** ms on the hero's CSS clock when the hexagon leaves the bar's O; it lands 460 ms later. The diamond
 *  follows STAGGER ms behind it, so each shape is seen going to its own word (Scott, 2026-11-27). */
export const LIFT = 950
export const STAGGER = 300

export function heroLift(hex: string, cut: string, lift: number, stagger: number) {
  if (!window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) return
  const b = document.querySelector<SVGPolygonElement>(".af-prof-b .af-prof-frame")
  const c = document.querySelector<SVGPolygonElement>(".af-prof-c .af-prof-frame")
  const o = document.querySelector<SVGPathElement>(".af-lockup .af-hex")
  if (!b || !c || !o || !b.getAnimations || b.dataset.lifted) return
  const css = b.getAnimations()[0]
  if (!css) return
  b.dataset.lifted = "1"

  const fly = (d: string, viewBox: string, from: DOMRect, to: DOMRect, start: number, delay: number) => {
    const ns = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("viewBox", viewBox)
    svg.setAttribute("preserveAspectRatio", "none")
    svg.setAttribute("aria-hidden", "true")
    svg.setAttribute("class", "af-trav")
    const path = document.createElementNS(ns, "path")
    path.setAttribute("d", d)
    svg.appendChild(path)
    svg.style.left = to.left + window.scrollX + "px"
    svg.style.top = to.top + window.scrollY + "px"
    svg.style.width = to.width + "px"
    svg.style.height = to.height + "px"
    document.body.appendChild(svg)
    const dx = from.left + from.width / 2 - (to.left + to.width / 2)
    const dy = from.top + from.height / 2 - (to.top + to.height / 2)
    const from0 = "translate(" + dx + "px, " + dy + "px) scale(" + from.width / to.width + ", " + from.height / to.height + ")"
    const timing: KeyframeAnimationOptions = { duration: 460, delay, easing: "cubic-bezier(.65,0,.25,1)", fill: "both" }
    const move = svg.animate(
      [
        { opacity: 0, transform: from0 },
        { opacity: 1, transform: from0, offset: 0.08 },
        { opacity: 1, transform: "none", offset: 0.98 },
        { opacity: 0, transform: "none" },
      ],
      timing,
    )
    const tint = svg.animate([{ color: "#002e5d" }, { color: "#002e5d", offset: 0.16 }, { color: "#ffffff", offset: 0.3 }, { color: "#ffffff" }], timing)
    move.startTime = start
    tint.startTime = start
    move.finished.then(() => svg.remove(), () => svg.remove())
  }

  // the CSS animation has a start time once it is ready (the next frame after it is created)
  css.ready.then(() => {
    const clock = css.startTime
    const now = document.timeline.currentTime
    if (typeof clock !== "number" || typeof now !== "number" || now - clock > lift - 50) return
    const hx = o.getBoundingClientRect()
    // the cut sits centred in the hexagon: 70 of its 115.473 units wide, 70 of its 100 tall
    const cw = (hx.width * 70) / 115.473
    const ch = hx.height * 0.7
    const cr = new DOMRect(hx.left + (hx.width - cw) / 2, hx.top + (hx.height - ch) / 2, cw, ch)
    fly(hex, "333.654 0 115.473 100", hx, b.getBoundingClientRect(), clock, lift)
    fly(cut, "356.39 15.007 70 70", cr, c.getBoundingClientRect(), clock, lift + stagger)
  }, () => {})
}
