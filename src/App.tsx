import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserDashboard from './pages/user/Dashboard'
import AgentDashboard from './pages/agent/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import AppShell from './components/layout/AppShell'
import { adminNavItems } from './navigation/adminNav'

function App() {
  return (
    <Routes>
      {/* Pubbliche */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protette */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="user" />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        <Route element={<RoleRoute allowedRole="agent" />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
        </Route>

        <Route element={<RoleRoute allowedRole="admin" />}>
          <Route element={<AppShell navItems={adminNavItems} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<h1>404 - Pagina non trovata</h1>} />
    </Routes>
  )
}

export default App