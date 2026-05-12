import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useClients } from "@/hooks/use-clients"
import { useProjects } from "@/hooks/use-projects"
import {
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/use-client-mutations"
import { Button } from "@/components/ui/button"
import { ManageFormDialog } from "@/components/shared/manage-form-dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import type { Client } from "@/lib/types"

const INPUT_CLASS =
  "h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"

export function ManageClientsPage() {
  const { data: clients } = useClients()
  const { data: projects } = useProjects()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [name, setName] = useState("")
  const [deleting, setDeleting] = useState<Client | null>(null)

  function projectCountFor(clientId: string) {
    return projects?.filter((p) => p.client_id === clientId).length ?? 0
  }

  function openAdd() {
    setEditing(null)
    setName("")
    setDialogOpen(true)
  }

  function openEdit(client: Client) {
    setEditing(client)
    setName(client.name)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
  }

  async function handleSave() {
    if (!name.trim()) return
    if (editing) {
      await updateClient.mutateAsync({ id: editing.id, name: name.trim() })
    } else {
      await createClient.mutateAsync({ name: name.trim() })
    }
    closeDialog()
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteClient.mutateAsync({ id: deleting.id })
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {clients?.length ?? 0} client{clients?.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onClick={openAdd}>
          <Plus className="size-4" />
          Add Client
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Name
              </th>
              <th className="w-28 px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Projects
              </th>
              <th className="w-20 px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {clients?.map((client) => {
              const count = projectCountFor(client.id)
              return (
                <tr
                  key={client.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium">{client.name}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {count}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(client)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleting(client)}
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
            {clients?.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No clients yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ManageFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editing ? "Edit Client" : "Add Client"}
        onSubmit={handleSave}
        isSubmitting={createClient.isPending || updateClient.isPending}
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${INPUT_CLASS} w-full`}
            autoFocus
          />
        </div>
      </ManageFormDialog>

      {deleting && (
        <ConfirmDialog
          title="Delete Client"
          message={`Delete "${deleting.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          isLoading={deleteClient.isPending}
        />
      )}
    </div>
  )
}
