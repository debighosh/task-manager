import { createContext, useContext, useEffect, useReducer, useState } from "react"
import { initialTaskState, taskReducer } from "../reducer/taskReducer.js"

const TaskContext = createContext(null)

const legacyStatusMap = {
  "To Do": "todo",
  "In Progress": "in-progress",
  Done: "done",
}

const legacyPriorityMap = {
  Low: "low",
  Medium: "medium",
  High: "high",
}

// Supports users who still have older localStorage data from the pre-spec value format.
function normalizeTask(task, index) {
  const numericId = Number(task.id)

  return {
    id: Number.isFinite(numericId) ? numericId : index + 1,
    title: typeof task.title === "string" ? task.title : "Untitled task",
    description: typeof task.description === "string" ? task.description : "",
    status: legacyStatusMap[task.status] ?? task.status ?? "todo",
    priority: legacyPriorityMap[task.priority] ?? task.priority ?? "medium",
  }
}

function loadTaskState() {
  const saved = localStorage.getItem("task-manager-state")
  if (!saved) return initialTaskState

  try {
    const parsed = JSON.parse(saved)
    return {
      tasks: Array.isArray(parsed.tasks)
        ? parsed.tasks.map((task, index) => normalizeTask(task, index))
        : initialTaskState.tasks,
      filter: ["all", "todo", "in-progress", "done"].includes(parsed.filter)
        ? parsed.filter
        : "all",
    }
  } catch {
    return initialTaskState
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, loadTaskState)
  const [isDark, setIsDark] = useState(false)

  // Assignment requirement: filteredTasks is derived during render, not stored in state.
  const filteredTasks = state.tasks.filter((task) =>
    state.filter === "all" ? true : task.status === state.filter,
  )

  // Persist task/filter state so progress survives page reloads (bonus feature).
  useEffect(() => {
    localStorage.setItem("task-manager-state", JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const value = {
    tasks: state.tasks,
    filteredTasks,
    filter: state.filter,
    isDark,
    toggleTheme: () => setIsDark((v) => !v),
    addTask: (task) => dispatch({ type: "ADD_TASK", payload: task }),
    deleteTask: (id) => dispatch({ type: "DELETE_TASK", payload: id }),
    setFilter: (filter) => dispatch({ type: "SET_FILTER", payload: filter }),
    reorderTasks: (draggedId, targetId) =>
      dispatch({ type: "REORDER_TASKS", payload: { draggedId, targetId } }),
    updateTask: (id, changes) => dispatch({ type: "UPDATE_TASK", payload: { id, changes } }),
    getTask: (id) => state.tasks.find((task) => Number(task.id) === Number(id)) || null,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider")
  return ctx
}
