export type ContractStatus = 'draft' | 'active' | 'completed' | 'terminated'

export type MockContract = {
  id: string
  code: string
  projectCode: string
  projectTitle: string
  clientName: string
  freelancerName: string
  valueVnd: number
  platformFeeVnd: number
  status: ContractStatus
  signedAt: string | null
}

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  draft: 'Nháp',
  active: 'Đang hiệu lực',
  completed: 'Đã kết thúc',
  terminated: 'Chấm dứt'
}

export const MOCK_CONTRACTS: MockContract[] = [
  {
    id: '1',
    code: 'HD-2025-0088',
    projectCode: 'PRJ-2025-0142',
    projectTitle: 'Xây dựng landing page & dashboard analytics',
    clientName: 'Công ty TNHH MediCare VN',
    freelancerName: 'Trần Minh Đức',
    valueVnd: 45_000_000,
    platformFeeVnd: 2_250_000,
    status: 'active',
    signedAt: '2025-02-18T10:00:00+07:00'
  },
  {
    id: '2',
    code: 'HD-2025-0041',
    projectCode: 'PRJ-2025-0138',
    projectTitle: 'Tích hợp API thanh toán & hóa đơn điện tử',
    clientName: 'Startup FinFlow',
    freelancerName: 'Lê Thị Hương',
    valueVnd: 120_000_000,
    platformFeeVnd: 6_000_000,
    status: 'completed',
    signedAt: '2025-01-25T09:30:00+07:00'
  },
  {
    id: '3',
    code: 'HD-2024-0512',
    projectCode: 'PRJ-2024-0891',
    projectTitle: 'Bảo trì module chat realtime (Socket)',
    clientName: 'NovaWorks',
    freelancerName: 'Phạm Quốc Anh',
    valueVnd: 65_000_000,
    platformFeeVnd: 3_250_000,
    status: 'active',
    signedAt: '2024-11-10T14:00:00+07:00'
  },
  {
    id: '4',
    code: 'HD-2025-0012',
    projectCode: 'PRJ-2025-0101',
    projectTitle: 'Viết tài liệu API & SDK cho đối tác',
    clientName: 'CloudBridge',
    freelancerName: 'Hoàng Văn Nam',
    valueVnd: 18_000_000,
    platformFeeVnd: 900_000,
    status: 'completed',
    signedAt: '2025-01-12T11:00:00+07:00'
  },
  {
    id: '5',
    code: 'HD-2025-0095',
    projectCode: 'PRJ-2025-0120',
    projectTitle: 'Di chuyển hạ tầng lên Kubernetes',
    clientName: 'LogiChain',
    freelancerName: 'Nguyễn Văn Kiệt',
    valueVnd: 350_000_000,
    platformFeeVnd: 17_500_000,
    status: 'active',
    signedAt: '2025-03-05T08:45:00+07:00'
  },
  {
    id: '6',
    code: 'HD-2025-0170',
    projectCode: 'PRJ-2025-0160',
    projectTitle: 'Fine-tune mô hình gợi ý nội dung nội bộ',
    clientName: 'RetailMax',
    freelancerName: '—',
    valueVnd: 200_000_000,
    platformFeeVnd: 10_000_000,
    status: 'draft',
    signedAt: null
  }
]
