import { useDroppable } from "@dnd-kit/core"
import { cn, formatDate } from "@/lib/utils"
import { ScheduleChip } from "./schedule-chip"
import type { ScheduleEntry, ProjectWithRelations } from "@/lib/types"

interface ScheduleCellProps {
  profileId: string
  date: Date
  entries: ScheduleEntry[]
  projectMap: Map<string, ProjectWithRelations>
  isToday: boolean
  isLastCol: boolean
  onChipClick: (projectId: string) => void
  onDeleteEntry: (entryId: string) => void
}

export function ScheduleCell({
  profileId,
  date,
  entries,
  projectMap,
  isToday,
  isLastCol,
  onChipClick,
  onDeleteEntry,
}: ScheduleCellProps) {
  const droppableId = `cell:${profileId}:${formatDate(date)}`
  const { setNodeRef, isOver } = useDroppable({ id: droppableId })

  return (
    <td
      ref={setNodeRef}
      className={cn(
        "px-1.5 py-1.5 align-top",
        isToday && "bg-primary/[0.02]",
        !isLastCol && "border-r",
        isOver && "bg-primary/5 ring-1 ring-inset ring-primary/20",
      )}
    >
      <div className="flex flex-col gap-0.5">
        {entries.map((entry) => {
          const project = projectMap.get(entry.project_id)
          if (!project) return null
          return (
            <ScheduleChip
              key={entry.id}
              entry={entry}
              project={project}
              onChipClick={onChipClick}
              onDelete={onDeleteEntry}
            />
          )
        })}
      </div>
    </td>
  )
}
