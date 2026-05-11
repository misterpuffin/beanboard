import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { LoginPage } from "@/pages/login"
import { BoardPage } from "@/pages/board"
import { DeadlinesPage } from "@/pages/deadlines"
import { SchedulePage } from "@/pages/schedule"
import { WorkloadPage } from "@/pages/workload"
import { NotFoundPage } from "@/pages/not-found"

function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/board" replace />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="deadlines" element={<DeadlinesPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="workload" element={<WorkloadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
