#!/usr/bin/env node
/**
 * Verifies the contrast contract declared in src/app/globals.css.
 *
 * Reads the real token values out of the stylesheet, resolves them through the
 * semantic layer, and checks every declared pairing against WCAG 2.1 AA. If
 * someone changes a token value and it breaks a pairing we promised was legal,
 * this fails instead of shipping.
 *
 * Run: npm run check:contrast
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const cssPath = join(here, "..", "src", "app", "globals.css")

// WCAG 2.1 AA
const AA_NORMAL = 4.5
const AA_LARGE = 3

/**
 * Pairings the design system promises are safe, and the ones it forbids.
 * Keep this in step with the CONTRAST CONTRACT comment in globals.css.
 */
const CONTRACT = {
  normal: [
    ["text-primary", "surface-default"],
    ["text-meta", "surface-default"],
    ["text-primary", "surface-subtle"],
    ["text-accent", "surface-default"],
    ["text-on-inverse", "surface-inverse"],
    ["text-on-inverse-muted", "surface-inverse"],
    ["text-accent-on-inverse", "surface-inverse"],
    ["text-on-accent", "surface-accent"],
  ],
  large: [
    ["text-muted", "surface-default"],
    ["text-muted", "surface-subtle"],
    ["text-muted", "surface-inverse"],
    ["text-accent", "surface-subtle"],
  ],
  prohibited: [
    ["text-accent", "surface-inverse"],
    ["text-primary", "surface-inverse"],
  ],
}

function parseTokens(css) {
  const raw = {}
  // --name: value;  (ignore commented-out lines)
  for (const line of css.split("\n")) {
    if (line.trim().startsWith("*")) continue
    const m = line.match(/^\s*(--[a-z0-9-]+):\s*([^;]+);/i)
    if (m) raw[m[1]] = m[2].trim()
  }
  const resolve = (value, depth = 0) => {
    if (depth > 10) return value
    const v = value.replace(/\/\*[\s\S]*?\*\//g, "").trim()
    const ref = v.match(/^var\((--[a-z0-9-]+)\)$/i)
    if (ref) return resolve(raw[ref[1]] ?? "", depth + 1)
    return v
  }
  const out = {}
  for (const key of Object.keys(raw)) {
    const v = resolve(raw[key])
    // Hex, or rgba(...) — the soft-on-dark text tokens are white at an
    // alpha, which only has a contrast ratio once composited over the
    // paired surface. check() does that compositing.
    if (/^#[0-9a-f]{3,8}$/i.test(v) || /^rgba?\([^)]+\)$/i.test(v)) {
      out[key.replace(/^--/, "")] = v
    }
  }
  return out
}

function toRgb(hex) {
  let h = hex.replace("#", "")
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

/**
 * An alpha color has no contrast ratio of its own; composite it over the
 * surface it is paired with first. Returns a hex string either way.
 */
function flatten(color, bgHex) {
  const m = color.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i)
  if (!m) return color
  const a = m[4] === undefined ? 1 : Number(m[4])
  const bg = toRgb(bgHex)
  const ch = [Number(m[1]), Number(m[2]), Number(m[3])].map((c, i) =>
    Math.round(c * a + bg[i] * (1 - a))
  )
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("")
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

const tokens = parseTokens(readFileSync(cssPath, "utf8"))
const failures = []
const lines = []

function check(fgName, bgName, threshold, label, expectFail = false) {
  let fg = tokens[fgName]
  const bg = tokens[bgName]
  if (!fg || !bg) {
    failures.push(`missing token: ${!fg ? fgName : bgName}`)
    return
  }
  fg = flatten(fg, bg)
  const r = ratio(fg, bg)
  const passes = r >= threshold
  const ok = expectFail ? !passes : passes
  if (!ok) failures.push(`${fgName} on ${bgName}: ${r.toFixed(2)}:1 (${label})`)
  lines.push(
    `  ${ok ? "ok  " : "FAIL"}  ${fgName} on ${bgName}`.padEnd(58) +
      `${r.toFixed(2)}:1  ${label}`
  )
}

console.log("\ncontrast contract, checked against real token values\n")

for (const [fg, bg] of CONTRACT.normal) check(fg, bg, AA_NORMAL, "needs 4.5 (normal)")
for (const [fg, bg] of CONTRACT.large) check(fg, bg, AA_LARGE, "needs 3.0 (large only)")
for (const [fg, bg] of CONTRACT.prohibited)
  check(fg, bg, AA_LARGE, "must stay prohibited", true)

console.log(lines.join("\n"))

if (failures.length) {
  console.error(`\n${failures.length} contract violation(s):`)
  for (const f of failures) console.error(`  - ${f}`)
  console.error(
    "\nEither fix the token value or update both the CONTRACT in this script" +
      "\nand the CONTRAST CONTRACT comment in globals.css. Do not silence it.\n"
  )
  process.exit(1)
}

console.log(`\nall ${lines.length} pairings hold\n`)
