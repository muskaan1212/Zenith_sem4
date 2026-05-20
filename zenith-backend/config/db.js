const mongoose = require('mongoose')

const DEFAULT_MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/zenith'

let dbState = {
  connected: false,
  uri: DEFAULT_MONGODB_URI,
  message: 'MongoDB connection not started yet.',
}

function redactMongoUri(uri) {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//\$1:***@')
}

async function connectDB() {
  try {
    await mongoose.connect(DEFAULT_MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    })

    dbState = {
      connected: true,
      uri: DEFAULT_MONGODB_URI,
      message: 'MongoDB connected successfully with Mongoose.',
    }

    console.log('[db] MongoDB connected')
  } catch (error) {
    dbState = {
      connected: false,
      uri: DEFAULT_MONGODB_URI,
      message: `MongoDB unavailable: ${error.message}`,
    }

    // Keep the server alive so the rest of the React app continues working.
    console.warn('[db] MongoDB connection skipped:', error.message)
  }
}

function getDbStatus() {
  return {
    ...dbState,
    uri: redactMongoUri(dbState.uri),
    readyState: mongoose.connection.readyState,
  }
}

module.exports = {
  connectDB,
  getDbStatus,
}
