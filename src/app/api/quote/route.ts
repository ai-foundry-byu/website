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

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  try {
    const body = await req.json()

    const first = str(body.first_name)
    const last = str(body.last_name)
    const email = str(body.email)?.toLowerCase() ?? null
    const phone = str(body.phone)
    const company = str(body.company)
    const description = str(body.project_description)

    if (!first || !last || !email || !phone || !company || !description) {
      return NextResponse.json(
        {
          error:
            "First name, last name, email, phone, company, and a project description are required.",
        },
        { status: 400 }
      )
    }

    if (!EMAIL.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
    }

    const website = str(body.website)
    if (website && (/\s/.test(website) || !website.includes("."))) {
      return NextResponse.json({ error: "Enter a valid website address." }, { status: 400 })
    }

    // The table requires a title; the form deliberately does not ask for one
    // (eight fields, see FORMS.md). Derive it from the description so the
    // admin list stays scannable.
    const project_title =
      description.length > 60 ? description.slice(0, 57).trimEnd() + "..." : description

    const row = {
      contact_name: `${first} ${last}`,
      email,
      phone,
      organization: company,
      website,
      project_title,
      project_description: description,
      desired_timeline: str(body.desired_timeline),
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
