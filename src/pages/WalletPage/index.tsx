import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  MOCK_WALLET_OPERATIONS,
  WALLET_OP_STATUS_LABEL,
  WALLET_OP_TYPE_LABEL,
  type MockWalletOperation,
  type WalletOpStatus,
  type WalletOpType,
  type WalletUserRole
} from '@/mock/walletOperations.mock'
import { formatVnd } from '@/utils/formatCurrency'
import { WALLET_PAGE } from '@/constants'

const { Title, Text } = Typography

const ROLE_LABEL: Record<WalletUserRole, string> = {
  freelancer: 'Nhà thầu',
  client: 'Chủ dự án / Khách'
}

const ROLE_COLOR: Record<WalletUserRole, string> = {
  freelancer: 'geekblue',
  client: 'cyan'
}

const OP_COLOR: Record<WalletOpType, string> = {
  deposit: 'green',
  withdraw: 'gold'
}

const OP_STATUS_COLOR: Record<WalletOpStatus, string> = {
  success: 'success',
  pending: 'processing',
  rejected: 'error'
}

const WalletPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<WalletOpType | 'all'>('all')
  const [role, setRole] = useState<WalletUserRole | 'all'>('all')

  const filtered = useMemo(() => {
    return MOCK_WALLET_OPERATIONS.filter((w) => {
      const q = search.toLowerCase()
      const matchText =
        !search.trim() ||
        w.code.toLowerCase().includes(q) ||
        w.userDisplayName.toLowerCase().includes(q) ||
        w.channel.toLowerCase().includes(q)
      const matchType = type === 'all' || w.type === type
      const matchRole = role === 'all' || w.userRole === role
      return matchText && matchType && matchRole
    })
  }, [search, type, role])

  const handleViewDetail = (record: MockWalletOperation) => {
    navigate(`${WALLET_PAGE}/${record.id}`)
  }

  const columns: ColumnsType<MockWalletOperation> = useMemo(
    () => [
      { title: 'Mã GD', dataIndex: 'code', key: 'code', width: 150 },
      { title: 'Người dùng', dataIndex: 'userDisplayName', key: 'u', ellipsis: true },
      {
        title: 'Vai trò',
        dataIndex: 'userRole',
        key: 'r',
        width: 160,
        render: (r: WalletUserRole) => <Tag color={ROLE_COLOR[r]}>{ROLE_LABEL[r]}</Tag>
      },
      {
        title: 'Loại',
        dataIndex: 'type',
        key: 't',
        width: 120,
        render: (t: WalletOpType) => <Tag color={OP_COLOR[t]}>{WALLET_OP_TYPE_LABEL[t]}</Tag>
      },
      {
        title: 'Số tiền',
        dataIndex: 'amountVnd',
        key: 'a',
        width: 150,
        render: (n: number) => formatVnd(n)
      },
      { title: 'Kênh', dataIndex: 'channel', key: 'ch', ellipsis: true },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 's',
        width: 120,
        render: (s: WalletOpStatus) => <Tag color={OP_STATUS_COLOR[s]}>{WALLET_OP_STATUS_LABEL[s]}</Tag>
      },
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
        render: (_: unknown, record: MockWalletOperation) => (
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
          Ví — nạp &amp; rút
        </Title>
        <Text type="secondary">
          Tra cứu giao dịch nạp/rút ví cá nhân của người dùng (nhạy cảm, chỉ dành cho quản trị viên).
        </Text>
      </div>

      <Alert
        type="warning"
        showIcon
        title="Dữ liệu nhạy cảm"
        description="Thông tin nạp/rút không hiển thị cho nhân viên thường trên các màn hình công khai. Luồng tiền theo dự án (escrow, cột mốc…) xem tại trang Giao dịch dự án."
      />

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Mã GD, tên user, kênh…"
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            value={type}
            onChange={setType}
            style={{ width: 160 }}
            options={[
              { label: 'Tất cả loại', value: 'all' },
              { label: WALLET_OP_TYPE_LABEL.deposit, value: 'deposit' },
              { label: WALLET_OP_TYPE_LABEL.withdraw, value: 'withdraw' }
            ]}
          />
          <Select
            value={role}
            onChange={setRole}
            style={{ width: 200 }}
            options={[
              { label: 'Mọi vai trò', value: 'all' },
              { label: ROLE_LABEL.freelancer, value: 'freelancer' },
              { label: ROLE_LABEL.client, value: 'client' }
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
    </Space>
  )
}

export default WalletPage
