import express, { Express } from 'express'
import { NotFound } from 'http-errors'
import { v4 as uuidv4 } from 'uuid'

import jwt from 'jsonwebtoken'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import type { Services } from '../../services'
import AuditService from '../../services/auditService'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import authorisationMiddleware, { cemoAuthorisedRoles } from '../../middleware/authorisationMiddleware'

jest.mock('../../services/auditService')
jest.mock('../../data/hmppsAuditClient')

const createToken = (roles: Array<string>): string => jwt.sign({ authorities: roles }, 'secret', { expiresIn: '1h' })

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: createToken(['ROLE_EM_CEMO__CREATE_ORDER']),
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const unauthorisedUser: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: createToken([]),
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

const hmppsAuditClient = new HmppsAuditClient({
  queueUrl: '',
  enabled: true,
  region: '',
  serviceName: '',
}) as jest.Mocked<HmppsAuditClient>

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => HmppsUser): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
    }
    next()
  })
  app.use((req, res, next) => {
    req.id = uuidv4()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(authorisationMiddleware(cemoAuthorisedRoles()))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService(hmppsAuditClient) as jest.Mocked<AuditService>,
  },
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, production, userSupplier)
}
