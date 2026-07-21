import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

let cachedClient: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createClient() {
  // Return cached client if already initialized
  if (cachedClient) {
    return cachedClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      "Missing Supabase configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    )
  }

  cachedClient = createSupabaseBrowserClient(url, key)
  return cachedClient
}

// Named export for convenience
export function createBrowserClient() {
  return createClient()
}
