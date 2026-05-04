import type { Pagination } from '.'

export type TransactionType = 'deposit' | 'withdraw' | 'escrow_deposit' | 'escrow_release' | 'refund' | 'admin_fee'
export type TransactionMethod = 'momo' | 'vnpay' | 'wallet'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export type TransactionResponse = {
  _id: string
  walletId: string
  amount: number
  type: TransactionType | null
  methodPayment: TransactionMethod | null
  status: TransactionStatus | null
  userId: { _id: string; fullName: string; avatar: string; email: string }
  paymentOrderId: string
  description: string
  createdAt: string
}

export type TransactionListResponse = {
  data: TransactionResponse[]
  pagination: Pagination
}

export type TransactionQuery = {
  page: number
  limit: number
  type?: string
  methodPayment?: string
  status?: string
  pagination?: Pagination
}
