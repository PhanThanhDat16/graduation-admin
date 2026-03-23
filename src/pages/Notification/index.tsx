import { useMemo, useState } from 'react'
import { Button, Card, Descriptions, Progress, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import {
  MOCK_ADMIN_NOTIFICATIONS,
  NOTIFICATION_AUDIENCE_LABEL,
  type MockAdminNotification,
  type NotificationAudience
} from '@/mock/notifications.mock'

const { Title, Text } = Typography

const AUDIENCE_COLOR: Record<NotificationAudience, string> = {
  all: 'blue',
  clients: 'cyan',
  freelancers: 'green'
}

const NotificationPage = () => {
  const [detail, setDetail] = useState<MockAdminNotification | null>(null)

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
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(record)}>
            Chi tiết
          </Button>
        )
      }
    ],
    []
  )

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? detail.title : 'Chi tiết thông báo'}
        width={520}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tiêu đề">{detail.title}</Descriptions.Item>
            <Descriptions.Item label="Đối tượng">
              <Tag color={AUDIENCE_COLOR[detail.audience]}>{NOTIFICATION_AUDIENCE_LABEL[detail.audience]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung">{detail.body}</Descriptions.Item>
            <Descriptions.Item label="Gửi lúc">{dayjs(detail.sentAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Tỷ lệ đọc (mock)">
              <Progress percent={detail.readRatePercent} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default NotificationPage
