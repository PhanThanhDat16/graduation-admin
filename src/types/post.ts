import type { Pagination } from '.'

export type PostResponse = {
  _id: string
  title: string
  content: string
  authorId: string
  likes: number
  listLike: [string]
  createdAt: string
  updatedAt: string
}

export type PostListResponse = {
  data: PostResponse[]
  pagination: Pagination
}
