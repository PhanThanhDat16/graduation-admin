import axiosInstance from '@/utils/axiosInstance'

export const applicationService = {
  getApplicationByProjectId: async (projectId: string) => await axiosInstance.get(`/applications/project/${projectId}`)
}
