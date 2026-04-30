import type { Pagination } from '.'

export type ContractStatus =
  | 'draft'
  | 'pending_agreement'
  | 'waiting_payment'
  | 'running'
  | 'submitted'
  | 'completed'
  | 'dispute'
  | 'cancelled'

export type ContractResponse = {
  _id: string
  project_id: {
    _id: string
    title: string
    description: string
  }
  application_id: string
  contractor_id: {
    _id: string
    avatar: string
    email: string
    fullName: string
  }
  freelancer_id: {
    _id: string
    avatar: string
    email: string
    fullName: string
  }
  contractor_terms: string
  freelancer_terms: string
  total_amount: number // Số tiền dự án (freelancer nhận khi hoàn thành)
  admin_fee: number // Phí platform
  freelancer_deposit: number // Tiền đặt cọc freelancer (hoàn lại khi hoàn thành)
  contractor_agreed: boolean
  freelancer_agreed: boolean
  deadline: string
  contractor_paid: boolean
  freelancer_paid: boolean
  contractor_paid_amount: number
  freelancer_paid_amount: number
  status: ContractStatus
  escrow_status: ['pending', 'partial', 'funded', 'locked', 'released', 'refunded', 'split']
  total_escrow_amount: number
  released_to_freelancer: number
  refunded_to_contractor: number
  refunded_to_freelancer: number
  admin_fee_collected: number
  payment_info: PaymentInfo
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
