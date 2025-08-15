import AuditService from '../../services/auditService'
import AlcoholMonitoringService from '../../services/alcoholMonitoringService'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import AlcoholMonitoringController from './alcoholMonitoringController'
import RestClient from '../../data/restClient'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import TaskListService from '../../services/taskListService'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/alcoholMonitoringService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const createMockOrder = (startDate: string | null = null) =>
  getMockOrder({
    monitoringConditionsAlcohol: {
      monitoringType: 'ALCOHOL_ABSTINENCE',
      startDate,
      endDate: '2027-02-15',
    },
  })

describe('AlcoholMonitoringController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockAlcoholMonitoringService: jest.Mocked<AlcoholMonitoringService>
  let alcoholMonitoringController: AlcoholMonitoringController
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
    mockAlcoholMonitoringService = new AlcoholMonitoringService(mockRestClient) as jest.Mocked<AlcoholMonitoringService>
    alcoholMonitoringController = new AlcoholMonitoringController(
      mockAuditService,
      mockAlcoholMonitoringService,
      taskListService,
    )
  })

  describe('view', () => {
    it('should render the form using the saved alcohol monitoring and address data', async () => {
      // Given
      const mockOrder = createMockOrder('2026-02-15')
      const req = createMockRequest({ order: mockOrder })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn().mockReturnValue([])

      // When
      await alcoholMonitoringController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/alcohol-monitoring',
        expect.objectContaining({
          monitoringType: { value: 'ALCOHOL_ABSTINENCE' },
          startDate: { value: { day: '15', month: '02', year: '2026', hours: '00', minutes: '00' } },
          endDate: { value: { day: '15', month: '02', year: '2027', hours: '00', minutes: '00' } },
        }),
      )
    })

    it('should render the form using submitted data when there are validation errors', async () => {
      // Given
      const mockOrder = createMockOrder()
      const req = createMockRequest({ order: mockOrder })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest
        .fn()
        .mockReturnValueOnce([{ error: 'Start date is required', field: 'startDate' }])
        .mockReturnValueOnce([
          {
            monitoringType: 'ALCOHOL_ABSTINENCE',
            startDate: {
              day: '',
              month: '',
              year: '',
              hours: '00',
              minutes: '00',
            },
            endDate: {
              day: '30',
              month: '12',
              year: '2027',
              hours: '00',
              minutes: '00',
            },
            primaryAddressView: '1 Mock Street, Mock City, Mock Postcode',
            secondaryAddressView: '',
            tertiaryAddressView: '',
            installationAddressView: '',
          },
        ])

      // When
      await alcoholMonitoringController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/alcohol-monitoring',
        expect.objectContaining({
          monitoringType: { value: 'ALCOHOL_ABSTINENCE' },
          startDate: {
            value: { day: '', month: '', year: '', hours: '00', minutes: '00' },
            error: { text: 'Start date is required' },
          },
          endDate: { value: { day: '30', month: '12', year: '2027', hours: '00', minutes: '00' }, error: undefined },
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
        monitoringType: '',
        startDate: {
          day: '30',
          month: '12',
          year: '2026',
          hours: '00',
          minutes: '00',
        },
        endDate: {
          day: '30',
          month: '12',
          year: '2027',
          hours: '00',
          minutes: '00',
        },
      }
      mockAlcoholMonitoringService.update.mockResolvedValue([
        { error: 'Monitoring type is required', field: 'monitoringType' },
      ])

      // When
      await alcoholMonitoringController.update(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', {
        action: 'continue',
        monitoringType: '',
        startDate: {
          day: '30',
          month: '12',
          year: '2026',
          hours: '00',
          minutes: '00',
        },
        endDate: {
          day: '30',
          month: '12',
          year: '2027',
          hours: '00',
          minutes: '00',
        },
      })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        {
          error: 'Monitoring type is required',
          field: 'monitoringType',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith('/order/123456789/monitoring-conditions/alcohol')
    })

    it('should save and redirect to the next page if user chooses page', async () => {
      // Given
      const mockOrder = createMockOrder()
      const req = createMockRequest({ order: mockOrder, params: { orderId: '123456789' } })
      const res = createMockResponse()
      const next = jest.fn()
      req.flash = jest.fn()
      req.body = {
        action: 'continue',
        monitoringType: 'ALCOHOL_ABSTINENCE',
        startDate: {
          day: '30',
          month: '12',
          year: '2026',
          hours: '00',
          minutes: '00',
        },
        endDate: {
          day: '30',
          month: '12',
          year: '2027',
          hours: '00',
          minutes: '00',
        },
      }
      mockAlcoholMonitoringService.update.mockResolvedValue({
        monitoringType: 'ALCOHOL_ABSTINENCE',
        startDate: '2026-12-30',
        endDate: '2027-12-30',
      })

      // When
      await alcoholMonitoringController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/monitoring-conditions/check-your-answers`)
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
      monitoringType: 'ALCOHOL_ABSTINENCE',
      startDate: {
        day: '30',
        month: '12',
        year: '2026',
        hours: '00',
        minutes: '00',
      },
      endDate: {
        day: '30',
        month: '12',
        year: '2027',
        hours: '00',
        minutes: '00',
      },
    }
    mockAlcoholMonitoringService.update.mockResolvedValue({
      monitoringType: 'ALCOHOL_ABSTINENCE',
      startDate: '2026-12-30',
      endDate: '2027-12-30',
    })

    // When
    await alcoholMonitoringController.update(req, res, next)

    // Then
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('/order/123456789/summary')
  })
})
