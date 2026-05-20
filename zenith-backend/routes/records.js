const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const router = express.Router()
const DATA_FILE = path.join(__dirname, '../data/records.json')
const UPLOADS_DIR = path.join(__dirname, '../uploads')

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_')
    cb(null, safeName)
  },
})
const upload = multer({ storage })

// Helper: read records
function readRecords() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

// Helper: write records
function writeRecords(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /records — list all records
router.get('/', (req, res) => {
  try {
    const records = readRecords()
    res.status(200).json(records)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read records' })
  }
})

// POST /records — upload a file and save record metadata
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const records = readRecords()

    const newRecord = {
      id: Date.now(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
    }

    records.push(newRecord)
    writeRecords(records)

    res.status(201).json({ message: 'Record uploaded', record: newRecord })
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload record' })
  }
})

// GET /records/:filename — stream file to browser
router.get('/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' })
  }

  const stat = fs.statSync(filePath)
  res.setHeader('Content-Length', stat.size)
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`)

  const readStream = fs.createReadStream(filePath)
  readStream.pipe(res)
})

module.exports = router
