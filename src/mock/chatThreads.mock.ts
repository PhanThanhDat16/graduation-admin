export type MockChatThread = {
  id: string
  projectCode: string
  participants: string
  lastMessagePreview: string
  lastMessageAt: string
  unreadFlag: boolean
}

export const MOCK_CHAT_THREADS: MockChatThread[] = [
  {
    id: '1',
    projectCode: 'PRJ-2025-0142',
    participants: 'MediCare VN ↔ Trần Minh Đức',
    lastMessagePreview: 'Em gửi bản build staging trên link drive ạ.',
    lastMessageAt: '2025-03-20T16:42:00+07:00',
    unreadFlag: true
  },
  {
    id: '2',
    projectCode: 'PRJ-2025-0120',
    participants: 'LogiChain ↔ Nguyễn Văn Kiệt',
    lastMessagePreview: 'Anh confirm giúp em quyền truy cập cluster prod.',
    lastMessageAt: '2025-03-20T11:05:00+07:00',
    unreadFlag: false
  },
  {
    id: '3',
    projectCode: 'PRJ-2025-0138',
    participants: 'FinFlow ↔ Lê Thị Hương',
    lastMessagePreview: 'Đã merge PR webhook, nhờ team QA kiểm tra.',
    lastMessageAt: '2025-03-19T09:18:00+07:00',
    unreadFlag: false
  },
  {
    id: '4',
    projectCode: 'PRJ-2024-0891',
    participants: 'NovaWorks ↔ Phạm Quốc Anh',
    lastMessagePreview: 'Bên em đã mở ticket tranh chấp, mong sớm phản hồi.',
    lastMessageAt: '2025-03-12T08:20:00+07:00',
    unreadFlag: true
  }
]
