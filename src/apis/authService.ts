import axiosInstance from '../utils/axiosInstance'

export const authService = {
  logIn: async (email: string, password: string) => {
    const res = await axiosInstance.post('auth/login', { email, password })

    return res.data
  },

  logOut: async () => {
    const res = await axiosInstance.post('/auth/logout', { refreshToken: String })
    console.log(res)
    return res
  },

  fetchMe: async () => {
    const res = await axiosInstance.get('/users/profile')
    return res.data.data
  },

  refresh: async () => {
    const res = await axiosInstance.post('/auth/refresh-token')
    return res.data.accessToken
  }
}
