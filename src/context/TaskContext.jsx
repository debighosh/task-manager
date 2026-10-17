import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react"
import {
  ApiError,
  createTask,
  deleteTask as deleteTaskRequest,
  getTask as getTaskRequest,
  listTasks,
  updateTask as updateTaskRequest,
} from "../api/tasksApi.js"
import { initialTaskState, taskReducer } from "../reducer/taskReducer.js"

const TaskContext = createContext(null)

const FILTERS = ["all", "todo", "in-progress", "done"]

function loadSavedFilter() {
  try {
    const saved = localStorage.getItem("task-manager-state")
    if (!saved) return "all"
    const parsed = JSON.parse(saved)
    // Older builds stored the whole task list here. Only the filter is a
    // preference; the tasks themselves now come from the API.
    return FILTERS.includes(parsed.filter) ? parsed.filter : "all"
  } catch {
    return "all"
  }
}

function initState() {
  return { ...initialTaskState, filter: loadSavedFilter() }
}

function errorMessage(error, fallback) {
  return error instanceof Error && error.message ? error.message : fallback
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, undefined, initState)
  const [isDark, setIsDark] = useState(false)
  const [loadStatus, setLoadStatus] = useState("loading")
  const [loadError, setLoadError] = useState("")
  const [actionError, setActionError] = useState("")
  const [loadAttempt, setLoadAttempt] = useState(0)

  // Event handlers need the list from the latest render, not the one
  // captured when the callback was created.
  const tasksRef = useRef(state.tasks)
  useEffect(() => {
    tasksRef.current = state.tasks
  }, [state.tasks])

  // Assignment requirement: filteredTasks is derived during render, not stored in state.
  const filteredTasks = state.tasks.filter((task) =>
    state.filter === "all" ? true : task.status === state.filter,
  )

  useEffect(() => {
    try {
      localStorage.setItem("task-manager-state", JSON.stringify({ filter: state.filter }))
    } catch {
      // Private mode can block storage. The filter still works for this visit.
    }
  }, [state.filter])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    let cancelled = false

    listTasks()
      .then((tasks) => {
        if (cancelled) return
        dispatch({ type: "SET_TASKS", payload: tasks })
        setLoadStatus("ready")
      })
      .catch((error) => {
        if (cancelled) return
        // Leave the previous list untouched and show the error screen.
        // Applying a failed response as an empty list would look like
        // the user had deleted everything.
        setLoadError(errorMessage(error, "Couldn't load tasks."))
        setLoadStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [loadAttempt])

  const reloadTasks = useCallback(() => {
    setActionError("")
    setLoadError("")
    setLoadStatus("loading")
    setLoadAttempt((attempt) => attempt + 1)
  }, [])

  const dismissActionError = useCallback(() => setActionError(""), [])

  const addTask = useCallback(async (draft) => {
    setActionError("")
    try {
      const created = await createTask(draft)
      dispatch({ type: "ADD_TASK", payload: created })
      return created
    } catch (error) {
      setActionError(errorMessage(error, "Couldn't add that task."))
      throw error
    }
  }, [])

  const updateTask = useCallback(async (id, changes) => {
    const current = tasksRef.current.find((task) => Number(task.id) === Number(id))
    if (!current) {
      const missing = new ApiError("That task is no longer in the list.", 404)
      setActionError(missing.message)
      throw missing
    }

    const next = {
      ...current,
      ...changes,
      id: current.id,
      dueDate: Object.prototype.hasOwnProperty.call(changes, "dueDate") ? changes.dueDate : current.dueDate,
    }

    setActionError("")
    try {
      const saved = await updateTaskRequest(current.id, next)
      dispatch({ type: "UPDATE_TASK", payload: saved })
      return saved
    } catch (error) {
      setActionError(errorMessage(error, "Couldn't save that task."))
      throw error
    }
  }, [])

  const deleteTask = useCallback(async (id) => {
    setActionError("")
    try {
      await deleteTaskRequest(id)
      dispatch({ type: "DELETE_TASK", payload: id })
    } catch (error) {
      // A 404 means the server already dropped it. Remove the local copy
      // too, and still tell the user so the row doesn't just vanish.
      if (error instanceof ApiError && error.status === 404) {
        dispatch({ type: "DELETE_TASK", payload: id })
      }
      setActionError(errorMessage(error, "Couldn't delete that task."))
      throw error
    }
  }, [])

  // Used when a /tasks/:id link is not in the list we already loaded.
  const fetchTask = useCallback(async (id) => {
    try {
      const task = await getTaskRequest(id)
      dispatch({ type: "UPDATE_TASK", payload: task })
      return task
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        dispatch({ type: "DELETE_TASK", payload: id })
      }
      throw error
    }
  }, [])

  const getTask = useCallback(
    (id) => state.tasks.find((task) => Number(task.id) === Number(id)) || null,
    [state.tasks],
  )

  const setFilter = useCallback((filter) => {
    dispatch({ type: "SET_FILTER", payload: filter })
  }, [])

  const reorderTasks = useCallback((draggedId, targetId) => {
    dispatch({ type: "REORDER_TASKS", payload: { draggedId, targetId } })
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark((value) => !value)
  }, [])

  const value = {
    tasks: state.tasks,
    filteredTasks,
    filter: state.filter,
    isDark,
    loadStatus,
    loadError,
    actionError,
    toggleTheme,
    reloadTasks,
    dismissActionError,
    addTask,
    deleteTask,
    setFilter,
    reorderTasks,
    updateTask,
    getTask,
    fetchTask,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// The hook is the way pages read this provider. Fast Refresh would rather
// the file export only components; keeping the hook here is the usual pattern.
// eslint-disable-next-line react-refresh/only-export-components
export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider")
  return ctx
}
