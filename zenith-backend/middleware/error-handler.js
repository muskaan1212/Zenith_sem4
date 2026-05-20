module.exports = function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const flow = req.requestFlow || []

  flow.push('error-handler')
  console.error('Server error:', err.message)

  res.status(status).json({
    error: err.message || 'Internal server error',
    requestFlow: flow,
  })
}
