import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Status } from "@/lib/types"

export function useStatuses() {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statuses")
        .select("*")
        .order("position")
      if (error) throw error
      return data as Status[]
    },
    staleTime: 5 * 60 * 1000,
  })
}
