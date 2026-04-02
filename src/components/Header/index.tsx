import { Avatar, Button, Dropdown, Space, theme } from 'antd'
import type { MenuProps } from 'antd'
import {
  BellOutlined,
  BulbOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../contexts/ThemeContext'
import { Header } from 'antd/es/layout/layout'
import { useAuthStore } from '@/store/useAuthStore'

const { useToken } = theme

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const AppHeader = ({ collapsed, onToggle }: Props) => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const { logOut } = useAuthStore()
  const nav = useNavigate()

  const handleLogout = async () => {
    try {
      await logOut()
      nav('/login')
    } catch (error) {
      console.error(error)
    }
  }

  const items = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'Profile'
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: 'Settings'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log Out'
    }
  ]

  const { token } = useToken()

  const onAvatarMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      handleLogout()
      return
    }
    nav(`/${key}`)
  }

  return (
    <Header className="flex justify-between items-center px-1 shadow-sm" style={{ background: token.colorBgContainer }}>
      <div>
        <Button
          size="large"
          className="text-lg"
          type="text"
          aria-label={collapsed ? 'Mở menu' : 'Thu gọn menu'}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
        />
      </div>

      <div className="flex items-center">
        <Button size="large" type="dashed" onClick={toggleTheme} className="text-lg">
          {isDark ? <BulbOutlined /> : <MoonOutlined />}
        </Button>
        <Button type="text" className="text-lg" size="large">
          <BellOutlined
            onClick={() => {
              nav('/notification')
            }}
          />
        </Button>

        <Dropdown menu={{ items, onClick: onAvatarMenuClick }} placement="bottomRight">
          <Space className="px-2">
            <Avatar size={'large'} icon={<UserOutlined />} className="cursor-pointer" />
            <div>Nguyễn Văn A</div>
          </Space>
        </Dropdown>
      </div>
    </Header>
  )
}

export default AppHeader
