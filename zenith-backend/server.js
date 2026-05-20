require('dotenv').config()

const http = require('http')
const app = require('./app')
const { connectDB, getDbStatus } = require('./config/db')
const { bootstrapDatabase } = require('./config/bootstrap-db')
const registerSocketHandlers = require('./socket/register-socket-handlers')

const PORT = Number(process.env.PORT) || 3001
const server = http.createServer(app)

const io = registerSocketHandlers(server)
app.set('io', io)

async function startServer() {
  await connectDB()

  if (getDbStatus().connected) {
    await bootstrapDatabase()
  }

  server.listen(PORT, () => {
    console.log(`Zenith Healthcare backend running on http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('[server] Failed to start:', error.message)
  process.exit(1)
})
