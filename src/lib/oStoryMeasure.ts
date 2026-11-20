/**
 * The /approach O story's script (OStoryExplainer), as source: it runs inline before first paint on
 * a full page load, and OStoryMeasure runs it again after a client navigation. Three jobs:
 *   1. html.oa-js arms the motion (no script, or reduced motion: the CSS end state stays).
 *   2. Measure where the O sits in the settled wordmark and where each profile frame sits, and hand
 *      the story its start transforms (FLIP). A phone screen shorter than the finished story gets
 *      html.oa-tall (the stage pins taller than the screen); one far too short (a phone on its side)
 *      gets html.oa-no-pin: no pin, the end state in flow.
 *   3. Drive the story: a passive, rAF-throttled scroll listener maps the section's scroll progress
 *      to --p (0..1) and seeks every paused CSS animation in it to p x 1000 ms. No CSS scroll
 *      timeline, so WebKit and Chromium run it the same.
 */
export const O_STORY_MEASURE_JS = `(function () {
  var VBW = 520, CX = 260, CY = 160, R = 100
  var HEX_C = [391.39, 50], HEX_R = 57.737, DIA_R = 35, WM_W = 1117.889
  function px(v) { return v.toFixed(2) + "px" }
  var root = document.documentElement, raf = 0
  function fit(stage, slot) {
    var cap = stage.querySelector(".oa-caption")
    var bar = document.querySelector("header.sticky")
    root.classList.remove("oa-no-pin", "oa-tall")
    var cs = getComputedStyle(stage)
    var need = cap.offsetTop + cap.offsetHeight - slot.offsetTop + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    var vis = window.innerHeight - (bar ? bar.offsetHeight : 0)
    root.style.setProperty("--oa-stage-h", px(need))
    root.style.setProperty("--oa-vis", px(vis))
    if (need > vis * 1.6) root.classList.add("oa-no-pin")
    else if (need > vis) root.classList.add("oa-tall")
    return Math.min(vis, need)
  }
  function sync() {
    raf = 0
    var st = document.querySelector(".oa-story"), stage = document.querySelector(".oa-stage")
    if (!st || !stage || !root.classList.contains("oa-js")) return
    var r = st.getBoundingClientRect(), top = parseFloat(getComputedStyle(stage).top) || 0
    var range = r.height - stage.offsetHeight
    var p = range > 0 ? Math.min(1, Math.max(0, (top - r.top) / range)) : 1
    st.style.setProperty("--p", p.toFixed(4))
    var t = p * 1000
    document.getAnimations().forEach(function (a) {
      var el = a.effect && a.effect.target
      if (el && st.contains(el) && a.currentTime !== t) a.currentTime = t
    })
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(sync) }
  function measure() {
    var stage = document.querySelector(".oa-stage"), slot = document.querySelector(".oa-wm-slot")
    var wm = document.querySelector(".oa-wm")
    if (!stage || !slot || !wm) return
    if (document.getAnimations && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("oa-js")
    var sh = fit(stage, slot)
    var S = stage.getBoundingClientRect(), W = slot.getBoundingClientRect()
    var ws = Math.min(S.width * 0.84, 1040) / W.width
    wm.style.setProperty("--wx", px(S.left + S.width / 2 - (W.left + W.width / 2)))
    wm.style.setProperty("--wy", px(S.top + sh * 0.47 - (W.top + W.height / 2)))
    wm.style.setProperty("--ws", ws.toFixed(4))
    var u = W.width / WM_W
    var ox = W.left + HEX_C[0] * u, oy = W.top + HEX_C[1] * u
    var popY = W.bottom + HEX_R * u * 1.6 + 16
    var dropY = W.bottom + HEX_R * u * 0.866 + 8
    var HALF = 1.2
    ;[[".oa-dg-builder", HEX_R * u, HEX_R * u - HALF / 0.866], [".oa-dg-consultant", DIA_R * u, DIA_R * u + HALF * 1.4142]].forEach(function (p) {
      var svg = document.querySelector(p[0] + ".oa-dg-story")
      if (!svg) return
      var g = svg.querySelector(".oa-dg-travel")
      var D = svg.getBoundingClientRect(), k = D.width / VBW
      var sa = p[1] / (R * k), s0 = p[2] / (R * k), sp = sa * 1.6
      function set(key, s, x, y) {
        g.style.setProperty("--s" + key, s.toFixed(5))
        g.style.setProperty("--t" + key + "x", px((x - D.left) / k - s * CX))
        g.style.setProperty("--t" + key + "y", px((y - D.top) / k - s * CY))
      }
      set("0", s0, ox, oy)
      set("a", sa, ox, dropY)
      set("p", sp, ox, popY)
    })
    sync()
  }
  window.__oStoryMeasure = measure
  measure()
  if (!window.__oStoryWired) {
    window.__oStoryWired = true
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("load", measure)
  }
})()`
