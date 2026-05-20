const mongoose = require('mongoose')

// SQL vs NoSQL note:
// SQL stores rows in fixed tables, while MongoDB stores flexible JSON-like documents.
const conceptNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['middleware', 'rendering', 'database', 'sessions', 'auth', 'realtime'],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: String,
      default: 'Zenith Demo',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.models.ConceptNote || mongoose.model('ConceptNote', conceptNoteSchema)
