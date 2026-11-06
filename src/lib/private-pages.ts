import { createClient } from "@supabase/supabase-js"

/**
 * One private page's content, read from af_private_pages on the server.
 *
 * /brief and /board used to carry their content in this public repository.
 * It now lives in a table with RLS on and no policies, so only the service key
 * can read it. That key stays on the server: this module must never be
 * imported from a client component.
 *
 * Returns null when Supabase is not configured (a contributor's laptop, or
 * `next build`), when the slug has no row, or on any error. The caller turns
 * null into a 404, so a missing row hides the page rather than crashing it.
 */
export async function getPrivatePage<T>(slug: string): Promise<T | null> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from("af_private_pages")
    .select("data")
    .eq("slug", slug)
    .maybeSingle()
  if (error) {
    console.error(`private pages: ${slug}:`, error.message)
    return null
  }
  return (data?.data as T | undefined) ?? null
}
