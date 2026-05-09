import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Client } from "@/lib/types"

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
      if (error) throw error
      return data as Client[]
    },
    staleTime: 5 * 60 * 1000,
  })
}
