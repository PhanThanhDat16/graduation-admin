import { useMemo, useState } from 'react'
import { Button, Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { DISPUTE_STATUS_LABEL, MOCK_DISPUTES, type DisputeStatus, type MockDispute } from '@/mock/disputes.mock'

const { Title, Text } = Typography

const STATUS_COLOR: Record<DisputeStatus, string> = {
  open: 'red',
  mediation: 'orange',
  resolved: 'green',
  closed: 'default'
}

const DisputePage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<DisputeStatus | 'all'>('all')
  const [detail, setDetail] = useState<MockDispute | null>(null)

  const filtered = useMemo(() => {
    return MOCK_DISPUTES.filter((d) => {
      const q = search.toLowerCase()
      const matchText =
        !search.trim() ||
        d.code.toLowerCase().includes(q) ||
        d.projectCode.toLowerCase().includes(q) ||
        d.projectTitle.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q)
      const matchStatus = status === 'all' || d.status === status
      return matchText && matchStatus
    })
  }, [search, status])

  const columns: ColumnsType<MockDispute> = useMemo(
    () => [
      { title: 'Mã TC', dataIndex: 'code', key: 'code', width: 120 },
      { title: 'Dự án', dataIndex: 'projectTitle', key: 'pt', ellipsis: true },
      { title: 'Mã dự án', dataIndex: 'projectCode', key: 'pc', width: 120 },
      { title: 'Chủ dự án', dataIndex: 'clientName', key: 'cl', ellipsis: true },
      { title: 'Nhà thầu', dataIndex: 'freelancerName', key: 'fl', ellipsis: true },
      { title: 'Tóm tắt', dataIndex: 'summary', key: 'sum', ellipsis: true },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'st',
        width: 120,
        render: (s: DisputeStatus) => <Tag color={STATUS_COLOR[s]}>{DISPUTE_STATUS_LABEL[s]}</Tag>
      },
      {
        title: 'Mở lúc',
        dataIndex: 'openedAt',
        key: 'op',
        width: 150,
        render: (iso: string) => dayjs(iso).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Thao tác',
        key: 'ac',
        fixed: 'right',
        width: 110,
        render: (_: unknown, record: MockDispute) => (
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
          Tranh chấp
        </Title>
        <Text type="secondary">Theo dõi các vụ tranh chấp giữa chủ dự án và nhà thầu, gắn với dự án cụ thể.</Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Mã, dự án, tóm tắt…"
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
              ...(Object.keys(DISPUTE_STATUS_LABEL) as DisputeStatus[]).map((k) => ({
                label: DISPUTE_STATUS_LABEL[k],
                value: k
              }))
            ]}
          />
        </Space>
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 8 }} scroll={{ x: 1220 }} />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Tranh chấp: ${detail.code}` : 'Chi tiết'}
        width={560}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã vụ">{detail.code}</Descriptions.Item>
            <Descriptions.Item label="Dự án">{detail.projectTitle}</Descriptions.Item>
            <Descriptions.Item label="Mã dự án">{detail.projectCode}</Descriptions.Item>
            <Descriptions.Item label="Chủ dự án">{detail.clientName}</Descriptions.Item>
            <Descriptions.Item label="Nhà thầu">{detail.freelancerName}</Descriptions.Item>
            <Descriptions.Item label="Tóm tắt">{detail.summary}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={STATUS_COLOR[detail.status]}>{DISPUTE_STATUS_LABEL[detail.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mở lúc">{dayjs(detail.openedAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default DisputePage
