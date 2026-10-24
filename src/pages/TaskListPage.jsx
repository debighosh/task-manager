import { useMemo, useState } from "react"
import DashboardSidebar from "../components/DashboardSidebar.jsx"
import FilterBar from "../components/FilterBar.jsx"
import AddTaskForm from "../components/AddTaskForm.jsx"
import TaskList from "../components/TaskList.jsx"
import { TaskLoadError, TaskLoading } from "../components/TaskFeedback.jsx"
import { useTasks } from "../context/TaskContext.jsx"

export default function TaskListPage() {
  const { tasks, filteredTasks, filter, setFilter, loadStatus, loadError, reloadTasks } = useTasks()
  const [activePriorities, setActivePriorities] = useState([])

  // Status comes from context (spec requirement); priority is an additional layered bonus filter.
  const visibleTasks = useMemo(() => {
    return filteredTasks.filter((task) => {
      const priorityMatch = activePriorities.length === 0 || activePriorities.includes(task.priority)
      return priorityMatch
    })
  }, [filteredTasks, activePriorities])

  function togglePriority(priority) {
    setActivePriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
    )
  }

  if (loadStatus === "loading") return <TaskLoading />
  if (loadStatus === "error") return <TaskLoadError message={loadError} onRetry={reloadTasks} />

  return (
    <main className="mx-auto max-w-7xl animate-page-in px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
          Task Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          Organize, filter, and track your team&apos;s work in one beautiful place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <DashboardSidebar
          shown={visibleTasks.length}
          total={tasks.length}
          activePriorities={activePriorities}
          onTogglePriority={togglePriority}
          onClearPriorities={() => setActivePriorities([])}
        />

        <div className="space-y-6">
          <AddTaskForm />
          <FilterBar filter={filter} onFilterChange={setFilter} />
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Tasks</h2>
              <span className="text-sm text-muted-foreground">{visibleTasks.length} shown</span>
            </div>
            <TaskList tasks={visibleTasks} />
          </div>
        </div>
      </div>
    </main>
  )
}
