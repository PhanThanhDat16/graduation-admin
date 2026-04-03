export type StaffRole = 'admin' | 'staff'

export type MockStaff = {
  id: string
  employeeCode: string
  fullName: string
  email: string
  role: StaffRole
  active: boolean
  lastLoginAt: string | null
}

export const STAFF_ROLE_LABEL: Record<StaffRole, string> = {
  admin: 'Quản trị',
  staff: 'Nhân viên'
}

export const MOCK_STAFF: MockStaff[] = [
  {
    id: '1',
    employeeCode: 'NV-ADM-001',
    fullName: 'Nguyễn Thị Quản',
    email: 'quan.nt@admin.internal',
    role: 'admin',
    active: true,
    lastLoginAt: '2025-03-20T08:02:00+07:00'
  },
  {
    id: '2',
    employeeCode: 'NV-ADM-014',
    fullName: 'Trần Văn Hòa',
    email: 'hoa.tv@admin.internal',
    role: 'staff',
    active: true,
    lastLoginAt: '2025-03-19T17:40:00+07:00'
  },
  {
    id: '3',
    employeeCode: 'NV-ADM-022',
    fullName: 'Lê Minh Anh',
    email: 'anh.lm@admin.internal',
    role: 'staff',
    active: true,
    lastLoginAt: '2025-03-18T09:15:00+07:00'
  },
  {
    id: '4',
    employeeCode: 'NV-ADM-008',
    fullName: 'Phạm Đức Thắng',
    email: 'thang.pd@admin.internal',
    role: 'admin',
    active: false,
    lastLoginAt: '2025-02-01T14:00:00+07:00'
  }
]
