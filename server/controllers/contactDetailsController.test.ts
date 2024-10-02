import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import AuditService from '../services/auditService'
import ContactDetailsController from './contactDetailsController'
import HmppsAuditClient from '../data/hmppsAuditClient'
import { OrderStatusEnum } from '../models/Order'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../data/hmppsAuditClient')

const mockId = uuidv4()

describe('ContactDetailsController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
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
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    contactDetailsController = new ContactDetailsController(mockAuditService)

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
          alias: null,
          gender: null,
          dateOfBirth: null,
        },
        deviceWearerContactDetails: {
          contactNumber: null,
        },
        additionalDocuments: [],
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

  describe('view contact details', () => {
    it('should render a view of the contact details', async () => {
      await contactDetailsController.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/contact-details',
        expect.objectContaining({
          contactDetails: {
            contactNumber: null,
          },
        }),
      )
    })
  })
})
