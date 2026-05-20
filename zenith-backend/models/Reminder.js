const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    done: {
      type: Boolean,
      default: false,
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

reminderSchema.index({ ownerEmail: 1, id: 1 }, { unique: true })

module.exports = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema)
