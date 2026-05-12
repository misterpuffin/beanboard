declare global {
  interface Window {
    __CONFIG__?: {
      SUPABASE_URL?: string
      SUPABASE_ANON_KEY?: string
      AUTH_PROVIDER?: string
    }
  }
}

// Runtime config (from Docker) takes precedence over build-time Vite env vars (for dev).
const cfg = window.__CONFIG__ ?? {}

export const config = {
  supabaseUrl: cfg.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: cfg.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  authProvider: cfg.AUTH_PROVIDER || import.meta.env.VITE_AUTH_PROVIDER || "email",
}
