import type { NextFunction, Request, Response } from 'express'
import AuditService from '../services/auditService'
import OrderSearchController from './orderSearchController'
import OrderSearchService from '../services/orderSearchService'
import HmppsAuditClient from '../data/hmppsAuditClient'

jest.mock('../services/auditService')
jest.mock('../services/orderSearchService')
jest.mock('../data/hmppsAuditClient')

describe('OrderSearchController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderSearchService>
  let orderController: OrderSearchController
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockOrderService = new OrderSearchService() as jest.Mocked<OrderSearchService>
    orderController = new OrderSearchController(mockAuditService, mockOrderService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: '123456789',
      },
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
    }
    // @ts-expect-error stubbing res.render
    res = {
      locals: {
        user: {
          username: 'fakeUserName',
          token: 'fakeUserToken',
          authSource: 'nomis',
          userId: 'fakeId',
          name: 'fake user',
          displayName: 'fuser',
          userRoles: ['fakeRole'],
          staffId: 123,
        },
      },
      redirect: jest.fn(),
      render: jest.fn(),
      set: jest.fn(),
      send: jest.fn(),
    }

    next = jest.fn()
  })

  describe('search orders', () => {
    it('should render a view containing order search results', async () => {
      mockOrderService.searchOrders.mockResolvedValue([
        {
          id: '123456789',
          status: 'Submitted',
          title: 'My new order',
          deviceWearer: {
            isComplete: true,
          },
          contactDetails: {
            isComplete: true,
          },
        },
      ])

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orderList: [
            {
              id: '123456789',
              status: 'Submitted',
              title: 'My new order',
              deviceWearer: {
                isComplete: true,
              },
              contactDetails: {
                isComplete: true,
              },
            },
          ],
        }),
      )
    })
  })
})