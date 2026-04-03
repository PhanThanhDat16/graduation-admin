import axiosInstance from '../utils/axiosInstance'

export const userService = {
  editProfile: async (profileData: any) => {
    const res = await axiosInstance.put('/users/profile', profileData)
    return res
  }
}
