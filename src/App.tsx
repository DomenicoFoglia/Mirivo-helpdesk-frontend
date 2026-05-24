import { useEffect } from 'react'
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
import { agentNavItems } from './navigation/agentNav'
import { userNavItems } from './navigation/userNav'
import useAuthStore from './store/authStore'
import { getMeApi } from './api/user'
import UserTicket from './pages/user/UserTicket'
import AgentTicket from './pages/agent/AgentTicket'
import AdminTicket from './pages/admin/AdminTicket'
import { Toaster } from "react-hot-toast"

function App() {
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (token) {
      getMeApi()
        .then((response) => setUser(response.data))
        .catch(() => logout())
    }
  }, [])

  return (
    <>
      {/* Toaster */}
      <Toaster position="top-right" />

      {/* Rotte */}
      <Routes>
        {/* Pubbliche */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protette */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRole="user" />}>
            <Route element= {<AppShell navItems={userNavItems} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/ticket/:id" element={<UserTicket />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRole="agent" />}>
            <Route element={<AppShell navItems={agentNavItems} />}>
              <Route path="/agent/dashboard" element={<AgentDashboard />} />
              <Route path="/agent/ticket/:id" element={<AgentTicket />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRole="admin" />}>
            <Route element={<AppShell navItems={adminNavItems} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/ticket/:id" element={<AdminTicket />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<h1>404 - Pagina non trovata</h1>} />
      </Routes>
    </>
    
  )
}

export default App