export type NotificationAudience = 'all' | 'clients' | 'freelancers'

export type MockAdminNotification = {
  id: string
  title: string
  body: string
  audience: NotificationAudience
  sentAt: string
  readRatePercent: number
}

export const NOTIFICATION_AUDIENCE_LABEL: Record<NotificationAudience, string> = {
  all: 'Toàn bộ',
  clients: 'Chủ dự án',
  freelancers: 'Nhà thầu'
}

export const MOCK_ADMIN_NOTIFICATIONS: MockAdminNotification[] = [
  {
    id: '1',
    title: 'Bảo trì hệ thống 02:00–04:00 (24/03)',
    body: 'Thanh toán và chat có thể gián đoạn trong khung giờ bảo trì.',
    audience: 'all',
    sentAt: '2025-03-21T10:00:00+07:00',
    readRatePercent: 62
  },
  {
    id: '2',
    title: 'Cập nhật biểu phí dịch vụ nền tảng',
    body: 'Áp dụng từ 01/04 — chi tiết trong trung tâm trợ giúp.',
    audience: 'clients',
    sentAt: '2025-03-18T14:30:00+07:00',
    readRatePercent: 41
  },
  {
    id: '3',
    title: 'Nhắc xác minh danh tính (KYC)',
    body: 'Hoàn tất KYC để nhận thanh toán sau nghiệm thu.',
    audience: 'freelancers',
    sentAt: '2025-03-15T09:00:00+07:00',
    readRatePercent: 78
  }
]
