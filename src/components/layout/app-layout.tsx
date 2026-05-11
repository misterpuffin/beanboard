import { NavLink, Outlet, useSearchParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { cn, STATUS_LABELS } from "@/lib/utils"
import { useProjects } from "@/hooks/use-projects"
import { Button } from "@/components/ui/button"
import { ProjectDetail } from "@/components/shared/project-detail"
import { UserMenu } from "@/components/shared/user-menu"

const navItems = [
  { to: "/pipeline", label: "Pipeline" },
  { to: "/deadlines", label: "Deadlines" },
  { to: "/schedule", label: "Schedule" },
  { to: "/workload", label: "Workload" },
]

function StatsBar() {
  const { data: projects } = useProjects()

  const now = new Date()
  const weekFromNow = new Date(now)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  const loading = !projects

  let stats: { label: string; value: number | string; alert?: string }[]

  if (loading) {
    stats = [
      { label: "Active", value: "--" },
      { label: "Due this week", value: "--" },
      { label: "In review", value: "--" },
      { label: "Sent to client", value: "--" },
    ]
  } else {
    const activeProjects = projects.filter(
      (p) => !STATUS_LABELS.TERMINAL.includes(p.status.label)
    )

    const activeDeadlines = activeProjects.flatMap((p) => p.deadlines)
    const dueThisWeek = activeDeadlines.filter((d) => new Date(d.due_date) <= weekFromNow)
    const overdue = activeDeadlines.filter((d) => new Date(d.due_date) < now)

    const inReview = projects.filter((p) =>
      STATUS_LABELS.REVIEW.includes(p.status.label)
    )
    const sentToClient = projects.filter((p) =>
      STATUS_LABELS.SENT.includes(p.status.label)
    )

    stats = [
      { label: "Active", value: activeProjects.length },
      {
        label: "Due this week",
        value: dueThisWeek.length,
        alert: overdue.length > 0 ? `${overdue.length} overdue` : undefined,
      },
      { label: "In review", value: inReview.length },
      { label: "Sent to client", value: sentToClient.length },
    ]
  }

  return (
    <div className="flex items-center gap-1 px-6 py-2">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5",
            i === 0 && "bg-primary/5"
          )}
        >
          <span className="text-xs text-muted-foreground">{stat.label}</span>
          <span className="text-sm font-semibold tabular-nums">{stat.value}</span>
          {stat.alert && (
            <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
              {stat.alert}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export function AppLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedProject = searchParams.get("project")

  function closeProject() {
    setSearchParams({})
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              B
            </div>
            <h1 className="text-base font-semibold tracking-tight">beanboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setSearchParams({ project: "new" })}
            >
              <Plus className="size-4" />
              New Project
            </Button>
            <UserMenu />
          </div>
        </div>
        <nav className="flex gap-1 px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <StatsBar />
      <main className="flex-1 px-6 py-4">
        <Outlet />
      </main>

      {selectedProject && (
        <ProjectDetail
          projectId={selectedProject === "new" ? undefined : selectedProject}
          onClose={closeProject}
        />
      )}
    </div>
  )
}
