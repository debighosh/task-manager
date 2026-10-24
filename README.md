# Module 2 Assignment: Task Manager

## Tech Stack
- React (Vite)
- React Router
- Context API + useReducer

## Features Implemented
- Task list page at `/tasks` loaded from the TaskFlow API (`GET /api/tasks`)
- Task detail page at `/tasks/:id`
- Create, edit, status change, and delete go through the API and keep the server's id
- Reducer actions: `SET_TASKS`, `ADD_TASK`, `DELETE_TASK`, `SET_FILTER`, `UPDATE_TASK`
- Context provides: `tasks`, `filteredTasks`, `filter`, `addTask`, `deleteTask`, `setFilter`
- Add task form with controlled inputs
- Delete action on each task row
- Status filter bar with All, To Do, In Progress, Done
- Loading state, and an error state with retry when the API cannot be reached
- Task-not-found state for invalid detail routes

## Bonus Features Completed
- Easy: task count summary (`Showing X of Y tasks`)
- Easy: disable Add Task button when required fields are empty
- Medium: persist the active status filter with `localStorage` (the task list itself comes from the API)
- Medium: `UPDATE_TASK` support with inline edit form on task detail page
- Hard: native drag-and-drop task reordering using browser drag events
- Hard: priority filter layered on top of status filter

## Additional Features
- Dark mode switcher
- Easter egg modal

## Install and Run
Use pnpm (`packageManager` is `pnpm@10.33.4`). Do not use npm; that would create a `package-lock.json` this project does not use.

1. Install dependencies
   - `pnpm install`
2. Start the TaskFlow API on port 8080 (see below)
3. Start the development server
   - `pnpm dev`
4. Build for production
   - `pnpm build`
5. Preview production build
   - `pnpm preview`
6. Lint
   - `pnpm lint`

## Run locally against the API
The app reads `import.meta.env.VITE_API_URL`. When that variable is unset, requests go to `http://localhost:8080`. A trailing slash on the origin is stripped. Paths are always `/api/tasks`.

1. Start the Spring Boot TaskFlow API so it listens on port 8080.
2. Allow this Vite origin. The API reads `ALLOWED_ORIGINS` and, when that variable is unset, already allows `http://localhost:5173`.
3. From this repo, run `pnpm dev` and open `http://localhost:5173`. The dashboard loads the tasks stored on the server.

To point at a deployed API instead, copy `.env.example` to `.env` and set `VITE_API_URL` to the origin only, for example `https://your-api.up.railway.app`. Restart `pnpm dev` after changing it. A Netlify build inlines the same variable (see `docs/NETLIFY.md`).

## Screenshot
 A screenshot of the landing page is viewable here `public/screenshot-task-manager.png`) 

A working prototype of the app is visible at : https://taskmansctp.netlify.app/tasks

## AI and External Tools Used
- GitHub Copilot and ChatGPT were used for architecture checks, routing validation, and debugging support.
- No external repository code was copied verbatim.
- The assignment was converted into Business Requirements. Then a Spec was developed and the Spec was coded using tools like GitHab Copilot and Claude Code. Some of the interface designs were prototyped using Vercel V0
