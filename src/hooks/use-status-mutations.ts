import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export function useCreateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      label,
      color,
      position,
    }: {
      label: string
      color: string
      position: number
    }) => {
      const { error } = await supabase
        .from("statuses")
        .insert({ label, color, position })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] })
    },
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      label,
      color,
    }: {
      id: string
      label: string
      color: string
    }) => {
      const { error } = await supabase
        .from("statuses")
        .update({ label, color })
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] })
    },
  })
}

export function useDeleteStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from("statuses").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] })
    },
  })
}

export function useReorderStatuses() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      idA,
      positionA,
      idB,
      positionB,
    }: {
      idA: string
      positionA: number
      idB: string
      positionB: number
    }) => {
      const { error: errA } = await supabase
        .from("statuses")
        .update({ position: positionB })
        .eq("id", idA)
      if (errA) throw errA

      const { error: errB } = await supabase
        .from("statuses")
        .update({ position: positionA })
        .eq("id", idB)
      if (errB) throw errB
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] })
    },
  })
}
