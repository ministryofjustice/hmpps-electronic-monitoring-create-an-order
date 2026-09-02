import express, { Express } from 'express'
import { NotFound } from 'http-errors'
import flash from 'connect-flash'
import jwt from 'jsonwebtoken'
import routes from '../../routes'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import type { Services } from '../../services'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import authorisationMiddleware, { cemoAuthorisedRoles } from '../../middleware/authorisationMiddleware'

const createToken = (roles: Array<string>): string => jwt.sign({ authorities: roles }, 'secret', { expiresIn: '1h' })

export const acceptanceUser: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: createToken(['ROLE_EM_CEMO__CREATE_ORDER']),
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

/**
 * Builds the real application: real routes, middleware, controllers, view
 * models and Nunjucks templates, with real session and flash so that
 * POST-redirect-GET behaves exactly as it does in production.
 *
 * Each suite passes the real services its journey needs, constructed against
 * a FakeCemoApiClient. The API client is the only substitution -- it is the
 * boundary of this application.
 *
 * Authentication is bypassed because it is infrastructure shared by every
 * page, covered once by the auth E2E tests rather than per feature.
 */
export const createAcceptanceApp = (services: Partial<Services>): Express => {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()

  const app = express()
  app.set('view engine', 'njk')
  nunjucksSetup(app)

  app.use(setUpWebSession())
  app.use(flash())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use((req, res, next) => {
    req.user = acceptanceUser as Express.User
    res.locals = { user: { ...acceptanceUser } }
    next()
  })

  app.use(authorisationMiddleware(cemoAuthorisedRoles()))
  app.use(routes(services as Services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(false))

  return app
}
