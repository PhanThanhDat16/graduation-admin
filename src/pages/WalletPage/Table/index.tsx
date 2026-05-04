import TableAction from '@/components/common/TableAction'
import { useAuthStore } from '@/store/useAuthStore'
import type { WalletResponse } from '@/types/wallet'
import { formatVnd } from '@/utils/formatCurrency'
import { Avatar, Space, Table, Tag, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text } = Typography

type Props = {
  wallets: WalletResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onView: (record: WalletResponse) => void
}
const TableWallets = ({ wallets, page, pageSize, loading, onPageChange, total, onView, onDelete }: Props) => {
  const { user } = useAuthStore()
  const columns: ColumnType<WalletResponse>[] = [
    {
      title: 'Mã ví',
      dataIndex: '_id',
      key: '_id',
      width: 220
    },
    {
      title: 'Chủ ví',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: any) => (
        <Space>
          <Avatar src={userId?.avatar} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{userId?.fullName}</div>
            <Text type="secondary">{userId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'userId',
      key: 'role',
      width: 120,
      align: 'center',
      render: (userId: any) => (
        <Tag color={userId?.role === 'freelancer' ? 'success' : 'blue'}>{userId?.role?.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Số dư',
      dataIndex: 'balance',
      align: 'right',
      key: 'balance',
      width: 150,
      render: (balance: number) => {
        if (user?.role === 'staff') {
          return '********'
        }
        return <Text strong>{formatVnd(balance)}</Text>
      }
    },
    {
      title: 'Giao dịch gần nhất',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      align: 'center',
      render: (updatedAt: string) => {
        return dayjs(updatedAt).format('DD/MM/YYYY HH:mm:ss')
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: 110,
      fixed: 'end',
      align: 'center',
      render: (_: any, record: WalletResponse) => (
        <>
          <TableAction showView onView={() => onView(record)} onDelete={() => onDelete(record._id)} />
        </>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={wallets}
      loading={loading}
      rowKey={'_id'}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        hideOnSinglePage: true,
        onChange: onPageChange
      }}
      scroll={{ x: 1220 }}
    />
  )
}

export default TableWallets
