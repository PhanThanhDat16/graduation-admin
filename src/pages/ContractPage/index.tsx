import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Space, Typography } from 'antd'
import { contractService } from '@/apis/contractService'
import type { ContractQuery, ContractResponse } from '@/types/contract'
import type { FilterConfig } from '@/components/common/AppFilters'
import AppFilters from '@/components/common/AppFilters'
import TableContracts from './Table'
import { CONTRACT_PAGE } from '@/constants'

const { Title, Text } = Typography

const ContractFilters: FilterConfig[] = [
  {
    type: 'input',
    name: 'keyword',
    placeholder: 'Tìm kiếm theo...',
    label: 'Tìm kiếm'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      {
        label: 'Nháp',
        value: 'draft'
      },
      {
        label: 'Đang chờ duyệt',
        value: 'pending_agreement'
      },
      {
        label: 'Chờ đặt cọc',
        value: 'waiting_payment'
      },
      {
        label: 'Đang thi công',
        value: 'running'
      },
      {
        label: 'Đã nộp',
        value: 'submitted'
      },
      {
        label: 'Hoàn thành',
        value: 'completed'
      },
      {
        label: 'Đang tranh chấp',
        value: 'dispute'
      },
      {
        label: 'Đã hủy',
        value: 'canceled'
      }
    ],
    label: 'Trạng thái'
  }
]

const ContractPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<ContractQuery>({
    keyword: '',
    status: '',
    page: 1,
    limit: 10
  })
  const [contracts, setContracts] = useState<ContractResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      keyword: values.keyword || '',
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

  const handleViewDetail = (record: ContractResponse) => {
    navigate(`${CONTRACT_PAGE}/${record._id}`)
  }

  const fetchContracts = async () => {
    try {
      setIsLoading(true)
      const res = await contractService.getContractList(query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      const contractsData = payload.data || []
      const contractsWithDetails = await Promise.all(
        contractsData.map(async (contract: ContractResponse) => {
          return {
            ...contract
          }
        })
      )

      setContracts(contractsWithDetails)
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
    Promise.resolve().then(() => fetchContracts())
  }, [query.page, query.limit, query.keyword, query.status])

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Hợp đồng
        </Title>
        <Text type="secondary">
          Hợp đồng giữa chủ dự án và nhà thầu; phí dịch vụ thu cho nền tảng được ghi rõ từng bản ghi.
        </Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={ContractFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableContracts
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          contracts={contracts}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onView={handleViewDetail}
        />
      </Card>
    </Space>
  )
}

export default ContractPage
