import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import AppSidebar from '../components/SiderBar'
import AppHeader from '../components/Header'
import { Content } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { useStoreSocketIO } from '@/store/useSocketStore'

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { disconnect, connect } = useStoreSocketIO()

  const handleChange = () => {
    setCollapsed(!collapsed)
  }

  // Connect socket
  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [])

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
