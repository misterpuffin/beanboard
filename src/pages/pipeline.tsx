import { useSearchParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { QueryState } from "@/components/shared/query-state"
import { useStatuses } from "@/hooks/use-statuses"
import { useProjects } from "@/hooks/use-projects"
import { getInitials, getProjectLead, getNextDeadline, STATUS_LABELS } from "@/lib/utils"
import type { ProjectWithRelations } from "@/lib/types"

export function PipelinePage() {
  const [, setSearchParams] = useSearchParams()
  const { data: statuses, isLoading: statusesLoading, error: statusesError } = useStatuses()
  const { data: projects, isLoading: projectsLoading, error: projectsError, refetch } = useProjects()

  const isLoading = statusesLoading || projectsLoading
  const error = statusesError || projectsError

  const visibleStatuses = (statuses ?? []).filter(
    (s) => !STATUS_LABELS.TERMINAL.includes(s.label)
  )

  function openProject(project: ProjectWithRelations) {
    setSearchParams({ project: project.id })
  }

  return (
    <QueryState isLoading={isLoading} error={error} onRetry={() => refetch()}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {visibleStatuses.map((status) => {
          const statusProjects = (projects ?? []).filter((p) => p.status_id === status.id)
          return (
            <div key={status.id} className="flex w-72 shrink-0 flex-col gap-2">
              <div className="flex items-center gap-2 px-1 pb-1">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: status.color ?? "#6b7280" }}
                />
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {status.label}
                </h2>
                <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                  {statusProjects.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {statusProjects.map((project) => {
                  const lead = getProjectLead(project)
                  const nextDeadline = getNextDeadline(project)
                  const isOverdue =
                    nextDeadline && new Date(nextDeadline.due_date) < new Date()

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => openProject(project)}
                      className="group flex cursor-pointer flex-col gap-2.5 rounded-xl border bg-card p-3.5 text-left shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary/20 active:scale-[0.99]"
                      style={{
                        borderLeftWidth: "3px",
                        borderLeftColor: project.category?.color ?? "#e5e7eb",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-snug text-foreground">
                          {project.client.name}
                        </span>
                      </div>

                      {project.description && (
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {project.category && (
                            <Badge
                              variant="secondary"
                              className="border text-[10px]"
                              style={{
                                backgroundColor: `${project.category.color}10`,
                                color: project.category.color ?? undefined,
                                borderColor: `${project.category.color}25`,
                              }}
                            >
                              {project.category.label}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {nextDeadline && (
                            <span
                              className={`text-[11px] tabular-nums ${
                                isOverdue
                                  ? "font-semibold text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {new Date(nextDeadline.due_date).toLocaleDateString(
                                "en-SG",
                                { day: "numeric", month: "short" }
                              )}
                            </span>
                          )}
                          {lead && (
                            <div
                              className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
                              title={lead.name}
                            >
                              {getInitials(lead.name)}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
                {statusProjects.length === 0 && (
                  <div className="rounded-xl border border-dashed py-8 text-center text-xs text-muted-foreground">
                    No projects
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </QueryState>
  )
}
