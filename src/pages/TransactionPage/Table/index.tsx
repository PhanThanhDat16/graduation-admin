import TableAction from '@/components/common/TableAction'
import type { TransactionResponse, TransactionStatus, TransactionType } from '@/types/transaction'
import { formatVnd } from '@/utils/formatCurrency'
import { Table, Tag } from 'antd'
import type { ColumnType } from 'antd/es/table'
import Text from 'antd/es/typography/Text'
import dayjs from 'dayjs'

type Props = {
  transactions: TransactionResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onView: (record: TransactionResponse) => void
}

const TYPEMAP: Record<TransactionType, { color: string; label: string }> = {
  deposit: { color: 'green', label: 'Nạp tiền' },
  withdraw: { color: 'volcano', label: 'Rút tiền' },
  escrow_deposit: { color: 'blue', label: 'Ký quỹ' },
  escrow_release: { color: 'cyan', label: 'Giải ngân' },
  refund: { color: 'purple', label: 'Hoàn tiền' },
  admin_fee: { color: 'gold', label: 'Phí hệ thống' }
}

const STATUSMAP: Record<TransactionStatus, { color: string; label: string }> = {
  pending: { color: 'processing', label: 'Đang chờ' },
  completed: { color: 'success', label: 'Thành công' },
  failed: { color: 'warning', label: 'Thất bại' },
  cancelled: { color: 'error', label: 'Đã hủy' }
}

const TableTransaction = ({ transactions, page, pageSize, loading, onPageChange, total, onView, onDelete }: Props) => {
  const columns: ColumnType<TransactionResponse>[] = [
    {
      title: 'Mã giao dịch',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: { fullName?: string }) => <b>{userId?.fullName || '—'}</b>
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 150,
      render: (type: TransactionType) => {
        return <Tag color={TYPEMAP[type].color}>{TYPEMAP[type as TransactionType].label}</Tag>
      }
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: number) => <Text strong>{formatVnd(amount)}</Text>
    },
    {
      title: 'Cổng thanh toán',
      dataIndex: 'methodPayment',
      key: 'methodPayment',
      align: 'center',
      render: (method: string) => (method ? <Tag>{method.toUpperCase()}</Tag> : '-')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status: TransactionStatus) => {
        return <Tag color={STATUSMAP[status].color}>{STATUSMAP[status].label}</Tag>
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm:ss')
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: 110,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: TransactionResponse) => (
        <>
          <TableAction showView onView={() => onView(record)} onDelete={() => onDelete(record._id)} />
        </>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={transactions}
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

export default TableTransaction
