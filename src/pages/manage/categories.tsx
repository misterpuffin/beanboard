import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { useProjects } from "@/hooks/use-projects"
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-category-mutations"
import { Button } from "@/components/ui/button"
import { ManageFormDialog } from "@/components/shared/manage-form-dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import type { Category } from "@/lib/types"

const INPUT_CLASS =
  "h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"

export function ManageCategoriesPage() {
  const { data: categories } = useCategories()
  const { data: projects } = useProjects()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [label, setLabel] = useState("")
  const [color, setColor] = useState("#6366f1")
  const [deleting, setDeleting] = useState<Category | null>(null)

  function projectCountFor(categoryId: string) {
    return projects?.filter((p) => p.category_id === categoryId).length ?? 0
  }

  function openAdd() {
    setEditing(null)
    setLabel("")
    setColor("#6366f1")
    setDialogOpen(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setLabel(category.label)
    setColor(category.color ?? "#6366f1")
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
  }

  async function handleSave() {
    if (!label.trim()) return
    if (editing) {
      await updateCategory.mutateAsync({
        id: editing.id,
        label: label.trim(),
        color,
      })
    } else {
      await createCategory.mutateAsync({ label: label.trim(), color })
    }
    closeDialog()
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteCategory.mutateAsync({ id: deleting.id })
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories?.length ?? 0} categor{categories?.length !== 1 ? "ies" : "y"}
        </p>
        <Button size="sm" onClick={openAdd}>
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
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
            {categories?.map((cat) => {
              const count = projectCountFor(cat.id)
              return (
                <tr
                  key={cat.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color ?? "#888" }}
                      />
                      <span className="font-medium">{cat.label}</span>
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
                        onClick={() => openEdit(cat)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleting(cat)}
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
            {categories?.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No categories yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ManageFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editing ? "Edit Category" : "Add Category"}
        onSubmit={handleSave}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
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
          title="Delete Category"
          message={`Delete "${deleting.label}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          isLoading={deleteCategory.isPending}
        />
      )}
    </div>
  )
}
