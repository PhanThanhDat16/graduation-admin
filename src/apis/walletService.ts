import axiosInstance from '@/utils/axiosInstance'

export const walletService = {
  getAllWallets: async () => await axiosInstance.get('/wallets/admin/withdraw-requests'),

  getUserWallet: async (userId: string) => await axiosInstance.get(`/wallets/admin/${userId}`),

  postUserWallet: async (userId: string, amount: number) =>
    await axiosInstance.post(`/wallets/admin/${userId}/deposit`, { amount })
}
