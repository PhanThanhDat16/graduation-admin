import type { Pagination } from '.'

export type WithDrawStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export type WithDrawResponse = {
  _id: string
  accountId: {
    _id: string
    userId: { _id: string; avatar: string; email: string }
    code: string
    bankShortName: string
    accountNumber: string
    accountName: string
    logo: string
    status: string
  }
  amount: number
  amountReceived: number
  status: WithDrawStatus
  staffId: string
  processeAt: string
}

export type WithDrawListResponse = {
  data: WithDrawResponse[]
  pagination: Pagination
}

export type WithDrawQuery = {
  page: number
  limit: number
  status?: string
  userId?: string
  pagination?: Pagination
}
