import { Moon, Sun } from "lucide-react"
import { useTasks } from "../context/TaskContext.jsx"

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTasks()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="group relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-muted/70 p-1 transition-colors duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        <Sun
          className={`absolute h-4 w-4 text-amber-500 transition-all duration-300 ${
            isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 text-primary transition-all duration-300 ${
            isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  )
}
