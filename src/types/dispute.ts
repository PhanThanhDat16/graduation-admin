import type { Pagination } from '.'

export type DisputeStatus = 'open' | 'negotiating' | 'admin_review' | 'resolved' | 'auto_closed'

export type DisputeResponse = {
  _id: string
  contract_id: { _id: string }
  contractor_id: { _id: string }
  freelancer_id: { _id: string }
  opened_by: { _id: string }
  status: DisputeStatus
  resolution_type: ['extend', 'cancel', 'split', 'auto_close']
  contractor_reason: string
  freelancer_reason: string
  contractor_requested_resolution: string
  freelancer_requested_resolution: string
  contractor_agreed: boolean
  freelancer_agreed: boolean
  freelancer_amount: number
  contractor_amount: number
  new_deadline: string
  admin_decision: string
  admin_id: { _id: string }
  deadline_send_admin: string
  escalated_at: string
  createdAt: string
  resolved_at: string
}

export type DisputeListResponse = {
  data: DisputeResponse[]
  pagination: Pagination
}

export type DisputeQuery = {
  page: number
  limit: number
  contract_id?: string
  status?: string
  pagination?: Pagination
}
