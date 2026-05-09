import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/lib/types"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
      if (error) throw error
      return data as Category[]
    },
    staleTime: 5 * 60 * 1000,
  })
}
