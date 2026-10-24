import { useEffect, useState } from "react"
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
import { TaskLoadError, TaskLoading } from "../components/TaskFeedback.jsx"

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, updateTask, deleteTask, loadStatus, loadError, reloadTasks, fetchTask } = useTasks()
  // Route param drives lookup for /tasks/:id.
  const task = getTask(Number(id))
  const [lookup, setLookup] = useState("idle")
  const [lookupError, setLookupError] = useState("")
  const [lookupAttempt, setLookupAttempt] = useState(0)

  // The dashboard load already includes every task. GET /api/tasks/{id}
  // only runs for an id that is missing, so a direct link can still resolve
  // or show a real not-found instead of a blank page.
  useEffect(() => {
    if (loadStatus !== "ready") return undefined
    if (getTask(Number(id))) return undefined

    let cancelled = false
    fetchTask(id)
      .then(() => {
        if (!cancelled) setLookup("ready")
      })
      .catch((error) => {
        if (cancelled) return
        if (error.status === 404) {
          setLookup("missing")
          return
        }
        setLookup("error")
        setLookupError(error instanceof Error ? error.message : "Couldn't load that task.")
      })

    return () => {
      cancelled = true
    }
  }, [loadStatus, id, getTask, fetchTask, lookupAttempt])

  const fieldClass =
    "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

  if (loadStatus === "loading") return <TaskLoading />
  if (loadStatus === "error") {
    return <TaskLoadError message={loadError} onRetry={reloadTasks} />
  }

  if (!task && lookup === "error") {
    return (
      <TaskLoadError
        title="Couldn't load that task"
        message={lookupError}
        onRetry={() => {
          setLookup("idle")
          setLookupAttempt((attempt) => attempt + 1)
        }}
      />
    )
  }

  if (!task && lookup !== "missing") {
    return <TaskLoading title="Checking that task" message="Asking the server for this task." />
  }

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
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const disabled = title.trim().length === 0 || submitting || deleting

  async function handleSave(e) {
    e.preventDefault()
    if (disabled) return
    setSubmitting(true)
    try {
      // Stay on this page when the server rejects the change. The banner
      // shows why, and the fields the user typed are still here.
      await updateTask(task.id, { title: title.trim(), description: description.trim(), status, priority })
      navigate("/tasks")
    } catch {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (deleting || submitting) return
    setDeleting(true)
    try {
      await deleteTask(task.id)
      navigate("/tasks")
    } catch {
      setDeleting(false)
    }
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
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status] ?? statusStyles.todo}`}>
            {STATUS_LABELS[task.status] ?? task.status}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority] ?? priorityStyles.medium}`}>
            {PRIORITY_LABELS[task.priority] ?? task.priority} priority
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
            disabled={deleting || submitting}
            className="flex items-center gap-2 rounded-xl border border-border py-2.5 pl-3 pr-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting…" : "Delete"}
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
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
