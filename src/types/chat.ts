import type { Pagination } from '.'

export type TypeConversation = 'guest_support' | 'user_support' | 'contract_chat'

export type ConversationResponse = {
  _id: string
  memberIds: string[]
  ownerId: { _id: string; fullName: string; avatar: string }
  type: TypeConversation
  disputeId?: string
  assignedStaffId?: string
  assignedStaffInfo?: { _id: string; fullName: string; avatar: string }
  guestName?: string
  lastMessage?: string
  lastMessageAt?: string
  lastSenderId?: { _id: string; fullName: string; avatar: string }
  createdAt: string
}

export type MessageResponse = {
  _id: string
  groupId: string
  senderId: { _id: string; fullName: string; avatar: string } | null
  type: 'text' | 'image'
  senderType: string
  content: string
  createdAt: string
}

export type MessageListResponse = {
  data: MessageResponse[]
  pagination: Pagination
}

export type ConversationListResponse = {
  data: ConversationResponse[]
  pagination: Pagination
}
