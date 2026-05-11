import { useState } from "react"
import { Popover } from "@base-ui/react"
import { LogOut, Pencil, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentProfile } from "@/hooks/use-current-profile"
import { useUpdateProfile } from "@/hooks/use-profile-mutations"
import { getInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const INPUT_CLASS =
  "h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"

export function UserMenu() {
  const { user, signOut } = useAuth()
  const { data: profile } = useCurrentProfile()
  const updateProfile = useUpdateProfile()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")

  function startEditing() {
    setName(profile?.name ?? "")
    setTitle(profile?.title ?? "")
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
  }

  async function handleSave() {
    if (!profile) return
    await updateProfile.mutateAsync({
      id: profile.id,
      name: name.trim(),
      title: title.trim(),
    })
    setEditing(false)
  }

  const displayName = profile?.name ?? user?.email ?? ""
  const initials = profile ? getInitials(profile.name) : user?.email?.[0]?.toUpperCase() ?? "?"

  return (
    <Popover.Root
      onOpenChange={(open) => {
        if (!open) setEditing(false)
      }}
    >
      <Popover.Trigger
        className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
        title={displayName}
      >
        {initials}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={8} className="z-[60]">
          <Popover.Popup className="w-72 rounded-lg bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
            {profile && !editing && (
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {profile.name}
                    </p>
                    {profile.title && (
                      <p className="text-xs text-muted-foreground truncate">
                        {profile.title}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground/70 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={startEditing}
                    title="Edit profile"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {profile && editing && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Edit Profile</p>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={cancelEditing}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${INPUT_CLASS} w-full`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`${INPUT_CLASS} w-full`}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      onClick={handleSave}
                      disabled={
                        updateProfile.isPending || !name.trim()
                      }
                    >
                      {updateProfile.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!profile && (
              <div className="p-4">
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  No profile linked
                </p>
              </div>
            )}

            <div className="border-t px-4 py-2">
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
