import type { Pagination } from '.'

export type ContractResponse = {
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
  data: ContractResponse[]
  pagination: Pagination
}
