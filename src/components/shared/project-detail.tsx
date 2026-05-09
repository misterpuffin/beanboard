import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { getInitials } from "@/lib/utils"

interface ProjectDetailProps {
  projectId: string
  onClose: () => void
}

export function ProjectDetail({ projectId, onClose }: ProjectDetailProps) {
  const { data: projects } = useProjects()
  const project = projects?.find((p) => p.id === projectId)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!project) return null

  const now = new Date()
  const sortedDeadlines = [...project.deadlines].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  )

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-background shadow-xl animate-in slide-in-from-right-full duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-semibold">{project.client.name}</h2>
            {project.description && (
              <p className="text-xs text-muted-foreground">{project.description}</p>
            )}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-5">
          {/* Status + Category */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="size-2.5 rounded-full"
                style={{ backgroundColor: project.status.color ?? "#6b7280" }}
              />
              <span className="text-sm font-medium">{project.status.label}</span>
            </div>
            {project.category && (
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: `${project.category.color}15`,
                  color: project.category.color ?? undefined,
                  borderColor: `${project.category.color}30`,
                }}
                className="border"
              >
                {project.category.label}
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
                  const isOverdue = new Date(deadline.due_date) < now
                  return (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                    >
                      <span className="text-sm">{deadline.label}</span>
                      <span
                        className={`text-sm tabular-nums ${
                          isOverdue ? "font-medium text-destructive" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(deadline.due_date).toLocaleDateString("en-SG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Team */}
          {project.team.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Team
              </label>
              <div className="flex flex-col gap-2">
                {project.team.map((t) => (
                  <div key={t.profile_id} className="flex items-center gap-2.5">
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
                      <span className="text-sm font-medium">{t.profile.name}</span>
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
          {project.notes && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Notes
              </label>
              <p className="text-sm text-muted-foreground">{project.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
