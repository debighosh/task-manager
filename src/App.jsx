import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useState } from "react"
import Header from "./components/Header.jsx"
import EasterEggModal from "./components/EasterEggModal.jsx"
import TaskListPage from "./pages/TaskListPage.jsx"
import TaskDetailPage from "./pages/TaskDetailPage.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx"
import { TaskProvider } from "./context/TaskContext.jsx"

export default function App() {
  const [eggOpen, setEggOpen] = useState(false)

  return (
    <BrowserRouter>
      <TaskProvider>
        <div className="min-h-screen bg-background">
          <Header onTripleClick={() => setEggOpen(true)} />
          <Routes>
            {/* Assignment spec: root path must redirect to /tasks. */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <EasterEggModal open={eggOpen} onClose={() => setEggOpen(false)} />
        </div>
      </TaskProvider>
    </BrowserRouter>
  )
}
