import type { Pagination } from '.'

export type DisputeStatus = 'open' | 'negotiating' | 'admin_review' | 'resolved' | 'auto_closed'

export type DisputeResponse = {
  _id: string
  contractId: { _id: string; fullName: string; avatar: string }
  contractorId: { _id: string; fullName: string; avatar: string }
  freelancerId: { _id: string; fullName: string; avatar: string }
  openedBy: { _id: string; fullName: string; avatar: string }
  status: DisputeStatus
  resolutionType: ['extend', 'cancel', 'split', 'auto_close']
  contractorReason: string
  freelancerReason: string
  contractorRequestedResolution: string
  freelancerRequestedResolution: string
  contractorAgreed: boolean
  freelancerAgreed: boolean
  freelancerAmount: number
  contractorAmount: number
  newDeadline: string
  adminDecision: string
  adminId: { _id: string; fullName: string; avatar: string }
  deadlineSendAdmin: string
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
