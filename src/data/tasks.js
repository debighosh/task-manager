// Labels, colours, and the allowed status/priority values for the controls.
// Task records are loaded from the API. dueDate is part of that JSON but
// this UI does not edit it; updates send the value back unchanged.

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
