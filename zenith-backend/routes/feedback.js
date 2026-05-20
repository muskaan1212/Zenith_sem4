const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const DATA_FILE = path.join(__dirname, '../data/feedback.json')

// Helper: read feedback from JSON
function readFeedback() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

// Helper: write feedback to JSON
function writeFeedback(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /feedback — return all feedback
router.get('/', (req, res) => {
  try {
    const feedback = readFeedback()
    res.status(200).json(feedback)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read feedback' })
  }
})

// POST /feedback — add new feedback
router.post('/', (req, res) => {
  try {
    const { author, type, rating, subject, message } = req.body

    if (!type || !rating || !subject || !message) {
      return res.status(400).json({ error: 'type, rating, subject, and message are required' })
    }

    const feedback = readFeedback()

    const newFeedback = {
      id: Date.now(),
      author: author || 'Anonymous',
      type,
      rating: Number(rating),
      subject,
      message,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }

    feedback.push(newFeedback)
    writeFeedback(feedback)

    res.status(201).json({ message: 'Feedback submitted', feedback: newFeedback })
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback' })
  }
})

module.exports = router
