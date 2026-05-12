import { NavLink, Outlet, useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProjectDetail } from "@/components/shared/project-detail"
import { UserMenu } from "@/components/shared/user-menu"

const navItems = [
  { to: "/board", label: "Board" },
  { to: "/deadlines", label: "Deadlines" },
  { to: "/schedule", label: "Schedule" },
  { to: "/workload", label: "Workload" },
]

export function AppLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const selectedProject = searchParams.get("project")
  const isManageRoute = location.pathname.startsWith("/manage")

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
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate("/manage/clients")}
              title="Manage"
              className={cn(isManageRoute && "bg-accent text-accent-foreground")}
            >
              <Settings className="size-4" />
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
