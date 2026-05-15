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
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import type { MenuProps } from 'antd/es/menu'
import { useMemo } from 'react'

const { useToken } = theme

type Props = {
  collapsed: boolean
}

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const SIDEBAR_ITEMS: MenuItem[] = [
  getItem('Tổng quan', 'home', <AppstoreOutlined />),
  getItem('Dự án', 'project', <ProjectOutlined />),
  getItem('Hợp đồng', 'contract', <PaperClipOutlined />),
  getItem('Freelancer', 'freelancer', <UserOutlined />),
  getItem('Contractor', 'contractor', <UsergroupAddOutlined />),
  getItem('Giao dịch', '', <TransactionOutlined />, [
    getItem('Lịch sử giao dịch', 'transaction'),
    getItem('Yêu cầu rút tiền', 'withdrawrequest')
  ]),
  getItem('Tranh chấp', 'dispute', <WarningOutlined />),
  getItem('Nhân viên', 'staff', <TeamOutlined />),
  getItem('Ví', 'wallet', <WalletOutlined />),
  getItem('Nhắn tin', 'chat', <MessageOutlined />)
]

const AppSidebar = ({ collapsed }: Props) => {
  const { token } = useToken()
  const nav = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  const items = useMemo(() => {
    if (user?.role === 'staff') {
      return SIDEBAR_ITEMS.filter((item) => item?.key !== 'staff')
    }
    return SIDEBAR_ITEMS
  }, [user?.role])

  const handleNavigate = (e: any) => {
    nav(`/${e.key}`)
  }

  const selectedKey = useMemo(() => {
    const path = location.pathname.split('/')[1]
    return path || 'home'
  }, [location.pathname])

  return (
    <Sider
      trigger={null}
      collapsible
      style={{ background: token.colorBgContainer }}
      collapsed={collapsed}
      className="min-h-screen select-none"
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
            FreeWork
          </span>
        )}
      </div>

      <Menu mode="inline" selectedKeys={[selectedKey]} items={items} onClick={handleNavigate} />
    </Sider>
  )
}

export default AppSidebar
