import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { TeamRole } from "@/lib/types"

export interface ProjectFormData {
  client_id: string
  category_id: string
  status_id: string
  description: string
  notes: string
  team: { profile_id: string; role: TeamRole }[]
  deadlines: { id?: string; label: string; due_date: string }[]
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          client_id: data.client_id,
          category_id: data.category_id,
          status_id: data.status_id,
          description: data.description || null,
          notes: data.notes || null,
        })
        .select("id")
        .single()

      if (projectError) throw projectError
      const projectId = project.id

      if (data.team.length > 0) {
        const { error: teamError } = await supabase
          .from("project_team")
          .insert(data.team.map((t) => ({ project_id: projectId, ...t })))
        if (teamError) throw teamError
      }

      if (data.deadlines.length > 0) {
        const { error: deadlineError } = await supabase
          .from("deadlines")
          .insert(
            data.deadlines.map((d) => ({
              project_id: projectId,
              label: d.label,
              due_date: d.due_date,
            }))
          )
        if (deadlineError) throw deadlineError
      }

      return projectId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

interface UpdateProjectParams {
  projectId: string
  data: ProjectFormData
  oldTeam: { profile_id: string; role: TeamRole }[]
  oldDeadlines: { id: string; label: string; due_date: string }[]
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, data, oldTeam, oldDeadlines }: UpdateProjectParams) => {
      // Update the project row
      const { error: projectError } = await supabase
        .from("projects")
        .update({
          client_id: data.client_id,
          category_id: data.category_id,
          status_id: data.status_id,
          description: data.description || null,
          notes: data.notes || null,
        })
        .eq("id", projectId)

      if (projectError) throw projectError

      // Diff team members (keyed by profile_id)
      await diffTeam(projectId, oldTeam, data.team)

      // Diff deadlines (keyed by id)
      await diffDeadlines(projectId, oldDeadlines, data.deadlines)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

// --- Diff helpers ---

async function diffTeam(
  projectId: string,
  oldTeam: { profile_id: string; role: TeamRole }[],
  newTeam: { profile_id: string; role: TeamRole }[]
) {
  const oldMap = new Map(oldTeam.map((t) => [t.profile_id, t]))
  const newMap = new Map(newTeam.map((t) => [t.profile_id, t]))

  // Delete removed members
  const toDelete = oldTeam.filter((t) => !newMap.has(t.profile_id))
  for (const t of toDelete) {
    const { error } = await supabase
      .from("project_team")
      .delete()
      .eq("project_id", projectId)
      .eq("profile_id", t.profile_id)
    if (error) throw error
  }

  // Insert new members
  const toInsert = newTeam.filter((t) => !oldMap.has(t.profile_id))
  if (toInsert.length > 0) {
    const { error } = await supabase
      .from("project_team")
      .insert(toInsert.map((t) => ({ project_id: projectId, ...t })))
    if (error) throw error
  }

  // Update changed roles
  const toUpdate = newTeam.filter((t) => {
    const old = oldMap.get(t.profile_id)
    return old && old.role !== t.role
  })
  for (const t of toUpdate) {
    const { error } = await supabase
      .from("project_team")
      .update({ role: t.role })
      .eq("project_id", projectId)
      .eq("profile_id", t.profile_id)
    if (error) throw error
  }
}

async function diffDeadlines(
  projectId: string,
  oldDeadlines: { id: string; label: string; due_date: string }[],
  newDeadlines: { id?: string; label: string; due_date: string }[]
) {
  const newIds = new Set(newDeadlines.filter((d) => d.id).map((d) => d.id))

  // Delete removed deadlines
  const toDelete = oldDeadlines.filter((d) => !newIds.has(d.id))
  for (const d of toDelete) {
    const { error } = await supabase
      .from("deadlines")
      .delete()
      .eq("id", d.id)
    if (error) throw error
  }

  // Insert new deadlines (no id)
  const toInsert = newDeadlines.filter((d) => !d.id)
  if (toInsert.length > 0) {
    const { error } = await supabase
      .from("deadlines")
      .insert(
        toInsert.map((d) => ({
          project_id: projectId,
          label: d.label,
          due_date: d.due_date,
        }))
      )
    if (error) throw error
  }

  // Update changed deadlines
  const oldMap = new Map(oldDeadlines.map((d) => [d.id, d]))
  const toUpdate = newDeadlines.filter((d) => {
    if (!d.id) return false
    const old = oldMap.get(d.id)
    return old && (old.label !== d.label || old.due_date !== d.due_date)
  })
  for (const d of toUpdate) {
    const { error } = await supabase
      .from("deadlines")
      .update({ label: d.label, due_date: d.due_date })
      .eq("id", d.id!)
    if (error) throw error
  }
}
