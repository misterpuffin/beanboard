import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ProjectWithRelations, Profile, Deadline } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

export function getProjectLead(project: ProjectWithRelations): Profile | undefined {
  return project.team.find((t) => t.role === "lead")?.profile
}

export function getNextDeadline(project: ProjectWithRelations): Deadline | undefined {
  const pending = project.deadlines.filter((d) => !d.completed_at)
  if (pending.length === 0) return undefined
  return [...pending].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  )[0]
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export const STATUS_LABELS: Record<string, readonly string[]> = {
  TERMINAL: ["Closed", "Billed"],
  REVIEW: ["Review", "Draft"],
  SENT: ["Sent to Client"],
}
