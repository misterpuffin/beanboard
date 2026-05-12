import { cn, getInitials } from "@/lib/utils"
import { ScheduleCell } from "./schedule-cell"
import type { Profile, ScheduleEntry, ProjectWithRelations } from "@/lib/types"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"]

interface ScheduleGridProps {
  profiles: Profile[]
  weekDates: Date[]
  entriesByCell: Map<string, ScheduleEntry[]>
  projectMap: Map<string, ProjectWithRelations>
  onChipClick: (projectId: string) => void
  onDeleteEntry: (entryId: string) => void
  onCreateEntry: (profileId: string, date: string, description: string) => void
  onUpdateDescription: (entryId: string, description: string | null) => void
}

export function ScheduleGrid({
  profiles,
  weekDates,
  entriesByCell,
  projectMap,
  onChipClick,
  onDeleteEntry,
  onCreateEntry,
  onUpdateDescription,
}: ScheduleGridProps) {
  const now = new Date()

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <table className="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-48" />
          {weekDates.map((_, i) => (
            <col key={i} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="border-b-2 border-r border-b-border/60 bg-muted/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Team
            </th>
            {weekDates.map((date, i) => {
              const isToday = date.toDateString() === now.toDateString()
              return (
                <th
                  key={i}
                  className={cn(
                    "border-b-2 border-b-border/60 px-4 py-3 text-left",
                    i < 4 && "border-r",
                    isToday
                      ? "bg-primary/8"
                      : "bg-muted/50",
                  )}
                >
                  <div className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    isToday ? "text-primary" : "text-muted-foreground",
                  )}>
                    {DAY_LABELS[i]}
                  </div>
                  <div className={cn(
                    "text-[11px] font-normal normal-case",
                    isToday ? "text-primary/70" : "text-muted-foreground/60",
                  )}>
                    {date.toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile, rowIndex) => (
            <tr
              key={profile.id}
              className={cn(
                "border-b last:border-b-0",
                rowIndex % 2 === 1 && "bg-muted/15",
              )}
            >
              <td className="border-r px-4 py-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {getInitials(profile.name)}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium leading-tight">
                      {profile.name}
                    </span>
                    {profile.title && (
                      <span className="truncate text-[11px] text-muted-foreground/70">
                        {profile.title}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              {weekDates.map((date, i) => {
                const dateStr = date.toISOString().split("T")[0]
                const cellKey = `${profile.id}:${dateStr}`
                const entries = entriesByCell.get(cellKey) ?? []
                const isToday = date.toDateString() === now.toDateString()

                return (
                  <ScheduleCell
                    key={i}
                    profileId={profile.id}
                    date={date}
                    entries={entries}
                    projectMap={projectMap}
                    isToday={isToday}
                    isLastCol={i === 4}
                    isAltRow={rowIndex % 2 === 1}
                    onChipClick={onChipClick}
                    onDeleteEntry={onDeleteEntry}
                    onCreateEntry={onCreateEntry}
                    onUpdateDescription={onUpdateDescription}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
