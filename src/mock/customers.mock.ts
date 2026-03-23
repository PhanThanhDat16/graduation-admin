export type CustomerRole = 'client' | 'freelancer'

export type MockCustomer = {
  id: string
  code: string
  displayName: string
  email: string
  role: CustomerRole
  active: boolean
  joinedAt: string
  projectsCount: number
}

export const CUSTOMER_ROLE_LABEL: Record<CustomerRole, string> = {
  client: 'Chủ dự án / Nhà tuyển dụng',
  freelancer: 'Nhà thầu'
}

export const MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: '1',
    code: 'USR-C-1001',
    displayName: 'Công ty TNHH MediCare VN',
    email: 'contact@medicare-vn.example',
    role: 'client',
    active: true,
    joinedAt: '2024-06-01T10:00:00+07:00',
    projectsCount: 4
  },
  {
    id: '2',
    code: 'USR-F-2044',
    displayName: 'Trần Minh Đức',
    email: 'duc.tm@example.com',
    role: 'freelancer',
    active: true,
    joinedAt: '2024-03-15T14:20:00+07:00',
    projectsCount: 12
  },
  {
    id: '3',
    code: 'USR-C-1002',
    displayName: 'Startup FinFlow',
    email: 'ops@finflow.example',
    role: 'client',
    active: true,
    joinedAt: '2024-08-20T09:00:00+07:00',
    projectsCount: 7
  },
  {
    id: '4',
    code: 'USR-F-2088',
    displayName: 'Lê Thị Hương',
    email: 'huong.le@example.com',
    role: 'freelancer',
    active: true,
    joinedAt: '2023-11-02T16:30:00+07:00',
    projectsCount: 21
  },
  {
    id: '5',
    code: 'USR-F-2101',
    displayName: 'Phạm Quốc Anh',
    email: 'anh.pq@example.com',
    role: 'freelancer',
    active: true,
    joinedAt: '2024-01-10T11:00:00+07:00',
    projectsCount: 9
  },
  {
    id: '6',
    code: 'USR-C-1003',
    displayName: 'NovaWorks',
    email: 'hello@novaworks.example',
    role: 'client',
    active: false,
    joinedAt: '2023-05-22T08:45:00+07:00',
    projectsCount: 3
  },
  {
    id: '7',
    code: 'USR-C-1004',
    displayName: 'EduTech Lab',
    email: 'hr@edutech.example',
    role: 'client',
    active: true,
    joinedAt: '2025-01-05T13:15:00+07:00',
    projectsCount: 2
  },
  {
    id: '8',
    code: 'USR-F-2150',
    displayName: 'Nguyễn Văn Kiệt',
    email: 'kiet.nv@example.com',
    role: 'freelancer',
    active: true,
    joinedAt: '2024-09-18T10:00:00+07:00',
    projectsCount: 6
  }
]
