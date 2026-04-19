import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Space, Typography } from 'antd'
import { userService } from '@/apis/userService'
import type { UserQuery, UserResponse } from '@/types/user'
import TableFreelancers from './Table'
import AppFilters, { type FilterConfig } from '@/components/common/AppFilters'
import { FREELANCER_PAGE } from '@/constants'

const { Title, Text } = Typography

const FreelancerFilters: FilterConfig[] = [
  {
    type: 'input',
    name: 'keyword',
    placeholder: 'Tìm kiếm theo tên, email',
    label: 'Tìm kiếm'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      {
        label: 'Hoạt động',
        value: 'active'
      },
      {
        label: 'Không hoạt động',
        value: 'disabled'
      }
    ],
    label: 'Trạng thái'
  },
  {
    type: 'select',
    name: 'isVerified',
    placeholder: 'Trạng thái',
    options: [
      {
        label: 'Đã xác minh',
        value: 'true'
      },
      {
        label: 'Chưa xác minh',
        value: 'false'
      }
    ],
    label: 'Xác thực'
  },
  {
    type: 'select',
    name: 'sortBy',
    placeholder: 'Sắp xếp tên, ngày tạo...',
    options: [
      {
        label: 'Tên',
        value: 'fullName'
      },
      {
        label: 'Ngày tạo',
        value: ''
      }
    ],
    label: 'Sắp xếp theo'
  },
  {
    type: 'select',
    name: 'sortOrder',
    placeholder: 'Tăng dần, giảm dần',
    options: [
      {
        label: 'Tăng dần',
        value: 'asc'
      },
      {
        label: 'Giảm dần',
        value: 'desc'
      }
    ],
    label: 'Thứ tự'
  }
]

const FreelancerPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<UserQuery>({
    role: 'freelancer',
    keyword: '',
    status: '',
    page: 1,
    limit: 10,
    sortBy: '',
    sortOrder: '',
    isVerified: undefined
  })
  const [freelancers, setFreelancers] = useState<UserResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      keyword: values.keyword || '',
      status: values.status || '',
      sortBy: values.sortBy || '',
      sortOrder: values.sortOrder || '',
      isVerified: values.isVerified || undefined
    }))
  }

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize
    }))
  }

  const handleViewDetail = (record: UserResponse) => {
    navigate(`${FREELANCER_PAGE}/${record._id}`)
  }

  const fetchFreelancers = async () => {
    try {
      setIsLoading(true)
      const res = await userService.getUsersByRole(query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      setFreelancers(payload.data || [])
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
      console.error('Failed to fetch freelancers:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchFreelancers())
  }, [query.page, query.limit, query.keyword, query.status, query.sortOrder, query.sortBy, query.isVerified])

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Danh sách Freelancer
        </Title>
        <Text type="secondary">Quản lý tài khoản các nhà thầu / freelance trên hệ thống.</Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={FreelancerFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableFreelancers
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          freelancers={freelancers}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onView={handleViewDetail}
        />
      </Card>
    </Space>
  )
}

export default FreelancerPage
