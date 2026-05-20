const express = require('express')
const path = require('path')
const fs = require('fs/promises')
const lifecycleTracker = require('../middleware/lifecycle-tracker')
const { getDbStatus } = require('../config/db')

const router = express.Router()

router.use(lifecycleTracker('concepts-router-entered'))

router.get('/request-flow', lifecycleTracker('request-flow-handler'), (req, res) => {
  res.json({
    message: 'This route shows how a request travels through Express middleware.',
    requestFlow: req.requestFlow,
    middlewareTypes: [
      'Application-level middleware',
      'Router-level middleware',
      'Built-in body parser middleware',
      'Error-handling middleware',
      'Third-party middleware',
    ],
  })
})

router.post('/body-parser-demo', lifecycleTracker('body-parser-handler'), (req, res) => {
  res.json({
    message: 'express.json() / express.urlencoded() parsed this request body successfully.',
    contentType: req.headers['content-type'],
    parsedBody: req.body,
    requestFlow: req.requestFlow,
  })
})

router.get('/blocking-demo', (req, res) => {
  // This loop is intentionally blocking to demonstrate CPU-bound work.
  const startedAt = Date.now()
  while (Date.now() - startedAt < 120) {
    Math.sqrt(Math.random() * 99999)
  }

  res.json({
    type: 'blocking',
    message: 'This route used a synchronous loop, which blocks the event loop briefly.',
    durationMs: Date.now() - startedAt,
  })
})

router.get('/non-blocking-demo', async (req, res, next) => {
  try {
    const startedAt = Date.now()
    const filePath = path.join(__dirname, '../data/appointments.json')
    const fileContents = await fs.readFile(filePath, 'utf-8')

    res.json({
      type: 'non-blocking',
      message: 'This route uses async file reading, so the event loop stays free for other requests.',
      durationMs: Date.now() - startedAt,
      itemCount: JSON.parse(fileContents).length,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/error-demo', (req, res, next) => {
  const error = new Error('Intentional error to demonstrate Express error-handling middleware.')
  error.status = 500
  next(error)
})

router.get('/socket-status', (req, res) => {
  const io = req.app.get('io')
  const socketCount = io ? io.engine.clientsCount : 0

  res.json({
    socketConnectedClients: socketCount,
    database: getDbStatus(),
    note: 'Socket.IO enables full-duplex communication with socket.emit and socket.on.',
  })
})

module.exports = router
