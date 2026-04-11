import TableAction from '@/components/common/TableAction'
import type { UserResponse } from '@/types/user'
import { Table, Tag } from 'antd'

type Props = {
  freelancers: UserResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onView: (record: UserResponse) => void
}

const TableFreelancers = ({
  freelancers,
  page,
  pageSize,
  loading,
  onPageChange,
  total,
  onView,
  onDelete,
  onEdit
}: Props) => {
  const columns = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => <b>{text}</b>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số ĐT',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Xác thực',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) =>
        isVerified ? <Tag color="blue">Đã xác minh</Tag> : <Tag color="warning">Chưa xác minh</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (status === 'active' ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ẩn</Tag>)
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, record: UserResponse) => (
        <>
          <TableAction
            showView
            showEdit
            showDelete
            onView={() => onView(record)}
            onEdit={() => onEdit(record._id)}
            onDelete={() => onDelete(record._id)}
          />
        </>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={freelancers}
      loading={loading}
      rowKey={'_id'}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPageChange
      }}
    />
  )
}

export default TableFreelancers
