export type DisputeStatus = 'open' | 'mediation' | 'resolved' | 'closed'

export type MockDispute = {
  id: string
  code: string
  projectCode: string
  projectTitle: string
  clientName: string
  freelancerName: string
  summary: string
  status: DisputeStatus
  openedAt: string
}

export const DISPUTE_STATUS_LABEL: Record<DisputeStatus, string> = {
  open: 'Mở',
  mediation: 'Hòa giải',
  resolved: 'Đã xử lý',
  closed: 'Đóng'
}

export const MOCK_DISPUTES: MockDispute[] = [
  {
    id: '1',
    code: 'TC-2025-0007',
    projectCode: 'PRJ-2024-0891',
    projectTitle: 'Bảo trì module chat realtime (Socket)',
    clientName: 'NovaWorks',
    freelancerName: 'Phạm Quốc Anh',
    summary: 'Bất đồng về phạm vi bàn giao và thời hạn sửa lỗi sau go-live.',
    status: 'mediation',
    openedAt: '2025-03-10T09:00:00+07:00'
  },
  {
    id: '2',
    code: 'TC-2025-0003',
    projectCode: 'PRJ-2025-0142',
    projectTitle: 'Xây dựng landing page & dashboard analytics',
    clientName: 'Công ty TNHH MediCare VN',
    freelancerName: 'Trần Minh Đức',
    summary: 'Khiếu nại chậm phản hồi trong tuần nghiệm thu.',
    status: 'open',
    openedAt: '2025-03-18T14:30:00+07:00'
  },
  {
    id: '3',
    code: 'TC-2024-0188',
    projectCode: 'PRJ-2024-0722',
    projectTitle: 'Ứng dụng check-in nhân sự (mobile)',
    clientName: 'HR Pro',
    freelancerName: 'Đỗ Mai Linh',
    summary: 'Dự án hủy — tranh chấp phí đã thanh toán trước.',
    status: 'resolved',
    openedAt: '2024-10-01T10:00:00+07:00'
  },
  {
    id: '4',
    code: 'TC-2024-0091',
    projectCode: 'PRJ-2025-0101',
    projectTitle: 'Viết tài liệu API & SDK cho đối tác',
    clientName: 'CloudBridge',
    freelancerName: 'Hoàng Văn Nam',
    summary: 'Điều chỉnh hoàn tiền một phần theo thỏa thuận.',
    status: 'closed',
    openedAt: '2025-02-20T11:00:00+07:00'
  }
]
