import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Progress, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  MOCK_ADMIN_NOTIFICATIONS,
  NOTIFICATION_AUDIENCE_LABEL,
  type MockAdminNotification,
  type NotificationAudience
} from '@/mock/notifications.mock'
import { NOTIFICATION_PAGE } from '@/constants'

const { Title, Text } = Typography

const AUDIENCE_COLOR: Record<NotificationAudience, string> = {
  all: 'blue',
  clients: 'cyan',
  freelancers: 'green'
}

const NotificationPage = () => {
  const navigate = useNavigate()

  const handleViewDetail = (record: MockAdminNotification) => {
    navigate(`${NOTIFICATION_PAGE}/${record.id}`)
  }

  const columns: ColumnsType<MockAdminNotification> = useMemo(
    () => [
      { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
      {
        title: 'Đối tượng',
        dataIndex: 'audience',
        key: 'aud',
        width: 160,
        render: (a: NotificationAudience) => <Tag color={AUDIENCE_COLOR[a]}>{NOTIFICATION_AUDIENCE_LABEL[a]}</Tag>
      },
      { title: 'Nội dung', dataIndex: 'body', key: 'body', ellipsis: true },
      {
        title: 'Gửi lúc',
        dataIndex: 'sentAt',
        key: 'sent',
        width: 150,
        render: (iso: string) => dayjs(iso).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Tỷ lệ đọc (mock)',
        dataIndex: 'readRatePercent',
        key: 'rr',
        width: 200,
        render: (n: number) => <Progress percent={n} size="small" status="active" />
      },
      {
        title: 'Thao tác',
        key: 'ac',
        width: 110,
        fixed: 'right',
        render: (_: unknown, record: MockAdminNotification) => (
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
        )
      }
    ],
    [handleViewDetail]
  )

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Thông báo hệ thống
        </Title>
        <Text type="secondary">
          Các bản tin đã gửi tới người dùng nền tảng (mock) — dùng để theo dõi vận hành truyền thông.
        </Text>
      </div>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={MOCK_ADMIN_NOTIFICATIONS}
          pagination={false}
          scroll={{ x: 1020 }}
        />
      </Card>
    </Space>
  )
}

export default NotificationPage
