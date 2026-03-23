import { useMemo, useState } from 'react'
import { Alert, Button, Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import {
  MOCK_PROJECT_TRANSACTIONS,
  PROJECT_TX_STATUS_LABEL,
  PROJECT_TX_TYPE_LABEL,
  type MockProjectTransaction,
  type ProjectTxStatus,
  type ProjectTxType
} from '@/mock/projectTransactions.mock'
import { WALLET_PAGE } from '@/constants'
import { formatVnd } from '@/utils/formatCurrency'

const { Title, Text } = Typography

const TYPE_COLOR: Record<ProjectTxType, string> = {
  escrow_hold: 'blue',
  milestone_release: 'green',
  platform_fee: 'purple',
  refund_partial: 'orange',
  dispute_escrow: 'red'
}

const TX_STATUS_COLOR: Record<ProjectTxStatus, string> = {
  completed: 'success',
  pending: 'processing',
  failed: 'error'
}

const TransactionPage = () => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<ProjectTxType | 'all'>('all')
  const [detail, setDetail] = useState<MockProjectTransaction | null>(null)

  const filtered = useMemo(() => {
    return MOCK_PROJECT_TRANSACTIONS.filter((t) => {
      const q = search.toLowerCase()
      const matchText =
        !search.trim() ||
        t.code.toLowerCase().includes(q) ||
        t.projectCode.toLowerCase().includes(q) ||
        (t.contractCode?.toLowerCase().includes(q) ?? false) ||
        t.note.toLowerCase().includes(q)
      const matchType = type === 'all' || t.type === type
      return matchText && matchType
    })
  }, [search, type])

  const columns: ColumnsType<MockProjectTransaction> = useMemo(
    () => [
      { title: 'Mã GD', dataIndex: 'code', key: 'code', width: 170 },
      { title: 'Dự án', dataIndex: 'projectCode', key: 'pj', width: 130 },
      {
        title: 'Hợp đồng',
        dataIndex: 'contractCode',
        key: 'hd',
        width: 130,
        render: (c: string | null) => c ?? <Text type="secondary">—</Text>
      },
      {
        title: 'Loại',
        dataIndex: 'type',
        key: 'type',
        width: 200,
        render: (ty: ProjectTxType) => <Tag color={TYPE_COLOR[ty]}>{PROJECT_TX_TYPE_LABEL[ty]}</Tag>
      },
      {
        title: 'Số tiền',
        dataIndex: 'amountVnd',
        key: 'amt',
        width: 150,
        render: (n: number) => formatVnd(n)
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'st',
        width: 120,
        render: (s: ProjectTxStatus) => <Tag color={TX_STATUS_COLOR[s]}>{PROJECT_TX_STATUS_LABEL[s]}</Tag>
      },
      { title: 'Mô tả', dataIndex: 'note', key: 'note', ellipsis: true },
      {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'at',
        width: 150,
        render: (iso: string) => dayjs(iso).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Thao tác',
        key: 'ac',
        fixed: 'right',
        width: 110,
        render: (_: unknown, record: MockProjectTransaction) => (
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
          Giao dịch dự án
        </Title>
        <Text type="secondary">Luồng tiền gắn với hợp đồng: giữ tạm, giải ngân cột mốc, phí nền tảng, hoàn tiền…</Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="Phạm vi hiển thị"
        description={
          <span>
            Trang này chỉ liệt kê giao dịch liên quan đến <strong>dự án / hợp đồng</strong>. Giao dịch{' '}
            <strong>nạp / rút ví cá nhân</strong> của freelance và khách hàng không hiển thị ở đây (bảo mật cá nhân).
            Cấp quản trị tra cứu tại trang <Link to={WALLET_PAGE}>Ví &amp; nạp rút</Link>.
          </span>
        }
      />

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Mã GD, mã dự án, hợp đồng, mô tả…"
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 340 }}
          />
          <Select
            value={type}
            onChange={setType}
            style={{ width: 240 }}
            options={[
              { label: 'Mọi loại', value: 'all' },
              ...(Object.keys(PROJECT_TX_TYPE_LABEL) as ProjectTxType[]).map((k) => ({
                label: PROJECT_TX_TYPE_LABEL[k],
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
          scroll={{ x: 1320 }}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Giao dịch: ${detail.code}` : 'Chi tiết'}
        width={560}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã giao dịch">{detail.code}</Descriptions.Item>
            <Descriptions.Item label="Mã dự án">{detail.projectCode}</Descriptions.Item>
            <Descriptions.Item label="Hợp đồng">{detail.contractCode ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Loại">
              <Tag color={TYPE_COLOR[detail.type]}>{PROJECT_TX_TYPE_LABEL[detail.type]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">{formatVnd(detail.amountVnd)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={TX_STATUS_COLOR[detail.status]}>{PROJECT_TX_STATUS_LABEL[detail.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả / ghi chú">{detail.note}</Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              {dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default TransactionPage
