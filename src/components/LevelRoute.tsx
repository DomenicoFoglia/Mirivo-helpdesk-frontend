import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

interface LevelRouteProps {
    requiredLevel: 2
}

function LevelRoute({ requiredLevel }: LevelRouteProps) {
    const { user } = useAuthStore()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.role !== 'agent' || (user.level ?? 0) < requiredLevel) {
        return <Navigate to={`/${user.role}/dashboard`} replace />
    }

    return <Outlet />
}

export default LevelRoute