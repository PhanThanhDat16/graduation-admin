import axiosInstance from '../utils/axiosInstance'

export const authService = {
  logIn: async (email: string, password: string) =>
    await axiosInstance.post('auth/login', { email, password }, { withCredentials: true }),

  logOut: async () => await axiosInstance.post('/auth/logout'),

  fetchMe: async () => await axiosInstance.get('/users/profile'),

  refresh: async () => await axiosInstance.post('/auth/refresh-token'),

  forgotPassword: async (email: string) => await axiosInstance.post('/auth/users/forgot', { email }),

  verifyPassword: async (param: { email: string; otp: string }) =>
    await axiosInstance.post('/auth/users/verify', { param })
}
