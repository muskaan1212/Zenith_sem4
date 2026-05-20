module.exports = function lifecycleTracker(stageName) {
  return function lifecycleMiddleware(req, res, next) {
    if (!req.requestFlow) {
      req.requestFlow = []
    }

    req.requestFlow.push(stageName)
    next()
  }
}
