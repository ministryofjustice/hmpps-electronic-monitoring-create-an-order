import express from 'express'

import createError from 'http-errors'

import multer from 'multer'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware, { cemoAuthorisedRoles } from './middleware/authorisationMiddleware'
import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import routes from './routes'
import type { Services } from './services'
import { setUpRenderPdf } from './middleware/setUpRenderPdf'
import GotenbergClient from './data/gotenbergClient'
import config from './config'
import FeatureFlags from './utils/featureFlags'

export default function createApp(services: Services): express.Application {
  FeatureFlags.getInstance()

  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  nunjucksSetup(app)
  app.use(setUpAuthentication())
  app.use(setUpStaticResources())
  app.use(authorisationMiddleware(cemoAuthorisedRoles()))
  app.use(multer().single('file'))
  app.use(setUpCsrf())
  app.use(setUpRenderPdf(new GotenbergClient(config.apis.gotenberg.apiUrl)))
  app.use(setUpCurrentUser())

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not Found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
