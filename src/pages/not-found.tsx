import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h2 className="text-4xl font-bold tabular-nums text-muted-foreground/50">404</h2>
      <p className="text-sm text-muted-foreground">This page doesn't exist.</p>
      <Button variant="outline" size="sm" onClick={() => navigate("/board")}>
        Go to Board
      </Button>
    </div>
  )
}
