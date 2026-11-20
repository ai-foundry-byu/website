import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * POST /api/competition. One application to the MBA Full-Stack Product
 * Builder Case Competition (January 27 to 29, 2027).
 *
 * Writes to the Strategy app's Supabase project (the merged app that now
 * serves aifoundry.byu.edu/app), table competition_applications
 * (strategy repo supabase/migrations/080_competition_applications.sql).
 * That project is APP_SUPABASE_URL / APP_SUPABASE_SERVICE_KEY, kept apart
 * from SUPABASE_URL, which is the older project the quote form uses.
 *
 * After the insert it emails Scott through Resend. A failed email never
 * fails the application: the row is the record.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NOTIFY = "scott.murff@byu.edu"

export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const row = {
      team_name: str(b.team_name),
      student1_name: str(b.student1_name),
      student1_email: str(b.student1_email)?.toLowerCase() ?? null,
      student1_school: str(b.student1_school),
      student1_grad_year: str(b.student1_grad_year),
      student1_linkedin: str(b.student1_linkedin),
      student2_name: str(b.student2_name),
      student2_email: str(b.student2_email)?.toLowerCase() ?? null,
      student2_school: str(b.student2_school),
      student2_grad_year: str(b.student2_grad_year),
      student2_linkedin: str(b.student2_linkedin),
      why_team: str(b.why_team),
      built_link: str(b.built_link),
      advisor_interest: str(b.advisor_interest),
      heard_from: str(b.heard_from),
      agreed_terms: b.agreed_terms === true,
    }
    const required: (keyof typeof row)[] = [
      "team_name", "student1_name", "student1_email", "student1_school",
      "student2_name", "student2_email", "student2_school", "why_team",
    ]
    if (required.some((k) => !row[k])) {
      return NextResponse.json({ error: "Please fill in every required field." }, { status: 400 })
    }
    if (!EMAIL.test(row.student1_email!) || !EMAIL.test(row.student2_email!)) {
      return NextResponse.json({ error: "Enter a valid email address for both students." }, { status: 400 })
    }
    if (row.student1_email === row.student2_email) {
      return NextResponse.json({ error: "The two students need different email addresses." }, { status: 400 })
    }
    if (!row.agreed_terms) {
      return NextResponse.json({ error: "Please confirm the commitments at the bottom of the form." }, { status: 400 })
    }

    const supabase = createClient(process.env.APP_SUPABASE_URL!, process.env.APP_SUPABASE_SERVICE_KEY!)
    const { data, error } = await supabase.from("competition_applications").insert(row).select("id").single()
    if (error) {
      console.error("competition insert error:", error)
      return NextResponse.json({ error: "Could not submit right now. Please try again." }, { status: 500 })
    }

    await notify(row).catch((e) => console.error("competition notify error:", e))
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error("competition submission error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}

async function notify(r: Record<string, string | boolean | null>) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  const line = (label: string, v: unknown) => (v ? `${label}: ${v}\n` : "")
  const text =
    `New application: ${r.team_name}\n\n` +
    line("Student 1", `${r.student1_name}, ${r.student1_email}, ${r.student1_school}`) +
    line("  Graduates", r.student1_grad_year) + line("  LinkedIn", r.student1_linkedin) +
    line("Student 2", `${r.student2_name}, ${r.student2_email}, ${r.student2_school}`) +
    line("  Graduates", r.student2_grad_year) + line("  LinkedIn", r.student2_linkedin) +
    `\nWhy this team:\n${r.why_team}\n\n` +
    line("Something they built", r.built_link) +
    line("Advisor interest", r.advisor_interest) +
    line("Heard about it from", r.heard_from)
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "AI Foundry <noreply@strategy.byu.edu>",
      to: [NOTIFY],
      subject: `Competition application: ${r.team_name}`,
      text,
    }),
  })
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 4000) : null
}
