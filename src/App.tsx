import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { LoginPage } from "@/pages/login"
import { PipelinePage } from "@/pages/pipeline"
import { DeadlinesPage } from "@/pages/deadlines"
import { SchedulePage } from "@/pages/schedule"
import { WorkloadPage } from "@/pages/workload"

function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/pipeline" replace />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="deadlines" element={<DeadlinesPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="workload" element={<WorkloadPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
