import axiosInstance from '@/utils/axiosInstance'

export const contractService = {
  getContractList: async () => {
    const res = await axiosInstance.get('/api/contracts')

    return res
  }
}
