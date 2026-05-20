const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      default: 'General',
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: '',
      trim: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      trim: true,
    },
    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { versionKey: false },
)

appointmentSchema.index({ ownerEmail: 1, id: 1 }, { unique: true })

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema)
