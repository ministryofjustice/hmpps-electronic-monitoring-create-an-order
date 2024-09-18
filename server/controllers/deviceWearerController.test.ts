import type { Request, Response } from 'express'
import AuditService from '../services/auditService'
import DeviceWearerController from './deviceWearerController'
import OrderService from '../services/orderService'
import DeviceWearerService from '../services/deviceWearerService'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/deviceWearerService')
describe('DeviceWearerController', () => {
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderService>
  let mockDeviceWearerService: jest.Mocked<DeviceWearerService>
  let deviceWearerController: DeviceWearerController
  let req: Request
  let res: Response

  beforeEach(() => {
    mockAuditService = new AuditService(null) as jest.Mocked<AuditService>
    mockOrderService = new OrderService() as jest.Mocked<OrderService>
    mockDeviceWearerService = new DeviceWearerService() as jest.Mocked<DeviceWearerService>
    deviceWearerController = new DeviceWearerController(mockAuditService, mockDeviceWearerService, mockOrderService)

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

  describe('view device wearer', () => {
    it('should render a view of the device wearer', async () => {
      mockOrderService.getOrder.mockResolvedValue({
        id: '123456789',
        status: 'Submitted',
        title: 'My new order',
        deviceWearer: {
          isComplete: true,
        },
        contactDetails: {
          isComplete: true,
        },
      })

      mockDeviceWearerService.getDeviceWearer.mockResolvedValue({
        orderId: '123456789',
        firstName: 'John',
        lastName: 'Smith',
        preferredName: '',
        gender: 'male',
      })

      await deviceWearerController.view(req, res, null)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/device-wearer/view',
        expect.objectContaining({
          deviceWearer: {
            orderId: '123456789',
            firstName: 'John',
            lastName: 'Smith',
            preferredName: '',
            gender: 'male',
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

      await deviceWearerController.view(req, res, null)

      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/device-wearer/edit')
    })
  })

  describe('edit device wearer', () => {
    it('should render an editable view of the device wearer', async () => {
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

      mockDeviceWearerService.getDeviceWearer.mockResolvedValue({
        orderId: '123456789',
        firstName: 'John',
        lastName: 'Smith',
        preferredName: '',
        gender: 'male',
      })

      await deviceWearerController.edit(req, res, null)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/device-wearer/edit',
        expect.objectContaining({
          deviceWearer: {
            orderId: '123456789',
            firstName: 'John',
            lastName: 'Smith',
            preferredName: '',
            gender: 'male',
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

      await deviceWearerController.edit(req, res, null)

      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/device-wearer')
    })
  })
})
