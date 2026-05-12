import { useDraggable } from "@dnd-kit/core"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScheduleEntry, ProjectWithRelations } from "@/lib/types"

interface ScheduleChipProps {
  entry: ScheduleEntry
  project: ProjectWithRelations
  onChipClick: (projectId: string) => void
  onDelete: (entryId: string) => void
  isDragOverlay?: boolean
}

export function ScheduleChip({
  entry,
  project,
  onChipClick,
  onDelete,
  isDragOverlay,
}: ScheduleChipProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `entry:${entry.id}`,
    data: {
      type: "schedule-entry",
      entryId: entry.id,
      projectId: entry.project_id,
      profileId: entry.profile_id,
      date: entry.date,
    },
    disabled: isDragOverlay,
  })

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      className={cn(
        "group flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] leading-tight cursor-grab active:cursor-grabbing",
        isDragging && "opacity-30",
        isDragOverlay && "shadow-lg ring-1 ring-primary/20",
      )}
      style={{
        backgroundColor: `${project.category.color}10`,
        borderColor: `${project.category.color}25`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onChipClick(project.id)
      }}
    >
      <div
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: project.category.color ?? undefined }}
      />
      <span className="truncate font-medium" style={{ color: project.category.color ?? undefined }}>
        {project.client.name}
      </span>
      <button
        className="ml-auto shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(entry.id)
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X className="size-2.5 text-muted-foreground" />
      </button>
    </div>
  )
}

interface SidebarChipProps {
  project: ProjectWithRelations
  isDragOverlay?: boolean
}

export function SidebarChip({ project, isDragOverlay }: SidebarChipProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs",
        isDragOverlay && "shadow-lg ring-1 ring-primary/20",
      )}
      style={{
        backgroundColor: `${project.category.color}10`,
        borderColor: `${project.category.color}25`,
      }}
    >
      <div
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: project.category.color ?? undefined }}
      />
      <span className="truncate font-medium">{project.client.name}</span>
    </div>
  )
}
