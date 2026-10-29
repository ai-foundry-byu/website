import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * POST /api/quote. Submits a quote request.
 *
 * Writes to the same Supabase project the previous site used, table
 * project_proposals (see supabase/migrations/002_project_proposals.sql and
 * 003_quote_fields.sql, which adds phone and website for this form).
 * The client is created lazily at request time so `next build` succeeds
 * on machines without the env vars.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Abuse limits (security audit 2026-10-28, F2). The route is public and writes
 * with the service key, so it caps size, drops bots that fill the hidden
 * `hp_check` field, refuses cross-site posts, and throttles each IP (only
 * submissions that pass validation count, so typo retries never lock anyone out). The throttle lives in
 * this server instance's memory, so it slows a single script but is not a hard
 * limit across instances; the hard limit is a Vercel WAF rate-limit rule.
 */
const MAX_BODY_BYTES = 16_000
const MAX_SHORT = 200
const MAX_DESCRIPTION = 5_000
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 10_000) hits.clear()
  return recent.length > RATE_MAX
}

function crossSite(req: NextRequest): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return false
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")
    return new URL(origin).host !== host
  } catch {
    return true
  }
}

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

export async function POST(req: NextRequest) {
  if (crossSite(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 })
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 })
  }
  const supabase = getSupabase()
  try {
    const raw = await req.text()
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 })
    }
    const body = JSON.parse(raw)

    // Honeypot: people never see `hp_check`; a bot that fills it gets a quiet
    // success and no row.
    if (str(body.hp_check)) {
      console.warn("quote honeypot hit")
      return NextResponse.json({ success: true })
    }

    const first = str(body.first_name)
    const last = str(body.last_name)
    const email = str(body.email)?.toLowerCase() ?? null
    const phone = str(body.phone)
    const company = str(body.company)
    const description = str(body.project_description)

    if (!first || !last || !email || !company || !description) {
      return NextResponse.json(
        {
          error:
            "First name, last name, email, company, and a project description are required.",
        },
        { status: 400 }
      )
    }

    if (!EMAIL.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
    }

    const website = str(body.website)
    const timeline = str(body.desired_timeline)
    const tooLong =
      [first, last, email, phone, company, website, timeline].some(
        (v) => v && v.length > MAX_SHORT
      ) || description.length > MAX_DESCRIPTION
    if (tooLong) {
      return NextResponse.json(
        {
          error: `Keep each field under ${MAX_SHORT} characters and the description under ${MAX_DESCRIPTION}.`,
        },
        { status: 400 }
      )
    }

    if (website && (/\s/.test(website) || !website.includes("."))) {
      return NextResponse.json({ error: "Enter a valid website address." }, { status: 400 })
    }

    // The table requires a title; the form deliberately does not ask for one
    // (eight fields, see FORMS.md). Derive it from the description so the
    // admin list stays scannable.
    const project_title =
      description.length > 60 ? description.slice(0, 57).trimEnd() + "..." : description

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const row = {
      contact_name: `${first} ${last}`,
      email,
      phone,
      organization: company,
      website,
      project_title,
      project_description: description,
      desired_timeline: timeline,
      status: "pending",
      source: "web",
    }

    const { data, error } = await supabase
      .from("project_proposals")
      .insert(row)
      .select("id")
      .single()

    if (error) {
      console.error("quote insert error:", error)
      return NextResponse.json(
        { error: "Could not submit right now. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error("quote submission error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null
}
