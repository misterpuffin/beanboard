import { useProfiles } from "@/hooks/use-profiles"
import { QueryState } from "@/components/shared/query-state"
import { getInitials } from "@/lib/utils"

export function SchedulePage() {
  const { data: profiles, isLoading, error, refetch } = useProfiles()

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))

  const weekDates = days.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const activeProfiles = (profiles ?? []).filter((p) => p.is_active)

  return (
    <QueryState isLoading={isLoading} error={error} onRetry={() => refetch()}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Weekly Schedule</h2>
            <p className="text-sm text-muted-foreground">
              {monday.toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
              {" — "}
              {weekDates[4].toLocaleDateString("en-SG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <p className="rounded-lg bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            Coming soon — schedule entries will appear here
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-r bg-muted/30 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Team
                </th>
                {weekDates.map((date, i) => {
                  const isToday = date.toDateString() === now.toDateString()
                  return (
                    <th
                      key={days[i]}
                      className={`border-b px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide ${
                        isToday
                          ? "bg-primary/5 text-primary"
                          : "bg-muted/30 text-muted-foreground"
                      } ${i < 4 ? "border-r" : ""}`}
                    >
                      <div>{days[i]}</div>
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
              {activeProfiles.map((profile) => (
                <tr key={profile.id} className="border-b last:border-b-0">
                  <td className="border-r px-4 py-3">
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
                    const isToday = date.toDateString() === now.toDateString()
                    return (
                      <td
                        key={days[i]}
                        className={`px-3 py-3 ${isToday ? "bg-primary/[0.02]" : ""} ${i < 4 ? "border-r" : ""}`}
                      />
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </QueryState>
  )
}
