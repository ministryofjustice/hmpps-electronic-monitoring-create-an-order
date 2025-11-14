import { Response, Request, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../../test/mocks/mockExpress'
import MonitoringTypesController from './controller'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../store/inMemoryStore'
import constructModel from './viewModel'
import paths from '../../../../constants/paths'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'
import TaskListService from '../../../../services/taskListService'
import RestClient from '../../../../data/restClient'

jest.mock('../monitoringConditionsStoreService')
jest.mock('../monitoringConditionsService')
jest.mock('./viewModel')

describe('prarr controller', () => {
  let mockDataStore: InMemoryStore
  let mockStore: jest.Mocked<MonitoringConditionsStoreService>
  let mockService: jest.Mocked<MonitoringConditionsUpdateService>
  const mockTaskListService = {
    getNextCheckYourAnswersPage: jest.fn(),
    getNextPage: jest.fn(),
  } as unknown as jest.Mocked<TaskListService>
  let controller: MonitoringTypesController
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

    controller = new MonitoringTypesController(mockStore, mockService, mockTaskListService)

    mockConstructModel.mockReturnValue({ errorSummary: null })

    req = createMockRequest()
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('renders the correct view', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/monitoring-types',
        expect.anything(),
      )
    })

    it('render with the model', async () => {
      mockStore.getMonitoringConditions.mockResolvedValue({ prarr: 'YES' })
      mockConstructModel.mockReturnValueOnce({ errorSummary: null, curfew: { value: true } })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        errorSummary: null,
        curfew: { value: true },
      })
    })
  })

  describe('update', () => {
    it('redirects to the next page', async () => {
      req.body = {
        action: 'continue',
        monitoringTypes: ['curfew'],
      }
      mockTaskListService.getNextPage = jest
        .fn()
        .mockReturnValue(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', req.order!.id))
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', req.order!.id),
      )
    })
    it('validates', async () => {
      req.body = {
        action: 'continue',
      }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'Select monitoring required', field: 'monitoringTypes' },
      ])
    })
    it('updates store', async () => {
      req.body = {
        action: 'continue',
        monitoringTypes: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol'],
      }
      await controller.update(req, res, next)

      expect(mockStore.updateMonitoringType).toHaveBeenCalledWith(req.order!, {
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
      })
    })
    it('update backend', async () => {
      req.body = {
        action: 'continue',
        monitoringTypes: ['trail'],
      }
      mockStore.getMonitoringConditions.mockResolvedValue({
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
      })

      await controller.update(req, res, next)

      expect(mockService.updateMonitoringConditions).toHaveBeenCalled()
    })
  })
})
