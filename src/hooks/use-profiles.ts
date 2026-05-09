import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/lib/types"

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
      if (error) throw error
      return data as Profile[]
    },
    staleTime: 5 * 60 * 1000,
  })
}
