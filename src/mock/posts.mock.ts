export type PostStatus = 'published' | 'draft' | 'closed'

export type MockPost = {
  id: string
  code: string
  title: string
  authorName: string
  projectCode: string | null
  budgetHintVnd: number | null
  applicationsCount: number
  status: PostStatus
  publishedAt: string | null
}

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  published: 'Đang hiển thị',
  draft: 'Bản nháp',
  closed: 'Đã đóng tuyển'
}

export const MOCK_POSTS: MockPost[] = [
  {
    id: '1',
    code: 'BD-2025-0330',
    title: 'Tuyển Full-stack React + Node — dự án y tế 3 tháng',
    authorName: 'Công ty TNHH MediCare VN',
    projectCode: 'PRJ-2025-0142',
    budgetHintVnd: 45_000_000,
    applicationsCount: 23,
    status: 'published',
    publishedAt: '2025-02-11T08:00:00+07:00'
  },
  {
    id: '2',
    code: 'BD-2025-0401',
    title: 'Cần Data Engineer — pipeline ETL bán lẻ',
    authorName: 'RetailMax',
    projectCode: 'PRJ-2025-0160',
    budgetHintVnd: 200_000_000,
    applicationsCount: 8,
    status: 'published',
    publishedAt: '2025-03-19T09:30:00+07:00'
  },
  {
    id: '3',
    code: 'BD-2025-0288',
    title: 'UI/UX Designer — ứng dụng học tiếng Anh',
    authorName: 'EduTech Lab',
    projectCode: 'PRJ-2025-0155',
    budgetHintVnd: 28_000_000,
    applicationsCount: 41,
    status: 'published',
    publishedAt: '2025-03-02T10:15:00+07:00'
  },
  {
    id: '4',
    code: 'BD-2025-0199',
    title: 'DevOps part-time — Kubernetes + CI/CD',
    authorName: 'LogiChain',
    projectCode: 'PRJ-2025-0120',
    budgetHintVnd: null,
    applicationsCount: 0,
    status: 'draft',
    publishedAt: null
  },
  {
    id: '5',
    code: 'BD-2024-1201',
    title: 'Mobile Flutter — check-in nhân sự',
    authorName: 'HR Pro',
    projectCode: 'PRJ-2024-0722',
    budgetHintVnd: 55_000_000,
    applicationsCount: 17,
    status: 'closed',
    publishedAt: '2024-09-13T12:00:00+07:00'
  }
]
