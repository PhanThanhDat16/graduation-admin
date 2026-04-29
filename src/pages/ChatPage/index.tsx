import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Card, Input, List, Space, Typography, theme, Skeleton, Segmented } from 'antd'
import { UserOutlined, FileTextOutlined, CustomerServiceOutlined, MessageOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { CHAT_PAGE } from '@/constants'
import { chatService } from '@/apis/chatService'
import type { ConversationResponse } from '@/types/chat'
import { useStoreSocketIO } from '@/store/useSocketStore'

const { Title, Text } = Typography

const ChatPage = () => {
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [groups, setGroups] = useState<ConversationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const { socket, connect, joinStaffGeneral } = useStoreSocketIO()

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : undefined
      const res = await chatService.getAllConversations(params)
      const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      setGroups(data)
    } catch (error) {
      console.error('Failed to fetch groups:', error)
      setGroups([])
    } finally {
      setLoading(false)
    }
  }, [selectedType])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    if (!socket) {
      connect()
    } else {
      joinStaffGeneral()
    }
  }, [socket, connect, joinStaffGeneral])

  useEffect(() => {
    if (socket) {
      const handleSocketUpdate = () => {
        fetchGroups()
      }

      socket.on('new_conversation', handleSocketUpdate)
      socket.on('new_message', handleSocketUpdate)

      return () => {
        socket.off('new_conversation', handleSocketUpdate)
        socket.off('new_message', handleSocketUpdate)
      }
    }
  }, [socket, fetchGroups])

  const getThreadDisplayInfo = (item: ConversationResponse) => {
    switch (item.type) {
      case 'contract_chat':
        return {
          title: `Hợp đồng: ${item._id.slice(-6)}`,
          subtitle: 'Thảo luận hợp đồng',
          icon: <FileTextOutlined />,
          color: token.colorWarning
        }
      case 'guest_support':
        return {
          title: item.guestName || 'Khách vãng lai',
          subtitle: 'Hỗ trợ khách',
          icon: <CustomerServiceOutlined />,
          color: token.colorInfo
        }
      case 'user_support':
        return {
          title: item.ownerInfo?.full_name || 'Người dùng',
          subtitle: 'Hỗ trợ thành viên',
          icon: <UserOutlined />,
          color: token.colorPrimary
        }
      default:
        return {
          title: 'Hội thoại',
          subtitle: 'Hỗ trợ',
          icon: <MessageOutlined />,
          color: token.colorPrimary
        }
    }
  }

  const searchLower = search.trim().toLowerCase()
  const filteredThreads = (Array.isArray(groups) ? groups : []).filter((t) => {
    if (!searchLower) return true
    const { title } = getThreadDisplayInfo(t)
    return title.toLowerCase().includes(searchLower) || (t.lastMessage || '').toLowerCase().includes(searchLower)
  })

  const handleViewDetail = (item: ConversationResponse) => {
    navigate(`${CHAT_PAGE}/${item._id}`)
  }

  const renderThreadItem = (item: ConversationResponse) => {
    const displayInfo = getThreadDisplayInfo(item)
    const unreadCount = (item as any).unreadCount || 0

    return (
      <List.Item
        onClick={() => handleViewDetail(item)}
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-4 rounded-lg mx-2"
        style={{ borderBlockEnd: 'none' }}
      >
        <List.Item.Meta
          avatar={
            <Badge dot={unreadCount > 0} offset={[-2, 32]} color="red">
              <Avatar icon={displayInfo.icon} style={{ backgroundColor: displayInfo.color }} size="large" />
            </Badge>
          }
          title={
            <div className="flex justify-between items-center">
              <Text strong className={unreadCount > 0 ? 'text-blue-600' : ''}>
                {displayInfo.title}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {dayjs(item.lastMessageAt || item.createdAt).format('HH:mm DD/MM')}
              </Text>
            </div>
          }
          description={
            <div className="flex flex-col">
              <div style={{ marginBottom: 4 }}>
                <Badge
                  status={item.type === 'contract_chat' ? 'warning' : 'processing'}
                  text={<span style={{ fontSize: 12, color: token.colorTextSecondary }}>{displayInfo.subtitle}</span>}
                />
              </div>
              <Text
                ellipsis
                type={unreadCount > 0 ? undefined : 'secondary'}
                style={{ fontWeight: unreadCount > 0 ? 600 : 400 }}
              >
                {item.lastMessage || 'Chưa có tin nhắn'}
              </Text>
            </div>
          }
        />
      </List.Item>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Hội thoại trực tuyến
          </Title>
          <Text type="secondary">Quản lý và phản hồi các yêu cầu hỗ trợ hoặc thảo luận hợp đồng.</Text>
        </div>

        <Card styles={{ body: { padding: '16px 0' } }}>
          <div className="px-4 pb-4 border-b border-gray-100 dark:border-slate-700 mb-2">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Segmented
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Khách', value: 'guest_support' },
                  { label: 'Thành viên', value: 'user_support' },
                  { label: 'Hợp đồng', value: 'contract_chat' }
                ]}
                value={selectedType}
                onChange={(value) => setSelectedType(value as string)}
                className="w-full md:w-auto"
              />
              <Input.Search
                allowClear
                placeholder="Tìm kiếm hội thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: 300 }}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 2 }} className="mb-4" />
              ))}
            </div>
          ) : (
            <List
              dataSource={filteredThreads}
              renderItem={renderThreadItem}
              locale={{ emptyText: 'Không tìm thấy hội thoại nào' }}
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                className: 'px-4 mt-4'
              }}
            />
          )}
        </Card>
      </Space>
    </div>
  )
}

export default ChatPage
