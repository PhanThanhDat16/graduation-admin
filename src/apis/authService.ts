import axiosInstance from '../utils/axiosInstance'

export const authService = {
  logIn: async (email: string, password: string) => {
    const res = await axiosInstance.post('auth/login', { email, password })

    return res
  },

  logOut: async () => {
    const res = await axiosInstance.post('/auth/logout')
    return res
  },

  fetchMe: async () => {
    const res = await axiosInstance.get('/users/profile')
    return res
  },

  refresh: async () => {
    const res = await axiosInstance.post('/auth/refresh-token', { withCredentials: true })
    return res
  }
}
