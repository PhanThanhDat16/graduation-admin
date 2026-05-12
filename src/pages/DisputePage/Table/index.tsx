import TableAction from '@/components/common/TableAction'
import type { DisputeResponse, DisputeStatus } from '@/types/dispute'
import { Table, Tag } from 'antd'
import type { ColumnType } from 'antd/es/table'

type Props = {
  disputes: DisputeResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onView: (record: DisputeResponse) => void
}

const LABEL_STATUS: Record<DisputeStatus, string> = {
  open: 'Mở tranh chấp',
  negotiating: 'Đang đàm phán',
  admin_review: 'Đang xem xét',
  resolved: 'Đã giải quyết',
  auto_closed: 'Đã tự đóng'
}

const COLOR_STATUS: Record<DisputeStatus, string> = {
  open: 'warning',
  negotiating: 'processing',
  admin_review: 'cyan',
  resolved: 'success',
  auto_closed: 'error'
}

const TableDisputes = ({ disputes, page, pageSize, loading, onPageChange, total, onView, onDelete }: Props) => {
  const columns: ColumnType<DisputeResponse>[] = [
    {
      title: 'Mã hợp đồng',
      dataIndex: 'contractId',
      key: 'contractId',
      render: (contractId: any) => {
        return <p>{contractId._id}</p>
      }
    },
    {
      title: 'Tên dự án',
      dataIndex: 'contractId',
      key: 'contractId',
      render: (contractId: any) => {
        return <p>{contractId.projectId.title}</p>
      }
    },
    {
      title: 'Chủ đầu tư',
      dataIndex: 'contractorId',
      key: 'contractorId',
      render: (contractorId: any) => {
        return <p>{contractorId.fullName}</p>
      }
    },
    {
      title: 'Nhà thầu',
      dataIndex: 'freelancerId',
      key: 'freelancerId',
      render: (freelancerId: any) => {
        return <p>{freelancerId.fullName}</p>
      }
    },
    {
      title: 'Người giải quyết',
      dataIndex: 'staffId',
      key: 'staffId',
      render: (staffId?: any) => {
        return <p>{staffId?.fullName || 'Chưa có'}</p>
      }
    },
    {
      title: 'Người mở',
      dataIndex: 'openedBy',
      key: 'openedBy',
      width: 200,
      render: (openedBy: any) => {
        return <p>{openedBy.fullName}</p>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: DisputeStatus) => {
        return <Tag color={COLOR_STATUS[status]}>{LABEL_STATUS[status]}</Tag>
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      fixed: 'right',
      width: 110,
      key: 'actions',
      render: (_: any, record: DisputeResponse) => (
        <>
          <TableAction showView showDelete onView={() => onView(record)} onDelete={() => onDelete(record._id)} />
        </>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={disputes}
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

export default TableDisputes
