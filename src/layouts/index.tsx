import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import AppSidebar from '../components/SiderBar'
import AppHeader from '../components/Header'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)

  const handleChange = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout>
      <AppSidebar collapsed={collapsed} />
      <Layout className="max-h-screen">
        <AppHeader collapsed={collapsed} onToggle={handleChange} />
        <Content style={{ padding: 24, minHeight: 200, borderRadius: 8 }} className="overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
