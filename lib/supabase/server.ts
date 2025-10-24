import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// 🔹 Activa Supabase si está habilitado en variables de entorno
export function shouldUseSupabase(): boolean {
  return process.env.NEXT_PUBLIC_USE_SUPABASE_TABLES === "true"
}

// 🔹 Identifica errores de tablas inexistentes
export function isTableNotFoundError(error: any): boolean {
  return error?.code === "42P01" || error?.message?.includes("does not exist")
}

export function markTablesAsNonExistent(): void {
  // No-op, reservado para compatibilidad futura
}

// 🔹 Cliente del lado del servidor
export function createServerClient() {
  if (!shouldUseSupabase()) {
    console.warn("[v0] Supabase deshabilitado por configuración")
    return null
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Variables de entorno de Supabase no configuradas")
    return null
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        const cookieStore = await cookies()
        return cookieStore.getAll()
      },
      async setAll(cookiesToSet) {
        try {
          const cookieStore = await cookies()
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignorar en Server Components
        }
      },
    },
  })
}

// 🔹 Cliente del lado del cliente (uso en acciones)
export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables not configured")
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignorar en Server Components
        }
      },
    },
  })
}
