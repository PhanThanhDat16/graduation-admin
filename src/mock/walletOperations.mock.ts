/**
 * Nạp / rút ví cá nhân — chỉ hiển thị cho cấp admin (trang Ví).
 */

export type WalletUserRole = 'freelancer' | 'client'

export type WalletOpType = 'deposit' | 'withdraw'

export type WalletOpStatus = 'success' | 'pending' | 'rejected'

export type MockWalletOperation = {
  id: string
  code: string
  userDisplayName: string
  userRole: WalletUserRole
  type: WalletOpType
  amountVnd: number
  channel: string
  status: WalletOpStatus
  createdAt: string
}

export const WALLET_OP_TYPE_LABEL: Record<WalletOpType, string> = {
  deposit: 'Nạp tiền',
  withdraw: 'Rút tiền'
}

export const WALLET_OP_STATUS_LABEL: Record<WalletOpStatus, string> = {
  success: 'Thành công',
  pending: 'Chờ xử lý',
  rejected: 'Từ chối'
}

export const MOCK_WALLET_OPERATIONS: MockWalletOperation[] = [
  {
    id: '1',
    code: 'WD-20250319-441',
    userDisplayName: 'Trần Minh Đức',
    userRole: 'freelancer',
    type: 'withdraw',
    amountVnd: 15_000_000,
    channel: 'Ngân hàng — Vietcombank',
    status: 'success',
    createdAt: '2025-03-19T14:20:00+07:00'
  },
  {
    id: '2',
    code: 'DP-20250319-882',
    userDisplayName: 'Startup FinFlow',
    userRole: 'client',
    type: 'deposit',
    amountVnd: 50_000_000,
    channel: 'Chuyển khoản QR',
    status: 'success',
    createdAt: '2025-03-19T10:05:00+07:00'
  },
  {
    id: '3',
    code: 'WD-20250318-120',
    userDisplayName: 'Lê Thị Hương',
    userRole: 'freelancer',
    type: 'withdraw',
    amountVnd: 8_500_000,
    channel: 'Ví điện tử — MoMo',
    status: 'pending',
    createdAt: '2025-03-18T16:45:00+07:00'
  },
  {
    id: '4',
    code: 'DP-20250317-003',
    userDisplayName: 'EduTech Lab',
    userRole: 'client',
    type: 'deposit',
    amountVnd: 30_000_000,
    channel: 'Cổng thanh toán',
    status: 'success',
    createdAt: '2025-03-17T09:12:00+07:00'
  },
  {
    id: '5',
    code: 'WD-20250316-991',
    userDisplayName: 'Phạm Quốc Anh',
    userRole: 'freelancer',
    type: 'withdraw',
    amountVnd: 120_000_000,
    channel: 'Ngân hàng — Techcombank',
    status: 'rejected',
    createdAt: '2025-03-16T11:30:00+07:00'
  },
  {
    id: '6',
    code: 'DP-20250315-220',
    userDisplayName: 'RetailMax',
    userRole: 'client',
    type: 'deposit',
    amountVnd: 100_000_000,
    channel: 'Chuyển khoản QR',
    status: 'pending',
    createdAt: '2025-03-15T08:00:00+07:00'
  }
]
