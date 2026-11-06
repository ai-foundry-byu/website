#!/usr/bin/env node
/**
 * Load the private page content (private/brief.json, private/board.json) into
 * the Supabase table af_private_pages, which /brief and /board read.
 *
 * Run once after applying supabase/migrations/004_private_pages.sql, and again
 * whenever a JSON file changes:
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/push-private-pages.mjs
 *
 * Check the files without touching the network:
 *
 *   node scripts/push-private-pages.mjs --dry-run
 *
 * private/ is git-ignored on purpose: this repo is public. The key is read from
 * the environment and is never printed.
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dryRun = process.argv.includes("--dry-run")

/** Keys each page needs. Keep in step with BriefData / BoardData. */
const REQUIRED = {
  brief: [
    "WINS",
    "LINKEDIN_GROWTH",
    "UPTICK",
    "MILESTONES",
    "FOUNDING_DONOR",
    "NEEDS",
    "ENDOWMENT",
    "NOTES",
  ],
  board: [
    "WINS",
    "LINKEDIN_GROWTH",
    "UPTICK",
    "MILESTONES",
    "PHASES",
    "SEMESTER",
    "ASKS",
    "EXECUTION",
    "CLOSE",
    "BOARD",
    "NOTES",
  ],
}

const rows = []
let failed = false
for (const [slug, keys] of Object.entries(REQUIRED)) {
  const file = path.join(root, "private", `${slug}.json`)
  let data
  try {
    data = JSON.parse(readFileSync(file, "utf8"))
  } catch (e) {
    console.error(`${slug}: cannot read ${file}: ${e.message}`)
    failed = true
    continue
  }
  const missing = keys.filter((k) => !(k in data) || data[k] == null)
  if (missing.length) {
    console.error(`${slug}: missing keys: ${missing.join(", ")}`)
    failed = true
    continue
  }
  console.log(`${slug}: valid`)
  rows.push({ slug, data })
}
if (failed) process.exit(1)
if (dryRun) process.exit(0)

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY to push.")
  process.exit(1)
}

const supabase = createClient(url, key)
for (const row of rows) {
  const { error } = await supabase
    .from("af_private_pages")
    .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "slug" })
  if (error) {
    console.error(`${row.slug}: push failed: ${error.message}`)
    process.exit(1)
  }
  console.log(`${row.slug}: pushed`)
}
