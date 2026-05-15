import { WithDrawService } from '@/apis/withdrawService'
import type { FilterConfig } from '@/components/common/AppFilters'
import AppFilters from '@/components/common/AppFilters'
import type { WithDrawQuery, WithDrawResponse } from '@/types/withdraw'
import { Card, message, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import TableWithDraw from './Table'

const { Title, Text } = Typography

const WithDrawFilters: FilterConfig[] = [
  {
    type: 'input',
    name: 'accountId',
    placeholder: 'Mã khách hàng',
    label: 'Mã khách hàng'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      { label: 'Đang chờ', value: 'pending' },
      { label: 'Đã duyệt', value: 'approved' },
      { label: 'Hủy yêu cầu', value: 'rejected' }
    ],
    label: 'Trạng thái'
  }
]

const WithDrawPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<WithDrawQuery>({
    page: 1,
    limit: 10,
    status: '',
    userId: ''
  })
  const [withdraws, setWithdraws] = useState<WithDrawResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      status: values.status || '',
      userId: values.userId || ''
    }))
  }

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize
    }))
  }

  const fetchWithDraws = async () => {
    try {
      setIsLoading(true)
      const res = await WithDrawService.getAllWithDrawRequests(query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      const transactionsData = payload.data || []

      setWithdraws(transactionsData)
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

  const handleApprove = async (id: string) => {
    try {
      await WithDrawService.approveWithDraw(id, { status: 'approved' })
      message.success('Đã duyệt yêu cầu rút tiền thành công')
      fetchWithDraws()
    } catch (error) {
      console.error(error)
      message.error('Duyệt yêu cầu thất bại')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await WithDrawService.approveWithDraw(id, { status: 'rejected' })
      message.success('Đã hủy yêu cầu rút tiền thành công')
      fetchWithDraws()
    } catch (error) {
      console.error(error)
      message.error('Hủy yêu cầu thất bại')
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchWithDraws())
  }, [query.page, query.limit, query.status, query.userId])

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Yêu cầu rút tiền
        </Title>
        <Text type="secondary">Quản lý các yêu cầu rút tiền từ ví của người dùng.</Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={WithDrawFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableWithDraw
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          withdraw={withdraws}
          onPageChange={handleChangePageSizeTable}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Card>
    </Space>
  )
}

export default WithDrawPage
