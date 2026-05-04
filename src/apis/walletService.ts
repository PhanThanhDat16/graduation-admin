import type { TransactionQuery } from '@/types/transaction'
import type { WalletQuery } from '@/types/wallet'
import axiosInstance from '@/utils/axiosInstance'

export const walletService = {
  getAllUserWallets: async (query: WalletQuery) => await axiosInstance.get('/wallets/admin', { params: query }),

  getUserWallet: async (userId: string) => await axiosInstance.get(`/wallets/admin/users/${userId}`),

  getUserWalletTransactions: async (userId: string, query: TransactionQuery) =>
    await axiosInstance.get(`/wallets/admin/users/${userId}/transactions`, { params: query }),

  getAllWithdrawRequests: async (query: WalletQuery) =>
    await axiosInstance.get('/wallets/staff/withdraw-requests', { params: query })
}
