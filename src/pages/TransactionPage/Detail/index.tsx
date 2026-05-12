import { useParams, useNavigate } from 'react-router-dom'
import { Card, Tag, Typography, Button, Space, Descriptions, Spin, Form } from 'antd'
import {
  ArrowLeftOutlined,
  WalletOutlined,
  UserOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { formatVnd } from '@/utils/formatCurrency'
import { useEffect, useState } from 'react'
import type { TransactionResponse, TransactionStatus, TransactionType } from '@/types/transaction'
import { TransactionService } from '@/apis/transactionService'

const { Title, Text } = Typography

const statusMap: Record<TransactionStatus, { color: string; label: string }> = {
  pending: { color: 'processing', label: 'Đang chờ' },
  completed: { color: 'success', label: 'Thành công' },
  failed: { color: 'error', label: 'Thất bại' },
  cancelled: { color: 'default', label: 'Đã hủy' }
}

const typeMap: Record<TransactionType, { color: string; label: string }> = {
  deposit: { color: 'green', label: 'Nạp tiền' },
  withdraw: { color: 'volcano', label: 'Rút tiền' },
  escrow_deposit: { color: 'blue', label: 'Ký quỹ' },
  escrow_release: { color: 'cyan', label: 'Giải ngân' },
  refund: { color: 'purple', label: 'Hoàn tiền' },
  admin_fee: { color: 'gold', label: 'Phí hệ thống' }
}

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  const fetchTransaction = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await TransactionService.getTransactionById(id)
      const data = res.data
      setTransaction(data)
      form.setFieldsValue({
        ...data
      })
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransaction()
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" description="Đang tải thông tin giao dịch..." />
      </div>
    )
  }

  if (!transaction) {
    return (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
            <Title level={4}>Không tìm thấy thông tin giao dịch</Title>
            <Text type="secondary">Giao dịch này có thể không tồn tại hoặc bạn không có quyền truy cập.</Text>
          </div>
        </Card>
      </Space>
    )
  }

  const typeInfo = transaction.type ? typeMap[transaction.type] : { color: 'default', label: 'Không xác định' }
  const statusInfo = transaction.status ? statusMap[transaction.status] : { color: 'default', label: 'Không xác định' }
  const isPositive = ['deposit', 'escrow_release', 'refund'].includes(transaction.type || '')

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Chi tiết giao dịch
        </Title>
      </div>

      <Card
        title={
          <Space>
            <WalletOutlined />
            <span>Mã giao dịch: {transaction._id}</span>
          </Space>
        }
        extra={<Tag color={statusInfo.color}>{statusInfo.label}</Tag>}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Mã ví" span={2}>
            <Text copyable>{transaction.walletId}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Người thực hiện" span={2}>
            <Space>
              <UserOutlined />
              <Text copyable>{transaction.userId.fullName}</Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Loại giao dịch">
            <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Số tiền">
            <Text strong style={{ fontSize: '18px', color: isPositive ? '#52c41a' : '#f5222d' }}>
              {isPositive ? '+' : ''}
              {formatVnd(transaction.amount)}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="Phương thức thanh toán">
            <Tag>{transaction.methodPayment?.toUpperCase() || 'VÍ HỆ THỐNG'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Mã đơn hàng/thanh toán">
            <Text copyable>{transaction.paymentOrderId || '—'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian tạo" span={1}>
            <Space>
              <ClockCircleOutlined />
              {dayjs(transaction.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái" span={1}>
            <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" span={2}>
            {transaction.description || 'Không có mô tả'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  )
}

export default TransactionDetail
