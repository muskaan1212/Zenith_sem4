const express = require('express')
const path = require('path')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

const appointmentsRouter = require('./routes/appointments')
const recordsRouter = require('./routes/records')
const feedbackRouter = require('./routes/feedback')
const prescriptionsRouter = require('./routes/prescriptions')
const remindersRouter = require('./routes/reminders')
const authRouter = require('./routes/auth')
const sessionRouter = require('./routes/session')
const conceptsRouter = require('./routes/concepts')
const dbNotesRouter = require('./routes/db-notes')
const viewRouter = require('./routes/view-routes')
const requestLogger = require('./middleware/request-logger')
const lifecycleTracker = require('./middleware/lifecycle-tracker')
const errorHandler = require('./middleware/error-handler')
const configurePassport = require('./middleware/passport')
const { getDbStatus } = require('./config/db')

const PORT = Number(process.env.PORT) || 3001
const app = express()

configurePassport()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Application-level middleware runs before the route handler.
app.use(requestLogger)
app.use(lifecycleTracker('application-start'))

// Built-in body parser middleware for JSON and HTML form data.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Third-party middleware examples.
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'zenith-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    },
  }),
)
app.use(passport.initialize())

app.use((req, res, next) => {
  req.requestFlow.push('cors-middleware')
  const allowedOrigins = new Set(['http://localhost:3000', 'http://localhost:3002'])
  const requestOrigin = req.headers.origin
  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use(express.static(path.join(__dirname, 'public')))

// Existing React-facing routes remain intact.
app.use('/appointments', appointmentsRouter)
app.use('/records', recordsRouter)
app.use('/feedback', feedbackRouter)
app.use('/prescriptions', prescriptionsRouter)
app.use('/reminders', remindersRouter)

// New concept demonstration routes.
app.use('/auth', authRouter)
app.use('/session', sessionRouter)
app.use('/concepts', conceptsRouter)
app.use('/db/notes', dbNotesRouter)
app.use('/', viewRouter)

app.get('/', (req, res) => {
  req.requestFlow.push('root-controller')
  res.json({
    status: 'ok',
    message: 'Zenith Healthcare API running',
    port: PORT,
    requestFlow: req.requestFlow,
    concepts: {
      middleware: '/concepts/request-flow',
      sessions: '/session/check',
      auth: '/auth/profile',
      ejs: ['/server-report', '/admin-ejs'],
      database: '/db/notes',
      realtime: '/concepts/socket-status',
    },
  })
})

app.get('/health', (req, res) => {
  req.requestFlow.push('health-controller')
  const appointmentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/appointments.json'), 'utf-8'))
  const feedbackData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/feedback.json'), 'utf-8'))
  const recordsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/records.json'), 'utf-8'))
  const prescriptionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/prescriptions.json'), 'utf-8'))

  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    port: PORT,
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    routes: [
      { path: '/appointments', method: 'GET, POST', records: appointmentsData.length },
      { path: '/records', method: 'GET, POST', records: recordsData.length },
      { path: '/feedback', method: 'GET, POST', records: feedbackData.length },
      { path: '/prescriptions', method: 'GET, POST', records: prescriptionsData.length },
      { path: '/reminders', method: 'GET, POST, PUT, DELETE', records: getDbStatus().connected ? 'MongoDB collection' : 2 },
      { path: '/db/notes', method: 'GET, POST, PUT, DELETE', records: 'MongoDB collection' },
      { path: '/auth/login', method: 'POST', records: 'JWT login' },
      { path: '/session/check', method: 'GET', records: 'Session check' },
      { path: '/concepts/body-parser-demo', method: 'POST', records: 'Body parser demo' },
      { path: '/concepts/error-demo', method: 'GET', records: 'Error handler demo' },
      { path: '/server-report', method: 'GET', records: 'EJS SSR page' },
    ],
    requestFlow: req.requestFlow,
  })
})

app.use((req, res) => {
  req.requestFlow.push('not-found-handler')
  res.status(404).json({ error: 'Route not found', requestFlow: req.requestFlow })
})

app.use(errorHandler)

module.exports = app
