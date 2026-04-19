import type { Pagination } from '.'

export type ProjectStatus = 'open' | 'closed' | 'draft'

export type ProjectResponse = {
  _id: string
  contractorId: string
  contractorName?: string
  freelancerId?: string
  freelancerName?: string
  title: string
  description: string
  category: string
  skills: string[]
  budgetMin: number
  budgetMax: number
  status: ProjectStatus
  likes: number
  listLike: [string]
  createdAt: string
  updatedAt: string
}

export type ProjectListResponse = {
  data: ProjectResponse[]
  pagination: Pagination
}

export type ProjectQuery = {
  page: number
  limit: number
  keyword?: string
  status?: string
  sortBy?: string
  sortOrder?: string
  contractorId?: string
  category?: string
  budgetMin?: number
  budgetMax?: number
  likes?: number
  pagination?: Pagination
}
