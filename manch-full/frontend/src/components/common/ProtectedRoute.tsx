import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface Props { role?: 'ARTIST' | 'VENUE' | 'ADMIN' }

export default function ProtectedRoute({ role }: Props) {
  const { isLoggedIn, user } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}
