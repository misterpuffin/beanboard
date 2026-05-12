import { NavLink, Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"

const tabs = [
  { to: "/manage/clients", label: "Clients" },
  { to: "/manage/categories", label: "Categories" },
  { to: "/manage/statuses", label: "Statuses" },
  { to: "/manage/team", label: "Team" },
]

export function ManagePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Manage</h2>
        <p className="text-sm text-muted-foreground">
          Configure clients, categories, statuses, and team members.
        </p>
      </div>
      <nav className="flex gap-1 rounded-lg bg-muted/60 p-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
