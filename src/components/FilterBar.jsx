import { STATUS_LABELS } from "../data/tasks.js"

const FILTER_OPTIONS = ["all", "todo", "in-progress", "done"]

export default function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filter by status</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => {
          const active = filter === option
          const label = option === "all" ? "All" : STATUS_LABELS[option]
          return (
            <button
              key={option}
              type="button"
              onClick={() => onFilterChange(option)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
