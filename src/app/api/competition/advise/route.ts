import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * POST /api/competition/advise. An advisor volunteering for the MBA Full-Stack
 * Product Builder Case Competition. Writes competition_advisors in the Strategy
 * app's Supabase (strategy repo migration 081), then emails Scott.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const row = {
      name: str(b.name),
      email: str(b.email)?.toLowerCase() ?? null,
      company: str(b.company),
      title: str(b.title),
      linkedin: str(b.linkedin),
      expertise: str(b.expertise),
      heard_from: str(b.heard_from),
      agreed_terms: b.agreed_terms === true,
    }
    if (!row.name || !row.email || !row.company || !row.title) {
      return NextResponse.json({ error: "Please fill in every required field." }, { status: 400 })
    }
    if (!EMAIL.test(row.email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
    if (!row.agreed_terms) {
      return NextResponse.json({ error: "Please confirm the commitments at the bottom of the form." }, { status: 400 })
    }
    const supabase = createClient(process.env.APP_SUPABASE_URL!, process.env.APP_SUPABASE_SERVICE_KEY!)
    const { data, error } = await supabase.from("competition_advisors").insert(row).select("id").single()
    if (error) {
      console.error("advisor insert error:", error)
      return NextResponse.json({ error: "Could not submit right now. Please try again." }, { status: 500 })
    }
    const key = process.env.RESEND_API_KEY
    if (key) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "AI Foundry <noreply@strategy.byu.edu>",
          to: ["scott.murff@byu.edu"],
          subject: `Competition advisor: ${row.name}, ${row.company}`,
          text:
            `${row.name}, ${row.title}, ${row.company}\n${row.email}\n` +
            (row.linkedin ? `${row.linkedin}\n` : "") +
            (row.expertise ? `\nCan help with:\n${row.expertise}\n` : "") +
            (row.heard_from ? `\nHeard about it from: ${row.heard_from}\n` : ""),
        }),
      }).catch((e) => console.error("advisor notify error:", e))
    }
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error("advisor submission error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 4000) : null
}
