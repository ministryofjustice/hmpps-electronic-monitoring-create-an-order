import AuditService from '../../services/auditService'
import DeviceWearerResponsibleAdultService from '../../services/deviceWearerResponsibleAdultService'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import DeviceWearerResponsibleAdultController from './deviceWearerResponsibleAdultController'
import RestClient from '../../data/restClient'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import TaskListService from '../../services/taskListService'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/deviceWearerResponsibleAdultService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const createMockOrder = (name: string) =>
  getMockOrder({
    deviceWearerResponsibleAdult: {
      relationship: 'parent',
      otherRelationshipDetails: null,
      fullName: name,
      contactNumber: '01234567890',
    },
  })

describe('DeviceWearerResponsibleAdultController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockDeviceWearerResponsibleAdultService: jest.Mocked<DeviceWearerResponsibleAdultService>
  let deviceWearerResponsibleAdultController: DeviceWearerResponsibleAdultController
  const taskListService = new TaskListService()

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
      taskListService,
    )
  })

  describe('view', () => {
    it('should render the form using the saved responsible adult data', async () => {
      // Given
      const mockOrder = createMockOrder('Parent Name')
      const req = createMockRequest({
        order: mockOrder,
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

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
      const mockOrder = createMockOrder('')
      const req = createMockRequest({
        order: mockOrder,
        flash: jest
          .fn()
          .mockReturnValueOnce([{ error: 'Full name is required', field: 'fullName' }])
          .mockReturnValueOnce([
            {
              relationship: 'parent',
              fullName: '',
              contactNumber: '01234567890',
            },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

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
      const order = createMockOrder('Parent Name')
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          relationship: 'parent',
          otherRelationshipDetails: '',
          fullName: '',
          contactNumber: '01234567890',
        },
        params: {
          orderId: order.id,
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()
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
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/about-the-device-wearer/responsible-adult`)
    })

    it('should save and redirect to the device wearer check your answers page', async () => {
      // Given
      const order = createMockOrder('Parent Name')
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          relationship: 'parent',
          otherRelationshipDetails: '',
          fullName: 'Parent Name',
          contactNumber: '01234567890',
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()
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
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/about-the-device-wearer/identity-numbers`)
    })
  })

  it('should save and redirect to the order summary page if the user chooses', async () => {
    // Given
    const order = createMockOrder('Parent Name')
    const req = createMockRequest({
      order,
      body: {
        action: 'back',
        relationship: 'parent',
        otherRelationshipDetails: '',
        fullName: 'Parent Name',
        contactNumber: '01234567890',
      },
      params: {
        orderId: order.id,
      },
      flash: jest.fn(),
    })
    const res = createMockResponse()
    const next = jest.fn()
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
    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
  })
})
