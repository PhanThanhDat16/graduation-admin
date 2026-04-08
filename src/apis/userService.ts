import axiosInstance from '@/utils/axiosInstance'

export const userService = {
  editProfile: async (profileData: any) => await axiosInstance.put('/users/profile', profileData),

  getUsersByRole: async (params: { role?: string; page?: number; limit?: number; keyword?: string; status?: string }) =>
    await axiosInstance.get('/users', { params }),

  getUserById: async (userId: string) => await axiosInstance.get(`/users/${userId}`).then((res) => res.data)
}
