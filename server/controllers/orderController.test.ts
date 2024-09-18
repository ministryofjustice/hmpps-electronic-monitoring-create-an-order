import type { Request, Response } from 'express'
import AuditService from '../services/auditService'
import OrderController from './orderController'
import OrderService from '../services/orderService'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
describe('OrderController', () => {
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderService>
  let orderController: OrderController
  let req: Request
  let res: Response

  beforeEach(() => {
    mockAuditService = new AuditService(null) as jest.Mocked<AuditService>
    mockOrderService = new OrderService() as jest.Mocked<OrderService>
    orderController = new OrderController(mockAuditService, mockOrderService)

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
  })

  describe('order summary', () => {
    it('should render a summary of the order', async () => {
      mockOrderService.getOrder.mockResolvedValue(
        Promise.resolve({
          id: '123456789',
          status: 'Submitted',
          title: 'My new order',
          deviceWearer: {
            isComplete: true,
          },
          contactDetails: {
            isComplete: true,
          },
        }),
      )

      await orderController.summary(req, res, null)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/summary',
        expect.objectContaining({
          order: {
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
        }),
      )
    })
  })
})
