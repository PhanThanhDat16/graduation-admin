import { useEffect, useState } from 'react'
import { Card, Col, Descriptions, Row, Space, Statistic, Tag, Typography, theme } from 'antd'
import { CheckCircleOutlined, FolderOpenOutlined, PlayCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { formatVnd } from '@/utils/formatCurrency'
import { projectService } from '@/apis/projectService'
import { applicationService } from '@/apis/applicationService'
import { userService } from '@/apis/userService'
import type { ProjectQuery, ProjectResponse } from '@/types/project'
import type { FilterConfig } from '@/components/common/AppFilters'
import AppFilters from '@/components/common/AppFilters'
import TableProjects from './Table'

const { Title, Text } = Typography

const ProjectFilters: FilterConfig[] = [
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
        label: 'Hoạt động',
        value: 'open'
      },
      {
        label: 'Đã giao',
        value: 'closed'
      },
      {
        label: 'Hoàn thành',
        value: 'completed'
      },
      {
        label: 'Đã hủy',
        value: 'canceled'
      }
    ],
    label: 'Trạng thái'
  }
]

const ProjectPage = () => {
  const { token } = theme.useToken()
  const [detail, setDetail] = useState<ProjectResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<ProjectQuery>({
    keyword: '',
    status: '',
    page: 1,
    limit: 10
  })
  const [projects, setProjects] = useState<ProjectResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      keyword: values.keyword || '',
      status: values.status || ''
    }))
  }

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const res = await projectService.getProjects(query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      const projectsData = payload.data || []

      const projectsWithDetails = await Promise.all(
        projectsData.map(async (project) => {
          let freelancerId = '—'
          let freelancerName = '—'
          let contractorName = '—'

          // Fetch freelancerId from applications
          try {
            const appRes = await applicationService.getApplicationByProjectId(project._id)
            const appData = appRes.data
            freelancerId = Array.isArray(appData) ? appData[0]?.freelancerId : appData?.freelancerId
          } catch (error) {
            console.error('Error fetching application:', error)
          }

          // Fetch contractorName
          if (project.contractorId) {
            try {
              const userRes = await userService.getUserById(project.contractorId)
              contractorName = userRes.data?.fullName || '—'
            } catch (error) {
              console.error('Error fetching contractor user:', error)
            }
          }

          // Fetch freelancerName
          if (freelancerId && freelancerId !== '—') {
            try {
              const userRes = await userService.getUserById(freelancerId)
              freelancerName = userRes.data?.fullName || '—'
            } catch (error) {
              console.error('Error fetching freelancer user:', error)
            }
          }

          return {
            ...project,
            freelancerId: freelancerId || '—',
            freelancerName,
            contractorName
          }
        })
      )

      setProjects(projectsWithDetails)
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
      setIsLoading(false)
      console.error(error)
    }
  }

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize
    }))
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchProjects())
  }, [query.page, query.limit, query.keyword, query.status])

  const handleViewDetail = (record: ProjectResponse) => {
    setDetail(record)
  }

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Dự án
        </Title>
        <Text type="secondary">Theo dõi bài đăng đã chốt thành dự án, trạng thái thực hiện và các bên tham gia.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Tổng dự án" value={query?.pagination?.total || 0} prefix={<FolderOpenOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đang mở / tuyển"
              value={'stats.active'}
              prefix={<PlayCircleOutlined />}
              styles={{
                content: { color: token.colorPrimary }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={'stats.done'}
              prefix={<CheckCircleOutlined />}
              styles={{
                content: { color: token.colorSuccess }
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={ProjectFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableProjects
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          projects={projects}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onEdit={() => {}}
          onView={handleViewDetail}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Dự án: ${detail._id}` : 'Chi tiết'}
        width={560}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã dự án">{detail._id}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{detail.title}</Descriptions.Item>
            <Descriptions.Item label="Chủ dự án">
              {detail.contractorName} ({detail.contractorId})
            </Descriptions.Item>
            <Descriptions.Item label="Nhà thầu">
              {detail.freelancerName}{' '}
              {detail.freelancerId && detail.freelancerId !== '—' ? `(${detail.freelancerId})` : ''}
            </Descriptions.Item>
            <Descriptions.Item label="Ngân sách tối đa">
              {detail.budgetMax > 0 ? formatVnd(detail.budgetMax) : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detail.status === 'open' ? (
                <Tag color="success">Hoạt động</Tag>
              ) : detail.status === 'closed' ? (
                <Tag color="processing">Đã giao</Tag>
              ) : detail.status === 'completed' ? (
                <Tag color="gold">Hoàn thành</Tag>
              ) : (
                <Tag color="error">Đã hủy</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Tạo lúc">{dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default ProjectPage
