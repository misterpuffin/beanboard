import { useState, useRef, useEffect } from "react"
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
  isAltRow: boolean
  onChipClick: (projectId: string) => void
  onDeleteEntry: (entryId: string) => void
  onCreateEntry: (profileId: string, date: string, description: string) => void
  onUpdateDescription: (entryId: string, description: string | null) => void
}

export function ScheduleCell({
  profileId,
  date,
  entries,
  projectMap,
  isToday,
  isLastCol,
  isAltRow,
  onChipClick,
  onDeleteEntry,
  onCreateEntry,
  onUpdateDescription,
}: ScheduleCellProps) {
  const droppableId = `cell:${profileId}:${formatDate(date)}`
  const { setNodeRef, isOver } = useDroppable({ id: droppableId })
  const [isAdding, setIsAdding] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  function handleCellClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("[data-chip]")) return
    setIsAdding(true)
  }

  function handleSubmit() {
    const trimmed = inputValue.trim()
    if (trimmed) {
      onCreateEntry(profileId, formatDate(date), trimmed)
    }
    setIsAdding(false)
    setInputValue("")
  }

  function handleCancel() {
    setIsAdding(false)
    setInputValue("")
  }

  const isEmpty = entries.length === 0 && !isAdding

  return (
    <td
      ref={setNodeRef}
      className={cn(
        "px-1.5 py-1.5 align-top cursor-pointer transition-colors",
        !isLastCol && "border-r",
        isToday && (isAltRow ? "bg-primary/[0.06]" : "bg-primary/[0.04]"),
        isOver && "bg-primary/10 ring-1 ring-inset ring-primary/25",
        isEmpty && !isOver && "hover:bg-muted/40",
      )}
      onClick={handleCellClick}
    >
      <div className="flex min-h-[2.25rem] flex-col gap-1">
        {entries.map((entry) => {
          const project = entry.project_id
            ? projectMap.get(entry.project_id)
            : undefined
          return (
            <ScheduleChip
              key={entry.id}
              entry={entry}
              project={project}
              onChipClick={onChipClick}
              onDelete={onDeleteEntry}
              onUpdateDescription={onUpdateDescription}
            />
          )
        })}
        {isAdding && (
          <input
            ref={inputRef}
            data-chip
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit()
              if (e.key === "Escape") handleCancel()
            }}
            onBlur={handleSubmit}
            placeholder="Add entry..."
            className="w-full rounded-md border bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary/30"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </td>
  )
}
