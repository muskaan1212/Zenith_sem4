const express = require('express')
const Reminder = require('../models/Reminder')
const { getDbStatus } = require('../config/db')
const { requireAuth } = require('../middleware/auth')
const { ensureUserDashboardData } = require('../config/bootstrap-db')
const { stripMongoFields } = require('../utils/mongo-seed')

const router = express.Router()

router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    if (!getDbStatus().connected) {
      return res.status(200).json([])
    }

    await ensureUserDashboardData(req.user)
    const reminders = await Reminder.find({ ownerEmail: req.user.email }).sort({ id: 1 }).lean()
    return res.status(200).json(reminders.map(stripMongoFields))
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load reminders' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, time, note } = req.body
    if (!title || !time) {
      return res.status(400).json({ error: 'title and time are required' })
    }

    const reminder = {
      id: Date.now(),
      title,
      time,
      note: note || '',
      done: false,
      createdAt: new Date().toISOString(),
      ownerId: req.user.id,
      ownerEmail: req.user.email,
    }

    if (getDbStatus().connected) {
      await Reminder.create(reminder)
    }

    return res.status(201).json({ message: 'Reminder created', reminder: stripMongoFields(reminder) })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create reminder' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const update = req.body

    if (!getDbStatus().connected) {
      return res.status(200).json({ message: 'Reminder updated locally', reminder: { id, ...update } })
    }

    const reminder = await Reminder.findOneAndUpdate(
      { id, ownerEmail: req.user.email },
      update,
      { returnDocument: 'after' },
    ).lean()
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' })
    }

    return res.status(200).json({ message: 'Reminder updated', reminder: stripMongoFields(reminder) })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update reminder' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (getDbStatus().connected) {
      await Reminder.findOneAndDelete({ id, ownerEmail: req.user.email })
    }

    return res.status(200).json({ message: 'Reminder deleted' })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete reminder' })
  }
})

module.exports = router
