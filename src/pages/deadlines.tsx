import { useSearchParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { QueryState } from "@/components/shared/query-state"
import { useProjects } from "@/hooks/use-projects"
import { getInitials, getProjectLead, STATUS_LABELS } from "@/lib/utils"
import type { ProjectWithRelations, Deadline } from "@/lib/types"

interface DeadlineRow {
  deadline: Deadline
  project: ProjectWithRelations
}

function getRelativeDate(date: Date, now: Date): string {
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "tomorrow"
  if (diffDays === -1) return "yesterday"
  if (diffDays > 0 && diffDays <= 30) return `in ${diffDays} days`
  if (diffDays < 0 && diffDays >= -30) return `${Math.abs(diffDays)} days ago`
  if (diffDays > 30) {
    const months = Math.round(diffDays / 30)
    return `in ${months} month${months > 1 ? "s" : ""}`
  }
  const months = Math.round(Math.abs(diffDays) / 30)
  return `${months} month${months > 1 ? "s" : ""} ago`
}

function groupRows(rows: DeadlineRow[], now: Date) {
  const weekFromNow = new Date(now)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  const overdue: DeadlineRow[] = []
  const thisWeek: DeadlineRow[] = []
  const later: DeadlineRow[] = []

  for (const row of rows) {
    const d = new Date(row.deadline.due_date)
    if (d < now) overdue.push(row)
    else if (d <= weekFromNow) thisWeek.push(row)
    else later.push(row)
  }

  return [
    { label: "Overdue", rows: overdue, isOverdueGroup: true },
    { label: "This week", rows: thisWeek, isOverdueGroup: false },
    { label: "Later", rows: later, isOverdueGroup: false },
  ].filter((g) => g.rows.length > 0)
}

export function DeadlinesPage() {
  const [, setSearchParams] = useSearchParams()
  const { data: projects, isLoading, error, refetch } = useProjects()

  const rows = (projects ?? [])
    .filter((p) => !STATUS_LABELS.TERMINAL.includes(p.status.label))
    .flatMap((project) =>
      project.deadlines.map((deadline) => ({ deadline, project }))
    )
    .sort((a, b) => new Date(a.deadline.due_date).getTime() - new Date(b.deadline.due_date).getTime())

  const now = new Date()
  const groups = groupRows(rows, now)

  function openProject(project: ProjectWithRelations) {
    setSearchParams({ project: project.id })
  }

  return (
    <QueryState isLoading={isLoading} error={error} onRetry={() => refetch()}>
      {groups.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-center text-muted-foreground">
          <p className="text-sm">No active deadlines</p>
        </div>
      )}
      {groups.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lead</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deadline</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <>
                  <tr key={`group-${group.label}`} className="border-b bg-muted/20">
                    <td colSpan={6} className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {group.isOverdueGroup && (
                          <div className="size-1.5 rounded-full bg-destructive" />
                        )}
                        <span className={`text-xs font-semibold uppercase tracking-wide ${
                          group.isOverdueGroup ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          {group.label}
                        </span>
                        <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                          {group.rows.length}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {group.rows.map((row) => {
                    const { deadline, project } = row
                    const lead = getProjectLead(project)
                    const isOverdue = new Date(deadline.due_date) < now
                    const relative = getRelativeDate(new Date(deadline.due_date), now)

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
                        <td className={`px-4 py-3 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                          <span className={`tabular-nums ${isOverdue ? "font-semibold" : ""}`}>
                            {new Date(deadline.due_date).toLocaleDateString("en-SG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="ml-1.5 text-[11px] opacity-50">
                            {relative}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </QueryState>
  )
}
