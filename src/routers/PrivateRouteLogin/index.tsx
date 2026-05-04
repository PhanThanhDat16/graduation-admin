import { HOME_PAGE } from '@/constants'
import { useAuthStore } from '@/store/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRouteLogin = () => {
  const { accessToken } = useAuthStore()

  if (accessToken) {
    return <Navigate to={HOME_PAGE} replace />
  }

  return (
    <>
      <Outlet />
    </>
  )
}

export default PrivateRouteLogin
