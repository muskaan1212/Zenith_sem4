const express = require('express')
const fs = require('fs')
const path = require('path')
const Appointment = require('../models/Appointment')
const { getDbStatus } = require('../config/db')
const { requireAuth } = require('../middleware/auth')
const { stripMongoFields } = require('../utils/mongo-seed')

const router = express.Router()
const DATA_FILE = path.join(__dirname, '../data/appointments.json')

router.use(requireAuth)

// Helper: read appointments from JSON file
function readAppointments() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

// Helper: write appointments to JSON file
function writeAppointments(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /appointments — return all appointments
router.get('/', async (req, res) => {
  try {
    if (getDbStatus().connected) {
      const appointments = await Appointment.find({ ownerEmail: req.user.email }).sort({ id: 1 }).lean()
      return res.status(200).json(appointments.map(stripMongoFields))
    }

    const appointments = readAppointments().filter((item) => item.ownerEmail === req.user.email)
    res.status(200).json(appointments)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read appointments' })
  }
})

// POST /appointments — add a new appointment
router.post('/', async (req, res) => {
  try {
    const { doctor, specialty, date, time, reason } = req.body

    if (!doctor || !date || !time) {
      return res.status(400).json({ error: 'doctor, date, and time are required' })
    }

    const appointments = readAppointments()

    const newAppointment = {
      id: Date.now(),
      doctor,
      specialty: specialty || 'General',
      date,
      time,
      reason: reason || '',
      createdAt: new Date().toISOString(),
      ownerId: req.user.id,
      ownerEmail: req.user.email,
    }

    appointments.push(newAppointment)
    writeAppointments(appointments)

    if (getDbStatus().connected) {
      await Appointment.findOneAndUpdate(
        { id: newAppointment.id, ownerEmail: req.user.email },
        newAppointment,
        { upsert: true, setDefaultsOnInsert: true },
      )
    }

    res.status(201).json({ message: 'Appointment created', appointment: stripMongoFields(newAppointment) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create appointment' })
  }
})

module.exports = router
