import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GripVertical, Trash2, Inbox } from "lucide-react"
import { PRIORITY_LABELS, STATUS_LABELS, priorityStyles, statusStyles } from "../data/tasks.js"
import { useTasks } from "../context/TaskContext.jsx"

export default function TaskList({ tasks }) {
  const navigate = useNavigate()
  const { deleteTask, reorderTasks } = useTasks()
  const [draggedId, setDraggedId] = useState(null)
  const [targetId, setTargetId] = useState(null)
  const dragMovedRef = useRef(false)
  // Prevents opening the detail page when the same pointer action ended with a drop.
  const suppressClickRef = useRef(false)

  function resetDragState() {
    setDraggedId(null)
    setTargetId(null)
    dragMovedRef.current = false
  }

  function handleDragStart(e, id) {
    setDraggedId(id)
    setTargetId(id)
    dragMovedRef.current = false
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(id))
  }

  function handleDragOver(e, id) {
    // onDragOver must call preventDefault() to allow dropping on this element.
    e.preventDefault()
    if (draggedId == null || Number(draggedId) === Number(id)) return
    dragMovedRef.current = true
    setTargetId(id)
    e.dataTransfer.dropEffect = "move"
  }

  function handleDrop(e, id) {
    e.preventDefault()
    const droppedId = draggedId ?? Number(e.dataTransfer.getData("text/plain"))
    if (droppedId != null && Number(droppedId) !== Number(id)) {
      reorderTasks(droppedId, id)
      suppressClickRef.current = true
    }
    resetDragState()
    window.setTimeout(() => {
      suppressClickRef.current = false
    }, 120)
  }

  function handleDragEnd() {
    // Some browsers fire click right after drag end; short suppression keeps UX predictable.
    if (dragMovedRef.current) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 120)
    }
    resetDragState()
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Inbox className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No tasks match your filters</h3>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting the status or priority filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          role="button"
          tabIndex={0}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragOver={(e) => handleDragOver(e, task.id)}
          onDrop={(e) => handleDrop(e, task.id)}
          onDragEnd={handleDragEnd}
          onClick={() => {
            if (suppressClickRef.current) return
            navigate(`/tasks/${task.id}`)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              navigate(`/tasks/${task.id}`)
            }
          }}
          className={`animate-row-in group flex cursor-pointer items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            Number(draggedId) === Number(task.id)
              ? "border-primary/40 opacity-70"
              : Number(targetId) === Number(task.id)
                ? "border-primary/50 shadow-md"
                : "border-border hover:border-primary/30"
          }`}
          style={{ animationDelay: `${index * 40}ms`, opacity: 0 }}
        >
          <span
            aria-hidden
            className="hidden cursor-grab text-muted-foreground/60 transition-colors group-hover:text-foreground sm:block"
          >
            <GripVertical className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                {task.id}
              </span>
              <h3 className="truncate text-sm font-semibold text-foreground">{task.title}</h3>
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{task.description}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block ${statusStyles[task.status]}`}
            >
              {STATUS_LABELS[task.status]}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            <button
              type="button"
              aria-label={`Delete ${task.title}`}
              onClick={(e) => {
                e.stopPropagation()
                deleteTask(task.id)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
