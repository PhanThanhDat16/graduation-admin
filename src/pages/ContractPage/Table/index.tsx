import TableAction from '@/components/common/TableAction'
import type { ContractResponse, ContractStatus } from '@/types/contract'
import { Table, Tag } from 'antd'
import type { ColumnType } from 'antd/es/table'

type Props = {
  contracts: ContractResponse[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number, pageSize: number) => void
  onDelete: (id: string) => void
  onView: (record: ContractResponse) => void
}

const STATUSMAP: Record<ContractStatus, { color: string; label: string }> = {
  draft: { color: 'default', label: 'Nháp' },
  pending_agreement: { color: 'yellow', label: 'Đang chờ duyệt' },
  closed_for_requests: { color: 'volcano', label: 'Ngừng nhận yêu cầu' },
  waiting_payment: { color: 'orange', label: 'Chờ đặt cọc' },
  running: { color: 'success', label: 'Đang thi công' },
  submitted: { color: 'cyan', label: 'Đã nộp' },
  completed: { color: 'processing', label: 'Đã hoàn thành' },
  dispute: { color: 'magenta', label: 'Tranh chấp' },
  cancelled: { color: 'error', label: 'Đã hủy' }
}

const TableContracts = ({ contracts, page, pageSize, loading, onPageChange, total, onView, onDelete }: Props) => {
  const columns: ColumnType<ContractResponse>[] = [
    {
      title: 'Mã',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Dự án',
      dataIndex: 'projectId',
      key: 'projectId',
      render: (projectId: any) => projectId?.title || 'N/A'
    },
    {
      title: 'Chủ đầu tư',
      dataIndex: 'contractorId',
      key: 'contractorId',
      render: (contractorId: any) => contractorId?.fullName || 'N/A'
    },
    {
      title: 'Nhà thầu',
      dataIndex: 'freelancerId',
      key: 'freelancerId',
      render: (freelancerId: any) => freelancerId?.fullName || 'N/A'
    },
    {
      title: 'Tổng giá trị (VND)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 200,
      align: 'end',
      render: (number: number) => {
        return number.toLocaleString('vi-VN')
      }
    },
    {
      title: 'Phí nền tảng (VND)',
      dataIndex: 'adminFee',
      key: 'adminFee',
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
      render: (status: ContractStatus) => {
        return <Tag color={STATUSMAP[status].color}>{STATUSMAP[status].label}</Tag>
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      fixed: 'right',
      width: 110,
      key: 'actions',
      align: 'center',
      render: (_: any, record: ContractResponse) => (
        <>
          <TableAction showView showDelete onView={() => onView(record)} onDelete={() => onDelete(record._id)} />
        </>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={contracts}
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

export default TableContracts
