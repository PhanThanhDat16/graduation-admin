import type { Pagination } from '.'

export type WalletResponse = {
  _id: string
  user_id: string
  balance: number
  createdAt: string
  updatedAt: string
}

export type WalletListResponse = {
  data: WalletResponse[]
  pagination: Pagination
}
