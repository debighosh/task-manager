import { initialTasks } from "../data/tasks.js"

export const initialTaskState = {
  tasks: initialTasks,
  filter: "all",
}

// IDs are numeric so routing (/tasks/:id) and reducer comparisons stay consistent.
function getNextTaskId(tasks) {
  const maxId = tasks.reduce((max, task) => {
    const id = Number(task.id)
    return Number.isFinite(id) ? Math.max(max, id) : max
  }, 0)
  return maxId + 1
}

export function taskReducer(state, action) {
  switch (action.type) {
    // Core assignment action: append the new task object to state.
    case "ADD_TASK": {
      const task = {
        id: getNextTaskId(state.tasks),
        title: action.payload.title,
        description: action.payload.description,
        status: action.payload.status,
        priority: action.payload.priority,
      }
      return { ...state, tasks: [...state.tasks, task] }
    }

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => Number(task.id) !== Number(action.payload)),
      }

    case "SET_FILTER":
      return { ...state, filter: action.payload }

    case "REORDER_TASKS": {
      // Reordering updates the master tasks array so filters keep working without extra state.
      const fromIndex = state.tasks.findIndex(
        (task) => Number(task.id) === Number(action.payload.draggedId),
      )
      const toIndex = state.tasks.findIndex(
        (task) => Number(task.id) === Number(action.payload.targetId),
      )

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return state
      }

      const reorderedTasks = [...state.tasks]
      const [movedTask] = reorderedTasks.splice(fromIndex, 1)
      reorderedTasks.splice(toIndex, 0, movedTask)

      return { ...state, tasks: reorderedTasks }
    }

    // Optional bonus behavior retained for inline edit on detail page.
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          Number(task.id) === Number(action.payload.id) ? { ...task, ...action.payload.changes } : task,
        ),
      }

    default:
      return state
  }
}
