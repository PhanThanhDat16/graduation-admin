import type { Pagination } from '.'

export type DisputeStatus =
  | 'pending_reasons'
  | 'waiting_escalation'
  | 'open'
  | 'negotiating'
  | 'admin_review'
  | 'resolved'
  | 'auto_closed'
  | 'staff_cancelled'

export type DisputeResponse = {
  _id: string
  contractId: { _id: string; projectId: { _id: string; title: string } }
  contractorId: { _id: string; fullName: string; avatar: string }
  freelancerId: { _id: string; fullName: string; avatar: string }
  openedBy: { _id: string; fullName: string; avatar: string }
  status: DisputeStatus
  resolutionType: 'extend' | 'cancel' | 'split' | 'auto_close'
  contractorReason: string
  freelancerReason: string
  contractorRequestedResolution: string
  freelancerRequestedResolution: string
  contractorAgreed: boolean
  freelancerAgreed: boolean
  freelancerAmount: number
  contractorAmount: number
  newDeadline: string
  staffDecision: string
  staffId?: { _id: string; fullName: string; avatar: string }
  deadlineSendAdmin: string
  escalatedAt: string
  createdAt: string
  resolvedAt: string
}

export type DisputeListResponse = {
  data: DisputeResponse[]
  pagination: Pagination
}

export type DisputeQuery = {
  page: number
  limit: number
  contractId?: string
  status?: string
  pagination?: Pagination
}
