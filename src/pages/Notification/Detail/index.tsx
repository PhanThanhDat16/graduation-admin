import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Button, Space, Progress, Form, Input, Select, Row, Col, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  MOCK_ADMIN_NOTIFICATIONS,
  NOTIFICATION_AUDIENCE_LABEL,
  type NotificationAudience
} from '@/mock/notifications.mock'
import { useState } from 'react'

const { Title, Text } = Typography

const NotificationDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(() => MOCK_ADMIN_NOTIFICATIONS.find((n) => n.id === id))
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  if (!detail) {
    return (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <div>Không tìm thấy thông báo</div>
      </Space>
    )
  }

  const handleSave = async (values: any) => {
    setSaving(true)
    setTimeout(() => {
      setDetail((prev) => (prev ? { ...prev, ...values } : prev))
      setSaving(false)
      message.success('Cập nhật thông báo thành công (Mock)')
    }, 500)
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Chi tiết thông báo
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
            title: detail.title,
            body: detail.body,
            audience: detail.audience
          }}
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                <Input maxLength={200} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đối tượng" name="audience">
                <Select
                  options={(Object.keys(NOTIFICATION_AUDIENCE_LABEL) as NotificationAudience[]).map((k) => ({
                    label: NOTIFICATION_AUDIENCE_LABEL[k],
                    value: k
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Nội dung" name="body" rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <Input.TextArea rows={6} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gửi lúc">
                <Text>{dayjs(detail.sentAt).format('DD/MM/YYYY HH:mm')}</Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tỷ lệ đọc (mock)">
                <Progress percent={detail.readRatePercent} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}

export default NotificationDetail
