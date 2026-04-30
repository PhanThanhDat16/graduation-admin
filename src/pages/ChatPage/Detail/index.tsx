import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Button,
  Space,
  Input,
  Row,
  Col,
  Avatar,
  Divider,
  theme,
  Tooltip,
  Skeleton,
  message
} from 'antd'
import {
  ArrowLeftOutlined,
  SendOutlined,
  InfoCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useState, useRef, useEffect } from 'react'
import { chatService } from '@/apis/chatService'
import { useAuthStore } from '@/store/useAuthStore'
import type { ConversationResponse } from '@/types/chat'
import { CHAT_PAGE, CONTRACT_PAGE, FREELANCER_PAGE } from '@/constants'
import { useStoreSocketIO } from '@/store/useSocketStore'
import { emitJoinConversation } from '@/services/socketConversation'

const { Title, Text } = Typography

interface Message {
  _id: string
  content: string
  senderId?:
    | {
        _id: string
        full_name: string
        avatar: string
      }
    | string
  senderName?: string
  createdAt: string
}

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { user } = useAuthStore()
  const { socket } = useStoreSocketIO()

  const [conversation, setConversation] = useState<ConversationResponse | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchData = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [convRes, msgRes] = await Promise.all([
        chatService.getConversationGroupById(id),
        chatService.getMessagesInGroup(id)
      ])

      const convData = convRes.data?.data || convRes.data || null
      setConversation(convData)

      const msgData = Array.isArray(msgRes.data?.data)
        ? msgRes.data.data
        : Array.isArray(msgRes.data)
          ? msgRes.data
          : []
      setMessages(msgData)
    } catch (error) {
      console.error('Failed to fetch chat details:', error)
      message.error('Không thể tải nội dung cuộc hội thoại')
      setMessages([])
    } finally {
      setLoading(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (socket && id) {
      // Join conversation room to receive real-time updates
      emitJoinConversation(socket, id)

      const handleNewMessage = (msg: any) => {
        // Skip own messages — already handled via API response in handleSendMessage
        const msgSenderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId
        if (msgSenderId === user?._id) return

        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id)
          if (exists) return prev
          return [...prev, msg]
        })
        setTimeout(scrollToBottom, 100)
      }

      socket.on('new_message', handleNewMessage)

      return () => {
        socket.off('new_message', handleNewMessage)
      }
    }
  }, [socket, id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !id || !user || sending) return

    setSending(true)
    try {
      const payload = {
        content: inputValue,
        userId: user._id,
        guestName: 'Admin',
        type: 'text'
      }
      const res = await chatService.createMessageInGroup(id, payload)
      console.log('Message sent response:', res)
      const newMessage = res.data?.data || res.data
      if (newMessage) {
        setMessages((prev) => [...(Array.isArray(prev) ? prev : []), newMessage])
      }
      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
      message.error('Gửi tin nhắn thất bại')
    } finally {
      setSending(false)
    }
  }

  const getHeaderInfo = () => {
    if (!conversation) return { title: 'Hội thoại', subtitle: '', icon: <UserOutlined />, color: token.colorPrimary }

    switch (conversation.type) {
      case 'contract_chat':
        return {
          title: `Hợp đồng: ${conversation._id.slice(-6)}`,
          subtitle: 'Thảo luận hợp đồng',
          icon: <FileTextOutlined />,
          color: token.colorWarning,
          link: `${CONTRACT_PAGE}/${conversation._id}`
        }
      case 'guest_support':
        return {
          title: conversation.guestName || 'Khách vãng lai',
          subtitle: 'Hỗ trợ khách',
          icon: <CustomerServiceOutlined />,
          color: token.colorInfo,
          link: null
        }
      case 'user_support':
        return {
          title: conversation.ownerInfo?.full_name || 'Người dùng',
          subtitle: 'Hỗ trợ thành viên',
          icon: <UserOutlined />,
          color: token.colorPrimary,
          link: `${FREELANCER_PAGE}/${conversation.ownerId}`
        }
      default:
        return {
          title: 'Hội thoại',
          subtitle: 'Hỗ trợ',
          icon: <UserOutlined />,
          color: token.colorPrimary,
          link: null
        }
    }
  }

  const headerInfo = getHeaderInfo()

  if (loading && !conversation) {
    return (
      <div className="p-6">
        <Card style={{ marginBottom: 16 }}>
          <Skeleton active avatar paragraph={{ rows: 1 }} />
        </Card>
        <Card styles={{ body: { padding: 24 } }}>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Card
        styles={{ body: { padding: '12px 24px' } }}
        style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center justify-between">
          <Space size="middle">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(CHAT_PAGE)}
              style={{ fontSize: 18 }}
            />
            <Avatar size={40} icon={headerInfo.icon} style={{ backgroundColor: headerInfo.color }} />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {headerInfo.title}
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {headerInfo.subtitle}
              </Text>
            </div>
          </Space>
          {headerInfo.link && (
            <Tooltip title="Xem chi tiết">
              <Button type="text" icon={<InfoCircleOutlined />} onClick={() => navigate(headerInfo.link!)} />
            </Tooltip>
          )}
        </div>
      </Card>

      {/* Chat Messages Area */}
      <Card
        className="flex flex-col flex-1 overflow-hidden"
        styles={{
          body: {
            overflow: 'auto',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }}
        style={{ borderRadius: 8 }}
      >
        <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ background: token.colorBgLayout + '40' }}>
          {!loading && (!Array.isArray(messages) || messages.length === 0) ? (
            <div className="flex items-center justify-center h-full">
              <Text type="secondary">Chưa có tin nhắn nào trong cuộc hội thoại này.</Text>
            </div>
          ) : (
            (Array.isArray(messages) ? messages : []).map((msg, idx) => {
              const msgSenderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId
              const isMe = msgSenderId === user?._id
              const prevMsg = idx > 0 ? messages[idx - 1] : null
              const prevSenderId = prevMsg
                ? typeof prevMsg.senderId === 'object'
                  ? prevMsg.senderId?._id
                  : prevMsg.senderId
                : null
              const showSender = idx === 0 || prevSenderId !== msgSenderId

              const senderName =
                typeof msg.senderId === 'object' ? msg.senderId?.full_name : msg.senderName || 'Người dùng'

              return (
                <div key={msg._id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && showSender && (
                    <Text type="secondary" style={{ fontSize: 11, marginBottom: 4, marginLeft: 4 }}>
                      {senderName}
                    </Text>
                  )}
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 16px',
                      borderRadius: 16,
                      backgroundColor: isMe ? token.colorPrimary : token.colorBgContainer,
                      color: isMe ? '#fff' : token.colorText,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      borderTopRightRadius: isMe ? 4 : 16,
                      borderTopLeftRadius: !isMe ? 4 : 16
                    }}
                  >
                    <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 10, marginTop: 2 }}>
                    {dayjs(msg.createdAt).format('HH:mm')}
                  </Text>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Divider style={{ margin: 0 }} />
        <div className="p-4" style={{ backgroundColor: token.colorBgContainer }}>
          <Row gutter={12} align="middle">
            <Col flex="auto">
              <Input
                placeholder="Nhập tin nhắn..."
                size="large"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSendMessage}
                style={{ borderRadius: 24 }}
                disabled={sending}
              />
            </Col>
            <Col flex="none">
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                size="large"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sending}
                loading={sending}
              />
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  )
}

export default ChatDetail
