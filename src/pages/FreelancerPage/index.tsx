import { useEffect, useState } from 'react'
import { Card, Descriptions, Space, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { userService } from '@/apis/userService'
import type { FreelancerQuery, UserResponse } from '@/types/user'
import TableFreelancers from './Table'
import AppFilters, { type FilterConfig } from '@/components/common/AppFilters'

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
  }
]

const FreelancerPage = () => {
  const [detail, setDetail] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<FreelancerQuery>({
    role: 'freelancer',
    keyword: '',
    status: '',
    page: 1,
    limit: 10
  })
  const [freelancers, setFreelancers] = useState<UserResponse[]>([])

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

  const handleViewDetail = (record: UserResponse) => {
    setDetail(record)
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
  }, [query.page, query.limit, query.keyword, query.status])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
          onEdit={() => {}}
          onView={handleViewDetail}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Freelancer: ${detail.fullName}` : 'Chi tiết'}
        width={520}
      >
        {detail && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {detail.avatarUrl ? (
                <img
                  src={detail.avatarUrl}
                  alt={detail.fullName}
                  style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}
                >
                  <Text type="secondary">No Avatar</Text>
                </div>
              )}
            </div>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã user">{detail._id}</Descriptions.Item>
              <Descriptions.Item label="Tên hiển thị">{detail.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{detail.phone || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {detail.gender === 'male' ? 'Nam' : detail.gender === 'female' ? 'Nữ' : 'Khác'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {detail.birthday ? dayjs(detail.birthday).format('DD/MM/YYYY') : 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{detail.address || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {detail.status === 'active' ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Vô hiệu</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Xác minh">
                {detail.isVerified ? <Tag color="blue">Đã xác minh</Tag> : <Tag color="warning">Chưa xác minh</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Tham gia">
                {dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default FreelancerPage
