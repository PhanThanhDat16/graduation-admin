import axiosInstance from '@/utils/axiosInstance'

export const disputeService = {
  getDisputeList: async (params: { page?: number; limit?: number; keyword?: string; status?: string }) =>
    await axiosInstance.get('/disputes', { params }),

  getDisputeById: async (disputeId: string) =>
    await axiosInstance.get(`/disputes/${disputeId}`).then((res) => res.data),

  joinDispute: async (disputeId: string) => await axiosInstance.post(`/disputes/${disputeId}/staff/join`),

  cancelDispute: async (disputeId: string, data: { reason: string }) =>
    await axiosInstance.post(`/disputes/${disputeId}/staff/cancel`, data),

  resolveDispute: async (
    disputeId: string,
    data: {
      decision: string
      resolutionType: string
      freelancerAmount?: number
      contractorAmount?: number
      newDeadline: Date
    }
  ) => await axiosInstance.post(`/disputes/${disputeId}/staff/resolve`, data)
}
