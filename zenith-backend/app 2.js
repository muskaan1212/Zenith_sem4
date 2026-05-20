const express = require('express')
const path = require('path')
const fs = require('fs')
const appointmentsRouter = require('./routes/appointments')
const recordsRouter = require('./routes/records')
const feedbackRouter = require('./routes/feedback')
const prescriptionsRouter = require('./routes/prescriptions')

const app = express()
const PORT = 3001

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS headers (allow Next.js frontend)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// Serve static files from zenith-backend/public
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/appointments', appointmentsRouter)
app.use('/records', recordsRouter)
app.use('/feedback', feedbackRouter)
app.use('/prescriptions', prescriptionsRouter)

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Zenith Healthcare API running', port: PORT })
})

app.get('/health', (req, res) => {
  const appointmentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/appointments.json'), 'utf-8'))
  const feedbackData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/feedback.json'), 'utf-8'))
  const recordsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/records.json'), 'utf-8'))
  const prescriptionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/prescriptions.json'), 'utf-8'))
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    port: PORT,
    timestamp: new Date().toISOString(),
    routes: [
      { path: '/appointments', method: 'GET, POST', records: appointmentsData.length },
      { path: '/records', method: 'GET, POST', records: recordsData.length },
      { path: '/feedback', method: 'GET, POST', records: feedbackData.length },
      { path: '/prescriptions', method: 'GET, POST', records: prescriptionsData.length },
    ],
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Zenith Healthcare backend running on http://localhost:${PORT}`)
})
