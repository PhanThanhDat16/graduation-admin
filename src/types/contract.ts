import type { Pagination } from '.'

export type ContractStatus =
  | 'draft'
  | 'closed_for_requests'
  | 'pending_agreement'
  | 'waiting_payment'
  | 'running'
  | 'submitted'
  | 'completed'
  | 'dispute'
  | 'cancelled'

export type ContractResponse = {
  _id: string
  projectId: { _id: string; title: string; description: string }
  applicationId: string
  contractorId: { _id: string; avatar: string; email: string; fullName: string }
  freelancerId: { _id: string; avatar: string; email: string; fullName: string }
  contractorTerms: string
  freelancerTerms: string
  totalAmount: number // Số tiền dự án (freelancer nhận khi hoàn thành)
  adminFee: number // Phí platform
  freelancerDeposit: number // Tiền đặt cọc freelancer (hoàn lại khi hoàn thành)
  contractorAgreed: boolean
  freelancerAgreed: boolean
  deadline: string
  contractorPaid: boolean
  freelancerPaid: boolean
  contractorPaidAmount: number
  freelancerPaidAmount: number
  status: ContractStatus
  escrowStatus: ['pending', 'partial', 'funded', 'locked', 'released', 'refunded', 'split']
  totalEscrowAmount: number
  releasedToFreelancer: number
  refundedToContractor: number
  refundedToFreelancer: number
  adminFeeCollected: number
  paymentInfo: PaymentInfo
  createdAt?: string
  updatedAt?: string
  // Extra fields for display
  projectName?: string
  freelancerName?: string
  contractorName?: string
}

export type PaymentInfo = {
  contractor_must_pay: number
  freelancer_must_pay: number
  contractor_remaining: number
  freelancer_remaining: number
}

export type ContractListResponse = {
  data: ContractResponse[]
  pagination: Pagination
}

export type ContractQuery = {
  page: number
  limit: number
  status?: string
  keyword?: string
  pagination?: Pagination
}
