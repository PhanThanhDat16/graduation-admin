import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Button, Space, Form, Input, Select, message, Row, Col } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DISPUTE_STATUS_LABEL, MOCK_DISPUTES, type DisputeStatus } from '@/mock/disputes.mock'
import { useState } from 'react'

const { Title, Text } = Typography

const DisputeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(() => MOCK_DISPUTES.find((d) => d.id === id))
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  if (!detail) {
    return (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <div>Không tìm thấy tranh chấp</div>
      </Space>
    )
  }

  const handleSave = async (values: any) => {
    setSaving(true)
    setTimeout(() => {
      setDetail((prev) => (prev ? { ...prev, ...values } : prev))
      setSaving(false)
      message.success('Cập nhật trạng thái tranh chấp thành công (Mock)')
    }, 500)
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Tranh chấp: {detail.code}
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
            summary: detail.summary,
            status: detail.status
          }}
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã vụ">
                <Text strong>{detail.code}</Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status">
                <Select
                  options={(Object.keys(DISPUTE_STATUS_LABEL) as DisputeStatus[]).map((k) => ({
                    label: DISPUTE_STATUS_LABEL[k],
                    value: k
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Tóm tắt nội dung" name="summary">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Dự án">
                <Text>
                  {detail.projectTitle} <Text type="secondary">({detail.projectCode})</Text>
                </Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mở lúc">
                <Text>{dayjs(detail.openedAt).format('DD/MM/YYYY HH:mm')}</Text>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Chủ dự án">
                <Text>{detail.clientName}</Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Nhà thầu">
                <Text>{detail.freelancerName}</Text>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}

export default DisputeDetail
