import TableAction from '@/components/common/TableAction'
import type { WithDrawResponse, WithDrawStatus } from '@/types/withdraw'
import { formatVnd } from '@/utils/formatCurrency'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Avatar, Image, Popconfirm, Space, Table, Tag } from 'antd'
import type { ColumnType } from 'antd/es/table'
import Text from 'antd/es/typography/Text'
import dayjs from 'dayjs'

type Props = {
  withdraw: WithDrawResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

const STATUSMAP: Record<WithDrawStatus, { color: string; label: string }> = {
  pending: { color: 'processing', label: 'Đang chờ' },
  approved: { color: 'success', label: 'Hoàn thành' },
  rejected: { color: 'error', label: 'Từ chối' },
  paid: { color: 'cyan', label: 'Đã thanh toán' }
}

const TableWithDraw = ({ withdraw, page, pageSize, loading, onPageChange, total, onApprove, onReject }: Props) => {
  const columns: ColumnType<WithDrawResponse>[] = [
    {
      title: 'Mã yêu cầu',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'accountId',
      key: 'accountId',
      render: (accountId: any) => <Text>{accountId?.userId._id || '—'}</Text>
    },
    {
      title: 'Thông tin tài khoản',
      dataIndex: 'accountId',
      key: 'accountId',
      render: (accountId: any) => (
        <Space>
          <Avatar src={accountId?.userId.avatar} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{accountId?.accountName || '—'}</div>
            <div>
              <Text type="secondary">{accountId?.accountNumber || '—'}</Text>
            </div>
            <Space>
              <Image width={40} src={accountId?.logo} />
              <Text>{accountId?.bankShortName}</Text>
            </Space>
          </div>
        </Space>
      )
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 150,
      render: (amount: number) => <Text strong>{formatVnd(amount)}</Text>
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      width: 200,
      render: (date: any) => <Text>{dayjs(date).format('DD/MM/YYYY HH:mm:ss')}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status: WithDrawStatus) => {
        return <Tag color={STATUSMAP[status].color}>{STATUSMAP[status].label}</Tag>
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: WithDrawResponse) => (
        <TableAction
          extraActions={
            record.status === 'pending'
              ? [
                  {
                    icon: (
                      <Popconfirm
                        title="Đồng ý yêu cầu?"
                        description="Bạn có chắc chắn muốn duyệt yêu cầu rút tiền này không?"
                        onConfirm={() => onApprove(record._id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                      >
                        <CheckOutlined />
                      </Popconfirm>
                    ),
                    tooltip: 'Đồng ý',
                    onClick: () => {},
                    color: '#52c41a'
                  },
                  {
                    icon: (
                      <Popconfirm
                        title="Hủy yêu cầu?"
                        description="Bạn có chắc chắn muốn hủy yêu cầu rút tiền này không?"
                        onConfirm={() => onReject(record._id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                      >
                        <CloseOutlined />
                      </Popconfirm>
                    ),
                    tooltip: 'Hủy yêu cầu',
                    onClick: () => {},
                    color: '#ff4d4f'
                  }
                ]
              : []
          }
        />
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={withdraw}
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

export default TableWithDraw
