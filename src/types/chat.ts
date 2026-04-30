import type { Pagination } from '.'

export type TypeConversation = 'guest_support' | 'user_support' | 'contract_chat'

export type ConversationResponse = {
  _id: string
  memberIds: string[]
  ownerId: string
  ownerInfo: {
    _id: string
    full_name: string
    avatar: string
  }
  type: TypeConversation
  disputeId?: string
  assignedStaffId?: string
  assignedStaffInfo?: {
    _id: string
    full_name: string
    avatar: string
  }
  guestName?: string
  lastMessage?: string
  lastMessageAt?: string
  lastSenderId?: {
    _id: string
    full_name: string
    avatar: string
  }
  createdAt: string
}

export type MessageResponse = {
  _id: string
  groupId: string
  senderId: string
  senderInfo: {
    _id: string
    full_name: string
    avatar: string
  }
  type: 'text' | 'image' | 'file' | 'video' | 'audio'
  content: string
  replyTo: {
    _id: string
    content: string
    senderId: {
      _id: string
      full_name: string
      avatar: string
    }
    createdAt: string
  }
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
