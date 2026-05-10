import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

interface RoleRouteProps {
    allowedRole: 'admin' | 'agent' | 'user'
}

function RoleRoute({ allowedRole }: RoleRouteProps) {
    const { user } = useAuthStore()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Se il ruolo non corrisponde alla pagina richiesta, rimanda alla pagina del suo ruolo
    if (user.role !== allowedRole) {
        return <Navigate to={`/${user.role}/dashboard`} replace />
    }

    return <Outlet />
}

export default RoleRoute