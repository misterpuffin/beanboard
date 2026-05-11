import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import type { Profile } from "@/lib/types"

export function useCurrentProfile() {
  const { user } = useAuth()
  const email = user?.email

  return useQuery({
    queryKey: ["current-profile", email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email!)
        .maybeSingle()
      if (error) throw error
      return data as Profile | null
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  })
}
