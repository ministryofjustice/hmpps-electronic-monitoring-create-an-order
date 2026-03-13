import type { Express } from 'express'
import request from 'supertest'
import { v4 as UUIDv4 } from 'uuid'
import { appWithAllRoutes } from './routes/testutils/appSetup'
import { OrderService } from './services'
import { SanitisedError } from './sanitisedError'
import logger from '../logger'

let spy: jest.SpyInstance
beforeEach(() => {
  // null logger.error behaviour so we don't see expected errors in the console when running tests
  spy = jest.spyOn(logger, 'error').mockImplementation(() => null)
})
afterEach(() => {
  spy.mockRestore()
})

let app: Express
describe('GET 404', () => {
  beforeEach(() => {
    app = appWithAllRoutes({})
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should render content with stack in dev mode', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('If you typed the web address, check it is correct.')
        expect(res.text).toContain('If you pasted the web address, check you copied the entire address.')
      })
  })

  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('If you typed the web address, check it is correct.')
        expect(res.text).toContain('If you pasted the web address, check you copied the entire address.')
      })
  })
})

describe('GET 403', () => {
  let getOrderMock: jest.Mock

  beforeEach(() => {
    getOrderMock = jest.fn()

    const mockOrderService = {
      getOrder: getOrderMock,
    } as unknown as OrderService

    app = appWithAllRoutes({ services: { orderService: mockOrderService } })
  })

  it('Forbidden errors show restricted order access page', () => {
    const mockError = new Error() as SanitisedError
    mockError.status = 403
    mockError.data = { errorCode: '40301' }
    getOrderMock.mockRejectedValueOnce(mockError)

    return request(app)
      .get(`/order/${UUIDv4()}/summary`)
      .expect(403)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('You do not have access to view this order')
        expect(res.text).toContain('Access is restricted to some orders.')
        expect(res.text).toContain('Go back to the start')
      })
  })

  it('Other 403 leads to sign out redirect', () => {
    const mockError = new Error() as SanitisedError
    mockError.status = 403
    getOrderMock.mockRejectedValueOnce(mockError)

    return request(app)
      .get(`/order/${UUIDv4()}/summary`)
      .expect(302)
      .expect(res => {
        expect(res.text).toContain('Redirecting to /sign-out')
      })
  })
})
