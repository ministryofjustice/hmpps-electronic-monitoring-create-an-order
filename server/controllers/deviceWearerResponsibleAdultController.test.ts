import AuditService from '../services/auditService'
import DeviceWearerResponsibleAdultService from '../services/deviceWearerResponsibleAdultService'
import HmppsAuditClient from '../data/hmppsAuditClient'
import { OrderStatusEnum } from '../models/Order'
import DeviceWearerResponsibleAdultController from './deviceWearerResponsibleAdultController'
import RestClient from '../data/restClient'
import { createMockOrder, createMockRequest, createMockResponse } from './testutils/utils'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/deviceWearerResponsibleAdultService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

describe('DeviceWearerController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockDeviceWearerResponsibleAdultService: jest.Mocked<DeviceWearerResponsibleAdultService>
  let deviceWearerResponsibleAdultController: DeviceWearerResponsibleAdultController

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
    mockDeviceWearerResponsibleAdultService = new DeviceWearerResponsibleAdultService(
      mockRestClient,
    ) as jest.Mocked<DeviceWearerResponsibleAdultService>
    deviceWearerResponsibleAdultController = new DeviceWearerResponsibleAdultController(
      mockAuditService,
      mockDeviceWearerResponsibleAdultService,
    )
  })

  describe('view', () => {
    it('should render the form using the saved responsible adult data', async () => {
      // Given
      const mockOrder = createMockOrder(OrderStatusEnum.Enum.IN_PROGRESS)
      const req = createMockRequest(mockOrder)
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await deviceWearerResponsibleAdultController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/responsible-adult-details',
        expect.objectContaining({
          relationship: { value: 'parent' },
          fullName: { value: 'Parent Name' },
          contactNumber: { value: '01234567890' },
        }),
      )
    })

    it('should render the form using submitted data when there are validation errors', async () => {
      // Given
      const mockOrder = createMockOrder(OrderStatusEnum.Enum.IN_PROGRESS)
      mockOrder.deviceWearerResponsibleAdult!.fullName = ''
      const req = createMockRequest(mockOrder)
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest
        .fn()
        .mockReturnValueOnce([{ error: 'Full name is required', field: 'fullName' }])
        .mockReturnValueOnce([
          {
            relationship: 'parent',
            fullName: '',
            contactNumber: '01234567890',
          },
        ])

      // When
      await deviceWearerResponsibleAdultController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/responsible-adult-details',
        expect.objectContaining({
          relationship: { value: 'parent' },
          fullName: { value: '', error: { text: 'Full name is required' } },
          contactNumber: { value: '01234567890' },
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
        relationship: 'parent',
        otherRelationshipDetails: '',
        fullName: '',
        contactNumber: '01234567890',
      }
      mockDeviceWearerResponsibleAdultService.updateDeviceWearerResponsibleAdult.mockResolvedValue([
        { error: 'Full name is required', field: 'fullName' },
      ])

      // When
      await deviceWearerResponsibleAdultController.update(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', {
        relationship: 'parent',
        fullName: '',
        otherRelationshipDetails: '',
        contactNumber: '01234567890',
      })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        {
          error: 'Full name is required',
          field: 'fullName',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/about-the-device-wearer/responsible-adult')
    })

    it('should save and redirect to the contact details page', async () => {
      // Given
      const req = createMockRequest()
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'continue',
        relationship: 'parent',
        otherRelationshipDetails: '',
        fullName: 'Parent Name',
        contactNumber: '01234567890',
      }
      mockDeviceWearerResponsibleAdultService.updateDeviceWearerResponsibleAdult.mockResolvedValue({
        relationship: 'parent',
        otherRelationshipDetails: '',
        fullName: 'Parent Name',
        contactNumber: '01234567890',
      })

      // When
      await deviceWearerResponsibleAdultController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/contact-details')
    })
  })

  it('should save and redirect to the order summary page if the user chooses', async () => {
    // Given
    const req = createMockRequest()
    const res = createMockResponse()
    const next = jest.fn()
    req.flash = jest.fn()
    req.body = {
      action: 'back',
      relationship: 'parent',
      otherRelationshipDetails: '',
      fullName: 'Parent Name',
      contactNumber: '01234567890',
    }
    mockDeviceWearerResponsibleAdultService.updateDeviceWearerResponsibleAdult.mockResolvedValue({
      relationship: 'parent',
      otherRelationshipDetails: '',
      fullName: 'Parent Name',
      contactNumber: '01234567890',
    })

    // When
    await deviceWearerResponsibleAdultController.update(req, res, next)

    // Then
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
  })
})
