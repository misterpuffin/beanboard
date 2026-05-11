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
