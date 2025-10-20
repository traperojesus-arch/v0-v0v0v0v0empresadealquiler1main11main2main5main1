import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_SUPABASE_URL

  const supabaseAnonKey =
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY || process.env.SUPABASE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Variables de entorno de Supabase no configuradas")
    console.error("[v0] Intentando con:", {
      url: supabaseUrl || "NO ENCONTRADA",
      key: supabaseAnonKey ? "PRESENTE" : "NO ENCONTRADA",
    })
    throw new Error("Supabase environment variables not configured")
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}
