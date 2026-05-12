import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

interface UpdateProfileData {
  id: string
  name: string
  title: string
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, name, title }: UpdateProfileData) => {
      const { error } = await supabase
        .from("profiles")
        .update({ name, title: title || null })
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-profile"] })
      queryClient.invalidateQueries({ queryKey: ["profiles"] })
    },
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      email,
      title,
    }: {
      name: string
      email: string
      title: string
    }) => {
      const { error } = await supabase.from("profiles").insert({
        name,
        email: email || null,
        title: title || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] })
    },
  })
}

export function useToggleProfileActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string
      is_active: boolean
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active })
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-profile"] })
      queryClient.invalidateQueries({ queryKey: ["profiles"] })
    },
  })
}
