import { LayoutGrid, Flag } from "lucide-react"
import { PRIORITIES, PRIORITY_LABELS, priorityDot } from "../data/tasks.js"

export default function DashboardSidebar({
  shown,
  total,
  activePriorities,
  onTogglePriority,
  onClearPriorities,
}) {
  return (
    <aside className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LayoutGrid className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Overview</span>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          {shown}
          <span className="text-lg font-normal text-muted-foreground"> / {total}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing {shown} of {total} tasks
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${total ? (shown / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Priority</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((priority) => {
            const active = activePriorities.includes(priority)
            return (
              <button
                key={priority}
                type="button"
                aria-pressed={active}
                onClick={() => onTogglePriority(priority)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${priorityDot[priority]}`} />
                {PRIORITY_LABELS[priority]}
              </button>
            )
          })}
        </div>
        {activePriorities.length > 0 && (
          <button
            type="button"
            onClick={onClearPriorities}
            className="mt-3 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear priority filters
          </button>
        )}
      </div>
    </aside>
  )
}
