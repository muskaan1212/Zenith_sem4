const express = require('express')
const lifecycleTracker = require('../middleware/lifecycle-tracker')

const router = express.Router()

router.use(lifecycleTracker('session-router-entered'))

router.get('/set', (req, res) => {
  req.session.userPreferences = {
    theme: req.query.theme || 'system',
    visitCount: (req.session.userPreferences?.visitCount || 0) + 1,
    savedAt: new Date().toISOString(),
  }

  res.json({
    message: 'Session data stored successfully.',
    session: req.session.userPreferences,
  })
})

router.get('/check', (req, res) => {
  res.json({
    hasSession: Boolean(req.session.userPreferences),
    session: req.session.userPreferences || null,
    lastAuthUser: req.session.lastAuthUser || null,
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error)

    res.clearCookie('connect.sid')
    res.json({ message: 'Session destroyed successfully.' })
  })
})

module.exports = router
