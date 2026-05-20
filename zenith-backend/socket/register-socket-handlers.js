const { Server } = require('socket.io')

module.exports = function registerSocketHandlers(server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3002'],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    socket.emit('server:welcome', {
      message: 'Connected to Zenith real-time demo.',
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    })

    socket.on('chat:send', (payload) => {
      const message = {
        id: Date.now(),
        author: payload.author || 'Guest',
        text: payload.text || '',
        createdAt: new Date().toISOString(),
      }

      io.emit('chat:new', message)
    })

    socket.on('notification:ping', () => {
      socket.emit('notification:pong', {
        text: 'Full-duplex response from the backend.',
        createdAt: new Date().toISOString(),
      })
    })
  })

  return io
}
