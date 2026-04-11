import type { Pagination } from '.'

export type PostStatus = 'published' | 'draft' | 'closed'

export type PostResponse = {
  _id: string
  title: string
  content: string
  authorId: string
  status: PostStatus
  likes: number
  listLike: [string]
  createdAt: string
  updatedAt: string
}

export type PostListResponse = {
  data: PostResponse[]
  pagination: Pagination
}

export type PostQuery = {
  page: number
  limit: number
  search?: string
}
