import { useAuthStore } from '@/store/useAuthStore'
import { Outlet, Navigate } from 'react-router-dom'

const AdminOnlyRoute = () => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" state={{ message: 'Không có quyền!' }} replace />
  }
  return (
    <>
      <Outlet />
    </>
  )
}

export default AdminOnlyRoute
