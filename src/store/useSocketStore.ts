import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

interface ISocketStore {
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

const SOCKET_URL = import.meta.env.VITE_SOCKETIO || ''

export const useStoreSocketIO = create<ISocketStore>((set) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    set((state) => {
      if (state.socket && state.socket.connected) {
        console.warn('Socket already connected')
        return state
      }

      const socket = io(SOCKET_URL)

      let failedAttempts = 0

      socket.on('connect', () => {
        set({ socket, isConnected: true })

        socket.emit('staff_room_general')
        console.log('Socket IO Connected')
        failedAttempts = 0
      })

      socket.on('connect_error', () => {
        console.error('connect_error', failedAttempts)
        failedAttempts += 1
        if (failedAttempts >= 10) {
          socket.disconnect()
          console.error('Failed to connect 10 times. Socket disconnected.')
        }
      })

      return { socket, isConnected: true }
    })
  },

  disconnect() {
    set((state) => {
      if (state.socket && state.socket.connected) {
        state.socket.disconnect()
        console.log('Socket disconnected')
      }
      return { socket: null, isConnected: false }
    })
  }
}))
