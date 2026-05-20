const { getDbStatus } = require('../config/db')

async function ensureSeedData(Model, items, filter = {}) {
  if (!getDbStatus().connected) {
    return false
  }

  const existingCount = await Model.countDocuments(filter)
  if (existingCount === 0 && items.length > 0) {
    await Model.insertMany(items, { ordered: false })
  }

  return true
}

function stripMongoFields(doc) {
  const { _id, ownerId, ownerEmail, passwordHash, ...rest } = doc
  return rest
}

module.exports = {
  ensureSeedData,
  stripMongoFields,
}
