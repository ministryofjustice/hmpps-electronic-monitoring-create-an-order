import { Response, Request, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../../test/mocks/mockExpress'
import PoliceAreaController from './controller'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../store/inMemoryStore'
import constructModel from './viewModel'
import paths from '../../../../constants/paths'

jest.mock('../monitoringConditionsStoreService')
jest.mock('./viewModel')

describe('police area controller', () => {
  let mockDataStore: InMemoryStore
  let mockStore: jest.Mocked<MonitoringConditionsStoreService>
  let controller: PoliceAreaController
  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()
    mockDataStore = new InMemoryStore()
    mockStore = new MonitoringConditionsStoreService(mockDataStore) as jest.Mocked<MonitoringConditionsStoreService>
    mockStore.getMonitoringConditions.mockResolvedValue({})
    controller = new PoliceAreaController(mockStore)

    mockConstructModel.mockReturnValue({ errorSummary: null, items: [] })

    req = createMockRequest()
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('renders the correct view', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/police-area',
        expect.anything(),
      )
    })

    it('render with the model', async () => {
      mockStore.getMonitoringConditions.mockResolvedValue({ prarr: 'YES' })
      mockConstructModel.mockReturnValueOnce({
        errorSummary: null,
        policeArea: { value: 'Metropolitan Police' },
        items: [],
      })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        errorSummary: null,
        items: [],
        policeArea: { value: 'Metropolitan Police' },
      })
    })

    it('gets errors from request', async () => {
      await controller.view(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors')
    })
  })

  describe('update', () => {
    it('redirects to the next page', async () => {
      req.body = {
        action: 'continue',
        policeArea: 'Metropolitan Police',
      }
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', req.order!.id),
      )
    })
    it('validates', async () => {
      req.body = {
        action: 'continue',
      }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: "Select the police force area the device wearer's release address is in", field: 'policeArea' },
      ])
    })
    it('updates store', async () => {
      req.body = {
        action: 'continue',
        policeArea: 'Metropolitan Police',
      }
      await controller.update(req, res, next)

      expect(mockStore.updateField).toHaveBeenCalledWith(req.order!, 'policeArea', 'Metropolitan Police')
    })
  })
})
