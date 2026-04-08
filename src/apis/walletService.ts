import axiosInstance from '@/utils/axiosInstance'

export const walletService = {
  getAllWallets: async () => {
    const res = await axiosInstance.get('/api/wallets/admin/withdraw-requests')
    return res
  },

  getUserWallet: async (userId: string) => {
    const res = await axiosInstance.get(`/api/wallets/admin/${userId}`)
    return res
  },

  postUserWallet: async (userId: string, amount: number) => {
    const res = await axiosInstance.post(`/api/wallets/admin/${userId}/deposit`, {
      amount
    })
    return res
  }
}
