import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { ProjectWithRelations } from "@/lib/types"

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:clients(*),
          category:categories(*),
          status:statuses(*),
          team:project_team(*, profile:profiles(*)),
          deadlines(*)
        `)
      if (error) throw error
      return data as ProjectWithRelations[]
    },
    staleTime: 2 * 60 * 1000,
  })
}
