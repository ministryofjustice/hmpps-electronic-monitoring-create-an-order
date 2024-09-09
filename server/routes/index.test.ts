import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Electronic Monitoring Order')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
describe('GET /newForm', () => {
  it('should render create new form page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/newForm')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Select from:')
      })
  })
})
describe('POST /newForm', () => {
  it('should render form start page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .post('/newForm')
      .send({ formType: 'HDC' })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          'Home Detention Curfew (HDC) is a scheme which allows some people to be released from custody if they have a suitable address to go to.',
        )
      })
  })
})
describe('POST /createForm', () => {
  it('should render form details page after create', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .post('/createForm')
      .send({ formType: 'HDC' })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Home Detention Curfew (HDC) form')
      })
  })
})
describe('GET /section/:formId/:sectionName', () => {
  it('should render section details page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/section/abc/identityNumbers')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Identity numbers questions')
      })
  })
})
describe('GET /section/:sectionName/question/:questionName', () => {
  it('should render question page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/section/identitynumbers/question/nomisId')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Identity Numbers')
      })
  })
})
