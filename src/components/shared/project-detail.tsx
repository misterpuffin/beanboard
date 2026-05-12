import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, X } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import {
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useToggleDeadline,
  type ProjectFormData,
} from "@/hooks/use-project-mutations"
import { ProjectForm } from "@/components/shared/project-form"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { getInitials } from "@/lib/utils"

interface ProjectDetailProps {
  projectId?: string
  onClose: () => void
}

function projectToFormData(
  project: NonNullable<ReturnType<typeof useProjects>["data"]>[number]
): ProjectFormData {
  return {
    client_id: project.client_id,
    category_id: project.category_id,
    status_id: project.status_id,
    description: project.description ?? "",
    notes: project.notes ?? "",
    team: project.team.map((t) => ({
      profile_id: t.profile_id,
      role: t.role,
    })),
    deadlines: project.deadlines.map((d) => ({
      id: d.id,
      label: d.label,
      due_date: d.due_date,
    })),
  }
}

export function ProjectDetail({ projectId, onClose }: ProjectDetailProps) {
  const { data: projects } = useProjects()
  const project = projectId
    ? projects?.find((p) => p.id === projectId)
    : undefined

  const [editing, setEditing] = useState(!projectId)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const toggleDeadline = useToggleDeadline()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showDeleteConfirm) return // let confirm dialog handle its own ESC
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, showDeleteConfirm])

  // For view/edit mode, wait for project data
  if (projectId && !project) return null

  const isCreate = !projectId

  function handleCreate(data: ProjectFormData) {
    createProject.mutate(data, { onSuccess: onClose })
  }

  function handleUpdate(data: ProjectFormData) {
    if (!project) return
    updateProject.mutate(
      {
        projectId: project.id,
        data,
        oldTeam: project.team.map((t) => ({
          profile_id: t.profile_id,
          role: t.role,
        })),
        oldDeadlines: project.deadlines.map((d) => ({
          id: d.id,
          label: d.label,
          due_date: d.due_date,
        })),
      },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    if (!projectId) return
    deleteProject.mutate(projectId, { onSuccess: onClose })
  }

  const now = new Date()
  const sortedDeadlines = project
    ? [...project.deadlines].sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      )
    : []

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-background shadow-xl animate-in slide-in-from-right-full duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex flex-col gap-0.5">
            {isCreate ? (
              <h2 className="text-base font-semibold">New Project</h2>
            ) : (
              <>
                <h2 className="text-base font-semibold">
                  {project!.client.name}
                </h2>
                {project!.description && (
                  <p className="text-xs text-muted-foreground">
                    {project!.description}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isCreate && !editing && (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditing(true)}
                  title="Edit"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {editing ? (
          <ProjectForm
            key={projectId ?? "create"}
            initialData={project ? projectToFormData(project) : undefined}
            onSubmit={isCreate ? handleCreate : handleUpdate}
            onCancel={isCreate ? onClose : () => setEditing(false)}
            isSubmitting={
              isCreate ? createProject.isPending : updateProject.isPending
            }
          />
        ) : (
          <div className="flex flex-col gap-6 px-6 py-5">
            {/* Status + Category */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor: project!.status.color ?? "#6b7280",
                  }}
                />
                <span className="text-sm font-medium">
                  {project!.status.label}
                </span>
              </div>
              {project!.category && (
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${project!.category.color}15`,
                    color: project!.category.color ?? undefined,
                    borderColor: `${project!.category.color}30`,
                  }}
                  className="border"
                >
                  {project!.category.label}
                </Badge>
              )}
            </div>

            {/* Deadlines */}
            {sortedDeadlines.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Deadlines
                </label>
                <div className="flex flex-col gap-1.5">
                  {sortedDeadlines.map((deadline) => {
                    const isCompleted = !!deadline.completed_at
                    const isOverdue = !isCompleted && new Date(deadline.due_date) < now
                    return (
                      <div
                        key={deadline.id}
                        className={`flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 ${isCompleted ? "opacity-50" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleDeadline.mutate({ id: deadline.id, completed: !isCompleted })}
                          className="size-4 shrink-0 cursor-pointer rounded border-muted-foreground/50 accent-primary"
                        />
                        <span className={`flex-1 text-sm ${isCompleted ? "line-through" : ""}`}>{deadline.label}</span>
                        <span
                          className={`text-sm tabular-nums ${
                            isCompleted
                              ? "line-through text-muted-foreground"
                              : isOverdue
                                ? "font-medium text-destructive"
                                : "text-muted-foreground"
                          }`}
                        >
                          {new Date(deadline.due_date).toLocaleDateString(
                            "en-SG",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Team */}
            {project!.team.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Team
                </label>
                <div className="flex flex-col gap-2">
                  {project!.team.map((t) => (
                    <div
                      key={t.profile_id}
                      className="flex items-center gap-2.5"
                    >
                      <div
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                          t.role === "lead"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {getInitials(t.profile.name)}
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          {t.profile.name}
                        </span>
                        <span className="ml-1.5 text-xs capitalize text-muted-foreground">
                          {t.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {project!.notes && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Notes
                </label>
                <p className="text-sm text-muted-foreground">
                  {project!.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete project"
          message="This will permanently delete this project and all its team assignments and deadlines. This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={deleteProject.isPending}
        />
      )}
    </div>
  )
}
