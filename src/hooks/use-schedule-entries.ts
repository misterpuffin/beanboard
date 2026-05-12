import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { ScheduleEntry } from "@/lib/types"

export function useScheduleEntries(weekStart: string, weekEnd: string) {
  return useQuery({
    queryKey: ["schedule-entries", weekStart, weekEnd],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule_entries")
        .select("*")
        .gte("date", weekStart)
        .lte("date", weekEnd)
      if (error) throw error
      return data as ScheduleEntry[]
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateScheduleEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (entry: {
      profile_id: string
      project_id?: string | null
      description?: string | null
      date: string
    }) => {
      const { data, error } = await supabase
        .from("schedule_entries")
        .insert({
          profile_id: entry.profile_id,
          project_id: entry.project_id ?? null,
          description: entry.description ?? null,
          date: entry.date,
        })
        .select("*")
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-entries"] })
    },
  })
}

export function useUpdateScheduleEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      description,
    }: {
      id: string
      description: string | null
    }) => {
      const { error } = await supabase
        .from("schedule_entries")
        .update({ description })
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-entries"] })
    },
  })
}

export function useMoveScheduleEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      profile_id,
      date,
    }: {
      id: string
      profile_id: string
      date: string
    }) => {
      const { error } = await supabase
        .from("schedule_entries")
        .update({ profile_id, date })
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-entries"] })
    },
  })
}

export function useDeleteScheduleEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("schedule_entries")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-entries"] })
    },
  })
}
