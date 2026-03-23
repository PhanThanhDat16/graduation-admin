import type { StaffRole } from './staff.mock'

/** Hồ sơ admin đang đăng nhập (mock — đồng bộ tên với header). */
export type MockAdminProfile = {
  fullName: string
  email: string
  phone: string
  employeeCode: string
  role: StaffRole
  department: string
  joinedAt: string
  lastLoginAt: string
}

export const MOCK_ADMIN_PROFILE: MockAdminProfile = {
  fullName: 'Nguyễn Văn A',
  email: 'vana.nguyen@admin.internal',
  phone: '0907123456',
  employeeCode: 'NV-ADM-014',
  role: 'moderator',
  department: 'Vận hành & Kiểm duyệt',
  joinedAt: '2024-01-15T08:30:00+07:00',
  lastLoginAt: '2025-03-20T08:02:00+07:00'
}
