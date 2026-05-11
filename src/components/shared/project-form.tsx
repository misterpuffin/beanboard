import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import { useClients } from "@/hooks/use-clients"
import { useCategories } from "@/hooks/use-categories"
import { useStatuses } from "@/hooks/use-statuses"
import { useProfiles } from "@/hooks/use-profiles"
import type { ProjectFormData } from "@/hooks/use-project-mutations"
import type { TeamRole } from "@/lib/types"

const INPUT_CLASS =
  "h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"

const SELECT_CLASS =
  "h-9 appearance-none rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"

interface ProjectFormProps {
  initialData?: ProjectFormData
  onSubmit: (data: ProjectFormData) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProjectFormProps) {
  const { data: clients } = useClients()
  const { data: categories } = useCategories()
  const { data: statuses } = useStatuses()
  const { data: profiles } = useProfiles()

  const sortedStatuses = [...(statuses ?? [])].sort(
    (a, b) => a.position - b.position
  )
  const activeProfiles = (profiles ?? []).filter((p) => p.is_active)

  const clientOptions = (clients ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }))

  const [clientId, setClientId] = useState(initialData?.client_id ?? "")
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "")
  const [statusId, setStatusId] = useState(
    initialData?.status_id ?? sortedStatuses[0]?.id ?? ""
  )
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  )
  const [notes, setNotes] = useState(initialData?.notes ?? "")
  const [team, setTeam] = useState<{ profile_id: string; role: TeamRole }[]>(
    initialData?.team ?? []
  )
  const [deadlines, setDeadlines] = useState<
    { id?: string; label: string; due_date: string }[]
  >(initialData?.deadlines ?? [])
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!clientId || !categoryId || !statusId) {
      setError("Client, category, and status are required.")
      return
    }

    // Filter out incomplete team/deadline entries
    const validTeam = team.filter((t) => t.profile_id)
    const validDeadlines = deadlines.filter((d) => d.label && d.due_date)

    onSubmit({
      client_id: clientId,
      category_id: categoryId,
      status_id: statusId,
      description,
      notes,
      team: validTeam,
      deadlines: validDeadlines,
    })
  }

  const assignedProfileIds = new Set(team.map((t) => t.profile_id))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Client */}
      <fieldset className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Client
        </label>
        <Combobox
          items={clientOptions}
          value={clientOptions.find((o) => o.value === clientId) ?? null}
          onValueChange={(val) => setClientId(val?.value ?? "")}
        >
          <ComboboxInput placeholder="Search clients..." className="w-full" />
          <ComboboxContent>
            <ComboboxList>
              {(option: { value: string; label: string }) => (
                <ComboboxItem key={option.value} value={option}>
                  {option.label}
                </ComboboxItem>
              )}
            </ComboboxList>
            <ComboboxEmpty>No clients found</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      </fieldset>

      {/* Category */}
      <fieldset className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={`${SELECT_CLASS} w-full`}
          required
        >
          <option value="">Select category...</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Status */}
      <fieldset className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Status
        </label>
        <select
          value={statusId}
          onChange={(e) => setStatusId(e.target.value)}
          className={`${SELECT_CLASS} w-full`}
          required
        >
          {sortedStatuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Description */}
      <fieldset className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. YE 31 Dec 2025 final audit"
          className={`${INPUT_CLASS} w-full`}
        />
      </fieldset>

      {/* Notes */}
      <fieldset className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes..."
          className={`${INPUT_CLASS} w-full min-h-[80px] resize-y py-2`}
        />
      </fieldset>

      {/* Team */}
      <fieldset className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Team
          </label>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() =>
              setTeam([...team, { profile_id: "", role: "member" }])
            }
          >
            <Plus className="size-3" />
            Add
          </Button>
        </div>
        {team.map((member, i) => {
          const memberOptions = activeProfiles
            .filter(
              (p) =>
                p.id === member.profile_id || !assignedProfileIds.has(p.id)
            )
            .map((p) => ({ value: p.id, label: p.name }))

          return (
          <div key={i} className="flex items-center gap-2">
            <Combobox
              items={memberOptions}
              value={
                memberOptions.find((o) => o.value === member.profile_id) ??
                null
              }
              onValueChange={(val) => {
                const updated = [...team]
                updated[i] = {
                  ...updated[i],
                  profile_id: val?.value ?? "",
                }
                setTeam(updated)
              }}
            >
              <ComboboxInput placeholder="Search members..." className="flex-1" />
              <ComboboxContent>
                <ComboboxList>
                  {(option: { value: string; label: string }) => (
                    <ComboboxItem key={option.value} value={option}>
                      {option.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
                <ComboboxEmpty>No members found</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
            <select
              value={member.role}
              onChange={(e) => {
                const updated = [...team]
                updated[i] = {
                  ...updated[i],
                  role: e.target.value as TeamRole,
                }
                setTeam(updated)
              }}
              className={`${SELECT_CLASS} w-28 shrink-0`}
            >
              <option value="lead">Lead</option>
              <option value="reviewer">Reviewer</option>
              <option value="member">Member</option>
            </select>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setTeam(team.filter((_, j) => j !== i))}
            >
              <X className="size-3" />
            </Button>
          </div>
          )
        })}
      </fieldset>

      {/* Deadlines */}
      <fieldset className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Deadlines
          </label>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() =>
              setDeadlines([...deadlines, { label: "", due_date: "" }])
            }
          >
            <Plus className="size-3" />
            Add
          </Button>
        </div>
        {deadlines.map((deadline, i) => (
          <div key={deadline.id ?? `new-${i}`} className="flex items-center gap-2">
            <input
              type="text"
              value={deadline.label}
              onChange={(e) => {
                const updated = [...deadlines]
                updated[i] = { ...updated[i], label: e.target.value }
                setDeadlines(updated)
              }}
              placeholder="Label"
              className={`${INPUT_CLASS} flex-1`}
            />
            <input
              type="date"
              value={deadline.due_date}
              onChange={(e) => {
                const updated = [...deadlines]
                updated[i] = { ...updated[i], due_date: e.target.value }
                setDeadlines(updated)
              }}
              className={`${INPUT_CLASS} w-40 shrink-0`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() =>
                setDeadlines(deadlines.filter((_, j) => j !== i))
              }
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
      </fieldset>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
