export const emitJoinConversation = (socket: any, groupId: string) => {
  if (socket) {
    socket.emit('join_conversation', { groupId })
  }
}

export function listenNewConversation(socket: any, fnc: () => void | Promise<void>) {
  if (!socket) return

  const handler = async () => {
    await fnc()
  }

  socket.on('new_conversation', handler)

  // return cleanup
  return () => {
    socket.off('new_conversation', handler)
  }
}
