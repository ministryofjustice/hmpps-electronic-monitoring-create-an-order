import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import DeviceWearerService from '../../services/deviceWearerService'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import NoFixedAbodeController from './noFixedAbodeController'

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
      firstName: null,
      lastName: null,
      alias: null,
      dateOfBirth: null,
      adultAtTimeOfInstallation: null,
      sex: null,
      gender: null,
      disabilities: [],
      noFixedAbode,
    },
  })

describe('NoFixedAbodeController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockDeviceWearerService: jest.Mocked<DeviceWearerService>
  let controller: NoFixedAbodeController

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
    controller = new NoFixedAbodeController(mockAuditService, mockDeviceWearerService)
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
      await controller.get(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'null',
        errors: {},
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
      await controller.get(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'true',
        errors: {},
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
      await controller.get(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'false',
        errors: {},
      })
    })

    it('should render the fixed-abode view with errors if neither option was selected on form submission', async () => {
      // Given
      const req = createMockRequest({
        order: createMockOrder(null),
        flash: jest
          .fn()
          .mockReturnValueOnce([
            { error: 'You must indicate whether the device wearer has a fixed abode', field: 'fixedAbode' },
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
      await controller.get(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/no-fixed-abode', {
        noFixedAbode: 'null',
        errors: {
          fixedAbode: {
            text: 'You must indicate whether the device wearer has a fixed abode',
          },
        },
      })
    })
  })

  describe('post', () => {
    it('should redirect to the primary address page if the user selects "yes"', async () => {
      // Given
      const req = createMockRequest({
        body: {
          action: 'continue',
          noFixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: false,
      })

      // When
      await controller.post(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/addresses/primary')
    })

    it('should redirect to the notifying organisation form if the user selects "no"', async () => {
      // Given
      const req = createMockRequest({
        body: {
          action: 'continue',
          noFixedAbode: 'true',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: true,
      })

      // When
      await controller.post(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/notifying-organisation')
    })

    it('should redirect to the summary page if the user selects back', async () => {
      const req = createMockRequest({
        body: {
          action: 'back',
          noFixedAbode: 'false',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue({
        nomisId: null,
        pncId: null,
        deliusId: null,
        prisonNumber: null,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultAtTimeOfInstallation: null,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: false,
      })

      // When
      await controller.post(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
    })

    it('should redirect to the form if the user doesnt select an option', async () => {
      const req = createMockRequest({
        body: {
          action: 'continue',
        },
        flash: jest.fn(),
        params: {
          orderId: '123456789',
        },
      })
      const res = createMockResponse()
      const next = jest.fn()
      mockDeviceWearerService.updateNoFixedAbode.mockResolvedValue([
        { error: 'You must indicate whether the device wearer has a fixed abode', field: 'noFixedAbode' },
      ])

      // When
      await controller.post(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'You must indicate whether the device wearer has a fixed abode', field: 'noFixedAbode' },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/contact-information/no-fixed-abode')
    })
  })
})