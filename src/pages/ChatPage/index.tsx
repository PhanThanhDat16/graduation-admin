import { useMemo, useState } from 'react'
import { Button, Card, Descriptions, Input, List, Space, Tag, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { MOCK_CHAT_THREADS, type MockChatThread } from '@/mock/chatThreads.mock'

const { Title, Text } = Typography

const ChatPage = () => {
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<MockChatThread | null>(null)

  const filtered = useMemo(() => {
    return MOCK_CHAT_THREADS.filter(
      (t) =>
        !search.trim() ||
        t.projectCode.toLowerCase().includes(search.toLowerCase()) ||
        t.participants.toLowerCase().includes(search.toLowerCase()) ||
        t.lastMessagePreview.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
                <Button key="d" type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(item)}>
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

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Hội thoại: ${detail.projectCode}` : 'Chi tiết'}
        width={480}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã dự án">{detail.projectCode}</Descriptions.Item>
            <Descriptions.Item label="Tham gia">{detail.participants}</Descriptions.Item>
            <Descriptions.Item label="Tin nhắn gần nhất">{detail.lastMessagePreview}</Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              {dayjs(detail.lastMessageAt).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đọc (mock)">
              {detail.unreadFlag ? <Tag color="red">Có tin chưa đọc</Tag> : <Tag>Đã xem</Tag>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default ChatPage
