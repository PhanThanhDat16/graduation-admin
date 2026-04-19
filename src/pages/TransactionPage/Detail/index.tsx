import { useParams, useNavigate } from 'react-router-dom'
import { Card, Tag, Typography, Button, Space, Form, Input, Select, Row, Col, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  MOCK_PROJECT_TRANSACTIONS,
  PROJECT_TX_STATUS_LABEL,
  PROJECT_TX_TYPE_LABEL,
  type ProjectTxStatus,
  type ProjectTxType
} from '@/mock/projectTransactions.mock'
import { formatVnd } from '@/utils/formatCurrency'
import { useState } from 'react'

const { Title, Text } = Typography

const TYPE_COLOR: Record<ProjectTxType, string> = {
  escrow_hold: 'blue',
  milestone_release: 'green',
  platform_fee: 'purple',
  refund_partial: 'orange',
  dispute_escrow: 'red'
}

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(() => MOCK_PROJECT_TRANSACTIONS.find((t) => t.id === id))
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  if (!detail) {
    return (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <div>Không tìm thấy giao dịch</div>
      </Space>
    )
  }

  const handleSave = async (values: any) => {
    setSaving(true)
    setTimeout(() => {
      setDetail((prev) => (prev ? { ...prev, ...values } : prev))
      setSaving(false)
      message.success('Cập nhật giao dịch thành công (Mock)')
    }, 500)
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Giao dịch: {detail.code}
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
            note: detail.note,
            status: detail.status
          }}
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã giao dịch">
                <Text strong>{detail.code}</Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status">
                <Select
                  options={(Object.keys(PROJECT_TX_STATUS_LABEL) as ProjectTxStatus[]).map((k) => ({
                    label: PROJECT_TX_STATUS_LABEL[k],
                    value: k
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã dự án">
                <Text>{detail.projectCode}</Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hợp đồng">
                <Text>{detail.contractCode ?? '—'}</Text>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Loại">
                <Tag color={TYPE_COLOR[detail.type]}>{PROJECT_TX_TYPE_LABEL[detail.type]}</Tag>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số tiền">
                <Text strong>{formatVnd(detail.amountVnd)}</Text>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả / ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Thời gian">
            <Text type="secondary">{dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  )
}

export default TransactionDetail
