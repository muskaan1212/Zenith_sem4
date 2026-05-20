const express = require('express')
const fs = require('fs')
const path = require('path')
const Prescription = require('../models/Prescription')
const { getDbStatus } = require('../config/db')
const { requireAuth } = require('../middleware/auth')
const { ensureUserDashboardData } = require('../config/bootstrap-db')
const { stripMongoFields } = require('../utils/mongo-seed')

const router = express.Router()
const DATA_FILE = path.join(__dirname, '../data/prescriptions.json')

router.use(requireAuth)

function readPrescriptions() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writePrescriptions(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /prescriptions — return all prescriptions
router.get('/', async (req, res) => {
  try {
    if (getDbStatus().connected) {
      await ensureUserDashboardData(req.user)
      const prescriptions = await Prescription.find({ ownerEmail: req.user.email }).sort({ id: 1 }).lean()
      return res.status(200).json(prescriptions.map(stripMongoFields))
    }

    const prescriptions = readPrescriptions().filter((item) => item.ownerEmail === req.user.email)
    res.status(200).json(prescriptions)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read prescriptions' })
  }
})

// POST /prescriptions — add a new prescription
router.post('/', async (req, res) => {
  try {
    const { med, dose, freq, by, start, end, refills, status } = req.body

    if (!med || !dose || !freq || !by || !start || !end) {
      return res.status(400).json({ error: 'med, dose, freq, by, start, and end are required' })
    }

    const prescriptions = readPrescriptions()

    const newPrescription = {
      id: Date.now(),
      med,
      dose,
      freq,
      by,
      start,
      end,
      refills: refills != null ? Number(refills) : 0,
      status: status || 'active',
      createdAt: new Date().toISOString(),
      ownerId: req.user.id,
      ownerEmail: req.user.email,
    }

    prescriptions.push(newPrescription)
    writePrescriptions(prescriptions)

    if (getDbStatus().connected) {
      await Prescription.findOneAndUpdate(
        { id: newPrescription.id, ownerEmail: req.user.email },
        newPrescription,
        { upsert: true, setDefaultsOnInsert: true },
      )
    }

    res.status(201).json({ message: 'Prescription added', prescription: stripMongoFields(newPrescription) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to add prescription' })
  }
})

module.exports = router
