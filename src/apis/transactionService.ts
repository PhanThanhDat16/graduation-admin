import type { TransactionQuery } from '@/types/transaction'
import axiosInstance from '@/utils/axiosInstance'

export const TransactionService = {
  getAllTransactions: async (query: TransactionQuery) =>
    await axiosInstance.get(`/wallets/admin/transactions`, { params: query }),

  getTransactionById: async (transactionId: string) =>
    await axiosInstance.get(`/wallets/admin/transactions/${transactionId}`).then((res) => res.data)
}
