import { useEffect, useState } from "react"
import { Heart, X, Sparkles } from "lucide-react"

export default function EasterEggModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)

  // Open flips from the parent. Mounting here (instead of in an effect)
  // keeps the enter animation without a second render from setState-in-effect.
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setMounted(true)
      setClosing(false)
    }
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") handleClose()
    }
    if (mounted) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  function handleClose() {
    setClosing(true)
    window.setTimeout(() => {
      setMounted(false)
      onClose()
    }, 220)
  }

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        closing ? "opacity-0 transition-opacity duration-200" : "animate-overlay-in"
      }`}
    >
      <div aria-hidden onClick={handleClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="easter-egg-title"
        className={`glass relative w-full max-w-sm rounded-3xl border border-border/60 p-8 text-center shadow-2xl ${
          closing ? "opacity-0 scale-95 transition-all duration-200" : "animate-modal-in"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/20">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>

        <h2 id="easter-egg-title" className="text-lg font-semibold tracking-tight text-balance">
          You found the easter egg!
        </h2>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground text-pretty">
          Developed with <Heart className="h-4 w-4 fill-red-500 text-red-500" aria-label="love" /> by Debashis Ghosh &amp; AI
          Assistants (Github Copilot, Vercel V0)
        </p>

        <button
          type="button"
          onClick={handleClose}
          className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Close
        </button>
      </div>
    </div>
  )
}
