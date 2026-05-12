import { useEffect, type FormEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface ManageFormDialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit: () => void
  isSubmitting: boolean
}

export function ManageFormDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  isSubmitting,
}: ManageFormDialogProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative z-10 flex w-full max-w-sm flex-col gap-4 rounded-xl bg-card p-6 shadow-xl ring-1 ring-foreground/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold">{title}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {children}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
