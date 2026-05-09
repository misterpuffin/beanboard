import { useSearchParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { ProjectDetail } from "@/components/shared/project-detail"
import { QueryState } from "@/components/shared/query-state"
import { useProjects } from "@/hooks/use-projects"
import { getInitials, getProjectLead, STATUS_LABELS } from "@/lib/utils"
import type { ProjectWithRelations } from "@/lib/types"

export function DeadlinesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedProjectId = searchParams.get("project")
  const { data: projects, isLoading, error, refetch } = useProjects()

  const rows = (projects ?? [])
    .filter((p) => !STATUS_LABELS.TERMINAL.includes(p.status.label))
    .flatMap((project) =>
      project.deadlines.map((deadline) => ({ deadline, project }))
    )
    .sort((a, b) => new Date(a.deadline.due_date).getTime() - new Date(b.deadline.due_date).getTime())

  const now = new Date()

  function openProject(project: ProjectWithRelations) {
    setSearchParams({ project: project.id })
  }

  function closeProject() {
    setSearchParams({})
  }

  return (
    <QueryState isLoading={isLoading} error={error} onRetry={() => refetch()}>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deadline</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { deadline, project } = row
              const lead = getProjectLead(project)
              const isOverdue = new Date(deadline.due_date) < now

              return (
                <tr
                  key={deadline.id}
                  onClick={() => openProject(project)}
                  className={`cursor-pointer border-b transition-colors last:border-b-0 hover:bg-muted/40 ${
                    isOverdue ? "bg-destructive/[0.03]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium">{project.client.name}</span>
                    {project.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">{project.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: project.status.color ?? "#6b7280" }}
                      />
                      <span className="text-sm">{project.status.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {lead && (
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {getInitials(lead.name)}
                        </div>
                        <span>{lead.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{deadline.label}</td>
                  <td className={`px-4 py-3 tabular-nums ${isOverdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
                    {new Date(deadline.due_date).toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedProjectId && (
        <ProjectDetail
          projectId={selectedProjectId}
          onClose={closeProject}
        />
      )}
    </QueryState>
  )
}
