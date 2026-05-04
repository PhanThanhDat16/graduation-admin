import TableAction from '@/components/common/TableAction'
import type { ProjectResponse, ProjectStatus } from '@/types/project'
import { Table, Tag } from 'antd'
import type { ColumnType } from 'antd/es/table'

type Props = {
  projects: ProjectResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onView: (record: ProjectResponse) => void
}

const LABEL_STATUS: Record<ProjectStatus, string> = {
  open: 'Mở đăng ký',
  closed: 'Đóng đăng ký',
  draft: 'Nháp'
}

const COLOR_STATUS: Record<ProjectStatus, string> = {
  open: 'success',
  closed: 'error',
  draft: 'defaul'
}

const TableProjects = ({ projects, page, pageSize, loading, onPageChange, total, onView, onDelete }: Props) => {
  const columns: ColumnType<ProjectResponse>[] = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Tên dự án',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Chủ dự án',
      dataIndex: 'contractorId',
      key: 'contractorId',
      render: (contractorId: { fullName?: string }) => <b>{contractorId?.fullName || '—'}</b>
    },
    {
      title: 'Lượt thích',
      dataIndex: 'likes',
      key: 'likes',
      width: 100,
      align: 'right',
      render: (number: number) => {
        return number.toLocaleString('vi-VN')
      }
    },
    {
      title: 'Ngân sách tối thiểu (VND)',
      dataIndex: 'budgetMin',
      key: 'budgetMin',
      width: 200,
      align: 'end',
      render: (number: number) => {
        return number.toLocaleString('vi-VN')
      }
    },
    {
      title: 'Ngân sách tối đa (VND)',
      dataIndex: 'budgetMax',
      key: 'budgetMax',
      width: 200,
      align: 'end',
      render: (number: number) => {
        return number.toLocaleString('vi-VN')
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status: ProjectStatus) => {
        return <Tag color={COLOR_STATUS[status]}>{LABEL_STATUS[status]}</Tag>
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      width: 110,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: ProjectResponse) => (
        <>
          <TableAction showView showDelete onView={() => onView(record)} onDelete={() => onDelete(record._id)} />
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
        hideOnSinglePage: true,
        onChange: onPageChange
      }}
      scroll={{ x: 1220 }}
    />
  )
}

export default TableProjects
