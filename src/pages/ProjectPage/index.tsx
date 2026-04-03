import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  theme
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckCircleOutlined, EyeOutlined, FolderOpenOutlined, PlayCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { MOCK_PROJECTS, PROJECT_STATUS_LABEL, type MockProject, type ProjectStatus } from '@/mock/projects.mock'
import { formatVnd } from '@/utils/formatCurrency'

const { Title, Text } = Typography

const STATUS_COLOR: Record<ProjectStatus, string> = {
  recruiting: 'blue',
  in_progress: 'processing',
  completed: 'success',
  disputed: 'error',
  cancelled: 'default'
}

const ProjectPage = () => {
  const { token } = theme.useToken()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all')
  const [detail, setDetail] = useState<MockProject | null>(null)

  const filtered = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      const matchText =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'all' || p.status === status
      return matchText && matchStatus
    })
  }, [search, status])

  const stats = useMemo(() => {
    const total = MOCK_PROJECTS.length
    const active = MOCK_PROJECTS.filter((p) => p.status === 'in_progress' || p.status === 'recruiting').length
    const done = MOCK_PROJECTS.filter((p) => p.status === 'completed').length
    return { total, active, done }
  }, [])

  const columns: ColumnsType<MockProject> = useMemo(
    () => [
      { title: 'Mã', dataIndex: 'code', key: 'code', width: 140 },
      { title: 'Dự án', dataIndex: 'title', key: 'title', ellipsis: true },
      { title: 'Chủ dự án', dataIndex: 'ownerName', key: 'owner', ellipsis: true },
      {
        title: 'Nhà thầu',
        dataIndex: 'freelancerName',
        key: 'fl',
        width: 160,
        render: (v: string | null) => v ?? <Text type="secondary">—</Text>
      },
      {
        title: 'Ngân sách',
        dataIndex: 'budgetVnd',
        key: 'budget',
        width: 150,
        render: (n: number) => (n > 0 ? formatVnd(n) : '—')
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        render: (s: ProjectStatus) => <Tag color={STATUS_COLOR[s]}>{PROJECT_STATUS_LABEL[s]}</Tag>
      },
      {
        title: 'Tạo lúc',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (iso: string) => dayjs(iso).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Thao tác',
        key: 'actions',
        fixed: 'right',
        width: 110,
        render: (_: unknown, record: MockProject) => (
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(record)}>
            Chi tiết
          </Button>
        )
      }
    ],
    []
  )

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
            <Statistic title="Tổng dự án (mock)" value={stats.total} prefix={<FolderOpenOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đang mở / tuyển"
              value={stats.active}
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
              value={stats.done}
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
          <Input.Search
            allowClear
            placeholder="Tìm theo mã, tiêu đề, chủ dự án…"
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 320 }}
          />
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: 200 }}
            options={[
              { label: 'Mọi trạng thái', value: 'all' },
              ...(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((k) => ({
                label: PROJECT_STATUS_LABEL[k],
                value: k
              }))
            ]}
          />
        </Space>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          scroll={{ x: 1080 }}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Dự án: ${detail.code}` : 'Chi tiết'}
        width={560}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã dự án">{detail.code}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{detail.title}</Descriptions.Item>
            <Descriptions.Item label="Chủ dự án">{detail.ownerName}</Descriptions.Item>
            <Descriptions.Item label="Nhà thầu">{detail.freelancerName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Ngân sách">
              {detail.budgetVnd > 0 ? formatVnd(detail.budgetVnd) : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={STATUS_COLOR[detail.status]}>{PROJECT_STATUS_LABEL[detail.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tạo lúc">{dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default ProjectPage
