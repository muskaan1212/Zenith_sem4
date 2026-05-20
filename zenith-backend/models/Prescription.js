const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    med: {
      type: String,
      required: true,
      trim: true,
    },
    dose: {
      type: String,
      required: true,
      trim: true,
    },
    freq: {
      type: String,
      required: true,
      trim: true,
    },
    by: {
      type: String,
      required: true,
      trim: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    refills: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'active',
      trim: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
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

prescriptionSchema.index({ ownerEmail: 1, id: 1 }, { unique: true })

module.exports = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema)
