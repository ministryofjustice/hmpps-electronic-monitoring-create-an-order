import { Request, Response, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../store/inMemoryStore'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import MonitoringDatesController from './controller'
import { validationErrors } from '../../../constants/validationErrors'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'
import RestClient from '../../../data/restClient'

jest.mock('../monitoringConditionsStoreService')
jest.mock('./viewModel')

describe('MonitoringDatesController', () => {
  let mockDataStore: InMemoryStore
  let mockStore: jest.Mocked<MonitoringConditionsStoreService>
  let mockService: jest.Mocked<MonitoringConditionsUpdateService>
  let controller: MonitoringDatesController
  let mockRestClient: jest.Mocked<RestClient>
  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()
    mockDataStore = new InMemoryStore()
    mockStore = new MonitoringConditionsStoreService(mockDataStore) as jest.Mocked<MonitoringConditionsStoreService>
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockService = new MonitoringConditionsUpdateService(
      mockRestClient,
    ) as jest.Mocked<MonitoringConditionsUpdateService>
    mockStore.getMonitoringConditions.mockResolvedValue({})
    controller = new MonitoringDatesController(mockStore, mockService)

    mockConstructModel.mockReturnValue({
      startDate: { value: { day: '', month: '', year: '', hours: '', minutes: '' } },
      endDate: { value: { day: '', month: '', year: '', hours: '', minutes: '' } },
      errors: {},
      errorSummary: null,
    })

    req = createMockRequest()
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('renders the correct view', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/monitoring-dates',
        expect.anything(),
      )
    })

    it('render with the model', async () => {
      const monitoringConditions = { startDate: '2025-01-01T00:00:00.000Z' }
      mockStore.getMonitoringConditions.mockResolvedValue(monitoringConditions)

      const expectedModel = {
        startDate: { value: { day: '01', month: '01', year: '2025', hours: '00', minutes: '00' } },
        endDate: { value: { day: '', month: '', year: '', hours: '', minutes: '' } },
        errors: {},
        errorSummary: null,
      }
      mockConstructModel.mockReturnValueOnce(expectedModel)

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expect.anything(), expectedModel)
    })
  })

  describe('update', () => {
    const now = new Date(Date.now())
    const validFormData = {
      action: 'continue',
      startDate: { day: '01', month: '01', year: '2025', hours: '00', minutes: '00' },
      endDate: { day: '01', month: '02', year: (now.getFullYear() + 1).toString(), hours: '00', minutes: '00' },
    }

    it('redirects to the next page', async () => {
      req.body = validFormData
      await controller.update(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', req.order!.id),
      )
    })

    it('validates', async () => {
      req.body = {
        action: 'continue',
        startDate: { day: '', month: '', year: '', hours: '', minutes: '' },
        endDate: { day: '', month: '', year: '', hours: '', minutes: '' },
      }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith(
        'validationErrors',
        expect.arrayContaining([
          expect.objectContaining({
            error: validationErrors.monitoringConditions.startDateTime.date.required,
          }),
        ]),
      )

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_DATES.replace(':orderId', req.order!.id),
      )
    })

    it('updates store', async () => {
      req.body = validFormData
      await controller.update(req, res, next)

      const expectedStartDate = new Date(2025, 0, 1, 0, 0).toISOString()
      const expectedEndDate = new Date(now.getFullYear() + 1, 1, 1, 0, 0).toISOString()

      expect(mockStore.updateMonitoringDates).toHaveBeenCalledWith(
        req.order!,
        expect.objectContaining({
          startDate: expectedStartDate,
          endDate: expectedEndDate,
        }),
      )
    })
  })
})
