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
      title: 'Mã tranh chấp',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Mã hợp đồng',
      dataIndex: 'contract_id',
      key: 'contract_id'
    },
    {
      title: 'Chủ đầu tư',
      dataIndex: 'contractorName',
      key: 'contractorName'
    },
    {
      title: 'Nhà thầu',
      dataIndex: 'freelancerName',
      key: 'freelancerName'
    },
    {
      title: 'Người giải quyết',
      dataIndex: 'admin_id',
      key: 'admin_id'
    },
    {
      title: 'Phí nền tảng',
      dataIndex: 'admin_fee',
      key: 'admin_fee',
      width: 200
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
        onChange: onPageChange
      }}
      scroll={{ x: 1220 }}
    />
  )
}

export default TableDisputes
