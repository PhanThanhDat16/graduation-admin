import { useMemo, useState } from 'react'
import { Button, Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import { DetailDrawer } from '@/components/DetailDrawer'
import { formatVnd } from '@/utils/formatCurrency'

import { CONTRACT_STATUS_LABEL, type ContractResponse, type ContractStatus } from '@/types/contract'

const { Title, Text } = Typography

const STATUS_COLOR: Record<ContractStatus, string> = {
  draft: 'default',
  pending: 'processing',
  waiting_payment: 'warning',
  running: 'blue',
  submitted: 'cyan',
  completed: 'success',
  dispute: 'magenta',
  cancelled: 'error'
}

const ContractPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ContractStatus | 'all'>('all')
  const [detail, setDetail] = useState<ContractResponse | null>(null)
  console.log(search)

  // const filtered = useMemo(() => {
  //   return MOCK_CONTRACTS.filter((c) => {
  //     const q = search.toLowerCase()
  //     const matchText =
  //       !search.trim() ||
  //       c.code.toLowerCase().includes(q) ||
  //       c.projectTitle.toLowerCase().includes(q) ||
  //       c.clientName.toLowerCase().includes(q) ||
  //       c.freelancerName.toLowerCase().includes(q)
  //     const matchStatus = status === 'all' || c.status === status
  //     return matchText && matchStatus
  //   })
  // }, [search, status])

  const columns: ColumnsType<ContractResponse> = useMemo(
    () => [
      { title: 'Mã HĐ', dataIndex: `_id`, key: `_id`, width: 130 },
      { title: 'Mã dự án', dataIndex: 'project_id', key: 'pc', width: 130 },
      { title: 'Chủ đầu tư', dataIndex: 'contractor_id', key: 'cl', ellipsis: true },
      { title: 'Nhà thầu', dataIndex: 'freelancer_id', key: 'fl', ellipsis: true },
      {
        title: 'Giá trị',
        dataIndex: 'total_amount',
        key: 'total_amount',
        width: 140,
        render: (n: number) => formatVnd(n)
      },
      {
        title: 'Phí nền tảng',
        dataIndex: 'admin_fee',
        key: 'admin_fee',
        width: 140,
        render: (n: number) => formatVnd(n)
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (s: ContractStatus) => <Tag color={STATUS_COLOR[s]}>{CONTRACT_STATUS_LABEL[s]}</Tag>
      },
      // {
      //   title: 'Ký lúc',
      //   dataIndex: 'signedAt',
      //   key: 'sig',
      //   width: 150,
      //   render: (iso: string | null) => (iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : <Text type="secondary">—</Text>)
      // },
      {
        title: 'Thao tác',
        key: 'act',
        fixed: 'right',
        width: 110,
        render: (_: unknown, record: ContractResponse) => (
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
          dataSource={[]}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          scroll={{ x: 1220 }}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Hợp đồng: ${detail._id}` : 'Chi tiết'}
        width={560}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã hợp đồng">{detail?._id}</Descriptions.Item>
            <Descriptions.Item label="Mã dự án">{detail?.project_id}</Descriptions.Item>
            <Descriptions.Item label="Chủ đầu tư">{detail?.contractor_id._id}</Descriptions.Item>
            <Descriptions.Item label="Nhà thầu">{detail?.freelancer_id._id}</Descriptions.Item>
            <Descriptions.Item label="Giá trị">{formatVnd(detail?.total_amount)}</Descriptions.Item>
            <Descriptions.Item label="Phí nền tảng">{formatVnd(detail?.admin_fee)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={STATUS_COLOR[detail?.status]}>{CONTRACT_STATUS_LABEL[detail.status]}</Tag>
            </Descriptions.Item>
            {/* <Descriptions.Item label="Ký lúc">
              {detail.signedAt ? dayjs(detail.signedAt).format('DD/MM/YYYY HH:mm') : '—'}
            </Descriptions.Item> */}
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default ContractPage
