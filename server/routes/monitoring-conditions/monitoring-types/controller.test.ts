import { Response, Request, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringTypesController from './controller'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../store/inMemoryStore'
import constructModel from './viewModel'
import paths from '../../../constants/paths'

jest.mock('../monitoringConditionsStoreService')
jest.mock('./viewModel')

describe('prarr controller', () => {
  let mockDataStore: InMemoryStore
  let mockStore: jest.Mocked<MonitoringConditionsStoreService>
  let controller: MonitoringTypesController
  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()
    mockDataStore = new InMemoryStore()
    mockStore = new MonitoringConditionsStoreService(mockDataStore) as jest.Mocked<MonitoringConditionsStoreService>
    mockStore.getMonitoringConditions.mockResolvedValue({})
    controller = new MonitoringTypesController(mockStore)

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
        monitoringTypes: ['curfew', 'alcohol'],
      }
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', req.order!.id),
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
  })
})
