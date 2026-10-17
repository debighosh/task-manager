import { AlertTriangle, RotateCcw, X } from "lucide-react"

export function TaskLoading({ title = "Loading tasks", message = "Fetching the latest tasks from the server." }) {
  return (
    <main className="mx-auto flex max-w-2xl animate-page-in flex-col items-center justify-center px-4 py-24 text-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary"
        role="status"
        aria-label={title}
      />
      <h1 className="mt-5 text-xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground text-pretty">{message}</p>
    </main>
  )
}

export function TaskLoadError({ title = "Couldn't load tasks", message, onRetry }) {
  return (
    <main className="mx-auto flex max-w-2xl animate-page-in flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground text-pretty">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </main>
  )
}

// Kept under the header so a failed save or delete stays visible. The list
// is left unchanged until the server accepts the change.
export function ActionErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="sticky top-16 z-20 border-b border-destructive/25 bg-destructive/10">
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
        <p role="alert" className="flex-1 text-sm text-destructive">
          {message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
