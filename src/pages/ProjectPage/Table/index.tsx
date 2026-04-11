import TableAction from '@/components/common/TableAction'
import type { ProjectResponse } from '@/types/project'
import { Table, Tag } from 'antd'

type Props = {
  projects: ProjectResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onView: (record: ProjectResponse) => void
}

const TableProjects = ({ projects, page, pageSize, loading, onPageChange, total, onView, onDelete, onEdit }: Props) => {
  const columns = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Chủ dự án',
      dataIndex: 'contractorName',
      key: 'contractorName',
      render: (text: string) => <b>{text}</b>
    },
    {
      title: 'Nhà thầu',
      dataIndex: 'freelancerName',
      key: 'freelancerName'
    },
    {
      title: 'Ngân sách tối đa',
      dataIndex: 'budgetMax',
      key: 'budgetMax'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'open' ? (
          <Tag color="green">Hoạt động</Tag>
        ) : status === 'closed' ? (
          <Tag color="blue">Đã giao</Tag>
        ) : status === 'completed' ? (
          <Tag color="gold">Hoàn thành</Tag>
        ) : (
          <Tag color="red">Đã hủy</Tag>
        )
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, record: ProjectResponse) => (
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
      dataSource={projects}
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

export default TableProjects
