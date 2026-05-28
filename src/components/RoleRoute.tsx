import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Spinner from './Spinner'

interface RoleRouteProps {
    allowedRole: 'admin' | 'agent' | 'user'
}

function RoleRoute({ allowedRole }: RoleRouteProps) {
    const { user, token } = useAuthStore()

    // Token presente ma utente non ancora caricato: aspetta
    if (token && !user) {
        return <Spinner />
    }

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