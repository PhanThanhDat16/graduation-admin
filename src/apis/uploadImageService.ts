import axiosInstance from '@/utils/axiosInstance'

export const uploadImageService = {
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return await axiosInstance.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    return await axiosInstance.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
