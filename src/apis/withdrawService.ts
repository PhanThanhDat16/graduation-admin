import type { WithDrawQuery } from '@/types/withdraw'
import axiosInstance from '@/utils/axiosInstance'

export const WithDrawService = {
  getAllWithDrawRequests: async (query: WithDrawQuery) =>
    await axiosInstance.get(`/wallets/staff/withdraw-requests`, { params: query }),

  approveWithDraw: async (transactionId: string, data: { status: string }) =>
    await axiosInstance.put(`/wallets/staff/withdraw-requests/${transactionId}`, data)
}
