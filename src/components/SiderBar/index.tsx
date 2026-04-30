import { Menu, theme } from 'antd'
import Sider from 'antd/es/layout/Sider'
import {
  AppstoreOutlined,
  MessageOutlined,
  PaperClipOutlined,
  ProjectOutlined,
  TeamOutlined,
  TransactionOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  WalletOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

const { useToken } = theme

type Props = {
  collapsed: boolean
}

const AppSidebar = ({ collapsed }: Props) => {
  const { token } = useToken()
  const nav = useNavigate()
  const { user } = useAuthStore()

  let items = [
    {
      key: 'home',
      icon: <AppstoreOutlined />,
      label: 'Tổng quan'
    },
    {
      key: 'project',
      icon: <ProjectOutlined />,
      label: 'Dự án'
    },
    {
      key: 'contract',
      icon: <PaperClipOutlined />,
      label: 'Hợp đồng'
    },
    {
      key: 'freelancer',
      icon: <UserOutlined />,
      label: 'Freelancer'
    },
    {
      key: 'contractor',
      icon: <UsergroupAddOutlined />,
      label: 'Contractor'
    },
    {
      key: 'transaction',
      icon: <TransactionOutlined />,
      label: 'Giao dịch hợp đồng'
    },
    {
      key: 'dispute',
      icon: <WarningOutlined />,
      label: 'Tranh chấp'
    },
    {
      key: `staff`,
      icon: <TeamOutlined />,
      label: 'Nhân viên'
    },
    {
      key: 'wallet',
      icon: <WalletOutlined />,
      label: 'Ví'
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: 'Nhắn tin'
    }
  ]

  // Hide wallet and staff items for staff role
  if (user?.role === 'staff') {
    items = items.filter((item) => item.key !== 'wallet' && item.key !== 'staff')
  }

  const handleNavigate = (e: any) => {
    nav(`/${e.key}`)
  }

  return (
    <Sider
      trigger={null}
      collapsible
      style={{ background: token.colorBgContainer }}
      collapsed={collapsed}
      className="min-h-screen"
    >
      <div className={`flex items-center py-4 ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'}`}>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
          style={{ background: token.colorPrimary }}
        >
          FV
        </div>
        {!collapsed && (
          <span className="truncate text-lg font-bold" style={{ color: token.colorText }}>
            FreeLanceVN
          </span>
        )}
      </div>

      <Menu mode="inline" defaultSelectedKeys={['4']} items={items} onClick={handleNavigate} />
    </Sider>
  )
}

export default AppSidebar
