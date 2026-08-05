// Core Domain Model
// Task: { id, title, description, status, priority }
// Note: there is intentionally no date field — it is not part of the domain model.

export const STATUSES = ["todo", "in-progress", "done"]
export const PRIORITIES = ["low", "medium", "high"]

export const STATUS_LABELS = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
}

export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export const priorityStyles = {
  high: "bg-red-500/15 text-red-600 ring-1 ring-red-500/25 dark:text-red-400",
  medium: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/25 dark:text-amber-400",
  low: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400",
}

export const priorityDot = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
}

export const statusStyles = {
  todo: "bg-muted text-muted-foreground ring-1 ring-border",
  "in-progress": "bg-primary/12 text-primary ring-1 ring-primary/25",
  done: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400",
}

export const initialTasks = [
  {
    id: 1,
    title: "Set up project repository",
    description:
      "Initialize the Git repository, configure branch protection rules, and add the base CI pipeline for linting and tests.",
    status: "done",
    priority: "high",
  },
  {
    id: 2,
    title: "Build login page",
    description:
      "Design and implement the authentication screen with email and password fields, validation states, and error handling.",
    status: "in-progress",
    priority: "high",
  },
  {
    id: 3,
    title: "Design dashboard layout",
    description:
      "Create the master dashboard with a collapsible sidebar, analytics summary, and a responsive task grid.",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 4,
    title: "Write API documentation",
    description: "Document all REST endpoints with request and response examples using the OpenAPI specification.",
    status: "todo",
    priority: "low",
  },
  {
    id: 5,
    title: "Integrate email notifications",
    description: "Wire up transactional emails for task assignments, due-date reminders, and weekly digests.",
    status: "todo",
    priority: "medium",
  },
  {
    id: 6,
    title: "Add drag-and-drop reordering",
    description: "Enable reordering tasks within a column and moving them across status columns with smooth animation.",
    status: "todo",
    priority: "low",
  },
]
