import { useMemo, useState } from 'react'
import { Button, Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { CONTRACT_STATUS_LABEL, MOCK_CONTRACTS, type ContractStatus, type MockContract } from '@/mock/contracts.mock'
import { formatVnd } from '@/utils/formatCurrency'

const { Title, Text } = Typography

const STATUS_COLOR: Record<ContractStatus, string> = {
  draft: 'default',
  active: 'processing',
  completed: 'success',
  terminated: 'error'
}

const ContractPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ContractStatus | 'all'>('all')
  const [detail, setDetail] = useState<MockContract | null>(null)

  const filtered = useMemo(() => {
    return MOCK_CONTRACTS.filter((c) => {
      const q = search.toLowerCase()
      const matchText =
        !search.trim() ||
        c.code.toLowerCase().includes(q) ||
        c.projectTitle.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.freelancerName.toLowerCase().includes(q)
      const matchStatus = status === 'all' || c.status === status
      return matchText && matchStatus
    })
  }, [search, status])

  const columns: ColumnsType<MockContract> = useMemo(
    () => [
      { title: 'Mã HĐ', dataIndex: 'code', key: 'code', width: 130 },
      { title: 'Dự án', dataIndex: 'projectTitle', key: 'pt', ellipsis: true },
      { title: 'Mã dự án', dataIndex: 'projectCode', key: 'pc', width: 130 },
      { title: 'Chủ đầu tư', dataIndex: 'clientName', key: 'cl', ellipsis: true },
      { title: 'Nhà thầu', dataIndex: 'freelancerName', key: 'fl', ellipsis: true },
      {
        title: 'Giá trị',
        dataIndex: 'valueVnd',
        key: 'val',
        width: 140,
        render: (n: number) => formatVnd(n)
      },
      {
        title: 'Phí nền tảng',
        dataIndex: 'platformFeeVnd',
        key: 'fee',
        width: 140,
        render: (n: number) => formatVnd(n)
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'st',
        width: 130,
        render: (s: ContractStatus) => <Tag color={STATUS_COLOR[s]}>{CONTRACT_STATUS_LABEL[s]}</Tag>
      },
      {
        title: 'Ký lúc',
        dataIndex: 'signedAt',
        key: 'sig',
        width: 150,
        render: (iso: string | null) => (iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : <Text type="secondary">—</Text>)
      },
      {
        title: 'Thao tác',
        key: 'act',
        fixed: 'right',
        width: 110,
        render: (_: unknown, record: MockContract) => (
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(record)}>
            Chi tiết
          </Button>
        )
      }
    ],
    []
  )

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
          <Input.Search
            allowClear
            placeholder="Tìm mã HĐ, dự án, bên ký…"
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
              ...(Object.keys(CONTRACT_STATUS_LABEL) as ContractStatus[]).map((k) => ({
                label: CONTRACT_STATUS_LABEL[k],
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
          scroll={{ x: 1220 }}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Hợp đồng: ${detail.code}` : 'Chi tiết'}
        width={560}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã hợp đồng">{detail.code}</Descriptions.Item>
            <Descriptions.Item label="Dự án">{detail.projectTitle}</Descriptions.Item>
            <Descriptions.Item label="Mã dự án">{detail.projectCode}</Descriptions.Item>
            <Descriptions.Item label="Chủ đầu tư">{detail.clientName}</Descriptions.Item>
            <Descriptions.Item label="Nhà thầu">{detail.freelancerName}</Descriptions.Item>
            <Descriptions.Item label="Giá trị">{formatVnd(detail.valueVnd)}</Descriptions.Item>
            <Descriptions.Item label="Phí nền tảng">{formatVnd(detail.platformFeeVnd)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={STATUS_COLOR[detail.status]}>{CONTRACT_STATUS_LABEL[detail.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ký lúc">
              {detail.signedAt ? dayjs(detail.signedAt).format('DD/MM/YYYY HH:mm') : '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default ContractPage
