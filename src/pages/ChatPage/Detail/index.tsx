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
  message,
  Spin,
  Image,
  Tag
} from 'antd'
import {
  ArrowLeftOutlined,
  SendOutlined,
  InfoCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  PictureOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useState, useRef, useEffect } from 'react'
import { chatService } from '@/apis/chatService'
import { uploadImageService } from '@/apis/uploadImageService'
import { useAuthStore } from '@/store/useAuthStore'
import type { ConversationResponse, MessageListResponse, MessageResponse } from '@/types/chat'
import type { Pagination } from '@/types'
import { CHAT_PAGE, CONTRACT_PAGE, USERDETAIL_PAGE } from '@/constants'
import { useStoreSocketIO } from '@/store/useSocketStore'
import { emitJoinConversation } from '@/services/socketConversation'

const { Title, Text } = Typography

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { user } = useAuthStore()
  const { socket } = useStoreSocketIO()

  const [conversation, setConversation] = useState<ConversationResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [sending, setSending] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn tệp hình ảnh')
      return
    }

    // Validate file size (e.g., 1MB)
    if (file.size > 1024 * 1024) {
      message.error('Kích thước ảnh không được vượt quá 1MB')
      return
    }

    setSending(true)
    try {
      const res = await uploadImageService.uploadImage(file)
      const imageUrl = res.data?.image || res.data?.data?.image

      if (imageUrl) {
        const payload = {
          content: imageUrl,
          userId: user._id,
          senderType: 'staff',
          guestName: 'Admin',
          type: 'image'
        }
        const msgRes = await chatService.createMessageInGroup(id, payload)
        const newMessage = msgRes.data?.data || msgRes.data
        if (newMessage) {
          setMessages((prev) => [...(Array.isArray(prev) ? prev : []), newMessage])
        }
        setTimeout(scrollToBottom, 100)
      } else {
        message.error('Không tìm thấy đường dẫn ảnh sau khi tải lên')
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      message.error('Tải ảnh lên thất bại')
    } finally {
      setSending(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
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
      const msgListData = msgRes.data as MessageListResponse
      setConversation(convData)

      const msgData = Array.isArray(msgListData.data) ? msgListData.data : Array.isArray(msgRes.data) ? msgRes.data : []
      setMessages(msgData)
      setPagination(msgListData.pagination)
    } catch (error) {
      console.error('Failed to fetch chat details:', error)
      message.error('Không thể tải nội dung cuộc hội thoại')
      setMessages([])
    } finally {
      setLoading(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  const fetchMoreMessages = async () => {
    if (!id || !pagination || pagination.page >= pagination.totalPages || loadingMore) return

    setLoadingMore(true)
    const container = chatContainerRef.current
    const previousScrollHeight = container?.scrollHeight || 0

    try {
      const nextPage = pagination.page + 1
      const msgRes = await chatService.getMessagesInGroup(id, { page: nextPage })
      const msgListData = msgRes.data as MessageListResponse

      const newMessages = Array.isArray(msgListData.data) ? msgListData.data : []
      setMessages((prev) => [...newMessages, ...prev])
      setPagination(msgListData.pagination)

      // Adjust scroll after DOM update to maintain position
      setTimeout(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - previousScrollHeight
        }
      }, 0)
    } catch (error) {
      console.error('Failed to fetch more messages:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget
    if (scrollTop === 0 && !loadingMore && pagination && pagination.page < pagination.totalPages) {
      fetchMoreMessages()
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !id || !user || sending) return

    setSending(true)
    try {
      const payload = {
        content: inputValue,
        userId: user._id,
        senderType: 'staff',
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
      setTimeout(scrollToBottom, 100)
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
          title: conversation.ownerId?.fullName || 'Người dùng',
          subtitle: 'Hỗ trợ thành viên',
          icon: <UserOutlined />,
          color: token.colorPrimary,
          link: `${USERDETAIL_PAGE}/${conversation.ownerId._id}`
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
            <Avatar
              size={40}
              src={conversation?.type === 'contract_chat' ? headerInfo.icon : conversation?.ownerId.avatar}
              style={{ backgroundColor: headerInfo.color }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Title level={5} style={{ margin: 0 }}>
                  {headerInfo.title}
                </Title>
                {conversation?.status === 'closed' && <Tag color="default">Đã đóng</Tag>}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {conversation?.status === 'closed' ? 'Cuộc hội thoại đã đóng' : headerInfo.subtitle}
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
            overflow: 'hidden',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }}
        style={{ borderRadius: 8 }}
      >
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 p-6 space-y-4 overflow-y-auto"
          style={{ background: token.colorBgLayout + '40' }}
        >
          {loadingMore && (
            <div className="flex justify-center py-2">
              <Spin size="small" />
            </div>
          )}

          {!loading && (!Array.isArray(messages) || messages.length === 0) ? (
            <div className="flex items-center justify-center h-full">
              <Text type="secondary">Chưa có tin nhắn nào trong cuộc hội thoại này.</Text>
            </div>
          ) : (
            (Array.isArray(messages) ? messages : []).map((msg, idx) => {
              const msgSenderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId
              const isMe = msgSenderId === user?._id
              const isStaff = msg.senderType === 'staff'
              const prevMsg = idx > 0 ? messages[idx - 1] : null
              const prevSenderId = prevMsg
                ? typeof prevMsg.senderId === 'object'
                  ? prevMsg.senderId?._id
                  : prevMsg.senderId
                : null
              const showSender = idx === 0 || prevSenderId !== msgSenderId

              const senderName = typeof msg.senderId === 'object' ? msg.senderId?.fullName : 'Người dùng'

              return (
                <div key={msg._id || idx} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                  {!isMe && showSender && (
                    <Text type="secondary" style={{ fontSize: 11, marginBottom: 4, marginLeft: 4 }}>
                      {senderName}
                    </Text>
                  )}
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: msg.type === 'image' ? '4px' : '8px 16px',
                      borderRadius: 16,
                      backgroundColor: isMe ? token.colorPrimary : token.colorBgContainer,
                      color: isMe ? '#fff' : token.colorText,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      borderTopRightRadius: isMe ? 4 : 16,
                      borderTopLeftRadius: !isMe ? 4 : 16,
                      overflow: 'hidden'
                    }}
                  >
                    {msg.type === 'image' ? (
                      <Image
                        src={msg.content}
                        alt="sent"
                        style={{ maxWidth: '100%', borderRadius: 12, display: 'block' }}
                        placeholder={
                          <div
                            style={{
                              width: 200,
                              height: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: token.colorBgLayout
                            }}
                          >
                            <Spin />
                          </div>
                        }
                      />
                    ) : (
                      <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                    )}
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
            <Col flex="none">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <Tooltip title="Gửi ảnh">
                <Button
                  type="text"
                  shape="circle"
                  icon={<PictureOutlined />}
                  size="large"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending}
                />
              </Tooltip>
            </Col>
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
