# Module 2 Assignment: Task Manager

## Tech Stack
- React (Vite)
- React Router
- Context API + useReducer

## Features Implemented
- Task list page at `/tasks`
- Task detail page at `/tasks/:id`
- Reducer actions: `ADD_TASK`, `DELETE_TASK`, `SET_FILTER` (plus optional `UPDATE_TASK`)
- Context provides: `tasks`, `filteredTasks`, `filter`, `addTask`, `deleteTask`, `setFilter`
- Add task form with controlled inputs
- Delete action on each task row
- Status filter bar with All, To Do, In Progress, Done
- Task-not-found state for invalid detail routes

## Bonus Features Completed
- Easy: task count summary (`Showing X of Y tasks`)
- Easy: disable Add Task button when required fields are empty
- Medium: persist tasks and active status filter with `localStorage`
- Medium: `UPDATE_TASK` support with inline edit form on task detail page
- Hard: native drag-and-drop task reordering using browser drag events
- Hard: priority filter layered on top of status filter

## Additional Features
- Dark mode switcher
- Easter egg modal

## Install and Run
1. Install dependencies
   - `npm install` (or `pnpm install` if pnpm is available)
2. Start development server
   - `npm run dev` (or `pnpm dev`)
3. Build for production
   - `npm run build` (or `pnpm build`)
4. Preview production build
   - `npm run preview` (or `pnpm preview`)

## Screenshot
 A screenshot of the landing page is viewable here `public/screenshot-task-manager.png`) 

A working prototype of the app is visible at : https://taskmansctp.netlify.app/tasks

## AI and External Tools Used
- GitHub Copilot and ChatGPT were used for architecture checks, routing validation, and debugging support.
- No external repository code was copied verbatim.
- The assignment was converted into Business Requirements. Then a Spec was developed and the Spec was coded using tools like GitHab Copilot and Claude Code. Some of the interface designs were prototyped using Vercel V0
