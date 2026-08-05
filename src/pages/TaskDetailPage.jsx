import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, ChevronDown, AlertTriangle, Save, Trash2 } from "lucide-react"
import {
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  priorityStyles,
  statusStyles,
} from "../data/tasks.js"
import { useTasks } from "../context/TaskContext.jsx"

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, updateTask, deleteTask } = useTasks()
  // Route param drives lookup for /tasks/:id.
  const task = getTask(Number(id))

  const fieldClass =
    "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

  // FR12: directly visiting /tasks/:id with an unknown id renders a real not-found state.
  if (!task) {
    return (
      <main className="mx-auto flex max-w-2xl animate-page-in flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-foreground">Task not found</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground text-pretty">
          No task exists with id <span className="font-mono text-foreground">{id}</span>. It may have been deleted or
          the link is incorrect.
        </p>
        <Link
          to="/tasks"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to task list
        </Link>
      </main>
    )
  }

  return <DetailForm key={task.id} task={task} fieldClass={fieldClass} navigate={navigate} updateTask={updateTask} deleteTask={deleteTask} />
}

function DetailForm({ task, fieldClass, navigate, updateTask, deleteTask }) {
  // Local edit buffer lets users cancel changes before dispatching UPDATE_TASK.
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState(task.priority)

  const disabled = title.trim().length === 0

  function handleSave(e) {
    e.preventDefault()
    if (disabled) return
    // Update only this task in reducer, then return to the list route.
    updateTask(task.id, { title: title.trim(), description: description.trim(), status, priority })
    navigate("/tasks")
  }

  function handleDelete() {
    deleteTask(task.id)
    navigate("/tasks")
  }

  return (
    <main className="mx-auto max-w-2xl animate-page-in px-4 py-8 sm:px-6 lg:px-8">
      {/* FR2: explicit way to return to the task list */}
      <button
        type="button"
        onClick={() => navigate("/tasks")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to task list
      </button>

      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-medium text-muted-foreground">
            {task.id}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]} priority
          </span>
        </div>

        <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground text-balance sm:text-2xl">
          Edit task
        </h1>

        <div className="space-y-5">
          <div>
            <label htmlFor="edit-title" className="mb-1.5 block text-sm font-medium text-foreground">
              Title
            </label>
            <input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
          </div>

          <div>
            <label htmlFor="edit-desc" className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-status" className="mb-1.5 block text-sm font-medium text-foreground">
                Status
              </label>
              <div className="relative">
                <select
                  id="edit-status"
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
              <label htmlFor="edit-priority" className="mb-1.5 block text-sm font-medium text-foreground">
                Priority
              </label>
              <div className="relative">
                <select
                  id="edit-priority"
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
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-xl border border-border py-2.5 pl-3 pr-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                disabled
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              <Save className="h-4 w-4" />
              Save changes
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
