import type { Request, Response } from 'express'
import AuditService from '../services/auditService'
import ContactDetailsController from './contactDetailsController'
import OrderService from '../services/orderService'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
describe('ContactDetailsController', () => {
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderService>
  let contactDetailsController: ContactDetailsController
  let req: Request
  let res: Response

  beforeEach(() => {
    mockAuditService = new AuditService(null) as jest.Mocked<AuditService>
    mockOrderService = new OrderService() as jest.Mocked<OrderService>
    contactDetailsController = new ContactDetailsController(mockAuditService, mockOrderService)

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

  describe('view contact details', () => {
    it('should render a view of the contact details', async () => {
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

      await contactDetailsController.view(req, res, null)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-details/view',
        expect.objectContaining({
          contactDetails: {
            orderId: '123456789',
          },
        }),
      )
    })

    it('should redirect to the edit page if the order is in the draft state', async () => {
      mockOrderService.getOrder.mockResolvedValue(
        Promise.resolve({
          id: '123456789',
          status: 'Draft',
          title: 'My new order',
          deviceWearer: {
            isComplete: false,
          },
          contactDetails: {
            isComplete: false,
          },
        }),
      )

      await contactDetailsController.view(req, res, null)

      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-details/edit')
    })
  })

  describe('edit contact details', () => {
    it('should render an editable view of the contact details', async () => {
      mockOrderService.getOrder.mockResolvedValue(
        Promise.resolve({
          id: '123456789',
          status: 'Draft',
          title: 'My new order',
          deviceWearer: {
            isComplete: false,
          },
          contactDetails: {
            isComplete: false,
          },
        }),
      )

      await contactDetailsController.edit(req, res, null)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-details/edit',
        expect.objectContaining({
          contactDetails: {
            orderId: '123456789',
          },
        }),
      )
    })

    it('should redirect to the view page if the order is in the submitted state', async () => {
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

      await contactDetailsController.edit(req, res, null)

      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-details')
    })
  })
})
