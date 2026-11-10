import express, { ErrorRequestHandler, Router } from 'express'

export default function setUpWebRequestParsing(): Router {
  const router = express.Router()
  const simulationPayloadError: ErrorRequestHandler = (error, _req, res, next) => {
    if ((error as { type?: string }).type !== 'entity.too.large') {
      next(error)
      return
    }
    res.set('Cache-Control', 'no-store')
    res.status(413).render('pages/up3-simulation', {
      pageTitle: 'Dev: simulate UP3',
      basePath: '/dev/up3-simulation',
      mode: 'error',
      errorMessage: 'The simulator form is too large. Reduce the JSON and return reasons before trying again.',
    })
  }
  router.use('/dev/up3-simulation', express.urlencoded({ extended: true, limit: '1mb' }), simulationPayloadError)
  router.use(express.json())
  router.use(express.urlencoded({ extended: true }))
  return router
}
