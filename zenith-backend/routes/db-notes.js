const express = require('express')
const ConceptNote = require('../models/ConceptNote')
const lifecycleTracker = require('../middleware/lifecycle-tracker')
const { getDbStatus } = require('../config/db')

const router = express.Router()

router.use(lifecycleTracker('db-notes-router-entered'))

function ensureDatabase(res) {
  const db = getDbStatus()
  if (!db.connected) {
    res.status(503).json({
      error: 'MongoDB is not connected. Start MongoDB locally to use Mongoose CRUD routes.',
      database: db,
    })
    return false
  }

  return true
}

router.get('/', async (req, res, next) => {
  try {
    if (!ensureDatabase(res)) return

    const notes = await ConceptNote.find().sort({ createdAt: -1 })
    res.json(notes)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    if (!ensureDatabase(res)) return

    const note = await ConceptNote.create(req.body)
    res.status(201).json(note)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    if (!ensureDatabase(res)) return

    const note = await ConceptNote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!note) {
      return res.status(404).json({ error: 'Concept note not found' })
    }

    res.json(note)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (!ensureDatabase(res)) return

    const note = await ConceptNote.findByIdAndDelete(req.params.id)
    if (!note) {
      return res.status(404).json({ error: 'Concept note not found' })
    }

    res.json({ message: 'Concept note deleted successfully.' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
