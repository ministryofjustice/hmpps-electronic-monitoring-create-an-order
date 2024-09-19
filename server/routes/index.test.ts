import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import OrderService from '../services/orderService'
import DeviceWearerService from '../services/deviceWearerService'
import { DeviceWearer, Order } from '../data/inMemoryDatabase'
import OrderSearchService from '../services/orderSearchService'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/orderSearchService')
jest.mock('../services/deviceWearerService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const orderSearchService = new OrderSearchService() as jest.Mocked<OrderSearchService>
const orderService = new OrderService() as jest.Mocked<OrderService>
const deviceWearerService = new DeviceWearerService() as jest.Mocked<DeviceWearerService>

const mockSubmittedOrder: Order = {
  id: '123456789',
  status: 'Submitted',
  title: 'My new order',
  deviceWearer: {
    isComplete: true,
  },
  contactDetails: {
    isComplete: true,
  },
}

const mockDraftOrder: Order = {
  id: '123456789',
  status: 'Draft',
  title: 'My new order',
  deviceWearer: {
    isComplete: true,
  },
  contactDetails: {
    isComplete: true,
  },
}

const mockDeviceWearer: DeviceWearer = {
  orderId: '123456789',
  firstName: 'John',
  lastName: 'Smith',
  dateOfBirth: '',
  preferredName: '',
  gender: 'male',
}

let app: Express

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
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render order search page', () => {
    auditService.logPageView.mockResolvedValue(null)
    orderSearchService.searchOrders.mockResolvedValue([])

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Electronic Monitoring Order')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.ORDER_SEARCH_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})

describe('GET /order/:orderId/summary', () => {
  it('should render order summary page', () => {
    auditService.logPageView.mockResolvedValue(null)
    orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

    return request(app)
      .get('/order/123456789/summary')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Apply for electronic monitoring')
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
        expect(res.text).toContain('The application form has been deleted successfully')
      })
  })
})

describe('GET /order/:orderId/delete', () => {
  it('should render a confirmation page for a draft order', () => {
    orderService.getOrder.mockResolvedValue(mockDraftOrder)

    return request(app)
      .get('/order/123456789/delete')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Are you sure you want to delete this order?')
      })
  })

  it('should redirect to a failed page for a submitted order', () => {
    orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

    return request(app).get('/order/123456789/delete').expect(302).expect('Location', '/order/delete/failed')
  })
})

describe('POST /order/:orderId/delete', () => {
  it('should delete a draft order and redirect to the success page', () => {
    orderService.getOrder.mockResolvedValue(mockDraftOrder)

    return request(app).post('/order/123456789/delete').expect(302).expect('Location', '/order/delete/success')
  })

  it('should not delete a submitted order and redirect to the failed page', () => {
    orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

    return request(app).post('/order/123456789/delete').expect(302).expect('Location', '/order/delete/failed')
  })
})

describe('GET /order/:orderId/device-wearer', () => {
  it('should render device wearer page', () => {
    auditService.logPageView.mockResolvedValue(null)
    orderService.getOrder.mockResolvedValue(mockSubmittedOrder)
    deviceWearerService.getDeviceWearer.mockResolvedValue(mockDeviceWearer)

    return request(app)
      .get('/order/123456789/device-wearer')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('About the device wearer')
      })
  })
})

describe('GET /order/:orderId/device-wearer/edit', () => {
  it('should render editable device wearer page', () => {
    auditService.logPageView.mockResolvedValue(null)
    orderService.getOrder.mockResolvedValue(mockDraftOrder)
    deviceWearerService.getDeviceWearer.mockResolvedValue(mockDeviceWearer)

    return request(app)
      .get('/order/123456789/device-wearer/edit')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('About the device wearer')
      })
  })
})

describe('GET /order/:orderId/contact-details', () => {
  it('should render contact details page', () => {
    auditService.logPageView.mockResolvedValue(null)
    orderService.getOrder.mockResolvedValue(mockSubmittedOrder)

    return request(app)
      .get('/order/123456789/contact-details')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Contact details')
      })
  })
})

describe('GET /order/:orderId/contact-details/edit', () => {
  it('should render editable contact details page', () => {
    auditService.logPageView.mockResolvedValue(null)
    orderService.getOrder.mockResolvedValue(mockDraftOrder)

    return request(app)
      .get('/order/123456789/contact-details/edit')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Contact details')
      })
  })
})
