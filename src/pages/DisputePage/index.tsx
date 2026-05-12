import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Space, Typography } from 'antd'
import { DISPUTE_PAGE } from '@/constants'
import type { DisputeQuery, DisputeResponse } from '@/types/dispute'
import { disputeService } from '@/apis/disputeService'
import AppFilters, { type FilterConfig } from '@/components/common/AppFilters'
import TableDisputes from './Table'

const { Title, Text } = Typography

const DisputeFilters: FilterConfig[] = [
  {
    type: 'input',
    name: 'contractId',
    placeholder: 'Tìm kiếm mã hợp đồng...',
    label: 'Tìm kiếm hợp đồng'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      {
        label: 'Mở tranh chấp',
        value: 'open'
      },
      {
        label: 'Đang đàm phán',
        value: 'negotiating'
      },
      {
        label: 'Đang xem xét',
        value: 'admin_review'
      },
      {
        label: 'Đã giải quyết',
        value: 'resolved'
      },
      {
        label: 'Đã tự đóng',
        value: 'auto_closed'
      }
    ],
    label: 'Trạng thái'
  }
]

const DisputePage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<DisputeQuery>({
    contractId: '',
    status: '',
    page: 1,
    limit: 10
  })
  const [disputes, setDisputes] = useState<DisputeResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      contractId: values.contractId || '',
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

  const handleViewDetail = (record: DisputeResponse) => {
    navigate(`${DISPUTE_PAGE}/${record._id}`)
  }

  const fetchDisputes = async () => {
    try {
      setIsLoading(true)
      const res = await disputeService.getDisputeList(query)
      console.log('Dispute list response:', res)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      const contractsData = payload.data || []
      const contractsWithDetails = await Promise.all(
        contractsData.map(async (dispute: DisputeResponse) => {
          return {
            ...dispute
          }
        })
      )

      setDisputes(contractsWithDetails)
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
      console.error('Failed to fetch contracts:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchDisputes())
  }, [query.page, query.limit, query.contractId, query.status])

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Tranh chấp
        </Title>
        <Text type="secondary">Theo dõi các vụ tranh chấp giữa chủ dự án và nhà thầu, gắn với dự án cụ thể.</Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={DisputeFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableDisputes
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          disputes={disputes}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onView={handleViewDetail}
        />
      </Card>
    </Space>
  )
}

export default DisputePage
