import type { ProjectListResponse } from '@/types/project'
import axiosInstance from '@/utils/axiosInstance'

export const projectService = {
  getProjects: (params: { page?: number; limit?: number; keyword?: string; status?: string }) =>
    axiosInstance.get<ProjectListResponse>('/projects', { params })
}
