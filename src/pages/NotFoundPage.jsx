import { Link } from "react-router-dom"
import { Compass, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-2xl animate-page-in flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground text-pretty">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        to="/tasks"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to task list
      </Link>
    </main>
  )
}
