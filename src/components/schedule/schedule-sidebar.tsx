import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarChip } from "./schedule-chip"
import type { ProjectWithRelations } from "@/lib/types"

interface ScheduleSidebarProps {
  projects: ProjectWithRelations[]
}

export function ScheduleSidebar({ projects }: ScheduleSidebarProps) {
  const [open, setOpen] = useState(true)
  const [search, setSearch] = useState("")

  const filtered = projects.filter((p) =>
    p.client.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className={cn(
        "shrink-0 transition-all duration-200",
        open ? "w-56" : "w-9",
      )}
    >
      {open ? (
        <div className="flex h-full flex-col rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Projects
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setOpen(false)}
            >
              <PanelLeftClose className="size-3.5" />
            </Button>
          </div>
          <div className="border-b px-2 py-1.5">
            <div className="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1">
              <Search className="size-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-1.5">
            <div className="flex flex-col gap-1">
              {filtered.map((project) => (
                <DraggableSidebarItem key={project.id} project={project} />
              ))}
              {filtered.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No projects found
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setOpen(true)}
          className="mt-0.5"
        >
          <PanelLeftOpen className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

function DraggableSidebarItem({ project }: { project: ProjectWithRelations }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar:${project.id}`,
    data: {
      type: "sidebar-project",
      projectId: project.id,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
    >
      <SidebarChip project={project} />
    </div>
  )
}
