import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Button, Space, Form, Input, Row, Col, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { MOCK_CHAT_THREADS } from '@/mock/chatThreads.mock'
import { useState } from 'react'

const { Title, Text } = Typography

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(() => MOCK_CHAT_THREADS.find((t) => t.id === id))
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  if (!detail) {
    return (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <div>Không tìm thấy hội thoại</div>
      </Space>
    )
  }

  const handleSave = async (values: any) => {
    setSaving(true)
    setTimeout(() => {
      setDetail((prev) => (prev ? { ...prev, ...values } : prev))
      setSaving(false)
      message.success('Cập nhật thông tin hội thoại thành công (Mock)')
    }, 500)
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Hội thoại: {detail.projectCode}
        </Title>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
          Lưu thay đổi
        </Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            projectCode: detail.projectCode,
            participants: detail.participants,
            lastMessagePreview: detail.lastMessagePreview
          }}
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã dự án" name="projectCode">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Người tham gia" name="participants">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Tin nhắn gần nhất" name="lastMessagePreview">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thời gian">
                <Text type="secondary">{dayjs(detail.lastMessageAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái">
                {detail.unreadFlag ? (
                  <Text type="danger">Có tin chưa đọc</Text>
                ) : (
                  <Text type="secondary">Đã xem hết</Text>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}

export default ChatDetail
