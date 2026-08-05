import { useRef } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"
import ThemeToggle from "./ThemeToggle.jsx"
import { useTasks } from "../context/TaskContext.jsx"

export default function Header({ onTripleClick }) {
  const { isDark } = useTasks()
  const clickCount = useRef(0)
  const timer = useRef(null)

  function handleTitleClick() {
    clickCount.current += 1
    if (timer.current) window.clearTimeout(timer.current)
    if (clickCount.current === 3) {
      clickCount.current = 0
      onTripleClick()
      return
    }
    timer.current = window.setTimeout(() => {
      clickCount.current = 0
    }, 600)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            to="/tasks"
            aria-label="Go to task list"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
          >
            <CheckCircle2 className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={handleTitleClick}
            className="select-none text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
            title="TaskMan"
          >
            TaskMan
          </button>
          <span className="hidden rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline-block">
            Design Preview
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{isDark ? "Dark" : "Light"} mode</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
