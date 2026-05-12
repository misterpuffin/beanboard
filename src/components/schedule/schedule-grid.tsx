import { getInitials } from "@/lib/utils"
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
}

export function ScheduleGrid({
  profiles,
  weekDates,
  entriesByCell,
  projectMap,
  onChipClick,
  onDeleteEntry,
}: ScheduleGridProps) {
  const now = new Date()

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-44" />
          {weekDates.map((_, i) => (
            <col key={i} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="border-b border-r bg-muted/30 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Team
            </th>
            {weekDates.map((date, i) => {
              const isToday = date.toDateString() === now.toDateString()
              return (
                <th
                  key={i}
                  className={`border-b px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide ${
                    isToday
                      ? "bg-primary/5 text-primary"
                      : "bg-muted/30 text-muted-foreground"
                  } ${i < 4 ? "border-r" : ""}`}
                >
                  <div>{DAY_LABELS[i]}</div>
                  <div className="text-[10px] font-normal normal-case">
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
          {profiles.map((profile) => (
            <tr key={profile.id} className="border-b last:border-b-0">
              <td className="border-r px-4 py-1.5 overflow-hidden">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {getInitials(profile.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">
                      {profile.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {profile.title}
                    </span>
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
                    onChipClick={onChipClick}
                    onDeleteEntry={onDeleteEntry}
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
