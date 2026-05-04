import { useParams, useNavigate } from 'react-router-dom'
import { Card, Tag, Typography, Button, Space, Row, Col, Descriptions, Avatar, Divider } from 'antd'
import { ArrowLeftOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { formatVnd } from '@/utils/formatCurrency'
import { useEffect, useState } from 'react'
import { walletService } from '@/apis/walletService'
import type { WalletResponse } from '@/types/wallet'
import TableWalletDetail from '../Table/TableDetail'
import type { FilterConfig } from '@/components/common/AppFilters'
import AppFilters from '@/components/common/AppFilters'
import { useAuthStore } from '@/store/useAuthStore'
import { TRANSACTION_PAGE } from '@/constants'
import type { TransactionQuery, TransactionResponse } from '@/types/transaction'

const { Title, Text } = Typography

const WalletTransactionFilters: FilterConfig[] = [
  {
    type: 'select',
    name: 'type',
    placeholder: 'Loại giao dịch',
    options: [
      { label: 'Nạp tiền', value: 'deposit' },
      { label: 'Rút tiền', value: 'withdraw' }
    ],
    label: 'Loại giao dịch'
  },
  {
    type: 'select',
    name: 'methodPayment',
    placeholder: 'Cổng thanh toán',
    options: [
      { label: 'MoMo', value: 'momo' },
      { label: 'VNPay', value: 'vnpay' }
    ],
    label: 'Cổng thanh toán'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      { label: 'Thành công', value: 'success' },
      { label: 'Đang xử lý', value: 'pending' },
      { label: 'Đã từ chối', value: 'rejected' }
    ],
    label: 'Trạng thái'
  }
]

const WalletDetail = () => {
  const { user } = useAuthStore()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<WalletResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [query, setQuery] = useState<TransactionQuery>({
    page: 1,
    limit: 10,
    type: '',
    methodPayment: '',
    status: ''
  })
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      type: values.type || '',
      methodPayment: values.methodPayment || '',
      status: values.status || ''
    }))
  }

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize
    }))
  }

  const handleViewDetail = (record: TransactionResponse) => {
    navigate(`${TRANSACTION_PAGE}/${record._id}`, { state: { transaction: record } })
  }

  const fetchTransactions = async () => {
    if (!id) return
    try {
      setTableLoading(true)
      const res = await walletService.getUserWalletTransactions(id, query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      setTransactions(payload.data || [])
      if (payload.pagination) {
        setQuery((prev) => ({
          ...prev,
          pagination: payload.pagination
        }))
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setTableLoading(false)
    }
  }

  const fetchWalletDetail = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await walletService.getUserWallet(id)
      setWallet(res.data.data)
    } catch (error) {
      console.error('Failed to fetch wallet detail:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletDetail()
  }, [id])

  useEffect(() => {
    fetchTransactions()
  }, [id, query.page, query.limit, query.type, query.methodPayment, query.status])

  if (loading) {
    return <Card loading={true} />
  }

  if (!wallet) {
    return (
      <Space vertical size="large" style={{ width: '100%' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <div>Không tìm thấy thông tin ví</div>
      </Space>
    )
  }

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Chi tiết ví người dùng
        </Title>
      </div>

      <Card
        title={
          <Space>
            <WalletOutlined />
            <span>Thông tin ví: {wallet._id}</span>
          </Space>
        }
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: '20px', borderRight: '1px solid #f0f0f0' }}>
              <Avatar size={100} src={wallet.userId.avatar} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {wallet.userId.fullName}
              </Title>
              <Tag color={wallet.userId.role === 'freelancer' ? 'success' : 'blue'}>
                {wallet.userId.role.toUpperCase()}
              </Tag>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">{wallet.userId.email}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã người dùng">
                <Text copyable>{wallet.userId._id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số dư hiện tại">
                <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
                  {user?.role === 'staff' ? '********' : formatVnd(wallet.balance)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo ví">
                {dayjs(wallet.createdAt).format('DD/MM/YYYY HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {dayjs(wallet.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <Space>
            <Divider type="vertical" style={{ backgroundColor: '#1890ff', height: '1.2em' }} />
            <span>Lịch sử giao dịch</span>
          </Space>
        }
      >
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={WalletTransactionFilters} onChange={handleGetValueFilter} />
        </Space>
        <TableWalletDetail
          wallettransactions={transactions}
          loading={tableLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onView={handleViewDetail}
        />
      </Card>
    </Space>
  )
}

export default WalletDetail
