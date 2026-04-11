/** Cài đặt giao diện & thông báo (mock). */
export type MockAdminSettings = {
  language: 'vi' | 'en'
  timezone: string
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD'
  notifyEmail: boolean
  notifyBrowser: boolean
  notifyContractEvents: boolean
  notifyDisputeAlerts: boolean
  tablePageSize: number
}

export const MOCK_ADMIN_SETTINGS: MockAdminSettings = {
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  notifyEmail: true,
  notifyBrowser: true,
  notifyContractEvents: true,
  notifyDisputeAlerts: true,
  tablePageSize: 8
}
