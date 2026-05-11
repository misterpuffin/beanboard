import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDialogProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative z-10 flex w-full max-w-sm flex-col gap-4 rounded-xl bg-card p-6 shadow-xl ring-1 ring-foreground/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
