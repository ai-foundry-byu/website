/**
 * The /approach O story's measurement (OStoryExplainer), as script source: it runs inline before
 * first paint on a full page load, and OStoryMeasure runs it again after a client navigation.
 * It finds where the O sits in the settled wordmark and where each profile frame sits, and hands
 * the scroll story its start transforms (FLIP). Only positions are computed; the motion itself is
 * CSS on a view timeline (o-story-approach.css), so reduced motion and older browsers show the end
 * state. A screen too short for the finished story gets html.oa-no-pin: no pin, the end state in flow.
 */
export const O_STORY_MEASURE_JS = `(function () {
  var VBW = 520, CX = 260, CY = 160, R = 100
  var HEX_C = [312.067, 49.99], HEX_R = 57.724, DIA_R = 34.993, WM_W = 869.023
  function px(v) { return v.toFixed(2) + "px" }
  function fit(stage, slot) {
    var root = document.documentElement, cap = stage.querySelector(".oa-caption")
    var bar = document.querySelector(".af-header")
    root.classList.remove("oa-no-pin")
    var cs = getComputedStyle(stage)
    var need = cap.offsetTop + cap.offsetHeight - slot.offsetTop + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    if (need > window.innerHeight - (bar ? bar.offsetHeight : 0)) root.classList.add("oa-no-pin")
  }
  function measure() {
    var stage = document.querySelector(".oa-stage"), slot = document.querySelector(".oa-wm-slot")
    var wm = document.querySelector(".oa-wm")
    if (!stage || !slot || !wm) return
    fit(stage, slot)
    var S = stage.getBoundingClientRect(), W = slot.getBoundingClientRect()
    var ws = Math.min(S.width * 0.84, 1040) / W.width
    wm.style.setProperty("--wx", px(S.left + S.width / 2 - (W.left + W.width / 2)))
    wm.style.setProperty("--wy", px(S.top + S.height * 0.47 - (W.top + W.height / 2)))
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
  }
  window.__oStoryMeasure = measure
  measure()
  if (!window.__oStoryWired) {
    window.__oStoryWired = true
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
    window.addEventListener("resize", measure)
    window.addEventListener("load", measure)
  }
})()`
