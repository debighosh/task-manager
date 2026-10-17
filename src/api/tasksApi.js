// Talks to the TaskFlow Spring Boot API. The UI keeps its own copy of the
// list, but every read and write goes through these functions so ids and
// due dates stay the ones the server stored.

const DEFAULT_ORIGIN = "http://localhost:8080"

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// Strips a trailing slash so a base of "https://api.example/" does not
// request "//api/tasks". An empty value means local Spring Boot.
export function resolveApiOrigin(configured) {
  const value = typeof configured === "string" ? configured.trim() : ""
  return (value || DEFAULT_ORIGIN).replace(/\/+$/, "")
}

// Vite inlines this exact `import.meta.env.VITE_API_URL` access at build time
// (the Railway origin on Netlify). Reading it off a copied env object gets
// stripped, so a production build would ignore the variable. Local `pnpm dev`
// leaves it unset.
export function getApiOrigin() {
  let configured = ""
  try {
    configured = import.meta.env.VITE_API_URL
  } catch {
    // Node can import this module in tests, where import.meta.env is missing.
    configured = ""
  }
  return resolveApiOrigin(configured)
}

function messageFrom(payload, status) {
  if (payload && typeof payload === "object") {
    for (const key of ["detail", "message"]) {
      const value = payload[key]
      if (typeof value !== "string") continue
      const text = value.trim()
      // Spring's default error JSON uses this placeholder when the real
      // reason is hidden. Fall through to a message we wrote ourselves.
      if (text && text !== "No message available") return text
    }
  }

  if (status === 400) {
    return "The server rejected that task. Check the title, status, and priority."
  }
  if (status === 404) {
    return "That task could not be found. It may have been deleted."
  }
  if (status >= 500) {
    return "The task server had a problem. Please try again in a moment."
  }
  return "Something went wrong while talking to the task server."
}

async function parseBody(response) {
  if (response.status === 204) return null
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

async function request(path, { method = "GET", body } = {}) {
  const origin = getApiOrigin()
  const headers = { Accept: "application/json" }
  const init = { method, headers }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
    init.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${origin}${path}`, init)
  } catch {
    throw new ApiError(
      `We couldn't reach the task server at ${origin}. Check that it is running, then try again.`,
      0,
    )
  }

  const payload = await parseBody(response)
  if (!response.ok) {
    throw new ApiError(messageFrom(payload, response.status), response.status)
  }
  return payload
}

function normalizeId(id) {
  if (typeof id === "number" && Number.isFinite(id)) return id
  if (typeof id === "string" && id.trim() && Number.isFinite(Number(id))) return Number(id)
  return id
}

// The form expects strings. The API may send null description or dueDate,
// and the id has to be the server's so /tasks/:id matches the database.
export function normalizeTask(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new ApiError("The task server returned an unexpected response.")
  }
  if (raw.id === undefined || raw.id === null || raw.id === "") {
    throw new ApiError("The task server returned a task without an id.")
  }

  return {
    id: normalizeId(raw.id),
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : "",
    status: typeof raw.status === "string" ? raw.status : "todo",
    priority: typeof raw.priority === "string" ? raw.priority : "medium",
    dueDate: typeof raw.dueDate === "string" && raw.dueDate.trim() ? raw.dueDate : null,
  }
}

export async function listTasks() {
  const payload = await request("/api/tasks")
  if (!Array.isArray(payload)) {
    throw new ApiError("The task server returned an unexpected response.")
  }
  return payload.map(normalizeTask)
}

export async function getTask(id) {
  return normalizeTask(await request(`/api/tasks/${encodeURIComponent(id)}`))
}

export async function createTask(input) {
  const created = await request("/api/tasks", {
    method: "POST",
    body: {
      title: input.title,
      description: input.description ?? "",
      status: input.status,
      priority: input.priority,
    },
  })
  return normalizeTask(created)
}

// PUT expects the whole task. dueDate is not edited here, but dropping it
// would risk clearing a date another client stored, so we send it back.
export async function updateTask(id, task) {
  const updated = await request(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: {
      id: task.id,
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? null,
    },
  })
  return normalizeTask(updated)
}

export async function deleteTask(id) {
  await request(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" })
}
