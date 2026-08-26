import { createClient } from "@supabase/supabase-js"

/**
 * The live numbers behind /roadmap, read straight from Supabase on the server.
 *
 * This is deliberately NOT an API route. The page that needs these is a server
 * component on the same deploy, so it can query directly: no public endpoint to
 * secure, no CORS, no service key anywhere near a browser, and no fetch that
 * can fail after the page has already painted.
 *
 * Every field degrades to null on its own. A table that has not been migrated,
 * or a Supabase blip, must cost us that one number and nothing else. The page
 * renders a dash in its place. The alternative, a page that 500s because one
 * count failed, is a worse answer to "where does the program stand".
 */

export type RoadmapStats = {
  network: number | null
  /** Genuine applicants. Seeded test rows are excluded; BYU addresses are not. */
  applications: number | null
  /** Genuine applicants nobody has screened yet. Null when the read failed. */
  applicationsUntriaged: number | null
  /** Genuine inbound only. Test and self-submitted rows are excluded. */
  proposals: number | null
  /** Rows excluded as test data, so the filter itself stays auditable. */
  proposalsExcluded: number | null
  /** Proposals that have become signed work. The contract target measures this. */
  contractsSigned: number | null
  advisoryBoard: number | null
  foundingPartners: number | null
  linkedinFollowers: number | null
  claudeArchCerts: number | null
  readAt: Date
}

/** Signed work. Anything short of these is still a conversation. */
const SIGNED = new Set(["signed", "contracted", "won", "active"])

/**
 * Rows that are ours, not a client's.
 *
 * The proposals table is fed by a public form that was smoke-tested through
 * production, so it holds seeded rows alongside real inbound. Counting the
 * raw table published five proposals when one was genuine: two were
 * test-smoke@example.com, one was a smoke-test agent, and one was JD
 * submitting to his own site while checking the form worked.
 *
 * This is the same failure as counting the advisory pipeline as the advisory
 * board, and it fails the same way: quietly, and in our favour. The filter is
 * therefore deliberately blunt and is applied before any number is published.
 */
/**
 * Seeded rows, by address.
 *
 * The `[-._+]` branch was added on 2026-08-26: the original pattern anchored
 * `test` to the start of the local part or straight after the `@`, so
 * `resume-test-2026-06-30@byu.edu` — a row this project seeded itself while
 * checking the resume upload — was counted as a genuine applicant. One row is
 * not a scandal, but it is the same class of mistake the filter exists to
 * prevent, and a seeded row that looks like a student is worse than one that
 * looks like a robot. The separator is required on both sides so a real
 * surname (Testa, Smoker) cannot trip it.
 */
const TEST_EMAIL = /(^|@|[-._+])(test|smoke)([-._+]|@|$)|smoketest|@example\.(com|org)|@clawd\.ai/i
const OWN_EMAIL = /jddavenport|@byu\.edu$|aifoundry/i

function isTestRow(email: unknown): boolean {
  const e = String(email ?? "").trim().toLowerCase()
  if (!e) return true // no contact address is not a lead
  return TEST_EMAIL.test(e) || OWN_EMAIL.test(e)
}

/** Every field null. What we render when there is no database to talk to. */
function emptyStats(): RoadmapStats {
  return {
    network: null,
    applications: null,
    applicationsUntriaged: null,
    proposals: null,
    proposalsExcluded: null,
    contractsSigned: null,
    advisoryBoard: null,
    foundingPartners: null,
    linkedinFollowers: null,
    claudeArchCerts: null,
    readAt: new Date(),
  }
}

export async function getRoadmapStats(): Promise<RoadmapStats> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY

  // No credentials is the normal case on a contributor's laptop and during
  // `next build`. Render the page with dashes rather than failing the build.
  if (!url || !key) return emptyStats()

  const supabase = createClient(url, key)

  /** Exact row count, head-only so no rows cross the wire. */
  async function count(table: string): Promise<number | null> {
    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true })
    if (error) {
      console.error(`roadmap stats: count(${table}):`, error.message)
      return null
    }
    return count ?? 0
  }

  /**
   * People per tier, COUNTING ONLY THOSE WHO HAVE ACTUALLY SAID YES.
   *
   * The tier column is a pipeline stage, not a commitment: `advisory_t1`
   * holds prospects and warm leads alongside real board members. Counting
   * the tier alone published eight advisory board members when three had
   * confirmed, and it counted a person whose acceptance was later retracted
   * as a fabricated meeting-note extraction.
   *
   * So the status column is the gate, and it is an allowlist rather than a
   * denylist on purpose. A status nobody has thought about yet must fail
   * closed and go uncounted. The failure mode we are protecting against is
   * overclaiming a credential in public, and undercounting our own board is
   * a far cheaper mistake than naming someone who never agreed.
   *
   * A verbal yes does not count either. Aaron Arnoldsen has been a verbal
   * commitment since 2026-06-15 with the written invite still unsent; until
   * that is signed he is a commitment we owe, not a credential we hold.
   */
  const COMMITTED = new Set(["confirmed", "signed", "active"])

  async function tiers(): Promise<{ advisory: number; founding: number } | null> {
    const { data, error } = await supabase.from("af_people").select("tier,status")
    if (error) {
      console.error("roadmap stats: af_people:", error.message)
      return null
    }
    const committed = data.filter((r) => COMMITTED.has(String(r.status)))
    const inTier = (...t: string[]) =>
      committed.filter((r) => t.includes(r.tier)).length
    return {
      advisory: inTier("advisory_t1", "advisory_t2"),
      founding: inTier("founding_lead"),
    }
  }

  /**
   * The weekly metrics table, newest first. A metric is only captured on the
   * weeks it changed, so the answer for "how many followers" is the most
   * recent non-null value, not the value for this week specifically.
   */
  async function weekly(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("af_metrics_weekly")
      .select("metric_name,value")
      .order("week_of", { ascending: false })
      .limit(50)
    if (error) {
      console.error("roadmap stats: af_metrics_weekly:", error.message)
      return {}
    }
    const latest: Record<string, number> = {}
    for (const row of data) {
      if (row.value != null && !(row.metric_name in latest)) {
        latest[row.metric_name] = row.value
      }
    }
    return latest
  }

  /**
   * Cohort applications, split into genuine and not-yet-screened.
   *
   * This deliberately does NOT use `isTestRow`. That filter also drops
   * `@byu.edu`, which is correct for a *client* proposal — a BYU address on an
   * inbound project request is us talking to ourselves — and exactly wrong
   * here, where a BYU student is the entire target audience. Reusing it would
   * have silently deleted most real applicants.
   *
   * So the applications filter is the seeded-test pattern only. The raw table
   * count was published as fifty when six of those rows were smoke tests, the
   * same overcounting failure the proposals filter exists to prevent.
   *
   * `untriaged` is the number that actually matters. An application that has
   * arrived and never been looked at is not pipeline, it is a person waiting.
   */
  async function applications() {
    const { data, error } = await supabase
      .from("foundry_applications")
      .select("email,status")
    if (error) {
      console.error("roadmap stats: foundry_applications:", error.message)
      return null
    }
    const real = data.filter((r) => !TEST_EMAIL.test(String(r.email ?? "").trim().toLowerCase()))
    return {
      real: real.length,
      untriaged: real.filter((r) => String(r.status).toLowerCase() === "new").length,
    }
  }

  /**
   * Proposals, split into genuine inbound, excluded test rows, and signed work.
   * Read as rows rather than a head count because the split needs the columns.
   */
  async function proposals() {
    const { data, error } = await supabase
      .from("project_proposals")
      .select("email,status")
    if (error) {
      console.error("roadmap stats: project_proposals:", error.message)
      return null
    }
    const real = data.filter((r) => !isTestRow(r.email))
    return {
      real: real.length,
      excluded: data.length - real.length,
      signed: real.filter((r) => SIGNED.has(String(r.status).toLowerCase())).length,
    }
  }

  const [network, apps, deals, people, metrics] = await Promise.all([
    count("network_members"),
    applications(),
    proposals(),
    tiers(),
    weekly(),
  ])

  return {
    network,
    applications: apps ? apps.real : null,
    applicationsUntriaged: apps ? apps.untriaged : null,
    proposals: deals ? deals.real : null,
    proposalsExcluded: deals ? deals.excluded : null,
    contractsSigned: deals ? deals.signed : null,
    advisoryBoard: people ? people.advisory : null,
    foundingPartners: people ? people.founding : null,
    linkedinFollowers: metrics.linkedin_followers ?? null,
    // Absent means nobody has certified yet, which is a real zero rather than
    // a missing reading. The other fields cannot make that distinction, but
    // this one can, because the goal is known.
    claudeArchCerts: metrics.claude_arch_certs ?? 0,
    readAt: new Date(),
  }
}
