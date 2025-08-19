import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import DeviceWearerService from '../../services/deviceWearerService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import NoFixedAbodeController from './noFixedAbodeController'
import TaskListService from '../../services/taskListService'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/deviceWearerService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const createMockOrder = (noFixedAbode: boolean | null) =>
  getMockOrder({
    deviceWearer: {
      nomisId: null,
      pncId: null,
      deliusId: null,
      prisonNumber: null,
      homeOfficeReferenceNumber: null,
      firstName: null,
      lastName: null,
      alias: null,
      dateOfBirth: null,
      adultAtTimeOfInstallation: null,
      sex: null,
      gender: null,
      disabilities: [],
      noFixedAbode,
      interpreterRequired: null,
    },
  })

describe('NoFixedAbodeController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockDeviceWearerService: jest.Mocked<DeviceWearerService>
  let controller: NoFixedAbodeController
  const taskListService = {
    getNextCheckYourAnswersPage: jest.fn(),
    getNextPage: jest.fn(),
  } as unknown as jest.Mocked<TaskListService>

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
    controller = new NoFixedAbodeController(mockAuditService, mockDeviceWearerService, taskListService)
  })

  describe('get', () => {
    it('should render the no-fixed-abode view with neither option selected', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        errorSummary: null,
        noFixedAbode: {
          value: 'null',
        },
      })
    })

    it('should render the fixed-abode view with the "yes" option selected', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(true),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        errorSummary: null,
        noFixedAbode: {
          value: 'true',
        },
      })
    })

    it('should render the fixed-abode view with the "no" option selected', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(false),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        errorSummary: null,
        noFixedAbode: {
          value: 'false',
        },
      })
    })

    it('should render the fixed-abode view with errors if neither option was selected on form submission', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
        flash: jest
          .fn()
          .mockReturnValueOnce([
            { error: 'You must indicate whether the device wearer has a fixed abode', field: 'noFixedAbode' },
          ])
          .mockReturnValue([
            {
              noFixedAbode: 'null',
            },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        errorSummary: {
          titleText: 'There is a problem',
          errorList: [
            {
              href: '#noFixedAbode',
              text: 'You must indicate whether the device wearer has a fixed abode',
            },
          ],
        },
        noFixedAbode: {
          error: {
            text: 'You must indicate whether the device wearer has a fixed abode',
          },
          value: 'null',
        },
      })
    })
  })

  describe('post', () => {
    it('should redirect to the primary address page if the user selects "yes"', async () => {
      // Given
      const order = createMockOrder(null)
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          noFixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: order.id,
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        homeOfficeReferenceNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: false,
        interpreterRequired: null,
      })
      taskListService.getNextPage = jest
        .fn()
        .mockReturnValue(`/order/${order.id}/contact-information/addresses/primary`)
      // When
      await controller.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/contact-information/addresses/primary`)
    })

    it('should redirect to the notifying organisation form if the user selects "no"', async () => {
      // Given
      const order = createMockOrder(null)
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          noFixedAbode: 'true',
        },
        flash: jest.fn(),
        params: {
          orderId: order.id,
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        homeOfficeReferenceNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: true,
        interpreterRequired: null,
      })
      taskListService.getNextPage = jest
        .fn()
        .mockReturnValue(`/order/${order.id}/contact-information/interested-parties`)

      // When
      await controller.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/contact-information/interested-parties`)
    })

    it('should redirect to the summary page if the user selects back', async () => {
      const order = createMockOrder(null)
      const req = createMockRequest({
        order,
        body: {
          action: 'back',
          noFixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: order.id,
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        homeOfficeReferenceNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: false,
        interpreterRequired: null,
      })

      // When
      await controller.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
    })

    it('should redirect to the form if the user doesnt select an option', async () => {
      const order = createMockOrder(null)
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
        },
        flash: jest.fn(),
        params: {
          orderId: order.id,
        },
      })
      const res = createMockResponse()
      const next = jest.fn()
      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue([
        { error: 'You must indicate whether the device wearer has a fixed abode', field: 'noFixedAbode' },
      ])

      // When
      await controller.update(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'You must indicate whether the device wearer has a fixed abode', field: 'noFixedAbode' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/contact-information/no-fixed-abode`)
    })
  })
})
