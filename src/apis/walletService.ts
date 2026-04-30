import axiosInstance from '@/utils/axiosInstance'

export const walletService = {
  getAllWithdrawRequests: async () => await axiosInstance.get('/wallets/staff/withdraw-requests'),

  getAllUserWallets: async () => await axiosInstance.get('/wallets/admin/wallets'),

  getUserWallet: async (userId: string) => await axiosInstance.get(`/wallets/admin/${userId}`),

  postUserWallet: async (userId: string, amount: number) =>
    await axiosInstance.post(`/wallets/admin/${userId}/deposit`, { amount })
}
