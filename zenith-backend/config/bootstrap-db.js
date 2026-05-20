const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')

const Appointment = require('../models/Appointment')
const Prescription = require('../models/Prescription')
const Reminder = require('../models/Reminder')
const User = require('../models/User')
const { ensureSeedData } = require('../utils/mongo-seed')

const DEFAULT_REMINDERS = [
  {
    id: 1,
    title: 'Take Morning Medication',
    time: '08:00',
    note: 'Take prescribed medication with breakfast',
    done: false,
    createdAt: '2026-04-01T08:00:00.000Z',
  },
  {
    id: 2,
    title: 'Cardiology Consultation',
    time: '14:30',
    note: 'With Dr. A. Sharma — Room 204',
    done: false,
    createdAt: '2026-04-01T14:30:00.000Z',
  },
]

const DEFAULT_LOGIN_USER = {
  name: process.env.SEED_USER_NAME || 'Zenith Demo User',
  email: (process.env.SEED_USER_EMAIL || 'demo@zenith.local').toLowerCase(),
  role: 'patient',
}

const DEFAULT_PRESCRIPTIONS = readJsonData('prescriptions.json')

function readJsonData(filename) {
  const filePath = path.join(__dirname, `../data/${filename}`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

async function ensureCollection(Model) {
  try {
    await Model.createCollection()
  } catch (error) {
    if (error.codeName !== 'NamespaceExists') {
      throw error
    }
  }

  await Model.syncIndexes()
}

async function ensureDefaultLoginUser() {
  const existingUser = await User.findOne({ email: DEFAULT_LOGIN_USER.email })
  if (existingUser) {
    return existingUser
  }

  const passwordHash = await bcrypt.hash(process.env.SEED_USER_PASSWORD || 'Zenith12345', 10)
  const createdUser = await User.create({
    ...DEFAULT_LOGIN_USER,
    passwordHash,
  })

  return createdUser
}

function withOwnership(items, user) {
  const ownerId = String(user._id || user.id)
  return items.map((item) => ({
    ...item,
    ownerId,
    ownerEmail: user.email,
  }))
}

async function assignOwnerIfMissing(Model, user) {
  await Model.updateMany(
    { $or: [{ ownerEmail: { $exists: false } }, { ownerEmail: null }, { ownerEmail: '' }] },
    {
      $set: {
        ownerId: String(user._id || user.id),
        ownerEmail: user.email,
      },
    },
  )
}

async function ensureUserDashboardData(user) {
  await ensureSeedData(Reminder, withOwnership(DEFAULT_REMINDERS, user), { ownerEmail: user.email })
  await ensureSeedData(Prescription, withOwnership(DEFAULT_PRESCRIPTIONS, user), { ownerEmail: user.email })
}

async function bootstrapDatabase() {
  await Promise.all([
    ensureCollection(Appointment),
    ensureCollection(Prescription),
    ensureCollection(Reminder),
    ensureCollection(User),
  ])

  const defaultUser = await ensureDefaultLoginUser()
  await assignOwnerIfMissing(Appointment, defaultUser)
  await assignOwnerIfMissing(Prescription, defaultUser)
  await assignOwnerIfMissing(Reminder, defaultUser)

  await ensureSeedData(Appointment, withOwnership(readJsonData('appointments.json'), defaultUser), { ownerEmail: defaultUser.email })
  await ensureUserDashboardData(defaultUser)

  console.log('[db] Database bootstrap completed for appointments, prescriptions, reminders, and users.')
}

module.exports = {
  DEFAULT_REMINDERS,
  DEFAULT_PRESCRIPTIONS,
  bootstrapDatabase,
  ensureUserDashboardData,
}
