import type { Express } from 'express'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { getMockOrder, getMockSubmittedOrder } from '../../test/mocks/mockOrder'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { SanitisedError } from '../sanitisedError'
import AuditService, { Page } from '../services/auditService'
import DeviceWearerService from '../services/deviceWearerService'
import OrderSearchService from '../services/orderSearchService'
import OrderService from '../services/orderService'
import { appWithAllRoutes, flashProvider, unauthorisedUser, user } from './testutils/appSetup'
import TaskListService from '../services/taskListService'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/orderSearchService')
jest.mock('../services/deviceWearerService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

const hmppsAuditClient = new HmppsAuditClient({
  queueUrl: '',
  enabled: true,
  region: '',
  serviceName: '',
}) as jest.Mocked<HmppsAuditClient>
const restClient = new RestClient('cemoApi', {
  url: '',
  timeout: { response: 0, deadline: 0 },
  agent: { timeout: 0 },
}) as jest.Mocked<RestClient>
const auditService = new AuditService(hmppsAuditClient) as jest.Mocked<AuditService>
const orderSearchService = new OrderSearchService(restClient) as jest.Mocked<OrderSearchService>
const orderService = new OrderService(restClient) as jest.Mocked<OrderService>
const deviceWearerService = new DeviceWearerService(restClient) as jest.Mocked<DeviceWearerService>
const taskListService = new TaskListService()
const mockSubmittedOrder = getMockSubmittedOrder()
const mockDraftOrder = getMockOrder()

const mock500Error: SanitisedError = {
  message: 'Internal Server Error',
  name: 'InternalServerError',
  stack: '',
  status: 500,
}

const mock404Error: SanitisedError = {
  message: 'Not Found',
  name: 'Not Found',
  stack: '',
  status: 404,
}

describe('authorised user', () => {
  let app: Express

  beforeEach(() => {
    app = appWithAllRoutes({
      services: {
        auditService,
        orderService,
        deviceWearerService,
        orderSearchService,
        taskListService,
      },
      userSupplier: () => user,
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /', () => {
    it('should render order search page', () => {
      auditService.logPageView.mockResolvedValue()
      orderSearchService.searchOrders.mockResolvedValue([])

      return request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Electronic Monitoring Application forms')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_SEARCH_PAGE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })

    it('should render the order search page with no results if there is an error', () => {
      auditService.logPageView.mockResolvedValue()
      orderSearchService.searchOrders.mockRejectedValue(mock500Error)

      return request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Electronic Monitoring Application forms')
          expect(res.text).toContain('No existing forms found.')
          expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_SEARCH_PAGE, {
            who: user.username,
            correlationId: expect.any(String),
          })
        })
    })
  })

  describe('GET /order/:orderId/summary', () => {
    it('should render order summary page', () => {
      auditService.logPageView.mockResolvedValue()
      orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      return request(app)
        .get(`/order/${mockSubmittedOrder.id}/summary`)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Tag request form')
        })
    })
  })

  describe('GET /order/delete/failed', () => {
    it('should render a failed deletion page', () => {
      return request(app)
        .get('/order/delete/failed')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('You cannot delete an application that has been submitted')
        })
    })
  })

  describe('GET /order/delete/success', () => {
    it('should render a successful deletion page', () => {
      return request(app)
        .get('/order/delete/success')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('The application form has been successfully deleted')
        })
    })
  })

  describe('GET /order/:orderId/delete', () => {
    it('should render a confirmation page for a draft order', () => {
      orderService.getOrder.mockResolvedValue(mockDraftOrder)

      return request(app)
        .get(`/order/${mockDraftOrder.id}/delete`)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Are you sure you want to delete this form?')
        })
    })

    it('should redirect to a failed page for a submitted order', () => {
      orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      return request(app)
        .get(`/order/${mockSubmittedOrder.id}/delete`)
        .expect(302)
        .expect('Location', '/order/delete/failed')
    })
  })

  describe('POST /order/:orderId/delete', () => {
    it('should delete a draft order and redirect to the success page', () => {
      orderService.getOrder.mockResolvedValue(mockDraftOrder)

      return request(app)
        .post(`/order/${mockDraftOrder.id}/delete`)
        .expect(302)
        .expect('Location', '/order/delete/success')
    })

    it('should not delete a submitted order and redirect to the failed page', () => {
      orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      return request(app)
        .post(`/order/${mockSubmittedOrder.id}/delete`)
        .expect(302)
        .expect('Location', '/order/delete/failed')
    })
  })

  describe('GET /order/:orderId/about-the-device-wearer', () => {
    it('should render device wearer page', () => {
      auditService.logPageView.mockResolvedValue()
      orderService.getOrder.mockResolvedValue(mockSubmittedOrder)
      flashProvider.mockReturnValue([])

      return request(app)
        .get(`/order/${mockSubmittedOrder.id}/about-the-device-wearer`)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('About the device wearer')
        })
    })
  })

  describe('GET /order/:orderId/contact-information/contact-details', () => {
    it('should render contact details page', () => {
      auditService.logPageView.mockResolvedValue()
      orderService.getOrder.mockResolvedValue(mockSubmittedOrder)
      flashProvider.mockReturnValue([])

      return request(app)
        .get(`/order/${mockSubmittedOrder.id}/contact-information/contact-details`)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Contact information')
        })
    })
  })

  describe('POST /order/:orderId/submit', () => {
    it('should submit a draft order and redirect to the success page', () => {
      orderService.getOrder.mockResolvedValue(mockDraftOrder)

      return request(app)
        .post(`/order/${mockDraftOrder.id}/submit`)
        .expect(302)
        .expect('Location', '/order/submit/success')
    })

    it('should not submit an already submitted order and redirect to the failed page', () => {
      orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      return request(app)
        .post(`/order/${mockSubmittedOrder.id}/submit`)
        .expect(302)
        .expect('Location', '/order/submit/failed')
    })
  })
})

describe('Order Not Found', () => {
  let app: Express
  const mockId = uuidv4()

  beforeEach(() => {
    app = appWithAllRoutes({
      services: {
        auditService,
        orderService,
        deviceWearerService,
        orderSearchService,
      },
      userSupplier: () => user,
    })

    orderService.getOrder.mockRejectedValue(mock404Error)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe.each<[string, 'get' | 'post', string]>([
    ['GET /order/:orderId/summary', 'get', `/order/${mockId}/summary`],
    ['GET /order/:orderId/delete', 'get', `/order/${mockId}/delete`],
    ['POST /order/:orderId/summary', 'post', `/order/${mockId}/delete`],
    ['GET /order/:orderId/about-the-device-wearer', 'get', `/order/${mockId}/about-the-device-wearer`],
    ['POST /order/:orderId/about-the-device-wearer', 'post', `/order/${mockId}/about-the-device-wearer`],
    [
      'GET /order/:orderId/contact-information/contact-details',
      'get',
      `/order/${mockId}/contact-information/contact-details`,
    ],
  ])('%s', (_, method, path) => {
    it('should render a 404 if the order is not found', () => {
      return request(app)
        [method](path)
        .expect(404)
        .expect(res => {
          expect(res.text).toContain('Not Found')
        })
    })
  })
})

describe('unauthorised user', () => {
  let app: Express

  beforeEach(() => {
    app = appWithAllRoutes({
      services: {
        auditService,
        orderService,
        deviceWearerService,
        orderSearchService,
      },
      userSupplier: () => unauthorisedUser,
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe.each<[string, 'get' | 'post', string]>([
    ['GET /', 'get', '/'],
    ['GET /order/delete/success', 'get', '/order/delete/success'],
    ['GET /order/delete/failed', 'get', '/order/delete/failed'],
    ['GET /order/:orderId/summary', 'get', '/order/123456789/summary'],
    ['GET /order/:orderId/delete', 'get', '/order/123456789/delete'],
    ['POST /order/:orderId/summary', 'post', '/order/123456789/delete'],
    ['GET /order/:orderId/about-the-device-wearer', 'get', '/order/123456789/about-the-device-wearer'],
    ['POST /order/:orderId/about-the-device-wearer', 'post', '/order/123456789/about-the-device-wearer'],
    [
      'GET /order/:orderId/contact-information/contact-details',
      'get',
      '/order/123456789/contact-information/contact-details',
    ],
  ])('%s', (_, method, path) => {
    it('should redirect to authError', () => {
      return request(app)[method](path).expect(302).expect('Location', '/authError')
    })
  })
})
