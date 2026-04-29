import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

interface ISocketStore {
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  joinConversation: (groupId: string) => void
  joinStaffGeneral: () => void
}

const SOCKET_URL = import.meta.env.VITE_SOCKETIO || ''

export const useStoreSocketIO = create<ISocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const { socket: existingSocket } = get()
    if (existingSocket && existingSocket.connected) {
      console.warn('Socket already connected')
      return
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket']
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      set({ isConnected: true })
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      set({ isConnected: false })
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      set({ isConnected: false })
    })

    // Listen for notifications from server (e.g. when a guest starts a conversation)
    socket.on('new_conversation', (data) => {
      console.log('New conversation notification:', data)
      // You can add logic here to show a toast or update chat list
    })

    set({ socket, isConnected: false })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  joinConversation: (groupId: string) => {
    const { socket } = get()
    if (socket && socket.connected) {
      console.log(`Staff joining conversation: ${groupId}`)
      socket.emit('join_conversation', { groupId })
    }
  },

  joinStaffGeneral: () => {
    const { socket } = get()
    if (socket && socket.connected) {
      console.log('Staff joining staff_room_general')
      socket.emit('staff_room_general')
    }
  }
}))
