/**
 * Giao dịch gắn với dự án / hợp đồng (escrow, cột mốc, phí nền tảng…).
 * Không bao gồm nạp/rút ví cá nhân — xem mock walletOperations.
 */
export type ProjectTxType = 'escrow_hold' | 'milestone_release' | 'platform_fee' | 'refund_partial' | 'dispute_escrow'

export type ProjectTxStatus = 'completed' | 'pending' | 'failed'

export type MockProjectTransaction = {
  id: string
  code: string
  projectCode: string
  contractCode: string | null
  type: ProjectTxType
  amountVnd: number
  status: ProjectTxStatus
  note: string
  createdAt: string
}

export const PROJECT_TX_TYPE_LABEL: Record<ProjectTxType, string> = {
  escrow_hold: 'Giữ tạm (escrow)',
  milestone_release: 'Thanh toán cột mốc',
  platform_fee: 'Phí dịch vụ nền tảng',
  refund_partial: 'Hoàn tiền (một phần)',
  dispute_escrow: 'Khóa tiền tranh chấp'
}

export const PROJECT_TX_STATUS_LABEL: Record<ProjectTxStatus, string> = {
  completed: 'Thành công',
  pending: 'Đang xử lý',
  failed: 'Thất bại'
}

export const MOCK_PROJECT_TRANSACTIONS: MockProjectTransaction[] = [
  {
    id: '1',
    code: 'TX-PJ-20250320-001',
    projectCode: 'PRJ-2025-0142',
    contractCode: 'HD-2025-0088',
    type: 'escrow_hold',
    amountVnd: 22_500_000,
    status: 'completed',
    note: 'Giữ 50% giá trị hợp đồng tại kỳ 1',
    createdAt: '2025-02-18T10:05:00+07:00'
  },
  {
    id: '2',
    code: 'TX-PJ-20250320-002',
    projectCode: 'PRJ-2025-0142',
    contractCode: 'HD-2025-0088',
    type: 'milestone_release',
    amountVnd: 11_250_000,
    status: 'completed',
    note: 'Giải ngân sau nghiệm thu giao diện',
    createdAt: '2025-03-01T15:22:00+07:00'
  },
  {
    id: '3',
    code: 'TX-PJ-20250320-003',
    projectCode: 'PRJ-2025-0138',
    contractCode: 'HD-2025-0041',
    type: 'platform_fee',
    amountVnd: 6_000_000,
    status: 'completed',
    note: 'Thu phí dịch vụ theo hợp đồng',
    createdAt: '2025-02-10T09:00:00+07:00'
  },
  {
    id: '4',
    code: 'TX-PJ-20250320-004',
    projectCode: 'PRJ-2025-0120',
    contractCode: 'HD-2025-0095',
    type: 'escrow_hold',
    amountVnd: 105_000_000,
    status: 'pending',
    note: 'Chờ xác nhận từ ngân hàng đối tác',
    createdAt: '2025-03-19T11:40:00+07:00'
  },
  {
    id: '5',
    code: 'TX-PJ-20250320-005',
    projectCode: 'PRJ-2024-0891',
    contractCode: 'HD-2024-0512',
    type: 'dispute_escrow',
    amountVnd: 32_500_000,
    status: 'completed',
    note: 'Khóa khoản escrow trong thời gian tranh chấp',
    createdAt: '2025-03-12T08:15:00+07:00'
  },
  {
    id: '6',
    code: 'TX-PJ-20250320-006',
    projectCode: 'PRJ-2025-0138',
    contractCode: 'HD-2025-0041',
    type: 'milestone_release',
    amountVnd: 54_000_000,
    status: 'completed',
    note: 'Thanh toán đợt cuối — bàn giao production',
    createdAt: '2025-03-08T16:00:00+07:00'
  },
  {
    id: '7',
    code: 'TX-PJ-20250320-007',
    projectCode: 'PRJ-2025-0101',
    contractCode: 'HD-2025-0012',
    type: 'refund_partial',
    amountVnd: 3_600_000,
    status: 'completed',
    note: 'Hoàn 20% do thay đổi phạm vi công việc',
    createdAt: '2025-02-25T13:30:00+07:00'
  },
  {
    id: '8',
    code: 'TX-PJ-20250320-008',
    projectCode: 'PRJ-2025-0142',
    contractCode: 'HD-2025-0088',
    type: 'platform_fee',
    amountVnd: 1_125_000,
    status: 'pending',
    note: 'Trích phí đợt giải ngân kỳ 2',
    createdAt: '2025-03-20T09:00:00+07:00'
  }
]
