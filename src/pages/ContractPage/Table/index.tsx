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

const LABEL_STATUS: Record<ContractStatus, string> = {
  draft: 'Nháp',
  pending_agreement: 'Đang chờ duyệt',
  waiting_payment: 'Chờ thanh toán',
  running: 'Đang thi công',
  submitted: 'Đã nộp',
  completed: 'Đã hoàn thành',
  dispute: 'Tranh chấp',
  cancelled: 'Đã hủy'
}

const COLOR_STATUS: Record<ContractStatus, string> = {
  draft: 'default',
  pending_agreement: 'yellow',
  waiting_payment: 'orange',
  running: 'success',
  submitted: 'cyan',
  completed: 'processing',
  dispute: 'magenta',
  cancelled: 'error'
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
      dataIndex: 'project_id',
      key: 'project_id',
      render: (project_id: any) => project_id?.title || 'N/A'
    },
    {
      title: 'Chủ đầu tư',
      dataIndex: 'contractor_id',
      key: 'contractor_id',
      render: (contractor_id: any) => contractor_id?.fullName || 'N/A'
    },
    {
      title: 'Nhà thầu',
      dataIndex: 'freelancer_id',
      key: 'freelancer_id',
      render: (freelancer_id: any) => freelancer_id?.fullName || 'N/A'
    },
    {
      title: 'Tổng giá trị (VND)',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 200,
      align: 'end',
      render: (number: number) => {
        return number.toLocaleString('vi-VN')
      }
    },
    {
      title: 'Phí nền tảng (VND)',
      dataIndex: 'admin_fee',
      key: 'admin_fee',
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
        return <Tag color={COLOR_STATUS[status]}>{LABEL_STATUS[status]}</Tag>
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
        onChange: onPageChange
      }}
      scroll={{ x: 1220 }}
    />
  )
}

export default TableContracts
