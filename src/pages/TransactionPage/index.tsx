import { useEffect, useState } from 'react'
import { Card, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { TRANSACTION_PAGE } from '@/constants'
import type { FilterConfig } from '@/components/common/AppFilters'
import type { TransactionQuery, TransactionResponse } from '@/types/transaction'
import AppFilters from '@/components/common/AppFilters'
import TableTransaction from './Table'
import { TransactionService } from '@/apis/transactionService'

const { Title, Text } = Typography

const TransactionFilters: FilterConfig[] = [
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
      { label: 'VNPay', value: 'vnpay' },
      { label: 'Wallet', value: 'wallet' }
    ],
    label: 'Cổng thanh toán'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      { label: 'Thành công', value: 'completed' },
      { label: 'Đang chờ', value: 'pending' },
      { label: 'Thất bại', value: 'failed' },
      { label: 'Đã hủy', value: 'cancelled' }
    ],
    label: 'Trạng thái'
  }
]

const TransactionPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<TransactionQuery>({
    page: 1,
    limit: 10,
    status: '',
    type: '',
    methodPayment: ''
  })
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      status: values.status || '',
      type: values.type || '',
      methodPayment: values.methodPayment || ''
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
    navigate(`${TRANSACTION_PAGE}/${record._id}`)
  }

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const res = await TransactionService.getAllTransactions(query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      const transactionsData = payload.data || []
      const transactionsWithDetails = await Promise.all(
        transactionsData.map(async (transaction: TransactionResponse) => {
          return {
            ...transaction
          }
        })
      )

      setTransactions(transactionsWithDetails)
      if (payload.pagination) {
        setQuery((prev) => ({
          ...prev,
          page: payload.pagination.page,
          limit: payload.pagination.limit,
          pagination: payload.pagination
        }))
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchTransactions())
  }, [query.page, query.limit, query.status, query.type, query.methodPayment])

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Lịch sử giao dịch
        </Title>
        <Text type="secondary">Luồng tiền gắn với hợp đồng: giữ tạm, giải ngân cột mốc, phí nền tảng, hoàn tiền…</Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={TransactionFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableTransaction
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          transactions={transactions}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onView={handleViewDetail}
        />
      </Card>
    </Space>
  )
}

export default TransactionPage
