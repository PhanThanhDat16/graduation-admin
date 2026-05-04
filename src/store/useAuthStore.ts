import { create } from 'zustand'
import { authService } from '../apis/authService'
import type { AuthState } from '@/types/store'
import { message } from 'antd'

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken })
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false })
  },

  logIn: async (email, password) => {
    try {
      set({ loading: true })
      const res = await authService.logIn(email, password)

      if (res.data.data.user.role !== 'admin' && res.data.data.user.role !== 'staff') {
        await get().logoutUnauthorized()
        return null
      }
      get().setAccessToken(res.data.data.accessToken)

      message.success('Đăng nhập thành công!')
      await get().fetchMe()
      return res.data.data.user
    } catch {
      message.error('Email hoặc mật khẩu không đúng!')
      return null
    } finally {
      set({ loading: false })
    }
  },

  logOut: async () => {
    try {
      await authService.logOut()
      get().clearState()
      message.success('Logout thành công!')
    } catch (error) {
      console.error(error)
      message.error('Lỗi xảy ra khi logout. Hãy thử lại!')
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true })
      const res = await authService.fetchMe()
      const userData = res.data.data

      set({ user: userData })
    } catch (error) {
      console.error(error)
      set({ user: null, accessToken: null })
      message.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!')
    } finally {
      set({ loading: false })
    }
  },

  refresh: async () => {
    try {
      set({ loading: true })
      const { user, fetchMe, setAccessToken } = get()
      const res = await authService.refresh()

      setAccessToken(res.data.data.accessToken)

      if (!user) {
        await fetchMe()
      }
    } catch (error) {
      if (error === 401) {
        get().clearState()
        return
      }
      if (error === 403) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
        get().clearState()
        return
      }
    } finally {
      set({ loading: false })
    }
  },

  logoutUnauthorized: async () => {
    try {
      await authService.logOut()
      get().clearState()
      message.error('Bạn không có quyền truy cập vào trang này!')
    } catch (error) {
      console.error(error)
      message.error('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }
}))
