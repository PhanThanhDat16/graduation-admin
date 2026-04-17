import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, List, Space, Tag, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { MOCK_CHAT_THREADS, type MockChatThread } from '@/mock/chatThreads.mock'
import { CHAT_PAGE } from '@/constants'

const { Title, Text } = Typography

const ChatPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return MOCK_CHAT_THREADS.filter(
      (t) =>
        !search.trim() ||
        t.projectCode.toLowerCase().includes(search.toLowerCase()) ||
        t.participants.toLowerCase().includes(search.toLowerCase()) ||
        t.lastMessagePreview.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleViewDetail = (item: MockChatThread) => {
    navigate(`${CHAT_PAGE}/${item.id}`)
  }

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Hội thoại
        </Title>
        <Text type="secondary">
          Danh sách phòng chat theo dự án (mock) — hỗ trợ giám sát, không thay thế ứng dụng chat đầy đủ.
        </Text>
      </div>

      <Card>
        <Input.Search
          allowClear
          placeholder="Mã dự án, người tham gia, nội dung…"
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400, marginBottom: 16 }}
        />
        <List
          itemLayout="horizontal"
          dataSource={filtered}
          renderItem={(item: MockChatThread) => (
            <List.Item
              actions={[
                <Button key="d" type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(item)}>
                  Chi tiết
                </Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <Space wrap>
                    <Text strong>{item.projectCode}</Text>
                    {item.unreadFlag ? <Tag color="red">Chưa đọc</Tag> : null}
                  </Space>
                }
                description={
                  <>
                    <div>{item.participants}</div>
                    <Text type="secondary" ellipsis>
                      {item.lastMessagePreview}
                    </Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.lastMessageAt).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  )
}

export default ChatPage
