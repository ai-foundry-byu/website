/* Bring el up just under the sticky header, when any of it is out of view. */
function underHeader(el: HTMLElement) {
  const header = document.querySelector("header")
  const top = header && getComputedStyle(header).position === "sticky" ? header.getBoundingClientRect().height : 0
  const r = el.getBoundingClientRect()
  if (r.top < top + 8 || r.bottom > window.innerHeight) {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: Math.max(0, r.top + window.scrollY - top - 24), behavior: still ? "auto" : "smooth" })
  }
}

/**
 * After a form is sent the long form gives way to a short confirmation, so on a phone (and a short
 * laptop) the reader is left looking at the footer with the confirmation above the viewport, and the
 * send looks like it did nothing. This brings the confirmation up just under the sticky header,
 * when any of it is out of view, and moves focus to it so a screen reader announces it.
 */
export function showConfirmation(el: HTMLElement | null) {
  if (!el) return
  underHeader(el)
  el.focus({ preventScroll: true })
}

/**
 * The same for a send the form refused: the first field marked invalid (with its label and its
 * "Error:" line) is brought up under the header and focused, so a tap on submit with a field
 * missing never leaves the error out of view and the page looking as if nothing happened.
 */
export function showFirstError(form: HTMLFormElement | null) {
  const field = form?.querySelector<HTMLElement>('[aria-invalid="true"]')
  if (!field) return
  /* focus first and scroll on the next frame: mobile WebKit drops a scroll made just before the
     focus of a field the submit has re-rendered (measured on iPhone 15, /quote) */
  field.focus({ preventScroll: true })
  window.requestAnimationFrame(() => underHeader(field.closest("label") ?? field))
}
