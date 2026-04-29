import axiosInstance from '../utils/axiosInstance'

export const chatService = {
  getAllConversations: async (params?: { type: string }) => await axiosInstance.get('/conversations/all', { params }),

  getConversationGroupById: async (groupId: string) => await axiosInstance.get(`/conversations/${groupId}`),

  getMessagesInGroup: async (groupId: string) => await axiosInstance.get(`/chat/groups/${groupId}/messages`),

  createMessageInGroup: async (
    groupId: string,
    data: { content: string; userId: string; guestName: string; type: string }
  ) => await axiosInstance.post(`/chat/${groupId}/messages`, { ...data }),

  getMemberInGroup: async (groupId: string) => await axiosInstance.get(`/chat/groups/${groupId}/members`)
}
