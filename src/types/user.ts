import type { Pagination } from '.'

export type UserResponse = {
  _id: string
  email: string
  fullName: string
  avatar?: string | null
  phone?: string
  birthday?: Date
  role: 'admin' | 'staff' | 'freelancer' | 'contractor'
  gender?: 'male' | 'female'
  address?: string
  status?: 'active' | 'disabled'
  createdAt?: string
  updatedAt?: string
  isVerified?: boolean
}

export type UserListResponse = {
  data: UserResponse[]
  pagination: Pagination
}

export type UserQuery = {
  page: number
  limit: number
  sortBy: string
  sortOrder: string
  role: string
  status?: string
  isVerified?: boolean
  keyword?: string
  pagination?: Pagination
}
