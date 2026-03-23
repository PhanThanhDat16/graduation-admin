export type ProjectStatus = 'recruiting' | 'in_progress' | 'completed' | 'disputed' | 'cancelled'

export type MockProject = {
  id: string
  code: string
  title: string
  ownerName: string
  freelancerName: string | null
  budgetVnd: number
  status: ProjectStatus
  createdAt: string
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  recruiting: 'Đang tuyển',
  in_progress: 'Đang thực hiện',
  completed: 'Hoàn thành',
  disputed: 'Tranh chấp',
  cancelled: 'Đã hủy'
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: '1',
    code: 'PRJ-2025-0142',
    title: 'Xây dựng landing page & dashboard analytics',
    ownerName: 'Công ty TNHH MediCare VN',
    freelancerName: 'Trần Minh Đức',
    budgetVnd: 45_000_000,
    status: 'in_progress',
    createdAt: '2025-02-10T08:00:00+07:00'
  },
  {
    id: '2',
    code: 'PRJ-2025-0138',
    title: 'Tích hợp API thanh toán & hóa đơn điện tử',
    ownerName: 'Startup FinFlow',
    freelancerName: 'Lê Thị Hương',
    budgetVnd: 120_000_000,
    status: 'completed',
    createdAt: '2025-01-22T10:30:00+07:00'
  },
  {
    id: '3',
    code: 'PRJ-2025-0155',
    title: 'Thiết kế UI/UX ứng dụng học tiếng Anh',
    ownerName: 'EduTech Lab',
    freelancerName: null,
    budgetVnd: 28_000_000,
    status: 'recruiting',
    createdAt: '2025-03-01T14:15:00+07:00'
  },
  {
    id: '4',
    code: 'PRJ-2024-0891',
    title: 'Bảo trì module chat realtime (Socket)',
    ownerName: 'NovaWorks',
    freelancerName: 'Phạm Quốc Anh',
    budgetVnd: 65_000_000,
    status: 'disputed',
    createdAt: '2024-11-05T09:00:00+07:00'
  },
  {
    id: '5',
    code: 'PRJ-2025-0101',
    title: 'Viết tài liệu API & SDK cho đối tác',
    ownerName: 'CloudBridge',
    freelancerName: 'Hoàng Văn Nam',
    budgetVnd: 18_000_000,
    status: 'completed',
    createdAt: '2025-01-08T11:20:00+07:00'
  },
  {
    id: '6',
    code: 'PRJ-2025-0160',
    title: 'Fine-tune mô hình gợi ý nội dung nội bộ',
    ownerName: 'RetailMax',
    freelancerName: null,
    budgetVnd: 200_000_000,
    status: 'recruiting',
    createdAt: '2025-03-18T16:45:00+07:00'
  },
  {
    id: '7',
    code: 'PRJ-2025-0120',
    title: 'Di chuyển hạ tầng lên Kubernetes',
    ownerName: 'LogiChain',
    freelancerName: 'Nguyễn Văn Kiệt',
    budgetVnd: 350_000_000,
    status: 'in_progress',
    createdAt: '2025-02-28T13:00:00+07:00'
  },
  {
    id: '8',
    code: 'PRJ-2024-0722',
    title: 'Ứng dụng check-in nhân sự (mobile)',
    ownerName: 'HR Pro',
    freelancerName: 'Đỗ Mai Linh',
    budgetVnd: 0,
    status: 'cancelled',
    createdAt: '2024-09-12T08:30:00+07:00'
  }
]
