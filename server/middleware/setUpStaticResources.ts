import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration }

  Array.of(
    '/dist/assets',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/accessible-autocomplete/dist',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  // Don't cache dynamic resources
  router.use(noCache())
  // Setup static page route
  router.use('/cookies', (req, res) => {
    res.render(`cookies`)
  })

  router.use('/', (req, res, next) => {
    if (req.user?.token) {
      return next()
    }
    return res.render('start')
  })

  return router
}
