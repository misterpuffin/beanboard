import { useState, useCallback, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge"
import { QueryState } from "@/components/shared/query-state"
import { useStatuses } from "@/hooks/use-statuses"
import { useProjects } from "@/hooks/use-projects"
import { useUpdateProjectStatus } from "@/hooks/use-project-mutations"
import { cn, getInitials, getProjectLead, getNextDeadline, STATUS_LABELS } from "@/lib/utils"
import type { ProjectWithRelations } from "@/lib/types"

export function BoardPage() {
  const [, setSearchParams] = useSearchParams()
  const { data: statuses, isLoading: statusesLoading, error: statusesError } = useStatuses()
  const { data: projects, isLoading: projectsLoading, error: projectsError, refetch } = useProjects()
  const updateStatus = useUpdateProjectStatus()

  const [activeProject, setActiveProject] = useState<ProjectWithRelations | null>(null)

  const isLoading = statusesLoading || projectsLoading
  const error = statusesError || projectsError

  const visibleStatuses = (statuses ?? []).filter(
    (s) => !STATUS_LABELS.TERMINAL.includes(s.label)
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const projectId = event.active.data.current?.projectId as string
      const project = (projects ?? []).find((p) => p.id === projectId)
      setActiveProject(project ?? null)
    },
    [projects],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveProject(null)
      const { active, over } = event
      if (!over) return

      const projectId = active.data.current?.projectId as string
      const oldStatusId = active.data.current?.statusId as string
      const newStatusId = over.id as string

      if (oldStatusId === newStatusId) return

      updateStatus.mutate({ projectId, statusId: newStatusId })
    },
    [updateStatus],
  )

  const handleDragCancel = useCallback(() => {
    setActiveProject(null)
  }, [])

  function openProject(project: ProjectWithRelations) {
    setSearchParams({ project: project.id })
  }

  return (
    <QueryState isLoading={isLoading} error={error} onRetry={() => refetch()}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {visibleStatuses.map((status) => {
            const statusProjects = (projects ?? []).filter((p) => p.status_id === status.id)
            return (
              <DroppableColumn key={status.id} id={status.id}>
                <div className="flex items-center gap-2 px-1 pb-2">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: status.color ?? "#6b7280" }}
                  />
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {status.label}
                  </h2>
                  <span className="ml-auto rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                    {statusProjects.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {statusProjects.map((project) => (
                    <DraggableCard
                      key={project.id}
                      project={project}
                      onClick={() => openProject(project)}
                    />
                  ))}
                  {statusProjects.length === 0 && (
                    <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed py-8 text-center text-xs text-muted-foreground">
                      <span className="text-lg opacity-30">-</span>
                      No projects
                    </div>
                  )}
                </div>
              </DroppableColumn>
            )
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeProject && (
            <div className="w-72">
              <ProjectCard project={activeProject} isDragOverlay />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </QueryState>
  )
}

function DroppableColumn({ id, children }: { id: string; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl p-2.5 transition-colors",
        isOver
          ? "bg-primary/8 ring-1 ring-inset ring-primary/20"
          : "bg-muted/30",
      )}
    >
      {children}
    </div>
  )
}

function DraggableCard({
  project,
  onClick,
}: {
  project: ProjectWithRelations
  onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: project.id,
    data: { projectId: project.id, statusId: project.status_id },
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
      onClick={onClick}
    >
      <ProjectCard project={project} />
    </div>
  )
}

function ProjectCard({
  project,
  isDragOverlay,
}: {
  project: ProjectWithRelations
  isDragOverlay?: boolean
}) {
  const lead = getProjectLead(project)
  const nextDeadline = getNextDeadline(project)
  const isOverdue = nextDeadline && new Date(nextDeadline.due_date) < new Date()

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-3.5 text-left shadow-sm transition-all",
        isDragOverlay
          ? "shadow-lg ring-1 ring-black/5"
          : "hover:shadow-md hover:ring-1 hover:ring-primary/20",
      )}
    >
      <span className="text-sm font-semibold leading-snug text-foreground">
        {project.client.name}
      </span>

      {project.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        {project.category && (
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
        )}

        <div className="flex items-center gap-2">
          {nextDeadline && (
            <span
              className={`text-[11px] tabular-nums ${
                isOverdue
                  ? "font-semibold text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {nextDeadline.label}
              {" · "}
              {new Date(nextDeadline.due_date).toLocaleDateString(
                "en-SG",
                { day: "numeric", month: "short" }
              )}
            </span>
          )}
          {lead && (
            <div
              className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
              title={lead.name}
            >
              {getInitials(lead.name)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
