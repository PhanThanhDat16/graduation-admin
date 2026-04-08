import axiosInstance from '@/utils/axiosInstance'

export const contractService = {
  getContractList: async () => await axiosInstance.get('/contracts')
}
