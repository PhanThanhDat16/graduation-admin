import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts'
import {
  CHAT_PAGE,
  CONTRACT_PAGE,
  CUSTOMER_PAGE,
  DISPUTE_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  NOTIFICATION_PAGE,
  POST_PAGE,
  PROFILE_PAGE,
  PROJECT_PAGE,
  SETTING_PAGE,
  STAFF_PAGE,
  TRANSACTION_PAGE,
  WALLET_PAGE
} from '../constants'
import NotFoundPage from '../pages/NotFoundPage'
import PrivateRoute from './PrivateRoute'
import AdminOnlyRoute from './AdminOnlyRoute'
import PrivateRouteLogin from './PrivateRouteLogin'
import HomePage from '../pages/HomePage'
import ProjectPage from '../pages/ProjectPage'
import ContractPage from '../pages/ContractPage'
import CustomerPage from '../pages/CustomerPage'
import TransactionPage from '../pages/TransactionPage'
import DisputePage from '../pages/DisputePage'
import StaffPage from '../pages/StaffPage'
import WalletPage from '../pages/WalletPage'
import PostPage from '../pages/PostPage'
import ChatPage from '../pages/ChatPage'
import NotificationPage from '../pages/Notification'
import SettingPage from '../pages/SettingPage'
import ProfilePage from '../pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path={`/`} element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={HOME_PAGE} element={<HomePage />} />
            <Route path={PROJECT_PAGE} element={<ProjectPage />} />
            <Route path={CONTRACT_PAGE} element={<ContractPage />} />
            <Route path={CUSTOMER_PAGE} element={<CustomerPage />} />
            <Route path={TRANSACTION_PAGE} element={<TransactionPage />} />
            <Route path={DISPUTE_PAGE} element={<DisputePage />} />
            <Route path={POST_PAGE} element={<PostPage />} />
            <Route path={CHAT_PAGE} element={<ChatPage />} />
            <Route path={NOTIFICATION_PAGE} element={<NotificationPage />} />
            <Route path={SETTING_PAGE} element={<SettingPage />} />
            <Route path={PROFILE_PAGE} element={<ProfilePage />} />

            {/* Admin only pages */}
            <Route element={<AdminOnlyRoute />}>
              <Route path={STAFF_PAGE} element={<StaffPage />} />
              <Route path={WALLET_PAGE} element={<WalletPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PrivateRouteLogin />}>
          <Route path={LOGIN_PAGE} element={<LoginPage />} />
          {/* login page */}
        </Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouters
