import { useParams, useNavigate } from 'react-router-dom'
import { Card, Tag, Typography, Button, Space, Form, Input, Select, Row, Col, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  MOCK_WALLET_OPERATIONS,
  WALLET_OP_STATUS_LABEL,
  WALLET_OP_TYPE_LABEL,
  type WalletOpStatus,
  type WalletOpType,
  type WalletUserRole
} from '@/mock/walletOperations.mock'
import { formatVnd } from '@/utils/formatCurrency'
import { useState } from 'react'

const { Title, Text } = Typography

const ROLE_LABEL: Record<WalletUserRole, string> = {
  freelancer: 'Nhà thầu',
  client: 'Chủ dự án / Khách'
}

const ROLE_COLOR: Record<WalletUserRole, string> = {
  freelancer: 'geekblue',
  client: 'cyan'
}

const OP_COLOR: Record<WalletOpType, string> = {
  deposit: 'green',
  withdraw: 'gold'
}

const WalletDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(() => MOCK_WALLET_OPERATIONS.find((w) => w.id === id))
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  if (!detail) {
    return (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <div>Không tìm thấy giao dịch ví</div>
      </Space>
    )
  }

  const handleSave = async (values: any) => {
    setSaving(true)
    setTimeout(() => {
      setDetail((prev) => (prev ? { ...prev, ...values } : prev))
      setSaving(false)
      message.success('Cập nhật giao dịch ví thành công (Mock)')
    }, 500)
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Giao dịch ví: {detail.code}
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
            status: detail.status,
            channel: detail.channel
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
                  options={(Object.keys(WALLET_OP_STATUS_LABEL) as WalletOpStatus[]).map((k) => ({
                    label: WALLET_OP_STATUS_LABEL[k],
                    value: k
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Người dùng">
                <Text>{detail.userDisplayName}</Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Vai trò">
                <Tag color={ROLE_COLOR[detail.userRole]}>{ROLE_LABEL[detail.userRole]}</Tag>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Loại">
                <Tag color={OP_COLOR[detail.type]}>{WALLET_OP_TYPE_LABEL[detail.type]}</Tag>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số tiền">
                <Text strong>{formatVnd(detail.amountVnd)}</Text>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Kênh / cổng thanh toán" name="channel">
            <Input />
          </Form.Item>

          <Form.Item label="Thời gian">
            <Text type="secondary">{dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  )
}

export default WalletDetail
