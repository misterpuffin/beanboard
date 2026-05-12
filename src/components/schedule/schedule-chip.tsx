import { useState, useRef, useEffect } from "react"
import { useDraggable } from "@dnd-kit/core"
import { Pencil, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScheduleEntry, ProjectWithRelations } from "@/lib/types"

interface ScheduleChipProps {
  entry: ScheduleEntry
  project?: ProjectWithRelations
  onChipClick: (projectId: string) => void
  onDelete: (entryId: string) => void
  onUpdateDescription: (entryId: string, description: string | null) => void
  isDragOverlay?: boolean
}

export function ScheduleChip({
  entry,
  project,
  onChipClick,
  onDelete,
  onUpdateDescription,
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

  const hasProject = !!project
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(entry.description ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  function startEditing(e: React.MouseEvent) {
    e.stopPropagation()
    setEditValue(entry.description ?? "")
    setIsEditing(true)
  }

  function handleEditSubmit() {
    const trimmed = editValue.trim()
    const newDesc = trimmed || null
    if (newDesc !== (entry.description ?? null)) {
      onUpdateDescription(entry.id, newDesc)
    }
    setIsEditing(false)
  }

  function handleEditCancel() {
    setIsEditing(false)
    setEditValue(entry.description ?? "")
  }

  if (isEditing) {
    return (
      <div
        data-chip
        className={cn(
          "flex flex-col gap-0.5 rounded-md border px-2 py-1",
          hasProject ? undefined : "bg-muted border-muted-foreground/25",
        )}
        style={
          hasProject
            ? {
                backgroundColor: `${project.category.color}15`,
                borderColor: `${project.category.color}35`,
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        {hasProject && (
          <div className="flex items-center gap-1.5">
            <div
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: project.category.color ?? undefined }}
            />
            <span className="min-w-0 flex-1 truncate text-xs font-medium leading-tight text-foreground">
              {project.client.name}
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          data-chip
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSubmit()
            if (e.key === "Escape") handleEditCancel()
          }}
          onBlur={handleEditSubmit}
          placeholder={hasProject ? "Add description..." : "Description..."}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-foreground outline-none",
            hasProject
              ? "pl-3.5 text-[11px] leading-tight text-muted-foreground"
              : "text-xs font-medium leading-none",
          )}
        />
      </div>
    )
  }

  const actionButtons = !isDragOverlay && (
    <div className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
      <button
        className="rounded-full p-0.5 hover:bg-black/10"
        onClick={startEditing}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Pencil className="size-2.5 text-muted-foreground" />
      </button>
      <button
        className="rounded-full p-0.5 hover:bg-black/10"
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

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      data-chip
      className={cn(
        "group flex overflow-hidden rounded-md border px-2 py-1 cursor-grab active:cursor-grabbing transition-shadow",
        "hover:shadow-sm",
        !hasProject && "border-primary/20 bg-primary/[0.06]",
        entry.description && hasProject ? "flex-col gap-0.5" : "items-center gap-1.5",
        isDragging && "opacity-30",
        isDragOverlay && "shadow-lg ring-1 ring-black/5",
      )}
      style={
        hasProject
          ? {
              backgroundColor: `${project.category.color}15`,
              borderColor: `${project.category.color}35`,
            }
          : undefined
      }
      onClick={(e) => {
        e.stopPropagation()
        if (hasProject) onChipClick(project.id)
      }}
    >
      {entry.description && hasProject ? (
        <>
          <div className="flex items-center gap-1.5">
            <div
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: project.category.color ?? undefined }}
            />
            <span className="min-w-0 flex-1 truncate text-xs font-medium leading-tight text-foreground">
              {project.client.name}
            </span>
            {actionButtons}
          </div>
          <span className="truncate pl-3.5 text-[11px] leading-tight text-muted-foreground">
            {entry.description}
          </span>
        </>
      ) : (
        <>
          <div
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: hasProject ? (project.category.color ?? undefined) : "var(--color-primary)" }}
          />
          <span className="min-w-0 flex-1 truncate text-xs font-medium leading-tight text-foreground">
            {hasProject ? project.client.name : (entry.description ?? "Untitled")}
          </span>
          {actionButtons}
        </>
      )}
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
        "flex items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-xs transition-colors",
        "hover:bg-muted/60",
        isDragOverlay && "bg-card shadow-lg ring-1 ring-black/10",
      )}
    >
      <div
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: project.category.color ?? undefined }}
      />
      <span className="min-w-0 truncate font-medium text-foreground">
        {project.client.name}
      </span>
      <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/60">
        {project.category.label}
      </span>
    </div>
  )
}
