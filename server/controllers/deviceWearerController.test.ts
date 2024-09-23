import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import AuditService from '../services/auditService'
import DeviceWearerController from './deviceWearerController'
import OrderService from '../services/orderService'
import DeviceWearerService from '../services/deviceWearerService'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { Order } from '../models/Order'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/deviceWearerService')
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

describe('DeviceWearerController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderService>
  let mockDeviceWearerService: jest.Mocked<DeviceWearerService>
  let deviceWearerController: DeviceWearerController
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
    mockDeviceWearerService = new DeviceWearerService() as jest.Mocked<DeviceWearerService>
    deviceWearerController = new DeviceWearerController(mockAuditService, mockDeviceWearerService, mockOrderService)

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

  describe('view device wearer', () => {
    it('should render a view of the device wearer', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      mockDeviceWearerService.getDeviceWearer.mockResolvedValue({
        orderId: mockId,
        firstName: 'John',
        lastName: 'Smith',
        preferredName: '',
        gender: 'male',
      })

      await deviceWearerController.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/device-wearer/view',
        expect.objectContaining({
          deviceWearer: {
            orderId: mockId,
            firstName: 'John',
            lastName: 'Smith',
            preferredName: '',
            gender: 'male',
          },
        }),
      )
    })

    it('should redirect to the edit page if the order is in the draft state', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockDraftOrder)

      await deviceWearerController.view(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockDraftOrder.id}/device-wearer/edit`)
    })
  })

  describe('edit device wearer', () => {
    it('should render an editable view of the device wearer', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockDraftOrder)

      mockDeviceWearerService.getDeviceWearer.mockResolvedValue({
        orderId: mockId,
        firstName: 'John',
        lastName: 'Smith',
        preferredName: '',
        gender: 'male',
      })

      await deviceWearerController.edit(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/device-wearer/edit',
        expect.objectContaining({
          deviceWearer: {
            orderId: mockId,
            firstName: 'John',
            lastName: 'Smith',
            preferredName: '',
            gender: 'male',
          },
        }),
      )
    })

    it('should redirect to the view page if the order is in the submitted state', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockSubmittedOrder)

      await deviceWearerController.edit(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockSubmittedOrder.id}/device-wearer`)
    })
  })
})
