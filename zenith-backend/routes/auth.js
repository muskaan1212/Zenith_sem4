const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/User')
const { requireAuth, signToken } = require('../middleware/auth')
const lifecycleTracker = require('../middleware/lifecycle-tracker')
const { getDbStatus } = require('../config/db')
const { ensureUserDashboardData } = require('../config/bootstrap-db')

const router = express.Router()

router.use(lifecycleTracker('auth-router-entered'))

function ensureDatabase(res) {
  const db = getDbStatus()
  if (!db.connected) {
    res.status(503).json({
      error: 'MongoDB is not connected. Start MongoDB locally to use auth routes.',
      database: db,
    })
    return false
  }

  return true
}

router.post('/register', async (req, res, next) => {
  try {
    if (!ensureDatabase(res)) return

    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    await ensureUserDashboardData(user)

    res.status(201).json({
      message: 'User registered with bcrypt password hashing.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    if (!ensureDatabase(res)) return

    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    await ensureUserDashboardData(user)
    const token = signToken(user)
    req.session.lastAuthUser = user.email

    res.json({
      message: 'Login successful. JWT generated for protected routes.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login/passport', (req, res, next) => {
  if (!ensureDatabase(res)) return

  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Passport login failed' })
    }

    ensureUserDashboardData(user).catch(() => {})
    const token = signToken(user)
    return res.json({
      message: 'Passport local strategy login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  })(req, res, next)
})

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    if (!ensureDatabase(res)) return

    const user = await User.findById(req.user.id).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      message: 'Protected profile route reached through JWT middleware.',
      user,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
