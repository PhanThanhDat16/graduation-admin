import axiosInstance from '@/utils/axiosInstance'

export const disputeService = {
  getDisputeList: async (params: { page?: number; limit?: number; keyword?: string; status?: string }) =>
    await axiosInstance.get('/disputes', { params }),

  getDisputeById: async (disputeId: string) => await axiosInstance.get(`/disputes/${disputeId}`).then((res) => res.data)
}
