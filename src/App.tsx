import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { LoginPage } from "@/pages/login"
import { BoardPage } from "@/pages/board"
import { DeadlinesPage } from "@/pages/deadlines"
import { SchedulePage } from "@/pages/schedule"
import { WorkloadPage } from "@/pages/workload"
import { ManagePage } from "@/pages/manage"
import { ManageClientsPage } from "@/pages/manage/clients"
import { ManageCategoriesPage } from "@/pages/manage/categories"
import { ManageStatusesPage } from "@/pages/manage/statuses"
import { ManageTeamPage } from "@/pages/manage/team"
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
          <Route path="manage" element={<ManagePage />}>
            <Route index element={<Navigate to="/manage/clients" replace />} />
            <Route path="clients" element={<ManageClientsPage />} />
            <Route path="categories" element={<ManageCategoriesPage />} />
            <Route path="statuses" element={<ManageStatusesPage />} />
            <Route path="team" element={<ManageTeamPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
