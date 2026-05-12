import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row, Space, Statistic, Typography, theme } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, FolderOpenOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { projectService } from '@/apis/projectService'
import type { ProjectQuery, ProjectResponse } from '@/types/project'
import type { FilterConfig } from '@/components/common/AppFilters'
import AppFilters from '@/components/common/AppFilters'
import TableProjects from './Table'
import { PROJECT_PAGE } from '@/constants'

const { Title, Text } = Typography

const ProjectFilters: FilterConfig[] = [
  {
    type: 'input',
    name: 'keyword',
    placeholder: 'Tìm kiếm theo tên dự án...',
    label: 'Tìm kiếm'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      {
        label: 'Mở đăng ký',
        value: 'open'
      },
      {
        label: 'Đóng đăng ký',
        value: 'closed'
      },
      {
        label: 'Đang nháp',
        value: 'draft'
      }
    ],
    label: 'Trạng thái'
  },
  {
    type: 'input',
    name: 'budgetMin',
    placeholder: 'Ngân sách tối thiểu...',
    label: 'Ngân sách tối thiểu'
  },
  {
    type: 'input',
    name: 'budgetMax',
    placeholder: 'Ngân sách tối đa...',
    label: 'Ngân sách tối đa'
  },
  {
    type: 'select',
    name: 'sortBy',
    placeholder: 'Sắp xếp theo...',
    options: [
      {
        label: 'Tên dự án',
        value: 'title'
      },
      {
        label: 'Ngày tạo',
        value: ''
      },
      {
        label: 'Lượt thích',
        value: 'likes'
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

const ProjectPage = () => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<ProjectQuery>({
    keyword: '',
    status: '',
    page: 1,
    limit: 10,
    sortBy: '',
    sortOrder: '',
    category: '',
    budgetMin: undefined,
    budgetMax: undefined
  })
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [initProject, setInitProject] = useState<ProjectResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      keyword: values.keyword || '',
      status: values.status || '',
      sortBy: values.sortBy || '',
      sortOrder: values.sortOrder || '',
      category: values.category || '',
      budgetMin: values.budgetMin || undefined,
      budgetMax: values.budgetMax || undefined
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
        projectsData.map(async (project: ProjectResponse) => {
          return { ...project }
        })
      )
      if (initProject.length === 0) setInitProject(projectsWithDetails)

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
  }, [
    query.page,
    query.limit,
    query.keyword,
    query.status,
    query.sortBy,
    query.sortOrder,
    query.category,
    query.budgetMin,
    query.budgetMax
  ])

  const handleViewDetail = (record: ProjectResponse) => {
    navigate(`${PROJECT_PAGE}/${record._id}`)
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
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Tổng dự án" value={initProject.length || 0} prefix={<FolderOpenOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang mở đăng ký"
              value={initProject.filter((project) => project.status === 'open').length || 0}
              prefix={<PlayCircleOutlined />}
              styles={{
                content: { color: token.colorSuccess }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã đóng đăng ký"
              value={initProject.filter((project) => project.status === 'closed').length || 0}
              prefix={<CheckCircleOutlined />}
              styles={{
                content: { color: token.colorPrimary }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Nháp"
              value={initProject.filter((project) => project.status === 'draft').length || 0}
              prefix={<CloseCircleOutlined />}
              styles={{
                content: { color: token.colorWarningText }
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
          onView={handleViewDetail}
        />
      </Card>
    </Space>
  )
}

export default ProjectPage
