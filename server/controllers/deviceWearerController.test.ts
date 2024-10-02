import type { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import AuditService from '../services/auditService'
import DeviceWearerController from './deviceWearerController'
import DeviceWearerService from '../services/deviceWearerService'
import HmppsAuditClient from '../data/hmppsAuditClient'
import { Order, OrderStatus, OrderStatusEnum } from '../models/Order'
import RestClient from '../data/restClient'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/deviceWearerService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

const createMockRequest = (order?: Order): Request => {
  return {
    // @ts-expect-error stubbing session
    session: {},
    query: {},
    params: {
      orderId: '123456789',
    },
    user: {
      username: '',
      token: '',
      authSource: '',
    },
    order,
  }
}

const createMockResponse = (): Response => {
  // @ts-expect-error stubbing res.render
  return {
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
}

const createMockOrder = (status: OrderStatus): Order => {
  return {
    id: uuidv4(),
    status,
    deviceWearer: {
      firstName: 'tester',
      lastName: 'testington',
      alias: 'test',
      gender: 'male',
      dateOfBirth: '1980-01-01T00:00:00.000Z',
    },
    deviceWearerContactDetails: {
      contactNumber: null,
    },
    additionalDocuments: [],
  }
}

describe('DeviceWearerController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockDeviceWearerService: jest.Mocked<DeviceWearerService>
  let deviceWearerController: DeviceWearerController

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
    mockDeviceWearerService = new DeviceWearerService(mockRestClient) as jest.Mocked<DeviceWearerService>
    deviceWearerController = new DeviceWearerController(mockAuditService, mockDeviceWearerService)

    jest.useFakeTimers()
    jest.setSystemTime(new Date('2020-01-01'))
  })

  describe('view', () => {
    it('should render the form using the saved device wearer data', async () => {
      // Given
      const mockOrder = createMockOrder(OrderStatusEnum.Enum.IN_PROGRESS)
      const req = createMockRequest(mockOrder)
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await deviceWearerController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/device-wearer',
        expect.objectContaining({
          firstName: { value: 'tester' },
          lastName: { value: 'testington' },
          alias: { value: 'test' },
          gender: { value: 'male' },
          dateOfBirth_day: { value: '1' },
          dateOfBirth_month: { value: '1' },
          dateOfBirth_year: { value: '1980' },
        }),
      )
    })

    it('should render the form using submitted data when there are validation errors', async () => {
      // Given
      const mockOrder = createMockOrder(OrderStatusEnum.Enum.IN_PROGRESS)
      const req = createMockRequest(mockOrder)
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest
        .fn()
        .mockReturnValueOnce([{ error: 'Date of birth must be in the past', field: 'dateOfBirth' }])
        .mockReturnValueOnce([
          {
            firstName: 'new',
            lastName: 'name',
            alias: 'new',
            gender: 'female',
            'dateOfBirth-day': '02',
            'dateOfBirth-month': '03',
            'dateOfBirth-year': '1990',
          },
        ])

      // When
      await deviceWearerController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/device-wearer',
        expect.objectContaining({
          firstName: { value: 'new' },
          lastName: { value: 'name' },
          alias: { value: 'new' },
          gender: { value: 'female' },
          dateOfBirth_day: { value: '02' },
          dateOfBirth_month: { value: '03' },
          dateOfBirth_year: { value: '1990' },
          dateOfBirth: { value: '', error: { text: 'Date of birth must be in the past' } },
        }),
      )
    })
  })

  describe('update', () => {
    it('should persist data and redirect to the form when the user submits invalid values', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'continue',
        firstName: 'f',
        lastName: 'l',
        alias: 'a',
        gender: 'male',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1970',
      }
      mockDeviceWearerService.updateDeviceWearer.mockResolvedValue([
        { error: 'Date of birth must be in the past', field: 'dateOfBirth' },
      ])

      // When
      await deviceWearerController.update(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', {
        firstName: 'f',
        lastName: 'l',
        alias: 'a',
        gender: 'male',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1970',
      })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        {
          error: 'Date of birth must be in the past',
          field: 'dateOfBirth',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/about-the-device-wearer')
    })

    it('should save and redirect to the contact details page if the device wearer is over 18', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'continue',
        firstName: 'f',
        lastName: 'l',
        alias: 'a',
        gender: 'male',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1970',
      }
      mockDeviceWearerService.updateDeviceWearer.mockResolvedValue({
        firstName: 'tester',
        lastName: 'testington',
        alias: 'test',
        gender: 'male',
        dateOfBirth: '1980-01-01T00:00:00.000Z',
      })

      // When
      await deviceWearerController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/about-the-device-wearer/contact-details')
    })

    it('should save and redirect to the responsible adult page if the device wearer is under 18', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'continue',
        firstName: 'f',
        lastName: 'l',
        alias: 'a',
        gender: 'male',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1970',
      }
      mockDeviceWearerService.updateDeviceWearer.mockResolvedValue({
        firstName: 'tester',
        lastName: 'testington',
        alias: 'test',
        gender: 'male',
        dateOfBirth: '2005-01-01T00:00:00.000Z',
      })

      // When
      await deviceWearerController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/about-the-device-wearer/responsible-adult')
    })

    it('should save and redirect to the order summary page if the user chooses', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'back',
        firstName: 'f',
        lastName: 'l',
        alias: 'a',
        gender: 'male',
        'dateOfBirth-day': '1',
        'dateOfBirth-month': '1',
        'dateOfBirth-year': '1970',
      }
      mockDeviceWearerService.updateDeviceWearer.mockResolvedValue({
        firstName: 'tester',
        lastName: 'testington',
        alias: 'test',
        gender: 'male',
        dateOfBirth: '2001-01-01T00:00:00.000Z',
      })

      // When
      await deviceWearerController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
    })
  })
})
