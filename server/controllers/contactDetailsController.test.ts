import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import AuditService from '../services/auditService'
import ContactDetailsController from './contactDetailsController'
import OrderService from '../services/orderService'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { Order } from '../models/Order'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

const mockId = uuidv4()

const mockSubmittedOrder: Order = {
  id: mockId,
  status: 'SUBMITTED',
}

const mockDraftOrder: Order = {
  id: mockId,
  status: 'IN_PROGRESS',
}

describe('ContactDetailsController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderService>
  let contactDetailsController: ContactDetailsController
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
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockOrderService = new OrderService(mockRestClient) as jest.Mocked<OrderService>
    contactDetailsController = new ContactDetailsController(mockAuditService, mockOrderService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: mockId,
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

  describe('view contact details', () => {
    it('should render a view of the contact details', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      await contactDetailsController.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-details/view',
        expect.objectContaining({
          contactDetails: {
            orderId: mockSubmittedOrder.id,
          },
        }),
      )
    })

    it('should redirect to the edit page if the order is in the draft state', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockDraftOrder)

      await contactDetailsController.view(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockDraftOrder.id}/contact-details/edit`)
    })
  })

  describe('edit contact details', () => {
    it('should render an editable view of the contact details', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockDraftOrder)

      await contactDetailsController.edit(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/contact-details/edit',
        expect.objectContaining({
          contactDetails: {
            orderId: mockDraftOrder.id,
          },
        }),
      )
    })

    it('should redirect to the view page if the order is in the submitted state', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      await contactDetailsController.edit(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockSubmittedOrder.id}/contact-details`)
    })
  })
})
