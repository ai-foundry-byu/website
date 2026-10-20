/**
 * The VC jobs board is retired (2026-10-20); its API is gone with it.
 *
 * 410 rather than 404 so clients and crawlers know the removal is deliberate.
 * See the note in next.config.ts for the rollback.
 */
function gone() {
  return Response.json(
    { error: "The AI Foundry jobs board has been retired." },
    { status: 410, headers: { "Cache-Control": "public, max-age=3600" } },
  )
}

export const GET = gone
export const HEAD = gone
export const POST = gone
export const PUT = gone
export const PATCH = gone
export const DELETE = gone
export const OPTIONS = gone
