// Tasks start empty: the provider fills them from GET /api/tasks.
// The hard-coded sample list used to live here and is no longer the source.
export const initialTaskState = {
  tasks: [],
  filter: "all",
}

export function taskReducer(state, action) {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload }

    // The payload is the task the server returned, including its id.
    // Generating an id here would not match /tasks/:id after a reload.
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] }

    case "DELETE_TASK": {
      const tasks = state.tasks.filter((task) => Number(task.id) !== Number(action.payload))
      if (tasks.length === state.tasks.length) return state
      return { ...state, tasks }
    }

    case "SET_FILTER":
      return { ...state, filter: action.payload }

    case "REORDER_TASKS": {
      // The API has no position field, so this only changes order on screen.
      // The next load shows the order the server returns.
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

    // Replace the whole record with the server's copy so dueDate and any
    // other field the form does not edit are not dropped. If this id was
    // missing locally, append it (a direct /tasks/:id visit).
    case "UPDATE_TASK": {
      const nextTask = action.payload
      const index = state.tasks.findIndex((task) => Number(task.id) === Number(nextTask.id))
      if (index === -1) {
        return { ...state, tasks: [...state.tasks, nextTask] }
      }
      const tasks = state.tasks.slice()
      tasks[index] = nextTask
      return { ...state, tasks }
    }

    default:
      return state
  }
}
