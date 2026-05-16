import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts'
import {
  CHAT_PAGE,
  CONTRACT_PAGE,
  FREELANCER_PAGE,
  CONTRACTOR_PAGE,
  DISPUTE_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  NOTIFICATION_PAGE,
  PROFILE_PAGE,
  PROJECT_PAGE,
  SETTING_PAGE,
  STAFF_PAGE,
  TRANSACTION_PAGE,
  WALLET_PAGE,
  USERDETAIL_PAGE,
  WITHDRAW_PAGE,
  FORGOTPASSWORD_PAGE
} from '../constants'
import NotFoundPage from '../pages/NotFoundPage'
import PrivateRoute from './PrivateRoute'
import AdminOnlyRoute from './AdminOnlyRoute'
import PrivateRouteLogin from './PrivateRouteLogin'
import HomePage from '../pages/HomePage'
import ProjectPage from '../pages/ProjectPage'
import ProjectDetail from '../pages/ProjectPage/Detail'
import ContractPage from '../pages/ContractPage'
import ContractDetail from '../pages/ContractPage/Detail'
import FreelancerPage from '../pages/FreelancerPage'
import ContractorPage from '../pages/ContractorPage'
import TransactionPage from '../pages/TransactionPage'
import TransactionDetail from '../pages/TransactionPage/Detail'
import DisputePage from '../pages/DisputePage'
import DisputeDetail from '../pages/DisputePage/Detail'
import StaffPage from '../pages/StaffPage'
import StaffDetail from '../pages/StaffPage/Detail'
import WalletPage from '../pages/WalletPage'
import WalletDetail from '../pages/WalletPage/Detail'
import ChatPage from '../pages/ChatPage'
import ChatDetail from '../pages/ChatPage/Detail'
import NotificationPage from '../pages/Notification'
import NotificationDetail from '../pages/Notification/Detail'
import SettingPage from '../pages/SettingPage'
import ProfilePage from '../pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import UserDetail from '@/pages/UserDetailPage'
import WithDrawPage from '@/pages/Withdraw'
import ForgotPassword from '@/pages/ForgotPassword'

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path={`/`} element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={HOME_PAGE} element={<HomePage />} />
            <Route path={PROJECT_PAGE} element={<ProjectPage />} />
            <Route path={`${PROJECT_PAGE}/:id`} element={<ProjectDetail />} />
            <Route path={CONTRACT_PAGE} element={<ContractPage />} />
            <Route path={`${CONTRACT_PAGE}/:id`} element={<ContractDetail />} />
            <Route path={FREELANCER_PAGE} element={<FreelancerPage />} />
            <Route path={CONTRACTOR_PAGE} element={<ContractorPage />} />
            <Route path={`${USERDETAIL_PAGE}/:id`} element={<UserDetail />} />
            <Route path={TRANSACTION_PAGE} element={<TransactionPage />} />
            <Route path={`${TRANSACTION_PAGE}/:id`} element={<TransactionDetail />} />
            <Route path={WITHDRAW_PAGE} element={<WithDrawPage />} />
            <Route path={DISPUTE_PAGE} element={<DisputePage />} />
            <Route path={`${DISPUTE_PAGE}/:id`} element={<DisputeDetail />} />
            <Route path={CHAT_PAGE} element={<ChatPage />} />
            <Route path={`${CHAT_PAGE}/:id`} element={<ChatDetail />} />
            <Route path={NOTIFICATION_PAGE} element={<NotificationPage />} />
            <Route path={`${NOTIFICATION_PAGE}/:id`} element={<NotificationDetail />} />
            <Route path={SETTING_PAGE} element={<SettingPage />} />
            <Route path={PROFILE_PAGE} element={<ProfilePage />} />
            <Route path={WALLET_PAGE} element={<WalletPage />} />
            <Route path={`${WALLET_PAGE}/:id`} element={<WalletDetail />} />

            {/* Admin only pages */}
            <Route element={<AdminOnlyRoute />}>
              <Route path={STAFF_PAGE} element={<StaffPage />} />
              <Route path={`${STAFF_PAGE}/:id`} element={<StaffDetail />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PrivateRouteLogin />}>
          <Route path={LOGIN_PAGE} element={<LoginPage />} />
          <Route path={FORGOTPASSWORD_PAGE} element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouters
