import type { Request, Response } from 'express'
import AuditService from '../services/auditService'
import OrderController from './orderController'
import OrderService from '../services/orderService'
import { Order } from '../data/inMemoryDatabase'

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
    isComplete: false,
  },
  contactDetails: {
    isComplete: false,
  },
}

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

  describe('summary', () => {
    it('should render a summary of the order', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      await orderController.summary(req, res, null)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/summary',
        expect.objectContaining({
          order: mockSubmittedOrder,
        }),
      )
    })
  })

  describe('confirmDelete', () => {
    it('should render a confirmation page for a draft order', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockDraftOrder)

      await orderController.confirmDelete(req, res, null)

      expect(res.render).toHaveBeenCalledWith('pages/order/delete-confirm', {
        order: mockDraftOrder,
      })
    })

    it('should redirect to a failed page for a submitted order', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      await orderController.confirmDelete(req, res, null)

      expect(res.redirect).toHaveBeenCalledWith(`/order/delete/failed`)
    })
  })

  describe('delete', () => {
    it('should delete the order and redirect to a success page for a draft order', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockDraftOrder)

      await orderController.delete(req, res, null)

      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith(mockDraftOrder.id)
      expect(res.redirect).toHaveBeenCalledWith('/order/delete/success')
    })

    it('should not delete the order and reditect to a failed page for a submitted order', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      await orderController.delete(req, res, null)

      expect(mockOrderService.deleteOrder).toHaveBeenCalledTimes(0)
      expect(res.redirect).toHaveBeenCalledWith('/order/delete/failed')
    })
  })

  describe('deleteFailed', () => {
    it('should render the failed view', async () => {
      await orderController.deleteFailed(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/order/delete-failed')
    })
  })

  describe('deleteSuccess', () => {
    it('should render the success view', async () => {
      await orderController.deleteSuccess(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/order/delete-success')
    })
  })
})
