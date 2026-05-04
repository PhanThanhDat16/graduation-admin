import TableAction from '@/components/common/TableAction'
import type { TransactionResponse } from '@/types/transaction'
import { formatVnd } from '@/utils/formatCurrency'
import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text } = Typography

type Props = {
  wallettransactions: TransactionResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onView: (record: TransactionResponse) => void
}

const TableWalletDetail = ({
  wallettransactions,
  page,
  pageSize,
  loading,
  onPageChange,
  total,
  onView,
  onDelete
}: Props) => {
  const columns: ColumnsType<TransactionResponse> = [
    {
      title: 'Mã giao dịch',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
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
      render: (method: string) => (method ? <Tag>{method.toUpperCase()}</Tag> : '-')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default'
        let label = status
        if (status === 'success') {
          color = 'success'
          label = 'Thành công'
        } else if (status === 'pending') {
          color = 'processing'
          label = 'Đang xử lý'
        } else if (status === 'rejected') {
          color = 'error'
          label = 'Đã từ chối'
        }
        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm:ss')
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: 110,
      fixed: 'end',
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
      dataSource={wallettransactions}
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

export default TableWalletDetail
