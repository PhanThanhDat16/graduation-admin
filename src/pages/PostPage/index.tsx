import { useCallback, useMemo, useState } from 'react'
import { Button, Card, Descriptions, Input, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { MOCK_POSTS, POST_STATUS_LABEL, type MockPost, type PostStatus } from '@/mock/posts.mock'
import { formatVnd } from '@/utils/formatCurrency'

const { Title, Text } = Typography

const STATUS_COLOR: Record<PostStatus, string> = {
  published: 'blue',
  draft: 'default',
  closed: 'success'
}

const PostPage = () => {
  const [list, setList] = useState<MockPost[]>(() => [...MOCK_POSTS])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<PostStatus | 'all'>('all')
  const [detail, setDetail] = useState<MockPost | null>(null)

  const filtered = useMemo(() => {
    return list.filter((p) => {
      const q = search.toLowerCase()
      const matchText =
        !search.trim() ||
        p.title.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        (p.projectCode?.toLowerCase().includes(q) ?? false)
      const matchStatus = status === 'all' || p.status === status
      return matchText && matchStatus
    })
  }, [list, search, status])

  const handleDelete = useCallback((id: string) => {
    setList((prev) => prev.filter((p) => p.id !== id))
    setDetail((d) => (d?.id === id ? null : d))
    message.success('Đã xóa bài đăng (mock).')
  }, [])

  const columns: ColumnsType<MockPost> = useMemo(
    () => [
      { title: 'Mã bài', dataIndex: 'code', key: 'code', width: 120 },
      { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
      { title: 'Người đăng', dataIndex: 'authorName', key: 'auth', ellipsis: true },
      {
        title: 'Mã dự án',
        dataIndex: 'projectCode',
        key: 'pc',
        width: 130,
        render: (c: string | null) => c ?? <Text type="secondary">—</Text>
      },
      {
        title: 'Gợi ý ngân sách',
        dataIndex: 'budgetHintVnd',
        key: 'bud',
        width: 150,
        render: (n: number | null) => (n != null ? formatVnd(n) : '—')
      },
      { title: 'Ứng viên', dataIndex: 'applicationsCount', key: 'app', width: 100 },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'st',
        width: 140,
        render: (s: PostStatus) => <Tag color={STATUS_COLOR[s]}>{POST_STATUS_LABEL[s]}</Tag>
      },
      {
        title: 'Đăng lúc',
        dataIndex: 'publishedAt',
        key: 'pub',
        width: 150,
        render: (iso: string | null) => (iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : <Text type="secondary">—</Text>)
      },
      {
        title: 'Thao tác',
        key: 'act',
        fixed: 'right',
        width: 180,
        render: (_: unknown, record: MockPost) => (
          <Space size={0} wrap>
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(record)}>
              Chi tiết
            </Button>
            <Popconfirm
              title="Xóa bài đăng?"
              description="Chỉ áp dụng trên dữ liệu mock."
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ],
    [handleDelete]
  )

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Bài đăng tuyển
        </Title>
        <Text type="secondary">Tin tuyển freelance / thầu dự án do chủ đầu tư đăng (mock).</Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Tiêu đề, tác giả, mã…"
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
              ...(Object.keys(POST_STATUS_LABEL) as PostStatus[]).map((k) => ({
                label: POST_STATUS_LABEL[k],
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
          scroll={{ x: 1180 }}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Bài đăng: ${detail.code}` : 'Chi tiết'}
        width={560}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã bài">{detail.code}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{detail.title}</Descriptions.Item>
            <Descriptions.Item label="Người đăng">{detail.authorName}</Descriptions.Item>
            <Descriptions.Item label="Mã dự án liên kết">{detail.projectCode ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Gợi ý ngân sách">
              {detail.budgetHintVnd != null ? formatVnd(detail.budgetHintVnd) : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Số ứng viên">{detail.applicationsCount}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={STATUS_COLOR[detail.status]}>{POST_STATUS_LABEL[detail.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Đăng lúc">
              {detail.publishedAt ? dayjs(detail.publishedAt).format('DD/MM/YYYY HH:mm') : '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default PostPage
