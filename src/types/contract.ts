import type { Pagination } from '.'

export type ContractResponse = {
  _id: string
  project_id: string
  application_id: string
  contractor_id: { _id: string }
  freelancer_id: { _id: string }
  description: string
  contractor_terms: string
  freelancer_terms: string // Số tiền dự án (freelancer nhận khi hoàn thành)
  total_amount: number // Phí platform
  admin_fee: number // Tiền đặt cọc freelancer (hoàn lại khi hoàn thành)
  freelancer_deposit: number
  contractor_agreed: boolean
  freelancer_agreed: boolean
  deadline: string
  contractor_paid: boolean
  freelancer_paid: boolean
  contractor_paid_amount: number
  freelancer_paid_amount: number
  status: ['draft', 'pending_agreement', 'waiting_payment', 'running', 'submitted', 'completed', 'dispute', 'cancelled']
  escrow_status: ['pending', 'partial', 'funded', 'locked', 'released', 'refunded', 'split']
  total_escrow_amount: number
  released_to_freelancer: number
  refunded_to_contractor: number
  refunded_to_freelancer: number
  admin_fee_collected: number
  payment_info: PaymentInfo
  createdAt?: string
  updatedAt?: string
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
  search?: string
  meta?: Pagination
  status?: string
}
