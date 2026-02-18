import { Response, Request, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import OffenceTypeController from './controller'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../store/inMemoryStore'
import constructModel from './viewModel'
import paths from '../../../constants/paths'

jest.mock('../monitoringConditionsStoreService')
jest.mock('./viewModel')

describe('offence type controller', () => {
  let mockDataStore: InMemoryStore
  let mockStore: jest.Mocked<MonitoringConditionsStoreService>
  let controller: OffenceTypeController
  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()
    mockDataStore = new InMemoryStore()
    mockStore = new MonitoringConditionsStoreService(mockDataStore) as jest.Mocked<MonitoringConditionsStoreService>
    mockStore.getMonitoringConditions.mockResolvedValue({})
    controller = new OffenceTypeController(mockStore)

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
        'pages/order/monitoring-conditions/order-type-description/offence-type',
        expect.anything(),
      )
    })

    it('render with the model', async () => {
      mockStore.getMonitoringConditions.mockResolvedValue({ prarr: 'YES' })
      mockConstructModel.mockReturnValueOnce({
        errorSummary: null,
        offenceType: { value: 'Burglary in a Dwelling - Indictable only' },
        items: [],
      })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        errorSummary: null,
        items: [],
        offenceType: { value: 'Burglary in a Dwelling - Indictable only' },
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
        offenceType: 'Burglary in a Dwelling - Indictable only',
      }
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.POLICE_AREA.replace(':orderId', req.order!.id),
      )
    })
    it('validates', async () => {
      req.body = {
        action: 'continue',
      }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'Select the type of offence the device wearer committed', field: 'offenceType' },
      ])
    })
    it('updates store', async () => {
      req.body = {
        action: 'continue',
        offenceType: 'Burglary in a Dwelling - Indictable only',
      }
      await controller.update(req, res, next)

      expect(mockStore.updateField).toHaveBeenCalledWith(
        req.order!,
        'offenceType',
        'Burglary in a Dwelling - Indictable only',
      )
    })
  })
})
