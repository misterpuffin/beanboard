import { useState, useMemo, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { useProfiles } from "@/hooks/use-profiles"
import { useProjects } from "@/hooks/use-projects"
import {
  useScheduleEntries,
  useCreateScheduleEntry,
  useMoveScheduleEntry,
  useDeleteScheduleEntry,
  useUpdateScheduleEntry,
} from "@/hooks/use-schedule-entries"
import { QueryState } from "@/components/shared/query-state"
import { ScheduleToolbar } from "@/components/schedule/schedule-toolbar"
import { ScheduleSidebar } from "@/components/schedule/schedule-sidebar"
import { ScheduleGrid } from "@/components/schedule/schedule-grid"
import { ScheduleChip, SidebarChip } from "@/components/schedule/schedule-chip"
import { formatDate, STATUS_LABELS } from "@/lib/utils"
import type { ProjectWithRelations, ScheduleEntry } from "@/lib/types"

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

interface ActiveDrag {
  type: "sidebar-project" | "schedule-entry"
  projectId: string | null
  entryId?: string
  entry?: ScheduleEntry
}

export function SchedulePage() {
  const [, setSearchParams] = useSearchParams()
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()))
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null)

  const weekDates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = new Date(currentMonday)
        d.setDate(currentMonday.getDate() + i)
        return d
      }),
    [currentMonday],
  )

  const weekStart = formatDate(weekDates[0])
  const weekEnd = formatDate(weekDates[4])

  const {
    data: profiles,
    isLoading: profilesLoading,
    error: profilesError,
    refetch: refetchProfiles,
  } = useProfiles()
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects()
  const {
    data: entries,
    isLoading: entriesLoading,
    error: entriesError,
    refetch: refetchEntries,
  } = useScheduleEntries(weekStart, weekEnd)

  const createEntry = useCreateScheduleEntry()
  const moveEntry = useMoveScheduleEntry()
  const deleteEntry = useDeleteScheduleEntry()
  const updateEntry = useUpdateScheduleEntry()

  const isLoading = profilesLoading || projectsLoading || entriesLoading
  const error = profilesError || projectsError || entriesError

  const activeProfiles = useMemo(
    () => (profiles ?? []).filter((p) => p.is_active),
    [profiles],
  )

  const sidebarProjects = useMemo(
    () =>
      (projects ?? []).filter(
        (p) => !STATUS_LABELS.TERMINAL.includes(p.status.label),
      ),
    [projects],
  )

  const projectMap = useMemo(() => {
    const map = new Map<string, ProjectWithRelations>()
    for (const p of projects ?? []) {
      map.set(p.id, p)
    }
    return map
  }, [projects])

  const entriesByCell = useMemo(() => {
    const map = new Map<string, ScheduleEntry[]>()
    for (const entry of entries ?? []) {
      const key = `${entry.profile_id}:${entry.date}`
      const list = map.get(key) ?? []
      list.push(entry)
      map.set(key, list)
    }
    return map
  }, [entries])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current as ActiveDrag
      if (data.type === "schedule-entry") {
        const entry = (entries ?? []).find((e) => e.id === data.entryId)
        setActiveDrag({ ...data, entry })
      } else {
        setActiveDrag(data)
      }
    },
    [entries],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveDrag(null)

      if (!over) return

      const overId = over.id as string
      if (!overId.startsWith("cell:")) return

      const parts = overId.split(":")
      const targetProfileId = parts[1]
      const targetDate = parts[2]

      const dragData = active.data.current as ActiveDrag

      if (dragData.type === "sidebar-project") {
        createEntry.mutate({
          profile_id: targetProfileId,
          project_id: dragData.projectId,
          date: targetDate,
        })
      } else if (dragData.type === "schedule-entry" && dragData.entryId) {
        if (
          dragData.entry?.profile_id === targetProfileId &&
          dragData.entry?.date === targetDate
        ) {
          return
        }
        moveEntry.mutate({
          id: dragData.entryId,
          profile_id: targetProfileId,
          date: targetDate,
        })
      }
    },
    [createEntry, moveEntry],
  )

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null)
  }, [])

  const handleChipClick = useCallback(
    (projectId: string) => {
      if (projectId) setSearchParams({ project: projectId })
    },
    [setSearchParams],
  )

  const handleCreateEntry = useCallback(
    (profileId: string, date: string, description: string) => {
      createEntry.mutate({
        profile_id: profileId,
        date,
        description,
      })
    },
    [createEntry],
  )

  const handleUpdateDescription = useCallback(
    (entryId: string, description: string | null) => {
      updateEntry.mutate({ id: entryId, description })
    },
    [updateEntry],
  )

  const handleDeleteEntry = useCallback(
    (entryId: string) => {
      deleteEntry.mutate(entryId)
    },
    [deleteEntry],
  )

  const handlePrevWeek = useCallback(() => {
    setCurrentMonday((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }, [])

  const handleNextWeek = useCallback(() => {
    setCurrentMonday((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }, [])

  const handleToday = useCallback(() => {
    setCurrentMonday(getMonday(new Date()))
  }, [])

  const dragOverlayProject = activeDrag?.projectId
    ? projectMap.get(activeDrag.projectId)
    : undefined

  return (
    <QueryState
      isLoading={isLoading}
      error={error}
      onRetry={() => {
        refetchProfiles()
        refetchProjects()
        refetchEntries()
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <ScheduleToolbar
          weekStart={weekDates[0]}
          weekEnd={weekDates[4]}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />
        <div className="flex gap-4">
          <ScheduleSidebar projects={sidebarProjects} />
          <div className="min-w-0 flex-1">
            <ScheduleGrid
              profiles={activeProfiles}
              weekDates={weekDates}
              entriesByCell={entriesByCell}
              projectMap={projectMap}
              onChipClick={handleChipClick}
              onDeleteEntry={handleDeleteEntry}
              onCreateEntry={handleCreateEntry}
              onUpdateDescription={handleUpdateDescription}
            />
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {activeDrag &&
            (activeDrag.type === "schedule-entry" && activeDrag.entry ? (
              <ScheduleChip
                entry={activeDrag.entry}
                project={dragOverlayProject}
                onChipClick={() => {}}
                onDelete={() => {}}
                onUpdateDescription={() => {}}
                isDragOverlay
              />
            ) : dragOverlayProject ? (
              <SidebarChip project={dragOverlayProject} isDragOverlay />
            ) : null)}
        </DragOverlay>
      </DndContext>
    </QueryState>
  )
}
