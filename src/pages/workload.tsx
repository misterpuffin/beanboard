import { useProfiles } from "@/hooks/use-profiles"
import { useProjects } from "@/hooks/use-projects"
import { QueryState } from "@/components/shared/query-state"
import { getInitials, STATUS_LABELS } from "@/lib/utils"

export function WorkloadPage() {
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfiles()
  const { data: projects, isLoading: projectsLoading, error: projectsError, refetch } = useProjects()

  const isLoading = profilesLoading || projectsLoading
  const error = profilesError || projectsError

  const activeProfiles = (profiles ?? []).filter((p) => p.is_active)

  const workload = activeProfiles
    .map((profile) => {
      const activeCount = (projects ?? []).filter(
        (p) =>
          !STATUS_LABELS.TERMINAL.includes(p.status.label) &&
          p.team.some((t) => t.profile_id === profile.id && t.role === "lead")
      ).length
      return { profile, activeCount }
    })
    .sort((a, b) => b.activeCount - a.activeCount)

  const maxCount = Math.max(...workload.map((w) => w.activeCount), 1)

  return (
    <QueryState isLoading={isLoading} error={error} onRetry={() => refetch()}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-base font-semibold">Workload</h2>
          <p className="text-sm text-muted-foreground">
            Active projects per team member (as lead)
          </p>
        </div>
        <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-5">
          {workload.map(({ profile, activeCount }) => {
            const barColor =
              activeCount >= 5
                ? "bg-destructive"
                : activeCount >= 3
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            const barBg =
              activeCount >= 5
                ? "bg-destructive/10"
                : activeCount >= 3
                  ? "bg-amber-500/10"
                  : "bg-emerald-500/10"

            return (
              <div key={profile.id} className="flex items-center gap-4">
                <div className="flex w-32 shrink-0 items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
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
                <div className="flex flex-1 items-center gap-3">
                  <div className={`h-7 flex-1 overflow-hidden rounded-lg ${barBg}`}>
                    <div
                      className={`h-full rounded-lg transition-all ${barColor}`}
                      style={{
                        width: `${Math.max((activeCount / maxCount) * 100, activeCount > 0 ? 8 : 0)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium tabular-nums text-muted-foreground">
                    {activeCount}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </QueryState>
  )
}
