import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import AuditService from '../services/auditService'
import DeviceWearerController from './deviceWearerController'
import DeviceWearerService from '../services/deviceWearerService'
import HmppsAuditClient from '../data/hmppsAuditClient'
import { OrderStatusEnum } from '../models/Order'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/deviceWearerService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

const mockId = uuidv4()

describe('DeviceWearerController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
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
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockDeviceWearerService = new DeviceWearerService() as jest.Mocked<DeviceWearerService>
    deviceWearerController = new DeviceWearerController(mockAuditService, mockDeviceWearerService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: mockId,
      },
      order: {
        id: mockId,
        status: OrderStatusEnum.Enum.IN_PROGRESS,
        deviceWearer: {
          firstName: null,
          lastName: null,
          preferredName: null,
          gender: null,
          dateOfBirth: null,
        },
        deviceWearerContactDetails: {
          contactNumber: null,
        },
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
        editable: false,
        orderId: mockId,
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
      await deviceWearerController.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/device-wearer/view',
        expect.objectContaining({
          deviceWearer: {
            firstName: null,
            lastName: null,
            preferredName: null,
            gender: null,
            dateOfBirth: null,
          },
        }),
      )
    })
  })
})
