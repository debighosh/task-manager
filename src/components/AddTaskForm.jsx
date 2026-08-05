import { useState } from "react"
import { Plus, ChevronDown } from "lucide-react"
import { PRIORITIES, PRIORITY_LABELS, STATUSES, STATUS_LABELS } from "../data/tasks.js"
import { useTasks } from "../context/TaskContext.jsx"

export default function AddTaskForm() {
  const { addTask } = useTasks()
  // Controlled form state keeps reducer payloads explicit and predictable.
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState("medium")

  // Assignment easy bonus: block submit until required fields are filled.
  const disabled = title.trim().length === 0 || description.trim().length === 0

  function handleSubmit(e) {
    e.preventDefault()
    if (disabled) return
    addTask({ title: title.trim(), description: description.trim(), status, priority })
    // Clear form after successful add to support rapid task entry.
    setTitle("")
    setDescription("")
    setStatus("todo")
    setPriority("medium")
  }

  const fieldClass =
    "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Plus className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Create task</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design the settings page"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add more detail about this task..."
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-foreground">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${fieldClass} cursor-pointer appearance-none pr-9`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-foreground">
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${fieldClass} cursor-pointer appearance-none pr-9`}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
            disabled
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground shadow-sm hover:scale-[1.01] hover:shadow-md active:scale-[0.99]"
          }`}
        >
          <Plus className="h-4 w-4" />
          Add task
        </button>
      </div>
    </form>
  )
}
