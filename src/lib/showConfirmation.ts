/**
 * After a form is sent the long form gives way to a short confirmation, so on a phone (and a short
 * laptop) the reader is left looking at the footer with the confirmation above the viewport, and the
 * send looks like it did nothing. This brings the confirmation up just under the sticky header,
 * when any of it is out of view, and moves focus to it so a screen reader announces it.
 */
export function showConfirmation(el: HTMLElement | null) {
  if (!el) return
  const header = document.querySelector("header")
  const top = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().height : 0
  const r = el.getBoundingClientRect()
  if (r.top < top + 8 || r.bottom > window.innerHeight) {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: Math.max(0, r.top + window.scrollY - top - 24), behavior: still ? "auto" : "smooth" })
  }
  el.focus({ preventScroll: true })
}
