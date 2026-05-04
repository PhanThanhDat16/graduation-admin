import TableAction from '@/components/common/TableAction'
import type { TransactionResponse, TransactionStatus } from '@/types/transaction'
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

const LABEL_STATUS: Record<TransactionStatus, string> = {
  pending: 'Đang chờ',
  completed: 'Thành công',
  failed: 'Thất bại',
  cancelled: 'Đã hủy'
}

const COLOR_STATUS: Record<TransactionStatus, string> = {
  pending: 'processing',
  completed: 'success',
  failed: 'warning',
  cancelled: 'error'
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
      render: (type: string) => {
        const isDeposit = type === 'deposit'
        return <Tag color={isDeposit ? 'green' : 'volcano'}>{isDeposit ? 'Nạp tiền' : 'Rút tiền'}</Tag>
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
        return <Tag color={COLOR_STATUS[status]}>{LABEL_STATUS[status]}</Tag>
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
