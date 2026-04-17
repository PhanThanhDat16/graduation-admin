import type { UserQuery } from '@/types/user'
import axiosInstance from '@/utils/axiosInstance'

export const userService = {
  editProfile: async (profileData: any) => await axiosInstance.put('/users/profile', profileData),

  editEmail: async (param: { oldEmail: string; newEmail: string; otp: string }) =>
    await axiosInstance.put('/users/email', param),

  getUsersByRole: async (params: UserQuery) => await axiosInstance.get('/users', { params }),

  getUserById: async (userId: string) => await axiosInstance.get(`/users/${userId}`).then((res) => res.data),

  editPassword: async (params: { currentPassword: string; newPassword: string }) =>
    await axiosInstance.put('/users/password', params),

  createStaff: async (staffData: any) => await axiosInstance.post('/users/register', staffData),

  updateUser: async (userId: string, userData: any) => await axiosInstance.put(`/users/${userId}`, userData),

  deleteUser: async (userId: string) => await axiosInstance.delete(`/users/${userId}`),

  requestOTP: async (newEmail: string, purpose: string) =>
    await axiosInstance.post('/users/email/request-otp', { newEmail, purpose }),

  resentOTP: async (param: { email: string; purpose: string }) => await axiosInstance.post('/email/resent-otp', param),

  verifyOTP: async (param: { email: string; otp: string; purpose: string }) =>
    await axiosInstance.post('/email/verify-otp', param)
}
