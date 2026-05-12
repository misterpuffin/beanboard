import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScheduleToolbarProps {
  weekStart: Date
  weekEnd: Date
  onPrevWeek: () => void
  onNextWeek: () => void
  onToday: () => void
}

export function ScheduleToolbar({
  weekStart,
  weekEnd,
  onPrevWeek,
  onNextWeek,
  onToday,
}: ScheduleToolbarProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Weekly Schedule</h2>
        <p className="text-sm text-muted-foreground">
          {weekStart.toLocaleDateString("en-SG", {
            day: "numeric",
            month: "short",
          })}
          {" — "}
          {weekEnd.toLocaleDateString("en-SG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" onClick={onPrevWeek}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button variant="outline" size="icon-sm" onClick={onNextWeek}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
