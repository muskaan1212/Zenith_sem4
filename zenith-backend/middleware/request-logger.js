module.exports = function requestLogger(req, res, next) {
  req.requestStartedAt = new Date().toISOString()
  req.requestFlow = ['request-arrived']

  console.log(`[${req.requestStartedAt}] ${req.method} ${req.originalUrl}`)
  next()
}
