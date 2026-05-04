import type { Pagination } from '.'

export type WalletResponse = {
  _id: string
  userId: { _id: string; fullName: string; avatar: string; email: string; role: string }
  balance: number
  createdAt: string
  updatedAt: string
}

export type WalletListResponse = {
  data: WalletResponse[]
  pagination: Pagination
}

export type WalletQuery = {
  page: number
  limit: number
  userId?: string
  pagination?: Pagination
}
