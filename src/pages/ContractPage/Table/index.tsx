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
  pending: 'Đang chờ duyệt',
  waiting_payment: 'Chờ thanh toán',
  running: 'Đang thi công',
  submitted: 'Đã nộp',
  completed: 'Đã hoàn thành',
  dispute: 'Tranh chấp',
  cancelled: 'Đã hủy'
}

const COLOR_STATUS: Record<ContractStatus, string> = {
  draft: 'default',
  pending: 'yellow',
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
      dataIndex: 'projectName',
      key: 'projectName'
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
