import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QueryStateProps {
  isLoading: boolean
  error: Error | null
  onRetry?: () => void
  children: React.ReactNode
}

export function QueryState({ isLoading, error, onRetry, children }: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <AlertCircle className="size-6 text-destructive" />
        <p className="text-sm text-destructive">Failed to load data</p>
        <p className="max-w-md text-center text-xs text-muted-foreground">
          {error.message}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-1.5 size-3.5" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return <>{children}</>
}
