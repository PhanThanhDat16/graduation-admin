import axiosInstance from '@/utils/axiosInstance'

export const contractService = {
  getContractList: async (params: { page?: number; limit?: number; keyword?: string; status?: string }) =>
    await axiosInstance.get('/contracts', { params }),

  getContractById: async (contractId: string) =>
    await axiosInstance.get(`/contracts/${contractId}`).then((res) => res.data),

  updateContract: async (contractId: string, contractData: any) =>
    await axiosInstance.put(`/contracts/${contractId}`, contractData)
}
