import { useState } from "react"
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react"
import { useStatuses } from "@/hooks/use-statuses"
import { useProjects } from "@/hooks/use-projects"
import {
  useCreateStatus,
  useUpdateStatus,
  useDeleteStatus,
  useReorderStatuses,
} from "@/hooks/use-status-mutations"
import { Button } from "@/components/ui/button"
import { ManageFormDialog } from "@/components/shared/manage-form-dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import type { Status } from "@/lib/types"

const INPUT_CLASS =
  "h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"

export function ManageStatusesPage() {
  const { data: statuses } = useStatuses()
  const { data: projects } = useProjects()
  const createStatus = useCreateStatus()
  const updateStatus = useUpdateStatus()
  const deleteStatus = useDeleteStatus()
  const reorderStatuses = useReorderStatuses()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Status | null>(null)
  const [label, setLabel] = useState("")
  const [color, setColor] = useState("#6366f1")
  const [deleting, setDeleting] = useState<Status | null>(null)

  function projectCountFor(statusId: string) {
    return projects?.filter((p) => p.status_id === statusId).length ?? 0
  }

  function openAdd() {
    setEditing(null)
    setLabel("")
    setColor("#6366f1")
    setDialogOpen(true)
  }

  function openEdit(status: Status) {
    setEditing(status)
    setLabel(status.label)
    setColor(status.color ?? "#6366f1")
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
  }

  async function handleSave() {
    if (!label.trim()) return
    if (editing) {
      await updateStatus.mutateAsync({
        id: editing.id,
        label: label.trim(),
        color,
      })
    } else {
      const maxPosition = statuses?.reduce(
        (max, s) => Math.max(max, s.position),
        0
      ) ?? 0
      await createStatus.mutateAsync({
        label: label.trim(),
        color,
        position: maxPosition + 1,
      })
    }
    closeDialog()
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteStatus.mutateAsync({ id: deleting.id })
    setDeleting(null)
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (!statuses) return
    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= statuses.length) return

    const a = statuses[index]
    const b = statuses[swapIndex]
    await reorderStatuses.mutateAsync({
      idA: a.id,
      positionA: a.position,
      idB: b.id,
      positionB: b.position,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {statuses?.length ?? 0} status{statuses?.length !== 1 ? "es" : ""}
          {" — drag order maps to board columns"}
        </p>
        <Button size="sm" onClick={openAdd}>
          <Plus className="size-4" />
          Add Status
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="w-16 px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Order
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Label
              </th>
              <th className="w-28 px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Projects
              </th>
              <th className="w-20 px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {statuses?.map((status, i) => {
              const count = projectCountFor(status.id)
              return (
                <tr
                  key={status.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleMove(i, "up")}
                        disabled={i === 0 || reorderStatuses.isPending}
                        title="Move up"
                      >
                        <ArrowUp className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleMove(i, "down")}
                        disabled={
                          i === (statuses?.length ?? 0) - 1 ||
                          reorderStatuses.isPending
                        }
                        title="Move down"
                      >
                        <ArrowDown className="size-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: status.color ?? "#888" }}
                      />
                      <span className="font-medium">{status.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {count}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(status)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleting(status)}
                        disabled={count > 0}
                        title={
                          count > 0
                            ? "Cannot delete — has projects"
                            : "Delete"
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {statuses?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No statuses yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ManageFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editing ? "Edit Status" : "Add Status"}
        onSubmit={handleSave}
        isSubmitting={createStatus.isPending || updateStatus.isPending}
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={`${INPUT_CLASS} w-full`}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border bg-background p-1"
            />
            <span className="text-xs text-muted-foreground">{color}</span>
          </div>
        </div>
      </ManageFormDialog>

      {deleting && (
        <ConfirmDialog
          title="Delete Status"
          message={`Delete "${deleting.label}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          isLoading={deleteStatus.isPending}
        />
      )}
    </div>
  )
}
