import { useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfiles } from "@/hooks/use-profiles"
import {
  useCreateProfile,
  useUpdateProfile,
  useToggleProfileActive,
} from "@/hooks/use-profile-mutations"
import { Button } from "@/components/ui/button"
import { ManageFormDialog } from "@/components/shared/manage-form-dialog"
import type { Profile } from "@/lib/types"

const INPUT_CLASS =
  "h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"

export function ManageTeamPage() {
  const { data: profiles } = useProfiles()
  const createProfile = useCreateProfile()
  const updateProfile = useUpdateProfile()
  const toggleActive = useToggleProfileActive()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Profile | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")

  function openAdd() {
    setEditing(null)
    setName("")
    setEmail("")
    setTitle("")
    setDialogOpen(true)
  }

  function openEdit(profile: Profile) {
    setEditing(profile)
    setName(profile.name)
    setEmail(profile.email ?? "")
    setTitle(profile.title ?? "")
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
  }

  async function handleSave() {
    if (!name.trim()) return
    if (editing) {
      await updateProfile.mutateAsync({
        id: editing.id,
        name: name.trim(),
        title: title.trim(),
      })
    } else {
      await createProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        title: title.trim(),
      })
    }
    closeDialog()
  }

  async function handleToggleActive(profile: Profile) {
    await toggleActive.mutateAsync({
      id: profile.id,
      is_active: !profile.is_active,
    })
  }

  const activeCount = profiles?.filter((p) => p.is_active).length ?? 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {activeCount} active member{activeCount !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onClick={openAdd}>
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Title
              </th>
              <th className="w-20 px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="w-32 px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile) => (
              <tr
                key={profile.id}
                className={cn(
                  "border-b last:border-0 transition-colors",
                  profile.is_active
                    ? "hover:bg-muted/30"
                    : "opacity-40"
                )}
              >
                <td className="px-4 py-2.5">
                  <div>
                    <span className="font-medium">{profile.name}</span>
                    {profile.email && (
                      <p className="text-xs text-muted-foreground">
                        {profile.email}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {profile.title ?? "—"}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      profile.is_active
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {profile.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEdit(profile)}
                      title="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant={profile.is_active ? "ghost" : "outline"}
                      size="xs"
                      onClick={() => handleToggleActive(profile)}
                      disabled={toggleActive.isPending}
                    >
                      {profile.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {profiles?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No team members yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ManageFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editing ? "Edit Member" : "Add Member"}
        onSubmit={handleSave}
        isSubmitting={createProfile.isPending || updateProfile.isPending}
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
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${INPUT_CLASS} w-full`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${INPUT_CLASS} w-full`}
          />
        </div>
      </ManageFormDialog>
    </div>
  )
}
