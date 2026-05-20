const express = require('express')
const lifecycleTracker = require('../middleware/lifecycle-tracker')
const { getDbStatus } = require('../config/db')

const router = express.Router()

router.use(lifecycleTracker('view-router-entered'))

router.get('/server-report', (req, res) => {
  const report = [
    { label: 'Middleware', status: 'Configured' },
    { label: 'EJS Views', status: 'Enabled' },
    { label: 'Sessions', status: req.session.userPreferences ? 'Active' : 'Ready' },
    { label: 'Socket.IO', status: 'Running on the same HTTP server' },
  ]

  res.render('server-report', {
    title: 'Zenith Server Report',
    generatedAt: new Date().toLocaleString(),
    requestFlow: req.requestFlow,
    report,
    database: getDbStatus(),
  })
})

router.get('/admin-ejs', (req, res) => {
  const adminCards = [
    { title: 'Middleware Flow', details: 'Application-level, router-level, and error middleware are active.' },
    { title: 'SSR + CSR', details: 'React stays the main frontend while EJS handles a couple of server-rendered pages.' },
    { title: 'Authentication', details: 'Bcrypt, JWT, and Passport local strategy are available for demonstration.' },
  ]

  res.render('admin-ejs', {
    title: 'Zenith Admin EJS',
    adminName: 'Backend Viva Demo',
    adminCards,
    database: getDbStatus(),
    showWarning: !getDbStatus().connected,
  })
})

module.exports = router
